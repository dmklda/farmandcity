import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCardTypeIconPNG } from './IconComponentsPNG';
import { CoinsIconPNG, FoodsIconPNG, MaterialsIconPNG, PopulationIconPNG } from './IconComponentsPNG';
import { Eye, Play } from "lucide-react";
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
  className?: string;
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
    iconSize: 16,
    padding: "p-1"
  },
  farmGrid: {
    width: "w-24", // 96px mobile, 112px desktop
    height: "h-20", // 80px mobile, 96px desktop
    textSize: "text-xs",
    iconSize: 16,
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
    width: "w-32", // 128px mobile, 160px desktop
    height: "h-24", // 96px mobile, 112px desktop
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
  className
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

  const handleViewDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShowDetail) {
      onShowDetail(card);
    }
  };

  const hasCost = (card.cost.coins || 0) > 0 || (card.cost.food || 0) > 0 || 
                  (card.cost.materials || 0) > 0 || (card.cost.population || 0) > 0;

  return (
    <motion.div
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
      whileHover={{ 
        scale: 1.05, 
        y: -4,
        rotateY: 2,
        rotateX: -1
      }}
      whileTap={{ 
        scale: 0.98,
        y: -2
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 20,
        duration: 0.2
      }}
    >
      {/* Background with enhanced gradient */}
      <div className={cn("absolute inset-0", typeConfig.bg)} />
      
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(circle at center, ${typeConfig.color}20, transparent 70%)`
        }}
      />

      {/* Header - Type Icon and Rarity */}
      <div className={cn("relative flex items-center justify-between", sizeSettings.padding)}>
        {/* Type Icon with enhanced animation */}
        <motion.div 
          className="p-0.5 rounded border"
          style={{ 
            backgroundColor: `${typeConfig.color}20`,
            borderColor: typeConfig.color
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {getCardTypeIconPNG(card.type, 16)}
        </motion.div>

        {/* Rarity Gems with staggered animation */}
        <div className="flex gap-0.5">
          {Array.from({ length: raritySettings.gems }).map((_, index) => (
            <motion.div 
              key={index}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: raritySettings.gemColor }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: index * 0.1, 
                type: "spring", 
                stiffness: 300 
              }}
              whileHover={{ scale: 1.3 }}
            />
          ))}
        </div>
      </div>

      {/* Artwork Area with enhanced effects */}
      <motion.div 
        className="relative mx-1 mb-1 h-8 rounded overflow-hidden border border-gray-600"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
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
      </motion.div>

      {/* Title */}
      {showInfo && (
        <div className="px-1 pb-0.5">
          <motion.h3 
            className={cn("font-bold text-white leading-tight truncate", sizeSettings.textSize)}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {card.name}
          </motion.h3>
        </div>
      )}

      {/* Cost Section */}
      {showInfo && hasCost && (
        <motion.div 
          className="px-1 pb-1"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="flex justify-center items-center gap-0.5 flex-wrap">
            {(card.cost.coins || 0) > 0 && (
              <motion.div 
                className="flex items-center gap-0.5 bg-amber-900/50 border border-amber-600/50 rounded px-0.5 py-0.5"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CoinsIconPNG size={8} />
                <span className="font-bold text-amber-100 text-[8px]">{card.cost.coins}</span>
              </motion.div>
            )}
            {(card.cost.food || 0) > 0 && (
              <motion.div 
                className="flex items-center gap-0.5 bg-green-900/50 border border-green-600/50 rounded px-0.5 py-0.5"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FoodsIconPNG size={8} />
                <span className="font-bold text-green-100 text-[8px]">{card.cost.food}</span>
              </motion.div>
            )}
            {(card.cost.materials || 0) > 0 && (
              <motion.div 
                className="flex items-center gap-0.5 bg-blue-900/50 border border-blue-600/50 rounded px-0.5 py-0.5"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MaterialsIconPNG size={8} />
                <span className="font-bold text-blue-100 text-[8px]">{card.cost.materials}</span>
              </motion.div>
            )}
            {(card.cost.population || 0) > 0 && (
              <motion.div 
                className="flex items-center gap-0.5 bg-purple-900/50 border border-purple-600/50 rounded px-0.5 py-0.5"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <PopulationIconPNG size={8} />
                <span className="font-bold text-purple-100 text-[8px]">{card.cost.population}</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Action Buttons - Only show on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Play Button */}
            {isPlayable && (
              <motion.button
                onClick={handleClick}
                className="p-1.5 bg-green-600 hover:bg-green-500 rounded-full text-white shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
                title="Jogar carta"
              >
                <Play className="w-3 h-3" />
              </motion.button>
            )}
            
            {/* View Detail Button */}
            <motion.button
              onClick={handleViewDetail}
              className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-full text-white shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              title="Ver detalhes"
            >
              <Eye className="w-3 h-3" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Hover Info */}
      {isHovered && (
        <motion.div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="bg-black/95 backdrop-blur-sm border border-gray-600 rounded-lg p-2 shadow-xl min-w-[140px] text-center">
            <div className="text-xs font-bold text-white mb-1">{card.name}</div>
            <div className="text-[10px] text-gray-300 capitalize">{card.type}</div>
            <div className="text-[10px] text-gray-400 uppercase">{card.rarity}</div>
            <div className="text-[8px] text-gray-500 mt-1">
              {isPlayable ? "Clique para jogar • Olho para detalhes" : "Olho para detalhes"}
            </div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Playable Indicator */}
      {isPlayable && (
        <motion.div 
          className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Selection Ring Animation */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-lg ring-2 ring-blue-400 ring-offset-1 pointer-events-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      )}
    </motion.div>
  );
}; 