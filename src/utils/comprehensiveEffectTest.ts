// Sistema Abrangente de Teste de Efeitos In-Game
// Testa todos os tipos de efeitos: condicionais, boosts, dados, frequência específica

import { GameState } from '../types/gameState';
import { Resources } from '../types/resources';
import { Card, CardType } from '../types/card';
import { executeCardEffects, processOnPlayEffects } from './effectExecutor';

/**
 * Cria um estado de jogo completo para testes
 */
function createCompleteTestState(): GameState {
  return {
    phase: 'production',
    turn: 1,
    playerStats: {
      reputation: 5,
      totalProduction: 0,
      buildings: 0,
      landmarks: 0
    },
    resources: {
      food: 10,
      coins: 10,
      materials: 10,
      population: 5,
      reputation: 5
    },
    farmGrid: Array(4).fill(null).map(() => Array(4).fill(null).map(() => ({ 
      card: null
    }))),
    cityGrid: Array(4).fill(null).map(() => Array(4).fill(null).map(() => ({ 
      card: null
    }))),
    landmarksGrid: Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({ 
      card: null
    }))),
    eventGrid: [[{ card: null }]],
    activeEvents: [],
    comboEffects: [],
    magicUsedThisTurn: false,
    builtCountThisTurn: 0,
    hand: [],
    deck: [],
    victorySystem: {
      mode: 'simple',
      requiredMajor: 1,
      requiredMinor: 0,
      conditions: [],
      completedConditions: [],
      victoryAchieved: false
    },
    effectTracking: {}
  };
}

/**
 * Adiciona cartas de teste ao estado
 */
function addTestCards(state: GameState): void {
  // Adicionar 4 fazendas para testes condicionais
  state.farmGrid[0][0].card = { id: 'farm-1', name: 'Fazenda 1', effect_logic: 'PRODUCE_FOOD:1:PER_TURN' } as Card;
  state.farmGrid[0][1].card = { id: 'farm-2', name: 'Fazenda 2', effect_logic: 'PRODUCE_FOOD:1:PER_TURN' } as Card;
  state.farmGrid[1][0].card = { id: 'farm-3', name: 'Fazenda 3', effect_logic: 'PRODUCE_FOOD:1:PER_TURN' } as Card;
  state.farmGrid[1][1].card = { id: 'farm-4', name: 'Fazenda 4', effect_logic: 'PRODUCE_FOOD:1:PER_TURN' } as Card;
  
  // Adicionar 1 cidade
  state.cityGrid[0][0].card = { id: 'city-1', name: 'Cidade 1', effect_logic: 'PRODUCE_COINS:2:PER_TURN' } as Card;
  
  // Adicionar 1 landmark
  state.landmarksGrid[0][0].card = { id: 'landmark-1', name: 'Landmark 1', effect_logic: 'PRODUCE_MATERIALS:1:PER_TURN' } as Card;
}

/**
 * Testa efeitos condicionais (IF_*)
 */
function testConditionalEffects(): { success: boolean; message: string; details: string[] } {
  console.log('🧪 [TEST] Iniciando teste de efeitos condicionais...');
  const results: string[] = [];
  let allPassed = true;

  // Teste 1: IF_FARMS_GE_3 (condição atendida)
  try {
    const state1 = createCompleteTestState();
    addTestCards(state1);
    
    const result1 = executeCardEffects('IF_FARMS_GE_3:GAIN_FOOD:5', state1, 'test-conditional-1');
    
    if (result1.food && result1.food > 0) {
      results.push('✅ IF_FARMS_GE_3 com condição atendida: PASSOU');
    } else {
      results.push('❌ IF_FARMS_GE_3 com condição atendida: FALHOU - não ganhou comida');
      allPassed = false;
    }
  } catch (error) {
    results.push(`❌ IF_FARMS_GE_3: ERRO - ${error}`);
    allPassed = false;
  }

  // Teste 2: IF_FARMS_GE_3 (condição não atendida)
  try {
    const state2 = createCompleteTestState();
    // Só adicionar 2 fazendas (condição não atendida)
    state2.farmGrid[0][0].card = { id: 'farm-1', name: 'Fazenda 1', effect_logic: 'PRODUCE_FOOD:1:PER_TURN' } as Card;
    state2.farmGrid[0][1].card = { id: 'farm-2', name: 'Fazenda 2', effect_logic: 'PRODUCE_FOOD:1:PER_TURN' } as Card;
    
    const result2 = executeCardEffects('IF_FARMS_GE_3:GAIN_FOOD:5', state2, 'test-conditional-2');
    
    if (!result2.food || result2.food === 0) {
      results.push('✅ IF_FARMS_GE_3 com condição NÃO atendida: PASSOU');
    } else {
      results.push('❌ IF_FARMS_GE_3 com condição NÃO atendida: FALHOU - ganhou comida quando não deveria');
      allPassed = false;
    }
  } catch (error) {
    results.push(`❌ IF_FARMS_GE_3 (não atendida): ERRO - ${error}`);
    allPassed = false;
  }

  // Teste 3: IF_CITY_EXISTS
  try {
    const state3 = createCompleteTestState();
    addTestCards(state3);
    
    const result3 = executeCardEffects('IF_CITY_EXISTS:GAIN_COINS:3', state3, 'test-conditional-3');
    
    if (result3.coins && result3.coins > 0) {
      results.push('✅ IF_CITY_EXISTS: PASSOU');
    } else {
      results.push('❌ IF_CITY_EXISTS: FALHOU - não ganhou moedas');
      allPassed = false;
    }
  } catch (error) {
    results.push(`❌ IF_CITY_EXISTS: ERRO - ${error}`);
    allPassed = false;
  }

  return {
    success: allPassed,
    message: allPassed ? 'Todos os testes condicionais passaram!' : 'Alguns testes condicionais falharam.',
    details: results
  };
}

