import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { useShop } from '../hooks/useShop';
import { useAppContext } from '../contexts/AppContext';
import { ShoppingCart, Coins, Gem, Package, Zap, Star, Crown, Sword, Shield, History, Image, Palette } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from './ui/toast';
import { SpecialPacksDisplay } from './SpecialPacksDisplay';
import { getRarityIconPNG } from './IconComponentsPNG';
import DailyCardComponent from './DailyCardComponent';
import { useBattlefieldCustomization } from '../hooks/useBattlefieldCustomization';
import { useContainerCustomization } from '../hooks/useContainerCustomization';

export const Shop: React.FC = () => {
  const { 
    shopItems, 
    dailyRotationCards, 
    shopEvents, 
    purchases, 
    cardPurchases,
    purchaseItem, 
    purchaseCard,
    loading, 
    error, 
    getAvailablePacks, 
    getAvailableBoosters, 
    getAvailableCurrency,
    getCurrencyPacks,
    getCurrencyGems,
    getCurrencyCoins,
    getSpecialPacks,
    fetchShopItems,
    testFetchPurchases
  } = useShop();
  
  const {
    customizations,
    userCustomizations,
    equippedCustomization,
    purchaseCustomization,
    equipCustomization,
    loading: customizationsLoading,
    error: customizationsError
  } = useBattlefieldCustomization();

  const {
    customizations: containerCustomizations,
    userCustomizations: userContainerCustomizations,
    equippedCustomizations: equippedContainerCustomizations,
    purchaseCustomization: purchaseContainerCustomization,
    equipCustomization: equipContainerCustomization,
    loading: containerCustomizationsLoading,
    error: containerCustomizationsError
  } = useContainerCustomization();
  
  const { currency, currencyLoading, refreshCurrency } = useAppContext();
  const { showToast, ToastContainer } = useToast();

  // Memoizar o valor do currency para evitar re-renders desnecessários
  const memoizedCurrency = useMemo(() => currency, [currency?.coins, currency?.gems]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [authStatus, setAuthStatus] = useState<string>('Verificando...');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAuthStatus(`Autenticado: ${user.email}`);
      } else {
        setAuthStatus('Não autenticado');
      }
    } catch (err) {
      setAuthStatus('Erro na autenticação');
      console.error('Erro na autenticação:', err);
    }
  };

  const handlePurchase = async (itemId: string) => {
    try {
      setPurchasing(true);
      await purchaseItem(itemId, 1);
      showToast('Compra realizada com sucesso!', 'success');
    } catch (err: any) {
      showToast(`Erro na compra: ${err.message}`, 'error');
    } finally {
      setPurchasing(false);
    }
  };

  const handlePurchaseCard = async (cardId: string) => {
    try {
      setPurchasing(true);
      await purchaseCard(cardId);
      showToast('Carta comprada com sucesso!', 'success');
    } catch (err: any) {
      showToast(`Erro na compra da carta: ${err.message}`, 'error');
    } finally {
      setPurchasing(false);
    }
  };

  const handlePurchaseCustomization = async (customizationId: string) => {
    try {
      setPurchasing(true);
      await purchaseCustomization(customizationId);
      showToast('Customização comprada com sucesso!', 'success');
    } catch (err: any) {
      showToast(`Erro na compra da customização: ${err.message}`, 'error');
    } finally {
      setPurchasing(false);
    }
  };

  const handleEquipCustomization = async (customizationId: string) => {
    try {
      setPurchasing(true);
      await equipCustomization(customizationId);
      showToast('Customização equipada com sucesso!', 'success');
    } catch (err: any) {
      showToast(`Erro ao equipar customização: ${err.message}`, 'error');
    } finally {
      setPurchasing(false);
    }
  };

  const handlePurchaseContainerCustomization = async (customizationId: string) => {
    try {
      setPurchasing(true);
      await purchaseContainerCustomization(customizationId);
      showToast('Customização de container comprada com sucesso!', 'success');
    } catch (err: any) {
      showToast(`Erro na compra: ${err.message}`, 'error');
    } finally {
      setPurchasing(false);
    }
  };

  const handleEquipContainerCustomization = async (customizationId: string, containerType: string) => {
    try {
      await equipContainerCustomization(customizationId, containerType);
      showToast('Customização de container equipada com sucesso!', 'success');
    } catch (err: any) {
      showToast(`Erro ao equipar: ${err.message}`, 'error');
    }
  };

  const handleReload = async () => {
    try {
    await fetchShopItems();
      await refreshCurrency();
    } catch (err) {
      console.error('Erro ao recarregar:', err);
    }
  };

  const testDirectQuery = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .limit(5);
      
      if (error) {
        console.error('Erro na query direta:', error);
      } else {
        console.log('Query direta bem-sucedida:', data);
      }
    } catch (err) {
      console.error('Erro no teste direto:', err);
    }
  };

  const testRefreshCurrency = async () => {
    try {
      await refreshCurrency();
      console.log('Refresh de moeda executado');
    } catch (err) {
      console.error('Erro no refresh de moeda:', err);
    }
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-600 to-gray-800';
      case 'rare': return 'from-blue-600 to-blue-800';
      case 'epic': return 'from-purple-600 to-purple-800';
      case 'legendary': return 'from-yellow-500 to-orange-600';
      case 'landmark': return 'from-amber-600 to-yellow-600';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const getRarityIconComponent = (rarity?: string) => {
    if (!rarity) return null;
    return getRarityIconPNG(rarity, 16);
  };

  const getRarityIcon = (rarity?: string) => {
    switch (rarity) {
      case 'common': return <Shield className="w-4 h-4" />;
      case 'rare': return <Sword className="w-4 h-4" />;
      case 'epic': return <Crown className="w-4 h-4" />;
      case 'legendary': return <Gem className="w-4 h-4" />;
      case 'landmark': return <Star className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getRarityBadge = (rarity: string) => {
    const colors = {
      common: 'bg-gray-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-yellow-500'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${colors[rarity as keyof typeof colors] || colors.common}`}>
        {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
      </span>
    );
  };

  const renderCustomization = (customization: any) => {
    const isOwned = userCustomizations?.some(uc => uc.customization_id === customization.id);
    const isEquipped = equippedCustomization?.id === customization.id;
    const isFree = customization.price_coins === 0 && customization.price_gems === 0;
    
    return (
      <Card key={customization.id} className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-yellow-600/30 hover:border-yellow-500/60 transition-all duration-300 group hover:shadow-xl">
        {/* Glow effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${getRarityColor(customization.rarity)} blur-xl -z-10`} />
        
        {/* Rarity badge */}
        <div className="absolute top-3 right-3 z-10">
          {getRarityBadge(customization.rarity)}
        </div>

        {/* Free badge */}
        {isFree && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
              GRÁTIS
            </Badge>
          </div>
        )}
        
        <div className="p-6">
          {/* Customization Preview */}
          <div className="w-full h-32 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg mb-4 flex items-center justify-center shadow-lg overflow-hidden">
            <img 
              src={customization.image_url} 
              alt={customization.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.display = 'none';
                const nextSibling = target.nextElementSibling as HTMLElement;
                if (nextSibling) {
                  nextSibling.style.display = 'flex';
                }
              }}
            />
            <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
              <Image className="w-12 h-12 text-white" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 text-center">
            {customization.name}
          </h3>
          
          <p className="text-gray-300 text-sm mb-4 text-center min-h-[40px]">
            {customization.description}
          </p>

          <Separator className="my-4 bg-yellow-600/30" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {isFree ? (
                <div className="flex items-center gap-1">
                  <span className="text-lg">🎁</span>
                  <span className="text-xl font-bold text-green-400">GRÁTIS</span>
                </div>
              ) : (
                <>
                  {customization.price_coins > 0 && (
                    <div className="flex items-center gap-1">
                      <Coins className="w-5 h-5 text-yellow-500" />
                      <span className="text-xl font-bold text-yellow-400">{customization.price_coins}</span>
                    </div>
                  )}
                  {customization.price_gems > 0 && (
                    <div className="flex items-center gap-1">
                      <Gem className="w-5 h-5 text-purple-500" />
                      <span className="text-xl font-bold text-purple-400">{customization.price_gems}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {!isOwned ? (
              <Button
                onClick={() => handlePurchaseCustomization(customization.id)}
                className={`w-full ${isFree ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                disabled={purchasing}
              >
                {purchasing ? 'Obtendo...' : isFree ? 'Obter Grátis' : 'Comprar'}
              </Button>
            ) : (
              <Button
                onClick={() => handleEquipCustomization(customization.id)}
                className={`w-full ${isEquipped ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                disabled={purchasing || isEquipped}
              >
                {purchasing ? 'Equipando...' : isEquipped ? 'Equipado' : 'Equipar'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const renderContainerCustomization = (customization: any) => {
    const isOwned = userContainerCustomizations?.some(uc => uc.customization_id === customization.id);
    const isEquipped = equippedContainerCustomizations[customization.container_type]?.id === customization.id;
    const isFree = customization.price_coins === 0 && customization.price_gems === 0;
    
    const getContainerTypeColor = (type: string) => {
      switch (type) {
        case 'city': return 'from-blue-500 to-blue-600';
        case 'farm': return 'from-green-500 to-green-600';
        case 'landmark': return 'from-purple-500 to-purple-600';
        case 'events': return 'from-orange-500 to-orange-600';
        default: return 'from-gray-500 to-gray-600';
      }
    };

    const getContainerTypeIcon = (type: string) => {
      switch (type) {
        case 'city': return '🏙️';
        case 'farm': return '🌾';
        case 'landmark': return '🏛️';
        case 'events': return '🎪';
        default: return '📦';
      }
    };

    const getContainerTypeName = (type: string) => {
      switch (type) {
        case 'city': return 'Cidade';
        case 'farm': return 'Fazenda';
        case 'landmark': return 'Marco';
        case 'events': return 'Eventos';
        default: return 'Container';
      }
    };
    
    return (
      <Card key={customization.id} className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-blue-600/30 hover:border-blue-500/60 transition-all duration-300 group hover:shadow-xl">
        {/* Glow effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${getRarityColor(customization.rarity)} blur-xl -z-10`} />
        
        {/* Rarity badge */}
        <div className="absolute top-3 right-3 z-10">
          {getRarityBadge(customization.rarity)}
        </div>

        {/* Container type badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className={`bg-gradient-to-r ${getContainerTypeColor(customization.container_type)} text-white border-0`}>
            {getContainerTypeIcon(customization.container_type)} {getContainerTypeName(customization.container_type)}
          </Badge>
        </div>

        {/* Free badge */}
        {isFree && (
          <div className="absolute top-12 left-3 z-10">
            <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
              GRÁTIS
            </Badge>
          </div>
        )}
        
        <div className="p-6">
          {/* Customization Preview */}
          <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mb-4 flex items-center justify-center shadow-lg overflow-hidden">
            <img 
              src={customization.image_url || ''} 
              alt={customization.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.display = 'none';
                const nextSibling = target.nextElementSibling as HTMLElement;
                if (nextSibling) {
                  nextSibling.style.display = 'flex';
                }
              }}
            />
            <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 text-center">
            {customization.name}
          </h3>
          
          <p className="text-gray-300 text-sm mb-4 text-center min-h-[40px]">
            {customization.description}
          </p>

          <Separator className="my-4 bg-blue-600/30" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {isFree ? (
                <div className="flex items-center gap-1">
                  <span className="text-lg">🎁</span>
                  <span className="text-xl font-bold text-green-400">GRÁTIS</span>
                </div>
              ) : (
                <>
                  {customization.price_coins > 0 && (
                    <div className="flex items-center gap-1">
                      <Coins className="w-5 h-5 text-yellow-500" />
                      <span className="text-xl font-bold text-yellow-400">{customization.price_coins}</span>
                    </div>
                  )}
                  {customization.price_gems > 0 && (
                    <div className="flex items-center gap-1">
                      <Gem className="w-5 h-5 text-purple-500" />
                      <span className="text-xl font-bold text-purple-400">{customization.price_gems}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {!isOwned ? (
              <Button
                onClick={() => handlePurchaseContainerCustomization(customization.id)}
                className={`w-full ${isFree ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                disabled={purchasing}
              >
                {purchasing ? 'Obtendo...' : isFree ? 'Obter Grátis' : 'Comprar'}
              </Button>
            ) : (
              <Button
                onClick={() => handleEquipContainerCustomization(customization.id, customization.container_type)}
                className={`w-full ${isEquipped ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                disabled={purchasing || isEquipped}
              >
                {purchasing ? 'Equipando...' : isEquipped ? 'Equipado' : 'Equipar'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const renderShopItem = (item: any) => (
    <Card key={item.id} className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-yellow-600/30 hover:border-yellow-500/60 transition-all duration-300 group hover:shadow-xl">
      {/* Glow effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${getRarityColor(item.rarity)} blur-xl -z-10`} />
      
      {/* Rarity badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge className={`bg-gradient-to-r text-white border-0 ${getRarityColor(item.rarity)}`}>
          {getRarityIcon(item.rarity)}
          <span className="ml-1 capitalize">{item.rarity}</span>
          </Badge>
      </div>
      
      <div className="p-6">
        {/* Item Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
          {item.item_type === 'pack' && <Package className="w-8 h-8 text-white" />}
          {item.item_type === 'booster' && <Zap className="w-8 h-8 text-white" />}
          {item.item_type === 'currency' && <Coins className="w-8 h-8 text-white" />}
          {item.item_type === 'card' && <Star className="w-8 h-8 text-white" />}
        </div>

        <h3 className="text-xl font-bold text-white mb-2 text-center">
          {item.name}
        </h3>
        
        <p className="text-gray-300 text-sm mb-4 text-center min-h-[40px]">
          {item.description}
        </p>

        <Separator className="my-4 bg-yellow-600/30" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
        {item.price_coins > 0 && (
              <div className="flex items-center gap-1">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="text-xl font-bold text-yellow-400">{item.price_coins}</span>
          </div>
        )}
        {item.price_gems > 0 && (
              <div className="flex items-center gap-1">
                <Gem className="w-5 h-5 text-purple-500" />
                <span className="text-xl font-bold text-purple-400">{item.price_gems}</span>
          </div>
        )}
        {item.price_dollars && parseFloat(item.price_dollars) > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-lg">💵</span>
                <span className="text-xl font-bold text-green-400">${parseFloat(item.price_dollars).toFixed(2)}</span>
          </div>
        )}
      </div>
      {item.is_limited && item.stock_quantity && (
            <Badge variant="destructive" className="bg-red-600">
              {item.stock_quantity - item.sold_quantity}/{item.stock_quantity}
            </Badge>
          )}
        </div>

      <Button 
        onClick={() => handlePurchase(item.id)}
        disabled={purchasing || (item.is_limited && item.stock_quantity && item.sold_quantity >= item.stock_quantity)}
          className="w-full bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
      >
          <ShoppingCart className="w-4 h-4 mr-2" />
        {purchasing ? 'Comprando...' : 'Comprar'}
      </Button>
      </div>
    </Card>
  );

  // Mostrar loading se qualquer um dos hooks estiver carregando
  if (loading || currencyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-lg text-white">
            {loading ? 'Carregando loja...' : 'Carregando moeda...'}
          </div>
          <div className="text-sm text-gray-400">
          Status: {authStatus}
        </div>
        <div className="flex gap-2">
            <Button onClick={handleReload} variant="outline" className="bg-black/40 backdrop-blur-sm border-yellow-600/30 text-white">
            Recarregar
          </Button>
            <Button onClick={testDirectQuery} variant="outline" className="bg-black/40 backdrop-blur-sm border-yellow-600/30 text-white">
            Testar Query
          </Button>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-lg text-red-400">
            Erro ao carregar loja: {error}
          </div>
          <div className="text-sm text-gray-400">
          Status: {authStatus}
        </div>
        <div className="flex gap-2">
            <Button onClick={handleReload} variant="outline" className="bg-black/40 backdrop-blur-sm border-yellow-600/30 text-white">
            Tentar Novamente
          </Button>
            <Button onClick={testDirectQuery} variant="outline" className="bg-black/40 backdrop-blur-sm border-yellow-600/30 text-white">
            Testar Query
          </Button>
          </div>
        </div>
      </div>
    );
  }

  // Se não há itens, mostrar mensagem
  if (!shopItems || shopItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-lg text-gray-400">
          Nenhum item disponível na loja
        </div>
        <div className="text-sm text-gray-500">
          Status: {authStatus}
        </div>
        <div className="flex gap-2">
            <Button onClick={handleReload} variant="outline" className="bg-black/40 backdrop-blur-sm border-yellow-600/30 text-white">
            Recarregar
          </Button>
            <Button onClick={testDirectQuery} variant="outline" className="bg-black/40 backdrop-blur-sm border-yellow-600/30 text-white">
            Testar Query
          </Button>
            <Button onClick={testRefreshCurrency} variant="outline" className="bg-black/40 backdrop-blur-sm border-yellow-600/30 text-white">
            Testar Refresh Moedas
          </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Background texture */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]" />
          </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Coin Display */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-amber-700 px-4 py-2 rounded-full shadow-lg">
              <Coins className="w-5 w-5 text-yellow-200" />
              <span className="font-semibold text-yellow-100">{memoizedCurrency?.coins || 0}</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2 rounded-full shadow-lg">
              <Gem className="w-5 w-5 text-purple-200" />
              <span className="font-semibold text-purple-100">{memoizedCurrency?.gems || 0}</span>
          </div>
        </div>
      </div>

      {/* Tabs da Loja */}
              <Tabs defaultValue="special" className="w-full">
                                           <TabsList className="grid w-full grid-cols-9 bg-black/40 backdrop-blur-sm rounded-full border border-yellow-600/30 p-1">
             <TabsTrigger value="special" className="flex items-center justify-center gap-2 px-3 h-18 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-amber-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-full transition-all duration-300 hover:bg-white/10">
               <Star className="h-4 w-4" />
               Especiais
             </TabsTrigger>
             <TabsTrigger value="packs" className="flex items-center justify-center gap-2 px-3 h-18 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-amber-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-full transition-all duration-300 hover:bg-white/10">
               <Package className="h-4 w-4" />
               Packs
             </TabsTrigger>
             <TabsTrigger value="boosters" className="flex items-center justify-center gap-2 px-3 h-18 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-amber-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-full transition-all duration-300 hover:bg-white/10">
               <Zap className="h-4 w-4" />
               Boosters
             </TabsTrigger>
             <TabsTrigger value="daily" className="flex items-center justify-center gap-2 px-3 h-18 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-amber-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-full transition-all duration-300 hover:bg-white/10">
               <Star className="h-4 w-4" />
               Diárias
             </TabsTrigger>
             <TabsTrigger value="currency" className="flex items-center justify-center gap-2 px-3 h-18 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-amber-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-full transition-all duration-300 hover:bg-white/10">
               <Coins className="h-4 w-4" />
               Moedas
             </TabsTrigger>
             <TabsTrigger value="events" className="flex items-center justify-center gap-2 px-3 h-18 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-amber-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-full transition-all duration-300 hover:bg-white/10">
               <Zap className="h-4 w-4" />
               Eventos
             </TabsTrigger>
             <TabsTrigger value="customizations" className="flex items-center justify-center gap-2 px-3 h-18 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-amber-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-full transition-all duration-300 hover:bg-white/10">
               <Image className="h-4 w-4" />
               Campos
             </TabsTrigger>
             <TabsTrigger value="containers" className="flex items-center justify-center gap-2 px-3 h-18 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-amber-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-full transition-all duration-300 hover:bg-white/10">
               <Shield className="h-4 w-4" />
               Containers
             </TabsTrigger>
             <TabsTrigger value="history" className="flex items-center justify-center gap-2 px-3 h-18 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-amber-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-full transition-all duration-300 hover:bg-white/10">
               <History className="h-4 w-4" />
               Histórico
             </TabsTrigger>
           </TabsList>

        <TabsContent value="special" className="mt-6">
          <SpecialPacksDisplay
            packs={getSpecialPacks() as any}
            onPurchase={handlePurchase}
            purchasing={purchasing ? 'purchasing' : null}
            userCurrency={memoizedCurrency}
          />
        </TabsContent>

        <TabsContent value="packs" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getAvailablePacks().map(item => renderShopItem(item))}
          </div>
        </TabsContent>

        <TabsContent value="boosters" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getAvailableBoosters().map(item => renderShopItem(item))}
          </div>
        </TabsContent>

        <TabsContent value="daily" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dailyRotationCards?.map(card => (
                <DailyCardComponent
                  key={card.card_id}
                  card={card}
                  onPurchase={handlePurchaseCard}
                  purchasing={purchasing}
                  userCurrency={memoizedCurrency}
                />
              ))}
            </div>
        </TabsContent>

        <TabsContent value="currency" className="mt-6">
          {/* Pacotes (Gems + Coins) */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-yellow-400" />
              Pacotes (Gems + Coins)
              <Badge className="bg-gradient-to-r from-yellow-600 to-amber-700 text-white">
                Melhor Custo-Benefício
              </Badge>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getCurrencyPacks().map(item => renderShopItem(item))}
            </div>
          </div>

          {/* Gems */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Gem className="w-6 h-6 text-purple-400" />
              Gemas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getCurrencyGems().map(item => renderShopItem(item))}
            </div>
          </div>

          {/* Coins */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Coins className="w-6 h-6 text-yellow-400" />
              Moedas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getCurrencyCoins().map(item => renderShopItem(item))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {shopEvents?.map(event => (
                 <Card key={event.id} className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-yellow-600/30 hover:border-yellow-500/60 transition-all duration-300 group hover:shadow-xl">
                   <div className="p-6">
                     <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                       <Zap className="w-8 h-8 text-white" />
          </div>
                     <h3 className="text-xl font-bold text-white mb-2 text-center">{event.name}</h3>
                     <p className="text-gray-300 text-sm mb-4 text-center">{event.description}</p>
                     <Separator className="my-4 bg-yellow-600/30" />
                     <div className="flex items-center justify-center gap-2 mb-4">
                       <span className="text-sm text-gray-400">Desconto: {event.discount_percentage}%</span>
                    </div>
                     <Button 
                       onClick={() => handlePurchase(event.id)}
                       disabled={purchasing}
                       className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                     >
                       <ShoppingCart className="w-4 h-4 mr-2" />
                       {purchasing ? 'Comprando...' : 'Participar'}
                     </Button>
                  </div>
                </Card>
              ))}
            </div>
        </TabsContent>

        <TabsContent value="customizations" className="mt-6">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Image className="w-6 h-6 text-yellow-400" />
              Customizações de Campo de Batalha
              <Badge className="bg-gradient-to-r from-yellow-600 to-amber-700 text-white">
                Personalize seu campo
              </Badge>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {customizations?.map(customization => renderCustomization(customization))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="containers" className="mt-6">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              Customizações de Containers
              <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                Personalize seus containers
              </Badge>
            </h3>
            
            {/* Temporary Disabled Message */}
            <div className="text-center py-12">
              <Palette className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Funcionalidade Temporariamente Desabilitada</p>
              <p className="text-gray-500">As customizações de containers estão temporariamente indisponíveis</p>
            </div>

            {/* 
            // TEMPORARILY COMMENTED OUT - CONTAINER CUSTOMIZATIONS LOGIC
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {containerCustomizations?.map(customization => renderContainerCustomization(customization))}
            </div>
            */}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-yellow-600/30">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <History className="w-6 h-6 text-yellow-500" />
                  Histórico de Compras
                </h2>
                
                {(!purchases || purchases.length === 0) && (!cardPurchases || cardPurchases.length === 0) ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Nenhuma compra realizada ainda</p>
            </div>
                ) : (
              <div className="space-y-4">
                     {purchases?.map((purchase) => (
                       <div key={purchase.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-yellow-600/20">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center">
                             <Package className="w-5 h-5 text-white" />
                           </div>
                        <div>
                              <h3 className="text-white font-semibold">{purchase.item_name}</h3>
                              <p className="text-gray-400 text-sm">{new Date(purchase.purchased_at).toLocaleDateString()}</p>
                            </div>
                            </div>
                         <div className="flex items-center gap-2">
                           <Coins className="w-4 h-4 text-yellow-500" />
                           <span className="text-yellow-400 font-bold">{purchase.total_price_coins || 0}</span>
                        </div>
                      </div>
                     ))}
                     {cardPurchases?.map((purchase) => (
                       <div key={purchase.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-yellow-600/20">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                             <Star className="w-5 h-5 text-white" />
                        </div>
                           <div>
                             <h3 className="text-white font-semibold">Carta {purchase.card_id}</h3>
                             <p className="text-gray-400 text-sm">{new Date(purchase.purchased_at).toLocaleDateString()}</p>
              </div>
              </div>
                         <div className="flex items-center gap-2">
                           <Coins className="w-4 h-4 text-yellow-500" />
                           <span className="text-yellow-400 font-bold">{purchase.price_coins || 0}</span>
                      </div>
                          </div>
                     ))}
                          </div>
                        )}
              </div>
            </Card>
        </TabsContent>
      </Tabs>
        </div>
      
      <ToastContainer />
    </div>
  );
}; 
