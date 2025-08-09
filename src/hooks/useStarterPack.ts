import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface StarterPackInfo {
  pack: {
    id: string;
    name: string;
    description: string;
    price: number;
    is_starter_pack: boolean;
    max_purchases_per_player: number;
  };
  items: Array<{
    card_id: string;
    card_name: string;
    card_type: string;
    card_rarity: string;
    quantity: number;
  }>;
  can_purchase: boolean;
}

interface PurchaseResult {
  success: boolean;
  message: string;
  purchase_id?: string;
  cards_added?: number;
}

export const useStarterPack = () => {
  const [packInfo, setPackInfo] = useState<StarterPackInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar informações do pacote iniciante
  const fetchStarterPackInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🎁 Verificando pacote iniciante...');
      const { data, error } = await supabase.rpc('get_starter_pack_info');

      if (error) {
        console.error('Erro ao buscar informações do pacote iniciante:', error);
        setError(error.message);
        return;
      }

      console.log('🎁 Pacote iniciante verificado:', data?.can_purchase ? 'disponível' : 'já adquirido');
      setPackInfo(data);
    } catch (err) {
      console.error('Erro inesperado ao buscar pacote iniciante:', err);
      setError('Erro inesperado ao carregar pacote iniciante');
    } finally {
      setLoading(false);
    }
  };

  // Comprar o pacote iniciante
  const purchaseStarterPack = async (): Promise<PurchaseResult> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('purchase_starter_pack');

      if (error) {
        console.error('Erro ao comprar pacote iniciante:', error);
        return {
          success: false,
          message: error.message
        };
      }

      // Atualizar informações do pacote após a compra
      await fetchStarterPackInfo();

      return data;
    } catch (err) {
      console.error('Erro inesperado ao comprar pacote iniciante:', err);
      return {
        success: false,
        message: 'Erro inesperado ao comprar pacote iniciante'
      };
    } finally {
      setLoading(false);
    }
  };

  // Verificar se pode comprar
  const canPurchase = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('can_purchase_starter_pack');

      if (error) {
        console.error('Erro ao verificar disponibilidade:', error);
        return false;
      }

      return data;
    } catch (err) {
      console.error('Erro inesperado ao verificar disponibilidade:', err);
      return false;
    }
  };

  // Carregar informações na inicialização com delay para não bloquear a UI
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStarterPackInfo();
    }, 100); // Pequeno delay para não bloquear o carregamento inicial
    
    return () => clearTimeout(timer);
  }, []);

  return {
    packInfo,
    loading,
    error,
    purchaseStarterPack,
    canPurchase,
    refreshInfo: fetchStarterPackInfo
  };
}; 