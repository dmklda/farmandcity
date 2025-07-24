// Tipos e interfaces para o estado global do jogo
import { Card } from './card';
import { Resources } from './resources';

export type GamePhase = 'draw' | 'action' | 'build' | 'production' | 'end';

export interface PlayerStats {
  reputation: number;
  totalProduction: number;
  buildings: number;
  landmarks: number;
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
  x: number;
  y: number;
}

export interface GameState {
  resources: Resources;
  hand: Card[];
  deck: Card[];
  farmGrid: GridCell[][];
  cityGrid: GridCell[][];
  turn: number;
  phase: GamePhase;
  activeEvents: GameEvent[];
  comboEffects: ComboEffect[];
  playerStats: PlayerStats;
} 