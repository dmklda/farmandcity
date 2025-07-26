import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Card } from '../types/card';

interface PlayerDeck {
  id: string;
  player_id: string;
  name: string;
  card_ids: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DeckWithCards extends PlayerDeck {
  cards: Card[];
}

export const usePlayerDecks = () => {
  const [decks, setDecks] = useState<DeckWithCards[]>([]);
  const [activeDeck, setActiveDeck] = useState<DeckWithCards | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayerDecks();
  }, []);

  const fetchPlayerDecks = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) throw new Error('Usuário não autenticado');

      // Buscar decks do jogador
      const { data: decksData, error: decksError } = await supabase
        .from('player_decks')
        .select('*')
        .eq('player_id', user.data.user.id)
        .order('created_at', { ascending: false });

      if (decksError) throw decksError;

      if (!decksData || decksData.length === 0) {
        setDecks([]);
        setActiveDeck(null);
        return;
      }

      // Para cada deck, buscar as cartas correspondentes
      const decksWithCards: DeckWithCards[] = [];
      
      for (const deck of decksData) {
        if (deck.card_ids.length === 0) {
          decksWithCards.push({ ...deck, cards: [] });
          continue;
        }

        // Buscar cartas do deck
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .in('id', deck.card_ids)
          .eq('is_active', true);

        if (cardsError) {
          console.error('Error fetching cards for deck:', deck.name, cardsError);
          decksWithCards.push({ ...deck, cards: [] });
          continue;
        }

        // Converter cartas para o formato do jogo, respeitando as múltiplas cópias no deck
        const gameCards: Card[] = [];
        deck.card_ids.forEach((cardId, index) => {
          const cardData = cardsData?.find(c => c.id === cardId);
          if (cardData) {
            gameCards.push({
              id: `${cardData.id}_${index}`, // ID único para cada cópia no deck
              name: cardData.name,
              type: cardData.type,
              cost: {
                coins: cardData.cost_coins || 0,
                food: cardData.cost_food || 0,
                materials: cardData.cost_materials || 0,
                population: cardData.cost_population || 0,
              },
              effect: {
                description: cardData.effect,
              },
              rarity: cardData.rarity,
              activation: getActivationDescription(cardData),
            });
          }
        });

        const deckWithCards: DeckWithCards = {
          ...deck,
          cards: gameCards
        };

        decksWithCards.push(deckWithCards);

        // Se for o deck ativo, definir como activeDeck
        if (deck.is_active) {
          setActiveDeck(deckWithCards);
        }
      }

      setDecks(decksWithCards);

      // Se não há deck ativo, definir o primeiro como ativo
      if (!activeDeck && decksWithCards.length > 0) {
        setActiveDeck(decksWithCards[0]);
      }

    } catch (err: any) {
      console.error('Error fetching player decks:', err);
      setError(err.message || 'Erro ao carregar decks do jogador');
    } finally {
      setLoading(false);
    }
  };

  const createDeck = async (name: string, cardIds: string[] = []) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) throw new Error('Usuário não autenticado');

      // Validar limite de 28 cartas
      if (cardIds.length > 28) {
        throw new Error('Um deck não pode ter mais de 28 cartas');
      }

      const { data, error } = await supabase
        .from('player_decks')
        .insert({
          player_id: user.data.user.id,
          name,
          card_ids: cardIds,
          is_active: false // Não ativar automaticamente
        })
        .select()
        .single();

      if (error) throw error;

      // Recarregar decks
      await fetchPlayerDecks();
      return data;
    } catch (err: any) {
      console.error('Error creating deck:', err);
      throw err;
    }
  };

  const updateDeck = async (deckId: string, updates: Partial<Pick<PlayerDeck, 'name' | 'card_ids'>>) => {
    try {
      // Validar limite de 28 cartas se card_ids está sendo atualizado
      if (updates.card_ids && updates.card_ids.length > 28) {
        throw new Error('Um deck não pode ter mais de 28 cartas');
      }

      const { error } = await supabase
        .from('player_decks')
        .update(updates)
        .eq('id', deckId);

      if (error) throw error;

      // Recarregar decks
      await fetchPlayerDecks();
    } catch (err: any) {
      console.error('Error updating deck:', err);
      throw err;
    }
  };

  const deleteDeck = async (deckId: string) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) throw new Error('Usuário não autenticado');

      // Verificar se não é o último deck
      if (decks.length <= 1) {
        throw new Error('Você deve ter pelo menos um deck');
      }

      // Verificar se não é o deck ativo
      const deckToDelete = decks.find(d => d.id === deckId);
      if (deckToDelete?.is_active) {
        throw new Error('Não é possível excluir o deck ativo. Ative outro deck primeiro.');
      }

      const { error } = await supabase
        .from('player_decks')
        .delete()
        .eq('id', deckId)
        .eq('player_id', user.data.user.id);

      if (error) throw error;

      // Recarregar decks
      await fetchPlayerDecks();
    } catch (err: any) {
      console.error('Error deleting deck:', err);
      throw err;
    }
  };

  const setActiveDeckById = async (deckId: string) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) throw new Error('Usuário não autenticado');

      // Primeiro, desativar todos os decks
      const { error: deactivateError } = await supabase
        .from('player_decks')
        .update({ is_active: false })
        .eq('player_id', user.data.user.id);

      if (deactivateError) throw deactivateError;

      // Ativar o deck selecionado
      const { error: activateError } = await supabase
        .from('player_decks')
        .update({ is_active: true })
        .eq('id', deckId)
        .eq('player_id', user.data.user.id);

      if (activateError) throw activateError;

      // Recarregar decks
      await fetchPlayerDecks();
    } catch (err: any) {
      console.error('Error setting active deck:', err);
      throw err;
    }
  };

  const getActivationDescription = (cardData: any): string => {
    const phase = cardData.phase;
    const usePerTurn = cardData.use_per_turn || 1;
    const isReactive = cardData.is_reactive || false;

    let description = '';

    switch (phase) {
      case 'draw':
        description = 'Fase de compra.';
        break;
      case 'action':
        description = 'Fase de ação.';
        break;
      case 'reaction':
        description = 'Fase de reação.';
        break;
    }

    if (usePerTurn > 0) {
      description += ` Pode ser usada ${usePerTurn} vez(es) por turno.`;
    }

    if (isReactive) {
      description += ' Reativa a eventos.';
    }

    return description;
  };

  return {
    decks,
    activeDeck,
    loading,
    error,
    createDeck,
    updateDeck,
    deleteDeck,
    setActiveDeckById,
    refetch: fetchPlayerDecks,
  };
};