import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';
import { Card } from '../types/card';
import CardComponent from './CardComponent';
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
              <CardComponent
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
      {showDetail && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetail(null)}
        >
          <div 
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 min-w-[400px] max-w-[600px] border border-slate-600 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1),transparent_50%)] rounded-2xl"></div>
            
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 w-8 h-8 bg-slate-700/50 hover:bg-slate-600/50 text-white border border-slate-600 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 z-10"
              onClick={() => setShowDetail(null)}
              title="Fechar detalhes da carta"
            >
              <X size={16} />
            </button>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              {/* Card title */}
              <div className="text-center">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                  {showDetail.name}
                </h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
              </div>
              
              {/* Large card visual */}
              <div className="relative">
                <CardComponent
                  card={showDetail}
                  size="large"
                />
                {/* Card glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl -z-10"></div>
              </div>
              
              {/* Card details */}
              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                    <div className="text-sm text-slate-400 mb-1">Tipo</div>
                    <div className="text-white font-semibold">{showDetail.type}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                    <div className="text-sm text-slate-400 mb-1">Raridade</div>
                    <div className="text-white font-semibold">{showDetail.rarity}</div>
                  </div>
                </div>

                {/* Cost section */}
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                  <div className="text-sm text-slate-400 mb-3">Custo</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <CoinsIconPNG size={16} />
                      <span className="text-white">{showDetail.cost.coins ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FoodsIconPNG size={16} />
                      <span className="text-white">{showDetail.cost.food ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MaterialsIconPNG size={16} />
                      <span className="text-white">{showDetail.cost.materials ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PopulationIconPNG size={16} />
                      <span className="text-white">{showDetail.cost.population ?? 0}</span>
                    </div>
                  </div>
                </div>

                {/* Effect section */}
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                  <div className="text-sm text-slate-400 mb-2">Efeito</div>
                  <div className="text-white leading-relaxed">{showDetail.effect.description}</div>
                </div>

                {/* Activation section */}
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                  <div className="text-sm text-slate-400 mb-2">Ativação</div>
                  <div className="text-white font-semibold">{showDetail.activation}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hand; 