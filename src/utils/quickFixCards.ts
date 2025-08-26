import { testCardEffect, createMockGameState } from './effectTester';

/**
 * Teste rápido com debug das 5 cartas problemáticas
 */
export function quickFixTest() {
  console.log('🔧 TESTE RÁPIDO DAS 5 CARTAS PROBLEMÁTICAS');
  
  const cards = [
    {
      name: 'Tempestade Próspera',
      logic: 'IF_CITY_GE_3:BOOST_ALL_CITIES_MATERIALS_TEMP:3:1|BOOST_ALL_CITIES_MATERIALS_TEMP:2:1',
      expected: 'Deve aplicar boost temp de +3 materiais (há 4 cidades no mock)'
    },
    {
      name: 'Apocalipse Mágico',
      logic: 'BOOST_CONSTRUCTIONS:food:3:farm,city,landmark;BOOST_CONSTRUCTIONS:coins:3:farm,city,landmark;BOOST_CONSTRUCTIONS:materials:3:farm,city,landmark', 
      expected: 'Deve aplicar boost de +3 para todos os recursos'
    },
    {
      name: 'Otimização Urbana',
      logic: 'BOOST_CITY_COST_REDUCTION:2:1',
      expected: 'Deve criar redução de custo de cidade'
    },
    {
      name: 'Fazenda de Milho',
      logic: 'IF_FARMS_GE_3:PRODUCE_FOOD:3|PRODUCE_FOOD:2',
      expected: 'Deve produzir 3 comida (há 4 fazendas no mock)'
    },
    {
      name: 'Feira de Artesanato', 
      logic: 'IF_WORKSHOPS_GE_2:PRODUCE_COINS:3|PRODUCE_COINS:2',
      expected: 'Deve produzir 3 moedas (há 2 oficinas no mock)'
    }
  ];

  // Verificar mock state primeiro
  const gameState = createMockGameState();
  console.log('\n🎯 ESTADO DO MOCK:');
  console.log(`Fazendas: ${gameState.farmGrid.flat().filter(c => c.card).length}`);
  console.log(`Cidades: ${gameState.cityGrid.flat().filter(c => c.card).length}`);
  console.log(`Oficinas: ${gameState.cityGrid.flat().filter(c => c.card && (c.card.name.includes('Oficina') || (c.card.tags && c.card.tags.includes('workshop')))).length}`);
  console.log(`Marcos: ${gameState.landmarksGrid.flat().filter(c => c.card).length}`);

  const results = [];
  
  for (const card of cards) {
    console.log(`\n🧪 ${card.name}:`);
    console.log(`   Logic: ${card.logic}`);
    console.log(`   Expected: ${card.expected}`);
    
    const result = testCardEffect(card.logic, card.name);
    const status = result.success ? '✅' : '❌';
    console.log(`   ${status} Result: ${result.message}`);
    
    if (!result.success && result.parsedEffect) {
      console.log(`   🔍 Parsed:`, JSON.stringify(result.parsedEffect, null, 2));
      console.log(`   🔍 Execution:`, JSON.stringify(result.executionResult, null, 2));
    }
    
    results.push({
      name: card.name,
      success: result.success,
      message: result.message
    });
  }
  
  const passing = results.filter(r => r.success).length;
  console.log(`\n📊 RESULTADO: ${passing}/${cards.length} passando`);
  
  return results;
}

// Expor globalmente
if (typeof window !== 'undefined') {
  (window as any).quickFixTest = quickFixTest;
}