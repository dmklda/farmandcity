// Sistema Híbrido de Execução de Efeitos
// Executa efeitos baseados no effect_logic das cartas

import { 
  SimpleEffect, 
  ConditionalEffect, 
  DiceProductionEffect, 
  ComplexEffect, 
  CardEffectLogic,
  SimpleEffectType,
  Card,
  EffectFrequency,
  EffectExecutionTracking,
  RandomEffect,
  ConstructionBoostEffect,
  CardRestriction
} from '../types/card';
import { Resources } from '../types/resources';
import { GameState } from '../types/gameState';
import { parseEffectLogic, extractRestrictions } from './effectParser';

// ===== SISTEMA DE TRACKING DE EXECUÇÃO =====

/**
 * Verifica se um efeito pode ser executado baseado na frequência e tracking
 */
function canExecuteEffect(
  effect: SimpleEffect, 
  cardId: string, 
  gameState: GameState
): boolean {
  const currentTurn = gameState.turn;
  
  // Se não há tracking, criar um novo
  if (!gameState.effectTracking) {
    gameState.effectTracking = {};
  }
  
  const trackingKey = `${cardId}_${effect.type}`;
  const tracking = gameState.effectTracking[trackingKey];
  
  switch (effect.frequency) {
    case 'ONCE':
      // Efeito único: só executa uma vez
      if (tracking && tracking.executionCount >= (effect.maxExecutions || 1)) {
        return false;
      }
      break;
      
    case 'PER_TURN':
      // Efeito por turno: executa a cada turno
      return true;
      
    case 'ON_TURN_X':
      // Efeito a cada X turnos
      if (tracking && effect.turnInterval) {
        return (currentTurn - tracking.lastExecutedTurn) >= effect.turnInterval;
      }
      return true;
      
    case 'TEMPORARY':
      // Efeito temporário: executa por X turnos
      if (tracking && effect.duration) {
        const turnsElapsed = currentTurn - tracking.lastExecutedTurn;
        return turnsElapsed < effect.duration;
      }
      return true;

    case 'ON_DICE':
      // Efeito baseado em dado: executa quando dado é rolado
      return true;
      
    case 'ON_CONDITION':
      // Efeito condicional: executa quando condição é atendida
      return true;
      
    case 'CONTINUOUS':
      // Efeito contínuo: sempre ativo
      return true;
      
    default:
      return true;
  }
  
  return true;
}

/**
 * Atualiza o tracking de execução de um efeito
 */
function updateEffectTracking(
  effect: SimpleEffect, 
  cardId: string, 
  gameState: GameState
): void {
  const currentTurn = gameState.turn;
  
  if (!gameState.effectTracking) {
    gameState.effectTracking = {};
  }
  
  const trackingKey = `${cardId}_${effect.type}`;
  const currentTracking = gameState.effectTracking[trackingKey];
  
  const newTracking: EffectExecutionTracking = {
    cardId,
    effectType: effect.type,
    lastExecutedTurn: currentTurn,
    executionCount: (currentTracking?.executionCount || 0) + 1,
    maxExecutions: effect.maxExecutions,
    isActive: true
  };
  
  gameState.effectTracking[trackingKey] = newTracking;
}

// ===== EXECUTOR DE EFEITOS SIMPLES =====

/**
 * Executa um efeito simples e retorna as mudanças nos recursos
 */
