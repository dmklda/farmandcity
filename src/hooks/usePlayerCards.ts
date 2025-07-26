import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Card } from '../types/card';

interface PlayerCard {
  id: string;
  player_id: string;
  card_id: string;
  quantity: number;
  unlocked_at: string;
}

export const usePlayerCards = () => {
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayerCards();
  }, []);

  const fetchPlayerCards = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar cartas que o jogador possui
      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) throw new Error('Usuário não autenticado');
      
      const { data: playerCardsData, error: playerCardsError } = await supabase
        .from('player_cards')
        .select('*')
        .eq('player_id', user.data.user.id);

      if (playerCardsError) throw playerCardsError;

      if (!playerCardsData || playerCardsData.length === 0) {
        setPlayerCards([]);
        return;
      }

      // Buscar dados completos das cartas
      const cardIds = playerCardsData.map((pc: PlayerCard) => pc.card_id);
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .in('id', cardIds)
        .eq('is_active', true);

      if (cardsError) throw cardsError;

      // Converter para formato do jogo, respeitando quantidade
      const gameCards: Card[] = [];
      (cardsData || []).forEach((adminCard: any) => {
        const playerCard = playerCardsData.find((pc: PlayerCard) => pc.card_id === adminCard.id);
        const quantity = playerCard?.quantity || 1;
        
        // Adicionar múltiplas cópias da mesma carta baseado na quantidade
        for (let i = 0; i < quantity; i++) {
          gameCards.push({
            id: `${adminCard.id}_${i}`, // ID único para cada cópia
            name: adminCard.name,
            type: adminCard.type,
            cost: {
              coins: adminCard.cost_coins || 0,
              food: adminCard.cost_food || 0,
              materials: adminCard.cost_materials || 0,
              population: adminCard.cost_population || 0,
            },
            effect: {
              description: adminCard.effect,
            },
            rarity: adminCard.rarity,
            activation: getActivationDescription(adminCard),
          });
        }
      });

      setPlayerCards(gameCards);
    } catch (err: any) {
      console.error('Error fetching player cards:', err);
      setError(err.message || 'Erro ao carregar cartas do jogador');
    } finally {
      setLoading(false);
    }
  };

  const getActivationDescription = (adminCard: any): string => {
    const phase = adminCard.phase;
    const usePerTurn = adminCard.use_per_turn || 1;
    const isReactive = adminCard.is_reactive || false;

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
    playerCards,
    loading,
    error,
    refetch: fetchPlayerCards,
  };
};