// Verificação rápida dos efeitos corrigidos in-game

/**
 * Testa se os efeitos estão sendo aplicados corretamente no jogo
 */
export function verifyInGameEffects() {
  console.log('🔧 VERIFICANDO CORREÇÕES DOS EFEITOS IN-GAME');
  
  const issues = [];
  const fixes = [];
  
  // Verificar se executeCardEffects está aplicando mudanças
  const testGameState = {
    resources: { coins: 10, food: 5, materials: 8, population: 3 },
    farmGrid: [[{ card: null }]],
    cityGrid: [[{ card: null }]],
    landmarksGrid: [[{ card: null }]],
    eventGrid: [[{ card: null }]],
    hand: [],
    deck: [],
    phase: 'production',
    turn: 1,
    playerStats: { reputation: 5 },
    effectTracking: {}
  };
  
  console.log('✅ Recursos iniciais para teste:', testGameState.resources);
  
  // Testar efeito simples de produção
  try {
    const { executeCardEffects } = require('./effectExecutor');
    const testLogic = '{"simple":[{"type":"PRODUCE_FOOD","amount":2,"frequency":"PER_TURN"}]}';
    
    const changes = executeCardEffects(testLogic, testGameState, 'test-card');
    console.log('✅ Mudanças calculadas:', changes);
    console.log('✅ Estado após executeCardEffects:', testGameState.resources);
    
    if (testGameState.resources.food > 5) {
      fixes.push('✅ executeCardEffects aplicando mudanças corretamente');
    } else {
      issues.push('❌ executeCardEffects não aplicou mudanças');
    }
  } catch (error: any) {
    issues.push('❌ Erro ao executar teste de efeitos: ' + error.message);
  }
  
  // Verificar system de tracking
  console.log('✅ Sistema de tracking:', testGameState.effectTracking);
  
  console.log('\n📊 RESULTADO DA VERIFICAÇÃO:');
  console.log('Correções funcionando:', fixes.length);
  console.log('Problemas restantes:', issues.length);
  
  if (fixes.length > 0) {
    console.log('\n✅ CORREÇÕES APLICADAS:');
    fixes.forEach(fix => console.log(fix));
  }
  
  if (issues.length > 0) {
    console.log('\n❌ PROBLEMAS ENCONTRADOS:');
    issues.forEach(issue => console.log(issue));
  }
  
  return {
    working: fixes.length,
    broken: issues.length,
    details: { fixes, issues }
  };
}

/**
 * Teste específico para cartas de produção
 */
export function testProductionCards() {
  console.log('🌾 TESTANDO CARTAS DE PRODUÇÃO');
  
  const productionCards = [
    { name: 'Fazenda de Milho', logic: '{"simple":[{"type":"PRODUCE_FOOD","amount":2,"frequency":"PER_TURN"}]}' },
    { name: 'Tempestade Próspera', logic: '{"conditional":[{"type":"IF_FARMS_GE_2","effect":{"type":"BOOST_ALL_FARMS","amount":1,"frequency":"PER_TURN"},"logicalOperator":"AND"}]}' },
    { name: 'Construção Rápida', logic: '{"simple":[{"type":"BOOST_CONSTRUCTION_COST_REDUCTION","amount":1,"frequency":"CONTINUOUS"}]}' }
  ];
  
  const testState = {
    resources: { coins: 0, food: 0, materials: 0, population: 0 },
    farmGrid: [
      [{ card: { name: 'Fazenda 1', type: 'farm' } }],
      [{ card: { name: 'Fazenda 2', type: 'farm' } }]
    ],
    cityGrid: [[{ card: null }]],
    landmarksGrid: [[{ card: null }]],
    eventGrid: [[{ card: null }]],
    hand: [],
    deck: [],
    phase: 'production',
    turn: 1,
    playerStats: { reputation: 0 },
    effectTracking: {}
  };
  
  productionCards.forEach(card => {
    console.log(`\n🎯 Testando: ${card.name}`);
    const initialResources = JSON.stringify(testState.resources);
    
    try {
      const { executeCardEffects } = require('./effectExecutor');
      const changes = executeCardEffects(card.logic, testState, card.name);
      
      console.log(`  📊 Mudanças: ${JSON.stringify(changes)}`);
      console.log(`  💰 Recursos antes: ${initialResources}`);
      console.log(`  💰 Recursos depois: ${JSON.stringify(testState.resources)}`);
      
      const hasChanges = Object.values(changes).some(v => v && v !== 0);
      const resourcesChanged = JSON.stringify(testState.resources) !== initialResources;
      
      if (hasChanges && resourcesChanged) {
        console.log(`  ✅ ${card.name}: FUNCIONANDO`);
      } else if (hasChanges && !resourcesChanged) {
        console.log(`  ⚠️ ${card.name}: Efeito calculado mas recursos não alterados`);
      } else {
        console.log(`  ❌ ${card.name}: Sem efeito detectado`);
      }
    } catch (error: any) {
      console.log(`  ❌ ${card.name}: ERRO - ${error.message}`);
    }
  });
}

// Expor globalmente para testes
if (typeof window !== 'undefined') {
  (window as any).verifyInGameEffects = verifyInGameEffects;
  (window as any).testProductionCards = testProductionCards;
}