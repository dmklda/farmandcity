// Teste do Sistema de Restrições Temporárias
import { GameState } from '../types/gameState';
import { CardRestriction } from '../types/card';
import { 
  applyCardRestrictions, 
  canPlayCard, 
  cleanupExpiredRestrictions,
  getActiveRestrictionsDescription 
} from './effectExecutor';

/**
 * Testa o sistema de restrições temporárias
 */
export function testRestrictionSystem(): void {
  console.log('🧪 Testando Sistema de Restrições Temporárias...');
  
  // Criar estado de jogo de teste
  const gameState: GameState = {
    turn: 5,
    phase: 'action',
    resources: { coins: 10, food: 5, materials: 3, population: 2 },
    playerStats: { reputation: 0, totalProduction: 0, buildings: 0, landmarks: 0 },
    farmGrid: [],
    cityGrid: [],
    landmarksGrid: [],
    eventGrid: [],
    hand: [],
    deck: [],
    activeEvents: [],
    comboEffects: [],
    magicUsedThisTurn: false,
    builtCountThisTurn: 0
  };
  
  // Teste 1: Aplicar restrição
  console.log('\n📋 Teste 1: Aplicando restrição...');
  const restriction: CardRestriction = {
    id: 'test_restriction_1',
    restrictedTypes: ['action', 'magic'],
    duration: 2,
    scope: 'next_turn',
    appliedAt: 5,
    appliedBy: 'armadilha_gelo',
    description: 'Não pode jogar cartas de ação e magia por 2 turnos',
    isActive: true
  };
  
  applyCardRestrictions([restriction], 'armadilha_gelo', gameState);
  console.log('✅ Restrição aplicada:', gameState.cardRestrictions);
  
  // Teste 2: Verificar se carta pode ser jogada
  console.log('\n🎯 Teste 2: Verificando restrições...');
  console.log('Pode jogar carta de ação?', canPlayCard('action', gameState));
  console.log('Pode jogar carta de fazenda?', canPlayCard('farm', gameState));
  console.log('Pode jogar carta de magia?', canPlayCard('magic', gameState));
  
  // Teste 3: Avançar turno
  console.log('\n⏰ Teste 3: Avançando turno...');
  gameState.turn = 6;
  console.log('Turno atual:', gameState.turn);
  console.log('Pode jogar carta de ação?', canPlayCard('action', gameState));
  
  // Teste 4: Avançar mais um turno
  console.log('\n⏰ Teste 4: Avançando mais um turno...');
  gameState.turn = 7;
  console.log('Turno atual:', gameState.turn);
  console.log('Pode jogar carta de ação?', canPlayCard('action', gameState));
  
  // Teste 5: Limpar restrições expiradas
  console.log('\n🧹 Teste 5: Limpando restrições expiradas...');
  cleanupExpiredRestrictions(gameState);
  console.log('Restrições após limpeza:', gameState.cardRestrictions);
  
  // Teste 6: Descrições das restrições ativas
  console.log('\n📝 Teste 6: Descrições das restrições...');
  const descriptions = getActiveRestrictionsDescription(gameState);
  console.log('Descrições ativas:', descriptions);
  
  console.log('\n✅ Teste do Sistema de Restrições Concluído!');
}

/**
 * Executa todos os testes
 */
export function runAllRestrictionTests(): void {
  console.log('🚀 Iniciando Testes do Sistema de Restrições...');
  testRestrictionSystem();
  console.log('🎉 Todos os testes executados com sucesso!');
}
