import React, { useState } from 'react';
import { Eye, Zap, Lock } from 'lucide-react';
import { Card } from '../types/card';

interface EnhancedHandProps {
  hand: Card[];
  onSelectCard: (card: Card) => void;
  selectedCardId?: string;
  canPlayCard?: (card: Card) => { playable: boolean; reason?: string };
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
      case 'farm': return 'border-farm-color text-farm-color';
      case 'city': return 'border-city-color text-city-color';
      case 'magic': return 'border-magic-color text-magic-color';
      case 'event': return 'border-event-color text-event-color';
      default: return 'border-border text-text-primary';
    }
  };

  return (
    <div
      className={`
        relative min-w-[160px] h-[220px] rounded-xl border-2 cursor-pointer
        transition-all duration-300 group
        ${isSelected ? 'card-selected transform -translate-y-2' : ''}
        ${isPlayable 
          ? 'card-interactive hover:shadow-glow' 
          : 'opacity-50 cursor-not-allowed hover:scale-100 hover:translate-y-0'
        }
        ${getCardTypeColor(card.type)}
        surface-elevated
      `}
      onClick={isPlayable ? onSelect : undefined}
    >
      {/* Card Content */}
      <div className="p-3 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-bold text-text-primary line-clamp-2 flex-1">
            {card.name}
          </h4>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowDetail();
            }}
            className="p-1 rounded hover:bg-surface-hover transition-colors opacity-70 hover:opacity-100"
          >
            <Eye className="w-4 h-4 text-text-secondary" />
          </button>
        </div>

        {/* Type & Rarity */}
        <div className="flex items-center justify-between text-xs text-text-muted mb-3">
          <span>{card.type}</span>
          <span>{card.rarity}</span>
        </div>

        {/* Costs */}
        <div className="flex flex-wrap gap-1 mb-3">
          {(card.cost.coins || 0) > 0 && (
            <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
              💰{card.cost.coins}
            </span>
          )}
          {(card.cost.food || 0) > 0 && (
            <span className="text-xs bg-farm-color/20 text-farm-color px-2 py-1 rounded">
              🌾{card.cost.food}
            </span>
          )}
          {(card.cost.materials || 0) > 0 && (
            <span className="text-xs bg-event-color/20 text-event-color px-2 py-1 rounded">
              🏗️{card.cost.materials}
            </span>
          )}
        </div>

        {/* Effect Preview */}
        <div className="flex-1 mb-2">
          <p className="text-xs text-text-secondary line-clamp-3">
            {card.effect.description}
          </p>
        </div>

        {/* Playability Indicator */}
        <div className="flex items-center justify-center">
          {isPlayable ? (
            <div className="flex items-center gap-1 text-xs text-farm-color">
              <Zap className="w-3 h-3" />
              <span>Jogável</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <Lock className="w-3 h-3" />
              <span>Bloqueada</span>
            </div>
          )}
        </div>
      </div>

      {/* Selection Glow */}
      {isSelected && (
        <div className="absolute inset-0 rounded-xl bg-primary/20 pointer-events-none" />
      )}
    </div>
  );
};

const EnhancedHand: React.FC<EnhancedHandProps> = ({ 
  hand, 
  onSelectCard, 
  selectedCardId, 
  canPlayCard = () => ({ playable: true }) 
}) => {
  const [detailCard, setDetailCard] = useState<Card | null>(null);

  return (
    <>
      <div className="fixed bottom-0 left-16 right-0 bg-surface/95 backdrop-blur border-t border-border p-4 z-30">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-primary">Mão de Cartas</h3>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span>{hand.length} cartas</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-farm-color" />
                  <span>Jogável</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-4 h-4 text-text-muted" />
                  <span>Bloqueada</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Cards */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {hand.map((card) => (
              <EnhancedCardComponent
                key={card.id}
                card={card}
                isSelected={selectedCardId === card.id}
                isPlayable={(() => {
                  const result = canPlayCard(card);
                  return typeof result === 'object' ? result.playable : result;
                })()}
                onSelect={() => onSelectCard(card)}
                onShowDetail={() => setDetailCard(card)}
              />
            ))}
            
            {hand.length === 0 && (
              <div className="flex-1 flex items-center justify-center py-8 text-text-muted">
                <p>Nenhuma carta na mão</p>
              </div>
            )}
          </div>
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