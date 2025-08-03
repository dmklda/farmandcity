import React from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Sprout, Plus } from 'lucide-react';
import { CardDetailModal } from '../EnhancedHand';
import { Card } from '../../types/card';
import { getCardTypeIconPNG } from '../IconComponentsPNG';

interface GridCell {
  card?: any;
  x: number;
  y: number;
}

interface FarmNodeData {
  grid: GridCell[][];
  count: number;
  max: number;
  onSelectCell: (x: number, y: number) => void;
  highlight: boolean;
}

const FarmNode: React.FC<{ data: FarmNodeData }> = ({ data }) => {
  const { grid, count, max, onSelectCell, highlight } = data;
  const [showDetail, setShowDetail] = React.useState<Card | null>(null);

  const renderGrid = () => {
    const cols = grid[0]?.length || 2;
    return (
      <div className={`grid gap-0.5 p-1 flex-1`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {grid.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                grid-cell aspect-square flex items-center justify-center text-xs font-medium cursor-pointer
                ${highlight ? 'available' : ''}
                ${cell.card ? 'bg-surface-hover border-solid' : 'border-2 border-dashed border-border'}
              `}
              onClick={() => cell.card ? setShowDetail(cell.card) : onSelectCell(colIndex, rowIndex)}
            >
              {cell.card ? (
                <div className="text-center flex flex-col items-center">
                  <div className="mb-0.5">{getCardTypeIconPNG(cell.card.type, 16)}</div>
                  <div className="text-xs text-text-muted truncate max-w-full">
                    {cell.card.name.slice(0, 6)}
                  </div>
                </div>
              ) : (
                <Plus className="w-1/3 h-1/3 text-text-muted opacity-50" />
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <>
      <NodeResizer minWidth={300} minHeight={200} />
      <div className={`
        surface-elevated transition-all duration-300 relative overflow-hidden w-full h-full flex flex-col
        ${highlight ? 'ring-2 ring-offset-2 ring-offset-background ring-farm-color' : ''}
      `}>
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url('/assets/grids_background/Farm_600x600.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%',
            height: '100%'
          }}
        />
        
        {/* Header */}
        <div className="p-1 border-b border-border bg-surface-card/50 relative z-10">
          <div className="grid grid-cols-[auto_1fr_auto] items-center">
            <div className="grid grid-cols-[auto_auto] items-center gap-1">
              <div className="text-sm"><Sprout className="w-5 h-5" /></div>
              <h3 className="font-bold text-text-primary text-xs">Fazendas</h3>
            </div>
            <div className={`text-xs font-bold px-1 py-0.5 rounded-full ${
              count >= max ? 'bg-destructive/20 text-destructive' : 'bg-surface text-text-secondary'
            }`}>
              {count}/{max}
            </div>
          </div>
        </div>

        {/* Grid Content */}
        <div className="relative z-10">
          {renderGrid()}
        </div>
        <CardDetailModal card={showDetail} isOpen={!!showDetail} onClose={() => setShowDetail(null)} />

        {/* Highlight overlay */}
        {highlight && (
          <div className="absolute inset-0 bg-farm-color/10 pointer-events-none z-20" />
        )}
      </div>
    </>
  );
};

export default FarmNode;
