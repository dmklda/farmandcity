import React, { useState, useEffect } from 'react';
import { useBattlefieldCustomization } from '../hooks/useBattlefieldCustomization';
import { useCurrency } from '../hooks/useCurrency';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Coins, 
  Gem, 
  Star, 
  Crown, 
  Zap,
  Palette,
  Sparkles,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface PremiumBackgroundsShopProps {
  onPurchase?: () => void;
}

export const PremiumBackgroundsShop: React.FC<PremiumBackgroundsShopProps> = ({ onPurchase }) => {
  const { 
    customizations, 
    userCustomizations, 
    purchaseCustomization, 
    equipCustomization,
    getPremiumBackgrounds,
    loading 
  } = useBattlefieldCustomization();
  
  const { coins, gems, loading: currencyLoading } = useCurrency();
  const [selectedBackground, setSelectedBackground] = useState<any>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const premiumBackgrounds = getPremiumBackgrounds();
  const userBackgroundIds = userCustomizations.map(uc => uc.customization_id);

  const categories = [
    { id: 'all', name: 'Todos', icon: Palette },
    { id: 'epic', name: 'Épicos', icon: Star },
    { id: 'legendary', name: 'Lendários', icon: Crown },
    { id: 'animated', name: 'Animados', icon: Zap }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'epic': return 'text-purple-400 bg-purple-900/20 border-purple-600/30';
      case 'legendary': return 'text-yellow-400 bg-yellow-900/20 border-yellow-600/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-600/30';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'epic': return <Star className="w-4 h-4" />;
      case 'legendary': return <Crown className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const isAnimated = (background: any) => {
    return background.image_url?.includes('.mp4') || 
           background.name?.includes('Animado') || 
           background.name?.includes('animated') ||
           background.image_url?.includes('animated');
  };

  const getBackgroundPreview = (background: any) => {
    const animated = isAnimated(background);
    
    if (animated) {
      // Para backgrounds animados, mostrar uma preview estática com indicador
      return (
        <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden">
          {/* Placeholder para vídeo com gradiente animado */}
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2 animate-pulse" />
                <p className="text-blue-400 text-xs font-medium">Background Animado</p>
              </div>
            </div>
          </div>
          
          {/* Overlay indicando que é animado */}
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="text-xs text-blue-400 border-blue-400 bg-blue-900/50">
              <Zap className="w-3 h-3 mr-1" />
              ANIMADO
            </Badge>
          </div>
          
          {/* Overlay de equipado */}
          {equipped && (
            <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
              <Badge className="bg-yellow-600 text-white">
                EQUIPADO
              </Badge>
            </div>
          )}
        </div>
      );
    } else {
      // Para backgrounds estáticos, mostrar imagem normal
      return (
        <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden">
          {background.image_url ? (
            <img
              src={background.image_url}
              alt={background.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/src/assets/boards_backgrounds/grid-board-background.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800">
              <Palette className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          {/* Overlay de equipado */}
          {equipped && (
            <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
              <Badge className="bg-yellow-600 text-white">
                EQUIPADO
              </Badge>
            </div>
          )}
        </div>
      );
    }
  };

  const filteredBackgrounds = premiumBackgrounds.filter(background => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'epic') return background.rarity === 'epic';
    if (selectedCategory === 'legendary') return background.rarity === 'legendary';
    if (selectedCategory === 'animated') return isAnimated(background);
    return true;
  });

  const handlePurchase = async (background: any, purchaseType: 'coins' | 'gems') => {
    try {
      setPurchasing(true);
      
      if (purchaseType === 'coins' && background.price_coins && coins < background.price_coins) {
        toast.error(`Moedas insuficientes! Você tem ${coins} moedas, mas precisa de ${background.price_coins} moedas.`);
        return;
      }
      
      if (purchaseType === 'gems' && background.price_gems && gems < background.price_gems) {
        toast.error(`Gemas insuficientes! Você tem ${gems} gemas, mas precisa de ${background.price_gems} gemas.`);
        return;
      }

      await purchaseCustomization(background.id, purchaseType);
      toast.success(`Background "${background.name}" comprado com sucesso!`);
      onPurchase?.();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao comprar background');
    } finally {
      setPurchasing(false);
    }
  };

  const handleEquip = async (background: any) => {
    try {
      await equipCustomization(background.id);
      toast.success(`Background "${background.name}" equipado!`);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao equipar background');
    }
  };

  const isOwned = (backgroundId: string) => {
    return userBackgroundIds.includes(backgroundId);
  };

  const isEquipped = (backgroundId: string) => {
    return userCustomizations.find(uc => uc.customization_id === backgroundId)?.is_equipped;
  };

  if (loading || currencyLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando backgrounds premium...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Backgrounds Premium</h2>
        <p className="text-gray-400">Personalize seu campo de batalha com backgrounds exclusivos</p>
      </div>

      {/* Categorias */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              <category.icon className="w-4 h-4" />
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Grid de Backgrounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBackgrounds.map((background) => {
          const owned = isOwned(background.id);
          const equipped = isEquipped(background.id);
          const animated = isAnimated(background);

          return (
            <Card 
              key={background.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                getRarityColor(background.rarity || 'common')
              } ${equipped ? 'ring-2 ring-yellow-400' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white truncate">
                    {background.name}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    {animated && <Zap className="w-4 h-4 text-blue-400" />}
                    {getRarityIcon(background.rarity || 'common')}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {background.rarity?.toUpperCase() || 'COMMON'}
                  </Badge>
                  {animated && (
                    <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                      ANIMADO
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Preview da imagem */}
                {getBackgroundPreview(background)}

                {/* Descrição */}
                <p className="text-sm text-gray-300 line-clamp-2">
                  {background.description || 'Background premium exclusivo para personalizar seu campo de batalha.'}
                </p>

                {/* Preços */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {background.price_coins && background.price_coins > 0 && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Coins className="w-4 h-4" />
                        <span className="text-sm font-medium">{background.price_coins}</span>
                      </div>
                    )}
                    {background.price_gems && background.price_gems > 0 && (
                      <div className="flex items-center gap-1 text-purple-400">
                        <Gem className="w-4 h-4" />
                        <span className="text-sm font-medium">{background.price_gems}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2">
                  {!owned ? (
                    <>
                      {background.price_coins && background.price_coins > 0 && (
                        <Button
                          size="sm"
                          className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                          onClick={() => handlePurchase(background, 'coins')}
                          disabled={purchasing || coins < (background.price_coins || 0)}
                        >
                          <Coins className="w-4 h-4 mr-1" />
                          Comprar
                        </Button>
                      )}
                      {background.price_gems && background.price_gems > 0 && (
                        <Button
                          size="sm"
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                          onClick={() => handlePurchase(background, 'gems')}
                          disabled={purchasing || gems < (background.price_gems || 0)}
                        >
                          <Gem className="w-4 h-4 mr-1" />
                          Comprar
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleEquip(background)}
                      disabled={equipped}
                    >
                      {equipped ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-1" />
                          Equipado
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Equipar
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mensagem quando não há backgrounds */}
      {filteredBackgrounds.length === 0 && (
        <div className="text-center py-12">
          <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum background encontrado</h3>
          <p className="text-gray-400">Tente selecionar uma categoria diferente.</p>
        </div>
      )}

      {/* Informações sobre moedas/gemas */}
      <div className="bg-slate-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Suas Moedas</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">{coins.toLocaleString()}</span>
            <span className="text-gray-400">moedas</span>
          </div>
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">{gems.toLocaleString()}</span>
            <span className="text-gray-400">gemas</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 