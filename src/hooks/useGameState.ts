import { useState, useCallback } from 'react';
import { GameState, Card, Resources, GridCell, GameEvent, PlayerStats, ComboEffect } from '../types/game';
import { allCards, eventCards } from '../data/cards';

const initialResources: Resources = {
  coins: 3,
  food: 2,
  materials: 1,
  population: 0
};

const initialPlayerStats: PlayerStats = {
  reputation: 0,
  totalProduction: 0,
  buildingsBuilt: 0,
  landmarksCompleted: 0,
  crisisSurvived: 0,
  achievements: []
};

const createEmptyGrid = (rows: number, cols: number): GridCell[][] => {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      id: `${row}-${col}`,
      type: 'empty',
      row,
      col
    }))
  );
};

const getRandomCards = (count: number, rarity?: string, turn?: number): Card[] => {
  let filteredCards = rarity 
    ? allCards.filter(card => card.rarity === rarity)
    : allCards.filter(card => card.rarity !== 'crisis' && card.rarity !== 'booster');
  
  // Nos primeiros turnos (1-3), priorizar cartas starter e common
  if (turn && turn <= 3) {
    filteredCards = filteredCards.filter(card => 
      card.rarity === 'starter' || card.rarity === 'common'
    );
  }
  
  // Se não há cartas suficientes, incluir uncommon
  if (filteredCards.length < count && turn && turn <= 3) {
    filteredCards = allCards.filter(card => 
      card.rarity !== 'crisis' && card.rarity !== 'booster' && 
      (card.rarity === 'starter' || card.rarity === 'common' || card.rarity === 'uncommon')
    );
  }
  
  const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const getRandomEvent = (): GameEvent | null => {
  // 20% chance de evento a cada turno
  if (Math.random() > 0.2) return null;
  
  const eventCard = eventCards[Math.floor(Math.random() * eventCards.length)];
  return {
    id: eventCard.id,
    type: 'crisis',
    name: eventCard.name,
    description: eventCard.effect.description,
    effect: eventCard.effect,
    duration: eventCard.effect.duration || 1,
    active: true
  };
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    resources: initialResources,
    hand: getRandomCards(5, undefined, 1),
    deck: getRandomCards(20),
    farmGrid: createEmptyGrid(4, 4),
    cityGrid: createEmptyGrid(4, 4),
    landmarks: allCards.filter(card => card.type === 'landmark'),
    completedLandmarks: [],
    turn: 1,
    phase: 'draw',
    selectedCard: undefined,
    selectedCell: undefined,
    activeEvents: [],
    playerStats: initialPlayerStats,
    comboEffects: [],
    crisisProtection: false,
    weatherPrediction: false,
    enhancedTrading: false,
    extraCardsPerTurn: 1,
    advancedCardAccess: false,
    lastDiceRoll: undefined,
    activatedCards: [],
    cardsToDiscard: 0,
    cardsToBuyExtra: 0
  });

  const [previousResources] = useState<Resources>(initialResources);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);

  const updatePlayerStats = useCallback((updates: Partial<PlayerStats>) => {
    setGameState(prev => ({
      ...prev,
      playerStats: { ...prev.playerStats, ...updates }
    }));
  }, []);

  const addAchievement = useCallback((achievement: string) => {
    if (!achievements.includes(achievement)) {
      setAchievements(prev => [...prev, achievement]);
      updatePlayerStats({ achievements: [...achievements, achievement] });
    }
  }, [achievements, updatePlayerStats]);

  const calculateComboEffects = useCallback((grid: GridCell[][], type: 'farm' | 'city') => {
    const combos: ComboEffect[] = [];
    
    // Verificar combos de cartas adjacentes
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const cell = grid[row][col];
        if (!cell.card) continue;

        // Combo: Vinhedos em cadeia
        if (cell.card.id === 'vineyard') {
          const adjacentVineyards = [
            grid[row - 1]?.[col], grid[row + 1]?.[col],
            grid[row]?.[col - 1], grid[row]?.[col + 1]
          ].filter(adj => adj?.card?.id === 'vineyard').length;
          
          if (adjacentVineyards > 0) {
            combos.push({
              type: 'vineyard_chain',
              description: `Vinhedo em cadeia: +${adjacentVineyards} moedas`,
              multiplier: adjacentVineyards,
              conditions: ['vineyard_adjacent']
            });
          }
        }

        // Combo: Celeiro dobrando produção adjacente
        if (cell.card.id === 'barn') {
          const adjacentFarms = [
            grid[row - 1]?.[col], grid[row + 1]?.[col],
            grid[row]?.[col - 1], grid[row]?.[col + 1]
          ].filter(adj => adj?.card?.type === 'farm').length;
          
          if (adjacentFarms > 0) {
            combos.push({
              type: 'double_food_adjacent',
              description: `Celeiro dobrando ${adjacentFarms} fazendas adjacentes`,
              multiplier: 2,
              conditions: ['barn_adjacent_farms']
            });
          }
        }

        // Combo: Shopping Center boostando mercados
        if (cell.card.id === 'shopping-mall') {
          const adjacentMarkets = [
            grid[row - 1]?.[col], grid[row + 1]?.[col],
            grid[row]?.[col - 1], grid[row]?.[col + 1]
          ].filter(adj => adj?.card?.id === 'market').length;
          
          if (adjacentMarkets > 0) {
            combos.push({
              type: 'boost_markets',
              description: `Shopping dobrando ${adjacentMarkets} mercados adjacentes`,
              multiplier: 2,
              conditions: ['shopping_mall_adjacent_markets']
            });
          }
        }
      }
    }

    return combos;
  }, []);

  const applyCrisisEffects = useCallback((event: GameEvent) => {
    setGameState(prev => {
      let newResources = { ...prev.resources };
      let newStats = { ...prev.playerStats };

      switch (event.effect.crisisEffect) {
        case 'reduce_farm_production':
          // Reduz produção de fazendas em 50%
          break;
        case 'storm_effect':
          // Reduz produção da cidade em 30%, aumenta fazendas
          newResources.food += 1;
          break;
        case 'lose_population':
          newResources.population = Math.max(0, newResources.population - 2);
          newResources.coins += 5;
          break;
        case 'boost_city_production':
          // Dobra produção da cidade
          break;
        case 'boost_farm_production':
          // Dobra produção das fazendas
          break;
      }

      return {
        ...prev,
        resources: newResources,
        playerStats: newStats
      };
    });
  }, []);

  const rollDice = useCallback(() => {
    const diceResult = Math.floor(Math.random() * 6) + 1;
    
    setGameState(prev => {
      let newResources = { ...prev.resources };
      let productionCount = 0;
      let activatedCards: Card[] = [];

      // Ativar cartas baseadas no dado
      [...prev.farmGrid.flat(), ...prev.cityGrid.flat()].forEach(cell => {
        if (cell.card && cell.card.effect.trigger === 'dice' && 
            cell.card.effect.diceNumbers?.includes(diceResult)) {
          
          activatedCards.push(cell.card);
          
          if (cell.card.effect.production) {
            Object.entries(cell.card.effect.production).forEach(([resource, amount]) => {
              newResources[resource as keyof Resources] += amount;
              productionCount += amount;
            });
          }
        }
      });

      // Aplicar combos
      const farmCombos = calculateComboEffects(prev.farmGrid, 'farm');
      const cityCombos = calculateComboEffects(prev.cityGrid, 'city');
      
      // Aplicar efeitos de combo
      [...farmCombos, ...cityCombos].forEach(combo => {
        if (combo.type === 'vineyard_chain') {
          newResources.coins += combo.multiplier;
        }
      });

      // Atualizar estatísticas
      const newStats = { ...prev.playerStats };
      if (productionCount > 0) {
        newStats.totalProduction += productionCount;
        setStreak(prev => prev + 1);
      } else {
        setStreak(0);
      }

      // Verificar conquistas
      if (newStats.totalProduction >= 100 && !achievements.includes('Produtor Experiente')) {
        addAchievement('Produtor Experiente');
      }

      return {
        ...prev,
        resources: newResources,
        playerStats: newStats,
        comboEffects: [...farmCombos, ...cityCombos],
        lastDiceRoll: diceResult,
        activatedCards: activatedCards
      };
    });
  }, [calculateComboEffects, achievements, addAchievement]);

  const playCard = useCallback((card: Card, row?: number, col?: number, type?: 'farm' | 'city') => {
    console.log('playCard called:', { card: card.name, row, col, type });
    setGameState(prev => {
      let newResources = { ...prev.resources };
      let newStats = { ...prev.playerStats };
      let newHand = [...prev.hand];
      let newGrid = type === 'farm' ? 
        JSON.parse(JSON.stringify(prev.farmGrid)) : 
        JSON.parse(JSON.stringify(prev.cityGrid));

      // Verificar se tem recursos suficientes
      const canAfford = Object.entries(card.cost).every(([resource, amount]) => 
        newResources[resource as keyof Resources] >= amount
      );

      console.log('Can afford card:', canAfford, 'cost:', card.cost, 'resources:', newResources);

      // Temporariamente permitir jogar cartas sem verificar recursos para debug
      const canPlay = true; // canAfford;

      if (!canPlay) {
        console.log('Cannot afford card, returning previous state');
        return prev;
      }

      // Deduzir custo
      Object.entries(card.cost).forEach(([resource, amount]) => {
        newResources[resource as keyof Resources] -= amount;
      });

      // Remover carta da mão
      newHand = newHand.filter(c => c.id !== card.id);

      if (type && row !== undefined && col !== undefined) {
        console.log('Placing card on grid:', { type, row, col, cardName: card.name });
        console.log('Grid before placement:', newGrid[row][col]);
        
        // Verificar se a célula está vazia
        if (newGrid[row][col].type !== 'empty') {
          console.log('Cell is not empty, cannot place card');
          return prev;
        }
        
        // Colocar carta no grid
        newGrid[row][col] = {
          id: `${type}-${row}-${col}`,
          row,
          col,
          card,
          type: type
        };

        console.log('Grid after placement:', newGrid[row][col]);
        newStats.buildingsBuilt++;
        console.log('Card placed successfully at', row, col);
      } else if (card.type === 'action') {
        console.log('Playing action card:', card.name);
        
        // Aplicar efeito de produção imediata
        if (card.effect.production) {
          Object.entries(card.effect.production).forEach(([resource, amount]) => {
            newResources[resource as keyof Resources] += amount;
          });
        }

        // Aplicar efeitos especiais de ação
        if (card.effect.buyExtraCard) {
          return {
            ...prev,
            resources: newResources,
            hand: newHand,
            playerStats: newStats,
            cardsToBuyExtra: prev.cardsToBuyExtra + card.effect.buyExtraCard
          };
        }
        
        if (card.effect.discardNextTurn) {
          return {
            ...prev,
            resources: newResources,
            hand: newHand,
            playerStats: newStats,
            cardsToDiscard: prev.cardsToDiscard + card.effect.discardNextTurn
          };
        }
        
        if (card.effect.crisisProtection) {
          return {
            ...prev,
            resources: newResources,
            hand: newHand,
            playerStats: newStats,
            crisisProtection: true
          };
        }
      } else {
        console.log('Missing placement parameters:', { type, row, col });
      }

      const newState = {
        ...prev,
        resources: newResources,
        hand: newHand,
        farmGrid: type === 'farm' ? newGrid : prev.farmGrid,
        cityGrid: type === 'city' ? newGrid : prev.cityGrid,
        playerStats: newStats
      };

      console.log('New state created:', {
        handLength: newState.hand.length,
        farmGridCells: newState.farmGrid.flat().filter(cell => cell.card).length,
        cityGridCells: newState.cityGrid.flat().filter(cell => cell.card).length,
        resources: newState.resources,
        farmGrid: newState.farmGrid.map(row => row.map(cell => cell.card?.name || 'empty')),
        cityGrid: newState.cityGrid.map(row => row.map(cell => cell.card?.name || 'empty'))
      });
      
      console.log('Returning new state');
      return newState;
    });
  }, []);

  const selectCard = useCallback((card: Card) => {
    setGameState(prev => ({ ...prev, selectedCard: card }));
  }, []);

  const selectCell = useCallback((row: number, col: number, type: 'farm' | 'city') => {
    setGameState(prev => ({ 
      ...prev, 
      selectedCell: { row, col, type } 
    }));
  }, []);

  const nextPhase = useCallback(() => {
    console.log('nextPhase called');
    setGameState(prev => {
      const phases: ('draw' | 'action' | 'build' | 'production' | 'end')[] = 
        ['draw', 'action', 'build', 'production', 'end'];
      
      const currentIndex = phases.indexOf(prev.phase);
      const nextIndex = (currentIndex + 1) % phases.length;
      const nextPhase = phases[nextIndex];

      console.log('Phase transition:', { 
        currentPhase: prev.phase, 
        nextPhase, 
        currentIndex, 
        nextIndex,
        currentTurn: prev.turn
      });

      let newState = { ...prev, phase: nextPhase };

      // Fase de compra
      if (nextPhase === 'draw') {
        // Calcular quantas cartas comprar (base + extras)
        const baseCards = prev.extraCardsPerTurn;
        const extraCards = prev.cardsToBuyExtra;
        const totalCardsToDraw = baseCards + extraCards;
        
        console.log('Drawing cards:', { baseCards, extraCards, totalCardsToDraw });
        
        const newCards = getRandomCards(totalCardsToDraw, undefined, prev.turn);
        newState.hand = [...prev.hand, ...newCards];
        
        // Reset cartas extras após usar
        newState.cardsToBuyExtra = 0;
        
        console.log('Cards drawn:', newCards.length, 'New hand size:', newState.hand.length);
        
        // Aplicar descarte se necessário
        if (prev.cardsToDiscard > 0) {
          // Se tem cartas para descartar, remover as primeiras cartas da mão
          const cardsToRemove = Math.min(prev.cardsToDiscard, newState.hand.length);
          newState.hand = newState.hand.slice(cardsToRemove);
          newState.cardsToDiscard = 0; // Reset discard
          console.log('Discarded cards:', cardsToRemove);
        }
        
        // Limite de 6 cartas na mão - descartar automaticamente se exceder
        if (newState.hand.length > 6) {
          const excessCards = newState.hand.length - 6;
          newState.hand = newState.hand.slice(excessCards);
          console.log('Auto-discarded excess cards:', excessCards);
        }
      }

      // Fase de produção
      if (nextPhase === 'production') {
        let newResources = { ...prev.resources };
        
        // Produção por turno
        [...prev.farmGrid.flat(), ...prev.cityGrid.flat()].forEach(cell => {
          if (cell.card && cell.card.effect.trigger === 'turn' && cell.card.effect.production) {
            Object.entries(cell.card.effect.production).forEach(([resource, amount]) => {
              newResources[resource as keyof Resources] += amount;
            });
          }
        });

        // Aplicar combos de produção por turno
        const farmCombos = calculateComboEffects(prev.farmGrid, 'farm');
        const cityCombos = calculateComboEffects(prev.cityGrid, 'city');
        
        [...farmCombos, ...cityCombos].forEach(combo => {
          if (combo.type === 'boost_orchards') {
            // Aumentar produção de pomares
            prev.farmGrid.flat().forEach(cell => {
              if (cell.card?.id === 'orchard') {
                newResources.food += 1;
              }
            });
          }
        });

        newState.resources = newResources;
      }

      // Fase de fim de turno
      if (nextPhase === 'end') {
        console.log('End phase reached, processing turn change');
        
        // Descarte obrigatório no fim do turno (1 carta)
        if (newState.hand.length > 0) {
          newState.hand = newState.hand.slice(1);
        }
        
        // Gerar evento aleatório
        const newEvent = getRandomEvent();
        if (newEvent && !prev.crisisProtection) {
          newState.activeEvents = [...prev.activeEvents, newEvent];
          applyCrisisEffects(newEvent);
        } else if (prev.crisisProtection) {
          newState.crisisProtection = false;
        }

        // Limpar eventos expirados
        newState.activeEvents = prev.activeEvents
          .map(event => ({ ...event, duration: event.duration - 1 }))
          .filter(event => event.duration > 0);

        // Próximo turno
        newState.turn = prev.turn + 1;
        console.log('Turn incremented:', { from: prev.turn, to: newState.turn });
        
        // Atualizar estatísticas
        const newStats = { ...prev.playerStats };
        if (newEvent) {
          newStats.crisisSurvived++;
        }
        newState.playerStats = newStats;
      }

      console.log('nextPhase returning new state:', { 
        phase: newState.phase, 
        turn: newState.turn,
        handLength: newState.hand.length 
      });
      return newState;
    });
  }, [calculateComboEffects, applyCrisisEffects]);

  const purchaseCard = useCallback((card: Card) => {
    setGameState(prev => ({
      ...prev,
      hand: [...prev.hand, card]
    }));
  }, []);

  return {
    gameState,
    previousResources,
    streak,
    achievements,
    rollDice,
    playCard,
    selectCard,
    selectCell,
    nextPhase,
    purchaseCard
  };
};