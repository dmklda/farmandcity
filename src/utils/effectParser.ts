// Sistema Híbrido de Parsing de Efeitos
// Combina parsing simples para efeitos básicos e JSON para efeitos complexos

import { 
  SimpleEffect, 
  ConditionalEffect, 
  DiceProductionEffect, 
  ComplexEffect, 
  CardEffectLogic,
  SimpleEffectType,
  EffectFrequency,
  RandomEffect,
  ConstructionBoostEffect,
  CardRestriction,
  CardRestrictionType,
  RestrictionScope
} from '../types/card';

// ===== PARSER DE EFEITOS SIMPLES =====

/**
 * Converte uma string de effect_logic simples em um array de efeitos
 * Formato: "PRODUCE_FOOD:3;GAIN_COINS:2"
 */
export function parseSimpleEffectLogic(effectLogic: string): SimpleEffect[] {
  const effects: SimpleEffect[] = [];
  const statements = effectLogic.split(';');
  
  for (const statement of statements) {
    const [type, ...params] = statement.trim().split(':');
    
    if (!type || !params.length) continue;
    
    const effectType = type.trim() as SimpleEffectType;
    const amount = parseInt(params[0]);
    
    if (isNaN(amount)) continue;
    
    const effect: SimpleEffect = {
      type: effectType,
      amount: amount
    };
    
    // Determinar frequência baseada no tipo de efeito
    effect.frequency = determineEffectFrequency(effectType, params);
    
    // Processar parâmetros adicionais
    if (params.length > 1) {
      const secondParam = params[1];
      // Para efeitos de troca, o segundo parâmetro é o recurso a receber
      if (
        effectType === 'TRADE_MATERIALS_FOR_FOOD' ||
        effectType === 'TRADE_FOOD_FOR_COINS' ||
        effectType === 'TRADE_COINS_FOR_MATERIALS'
      ) {
        if (!isNaN(parseInt(secondParam))) {
          (effect as any).extraAmount = parseInt(secondParam);
        }
      } else if (!isNaN(parseInt(secondParam))) {
        if (effect.frequency === 'ON_TURN_X') {
          effect.turnInterval = parseInt(secondParam);
        } else {
          effect.duration = parseInt(secondParam);
        }
      } else {
        effect.condition = secondParam;
      }
      // Processar terceiro parâmetro se existir
      if (params.length > 2) {
        const thirdParam = params[2];
        if (!isNaN(parseInt(thirdParam))) {
          effect.duration = parseInt(thirdParam);
        }
      }
    }
    
    // Definir máximo de execuções para efeitos únicos
    if (effect.frequency === 'ONCE') {
      effect.maxExecutions = 1;
    }
    
    effects.push(effect);
  }
  
  return effects;
}

/**
 * Determina a frequência de um efeito baseado no tipo
 */
