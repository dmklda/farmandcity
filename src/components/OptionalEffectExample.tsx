import React from 'react';
import { useGameState } from '../hooks/useGameState';

/**
 * Componente de exemplo para demonstrar o sistema de efeitos opcionais
 */
export const OptionalEffectExample: React.FC = () => {
  const { 
    optionalEffectDialog, 
    handleOptionalEffectChoice,
    game 
  } = useGameState();

  return (
    <div className="optional-effect-example p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">🎯 Sistema de Efeitos Opcionais</h3>
      
      {/* Status do Dialog */}
      <div className="mb-4 p-3 bg-blue-50 rounded border">
        <h4 className="font-semibold text-blue-800">Status do Dialog:</h4>
        <p className="text-sm text-blue-600">
          {optionalEffectDialog.isOpen ? '🟢 Aberto' : '🔴 Fechado'}
        </p>
        {optionalEffectDialog.card && (
          <p className="text-sm text-blue-600">
            Carta: <strong>{optionalEffectDialog.card.name}</strong>
          </p>
        )}
        {optionalEffectDialog.effects.length > 0 && (
          <p className="text-sm text-blue-600">
            Efeitos opcionais: {optionalEffectDialog.effects.length}
          </p>
        )}
      </div>

      {/* Botões de teste */}
      <div className="space-y-2">
        <button
          onClick={() => {
            // Simular uma carta com efeito opcional
            const mockCard = {
              id: 'test-optional',
              name: 'Bênção Celestial (Teste)',
              type: 'action' as const,
              effect: { description: 'Teste de efeito opcional' },
              effect_logic: 'GAIN_COINS:3;OPTIONAL_DISCARD_BOOST_FARM:1:3',
              cost: { coins: 0, food: 0, materials: 0, population: 0 }
            };
            
            // Simular efeitos opcionais
            const mockEffects = [{
              type: 'OPTIONAL_DISCARD_BOOST_FARM',
              effect: '+1 alimento para todas as fazendas por 3 turnos',
              cost: 'Descartar 1 carta da mão',
              duration: 3
            }];
            
            // Abrir o dialog
            // Note: Isso não funcionará sem o contexto completo do jogo
            console.log('🎯 Simulando carta com efeito opcional:', mockCard);
            console.log('📋 Efeitos opcionais:', mockEffects);
          }}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          🧪 Simular Carta com Efeito Opcional
        </button>
        
        <button
          onClick={() => handleOptionalEffectChoice(true)}
          disabled={!optionalEffectDialog.isOpen}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✅ Simular Escolha: SIM
        </button>
        
        <button
          onClick={() => handleOptionalEffectChoice(false)}
          disabled={!optionalEffectDialog.isOpen}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ❌ Simular Escolha: NÃO
        </button>
      </div>

      {/* Informações sobre o sistema */}
      <div className="mt-4 p-3 bg-yellow-50 rounded border">
        <h4 className="font-semibold text-yellow-800">ℹ️ Como Funciona:</h4>
        <ul className="text-sm text-yellow-700 mt-2 space-y-1">
          <li>• Jogue uma carta com <code>OPTIONAL_DISCARD_</code> no effect_logic</li>
          <li>• O sistema detecta automaticamente efeitos opcionais</li>
          <li>• Dialog pergunta se deseja ativar o efeito</li>
          <li>• Se SIM: Jogador descarta carta → Boost aplicado</li>
          <li>• Se NÃO: Apenas efeito básico é aplicado</li>
        </ul>
      </div>

      {/* Estado atual do jogo */}
      <div className="mt-4 p-3 bg-gray-50 rounded border">
        <h4 className="font-semibold text-gray-800">🎮 Estado do Jogo:</h4>
        <p className="text-sm text-gray-600">
          Fase: <strong>{game.phase}</strong> | 
          Turno: <strong>{game.turn}</strong> | 
          Mão: <strong>{game.hand.length}</strong> cartas
        </p>
      </div>
    </div>
  );
};

export default OptionalEffectExample;
