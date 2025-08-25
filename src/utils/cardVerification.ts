import { runEffectTestSuite, testCardEffect, testDiceEffect, testConditionalEffect } from './effectTester';
import { supabase } from '../integrations/supabase/client';

/**
 * Verifica todas as cartas ativas do banco de dados
 */
export async function verifyAllActiveCards() {
  console.log('🔍 Iniciando verificação completa das cartas...');
  
  try {
    // Buscar todas as cartas ativas com effect_logic
    const { data: cards, error } = await supabase
      .from('cards')
      .select('id, name, effect, effect_logic, type, rarity')
      .eq('is_active', true)
      .not('effect_logic', 'is', null)
      .neq('effect_logic', '');

    if (error) {
      console.error('Erro ao buscar cartas:', error);
      return;
    }

    if (!cards || cards.length === 0) {
      console.log('❌ Nenhuma carta encontrada');
      return;
    }

    console.log(`📊 Encontradas ${cards.length} cartas para testar`);

    // Executar teste completo
    const results = runEffectTestSuite(cards);
    
    // Relatório detalhado
    console.log('\n📋 RELATÓRIO COMPLETO:');
    console.log(`✅ Sucessos: ${results.successful}/${results.total} (${(results.successful/results.total*100).toFixed(1)}%)`);
    console.log(`❌ Falhas: ${results.failed}/${results.total} (${(results.failed/results.total*100).toFixed(1)}%)`);
    console.log(`⚠️ Avisos: ${results.warnings}/${results.total} (${(results.warnings/results.total*100).toFixed(1)}%)`);

    // Agrupar por status
    const successfulCards = results.details.filter(r => r.status === 'success');
    const failedCards = results.details.filter(r => r.status === 'failed');
    const warningCards = results.details.filter(r => r.status === 'warning');

    console.log('\n❌ CARTAS COM FALHAS:');
    failedCards.forEach(card => {
      console.log(`  • ${card.name}: ${card.message}`);
    });

    console.log('\n⚠️ CARTAS COM AVISOS:');
    warningCards.forEach(card => {
      console.log(`  • ${card.name}: ${card.message}`);
    });

    // Análise por tipo de efeito
    const effectAnalysis = analyzeEffectTypes(cards);
    console.log('\n📊 ANÁLISE POR TIPO DE EFEITO:');
    Object.entries(effectAnalysis).forEach(([type, count]) => {
      console.log(`  • ${type}: ${count} cartas`);
    });

    return {
      total: results.total,
      successful: results.successful,
      failed: results.failed,
      warnings: results.warnings,
      failedCards,
      warningCards,
      successfulCards,
      effectAnalysis
    };

  } catch (error) {
    console.error('❌ Erro durante verificação:', error);
    return null;
  }
}

/**
 * Analisa tipos de efeitos presentes nas cartas
 */
function analyzeEffectTypes(cards: any[]) {
  const analysis: Record<string, number> = {
    'PRODUCE_*': 0,
    'GAIN_*': 0,
    'BOOST_*': 0,
    'ON_DICE': 0,
    'IF_*': 0,
    'TRADE_*': 0,
    'Outros': 0
  };

  cards.forEach(card => {
    if (!card.effect_logic) return;

    const logic = card.effect_logic;
    
    if (logic.includes('PRODUCE_')) analysis['PRODUCE_*']++;
    else if (logic.includes('GAIN_')) analysis['GAIN_*']++;
    else if (logic.includes('BOOST_')) analysis['BOOST_*']++;
    else if (logic.includes('ON_DICE:')) analysis['ON_DICE']++;
    else if (logic.includes('IF_')) analysis['IF_*']++;
    else if (logic.includes('TRADE_')) analysis['TRADE_*']++;
    else analysis['Outros']++;
  });

  return analysis;
}

/**
 * Testa cartas específicas por nome
 */
export async function verifySpecificCards(cardNames: string[]) {
  console.log(`🎯 Testando cartas específicas: ${cardNames.join(', ')}`);
  
  for (const name of cardNames) {
    const { data: card } = await supabase
      .from('cards')
      .select('name, effect_logic')
      .eq('name', name)
      .eq('is_active', true)
      .single();

    if (!card) {
      console.log(`❌ Carta '${name}' não encontrada`);
      continue;
    }

    if (!card.effect_logic) {
      console.log(`⚠️ Carta '${name}' sem effect_logic`);
      continue;
    }

    console.log(`\n🧪 Testando: ${card.name}`);
    const result = testCardEffect(card.effect_logic, card.name);
    console.log(`   Resultado: ${result.message}`);
  }
}

/**
 * Teste rápido de cartas problemáticas conhecidas
 */
export async function testProblematicCards() {
  const problematicCards = [
    'Pequeno Jardim',           // PRODUCE_FOOD:1 - básico
    'Horta Comunitária',        // PRODUCE_FOOD:2;PRODUCE_POPULATION:1 - múltiplo
    'Chuva Mágica',            // BOOST_ALL_FARMS_FOOD_TEMP:1:1;BOOST_ALL_FARMS_MATERIALS_TEMP:1:1 - boost temp
    'Templo: Altar da Fertilidade', // BOOST_ALL_FARMS_FOOD:1:PER_TURN - boost contínuo
    'Campo de Arroz',          // PRODUCE_FOOD:1:ON_DICE:1,2 - dice effect
    'Fazenda de Milho'         // IF_FARMS_GE_3:PRODUCE_FOOD:3|PRODUCE_FOOD:2 - conditional
  ];

  console.log('🧪 Testando cartas problemáticas conhecidas...');
  
  for (const cardName of problematicCards) {
    await verifySpecificCards([cardName]);
  }
}

/**
 * Executa verificação completa e retorna resultados detalhados
 */
export async function runCompleteVerification() {
  console.log('🚀 Iniciando verificação completa do sistema de efeitos...');
  
  // 1. Testar cartas problemáticas primeiro
  await testProblematicCards();
  
  // 2. Executar verificação completa
  const results = await verifyAllActiveCards();
  
  if (results) {
    // 3. Relatório final
    console.log('\n🎯 RELATÓRIO FINAL:');
    console.log(`📊 Total: ${results.total} cartas`);
    console.log(`✅ Funcionando: ${results.successful} (${(results.successful/results.total*100).toFixed(1)}%)`);
    console.log(`❌ Com problemas: ${results.failed} (${(results.failed/results.total*100).toFixed(1)}%)`);
    
    if (results.failed > 0) {
      console.log('\n🔧 CARTAS QUE PRECISAM DE CORREÇÃO:');
      results.failedCards.forEach((card, index) => {
        console.log(`${index + 1}. ${card.name}: ${card.message}`);
      });
    }
    
    return results;
  }
  
  return null;
}

/**
 * Expor função globalmente para facilitar testes no console
 */
if (typeof window !== 'undefined') {
  (window as any).verifyAllActiveCards = verifyAllActiveCards;
  (window as any).verifySpecificCards = verifySpecificCards;
  (window as any).testProblematicCards = testProblematicCards;
  (window as any).runCompleteVerification = runCompleteVerification;
}