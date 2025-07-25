import React from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Zap, Plus } from 'lucide-react';

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
          <div className="grid auto-cols-fr grid-flow-col gap-0.5 h-full">
            {Array.from({ length: eventMax }, (_, i) => {
              const eventCard = eventGrid[0] && eventGrid[0][i]?.card;
              return (
                <div
                  key={i}
                  className={`
                    min-h-[40px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center
                    transition-all duration-300 cursor-pointer
                    ${highlight ? 'border-magic-color bg-magic-color/10' : 'border-border bg-surface-card'}
                    ${eventCard ? 'border-solid bg-surface-hover' : ''}
                  `}
                  onClick={() => onSelectEvent(i, 0)}
                >
                  {eventCard ? (
                    <div className="text-center p-0.5">
                      <div className="text-xs mb-0.5">⚡</div>
                      <div className="text-xs text-text-primary font-medium line-clamp-1">
                        {eventCard.name}
                      </div>
                      <div className="text-xs text-magic-color">
                        Ativo
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Plus className="w-2 h-2 text-text-muted opacity-50 mb-0.5" />
                      <div className="text-xs text-text-muted">Evento</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

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