import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Card } from '../types/card';
import { usePlayerCards } from './usePlayerCards';

interface PlayerDeck {
  id: string;
  name: string;
  card_ids: string[];
  is_active: boolean;
  created_at: string;
}

const DECK_LIMIT = 28;

export const usePlayerDecks = () => {
  const [decks, setDecks] = useState<PlayerDeck[]>([]);
  const [activeDeck, setActiveDeck] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { playerCards } = usePlayerCards();

  useEffect(() => {
    fetchPlayerDecks();
  }, []);

  useEffect(() => {
    if (playerCards.length > 0) {
      createBasicDeckIfNeeded();
    }
  }, [playerCards]);

  const fetchPlayerDecks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: decksError } = await supabase
        .from('player_decks')
        .select('*')
        .eq('player_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });

      if (decksError) throw decksError;

      setDecks(data || []);
    } catch (err: any) {
      console.error('Error fetching player decks:', err);
      setError(err.message || 'Erro ao carregar decks do jogador');
    } finally {
      setLoading(false);
    }
  };

  const createBasicDeckIfNeeded = async () => {
    if (decks.length === 0 && playerCards.length > 0) {
      // Criar deck básico automaticamente
      const basicDeckCards = playerCards.slice(0, DECK_LIMIT);
      await createDeck('Deck Básico', basicDeckCards);
    }
  };

  const createDeck = async (name: string, cards: Card[]) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Usuário não autenticado');

      const cardIds = cards.map(card => card.id.split('_')[0]); // Remove suffix da cópia

      const { data, error } = await supabase
        .from('player_decks')
        .insert({
          player_id: user.id,
          name,
          card_ids: cardIds.slice(0, DECK_LIMIT),
          is_active: decks.length === 0, // Primeiro deck é ativo
        })
        .select()
        .single();

      if (error) throw error;

      await fetchPlayerDecks();
      return data;
    } catch (err: any) {
      console.error('Error creating deck:', err);
      setError(err.message || 'Erro ao criar deck');
    }
  };

  const loadDeck = async (deckId: string) => {
    try {
      const deck = decks.find(d => d.id === deckId);
      if (!deck) throw new Error('Deck não encontrado');

      // Construir cartas do deck baseado nas cartas do jogador
      const deckCards: Card[] = [];
      deck.card_ids.forEach(cardId => {
        const playerCard = playerCards.find(pc => pc.id.startsWith(cardId));
        if (playerCard) {
          deckCards.push(playerCard);
        }
      });

      setActiveDeck(deckCards.slice(0, DECK_LIMIT));

      // Marcar deck como ativo
      await supabase
        .from('player_decks')
        .update({ is_active: false })
        .eq('player_id', (await supabase.auth.getUser()).data.user?.id);

      await supabase
        .from('player_decks')
        .update({ is_active: true })
        .eq('id', deckId);

      await fetchPlayerDecks();
    } catch (err: any) {
      console.error('Error loading deck:', err);
      setError(err.message || 'Erro ao carregar deck');
    }
  };

  const getActiveDeck = (): Card[] => {
    const activeDeckData = decks.find(d => d.is_active);
    if (!activeDeckData || playerCards.length === 0) {
      return [];
    }

    // Construir cartas do deck ativo
    const deckCards: Card[] = [];
    activeDeckData.card_ids.forEach(cardId => {
      const playerCard = playerCards.find(pc => pc.id.startsWith(cardId));
      if (playerCard) {
        deckCards.push(playerCard);
      }
    });

    return deckCards.slice(0, DECK_LIMIT);
  };

  return {
    decks,
    activeDeck: getActiveDeck(),
    loading,
    error,
    createDeck,
    loadDeck,
    refetch: fetchPlayerDecks,
  };
};