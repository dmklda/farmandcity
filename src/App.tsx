import React, { useState } from 'react';
import { GameState, GamePhase, GridCell } from './types/gameState';
import { starterCards, baseDeck } from './data/cards';
import { Resources } from './types/resources';
import Hand from './components/Hand';
import Grid from './components/Grid';
import ResourceBar from './components/ResourceBar';
import GameControls from './components/GameControls';
import PlayerStatsBar from './components/PlayerStatsBar';
import { Card } from './types/card';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DeckArea from './components/DeckArea';
import GridBoard from './components/GridBoard';
import CardComponent from './components/CardComponent';

function createEmptyGrid(rows: number, cols: number): GridCell[][] {
  return Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => ({ card: null, x, y }))
  );
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const initialResources: Resources = { coins: 5, food: 3, materials: 2, population: 3 };
const DECK_LIMIT = 28;
const phaseOrder: GamePhase[] = ['draw', 'action', 'build', 'production', 'end'];

function canPlayCard(resources: Resources, cost: Resources) {
  return (
    (resources.coins ?? 0) >= (cost.coins ?? 0) &&
    (resources.food ?? 0) >= (cost.food ?? 0) &&
    (resources.materials ?? 0) >= (cost.materials ?? 0) &&
    (resources.population ?? 0) >= (cost.population ?? 0)
  );
}

function parseProduction(card: Card): Partial<Resources> {
  const effect = card.effect.description.toLowerCase();
  const matchFood = effect.match(/produz (\d+) comida/);
  const matchCoins = effect.match(/produz (\d+) moeda/);
  const matchMaterials = effect.match(/produz (\d+) material/);
  let prod: Partial<Resources> = {};
  if (matchFood) prod.food = parseInt(matchFood[1], 10);
  if (matchCoins) prod.coins = parseInt(matchCoins[1], 10);
  if (matchMaterials) prod.materials = parseInt(matchMaterials[1], 10);
  return prod;
}

function parseInstantEffect(card: Card): Partial<Resources> {
  const effect = card.effect.description.toLowerCase();
  const matchFood = effect.match(/ganhe (\d+) comida/);
  const matchCoins = effect.match(/ganhe (\d+) moeda/);
  const matchMaterials = effect.match(/ganhe (\d+) material/);
  let prod: Partial<Resources> = {};
  if (matchFood) prod.food = parseInt(matchFood[1], 10);
  if (matchCoins) prod.coins = parseInt(matchCoins[1], 10);
  if (matchMaterials) prod.materials = parseInt(matchMaterials[1], 10);
  return prod;
}

function parseDiceProduction(card: Card): { prod: Partial<Resources>; dice: number } | null {
  const effect = card.effect.description.toLowerCase();
  const match = effect.match(/produz (\d+) (comida|moeda|material)[^\d]*dado (\d)/);
  if (match) {
    const value = parseInt(match[1], 10);
    const type = match[2];
    const dice = parseInt(match[3], 10);
    let prod: Partial<Resources> = {};
    if (type === 'comida') prod.food = value;
    if (type === 'moeda') prod.coins = value;
    if (type === 'material') prod.materials = value;
    return { prod, dice };
  }
  return null;
}

function getInitialState(deck: Card[]): GameState {
  return {
    resources: initialResources,
    hand: [...starterCards],
    deck,
    farmGrid: createEmptyGrid(6, 6),
    cityGrid: createEmptyGrid(4, 4),
    turn: 1,
    phase: 'draw' as GamePhase,
    activeEvents: [],
    comboEffects: [],
    playerStats: { reputation: 0, totalProduction: 0, buildings: 0, landmarks: 0 },
  };
}

