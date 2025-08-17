import { GameState, GridCell, VictoryCondition, ComplexVictorySystem } from '../types/gameState';
import { Card } from '../types/card';
import { Resources } from '../types/resources';

// Função para calcular produção por turno detalhada
export function getProductionPerTurnDetails(farmGrid: GridCell[][], cityGrid: GridCell[][]) {
  const prod: Resources = { coins: 0, food: 0, materials: 0, population: 0 };
  const details: { coins: string[], food: string[], materials: string[], population: string[], reputation: string[] } = {
    coins: [], food: [], materials: [], population: [], reputation: []
  };
  
  const allCells = [
    ...farmGrid.flat(),
    ...cityGrid.flat(),
  ];
  
  allCells.forEach((cell) => {
    if (!cell.card) return;
    
    // Verificar se há cartas empilhadas
    const cards = cell.stack ? [cell.card, ...cell.stack] : [cell.card];
    const level = cards.length;
    
    // Só produção automática por turno
    const effect = cell.card.effect.description.toLowerCase();
    if (/por turno/.test(effect) && !/dado/.test(effect)) {
      // Calcular produção baseada no nível da carta
      const p = calculateStackedProduction(cards);
      Object.entries(p).forEach(([key, value]) => {
        if (value && value > 0) {
          if (key === 'reputation') {
            prod.reputation = (prod.reputation || 0) + value;
            const levelText = level > 1 ? ` (Nível ${level})` : '';
            details.reputation!.push(`${cell.card!.name}${levelText}: +${value}`);
          } else {
            prod[key as keyof Resources] += value;
            const levelText = level > 1 ? ` (Nível ${level})` : '';
            details[key as keyof Resources].push(`${cell.card!.name}${levelText}: +${value}`);
          }
        }
      });
    }
  });
  
  return { prod, details };
}

// Função auxiliar para calcular produção empilhada
function calculateStackedProduction(cards: Card[]): Resources & { reputation?: number } {
  const production: Resources & { reputation?: number } = { coins: 0, food: 0, materials: 0, population: 0 };
  
  cards.forEach(card => {
    const effect = card.effect.description.toLowerCase();
    if (/por turno/.test(effect) && !/dado/.test(effect)) {
      // Parse básico de produção
      if (effect.includes('moeda') || effect.includes('coin')) {
        const match = effect.match(/(\d+)\s*moeda/);
        if (match) production.coins += parseInt(match[1]);
      }
      if (effect.includes('comida') || effect.includes('food')) {
        const match = effect.match(/(\d+)\s*comida/);
        if (match) production.food += parseInt(match[1]);
      }
      if (effect.includes('material') || effect.includes('materials')) {
        const match = effect.match(/(\d+)\s*material/);
        if (match) production.materials += parseInt(match[1]);
      }
      if (effect.includes('população') || effect.includes('population')) {
        const match = effect.match(/(\d+)\s*população/);
        if (match) production.population += parseInt(match[1]);
      }
      if (effect.includes('reputação') || effect.includes('reputation')) {
        const match = effect.match(/(\d+)\s*reputação/);
        if (match) production.reputation = (production.reputation || 0) + parseInt(match[1]);
      }
    }
  });
  
  return production;
}

