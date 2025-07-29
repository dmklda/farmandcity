import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Package, 
  Star, 
  Zap, 
  Shield, 
  Crown, 
  Gem, 
  Clock, 
  TrendingUp,
  Wheat,
  Building,
  Wand2,
  Crosshair,
  AlertTriangle,
  Gift
} from 'lucide-react';

interface SpecialPack {
  id: string;
  name: string;
  description: string;
  item_type: 'pack' | 'booster';
  price_coins: number;
  price_gems: number;
  currency_type: 'coins' | 'gems' | 'both';
  rarity: string;
  is_limited: boolean;
  stock_quantity?: number;
  sold_quantity: number;
  discount_percentage: number;
  guaranteed_cards?: any;
}

interface SpecialPacksDisplayProps {
  packs: SpecialPack[];
  onPurchase: (packId: string) => void;
  purchasing?: string | null;
  userCurrency?: { coins: number; gems: number };
}

const getPackIcon = (name: string) => {
  if (name.includes('Fazendeiro') || name.includes('Colheita')) return <Wheat className="w-6 h-6" />;
  if (name.includes('Comerciante') || name.includes('Cidade')) return <Building className="w-6 h-6" />;
  if (name.includes('Magia') || name.includes('Poderosa')) return <Wand2 className="w-6 h-6" />;
  if (name.includes('Defensor') || name.includes('Defesa')) return <Shield className="w-6 h-6" />;
  if (name.includes('Lendária') || name.includes('Premium')) return <Crown className="w-6 h-6" />;
  if (name.includes('Festival') || name.includes('Evento')) return <Gift className="w-6 h-6" />;
  if (name.includes('Crise') || name.includes('Sobrevivência')) return <AlertTriangle className="w-6 h-6" />;
  if (name.includes('Ações') || name.includes('Estratégia')) return <Crosshair className="w-6 h-6" />;
  if (name.includes('Starter') || name.includes('Plus')) return <TrendingUp className="w-6 h-6" />;
  return <Package className="w-6 h-6" />;
};

const getPackRarityColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case 'common': return 'bg-gray-500 text-white';
    case 'uncommon': return 'bg-green-500 text-white';
    case 'rare': return 'bg-blue-500 text-white';
    case 'ultra': return 'bg-purple-500 text-white';
    case 'legendary': return 'bg-yellow-500 text-black';
    case 'secret': return 'bg-pink-500 text-white';
    case 'crisis': return 'bg-red-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getPackGradient = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case 'common': return 'from-gray-400 to-gray-600';
    case 'uncommon': return 'from-green-400 to-green-600';
    case 'rare': return 'from-blue-400 to-blue-600';
    case 'ultra': return 'from-purple-400 to-purple-600';
    case 'legendary': return 'from-yellow-400 to-yellow-600';
    case 'secret': return 'from-pink-400 to-pink-600';
    case 'crisis': return 'from-red-400 to-red-600';
    default: return 'from-gray-400 to-gray-600';
  }
};

const getPackGlow = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case 'common': return 'shadow-gray-500/20';
    case 'uncommon': return 'shadow-green-500/30';
    case 'rare': return 'shadow-blue-500/40';
    case 'ultra': return 'shadow-purple-500/50';
    case 'legendary': return 'shadow-yellow-500/60';
    case 'secret': return 'shadow-pink-500/70';
    case 'crisis': return 'shadow-red-500/50';
    default: return 'shadow-gray-500/20';
  }
};

