// Verificação final e completa dos efeitos corrigidos

import { executeCardEffects } from './effectExecutor';
import { parseEffectLogic } from './effectParser';

/**
 * Teste completo e final para verificar se todos os efeitos estão funcionando
 */
export function runFinalEffectTest() {
  console.log('🚀 TESTE FINAL DE VERIFICAÇÃO DOS EFEITOS');
  console.log('='.repeat(50));
  
  const results: any = {
    production: { working: 0, broken: 0, details: [] },
    construction: { working: 0, broken: 0, details: [] },
    dice: { working: 0, broken: 0, details: [] },
    boosts: { working: 0, broken: 0, details: [] },
    overall: { success: false, score: 0 }
  };
  
  // Estado de teste padrão
  const createTestState = (): any => ({
    resources: { coins: 10, food: 10, materials: 10, population: 5 },
    farmGrid: [
      [{ card: { id: 'farm1', name: 'Fazenda Test', type: 'farm' } }],
      [{ card: { id: 'farm2', name: 'Fazenda Test 2', type: 'farm' } }]
    ],
    cityGrid: [
      [{ card: { id: 'city1', name: 'Cidade Test', type: 'city' } }]
    ],
    landmarksGrid: [[{ card: null }]],
    eventGrid: [[{ card: null }]],
    hand: [],
    deck: [],
    phase: 'production' as any,
    turn: 1,
    playerStats: { reputation: 5, totalProduction: 0, buildings: 0, landmarks: 0 },
    effectTracking: {},
    activeEvents: [],
    comboEffects: [],
    magicUsedThisTurn: false,
    builtCountThisTurn: 0
  });
  
  // 1. TESTE DE PRODUÇÃO
  console.log('\n🌾 TESTANDO EFEITOS DE PRODUÇÃO');
  const productionTests = [
    { name: 'Fazenda de Milho', logic: '{"simple":[{"type":"PRODUCE_FOOD","amount":2,"frequency":"PER_TURN"}]}' },
    { name: 'Mina de Ouro', logic: '{"simple":[{"type":"PRODUCE_COINS","amount":3,"frequency":"PER_TURN"}]}' },
    { name: 'Oficina', logic: '{"simple":[{"type":"PRODUCE_MATERIALS","amount":1,"frequency":"PER_TURN"}]}' },
    { name: 'Casa', logic: '{"simple":[{"type":"PRODUCE_POPULATION","amount":1,"frequency":"PER_TURN"}]}' }
  ];
  
  productionTests.forEach(test => {
    const state = createTestState();
    const initialResources = JSON.parse(JSON.stringify(state.resources));
    
    try {
      console.log(`  🎯 ${test.name}:`);
      const changes = executeCardEffects(test.logic, state, test.name);
      
      const resourcesChanged = JSON.stringify(state.resources) !== JSON.stringify(initialResources);
      const hasValidChanges = Object.entries(changes).some(([key, value]) => 
        ['coins', 'food', 'materials', 'population'].includes(key) && value && value > 0
      );
      
      if (resourcesChanged && hasValidChanges) {
        console.log(`    ✅ FUNCIONANDO - Recursos alterados:`, changes);
        results.production.working++;
        results.production.details.push(`✅ ${test.name}: Recursos produzidos corretamente`);
      } else {
        console.log(`    ❌ FALHOU - Recursos não alterados`);
        results.production.broken++;
        results.production.details.push(`❌ ${test.name}: Produção não aplicada`);
      }
    } catch (error: any) {
      console.log(`    ❌ ERRO:`, error.message);
      results.production.broken++;
      results.production.details.push(`❌ ${test.name}: Erro - ${error.message}`);
    }
  });
  
  // 2. TESTE DE CONSTRUÇÃO (GAIN_*)
  console.log('\n🏗️ TESTANDO EFEITOS DE CONSTRUÇÃO');
  const constructionTests = [
    { name: 'Ganho de Moedas', logic: '{"simple":[{"type":"GAIN_COINS","amount":5,"frequency":"ONCE"}]}' },
    { name: 'Ganho de Comida', logic: '{"simple":[{"type":"GAIN_FOOD","amount":3,"frequency":"ONCE"}]}' },
    { name: 'Ganho de Materiais', logic: '{"simple":[{"type":"GAIN_MATERIALS","amount":2,"frequency":"ONCE"}]}' }
  ];
  
  constructionTests.forEach(test => {
    const state = createTestState();
    const initialResources = JSON.parse(JSON.stringify(state.resources));
    
    try {
      console.log(`  🎯 ${test.name}:`);
      const changes = executeCardEffects(test.logic, state, test.name, undefined, undefined, undefined, undefined, true);
      
      const resourcesChanged = JSON.stringify(state.resources) !== JSON.stringify(initialResources);
      const hasValidChanges = Object.entries(changes).some(([key, value]) => 
        ['coins', 'food', 'materials', 'population'].includes(key) && value && value > 0
      );
      
      if (resourcesChanged && hasValidChanges) {
        console.log(`    ✅ FUNCIONANDO - Ganho aplicado:`, changes);
        results.construction.working++;
        results.construction.details.push(`✅ ${test.name}: Ganho aplicado corretamente`);
      } else {
        console.log(`    ❌ FALHOU - Ganho não aplicado`);
        results.construction.broken++;
        results.construction.details.push(`❌ ${test.name}: Ganho não aplicado`);
      }
    } catch (error: any) {
      console.log(`    ❌ ERRO:`, error.message);
      results.construction.broken++;
      results.construction.details.push(`❌ ${test.name}: Erro - ${error.message}`);
    }
  });
  
  // 3. TESTE DE EFEITOS DE DADO
  console.log('\n🎲 TESTANDO EFEITOS DE DADO');
  const diceTests = [
    { name: 'Efeito Dado 1-3', logic: '{"dice":[{"diceRange":[1,2,3],"effect":{"type":"GAIN_COINS","amount":2,"frequency":"ON_DICE"}}]}' },
    { name: 'Efeito Dado 4-6', logic: '{"dice":[{"diceRange":[4,5,6],"effect":{"type":"GAIN_FOOD","amount":3,"frequency":"ON_DICE"}}]}' }
  ];
  
  diceTests.forEach(test => {
    const state = createTestState();
    const initialResources = JSON.parse(JSON.stringify(state.resources));
    
    try {
      console.log(`  🎯 ${test.name}:`);
      // Testar com dado 2 (deveria ativar primeiro efeito)
      const changes = executeCardEffects(test.logic, state, test.name, 2);
      
      const resourcesChanged = JSON.stringify(state.resources) !== JSON.stringify(initialResources);
      const hasValidChanges = Object.entries(changes).some(([key, value]) => 
        ['coins', 'food', 'materials', 'population'].includes(key) && value && value > 0
      );
      
      if (resourcesChanged && hasValidChanges) {
        console.log(`    ✅ FUNCIONANDO - Efeito de dado ativado:`, changes);
        results.dice.working++;
        results.dice.details.push(`✅ ${test.name}: Efeito de dado funciona`);
      } else {
        console.log(`    ❌ FALHOU - Efeito de dado não ativou`);
        results.dice.broken++;
        results.dice.details.push(`❌ ${test.name}: Efeito de dado não funciona`);
      }
    } catch (error: any) {
      console.log(`    ❌ ERRO:`, error.message);
      results.dice.broken++;
      results.dice.details.push(`❌ ${test.name}: Erro - ${error.message}`);
    }
  });
  
  // 4. TESTE DE BOOSTS
  console.log('\n⚡ TESTANDO EFEITOS DE BOOST');
  const boostTests = [
    { name: 'Boost Fazendas', logic: '{"simple":[{"type":"BOOST_ALL_FARMS","amount":1,"frequency":"PER_TURN"}]}' },
    { name: 'Boost Cidades', logic: '{"simple":[{"type":"BOOST_ALL_CITIES","amount":2,"frequency":"PER_TURN"}]}' },
    { name: 'Boost Construção', logic: '{"simple":[{"type":"BOOST_CONSTRUCTION_COST_REDUCTION","amount":1,"frequency":"CONTINUOUS"}]}' }
  ];
  
  boostTests.forEach(test => {
    const state = createTestState();
    const initialResources = JSON.parse(JSON.stringify(state.resources));
    
    try {
      console.log(`  🎯 ${test.name}:`);
      const changes = executeCardEffects(test.logic, state, test.name);
      
      const resourcesChanged = JSON.stringify(state.resources) !== JSON.stringify(initialResources);
      const hasBoostEffects = Object.keys(changes).some(key => 
        key.includes('Boost') || key.includes('boost') || key.includes('Cost') || key.includes('cost')
      );
      const hasDirectResources = Object.entries(changes).some(([key, value]) => 
        ['coins', 'food', 'materials'].includes(key) && value && value > 0
      );
      
      if (resourcesChanged || hasBoostEffects || hasDirectResources) {
        console.log(`    ✅ FUNCIONANDO - Boost aplicado:`, changes);
        results.boosts.working++;
        results.boosts.details.push(`✅ ${test.name}: Boost funciona`);
      } else {
        console.log(`    ❌ FALHOU - Boost não aplicado`);
        results.boosts.broken++;
        results.boosts.details.push(`❌ ${test.name}: Boost não funciona`);
      }
    } catch (error: any) {
      console.log(`    ❌ ERRO:`, error.message);
      results.boosts.broken++;
      results.boosts.details.push(`❌ ${test.name}: Erro - ${error.message}`);
    }
  });
  
  // CÁLCULO DO RESULTADO FINAL
  const totalTests = productionTests.length + constructionTests.length + diceTests.length + boostTests.length;
  const totalWorking = results.production.working + results.construction.working + results.dice.working + results.boosts.working;
  const totalBroken = results.production.broken + results.construction.broken + results.dice.broken + results.boosts.broken;
  
  results.overall.score = Math.round((totalWorking / totalTests) * 100);
  results.overall.success = results.overall.score >= 80; // 80% ou mais = sucesso
  
  // RELATÓRIO FINAL
  console.log('\n' + '='.repeat(50));
  console.log('📊 RELATÓRIO FINAL');
  console.log('='.repeat(50));
  
  console.log(`🎯 Pontuação: ${results.overall.score}% (${totalWorking}/${totalTests} funcionando)`);
  console.log(`📈 Produção: ${results.production.working}/${productionTests.length} funcionando`);
  console.log(`🏗️ Construção: ${results.construction.working}/${constructionTests.length} funcionando`);
  console.log(`🎲 Dados: ${results.dice.working}/${diceTests.length} funcionando`);
  console.log(`⚡ Boosts: ${results.boosts.working}/${boostTests.length} funcionando`);
  
  if (results.overall.success) {
    console.log('\n🎉 SUCESSO! Os efeitos estão funcionando corretamente in-game!');
  } else {
    console.log('\n⚠️ ATENÇÃO: Ainda há problemas com alguns efeitos in-game');
  }
  
  // Mostrar detalhes dos problemas
  const allBrokenDetails = [
    ...results.production.details.filter((d: string) => d.includes('❌')),
    ...results.construction.details.filter((d: string) => d.includes('❌')),
    ...results.dice.details.filter((d: string) => d.includes('❌')),
    ...results.boosts.details.filter((d: string) => d.includes('❌'))
  ];
  
  if (allBrokenDetails.length > 0) {
    console.log('\n❌ PROBLEMAS ENCONTRADOS:');
    allBrokenDetails.forEach(detail => console.log(detail));
  }
  
  console.log('\n✅ FUNCIONANDO:');
  const allWorkingDetails = [
    ...results.production.details.filter((d: string) => d.includes('✅')),
    ...results.construction.details.filter((d: string) => d.includes('✅')),
    ...results.dice.details.filter((d: string) => d.includes('✅')),
    ...results.boosts.details.filter((d: string) => d.includes('✅'))
  ];
  allWorkingDetails.forEach(detail => console.log(detail));
  
  return results;
}

// Expor globalmente
if (typeof window !== 'undefined') {
  (window as any).runFinalEffectTest = runFinalEffectTest;
}