function determineEffectFrequency(effectType: SimpleEffectType, params: string[]): EffectFrequency {
  // Efeitos que executam apenas uma vez
  if (effectType.startsWith('GAIN_') || 
      effectType.startsWith('LOSE_') || 
      effectType.startsWith('COST_') ||
      effectType === 'RESTORE_POPULATION' ||
      effectType === 'GAIN_DEFENSE' ||
      effectType === 'GAIN_LANDMARK' ||
      effectType === 'GAIN_REPUTATION' ||
      effectType === 'DESTROY_CARD' ||
      effectType === 'STEAL_CARD' ||
      effectType === 'CANCEL_EVENT' ||
      effectType === 'BLOCK_NEXT_NEGATIVE_EVENT') {
    return 'ONCE';
  }
  
  // Efeitos que executam a cada turno
  if (effectType.startsWith('PRODUCE_') ||
      effectType.startsWith('BOOST_') ||
      effectType === 'RESTRICT_ACTION_CARDS' ||
      effectType === 'RESTRICT_MAGIC_CARDS' ||
      effectType === 'RESTRICT_CITY_CARDS' ||
      effectType === 'RESTRICT_FARM_CARDS' ||
      effectType === 'RESTRICT_EVENT_CARDS' ||
      effectType === 'RESTRICT_LANDMARK_CARDS') {
    return 'PER_TURN';
  }
  
  // Efeitos temporários (com duração específica)
  if (effectType.endsWith('_TEMP') ||
      effectType === 'BOOST_ALL_FARMS_FOOD_TEMP' ||
      effectType === 'BOOST_ALL_CITIES_COINS_TEMP' ||
      effectType === 'BOOST_ALL_CITIES_TEMP' ||
      effectType === 'BOOST_ALL_FARMS_TEMP') {
    return 'TEMPORARY'; // Executa por X turnos
  }
  
  // Efeitos condicionais
  if (effectType.startsWith('IF_') || 
      effectType === 'BLOCK_ACTION' ||
      effectType === 'DEACTIVATE_CITY_CARD') {
    return 'ON_CONDITION';
  }
  
  // Efeitos opcionais (descartar carta para ativar)
  if (effectType.startsWith('OPTIONAL_DISCARD_') ||
      effectType === 'OPTIONAL_DISCARD_BOOST_FARM' ||
      effectType === 'OPTIONAL_DISCARD_BOOST_CITY' ||
      effectType === 'OPTIONAL_DISCARD_BOOST_LANDMARK' ||
      effectType === 'OPTIONAL_DISCARD_BUY_MAGIC_CARD' ||
      effectType === 'OPTIONAL_DISCARD_ELEMENTAL') {
    return 'ON_CONDITION'; // Executa se jogador escolher
  }
  
  // Efeitos de boost para todas as construções
  if (effectType === 'BOOST_ALL_CONSTRUCTIONS_DOUBLE') {
    return 'PER_TURN'; // Executa a cada turno
  }
  
  // Efeitos contínuos
  if (effectType === 'PROTECT_AGAINST_EVENTS' ||
      effectType === 'ABSORB_NEGATIVE_EFFECTS') {
    return 'CONTINUOUS';
  }
  
  // Padrão: executa a cada turno
  return 'PER_TURN';
}

/**
 * Converte uma string de effect_logic condicional em um array de efeitos condicionais
 * Formato: "IF_CITY_EXISTS:GAIN_COINS:5"
 */
export function parseConditionalEffectLogic(effectLogic: string): ConditionalEffect[] {
  const effects: ConditionalEffect[] = [];
  
  // Primeiro verificamos se há condições com operador AND (;) ou OR (|)
  let statements: string[];
  let isOrOperator = false;
  
  if (effectLogic.includes('|')) {
    statements = effectLogic.split('|');
    isOrOperator = true;
    console.log('[PARSER DEBUG] Detectado operador OR (|) para condições:', statements);
  } else {
    statements = effectLogic.split(';');
    console.log('[PARSER DEBUG] Detectado operador AND (;) para condições:', statements);
  }
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i].trim();
    
    if (statement.startsWith('IF_')) {
      const [condition, ...effectParams] = statement.split(':');
      
      if (effectParams.length >= 2) {
        const effectType = effectParams[0] as SimpleEffectType;
        const amount = parseInt(effectParams[1]);
        
        if (!isNaN(amount)) {
          const conditionalEffect: ConditionalEffect = {
            type: condition as any,
            effect: {
              type: effectType,
              amount: amount,
              frequency: 'ON_CONDITION'
            },
            // Adicionamos uma propriedade para indicar o tipo de operador lógico
            logicalOperator: isOrOperator ? 'OR' : 'AND'
          };
          
          effects.push(conditionalEffect);
        }
      }
    } else {
      // Se não começar com IF_, é um efeito simples após o operador OR
      // Por exemplo: "IF_CITY_EXISTS:GAIN_COINS:5|GAIN_COINS:3"
      // Nesse caso, criamos um efeito condicional especial "FALLBACK" que sempre é verdadeiro
      if (isOrOperator && statement.includes(':')) {
        const effectParams = statement.split(':');
        if (effectParams.length >= 2) {
          const effectType = effectParams[0] as SimpleEffectType;
          const amount = parseInt(effectParams[1]);
          
          if (!isNaN(amount)) {
            const conditionalEffect: ConditionalEffect = {
              type: 'FALLBACK' as any, // Tipo especial que sempre retorna true
              effect: {
                type: effectType,
                amount: amount,
                frequency: 'ON_CONDITION'
              },
              logicalOperator: 'OR'
            };
            
            effects.push(conditionalEffect);
            console.log('[PARSER DEBUG] Adicionado efeito FALLBACK para operador OR:', conditionalEffect);
          }
        }
      }
    }
  }
  
  return effects;
}

/**
 * Converte uma string de effect_logic com dados em efeitos de produção por dado
 * Formato: "PRODUCE_FOOD:1:ON_DICE:1,2"
 */
