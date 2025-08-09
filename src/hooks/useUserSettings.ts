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
  // Novos campos de perfil
  bio: string | null;
  location: string | null;
  birth_date: string | null;
  gender: string | null;
  website_url: string | null;
  social_media: any | null;
  timezone: string | null;
  date_format: string | null;
  time_format: string | null;
  privacy_level: string | null;
  email_notifications: any | null;
  push_notifications: any | null;
  game_preferences: any | null;
  accessibility_settings: any | null;
  last_login: string | null;
  login_count: number | null;
  account_status: string | null;
  email_verified: boolean | null;
  phone_number: string | null;
  phone_verified: boolean | null;
  two_factor_enabled: boolean | null;
  preferred_language: string | null;
  preferred_currency: string | null;
  profile_completion_percentage: number | null;
  last_password_change: string | null;
  password_change_count: number | null;
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      console.log('fetchUserSettings: User authenticated:', user.id);

      // Primeiro, verificar se existem configurações para o usuário
      const { data: existingSettings, error: selectError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id);

      if (selectError) {
        throw selectError;
      }

      console.log('fetchUserSettings: Existing settings:', existingSettings);

      if (existingSettings && existingSettings.length > 0) {
        // Se existem configurações, usar a primeira (deve ser única devido à constraint)
        console.log('fetchUserSettings: Using existing settings, is_admin:', existingSettings[0].game_preferences?.is_admin);
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
          // Novos campos com valores padrão
          timezone: 'America/Sao_Paulo',
          date_format: 'DD/MM/YYYY',
          time_format: '24h',
          privacy_level: 'public',
          email_notifications: {
            marketing: true,
            updates: true,
            security: true,
            achievements: true,
            missions: true,
            events: true
          },
          push_notifications: {
            game_alerts: true,
            friend_requests: true,
            achievements: true,
            missions: true,
            events: true
          },
          game_preferences: {
            difficulty: 'normal',
            auto_save_interval: 5,
            show_tutorials: true,
            show_hints: true,
            confirm_actions: true,
            victoryMode: 'landmarks',
            victoryValue: 3
          },
          accessibility_settings: {
            high_contrast: false,
            large_text: false,
            reduced_motion: false,
            screen_reader: false
          },
          account_status: 'active',
          email_verified: false,
          phone_verified: false,
          two_factor_enabled: false,
          preferred_language: 'pt-BR',
          preferred_currency: 'BRL',
          profile_completion_percentage: 0,
          social_media: {}
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

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      // Alterar senha usando Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      // Registrar a alteração no histórico
      const { error: historyError } = await supabase.rpc('change_user_password', {
        user_uuid: user.id,
        current_password: currentPassword,
        new_password: newPassword
      });

      if (historyError) {
        console.warn('Erro ao registrar histórico de senha:', historyError);
      }

      return { success: true };
    } catch (err: any) {
      console.error('Erro ao alterar senha:', err);
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Carregar dados com delays escalonados para não bloquear a UI
        setTimeout(async () => {
          await fetchUserSettings();
        }, 10);
        
        setTimeout(async () => {
          await fetchCustomizations();
        }, 30);
        
        setTimeout(async () => {
          await fetchUserCustomizations();
          setLoading(false);
        }, 50);
      } catch (err: any) {
        console.error('Erro ao inicializar dados:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initializeData();
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
    equipCustomization,
    changePassword
  };
}; 