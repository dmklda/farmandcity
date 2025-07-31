import React, { useState } from 'react';
import { GridCell } from '../types/gameState';
import { CardMiniature } from './CardMiniature';
import { Card } from '../types/card';
import { CardDetailModal } from './EnhancedHand';

interface GridProps {
  grid: GridCell[][];
  title: string;
  onSelectCell?: (x: number, y: number) => void;
  highlight?: boolean;
}

const Grid: React.FC<GridProps> = ({ grid, title, onSelectCell, highlight }) => {
  const [showDetail, setShowDetail] = useState<Card | null>(null);
  
  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto', marginBottom: 16 }}>
      <h2 style={{ color: '#fff', marginBottom: '12px' }}>{title}</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(60px, 80px))`,
          gap: 6,
          border: highlight ? '2px solid #3B82F6' : 'none',
          borderRadius: 8,
          padding: 6,
          minWidth: grid[0]?.length ? `${grid[0].length * 66}px` : undefined,
          maxWidth: 500,
          background: '#23283a',
        }}
      >
        {grid.flat().map((cell, idx) => {
          const x = idx % (grid[0]?.length || 1);
          const y = Math.floor(idx / (grid[0]?.length || 1));
          const isPlayable = highlight && !cell.card && onSelectCell;
          
          return (
            <div
              key={idx}
              style={{
                width: '100%',
                minWidth: 60,
                maxWidth: 80,
                height: 90,
                border: '2px dashed #4a5568',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: cell.card ? '#2d3748' : '#1a202c',
                cursor: isPlayable ? 'pointer' : cell.card ? 'pointer' : 'default',
                position: 'relative',
                transition: 'all 0.2s ease',
                boxShadow: isPlayable ? '0 0 0 2px #3B82F655' : undefined,
                overflow: 'hidden',
              }}
              onClick={() => cell.card ? setShowDetail(cell.card) : isPlayable && onSelectCell && onSelectCell(x, y)}
              title={cell.card ? cell.card.name : isPlayable ? 'Clique para jogar carta aqui' : ''}
              onMouseEnter={(e) => {
                if (isPlayable) {
                  e.currentTarget.style.border = '2px dashed #3B82F6';
                  e.currentTarget.style.background = '#2d3748';
                }
              }}
              onMouseLeave={(e) => {
                if (isPlayable) {
                  e.currentTarget.style.border = '2px dashed #4a5568';
                  e.currentTarget.style.background = '#1a202c';
                }
              }}
            >
              {cell.card ? (
                <CardMiniature
                  card={cell.card}
                  size="small"
                  onClick={() => setShowDetail(cell.card)}
                />
              ) : (
                <div style={{ 
                  color: '#718096', 
                  fontSize: '12px', 
                  textAlign: 'center',
                  opacity: isPlayable ? 0.7 : 0.3
                }}>
                  {isPlayable ? 'Jogar' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Card detail modal (padronizado) */}
      <CardDetailModal card={showDetail} isOpen={!!showDetail} onClose={() => setShowDetail(null)} />
    </div>
  );
};

export default Grid; 