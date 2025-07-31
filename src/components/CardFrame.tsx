import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
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
  Zap,
  Lock,
  Eye
} from "lucide-react";
import { Card } from "../types/card";
import { getCardTypeIconPNG, CoinsIconPNG, FoodsIconPNG, MaterialsIconPNG, PopulationIconPNG } from "./IconComponentsPNG";

interface CardFrameProps {
  card: Card;
  isSelected: boolean;
  isPlayable: boolean;
  onSelect: () => void;
  onShowDetail: () => void;
  size?: "small" | "medium" | "large";
  artworkUrl?: string;
  activatedDiceNumber?: number; // Número do dado que ativou a carta
}

const cardTypeConfig = {
  city: {
    icon: Castle,
    color: "#8B5A3C",
    gradient: "from-amber-900/20 to-orange-800/20",
    border: "border-amber-700",
    accent: "#D4AF37",
    bgGradient: "from-amber-900/40 via-amber-800/30 to-amber-900/40"
  },
  farm: {
    icon: Wheat,
    color: "#4A7C59",
    gradient: "from-green-800/20 to-emerald-700/20",
    border: "border-green-600",
    accent: "#90EE90",
    bgGradient: "from-green-900/40 via-green-800/30 to-green-900/40"
  },
  magic: {
    icon: Sparkles,
    color: "#6B46C1",
    gradient: "from-purple-800/20 to-violet-700/20",
    border: "border-purple-600",
    accent: "#9F7AEA",
    bgGradient: "from-purple-900/40 via-purple-800/30 to-purple-900/40"
  },
  landmark: {
    icon: Landmark,
    color: "#1E40AF",
    gradient: "from-blue-800/20 to-indigo-700/20",
    border: "border-blue-600",
    accent: "#60A5FA",
    bgGradient: "from-blue-900/40 via-blue-800/30 to-blue-900/40"
  },
  event: {
    icon: Calendar,
    color: "#DC2626",
    gradient: "from-red-800/20 to-rose-700/20",
    border: "border-red-600",
    accent: "#F87171",
    bgGradient: "from-red-900/40 via-red-800/30 to-red-900/40"
  },
  trap: {
    icon: Shield,
    color: "#374151",
    gradient: "from-gray-800/20 to-slate-700/20",
    border: "border-gray-600",
    accent: "#9CA3AF",
    bgGradient: "from-gray-900/40 via-gray-800/30 to-gray-900/40"
  },
  defense: {
    icon: Swords,
    color: "#059669",
    gradient: "from-teal-800/20 to-cyan-700/20",
    border: "border-teal-600",
    accent: "#34D399",
    bgGradient: "from-teal-900/40 via-teal-800/30 to-teal-900/40"
  }
};

const rarityConfig = {
  common: {
    borderWidth: "border-2",
    glow: "shadow-md",
    gems: 1,
    gemColor: "#9CA3AF",
    frameStyle: "simple",
    textColor: "text-gray-100",
    accentColor: "text-gray-400",
    iconPath: "/src/assets/icons/raridade/common_"
  },
  uncommon: {
    borderWidth: "border-[3px]",
    glow: "shadow-lg shadow-green-500/20",
    gems: 2,
    gemColor: "#10B981",
    frameStyle: "enhanced",
    textColor: "text-green-100",
    accentColor: "text-green-400",
    iconPath: "/src/assets/icons/raridade/uncommon_"
  },
  rare: {
    borderWidth: "border-[3px]",
    glow: "shadow-lg shadow-blue-500/30",
    gems: 3,
    gemColor: "#3B82F6",
    frameStyle: "ornate",
    textColor: "text-blue-100",
    accentColor: "text-blue-400",
    iconPath: "/src/assets/icons/raridade/rare_"
  },
  ultra: {
    borderWidth: "border-4",
    glow: "shadow-xl shadow-purple-500/40",
    gems: 4,
    gemColor: "#8B5CF6",
    frameStyle: "elaborate",
    textColor: "text-purple-100",
    accentColor: "text-purple-400",
    iconPath: "/src/assets/icons/raridade/ultra_"
  },
  legendary: {
    borderWidth: "border-4",
    glow: "shadow-2xl shadow-yellow-500/50",
    gems: 5,
    gemColor: "#F59E0B",
    frameStyle: "legendary",
    textColor: "text-yellow-100",
    accentColor: "text-yellow-400",
    iconPath: "/src/assets/icons/raridade/legendary_"
  }
};

