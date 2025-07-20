import React, { useEffect, useRef } from 'react';
import { Card as CardType } from '../types/game';
import { CheckCircle, XCircle } from 'lucide-react';

interface DropZoneProps {
  isActive: boolean;
  canDrop: boolean;
  children: React.ReactNode;
  onDrop: () => void;
  draggedCard?: CardType;
}

export const DropZone: React.FC<DropZoneProps> = ({ 
  isActive, 
  canDrop, 
  children, 
  onDrop,
  draggedCard 
}) => {
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isActive && canDrop && dropZoneRef.current) {
        const rect = dropZoneRef.current.getBoundingClientRect();
        const isOverDropZone = 
          e.clientX >= rect.left && 
          e.clientX <= rect.right && 
          e.clientY >= rect.top && 
          e.clientY <= rect.bottom;
        
        if (isOverDropZone) {
          console.log('Mouse up over drop zone, calling onDrop');
          onDrop();
        }
      }
    };

    if (isActive) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isActive, canDrop, onDrop]);

  return (
    <div
      ref={dropZoneRef}
      className={`
        relative transition-all duration-300
        ${isActive ? (canDrop ? 'ring-4 ring-green-400 ring-opacity-75 bg-green-50' : 'ring-4 ring-red-400 ring-opacity-75 bg-red-50') : ''}
      `}
    >
      {children}
      
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-xl pointer-events-none">
          <div className={`p-4 rounded-full ${canDrop ? 'bg-green-500' : 'bg-red-500'} shadow-lg`}>
            {canDrop ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : (
              <XCircle className="w-8 h-8 text-white" />
            )}
          </div>
          {draggedCard && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg">
              <span className="text-sm font-semibold">
                {canDrop ? `Construir ${draggedCard.name}` : 'Local inválido'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};