export function executeSimpleEffect(
  effect: SimpleEffect, 
  gameState: GameState, 
  cardId: string
): Partial<Resources> {
  // Verificar se o efeito pode ser executado
  if (!canExecuteEffect(effect, cardId, gameState)) {
    return {};
  }
  
  const changes: Partial<Resources> = {};
  
  switch (effect.type) {
    // Produção de recursos (por turno)
    case 'PRODUCE_FOOD':
      changes.food = (changes.food || 0) + effect.amount;
      break;
    case 'PRODUCE_COINS':
      changes.coins = (changes.coins || 0) + effect.amount;
      break;
    case 'PRODUCE_MATERIALS':
      changes.materials = (changes.materials || 0) + effect.amount;
      break;
    case 'PRODUCE_POPULATION':
      changes.population = (changes.population || 0) + effect.amount;
      break;
      
    // Ganho de recursos (único)
    case 'GAIN_FOOD':
      changes.food = (changes.food || 0) + effect.amount;
      break;
    case 'GAIN_COINS':
      changes.coins = (changes.coins || 0) + effect.amount;
      break;
    case 'GAIN_MATERIALS':
      changes.materials = (changes.materials || 0) + effect.amount;
      break;
    case 'GAIN_POPULATION':
      changes.population = (changes.population || 0) + effect.amount;
      break;
      
    // Perda de recursos (único)
    case 'LOSE_FOOD':
      changes.food = (changes.food || 0) - effect.amount;
      break;
    case 'LOSE_COINS':
      changes.coins = (changes.coins || 0) - effect.amount;
      break;
    case 'LOSE_MATERIALS':
      changes.materials = (changes.materials || 0) - effect.amount;
      break;
    case 'LOSE_POPULATION':
      changes.population = (changes.population || 0) - effect.amount;
      break;
      
    // Custos (único)
    case 'COST_FOOD':
      changes.food = (changes.food || 0) - effect.amount;
      break;
    case 'COST_COINS':
      changes.coins = (changes.coins || 0) - effect.amount;
      break;
    case 'COST_MATERIALS':
      changes.materials = (changes.materials || 0) - effect.amount;
      break;
    case 'COST_POPULATION':
      changes.population = (changes.population || 0) - effect.amount;
      break;
      
    // Efeitos especiais (não afetam recursos diretamente)
    case 'RESTRICT_ACTION_CARDS':
    case 'RESTRICT_MAGIC_CARDS':
    case 'RESTRICT_CITY_CARDS':
    case 'RESTRICT_FARM_CARDS':
    case 'RESTRICT_EVENT_CARDS':
    case 'RESTRICT_LANDMARK_CARDS':
    case 'BLOCK_ACTION':
    case 'DEACTIVATE_CITY_CARD':
    case 'DESTROY_OWN_CARD':
      // Estes efeitos são tratados pelo sistema de estado do jogo
      break;
      
    // Novos tipos de efeitos
    case 'RESTORE_POPULATION':
      changes.population = (changes.population || 0) + effect.amount;
      break;
    case 'GAIN_DEFENSE':
      // Sistema de defesa - adiciona proteção
      (changes as any).defense = (changes as any).defense || 0;
      (changes as any).defense += effect.amount;
      break;
    case 'GAIN_LANDMARK':
      // Sistema de landmarks - adiciona landmark
      (changes as any).landmarks = (changes as any).landmarks || 0;
      (changes as any).landmarks += effect.amount;
      break;
    case 'PRODUCE_REPUTATION': {
      // Produzir reputação
      (changes as any).reputation = (changes as any).reputation || 0;
      (changes as any).reputation += effect.amount;
      break;
    }
    case 'BOOST_ALL_FARMS_FOOD': {
      // Boost para todas as fazendas
      const farmCount = gameState.farmGrid.flat().filter(cell => cell.card).length;
      (changes as any).farmsBoost = (changes as any).farmsBoost || 0;
      (changes as any).farmsBoost += effect.amount * farmCount;
      break;
    }
    case 'BOOST_ALL_CITIES_COINS': {
      // Boost para todas as cidades
      const cityCount = gameState.cityGrid.flat().filter(cell => cell.card).length;
      (changes as any).citiesBoost = (changes as any).citiesBoost || 0;
      (changes as any).citiesBoost += effect.amount * cityCount;
      break;
    }
    case 'OPTIONAL_DISCARD_BOOST_FARM':
      // Implementar boost opcional de fazenda (requer descarte de carta)
      // Este efeito será tratado pelo sistema de UI para escolha do jogador
      (changes as any).optionalFarmBoost = effect.amount;
      break;
    case 'OPTIONAL_DISCARD_ELEMENTAL':
      // Sistema de descarte opcional para invocar elemental
      // Este efeito será tratado pelo sistema de UI para escolha do jogador
      // O elemental será adicionado à mão do jogador quando ele escolher descartar
      (changes as any).optionalElemental = effect.amount;
      break;
      
    case 'INVOKE_RANDOM_ELEMENTAL':
      // Sistema de invocação aleatória de elemental
      // Este efeito será tratado pelo sistema de UI para escolha do jogador
      (changes as any).randomElemental = effect.amount;
      break;
    case 'OPTIONAL_DISCARD_BUY_MAGIC_CARD':
      // Implementar compra opcional de carta mágica (requer descarte de carta)
      // Este efeito será tratado pelo sistema de UI para escolha do jogador
      (changes as any).optionalMagicCard = effect.amount;
      break;
    case 'BOOST_ALL_CONSTRUCTIONS_DOUBLE': {
      // Boost duplo para todas as construções
      const farmCount = gameState.farmGrid.flat().filter(cell => cell.card).length;
      const cityCount = gameState.cityGrid.flat().filter(cell => cell.card).length;
      const landmarkCount = gameState.landmarksGrid.flat().filter(cell => cell.card).length;
      const totalBoost = (farmCount + cityCount + landmarkCount) * effect.amount * 2;
      
      changes.food = (changes.food || 0) + Math.floor(totalBoost / 3);
      changes.coins = (changes.coins || 0) + Math.floor(totalBoost / 3);
      changes.materials = (changes.materials || 0) + Math.ceil(totalBoost / 3);
      break;
    }
    case 'BOOST_ALL_CITIES': {
      // Boost geral para todas as cidades
      const cityCount = gameState.cityGrid.flat().filter(cell => cell.card).length;
      changes.coins = (changes.coins || 0) + effect.amount * cityCount;
      changes.materials = (changes.materials || 0) + effect.amount * cityCount;
      break;
    }
    case 'BOOST_ALL_FARMS': {
      // Boost para todas as fazendas
      const farmCount = gameState.farmGrid.flat().filter(cell => cell.card).length;
      changes.food = (changes.food || 0) + effect.amount * farmCount;
      break;
    }
    case 'TRADE_MATERIALS_FOR_FOOD': {
      const materialsToTrade = effect.amount;
      const foodToGain = (effect as any).extraAmount || effect.amount;
      if ((gameState.resources.materials || 0) >= materialsToTrade) {
        changes.materials = (changes.materials || 0) - materialsToTrade;
        changes.food = (changes.food || 0) + foodToGain;
      }
      break;
    }
    case 'TRADE_FOOD_FOR_COINS': {
      const foodToTrade = effect.amount;
      const coinsToGain = (effect as any).extraAmount || effect.amount;
      if ((gameState.resources.food || 0) >= foodToTrade) {
        changes.food = (changes.food || 0) - foodToTrade;
        changes.coins = (changes.coins || 0) + coinsToGain;
      }
      break;
    }
    case 'TRADE_COINS_FOR_MATERIALS': {
      const coinsToTrade = effect.amount;
      const materialsToGain = (effect as any).extraAmount || effect.amount;
      if ((gameState.resources.coins || 0) >= coinsToTrade) {
        changes.coins = (changes.coins || 0) - coinsToTrade;
        changes.materials = (changes.materials || 0) + materialsToGain;
      }
      break;
    }
    case 'EXTRA_CARD_PLAY':
      // Este efeito será tratado pelo sistema de estado do jogo
      // para permitir jogar cartas adicionais
      (changes as any).extraCardPlay = effect.amount;
      break;
    case 'CANCEL_EVENT': {
      // Cancelar último evento aplicado
      (changes as any).cancelEvent = true;
      break;
    }
    case 'BLOCK_NEXT_NEGATIVE_EVENT': {
      // Bloquear próximo evento negativo
      (changes as any).blockNegativeEvent = true;
      break;
    }
    case 'DESTROY_CARD': {
      // Destruir uma carta do tabuleiro
      (changes as any).destroyCard = effect.amount;
      break;
    }
    case 'STEAL_CARD': {
      // Roubar uma carta (implementação futura)
      (changes as any).stealCard = effect.amount;
      break;
    }
    case 'PROTECT_AGAINST_EVENTS': {
      // Proteção contínua contra eventos
      (changes as any).eventProtection = effect.amount;
      break;
    }
    case 'ABSORB_NEGATIVE_EFFECTS': {
      // Absorver efeitos negativos
      (changes as any).absorbNegative = effect.amount;
      break;
    }
    case 'OPTIONAL_DISCARD_GAIN_MATERIALS':
      // Efeito opcional: descartar uma carta para ganhar materiais
      // Este efeito será tratado pelo sistema de UI para escolha do jogador
      (changes as any).optionalGainMaterials = effect.amount;
      break;
    case 'INDESTRUCTIBLE':
      // Efeito de indestrutibilidade: lógica implementada no useGameState
      (changes as any).indestructible = effect.duration || 1;
      break;
    case 'BOOST_ALL_CITIES_TEMP': {
      // Aplica boost temporário para todas as cidades
      // Retorna um campo especial para ser tratado pelo sistema de produção
      (changes as any).citiesBoostTemp = (changes as any).citiesBoostTemp || 0;
      (changes as any).citiesBoostTemp += effect.amount;
      break;
    }
    case 'BOOST_ALL_FARMS_TEMP': {
      // Aplica boost temporário para todas as fazendas
      (changes as any).farmsBoostTemp = (changes as any).farmsBoostTemp || 0;
      (changes as any).farmsBoostTemp += effect.amount;
      break;
    }
    case 'BOOST_ALL_CONSTRUCTIONS': {
      // Aplica boost para todas as construções (farm, city, landmark)
      (changes as any).constructionsBoost = (changes as any).constructionsBoost || 0;
      (changes as any).constructionsBoost += effect.amount;
      break;
    }
    case 'ON_PLAY_FARM': {
      // Este efeito é tratado pelo sistema de eventos do jogo
      // Será acionado quando uma carta de farm for jogada
      (changes as any).onPlayFarm = effect.amount;
      break;
    }
    case 'ON_PLAY_CITY': {
      // Este efeito é tratado pelo sistema de eventos do jogo
      // Será acionado quando uma carta de city for jogada
      (changes as any).onPlayCity = effect.amount;
      break;
    }
    case 'DRAW_CARD': {
      // Este efeito é tratado pelo sistema de estado do jogo
      // para permitir comprar cartas adicionais
      (changes as any).drawCards = (changes as any).drawCards || 0;
      (changes as any).drawCards += effect.amount;
      break;
    }
    case 'DRAW_CITY_CARD': {
      // Este efeito é tratado pelo sistema de estado do jogo
      // para permitir comprar cartas city específicas
      (changes as any).drawCityCards = (changes as any).drawCityCards || 0;
      (changes as any).drawCityCards += effect.amount;
      break;
    }
    case 'DUPLICATE_MAGIC_EFFECTS': {
      // Este efeito é tratado pelo sistema de estado do jogo
      // para duplicar o efeito de todas as magias jogadas
      (changes as any).duplicateMagicEffects = true;
      (changes as any).duplicateMagicEffectsDuration = effect.duration || 1;
      break;
    }
    case 'ON_PLAY_MAGIC': {
      // Este efeito é tratado pelo sistema de eventos do jogo
      // Será acionado quando uma carta de magia for jogada
      (changes as any).onPlayMagic = effect.amount;
      break;
    }
    case 'BOOST_ALL_CITIES_MATERIALS_TEMP': {
      // Aplica boost temporário de materiais para todas as cidades
      (changes as any).citiesMaterialsBoostTemp = (changes as any).citiesMaterialsBoostTemp || 0;
      (changes as any).citiesMaterialsBoostTemp += effect.amount;
      break;
    }
    case 'BOOST_ALL_CITIES_MATERIALS': {
      // Boost de materiais para todas as cidades
      const cityCount = gameState.cityGrid.flat().filter(cell => cell.card).length;
      changes.materials = (changes.materials || 0) + effect.amount * cityCount;
      break;
    }
    case 'OPTIONAL_PAY_COINS': {
      // Este efeito é tratado pelo sistema de UI para escolha do jogador
      // Permite pagar moedas para obter um efeito opcional
      (changes as any).optionalPayCoins = effect.amount;
      break;
    }
    case 'RESTRICT_FARM_ACTIVATION': {
      // Este efeito é tratado pelo sistema de estado do jogo
      // para restringir a ativação de fazendas
      (changes as any).restrictFarmActivation = true;
      (changes as any).restrictFarmActivationDuration = effect.duration || 1;
      break;
    }
    // Novos efeitos implementados
    case 'REDUCE_CITY_COST': {
      // Reduz custo de construção de cidades
      (changes as any).reduceCityCost = effect.amount;
      break;
    }
    case 'DISCARD_CARD': {
      // Força descarte de cartas
      (changes as any).discardCards = effect.amount;
      break;
    }
    case 'CREATE_CITY_CARD': {
      // Cria uma carta de cidade
      (changes as any).createCityCard = effect.amount;
      break;
    }
    case 'BOOST_CONSTRUCTION_COST_REDUCTION': {
      // Reduz custo de todas as construções
      (changes as any).constructionCostReduction = effect.amount;
      break;
    }
    case 'EXTRA_BUILD_CITY': {
      // Permite construir cidade extra
      (changes as any).extraBuildCity = effect.amount;
      break;
    }
    case 'REDUCE_PRODUCTION': {
      // Reduz produção geral
      changes.food = (changes.food || 0) - effect.amount;
      changes.coins = (changes.coins || 0) - effect.amount;
      changes.materials = (changes.materials || 0) - effect.amount;
      break;
    }
  }
  
  // Atualizar tracking se o efeito foi executado
  if (Object.keys(changes).length > 0) {
    updateEffectTracking(effect, cardId, gameState);
  }
  
  return changes;
}

