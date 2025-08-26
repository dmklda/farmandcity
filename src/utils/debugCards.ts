import { testCardEffect, createMockGameState } from './effectTester';
import { parseEffectLogic } from './effectParser';
import { executeCardEffects } from './effectExecutor';

/**
 * Debug específico para as 5 cartas problemáticas
 */
export function debugProblematicCards() {
  console.log('🐛 DEBUG DAS 5 CARTAS PROBLEMÁTICAS');
  
  const problematicCards = [
    {
      name: 'Tempestade Próspera',
      effect_logic: 'IF_CITY_GE_3:BOOST_ALL_CITIES_MATERIALS_TEMP:3:1|BOOST_ALL_CITIES_MATERIALS_TEMP:2:1'
    },
    {
      name: 'Apocalipse Mágico', 
      effect_logic: 'BOOST_CONSTRUCTIONS:food:3:farm,city,landmark;BOOST_CONSTRUCTIONS:coins:3:farm,city,landmark;BOOST_CONSTRUCTIONS:materials:3:farm,city,landmark'
    },
    {
      name: 'Otimização Urbana',
      effect_logic: 'BOOST_CITY_COST_REDUCTION:2:1'
    },
    {
      name: 'Fazenda de Milho',
      effect_logic: 'IF_FARMS_GE_3:PRODUCE_FOOD:3|PRODUCE_FOOD:2'
    },
    {
      name: 'Feira de Artesanato',
      effect_logic: 'IF_WORKSHOPS_GE_2:PRODUCE_COINS:3|PRODUCE_COINS:2'
    }
  ];
  
  for (const card of problematicCards) {
    console.log(`\n🔍 DEBUGANDO: ${card.name}`);
    console.log(`📝 Effect Logic: ${card.effect_logic}`);
    
    // 1. Testar parsing
    console.log('\n1️⃣ TESTANDO PARSING:');
    const parsed = parseEffectLogic(card.effect_logic);
    console.log('Resultado do parsing:', JSON.stringify(parsed, null, 2));
    
    if (!parsed) {
      console.log('❌ FALHA NO PARSING!');
      continue;
    }
    
    // 2. Testar estado do jogo
    console.log('\n2️⃣ ESTADO DO JOGO MOCK:');
    const gameState = createMockGameState();
    
    console.log(`Fazendas no grid: ${gameState.farmGrid.flat().filter(cell => cell.card).length}`);
    console.log(`Cidades no grid: ${gameState.cityGrid.flat().filter(cell => cell.card).length}`);
    console.log(`Oficinas no grid: ${gameState.cityGrid.flat().filter(cell => cell.card && (
      cell.card.name.toLowerCase().includes('oficina') || 
      (cell.card.tags && cell.card.tags.includes('workshop'))
    )).length}`);
    console.log(`Marcos no grid: ${gameState.landmarksGrid.flat().filter(cell => cell.card).length}`);
    console.log(`Recursos iniciais:`, gameState.resources);
    
    // 3. Executar efeito
    console.log('\n3️⃣ EXECUTANDO EFEITO:');
    const beforeResources = { ...gameState.resources };
    const executionResult = executeCardEffects(card.effect_logic, gameState, `test-${card.name}`, undefined, undefined, undefined, undefined, false);
    const afterResources = { ...gameState.resources };
    
    console.log('Recursos ANTES:', beforeResources);
    console.log('Recursos DEPOIS:', afterResources);
    console.log('Resultado da execução:', JSON.stringify(executionResult, null, 2));
    
    // 4. Verificar mudanças
    const resourcesChanged = JSON.stringify(beforeResources) !== JSON.stringify(afterResources);
    const hasExecutionResult = Object.keys(executionResult).length > 0;
    
    console.log(`Recursos mudaram: ${resourcesChanged}`);
    console.log(`Execution result não vazio: ${hasExecutionResult}`);
    
    // 5. Análise específica por tipo
    console.log('\n4️⃣ ANÁLISE ESPECÍFICA:');
    
    if (parsed.conditional && parsed.conditional.length > 0) {
      console.log('🔄 EFEITO CONDICIONAL DETECTADO:');
      for (const conditional of parsed.conditional) {
        console.log(`  Condição: ${conditional.type}`);
        console.log(`  Operador: ${conditional.logicalOperator || 'AND'}`);
        console.log(`  Efeito: ${conditional.effect.type}:${conditional.effect.amount}`);
      }
    }
    
    if (parsed.simple && parsed.simple.length > 0) {
      console.log('⚡ EFEITOS SIMPLES DETECTADOS:');
      for (const simple of parsed.simple) {
        console.log(`  Tipo: ${simple.type}`);
        console.log(`  Quantidade: ${simple.amount}`);
        console.log(`  Frequência: ${simple.frequency}`);
        if (simple.description) {
          console.log(`  Descrição: ${simple.description}`);
        }
      }
    }
    
    // 6. Resultado final
    const isWorking = resourcesChanged || hasExecutionResult;
    console.log(`\n✨ RESULTADO: ${isWorking ? '✅ FUNCIONANDO' : '❌ NÃO FUNCIONANDO'}`);
    
    if (!isWorking) {
      console.log('🚨 POSSÍVEIS CAUSAS:');
      console.log('  - Efeito não retorna mudanças detectáveis');
      console.log('  - Condição não está sendo atendida');
      console.log('  - Parsing incorreto do efeito');
      console.log('  - Execução não implementada para este tipo');
    }
  }
}

