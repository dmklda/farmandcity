import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface BattlefieldCustomization {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  rarity: string | null;
  price_coins: number | null;
  price_gems: number | null;
  currency_type: string | null;
  is_active: boolean | null;
  is_special: boolean | null;
  created_at: string | null;
}

export interface UserCustomization {
  id: string;
  user_id: string | null;
  customization_id: string | null;
  is_equipped: boolean | null;
  purchased_at: string | null;
  customization?: BattlefieldCustomization | null;
}

export const useBattlefieldCustomization = () => {
  const [customizations, setCustomizations] = useState<BattlefieldCustomization[]>([]);
  const [userCustomizations, setUserCustomizations] = useState<UserCustomization[]>([]);
  const [equippedCustomization, setEquippedCustomization] = useState<BattlefieldCustomization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomizations = async () => {
    try {
      const { data, error } = await supabase
        .from('battlefield_customizations')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomizations((data || []) as BattlefieldCustomization[]);
    } catch (err: any) {
      console.error('Erro ao buscar customizações:', err);
      setError(err.message);
    }
  };

  const fetchUserCustomizations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_customizations')
        .select(`
          *,
          customization:battlefield_customizations(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const customizations = data || [];
      setUserCustomizations(customizations);

      // Encontrar customização equipada
      const equipped = customizations.find(uc => uc.is_equipped);
      if (equipped && equipped.customization) {
        setEquippedCustomization(equipped.customization);
      } else if (customizations.length === 0) {
        // Se o usuário não tem nenhuma customização, dar o Campo Clássico gratuitamente
        await giveDefaultCustomization(user.id);
      }
    } catch (err: any) {
      console.error('Erro ao buscar customizações do usuário:', err);
      setError(err.message);
    }
  };

  const giveDefaultCustomization = async (userId: string) => {
    try {
      // Buscar o Campo Clássico (background padrão)
      const { data: defaultCustomization, error: selectError } = await supabase
        .from('battlefield_customizations')
        .select('*')
        .eq('name', 'Campo Clássico')
        .single();

      if (selectError) throw selectError;

      // Dar o Campo Clássico ao usuário e equipar automaticamente
      const { data, error } = await supabase
        .from('user_customizations')
        .insert({
          user_id: userId,
          customization_id: defaultCustomization.id,
          is_equipped: true
        })
        .select();

      if (error) throw error;

      // Recarregar customizações do usuário
      await fetchUserCustomizations();

      return data && data.length > 0 ? data[0] : null;
    } catch (err: any) {
      console.error('Erro ao dar customização padrão:', err);
      setError(err.message);
    }
  };

  const purchaseCustomization = async (customizationId: string, purchaseType: 'coins' | 'gems' | 'real_money' = 'coins') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Verificar se já possui a customização
      const existing = userCustomizations.find(uc => uc.customization_id === customizationId);
      if (existing) {
        throw new Error('Você já possui esta customização');
      }

      // Buscar informações da customização
      const customization = customizations.find(c => c.id === customizationId);
      if (!customization) {
        throw new Error('Customização não encontrada');
      }

      // Verificar se é uma customização premium
      const isPremium = customization.is_special;
      
      if (isPremium) {
        // Para backgrounds premium, verificar se o usuário tem moedas/gemas suficientes
        const { data: currencyData, error: currencyError } = await supabase
          .from('player_currency')
          .select('coins, gems')
          .eq('player_id', user.id)
          .single();

        if (currencyError) throw currencyError;

        const currentCoins = currencyData?.coins || 0;
        const currentGems = currencyData?.gems || 0;

        if (purchaseType === 'coins' && customization.price_coins && currentCoins < customization.price_coins) {
          throw new Error(`Moedas insuficientes. Você tem ${currentCoins} moedas, mas precisa de ${customization.price_coins} moedas.`);
        }

        if (purchaseType === 'gems' && customization.price_gems && currentGems < customization.price_gems) {
          throw new Error(`Gemas insuficientes. Você tem ${currentGems} gemas, mas precisa de ${customization.price_gems} gemas.`);
        }

        // Deduzir moedas/gemas
        const updateData: any = {};
        if (purchaseType === 'coins' && customization.price_coins) {
          updateData.coins = currentCoins - customization.price_coins;
        }
        if (purchaseType === 'gems' && customization.price_gems) {
          updateData.gems = currentGems - customization.price_gems;
        }

        if (Object.keys(updateData).length > 0) {
          const { error: updateError } = await supabase
            .from('player_currency')
            .update(updateData)
            .eq('player_id', user.id);

          if (updateError) throw updateError;
        }

        // Registrar a compra na tabela de background_purchases
        const purchaseData: any = {
          user_id: user.id,
          background_id: customizationId,
          purchase_type: purchaseType,
          amount_paid: purchaseType === 'coins' ? customization.price_coins : customization.price_gems,
          currency_used: purchaseType
        };

        if (purchaseType === 'real_money') {
          purchaseData.real_money_amount = customization.price_coins ? customization.price_coins / 100 : 0;
        }

        const { error: purchaseError } = await supabase
          .from('background_purchases')
          .insert(purchaseData);

        if (purchaseError) throw purchaseError;
      }

      // Adicionar à coleção do usuário
      const { data, error } = await supabase
        .from('user_customizations')
        .insert({
          user_id: user.id,
          customization_id: customizationId,
          is_equipped: false
        })
        .select();

      if (error) throw error;

      // Recarregar customizações do usuário
      await fetchUserCustomizations();

      return data && data.length > 0 ? data[0] : null;
    } catch (err: any) {
      console.error('Erro ao comprar customização:', err);
      setError(err.message);
      throw err;
    }
  };

  const equipCustomization = async (customizationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Desequipar todas as customizações
      await supabase
        .from('user_customizations')
        .update({ is_equipped: false })
        .eq('user_id', user.id);

      // Equipar a nova customização
      const { data, error } = await supabase
        .from('user_customizations')
        .update({ is_equipped: true })
        .eq('user_id', user.id)
        .eq('customization_id', customizationId)
        .select();

      if (error) throw error;

      // Recarregar customizações do usuário
      await fetchUserCustomizations();

      return data && data.length > 0 ? data[0] : null;
    } catch (err: any) {
      console.error('Erro ao equipar customização:', err);
      setError(err.message);
      throw err;
    }
  };

  const getCurrentBackground = () => {
    if (equippedCustomization && equippedCustomization.image_url) {
      return equippedCustomization.image_url;
    }
    // Retornar background padrão
    return '/src/assets/boards_backgrounds/grid-board-background.jpg';
  };

  const isAnimatedBackground = (backgroundUrl: string) => {
    return backgroundUrl?.includes('.mp4') || backgroundUrl?.includes('animated');
  };

  const getCurrentBackgroundType = () => {
    if (equippedCustomization && equippedCustomization.image_url) {
      return isAnimatedBackground(equippedCustomization.image_url) ? 'video' : 'image';
    }
    return 'image';
  };

  const getPremiumBackgrounds = () => {
    return customizations.filter(c => c.is_special && c.is_active !== false);
  };

  const getFreeBackgrounds = () => {
    return customizations.filter(c => !c.is_special && c.is_active !== false);
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Executar todas as funções de busca em paralelo
        await Promise.all([
          fetchCustomizations(),
          fetchUserCustomizations()
        ]);
      } catch (err: any) {
        console.error('Erro ao inicializar dados de battlefield:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  return {
    customizations,
    userCustomizations,
    equippedCustomization,
    loading,
    error,
    fetchCustomizations,
    fetchUserCustomizations,
    purchaseCustomization,
    equipCustomization,
    getCurrentBackground,
    getCurrentBackgroundType,
    isAnimatedBackground,
    getPremiumBackgrounds,
    getFreeBackgrounds
  };
}; 