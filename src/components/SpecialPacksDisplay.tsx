import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
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
  Gift,
  Coins,
  Sword,
  Castle,
  Scroll,
  Flame,
  Heart
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
  if (name.includes('Fazendeiro') || name.includes('Colheita')) return <Wheat className="w-8 h-8" />;
  if (name.includes('Comerciante') || name.includes('Cidade')) return <Building className="w-8 h-8" />;
  if (name.includes('Magia') || name.includes('Poderosa')) return <Wand2 className="w-8 h-8" />;
  if (name.includes('Defensor') || name.includes('Defesa')) return <Shield className="w-8 h-8" />;
  if (name.includes('Lendária') || name.includes('Premium')) return <Crown className="w-8 h-8" />;
  if (name.includes('Festival') || name.includes('Evento')) return <Gift className="w-8 h-8" />;
  if (name.includes('Crise') || name.includes('Sobrevivência')) return <AlertTriangle className="w-8 h-8" />;
  if (name.includes('Ações') || name.includes('Estratégia')) return <Sword className="w-8 h-8" />;
  if (name.includes('Starter') || name.includes('Plus')) return <TrendingUp className="w-8 h-8" />;
  if (name.includes('Castelo') || name.includes('Reino')) return <Castle className="w-8 h-8" />;
  if (name.includes('Magia') || name.includes('Feitiços')) return <Scroll className="w-8 h-8" />;
  if (name.includes('Dragão') || name.includes('Fogo')) return <Flame className="w-8 h-8" />;
  if (name.includes('Vida') || name.includes('Cura')) return <Heart className="w-8 h-8" />;
  return <Package className="w-8 h-8" />;
};

const getPackRarityColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case 'common': return 'from-gray-600 to-gray-800';
    case 'uncommon': return 'from-green-600 to-green-800';
    case 'rare': return 'from-blue-600 to-blue-800';
    case 'ultra': return 'from-purple-600 to-purple-800';
    case 'legendary': return 'from-yellow-500 to-orange-600';
    case 'secret': return 'from-pink-600 to-pink-800';
    case 'crisis': return 'from-red-600 to-red-800';
    default: return 'from-gray-600 to-gray-800';
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
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className={pack.discount_percentage > 0 ? 'line-through text-gray-400' : 'text-yellow-400 font-bold text-xl'}>
            {pack.price_coins}
          </span>
          {pack.discount_percentage > 0 && (
            <span className="text-green-400 font-bold text-xl">
              {Math.round(pack.price_coins * (1 - pack.discount_percentage / 100))}
            </span>
          )}
        </div>
      );
    } else if (pack.currency_type === 'gems') {
      return (
        <div className="flex items-center gap-2">
          <Gem className="w-5 h-5 text-purple-500" />
          <span className={pack.discount_percentage > 0 ? 'line-through text-gray-400' : 'text-purple-400 font-bold text-xl'}>
            {pack.price_gems}
          </span>
          {pack.discount_percentage > 0 && (
            <span className="text-green-400 font-bold text-xl">
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
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent mb-2">
          ⚔️ Packs Especiais
        </h2>
        <p className="text-gray-300">
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
                bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm
                border-2 border-yellow-600/30 hover:border-yellow-500/60
                shadow-lg ${getPackGlow(pack.rarity)} hover:shadow-xl
                ${pack.is_limited ? 'ring-2 ring-orange-400/50' : ''}
                ${pack.discount_percentage > 0 ? 'ring-2 ring-green-400/50' : ''}
              `}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${getPackRarityColor(pack.rarity)} blur-xl -z-10`} />
              
              {/* Discount Badge */}
              {pack.discount_percentage > 0 && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0 shadow-lg">
                    -{pack.discount_percentage}%
                  </Badge>
                </div>
              )}

              {/* Limited Badge */}
              {pack.is_limited && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge className="bg-gradient-to-r from-orange-600 to-orange-700 text-white border-0 shadow-lg">
                    <Clock className="w-3 h-3 mr-1" />
                    Limitado
                  </Badge>
                </div>
              )}

              <div className="p-6 text-white">
                {/* Header with Icon and Title */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                    {getPackIcon(pack.name)}
                  </div>
                  <h3 className="font-bold text-xl mb-2">{pack.name}</h3>
                  <Badge className={`bg-gradient-to-r ${getPackRarityColor(pack.rarity)} text-white border-0`}>
                    {pack.rarity.toUpperCase()}
                  </Badge>
                </div>

                <Separator className="my-4 bg-yellow-600/30" />

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 leading-relaxed text-center">
                  {pack.description}
                </p>

                {/* Stock Indicator */}
                {stockLeft !== null && (
                  <div className="text-center mb-4">
                    <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0">
                      {stockLeft} restantes
                    </Badge>
                  </div>
                )}

                {/* Guaranteed Info */}
                {guaranteedInfo && guaranteedInfo.length > 0 && (
                  <div className="mb-4 p-3 bg-black/20 rounded-lg border border-yellow-600/20">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 justify-center">
                      <Star className="w-4 h-4 text-yellow-400" />
                      Garantias:
                    </h4>
                    <div className="space-y-1">
                      {guaranteedInfo.map((info: string, index: number) => (
                        <div key={index} className="text-xs text-gray-300 flex items-center gap-2 justify-center">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          {info}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="my-4 bg-yellow-600/30" />

                {/* Price */}
                <div className="text-center mb-4">
                  {getPriceDisplay(pack)}
                </div>

                {/* Purchase Button */}
                <Button
                  onClick={() => onPurchase(pack.id)}
                  disabled={isPurchasing || !affordable || (stockLeft !== null && stockLeft <= 0)}
                  className={`
                    w-full transition-all duration-300
                    bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600
                    text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl
                    ${isPurchasing ? 'animate-pulse' : ''}
                    ${!affordable || (stockLeft !== null && stockLeft <= 0) ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isPurchasing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Comprando...
                    </div>
                  ) : !affordable ? (
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4" />
                      Moedas Insuficientes
                    </div>
                  ) : stockLeft !== null && stockLeft <= 0 ? (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Esgotado
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Comprar Pack
                    </div>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}; 