/**
 * Executa múltiplos efeitos simples
 */
export function executeSimpleEffects(
  effects: SimpleEffect[], 
  gameState: GameState, 
  cardId: string
): Partial<Resources> {
  const totalChanges: Partial<Resources> = {};
  
  for (const effect of effects) {
    const changes = executeSimpleEffect(effect, gameState, cardId);
    
    // Acumular mudanças
    for (const [resource, amount] of Object.entries(changes)) {
      if (amount !== undefined) {
        totalChanges[resource as keyof Resources] = (totalChanges[resource as keyof Resources] || 0) + amount;
      }
    }
  }
  
  return totalChanges;
}

// ===== EXECUTOR DE EFEITOS CONDICIONAIS =====

/**
 * Verifica se uma condição é verdadeira
 */
export function checkCondition(condition: ConditionalEffect['type'], gameState: GameState): boolean {
  // Caso especial: FALLBACK é sempre verdadeiro (usado para o operador OR)
  if (condition === 'FALLBACK') {
    console.log('[CONDITION DEBUG] Condição FALLBACK é sempre verdadeira');
    return true;
  }
  
  // Extrair todas as cartas dos grids
  const allCards = [
    ...gameState.farmGrid.flat().map(cell => cell.card).filter(Boolean),
    ...gameState.cityGrid.flat().map(cell => cell.card).filter(Boolean),
    ...gameState.landmarksGrid.flat().map(cell => cell.card).filter(Boolean),
    ...gameState.eventGrid.flat().map(cell => cell.card).filter(Boolean)
  ] as Card[];
  
  console.log('[CONDITION DEBUG] Verificando condição:', condition);
  console.log('[CONDITION DEBUG] Cartas no tabuleiro:', allCards.map(card => `${card.name} (${card.type}${card.tags ? ', tags: ' + card.tags.join(', ') : ''})`));
  
  let result = false;
  
  switch (condition) {
    case 'IF_CITY_EXISTS':
      result = allCards.some(card => card.type === 'city');
      break;
      
    case 'IF_FARMS_GE_3':
      result = allCards.filter(card => card.type === 'farm').length >= 3;
      break;
      
    case 'IF_WORKSHOPS_GE_2':
      // Verificar se existem pelo menos 2 cartas do tipo city com 'oficina' no nome ou tag 'workshop'
      result = allCards.filter(card => 
        card.type === 'city' && (
          card.name.toLowerCase().includes('oficina') || 
          (card.tags && card.tags.includes('workshop'))
        )
      ).length >= 2;
      break;
      
    case 'IF_MAGIC_EXISTS':
      result = allCards.filter(card => card.type === 'magic').length > 0;
      break;
      
    case 'IF_WATER_EXISTS':
      result = allCards.some(card =>
        (card.name.toLowerCase().includes('poço') || card.name.toLowerCase().includes('agua')) ||
        (card.tags && (card.tags.includes('agua') || card.tags.includes('poco')))
      );
      break;
      
    case 'IF_COINS_GE_5':
      result = (gameState.resources.coins || 0) >= 5;
      break;
      
    case 'IF_COINS_GE_10':
      result = (gameState.resources.coins || 0) >= 10;
      break;
      
    case 'IF_CELESTIAL_FARMS_EXIST':
      result = allCards.some(card => card.type === 'farm' && card.tags && card.tags.includes('celestial'));
      break;
      
    case 'IF_VERTICAL_FARMS_EXIST':
      result = allCards.some(card => card.type === 'farm' && card.tags && card.tags.includes('vertical'));
      break;
      
    case 'IF_HAND_GE_5':
      result = (gameState.hand?.length || 0) >= 5;
      break;
      
    case 'IF_HORTA_EXISTS':
      result = allCards.some(card => card.name.toLowerCase().includes('horta'));
      break;
      
    case 'IF_SACRED_FIELD_EXISTS':
      result = allCards.some(card => card.name.toLowerCase().includes('sagrado') || card.name.toLowerCase().includes('sagrada') || card.name.toLowerCase().includes('templo') || card.name.toLowerCase().includes('altar'));
      break;
      
    case 'IF_SACRED_TAG_EXISTS':
      result = allCards.some(card => card.tags && card.tags.includes('sagrado'));
      break;
      
    case 'IF_CITY_GE_3':
      result = allCards.filter(card => card.type === 'city').length >= 3;
      break;
      
    case 'IF_POPULATION_GE_2':
      result = (gameState.resources.population || 0) >= 2;
      break;
      
    case 'IF_TEMPLE_EXISTS':
      result = allCards.some(card => 
        card.name.toLowerCase().includes('templo') || 
        card.name.toLowerCase().includes('altar') ||
        card.name.toLowerCase().includes('santuario') ||
        (card.tags && card.tags.includes('templo'))
      );
      break;
  }
  
  console.log('[CONDITION DEBUG] Resultado da condição', condition, ':', result);
  return result;
}

