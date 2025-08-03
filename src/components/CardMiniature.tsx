import React, { useState } from "react";
import { getCardTypeIconPNG } from './IconComponentsPNG';
import { CoinsIconPNG, FoodsIconPNG, MaterialsIconPNG, PopulationIconPNG } from './IconComponentsPNG';
import { cn } from '../lib/utils';
import { Card } from '../types/card';

interface CardMiniatureProps {
  card: Card;
  isSelected?: boolean;
  isPlayable?: boolean;
  onSelect?: (card: Card) => void;
  onShowDetail?: (card: Card) => void;
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'cityGrid' | 'farmGrid' | 'landmarkGrid' | 'eventGrid';
  showInfo?: boolean;
  showPlayableIndicator?: boolean;
  className?: string;
  activatedDiceNumber?: number; // Número do dado que ativou a carta
  level?: number; // Nível da carta (para cartas empilhadas)
}

const cardTypeConfig = {
  city: {
    color: "#8B5A3C",
    border: "border-amber-600",
    bg: "bg-amber-900/20"
  },
  farm: {
    color: "#4A7C59",
    border: "border-green-600",
    bg: "bg-green-900/20"
  },
  magic: {
    color: "#6B46C1",
    border: "border-purple-600",
    bg: "bg-purple-900/20"
  },
  landmark: {
    color: "#1E40AF",
    border: "border-blue-600",
    bg: "bg-blue-900/20"
  },
  event: {
    color: "#DC2626",
    border: "border-red-600",
    bg: "bg-red-900/20"
  },
  trap: {
    color: "#374151",
    border: "border-gray-600",
    bg: "bg-gray-900/20"
  },
  defense: {
    color: "#059669",
    border: "border-teal-600",
    bg: "bg-teal-900/20"
  }
};

const rarityConfig = {
  common: {
    gems: 1,
    gemColor: "#9CA3AF"
  },
  uncommon: {
    gems: 2,
    gemColor: "#10B981"
  },
  rare: {
    gems: 3,
    gemColor: "#3B82F6"
  },
  ultra: {
    gems: 4,
    gemColor: "#8B5CF6"
  },
  legendary: {
    gems: 5,
    gemColor: "#F59E0B"
  }
};

const sizeConfig = {
  tiny: {
    width: "w-20",
    height: "h-28",
    textSize: "text-xs",
    iconSize: 16,
    padding: "p-1"
  },
  small: {
    width: "w-24",
    height: "h-32",
    textSize: "text-sm",
    iconSize: 16,
    padding: "p-1.5"
  },
  medium: {
    width: "w-28",
    height: "h-36",
    textSize: "text-sm",
    iconSize: 16,
    padding: "p-2"
  },
  large: {
    width: "w-32",
    height: "h-40",
    textSize: "text-base",
    iconSize: 24,
    padding: "p-2.5"
  },
  // Tamanhos específicos para grids
  cityGrid: {
    width: "w-24", // 96px mobile, 112px desktop
    height: "h-20", // 80px mobile, 96px desktop
    textSize: "text-xs",
    iconSize: 12,
    padding: "p-1"
  },
  farmGrid: {
    width: "w-24", // 96px mobile, 112px desktop
    height: "h-20", // 80px mobile, 96px desktop
    textSize: "text-xs",
    iconSize: 12,
    padding: "p-1"
  },
  landmarkGrid: {
    width: "w-32", // 128px mobile, 160px desktop
    height: "h-24", // 96px mobile, 112px desktop
    textSize: "text-sm",
    iconSize: 16,
    padding: "p-1.5"
  },
  eventGrid: {
    width: "w-32", // 128px mobile, 160px desktop (igual ao landmark)
    height: "h-24", // 96px mobile, 112px desktop (igual ao landmark)
    textSize: "text-sm",
    iconSize: 16,
    padding: "p-1.5"
  }
};

