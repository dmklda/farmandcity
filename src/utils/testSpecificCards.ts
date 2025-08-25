import { testCardEffect } from './effectTester';

/**
 * Testa as cartas específicas que estavam falhando
 */
export function testProblematicCardsDetailed() {
  console.log('🔧 Testando cartas problemáticas em detalhes...');
  
  const problematicCards = [
    {
      name: 'Comércio Urbano',
      effect_logic: 'IF_CITY_EXISTS:GAIN_COINS:3|GAIN_COINS:2',
      expectedBehavior: 'Deve ganhar 2 moedas (fallback, pois não há cidades no mock)',
      shouldWork: true
    },
    {
      name: 'Tempestade Próspera', 
      effect_logic: 'IF_CITY_GE_3:BOOST_ALL_CITIES_MATERIALS_TEMP:3:1|BOOST_ALL_CITIES_MATERIALS_TEMP:2:1',
      expectedBehavior: 'Deve criar boost temporário de +2 materiais para cidades (fallback)',
      shouldWork: true
    },
    {
      name: 'Eclipse Místico',
      effect_logic: 'IF_TEMPLE_EXISTS:GAIN_COINS:1|DISCARD_CARD:1',
      expectedBehavior: 'Deve ganhar 1 moeda (templo existe no mock) OU descartar carta (fallback)',
      shouldWork: true
    },
    {
      name: 'Apocalipse Mágico',
      effect_logic: 'BOOST_CONSTRUCTIONS:food:3:farm,city,landmark;BOOST_CONSTRUCTIONS:coins:3:farm,city,landmark;BOOST_CONSTRUCTIONS:materials:3:farm,city,landmark',
      expectedBehavior: 'Deve aplicar boost de +3 para todos os recursos em todas as construções',
      shouldWork: true
    },
    {
      name: 'Jardim de Ervas Místicas',
      effect_logic: 'IF_SACRED_TAG_EXISTS:PRODUCE_FOOD:1;IF_SACRED_TAG_EXISTS:PRODUCE_MATERIALS:1',
      expectedBehavior: 'Deve produzir comida e materiais (templo tem tag sagrada no mock)',
      shouldWork: true
    },
    {
      name: 'Otimização Urbana',
      effect_logic: 'BOOST_CITY_COST_REDUCTION:2:1',
      expectedBehavior: 'Deve criar redução de custo de cidades por 1 turno',
      shouldWork: true
    },
    {
      name: 'Expedição de Comércio',
      effect_logic: 'IF_CITY_EXISTS:GAIN_COINS:5|GAIN_COINS:3',
      expectedBehavior: 'Deve ganhar 5 moedas (cidade existe no mock)',
      shouldWork: true
    },
    {
      name: 'Fazenda de Milho',
      effect_logic: 'IF_FARMS_GE_3:PRODUCE_FOOD:3|PRODUCE_FOOD:2',
      expectedBehavior: 'Deve produzir 2 comida (fallback, pois só há 2 fazendas no mock)',
      shouldWork: true
    },
    {
      name: 'Feira de Artesanato',
      effect_logic: 'IF_WORKSHOPS_GE_2:PRODUCE_COINS:3|PRODUCE_COINS:2',
      expectedBehavior: 'Deve produzir 2 moedas (fallback, pois só há 1 oficina no mock)',
      shouldWork: true
    }
  ];

  const results = [];
  
  for (const cardTest of problematicCards) {
    console.log(`\n🎯 Testando: ${cardTest.name}`);
    console.log(`   Logic: ${cardTest.effect_logic}`);
    console.log(`   Esperado: ${cardTest.expectedBehavior}`);
    
    const result = testCardEffect(cardTest.effect_logic, cardTest.name);
    
    const status = result.success ? '✅ PASSOU' : '❌ FALHOU';
    console.log(`   ${status}: ${result.message}`);
    
    if (result.success !== cardTest.shouldWork) {
      console.log(`   ⚠️ Resultado inesperado! Esperado: ${cardTest.shouldWork ? 'sucesso' : 'falha'}`);
    }
    
    if (!result.success && result.parsedEffect) {
      console.log(`   📊 Parsed Effect:`, JSON.stringify(result.parsedEffect, null, 2));
    }
    
    results.push({
      ...cardTest,
      actualResult: result.success,
      message: result.message,
      executionResult: result.executionResult,
      parsedEffect: result.parsedEffect
    });
  }
  
  // Sumário
  const passing = results.filter(r => r.actualResult).length;
  const total = results.length;
  
  console.log('\n📊 SUMÁRIO DOS TESTES DETALHADOS:');
  console.log(`✅ Passando: ${passing}/${total} (${(passing/total*100).toFixed(1)}%)`);
  console.log(`❌ Falhando: ${total-passing}/${total} (${((total-passing)/total*100).toFixed(1)}%)`);
  
  if (passing < total) {
    console.log('\n❌ CARTAS AINDA FALHANDO:');
    results.filter(r => !r.actualResult).forEach(card => {
      console.log(`  • ${card.name}: ${card.message}`);
      console.log(`    Expected: ${card.expectedBehavior}`);
    });
  }
  
  return results;
}

// Expor globalmente
if (typeof window !== 'undefined') {
  (window as any).testProblematicCardsDetailed = testProblematicCardsDetailed;
}