/**
 * Testa efeitos de boost temporário e contínuo
 */
function testBoostEffects(): { success: boolean; message: string; details: string[] } {
  console.log('🧪 [TEST] Iniciando teste de efeitos de boost...');
  const results: string[] = [];
  let allPassed = true;

  // Teste 1: BOOST_ALL_FARMS_FOOD temporário
  try {
    const state1 = createCompleteTestState();
    addTestCards(state1);
    
    const result1 = executeCardEffects('BOOST_ALL_FARMS_FOOD:2:TEMPORARY:1', state1, 'test-boost-1');
    
    if ((result1 as any).farmsBoost && (result1 as any).farmsBoost > 0) {
      results.push('✅ BOOST_ALL_FARMS_FOOD temporário: PASSOU');
    } else {
      results.push('❌ BOOST_ALL_FARMS_FOOD temporário: FALHOU - boost não aplicado');
      allPassed = false;
    }
  } catch (error) {
    results.push(`❌ BOOST_ALL_FARMS_FOOD temporário: ERRO - ${error}`);
    allPassed = false;
  }

  // Teste 2: BOOST_ALL_CITIES_COINS contínuo
  try {
    const state2 = createCompleteTestState();
    addTestCards(state2);
    
    const result2 = executeCardEffects('BOOST_ALL_CITIES_COINS:3:CONTINUOUS', state2, 'test-boost-2');
    
    if ((result2 as any).citiesBoostContinuous && (result2 as any).citiesBoostContinuous > 0) {
      results.push('✅ BOOST_ALL_CITIES_COINS contínuo: PASSOU');
    } else {
      results.push('❌ BOOST_ALL_CITIES_COINS contínuo: FALHOU - boost contínuo não aplicado');
      allPassed = false;
    }
  } catch (error) {
    results.push(`❌ BOOST_ALL_CITIES_COINS contínuo: ERRO - ${error}`);
    allPassed = false;
  }

  // Teste 3: BOOST_CONSTRUCTION_COST_REDUCTION
  try {
    const state3 = createCompleteTestState();
    
    const result3 = executeCardEffects('BOOST_CONSTRUCTION_COST_REDUCTION:2', state3, 'test-boost-3');
    
    if ((result3 as any).constructionCostReduction && (result3 as any).constructionCostReduction > 0) {
      results.push('✅ BOOST_CONSTRUCTION_COST_REDUCTION: PASSOU');
    } else {
      results.push('❌ BOOST_CONSTRUCTION_COST_REDUCTION: FALHOU - redução não aplicada');
      allPassed = false;
    }
  } catch (error) {
    results.push(`❌ BOOST_CONSTRUCTION_COST_REDUCTION: ERRO - ${error}`);
    allPassed = false;
  }

  return {
    success: allPassed,
    message: allPassed ? 'Todos os testes de boost passaram!' : 'Alguns testes de boost falharam.',
    details: results
  };
}

/**
 * Testa efeitos baseados em dados (ON_DICE)
 */