export const CardMiniature: React.FC<CardMiniatureProps> = ({
  card,
  isSelected = false,
  isPlayable = true,
  onSelect,
  onShowDetail,
  size = 'medium',
  showInfo = true,
  showPlayableIndicator = true,
  className,
  activatedDiceNumber,
  level
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const typeConfig = cardTypeConfig[card.type as keyof typeof cardTypeConfig] || cardTypeConfig.magic;
  const raritySettings = rarityConfig[card.rarity as keyof typeof rarityConfig] || rarityConfig.rare;
  const sizeSettings = sizeConfig[size];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Se clicar com botão direito ou Ctrl, mostra detalhes
    if (e.button === 2 || e.ctrlKey) {
      if (onShowDetail) {
        onShowDetail(card);
      }
      return;
    }
    
    // Clique normal joga a carta
    if (isPlayable && onSelect) {
      onSelect(card);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onShowDetail) {
      onShowDetail(card);
    }
  };

  const hasCost = (card.cost.coins || 0) > 0 || (card.cost.food || 0) > 0 || 
                  (card.cost.materials || 0) > 0 || (card.cost.population || 0) > 0;

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden cursor-pointer select-none group",
        sizeSettings.width,
        sizeSettings.height,
        "bg-gradient-to-br from-gray-800 to-gray-900",
        typeConfig.border,
        "border-2",
        isSelected && "ring-2 ring-blue-400 ring-offset-1",
        !isPlayable && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{ borderColor: typeConfig.color }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {/* Background with enhanced gradient */}
      <div className={cn("absolute inset-0", typeConfig.bg)} />
      
      {/* Header - Type Icon, Dice Activation, and Rarity */}
      <div className={cn("relative flex items-center justify-between", sizeSettings.padding)}>
        {/* Type Icon */}
        <div 
          className="p-0.5 rounded border"
          style={{ 
            backgroundColor: `${typeConfig.color}20`,
            borderColor: typeConfig.color
          }}
        >
          {getCardTypeIconPNG(card.type, 16)}
        </div>

        {/* Dice Activation Indicator */}
        {activatedDiceNumber && (
          <div className="bg-amber-600/80 border border-amber-400/60 rounded-full w-3 h-3 flex items-center justify-center">
            <span className="text-[6px] font-bold text-amber-100">
              {activatedDiceNumber}
            </span>
          </div>
        )}

        {/* Level Indicator */}
        {level && level > 1 && (
          <div className="bg-blue-600/80 border border-blue-400/60 rounded-full w-3 h-3 flex items-center justify-center">
            <span className="text-[6px] font-bold text-blue-100">
              {level}
            </span>
          </div>
        )}

        {/* Rarity Gems */}
        <div className="flex gap-0.5">
          {Array.from({ length: raritySettings.gems }).map((_, index) => (
            <div 
              key={index}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: raritySettings.gemColor }}
            />
          ))}
        </div>
      </div>

      {/* Artwork Area */}
      <div className="relative mx-1 mb-1 h-8 rounded overflow-hidden border border-gray-600">
        {card.artworkUrl ? (
          <img 
            src={card.artworkUrl} 
            alt={card.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <div className="text-xs">🎨</div>
          </div>
        )}
        {/* Artwork overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      {/* Title */}
      {showInfo && (
        <div className="px-1 pb-0.5">
          <h3 className={cn("font-bold text-white leading-tight truncate", sizeSettings.textSize)}>
            {card.name}
          </h3>
        </div>
      )}

      {/* Cost Section - Only show for non-grid sizes */}
      {showInfo && hasCost && !size.includes('Grid') && (
        <div className="px-1 pb-1">
          <div className="flex justify-center items-center gap-0.5 flex-wrap">
            {(card.cost.coins || 0) > 0 && (
              <div className="flex items-center gap-0.5 bg-amber-900/50 border border-amber-600/50 rounded px-0.5 py-0.5">
                <CoinsIconPNG size={8} />
                <span className="font-bold text-amber-100 text-[8px]">{card.cost.coins}</span>
              </div>
            )}
            {(card.cost.food || 0) > 0 && (
              <div className="flex items-center gap-0.5 bg-green-900/50 border border-green-600/50 rounded px-0.5 py-0.5">
                <FoodsIconPNG size={8} />
                <span className="font-bold text-green-100 text-[8px]">{card.cost.food}</span>
              </div>
            )}
            {(card.cost.materials || 0) > 0 && (
              <div className="flex items-center gap-0.5 bg-blue-900/50 border border-blue-600/50 rounded px-0.5 py-0.5">
                <MaterialsIconPNG size={8} />
                <span className="font-bold text-blue-100 text-[8px]">{card.cost.materials}</span>
              </div>
            )}
            {(card.cost.population || 0) > 0 && (
              <div className="flex items-center gap-0.5 bg-purple-900/50 border border-purple-600/50 rounded px-0.5 py-0.5">
                <PopulationIconPNG size={8} />
                <span className="font-bold text-purple-100 text-[8px]">{card.cost.population}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Simple Hover Info */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-black/95 backdrop-blur-sm border border-gray-600 rounded-lg p-2 shadow-xl min-w-[140px] text-center">
            <div className="text-xs font-bold text-white mb-1">{card.name}</div>
            <div className="text-[10px] text-gray-300 capitalize">{card.type}</div>
            <div className="text-[10px] text-gray-400 uppercase">{card.rarity}</div>
            <div className="text-[8px] text-gray-500 mt-1">
              {isPlayable ? "Clique para jogar • Olho para detalhes" : "Olho para detalhes"}
            </div>
          </div>
        </div>
      )}

      {/* Playable Indicator */}
      {isPlayable && showPlayableIndicator && (
        <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full" />
      )}
    </div>
  );
}; 
