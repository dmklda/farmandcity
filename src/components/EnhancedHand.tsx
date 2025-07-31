import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useMotionTemplate, AnimatePresence } from "framer-motion";
import { 
  Castle, 
  Wheat, 
  Sparkles, 
  Landmark, 
  Calendar, 
  Shield, 
  Swords,
  Crown,
  Star,
  Gem,
  X,
  Eye,
  Zap,
  Lock,
  Flame,
  Sword
} from "lucide-react";
import { getCardTypeIconPNG } from './IconComponentsPNG';
import { CoinsIconPNG, FoodsIconPNG, MaterialsIconPNG, PopulationIconPNG } from './IconComponentsPNG';
import { cn } from '../lib/utils';
import { Card } from '../types/card';
import { CardMiniature } from './CardMiniature';

interface EnhancedHandProps {
  hand: Card[];
  onSelectCard: (card: Card) => void;
  selectedCardId?: string;
  canPlayCard?: (card: Card) => { playable: boolean; reason?: string };
  sidebarVisible?: boolean;
  deckSize?: number;
}

interface CardDetailModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, isOpen, onClose }) => {
  if (!isOpen || !card) return null;
  
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Card type configuration from card_exemple_magicMCP.md
  const cardTypeConfig = {
    city: {
      icon: Castle,
      color: "#8B5A3C",
      gradient: "from-amber-900/20 to-orange-800/20",
      border: "border-amber-700",
      accent: "#D4AF37"
    },
    farm: {
      icon: Wheat,
      color: "#4A7C59",
      gradient: "from-green-800/20 to-emerald-700/20",
      border: "border-green-600",
      accent: "#90EE90"
    },
    magic: {
      icon: Sparkles,
      color: "#6B46C1",
      gradient: "from-purple-800/20 to-violet-700/20",
      border: "border-purple-600",
      accent: "#9F7AEA"
    },
    landmark: {
      icon: Landmark,
      color: "#1E40AF",
      gradient: "from-blue-800/20 to-indigo-700/20",
      border: "border-blue-600",
      accent: "#60A5FA"
    },
    event: {
      icon: Calendar,
      color: "#DC2626",
      gradient: "from-red-800/20 to-rose-700/20",
      border: "border-red-600",
      accent: "#F87171"
    },
    trap: {
      icon: Shield,
      color: "#374151",
      gradient: "from-gray-800/20 to-slate-700/20",
      border: "border-gray-600",
      accent: "#9CA3AF"
    },
    defense: {
      icon: Swords,
      color: "#059669",
      gradient: "from-teal-800/20 to-cyan-700/20",
      border: "border-teal-600",
      accent: "#34D399"
    }
  };

  // Rarity configuration from card_exemple_magicMCP.md
  const rarityConfig = {
    common: {
      borderWidth: "border-2",
      glow: "shadow-md",
      gems: 1,
      gemColor: "#9CA3AF",
      frameStyle: "simple"
    },
    uncommon: {
      borderWidth: "border-[3px]",
      glow: "shadow-lg shadow-green-500/20",
      gems: 2,
      gemColor: "#10B981",
      frameStyle: "enhanced"
    },
    rare: {
      borderWidth: "border-[3px]",
      glow: "shadow-lg shadow-blue-500/30",
      gems: 3,
      gemColor: "#3B82F6",
      frameStyle: "ornate"
    },
    ultra: {
      borderWidth: "border-4",
      glow: "shadow-xl shadow-purple-500/40",
      gems: 4,
      gemColor: "#8B5CF6",
      frameStyle: "elaborate"
    },
    legendary: {
      borderWidth: "border-4",
      glow: "shadow-2xl shadow-yellow-500/50",
      gems: 5,
      gemColor: "#F59E0B",
      frameStyle: "legendary"
    }
  };

