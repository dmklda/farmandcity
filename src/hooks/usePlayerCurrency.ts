import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import type { Tables } from '../integrations/supabase/types';

type PlayerCurrency = Tables<'player_currency'>;

export const usePlayerCurrency = () => {
  const [currency, setCurrency] = useState<PlayerCurrency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    //console.log('usePlayerCurrency useEffect executado, refreshTrigger:', refreshTrigger);
    fetchPlayerCurrency();
  }, [refreshTrigger]);

  const fetchPlayerCurrency = async () => {
    try {
      //console.log('fetchPlayerCurrency iniciado...');
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        //console.log('Usuário não autenticado, abortando fetchPlayerCurrency');
        setLoading(false);
        return;
      }

      //console.log('Buscando moedas para usuário:', user.id);
      const { data, error: fetchError } = await supabase
        .from('player_currency')
        .select('*')
        .eq('player_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (!data) {
        //console.log('Dados de moeda não encontrados, criando moeda inicial...');
        // Criar moeda inicial para o jogador
        await createInitialCurrency(user.id);
        // Buscar novamente após criar
        const { data: newData, error: newError } = await supabase
          .from('player_currency')
          .select('*')
          .eq('player_id', user.id)
          .single();
        
        if (newError) throw newError;
        //console.log('Moeda inicial criada:', newData);
        setCurrency({ ...newData });
        setLoading(false);
        return;
      }

      //console.log('Moedas encontradas:', data);
      //console.log('Chamando setCurrency com:', data);
      // Forçar nova referência para garantir que o React detecte a mudança
      setCurrency({ ...data });
      //console.log('setCurrency chamado com nova referência');
    } catch (err: any) {
      console.error('Erro em fetchPlayerCurrency:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createInitialCurrency = async (userId: string) => {
    const { error } = await supabase
      .from('player_currency')
      .insert({
        player_id: userId,
        coins: 1000,
        gems: 50,
        experience_points: 0,
        level: 1
      });

    if (error) throw error;
  };

  const addCoins = async (amount: number) => {
    if (!currency) return;

    const { data, error } = await supabase
      .from('player_currency')
      .update({ 
        coins: (currency.coins || 0) + amount,
        updated_at: new Date().toISOString()
      })
      .eq('player_id', currency.player_id)
      .select()
      .single();

    if (error) throw error;
    setCurrency(data);
  };

  const addGems = async (amount: number) => {
    if (!currency) return;

    const { data, error } = await supabase
      .from('player_currency')
      .update({ 
        gems: (currency.gems || 0) + amount,
        updated_at: new Date().toISOString()
      })
      .eq('player_id', currency.player_id)
      .select()
      .single();

    if (error) throw error;
    setCurrency(data);
  };

  const addExperience = async (amount: number) => {
    if (!currency) return;

    const currentXP = currency.experience_points || 0;
    const newXP = currentXP + amount;
    const newLevel = Math.floor(newXP / 100) + 1; // 100 XP por nível

    const { data, error } = await supabase
      .from('player_currency')
      .update({ 
        experience_points: newXP,
        level: newLevel,
        updated_at: new Date().toISOString()
      })
      .eq('player_id', currency.player_id)
      .select()
      .single();

    if (error) throw error;
    setCurrency(data);
  };

  const spendCoins = async (amount: number) => {
    if (!currency || (currency.coins || 0) < amount) {
      throw new Error('Moedas insuficientes');
    }

    const { data, error } = await supabase
      .from('player_currency')
      .update({ 
        coins: (currency.coins || 0) - amount,
        updated_at: new Date().toISOString()
      })
      .eq('player_id', currency.player_id)
      .select()
      .single();

    if (error) throw error;
    setCurrency(data);
  };

  const spendGems = async (amount: number) => {
    if (!currency || (currency.gems || 0) < amount) {
      throw new Error('Gems insuficientes');
    }

    const { data, error } = await supabase
      .from('player_currency')
      .update({ 
        gems: (currency.gems || 0) - amount,
        updated_at: new Date().toISOString()
      })
      .eq('player_id', currency.player_id)
      .select()
      .single();

    if (error) throw error;
    setCurrency(data);
  };

  const refresh = useCallback(async () => {
    //console.log('usePlayerCurrency refresh chamado, incrementando refreshTrigger...');
    setRefreshTrigger(prev => {
      const newValue = prev + 1;
      //console.log('refreshTrigger atualizado:', { prev, newValue });
      return newValue;
    });
    //console.log('Chamando fetchPlayerCurrency...');
    await fetchPlayerCurrency();
    //console.log('fetchPlayerCurrency concluído');
  }, []);

  return {
    currency,
    loading,
    error,
    addCoins,
    addGems,
    addExperience,
    spendCoins,
    spendGems,
    refresh
  };
}; 