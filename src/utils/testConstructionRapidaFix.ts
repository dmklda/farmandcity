import { testCardEffect } from './effectTester';

/**
 * Teste final da Construção Rápida após correções
 */
export function testConstructionRapidaFinal() {
  console.log('🏗️ TESTE FINAL DA CONSTRUÇÃO RÁPIDA');
  
  const cardName = 'Construção Rápida';
  const effectLogic = 'BOOST_CONSTRUCTION_COST_REDUCTION:1:1';
  
  console.log(`📝 Card: ${cardName}`);
  console.log(`📝 Effect Logic: ${effectLogic}`);
  console.log(`📝 Expected: Deve retornar constructionCostReduction = 1`);
  
  const result = testCardEffect(effectLogic, cardName);
  
  console.log(`\n✨ RESULTADO: ${result.success ? '✅ PASSOU' : '❌ FALHOU'}`);
  console.log(`📋 Mensagem: ${result.message}`);
  
  if (result.executionResult) {
    console.log('\n🔍 EXECUTION RESULT DETALHADO:');
    console.log(JSON.stringify(result.executionResult, null, 2));
    
    const hasConstructionReduction = (result.executionResult as any).constructionCostReduction !== undefined;
    console.log(`🔧 constructionCostReduction detectado: ${hasConstructionReduction}`);
    
    if (hasConstructionReduction) {
      console.log(`   Valor: ${(result.executionResult as any).constructionCostReduction}`);
    }
  }
  
  if (result.parsedEffect) {
    console.log('\n📊 PARSED EFFECT:');
    console.log(JSON.stringify(result.parsedEffect, null, 2));
  }
  
  // Teste adicional com diferentes variações
  console.log('\n🧪 TESTANDO VARIAÇÕES:');
  
  const variations = [
    'BOOST_CONSTRUCTION_COST_REDUCTION:2:1',
    'BOOST_CONSTRUCTION_COST_REDUCTION:1:2', 
    'BOOST_CITY_COST_REDUCTION:1:1'
  ];
  
  variations.forEach(variation => {
    const variationResult = testCardEffect(variation, `Teste-${variation}`);
    console.log(`   ${variationResult.success ? '✅' : '❌'} ${variation}: ${variationResult.success ? 'PASSOU' : 'FALHOU'}`);
  });
  
  return {
    success: result.success,
    message: result.message,
    executionResult: result.executionResult,
    parsedEffect: result.parsedEffect
  };
}

// Expor globalmente
if (typeof window !== 'undefined') {
  (window as any).testConstructionRapidaFinal = testConstructionRapidaFinal;
}