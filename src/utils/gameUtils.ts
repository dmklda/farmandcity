import { GameState, GridCell, VictoryCondition, ComplexVictorySystem } from '../types/gameState';
import { Card } from '../types/card';
import { Resources } from '../types/resources';

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
  const hand = shuffledDeck.slice(0, 5);
  const remainingDeck = shuffledDeck.slice(5);
  
  return {
    turn: 1,
    phase: 'draw' as const,
    resources: { coins: 10, food: 10, materials: 10, population: 5 },
    playerStats: { reputation: 0, totalProduction: 0, buildings: 0, landmarks: 0 },
    farmGrid: createEmptyGrid(3, 4), // 3 linhas x 4 colunas = 12 slots
    cityGrid: createEmptyGrid(2, 3), // 2 linhas x 3 colunas = 6 slots
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
    // VITÓRIAS MAJOR (Grandes)
    {
      id: 'major_reputation_15',
      name: 'Mestre da Reputação',
      description: 'Alcance 15 pontos de reputação',
      type: 'major',
      category: 'reputation',
      target: 15,
      current: 0,
      completed: false
    },
    {
      id: 'major_landmarks_5',
      name: 'Construtor de Marcos',
      description: 'Construa 5 marcos históricos',
      type: 'major',
      category: 'landmarks',
      target: 5,
      current: 0,
      completed: false
    },
    {
      id: 'major_resources_1000',
      name: 'Mestre dos Recursos',
      description: 'Acumule 1000 recursos totais',
      type: 'major',
      category: 'resources',
      target: 1000,
      current: 0,
      completed: false
    },
    {
      id: 'major_production_50',
      name: 'Produtor Eficiente',
      description: 'Produza 50 recursos por turno',
      type: 'major',
      category: 'production',
      target: 50,
      current: 0,
      completed: false
    },
    {
      id: 'major_diversity_6',
      name: 'Diversidade Máxima',
      description: 'Tenha 6 tipos diferentes de cartas',
      type: 'major',
      category: 'diversity',
      target: 6,
      current: 0,
      completed: false
    },
    {
      id: 'major_survival_30',
      name: 'Sobrevivente',
      description: 'Sobreviva 30 turnos',
      type: 'major',
      category: 'survival',
      target: 30,
      current: 0,
      completed: false
    },

    // VITÓRIAS MINOR (Pequenas)
    {
      id: 'minor_reputation_8',
      name: 'Respeitado',
      description: 'Alcance 8 pontos de reputação',
      type: 'minor',
      category: 'reputation',
      target: 8,
      current: 0,
      completed: false
    },
    {
      id: 'minor_landmarks_3',
      name: 'Arquiteto',
      description: 'Construa 3 marcos históricos',
      type: 'minor',
      category: 'landmarks',
      target: 3,
      current: 0,
      completed: false
    },
    {
      id: 'minor_resources_500',
      name: 'Rico',
      description: 'Acumule 500 recursos totais',
      type: 'minor',
      category: 'resources',
      target: 500,
      current: 0,
      completed: false
    },
    {
      id: 'minor_production_25',
      name: 'Produtor',
      description: 'Produza 25 recursos por turno',
      type: 'minor',
      category: 'production',
      target: 25,
      current: 0,
      completed: false
    },
    {
      id: 'minor_diversity_4',
      name: 'Diverso',
      description: 'Tenha 4 tipos diferentes de cartas',
      type: 'minor',
      category: 'diversity',
      target: 4,
      current: 0,
      completed: false
    },
    {
      id: 'minor_survival_15',
      name: 'Persistente',
      description: 'Sobreviva 15 turnos',
      type: 'minor',
      category: 'survival',
      target: 15,
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
        current = gameState.resources.coins + gameState.resources.food + 
                  gameState.resources.materials + gameState.resources.population;
        break;
      case 'production':
        const production = getProductionPerTurnDetails(gameState.farmGrid, gameState.cityGrid);
        current = production.prod.coins + production.prod.food + 
                  production.prod.materials + production.prod.population;
        break;
      case 'diversity':
        const allCards = [
          ...gameState.farmGrid.flat().map(cell => cell.card).filter(Boolean),
          ...gameState.cityGrid.flat().map(cell => cell.card).filter(Boolean)
        ] as Card[];
        const types = new Set(allCards.map(card => card.type));
        current = types.size;
        break;
      case 'survival':
        current = gameState.turn;
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

  const victoryAchieved = majorCompleted >= victorySystem.requiredMajor && 
                         minorCompleted >= victorySystem.requiredMinor;

  return {
    ...victorySystem,
    conditions: updatedConditions,
    completedConditions,
    victoryAchieved
  };
}