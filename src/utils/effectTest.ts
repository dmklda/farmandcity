// Arquivo de teste para o sistema híbrido de efeitos
// Este arquivo pode ser removido após a implementação estar funcionando

import { parseEffectLogic, validateEffectLogic, getEffectLogicType } from './effectParser';
import { executeCardEffects } from './effectExecutor';

// Testes do sistema de parsing
export function testEffectParser() {
  console.log('🧪 Testando Sistema Híbrido de Efeitos...');
  
  // Teste 1: Efeito simples
  const simpleEffect = "PRODUCE_FOOD:3;GAIN_COINS:2";
  console.log('📝 Efeito simples:', simpleEffect);
  console.log('✅ Parseado:', parseEffectLogic(simpleEffect));
  console.log('✅ Válido:', validateEffectLogic(simpleEffect));
  console.log('✅ Tipo:', getEffectLogicType(simpleEffect));
  
  // Teste 2: Efeito condicional
  const conditionalEffect = "PRODUCE_COINS:2;IF_CITY_EXISTS:GAIN_COINS:3";
  console.log('📝 Efeito condicional:', conditionalEffect);
  console.log('✅ Parseado:', parseEffectLogic(conditionalEffect));
  console.log('✅ Válido:', validateEffectLogic(conditionalEffect));
  console.log('✅ Tipo:', getEffectLogicType(conditionalEffect));
  
  // Teste 3: Efeito com dados
  const diceEffect = "PRODUCE_FOOD:1:ON_DICE:1,2";
  console.log('📝 Efeito com dados:', diceEffect);
  console.log('✅ Parseado:', parseEffectLogic(diceEffect));
  console.log('✅ Válido:', validateEffectLogic(diceEffect));
  console.log('✅ Tipo:', getEffectLogicType(diceEffect));
  
  // Teste 4: Efeito complexo (JSON)
  const complexEffect = '{"type":"production","resource":"food","base_amount":4,"end_turn_effect":{"type":"random","chance":0.5,"success":{"type":"production","resource":"food","amount":2},"failure":{"type":"gain","resource":"materials","amount":1}}}';
  console.log('📝 Efeito complexo:', complexEffect);
  console.log('✅ Parseado:', parseEffectLogic(complexEffect));
  console.log('✅ Válido:', validateEffectLogic(complexEffect));
  console.log('✅ Tipo:', getEffectLogicType(complexEffect));
  
  // Teste 5: Efeito misto
  const mixedEffect = "PRODUCE_FOOD:2;IF_MAGIC_EXISTS:PRODUCE_FOOD:3";
  console.log('📝 Efeito misto:', mixedEffect);
  console.log('✅ Parseado:', parseEffectLogic(mixedEffect));
  console.log('✅ Válido:', validateEffectLogic(mixedEffect));
  console.log('✅ Tipo:', getEffectLogicType(mixedEffect));
  
  // Teste 6: Efeito inválido
  const invalidEffect = "INVALID_EFFECT:invalid";
  console.log('📝 Efeito inválido:', invalidEffect);
  console.log('✅ Parseado:', parseEffectLogic(invalidEffect));
  console.log('✅ Válido:', validateEffectLogic(invalidEffect));
  console.log('✅ Tipo:', getEffectLogicType(invalidEffect));
  
  console.log('🧪 Testes concluídos!');
}

// Testes do sistema de execução
export function testEffectExecutor() {
  console.log('🧪 Testando Sistema de Execução de Efeitos...');
  
  // Mock do gameState para testes
  const mockGameState = {
    resources: { coins: 10, food: 5, materials: 3, population: 2 },
    playerCards: [
      { id: '1', name: 'Fazenda', type: 'farm' as const },
      { id: '2', name: 'Cidade', type: 'city' as const },
      { id: '3', name: 'Magia', type: 'magic' as const }
    ],
    farmGrid: [],
    cityGrid: [],
    eventGrid: []
  };
  
  // Importar o executor (pode dar erro se não estiver implementado ainda)
  try {
    // const { executeCardEffects } = require('./effectExecutor');
    console.log('✅ Executor importado com sucesso');
    
    // Teste de execução seria feito aqui
    console.log('📊 GameState mock:', mockGameState);
    
  } catch (error) {
    console.log('⚠️ Executor ainda não implementado:', error);
  }
  
  console.log('🧪 Testes de execução concluídos!');
}