export function parseDiceEffectLogic(effectLogic: string): DiceProductionEffect[] {
  const effects: DiceProductionEffect[] = [];
  const statements = effectLogic.split(';');
  
  for (const statement of statements) {
    if (statement.includes('ON_DICE:')) {
      const [effectPart, dicePart] = statement.split('ON_DICE:');
      const [type, amount] = effectPart.split(':');
      
      if (type && amount) {
        const effectType = type.trim() as SimpleEffectType;
        const effectAmount = parseInt(amount);
        const diceNumbers = dicePart.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d));
        
        if (!isNaN(effectAmount) && diceNumbers.length > 0) {
          const diceEffect: DiceProductionEffect = {
            type: 'ON_DICE',
            diceNumbers: diceNumbers,
            effect: {
              type: effectType,
              amount: effectAmount,
              frequency: 'ON_DICE'
            }
          };
          
          // Reduzir logs excessivos - só logar em casos específicos
          // Usando uma variável para controlar os logs de dados
          const debugDice = false; // Mudar para true para ativar logs de dados
          if (debugDice) {
            console.log(`[DICE PARSER] Efeito de dado analisado: ${effectType} ${effectAmount} para dados ${diceNumbers.join(',')}`);
          }
          effects.push(diceEffect);
        }
      }
    }
  }
  
  return effects;
}

// ===== NOVOS PARSERS PARA EFEITOS COMPLEXOS =====

/**
 * Converte uma string de effect_logic com efeitos aleatórios
 * Formato: "RANDOM_CHANCE:50:PRODUCE_MATERIALS:2|LOSE_MATERIALS:1"
 */
export function parseRandomEffectLogic(effectLogic: string): RandomEffect[] {
  const effects: RandomEffect[] = [];
  const statements = effectLogic.split(';');
  
  for (const statement of statements) {
    if (statement.startsWith('RANDOM_CHANCE:')) {
      const [_, chanceStr, ...effectParts] = statement.split(':');
      const chance = parseInt(chanceStr);
      
      if (!isNaN(chance) && effectParts.length > 0) {
        const effectString = effectParts.join(':');
        // Usar '|' como separador para efeitos alternativos
        const [mainEffect, fallbackEffect] = effectString.split('|');
        
        const mainEffects = parseSimpleEffectLogic(mainEffect);
        let fallback: SimpleEffect | undefined;
        
        if (fallbackEffect) {
          const fallbackEffects = parseSimpleEffectLogic(fallbackEffect);
          fallback = fallbackEffects[0];
        }
        
        if (mainEffects.length > 0) {
          const randomEffect: RandomEffect = {
            type: 'RANDOM_CHANCE',
            chance: chance,
            effects: mainEffects,
            fallbackEffect: fallback
          };
          
          effects.push(randomEffect);
        }
      }
    }
  }
  
  return effects;
}

/**
 * Parser para efeitos ON_PLAY_* 
 * Formato: "ON_PLAY_FARM:GAIN_MATERIALS:1"
 */
export function parseOnPlayEffects(effectLogic: string): SimpleEffect[] {
  const effects: SimpleEffect[] = [];
  const statements = effectLogic.split(';');
  
  for (const statement of statements) {
    if (statement.includes('ON_PLAY_')) {
      const [triggerPart, ...effectParts] = statement.split(':');
      
      if (effectParts.length >= 2) {
        const effectType = effectParts[0] as SimpleEffectType;
        const amount = parseInt(effectParts[1]);
        
        if (!isNaN(amount)) {
          effects.push({
            type: triggerPart as SimpleEffectType, // ON_PLAY_FARM, ON_PLAY_CITY, etc.
            amount: 0, // O trigger em si não tem amount
            target: effectType,
            frequency: 'ON_CONDITION'
          } as any);
          
          // Também adicionar o efeito real que será executado
          effects.push({
            type: effectType,
            amount: amount,
            frequency: 'ON_CONDITION'
          });
        }
      }
    }
  }
  
  return effects;
}

/**
 * Converte uma string de effect_logic com boost de construções
 * Formato: "BOOST_CONSTRUCTIONS:food:1:farm,city"
 */
