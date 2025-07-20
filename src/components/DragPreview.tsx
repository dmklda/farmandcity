import React from 'react';
import { Card as CardType } from '../types/game';
import { Card } from './Card';

interface DragPreviewProps {
  card: CardType;
  position: { x: number; y: number };
  offset: { x: number; y: number };
}

export const DragPreview: React.FC<DragPreviewProps> = ({ card, position, offset }) => {
  return (
    <div
      className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 opacity-80 scale-110"
      style={{
        left: position.x - offset.x,
        top: position.y - offset.y,
        transform: 'rotate(-5deg) scale(1.1)',
        filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))'
      }}
    >
      <Card card={card} isPlayable={true} />
    </div>
  );
};