/**
 * Executa efeitos condicionais
 */
export function executeConditionalEffects(
  effects: ConditionalEffect[], 
  gameState: GameState, 
  cardId: string
): Partial<Resources> {
  const changes: Partial<Resources> = {};
  
  // Verificar se estamos usando operador OR ou AND
  // Se pelo menos um efeito tiver operador OR, tratamos como OR
  const hasOrOperator = effects.some(effect => effect.logicalOperator === 'OR');
  console.log('[CONDITION DEBUG] Tipo de operador lógico:', hasOrOperator ? 'OR' : 'AND');
  
  // Para operador OR, basta que uma condição seja verdadeira
  if (hasOrOperator) {
    let anyConditionMet = false;
    let effectToApply: ConditionalEffect | null = null;
    
    // Verificar todas as condições
    for (const conditionalEffect of effects) {
      const conditionMet = checkCondition(conditionalEffect.type, gameState);
      console.log('[CONDITION DEBUG] Condição', conditionalEffect.type, 'atendida?', conditionMet);
      
      if (conditionMet) {
        anyConditionMet = true;
        effectToApply = conditionalEffect;
        break; // Com OR, a primeira condição verdadeira já é suficiente
      }
    }
    
    // Aplicar o efeito se qualquer condição for atendida
    if (anyConditionMet && effectToApply) {
      const effectChanges = executeSimpleEffect(effectToApply.effect, gameState, cardId);
      
      // Acumular mudanças
      for (const [resource, amount] of Object.entries(effectChanges)) {
        if (amount !== undefined) {
          changes[resource as keyof Resources] = (changes[resource as keyof Resources] || 0) + amount;
        }
      }
    }
  } 
  // Para operador AND (padrão), todas as condições devem ser verdadeiras
  else {
    let allConditionsMet = true;
    
    // Verificar todas as condições
    for (const conditionalEffect of effects) {
      const conditionMet = checkCondition(conditionalEffect.type, gameState);
      console.log('[CONDITION DEBUG] Condição', conditionalEffect.type, 'atendida?', conditionMet);
      
      if (!conditionMet) {
        allConditionsMet = false;
        break; // Com AND, uma condição falsa já é suficiente para falhar
      }
    }
    
    // Aplicar os efeitos se todas as condições forem atendidas
    if (allConditionsMet && effects.length > 0) {
      // No caso de AND, aplicamos o efeito da última condição
      const effectChanges = executeSimpleEffect(effects[effects.length - 1].effect, gameState, cardId);
      
      // Acumular mudanças
      for (const [resource, amount] of Object.entries(effectChanges)) {
        if (amount !== undefined) {
          changes[resource as keyof Resources] = (changes[resource as keyof Resources] || 0) + amount;
        }
      }
    }
  }
  
  console.log('[CONDITION DEBUG] Resultado final das condições:', Object.keys(changes).length > 0 ? 'Efeito aplicado' : 'Nenhum efeito aplicado');
  return changes;
}

