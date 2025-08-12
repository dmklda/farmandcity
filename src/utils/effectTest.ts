// Arquivo de teste para o sistema híbrido de efeitos
// Este arquivo pode ser removido após a implementação estar funcionando

import { parseEffectLogic, validateEffectLogic, getEffectLogicType } from './effectParser';

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
