import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAppContext } from '../contexts/AppContext';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  item_type: 'pack' | 'booster' | 'card' | 'currency' | 'cosmetic' | 'event';
  price_coins: number;
  price_gems: number;
  currency_type: 'coins' | 'gems' | 'both';
  rarity?: string;
  card_ids?: string[];
  guaranteed_cards?: any;
  is_limited: boolean;
  stock_quantity?: number;
  sold_quantity: number;
  is_active: boolean;
  discount_percentage: number;
  is_daily_rotation: boolean;
  rotation_date?: string;
  event_id?: string;
  created_at: string;
  updated_at: string;
}

interface DailyRotationCard {
  card_id: string;
  card_name: string;
  card_type: string;
  card_rarity: string;
  price_coins: number;
  price_gems: number;
  currency_type: string;
  discount_percentage: number;
}

interface ShopEvent {
  id: string;
  name: string;
  description: string;
  event_type: 'sale' | 'limited' | 'exclusive' | 'seasonal';
  start_date: string;
  end_date: string;
  discount_percentage: number;
  is_active: boolean;
}

interface ShopPurchase {
  id: string;
  player_id: string;
  item_id: string;
  item_type: string;
  quantity: number;
  total_price_coins: number;
  total_price_gems: number;
  items_received: any;
  event_id?: string;
  purchased_at: string;
}

interface CardPurchase {
  id: string;
  player_id: string;
  card_id: string;
  price_coins: number;
  price_gems: number;
  currency_type: string;
  discount_percentage: number;
  event_id?: string;
  purchased_at: string;
}

