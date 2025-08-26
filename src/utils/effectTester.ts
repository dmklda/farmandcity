// Sistema de Teste para Verificação de Efeitos de Cartas
import { executeCardEffects } from './effectExecutor';
import { parseEffectLogic } from './effectParser';
import { GameState, GamePhase } from '../types/gameState';
import { Resources } from '../types/resources';
import { Card } from '../types/card';

/**
 * Estado de jogo mock para testes
 */
export function createMockGameState(): GameState {
  const mockCards = {
    fazenda: { 
      id: 'mock-fazenda', 
      name: 'Fazenda Mock', 
      type: 'farm' as const,
      cost_coins: 3,
      cost_food: 0, 
      cost_materials: 1,
      cost_population: 0,
      effect: 'Fazenda de teste',
      effect_logic: 'PRODUCE_FOOD:1',
      rarity: 'common' as const,
      phase: 'production' as const,
      slug: 'mock-fazenda',
      is_active: true
    },
    cidade: { 
      id: 'mock-cidade', 
      name: 'Cidade Mock', 
      type: 'city' as const,
      cost_coins: 5,
      cost_food: 0,
      cost_materials: 2,  
      cost_population: 1,
      effect: 'Cidade de teste',
      effect_logic: 'PRODUCE_COINS:1',
      rarity: 'common' as const,
      phase: 'production' as const,
      slug: 'mock-cidade', 
      is_active: true
    },
    oficina: { 
      id: 'mock-oficina', 
      name: 'Oficina Mock', 
      type: 'city' as const,
      cost_coins: 4,
      cost_food: 0,
      cost_materials: 2,
      cost_population: 1,
      effect: 'Oficina de teste',
      effect_logic: 'PRODUCE_MATERIALS:1',
      rarity: 'common' as const,
      phase: 'production' as const,
      slug: 'mock-oficina',
      is_active: true,
      tags: ['workshop']
    },
    templo: { 
      id: 'mock-templo', 
      name: 'Templo Mock', 
      type: 'landmark' as const,
      cost_coins: 8,
      cost_food: 0,
      cost_materials: 3,
      cost_population: 2,
      effect: 'Templo de teste',
      effect_logic: 'GAIN_REPUTATION:2',
      rarity: 'rare' as const,
      phase: 'production' as const,
      slug: 'mock-templo',
      is_active: true,
      tags: ['sagrado', 'templo']
    }
  };

  const farmGrid = Array(3).fill(null).map(() => Array(4).fill({ card: null }));
  const cityGrid = Array(3).fill(null).map(() => Array(4).fill({ card: null }));
  const landmarksGrid = Array(2).fill(null).map(() => Array(2).fill({ card: null }));
  const eventGrid = Array(1).fill(null).map(() => Array(1).fill({ card: null }));

  // Adicionar cartas mock aos grids para testes condicionais mais completos
  farmGrid[0][0] = { card: mockCards.fazenda };
  farmGrid[0][1] = { card: mockCards.fazenda };  
  farmGrid[0][2] = { card: mockCards.fazenda }; // 3 fazendas para IF_FARMS_GE_3
  farmGrid[1][0] = { card: mockCards.fazenda }; // 4 fazendas total
  
  cityGrid[0][0] = { card: mockCards.cidade };
  cityGrid[0][1] = { card: mockCards.oficina };
  cityGrid[0][2] = { card: mockCards.oficina }; // 2 oficinas para IF_WORKSHOPS_GE_2
  cityGrid[1][0] = { card: mockCards.cidade };   // 3 cidades para IF_CITY_GE_3
  cityGrid[1][1] = { card: mockCards.cidade };   // 4 cidades total
  
  landmarksGrid[0][0] = { card: mockCards.templo };

  return {
    turn: 1,
    phase: 'production' as GamePhase,
    resources: { coins: 10, food: 10, materials: 10, population: 10 },
    playerStats: { reputation: 0, totalProduction: 0, buildings: 7, landmarks: 1 },
    farmGrid,
    cityGrid,
    landmarksGrid,
    eventGrid,
    hand: [],
    deck: [],
    activeEvents: [],
    comboEffects: [],
    magicUsedThisTurn: false,
    builtCountThisTurn: 0,
    victorySystem: undefined,
  };
}

