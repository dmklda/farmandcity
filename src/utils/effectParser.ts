import { 
  SimpleEffect, 
  ConditionalEffect, 
  DiceProductionEffect, 
  ComplexEffect, 
  CardEffectLogic,
  SimpleEffectType,
  EffectFrequency,
  CardRestriction,
  CardRestrictionType,
  RandomEffect
} from '../types/card';

export function parseEffectLogic(effectLogic: string): CardEffectLogic | null {
  console.log('[PARSER DEBUG] ===== INICIANDO PARSING =====');
  console.log('[PARSER DEBUG] EffectLogic recebido:', effectLogic);
  
  if (!effectLogic || effectLogic.trim() === '') {
    console.log('[PARSER DEBUG] EffectLogic vazio ou null');
    return null;
  }
  
  const statements = effectLogic.split(';').map(s => s.trim()).filter(s => s.length > 0);
  console.log('[PARSER DEBUG] Statements extraídos:', statements);
  
  const result: CardEffectLogic = {};
  
  for (const statement of statements) {
    console.log('[PARSER DEBUG] Processando statement:', statement);
    
    // Verificar se é um efeito condicional (IF_*)
    if (statement.startsWith('IF_')) {
      console.log('[PARSER DEBUG] Detectado efeito condicional:', statement);
      parseConditionalEffect(statement, result);
      continue;
    }
    
    // Verificar se é um efeito aleatório (RANDOM_CHANCE)
    if (statement.startsWith('RANDOM_CHANCE')) {
      console.log('[PARSER DEBUG] Detectado efeito aleatório:', statement);
      parseRandomEffect(statement, result);
      continue;
    }
    
    // Verificar se é um efeito de dado (ON_DICE)
    if (statement.startsWith('ON_DICE')) {
      console.log('[PARSER DEBUG] Detectado efeito de dado:', statement);
      parseDiceEffect(statement, result);
      continue;
    }
    
    // Verificar se é um efeito simples
    console.log('[PARSER DEBUG] Processando como efeito simples:', statement);
    parseSimpleEffect(statement, result);
  }
  
  console.log('[PARSER DEBUG] Resultado final:', JSON.stringify(result, null, 2));
  console.log('[PARSER DEBUG] ===== FINALIZANDO PARSING =====');
  return result;
}

function parseConditionalEffect(statement: string, result: CardEffectLogic): void {
  console.log('[PARSER DEBUG] parseConditionalEffect: processando statement:', statement);
  const [condition, ...effects] = statement.split(':');
  console.log('[PARSER DEBUG] Condição:', condition, 'Efeitos:', effects);
  
  if (effects.length === 0) {
    console.log('[PARSER DEBUG] Nenhum efeito encontrado, retornando');
    return;
  }
  
  // Separar múltiplos efeitos por | (operador OR)
  const effectStrings = effects.join(':').split('|');
  console.log('[PARSER DEBUG] Effect strings separados por |:', effectStrings);
  
  for (const effectString of effectStrings) {
    console.log('[PARSER DEBUG] Processando effect string:', effectString.trim());
    const parsedEffect = parseSimpleEffectLogic(effectString.trim());
    if (parsedEffect) {
      if (!result.conditional) result.conditional = [];
      const conditionalEffect = {
        type: condition as any,
        effect: parsedEffect,
        logicalOperator: effectStrings.length > 1 ? ('OR' as const) : ('AND' as const)
      };
      result.conditional.push(conditionalEffect);
      console.log('[PARSER DEBUG] Efeito condicional adicionado:', conditionalEffect);
    } else {
      console.log('[PARSER DEBUG] Falha ao parsear effect string:', effectString.trim());
    }
  }
}

