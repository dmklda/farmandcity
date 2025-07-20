import React from 'react';
import { GridCell, Card as CardType } from '../types/game';
import { Sparkles, Plus } from 'lucide-react';

interface GridProps {
  grid: GridCell[][];
  type: 'farm' | 'city';
  selectedCard?: CardType;
  onCellClick: (row: number, col: number) => void;
  draggedCard?: CardType;
  onCardDrop?: (row: number, col: number) => void;
  isDragActive?: boolean;
}

export const Grid: React.FC<GridProps> = ({ 
  grid, 
  type, 
  selectedCard, 
  onCellClick,
  draggedCard,
  onCardDrop,
  isDragActive = false
}) => {
  const canPlaceCard = (cell: GridCell) => {
    const cardToCheck = draggedCard || selectedCard;
    return cardToCheck && 
           cardToCheck.type === type && 
           cell.type === 'empty';
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
        <div className={`p-2 rounded-lg ${type === 'farm' ? 'bg-green-100' : 'bg-blue-100'}`}>
          {type === 'farm' ? '🚜' : '🏙️'}
        </div>
        <span className={type === 'farm' ? 'text-green-700' : 'text-blue-700'}>
          {type === 'farm' ? 'Fazenda' : 'Cidade'}
        </span>
      </h3>
      
      <div className="grid grid-cols-4 gap-3">
        {grid.flat().map((cell) => (
          <div
            key={cell.id}
            className={`
              w-20 h-20 border-2 rounded-xl flex items-center justify-center
              transition-all duration-300 cursor-pointer relative overflow-hidden
              ${cell.type === 'empty' 
                ? 'border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200' 
                : 'border-solid border-transparent bg-gradient-to-br from-white to-gray-100 shadow-md'
              }
              ${canPlaceCard(cell) 
                ? 'border-green-400 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 shadow-lg transform hover:scale-105' 
                : ''
              }
              group
            `}
            onClick={() => {
              if (canPlaceCard(cell) && onCardDrop) {
                onCardDrop(cell.row, cell.col);
              } else {
                onCellClick(cell.row, cell.col);
              }
            }}
          >
              {/* Background animation for placeable cells */}
              {canPlaceCard(cell) && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 animate-pulse" />
              )}
              
              {cell.card ? (
                <div className="w-16 h-16 rounded-lg border-2 border-gray-300 bg-gradient-to-br from-white to-gray-100 flex flex-col items-center justify-center text-xs font-bold text-gray-700 shadow-md hover:shadow-lg transition-all duration-200 relative group-hover:scale-110">
                  <div className="text-lg mb-1">
                    {cell.card.type === 'farm' ? '🌱' : '🏢'}
                  </div>
                  <div className="text-center leading-tight">
                    {cell.card.name.split(' ')[0]}
                  </div>
                  {/* Sparkle effect for productive buildings */}
                  {cell.card.effect.production && (
                    <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-pulse" />
                  )}
                </div>
              ) : canPlaceCard(cell) ? (
                <div className="flex flex-col items-center justify-center text-green-500 group-hover:text-green-600 transition-colors duration-200">
                  <Plus className="w-8 h-8 animate-bounce" />
                  <span className="text-xs font-semibold mt-1">Construir</span>
                </div>
              ) : (
                <div className="text-gray-400 text-xs font-medium opacity-60 group-hover:opacity-80 transition-opacity duration-200">
                  Vazio
                </div>
              )}
            </div>
          ))}
        </div>
    </div>
  );
};