function testDiceEffects(): { success: boolean; message: string; details: string[] } {
  console.log('🧪 [TEST] Iniciando teste de efeitos de dados...');
  const results: string[] = [];
  let allPassed = true;

  // Teste 1: ON_DICE:4:PRODUCE_FOOD:1 com dado correto
  try {
    const state1 = createCompleteTestState();
    
    const result1 = executeCardEffects('ON_DICE:4:PRODUCE_FOOD:1', state1, 'test-dice-1', undefined, undefined, undefined, false, 4);
    
    if (result1.food && result1.food > 0) {
      results.push('✅ ON_DICE:4 com dado correto: PASSOU');
    } else {
      results.push('❌ ON_DICE:4 com dado correto: FALHOU - não produziu comida');
      allPassed = false;
    }
  } catch (error) {
    results.push(`❌ ON_DICE:4 com dado correto: ERRO - ${error}`);
    allPassed = false;
  }

  // Teste 2: ON_DICE:4:PRODUCE_FOOD:1 com dado errado
  try {
    const state2 = createCompleteTestState();
    
    const result2 = executeCardEffects('ON_DICE:4:PRODUCE_FOOD:1', state2, 'test-dice-2', undefined, undefined, undefined, false, 2);
    
    if (!result2.food || result2.food === 0) {
      results.push('✅ ON_DICE:4 com dado errado: PASSOU');
    } else {
      results.push('❌ ON_DICE:4 com dado errado: FALHOU - produziu comida quando não deveria');
      allPassed = false;
    }
  } catch (error) {
    results.push(`❌ ON_DICE:4 com dado errado: ERRO - ${error}`);
    allPassed = false;
  }

  // Teste 3: GAIN_FOOD:1:ON_DICE:1
  try {
    const state3 = createCompleteTestState();
    
    const result3 = executeCardEffects('GAIN_FOOD:1:ON_DICE:1', state3, 'test-dice-3', undefined, undefined, undefined, false, 1);
    
    if (result3.food && result3.food > 0) {
      results.push('✅ GAIN_FOOD:1:ON_DICE:1 com dado 1: PASSOU');
    } else {
      results.push('❌ GAIN_FOOD:1:ON_DICE:1 com dado 1: FALHOU - não ganhou comida');
      allPassed = false;
    }
  } catch (error) {
    results.push(`❌ GAIN_FOOD:1:ON_DICE:1: ERRO - ${error}`);
    allPassed = false;
  }

  return {
    success: allPassed,
    message: allPassed ? 'Todos os testes de dados passaram!' : 'Alguns testes de dados falharam.',
    details: results
  };
}

/**
 * Testa efeitos de frequência específica
 */
function testFrequencyEffects(): { success: boolean; message: string; details: string[] } {
  console.log('🧪 [TEST] Iniciando teste de efeitos de frequência...');
  const results: string[] = [];
  let allPassed = true;

  // Teste 1: ONCE (deve executar só uma vez)
  try {
    const state1 = createCompleteTestState();
    
    const result1a = executeCardEffects('GAIN_FOOD:3:ONCE', state1, 'test-freq-1', undefined, undefined, undefined, true);
    const result1b = executeCardEffects('GAIN_FOOD:3:ONCE', state1, 'test-freq-1', undefined, undefined, undefined, true);
    
    if (result1a.food && result1a.food > 0 && (!result1b.food || result1b.food === 0)) {
      results.push('✅ Efeito ONCE (executou uma vez apenas): PASSOU');
    } else {
      results.push('❌ Efeito ONCE: FALHOU - executou mais de uma vez');
      allPassed = false;
    }
  } catch (error) {
    results.push(`❌ Efeito ONCE: ERRO - ${error}`);
    allPassed = false;
  }

  // Teste 2: PER_TURN durante produção
  try {
    const state2 = createCompleteTestState();
    state2.phase = 'production';
    
    const result2 = executeCardEffects('PRODUCE_FOOD:2:PER_TURN', state2, 'test-freq-2');
    
    if (result2.food && result2.food > 0) {
      results.push('✅ Efeito PER_TURN durante produção: PASSOU');
    } else {
      results.push('❌ Efeito PER_TURN durante produção: FALHOU - não executou');
      allPassed = false;
    }
  } catch (error) {
    results.push(`❌ Efeito PER_TURN durante produção: ERRO - ${error}`);
    allPassed = false;
  }

  // Teste 3: PER_TURN durante build (deve ser bloqueado para PRODUCE_*)
  try {
    const state3 = createCompleteTestState();
    state3.phase = 'build';
    
    const result3 = executeCardEffects('PRODUCE_FOOD:2:PER_TURN', state3, 'test-freq-3');
    
    if (!result3.food || result3.food === 0) {
      results.push('✅ Efeito PRODUCE_* bloqueado durante build: PASSOU');
    } else {
      results.push('❌ Efeito PRODUCE_* durante build: FALHOU - executou quando não deveria');
      allPassed = false;
    }
  } catch (error) {
    results.push(`❌ Efeito PRODUCE_* durante build: ERRO - ${error}`);
    allPassed = false;
  }

  // Teste 4: TEMPORARY com duração
  try {
    const state4 = createCompleteTestState();
    
    const result4 = executeCardEffects('GAIN_COINS:2:TEMPORARY:2', state4, 'test-freq-4');
    
    if (result4.coins && result4.coins > 0) {
      results.push('✅ Efeito TEMPORARY: PASSOU');
    } else {
      results.push('❌ Efeito TEMPORARY: FALHOU - não executou');
      allPassed = false;
    }
  } catch (error) {
    results.push(`❌ Efeito TEMPORARY: ERRO - ${error}`);
    allPassed = false;
  }

  return {
    success: allPassed,
    message: allPassed ? 'Todos os testes de frequência passaram!' : 'Alguns testes de frequência falharam.',
    details: results
  };
}

