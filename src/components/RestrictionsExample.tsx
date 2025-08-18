import React from 'react';
import { useGameState } from '../hooks/useGameState';
import './restrictionsExample.css';

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
      

    </div>
  );
};

export default RestrictionsExample;