export const SpecialPacksDisplay: React.FC<SpecialPacksDisplayProps> = ({
  packs,
  onPurchase,
  purchasing,
  userCurrency
}) => {
  const canAfford = (pack: SpecialPack) => {
    if (!userCurrency) return false;
    
    if (pack.currency_type === 'coins') {
      return userCurrency.coins >= pack.price_coins;
    } else if (pack.currency_type === 'gems') {
      return userCurrency.gems >= pack.price_gems;
    } else if (pack.currency_type === 'both') {
      return userCurrency.coins >= pack.price_coins && userCurrency.gems >= pack.price_gems;
    }
    return false;
  };

  const getPriceDisplay = (pack: SpecialPack) => {
    if (pack.currency_type === 'coins') {
      return (
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">💰</span>
          <span className={pack.discount_percentage > 0 ? 'line-through text-gray-400' : ''}>
            {pack.price_coins}
          </span>
          {pack.discount_percentage > 0 && (
            <span className="text-green-500 font-bold">
              {Math.round(pack.price_coins * (1 - pack.discount_percentage / 100))}
            </span>
          )}
        </div>
      );
    } else if (pack.currency_type === 'gems') {
      return (
        <div className="flex items-center gap-1">
          <Gem className="w-4 h-4 text-purple-500" />
          <span className={pack.discount_percentage > 0 ? 'line-through text-gray-400' : ''}>
            {pack.price_gems}
          </span>
          {pack.discount_percentage > 0 && (
            <span className="text-green-500 font-bold">
              {Math.round(pack.price_gems * (1 - pack.discount_percentage / 100))}
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  const getGuaranteedInfo = (pack: SpecialPack) => {
    if (!pack.guaranteed_cards) return null;
    
    try {
      const guarantees = typeof pack.guaranteed_cards === 'string' 
        ? JSON.parse(pack.guaranteed_cards) 
        : pack.guaranteed_cards;
      
      const info = [];
      
      if (guarantees.guaranteed_rarity) {
        info.push(`${guarantees.guaranteed_rarity} garantida`);
      }
      if (guarantees.min_rare_cards) {
        info.push(`${guarantees.min_rare_cards}+ raras`);
      }
      if (guarantees.min_legendary_cards) {
        info.push(`${guarantees.min_legendary_cards}+ lendárias`);
      }
      if (guarantees.chance_secret) {
        info.push(`${Math.round(guarantees.chance_secret * 100)}% chance secreta`);
      }
      
      return info;
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Packs Especiais
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Packs únicos e temáticos para expandir sua coleção!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packs.map((pack) => {
          const isPurchasing = purchasing === pack.id;
          const affordable = canAfford(pack);
          const guaranteedInfo = getGuaranteedInfo(pack);
          const stockLeft = pack.is_limited && pack.stock_quantity 
            ? pack.stock_quantity - pack.sold_quantity 
            : null;

          return (
            <Card 
              key={pack.id}
              className={`
                relative overflow-hidden transition-all duration-300 hover:scale-105
                bg-gradient-to-br ${getPackGradient(pack.rarity)} 
                shadow-lg ${getPackGlow(pack.rarity)} hover:shadow-xl
                border-2 border-white/20 backdrop-blur-sm
                ${pack.is_limited ? 'ring-2 ring-orange-400' : ''}
                ${pack.discount_percentage > 0 ? 'ring-2 ring-green-400' : ''}
              `}
            >
              {/* Discount Badge */}
              {pack.discount_percentage > 0 && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-green-500 text-white animate-pulse">
                    -{pack.discount_percentage}%
                  </Badge>
                </div>
              )}

              {/* Limited Badge */}
              {pack.is_limited && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-orange-500 text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    Limitado
                  </Badge>
                </div>
              )}

              {/* Stock Indicator */}
              {stockLeft !== null && (
                <div className="absolute top-12 left-2 z-10">
                  <Badge className="bg-red-500 text-white">
                    {stockLeft} restantes
                  </Badge>
                </div>
              )}

              <div className="p-6 text-white">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {getPackIcon(pack.name)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{pack.name}</h3>
                    <Badge className={`${getPackRarityColor(pack.rarity)} text-xs`}>
                      {pack.rarity.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/90 text-sm mb-4 leading-relaxed">
                  {pack.description}
                </p>

                {/* Guaranteed Info */}
                {guaranteedInfo && guaranteedInfo.length > 0 && (
                  <div className="mb-4 p-3 bg-white/10 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      Garantias:
                    </h4>
                    <div className="space-y-1">
                      {guaranteedInfo.map((info: string, index: number) => (
                        <div key={index} className="text-xs text-white/80 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          {info}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold">
                    {getPriceDisplay(pack)}
                  </div>
                  <div className="text-sm text-white/70">
                    {pack.item_type === 'pack' ? 'Pack' : 'Booster'}
                  </div>
                </div>

                {/* Purchase Button */}
                <Button
                  onClick={() => onPurchase(pack.id)}
                  disabled={isPurchasing || !affordable || (stockLeft !== null && stockLeft <= 0)}
                  className={`
                    w-full transition-all duration-200
                    ${affordable 
                      ? 'bg-white text-gray-800 hover:bg-gray-100 hover:scale-105' 
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    }
                    ${isPurchasing ? 'animate-pulse' : ''}
                  `}
                >
                  {isPurchasing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
                      Comprando...
                    </div>
                  ) : !affordable ? (
                    <div className="flex items-center gap-2">
                      <span>💰 Insuficiente</span>
                    </div>
                  ) : stockLeft !== null && stockLeft <= 0 ? (
                    <div className="flex items-center gap-2">
                      <span>Esgotado</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Comprar Pack
                    </div>
                  )}
                </Button>
              </div>

              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full animate-shimmer pointer-events-none" />
            </Card>
          );
        })}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}; 