function parseRandomEffect(statement: string, result: CardEffectLogic): void {
  console.log('[PARSER DEBUG] parseRandomEffect: processando statement:', statement);
  const [_, chance, ...effects] = statement.split(':');
  console.log('[PARSER DEBUG] Chance:', chance, 'Efeitos:', effects);
  
  if (effects.length === 0) {
    console.log('[PARSER DEBUG] Nenhum efeito encontrado, retornando');
    return;
  }
  
  // Separar efeito principal e fallback por |
  const effectStrings = effects.join(':').split('|');
  console.log('[PARSER DEBUG] Effect strings separados por |:', effectStrings);
  
  if (effectStrings.length >= 2) {
    console.log('[PARSER DEBUG] Processando efeito principal e fallback');
    const mainEffect = parseSimpleEffectLogic(effectStrings[0].trim());
    const fallbackEffect = parseSimpleEffectLogic(effectStrings[1].trim());
    
    if (mainEffect) {
      if (!result.random) result.random = [];
      const randomEffect = {
        type: 'RANDOM_CHANCE' as const,
        chance: parseInt(chance) || 50,
        effects: [mainEffect],
        fallbackEffect: fallbackEffect || undefined
      };
      result.random.push(randomEffect);
      console.log('[PARSER DEBUG] Efeito aleatório adicionado:', randomEffect);
    } else {
      console.log('[PARSER DEBUG] Falha ao parsear efeito principal');
    }
  } else if (effectStrings.length === 1) {
    console.log('[PARSER DEBUG] Processando apenas efeito principal');
    const mainEffect = parseSimpleEffectLogic(effectStrings[0].trim());
    if (mainEffect) {
      if (!result.random) result.random = [];
      const randomEffect = {
        type: 'RANDOM_CHANCE' as const,
        chance: parseInt(chance) || 50,
        effects: [mainEffect]
      };
      result.random.push(randomEffect);
      console.log('[PARSER DEBUG] Efeito aleatório adicionado:', randomEffect);
    } else {
      console.log('[PARSER DEBUG] Falha ao parsear efeito principal');
    }
  }
}

function parseDiceEffect(statement: string, result: CardEffectLogic): void {
  console.log('[PARSER DEBUG] parseDiceEffect: processando statement:', statement);
  const [_, diceNumbers, ...effects] = statement.split(':');
  console.log('[PARSER DEBUG] Dice numbers:', diceNumbers, 'Efeitos:', effects);
  
  if (effects.length === 0) {
    console.log('[PARSER DEBUG] Nenhum efeito encontrado, retornando');
    return;
  }
  
  const diceNumbersArray = diceNumbers ? diceNumbers.split(',').map(n => parseInt(n.trim())) : [6];
  console.log('[PARSER DEBUG] Dice numbers array:', diceNumbersArray);
  
  const parsedDiceEffect = parseSimpleEffectLogic(effects.join(':'));
  console.log('[PARSER DEBUG] Efeito de dado parseado:', parsedDiceEffect);
  
  if (parsedDiceEffect) {
    if (!result.dice) result.dice = [];
    const diceEffect = {
      type: 'ON_DICE' as const,
      diceNumbers: diceNumbersArray,
      effect: parsedDiceEffect
    };
    result.dice.push(diceEffect);
    console.log('[PARSER DEBUG] Efeito de dado adicionado:', diceEffect);
  } else {
    console.log('[PARSER DEBUG] Falha ao parsear efeito de dado');
  }
}

