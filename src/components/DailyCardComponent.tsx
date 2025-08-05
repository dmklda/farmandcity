import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { DailyRotationCard } from '../hooks/useShop';
import { getCardTypeIconPNG, getRarityIconPNG } from './IconComponentsPNG';
import { CoinsIconPNG, FoodsIconPNG, MaterialsIconPNG, PopulationIconPNG } from './IconComponentsPNG';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ShoppingCart, Star, Crown, Gem, Castle, Wheat, Sparkles, Landmark, Calendar, Shield, Swords } from 'lucide-react';
import { cn } from '../lib/utils';

interface DailyCardComponentProps {
  card: DailyRotationCard;
  onPurchase: (cardId: string) => void;
  purchasing: boolean;
  userCurrency?: { coins: number; gems: number } | null;
}

const DailyCardComponent: React.FC<DailyCardComponentProps> = ({ 
  card, 
  onPurchase, 
  purchasing,
  userCurrency
}) => {
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

  const typeConfig = cardTypeConfig[card.card_type as keyof typeof cardTypeConfig] || cardTypeConfig.magic;
  const raritySettings = rarityConfig[card.card_rarity as keyof typeof rarityConfig] || rarityConfig.rare;
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
    if (card.card_rarity === "common" || card.card_rarity === "uncommon") return null;

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
    if (card.card_rarity !== "legendary") return null;

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

  const canAfford = () => {
    if (!userCurrency || card.is_purchased) return false;
    
    if (card.currency_type === 'coins') {
      return userCurrency.coins >= card.price_coins;
    } else if (card.currency_type === 'gems') {
      return userCurrency.gems >= card.price_gems;
    } else if (card.currency_type === 'both') {
      return userCurrency.coins >= card.price_coins && userCurrency.gems >= card.price_gems;
    }
    return false;
  };

  const getPriceDisplay = () => {
    if (card.currency_type === 'coins') {
      return (
        <div className="flex items-center gap-1 text-yellow-400">
          <CoinsIconPNG size={16} />
          <span className="font-bold">{card.price_coins}</span>
        </div>
      );
    } else if (card.currency_type === 'gems') {
      return (
        <div className="flex items-center gap-1 text-purple-400">
          <span className="text-lg">💎</span>
          <span className="font-bold">{card.price_gems}</span>
        </div>
      );
    } else if (card.currency_type === 'both') {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-yellow-400">
            <CoinsIconPNG size={16} />
            <span className="font-bold">{card.price_coins}</span>
          </div>
          <span className="text-gray-400">+</span>
          <div className="flex items-center gap-1 text-purple-400">
            <span className="text-lg">💎</span>
            <span className="font-bold">{card.price_gems}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-yellow-600/30 hover:border-yellow-500/60 transition-all duration-300 group hover:shadow-xl">
      <div className="p-4">
        {/* Card Display - Centered */}
        <div className="flex items-center justify-center mb-4">
          <motion.div
            ref={cardRef}
                         className={cn(
               "relative w-72 h-[28rem] rounded-xl overflow-hidden cursor-pointer select-none",
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
            <div className="relative p-3 pb-2">
              <div className="flex items-center justify-between mb-2">
                {/* Type icon and dice activation */}
                <div className="flex items-center gap-2">
                  <div 
                    className="p-1.5 rounded-lg border-2"
                    style={{ 
                      backgroundColor: `${typeConfig.color}20`,
                      borderColor: typeConfig.color
                    }}
                  >
                    {getCardTypeIconPNG(card.card_type, 32)}
                  </div>
                  <div 
                    className="p-1.5 rounded-lg border-2"
                    style={{ 
                      backgroundColor: `${typeConfig.color}20`,
                      borderColor: typeConfig.color
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-white rounded-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-gray-800 rounded-sm"></div>
                      </div>
                      <span className="text-xs font-bold" style={{ color: typeConfig.color }}>
                        6
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
              <h3 className="font-bold text-base text-foreground leading-tight">
                {card.card_name}
              </h3>

              {/* Rarity indicator */}
              <div className="flex items-center gap-1 mt-1">
                {card.card_rarity === "legendary" && <Crown className="w-3 h-3 text-yellow-500" />}
                {(card.card_rarity === "ultra" || card.card_rarity === "legendary") && <Star className="w-3 h-3 text-purple-400" />}
                <span 
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: raritySettings.gemColor }}
                >
                  {card.card_rarity}
                </span>
              </div>
            </div>

                         {/* Image section */}
             <div className="relative mx-3 mb-3 h-36 rounded-lg overflow-hidden border-2 border-border">
              {card.artworkUrl ? (
                <img 
                  src={card.artworkUrl} 
                  alt={card.card_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🎨</div>
                    <p className="text-xs text-gray-400">Artwork será carregado no painel admin</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            

            {/* Cost section */}
            <div className="px-3 mb-2">
              <div className="flex justify-center items-center gap-1">
                {card.cost_coins > 0 && (
                  <div className="flex items-center gap-1 bg-amber-900/50 border border-amber-600/50 rounded px-1.5 py-0.5">
                                         <CoinsIconPNG size={16} />
                    <span className="font-bold text-amber-100 text-xs">{card.cost_coins}</span>
                  </div>
                )}
                {card.cost_food > 0 && (
                  <div className="flex items-center gap-1 bg-green-900/50 border border-green-600/50 rounded px-1.5 py-0.5">
                                         <FoodsIconPNG size={16} />
                    <span className="font-bold text-green-100 text-xs">{card.cost_food}</span>
                  </div>
                )}
                {card.cost_materials > 0 && (
                  <div className="flex items-center gap-1 bg-blue-900/50 border border-blue-600/50 rounded px-1.5 py-0.5">
                                         <MaterialsIconPNG size={16} />
                    <span className="font-bold text-blue-100 text-xs">{card.cost_materials}</span>
                  </div>
                )}
                {card.cost_population > 0 && (
                  <div className="flex items-center gap-1 bg-purple-900/50 border border-purple-600/50 rounded px-1.5 py-0.5">
                                         <PopulationIconPNG size={16} />
                    <span className="font-bold text-purple-100 text-xs">{card.cost_population}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="px-3 pb-3">
              <div 
                className="text-xs leading-relaxed p-3 rounded-lg border-2 min-h-[3rem] flex items-center"
                style={{ 
                  backgroundColor: `${typeConfig.color}15`,
                  borderColor: `${typeConfig.color}40`,
                  boxShadow: `0 0 10px ${typeConfig.color}20`
                }}
              >
                {card.card_effect || "Descrição do efeito da carta..."}
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

        {/* Daily rotation indicator */}
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/50 rounded-full px-2 py-1">
            <Star className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-yellow-300 font-medium">Carta Diária</span>
          </div>
          
          {/* Indicador de carta comprada */}
          {card.is_purchased && (
            <div className="ml-2 flex items-center gap-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-full px-2 py-1">
              <span className="text-xs text-green-300 font-medium">✓ Comprada</span>
            </div>
          )}
        </div>

        <Separator className="my-3 bg-yellow-600/30" />

        {/* Price and purchase section */}
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            {getPriceDisplay()}
          </div>
          
          {card.discount_percentage > 0 && (
            <div className="text-center">
              <Badge className="bg-green-500 text-white text-xs">
                -{card.discount_percentage}% DESCONTO
              </Badge>
            </div>
          )}

          <Button 
            onClick={() => onPurchase(card.card_id)}
            disabled={purchasing || !canAfford() || card.is_purchased}
            className={`w-full font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
              card.is_purchased
                ? 'bg-green-600 text-white cursor-not-allowed'
                : canAfford() 
                  ? 'bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 text-white' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {card.is_purchased 
              ? '✓ Já Comprada' 
              : purchasing 
                ? 'Comprando...' 
                : canAfford() 
                  ? 'Comprar Carta' 
                  : 'Moedas Insuficientes'
            }
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DailyCardComponent; 