export function parseConstructionBoostLogic(effectLogic: string): ConstructionBoostEffect[] {
  const effects: ConstructionBoostEffect[] = [];
  const statements = effectLogic.split(';');
  
  for (const statement of statements) {
    if (statement.startsWith('BOOST_CONSTRUCTIONS:')) {
      const [_, resourceType, amountStr, targetTypesStr] = statement.split(':');
      const amount = parseInt(amountStr);
      
      if (!isNaN(amount) && resourceType && targetTypesStr) {
        const targetTypes = targetTypesStr.split(',').map(t => t.trim()) as any[];
        
        const boostEffect: ConstructionBoostEffect = {
          type: 'BOOST_CONSTRUCTIONS',
          resourceType: resourceType as any,
          amount: amount,
          targetTypes: targetTypes,
          frequency: 'PER_TURN'
        };
        
        effects.push(boostEffect);
      }
    }
  }
  
  return effects;
}

// ===== PARSER DE EFEITOS COMPLEXOS (JSON) =====

/**
 * Converte uma string JSON de effect_logic em um objeto ComplexEffect
 */
export function parseComplexEffectLogic(effectLogic: string): ComplexEffect | null {
  try {
    return JSON.parse(effectLogic);
  } catch (error) {
    console.warn('Erro ao fazer parse do JSON:', error);
    return null;
  }
}

// ===== PARSER DE RESTRIÇÕES TEMPORÁRIAS =====

/**
 * Converte uma string de restrição em um objeto CardRestriction
 * Formato: "RESTRICT_CARD_TYPES:action,magic:1:next_turn"
 */
export function parseRestrictionLogic(restrictionLogic: string): CardRestriction | null {
  const [type, types, duration, scope] = restrictionLogic.split(':');
  
  if (type !== 'RESTRICT_CARD_TYPES' || !types || !duration || !scope) {
    return null;
  }
  
  const restrictedTypes = types.split(',').map(t => t.trim()) as CardRestrictionType[];
  const durationNum = parseInt(duration);
  
  if (isNaN(durationNum)) {
    return null;
  }
  
  const restrictionScope = scope.trim() as RestrictionScope;
  
  return {
    id: `restriction_${Date.now()}_${Math.random()}`,
    restrictedTypes,
    duration: durationNum,
    scope: restrictionScope,
    appliedAt: 0, // Será definido pelo executor
    appliedBy: '', // Será definido pelo executor
    description: `Não pode jogar cartas de ${restrictedTypes.join(', ')} por ${durationNum} turno(s)`,
    isActive: true
  };
}

/**
 * Verifica se uma string contém lógica de restrição
 */
export function hasRestrictionLogic(effectLogic: string): boolean {
  return effectLogic.includes('RESTRICT_CARD_TYPES:');
}

/**
 * Extrai restrições de uma string de effect_logic
 */
export function extractRestrictions(effectLogic: string): CardRestriction[] {
  const restrictions: CardRestriction[] = [];
  const statements = effectLogic.split(';');
  
  for (const statement of statements) {
    if (statement.trim().startsWith('RESTRICT_CARD_TYPES:')) {
      const restriction = parseRestrictionLogic(statement.trim());
      if (restriction) {
        restrictions.push(restriction);
      }
    }
  }
  
  return restrictions;
}

// ===== PARSER PRINCIPAL HÍBRIDO =====

/**
 * Parser principal que detecta automaticamente o tipo de effect_logic e retorna o objeto apropriado
 */
export function parseEffectLogic(effectLogic: string | null): CardEffectLogic | null {
  if (!effectLogic) return null;
  
  const result: CardEffectLogic = {};
  
  // Verificar se é um efeito JSON complexo
  if (effectLogic.trim().startsWith('{')) {
    const complex = parseComplexEffectLogic(effectLogic);
    if (complex) {
      result.complex = complex;
      return result;
    }
  }
  
  // Verificar se é um efeito simples
  if (effectLogic.includes('PRODUCE_') || effectLogic.includes('GAIN_') || effectLogic.includes('LOSE_')) {
    result.simple = parseSimpleEffectLogic(effectLogic);
  }
  
  // Verificar se tem efeitos condicionais
  if (effectLogic.includes('IF_')) {
    result.conditional = parseConditionalEffectLogic(effectLogic);
  }
  
  // Verificar se tem efeitos de dado
  if (effectLogic.includes('ON_DICE:')) {
    result.dice = parseDiceEffectLogic(effectLogic);
  }
  
  // Verificar se tem efeitos aleatórios
  if (effectLogic.includes('RANDOM_CHANCE:')) {
    result.random = parseRandomEffectLogic(effectLogic);
  }
  
  // Verificar se tem efeitos ON_PLAY_*
  if (effectLogic.includes('ON_PLAY_')) {
    const onPlayEffects = parseOnPlayEffects(effectLogic);
    if (!result.simple) result.simple = [];
    result.simple.push(...onPlayEffects);
  }

  // Verificar se tem boost de construções
  if (effectLogic.includes('BOOST_CONSTRUCTIONS:')) {
    result.constructionBoost = parseConstructionBoostLogic(effectLogic);
  }
  
  // Se não se encaixou em nenhum padrão, salvar como raw
  if ((!result.simple || result.simple.length === 0) && 
      (!result.conditional || result.conditional.length === 0) && 
      (!result.dice || result.dice.length === 0) && 
      (!result.random || result.random.length === 0) &&
      (!result.constructionBoost || result.constructionBoost.length === 0) &&
      !result.complex) {
    result.raw = effectLogic;
  }
  
  return result;
}

