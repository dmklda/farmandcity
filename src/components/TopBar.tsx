import React from 'react';

interface TopBarProps {
  turn: number;
  turnMax: number;
  buildCount: number;
  buildMax: number;
  phase: string;
  onNextPhase: () => void;
  discardMode?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ turn, turnMax, buildCount, buildMax, phase, onNextPhase, discardMode }) => (
  <header style={{ width: '100%', background: '#23283a', color: '#fff', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box', gap: 18 }}>
    <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: -1, display: 'flex', alignItems: 'center', gap: 10 }}>
      <span role="img" aria-label="coroa">👑</span> Famand
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <span style={{ background: '#23283a', color: '#fff', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 18, letterSpacing: 1, border: '2px solid #3B82F6' }}>Turno: {turn}/{turnMax}</span>
      <span style={{ background: '#23283a', color: '#fff', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 18, letterSpacing: 1, border: '2px solid #F59E0B' }}>Construções: {buildCount}/{buildMax}</span>
      <span style={{ background: '#23283a', color: '#fff', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 18, letterSpacing: 1, border: '2px solid #10B981' }}>Fase: {phase.toUpperCase()}</span>
    </div>
    <button
      onClick={onNextPhase}
      disabled={discardMode}
      style={{
        padding: '10px 28px',
        borderRadius: 8,
        background: discardMode ? '#3B82F6' : '#3B82F6',
        color: '#fff',
        fontWeight: 700,
        fontSize: 18,
        border: 'none',
        cursor: discardMode ? 'not-allowed' : 'pointer',
        boxShadow: '0 2px 8px #3B82F655',
        transition: 'background 0.2s',
        opacity: discardMode ? 0.5 : 1,
      }}
    >
      → Próxima Fase
    </button>
  </header>
);

export default TopBar; 