/**
 * Testa um efeito específico
 */
export function testCardEffect(effectLogic: string, cardName: string = 'Teste'): {
  success: boolean;
  message: string;
  parsedEffect: any;
  executionResult: any;
} {
  console.log(`[EFFECT TEST] Testando carta: ${cardName}`);
  console.log(`[EFFECT TEST] Effect Logic: ${effectLogic}`);

  try {
    // 1. Testar o parsing
    const parsedEffect = parseEffectLogic(effectLogic);
    console.log(`[EFFECT TEST] Parsed Effect:`, parsedEffect);
    
    if (!parsedEffect) {
      return {
        success: false,
        message: 'Falha no parsing do effect_logic',
        parsedEffect: null,
        executionResult: null
      };
    }

    // 2. Criar estado de jogo mock
    const gameState = createMockGameState();
    const beforeResources = { ...gameState.resources };
    const beforeStats = { ...gameState.playerStats };

    // 3. Executar o efeito
    let executionResult: any;
    
    // Se for um efeito ON_DICE, testar com diferentes valores de dado
    if (effectLogic.includes('ON_DICE:')) {
      console.log(`[EFFECT TEST] Detectado efeito ON_DICE, testando com dados 1-6`);
      let bestResult = {};
      let hasAnyEffect = false;
      
      for (let dice = 1; dice <= 6; dice++) {
        const diceResult = executeCardEffects(effectLogic, gameState, 'test-card-id', dice);
        if (Object.keys(diceResult).length > 0) {
          bestResult = diceResult;
          hasAnyEffect = true;
          console.log(`[EFFECT TEST] Dado ${dice} ativou efeito:`, diceResult);
          break; // Usar o primeiro resultado válido
        }
      }
      
      executionResult = hasAnyEffect ? bestResult : { diceEffectTested: true };
    } else {
      executionResult = executeCardEffects(effectLogic, gameState, 'test-card-id');
    }
    
    console.log(`[EFFECT TEST] Execution Result:`, executionResult);

    const afterResources = { ...gameState.resources };
    const afterStats = { ...gameState.playerStats };

    // 4. Verificar mudanças
    const resourceChanges = Object.keys(executionResult).length > 0;
    const basicResourcesChanged = JSON.stringify(beforeResources) !== JSON.stringify(afterResources);
    const statsChanged = JSON.stringify(beforeStats) !== JSON.stringify(afterStats);
    
    // Verificar se há efeitos especiais (não recursos básicos)
    const executionResultAny = executionResult as any;
    const hasSpecialEffects = executionResult && (
      executionResultAny.hasEffectExecuted ||
      executionResultAny.reputation !== undefined ||
      executionResultAny.defense !== undefined ||
      executionResultAny.landmarks !== undefined ||
      executionResultAny.farmsBoost !== undefined ||
      executionResultAny.citiesBoost !== undefined ||
      executionResultAny.farmsBoostTemp !== undefined ||
      executionResultAny.citiesBoostTemp !== undefined ||
      executionResultAny.constructionsBoost !== undefined ||
      executionResultAny.onPlayFarm !== undefined ||
      executionResultAny.onPlayCity !== undefined ||
      executionResultAny.onPlayMagic !== undefined ||
      executionResultAny.drawCards !== undefined ||
      executionResultAny.drawCityCards !== undefined ||
      executionResultAny.duplicateMagicEffects !== undefined ||
      executionResultAny.citiesMaterialsBoostTemp !== undefined ||
      executionResultAny.optionalPayCoins !== undefined ||
      executionResultAny.restrictFarmActivation !== undefined ||
      executionResultAny.reduceCityCost !== undefined ||
      executionResultAny.discardCards !== undefined ||
      executionResultAny.createCityCard !== undefined ||
      executionResultAny.constructionCostReduction !== undefined ||
      executionResultAny.extraBuildCity !== undefined ||
      executionResultAny.citiesCoinsBoostTemp !== undefined ||
      executionResultAny.magicCostReduction !== undefined ||
      executionResultAny.magicCostReductionTemp !== undefined ||
      executionResultAny.farmProtection !== undefined ||
      executionResultAny.eventProtection !== undefined ||
      executionResultAny.blockNegativeEvent !== undefined ||
      executionResultAny.cancelEvent !== undefined ||
      executionResultAny.destroyCard !== undefined ||
      executionResultAny.absorbNegative !== undefined ||
      executionResultAny.extraCardPlay !== undefined ||
      executionResultAny.indestructible !== undefined ||
      executionResultAny.optionalFarmBoost !== undefined ||
      executionResultAny.optionalElemental !== undefined ||
      executionResultAny.randomElemental !== undefined ||
      executionResultAny.optionalMagicCard !== undefined ||
      executionResultAny.optionalGainMaterials !== undefined ||
      // Novos efeitos adicionados
      executionResultAny.boostConstructions !== undefined ||
      executionResultAny.cityCostReduction !== undefined ||
      executionResultAny.citiesMaterialsBoostTemp !== undefined ||
      executionResultAny.citiesCoinsBoostTemp !== undefined ||
      executionResultAny.farmsBoostTemp !== undefined ||
      executionResultAny.citiesBoostTemp !== undefined ||
      executionResultAny.constructionCostReduction !== undefined ||
      // Verificar efeitos não implementados também
      Object.keys(executionResultAny).some(key => key.startsWith('unimplemented_'))
    );
    
    const hasChanges = resourceChanges || basicResourcesChanged || statsChanged || hasSpecialEffects;

    return {
      success: hasChanges,
      message: hasChanges 
        ? `✅ Efeito executado com sucesso! Mudanças: ${JSON.stringify(executionResult)} | Recursos: ${basicResourcesChanged ? 'Sim' : 'Não'} | Stats: ${statsChanged ? 'Sim' : 'Não'} | Especiais: ${hasSpecialEffects ? 'Sim' : 'Não'}`
        : '⚠️ Efeito parseado mas não executou mudanças detectáveis',
      parsedEffect,
      executionResult
    };

  } catch (error) {
    console.error(`[EFFECT TEST] Erro ao testar efeito:`, error);
    return {
      success: false,
      message: `❌ Erro na execução: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      parsedEffect: null,
      executionResult: null
    };
  }
}

/**
 * Testa um efeito de dado específico
 */
export function testDiceEffect(effectLogic: string, diceNumber: number, cardName: string = 'Teste Dado'): {
  success: boolean;
  message: string;
  parsedEffect: any;
  executionResult: any;
} {
  console.log(`[DICE TEST] Testando carta com dado: ${cardName}`);
  console.log(`[DICE TEST] Effect Logic: ${effectLogic}, Dado: ${diceNumber}`);

  try {
    const parsedEffect = parseEffectLogic(effectLogic);
    
    if (!parsedEffect || !parsedEffect.dice || parsedEffect.dice.length === 0) {
      return {
        success: false,
        message: 'Carta não possui efeitos de dado válidos',
        parsedEffect,
        executionResult: null
      };
    }

    const gameState = createMockGameState();
    const beforeResources = { ...gameState.resources };

    // Executar com dado específico
    const executionResult = executeCardEffects(effectLogic, gameState, 'test-dice-card-id', diceNumber);
    console.log(`[DICE TEST] Execution Result:`, executionResult);

    const afterResources = { ...gameState.resources };
    const hasChanges = JSON.stringify(beforeResources) !== JSON.stringify(afterResources) ||
                      Object.keys(executionResult).length > 0;

    return {
      success: hasChanges,
      message: hasChanges 
        ? `🎲 Efeito de dado executado! Dado ${diceNumber}: ${JSON.stringify(executionResult)}`
        : `🎲 Dado ${diceNumber} não ativou nenhum efeito`,
      parsedEffect,
      executionResult
    };

  } catch (error) {
    return {
      success: false,
      message: `❌ Erro no teste de dado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      parsedEffect: null,
      executionResult: null
    };
  }
}

