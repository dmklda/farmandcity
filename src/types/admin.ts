export type CardType = 'farm' | 'city' | 'action' | 'magic' | 'defense' | 'trap' | 'event' | 'landmark';
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'ultra' | 'secret' | 'legendary' | 'crisis' | 'booster';
export type GamePhase = 'draw' | 'action' | 'reaction';

export interface AdminCard {
  id: string;
  slug: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  cost_coins: number;
  cost_food: number;
  cost_materials: number;
  cost_population: number;
  effect: string;
  effect_logic?: string | null;
  phase: GamePhase;
  use_per_turn: number;
  is_reactive: boolean;
  art_url?: string | null;
  frame_url?: string | null;
  is_active: boolean;
  tags?: string[] | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export interface BoosterPack {
  id: string;
  name: string;
  description?: string | null;
  price_coins: number;
  cards_count: number;
  guaranteed_rarity?: CardRarity | null;
  is_active: boolean;
  created_at: string;
}

export interface PackPurchase {
  id: string;
  user_id: string;
  pack_id: string;
  cards_received: any;
  purchased_at: string;
}

export interface GameStats {
  id: string;
  user_id: string;
  card_id: string;
  times_used: number;
  wins_with_card: number;
  last_used: string;
}