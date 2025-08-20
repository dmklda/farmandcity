import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Card } from '../types/card';
import { AdminCard } from '../types/admin';

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Converter AdminCard para Card (formato do jogo)
      const gameCards: Card[] = (data || []).map((adminCard: any): Card => ({
        id: adminCard.id,
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
        artworkUrl: adminCard.art_url || undefined,
        effect_logic: adminCard.effect_logic || null, // Incluir o effect_logic
      }));

      setCards(gameCards);
    } catch (err: any) {
      console.error('Error fetching cards:', err);
      setError(err.message || 'Erro ao carregar cartas');
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

  const getCardById = (id: string): Card | undefined => {
    return cards.find(card => card.id === id);
  };

  const getCardsByType = (type: Card['type']): Card[] => {
    return cards.filter(card => card.type === type);
  };

  const getCardsByRarity = (rarity: Card['rarity']): Card[] => {
    return cards.filter(card => card.rarity === rarity);
  };

  return {
    cards,
    loading,
    error,
    refetch: fetchCards,
    getCardById,
    getCardsByType,
    getCardsByRarity,
  };
}; 