/**
 * Executa todos os testes de efeitos
 */
export function runComprehensiveEffectTest(): { 
  success: boolean; 
  totalTests: number; 
  passedTests: number; 
  results: { 
    conditional: any, 
    boost: any, 
    dice: any, 
    frequency: any 
  };
  summary: string;
} {
  console.log('🧪 [COMPREHENSIVE TEST] Iniciando avaliação completa de efeitos...');
  
  const conditionalResults = testConditionalEffects();
  const boostResults = testBoostEffects();
  const diceResults = testDiceEffects();
  const frequencyResults = testFrequencyEffects();

  const allResults = [conditionalResults, boostResults, diceResults, frequencyResults];
  const passedTests = allResults.filter(r => r.success).length;
  const totalTests = allResults.length;
  const overallSuccess = passedTests === totalTests;

  const summary = `
═══════════════════════════════════════════════════════════════
🧪 AVALIAÇÃO COMPLETA DE EFEITOS IN-GAME - RELATÓRIO FINAL
═══════════════════════════════════════════════════════════════

📊 RESUMO GERAL:
   ✅ Testes Passaram: ${passedTests}/${totalTests}
   ${overallSuccess ? '🎉 TODOS OS EFEITOS FUNCIONANDO!' : '⚠️  PROBLEMAS DETECTADOS'}

📋 DETALHES POR CATEGORIA:

🔍 EFEITOS CONDICIONAIS (IF_*):
   Status: ${conditionalResults.success ? '✅ FUNCIONANDO' : '❌ COM PROBLEMAS'}
   ${conditionalResults.details.map(d => `   ${d}`).join('\n   ')}

🚀 EFEITOS DE BOOST:
   Status: ${boostResults.success ? '✅ FUNCIONANDO' : '❌ COM PROBLEMAS'}
   ${boostResults.details.map(d => `   ${d}`).join('\n   ')}

🎲 EFEITOS DE DADOS (ON_DICE):
   Status: ${diceResults.success ? '✅ FUNCIONANDO' : '❌ COM PROBLEMAS'}
   ${diceResults.details.map(d => `   ${d}`).join('\n   ')}

⏰ EFEITOS DE FREQUÊNCIA:
   Status: ${frequencyResults.success ? '✅ FUNCIONANDO' : '❌ COM PROBLEMAS'}
   ${frequencyResults.details.map(d => `   ${d}`).join('\n   ')}

═══════════════════════════════════════════════════════════════
`;

  console.log(summary);

  return {
    success: overallSuccess,
    totalTests,
    passedTests,
    results: {
      conditional: conditionalResults,
      boost: boostResults,
      dice: diceResults,
      frequency: frequencyResults
    },
    summary
  };
}

// Exposição global para facilidade de teste
if (typeof window !== 'undefined') {
  (window as any).runComprehensiveEffectTest = runComprehensiveEffectTest;
  (window as any).testConditionalEffects = testConditionalEffects;
  (window as any).testBoostEffects = testBoostEffects;
  (window as any).testDiceEffects = testDiceEffects;
  (window as any).testFrequencyEffects = testFrequencyEffects;
}