import React from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Building, Plus } from 'lucide-react';

interface GridCell {
  card?: any;
  x: number;
  y: number;
}

interface CityNodeData {
  grid: GridCell[][];
  count: number;
  max: number;
  onSelectCell: (x: number, y: number) => void;
  highlight: boolean;
}

const CityNode: React.FC<{ data: CityNodeData }> = ({ data }) => {
  const { grid, count, max, onSelectCell, highlight } = data;

  const renderGrid = () => {
    const cols = grid[0]?.length || 2;
    return (
      <div className={`grid gap-0.5 p-1`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {grid.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                grid-cell w-20 h-20 place-items-center text-xs font-medium cursor-pointer
                ${highlight ? 'available' : ''}
                ${cell.card ? 'bg-surface-hover border-solid' : 'border-2 border-dashed border-border'}
              `}
              onClick={() => onSelectCell(colIndex, rowIndex)}
            >
              {cell.card ? (
                <div className="text-center">
                  <div className="text-sm mb-0.5">{cell.card.icon || '🏢'}</div>
                  <div className="text-xs text-text-muted truncate">
                    {cell.card.name.slice(0, 6)}
                  </div>
                </div>
              ) : (
                <Plus className="w-4 h-4 text-text-muted opacity-50" />
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
        surface-elevated transition-all duration-300 relative overflow-hidden w-full h-full
        ${highlight ? 'ring-2 ring-offset-2 ring-offset-background ring-city-color' : ''}
      `}>
        {/* Header */}
        <div className="p-1 border-b border-border bg-surface-card/50">
          <div className="grid grid-cols-[auto_1fr_auto] items-center">
            <div className="grid grid-cols-[auto_auto] items-center gap-1">
              <div className="text-sm"><Building className="w-5 h-5" /></div>
              <h3 className="font-bold text-text-primary text-xs">Cidades</h3>
            </div>
            <div className={`text-xs font-bold px-1 py-0.5 rounded-full ${
              count >= max ? 'bg-destructive/20 text-destructive' : 'bg-surface text-text-secondary'
            }`}>
              {count}/{max}
            </div>
          </div>
        </div>

        {/* Grid Content */}
        {renderGrid()}

        {/* Highlight overlay */}
        {highlight && (
          <div className="absolute inset-0 bg-city-color/10 pointer-events-none" />
        )}
      </div>
    </>
  );
};

export default CityNode;