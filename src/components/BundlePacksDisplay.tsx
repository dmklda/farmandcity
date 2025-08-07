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
  Coins,
  Gift,
  Palette,
  DollarSign
} from 'lucide-react';

interface BundlePack {
  id: string;
  name: string;
  description: string;
  item_type: 'bundle';
  price_dollars: number;
  currency_type: 'dollars';
  rarity: string;
  is_limited: boolean;
  stock_quantity?: number;
  sold_quantity: number;
  discount_percentage: number;
  real_discount_percentage: number;
  is_active: boolean;
  // Campos específicos para bundles
  bundle_type: 'single' | 'bundle' | 'starter' | 'premium';
  included_customizations?: string[];
  included_cards_count?: number;
  bundle_contents?: any;
  currency_amount_coins?: number;
  currency_amount_gems?: number;
  card_ids?: string[];
}

interface BundlePacksDisplayProps {
  bundles: BundlePack[];
  onPurchase: (bundleId: string) => void;
  purchasing?: string | null;
}

  const getBundleIcon = (bundleType?: string) => {
    switch (bundleType) {
      case 'starter': return <TrendingUp className="w-8 h-8" />;
      case 'premium': return <Crown className="w-8 h-8" />;
      case 'bundle': return <Gift className="w-8 h-8" />;
      default: return <Package className="w-8 h-8" />;
    }
  };

  const getBundleRarityColor = (rarity?: string) => {
    if (!rarity) return 'from-gray-600 to-gray-800';
    
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

  const getBundleGlow = (rarity?: string) => {
    if (!rarity) return 'shadow-gray-500/20';
    
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

export const BundlePacksDisplay: React.FC<BundlePacksDisplayProps> = ({
  bundles,
  onPurchase,
  purchasing
}) => {
  const getPriceDisplay = (bundle: BundlePack) => {
    const price = bundle.price_dollars || 0;
    let originalPrice = price;
    let displayPrice = price;
    
    if (bundle.discount_percentage && bundle.discount_percentage > 0) {
      originalPrice = price / (1 - bundle.discount_percentage / 100);
      displayPrice = price;
    }
    
    return (
      <div className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-500" />
        <span className={bundle.discount_percentage > 0 ? 'line-through text-gray-400' : 'text-green-400 font-bold text-xl'}>
          ${originalPrice.toFixed(2)}
        </span>
        {bundle.discount_percentage > 0 && (
          <span className="text-green-400 font-bold text-xl">
            ${displayPrice.toFixed(2)}
          </span>
        )}
      </div>
    );
  };

  const getBundleContents = (bundle: BundlePack) => {
    const contents = [];
    
    if (bundle.currency_amount_coins && bundle.currency_amount_coins > 0) {
      contents.push(
        <div key="coins" className="flex items-center gap-2 text-yellow-400">
          <Coins className="w-4 h-4" />
          <span>{bundle.currency_amount_coins} Moedas</span>
        </div>
      );
    }
    
    if (bundle.currency_amount_gems && bundle.currency_amount_gems > 0) {
      contents.push(
        <div key="gems" className="flex items-center gap-2 text-purple-400">
          <Gem className="w-4 h-4" />
          <span>{bundle.currency_amount_gems} Gemas</span>
        </div>
      );
    }
    
    if (bundle.included_cards_count && bundle.included_cards_count > 0 && bundle.card_ids && Array.isArray(bundle.card_ids) && bundle.card_ids.length > 0) {
      contents.push(
        <div key="cards" className="flex items-center gap-2 text-blue-400">
          <Package className="w-4 h-4" />
          <span>{bundle.included_cards_count} Cartas Aleatórias</span>
        </div>
      );
    }
    
    if (bundle.included_customizations && Array.isArray(bundle.included_customizations) && bundle.included_customizations.length > 0) {
      contents.push(
        <div key="customizations" className="flex items-center gap-2 text-pink-400">
          <Palette className="w-4 h-4" />
          <span>{bundle.included_customizations.length} Customizações</span>
        </div>
      );
    }
    
    return contents;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent mb-2">
          💎 Pacotes Premium
        </h2>
        <p className="text-gray-300">
          Pacotes especiais com múltiplos itens para impulsionar seu progresso!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((bundle) => {
                     const isPurchasing = purchasing === (bundle.id || '');
                     const stockLeft = bundle.is_limited && bundle.stock_quantity && bundle.stock_quantity > 0
             ? bundle.stock_quantity - (bundle.sold_quantity || 0)
             : null;

          return (
                         <Card 
               key={bundle.id || `bundle-${Math.random()}`}
               className={`
                relative overflow-hidden transition-all duration-300 hover:scale-105 group
                bg-gradient-to-br from-slate-800/80 to-slate-900/80 
                border-2 border-gray-600/30 hover:border-gray-500/60
                shadow-lg hover:shadow-xl
              `}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${getBundleRarityColor(bundle.rarity)} blur-xl -z-10`} />
              
                             {/* Discount Badge */}
               {bundle.discount_percentage && bundle.discount_percentage > 0 && (
                 <div className="absolute top-3 right-3 z-10">
                   <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
                     -{bundle.discount_percentage}%
                   </Badge>
                 </div>
               )}

              {/* Limited Badge */}
              {bundle.is_limited && (
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
                   <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                     {getBundleIcon(bundle.bundle_type || 'single')}
                   </div>
                                     <h3 className="font-bold text-xl mb-2">{bundle.name || 'Pacote Sem Nome'}</h3>
                                     <Badge className={`bg-gradient-to-r ${getBundleRarityColor(bundle.rarity)} text-white border-0`}>
                     {(bundle.bundle_type || 'single').toUpperCase()}
                   </Badge>
                </div>

                <Separator className="my-4 bg-green-600/30" />

                                 {/* Description */}
                 <p className="text-gray-300 text-sm mb-4 leading-relaxed text-center">
                   {bundle.description || 'Descrição não disponível'}
                 </p>

                                 {/* Stock Indicator */}
                 {stockLeft !== null && stockLeft > 0 && (
                   <div className="text-center mb-4">
                     <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0">
                       {stockLeft} restantes
                     </Badge>
                   </div>
                 )}

                {/* Bundle Contents */}
                <div className="mb-4 p-3 bg-black/20 rounded-lg border border-green-600/20">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 justify-center">
                    <Gift className="w-4 h-4 text-green-400" />
                    Inclui:
                  </h4>
                  <div className="space-y-2">
                    {getBundleContents(bundle)}
                  </div>
                </div>

                <Separator className="my-4 bg-green-600/30" />

                {/* Price */}
                <div className="text-center mb-4">
                  {getPriceDisplay(bundle)}
                </div>

                {/* Purchase Button */}
                                 <Button
                   onClick={() => onPurchase(bundle.id || '')}
                   disabled={isPurchasing || (stockLeft !== null && stockLeft <= 0)}
                  className={`
                    w-full transition-all duration-300
                    bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600
                    text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl
                    ${isPurchasing ? 'animate-pulse' : ''}
                    ${(stockLeft !== null && stockLeft <= 0) ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isPurchasing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Comprando...
                    </div>
                  ) : stockLeft !== null && stockLeft <= 0 ? (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Esgotado
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Comprar Pacote
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
