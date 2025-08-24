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
  
  // Propriedades dinâmicas para efeitos especiais
  drawCards?: number; // Número de cartas para comprar (efeito DRAW_CARD)
  drawCityCards?: number; // Número de cartas city para comprar (efeito DRAW_CITY_CARD)
  duplicateMagicEffects?: boolean; // Se os efeitos de magia devem ser duplicados
  duplicateMagicEffectsDuration?: number; // Duração do efeito de duplicação de magia
  citiesMaterialsBoostTemp?: number; // Boost temporário de materiais para cidades
  restrictFarmActivation?: boolean; // Se a ativação de fazendas está restrita
  restrictFarmActivationDuration?: number; // Duração da restrição de ativação de fazendas
  
  // Campos especiais de efeitos
  extraBuildCity?: number; // Permite construir cidade extra
  farmsBoost?: number; // Boost permanente para fazendas
  citiesBoost?: number; // Boost permanente para cidades
  farmsBoostTemp?: number; // Boost temporário para fazendas
  citiesBoostTemp?: number; // Boost temporário para cidades
  constructionsBoost?: number; // Boost para todas as construções
  defense?: number; // Pontos de defesa
  landmarks?: number; // Pontos de landmarks
  eventProtection?: number; // Proteção contra eventos
  blockNegativeEvent?: boolean; // Bloquear próximo evento negativo
  cancelEvent?: boolean; // Cancelar evento atual
  destroyCard?: number; // Destruir cartas
  stealCard?: number; // Roubar cartas
  absorbNegative?: boolean; // Absorver efeitos negativos
  reduceCityCost?: number; // Reduzir custo de cidades
  discardCards?: number; // Descartar cartas
  createCityCard?: number; // Criar cartas de cidade
  constructionCostReduction?: number; // Redução de custo de construção
  citiesCoinsBoostTemp?: number; // Boost temporário de moedas para cidades
  citiesCoinsBoostTempDuration?: number; // Duração do boost temporário
  magicCostReduction?: number; // Redução de custo de magia
  magicCostReductionTemp?: number; // Redução temporária de custo de magia
  magicCostReductionTempDuration?: number; // Duração da redução temporária
  farmProtection?: boolean; // Proteção para fazendas
  
  // Efeitos opcionais e especiais
  optionalFarmBoost?: number;
  optionalElemental?: number;
  randomElemental?: number;
  optionalMagicCard?: number;
  extraCardPlay?: number;
  optionalGainMaterials?: number;
  indestructible?: boolean;
  onPlayFarm?: number;
  onPlayCity?: number;
  onPlayMagic?: number;
  optionalPayCoins?: number;
  
  // Sistema de histórico
  history?: string[]; // Histórico de ações do jogo
}