// ===== EXECUTOR DE EFEITOS DE DADO =====

/**
 * Executa efeitos baseados no número do dado
 */
export function executeDiceEffects(
  effects: DiceProductionEffect[], 
  diceNumber: number, 
  gameState: GameState, 
  cardId: string
): Partial<Resources> {
  const changes: Partial<Resources> = {};
  
  for (const diceEffect of effects) {
    if (diceEffect.diceNumbers.includes(diceNumber)) {
      const effectChanges = executeSimpleEffect(diceEffect.effect, gameState, cardId);
      
      // Acumular mudanças
      for (const [resource, amount] of Object.entries(effectChanges)) {
        if (amount !== undefined) {
          changes[resource as keyof Resources] = (changes[resource as keyof Resources] || 0) + amount;
        }
      }
    }
  }
  
  return changes;
}

// ===== NOVOS EXECUTORES PARA EFEITOS COMPLEXOS =====

/**
 * Executa efeitos aleatórios
 */
export function executeRandomEffects(
  effects: RandomEffect[], 
  gameState: GameState, 
  cardId: string
): Partial<Resources> {
  const changes: Partial<Resources> = {};
  
  for (const randomEffect of effects) {
    // Gerar número aleatório (1-100)
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    
    if (randomNumber <= randomEffect.chance) {
      // Efeito principal acontece
      const effectChanges = executeSimpleEffects(randomEffect.effects, gameState, cardId);
      mergeResourceChanges(changes, effectChanges);
    } else if (randomEffect.fallbackEffect) {
      // Efeito de fallback acontece
      const fallbackChanges = executeSimpleEffect(randomEffect.fallbackEffect, gameState, cardId);
      mergeResourceChanges(changes, fallbackChanges);
    }
  }
  
  return changes;
}

/**
 * Executa boost de construções
 */
