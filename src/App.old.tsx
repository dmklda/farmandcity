import React, { useState, useEffect } from 'react';
import { GameState, GamePhase, GridCell } from './types/gameState.js';
import { starterCards, baseDeck } from './backup/cards.js';
import { useGameState } from './hooks/useGameState';
import { Resources } from './types/resources.js';
import EnhancedHand from './components/EnhancedHand.js';
import Grid from './components/Grid.js';
import ResourceBar from './components/ResourceBar.js';
import GameControls from './components/GameControls.js';
import PlayerStatsBar from './components/PlayerStatsBar.js';
import { Card } from './types/card.js';
import FixedSidebar from './components/FixedSidebar.js';
import EnhancedTopBar from './components/EnhancedTopBar.js';
import AuthPage from './components/AuthPage.js';
import SavedGamesModal from './components/SavedGamesModal.js';
import PlayerStatsModal from './components/PlayerStatsModal.js';
import { supabase } from './integrations/supabase/client.js';
import { GameStorageService } from './services/GameStorageService.js';
import type { User, Session } from '@supabase/supabase-js';

import EnhancedGridBoard from './components/EnhancedGridBoard.js';
import CardComponent from './components/CardComponent.js';

import { DeckSelector } from './components/DeckSelector';
import { DeckBuilder } from './components/DeckBuilder';

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
    farmGrid: createEmptyGrid(3, 4), // 3x4 = 12 slots
    cityGrid: createEmptyGrid(2, 3), // 2x3 = 6 slots
    eventGrid: createEmptyGrid(2, 3),
    turn: 1,
    phase: 'draw' as GamePhase,
    activeEvents: [],
    comboEffects: [],
    playerStats: { reputation: 0, totalProduction: 0, buildings: 0, landmarks: 0 },
    magicUsedThisTurn: false,
    builtCountThisTurn: 0,
  };
}

// Função para calcular produção por turno detalhada
function getProductionPerTurnDetails(farmGrid: GridCell[][], cityGrid: GridCell[][]) {
  const prod: Resources = { coins: 0, food: 0, materials: 0, population: 0 };
  const details: { coins: string[], food: string[], materials: string[], population: string[] } = {
    coins: [], food: [], materials: [], population: []
  };
  const allCards = [
    ...farmGrid.flat().map((cell) => cell.card).filter(Boolean),
    ...cityGrid.flat().map((cell) => cell.card).filter(Boolean),
  ] as Card[];
  allCards.forEach((card) => {
    // Só produção automática por turno
    const effect = card.effect.description.toLowerCase();
    if (/por turno/.test(effect) && !/dado/.test(effect)) {
      const p = parseProduction(card);
      Object.entries(p).forEach(([key, value]) => {
        if (value && value > 0) {
          prod[key as keyof Resources] += value;
          details[key as keyof Resources].push(`${card.name}: +${value}`);
        }
      });
    }
  });
  return { prod, details };
}

