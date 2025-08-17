import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Card } from '../types/card';
import { starterCards } from '../backup/cards';

export const useStarterDeck = () => {
  const [starterDeck, setStarterDeck] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStarterDeck();
  }, []);

  const fetchStarterDeck = async () => {
    try {
      setLoading(true);
      setError(null);

      // Primeiro, tentar buscar cartas starter do Supabase
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('is_active', true)
        .eq('is_starter', true) // Campo para identificar cartas starter
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Erro ao buscar starter deck do Supabase:', error);
        // Fallback para cartas locais
        setStarterDeck(starterCards);
        return;
      }

      if (data && data.length > 0) {
        // Verificar se as cartas do starter deck têm effect_logic
        console.log('[CARDS DEBUG] Verificando effect_logic das cartas do starter deck:', 
          data.slice(0, 3).map(c => ({ 
            name: c.name, 
            id: c.id, 
            effect_logic: c.effect_logic 
          }))
        );
        
        // Converter cartas do Supabase para formato do jogo
        const supabaseStarterCards: Card[] = data.map((adminCard: any): Card => ({
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
          effect_logic: adminCard.effect_logic,
        }));

        // Verificar se as cartas convertidas têm effect_logic
        console.log('[CARDS DEBUG] Verificando effect_logic das cartas convertidas do starter deck:', 
          supabaseStarterCards.slice(0, 3).map(c => ({ 
            name: c.name, 
            id: c.id, 
            effect_logic: c.effect_logic 
          }))
        );
        
        setStarterDeck(supabaseStarterCards);
      } else {
        // Se não houver cartas starter no Supabase, usar as locais
        console.log('Usando starter deck local');
        setStarterDeck(starterCards);
      }
    } catch (err: any) {
      console.error('Error fetching starter deck:', err);
      setError(err.message || 'Erro ao carregar starter deck');
      // Fallback para cartas locais
      setStarterDeck(starterCards);
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

  const getStarterCardById = (id: string): Card | undefined => {
    return starterDeck.find(card => card.id === id);
  };

  return {
    starterDeck,
    loading,
    error,
    refetch: fetchStarterDeck,
    getStarterCardById,
  };
}; 