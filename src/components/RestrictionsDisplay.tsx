import React from 'react';
import { GameState } from '../types/gameState';
import { getActiveRestrictionsDescription } from '../utils/effectExecutor';

interface RestrictionsDisplayProps {
  gameState: GameState;
}

/**
 * Componente para mostrar restrições temporárias ativas
 */
export const RestrictionsDisplay: React.FC<RestrictionsDisplayProps> = ({ gameState }) => {
  const activeRestrictions = getActiveRestrictionsDescription(gameState);
  
  if (!activeRestrictions || activeRestrictions.length === 0) {
    return null; // Não mostrar nada se não há restrições
  }
  
  return (
    <div className="bg-gradient-to-br from-red-400 to-orange-500 border-2 border-red-600 rounded-xl p-3 m-2 shadow-lg animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg animate-bounce">🚫</span>
        <span className="font-bold text-white text-sm drop-shadow">Restrições Ativas</span>
      </div>
      <div className="flex flex-col gap-1">
        {activeRestrictions.map((restriction, index) => (
          <div key={index} className="bg-white/10 rounded-md p-2">
            <span className="text-white text-xs drop-shadow">{restriction}</span>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
};

export default RestrictionsDisplay;
