import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useShop } from '../hooks/useShop';
import { useAppContext } from '../contexts/AppContext';
import { ShoppingCart, Coins, Gem, Package, Zap, Star } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from './ui/toast';
import { SpecialPacksDisplay } from './SpecialPacksDisplay';
import { getRarityIconPNG } from './IconComponentsPNG';

export const Shop: React.FC = () => {
  console.log('Shop component montado/remontado - timestamp:', new Date().toISOString());
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
    fetchShopItems,
    testFetchPurchases
  } = useShop();
  const { currency, currencyLoading, refreshCurrency } = useAppContext();
  const { showToast, ToastContainer } = useToast();
  
  console.log('Shop: currency do contexto:', currency, 'loading:', currencyLoading);
  
  // Log específico para detectar mudanças no currency
  useEffect(() => {
    console.log('Shop: currency mudou para:', currency);
  }, [currency]);

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
        console.log('Usuário autenticado:', user);
      } else {
        setAuthStatus('Não autenticado');
        console.log('Usuário não autenticado');
      }
    } catch (err) {
      setAuthStatus('Erro na autenticação');
      console.error('Erro na autenticação:', err);
    }
  };

  console.log('Shop component render:', { 
    shopItems: shopItems?.length, 
    purchases: purchases?.length,
    purchasesData: purchases,
    loading, 
    error, 
    currencyLoading,
    currency,
    authStatus
  });

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

  const handleReload = async () => {
    console.log('Recarregando loja...');
    await fetchShopItems();
  };

  const testDirectQuery = async () => {
    try {
      console.log('Testando query direta...');
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('is_active', true)
        .limit(1);
      
      console.log('Resultado da query direta:', { data, error });
      showToast(`Query direta: ${data?.length || 0} itens encontrados`, 'info');
    } catch (err) {
      console.error('Erro na query direta:', err);
      showToast(`Erro na query: ${err}`, 'error');
    }
  };

  const testRefreshCurrency = async () => {
    try {
      console.log('Testando refresh manual de moedas...');
      await refreshCurrency();
      console.log('Refresh manual concluído');
      showToast('Refresh manual de moedas executado!', 'success');
    } catch (err) {
      console.error('Erro no refresh manual:', err);
      showToast(`Erro no refresh: ${err}`, 'error');
    }
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'ultra': return 'bg-purple-500';
      case 'secret': return 'bg-yellow-500';
      case 'legendary': return 'bg-orange-500';
      case 'crisis': return 'bg-red-500';
      case 'booster': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityIconComponent = (rarity?: string) => {
    if (!rarity) return null;
    return getRarityIconPNG(rarity, 16);
  };

  const renderShopItem = (item: any) => (
    <Card key={item.id} className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getRarityIconComponent(item.rarity)}
          <h3 className="font-semibold text-lg">{item.name}</h3>
        </div>
        {item.rarity && (
          <Badge className={getRarityColor(item.rarity)}>
            {item.rarity.toUpperCase()}
          </Badge>
        )}
      </div>
      
      <p className="text-gray-600 mb-4">{item.description}</p>
      
      <div className="flex items-center gap-2 mb-4">
        {item.price_coins > 0 && (
          <div className="flex items-center gap-1 text-yellow-600">
            <Coins className="h-4 w-4" />
            <span>{item.price_coins}</span>
          </div>
        )}
        {item.price_gems > 0 && (
          <div className="flex items-center gap-1 text-purple-600">
            <Gem className="h-4 w-4" />
            <span>{item.price_gems}</span>
          </div>
        )}
      </div>

      {item.is_limited && item.stock_quantity && (
        <div className="text-sm text-gray-500 mb-3">
          Estoque: {item.stock_quantity - item.sold_quantity}/{item.stock_quantity}
        </div>
      )}

      <Button 
        onClick={() => handlePurchase(item.id)}
        disabled={purchasing || (item.is_limited && item.stock_quantity && item.sold_quantity >= item.stock_quantity)}
        className="w-full"
      >
        {purchasing ? 'Comprando...' : 'Comprar'}
      </Button>
    </Card>
  );

  // Mostrar loading se qualquer um dos hooks estiver carregando
  if (loading || currencyLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg">
          {loading ? 'Carregando loja...' : 'Carregando moeda...'}
        </div>
        <div className="text-sm text-gray-500">
          Status: {authStatus}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleReload} variant="outline">
            Recarregar
          </Button>
          <Button onClick={testDirectQuery} variant="outline">
            Testar Query
          </Button>
          <Button onClick={() => {
            console.log('Forçando busca de compras...');
            fetchShopItems();
          }} variant="outline">
            Buscar Compras
          </Button>
          <Button onClick={() => {
            console.log('Testando fetchPurchases...');
            testFetchPurchases();
          }} variant="outline">
            Testar Fetch
          </Button>
        </div>
      </div>
    );
  }

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-red-600">
          Erro ao carregar loja: {error}
        </div>
        <div className="text-sm text-gray-500">
          Status: {authStatus}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleReload} variant="outline">
            Tentar Novamente
          </Button>
          <Button onClick={testDirectQuery} variant="outline">
            Testar Query
          </Button>
        </div>
      </div>
    );
  }

  // Se não há itens, mostrar mensagem
  if (!shopItems || shopItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-gray-600">
          Nenhum item disponível na loja
        </div>
        <div className="text-sm text-gray-500">
          Status: {authStatus}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleReload} variant="outline">
            Recarregar
          </Button>
          <Button onClick={testDirectQuery} variant="outline">
            Testar Query
          </Button>
          <Button onClick={testRefreshCurrency} variant="outline">
            Testar Refresh Moedas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header da Loja */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🏪 Loja de Cartas</h1>
            <p className="text-blue-100">Compre packs, boosters e muito mais!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-yellow-500/20 rounded-lg px-3 py-2">
              <Coins className="h-5 w-5 text-yellow-300" />
              <span className="font-semibold">{memoizedCurrency?.coins || 0}</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-500/20 rounded-lg px-3 py-2">
              <Gem className="h-5 w-5 text-purple-300" />
              <span className="font-semibold">{memoizedCurrency?.gems || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs da Loja */}
              <Tabs defaultValue="special" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="special" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Especiais
          </TabsTrigger>
          <TabsTrigger value="packs" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Packs
          </TabsTrigger>
          <TabsTrigger value="boosters" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Boosters
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Diárias
          </TabsTrigger>
          <TabsTrigger value="currency" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Moedas
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Eventos
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="special" className="mt-6">
          <SpecialPacksDisplay
            packs={shopItems.filter(item =>
              item.item_type === 'pack' || item.item_type === 'booster'
            ) as any}
            onPurchase={handlePurchase}
            purchasing={purchasing ? 'purchasing' : null}
            userCurrency={memoizedCurrency}
          />
        </TabsContent>

        <TabsContent value="packs" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getAvailablePacks().map(renderShopItem)}
          </div>
        </TabsContent>

        <TabsContent value="boosters" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getAvailableBoosters().map(renderShopItem)}
          </div>
        </TabsContent>

        <TabsContent value="daily" className="mt-6">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 mb-6 text-white">
            <h2 className="text-2xl font-bold mb-2">🎯 Cartas em Rotação Diária</h2>
            <p className="text-purple-100">Novas cartas todos os dias! Volte amanhã para ver novas ofertas.</p>
          </div>
          
          {dailyRotationCards && dailyRotationCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailyRotationCards.map((card) => (
                <Card key={card.card_id} className="p-4 hover:shadow-lg transition-shadow border-2 border-purple-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getRarityIconComponent(card.card_rarity)}
                      <h3 className="font-semibold text-lg">{card.card_name}</h3>
                    </div>
                    <Badge className={getRarityColor(card.card_rarity)}>
                      {card.card_rarity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4">Tipo: {card.card_type}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {card.price_coins > 0 && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Coins className="h-4 w-4" />
                        <span>{card.price_coins}</span>
                      </div>
                    )}
                    {card.price_gems > 0 && (
                      <div className="flex items-center gap-1 text-purple-600">
                        <Gem className="h-4 w-4" />
                        <span>{card.price_gems}</span>
                      </div>
                    )}
                  </div>

                  {card.discount_percentage > 0 && (
                    <div className="text-sm text-green-600 mb-3">
                      Desconto: {card.discount_percentage}%
                    </div>
                  )}

                  <Button 
                    onClick={() => handlePurchaseCard(card.card_id)}
                    disabled={purchasing}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {purchasing ? 'Comprando...' : 'Comprar Carta'}
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma carta em rotação hoje</p>
              <p className="text-sm text-gray-500">Volte amanhã para novas ofertas!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="currency" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getAvailableCurrency().map(renderShopItem)}
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 mb-6 text-white">
            <h2 className="text-2xl font-bold mb-2">🎉 Eventos Especiais</h2>
            <p className="text-orange-100">Aproveite os descontos e ofertas especiais!</p>
          </div>
          
          {shopEvents && shopEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shopEvents.map((event) => (
                <Card key={event.id} className="p-4 hover:shadow-lg transition-shadow border-2 border-orange-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <h3 className="font-semibold text-lg">{event.name}</h3>
                    </div>
                    <Badge className="bg-orange-500">
                      {event.event_type.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Início: {new Date(event.start_date).toLocaleDateString('pt-BR')}</p>
                    <p>Fim: {new Date(event.end_date).toLocaleDateString('pt-BR')}</p>
                  </div>

                  {event.discount_percentage > 0 && (
                    <div className="text-lg font-bold text-green-600 mb-3">
                      Desconto: {event.discount_percentage}%
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Evento ativo
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum evento ativo no momento</p>
              <p className="text-sm text-gray-500">Fique atento aos próximos eventos!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Histórico de Compras</h3>
            
            {/* Debug info */}
            <div className="mb-4 p-3 bg-blue-100 rounded text-sm">
              <p><strong>Debug Info:</strong></p>
              <p>Purchases length: {purchases?.length || 0}</p>
              <p>Loading: {loading ? 'true' : 'false'}</p>
              <p>Error: {error || 'none'}</p>
              <p>Auth Status: {authStatus}</p>
            </div>
            
            {purchases && purchases.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold mb-3">Compras de Itens ({purchases.length})</h4>
                {purchases.map((purchase) => {
                  const item = shopItems.find(i => i.id === purchase.item_id);
                  return (
                    <Card key={purchase.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">
                            {item ? item.name : `Item ${purchase.item_id}`}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Quantidade: {purchase.quantity}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(purchase.purchased_at).toLocaleString('pt-BR')}
                          </p>
                          <p className="text-xs text-gray-400">
                            ID: {purchase.id}
                          </p>
                        </div>
                        <div className="text-right">
                          {purchase.total_price_coins > 0 && (
                            <div className="flex items-center gap-1 text-yellow-600">
                              <Coins className="h-4 w-4" />
                              <span>{purchase.total_price_coins}</span>
                            </div>
                          )}
                          {purchase.total_price_gems > 0 && (
                            <div className="flex items-center gap-1 text-purple-600">
                              <Gem className="h-4 w-4" />
                              <span>{purchase.total_price_gems}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {purchase.items_received && Object.keys(purchase.items_received).length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-600">
                            Recebido: {JSON.stringify(purchase.items_received)}
                          </p>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma compra encontrada</p>
                <p className="text-sm text-gray-500">Debug: purchases array is {purchases ? 'defined' : 'undefined'} with length {purchases?.length || 0}</p>
              </div>
            )}

            {cardPurchases && cardPurchases.length > 0 ? (
              <div className="space-y-4 mt-6">
                <h4 className="text-lg font-semibold mb-3">Compras de Cartas Individuais</h4>
                {cardPurchases.map((purchase) => (
                  <Card key={purchase.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">
                          Carta ID: {purchase.card_id}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {new Date(purchase.purchased_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        {purchase.price_coins > 0 && (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Coins className="h-4 w-4" />
                            <span>{purchase.price_coins}</span>
                          </div>
                        )}
                        {purchase.price_gems > 0 && (
                          <div className="flex items-center gap-1 text-purple-600">
                            <Gem className="h-4 w-4" />
                            <span>{purchase.price_gems}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : null}

            {/* Seção removida - já tratada acima */}
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Container de Toasts */}
      <ToastContainer />
    </div>
  );
}; 