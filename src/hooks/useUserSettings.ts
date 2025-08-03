import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface UserSettings {
  id: string;
  user_id: string | null;
  username: string | null;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  theme: string | null;
  language: string | null;
  notifications_enabled: boolean | null;
  sound_enabled: boolean | null;
  music_enabled: boolean | null;
  auto_save_enabled: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface BattlefieldCustomization {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
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

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [customizations, setCustomizations] = useState<BattlefieldCustomization[]>([]);
  const [userCustomizations, setUserCustomizations] = useState<UserCustomization[]>([]);
  const [equippedCustomization, setEquippedCustomization] = useState<BattlefieldCustomization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      // Primeiro, verificar se existem configurações para o usuário
      const { data: existingSettings, error: selectError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id);

      if (selectError) {
        throw selectError;
      }

      if (existingSettings && existingSettings.length > 0) {
        // Se existem configurações, usar a primeira (deve ser única devido à constraint)
        setSettings(existingSettings[0]);
      } else {
        // Criar configurações padrão se não existirem
        const defaultSettings: Partial<UserSettings> = {
          user_id: user.id,
          theme: 'dark',
          language: 'pt-BR',
          notifications_enabled: true,
          sound_enabled: true,
          music_enabled: true,
          auto_save_enabled: true,
        };

        const { data: newSettings, error: insertError } = await supabase
          .from('user_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (insertError) throw insertError;
        setSettings(newSettings);
      }
    } catch (err: any) {
      console.error('Erro ao buscar configurações:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserSettings = async (updates: Partial<UserSettings>) => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      // Primeiro, verificar se existem configurações para o usuário
      const { data: existingSettings, error: selectError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id);

      if (selectError) {
        throw selectError;
      }

      let updatedSettings;

      if (existingSettings && existingSettings.length > 0) {
        // Atualizar configurações existentes
        const { data, error } = await supabase
          .from('user_settings')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .select();

        if (error) throw error;
        updatedSettings = data && data.length > 0 ? data[0] : null;
      } else {
        // Criar novas configurações se não existirem
        const defaultSettings: Partial<UserSettings> = {
          user_id: user.id,
          theme: 'dark',
          language: 'pt-BR',
          notifications_enabled: true,
          sound_enabled: true,
          music_enabled: true,
          auto_save_enabled: true,
          ...updates
        };

        const { data, error } = await supabase
          .from('user_settings')
          .insert(defaultSettings)
          .select();

        if (error) throw error;
        updatedSettings = data && data.length > 0 ? data[0] : null;
      }

      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err: any) {
      console.error('Erro ao atualizar configurações:', err);
      setError(err.message);
      throw err;
    }
  };

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

  useEffect(() => {
    fetchUserSettings();
    fetchCustomizations();
    fetchUserCustomizations();
  }, []);

  return {
    settings,
    customizations,
    userCustomizations,
    equippedCustomization,
    loading,
    error,
    fetchUserSettings,
    updateUserSettings,
    fetchCustomizations,
    fetchUserCustomizations,
    purchaseCustomization,
    equipCustomization
  };
}; 