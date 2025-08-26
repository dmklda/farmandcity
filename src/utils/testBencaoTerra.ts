// Teste específico para a carta Bênção da Terra
import { GameState } from '../types/gameState';
import { Resources } from '../types/resources';
import { Card } from '../types/card';
import { executeCardEffects } from './effectExecutor';

/**
 * Testa especificamente a carta Bênção da Terra com fazendas no campo
 */
export function testBencaoTerra(): {
  success: boolean;
  message: string;
  details: any;
} {
  console.log('🌱 [BÊNÇÃO DA TERRA TEST] Testando carta Bênção da Terra...');
  
  // Criar estado de teste com fazendas no campo
  const testState: GameState = {
    phase: 'action',
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
      population: 5
    },
    farmGrid: Array(4).fill(null).map(() => Array(4).fill(null).map(() => ({ card: null }))),
    cityGrid: Array(4).fill(null).map(() => Array(4).fill(null).map(() => ({ card: null }))),
    landmarksGrid: Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({ card: null }))),
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

  // Adicionar 1 fazenda no campo
  testState.farmGrid[0][0].card = {
    id: 'fazenda-teste-1',
    name: 'Fazenda de Teste',
    type: 'farm',
    effect_logic: 'PRODUCE_FOOD:1:PER_TURN'
  } as Card;

  console.log('🌱 [BÊNÇÃO DA TERRA TEST] Estado inicial:');
  console.log('🌱 [BÊNÇÃO DA TERRA TEST] - Recursos:', testState.resources);
  console.log('🌱 [BÊNÇÃO DA TERRA TEST] - Fazendas no campo: 1');

  try {
    // Testar o efeito BOOST_ALL_FARMS_FOOD:2 da carta Bênção da Terra
    const result = executeCardEffects('BOOST_ALL_FARMS_FOOD:2', testState, 'bencao-terra-test', undefined, undefined, undefined, undefined, true);
    
    console.log('🌱 [BÊNÇÃO DA TERRA TEST] Resultado do executeCardEffects:', result);
    console.log('🌱 [BÊNÇÃO DA TERRA TEST] Estado após efeito:', testState.resources);

    // Analisar o resultado
    let expectedBoost = 2; // 1 fazenda × 2 comida por fazenda
    let actualEffect = result.food || 0;
    let actualFarmsBoost = (result as any).farmsBoost || 0;
    let actualFarmsBoostContinuous = (result as any).farmsBoostContinuous || 0;

    console.log('🌱 [BÊNÇÃO DA TERRA TEST] Análise:');
    console.log('🌱 [BÊNÇÃO DA TERRA TEST] - Boost esperado: 2 comida (1 fazenda × 2)');
    console.log('🌱 [BÊNÇÃO DA TERRA TEST] - Comida no resultado:', actualEffect);
    console.log('🌱 [BÊNÇÃO DA TERRA TEST] - Farms boost temporal:', actualFarmsBoost);
    console.log('🌱 [BÊNÇÃO DA TERRA TEST] - Farms boost contínuo:', actualFarmsBoostContinuous);

    // O BOOST_ALL_FARMS_FOOD não deveria retornar comida diretamente,
    // mas sim criar um boost para as fazendas
    if (actualFarmsBoost > 0 || actualFarmsBoostContinuous > 0 || actualEffect >= expectedBoost) {
      return {
        success: true,
        message: `Bênção da Terra funcionou! Boost aplicado corretamente.`,
        details: {
          initialResources: { food: 10, coins: 10, materials: 10, population: 5 },
          effectResult: result,
          finalResources: testState.resources,
          farmsInField: 1,
          expectedBoost: expectedBoost,
          actualFarmsBoost,
          actualFarmsBoostContinuous,
          actualEffect
        }
      };
    } else {
      return {
        success: false,
        message: `Bênção da Terra falhou! Boost não foi aplicado.`,
        details: {
          initialResources: { food: 10, coins: 10, materials: 10, population: 5 },
          effectResult: result,
          finalResources: testState.resources,
          farmsInField: 1,
          expectedBoost: expectedBoost,
          actualFarmsBoost,
          actualFarmsBoostContinuous,
          actualEffect,
          problem: 'Boost de fazendas não foi aplicado'
        }
      };
    }
  } catch (error) {
    console.error('❌ [BÊNÇÃO DA TERRA TEST] ERRO:', error);
    return {
      success: false,
      message: `Erro ao testar Bênção da Terra: ${error}`,
      details: {
        error: error,
        initialResources: { food: 10, coins: 10, materials: 10, population: 5 }
      }
    };
  }
}

/**
 * Testa com múltiplas fazendas
 */
export function testBencaoTerraMultiplasFazendas(): {
  success: boolean;
  message: string;
  details: any;
} {
  console.log('🌾 [BÊNÇÃO DA TERRA MÚLTIPLAS] Testando com 3 fazendas...');
  
  const testState: GameState = {
    phase: 'action',
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
      population: 5
    },
    farmGrid: Array(4).fill(null).map(() => Array(4).fill(null).map(() => ({ card: null }))),
    cityGrid: Array(4).fill(null).map(() => Array(4).fill(null).map(() => ({ card: null }))),
    landmarksGrid: Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({ card: null }))),
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

  // Adicionar 3 fazendas no campo
  testState.farmGrid[0][0].card = { id: 'fazenda-1', name: 'Fazenda 1', type: 'farm', effect_logic: 'PRODUCE_FOOD:1:PER_TURN' } as Card;
  testState.farmGrid[0][1].card = { id: 'fazenda-2', name: 'Fazenda 2', type: 'farm', effect_logic: 'PRODUCE_FOOD:1:PER_TURN' } as Card;
  testState.farmGrid[1][0].card = { id: 'fazenda-3', name: 'Fazenda 3', type: 'farm', effect_logic: 'PRODUCE_FOOD:1:PER_TURN' } as Card;

  console.log('🌾 [BÊNÇÃO DA TERRA MÚLTIPLAS] Fazendas no campo: 3');

  try {
    const result = executeCardEffects('BOOST_ALL_FARMS_FOOD:2', testState, 'bencao-terra-multiplas-test', undefined, undefined, undefined, undefined, true);
    
    console.log('🌾 [BÊNÇÃO DA TERRA MÚLTIPLAS] Resultado:', result);

    let expectedTotal = 6; // 3 fazendas × 2 comida por fazenda
    let actualEffect = result.food || 0;
    let actualFarmsBoost = (result as any).farmsBoost || 0;

    console.log('🌾 [BÊNÇÃO DA TERRA MÚLTIPLAS] Esperado:', expectedTotal, 'comida (3×2)');
    console.log('🌾 [BÊNÇÃO DA TERRA MÚLTIPLAS] Obtido:', actualEffect, 'comida');

    return {
      success: actualEffect >= expectedTotal || actualFarmsBoost > 0,
      message: `Com 3 fazendas: esperado ${expectedTotal}, obtido ${actualEffect}`,
      details: {
        farmsCount: 3,
        expectedTotal,
        actualEffect,
        actualFarmsBoost,
        result
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Erro: ${error}`,
      details: { error }
    };
  }
}

// Exposição global
if (typeof window !== 'undefined') {
  (window as any).testBencaoTerra = testBencaoTerra;
  (window as any).testBencaoTerraMultiplasFazendas = testBencaoTerraMultiplasFazendas;
}