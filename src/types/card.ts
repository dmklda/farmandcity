// Tipos e interfaces para o sistema de cartas

export type CardType = 'farm' | 'city' | 'action' | 'landmark' | 'event' | 'defense' | 'magic' | 'trap';

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'legendary' | 'crisis' | 'booster' | 'ultra' | 'secret' | 'landmark';

export interface ResourceCost {
  coins?: number;
  food?: number;
  materials?: number;
  population?: number;
}

export interface CardEffect {
  description: string;
  diceNumber?: number; // Número do dado necessário para ativar o efeito
  // Pode ser expandido para funções ou triggers específicas
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: ResourceCost;
  effect: CardEffect;
  rarity: CardRarity;
  activation: string;
  artworkUrl?: string;
}