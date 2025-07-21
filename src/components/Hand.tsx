import React from 'react';
import { Card as CardType, Resources } from '../types/game';
import { Card } from './Card';
import { Hand as HandIcon, Shuffle, Sparkles, Target } from 'lucide-react';

interface HandProps {
  cards: CardType[];
  selectedCard?: CardType;
  resources: Resources;
  onCardClick: (card: CardType) => void;
  onDragStart?: (card: CardType, event: React.MouseEvent) => void;
  draggedCard?: CardType;
  cardsToDiscard?: number;
}

export const Hand: React.FC<HandProps> = ({ 
  cards, 
  selectedCard, 
  resources, 
  onCardClick,
  onDragStart,
  draggedCard,
  cardsToDiscard,
  gamePhase
}) => {
  const canAffordCard = (card: CardType) => {
    return Object.entries(card.cost).every(([resource, cost]) => 
      resources[resource as keyof Resources] >= cost
    );
  };
  
  const canPlayCard = (card: CardType) => {
    // Verificar se tem recursos
    if (!canAffordCard(card)) return false;
    
    // Verificar se é a fase correta
    if (card.type === 'action' && gamePhase !== 'action') return false;
    if ((card.type === 'farm' || card.type === 'city') && gamePhase !== 'build') return false;
    if (card.type === 'landmark' && gamePhase !== 'build') return false;
    
    return true;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <HandIcon className="w-7 h-7 text-white" />
          </div>
          Cartas na Mão
          <span className="text-lg font-bold bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full border-2 border-purple-200">
            {cards.length} cartas
          </span>
        </h3>
        <button 
          className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:scale-105"
          title="Embaralhar cartas"
        >
          <Shuffle className="w-6 h-6 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
        </button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            isSelected={selectedCard?.id === card.id}
            isPlayable={canPlayCard(card)}
            isGlowing={canPlayCard(card) && selectedCard?.id !== card.id}
            pulseEffect={canPlayCard(card)}
            resources={resources}
            onClick={() => onCardClick(card)}
            onDragStart={onDragStart}
            isDraggable={true}
            isDragging={draggedCard?.id === card.id}
            willBeDiscarded={cardsToDiscard ? cards.indexOf(card) < cardsToDiscard : undefined}
          />
        ))}
        {cards.length === 0 && (
          <div className="text-gray-500 text-center py-16 w-full">
            <div className="relative">
              <HandIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <Sparkles className="w-6 h-6 absolute top-0 right-1/2 transform translate-x-8 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-2xl font-bold mb-2">Mão Vazia</p>
            <p className="text-lg">Compre cartas para começar a construir!</p>
            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <Target className="w-5 h-5 inline mr-2 text-blue-600" />
              <span className="text-blue-700 font-medium">Dica: Use a fase de compra para obter novas cartas</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};