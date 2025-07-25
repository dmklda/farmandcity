import React, { useState } from 'react';
import { Eye, Zap, Lock } from 'lucide-react';
import { Card } from '../types/card';

interface EnhancedHandProps {
  hand: Card[];
  onSelectCard: (card: Card) => void;
  selectedCardId?: string;
  canPlayCard?: (card: Card) => { playable: boolean; reason?: string };
  sidebarVisible?: boolean;
}

interface CardDetailModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, isOpen, onClose }) => {
  if (!isOpen || !card) return null;

  const getCardTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'farm': return 'border-farm-color bg-farm-color/10';
      case 'city': return 'border-city-color bg-city-color/10';
      case 'magic': return 'border-magic-color bg-magic-color/10';
      case 'event': return 'border-event-color bg-event-color/10';
      default: return 'border-border bg-surface-card';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="surface-elevated max-w-md w-full p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          {/* Card Header */}
          <div className={`p-4 rounded-lg border-2 ${getCardTypeColor(card.type)}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-text-primary">{card.name}</h3>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <span className="text-text-secondary">Tipo: {card.type}</span>
              <span className="text-text-secondary">Raridade: {card.rarity}</span>
            </div>
          </div>

          {/* Card Costs */}
          <div className="space-y-2">
            <h4 className="font-semibold text-text-primary">Custos:</h4>
            <div className="flex gap-3 text-sm">
              {(card.cost.coins || 0) > 0 && (
                <span className="resource-chip text-secondary">💰 {card.cost.coins}</span>
              )}
              {(card.cost.food || 0) > 0 && (
                <span className="resource-chip text-farm-color">🌾 {card.cost.food}</span>
              )}
              {(card.cost.materials || 0) > 0 && (
                <span className="resource-chip text-event-color">🏗️ {card.cost.materials}</span>
              )}
              {(card.cost.population || 0) > 0 && (
                <span className="resource-chip text-city-color">👥 {card.cost.population}</span>
              )}
            </div>
          </div>

          {/* Card Effects */}
          <div className="space-y-2">
            <h4 className="font-semibold text-text-primary">Efeito:</h4>
            <p className="text-text-secondary text-sm bg-surface-card p-3 rounded">
              {card.effect.description}
            </p>
          </div>

          {/* Activation */}
          {card.activation && (
            <div className="space-y-2">
              <h4 className="font-semibold text-text-primary">Ativação:</h4>
              <p className="text-text-secondary text-sm bg-surface-card p-3 rounded">
                {card.activation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EnhancedCardComponent: React.FC<{
  card: Card;
  isSelected: boolean;
  isPlayable: boolean;
  onSelect: () => void;
  onShowDetail: () => void;
}> = ({ card, isSelected, isPlayable, onSelect, onShowDetail }) => {
  const getCardTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'farm': return 'border-farm-color bg-farm-color/5';
      case 'city': return 'border-city-color bg-city-color/5';
      case 'magic': return 'border-magic-color bg-magic-color/5';
      case 'event': return 'border-event-color bg-event-color/5';
      default: return 'border-border bg-surface-card';
    }
  };

  return (
    <div
      className={`
        relative w-16 h-24 rounded-lg border-2 cursor-pointer
        transition-all duration-300 ease-out group
        ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''}
        ${isPlayable 
          ? 'hover:scale-125 hover:-translate-y-4 hover:z-50 hover:shadow-2xl hover:brightness-110 transform-gpu' 
          : 'opacity-60 cursor-not-allowed'
        }
        ${getCardTypeColor(card.type)}
        backdrop-blur-sm
      `}
      style={{ 
        transformOrigin: 'center bottom',
        zIndex: isSelected ? 40 : 10
      }}
      onClick={isPlayable ? onSelect : undefined}
    >
      {/* Card Content */}
      <div className="p-2 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="text-[10px] font-bold text-text-primary line-clamp-2 leading-tight">
              {card.name}
            </h4>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowDetail();
            }}
            className="ml-1 p-0.5 rounded hover:bg-surface-hover transition-colors opacity-60 hover:opacity-100"
          >
            <Eye className="w-3 h-3 text-text-secondary" />
          </button>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Type Indicator */}
          <div className="text-xs mb-1">
            {card.type === 'farm' && '🌾'}
            {card.type === 'city' && '🏢'}
            {card.type === 'magic' && '✨'}
            {card.type === 'event' && '⚡'}
          </div>
          
          {/* Costs */}
          <div className="flex flex-wrap gap-0.5 justify-center">
            {(card.cost.coins || 0) > 0 && (
              <span className="text-[8px] bg-secondary/30 text-secondary px-1 py-0.5 rounded">
                💰{card.cost.coins}
              </span>
            )}
            {(card.cost.food || 0) > 0 && (
              <span className="text-[8px] bg-farm-color/30 text-farm-color px-1 py-0.5 rounded">
                🌾{card.cost.food}
              </span>
            )}
            {(card.cost.materials || 0) > 0 && (
              <span className="text-[8px] bg-event-color/30 text-event-color px-1 py-0.5 rounded">
                🏗️{card.cost.materials}
              </span>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-center">
          {isPlayable ? (
            <div className="flex items-center gap-0.5 text-[8px] text-farm-color">
              <Zap className="w-2 h-2" />
            </div>
          ) : (
            <div className="flex items-center gap-0.5 text-[8px] text-text-muted">
              <Lock className="w-2 h-2" />
            </div>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      {isPlayable && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 rounded-lg bg-primary/15 pointer-events-none" />
      )}
    </div>
  );
};

const EnhancedHand: React.FC<EnhancedHandProps> = ({ 
  hand, 
  onSelectCard, 
  selectedCardId, 
  canPlayCard = () => ({ playable: true }),
  sidebarVisible = false
}) => {
  const [detailCard, setDetailCard] = useState<Card | null>(null);

  return (
    <>
      {/* Hand Container */}
      <div className={`fixed bottom-4 z-20 transition-all duration-300 ${
        sidebarVisible 
          ? 'left-1/2 transform -translate-x-1/2 md:left-[calc(50%+120px)] md:transform md:-translate-x-1/2' 
          : 'left-1/2 transform -translate-x-1/2'
      }`}>
        <div className="bg-surface-card/90 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl p-3">
          <div className="flex items-end gap-4">
            {/* Deck Area - Left Side */}
            <div className="flex-shrink-0">
              <div 
                className="w-16 h-24 bg-primary/20 border-2 border-primary rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-primary/30 transition-all duration-300 hover:scale-105"
                title="Deck"
              >
                <div className="text-sm text-primary">🂠</div>
                <div className="text-xs text-primary font-medium">23</div>
              </div>
            </div>

            {/* Hand Cards - Center */}
          <div className="flex items-end gap-1 flex-wrap justify-center">
            {hand.map((card, index) => (
              <div
                key={`${card.id}-${index}`}
                className="flex-shrink-0"
                style={{ 
                  zIndex: hand.length - index,
                }}
              >
                <EnhancedCardComponent
                  card={card}
                  isSelected={selectedCardId === card.id}
                  isPlayable={(() => {
                    const result = canPlayCard(card);
                    return typeof result === 'object' ? result.playable : result;
                  })()}
                  onSelect={() => onSelectCard(card)}
                  onShowDetail={() => setDetailCard(card)}
                />
              </div>
            ))}
            
            {hand.length === 0 && (
              <div className="flex items-center justify-center py-8 px-12 text-text-muted">
                <div className="text-center">
                  <div className="text-2xl mb-2">🃏</div>
                  <p className="text-sm">Mão vazia</p>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Hand Info */}
          {hand.length > 0 && (
            <div className="flex items-center justify-center mt-2 gap-4 text-xs text-text-secondary">
              <span>{hand.length} cartas</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-farm-color" />
                  <span>Jogável</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-text-muted" />
                  <span>Bloqueada</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <CardDetailModal
        card={detailCard}
        isOpen={!!detailCard}
        onClose={() => setDetailCard(null)}
      />
    </>
  );
};

export default EnhancedHand;