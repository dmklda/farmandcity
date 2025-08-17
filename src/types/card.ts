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

// ===== SISTEMA HÍBRIDO DE EFEITOS =====

// Tipos de efeitos simples (formato string)
export type SimpleEffectType = 
  | 'PRODUCE_FOOD' | 'PRODUCE_COINS' | 'PRODUCE_MATERIALS' | 'PRODUCE_POPULATION'
  | 'GAIN_FOOD' | 'GAIN_COINS' | 'GAIN_MATERIALS' | 'GAIN_POPULATION'
  | 'LOSE_FOOD' | 'LOSE_COINS' | 'LOSE_MATERIALS' | 'LOSE_POPULATION'
  | 'RESTRICT_ACTION_CARDS' | 'RESTRICT_MAGIC_CARDS' | 'RESTRICT_CITY_CARDS' | 'RESTRICT_FARM_CARDS'
  | 'RESTRICT_EVENT_CARDS' | 'RESTRICT_LANDMARK_CARDS'
  | 'BLOCK_ACTION' | 'DEACTIVATE_CITY_CARD' | 'DESTROY_OWN_CARD'
  | 'COST_MATERIALS' | 'COST_FOOD' | 'COST_COINS' | 'COST_POPULATION'
  | 'RESTORE_POPULATION' | 'GAIN_DEFENSE' | 'GAIN_LANDMARK' | 'GAIN_REPUTATION'
  | 'BOOST_ALL_FARMS_FOOD' | 'BOOST_ALL_CITIES_COINS' | 'BOOST_ALL_CITIES_MATERIALS' | 'BOOST_ALL_CITIES' | 'BOOST_ALL_FARMS'
  | 'BOOST_ALL_FARMS_FOOD_TEMP' | 'BOOST_ALL_CITIES_COINS_TEMP' | 'BOOST_ALL_CITIES_TEMP' | 'BOOST_ALL_FARMS_TEMP'
  | 'BOOST_ALL_FARMS_MATERIALS_TEMP'
  | 'TRADE_MATERIALS_FOR_FOOD' | 'TRADE_FOOD_FOR_COINS' | 'TRADE_COINS_FOR_MATERIALS'
  | 'OPTIONAL_DISCARD_BOOST_FARM' | 'OPTIONAL_DISCARD_BOOST_CITY' | 'OPTIONAL_DISCARD_BOOST_LANDMARK'
  | 'BOOST_ALL_CONSTRUCTIONS_DOUBLE' | 'OPTIONAL_DISCARD_BUY_MAGIC_CARD'
  | 'BOOST_ALL_CITIES_WITH_TAG_WORKSHOP_MATERIALS' | 'BOOST_ALL_CITIES_WITH_TAG_WORKSHOP_COINS'
  | 'BOOST_CONSTRUCTION_COST_REDUCTION' | 'EXTRA_BUILD_CITY' | 'REDUCE_PRODUCTION' | 'IF_TEMPLE_EXISTS' | 'DISCARD_CARD' | 'CREATE_CITY_CARD' | 'PRODUCE_REPUTATION' | 'REDUCE_CITY_COST' | 'CANCEL_EVENT' | 'BLOCK_NEXT_NEGATIVE_EVENT' | 'BLOCK_ACTION' | 'DESTROY_CARD'
  | 'STEAL_CARD' | 'PROTECT_AGAINST_EVENTS' | 'ABSORB_NEGATIVE_EFFECTS' | 'EXTRA_CARD_PLAY'
  | 'OPTIONAL_DISCARD_ELEMENTAL' | 'INVOKE_RANDOM_ELEMENTAL'
  | 'OPTIONAL_DISCARD_GAIN_MATERIALS' | 'INDESTRUCTIBLE'
  | 'ON_PLAY_FARM' | 'ON_PLAY_CITY' | 'ON_PLAY_MAGIC' | 'DRAW_CARD' | 'DRAW_CITY_CARD'
  | 'BOOST_ALL_CONSTRUCTIONS' | 'DUPLICATE_MAGIC_EFFECTS' | 'BOOST_ALL_CITIES_MATERIALS_TEMP'
  | 'RESTRICT_FARM_ACTIVATION' | 'OPTIONAL_PAY_COINS';

// Tipos de frequência para efeitos
export type EffectFrequency = 
  | 'ONCE'           // Executa apenas uma vez
  | 'PER_TURN'       // Executa a cada turno
  | 'ON_TURN_X'      // Executa a cada X turnos
  | 'ON_DICE'        // Executa quando dado específico
  | 'ON_CONDITION'   // Executa quando condição é atendida
  | 'CONTINUOUS'     // Executa continuamente
  | 'TEMPORARY';     // Executa por X turnos (duração limitada)