export const useShop = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [dailyRotationCards, setDailyRotationCards] = useState<DailyRotationCard[]>([]);
  const [shopEvents, setShopEvents] = useState<ShopEvent[]>([]);
  const [purchases, setPurchases] = useState<ShopPurchase[]>([]);
  const [cardPurchases, setCardPurchases] = useState<CardPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    currency, 
    refreshCurrency, 
    refreshPlayerCards,
    spendCoins,
    spendGems,
    addCoins,
    addGems,
    addCardToPlayer
  } = useAppContext();

  // Criar versões estáveis das funções de refresh
  const stableRefreshCurrency = useCallback(async () => {
    console.log('useShop: chamando refreshCurrency...');
    await refreshCurrency();
    console.log('useShop: refreshCurrency concluído');
  }, [refreshCurrency]);

  const stableRefreshPlayerCards = useCallback(async () => {
    console.log('useShop: chamando refreshPlayerCards...');
    await refreshPlayerCards();
    console.log('useShop: refreshPlayerCards concluído');
  }, [refreshPlayerCards]);

  useEffect(() => {
    console.log('useShop useEffect executando...');
    fetchShopItems();
    fetchDailyRotationCards();
    fetchShopEvents();
    fetchPurchases();
    fetchCardPurchases();
  }, []);

  // Adicionar função para testar busca de compras
  const testFetchPurchases = async () => {
    console.log('Testando fetchPurchases...');
    await fetchPurchases();
  };

  const fetchShopItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando busca de itens da loja...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('Usuário não autenticado');
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }
      
      console.log('Usuário autenticado:', user.id);
      
      // Buscar da nova tabela shop_items
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }
      
      console.log('Dados recebidos do Supabase:', data);
      
              const mappedItems: ShopItem[] = (data || []).map(item => {
          console.log('Mapeando item:', item);
          return {
            id: item.id,
            name: item.name,
            description: item.description || '',
            item_type: item.item_type as 'pack' | 'booster' | 'card' | 'currency' | 'cosmetic' | 'event',
            rarity: item.rarity || 'common',
            currency_type: item.currency_type as 'coins' | 'gems' | 'both',
            price_coins: item.price_coins || 0,
            price_gems: item.price_gems || 0,
            is_limited: item.is_limited || false,
            stock_quantity: item.stock_quantity || 0,
            sold_quantity: item.sold_quantity || 0,
            is_active: item.is_active || false,
            card_ids: item.card_ids || [],
            guaranteed_cards: item.guaranteed_cards || {},
            discount_percentage: item.discount_percentage || 0,
            is_daily_rotation: item.is_daily_rotation || false,
            rotation_date: item.rotation_date || undefined,
            event_id: item.event_id || undefined,
            created_at: item.created_at || new Date().toISOString(),
            updated_at: item.updated_at || new Date().toISOString()
          };
        });

      console.log('Itens mapeados:', mappedItems);
      setShopItems(mappedItems);
    } catch (err: any) {
      console.error('Erro ao buscar itens da loja:', err);
      setError(err.message);
    } finally {
      console.log('Finalizando carregamento da loja');
      setLoading(false);
    }
  };

  const fetchDailyRotationCards = async () => {
    try {
      console.log('Buscando cartas em rotação diária...');
      const { data, error } = await supabase
        .rpc('get_daily_rotation_cards', { p_date: new Date().toISOString().split('T')[0] });

      if (error) {
        console.error('Erro ao buscar cartas em rotação:', error);
        return;
      }

      console.log('Cartas em rotação encontradas:', data);
      setDailyRotationCards(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar cartas em rotação:', err);
    }
  };

  const fetchShopEvents = async () => {
    try {
      console.log('Buscando eventos da loja...');
      const { data, error } = await supabase
        .rpc('get_active_shop_events');

      if (error) {
        console.error('Erro ao buscar eventos:', error);
        return;
      }

      console.log('Eventos encontrados:', data);
      const mappedEvents: ShopEvent[] = (data || []).map(event => ({
        id: event.id,
        name: event.name,
        description: event.description,
        event_type: event.event_type as 'sale' | 'limited' | 'exclusive' | 'seasonal',
        start_date: new Date().toISOString(), // Valor padrão
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Valor padrão
        discount_percentage: event.discount_percentage,
        is_active: true // Valor padrão
      }));
      setShopEvents(mappedEvents);
    } catch (err: any) {
      console.error('Erro ao buscar eventos:', err);
    }
  };

  const fetchPurchases = async () => {
    try {
      console.log('Iniciando busca de histórico de compras...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('Usuário não autenticado para buscar compras');
        return;
      }

      console.log('Buscando compras para usuário:', user.id);

      // Buscar tanto da tabela shop_purchases quanto pack_purchases
      const [shopPurchasesResult, packPurchasesResult] = await Promise.all([
        supabase
          .from('shop_purchases')
          .select('*')
          .eq('player_id', user.id)
          .order('purchased_at', { ascending: false }),
        supabase
          .from('pack_purchases')
          .select(`
            *,
            booster_packs (
              name,
              price_coins
            )
          `)
          .eq('user_id', user.id)
          .order('purchased_at', { ascending: false })
      ]);

      if (shopPurchasesResult.error) {
        console.error('Erro do Supabase ao buscar shop_purchases:', shopPurchasesResult.error);
      }
      
      if (packPurchasesResult.error) {
        console.error('Erro do Supabase ao buscar pack_purchases:', packPurchasesResult.error);
      }
      
      console.log('Dados de shop_purchases recebidos:', shopPurchasesResult.data);
      console.log('Dados de pack_purchases recebidos:', packPurchasesResult.data);
      
      // Mapear compras da nova tabela shop_purchases
      const shopPurchases: ShopPurchase[] = (shopPurchasesResult.data || []).map(purchase => ({
        id: purchase.id,
        item_id: purchase.item_id || '',
        item_type: purchase.item_type,
        player_id: purchase.player_id || '',
        quantity: purchase.quantity || 1,
        total_price_coins: purchase.total_price_coins || 0,
        total_price_gems: purchase.total_price_gems || 0,
        items_received: purchase.items_received || {},
        event_id: purchase.event_id || undefined,
        purchased_at: purchase.purchased_at || new Date().toISOString()
      }));

      // Mapear compras da tabela antiga pack_purchases
      const packPurchases: ShopPurchase[] = (packPurchasesResult.data || []).map(purchase => ({
        id: purchase.id,
        item_id: purchase.pack_id || 'unknown',
        item_type: 'pack',
        player_id: purchase.user_id || '',
        quantity: 1,
        total_price_coins: purchase.booster_packs?.price_coins || 0,
        total_price_gems: 0,
        items_received: purchase.cards_received || {},
        event_id: undefined,
        purchased_at: purchase.purchased_at || new Date().toISOString()
      }));

      // Combinar ambas as listas
      const allPurchases = [...shopPurchases, ...packPurchases];
      
      console.log('Todas as compras mapeadas:', allPurchases);
      console.log('Shop purchases count:', shopPurchases.length);
      console.log('Pack purchases count:', packPurchases.length);
      console.log('Total purchases count:', allPurchases.length);
      setPurchases(allPurchases);
    } catch (err: any) {
      console.error('Erro ao buscar histórico de compras:', err);
    }
  };

  const fetchCardPurchases = async () => {
    try {
      console.log('Buscando compras de cartas individuais...');
      // Temporariamente desabilitado até as tabelas serem criadas
      console.log('Função temporariamente desabilitada');
      setCardPurchases([]);
    } catch (err: any) {
      console.error('Erro ao buscar compras de cartas:', err);
    }
  };

  const purchaseItem = async (itemId: string, quantity: number = 1) => {
    try {
      console.log('Iniciando compra de item:', { itemId, quantity });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const item = shopItems.find(i => i.id === itemId);
      console.log('Item encontrado:', item);
      if (!item) throw new Error('Item não encontrado');
      
      // Verificar se o item existe na tabela shop_items
      const { data: itemCheck, error: itemCheckError } = await supabase
        .from('shop_items')
        .select('id, name, item_type')
        .eq('id', itemId)
        .single();
        
      if (itemCheckError || !itemCheck) {
        console.error('Item não encontrado na tabela shop_items:', itemId);
        throw new Error('Item não encontrado no banco de dados');
      }
      
      console.log('Item verificado no banco:', itemCheck);

      // Se for pack ou booster, usar a nova função purchase_pack
      if (itemCheck.item_type === 'pack' || itemCheck.item_type === 'booster') {
        console.log('Usando função purchase_pack para pack/booster');
        
        const { data: purchaseResult, error: purchaseError } = await supabase
          .rpc('purchase_pack', { pack_id: itemId });

        if (purchaseError) {
          console.error('Erro ao comprar pack:', purchaseError);
          throw purchaseError;
        }

        console.log('Resultado da compra do pack:', purchaseResult);
        
        // Atualizar moedas/gems no estado local
        if (purchaseResult && typeof purchaseResult === 'object' && 'remaining_coins' in purchaseResult) {
          console.log('Atualizando estado após compra de pack...');
          
          try {
            console.log('Executando refreshCurrency...');
            await stableRefreshCurrency();
            console.log('Executando refreshPlayerCards...');
            await stableRefreshPlayerCards();
            console.log('Atualizações concluídas');
          } catch (error) {
            console.error('Erro ao atualizar estado:', error);
          }
        }
        
        await fetchShopItems();
        await fetchPurchases();
        
        return purchaseResult && typeof purchaseResult === 'object' && 'cards_received' in purchaseResult 
          ? purchaseResult.cards_received 
          : null;
      }

      // Para outros tipos de item, usar o processo antigo
      const totalPriceCoins = (item.price_coins || 0) * quantity;
      const totalPriceGems = (item.price_gems || 0) * quantity;

      // Verificar se o jogador tem moedas/gems suficientes
      if (item.currency_type === 'coins' && currency && (currency.coins || 0) < totalPriceCoins) {
        throw new Error('Moedas insuficientes');
      }
      if (item.currency_type === 'gems' && currency && (currency.gems || 0) < totalPriceGems) {
        throw new Error('Gems insuficientes');
      }

      // Verificar se há estoque suficiente
      if (item.is_limited && item.stock_quantity && (item.sold_quantity || 0) + quantity > item.stock_quantity) {
        throw new Error('Estoque insuficiente');
      }

      // Processar a compra
      const itemsReceived = await processItemPurchase(item, quantity);

      // Deduzir moedas/gems
      if (totalPriceCoins > 0) {
        await spendCoins(totalPriceCoins);
      }
      if (totalPriceGems > 0) {
        await spendGems(totalPriceGems);
      }
      
      // Atualizar moedas e cartas no estado local
      console.log('Atualizando estado após compra de outros itens...');
      
      try {
        console.log('Executando refreshCurrency...');
        await stableRefreshCurrency();
        console.log('Executando refreshPlayerCards...');
        await stableRefreshPlayerCards();
        console.log('Atualizações concluídas');
      } catch (error) {
        console.error('Erro ao atualizar estado:', error);
      }

      // Registrar a compra
      const purchaseData = {
        player_id: user.id,
        item_id: itemId,
        item_type: item.item_type,
        quantity,
        total_price_coins: totalPriceCoins,
        total_price_gems: totalPriceGems,
        items_received: itemsReceived,
        event_id: item.event_id,
        purchased_at: new Date().toISOString()
      };
      
      console.log('Dados da compra a serem inseridos:', purchaseData);
      
      const { error: purchaseError } = await supabase
        .from('shop_purchases')
        .insert(purchaseData);

      if (purchaseError) {
        console.error('Erro ao inserir compra:', purchaseError);
        throw purchaseError;
      }

      // Atualizar estoque se necessário
      if (item.is_limited && item.stock_quantity) {
        const { error: stockError } = await supabase
          .from('shop_items')
          .update({ sold_quantity: (item.sold_quantity || 0) + quantity })
          .eq('id', itemId);

        if (stockError) throw stockError;
      }

      await fetchShopItems();
      await fetchPurchases();

      return itemsReceived;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const purchaseCard = async (cardId: string) => {
    try {
      console.log('Compra de carta individual temporariamente desabilitada');
      throw new Error('Funcionalidade temporariamente indisponível');
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const processItemPurchase = async (item: ShopItem, quantity: number) => {
    const itemsReceived: any = {};

    switch (item.item_type) {
      case 'pack':
      case 'booster':
        if (item.card_ids && item.card_ids.length > 0) {
          const receivedCards = [];
          
          for (let i = 0; i < quantity; i++) {
            // Selecionar cartas aleatórias do pack
            const selectedCards = selectRandomCards(item.card_ids, 3); // 3 cartas por pack
            
            for (const cardId of selectedCards) {
              await addCardToPlayer(cardId, 1);
              receivedCards.push(cardId);
            }
          }
          
          itemsReceived.cards = receivedCards;
        }
        break;

      case 'currency':
        if (item.name.includes('Moedas')) {
          const coinAmount = extractCoinAmount(item.name) * quantity;
          await addCoins(coinAmount);
          itemsReceived.coins = coinAmount;
        } else if (item.name.includes('Gems')) {
          const gemAmount = extractGemAmount(item.name) * quantity;
          await addGems(gemAmount);
          itemsReceived.gems = gemAmount;
        }
        break;

      case 'card':
        if (item.card_ids && item.card_ids.length > 0) {
          const receivedCards = [];
          for (const cardId of item.card_ids) {
            await addCardToPlayer(cardId, quantity);
            receivedCards.push(cardId);
          }
          itemsReceived.cards = receivedCards;
        }
        break;
    }

    return itemsReceived;
  };

  const selectRandomCards = (cardIds: string[], count: number): string[] => {
    const shuffled = [...cardIds].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, cardIds.length));
  };

  const extractCoinAmount = (name: string): number => {
    const match = name.match(/(\d+)\s*moedas?/i);
    return match ? parseInt(match[1]) : 0;
  };

  const extractGemAmount = (name: string): number => {
    const match = name.match(/(\d+)\s*gems?/i);
    return match ? parseInt(match[1]) : 0;
  };

  const getItemsByType = (type: string) => {
    return shopItems.filter(item => item.item_type === type);
  };

  const getAvailablePacks = () => getItemsByType('pack');
  const getAvailableBoosters = () => getItemsByType('booster');
  const getAvailableCurrency = () => getItemsByType('currency');

  console.log('useShop return:', { 
    shopItems: shopItems?.length, 
    dailyRotationCards: dailyRotationCards?.length,
    shopEvents: shopEvents?.length,
    purchases: purchases?.length,
    cardPurchases: cardPurchases?.length,
    loading, 
    error 
  });

  return {
    shopItems,
    dailyRotationCards,
    shopEvents,
    purchases,
    cardPurchases,
    loading,
    error,
    purchaseItem,
    purchaseCard,
    fetchShopItems,
    fetchDailyRotationCards,
    testFetchPurchases,
    getAvailablePacks,
    getAvailableBoosters,
    getAvailableCurrency
  };
}; 