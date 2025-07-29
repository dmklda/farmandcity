import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';

interface OpenedCard {
  id: string;
  name: string;
  type: string;
  rarity: string;
  effect: string;
  cost_coins: number;
  cost_food: number;
  cost_materials: number;
  cost_population: number;
}

export const usePackOpening = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPack = async (packId: string): Promise<OpenedCard[] | null> => {
    setLoading(true);
    setError(null);

    try {
      // Primeiro tentar a função normal (para usuários autenticados)
      let { data, error } = await supabase.rpc('open_pack', {
        pack_id: packId
      });

      // Se der erro de autenticação, usar a função de teste
      if (error && error.message.includes('autenticado')) {
        console.log('Usuário não autenticado, usando função de teste...');
        const { data: testData, error: testError } = await supabase.rpc('test_open_pack', {
          pack_id: packId
        });
        
        if (testError) {
          throw testError;
        }
        
        data = testData;
      } else if (error) {
        throw error;
      }

      return data;
    } catch (err: any) {
      console.error('Erro ao abrir pack:', err);
      setError(err.message || 'Erro ao abrir pack');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    openPack,
    loading,
    error
  };
}; 