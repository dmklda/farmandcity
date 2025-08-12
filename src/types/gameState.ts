// Tipos e interfaces para o estado global do jogo
import { Card } from './card';
import { Resources } from './resources';
import { EffectExecutionTracking, CardRestriction } from './card';

export type GamePhase = 'draw' | 'action' | 'build' | 'production' | 'end';

export interface PlayerStats {
  reputation: number;
  totalProduction: number;
  buildings: number;
  landmarks: number;
}

// Sistema complexo de vitória
export interface VictoryCondition {
  id: string;
  name: string;
  description: string;
  type: 'major' | 'minor';
  category: 'reputation' | 'landmarks' | 'resources' | 'production' | 'diversity' | 'survival' | 'combat' | 'cards' | 'turns' | 'events' | 'magic' | 'efficiency' | 'population' | 'coins';
  target: number;
  current: number;
  completed: boolean;
  completedAt?: number; // timestamp quando foi completada
}

export interface ComplexVictorySystem {
  mode: 'simple' | 'complex' | 'infinite' | 'classic';
  requiredMajor: number; // quantas vitórias grandes são necessárias
  requiredMinor: number; // quantas vitórias pequenas são necessárias
  conditions: VictoryCondition[];
  completedConditions: string[]; // IDs das condições completadas
  victoryAchieved: boolean;
}

export interface ComboEffect {
  description: string;
  // Pode ser expandido para lógica de efeito
}

export interface GameEvent {
  id: string;
  name: string;
  type: 'crisis' | 'opportunity';
  description: string;
}

export interface GridCell {
  card: Card | null;
  x?: number;
  y?: number;
  stack?: Card[]; // Cartas empilhadas (upgrades)
  level?: number; // Nível da carta (1 = base, 2+ = upgraded)
  isHighlighted?: boolean; // Se a célula está destacada
}

export interface GameState {
  turn: number;
  phase: GamePhase;
  resources: Resources;
  playerStats: PlayerStats;
  farmGrid: GridCell[][];
  cityGrid: GridCell[][];
  landmarksGrid: GridCell[][]; // Grid para landmarks
  eventGrid: GridCell[][]; // Grid de 1x1 para eventos (uma célula)
  hand: Card[];
  deck: Card[];
  activeEvents: Card[];
  comboEffects: string[];
  magicUsedThisTurn: boolean;
  builtCountThisTurn: number;
  actionUsedThisTurn?: boolean;
  victorySystem?: ComplexVictorySystem; // Novo sistema de vitória
  productionReduction?: number; // Redução de produção devido a catástrofes (0-1)
  catastropheDuration?: number; // Duração restante da catástrofe em turnos
  catastropheName?: string; // Nome da catástrofe ativa
  lastCatastropheTurn?: number; // Último turno em que uma catástrofe foi ativada
  
  // Sistema de tracking de execução de efeitos
  effectTracking?: Record<string, EffectExecutionTracking>; // Tracking de efeitos por carta e tipo
  
  // Sistema de restrições temporárias de cartas
  cardRestrictions?: CardRestriction[]; // Restrições ativas de tipos de carta
}