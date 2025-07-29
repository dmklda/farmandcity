import React from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Calendar, Plus } from 'lucide-react';
import { CardDetailModal } from '../EnhancedHand';
import { Card } from '../../types/card';
import { getCardTypeIconPNG } from '../IconComponentsPNG';

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
    const cols = eventGrid[0]?.length || 1;
    return (
      <div className={`grid gap-0.5 p-0.5 flex-1 justify-center items-center`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {eventGrid.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                grid-cell flex items-center justify-center text-xs font-medium cursor-pointer
                ${highlight ? 'available' : ''}
                ${cell.card ? 'bg-surface-hover border-solid' : 'border-2 border-dashed border-border'}
              `}
              style={{
                width: '70px',
                height: '70px',
                maxWidth: '70px',
                maxHeight: '70px',
                minWidth: '70px',
                minHeight: '70px'
              }}
              onClick={() => cell.card ? setShowDetail(cell.card) : onSelectEvent(colIndex, rowIndex)}
            >
              {cell.card ? (
                <div className="text-center flex flex-col items-center">
                  <div className="mb-0.5">{getCardTypeIconPNG(cell.card.type, 14)}</div>
                  <div className="text-xs text-text-muted truncate max-w-full">
                    {cell.card.name.slice(0, 6)}
                  </div>
                </div>
              ) : (
                <Plus className="w-1/2 h-1/2 text-text-muted opacity-50" />
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <>
      <NodeResizer minWidth={180} minHeight={120} />
      <div className="surface-elevated border-2 border-magic-color w-full h-full flex flex-col relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url('/assets/grids_background/Events_600x600.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%',
            height: '100%'
          }}
        />
        
        <div className="p-1 border-b border-border bg-gradient-to-r from-magic-color/10 to-magic-color/5 relative z-10">
          <div className="grid grid-cols-[auto_1fr_auto] items-center">
            <div className="grid grid-cols-[auto_auto] items-center gap-1">
              <Calendar className="w-3 h-3 text-magic-color" />
              <h3 className="font-bold text-text-primary text-xs">Eventos</h3>
            </div>
            <div className="text-xs font-bold text-magic-color">
              {eventCount}/{eventMax}
            </div>
          </div>
        </div>

        <div className="p-0.5 flex-1 relative z-10">
          <div className="grid grid-cols-2 gap-0.5 h-full">
            {eventGrid.flatMap((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    aspect-square flex items-center justify-center text-xs font-medium cursor-pointer
                    ${highlight ? 'available' : ''}
                    ${cell.card ? 'bg-surface-hover border-solid' : 'border-2 border-dashed border-border'}
                  `}
                  style={{
                    width: '70px',
                    height: '70px',
                    maxWidth: '70px',
                    maxHeight: '70px',
                    minWidth: '70px',
                    minHeight: '70px'
                  }}
                  onClick={() => cell.card ? setShowDetail(cell.card) : onSelectEvent(colIndex, rowIndex)}
                >
                  {cell.card ? (
                    <div className="text-center flex flex-col items-center">
                      <div className="mb-0.5">{getCardTypeIconPNG(cell.card.type, 14)}</div>
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
          <CardDetailModal card={showDetail} isOpen={!!showDetail} onClose={() => setShowDetail(null)} />
        </div>
      </div>
    </>
  );
};

export default EventNode;