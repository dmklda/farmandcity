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
        .order('rarity', { ascending: false });

      if (error) throw error;
      setCustomizations(data || []);
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
      }
    } catch (err: any) {
      console.error('Erro ao buscar customizações do usuário:', err);
      setError(err.message);
    }
  };

  const initializeUserCustomizations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Verificar se o usuário já tem customizações
      const { data: existingCustomizations, error: checkError } = await supabase
        .from('user_customizations')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (checkError) throw checkError;

      // Se não tem nenhuma customização, dar o Campo Clássico
      if (!existingCustomizations || existingCustomizations.length === 0) {
        await giveDefaultCustomization(user.id);
      }
    } catch (err: any) {
      console.error('Erro ao inicializar customizações do usuário:', err);
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

  const purchaseCustomization = async (customizationId: string) => {
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

      // Aqui você implementaria a lógica de compra (verificar moedas/gems)
      // Por enquanto, vamos apenas adicionar à coleção do usuário

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

  useEffect(() => {
    const initialize = async () => {
      await fetchCustomizations();
      await initializeUserCustomizations();
      await fetchUserCustomizations();
    };
    
    initialize();
  }, []);

  return {
    customizations,
    userCustomizations,
    equippedCustomization,
    loading,
    error,
    fetchCustomizations,
    fetchUserCustomizations,
    initializeUserCustomizations,
    purchaseCustomization,
    equipCustomization,
    getCurrentBackground
  };
}; 