export function executeConstructionBoostEffects(
  effects: ConstructionBoostEffect[], 
  gameState: GameState, 
  cardId: string
): Partial<Resources> {
  const changes: Partial<Resources> = {};
  
  for (const boostEffect of effects) {
    // Encontrar todas as cartas do tipo alvo
    const targetCards: Card[] = [];
    
    if (boostEffect.targetTypes.includes('farm')) {
      targetCards.push(...gameState.farmGrid.flat().map(cell => cell.card).filter(Boolean) as Card[]);
    }
    
    if (boostEffect.targetTypes.includes('city')) {
      targetCards.push(...gameState.cityGrid.flat().map(cell => cell.card).filter(Boolean) as Card[]);
    }
    
    if (boostEffect.targetTypes.includes('landmark')) {
      targetCards.push(...gameState.landmarksGrid.flat().map(cell => cell.card).filter(Boolean) as Card[]);
    }
    
    // Aplicar boost para cada carta
    const boostAmount = boostEffect.amount * targetCards.length;
    
    switch (boostEffect.resourceType) {
      case 'food':
        changes.food = (changes.food || 0) + boostAmount;
        break;
      case 'coins':
        changes.coins = (changes.coins || 0) + boostAmount;
        break;
      case 'materials':
        changes.materials = (changes.materials || 0) + boostAmount;
        break;
      case 'population':
        changes.population = (changes.population || 0) + boostAmount;
        break;
    }
  }
  
  return changes;
}

// ===== EXECUTOR DE EFEITOS COMPLEXOS (JSON) =====

/**
 * Executa efeitos complexos baseados em JSON
 * Esta função pode ser expandida para lidar com todos os tipos de efeitos complexos
 */
export function executeComplexEffect(effect: ComplexEffect, gameState: GameState): Partial<Resources> {
  const changes: Partial<Resources> = {};
  
  // Por enquanto, vamos implementar apenas os efeitos básicos
  // Os efeitos complexos podem ser expandidos conforme necessário
  
  if (effect.type === 'production' && effect.resource && effect.base_amount) {
    switch (effect.resource) {
      case 'food':
        changes.food = (changes.food || 0) + effect.base_amount;
        break;
      case 'coins':
        changes.coins = (changes.coins || 0) + effect.base_amount;
        break;
      case 'materials':
        changes.materials = (changes.materials || 0) + effect.base_amount;
        break;
      case 'population':
        changes.population = (changes.population || 0) + effect.base_amount;
        break;
    }
  }
  
  if (effect.type === 'gain' && effect.resource && effect.base_amount) {
    switch (effect.resource) {
      case 'food':
        changes.food = (changes.food || 0) + effect.base_amount;
        break;
      case 'coins':
        changes.coins = (changes.coins || 0) + effect.base_amount;
        break;
      case 'materials':
        changes.materials = (changes.materials || 0) + effect.base_amount;
        break;
      case 'population':
        changes.population = (changes.population || 0) + effect.base_amount;
        break;
    }
  }
  
  return changes;
}

// ===== EXECUTOR PRINCIPAL HÍBRIDO =====

/**
 * Executa todos os efeitos de uma carta baseado no effect_logic
 */
export function executeCardEffects(
  effectLogic: string | null, 
  gameState: GameState, 
  cardId: string,
  diceNumber?: number
): Partial<Resources> {
  console.log('[EFFECT DEBUG] Valor de effectLogic:', effectLogic);
  console.log('[EFFECT DEBUG] Tipo de effectLogic:', typeof effectLogic);
  console.log('[EFFECT DEBUG] É null?', effectLogic === null);
  console.log('[EFFECT DEBUG] É undefined?', effectLogic === undefined);
  console.log('[EFFECT DEBUG] É string vazia?', effectLogic === '');
  console.log('[EFFECT DEBUG] Comprimento (se string):', typeof effectLogic === 'string' ? effectLogic.length : 'N/A');
  
  if (!effectLogic || effectLogic.trim() === "") {
    console.log('[EFFECT] Nenhum effectLogic fornecido para a carta', cardId);
    return {};
  }

  const parsed = parseEffectLogic(effectLogic);
  if (!parsed) {
    console.log('[EFFECT] effectLogic inválido para a carta', cardId, effectLogic);
    return {};
  }

  const before = { ...gameState.resources };
  const totalChanges: Partial<Resources> = {};

  // Executar efeitos simples
  if (parsed.simple && parsed.simple.length > 0) {
    console.log('[EFFECT] Executando efeitos simples', parsed.simple, 'para carta', cardId);
    const simpleChanges = executeSimpleEffects(parsed.simple, gameState, cardId);
    mergeResourceChanges(totalChanges, simpleChanges);
  }

  // Executar efeitos condicionais
  if (parsed.conditional && parsed.conditional.length > 0) {
    console.log('[EFFECT] Executando efeitos condicionais', parsed.conditional, 'para carta', cardId);
    const conditionalChanges = executeConditionalEffects(parsed.conditional, gameState, cardId);
    mergeResourceChanges(totalChanges, conditionalChanges);
  }

  // Executar efeitos de dado
  if (parsed.dice && parsed.dice.length > 0 && diceNumber !== undefined) {
    console.log('[EFFECT] Executando efeitos de dado', parsed.dice, 'para carta', cardId, 'com dado', diceNumber);
    const diceChanges = executeDiceEffects(parsed.dice, diceNumber, gameState, cardId);
    mergeResourceChanges(totalChanges, diceChanges);
  }

  // Executar efeitos aleatórios
  if (parsed.random && parsed.random.length > 0) {
    console.log('[EFFECT] Executando efeitos aleatórios', parsed.random, 'para carta', cardId);
    const randomChanges = executeRandomEffects(parsed.random, gameState, cardId);
    mergeResourceChanges(totalChanges, randomChanges);
  }

  // Executar boost de construções
  if (parsed.constructionBoost && parsed.constructionBoost.length > 0) {
    console.log('[EFFECT] Executando boosts de construção', parsed.constructionBoost, 'para carta', cardId);
    const boostChanges = executeConstructionBoostEffects(parsed.constructionBoost, gameState, cardId);
    mergeResourceChanges(totalChanges, boostChanges);
  }

  // Executar efeitos complexos
  if (parsed.complex) {
    console.log('[EFFECT] Executando efeito complexo', parsed.complex, 'para carta', cardId);
    const complexChanges = executeComplexEffect(parsed.complex, gameState);
    mergeResourceChanges(totalChanges, complexChanges);
  }

  // ===== SISTEMA DE RESTRIÇÕES TEMPORÁRIAS =====
  if (effectLogic.includes('RESTRICT_CARD_TYPES:')) {
    const restrictions = extractRestrictions(effectLogic);
    if (restrictions.length > 0) {
      console.log('[EFFECT] Aplicando restrições temporárias', restrictions, 'para carta', cardId);
      applyCardRestrictions(restrictions, cardId, gameState);
    }
  }

  // Aplicar as mudanças ao gameState
  applyResourceChanges(gameState, totalChanges);
  
  // Log final de recursos antes/depois
  const after = { ...gameState.resources };
  console.log('[EFFECT] Resultado dos efeitos da carta', cardId, '\nRecursos antes:', before, '\nMudanças:', totalChanges, '\nRecursos depois:', after);

  return totalChanges;
}

