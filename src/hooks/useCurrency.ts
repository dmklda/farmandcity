import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export const useCurrency = () => {
  const [coins, setCoins] = useState(0);
  const [gems, setGems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrency = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('player_currency')
        .select('coins, gems')
        .eq('player_id', user.id)
        .single();

      if (error) {
        // Se não encontrar, criar registro padrão
        if (error.code === 'PGRST116') {
          const { data: newCurrency, error: createError } = await supabase
            .from('player_currency')
            .insert({
              player_id: user.id,
              coins: 1000,
              gems: 50
            })
            .select()
            .single();

          if (createError) throw createError;
          
          setCoins(newCurrency.coins || 0);
          setGems(newCurrency.gems || 0);
        } else {
          throw error;
        }
      } else {
        setCoins(data?.coins || 0);
        setGems(data?.gems || 0);
      }
    } catch (err: any) {
      console.error('Erro ao buscar moeda:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCurrency = async (newCoins?: number, newGems?: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updateData: any = {};
      if (newCoins !== undefined) updateData.coins = newCoins;
      if (newGems !== undefined) updateData.gems = newGems;

      const { error } = await supabase
        .from('player_currency')
        .update(updateData)
        .eq('player_id', user.id);

      if (error) throw error;

      // Atualizar estado local
      if (newCoins !== undefined) setCoins(newCoins);
      if (newGems !== undefined) setGems(newGems);
    } catch (err: any) {
      console.error('Erro ao atualizar moeda:', err);
      setError(err.message);
    }
  };

  const addCoins = async (amount: number) => {
    await updateCurrency(coins + amount);
  };

  const addGems = async (amount: number) => {
    await updateCurrency(undefined, gems + amount);
  };

  const spendCoins = async (amount: number) => {
    if (coins >= amount) {
      await updateCurrency(coins - amount);
      return true;
    }
    return false;
  };

  const spendGems = async (amount: number) => {
    if (gems >= amount) {
      await updateCurrency(undefined, gems - amount);
      return true;
    }
    return false;
  };

  useEffect(() => {
    fetchCurrency();
  }, []);

  return {
    coins,
    gems,
    loading,
    error,
    fetchCurrency,
    updateCurrency,
    addCoins,
    addGems,
    spendCoins,
    spendGems
  };
}; 