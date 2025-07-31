import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface Catastrophe {
  id: string;
  name: string;
  description: string;
  effect_type: 'resource_loss' | 'production_reduction' | 'population_loss' | 'card_destruction' | 'mixed';
  effect_data: any;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  trigger_conditions?: any;
  is_active: boolean;
}

export interface GameCatastrophe {
  id: string;
  game_id: string;
  catastrophe_id: string;
  turn_triggered: number;
  effect_applied: any;
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

export const useCatastrophes = () => {
  const [catastrophes, setCatastrophes] = useState<Catastrophe[]>([]);
  const [gameCatastrophes, setGameCatastrophes] = useState<GameCatastrophe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar catástrofes disponíveis
  const fetchCatastrophes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('catastrophes')
        .select('*')
        .eq('is_active', true)
        .order('rarity', { ascending: true });

      if (error) throw error;
      setCatastrophes(data || []);
    } catch (err: any) {
      console.error('Error fetching catastrophes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar catástrofes de um jogo específico
  const fetchGameCatastrophes = useCallback(async (gameId: string) => {
    try {
      const { data, error } = await supabase
        .from('game_catastrophes')
        .select(`
          *,
          catastrophes (
            id,
            name,
            description,
            effect_type,
            effect_data,
            rarity
          )
        `)
        .eq('game_id', gameId)
        .order('turn_triggered', { ascending: true });

      if (error) throw error;
      setGameCatastrophes(data || []);
    } catch (err: any) {
      console.error('Error fetching game catastrophes:', err);
      setError(err.message);
    }
  }, []);

  // Registrar uma nova catástrofe no jogo
  const triggerCatastrophe = useCallback(async (
    gameId: string, 
    catastropheId: string, 
    turn: number, 
    effectApplied: any
  ) => {
    try {
      const { data, error } = await supabase
        .from('game_catastrophes')
        .insert({
          game_id: gameId,
          catastrophe_id: catastropheId,
          turn_triggered: turn,
          effect_applied: effectApplied,
          resolved: false
        })
        .select()
        .single();

      if (error) throw error;
      
      // Atualizar lista local
      setGameCatastrophes(prev => [...prev, data]);
      
      return data;
    } catch (err: any) {
      console.error('Error triggering catastrophe:', err);
      setError(err.message);
      return null;
    }
  }, []);

  // Marcar catástrofe como resolvida
  const resolveCatastrophe = useCallback(async (catastropheId: string) => {
    try {
      const { data, error } = await supabase
        .from('game_catastrophes')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('id', catastropheId)
        .select()
        .single();

      if (error) throw error;
      
      // Atualizar lista local
      setGameCatastrophes(prev => 
        prev.map(cat => 
          cat.id === catastropheId 
            ? { ...cat, resolved: true, resolved_at: data.resolved_at }
            : cat
        )
      );
      
      return data;
    } catch (err: any) {
      console.error('Error resolving catastrophe:', err);
      setError(err.message);
      return null;
    }
  }, []);

  // Gerar catástrofe aleatória baseada na raridade
  const generateRandomCatastrophe = useCallback((currentTurn: number): Catastrophe | null => {
    if (catastrophes.length === 0) return null;

    // Probabilidades baseadas na raridade e turno
    const rarityWeights = {
      common: 0.5,
      uncommon: 0.3,
      rare: 0.15,
      legendary: 0.05
    };

    // Aumentar chance de catástrofes raras conforme o jogo progride
    const turnMultiplier = Math.min(currentTurn / 20, 2); // Máximo 2x no turno 40+
    
    const adjustedWeights = {
      common: rarityWeights.common / turnMultiplier,
      uncommon: rarityWeights.uncommon,
      rare: rarityWeights.rare * turnMultiplier,
      legendary: rarityWeights.legendary * turnMultiplier
    };

    // Normalizar pesos
    const totalWeight = Object.values(adjustedWeights).reduce((sum, weight) => sum + weight, 0);
    const normalizedWeights = Object.fromEntries(
      Object.entries(adjustedWeights).map(([rarity, weight]) => [rarity, weight / totalWeight])
    );

    // Selecionar raridade baseada nos pesos
    const random = Math.random();
    let cumulativeWeight = 0;
    let selectedRarity: keyof typeof normalizedWeights | null = null;

    for (const [rarity, weight] of Object.entries(normalizedWeights)) {
      cumulativeWeight += weight;
      if (random <= cumulativeWeight) {
        selectedRarity = rarity as keyof typeof normalizedWeights;
        break;
      }
    }

    if (!selectedRarity) {
      selectedRarity = 'common'; // Fallback
    }

    // Filtrar catástrofes da raridade selecionada
    const availableCatastrophes = catastrophes.filter(cat => cat.rarity === selectedRarity);
    
    if (availableCatastrophes.length === 0) {
      // Se não há catástrofes da raridade selecionada, usar qualquer uma
      return catastrophes[Math.floor(Math.random() * catastrophes.length)];
    }

    return availableCatastrophes[Math.floor(Math.random() * availableCatastrophes.length)];
  }, [catastrophes]);

  // Aplicar efeito de catástrofe
  const applyCatastropheEffect = useCallback((catastrophe: Catastrophe, gameState: any) => {
    const effect = catastrophe.effect_data;
    const modifiedState = { ...gameState };

    switch (catastrophe.effect_type) {
      case 'resource_loss':
        if (effect.coins) modifiedState.resources.coins = Math.max(0, modifiedState.resources.coins - effect.coins);
        if (effect.food) modifiedState.resources.food = Math.max(0, modifiedState.resources.food - effect.food);
        if (effect.materials) modifiedState.resources.materials = Math.max(0, modifiedState.resources.materials - effect.materials);
        if (effect.population) modifiedState.resources.population = Math.max(0, modifiedState.resources.population - effect.population);
        break;

      case 'production_reduction':
        // Reduzir produção temporariamente
        modifiedState.productionReduction = effect.reduction || 0.5;
        break;

      case 'population_loss':
        if (effect.population) {
          modifiedState.resources.population = Math.max(0, modifiedState.resources.population - effect.population);
        }
        break;

      case 'card_destruction':
        // Destruir cartas aleatórias do grid
        if (effect.destroy_count) {
          // Implementar lógica de destruição de cartas
          modifiedState.cardDestructionCount = effect.destroy_count;
        }
        break;

      case 'mixed':
        // Aplicar múltiplos efeitos
        if (effect.resources) {
          Object.entries(effect.resources).forEach(([resource, amount]) => {
            if (typeof amount === 'number') {
              modifiedState.resources[resource as keyof typeof modifiedState.resources] = 
                Math.max(0, modifiedState.resources[resource as keyof typeof modifiedState.resources] - amount);
            }
          });
        }
        break;
    }

    return modifiedState;
  }, []);

  useEffect(() => {
    fetchCatastrophes();
  }, [fetchCatastrophes]);

  return {
    catastrophes,
    gameCatastrophes,
    loading,
    error,
    fetchCatastrophes,
    fetchGameCatastrophes,
    triggerCatastrophe,
    resolveCatastrophe,
    generateRandomCatastrophe,
    applyCatastropheEffect
  };
}; 