// ===== VALIDADORES =====

/**
 * Valida se um effect_logic é válido
 */
export function validateEffectLogic(effectLogic: string): boolean {
  try {
    const parsed = parseEffectLogic(effectLogic);
    return parsed !== null && (
      (parsed.simple && parsed.simple.length > 0) || 
      (parsed.conditional && parsed.conditional.length > 0) || 
      (parsed.dice && parsed.dice.length > 0) || 
      (parsed.random && parsed.random.length > 0) ||
      (parsed.constructionBoost && parsed.constructionBoost.length > 0) ||
      parsed.complex !== null ||
      parsed.raw !== undefined
    );
  } catch (error) {
    return false;
  }
}

/**
 * Retorna o tipo de effect_logic (simple, complex, mixed, invalid)
 */
export function getEffectLogicType(effectLogic: string): 'simple' | 'complex' | 'mixed' | 'invalid' {
  try {
    const parsed = parseEffectLogic(effectLogic);
    if (!parsed) return 'invalid';
    
    const hasSimple = parsed.simple && parsed.simple.length > 0;
    const hasComplex = parsed.complex !== null;
    const hasConditional = parsed.conditional && parsed.conditional.length > 0;
    const hasDice = parsed.dice && parsed.dice.length > 0;
    const hasRandom = parsed.random && parsed.random.length > 0;
    const hasConstructionBoost = parsed.constructionBoost && parsed.constructionBoost.length > 0;
    
    if (hasComplex && !hasSimple && !hasConditional && !hasDice && !hasRandom && !hasConstructionBoost) return 'complex';
    if (hasSimple && !hasComplex) return 'simple';
    if (hasSimple || hasConditional || hasDice || hasRandom || hasConstructionBoost) return 'mixed';
    
    return 'invalid';
  } catch (error) {
    return 'invalid';
  }
}

// ===== UTILITÁRIOS =====

/**
 * Converte um CardEffectLogic de volta para string (para debugging)
 */
export function effectLogicToString(effectLogic: CardEffectLogic): string {
  if (effectLogic.complex) {
    return JSON.stringify(effectLogic.complex);
  }
  
  const parts: string[] = [];
  
  if (effectLogic.simple) {
    parts.push(...effectLogic.simple.map(e => `${e.type}:${e.amount}${e.frequency ? `:${e.frequency}` : ''}`));
  }
  
  if (effectLogic.conditional) {
    parts.push(...effectLogic.conditional.map(e => `${e.type}:${e.effect.type}:${e.effect.amount}`));
  }
  
  if (effectLogic.dice) {
    parts.push(...effectLogic.dice.map(e => `${e.effect.type}:${e.effect.amount}:ON_DICE:${e.diceNumbers.join(',')}`));
  }
  
  if (effectLogic.random) {
    parts.push(...effectLogic.random.map(e => `RANDOM_CHANCE:${e.chance}:${e.effects.map(ef => `${ef.type}:${ef.amount}`).join(';')}${e.fallbackEffect ? `;${e.fallbackEffect.type}:${e.fallbackEffect.amount}` : ''}`));
  }
  
  if (effectLogic.constructionBoost) {
    parts.push(...effectLogic.constructionBoost.map(e => `BOOST_CONSTRUCTIONS:${e.resourceType}:${e.amount}:${e.targetTypes.join(',')}`));
  }
  
  if (effectLogic.raw) {
    parts.push(effectLogic.raw);
  }
  
  return parts.join(';');
}
