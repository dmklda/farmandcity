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
  Gem
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CardFrameProps {
  type: "city" | "farm" | "magic" | "landmark" | "event" | "trap" | "defense";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  title?: string;
  cost?: number;
  attack?: number;
  defense?: number;
  description?: string;
  imageUrl?: string;
  className?: string;
}

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
  epic: {
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

function CardFrame({
  type = "magic",
  rarity = "rare",
  title = "Mystic Spell",
  cost = 3,
  attack = 2,
  defense = 4,
  description = "A powerful spell that channels ancient magic to devastate enemies.",
  imageUrl = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
  className
}: CardFrameProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const typeConfig = cardTypeConfig[type];
  const raritySettings = rarityConfig[rarity];
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
    if (rarity === "common" || rarity === "uncommon") return null;

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
    if (rarity !== "legendary") return null;

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

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative w-64 h-96 rounded-xl overflow-hidden cursor-pointer select-none",
        "bg-gradient-to-br from-background to-muted",
        typeConfig.border,
        raritySettings.borderWidth,
        raritySettings.glow,
        className
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
          {/* Type icon and cost */}
          <div className="flex items-center gap-2">
            <div 
              className="p-2 rounded-lg border-2"
              style={{ 
                backgroundColor: `${typeConfig.color}20`,
                borderColor: typeConfig.color
              }}
            >
              <TypeIcon className="w-4 h-4" style={{ color: typeConfig.color }} />
            </div>
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full border-2 font-bold text-sm"
              style={{ 
                backgroundColor: `${typeConfig.color}20`,
                borderColor: typeConfig.color,
                color: typeConfig.color
              }}
            >
              {cost}
            </div>
          </div>

          {/* Rarity gems */}
          <div className="flex gap-1">
            {renderGems()}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-foreground leading-tight">
          {title}
        </h3>

        {/* Rarity indicator */}
        <div className="flex items-center gap-1 mt-1">
          {rarity === "legendary" && <Crown className="w-3 h-3 text-yellow-500" />}
          {(rarity === "epic" || rarity === "legendary") && <Star className="w-3 h-3 text-purple-400" />}
          <span 
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: raritySettings.gemColor }}
          >
            {rarity}
          </span>
        </div>
      </div>

      {/* Image section */}
      <div className="relative mx-4 mb-4 h-32 rounded-lg overflow-hidden border-2 border-border">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Stats section */}
      {(attack !== undefined || defense !== undefined) && (
        <div className="px-4 mb-3">
          <div className="flex justify-between items-center">
            {attack !== undefined && (
              <div className="flex items-center gap-1">
                <Swords className="w-4 h-4 text-red-500" />
                <span className="font-bold text-red-500">{attack}</span>
              </div>
            )}
            {defense !== undefined && (
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-blue-500">{defense}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="px-4 pb-4">
        <div 
          className="text-xs leading-relaxed p-3 rounded-lg border"
          style={{ 
            backgroundColor: `${typeConfig.color}10`,
            borderColor: `${typeConfig.color}30`
          }}
        >
          {description}
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
  );
}

export default function CardFrameShowcase() {
  const cardExamples = [
    {
      type: "magic" as const,
      rarity: "legendary" as const,
      title: "Arcane Mastery",
      cost: 8,
      attack: 5,
      defense: 3,
      description: "Channel the raw power of the arcane to devastate your enemies with mystical energy."
    },
    {
      type: "city" as const,
      rarity: "epic" as const,
      title: "Golden Citadel",
      cost: 6,
      description: "A magnificent fortress that generates wealth and provides protection for your realm."
    },
    {
      type: "farm" as const,
      rarity: "rare" as const,
      title: "Fertile Grounds",
      cost: 3,
      description: "Rich farmland that provides sustenance and resources for your growing civilization."
    },
    {
      type: "landmark" as const,
      rarity: "uncommon" as const,
      title: "Ancient Monument",
      cost: 4,
      description: "A mysterious structure from ages past that holds secrets of forgotten knowledge."
    },
    {
      type: "event" as const,
      rarity: "rare" as const,
      title: "Solar Eclipse",
      cost: 5,
      description: "A rare celestial event that brings both opportunity and danger to all who witness it."
    },
    {
      type: "trap" as const,
      rarity: "common" as const,
      title: "Hidden Snare",
      cost: 2,
      defense: 1,
      description: "A simple but effective trap that catches unwary adventurers off guard."
    },
    {
      type: "defense" as const,
      rarity: "epic" as const,
      title: "Aegis Barrier",
      cost: 7,
      defense: 8,
      description: "An impenetrable magical shield that protects against even the most powerful attacks."
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Card Frame Collection
          </h1>
          <p className="text-muted-foreground text-lg">
            Unique ornate frames for different card types with rarity-based variations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
          {cardExamples.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CardFrame {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}