/**
 * Debug específico para efeitos BOOST_*_TEMP
 */
export function debugTempBoosts() {
  console.log('\n🌡️ DEBUG DE EFEITOS TEMPORÁRIOS:');
  
  const tempEffects = [
    'BOOST_ALL_CITIES_MATERIALS_TEMP:2:1',
    'BOOST_ALL_FARMS_FOOD_TEMP:1:1',
    'BOOST_ALL_CITIES_COINS_TEMP:3:1'
  ];
  
  for (const effect of tempEffects) {
    console.log(`\n🧪 Testando: ${effect}`);
    const gameState = createMockGameState();
    const result = executeCardEffects(effect, gameState, 'test-temp');
    console.log('Resultado:', JSON.stringify(result, null, 2));
  }
}

/**
 * Debug específico para condições IF_*
 */
export function debugConditionals() {
  console.log('\n🎯 DEBUG DE CONDIÇÕES:');
  
  const conditionals = [
    'IF_CITY_GE_3:GAIN_COINS:5|GAIN_COINS:2',
    'IF_FARMS_GE_3:PRODUCE_FOOD:3|PRODUCE_FOOD:2',
    'IF_WORKSHOPS_GE_2:PRODUCE_COINS:3|PRODUCE_COINS:2'
  ];
  
  const gameState = createMockGameState();
  console.log('Estado do jogo para testes:');
  console.log(`  Fazendas: ${gameState.farmGrid.flat().filter(cell => cell.card).length}`);
  console.log(`  Cidades: ${gameState.cityGrid.flat().filter(cell => cell.card).length}`);
  console.log(`  Oficinas: ${gameState.cityGrid.flat().filter(cell => cell.card && cell.card.name.toLowerCase().includes('oficina')).length}`);
  
  for (const effect of conditionals) {
    console.log(`\n🧪 Testando: ${effect}`);
    const parsed = parseEffectLogic(effect);
    console.log('Parsed:', JSON.stringify(parsed?.conditional, null, 2));
    
    const result = executeCardEffects(effect, gameState, 'test-conditional');
    console.log('Resultado:', JSON.stringify(result, null, 2));
  }
}

// Expor globalmente
if (typeof window !== 'undefined') {
  (window as any).debugProblematicCards = debugProblematicCards;
  (window as any).debugTempBoosts = debugTempBoosts;
  (window as any).debugConditionals = debugConditionals;
}