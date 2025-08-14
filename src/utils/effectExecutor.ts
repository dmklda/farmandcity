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
      // Implementar sistema de defesa
      break;
    case 'GAIN_LANDMARK':
      // Implementar sistema de landmarks
      break;
    case 'GAIN_REPUTATION':
      // Implementar sistema de reputação
      break;
    case 'BOOST_ALL_FARMS_FOOD':
      // Implementar boost para todas as fazendas
      break;
    case 'OPTIONAL_DISCARD_BOOST_FARM':
      // Implementar boost opcional de fazenda (requer descarte de carta)
      // Este efeito será tratado pelo sistema de UI para escolha do jogador
      break;
    case 'OPTIONAL_DISCARD_BUY_MAGIC_CARD':
      // Implementar compra opcional de carta mágica (requer descarte de carta)
      // Este efeito será tratado pelo sistema de UI para escolha do jogador
      break;
    case 'BOOST_ALL_CONSTRUCTIONS_DOUBLE':
      // Implementar boost duplo para todas as construções
      // Este efeito será tratado pelo sistema de boost
      break;
    case 'BOOST_ALL_CITIES_COINS':
      // Implementar boost para todas as cidades
      break;
    case 'BOOST_ALL_CITIES':
      // Implementar boost para todas as cidades
      break;
    case 'BOOST_ALL_FARMS':
      // Implementar boost para todas as fazendas
      break;
    case 'TRADE_MATERIALS_FOR_FOOD':
      // Implementar sistema de troca
      break;
    case 'TRADE_FOOD_FOR_COINS':
      // Implementar sistema de troca
      break;
    case 'TRADE_COINS_FOR_MATERIALS':
      // Implementar sistema de troca
      break;
    case 'CANCEL_EVENT':
      // Implementar cancelamento de eventos
      break;
    case 'BLOCK_NEXT_NEGATIVE_EVENT':
      // Implementar bloqueio de eventos negativos
      break;
    case 'DESTROY_CARD':
      // Implementar destruição de cartas
      break;
    case 'STEAL_CARD':
      // Implementar roubo de cartas
      break;
    case 'PROTECT_AGAINST_EVENTS':
      // Implementar proteção contra eventos
      break;
    case 'ABSORB_NEGATIVE_EFFECTS':
      // Implementar absorção de efeitos negativos
      break;
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
  // Extrair todas as cartas dos grids
  const allCards = [
    ...gameState.farmGrid.flat().map(cell => cell.card).filter(Boolean),
    ...gameState.cityGrid.flat().map(cell => cell.card).filter(Boolean),
    ...gameState.landmarksGrid.flat().map(cell => cell.card).filter(Boolean),
    ...gameState.eventGrid.flat().map(cell => cell.card).filter(Boolean)
  ] as Card[];
  
  switch (condition) {
    case 'IF_CITY_EXISTS':
      return allCards.some(card => card.type === 'city');
      
    case 'IF_FARMS_GE_3':
      return allCards.filter(card => card.type === 'farm').length >= 3;
      
    case 'IF_WORKSHOPS_GE_2':
      return allCards.filter(card => card.type === 'city' && card.name.toLowerCase().includes('oficina')).length >= 2;
      
    case 'IF_MAGIC_EXISTS':
      return allCards.filter(card => card.type === 'magic').length > 0;
      
    case 'IF_WATER_EXISTS':
      return allCards.some(card => card.name.toLowerCase().includes('poço') || card.name.toLowerCase().includes('agua'));
      
    case 'IF_COINS_GE_5':
      return (gameState.resources.coins || 0) >= 5;
      
    case 'IF_CELESTIAL_FARMS_EXIST':
      return allCards.some(card => card.type === 'farm' && card.tags && card.tags.includes('celestial'));
      
    case 'IF_VERTICAL_FARMS_EXIST':
      return allCards.some(card => card.type === 'farm' && card.tags && card.tags.includes('vertical'));
      
    default:
      return false;
  }
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
  
  for (const conditionalEffect of effects) {
    if (checkCondition(conditionalEffect.type, gameState)) {
      const effectChanges = executeSimpleEffect(conditionalEffect.effect, gameState, cardId);
      
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
  if (!effectLogic) return {};
  
  const parsed = parseEffectLogic(effectLogic);
  if (!parsed) return {};
  
  const totalChanges: Partial<Resources> = {};
  
  // Executar efeitos simples
  if (parsed.simple && parsed.simple.length > 0) {
    const simpleChanges = executeSimpleEffects(parsed.simple, gameState, cardId);
    mergeResourceChanges(totalChanges, simpleChanges);
  }
  
  // Executar efeitos condicionais
  if (parsed.conditional && parsed.conditional.length > 0) {
    const conditionalChanges = executeConditionalEffects(parsed.conditional, gameState, cardId);
    mergeResourceChanges(totalChanges, conditionalChanges);
  }
  
  // Executar efeitos de dado
  if (parsed.dice && parsed.dice.length > 0 && diceNumber !== undefined) {
    const diceChanges = executeDiceEffects(parsed.dice, diceNumber, gameState, cardId);
    mergeResourceChanges(totalChanges, diceChanges);
  }
  
  // Executar efeitos aleatórios
  if (parsed.random && parsed.random.length > 0) {
    const randomChanges = executeRandomEffects(parsed.random, gameState, cardId);
    mergeResourceChanges(totalChanges, randomChanges);
  }
  
  // Executar boost de construções
  if (parsed.constructionBoost && parsed.constructionBoost.length > 0) {
    const boostChanges = executeConstructionBoostEffects(parsed.constructionBoost, gameState, cardId);
    mergeResourceChanges(totalChanges, boostChanges);
  }
  
  // Executar efeitos complexos
  if (parsed.complex) {
    const complexChanges = executeComplexEffect(parsed.complex, gameState);
    mergeResourceChanges(totalChanges, complexChanges);
  }
  
  // ===== SISTEMA DE RESTRIÇÕES TEMPORÁRIAS =====
  // Aplicar restrições temporárias se existirem
  if (effectLogic.includes('RESTRICT_CARD_TYPES:')) {
    const restrictions = extractRestrictions(effectLogic);
    if (restrictions.length > 0) {
      applyCardRestrictions(restrictions, cardId, gameState);
    }
  }
  
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
      const currentValue = gameState.resources[resource as keyof Resources] || 0;
      gameState.resources[resource as keyof Resources] = Math.max(0, currentValue + amount);
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
      }
      
      optionalEffects.push({
        type,
        effect: effectDescription,
        cost: costDescription,
        duration: duration ? parseInt(duration) : undefined
      });
    }
  }
  
  return optionalEffects;
}