const App: React.FC = () => {
  // Todos os hooks devem estar aqui dentro!
  const [customDeck, setCustomDeck] = useState<Card[]>([]);
  const [magicUsedThisTurn, setMagicUsedThisTurn] = useState(false);
  const [pendingDefense, setPendingDefense] = useState<Card | null>(null);

  // Deck inicial
  const getActiveDeck = () => {
    if (customDeck.length > 0) return customDeck.slice(0, DECK_LIMIT);
    return shuffle(baseDeck).slice(0, DECK_LIMIT);
  };

  const [game, setGame] = useState<GameState>(() => getInitialState(getActiveDeck()));
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedGrid, setSelectedGrid] = useState<'farm' | 'city' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [productionSummary, setProductionSummary] = useState<string | null>(null);
  const [actionSummary, setActionSummary] = useState<string | null>(null);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [diceUsed, setDiceUsed] = useState<boolean>(false);
  const [diceProductionSummary, setDiceProductionSummary] = useState<string | null>(null);
  const [victory, setVictory] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [discardMode, setDiscardMode] = useState(false);
  const [defeat, setDefeat] = useState<string | null>(null);
  const [builtThisTurn, setBuiltThisTurn] = useState<{ farm: boolean; city: boolean }>({ farm: false, city: false });
  const [actionThisTurn, setActionThisTurn] = useState(false);
  const [discardedCards, setDiscardedCards] = useState<Card[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [builtCountThisTurn, setBuiltCountThisTurn] = useState(0);
  const [discardedThisTurn, setDiscardedThisTurn] = useState(false);
  const [lastDrawn, setLastDrawn] = useState<string | undefined>(undefined);

  // Detectar compra de carta para animação
  React.useEffect(() => {
    if (game.phase === 'draw' && game.hand.length > 0 && game.deck.length >= 0) {
      setLastDrawn(game.hand[game.hand.length - 1]?.name);
      setTimeout(() => setLastDrawn(undefined), 900);
    }
  }, [game.hand.length, game.phase]);

  // Contadores de ocupação
  const farmCount = game.farmGrid.flat().filter(cell => cell.card).length;
  const cityCount = game.cityGrid.flat().filter(cell => cell.card).length;
  const farmMax = game.farmGrid.length * (game.farmGrid[0]?.length || 0);
  const cityMax = game.cityGrid.length * (game.cityGrid[0]?.length || 0);
  const landmarkCount = game.playerStats.landmarks;
  const landmarkMax = 3;

  // Função para adicionar ao histórico
  function addHistory(msg: string) {
    setHistory((h) => [msg, ...h.slice(0, 19)]); // máximo 20 ações
  }

  // Função para tocar som (simples)
  function playSound(type: 'buy' | 'discard' | 'build' | 'combo' | 'penalty' | 'victory' | 'defeat') {
    // Simulação: pode ser trocado por assets reais
    // Exemplo: new window.Audio('/sounds/buy.mp3').play();
    // Aqui só loga para debug
    // console.log('SOM:', type);
  }

  // Checa condições de vitória
  React.useEffect(() => {
    if (victory) return;
    if (game.playerStats.landmarks >= 3) {
      setVictory('Vitória: 3 marcos históricos concluídos!');
    } else if (game.playerStats.totalProduction >= 1000) {
      setVictory('Vitória: Produção total de 1000 recursos!');
    } else if (game.playerStats.reputation >= 10) {
      setVictory('Vitória: Reputação máxima alcançada!');
    } else if (game.turn >= 20) {
      setVictory('Vitória: Sobreviveu a 20 turnos!');
    }
  }, [game, victory]);

  // Efeito: derrota se população chegar a 0
  React.useEffect(() => {
    if (game.playerStats.reputation < 0) {
      setGame((g) => ({ ...g, playerStats: { ...g.playerStats, reputation: 0 } }));
    }
    if (game.resources.population <= 0 && !defeat) {
      setDefeat('Derrota: Sua população chegou a 0!');
      addHistory('❌ Derrota: população chegou a 0!');
      playSound('defeat');
    }
  }, [game.resources.population, defeat, game.playerStats.reputation]);

  // Efeito: descarte obrigatório manual na fase 'end' (apenas 1 vez por turno)
  React.useEffect(() => {
    if (game.phase === 'end' && game.hand.length > 0 && !discardMode && !victory && !defeat && !discardedThisTurn) {
      setDiscardMode(true);
      setDiscardedThisTurn(true);
      addHistory('🗑️ Descarte obrigatório: escolha uma carta para descartar.');
    }
    if (game.phase !== 'end' && discardedThisTurn) {
      setDiscardedThisTurn(false);
    }
  }, [game.phase, game.hand.length, discardMode, victory, defeat, discardedThisTurn]);

  // Efeito: penalidade por falta de comida no fim do turno
  React.useEffect(() => {
    if (game.phase === 'end' && game.resources.food < 0 && !defeat) {
      setGame((g) => ({
        ...g,
        resources: { ...g.resources, food: 0, population: Math.max(0, g.resources.population - 1) },
        playerStats: { ...g.playerStats, reputation: Math.max(0, g.playerStats.reputation - 1) },
      }));
      setHighlight('⚠️ Faltou comida! -1 população, -1 reputação');
      addHistory('⚠️ Faltou comida! -1 população, -1 reputação');
      playSound('penalty');
      setTimeout(() => setHighlight(null), 1500);
    }
  }, [game.phase, game.resources.food, defeat]);

  // Efeito: bônus de diversidade no fim do turno
  React.useEffect(() => {
    if (game.phase === 'end' && !victory && !defeat) {
      const types = new Set(game.hand.map((c) => c.type));
      if (types.size >= 5) {
        setGame((g) => ({
          ...g,
          playerStats: { ...g.playerStats, reputation: g.playerStats.reputation + 1 },
        }));
        setHighlight('🌈 Bônus de diversidade: +1 reputação');
        addHistory('🌈 Bônus de diversidade: +1 reputação');
        playSound('combo');
        setTimeout(() => setHighlight(null), 1500);
      }
    }
  }, [game.phase, victory, defeat, game.hand]);

  // Efeito: derrota se população chegar a 0 (banner)
  React.useEffect(() => {
    if (defeat) {
      setTimeout(() => setDefeat(null), 6000);
    }
  }, [defeat]);

  // Efeito: descartar automaticamente 1 carta aleatória ao avançar de fase se a mão tiver mais de 6 cartas
  React.useEffect(() => {
    if (game.hand.length > 6) {
      const idx = Math.floor(Math.random() * game.hand.length);
      const discarded = game.hand[idx];
      setGame((g) => ({
        ...g,
        hand: g.hand.filter((_, i) => i !== idx),
      }));
      setHighlight(`🗑️ Carta descartada: ${discarded.name}`);
      addHistory(`🗑️ Carta descartada automaticamente: ${discarded.name}`);
      playSound('discard');
      setTimeout(() => setHighlight(null), 1500);
    }
    // eslint-disable-next-line
  }, [game.phase]);

  // Efeito: compra automática de carta no início da fase 'draw', penalidade se deck vazio
  React.useEffect(() => {
    if (game.phase === 'draw') {
      setBuiltThisTurn({ farm: false, city: false });
      setActionThisTurn(false);
      if (game.hand.length < 6) {
        if (game.deck.length > 0) {
          setGame((g) => ({
            ...g,
            hand: [...g.hand, g.deck[0]],
            deck: g.deck.slice(1),
          }));
          setHighlight('🃏 Carta comprada!');
          addHistory(`🃏 Comprou carta: ${game.deck[0]?.name || '???'}`);
          playSound('buy');
          setTimeout(() => setHighlight(null), 900);
        } else {
          // Penalidade deck vazio
          setGame((g) => ({
            ...g,
            playerStats: { ...g.playerStats, reputation: Math.max(0, g.playerStats.reputation - 1) },
          }));
          setHighlight('⚠️ Deck vazio! -1 reputação');
          addHistory('⚠️ Deck vazio! -1 reputação');
          playSound('penalty');
          setTimeout(() => setHighlight(null), 1500);
        }
      }
    }
    // eslint-disable-next-line
  }, [game.phase]);

  // NOVO: Handler de ativação de magia
  function handleActivateMagic(card: Card) {
    if (magicUsedThisTurn) {
      setError('Só pode usar 1 carta de magia por turno.');
      return;
    }
    const cost: Resources = {
      coins: card.cost.coins ?? 0,
      food: card.cost.food ?? 0,
      materials: card.cost.materials ?? 0,
      population: card.cost.population ?? 0,
    };
    if (!canPlayCard(game.resources, cost)) {
      setError('Recursos insuficientes para usar esta carta de magia.');
      return;
    }
    // Efeito: aplicar efeito de magia (simples: dobra produção, +1 comida, etc)
    // Aqui pode-se expandir para lógica específica por carta
    setGame((g) => ({
      ...g,
      hand: g.hand.filter((c) => c.id !== card.id),
      resources: {
        coins: g.resources.coins - (card.cost.coins ?? 0),
        food: g.resources.food - (card.cost.food ?? 0),
        materials: g.resources.materials - (card.cost.materials ?? 0),
        population: g.resources.population - (card.cost.population ?? 0),
      },
      comboEffects: [...g.comboEffects, { description: card.effect.description }],
    }));
    setActionSummary(`Magia ativada: ${card.name} (${card.effect.description})`);
    addHistory(`✨ Usou magia: ${card.name}`);
    playSound('build');
    setMagicUsedThisTurn(true);
    setSelectedCard(null);
    setSelectedGrid(null);
    setError(null);
    setTimeout(() => setActionSummary(null), 1800);
  }

  // NOVO: Handler de ativação de defesa (reação a evento)
  function handleActivateDefense(card: Card) {
    const cost: Resources = {
      coins: card.cost.coins ?? 0,
      food: card.cost.food ?? 0,
      materials: card.cost.materials ?? 0,
      population: card.cost.population ?? 0,
    };
    if (!canPlayCard(game.resources, cost)) {
      setError('Recursos insuficientes para usar esta carta de defesa.');
      return;
    }
    setGame((g) => ({
      ...g,
      hand: g.hand.filter((c) => c.id !== card.id),
      resources: {
        coins: g.resources.coins - (card.cost.coins ?? 0),
        food: g.resources.food - (card.cost.food ?? 0),
        materials: g.resources.materials - (card.cost.materials ?? 0),
        population: g.resources.population - (card.cost.population ?? 0),
      },
      comboEffects: [...g.comboEffects, { description: card.effect.description }],
    }));
    setActionSummary(`Defesa ativada: ${card.name} (${card.effect.description})`);
    addHistory(`🛡️ Usou defesa: ${card.name}`);
    playSound('build');
    setPendingDefense(null);
    setSelectedCard(null);
    setSelectedGrid(null);
    setError(null);
    setTimeout(() => setActionSummary(null), 1800);
  }

  // NOVO: Detectar evento/crise e sugerir defesa
  React.useEffect(() => {
    if (game.activeEvents.some(e => e.type === 'crisis')) {
      // Se o jogador tem carta de defesa na mão, sugerir ativação
      const defenseCard = game.hand.find(c => c.type === 'defense');
      if (defenseCard) setPendingDefense(defenseCard);
    } else {
      setPendingDefense(null);
    }
  }, [game.activeEvents, game.hand]);

  const restartGame = () => {
    setGame(getInitialState(getActiveDeck()));
    setSelectedCard(null);
    setSelectedGrid(null);
    setError(null);
    setProductionSummary(null);
    setActionSummary(null);
    setDiceResult(null);
    setDiceUsed(false);
    setDiceProductionSummary(null);
    setVictory(null);
    setDiscardMode(false);
    setDefeat(null);
    setBuiltThisTurn({ farm: false, city: false });
    setActionThisTurn(false);
    setDiscardedCards([]);
    setHistory([]);
    setBuiltCountThisTurn(0);
    setDiscardedThisTurn(false);
  };

  // Corrigir nextPhase para bloquear avanço se discardMode ativo
  const nextPhase = () => {
    if (discardMode) return; // Bloqueia avanço de fase se descarte obrigatório
    setSelectedCard(null);
    setSelectedGrid(null);
    setError(null);
    setActionSummary(null);
    setDiceResult(null);
    setDiceUsed(false);
    setDiceProductionSummary(null);
    const idx = phaseOrder.indexOf(game.phase);
    if (game.phase === 'end') {
      // Avança para novo turno e volta para 'draw'
      setGame((g) => ({ ...g, turn: g.turn + 1, phase: 'draw' }));
    } else if (game.phase === 'build') {
      handleProduction();
    } else if (idx < phaseOrder.length - 1) {
      setGame((g) => ({ ...g, phase: phaseOrder[idx + 1] }));
    }
  };

  const handleDiceRoll = () => {
    if (game.phase !== 'action' || diceUsed) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceResult(roll);
    setDiceUsed(true);
    // Produção baseada no dado
    let prod: Resources = { coins: 0, food: 0, materials: 0, population: 0 };
    let details: string[] = [];
    const allCards = [
      ...game.farmGrid.flat().map((cell) => cell.card).filter(Boolean),
      ...game.cityGrid.flat().map((cell) => cell.card).filter(Boolean),
    ] as Card[];
    allCards.forEach((card) => {
      const diceProd = parseDiceProduction(card);
      if (diceProd && diceProd.dice === roll) {
        Object.entries(diceProd.prod).forEach(([key, value]) => {
          prod[key as keyof Resources] += value || 0;
          if (value && value > 0) details.push(`${card.name}: +${value} ${key}`);
        });
      }
    });
    if (prod.coins || prod.food || prod.materials) {
      setDiceProductionSummary(
        `Dado: ${roll} | Produção: ${details.join(', ')}.`
      );
    } else {
      setDiceProductionSummary(`Dado: ${roll} | Nenhuma produção ativada.`);
    }
    setGame((g) => ({
      ...g,
      resources: {
        coins: g.resources.coins + prod.coins,
        food: g.resources.food + prod.food,
        materials: g.resources.materials + prod.materials,
        population: g.resources.population,
      },
      playerStats: {
        ...g.playerStats,
        totalProduction: g.playerStats.totalProduction + prod.coins + prod.food + prod.materials,
      },
    }));
  };

  const handleProduction = () => {
    let prod: Resources = { coins: 0, food: 0, materials: 0, population: 0 };
    let details: string[] = [];
    const allCards = [
      ...game.farmGrid.flat().map((cell) => cell.card).filter(Boolean),
      ...game.cityGrid.flat().map((cell) => cell.card).filter(Boolean),
    ] as Card[];
    allCards.forEach((card) => {
      // Só produz se não for produção baseada em dado
      if (!parseDiceProduction(card)) {
        const p = parseProduction(card);
        Object.entries(p).forEach(([key, value]) => {
          prod[key as keyof Resources] += value || 0;
          if (value && value > 0) details.push(`${card.name}: +${value} ${key}`);
        });
      }
    });
    // Atualiza produção total
    setGame((g) => ({
      ...g,
      resources: {
        coins: g.resources.coins + prod.coins,
        food: g.resources.food + prod.food,
        materials: g.resources.materials + prod.materials,
        population: g.resources.population,
      },
      playerStats: {
        ...g.playerStats,
        totalProduction: g.playerStats.totalProduction + prod.coins + prod.food + prod.materials,
      },
      phase: 'production',
    }));
    if (prod.coins || prod.food || prod.materials) {
      setProductionSummary(
        `Produção: ${details.join(', ')}.`
      );
    } else {
      setProductionSummary('Nenhuma produção neste turno.');
    }
    setTimeout(() => {
      setGame((g) => ({ ...g, phase: 'end' }));
      setProductionSummary(null);
    }, 1800);
  };

  const drawCard = () => {
    if (game.deck.length > 0 && game.hand.length < 6) {
      setGame((g) => ({
        ...g,
        hand: [...g.hand, g.deck[0]],
        deck: g.deck.slice(1),
      }));
    }
  };

  const endTurn = () => {
    setSelectedCard(null);
    setSelectedGrid(null);
    setError(null);
    setProductionSummary(null);
    setActionSummary(null);
    setDiceResult(null);
    setDiceUsed(false);
    setDiceProductionSummary(null);
    setGame((g) => ({
      ...g,
      turn: g.turn + 1,
      phase: 'draw',
    }));
  };

  // Handler de descarte manual
  const handleManualDiscard = (card: Card) => {
    setGame((g) => ({ ...g, hand: g.hand.filter((c) => c.id !== card.id) }));
    setDiscardedCards((prev) => [...prev, card]);
    setHighlight(`🗑️ Carta descartada: ${card.name}`);
    addHistory(`🗑️ Carta descartada: ${card.name}`);
    playSound('discard');
    setTimeout(() => setHighlight(null), 1200);
    setDiscardMode(false); // Sai do modo de descarte após 1 carta
    setDiscardedThisTurn(true); // Marca que já descartou neste turno
    // Avançar automaticamente para a próxima fase
    setTimeout(() => {
      nextPhase();
    }, 300); // pequeno delay para UX
  };

  // Handler de construção: até 2 construções por turno, qualquer grid
  const handleSelectCell = (gridType: 'farm' | 'city', x: number, y: number) => {
    if (!selectedCard) return;
    if (selectedGrid !== gridType) {
      setError('Tipo de carta não corresponde ao grid.');
      return;
    }
    if (game.phase !== 'build') {
      setError('Só é possível construir na fase de Construção.');
      return;
    }
    if (builtCountThisTurn >= 2) {
      setError('Só pode construir até 2 cartas por turno.');
      return;
    }
    const grid = gridType === 'farm' ? game.farmGrid : game.cityGrid;
    if (grid[y][x].card) {
      setError('Espaço já ocupado.');
      return;
    }
    if (!canPlayCard(game.resources, {
      coins: selectedCard.cost.coins ?? 0,
      food: selectedCard.cost.food ?? 0,
      materials: selectedCard.cost.materials ?? 0,
      population: selectedCard.cost.population ?? 0,
    })) {
      setError('Recursos insuficientes para jogar esta carta.');
      return;
    }
    setGame((g) => {
      const newGrid = grid.map((row, iy) =>
        row.map((cell, ix) =>
          ix === x && iy === y ? { ...cell, card: selectedCard } : cell
        )
      );
      const newHand = g.hand.filter((c) => c.id !== selectedCard.id);
      const newResources: Resources = {
        coins: g.resources.coins - (selectedCard.cost.coins ?? 0),
        food: g.resources.food - (selectedCard.cost.food ?? 0),
        materials: g.resources.materials - (selectedCard.cost.materials ?? 0),
        population: g.resources.population - (selectedCard.cost.population ?? 0),
      };
      const isLandmark = selectedCard.type === 'landmark';
      // Combo simples: 3 cartas do mesmo tipo em sequência
      let comboMsg = null;
      const allCards = [
        ...((gridType === 'farm' ? newGrid : g.farmGrid).flat().map((cell) => cell.card).filter(Boolean)),
        ...((gridType === 'city' ? newGrid : g.cityGrid).flat().map((cell) => cell.card).filter(Boolean)),
      ] as Card[];
      const typeCounts: Record<string, number> = {};
      allCards.forEach((c) => {
        typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
      });
      const comboType = Object.entries(typeCounts).find(([type, count]) => count >= 3 && type !== 'action');
      if (comboType) {
        comboMsg = `Combo: 3 cartas do tipo "${comboType[0]}"! +2 reputação`;
      }
      // Feedback visual
      if (isLandmark) {
        setHighlight('🏛️ Marco histórico construído!');
        addHistory(`🏛️ Marco histórico construído: ${selectedCard.name}`);
        playSound('build');
        setTimeout(() => setHighlight(null), 1500);
      } else if (comboMsg) {
        setHighlight(`✨ ${comboMsg}`);
        addHistory(`✨ ${comboMsg}`);
        playSound('combo');
        setTimeout(() => setHighlight(null), 1500);
      } else {
        addHistory(`🏗️ Construiu: ${selectedCard.name}`);
        playSound('build');
      }
      return {
        ...g,
        hand: newHand,
        resources: newResources,
        farmGrid: gridType === 'farm' ? newGrid : g.farmGrid,
        cityGrid: gridType === 'city' ? newGrid : g.cityGrid,
        playerStats: {
          ...g.playerStats,
          buildings: g.playerStats.buildings + 1,
          reputation: g.playerStats.reputation + (isLandmark ? 5 : 1) + (comboMsg ? 2 : 0),
          landmarks: g.playerStats.landmarks + (isLandmark ? 1 : 0),
        },
      };
    });
    setSelectedCard(null);
    setSelectedGrid(null);
    setError(null);
    setBuiltCountThisTurn((prev) => prev + 1);
  };

  // Handler de ação: só pode usar 1 carta de ação por turno
  const handleSelectCard = (card: Card) => {
    if (card.type === 'action' && game.phase === 'action') {
      if (actionThisTurn) {
        setError('Só pode usar 1 carta de ação por turno.');
        return;
      }
      const cost: Resources = {
        coins: card.cost.coins ?? 0,
        food: card.cost.food ?? 0,
        materials: card.cost.materials ?? 0,
        population: card.cost.population ?? 0,
      };
      if (!canPlayCard(game.resources, cost)) {
        setError('Recursos insuficientes para usar esta carta de ação.');
        return;
      }
      const effect = parseInstantEffect(card);
      let details: string[] = [];
      Object.entries(effect).forEach(([key, value]) => {
        if (value && value > 0) details.push(`+${value} ${key}`);
      });
      setGame((g) => {
        const newHand = g.hand.filter((c) => c.id !== card.id);
        const newResources: Resources = {
          coins: g.resources.coins - (card.cost.coins ?? 0) + (effect.coins ?? 0),
          food: g.resources.food - (card.cost.food ?? 0) + (effect.food ?? 0),
          materials: g.resources.materials - (card.cost.materials ?? 0) + (effect.materials ?? 0),
          population: g.resources.population - (card.cost.population ?? 0) + (effect.population ?? 0),
        };
        return {
          ...g,
          hand: newHand,
          resources: newResources,
        };
      });
      setActionSummary(`Ação: ${card.name} (${details.join(', ') || 'efeito aplicado'})`);
      addHistory(`⚡ Usou ação: ${card.name}`);
      playSound('build');
      setSelectedCard(null);
      setSelectedGrid(null);
      setError(null);
      setTimeout(() => setActionSummary(null), 1800);
      setActionThisTurn(true);
      return;
    } else if (card.type === 'magic' && game.phase === 'action') {
      handleActivateMagic(card);
      return;
    } else if (card.type === 'defense' && game.activeEvents.some(e => e.type === 'crisis')) {
      handleActivateDefense(card);
      return;
    }
    setSelectedCard(card);
    setSelectedGrid(card.type === 'farm' ? 'farm' : card.type === 'city' ? 'city' : null);
    setError(null);
  };

  // Função para saber se uma carta pode ser jogada
  function canPlayCardUI(card: Card) {
    if (card.type === 'action') {
      if (game.phase !== 'action') return { playable: false, reason: 'Só pode usar cartas de ação na fase de ação' };
      if (actionThisTurn) return { playable: false, reason: 'Só pode usar 1 carta de ação por turno.' };
      const cost: Resources = {
        coins: card.cost.coins ?? 0,
        food: card.cost.food ?? 0,
        materials: card.cost.materials ?? 0,
        population: card.cost.population ?? 0,
      };
      if (!canPlayCard(game.resources, cost)) return { playable: false, reason: 'Recursos insuficientes' };
      return { playable: true };
    }
    if (['farm', 'city', 'landmark'].includes(card.type)) {
      if (game.phase !== 'build') return { playable: false, reason: 'Só pode construir na fase de construção' };
      if (builtCountThisTurn >= 2) return { playable: false, reason: 'Só pode construir até 2 cartas por turno.' };
      const cost: Resources = {
        coins: card.cost.coins ?? 0,
        food: card.cost.food ?? 0,
        materials: card.cost.materials ?? 0,
        population: card.cost.population ?? 0,
      };
      if (!canPlayCard(game.resources, cost)) return { playable: false, reason: 'Recursos insuficientes' };
      return { playable: true };
    }
    return { playable: false, reason: 'Tipo de carta não jogável' };
  }

  // Limitar deck customizado a 28 cartas
  function addToCustomDeck(card: Card) {
    if (customDeck.length >= DECK_LIMIT) {
      setError('O deck customizado só pode ter 28 cartas.');
      return;
    }
    setCustomDeck((d) => [...d, card]);
  }
  function removeFromCustomDeck(cardId: string) {
    setCustomDeck((d) => d.filter((c) => c.id !== cardId));
  }

  // Reset magicUsedThisTurn a cada novo turno
  React.useEffect(() => {
    if (game.phase === 'draw') {
      setMagicUsedThisTurn(false);
    }
  }, [game.phase]);

  // Dados para Sidebar e TopBar
  const sidebarResources = {
    coins: game.resources.coins,
    food: game.resources.food,
    materials: game.resources.materials,
    population: game.resources.population,
    coinsPerTurn: 0, // TODO: calcular produção por turno
    foodPerTurn: 0,
    materialsPerTurn: 0,
    populationStatus: game.resources.population > 0 ? 'Estável' : 'Crítico',
  };
  const sidebarProgress = {
    reputation: game.playerStats.reputation,
    reputationMax: 10,
    production: game.playerStats.totalProduction,
    productionMax: 1000,
    landmarks: game.playerStats.landmarks,
    landmarksMax: 3,
    turn: game.turn,
    turnMax: 20,
  };
  const sidebarVictory = {
    reputation: game.playerStats.reputation,
    production: game.playerStats.totalProduction,
    landmarks: game.playerStats.landmarks,
    turn: game.turn,
  };

  // Layout principal
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#181c27' }}>
      <Sidebar
        resources={sidebarResources}
        progress={sidebarProgress}
        victory={sidebarVictory}
        history={history}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopBar
          turn={game.turn}
          turnMax={20}
          buildCount={builtCountThisTurn}
          buildMax={2}
          phase={game.phase}
          onNextPhase={victory || discardMode ? () => {} : nextPhase}
          discardMode={discardMode}
        />
        {/* Área central para grids e deck */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '32px 0 80px 0', gap: 24 }}>
          <GridBoard
            farmGrid={game.farmGrid}
            cityGrid={game.cityGrid}
            farmCount={farmCount}
            farmMax={farmMax}
            cityCount={cityCount}
            cityMax={cityMax}
            landmarkCount={landmarkCount}
            landmarkMax={landmarkMax}
            onSelectFarm={victory ? () => {} : (x, y) => handleSelectCell('farm', x, y)}
            onSelectCity={victory ? () => {} : (x, y) => handleSelectCell('city', x, y)}
            highlightFarm={selectedGrid === 'farm'}
            highlightCity={selectedGrid === 'city'}
          />
          <DeckArea deckCount={game.deck.length} lastDrawn={lastDrawn} />
        </div>
        {/* Hand na parte inferior */}
        <div style={{ position: 'fixed', left: 270, right: 0, bottom: 0, background: '#181c27', padding: '18px 0', zIndex: 20, borderTop: '2px solid #23283a', display: 'flex', justifyContent: 'center' }}>
          <Hand
            hand={game.hand}
            onSelectCard={victory ? () => {} : handleSelectCard}
            selectedCardId={selectedCard?.id}
            canPlayCard={canPlayCardUI}
          />
        </div>
        {/* Modal de descarte manual */}
        {discardMode && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.75)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              background: '#23283a',
              borderRadius: 16,
              padding: 32,
              minWidth: 400,
              boxShadow: '0 4px 32px #000a',
              border: '2px solid #F59E0B',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: '#fff' }}>Descarte obrigatório</div>
              <div style={{ fontSize: 16, marginBottom: 16, color: '#fff' }}>Escolha uma carta para descartar:</div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                {game.hand.map((card) => (
                  <div
                    key={card.id}
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                    }}
                    onClick={() => handleManualDiscard(card)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <CardComponent
                      card={card}
                      size="medium"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App; 