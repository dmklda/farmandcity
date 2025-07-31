import React from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Crown, Plus, Trophy } from 'lucide-react';
import { CardDetailModal } from '../EnhancedHand';
import { Card } from '../../types/card';

interface LandmarkNodeData {
  landmarkCount: number;
  landmarkMax: number;
}

const LandmarkNode: React.FC<{ data: LandmarkNodeData & {landmarks?: Card[]} }> = ({ data }) => {
  const { landmarkCount, landmarkMax, landmarks = [] } = data;
  const [showDetail, setShowDetail] = React.useState<Card | null>(null);

  return (
    <>
      <NodeResizer minWidth={200} minHeight={150} />
      <div className="surface-elevated border-2 border-secondary w-full h-full flex flex-col relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url('/assets/grids_background/Landmark_600x600.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%',
            height: '100%'
          }}
        />
        
        <div className="p-1 border-b border-border bg-gradient-to-r from-secondary/10 to-secondary/5 relative z-10">
          <div className="grid grid-cols-[auto_1fr_auto] items-center">
            <div className="grid grid-cols-[auto_auto] items-center gap-1">
              <Crown className="w-3 h-3 text-secondary" />
              <h3 className="font-bold text-text-primary text-xs">Marcos</h3>
            </div>
            <div className="text-xs font-bold text-secondary">
              {landmarkCount}/{landmarkMax}
            </div>
          </div>
        </div>

        <div className="p-1 flex-1 relative z-10">
          <div className="grid grid-cols-3 gap-0.5 h-full">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className={`
                  aspect-square rounded-md border-2 border-dashed flex items-center justify-center
                  transition-all duration-300
                  ${i < landmarkCount
                    ? 'border-secondary bg-secondary/20 text-secondary cursor-pointer'
                    : 'border-border bg-surface-card text-text-muted'
                  }
                `}
                onClick={() => i < landmarkCount && landmarks[i] ? setShowDetail(landmarks[i]) : undefined}
              >
                <div className="flex items-center justify-center">
                  {i < landmarkCount ? (
                    <Crown className="w-1/3 h-1/3" />
                  ) : (
                    <Plus className="w-1/3 h-1/3 opacity-50" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <CardDetailModal card={showDetail} isOpen={!!showDetail} onClose={() => setShowDetail(null)} />

          {landmarkCount >= landmarkMax && (
            <div className="mt-1 p-1 bg-secondary/10 rounded-lg text-center">
              <div className="text-secondary font-bold text-xs flex items-center justify-center gap-1">
                <Trophy size={12} />
                Vitória!
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LandmarkNode;
