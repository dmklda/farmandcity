import React, { useState } from 'react';
import { GridCell } from '../types/gameState';
import CardComponent from './CardComponent';

interface GridProps {
  grid: GridCell[][];
  title: string;
  onSelectCell?: (x: number, y: number) => void;
  highlight?: boolean;
}

const Grid: React.FC<GridProps> = ({ grid, title, onSelectCell, highlight }) => {
  const [showDetail, setShowDetail] = useState<any>(null);
  
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
                <CardComponent
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

export default Grid; 