export function createEmptyGrid(rows: number, cols: number): GridCell[][] {
  return Array(rows).fill(null).map((_, y) => 
    Array(cols).fill(null).map((_, x) => ({ card: null, x, y }))
  );
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function parseProduction(production?: string): Resources {
  if (!production) return { coins: 0, food: 0, materials: 0, population: 0 };
  
  const resources: Resources = { coins: 0, food: 0, materials: 0, population: 0 };
  const matches = production.match(/(\d+)\s*(coins?|food|materials?|population)/gi);
  
  matches?.forEach(match => {
    const [, amount, resource] = match.match(/(\d+)\s*(\w+)/) || [];
    const value = parseInt(amount);
    
    if (resource.toLowerCase().includes('coin')) resources.coins += value;
    else if (resource.toLowerCase().includes('food')) resources.food += value;
    else if (resource.toLowerCase().includes('material')) resources.materials += value;
    else if (resource.toLowerCase().includes('population')) resources.population += value;
  });
  
  return resources;
}

export function parseInstantEffect(effect?: string): Resources {
  return parseProduction(effect);
}

export function parseDiceProduction(production?: string): Resources {
  return parseProduction(production);
}

export function getInitialState(deck: Card[]): GameState {
  const shuffledDeck = shuffle(deck);
  
  // Garantir que o campo effect_logic seja preservado
  const hand = shuffledDeck.slice(0, 5).map(card => ({
    ...card,
    effect_logic: card.effect_logic
  }));
  
  const remainingDeck = shuffledDeck.slice(5).map(card => ({
    ...card,
    effect_logic: card.effect_logic
  }));
  
  return {
    turn: 1,
    phase: 'draw' as const,
    resources: { coins: 3, food: 2, materials: 2, population: 2 },
    playerStats: { reputation: 0, totalProduction: 0, buildings: 0, landmarks: 0 },
    farmGrid: createEmptyGrid(4, 3), // 4 linhas x 3 colunas = 12 slots para o novo layout
    cityGrid: createEmptyGrid(4, 3), // 4 linhas x 3 colunas = 12 slots para o novo layout
    landmarksGrid: createEmptyGrid(1, 3), // 1 linha x 3 colunas = 3 slots para landmarks
    eventGrid: createEmptyGrid(1, 2), // 1 linha x 2 colunas = 2 slots para eventos
    hand,
    deck: remainingDeck,
    activeEvents: [],
    comboEffects: [],
    magicUsedThisTurn: false,
    builtCountThisTurn: 0
  };
}

export function createComplexVictorySystem(): ComplexVictorySystem {
  const conditions: VictoryCondition[] = [
    // VITÓRIAS MAJOR (Grandes) - Valores mais desafiadores
    {
      id: 'major_reputation_20',
      name: 'Mestre da Reputação',
      description: 'Alcance 20 pontos de reputação',
      type: 'major',
      category: 'reputation',
      target: 20,
      current: 0,
      completed: false
    },
    {
      id: 'major_landmarks_3',
      name: 'Construtor de Marcos',
      description: 'Construa 3 marcos históricos',
      type: 'major',
      category: 'landmarks',
      target: 3,
      current: 0,
      completed: false
    },
    {
      id: 'major_resources_800',
      name: 'Mestre dos Recursos',
      description: 'Acumule 800 recursos totais',
      type: 'major',
      category: 'resources',
      target: 800,
      current: 0,
      completed: false
    },
    {
      id: 'major_production_40',
      name: 'Produtor Eficiente',
      description: 'Produza 40 recursos por turno',
      type: 'major',
      category: 'production',
      target: 40,
      current: 0,
      completed: false
    },
    {
      id: 'major_diversity_4',
      name: 'Diversidade Máxima',
      description: 'Tenha 4 tipos diferentes de cartas',
      type: 'major',
      category: 'diversity',
      target: 4,
      current: 0,
      completed: false
    },
    {
      id: 'major_survival_25',
      name: 'Sobrevivente',
      description: 'Sobreviva 25 turnos',
      type: 'major',
      category: 'survival',
      target: 25,
      current: 0,
      completed: false
    },

    // VITÓRIAS MINOR (Pequenas) - Baseadas em mecânicas reais do jogo
    {
      id: 'minor_events_2',
      name: 'Eventos Históricos',
      description: 'Ative 2 eventos contínuos',
      type: 'minor',
      category: 'events',
      target: 2,
      current: 0,
      completed: false
    },
    {
      id: 'minor_population_50',
      name: 'Crescimento Populacional',
      description: 'Tenha 50 população',
      type: 'minor',
      category: 'population',
      target: 50,
      current: 0,
      completed: false
    },
    {
      id: 'minor_coins_200',
      name: 'Mercador Rico',
      description: 'Acumule 200 moedas',
      type: 'minor',
      category: 'coins',
      target: 200,
      current: 0,
      completed: false
    }
  ];

  return {
    mode: 'complex',
    requiredMajor: 2, // Precisa de 2 vitórias grandes
    requiredMinor: 1, // E 1 vitória pequena
    conditions,
    completedConditions: [],
    victoryAchieved: false
  };
}

export function createSimpleVictorySystem(): ComplexVictorySystem {
  return {
    mode: 'simple',
    requiredMajor: 1,
    requiredMinor: 0,
    conditions: [
      {
        id: 'simple_landmarks_3',
        name: 'Marcos Históricos',
        description: 'Construa 3 marcos históricos',
        type: 'major',
        category: 'landmarks',
        target: 3,
        current: 0,
        completed: false
      }
    ],
    completedConditions: [],
    victoryAchieved: false
  };
}

export function createClassicVictorySystem(): ComplexVictorySystem {
  return {
    mode: 'classic',
    requiredMajor: 1, // Apenas 1 condição de vitória é necessária
    requiredMinor: 0,
    conditions: [
      // Vitória por Construção (3 landmarks)
      {
        id: 'classic_construction_3',
        name: 'Vitória por Construção',
        description: 'Construa 3 marcos históricos',
        type: 'major',
        category: 'landmarks',
        target: 3,
        current: 0,
        completed: false
      },
      // Vitória por Sobrevivência (50 turnos)
      {
        id: 'classic_survival_50',
        name: 'Vitória por Sobrevivência',
        description: 'Sobreviva até o turno 50',
        type: 'major',
        category: 'survival',
        target: 50,
        current: 0,
        completed: false
      },
      // Vitória por Prosperidade (1000 moedas)
      {
        id: 'classic_prosperity_1000',
        name: 'Vitória por Prosperidade',
        description: 'Acumule 1000 moedas',
        type: 'major',
        category: 'resources',
        target: 1000,
        current: 0,
        completed: false
      },
      // Vitória por Pontos de Prestígio (25 reputação)
      {
        id: 'classic_prestige_25',
        name: 'Vitória por Prestígio',
        description: 'Alcance 25 pontos de reputação',
        type: 'major',
        category: 'reputation',
        target: 25,
        current: 0,
        completed: false
      },
      // Vitória Secreta: Domínio Mágico (4 relíquias mágicas)
      {
        id: 'classic_magic_dominance_4',
        name: 'Vitória por Domínio Mágico',
        description: 'Junte 4 relíquias mágicas para invocar o Deus da Colheita',
        type: 'major',
        category: 'diversity',
        target: 4,
        current: 0,
        completed: false
      }
    ],
    completedConditions: [],
    victoryAchieved: false
  };
}

export function createInfiniteVictorySystem(): ComplexVictorySystem {
  return {
    mode: 'infinite',
    requiredMajor: 0, // Nunca vence
    requiredMinor: 0,
    conditions: [
      {
        id: 'infinite_survival_999',
        name: 'Sobrevivência Infinita',
        description: 'Continue sobrevivendo indefinidamente',
        type: 'major',
        category: 'survival',
        target: 999, // Impossível de alcançar
        current: 0,
        completed: false
      }
    ],
    completedConditions: [],
    victoryAchieved: false
  };
}

export function updateVictoryConditions(
  victorySystem: ComplexVictorySystem,
  gameState: GameState
): ComplexVictorySystem {
  const updatedConditions = victorySystem.conditions.map(condition => {
    let current = 0;
    
    switch (condition.category) {
      case 'reputation':
        current = gameState.playerStats.reputation;
        break;
      case 'landmarks':
        current = gameState.playerStats.landmarks;
        break;
      case 'resources':
        // Para vitória por prosperidade, contar apenas moedas
        if (condition.id === 'classic_prosperity_1000') {
          current = gameState.resources.coins;
        } else {
          current = gameState.resources.coins + gameState.resources.food + 
                    gameState.resources.materials + gameState.resources.population;
        }
        break;
      case 'production':
        const production = getProductionPerTurnDetails(gameState.farmGrid, gameState.cityGrid);
        current = production.prod.coins + production.prod.food + 
                  production.prod.materials + production.prod.population;
        break;
      case 'diversity':
        // Para vitória por domínio mágico, contar apenas cartas de magia
        if (condition.id === 'classic_magic_dominance_4') {
          const allCards = [
            ...gameState.farmGrid.flat().map(cell => cell.card).filter(Boolean),
            ...gameState.cityGrid.flat().map(cell => cell.card).filter(Boolean),
            ...gameState.landmarksGrid.flat().map(cell => cell.card).filter(Boolean),
            ...gameState.eventGrid.flat().map(cell => cell.card).filter(Boolean)
          ] as Card[];
          const magicCards = allCards.filter(card => card.type === 'magic');
          current = magicCards.length;
        } else {
          const allCards = [
            ...gameState.farmGrid.flat().map(cell => cell.card).filter(Boolean),
            ...gameState.cityGrid.flat().map(cell => cell.card).filter(Boolean)
          ] as Card[];
          const types = new Set(allCards.map(card => card.type));
          current = types.size;
        }
        break;
      case 'survival':
        current = gameState.turn;
        break;
      case 'combat':
        // Contar vitórias em batalhas (implementar quando houver sistema de batalha)
        current = 0;
        break;
      case 'cards':
        // Contar cartas no deck
        const allCards = [
          ...gameState.farmGrid.flat().map(cell => cell.card).filter(Boolean),
          ...gameState.cityGrid.flat().map(cell => cell.card).filter(Boolean),
          ...gameState.landmarksGrid.flat().map(cell => cell.card).filter(Boolean),
          ...gameState.eventGrid.flat().map(cell => cell.card).filter(Boolean)
        ] as Card[];
        current = allCards.length;
        break;
      case 'turns':
        // Contar cartas jogadas em um turno (implementar quando houver sistema de turnos)
        current = 0;
        break;
      case 'events':
        // Contar eventos ativados
        const eventCards = gameState.eventGrid.flat().map(cell => cell.card).filter(Boolean) as Card[];
        current = eventCards.length;
        break;
      case 'magic':
        // Contar cartas mágicas no campo
        const magicAllCards = [
          ...gameState.farmGrid.flat().map(cell => cell.card).filter(Boolean),
          ...gameState.cityGrid.flat().map(cell => cell.card).filter(Boolean),
          ...gameState.landmarksGrid.flat().map(cell => cell.card).filter(Boolean),
          ...gameState.eventGrid.flat().map(cell => cell.card).filter(Boolean)
        ] as Card[];
        const magicCards = magicAllCards.filter(card => card.type === 'magic');
        current = magicCards.length;
        break;
      case 'efficiency':
        // Contar produção máxima em um turno (usar produção atual como proxy)
        const efficiencyProduction = getProductionPerTurnDetails(gameState.farmGrid, gameState.cityGrid);
        current = efficiencyProduction.prod.coins + efficiencyProduction.prod.food + 
                  efficiencyProduction.prod.materials + efficiencyProduction.prod.population;
        break;
      case 'population':
        // Contar população atual
        current = gameState.resources.population;
        break;
      case 'coins':
        // Contar moedas atuais
        current = gameState.resources.coins;
        break;
    }
    
    const completed = current >= condition.target;
    const wasCompleted = condition.completed;
    
    return {
      ...condition,
      current,
      completed,
      completedAt: completed && !wasCompleted ? Date.now() : condition.completedAt
    };
  });

  const completedConditions = updatedConditions
    .filter(c => c.completed)
    .map(c => c.id);

  const majorCompleted = updatedConditions
    .filter(c => c.type === 'major' && c.completed).length;
  
  const minorCompleted = updatedConditions
    .filter(c => c.type === 'minor' && c.completed).length;

  // Para o modo infinito, nunca há vitória (sempre false)
  const victoryAchieved = victorySystem.mode === 'infinite' ? false : 
                         (majorCompleted >= victorySystem.requiredMajor && 
                          minorCompleted >= victorySystem.requiredMinor);

  return {
    ...victorySystem,
    conditions: updatedConditions,
    completedConditions,
    victoryAchieved
  };
}