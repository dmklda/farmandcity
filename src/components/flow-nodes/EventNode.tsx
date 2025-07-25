import React from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Zap, Plus } from 'lucide-react';
import { CardDetailModal } from '../EnhancedHand';
import { Card } from '../../types/card';

interface GridCell {
  card?: any;
  x: number;
  y: number;
}

interface EventNodeData {
  eventGrid: GridCell[][];
  eventCount: number;
  eventMax: number;
  onSelectEvent: (x: number, y: number) => void;
  highlight: boolean;
}

const EventNode: React.FC<{ data: EventNodeData }> = ({ data }) => {
  const { eventGrid, eventCount, eventMax, onSelectEvent, highlight } = data;
  const [showDetail, setShowDetail] = React.useState<Card | null>(null);

  const renderGrid = () => {
    const cols = eventGrid[0]?.length || 2;
    return (
      <div className={`grid gap-0.5 p-1 flex-1`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {eventGrid.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                grid-cell aspect-square flex items-center justify-center text-xs font-medium cursor-pointer
                ${highlight ? 'available' : ''}
                ${cell.card ? 'bg-surface-hover border-solid' : 'border-2 border-dashed border-border'}
              `}
              onClick={() => cell.card ? setShowDetail(cell.card) : onSelectEvent(colIndex, rowIndex)}
            >
              {cell.card ? (
                <div className="text-center flex flex-col items-center">
                  <div className="mb-0.5">{cell.card.icon || '⚡'}</div>
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
      <NodeResizer minWidth={250} minHeight={150} />
      <div className="surface-elevated border-2 border-magic-color w-full h-full flex flex-col">
        <div className="p-1 border-b border-border bg-gradient-to-r from-magic-color/10 to-magic-color/5">
          <div className="grid grid-cols-[auto_1fr_auto] items-center">
            <div className="grid grid-cols-[auto_auto] items-center gap-1">
              <Zap className="w-3 h-3 text-magic-color" />
              <h3 className="font-bold text-text-primary text-xs">Eventos</h3>
            </div>
            <div className="text-xs font-bold text-magic-color">
              {eventCount}/{eventMax}
            </div>
          </div>
        </div>

        <div className="p-1 flex-1">
          {/* Grid Content */}
          {renderGrid()}
          <CardDetailModal card={showDetail} isOpen={!!showDetail} onClose={() => setShowDetail(null)} />

          {eventCount >= eventMax && (
            <div className="mt-0.5 p-1 bg-magic-color/10 rounded-lg text-center">
              <div className="text-magic-color font-bold text-xs">
                🌟 Máximo!
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventNode;