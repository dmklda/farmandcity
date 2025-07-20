import { useState, useCallback } from 'react';
import { Card } from '../types/game';

export interface DragState {
  isDragging: boolean;
  draggedCard: Card | null;
  dragOffset: { x: number; y: number };
  dragPosition: { x: number; y: number };
}

export const useDragDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedCard: null,
    dragOffset: { x: 0, y: 0 },
    dragPosition: { x: 0, y: 0 }
  });

  // Sistema simplificado baseado em seleção
  const selectCard = useCallback((card: Card) => {
    console.log('Card selected for placement:', card.name);
    setDragState({
      isDragging: true,
      draggedCard: card,
      dragOffset: { x: 0, y: 0 },
      dragPosition: { x: 0, y: 0 }
    });
  }, []);

  const clearSelection = useCallback(() => {
    console.log('Card selection cleared');
    setDragState({
      isDragging: false,
      draggedCard: null,
      dragOffset: { x: 0, y: 0 },
      dragPosition: { x: 0, y: 0 }
    });
  }, []);

  // Mantendo compatibilidade com interface existente
  const startDrag = selectCard;
  const updateDrag = useCallback(() => {}, []);
  const endDrag = clearSelection;

  return {
    dragState,
    startDrag,
    updateDrag,
    endDrag,
    selectCard,
    clearSelection
  };
};