// ===== UTILITÁRIOS =====

/**
 * Combina mudanças de recursos
 */
function mergeResourceChanges(target: Partial<Resources>, source: Partial<Resources>): void {
  for (const [resource, amount] of Object.entries(source)) {
    if (amount !== undefined) {
      target[resource as keyof Resources] = (target[resource as keyof Resources] || 0) + amount;
    }
  }
}

/**
 * Aplica mudanças de recursos ao estado do jogo
 */
export function applyResourceChanges(gameState: GameState, changes: Partial<Resources>): void {
  for (const [resource, amount] of Object.entries(changes)) {
    if (amount !== undefined && amount !== 0) {
      if (resource === 'reputation') {
        // Aplicar mudanças de reputação ao playerStats
        gameState.playerStats.reputation = Math.max(0, (gameState.playerStats.reputation || 0) + amount);
      } else if (resource in gameState.resources) {
        // Aplicar mudanças de recursos normais
        const currentValue = gameState.resources[resource as keyof Resources] || 0;
        gameState.resources[resource as keyof Resources] = Math.max(0, currentValue + amount);
      } else {
        // Aplicar outros efeitos especiais ao gameState
        switch (resource) {
          case 'drawCards':
            gameState.drawCards = (gameState.drawCards || 0) + amount;
            break;
          case 'drawCityCards':
            gameState.drawCityCards = (gameState.drawCityCards || 0) + amount;
            break;
          case 'duplicateMagicEffects':
            gameState.duplicateMagicEffects = true;
            break;
          case 'duplicateMagicEffectsDuration':
            gameState.duplicateMagicEffectsDuration = amount;
            break;
          case 'citiesMaterialsBoostTemp':
            gameState.citiesMaterialsBoostTemp = (gameState.citiesMaterialsBoostTemp || 0) + amount;
            break;
          case 'restrictFarmActivation':
            gameState.restrictFarmActivation = true;
            break;
          case 'restrictFarmActivationDuration':
            gameState.restrictFarmActivationDuration = amount;
            break;
          // Novos campos especiais
          case 'defense':
            (gameState as any).defense = ((gameState as any).defense || 0) + amount;
            break;
          case 'landmarks':
            (gameState as any).landmarks = ((gameState as any).landmarks || 0) + amount;
            break;
          case 'optionalFarmBoost':
          case 'optionalElemental':
          case 'randomElemental':
          case 'optionalMagicCard':
          case 'extraCardPlay':
          case 'optionalGainMaterials':
          case 'indestructible':
          case 'onPlayFarm':
          case 'onPlayCity':
          case 'onPlayMagic':
          case 'optionalPayCoins':
            // Estes efeitos especiais são aplicados mas não alteram recursos diretamente
            (gameState as any)[resource] = amount;
            break;
          case 'eventProtection':
            (gameState as any).eventProtection = ((gameState as any).eventProtection || 0) + amount;
            break;
          case 'farmsBoost':
          case 'citiesBoost':
          case 'farmsBoostTemp':
          case 'citiesBoostTemp':
          case 'constructionsBoost':
            // Boosts temporários e permanentes
            (gameState as any)[resource] = ((gameState as any)[resource] || 0) + amount;
            break;
          case 'blockNegativeEvent':
          case 'cancelEvent':
          case 'destroyCard':
          case 'stealCard':
          case 'absorbNegative':
            // Efeitos de sistema
            (gameState as any)[resource] = amount;
            break;
          // Novos efeitos especiais
          case 'reduceCityCost':
          case 'discardCards':
          case 'createCityCard':
          case 'constructionCostReduction':
          case 'extraBuildCity':
            // Efeitos de construção e cartas
            (gameState as any)[resource] = amount;
            break;
        }
      }
    }
  }
}

// ===== FUNÇÃO DE IMPORTAÇÃO =====

// O parser já está importado no topo do arquivo

// ===== SISTEMA DE EXECUÇÃO DE RESTRIÇÕES TEMPORÁRIAS =====

/**
 * Aplica restrições temporárias ao jogo
 */
export function applyCardRestrictions(
  restrictions: CardRestriction[], 
  cardId: string, 
  gameState: GameState
): void {
  if (!gameState.cardRestrictions) {
    gameState.cardRestrictions = [];
  }
  
  const currentTurn = gameState.turn;
  
  for (const restriction of restrictions) {
    // Definir quando a restrição foi aplicada
    restriction.appliedAt = currentTurn;
    restriction.appliedBy = cardId;
    
    // Adicionar ao estado do jogo
    gameState.cardRestrictions.push(restriction);
  }
}

