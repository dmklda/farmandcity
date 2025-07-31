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
  gridType?: 'city' | 'farm' | 'landmark' | 'event';
}

const Grid: React.FC<GridProps> = ({ grid, title, onSelectCell, highlight, gridType = 'city' }) => {
  const [showDetail, setShowDetail] = useState<Card | null>(null);
  
  // Determinar o tamanho baseado no tipo de grid
  const getGridSize = () => {
    switch (gridType) {
      case 'city':
      case 'farm':
        return 'cityGrid'; // 96x80px mobile, 112x96px desktop
      case 'landmark':
        return 'landmarkGrid'; // 128x96px mobile, 160x112px desktop
      case 'event':
        return 'eventGrid'; // 128x96px mobile, 160x112px desktop
      default:
        return 'cityGrid';
    }
  };

  // Determinar o número de colunas baseado no tipo de grid
  const getGridCols = () => {
    switch (gridType) {
      case 'city':
      case 'farm':
        return 4; // 4x3 grid
      case 'landmark':
        return 3; // 1x3 grid
      case 'event':
        return 2; // 1x2 grid
      default:
        return 4;
    }
  };

  const gridCols = getGridCols();
  const cardSize = getGridSize();
  
  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto', marginBottom: 16 }}>
      <h2 style={{ color: '#fff', marginBottom: '12px' }}>{title}</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gap: 8,
          border: highlight ? '2px solid #3B82F6' : 'none',
          borderRadius: 8,
          padding: 8,
          background: '#23283a',
          maxWidth: gridCols === 4 ? '344px' : gridCols === 3 ? '392px' : '268px',
          minHeight: gridCols === 4 ? '516px' : '192px'
        }}
      >
        {grid.flat().map((cell, idx) => {
          const x = idx % gridCols;
          const y = Math.floor(idx / gridCols);
          const isPlayable = highlight && !cell.card && onSelectCell;
          
          return (
            <div
              key={idx}
              style={{
                width: '100%',
                height: '100%',
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
                minHeight: gridType === 'city' || gridType === 'farm' ? '80px' : '96px'
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
                  size={cardSize as any}
                  showInfo={true}
                  onSelect={() => {}} // Não permitir seleção no grid
                  onShowDetail={() => setShowDetail(cell.card)}
                  className="w-full h-full"
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
      
      {/* Card detail modal */}
      <CardDetailModal card={showDetail} isOpen={!!showDetail} onClose={() => setShowDetail(null)} />
    </div>
  );
};

export default Grid; 