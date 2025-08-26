// Teste específico para a carta Colheita
import { GameState } from '../types/gameState';
import { Resources } from '../types/resources';
import { executeCardEffects } from './effectExecutor';

/**
 * Testa especificamente a carta Colheita
 */
export function testColheitaCard(): {
  success: boolean;
  message: string;
  details: any;
} {
  console.log('🃏 [COLHEITA TEST] Testando carta Colheita...');
  
  // Criar estado de teste
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

  console.log('🃏 [COLHEITA TEST] Estado inicial:', testState.resources);

  try {
    // Testar o efeito GAIN_FOOD:2 da carta Colheita
    const result = executeCardEffects('GAIN_FOOD:2', testState, 'colheita-test', undefined, undefined, undefined, undefined, true);
    
    console.log('🃏 [COLHEITA TEST] Resultado do executeCardEffects:', result);
    console.log('🃏 [COLHEITA TEST] Estado após efeito:', testState.resources);

    // Verificar se o efeito foi aplicado
    const foodGained = result.food || 0;
    const expectedFood = 2;

    if (foodGained >= expectedFood) {
      console.log('✅ [COLHEITA TEST] SUCESSO: Carta Colheita funcionou corretamente!');
      return {
        success: true,
        message: `Carta Colheita funcionou! Ganhou ${foodGained} comida(s).`,
        details: {
          initialResources: { food: 10, coins: 10, materials: 10, population: 5 },
          effectResult: result,
          finalResources: testState.resources,
          foodGained: foodGained,
          expected: expectedFood
        }
      };
    } else {
      console.log('❌ [COLHEITA TEST] FALHA: Carta Colheita não funcionou como esperado!');
      return {
        success: false,
        message: `Carta Colheita falhou! Esperado: ${expectedFood} comida, obtido: ${foodGained} comida.`,
        details: {
          initialResources: { food: 10, coins: 10, materials: 10, population: 5 },
          effectResult: result,
          finalResources: testState.resources,
          foodGained: foodGained,
          expected: expectedFood,
          problem: 'Efeito não retornou os recursos esperados'
        }
      };
    }
  } catch (error) {
    console.error('❌ [COLHEITA TEST] ERRO:', error);
    return {
      success: false,
      message: `Erro ao testar carta Colheita: ${error}`,
      details: {
        error: error,
        initialResources: { food: 10, coins: 10, materials: 10, population: 5 }
      }
    };
  }
}

/**
 * Testa se o problema é na aplicação ao gameState
 */
export function testColheitaInGameApplication(): {
  success: boolean;
  message: string;
  details: any;
} {
  console.log('🎮 [COLHEITA IN-GAME TEST] Testando aplicação in-game da carta Colheita...');
  
  // Simular o que acontece quando uma carta é jogada
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

  const initialFood = testState.resources.food;
  console.log('🎮 [COLHEITA IN-GAME TEST] Comida inicial:', initialFood);

  try {
    // Executar efeito e aplicar ao estado (simular o que deveria acontecer no jogo)
    const changes = executeCardEffects('GAIN_FOOD:2', testState, 'colheita-in-game-test', undefined, undefined, undefined, undefined, true);
    
    console.log('🎮 [COLHEITA IN-GAME TEST] Mudanças calculadas:', changes);
    
    // Aplicar mudanças aos recursos (simular handleSelectCard)
    if (changes.food) {
      testState.resources.food += changes.food;
      console.log('🎮 [COLHEITA IN-GAME TEST] Aplicando mudança de comida:', changes.food);
    }
    
    const finalFood = testState.resources.food;
    const foodGained = finalFood - initialFood;
    
    console.log('🎮 [COLHEITA IN-GAME TEST] Comida final:', finalFood);
    console.log('🎮 [COLHEITA IN-GAME TEST] Comida ganha:', foodGained);

    if (foodGained >= 2) {
      return {
        success: true,
        message: `Aplicação in-game funcionou! Comida: ${initialFood} → ${finalFood} (+${foodGained})`,
        details: {
          initialFood,
          finalFood,
          foodGained,
          changes,
          gameState: testState.resources
        }
      };
    } else {
      return {
        success: false,
        message: `Aplicação in-game falhou! Comida: ${initialFood} → ${finalFood} (+${foodGained})`,
        details: {
          initialFood,
          finalFood,
          foodGained,
          changes,
          gameState: testState.resources,
          problem: 'Recursos não foram aplicados corretamente ao gameState'
        }
      };
    }
  } catch (error) {
    console.error('❌ [COLHEITA IN-GAME TEST] ERRO:', error);
    return {
      success: false,
      message: `Erro na aplicação in-game: ${error}`,
      details: {
        error: error,
        initialFood,
        gameState: testState.resources
      }
    };
  }
}

// Exposição global para facilidade de teste
if (typeof window !== 'undefined') {
  (window as any).testColheitaCard = testColheitaCard;
  (window as any).testColheitaInGameApplication = testColheitaInGameApplication;
}