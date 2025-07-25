import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { Card } from '../types/card';
import CardComponent from './CardComponent';

interface HandProps {
  hand: Card[];
  onSelectCard: (card: Card) => void;
  selectedCardId?: string | null;
  canPlayCard?: (card: Card) => { playable: boolean; reason?: string };
}

const Hand: React.FC<HandProps> = ({ hand, onSelectCard, selectedCardId, canPlayCard }) => {
  const [showDetail, setShowDetail] = useState<Card | null>(null);
  
  return (
    <div>
      <h2 style={{ color: '#fff', marginBottom: '16px', textAlign: 'center' }}>Mão de Cartas</h2>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {hand.map((card) => {
          const playInfo = canPlayCard ? canPlayCard(card) : { playable: true };
          return (
            <div
              key={card.id}
              style={{ position: 'relative' }}
              title={playInfo.playable ? '' : playInfo.reason || 'Não pode jogar esta carta agora'}
            >
              <CardComponent
                card={card}
                onClick={() => playInfo.playable && onSelectCard(card)}
                selected={card.id === selectedCardId}
                playable={playInfo.playable}
                size="small"
              />
              {/* Ícone de olho para visualizar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetail(card);
                }}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  zIndex: 10,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'}
                title="Visualizar carta detalhada"
              >
                <Eye size={12} />
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Card detail modal */}
      {showDetail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.8)',
          color: '#fff',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
          onClick={() => setShowDetail(null)}
        >
          <div style={{
            background: '#23283a',
            borderRadius: 16,
            padding: 32,
            minWidth: 320,
            boxShadow: '0 4px 32px #0008',
            border: '2px solid #fff',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{showDetail.name}</div>
            
            {/* Large card visual */}
            <CardComponent
              card={showDetail}
              size="large"
            />
            
            {/* Card details */}
            <div style={{ width: '100%', textAlign: 'left' }}>
              <div style={{ fontSize: 16, marginBottom: 8 }}><b>Tipo:</b> {showDetail.type}</div>
              <div style={{ fontSize: 16, marginBottom: 8 }}><b>Raridade:</b> {showDetail.rarity}</div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>
                <b>Custo:</b> Moedas: {showDetail.cost.coins ?? 0}, Comida: {showDetail.cost.food ?? 0}, 
                Materiais: {showDetail.cost.materials ?? 0}, População: {showDetail.cost.population ?? 0}
              </div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>
                <b>Efeito:</b> {showDetail.effect.description}
              </div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>
                <b>Ativação:</b> {showDetail.activation}
              </div>
            </div>
            
            <button 
              style={{ 
                position: 'absolute', 
                top: 12, 
                right: 16, 
                background: 'none', 
                color: '#fff', 
                border: 'none', 
                fontSize: 24, 
                cursor: 'pointer',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background 0.2s'
              }} 
              onClick={() => setShowDetail(null)}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hand; 