import React from 'react';
import { useGameState } from '../hooks/useGameState';

/**
 * Exemplo de como usar o componente de restrições na interface
 */
export const RestrictionsExample: React.FC = () => {
  const { RestrictionsDisplay } = useGameState();
  
  return (
    <div className="restrictions-example">
      <h3>🚫 Restrições Temporárias</h3>
      
      {/* Componente de restrições ativas */}
      <RestrictionsDisplay />
      
      <div className="restrictions-info">
        <p>Este componente mostra automaticamente as restrições ativas:</p>
        <ul>
          <li>🚫 Cartas bloqueadas por tipo</li>
          <li>⏰ Duração restante</li>
          <li>🎯 Descrição da restrição</li>
        </ul>
      </div>
      
      <style jsx>{`
        .restrictions-example {
          padding: 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin: 16px 0;
        }
        
        .restrictions-info {
          margin-top: 16px;
          padding: 12px;
          background: #f5f5f5;
          border-radius: 6px;
        }
        
        .restrictions-info ul {
          margin: 8px 0;
          padding-left: 20px;
        }
        
        .restrictions-info li {
          margin: 4px 0;
        }
      `}</style>
    </div>
  );
};

export default RestrictionsExample;