// Interface para efeitos simples
export interface SimpleEffect {
  type: SimpleEffectType;
  amount: number;
  frequency?: EffectFrequency;  // Frequência de execução
  turnInterval?: number;        // Para ON_TURN_X (ex: a cada 2 turnos)
  duration?: number;            // Duração do efeito
  condition?: string;           // Condição para execução
  target?: string;              // Alvo do efeito
  maxExecutions?: number;       // Máximo de execuções (para efeitos únicos)
}

// Interface para efeitos condicionais
export interface ConditionalEffect {
  type: 'IF_CITY_EXISTS' | 'IF_FARMS_GE_3' | 'IF_WORKSHOPS_GE_2' | 'IF_MAGIC_EXISTS' | 'IF_WATER_EXISTS' | 'IF_COINS_GE_5' | 'IF_CELESTIAL_FARMS_EXIST' | 'IF_VERTICAL_FARMS_EXIST' | 'IF_HAND_GE_5' | 'IF_HORTA_EXISTS' | 'IF_SACRED_FIELD_EXISTS' | 'IF_SACRED_TAG_EXISTS' | 'IF_CITY_GE_3' | 'IF_POPULATION_GE_2' | 'IF_COINS_GE_10' | 'FALLBACK';
  effect: SimpleEffect;
  logicalOperator?: 'AND' | 'OR'; // Indica se as condições são combinadas com AND (;) ou OR (|)
}

// Interface para efeitos de produção por dado
export interface DiceProductionEffect {
  type: 'ON_DICE';
  diceNumbers: number[];
  effect: SimpleEffect;
}

// ===== NOVOS TIPOS PARA EFEITOS COMPLEXOS =====

// Interface para efeitos aleatórios
export interface RandomEffect {
  type: 'RANDOM_CHANCE';
  chance: number;               // Chance em porcentagem (0-100)
  effects: SimpleEffect[];      // Efeitos que podem acontecer
  fallbackEffect?: SimpleEffect; // Efeito que acontece se nenhum dos principais ocorrer
}

// Interface para boost de construções
export interface ConstructionBoostEffect {
  type: 'BOOST_CONSTRUCTIONS';
  resourceType: 'food' | 'coins' | 'materials' | 'population';
  amount: number;
  targetTypes: CardType[];      // Tipos de cartas que recebem o boost
  frequency: EffectFrequency;   // Frequência do boost
}

// Interface para efeitos complexos (JSON)
export interface ComplexEffect {
  type: 'production' | 'gain' | 'loss' | 'boost' | 'restrict' | 'random' | 'conditional' | 'construction_boost';
  resource?: string;
  base_amount?: number;
  bonus_amount?: number;
  duration?: number;
  chance?: number;
  conditions?: Record<string, any>;
  triggers?: Record<string, any>;
  end_turn_effect?: any;
  random_effect?: any;
  bonus_condition?: any;
  trigger_effect?: any;
  optional_effect?: any;
  
  // Novos campos para efeitos complexos
  random_chance?: number;
  random_effects?: SimpleEffect[];
  fallback_effect?: SimpleEffect;
  construction_boost?: {
    resource: string;
    amount: number;
    target_types: CardType[];
  };
}

// Interface para o effect_logic
export interface CardEffectLogic {
  simple?: SimpleEffect[];
  conditional?: ConditionalEffect[];
  dice?: DiceProductionEffect[];
  complex?: ComplexEffect;
  random?: RandomEffect[];           // Efeitos aleatórios
  constructionBoost?: ConstructionBoostEffect[]; // Boost de construções
  raw?: string; // Para efeitos que não se encaixam nos padrões
}

// ===== SISTEMA DE RESTRIÇÕES TEMPORÁRIAS =====

// Tipos de restrição de cartas
export type CardRestrictionType = 'action' | 'magic' | 'city' | 'farm' | 'landmark' | 'event' | 'defense' | 'trap';

// Escopo da restrição
export type RestrictionScope = 'next_turn' | 'current_turn' | 'permanent' | 'next_x_turns';

// Interface para restrições temporárias de cartas
export interface CardRestriction {
  id: string;                           // ID único da restrição
  restrictedTypes: CardRestrictionType[]; // Tipos de carta restritos
  duration: number;                     // Duração em turnos
  scope: RestrictionScope;             // Escopo da restrição
  appliedAt: number;                    // Turno quando foi aplicada
  appliedBy: string;                    // ID da carta que aplicou a restrição
  description: string;                  // Descrição da restrição para UI
  isActive: boolean;                    // Se a restrição está ativa
}

// Interface para tracking de efeitos executados
export interface EffectExecutionTracking {
  cardId: string;
  effectType: SimpleEffectType;
  lastExecutedTurn: number;
  executionCount: number;
  maxExecutions?: number;
  isActive: boolean;
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
  deactivated?: boolean; // Se a carta está desativada por catástrofe
  deactivationTurns?: number; // Quantos turnos restam de desativação
  
  // Novo campo para o sistema híbrido
  effect_logic?: string | null;
  
  // Campo para tags (workshop, city, farm, etc.)
  tags?: string[];
}