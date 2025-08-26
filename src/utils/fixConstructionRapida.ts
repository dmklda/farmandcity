import { testCardEffect, createMockGameState } from './effectTester';
import { parseEffectLogic } from './effectParser';
import { executeCardEffects } from './effectExecutor';

/**
 * Debug específico para a carta Construção Rápida
 */
export function debugConstructionRapida() {
  console.log('🔧 DEBUG DA CONSTRUÇÃO RÁPIDA');
  
  // Effect logic da carta no banco
  const effectLogic = 'BOOST_CONSTRUCTION_COST_REDUCTION:1:1';
  
  console.log(`📝 Effect Logic: ${effectLogic}`);
  
  // 1. Testar parsing
  console.log('\n1️⃣ TESTANDO PARSING:');
  const parsed = parseEffectLogic(effectLogic);
  console.log('Resultado do parsing:', JSON.stringify(parsed, null, 2));
  
  // 2. Testar execução
  console.log('\n2️⃣ TESTANDO EXECUÇÃO:');
  const gameState = createMockGameState();
  const beforeResources = { ...gameState.resources };
  
  const executionResult = executeCardEffects(effectLogic, gameState, 'test-construction-rapida');
  const afterResources = { ...gameState.resources };
  
  console.log('Recursos ANTES:', beforeResources);
  console.log('Recursos DEPOIS:', afterResources);
  console.log('Execution Result:', JSON.stringify(executionResult, null, 2));
  
  // 3. Verificar se há mudanças detectáveis
  const resourcesChanged = JSON.stringify(beforeResources) !== JSON.stringify(afterResources);
  const hasExecutionResult = Object.keys(executionResult).length > 0;
  
  console.log(`Recursos mudaram: ${resourcesChanged}`);
  console.log(`Execution result não vazio: ${hasExecutionResult}`);
  
  // 4. Análise detalhada do resultado
  console.log('\n3️⃣ ANÁLISE DETALHADA:');
  const result = executionResult as any;
  
  const specialEffects = [
    'constructionCostReduction',
    'cityCostReduction',
    'magicCostReduction',
    'constructionCostReductionTemp',
    'cityCostReductionDuration',
    'boostConstructionCostReduction'
  ];
  
  specialEffects.forEach(effect => {
    if (result[effect] !== undefined) {
      console.log(`✅ Detectado efeito especial: ${effect} = ${result[effect]}`);
    }
  });
  
  // 5. Teste usando testCardEffect
  console.log('\n4️⃣ TESTE COM testCardEffect:');
  const testResult = testCardEffect(effectLogic, 'Construção Rápida');
  console.log(`Resultado do teste: ${testResult.success ? '✅ PASSOU' : '❌ FALHOU'}`);
  console.log(`Mensagem: ${testResult.message}`);
  
  return {
    parsed,
    executionResult,
    resourcesChanged,
    hasExecutionResult,
    testResult
  };
}

/**
 * Teste alternativo para verificar se o efeito está sendo detectado corretamente
 */
export function testConstructionReduction() {
  console.log('\n🧪 TESTE ALTERNATIVO DE REDUÇÃO DE CUSTO:');
  
  const effects = [
    'BOOST_CONSTRUCTION_COST_REDUCTION:1:1',
    'BOOST_CITY_COST_REDUCTION:2:1',
    'REDUCE_CITY_COST:1'
  ];
  
  effects.forEach(effect => {
    console.log(`\n🔍 Testando: ${effect}`);
    const result = testCardEffect(effect, `Teste-${effect}`);
    console.log(`  ${result.success ? '✅' : '❌'} ${result.message}`);
    
    if (!result.success && result.executionResult) {
      console.log('  Execution Result:', JSON.stringify(result.executionResult, null, 2));
    }
  });
}

// Expor globalmente
if (typeof window !== 'undefined') {
  (window as any).debugConstructionRapida = debugConstructionRapida;
  (window as any).testConstructionReduction = testConstructionReduction;
}