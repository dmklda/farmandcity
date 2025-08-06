import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { AchievementService } from '../services/AchievementService';

export interface Card {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: string;
  rarity: string;
  effect: string;
  artworkUrl?: string;
  quantity: number;
}

export const usePlayerCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerCards = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('player_cards')
        .select(`
          *,
          card:cards(*)
        `)
        .eq('player_id', user.id);

      if (error) throw error;

      // Converter para o formato Card
      const convertedCards: Card[] = (data || []).map((playerCard: any) => ({
        id: playerCard.card.id,
        name: playerCard.card.name,
        description: playerCard.card.description,
        cost: playerCard.card.cost,
        type: playerCard.card.type,
        rarity: playerCard.card.rarity,
        effect: playerCard.card.effect,
        artworkUrl: playerCard.card.art_url,
        quantity: playerCard.quantity
      }));

      setCards(convertedCards);
    } catch (err: any) {
      console.error('Error fetching player cards:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCardToPlayer = useCallback(async (cardId: string, quantity: number = 1) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false, error: 'Usuário não autenticado' };

      // Verificar se o jogador já tem a carta
      const existingCard = cards.find(card => card.id === cardId);
      
      if (existingCard) {
        // Atualizar quantidade
        const { error } = await supabase
          .from('player_cards')
          .update({ quantity: existingCard.quantity + quantity })
          .eq('player_id', user.id)
          .eq('card_id', cardId);

        if (error) throw error;
      } else {
        // Adicionar nova carta
        const { error } = await supabase
          .from('player_cards')
          .insert({
            player_id: user.id,
            card_id: cardId,
            quantity: quantity
          });

        if (error) throw error;
      }

      // Recarregar cartas
      await fetchPlayerCards();

      // Verificar conquistas após adicionar carta
      await AchievementService.forceCheckAchievements(user.id);

      return { success: true };
    } catch (err: any) {
      console.error('Error adding card to player:', err);
      return { success: false, error: err.message };
    }
  }, [cards, fetchPlayerCards]);

  const removeCardFromPlayer = useCallback(async (cardId: string, quantity: number = 1) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false, error: 'Usuário não autenticado' };

      const existingCard = cards.find(card => card.id === cardId);
      if (!existingCard) {
        return { success: false, error: 'Carta não encontrada' };
      }

      if (existingCard.quantity <= quantity) {
        // Remover carta completamente
        const { error } = await supabase
          .from('player_cards')
          .delete()
          .eq('player_id', user.id)
          .eq('card_id', cardId);

        if (error) throw error;
      } else {
        // Reduzir quantidade
        const { error } = await supabase
          .from('player_cards')
          .update({ quantity: existingCard.quantity - quantity })
          .eq('player_id', user.id)
          .eq('card_id', cardId);

        if (error) throw error;
      }

      // Recarregar cartas
      await fetchPlayerCards();

      return { success: true };
    } catch (err: any) {
      console.error('Error removing card from player:', err);
      return { success: false, error: err.message };
    }
  }, [cards, fetchPlayerCards]);

  const getCardQuantity = useCallback((cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    return card?.quantity || 0;
  }, [cards]);

  const hasCard = useCallback((cardId: string) => {
    return cards.some(card => card.id === cardId && card.quantity > 0);
  }, [cards]);

  const stableRefreshPlayerCards = useCallback(async () => {
    await fetchPlayerCards();
  }, [fetchPlayerCards]);

  useEffect(() => {
    fetchPlayerCards();
  }, [fetchPlayerCards]);

  return {
    cards,
    loading,
    error,
    addCardToPlayer,
    removeCardFromPlayer,
    getCardQuantity,
    hasCard,
    refreshPlayerCards: fetchPlayerCards,
    stableRefreshPlayerCards
  };
};