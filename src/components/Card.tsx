import React from 'react';
import { Card as CardType, Resources } from '../types/game';
import { Wheat, Building, Zap, Crown, Coins, Apple, Hammer, Users, Star } from 'lucide-react';

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  resources?: Resources;
  showGlow?: boolean;
  onDragStart?: (card: CardType, event: React.MouseEvent) => void;
  isDraggable?: boolean;
  isDragging?: boolean;
  isGlowing?: boolean;
  pulseEffect?: boolean;
  willBeDiscarded?: boolean;
}

const getCardTypeIcon = (type: CardType['type']) => {
  switch (type) {
    case 'farm': return <Wheat className="w-4 h-4" />;
    case 'city': return <Building className="w-4 h-4" />;
    case 'action': return <Zap className="w-4 h-4" />;
    case 'landmark': return <Crown className="w-4 h-4" />;
  }
};

const getCardTypeColor = (type: CardType['type']) => {
  switch (type) {
    case 'farm': return 'bg-gradient-to-r from-green-500 to-green-600';
    case 'city': return 'bg-gradient-to-r from-blue-500 to-blue-600';
    case 'action': return 'bg-gradient-to-r from-purple-500 to-purple-600';
    case 'landmark': return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
  }
};

const getRarityColor = (rarity: CardType['rarity']) => {
  switch (rarity) {
    case 'common': return 'border-gray-300';
    case 'uncommon': return 'border-green-400';
    case 'rare': return 'border-blue-400';
    case 'legendary': return 'border-purple-400';
  }
};

const getResourceIcon = (resource: string) => {
  switch (resource) {
    case 'coins': return <Coins className="w-3 h-3" />;
    case 'food': return <Apple className="w-3 h-3" />;
    case 'materials': return <Hammer className="w-3 h-3" />;
    case 'population': return <Users className="w-3 h-3" />;
    default: return null;
  }
};

export const Card: React.FC<CardProps> = ({ 
  card, 
  isSelected, 
  onClick, 
  isPlayable = true, 
  resources,
  showGlow = false,
  onDragStart,
  isDraggable = false,
  isDragging = false,
  isGlowing = false,
  pulseEffect = false,
  willBeDiscarded = false
}) => {
  const formatCost = (cost: CardType['cost']) => {
    return Object.entries(cost)
      .filter(([_, value]) => value > 0)
      .map(([resource, value]) => (
        <div key={resource} className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
          {getResourceIcon(resource)}
          <span className="font-bold text-sm">{value}</span>
        </div>
      ));
  };

  const canAfford = resources ? Object.entries(card.cost).every(([resource, cost]) => 
    resources[resource as keyof Resources] >= cost
  ) : true;

  const formatProduction = (production: CardType['effect']['production']) => {
    if (!production) return null;
    return Object.entries(production).map(([resource, value]) => (
      <div key={resource} className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full">
        {getResourceIcon(resource)}
        <span className="font-bold text-sm">+{value}</span>
      </div>
    ));
  };

  const handleClick = () => {
    if (card.type === 'action') {
      // Cartas de ação são jogadas imediatamente
      if (onClick) {
        onClick();
      }
    } else if (isDraggable && onDragStart && isPlayable) {
      // Cartas de construção são selecionadas para colocação
      onDragStart(card, {} as React.MouseEvent);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`
        relative w-40 h-56 bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl border-3 shadow-xl cursor-pointer
        transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2
        ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-75' : ''}
        ${getRarityColor(card.rarity)}
        ${!isPlayable ? 'opacity-60 cursor-not-allowed grayscale' : ''}
        ${!canAfford && resources ? 'opacity-70' : ''}
        ${showGlow || isGlowing ? 'animate-glow ring-4 ring-yellow-400' : ''}
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${card.type === 'action' ? 'cursor-pointer hover:scale-105' : ''}
        ${isDraggable && isPlayable && card.type !== 'action' ? 'cursor-grab active:cursor-grabbing' : ''}
        ${willBeDiscarded ? 'ring-4 ring-red-400 ring-opacity-75 bg-red-50' : ''}
        ${pulseEffect ? 'animate-pulse' : ''}
        overflow-hidden group
      `}
      onClick={handleClick}
      draggable={false}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      
      {/* Rarity glow */}
      {card.rarity !== 'common' && (
        <div className={`absolute inset-0 rounded-2xl opacity-20 ${
          card.rarity === 'uncommon' ? 'bg-green-400' :
          card.rarity === 'rare' ? 'bg-blue-400' : 'bg-purple-400'
        } animate-pulse`} />
      )}
      
      {/* Card Type Header */}
      <div className={`${getCardTypeColor(card.type)} text-white px-4 py-3 flex items-center justify-between relative z-10 shadow-lg`}>
        <div className="flex items-center gap-2">
        {getCardTypeIcon(card.type)}
          <span className="text-sm font-bold uppercase tracking-wider">{card.type}</span>
        </div>
        {card.rarity !== 'common' && (
          <Star className="w-4 h-4 text-yellow-300 animate-pulse" />
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-4 h-full flex flex-col relative z-10">
        <h3 className="font-bold text-lg text-gray-800 mb-3 leading-tight text-center">{card.name}</h3>
        
        {/* Cost */}
        {Object.keys(card.cost).length > 0 && (
          <div className="mb-3">
            <div className="text-xs font-bold text-gray-600 mb-1 text-center">CUSTO</div>
            <div className="flex gap-1 justify-center flex-wrap">
              {formatCost(card.cost)}
            </div>
          </div>
        )}
        
        {/* Effect */}
        <div className="text-sm text-gray-700 flex-1 mb-3 text-center">
          <p className="leading-relaxed font-medium">{card.effect.description}</p>
        </div>
        
        {/* Production Preview */}
        {card.effect.production && (
          <div className="mt-auto">
            <div className="text-center">
              <div className="text-xs font-bold text-green-700 mb-1">PRODUZ</div>
              <div className="flex gap-1 justify-center flex-wrap">
                {formatProduction(card.effect.production)}
              </div>
            </div>
          </div>
        )}
        
        {/* Dice trigger indicator */}
        {card.effect.diceNumbers && (
          <div className="absolute top-16 right-2 bg-white rounded-full p-2 shadow-lg border-2 border-yellow-400">
            <div className="text-sm font-bold text-gray-700">
              🎲 {card.effect.diceNumbers.join(',')}
            </div>
          </div>
        )}
        
        {/* Power level indicator */}
        <div className="absolute bottom-2 left-2">
          <div className={`w-6 h-6 rounded-full shadow-lg flex items-center justify-center text-xs font-bold text-white ${
            card.rarity === 'common' ? 'bg-gray-500' :
            card.rarity === 'uncommon' ? 'bg-green-400' :
            card.rarity === 'rare' ? 'bg-blue-400' : 'bg-purple-400'
          }`}>
            <div className="w-full h-full rounded-full animate-ping opacity-75 ${
              card.rarity === 'common' ? 'bg-gray-400' :
              card.rarity === 'uncommon' ? 'bg-green-400' :
              card.rarity === 'rare' ? 'bg-blue-400' : 'bg-purple-400'
            }" />
            <span>{
              card.rarity === 'common' ? '1' : card.rarity === 'uncommon' ? '2' : card.rarity === 'rare' ? '3' : '★'
            }</span>
          </div>
        </div>

        {/* Discard indicator */}
        {willBeDiscarded && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            DESCARTE
          </div>
        )}
      </div>
    </div>
  );
};