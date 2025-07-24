import React from 'react';
import { Card } from '../types/card';
import pequenoJardimImage from '../assets/cards/pequeno_jardim.png';

interface CardComponentProps {
  card: Card;
  onClick?: () => void;
  selected?: boolean;
  playable?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const CardComponent: React.FC<CardComponentProps> = ({ 
  card, 
  onClick, 
  selected = false, 
  playable = true,
  size = 'medium' 
}) => {
  const sizeStyles = {
    small: { width: 90, height: 120 },
    medium: { width: 135, height: 180 },
    large: { width: 180, height: 240 }
  };

  const getCardVisual = (cardId: string) => {
    switch (cardId) {
      case 'starter-garden':
        return (
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '0px',
            position: 'relative',
            aspectRatio: '3/4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
          }}>
            <img 
              src={pequenoJardimImage} 
              alt="Pequeno Jardim"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                objectPosition: 'center'
              }}
            />
          </div>
        );
      default:
        return (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'transparent',
            borderRadius: '0px'
          }}>
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
                {card.name}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {card.type} | {card.rarity}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        ...sizeStyles[size],
        border: selected 
          ? '3px solid #3B82F6' 
          : playable 
            ? '2px solid #10B981' 
            : '2px solid #ccc',
        borderRadius: '12px',
        background: selected ? '#e0f2fe' : 'transparent',
        cursor: playable ? 'pointer' : 'not-allowed',
        opacity: playable ? 1 : 0.6,
        transition: 'all 0.2s ease',
        boxShadow: selected 
          ? '0 4px 12px rgba(59, 130, 246, 0.3)' 
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}
      onClick={onClick}
      title={card.name}
    >
      {getCardVisual(card.id)}
    </div>
  );
};

export default CardComponent; 