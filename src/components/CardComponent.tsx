import React from 'react';
import { Card } from '../types/card';
import pequenoJardimImage from '../assets/cards/pequeno_jardim.png';
import { getCardTypeIconPNG, getRarityIconPNG } from './IconComponentsPNG';

interface CardComponentProps {
  card: Card;
  onClick?: () => void;
  selected?: boolean;
  playable?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const CardComponent: React.FC<CardComponentProps> = ({ 
  card, 
  onClick, 
  selected = false, 
  playable = true,
  size = 'medium' 
}) => {
  const sizeStyles = {
    small: { width: 90, height: 120 },
    medium: { width: 135, height: 180 },
    large: { width: 180, height: 240 }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'uncommon': return 'from-green-400 to-green-500';
      case 'rare': return 'from-blue-400 to-blue-500';
      case 'epic': return 'from-purple-400 to-purple-500';
      case 'legendary': return 'from-orange-400 to-orange-500';
      case 'secret': return 'from-red-400 to-red-500';
      case 'ultra': return 'from-yellow-400 to-yellow-500';
      case 'crisis': return 'from-red-500 to-red-600';
      case 'booster': return 'from-indigo-400 to-indigo-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'farm': return 'from-green-500 to-emerald-500';
      case 'city': return 'from-blue-500 to-cyan-500';
      case 'landmark': return 'from-yellow-500 to-amber-500';
      case 'action': return 'from-red-500 to-pink-500';
      case 'defense': return 'from-purple-500 to-violet-500';
      case 'event': return 'from-indigo-500 to-blue-500';
      case 'magic': return 'from-purple-400 to-pink-400';
      case 'trap': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getCardVisual = (cardId: string) => {
    switch (cardId) {
      case 'starter-garden':
        return (
          <div className="w-full h-full relative overflow-hidden rounded-lg">
            <img 
              src={pequenoJardimImage} 
              alt="Pequeno Jardim"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 relative overflow-hidden rounded-lg">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-90"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1),transparent_50%)]"></div>
            
            {/* Card content */}
            <div className="relative z-10 text-center w-full">
              <div className="text-sm font-bold text-white mb-2 drop-shadow-lg">
                {card.name}
              </div>
              <div className="text-xs text-slate-300 drop-shadow-md">
                {card.type} | {card.rarity}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`
        relative group cursor-pointer transition-all duration-300 transform
        ${selected ? 'scale-105 z-20' : 'hover:scale-105 z-10'}
        ${!playable ? 'opacity-60 cursor-not-allowed' : 'opacity-100'}
      `}
      style={sizeStyles[size]}
      onClick={onClick}
      title={card.name}
    >
      {/* Card border and glow effects */}
      <div className={`
        absolute inset-0 rounded-xl border-2 transition-all duration-300
        ${selected 
          ? `border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] bg-gradient-to-br from-blue-500/10 to-blue-600/10` 
          : playable 
            ? `border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:border-emerald-300` 
            : 'border-slate-500 shadow-[0_0_5px_rgba(148,163,184,0.2)]'
        }
      `}>
        {/* Animated border */}
        {selected && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 opacity-20 animate-pulse"></div>
        )}
        
        {/* Rarity indicator */}
        <div className="absolute top-2 left-2">
          {getRarityIconPNG(card.rarity, 16)}
        </div>
        
        {/* Type indicator */}
        <div className="absolute top-2 right-2">
          {getCardTypeIconPNG(card.type, 16)}
        </div>
      </div>

      {/* Card content */}
      <div className="absolute inset-1 rounded-lg overflow-hidden">
        {getCardVisual(card.id)}
      </div>

      {/* Hover effects */}
      {playable && (
        <>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </>
      )}

      {/* Selection indicator */}
      {selected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default CardComponent; 