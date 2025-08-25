import { testCardEffect } from './effectTester';

/**
 * Teste rápido de cartas específicas para verificação imediata
 */
export function runQuickCardTests() {
  console.log('🧪 Executando testes rápidos de cartas...');
  
  const testCases = [
    {
      name: 'Pequeno Jardim',
      effect_logic: 'PRODUCE_FOOD:1',
      expected: 'Deve produzir 1 comida por turno'
    },
    {
      name: 'Horta Comunitária', 
      effect_logic: 'PRODUCE_FOOD:2;PRODUCE_POPULATION:1',
      expected: 'Deve produzir 2 comida + 1 população por turno'
    },
    {
      name: 'Campo de Arroz',
      effect_logic: 'PRODUCE_FOOD:1:ON_DICE:1,2',
      expected: 'Deve produzir 1 comida quando dado 1 ou 2'
    },
    {
      name: 'Fazenda de Milho',
      effect_logic: 'IF_FARMS_GE_3:PRODUCE_FOOD:3|PRODUCE_FOOD:2',
      expected: 'Deve produzir 2 comida (ou 3 se 3+ fazendas)'
    },
    {
      name: 'Chuva Mágica',
      effect_logic: 'BOOST_ALL_FARMS_FOOD_TEMP:1:1;BOOST_ALL_FARMS_MATERIALS_TEMP:1:1',
      expected: 'Deve criar boosts temporários para fazendas'
    }
  ];

  const results = [];
  
  for (const testCase of testCases) {
    console.log(`\n🔍 Testando: ${testCase.name}`);
    console.log(`   Logic: ${testCase.effect_logic}`);
    console.log(`   Esperado: ${testCase.expected}`);
    
    const result = testCardEffect(testCase.effect_logic, testCase.name);
    
    console.log(`   ✨ Resultado: ${result.success ? '✅' : '❌'} ${result.message}`);
    
    results.push({
      ...testCase,
      result: result.success,
      message: result.message,
      parsedEffect: result.parsedEffect,
      executionResult: result.executionResult
    });
  }
  
  // Sumário
  const successful = results.filter(r => r.result).length;
  const total = results.length;
  
  console.log('\n📊 SUMÁRIO DOS TESTES RÁPIDOS:');
  console.log(`✅ Sucessos: ${successful}/${total} (${(successful/total*100).toFixed(1)}%)`);
  console.log(`❌ Falhas: ${total-successful}/${total} (${((total-successful)/total*100).toFixed(1)}%)`);
  
  if (successful < total) {
    console.log('\n❌ CARTAS COM PROBLEMAS:');
    results.filter(r => !r.result).forEach(card => {
      console.log(`  • ${card.name}: ${card.message}`);
    });
  }
  
  return results;
}

/**
 * Teste de cartas BOOST específicas
 */
export function testBoostEffects() {
  console.log('\n🚀 Testando efeitos BOOST específicos...');
  
  const boostTests = [
    {
      name: 'Boost Fazendas Temp',
      logic: 'BOOST_ALL_FARMS_FOOD_TEMP:1:1',
      expected: 'Boost temporário de +1 comida para fazendas por 1 turno'
    },
    {
      name: 'Boost Cidades Temp',
      logic: 'BOOST_ALL_CITIES_COINS_TEMP:2:1', 
      expected: 'Boost temporário de +2 moedas para cidades por 1 turno'
    },
    {
      name: 'Boost Fazendas Contínuo',
      logic: 'BOOST_ALL_FARMS_FOOD:1',
      expected: 'Boost contínuo de +1 comida para fazendas'
    }
  ];
  
  for (const test of boostTests) {
    console.log(`\n🎯 ${test.name}: ${test.logic}`);
    const result = testCardEffect(test.logic, test.name);
    console.log(`   ${result.success ? '✅' : '❌'} ${result.message}`);
  }
}

// Expor globalmente
if (typeof window !== 'undefined') {
  (window as any).runQuickCardTests = runQuickCardTests;
  (window as any).testBoostEffects = testBoostEffects;
}