function parseSimpleEffect(statement: string, result: CardEffectLogic): void {
  console.log('[PARSER DEBUG] parseSimpleEffect: processando statement:', statement);
  const [effectType, ...params] = statement.split(':');
  console.log('[PARSER DEBUG] EffectType:', effectType, 'Params:', params);
  
  switch (effectType) {
    case 'PRODUCE_FOOD':
    case 'PRODUCE_COINS':
    case 'PRODUCE_MATERIALS':
    case 'PRODUCE_POPULATION':
    case 'PRODUCE_REPUTATION':
    case 'GAIN_FOOD':
    case 'GAIN_COINS':
    case 'GAIN_MATERIALS':
    case 'GAIN_POPULATION':
    case 'GAIN_REPUTATION':
    case 'LOSE_FOOD':
    case 'LOSE_COINS':
    case 'LOSE_MATERIALS':
    case 'LOSE_POPULATION':
    case 'COST_FOOD':
    case 'COST_COINS':
    case 'COST_MATERIALS':
    case 'COST_POPULATION':
    case 'TRADE_FOOD_FOR_MATERIALS':
    case 'TRADE_MATERIALS_FOR_FOOD':
    case 'TRADE_FOOD_FOR_COINS':
    case 'TRADE_COINS_FOR_MATERIALS':
    case 'BOOST_ALL_CONSTRUCTIONS':
    case 'BOOST_ALL_FARMS_FOOD_TEMP':
    case 'BOOST_ALL_CITIES_COINS_TEMP':
    case 'BOOST_ALL_FARMS_MATERIALS_TEMP':
    case 'BOOST_MAGIC_COST_REDUCTION_TEMP':
    case 'BOOST_ALL_FARMS_FOOD':
    case 'BOOST_ALL_CITIES_COINS':
    case 'BOOST_ALL_CITIES_MATERIALS':
    case 'BOOST_ALL_CITIES_MATERIALS_TEMP':
    case 'BOOST_MAGIC_COST_REDUCTION':
    case 'BOOST_ALL_FARMS_POPULATION':
    case 'BOOST_ALL_CITIES_POPULATION':
    case 'BOOST_ALL_CONSTRUCTIONS_DOUBLE':
    case 'BOOST_ALL_CITIES':
    case 'BOOST_ALL_FARMS':
    case 'BOOST_ALL_CITIES_TEMP':
    case 'BOOST_ALL_FARMS_TEMP':
    case 'BOOST_ALL_CITIES_COINS_TEMP':
    case 'BOOST_ALL_CITIES_WITH_TAG_WORKSHOP_MATERIALS':
    case 'BOOST_ALL_CITIES_WITH_TAG_WORKSHOP_COINS':
    case 'OPTIONAL_DISCARD_ELEMENTAL':
    case 'INVOKE_RANDOM_ELEMENTAL':
    case 'OPTIONAL_DISCARD_GAIN_MATERIALS':
    case 'OPTIONAL_DISCARD_BOOST_FARM':
    case 'OPTIONAL_DISCARD_BOOST_CITY':
    case 'OPTIONAL_DISCARD_BUY_MAGIC_CARD':
    case 'INDESTRUCTIBLE':
    case 'BLOCK_NEXT_NEGATIVE_EVENT':
    case 'ON_PLAY_FARM':
    case 'ON_PLAY_CITY':
    case 'ON_PLAY_MAGIC':
    case 'DRAW_CARD':
    case 'DRAW_CITY_CARD':
    case 'DUPLICATE_MAGIC_EFFECTS':
    case 'RESTRICT_FARM_ACTIVATION':
    case 'OPTIONAL_PAY_COINS':
    case 'GAIN_GEM':
    case 'REDUCE_FARM_PRODUCTION':
    case 'BOOST_FARM_PRODUCTION':
    case 'PROTECT_FARMS':
    case 'LOSE_CARD':
    case 'STEAL_CARD':
    case 'RETURN_GRAVEYARD_CARD':
    case 'RESTORE_POPULATION':
    case 'GAIN_DEFENSE':
    case 'GAIN_LANDMARK':
    case 'EXTRA_CARD_PLAY':
    case 'CANCEL_EVENT':
    case 'BLOCK_NEXT_NEGATIVE_EVENT':
    case 'DESTROY_CARD':
    case 'STEAL_CARD':
    case 'PROTECT_AGAINST_EVENTS':
    case 'ABSORB_NEGATIVE_EFFECTS':
    case 'EXTRA_BUILD_CITY':
    case 'REDUCE_PRODUCTION':
    case 'REDUCE_CITY_COST':
    case 'DISCARD_CARD':
    case 'CREATE_CITY_CARD':
    case 'BOOST_CONSTRUCTIONS':
    case 'BOOST_CITY_COST_REDUCTION':
      if (!result.simple) result.simple = [];
      const specialEffect = {
        type: effectType as SimpleEffectType,
        amount: parseInt(params[0]) || 0,
        frequency: determineEffectFrequency(effectType as SimpleEffectType),
        duration: params[1] ? parseInt(params[1]) : undefined,
        turnInterval: params[2] ? parseInt(params[2]) : undefined,
        description: statement // Guardar statement completo para efeitos complexos
      };
      result.simple.push(specialEffect);
      console.log('[PARSER DEBUG] Efeito especial adicionado:', specialEffect);
      break;
    case 'BOOST_MAGIC_COST_REDUCTION_TEMP':
    case 'RESTRICT_ACTION_CARDS':
    case 'RESTRICT_MAGIC_CARDS':
    case 'RESTRICT_CITY_CARDS':
    case 'RESTRICT_FARM_CARDS':
    case 'RESTRICT_EVENT_CARDS':
    case 'RESTRICT_LANDMARK_CARDS':
    case 'BLOCK_ACTION':
    case 'DEACTIVATE_CITY_CARD':
    case 'DESTROY_OWN_CARD':
      if (!result.simple) result.simple = [];
      const simpleEffect = {
        type: effectType as SimpleEffectType,
        amount: parseInt(params[0]) || 0,
        frequency: determineEffectFrequency(effectType as SimpleEffectType),
        duration: params[1] ? parseInt(params[1]) : undefined,
        turnInterval: params[2] ? parseInt(params[2]) : undefined
      };
      result.simple.push(simpleEffect);
      console.log('[PARSER DEBUG] Efeito simples adicionado:', simpleEffect);
      break;
      
    case 'IF_CELESTIAL_FARMS_EXIST':
    case 'IF_VERTICAL_FARMS_EXIST':
    case 'IF_HORTA_EXISTS':
    case 'IF_MAGIC_EXISTS':
    case 'IF_HAND_GE_5':
    case 'IF_CITY_GE_3':
    case 'IF_POPULATION_GE_2':
    case 'IF_WATER_EXISTS':
    case 'IF_SACRED_TAG_EXISTS':
    case 'IF_CITY_EXISTS':
    case 'IF_FARMS_GE_3':
    case 'IF_WORKSHOPS_GE_2':
    case 'IF_COINS_GE_5':
    case 'IF_COINS_GE_10':
    case 'IF_TEMPLE_EXISTS':
      console.log('[PARSER DEBUG] Detectado efeito condicional no parseSimpleEffect:', effectType);
      if (!result.conditional) result.conditional = [];
      const parsedEffect = parseSimpleEffectLogic(params.join(':'));
      if (parsedEffect) {
        const conditionalEffect = {
          type: effectType as any,
          effect: parsedEffect,
          logicalOperator: 'AND' as const
        };
        result.conditional.push(conditionalEffect);
        console.log('[PARSER DEBUG] Efeito condicional adicionado no parseSimpleEffect:', conditionalEffect);
      } else {
        console.log('[PARSER DEBUG] Falha ao parsear efeito condicional no parseSimpleEffect');
      }
      break;
      
    case 'ON_DICE':
      console.log('[PARSER DEBUG] Detectado efeito de dado no parseSimpleEffect:', effectType);
      if (!result.dice) result.dice = [];
      const diceNumbers = params[0] ? params[0].split(',').map(n => parseInt(n.trim())) : [6];
      const parsedDiceEffect = parseSimpleEffectLogic(params.slice(1).join(':'));
      if (parsedDiceEffect) {
        const diceEffect = {
          type: 'ON_DICE' as const,
          diceNumbers,
          effect: parsedDiceEffect
        };
        result.dice.push(diceEffect);
        console.log('[PARSER DEBUG] Efeito de dado adicionado no parseSimpleEffect:', diceEffect);
      } else {
        console.log('[PARSER DEBUG] Falha ao parsear efeito de dado no parseSimpleEffect');
      }
      break;
  }
  
  console.log('[PARSER DEBUG] parseSimpleEffect: finalizado para statement:', statement);
}

