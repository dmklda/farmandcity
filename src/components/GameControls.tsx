import React from 'react';
import { GamePhase } from '../types/gameState';

interface GameControlsProps {
  phase: GamePhase;
  turn: number;
  onNextPhase: () => void;
  onDrawCard: () => void;
  onEndTurn: () => void;
}

const phaseLabels: Record<GamePhase, string> = {
  draw: 'Compra',
  action: 'Ação',
  build: 'Construção',
  production: 'Produção',
  end: 'Fim',
};

const GameControls: React.FC<GameControlsProps> = ({ phase, turn, onNextPhase, onDrawCard, onEndTurn }) => (
  <div style={{ margin: '24px 0', display: 'flex', gap: 16, alignItems: 'center' }}>
    <span><strong>Turno:</strong> {turn}</span>
    <span><strong>Fase:</strong> {phaseLabels[phase]}</span>
    <button onClick={onNextPhase} style={{ padding: '8px 16px', borderRadius: 6, background: '#3B82F6', color: '#fff', border: 'none' }}>
      Avançar Fase
    </button>
    {phase === 'draw' && (
      <button onClick={onDrawCard} style={{ padding: '8px 16px', borderRadius: 6, background: '#10B981', color: '#fff', border: 'none' }}>
        Comprar Carta
      </button>
    )}
    {phase === 'end' && (
      <button onClick={onEndTurn} style={{ padding: '8px 16px', borderRadius: 6, background: '#F59E0B', color: '#fff', border: 'none' }}>
        Passar Turno
      </button>
    )}
  </div>
);

export default GameControls; 