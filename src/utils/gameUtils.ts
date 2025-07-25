import { GameState, GridCell } from '../types/gameState';
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
    playerStats: { reputation: 5, totalProduction: 0, buildings: 0, landmarks: 0 },
    farmGrid: createEmptyGrid(3, 3),
    cityGrid: createEmptyGrid(3, 3),
    eventGrid: createEmptyGrid(2, 3),
    hand,
    deck: remainingDeck,
    activeEvents: [],
    comboEffects: [],
    magicUsedThisTurn: false,
    builtCountThisTurn: 0
  };
}