function parseSimpleEffectLogic(logic: string): SimpleEffect | null {
  console.log('[PARSER DEBUG] parseSimpleEffectLogic: processando logic:', logic);
  
  if (!logic || logic.trim() === '') {
    console.log('[PARSER DEBUG] Logic vazio ou null');
    return null;
  }
  
  // Tratamento especial para BOOST_CONSTRUCTIONS
  if (logic.includes('BOOST_CONSTRUCTIONS:')) {
    console.log('[PARSER DEBUG] Detectado BOOST_CONSTRUCTIONS, parsing especial');
    const [effectType, resourceType, amount, targetTypes] = logic.split(':');
    
    return {
      type: effectType as SimpleEffectType,
      amount: parseInt(amount) || 1,
      frequency: determineEffectFrequency(effectType as SimpleEffectType),
      description: logic // Guardar a string completa para usar na execução
    };
  }
  
  // Tratamento especial para BOOST_CITY_COST_REDUCTION
  if (logic.includes('BOOST_CITY_COST_REDUCTION:')) {
    console.log('[PARSER DEBUG] Detectado BOOST_CITY_COST_REDUCTION, parsing especial');
    const [effectType, amount, duration] = logic.split(':');
    
    return {
      type: effectType as SimpleEffectType,
      amount: parseInt(amount) || 1,
      duration: parseInt(duration) || 1,
      frequency: determineEffectFrequency(effectType as SimpleEffectType)
    };
  }
  
  const [effectType, amount, duration] = logic.split(':');
  console.log('[PARSER DEBUG] EffectType:', effectType, 'Amount:', amount, 'Duration:', duration);
  
  const parsedEffect = {
    type: effectType as SimpleEffectType,
    amount: parseInt(amount) || 0,
    frequency: determineEffectFrequency(effectType as SimpleEffectType),
    duration: duration ? parseInt(duration) : undefined
  };
  
  console.log('[PARSER DEBUG] Efeito parseado:', parsedEffect);
  return parsedEffect;
}

