export interface Card {
  id: string;
  name: string;
  type: 'farm' | 'city' | 'action' | 'landmark' | 'event';
  cost: {
    coins?: number;
    food?: number;
    materials?: number;
    population?: number;
  };
  effect: {
    description: string;
    production?: {
      coins?: number;
      food?: number;
      materials?: number;
      population?: number;
    };
    trigger?: 'dice' | 'turn' | 'combo' | 'instant' | 'crisis';
    diceNumbers?: number[];
    comboEffect?: string;
    crisisEffect?: string;
    duration?: number;
    buyExtraCard?: number;
    discardNextTurn?: number;
    crisisProtection?: boolean;
  };
  rarity: 'starter' | 'common' | 'uncommon' | 'rare' | 'legendary' | 'crisis' | 'booster';
  image?: string;
}

export interface Resources {
  coins: number;
  food: number;
  materials: number;
  population: number;
}

export interface GridCell {
  id: string;
  type: 'empty' | 'farm' | 'city';
  card?: Card;
  row: number;
  col: number;
}

export interface GameEvent {
  id: string;
  type: 'crisis' | 'opportunity' | 'multiplayer';
  name: string;
  description: string;
  effect: any;
  duration: number;
  active: boolean;
}

export interface PlayerStats {
  reputation: number;
  totalProduction: number;
  buildingsBuilt: number;
  landmarksCompleted: number;
  crisisSurvived: number;
  achievements: string[];
}

export interface ComboEffect {
  type: string;
  description: string;
  multiplier: number;
  conditions: string[];
}

export interface GameState {
  resources: Resources;
  hand: Card[];
  deck: Card[];
  farmGrid: GridCell[][];
  cityGrid: GridCell[][];
  landmarks: Card[];
  completedLandmarks: Card[];
  turn: number;
  phase: 'draw' | 'action' | 'build' | 'production' | 'end';
  selectedCard?: Card;
  selectedCell?: GridCell;
  activeEvents: GameEvent[];
  playerStats: PlayerStats;
  comboEffects: ComboEffect[];
  crisisProtection: boolean;
  weatherPrediction: boolean;
  enhancedTrading: boolean;
  extraCardsPerTurn: number;
  advancedCardAccess: boolean;
  lastDiceRoll?: number;
  activatedCards: Card[];
  cardsToDiscard: number;
  cardsToBuyExtra: number;
  actionCardPlayed: boolean;
  diceRollRequired: boolean;
  canPlayActions: boolean;
}

export interface CardEffect {
  description: string;
  trigger: 'dice' | 'turn' | 'instant' | 'crisis';
  production?: Partial<Resources> | null;
  diceNumbers?: number[] | null;
  comboEffect?: string | null;
  crisisEffect?: string | null;
  duration?: number | null;
  buyExtraCard?: number;
  discardNextTurn?: number;
  crisisProtection?: boolean;
}

interface HandProps {
  cards: CardType[];
  selectedCard?: CardType;
  resources: Resources;
  onCardClick: (card: CardType) => void;
  onDragStart?: (card: CardType, event: React.MouseEvent) => void;
  draggedCard?: CardType;
  cardsToDiscard?: number;
  gamePhase?: string;
  diceRollRequired?: boolean;
}