const CardFrame: React.FC<CardFrameProps> = ({
  card,
  isSelected,
  isPlayable,
  onSelect,
  onShowDetail,
  size = "small",
  artworkUrl,
  activatedDiceNumber
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const typeConfig = cardTypeConfig[card.type as keyof typeof cardTypeConfig] || cardTypeConfig.magic;
  const raritySettings = rarityConfig[card.rarity as keyof typeof rarityConfig] || rarityConfig.common;
  const TypeIcon = typeConfig.icon;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
      
      // Calculate rotation based on mouse position
      const rotateXValue = ((e.clientY - centerY) / (rect.height / 2)) * -10;
      const rotateYValue = ((e.clientX - centerX) / (rect.width / 2)) * 10;
      
      rotateX.set(rotateXValue);
      rotateY.set(rotateYValue);
    };

    if (isHovered) {
      document.addEventListener("mousemove", handleMouseMove);
    } else {
      rotateX.set(0);
      rotateY.set(0);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHovered, mouseX, mouseY, rotateX, rotateY]);

  const spotlightBackground = useMotionTemplate`
    radial-gradient(300px circle at ${mouseX}px ${mouseY}px, ${typeConfig.accent}15, transparent)
  `;

  const getRarityIcon = (rarity: string, size: number) => {
    const iconPath = raritySettings.iconPath;
    return `${iconPath}${size}x${size}.png`;
  };

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
          className="w-2 h-2" 
          style={{ color: raritySettings.gemColor }}
        />
        <div 
          className="absolute inset-0 w-2 h-2 rounded-full blur-sm opacity-60"
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
        <div className="absolute top-1 left-1 w-4 h-4">
          <div 
            className="absolute inset-0 border-l border-t rounded-tl"
            style={{ borderColor: typeConfig.accent }}
          />
          <div 
            className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full"
            style={{ backgroundColor: typeConfig.accent }}
          />
        </div>
        <div className="absolute top-1 right-1 w-4 h-4">
          <div 
            className="absolute inset-0 border-r border-t rounded-tr"
            style={{ borderColor: typeConfig.accent }}
          />
          <div 
            className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full"
            style={{ backgroundColor: typeConfig.accent }}
          />
        </div>

        {/* Bottom corners */}
        <div className="absolute bottom-1 left-1 w-4 h-4">
          <div 
            className="absolute inset-0 border-l border-b rounded-bl"
            style={{ borderColor: typeConfig.accent }}
          />
          <div 
            className="absolute bottom-0.5 left-0.5 w-1 h-1 rounded-full"
            style={{ backgroundColor: typeConfig.accent }}
          />
        </div>
        <div className="absolute bottom-1 right-1 w-4 h-4">
          <div 
            className="absolute inset-0 border-r border-b rounded-br"
            style={{ borderColor: typeConfig.accent }}
          />
          <div 
            className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full"
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

  const getCardSize = () => {
    switch (size) {
      case "large":
        return "w-64 h-96";
      case "medium":
        return "w-32 h-48";
      case "small":
      default:
        return "w-20 h-28";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "large":
        return "text-lg";
      case "medium":
        return "text-sm";
      case "small":
      default:
        return "text-[8px]";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "large":
        return 32;
      case "medium":
        return 16;
      case "small":
      default:
        return 8;
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative ${getCardSize()} rounded-xl overflow-hidden cursor-pointer select-none
        bg-gradient-to-br ${typeConfig.bgGradient}
        ${typeConfig.border}
        ${raritySettings.borderWidth}
        ${raritySettings.glow}
        transition-all duration-300 ease-out will-change-transform
        group
        ${isSelected ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-black scale-150 -translate-y-8 z-50 shadow-2xl brightness-110' : 'z-10'}
        hover:scale-125 hover:-translate-y-4 hover:z-40 hover:shadow-xl hover:brightness-105
        ${!isPlayable ? 'opacity-60 cursor-not-allowed' : ''}
      `}
      style={{
        background: isHovered ? spotlightBackground : undefined,
        borderColor: typeConfig.color,
        transformOrigin: 'center bottom',
        transform: isHovered ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      }}
      onClick={isPlayable ? onSelect : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={isPlayable ? { scale: 1.25, y: -16 } : {}}
      whileTap={isPlayable ? { scale: 0.95 } : {}}
    >
      {/* Legendary rotating border effect */}
      {renderLegendaryEffects()}

      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${typeConfig.gradient}`} />

      {/* Ornate corner decorations */}
      {renderOrnateCorners()}

      {/* Card Content */}
      <div className="p-2 h-full flex flex-col justify-between relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className={`${getTextSize()} font-bold ${raritySettings.textColor} line-clamp-2 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}>
              {card.name}
            </h4>
          </div>
          
          {/* Dice Activation Indicator */}
          {activatedDiceNumber && (
            <div className="ml-1 flex items-center">
              <div className="bg-amber-600/80 border border-amber-400/60 rounded-full w-4 h-4 flex items-center justify-center">
                <span className="text-[8px] font-bold text-amber-100">
                  {activatedDiceNumber}
                </span>
              </div>
            </div>
          )}
          
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
          {/* Artwork Area */}
          {artworkUrl && (
            <div className="mb-1 w-full h-8 rounded overflow-hidden border border-amber-600/30">
              <img
                src={artworkUrl}
                alt={`Artwork de ${card.name}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Type Indicator */}
          <div className="mb-1">
            {getCardTypeIconPNG(card.type, getIconSize())}
          </div>
          
          {/* Rarity Icon */}
          <div className="mb-1">
            <img
              src={getRarityIcon(card.rarity, getIconSize())}
              alt={`${card.rarity} rarity`}
              className="w-3 h-3"
            />
          </div>
          
          {/* Costs */}
          <div className="flex flex-wrap gap-0.5 justify-center">
            {(card.cost.coins || 0) > 0 && (
              <span className={`text-[6px] bg-amber-900/70 border border-amber-600/50 ${raritySettings.textColor} px-1 py-0.5 rounded flex items-center gap-0.5`}>
                <CoinsIconPNG size={8} />
                {card.cost.coins}
              </span>
            )}
            {(card.cost.food || 0) > 0 && (
              <span className={`text-[6px] bg-green-900/70 border border-green-600/50 ${raritySettings.textColor} px-1 py-0.5 rounded flex items-center gap-0.5`}>
                <FoodsIconPNG size={8} />
                {card.cost.food}
              </span>
            )}
            {(card.cost.materials || 0) > 0 && (
              <span className={`text-[6px] bg-blue-900/70 border border-blue-600/50 ${raritySettings.textColor} px-1 py-0.5 rounded flex items-center gap-0.5`}>
                <MaterialsIconPNG size={8} />
                {card.cost.materials}
              </span>
            )}
            {(card.cost.population || 0) > 0 && (
              <span className={`text-[6px] bg-purple-900/70 border border-purple-600/50 ${raritySettings.textColor} px-1 py-0.5 rounded flex items-center gap-0.5`}>
                <PopulationIconPNG size={8} />
                {card.cost.population}
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

export default CardFrame; 
