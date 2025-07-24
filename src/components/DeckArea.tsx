import React from 'react';

interface DeckAreaProps {
  deckCount: number;
  lastDrawn?: string;
}

const DeckArea: React.FC<DeckAreaProps> = ({ deckCount, lastDrawn }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 120 }}>
    <div style={{ position: 'relative', width: 80, height: 120, marginBottom: 6 }}>
      <div style={{
        width: 80,
        height: 120,
        background: 'linear-gradient(135deg, #23283a 60%, #3B82F6 100%)',
        borderRadius: 12,
        border: '3px solid #3B82F6',
        boxShadow: '0 4px 24px #3B82F655',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 38,
        color: '#fff',
        fontWeight: 900,
        letterSpacing: 2,
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 2,
        transition: 'transform 0.3s',
        transform: lastDrawn ? 'translateY(-40px) scale(1.1)' : 'none',
        opacity: lastDrawn ? 0.5 : 1,
      }}>
        🂠
      </div>
      {lastDrawn && (
        <div style={{
          position: 'absolute',
          left: 90,
          top: 0,
          background: '#10B981',
          color: '#fff',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 700,
          fontSize: 16,
          boxShadow: '0 2px 8px #10B98155',
          zIndex: 3,
          animation: 'fadeInSlideRight 0.7s',
        }}>
          +1: {lastDrawn}
        </div>
      )}
    </div>
    <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>
      Deck: {deckCount}
    </div>
    <style>{`
      @keyframes fadeInSlideRight {
        from { opacity: 0; left: 60px; }
        to { opacity: 1; left: 90px; }
      }
    `}</style>
  </div>
);

export default DeckArea; 