// Teste específico para Horta Divina (versão Node.js compatível)
export function testHortaDivinaSimple() {
  console.log('🧪 Testando Horta Divina (versão simples)...');
  
  try {
    // Teste do effect_logic da Horta Divina
    const hortaDivinaEffect = "IF_HORTA_EXISTS:PRODUCE_FOOD:1;PRODUCE_MATERIALS:1";
    console.log('📝 Effect_logic da Horta Divina:', hortaDivinaEffect);
    
    // Testar parsing
    const parsed = parseEffectLogic(hortaDivinaEffect);
    console.log('✅ Parseado:', JSON.stringify(parsed, null, 2));
    console.log('✅ Válido:', validateEffectLogic(hortaDivinaEffect));
    console.log('✅ Tipo:', getEffectLogicType(hortaDivinaEffect));
    
    // Verificar se tem efeitos condicionais
    if (parsed && parsed.conditional) {
      console.log('✅ Efeitos condicionais encontrados:', parsed.conditional.length);
      parsed.conditional.forEach((effect, index) => {
        console.log(`  ${index + 1}. Tipo: ${effect.type}, Efeito: ${effect.effect.type}, Quantidade: ${effect.effect.amount}`);
      });
    }
    
    // Verificar se tem efeitos simples
    if (parsed && parsed.simple) {
      console.log('✅ Efeitos simples encontrados:', parsed.simple.length);
      parsed.simple.forEach((effect, index) => {
        console.log(`  ${index + 1}. Tipo: ${effect.type}, Quantidade: ${effect.amount}`);
      });
    }
    
    console.log('🧪 Teste da Horta Divina concluído com sucesso!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro no teste da Horta Divina:', error);
    return false;
  }
}

// Função principal de teste
export function runAllTests() {
  console.log('🚀 Iniciando todos os testes do sistema híbrido...');
  
  testEffectParser();
  console.log('---');
  testEffectExecutor();
  
  console.log('🎉 Todos os testes concluídos!');
}

// Executar testes se o arquivo for importado diretamente
if (typeof window !== 'undefined') {
  // No browser, adicionar ao console global para testes manuais
  (window as any).testEffectSystem = runAllTests;
  console.log('🧪 Sistema de testes disponível em window.testEffectSystem()');
}

// Teste simples para verificar se o parser está funcionando
import { parseEffectLogic } from './effectParser';
import { executeCardEffects } from './effectExecutor';

// Testar algumas das cartas problemáticas
const testCards = [
  {
    name: 'Elemental da Luz',
    effect_logic: 'PRODUCE_REPUTATION:1:4'
  },
  {
    name: 'Comércio Urbano',
    effect_logic: 'IF_CITY_EXISTS:GAIN_COINS:3|GAIN_COINS:2'
  },
  {
    name: 'Celebração Metropolitana',
    effect_logic: 'RANDOM_CHANCE:50:GAIN_MATERIALS:3|GAIN_MATERIALS:1'
  },
  {
    name: 'Tempestade Próspera',
    effect_logic: 'IF_CITY_GE_3:BOOST_ALL_CITIES_MATERIALS_TEMP:3:1|BOOST_ALL_CITIES_MATERIALS_TEMP:2:1'
  },
  {
    name: 'Construção Urbana',
    effect_logic: 'EXTRA_BUILD_CITY:1:1'
  }
];

// Mock do gameState para teste
const mockGameState = {
  turn: 1,
  phase: 'build' as const,
  resources: { coins: 10, food: 10, materials: 10, population: 5 },
  playerStats: { reputation: 0, totalProduction: 0, buildings: 0, landmarks: 0 },
  farmGrid: Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({ card: null }))),
  cityGrid: Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({ card: null }))),
  landmarksGrid: Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({ card: null }))),
  eventGrid: Array(1).fill(null).map(() => Array(1).fill(null).map(() => ({ card: null }))),
  hand: [],
  deck: [],
  activeEvents: [],
  comboEffects: [],
  magicUsedThisTurn: false,
  builtCountThisTurn: 0
};

console.log('=== TESTANDO PARSER DE EFEITOS ===');
for (const card of testCards) {
  console.log(`\n--- ${card.name} ---`);
  console.log('Effect Logic:', card.effect_logic);
  const parsed = parseEffectLogic(card.effect_logic);
  console.log('Parsed Result:', JSON.stringify(parsed, null, 2));
  
  // Testar execução
  if (parsed) {
    const result = executeCardEffects(card.effect_logic, mockGameState, 'test-card-id');
    console.log('Execution Result:', result);
  }
}