const App: React.FC = () => {
  // Estados de autenticação
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // NOVO: Usar useGameState que já integra com Supabase
  const gameStateProps = useGameState();

  // Todos os hooks devem estar aqui dentro!
  const [customDeck, setCustomDeck] = useState<Card[]>([]);
  const [magicUsedThisTurn, setMagicUsedThisTurn] = useState(false);
  const [pendingDefense, setPendingDefense] = useState<Card | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Setup de autenticação
  useEffect(() => {
    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Função para logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Função para sucesso de auth
  const handleAuthSuccess = () => {
    // Usuário será atualizado automaticamente pelo listener
  };

  // Função para carregar jogo
  const handleLoadGame = (gameState: GameState) => {
    setGame(gameState);
    setGameStartTime(new Date()); // Reset timer
    setError(null);
    setVictory(null);
    setDefeat(null);
    setDiscardMode(false);
    setBuiltCountThisTurn(0);
    setDiscardedThisTurn(false);
    setSelectedCard(null);
    setSelectedGrid(null);
  };

  // Função para finalizar jogo e salvar no histórico
  const handleGameEnd = async (result: 'victory' | 'defeat') => {
    if (!user) return;
    
    const gameDurationMinutes = Math.round((new Date().getTime() - gameStartTime.getTime()) / 60000);
    
    const saveResult = await GameStorageService.finishGame(game, gameDurationMinutes);
    
    if (!saveResult.success) {
      console.error('Erro ao salvar jogo finalizado:', saveResult.error);
    }
  };

  // Deck inicial - agora é gerenciado pelo useGameState
  const getActiveDeck = () => {
    if (customDeck.length > 0) return customDeck.slice(0, DECK_LIMIT);
    // Fallback para deck base se nenhum deck do Supabase estiver carregado
    return shuffle(baseDeck).slice(0, DECK_LIMIT);
  };

  const [game, setGame] = useState<GameState>(() => getInitialState(getActiveDeck()));
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedGrid, setSelectedGrid] = useState<'farm' | 'city' | 'event' | null>(null);
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
  const [showSavedGames, setShowSavedGames] = useState(false);
  const [showPlayerStats, setShowPlayerStats] = useState(false);
  const [showDeckBuilder, setShowDeckBuilder] = useState(false);
  const [editingDeckId, setEditingDeckId] = useState<string | undefined>();
  const [gameStartTime, setGameStartTime] = useState<Date>(new Date());

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
  const eventCount = game.eventGrid.flat().filter(cell => cell.card).length;
  const farmMax = 12; // 3x4 grid fixo
  const cityMax = 6; // 2x3 grid fixo
  const eventMax = game.eventGrid.length * (game.eventGrid[0]?.length || 0);
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
    // // console.log('SOM:', type);
  }

  // Checa condições de vitória
  React.useEffect(() => {
    if (victory) return;
    if (game.playerStats.landmarks >= 3) {
      setVictory('Vitória: 3 marcos históricos concluídos!');
      handleGameEnd('victory');
    } else if (game.playerStats.totalProduction >= 1000) {
      setVictory('Vitória: Produção total de 1000 recursos!');
      handleGameEnd('victory');
    } else if (game.playerStats.reputation >= 10) {
      setVictory('Vitória: Reputação máxima alcançada!');
      handleGameEnd('victory');
    } else if (game.turn >= 20) {
      setVictory('Vitória: Sobreviveu a 20 turnos!');
      handleGameEnd('victory');
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
      handleGameEnd('defeat');
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
      setBuiltCountThisTurn(0);
      setActionThisTurn(false);
      setMagicUsedThisTurn(false);
      setGame(g => ({ ...g, magicUsedThisTurn: false, builtCountThisTurn: 0 }));
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
    if (game.magicUsedThisTurn) {
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
      magicUsedThisTurn: true,
    }));
    setActionSummary(`Magia ativada: ${card.name} (${card.effect.description})`);
    addHistory(`✨ Usou magia: ${card.name}`);
    playSound('build');
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
    setGameStartTime(new Date()); // Reset timer
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
  const handleSelectCell = (gridType: 'farm' | 'city' | 'event', x: number, y: number) => {
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
    const grid = gridType === 'farm' ? game.farmGrid : gridType === 'city' ? game.cityGrid : game.eventGrid;
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
        eventGrid: gridType === 'event' ? newGrid : g.eventGrid,
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

  // Handler de seleção de carta: ações, magia, defesa ou construção
  const handleSelectCard = (card: Card) => {
    // Se já está selecionada, desmarcar
    if (selectedCard && selectedCard.id === card.id) {
      setSelectedCard(null);
      setSelectedGrid(null);
      setError(null);
      return;
    }
    const canPlay = canPlayCardUI(card);
    
    // Para cartas de efeito imediato (action, magic, defense)
    if (card.type === 'action' && game.phase === 'action' && canPlay.playable) {
      const cost: Resources = {
        coins: card.cost.coins ?? 0,
        food: card.cost.food ?? 0,
        materials: card.cost.materials ?? 0,
        population: card.cost.population ?? 0,
      };
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
    } else if (card.type === 'magic' && game.phase === 'action' && canPlay.playable) {
      handleActivateMagic(card);
      return;
    } else if (card.type === 'defense' && canPlay.playable) {
      handleActivateDefense(card);
      return;
    }
    
    // Para cartas que não podem ser jogadas, exibir erro
    if (!canPlay.playable) {
      setError(canPlay.reason || 'Esta carta não pode ser jogada agora.');
      return;
    }
    
    // Para cartas de construção (farm, city, landmark, event)
    setSelectedCard(card);
    if (['farm', 'city', 'landmark'].includes(card.type)) {
      setSelectedGrid(card.type === 'farm' ? 'farm' : 'city');
    } else if (card.type === 'event') {
      setSelectedGrid('event');
    } else {
      setSelectedGrid(null);
    }
    setError(null);
  };

  // Função para saber se uma carta pode ser jogada
  function canPlayCardUI(card: Card) {
    const cost: Resources = {
      coins: card.cost.coins ?? 0,
      food: card.cost.food ?? 0,
      materials: card.cost.materials ?? 0,
      population: card.cost.population ?? 0,
    };

    if (card.type === 'action') {
      if (game.phase !== 'action') return { playable: false, reason: 'Só pode usar cartas de ação na fase de ação' };
      if (actionThisTurn) return { playable: false, reason: 'Só pode usar 1 carta de ação por turno.' };
      if (!canPlayCard(game.resources, cost)) return { playable: false, reason: 'Recursos insuficientes' };
      return { playable: true };
    }
    
    if (card.type === 'magic') {
      if (game.phase !== 'action') return { playable: false, reason: 'Só pode usar cartas de magia na fase de ação' };
      if (game.magicUsedThisTurn) return { playable: false, reason: 'Só pode usar 1 carta de magia por turno.' };
      if (!canPlayCard(game.resources, cost)) return { playable: false, reason: 'Recursos insuficientes' };
      return { playable: true };
    }
    
    if (card.type === 'defense') {
      const hasCrisis = game.activeEvents.some(e => e.type === 'crisis');
      if (!hasCrisis) return { playable: false, reason: 'Só pode usar cartas de defesa durante crises' };
      if (!canPlayCard(game.resources, cost)) return { playable: false, reason: 'Recursos insuficientes' };
      return { playable: true };
    }
    
    if (card.type === 'trap') {
      return { playable: false, reason: 'Cartas trap só estarão disponíveis no modo multiplayer' };
    }
    
    if (['farm', 'city', 'landmark', 'event'].includes(card.type)) {
      if (game.phase !== 'build') return { playable: false, reason: 'Só pode construir na fase de construção' };
      if (builtCountThisTurn >= 2) return { playable: false, reason: 'Só pode construir até 2 cartas por turno.' };
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

  // Auto-save a cada 3 turnos (apenas para usuários autenticados)
  useEffect(() => {
    if (user && game.turn > 1 && game.turn % 3 === 0 && game.phase === 'draw') {
      GameStorageService.saveGame(game);
    }
  }, [user, game.turn, game.phase]);

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

  const { prod: prodPerTurn, details: prodDetails } = getProductionPerTurnDetails(game.farmGrid, game.cityGrid);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Auth page for non-authenticated users
  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // Layout principal para usuários autenticados
  return (
    <div className="h-screen bg-background w-full overflow-hidden" style={{ paddingLeft: '0px', paddingTop: '64px' }}>
      {/* User info and game controls */}
      <div className="absolute top-2 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setShowPlayerStats(true)}
          className="px-3 py-1 text-xs bg-accent hover:bg-accent/80 text-accent-foreground rounded transition-colors"
        >
          📊 Stats
        </button>
        <button
          onClick={() => setShowSavedGames(true)}
          className="px-3 py-1 text-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors"
        >
          💾 Jogos
        </button>
        <button
          onClick={() => setShowDeckBuilder(true)}
          className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded transition-colors"
        >
          🃏 Decks
        </button>
        <span className="text-sm text-muted-foreground">
          {user.email}
        </span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded transition-colors"
        >
          Sair
        </button>
      </div>
      {/* Fixed Sidebar */}
      <FixedSidebar
        resources={sidebarResources}
        progress={sidebarProgress}
        victory={sidebarVictory}
        history={history}
        isVisible={sidebarVisible}
        setIsVisible={setSidebarVisible}
      />

      {/* Deck Selector - Position it in the sidebar area */}
      {sidebarVisible && (
        <div className="fixed top-80 left-4 w-72 z-40">
          <DeckSelector />
        </div>
      )}
      
      {/* Fixed TopBar */}
      <EnhancedTopBar
        turn={game.turn}
        turnMax={20}
        buildCount={builtCountThisTurn}
        buildMax={2}
        phase={game.phase}
        onNextPhase={victory || discardMode ? () => {} : nextPhase}
        discardMode={discardMode}
        resources={game.resources}
        productionPerTurn={prodPerTurn}
        productionDetails={prodDetails}
        onToggleSidebar={() => setSidebarVisible((v) => !v)}
      />
      
      {/* Main Content Area - Scrollable */}
      <div
        className="h-full overflow-y-auto overflow-x-hidden p-3"
        style={{
          paddingLeft: sidebarVisible ? '300px' : '24px',
          transition: 'padding-left 0.3s',
        }}
      >
        <EnhancedGridBoard
          farmGrid={game.farmGrid}
          cityGrid={game.cityGrid}
          eventGrid={game.eventGrid}
          farmCount={farmCount}
          farmMax={farmMax}
          cityCount={cityCount}
          cityMax={cityMax}
          eventCount={eventCount}
          eventMax={eventMax}
          landmarkCount={landmarkCount}
          landmarkMax={landmarkMax}
          onSelectFarm={victory ? () => {} : (x, y) => handleSelectCell('farm', x, y)}
          onSelectCity={victory ? () => {} : (x, y) => handleSelectCell('city', x, y)}
          onSelectEvent={victory ? () => {} : (x, y) => handleSelectCell('event', x, y)}
          highlightFarm={selectedGrid === 'farm'}
          highlightCity={selectedGrid === 'city'}
          highlightEvent={selectedGrid === 'event'}
        />
      </div>
      
      {/* Fixed Hand at Bottom */}
      <EnhancedHand
        hand={game.hand}
        onSelectCard={victory ? () => {} : handleSelectCard}
        selectedCardId={selectedCard?.id}
        canPlayCard={canPlayCardUI}
        sidebarVisible={sidebarVisible}
        deckSize={game.deck.length}
      />
      
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

      {/* Modal de jogos salvos */}
      <SavedGamesModal
        isOpen={showSavedGames}
        onClose={() => setShowSavedGames(false)}
        onLoadGame={handleLoadGame}
        currentGameState={game}
      />

      {/* Modal de estatísticas do jogador */}
      <PlayerStatsModal
        isOpen={showPlayerStats}
        onClose={() => setShowPlayerStats(false)}
      />

      {/* Deck Builder Modal */}
      {showDeckBuilder && (
        <DeckBuilder 
          deckId={editingDeckId}
          onClose={() => {
            setShowDeckBuilder(false);
            setEditingDeckId(undefined);
          }}
        />
      )}


    </div>
  );
};

export default App; 