/**
 * Verifica se uma carta pode ser jogada baseado nas restrições ativas
 */
export function canPlayCard(cardType: string, gameState: GameState): boolean {
  if (!gameState.cardRestrictions || gameState.cardRestrictions.length === 0) {
    return true; // Sem restrições
  }
  
  const currentTurn = gameState.turn;
  
  // Filtrar restrições ativas
  const activeRestrictions = gameState.cardRestrictions.filter(restriction => {
    if (!restriction.isActive) return false;
    
    // Verificar se a restrição ainda está em vigor
    const turnsElapsed = currentTurn - restriction.appliedAt;
    return turnsElapsed < restriction.duration;
  });
  
  // Verificar se o tipo da carta está restrito
  for (const restriction of activeRestrictions) {
    if (restriction.restrictedTypes.includes(cardType as any)) {
      return false; // Carta não pode ser jogada
    }
  }
  
  return true; // Pode jogar
}

/**
 * Limpa restrições expiradas
 */
export function cleanupExpiredRestrictions(gameState: GameState): void {
  if (!gameState.cardRestrictions) return;
  
  const currentTurn = gameState.turn;
  
  gameState.cardRestrictions = gameState.cardRestrictions.filter(restriction => {
    if (!restriction.isActive) return false;
    
    const turnsElapsed = currentTurn - restriction.appliedAt;
    if (turnsElapsed >= restriction.duration) {
      restriction.isActive = false;
      return false; // Remove restrições expiradas
    }
    
    return true; // Mantém restrições ativas
  });
}

/**
 * Obtém descrição das restrições ativas para UI
 */
export function getActiveRestrictionsDescription(gameState: GameState): string[] {
  if (!gameState.cardRestrictions) return [];
  
  const currentTurn = gameState.turn;
  const descriptions: string[] = [];
  
  for (const restriction of gameState.cardRestrictions) {
    if (!restriction.isActive) continue;
    
    const turnsElapsed = currentTurn - restriction.appliedAt;
    const turnsRemaining = restriction.duration - turnsElapsed;
    
    if (turnsRemaining > 0) {
      descriptions.push(`${restriction.description} (${turnsRemaining} turno(s) restante(s))`);
    }
  }
  
  return descriptions;
}

/**
 * Detecta se um effect_logic contém efeitos opcionais
 */
export function hasOptionalEffects(effectLogic: string | null): boolean {
  if (!effectLogic) return false;
  return effectLogic.includes('OPTIONAL_DISCARD_');
}

/**
 * Extrai informações sobre efeitos opcionais de um effect_logic
 */
export function extractOptionalEffects(effectLogic: string | null): Array<{
  type: string;
  effect: string;
  cost: string;
  duration?: number;
}> {
  if (!effectLogic) return [];
  
  const optionalEffects: Array<{
    type: string;
    effect: string;
    cost: string;
    duration?: number;
  }> = [];
  
  const statements = effectLogic.split(';');
  
  for (const statement of statements) {
    const trimmed = statement.trim();
    
    if (trimmed.startsWith('OPTIONAL_DISCARD_')) {
      const [type, amount, duration] = trimmed.split(':');
      
      let effectDescription = '';
      let costDescription = '';
      
      switch (type) {
        case 'OPTIONAL_DISCARD_BOOST_FARM':
          effectDescription = `+${amount} alimento para todas as fazendas por ${duration} turnos`;
          costDescription = 'Descartar 1 carta da mão';
          break;
        case 'OPTIONAL_DISCARD_BOOST_CITY':
          effectDescription = `+${amount} moedas para todas as cidades por ${duration} turnos`;
          costDescription = 'Descartar 1 carta da mão';
          break;
        case 'OPTIONAL_DISCARD_BOOST_LANDMARK':
          effectDescription = `+${amount} recurso para todos os landmarks por ${duration} turnos`;
          costDescription = 'Descartar 1 carta da mão';
          break;
        case 'OPTIONAL_DISCARD_BUY_MAGIC_CARD':
          effectDescription = 'Comprar 1 carta mágica';
          costDescription = 'Descartar 1 carta da mão';
          break;
        case 'OPTIONAL_DISCARD_ELEMENTAL':
          effectDescription = `Invocar um elemental que produz ${amount} material por ${duration} turnos`;
          costDescription = 'Descartar 1 carta da mão';
          break;
        case 'INVOKE_RANDOM_ELEMENTAL':
          effectDescription = `Invocar um elemental aleatório poderoso`;
          costDescription = 'Descartar 1 carta da mão';
          break;
        case 'OPTIONAL_DISCARD_GAIN_MATERIALS':
          effectDescription = `Descartar 1 carta para ganhar ${amount} materiais imediatamente`;
          costDescription = 'Descartar 1 carta da mão';
          break;
      }
      
      optionalEffects.push({
        type,
        effect: effectDescription,
        cost: costDescription,
        duration: duration ? parseInt(duration) : undefined
      });
    }
    // Novo: reconhecer OPTIONAL_PAY_COINS
    if (trimmed.startsWith('OPTIONAL_PAY_COINS')) {
      const [type, coins, action, amount] = trimmed.split(':');
      let effectDescription = '';
      let costDescription = '';
      if (type === 'OPTIONAL_PAY_COINS' && action === 'DRAW_CARD') {
        effectDescription = `Pagar ${coins} moedas para comprar ${amount} carta(s) do baralho`;
        costDescription = `Pagar ${coins} moedas`;
      }
      optionalEffects.push({
        type,
        effect: effectDescription,
        cost: costDescription,
        duration: undefined
      });
    }
  }
  
  return optionalEffects;
}
