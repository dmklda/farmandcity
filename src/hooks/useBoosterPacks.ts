import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Card } from '../types/card';

interface BoosterPack {
  id: string;
  name: string;
  description?: string;
  price_coins: number;
  cards_count: number;
  guaranteed_rarity?: string;
  is_active: boolean;
  created_at: string;
}

interface PackPurchase {
  id: string;
  user_id: string;
  pack_id: string;
  cards_received: any;
  purchased_at: string;
}

export const useBoosterPacks = () => {
  const [boosterPacks, setBoosterPacks] = useState<BoosterPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBoosterPacks();
  }, []);

  const fetchBoosterPacks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('booster_packs')
        .select('*')
        .eq('is_active', true)
        .order('price_coins', { ascending: true });

      if (error) throw error;

      // Converter dados do Supabase para o formato esperado
      const convertedPacks = (data || []).map(pack => ({
        id: pack.id,
        name: pack.name,
        description: pack.description || undefined,
        price_coins: pack.price_coins,
        cards_count: pack.cards_count || 0,
        guaranteed_rarity: pack.guaranteed_rarity || undefined,
        is_active: pack.is_active || false,
        created_at: pack.created_at || new Date().toISOString()
      }));
      
      setBoosterPacks(convertedPacks);
    } catch (err: any) {
      console.error('Error fetching booster packs:', err);
      setError(err.message || 'Erro ao carregar booster packs');
    } finally {
      setLoading(false);
    }
  };

  const purchaseBoosterPack = async (packId: string) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) throw new Error('Usuário não autenticado');

      // Buscar informações do pack
      const { data: pack, error: packError } = await supabase
        .from('booster_packs')
        .select('*')
        .eq('id', packId)
        .single();

      if (packError) throw packError;
      if (!pack) throw new Error('Pack não encontrado');

      // TODO: Verificar se usuário tem moedas suficientes
      // TODO: Deduzir moedas do usuário

      // Gerar cartas aleatórias baseado na raridade garantida
      const { data: cards, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('is_active', true)
        .not('is_starter', 'eq', true); // Não incluir cartas starter

      if (cardsError) throw cardsError;

      // Filtrar por raridade garantida se especificada
      let availableCards = cards || [];
      if (pack.guaranteed_rarity) {
        availableCards = availableCards.filter(card => 
          card.rarity === pack.guaranteed_rarity
        );
      }

      // Selecionar cartas aleatórias
      const selectedCards = [];
      for (let i = 0; i < (pack.cards_count || 0); i++) {
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const card = availableCards[randomIndex];
        selectedCards.push(card);
        availableCards.splice(randomIndex, 1); // Remover carta selecionada
      }

      // Registrar compra
      const { data: purchase, error: purchaseError } = await supabase
        .from('pack_purchases')
        .insert({
          user_id: user.data.user.id,
          pack_id: packId,
          cards_received: selectedCards
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Adicionar cartas ao inventário do usuário
      for (const card of selectedCards) {
        const { error: addCardError } = await supabase
          .from('player_cards')
          .upsert({
            player_id: user.data.user.id,
            card_id: card.id,
            quantity: 1
          }, {
            onConflict: 'player_id,card_id'
          });

        if (addCardError) {
          console.error('Error adding card to inventory:', addCardError);
        }
      }

      return {
        success: true,
        purchase,
        cards: selectedCards
      };
    } catch (err: any) {
      console.error('Error purchasing booster pack:', err);
      throw err;
    }
  };

  const getPurchaseHistory = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('pack_purchases')
        .select(`
          *,
          booster_packs (
            name,
            price_coins
          )
        `)
        .eq('user_id', user.data.user.id)
        .order('purchased_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (err: any) {
      console.error('Error fetching purchase history:', err);
      throw err;
    }
  };

  return {
    boosterPacks,
    loading,
    error,
    purchaseBoosterPack,
    getPurchaseHistory,
    refetch: fetchBoosterPacks,
  };
}; 