  const typeConfig = cardTypeConfig[card.type as keyof typeof cardTypeConfig] || cardTypeConfig.magic;
  const raritySettings = rarityConfig[card.rarity as keyof typeof rarityConfig] || rarityConfig.rare;
  const TypeIcon = typeConfig.icon;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    if (isHovered) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHovered, mouseX, mouseY]);

  const spotlightBackground = useMotionTemplate`
    radial-gradient(300px circle at ${mouseX}px ${mouseY}px, ${typeConfig.accent}15, transparent)
  `;

  const renderGems = () => {
    return Array.from({ length: raritySettings.gems }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
        className="relative"
      >
        <Gem 
          className="w-3 h-3" 
          style={{ color: raritySettings.gemColor }}
        />
        <div 
          className="absolute inset-0 w-3 h-3 rounded-full blur-sm opacity-60"
          style={{ backgroundColor: raritySettings.gemColor }}
        />
      </motion.div>
    ));
  };

  const renderOrnateCorners = () => {
    if (card.rarity === "common" || card.rarity === "uncommon") return null;

    return (
      <>
        {/* Top corners */}
        <div className="absolute top-2 left-2 w-6 h-6">
          <div 
            className="absolute inset-0 border-l-2 border-t-2 rounded-tl-lg"
            style={{ borderColor: typeConfig.accent }}
          />
          <div 
            className="absolute top-1 left-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: typeConfig.accent }}
          />
        </div>
        <div className="absolute top-2 right-2 w-6 h-6">
          <div 
            className="absolute inset-0 border-r-2 border-t-2 rounded-tr-lg"
            style={{ borderColor: typeConfig.accent }}
          />
          <div 
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: typeConfig.accent }}
          />
        </div>

        {/* Bottom corners */}
        <div className="absolute bottom-2 left-2 w-6 h-6">
          <div 
            className="absolute inset-0 border-l-2 border-b-2 rounded-bl-lg"
            style={{ borderColor: typeConfig.accent }}
          />
          <div 
            className="absolute bottom-1 left-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: typeConfig.accent }}
          />
        </div>
        <div className="absolute bottom-2 right-2 w-6 h-6">
          <div 
            className="absolute inset-0 border-r-2 border-b-2 rounded-br-lg"
            style={{ borderColor: typeConfig.accent }}
          />
          <div 
            className="absolute bottom-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: typeConfig.accent }}
          />
        </div>
      </>
    );
  };

  const renderLegendaryEffects = () => {
    if (card.rarity !== "legendary") return null;

    return (
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          background: [
            `conic-gradient(from 0deg, ${typeConfig.accent}20, transparent, ${typeConfig.accent}20)`,
            `conic-gradient(from 360deg, ${typeConfig.accent}20, transparent, ${typeConfig.accent}20)`
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    );
  };

  return createPortal(
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-gradient-to-br from-gray-900/95 to-black/95 rounded-2xl border border-gray-700/50 shadow-2xl max-w-xl w-full h-[36rem] relative overflow-hidden"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          title="Fechar modal"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex h-full">
          {/* Card Display - Centered */}
          <div className="flex-1 p-6 flex items-center justify-center">
            <motion.div
              ref={cardRef}
              className={cn(
                "relative w-80 h-[32rem] rounded-xl overflow-hidden cursor-pointer select-none",
                "bg-gradient-to-br from-background to-muted",
                typeConfig.border,
                raritySettings.borderWidth,
                raritySettings.glow
              )}
              style={{
                background: isHovered ? spotlightBackground : undefined,
                borderColor: typeConfig.color
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Legendary rotating border effect */}
              {renderLegendaryEffects()}

              {/* Background gradient */}
              <div className={cn("absolute inset-0 bg-gradient-to-br", typeConfig.gradient)} />

              {/* Ornate corner decorations */}
              {renderOrnateCorners()}

              {/* Header section */}
              <div className="relative p-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                  {/* Type icon and dice activation */}
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-2 rounded-lg border-2"
                      style={{ 
                        backgroundColor: `${typeConfig.color}20`,
                        borderColor: typeConfig.color
                      }}
                    >
                      {getCardTypeIconPNG(card.type, 24)}
                    </div>
                    <div 
                      className="p-2 rounded-lg border-2"
                      style={{ 
                        backgroundColor: `${typeConfig.color}20`,
                        borderColor: typeConfig.color
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-800 rounded-sm"></div>
                        </div>
                        <span className="text-sm font-bold" style={{ color: typeConfig.color }}>
                          {card.effect?.diceNumber || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rarity gems */}
                  <div className="flex gap-1">
                    {renderGems()}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg text-foreground leading-tight">
                  {card.name}
                </h3>

                {/* Rarity indicator */}
                <div className="flex items-center gap-1 mt-1">
                  {card.rarity === "legendary" && <Crown className="w-3 h-3 text-yellow-500" />}
                  {(card.rarity === "ultra" || card.rarity === "legendary") && <Star className="w-3 h-3 text-purple-400" />}
                  <span 
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: raritySettings.gemColor }}
                  >
                    {card.rarity}
                  </span>
                </div>
              </div>

              {/* Image section */}
              <div className="relative mx-4 mb-4 h-48 rounded-lg overflow-hidden border-2 border-border">
                {card.artworkUrl ? (
                  <img 
                    src={card.artworkUrl} 
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl mb-1">🎨</div>
                      <p className="text-xs text-gray-400">Artwork será carregado no painel admin</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Level indicator for city and farm cards */}
              {(card.type === 'city' || card.type === 'farm') && (
                <div className="px-4 mb-3">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-1">
                      <span className="text-xs font-semibold text-white">Nível:</span>
                      <span className="text-sm font-bold text-yellow-400">1</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Cost section - replacing attack/defense */}
              <div className="px-4 mb-3">
                <div className="flex justify-center items-center gap-2">
                  {(card.cost.coins || 0) > 0 && (
                    <div className="flex items-center gap-1 bg-amber-900/50 border border-amber-600/50 rounded px-2 py-1">
                      <CoinsIconPNG size={16} />
                      <span className="font-bold text-amber-100 text-sm">{card.cost.coins}</span>
                    </div>
                  )}
                  {(card.cost.food || 0) > 0 && (
                    <div className="flex items-center gap-1 bg-green-900/50 border border-green-600/50 rounded px-2 py-1">
                      <FoodsIconPNG size={16} />
                      <span className="font-bold text-green-100 text-sm">{card.cost.food}</span>
                    </div>
                  )}
                  {(card.cost.materials || 0) > 0 && (
                    <div className="flex items-center gap-1 bg-blue-900/50 border border-blue-600/50 rounded px-2 py-1">
                      <MaterialsIconPNG size={16} />
                      <span className="font-bold text-blue-100 text-sm">{card.cost.materials}</span>
                    </div>
                  )}
                  {(card.cost.population || 0) > 0 && (
                    <div className="flex items-center gap-1 bg-purple-900/50 border border-purple-600/50 rounded px-2 py-1">
                      <PopulationIconPNG size={16} />
                      <span className="font-bold text-purple-100 text-sm">{card.cost.population}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="px-4 pb-4">
                <div 
                  className="text-xs leading-relaxed p-4 rounded-lg border-2"
                  style={{ 
                    backgroundColor: `${typeConfig.color}15`,
                    borderColor: `${typeConfig.color}40`,
                    boxShadow: `0 0 10px ${typeConfig.color}20`
                  }}
                >
                  {card.effect?.description || "A magnificent fortress that generates wealth and provides protection for your realm."}
                </div>
              </div>

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: `radial-gradient(circle at center, ${typeConfig.accent}10, transparent 70%)`
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

const EnhancedCardComponent: React.FC<{
  card: Card;
  isSelected: boolean;
  isPlayable: boolean;
  onSelect: () => void;
  onShowDetail: () => void;
}> = ({ card, isSelected, isPlayable, onSelect, onShowDetail }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const getRarityConfig = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return {
        borderColor: 'border-yellow-400',
        glowColor: 'shadow-yellow-500/40',
        bgGradient: 'from-yellow-900/40 via-yellow-800/30 to-yellow-900/40',
        textColor: 'text-yellow-100',
        accentColor: 'text-yellow-400',
        gemColor: 'text-yellow-500'
      };
      case 'ultra': return {
        borderColor: 'border-pink-400',
        glowColor: 'shadow-pink-500/40',
        bgGradient: 'from-pink-900/40 via-pink-800/30 to-pink-900/40',
        textColor: 'text-pink-100',
        accentColor: 'text-pink-400',
        gemColor: 'text-pink-500'
      };
      case 'rare': return {
        borderColor: 'border-blue-400',
        glowColor: 'shadow-blue-500/30',
        bgGradient: 'from-blue-900/40 via-blue-800/30 to-blue-900/40',
        textColor: 'text-blue-100',
        accentColor: 'text-blue-400',
        gemColor: 'text-blue-500'
      };
      case 'uncommon': return {
        borderColor: 'border-green-400',
        glowColor: 'shadow-green-500/30',
        bgGradient: 'from-green-900/40 via-green-800/30 to-green-900/40',
        textColor: 'text-green-100',
        accentColor: 'text-green-400',
        gemColor: 'text-green-500'
      };
      default: return {
        borderColor: 'border-amber-600',
        glowColor: 'shadow-amber-500/20',
        bgGradient: 'from-amber-900/40 via-amber-800/30 to-amber-900/40',
        textColor: 'text-amber-100',
        accentColor: 'text-amber-400',
        gemColor: 'text-amber-500'
      };
    }
  };

  const config = getRarityConfig(card.rarity);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className={`
        relative w-20 h-28 rounded-xl cursor-pointer
        transition-all duration-300 ease-out will-change-transform
        group
        ${isSelected ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-black scale-150 -translate-y-8 z-50 shadow-2xl brightness-110' : 'z-10'}
        hover:scale-125 hover:-translate-y-4 hover:z-40 hover:shadow-xl hover:brightness-105
        ${!isPlayable ? 'opacity-60 cursor-not-allowed' : ''}
        bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm
        border-2 ${config.borderColor} shadow-lg ${config.glowColor}
      `}
      style={{ 
        transformOrigin: 'center bottom',
      }}
      onClick={isPlayable ? onSelect : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={isPlayable ? { scale: 1.25, y: -16 } : {}}
      whileTap={isPlayable ? { scale: 0.95 } : {}}
    >
      {/* Magical Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-xl ${config.glowColor} blur-lg`}
        animate={{
          opacity: isHovered ? 0.8 : 0.4,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Spotlight Effect */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-xl opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(100px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,215,0,0.3), transparent 40%)`
          }}
        />
      )}

      {/* Ornate Border Pattern */}
      <div className="absolute inset-0 rounded-xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-400/50 to-transparent" />
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-400/50 to-transparent" />
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-1 left-1">
        <Gem className={`w-2 h-2 ${config.gemColor}`} />
      </div>
      <div className="absolute top-1 right-1">
        <Gem className={`w-2 h-2 ${config.gemColor}`} />
      </div>
      <div className="absolute bottom-1 left-1">
        <Gem className={`w-2 h-2 ${config.gemColor}`} />
      </div>
      <div className="absolute bottom-1 right-1">
        <Gem className={`w-2 h-2 ${config.gemColor}`} />
      </div>

      {/* Card Content */}
      <div className="p-2 h-full flex flex-col justify-between relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className={`text-[8px] font-bold ${config.textColor} line-clamp-2 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}>
              {card.name}
            </h4>
          </div>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onShowDetail();
            }}
            className="ml-1 p-0.5 rounded hover:bg-amber-900/50 transition-colors opacity-60 hover:opacity-100"
            title="Ver detalhes da carta"
            aria-label="Ver detalhes da carta"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Eye className="w-2 h-2 text-amber-300" />
          </motion.button>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Type Indicator */}
          <div className="mb-1">
            {getCardTypeIconPNG(card.type, 16)}
          </div>
          
          {/* Rarity Stars */}
          <div className="flex justify-center space-x-0.5 mb-1">
            {Array.from({ length: card.rarity === 'legendary' ? 3 : card.rarity === 'ultra' ? 3 : card.rarity === 'rare' ? 2 : card.rarity === 'uncommon' ? 2 : 1 }).map((_, i) => (
              <Star key={i} className={`w-1.5 h-1.5 ${config.accentColor} fill-current`} />
            ))}
          </div>
          
          {/* Costs */}
          <div className="flex flex-wrap gap-0.5 justify-center">
            {(card.cost.coins || 0) > 0 && (
              <span className={`text-[6px] bg-amber-900/70 border border-amber-600/50 ${config.textColor} px-1 py-0.5 rounded flex items-center gap-0.5`}>
                <CoinsIconPNG size={8} />
                {card.cost.coins}
              </span>
            )}
            {(card.cost.food || 0) > 0 && (
              <span className={`text-[6px] bg-green-900/70 border border-green-600/50 ${config.textColor} px-1 py-0.5 rounded flex items-center gap-0.5`}>
                <FoodsIconPNG size={8} />
                {card.cost.food}
              </span>
            )}
            {(card.cost.materials || 0) > 0 && (
              <span className={`text-[6px] bg-blue-900/70 border border-blue-600/50 ${config.textColor} px-1 py-0.5 rounded flex items-center gap-0.5`}>
                <MaterialsIconPNG size={8} />
                {card.cost.materials}
              </span>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-center">
          {isPlayable ? (
            <div className="flex items-center gap-0.5 text-[6px] text-green-400">
              <Zap className="w-2 h-2" />
            </div>
          ) : (
            <div className="flex items-center gap-0.5 text-[6px] text-red-400">
              <Lock className="w-2 h-2" />
            </div>
          )}
        </div>
      </div>

      {/* Magical Particles */}
      <AnimatePresence>
        {isHovered && isPlayable && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ 
                  x: Math.random() * 60, 
                  y: Math.random() * 100, 
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  y: -10,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              >
                <Sparkles className={`w-2 h-2 ${config.accentColor}`} />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Flame Effects */}
      <AnimatePresence>
        {isHovered && isPlayable && (
          <>
            <motion.div
              className="absolute top-2 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              <Flame className="w-3 h-3 text-orange-400 animate-pulse" />
            </motion.div>
            <motion.div
              className="absolute bottom-8 right-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <Flame className="w-2 h-2 text-orange-500 animate-bounce" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div 
          className="absolute inset-0 rounded-xl bg-amber-400/20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};

const EnhancedHand: React.FC<EnhancedHandProps> = ({ 
  hand, 
  onSelectCard, 
  selectedCardId, 
  canPlayCard = () => ({ playable: true }),
  sidebarVisible = false,
  deckSize = 0
}) => {
  console.log('🎮 EnhancedHand renderizado:', {
    handLength: hand.length,
    handCards: hand.map(c => c.name),
    selectedCardId,
    deckSize,
    sidebarVisible,
    handProps: hand
  });

  const [selectedCardForDetail, setSelectedCardForDetail] = useState<Card | null>(null);

  return (
    <>
      {/* Hand Container */}
      <motion.div 
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-300"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Main Container with Medieval Design */}
        <div className="relative">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 blur-xl rounded-3xl" />
          
          {/* Main Container */}
          <div className="relative bg-gradient-to-br from-stone-900/95 via-amber-900/90 to-stone-900/95 backdrop-blur-md border-2 border-amber-600/50 rounded-3xl shadow-2xl p-4">
            
            {/* Ornate Border Pattern */}
            <div className="absolute inset-0 rounded-3xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-transparent via-amber-400/50 to-transparent" />
              <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-transparent via-amber-400/50 to-transparent" />
            </div>

            {/* Corner Decorations */}
            <div className="absolute top-2 left-2">
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
            <div className="absolute top-2 right-2">
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
            <div className="absolute bottom-2 left-2">
              <Sword className="w-4 h-4 text-amber-400" />
            </div>
            <div className="absolute bottom-2 right-2">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>

            <div className="relative flex items-end gap-4">
              {/* Deck Area - Left Side */}
              <motion.div 
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  {/* Deck Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-orange-500/30 blur-lg rounded-xl" />
                  
                  {/* Deck Card */}
                  <div className="relative w-20 h-28 bg-gradient-to-br from-amber-800/80 via-amber-700/60 to-amber-800/80 border-2 border-amber-500/50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-amber-700/80 transition-all duration-300 shadow-lg">
                    {/* Card Pattern */}
                    <div className="absolute inset-0 rounded-xl">
                      <div className="absolute top-2 left-2 w-4 h-6 bg-amber-600/30 rounded-sm" />
                      <div className="absolute top-2 right-2 w-4 h-6 bg-amber-600/30 rounded-sm" />
                      <div className="absolute bottom-2 left-2 w-4 h-6 bg-amber-600/30 rounded-sm" />
                      <div className="absolute bottom-2 right-2 w-4 h-6 bg-amber-600/30 rounded-sm" />
                    </div>
                    
                    <div className="text-2xl text-amber-300 mb-1">🂠</div>
                    <div className="text-xs text-amber-200 font-bold">{deckSize}</div>
                    <div className="text-[8px] text-amber-300/80 mt-1">Deck</div>
                  </div>
                </div>
              </motion.div>

              {/* Hand Cards - Center */}
              <div className="flex items-end gap-2 flex-wrap justify-center">
                <AnimatePresence>
                  {hand.map((card) => (
                    <CardMiniature
                      key={card.id}
                      card={card}
                      isSelected={selectedCardId === card.id}
                      isPlayable={(() => {
                        const result = canPlayCard(card);
                        return typeof result === 'object' ? result.playable : result;
                      })()}
                      onSelect={() => onSelectCard(card)}
                      onShowDetail={() => setSelectedCardForDetail(card)}
                      size="small"
                      showInfo={true}
                      className="transition-all duration-200"
                    />
                  ))}
                </AnimatePresence>
                
                {hand.length === 0 && (
                  <motion.div 
                    className="flex items-center justify-center py-8 px-12 text-amber-300/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">🃏</div>
                      <p className="text-sm font-medium">Mão vazia</p>
                      <p className="text-xs text-amber-400/60 mt-1">Aguarde as próximas cartas</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Hand Info */}
            {hand.length > 0 && (
              <motion.div 
                className="flex items-center justify-center mt-3 gap-6 text-xs text-amber-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="font-bold">{hand.length} cartas</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-green-400" />
                    <span>Jogável</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-red-400" />
                    <span>Bloqueada</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <CardDetailModal
        card={selectedCardForDetail}
        isOpen={!!selectedCardForDetail}
        onClose={() => setSelectedCardForDetail(null)}
      />
    </>
  );
};

export { CardDetailModal };
export default EnhancedHand;