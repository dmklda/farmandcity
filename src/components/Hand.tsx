import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';
import { Card } from '../types/card';
import { CardMiniature } from './CardMiniature';
import { CardDetailModal } from './EnhancedHand';
import { CoinsIconPNG, FoodsIconPNG, MaterialsIconPNG, PopulationIconPNG } from './IconComponentsPNG';

interface HandProps {
  hand: Card[];
  onSelectCard: (card: Card) => void;
  selectedCardId?: string | null;
  canPlayCard?: (card: Card) => { playable: boolean; reason?: string };
}

const Hand: React.FC<HandProps> = ({ hand, onSelectCard, selectedCardId, canPlayCard }) => {
  const [showDetail, setShowDetail] = useState<Card | null>(null);
  
  return (
    <div className="relative">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
          Mão de Cartas
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
      </div>

      {/* Cards container */}
      <div className="flex gap-4 flex-wrap justify-center relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl blur-xl"></div>
        
        {hand.map((card, index) => {
          const playInfo = canPlayCard ? canPlayCard(card) : { playable: true };
          return (
            <div
              key={card.id}
              className="relative group"
              style={{ 
                transform: `translateY(${index * 2}px)`,
                zIndex: hand.length - index 
              }}
              title={playInfo.playable ? '' : playInfo.reason || 'Não pode jogar esta carta agora'}
            >
              <CardMiniature
                card={card}
                onClick={() => playInfo.playable && onSelectCard(card)}
                selected={card.id === selectedCardId}
                playable={playInfo.playable}
                size="small"
              />
              
              {/* View detail button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetail(card);
                }}
                className="absolute top-2 right-2 w-6 h-6 bg-black/70 hover:bg-black/90 border border-white/20 rounded-full flex items-center justify-center cursor-pointer text-white z-10 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                title="Visualizar carta detalhada"
                aria-label="Visualizar carta detalhada"
              >
                <Eye size={12} className="text-white" />
                <span className="sr-only">Visualizar carta detalhada</span>
              </button>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          );
        })}
      </div>
      
      {/* Card detail modal */}
      <CardDetailModal
        card={showDetail}
        isOpen={!!showDetail}
        onClose={() => setShowDetail(null)}
      />
    </div>
  );
};

export default Hand; 