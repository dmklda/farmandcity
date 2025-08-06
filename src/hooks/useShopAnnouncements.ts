import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface ShopAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'promotion' | 'alert' | 'info' | 'warning';
  icon: string;
  color: 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'yellow';
  is_active: boolean;
  priority: 1 | 2 | 3;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export const useShopAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<ShopAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('shop_announcements')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements((data || []) as ShopAnnouncement[]);
    } catch (err) {
      console.error('Erro ao carregar avisos:', err);
      setError('Erro ao carregar avisos da loja');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return {
    announcements,
    loading,
    error,
    refetch: fetchAnnouncements
  };
}; 