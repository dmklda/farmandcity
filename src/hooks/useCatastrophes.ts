import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface Catastrophe {
  id: string;
  name: string;
  description: string;
  effect_type: 'resource_loss' | 'production_reduction' | 'population_loss' | 'card_destruction' | 'card_deactivation' | 'mixed';
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
  const [recentCatastrophes, setRecentCatastrophes] = useState<string[]>([]); // IDs das últimas catástrofes

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
      setCatastrophes((data || []) as Catastrophe[]);
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
      setGameCatastrophes((data || []) as GameCatastrophe[]);
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
      setGameCatastrophes(prev => [...prev, data as GameCatastrophe]);
      
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
            ? { ...cat, resolved: true, resolved_at: data.resolved_at } as GameCatastrophe
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
  const generateRandomCatastrophe = useCallback((currentTurn: number, victoryMode?: string): Catastrophe | null => {
    if (catastrophes.length === 0) return null;

    // Filtrar catástrofes que não foram usadas recentemente (últimas 3)
    const availableCatastrophes = catastrophes.filter(cat => !recentCatastrophes.includes(cat.id));
    
    // Se todas foram usadas recentemente, resetar a lista
    if (availableCatastrophes.length === 0) {
      setRecentCatastrophes([]);
      return catastrophes[Math.floor(Math.random() * catastrophes.length)];
    }

    // Probabilidades baseadas na raridade e turno
    const rarityWeights = {
      common: 0.5,
      uncommon: 0.3,
      rare: 0.15,
      legendary: 0.05
    };

    // Aumentar chance de catástrofes raras conforme o jogo progride
    let turnMultiplier = Math.min(currentTurn / 20, 2); // Máximo 2x no turno 40+
    
    // Modos de sobrevivência têm catástrofes mais agressivas
    if (victoryMode === 'elimination') {
      turnMultiplier = Math.min(currentTurn / 10, 3); // Máximo 3x no turno 30+
    } else if (victoryMode === 'infinite') {
      turnMultiplier = Math.min(currentTurn / 15, 2.5); // Máximo 2.5x no turno 37+
    }
    
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

    // Filtrar catástrofes da raridade selecionada (que não foram usadas recentemente)
    const rarityCatastrophes = availableCatastrophes.filter(cat => cat.rarity === selectedRarity);
    
    if (rarityCatastrophes.length === 0) {
      // Se não há catástrofes da raridade selecionada, usar qualquer uma disponível
      const selectedCatastrophe = availableCatastrophes[Math.floor(Math.random() * availableCatastrophes.length)];
      
      // Adicionar à lista de recentes
      if (selectedCatastrophe) {
        setRecentCatastrophes(prev => [...prev.slice(-2), selectedCatastrophe.id]); // Manter apenas as últimas 3
      }
      
      return selectedCatastrophe;
    }

    const selectedCatastrophe = rarityCatastrophes[Math.floor(Math.random() * rarityCatastrophes.length)];
    
    // Adicionar à lista de recentes
    if (selectedCatastrophe) {
      setRecentCatastrophes(prev => [...prev.slice(-2), selectedCatastrophe.id]); // Manter apenas as últimas 3
    }
    
    return selectedCatastrophe;
  }, [catastrophes, recentCatastrophes]);

  // Aplicar efeito de catástrofe
  const applyCatastropheEffect = useCallback((catastrophe: Catastrophe, gameState: any, victoryMode?: string) => {
    const effect = catastrophe.effect_data;
    const modifiedState = { ...gameState };
    
    // Multiplicador de intensidade para modos de sobrevivência
    let intensityMultiplier = 1;
    if (victoryMode === 'elimination') {
      intensityMultiplier = 1.5; // 50% mais intenso
    } else if (victoryMode === 'infinite') {
      intensityMultiplier = 1.3; // 30% mais intenso
    }

    switch (catastrophe.effect_type) {
      case 'resource_loss':
        if (effect.coins) modifiedState.resources.coins = Math.max(0, modifiedState.resources.coins - Math.floor(effect.coins * intensityMultiplier));
        if (effect.food) modifiedState.resources.food = Math.max(0, modifiedState.resources.food - Math.floor(effect.food * intensityMultiplier));
        if (effect.materials) modifiedState.resources.materials = Math.max(0, modifiedState.resources.materials - Math.floor(effect.materials * intensityMultiplier));
        if (effect.population) modifiedState.resources.population = Math.max(0, modifiedState.resources.population - Math.floor(effect.population * intensityMultiplier));
        break;

      case 'production_reduction':
        // Reduzir produção temporariamente (mais intenso nos modos de sobrevivência)
        const baseReduction = effect.reduction || 0.5;
        modifiedState.productionReduction = Math.min(0.9, baseReduction * intensityMultiplier);
        break;

      case 'population_loss':
        if (effect.population) {
          modifiedState.resources.population = Math.max(0, modifiedState.resources.population - Math.floor(effect.population * intensityMultiplier));
        }
        break;

      case 'card_destruction':
        // Destruir cartas aleatórias do grid
        if (effect.destroy_count) {
          modifiedState.cardDestructionCount = effect.destroy_count;
          modifiedState.cardDestructionTargets = effect.targets || ['farm', 'city']; // Quais grids afetar
        }
        break;

      case 'card_deactivation':
        // Desativar cartas temporariamente
        if (effect.deactivate_count) {
          modifiedState.cardDeactivationCount = effect.deactivate_count;
          modifiedState.cardDeactivationDuration = effect.duration || 3; // Turnos de duração
          modifiedState.cardDeactivationTargets = effect.targets || ['farm', 'city'];
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
        if (effect.card_effects) {
          if (effect.card_effects.destroy_count) {
            modifiedState.cardDestructionCount = effect.card_effects.destroy_count;
            modifiedState.cardDestructionTargets = effect.card_effects.targets || ['farm', 'city'];
          }
          if (effect.card_effects.deactivate_count) {
            modifiedState.cardDeactivationCount = effect.card_effects.deactivate_count;
            modifiedState.cardDeactivationDuration = effect.card_effects.duration || 3;
            modifiedState.cardDeactivationTargets = effect.card_effects.targets || ['farm', 'city'];
          }
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