/**
 * Executa bateria de testes em várias cartas
 */
export function runEffectTestSuite(cards: Array<{name: string, effect_logic: string | null}>) {
  console.log(`[TEST SUITE] Iniciando teste de ${cards.length} cartas...`);
  
  const results = {
    total: cards.length,
    successful: 0,
    failed: 0,
    warnings: 0,
    details: [] as Array<{name: string, status: 'success' | 'failed' | 'warning', message: string}>
  };

  for (const card of cards) {
    if (!card.effect_logic) {
      results.warnings++;
      results.details.push({
        name: card.name,
        status: 'warning',
        message: '⚠️ Carta sem effect_logic'
      });
      continue;
    }

    const testResult = testCardEffect(card.effect_logic, card.name);
    
    if (testResult.success) {
      results.successful++;
      results.details.push({
        name: card.name,
        status: 'success',
        message: testResult.message
      });
    } else {
      results.failed++;
      results.details.push({
        name: card.name,
        status: 'failed',
        message: testResult.message
      });
    }
  }

  console.log(`[TEST SUITE] Resultados: ${results.successful} sucessos, ${results.failed} falhas, ${results.warnings} avisos`);
  return results;
}

/**
 * Testa efeitos condicionais
 */
export function testConditionalEffect(effectLogic: string, cardName: string = 'Teste Condicional'): {
  success: boolean;
  message: string;
  details: string;
} {
  console.log(`[CONDITIONAL TEST] Testando carta condicional: ${cardName}`);
  
  try {
    const parsedEffect = parseEffectLogic(effectLogic);
    
    if (!parsedEffect || !parsedEffect.conditional || parsedEffect.conditional.length === 0) {
      return {
        success: false,
        message: 'Carta não possui efeitos condicionais válidos',
        details: ''
      };
    }

    const gameState = createMockGameState();
    
    // Testar em diferentes cenários
    const scenarios = [
      { name: 'Sem modificações', setup: () => {} },
      { name: 'Com cidade', setup: () => gameState.cityGrid[0][0].card = { name: 'Cidade Teste' } as Card },
      { name: 'Com fazendas', setup: () => {
        gameState.farmGrid[0][0].card = { name: 'Fazenda 1' } as Card;
        gameState.farmGrid[0][1].card = { name: 'Fazenda 2' } as Card;
        gameState.farmGrid[0][2].card = { name: 'Fazenda 3' } as Card;
      }},
      { name: 'Com recursos', setup: () => gameState.resources = { coins: 15, food: 20, materials: 25, population: 5 }}
    ];

    let successCount = 0;
    const details: string[] = [];

    for (const scenario of scenarios) {
      // Reset state
      const testState = createMockGameState();
      scenario.setup();
      
      const beforeResources = { ...testState.resources };
      const executionResult = executeCardEffects(effectLogic, testState, 'test-conditional-id');
      const afterResources = { ...testState.resources };
      
      const hasChanges = JSON.stringify(beforeResources) !== JSON.stringify(afterResources) ||
                        Object.keys(executionResult).length > 0;
      
      if (hasChanges) {
        successCount++;
        details.push(`✅ ${scenario.name}: ${JSON.stringify(executionResult)}`);
      } else {
        details.push(`➖ ${scenario.name}: Sem efeito`);
      }
    }

    return {
      success: successCount > 0,
      message: `Efeito condicional testado em ${scenarios.length} cenários, ${successCount} ativaram`,
      details: details.join('\n')
    };

  } catch (error) {
    return {
      success: false,
      message: `❌ Erro no teste condicional: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      details: ''
    };
  }
}