function determineEffectFrequency(effectType: SimpleEffectType): EffectFrequency {
  console.log('[PARSER DEBUG] determineEffectFrequency: determinando frequência para', effectType);
  
  let frequency: EffectFrequency;
  
  switch (effectType) {
    case 'PRODUCE_FOOD':
    case 'PRODUCE_COINS':
    case 'PRODUCE_MATERIALS':
    case 'PRODUCE_POPULATION':
    case 'PRODUCE_REPUTATION':
      frequency = 'PER_TURN';
      break;
    case 'BOOST_ALL_FARMS_FOOD_TEMP':
    case 'BOOST_ALL_CITIES_COINS_TEMP':
    case 'BOOST_ALL_FARMS_MATERIALS_TEMP':
    case 'BOOST_MAGIC_COST_REDUCTION_TEMP':
    case 'BOOST_ALL_CITIES_MATERIALS_TEMP':
    case 'BOOST_ALL_CITIES_COINS_TEMP':
    case 'BOOST_ALL_FARMS_FOOD_TEMP':
    case 'BOOST_ALL_FARMS_MATERIALS_TEMP':
    case 'BOOST_CITY_COST_REDUCTION':
      frequency = 'TEMPORARY';
      break;
    case 'BOOST_ALL_FARMS_FOOD':
    case 'BOOST_ALL_CITIES_COINS':
    case 'BOOST_ALL_CONSTRUCTIONS':
    case 'BOOST_ALL_CITIES_MATERIALS':
    case 'BOOST_MAGIC_COST_REDUCTION':
    case 'BOOST_ALL_FARMS_POPULATION':
    case 'BOOST_ALL_CITIES_POPULATION':
    case 'BOOST_ALL_CONSTRUCTIONS_DOUBLE':
    case 'BOOST_ALL_CITIES':
    case 'BOOST_ALL_FARMS':
    case 'BOOST_CONSTRUCTIONS':
      frequency = 'CONTINUOUS';
      break;
    default:
      frequency = 'ONCE';
      break;
  }
  
  console.log('[PARSER DEBUG] Frequência determinada:', frequency, 'para', effectType);
  return frequency;
}

export function extractRestrictions(effectLogic: string): CardRestriction[] {
  const restrictions: CardRestriction[] = [];
  if (effectLogic.includes('RESTRICT_CARD_TYPES:')) {
    const parts = effectLogic.split('RESTRICT_CARD_TYPES:')[1].split(';')[0];
    const cardTypes = parts.split(',').map(t => t.trim() as CardRestrictionType);
    restrictions.push({
      id: `restriction_${Date.now()}_${Math.random()}`,
      restrictedTypes: cardTypes,
      duration: 1,
      scope: 'next_turn',
      appliedAt: 0,
      appliedBy: 'system',
      description: `Restrição: ${cardTypes.join(', ')} não podem ser jogadas`,
      isActive: true
    });
  }
  return restrictions;
}
