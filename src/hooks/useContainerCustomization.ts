import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface ContainerCustomization {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  container_type: 'city' | 'farm' | 'landmark' | 'events';
  rarity: string | null;
  price_coins: number | null;
  price_gems: number | null;
  currency_type: string | null;
  is_active: boolean | null;
  is_special: boolean | null;
  created_at: string | null;
}

export interface UserContainerCustomization {
  id: string;
  user_id: string | null;
  customization_id: string | null;
  container_type: 'city' | 'farm' | 'landmark' | 'events';
  is_equipped: boolean | null;
  purchased_at: string | null;
  customization?: ContainerCustomization | null;
}

export const useContainerCustomization = () => {
  const [customizations, setCustomizations] = useState<ContainerCustomization[]>([]);
  const [userCustomizations, setUserCustomizations] = useState<UserContainerCustomization[]>([]);
  const [equippedCustomizations, setEquippedCustomizations] = useState<Record<string, ContainerCustomization | null>>({
    city: null,
    farm: null,
    landmark: null,
    events: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomizations = async () => {
    try {
      const { data, error } = await supabase
        .from('container_customizations')
        .select('*')
        .eq('is_active', true)
        .order('rarity', { ascending: false });

      if (error) throw error;
      setCustomizations(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar customizações de containers:', err);
      setError(err.message);
    }
  };

  const fetchUserCustomizations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_container_customizations')
        .select(`
          *,
          customization:container_customizations(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const customizations = data || [];
      setUserCustomizations(customizations);

      // Encontrar customizações equipadas por tipo
      const equipped: Record<string, ContainerCustomization | null> = {
        city: null,
        farm: null,
        landmark: null,
        events: null
      };

      customizations.forEach(uc => {
        if (uc.is_equipped && uc.customization) {
          equipped[uc.container_type] = uc.customization;
        }
      });

      setEquippedCustomizations(equipped);
    } catch (err: any) {
      console.error('Erro ao buscar customizações de containers do usuário:', err);
      setError(err.message);
    }
  };

  const purchaseCustomization = async (customizationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar informações da customização
      const customization = customizations.find(c => c.id === customizationId);
      if (!customization) {
        throw new Error('Customização não encontrada');
      }

      // Verificar se já possui a customização
      const existing = userCustomizations.find(uc => 
        uc.customization_id === customizationId && 
        uc.container_type === customization.container_type
      );
      if (existing) {
        throw new Error('Você já possui esta customização');
      }

      const { data, error } = await supabase
        .from('user_container_customizations')
        .insert({
          user_id: user.id,
          customization_id: customizationId,
          container_type: customization.container_type,
          is_equipped: false
        })
        .select();

      if (error) throw error;

      // Recarregar customizações do usuário
      await fetchUserCustomizations();

      return data && data.length > 0 ? data[0] : null;
    } catch (err: any) {
      console.error('Erro ao comprar customização de container:', err);
      setError(err.message);
      throw err;
    }
  };

  const equipCustomization = async (customizationId: string, containerType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Desequipar todas as customizações do mesmo tipo
      await supabase
        .from('user_container_customizations')
        .update({ is_equipped: false })
        .eq('user_id', user.id)
        .eq('container_type', containerType);

      // Equipar a nova customização
      const { data, error } = await supabase
        .from('user_container_customizations')
        .update({ is_equipped: true })
        .eq('user_id', user.id)
        .eq('customization_id', customizationId)
        .select();

      if (error) throw error;

      // Recarregar customizações do usuário
      await fetchUserCustomizations();

      return data && data.length > 0 ? data[0] : null;
    } catch (err: any) {
      console.error('Erro ao equipar customização de container:', err);
      setError(err.message);
      throw err;
    }
  };

  const getCurrentContainerBackground = (containerType: string) => {
    const equipped = equippedCustomizations[containerType as keyof typeof equippedCustomizations];
    if (equipped && equipped.image_url) {
      return equipped.image_url;
    }
    
    // Retornar background padrão baseado no tipo
    switch (containerType) {
      case 'city':
        return '/src/assets/grids_background/City_background.png';
      case 'farm':
        return '/src/assets/grids_background/Farm_background.png';
      case 'landmark':
        return '/src/assets/grids_background/Landmark_background.png';
      case 'events':
        return '/src/assets/grids_background/Events_background.png';
      default:
        return '/src/assets/grids_background/City_background.png';
    }
  };

  useEffect(() => {
    fetchCustomizations();
    fetchUserCustomizations();
  }, []);

  return {
    customizations,
    userCustomizations,
    equippedCustomizations,
    loading,
    error,
    fetchCustomizations,
    fetchUserCustomizations,
    purchaseCustomization,
    equipCustomization,
    getCurrentContainerBackground
  };
}; 