import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Card } from '../types/card';
import { useGameSettings } from './useGameSettings';

interface PlayerDeck {
  id: string;
  player_id: string;
  name: string;
  card_ids: string[]; // Agora é UUID[]
  is_active: boolean;
  is_starter_deck: boolean;
  created_at: string;
  updated_at: string;
}

interface DeckWithCards extends PlayerDeck {
  cards: Card[];
}

export const usePlayerDecks = () => {
  const [decks, setDecks] = useState<PlayerDeck[]>([]);
  const [activeDeck, setActiveDeck] = useState<DeckWithCards | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings: gameSettings } = useGameSettings();

  useEffect(() => {
    // Só buscar decks se o usuário estiver autenticado
    const checkAuthAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Pequeno delay para não bloquear a UI inicial
        setTimeout(() => {
          fetchPlayerDecks();
        }, 50);
      } else {
        setLoading(false);
        setDecks([]);
        setActiveDeck(null);
      }
    };
    
    checkAuthAndFetch();
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
        setLoading(false);
        return;
      }

      // Para cada deck, buscar as cartas correspondentes
      const decksWithCards: DeckWithCards[] = [];
      
      for (const deck of decksData) {
        if (!deck.card_ids || deck.card_ids.length === 0) {
          decksWithCards.push({ 
            ...deck, 
            cards: [],
            is_starter_deck: false
          });
          continue;
        }

        // Buscar cartas do deck usando UUIDs
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .in('id', deck.card_ids)
          .eq('is_active', true);

        if (cardsError) {
          console.error('Error fetching cards for deck:', deck.name, cardsError);
          decksWithCards.push({ 
            ...deck, 
            cards: [],
            is_starter_deck: false // Valor padrão se não existir no banco
          });
          continue;
        }

        //console.log(`Cartas encontradas para deck ${deck.name}:`, cardsData?.length);
        //console.log('Dados das cartas:', cardsData);

        // Converter cartas para o formato do jogo, respeitando as múltiplas cópias no deck
        const gameCards: Card[] = [];
        deck.card_ids.forEach((cardId: string, index: number) => {
          const cardData = cardsData?.find(c => c.id === cardId);
          
          if (cardData) {
            const gameCard = {
              id: cardData.id,
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
              artworkUrl: cardData.art_url || undefined,
            };
            gameCards.push(gameCard);
          } else {
            console.warn(`Carta não encontrada: ${cardId} no deck ${deck.name}`);
          }
        });

        const deckWithCards: DeckWithCards = {
          ...deck,
          cards: gameCards,
          is_starter_deck: false
        };

        decksWithCards.push(deckWithCards);

        // Se for o deck ativo, definir como activeDeck
        if (deck.is_active) {
          setActiveDeck(deckWithCards);
        }
      }

      setDecks(decksWithCards);

      // Verificar se há apenas um deck ativo
      const activeDecks = decksWithCards.filter(deck => deck.is_active);
      if (activeDecks.length > 1) {
        console.warn(`Múltiplos decks ativos detectados: ${activeDecks.length}. Manter apenas o mais recente.`);
        // Manter apenas o deck mais recente ativo
        const mostRecentActive = activeDecks.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )[0];
        
        // Desativar outros decks via API
        for (const deck of activeDecks) {
          if (deck.id !== mostRecentActive.id) {
            try {
              await supabase
                .from('player_decks')
                .update({ is_active: false })
                .eq('id', deck.id);
            } catch (err) {
              console.error(`Erro ao desativar deck ${deck.name}:`, err);
            }
          }
        }
        
        setActiveDeck(mostRecentActive);
      } else if (activeDecks.length === 1) {
        setActiveDeck(activeDecks[0]);
      } else if (decksWithCards.length > 0) {
        // Se não há deck ativo, definir o primeiro como ativo
        setActiveDeck(decksWithCards[0]);
        // Ativar o primeiro deck no banco
        try {
          await setActiveDeckById(decksWithCards[0].id);
        } catch (err) {
          console.error('Erro ao ativar primeiro deck:', err);
        }
      }

    } catch (err: any) {
      console.error('❌ Error fetching player decks:', err);
      setError(err.message || 'Erro ao carregar decks do jogador');
      setDecks([]);
      setActiveDeck(null);
    } finally {
      //console.log('=== DEBUG: fetchPlayerDecks finalizado ===');
      setLoading(false);
    }
  };

  const createDeck = async (name: string, cardIds: string[] = [], isStarterDeck: boolean = false) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) throw new Error('Usuário não autenticado');

      // Verificar se as configurações estão carregadas
      if (!gameSettings.minDeckCardCount || !gameSettings.maxDeckCardCount) {
        console.warn('⚠️ Configurações de deck não carregadas, usando valores padrão');
        // Usar valores padrão se as configurações não estiverem carregadas
        const defaultMin = 23;
        const defaultMax = 40;
        const defaultStarter = 38;
        
        if (isStarterDeck) {
          if (cardIds.length !== defaultStarter) {
            throw new Error(`Deck inicial deve ter exatamente ${defaultStarter} cartas`);
          }
        } else {
          if (cardIds.length < defaultMin || cardIds.length > defaultMax) {
            throw new Error(`Deck customizado deve ter entre ${defaultMin} e ${defaultMax} cartas`);
          }
        }
      } else {
        console.log('🔧 Configurações de deck:', {
          minDeckCardCount: gameSettings.minDeckCardCount,
          maxDeckCardCount: gameSettings.maxDeckCardCount,
          starterDeckCardCount: gameSettings.starterDeckCardCount,
          cardIdsLength: cardIds.length,
          isStarterDeck
        });

        // Validar limites baseado no tipo de deck
        if (isStarterDeck) {
          if (cardIds.length !== gameSettings.starterDeckCardCount) {
            throw new Error(`Deck inicial deve ter exatamente ${gameSettings.starterDeckCardCount} cartas`);
          }
        } else {
          if (cardIds.length < gameSettings.minDeckCardCount || cardIds.length > gameSettings.maxDeckCardCount) {
            throw new Error(`Deck customizado deve ter entre ${gameSettings.minDeckCardCount} e ${gameSettings.maxDeckCardCount} cartas`);
          }
        }
      }

      const { data, error } = await supabase
        .from('player_decks')
        .insert({
          player_id: user.data.user.id,
          name,
          card_ids: cardIds,
          is_active: false, // Não ativar automaticamente
          is_starter_deck: isStarterDeck
        })
        .select()
        .single();

      if (error) throw error;

      //console.log(`Deck criado: ${name} com ${cardIds.length} cartas`);
      
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
      // Buscar deck atual para verificar se é starter deck
      const currentDeck = decks.find(d => d.id === deckId);
      if (!currentDeck) throw new Error('Deck não encontrado');

      // Validar limites baseado no tipo de deck
      if (updates.card_ids) {
        // Verificar se as configurações estão carregadas
        if (!gameSettings.minDeckCardCount || !gameSettings.maxDeckCardCount) {
          console.warn('⚠️ Configurações de deck não carregadas, usando valores padrão');
          // Usar valores padrão se as configurações não estiverem carregadas
          const defaultMin = 23;
          const defaultMax = 40;
          const defaultStarter = 38;
          
          if (currentDeck.is_starter_deck) {
            if (updates.card_ids.length !== defaultStarter) {
              throw new Error(`Deck inicial deve ter exatamente ${defaultStarter} cartas`);
            }
          } else {
            if (updates.card_ids.length < defaultMin || updates.card_ids.length > defaultMax) {
              throw new Error(`Deck customizado deve ter entre ${defaultMin} e ${defaultMax} cartas`);
            }
          }
        } else {
          if (currentDeck.is_starter_deck) {
            if (updates.card_ids.length !== gameSettings.starterDeckCardCount) {
              throw new Error(`Deck inicial deve ter exatamente ${gameSettings.starterDeckCardCount} cartas`);
            }
          } else {
            if (updates.card_ids.length < gameSettings.minDeckCardCount || updates.card_ids.length > gameSettings.maxDeckCardCount) {
              throw new Error(`Deck customizado deve ter entre ${gameSettings.minDeckCardCount} e ${gameSettings.maxDeckCardCount} cartas`);
            }
          }
        }
      }

      const { error } = await supabase
        .from('player_decks')
        .update(updates)
        .eq('id', deckId);

      if (error) throw error;

      // console.log(`Deck atualizado: ${updates.name || currentDeck.name}`);
      
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

      // Verificar se não é o deck inicial (não pode ser deletado)
      if (deckToDelete?.is_starter_deck) {
        throw new Error('O deck inicial não pode ser excluído.');
      }

      const { error } = await supabase
        .from('player_decks')
        .delete()
        .eq('id', deckId)
        .eq('player_id', user.data.user.id);

      if (error) throw error;

      // console.log(`Deck deletado: ${deckToDelete?.name}`);
      
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

      // Usar a função segura do Supabase para ativar o deck
      const { error } = await supabase.rpc('activate_player_deck', {
        deck_id: deckId
      });

      if (error) {
        console.error('Erro ao ativar deck via RPC:', error);
        // Fallback para o método anterior se a função RPC não existir
        const { error: deactivateError } = await supabase
          .from('player_decks')
          .update({ is_active: false })
          .eq('player_id', user.data.user.id);

        if (deactivateError) throw deactivateError;

        const { error: activateError } = await supabase
          .from('player_decks')
          .update({ is_active: true })
          .eq('id', deckId)
          .eq('player_id', user.data.user.id);

        if (activateError) throw activateError;
      }

      // console.log(`Deck ativado: ${deckId}`);
      
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