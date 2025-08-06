import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface GlobalAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'update' | 'maintenance' | 'event' | 'news' | 'warning' | 'info';
  icon: string;
  color: 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'yellow';
  is_active: boolean;
  priority: 1 | 2 | 3 | 4;
  show_on_homepage: boolean;
  show_in_game: boolean;
  dismissible: boolean;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface UserAnnouncementView {
  id: string;
  user_id: string;
  announcement_id: string;
  viewed_at: string;
  dismissed: boolean;
  dismissed_at?: string;
}

export const useGlobalAnnouncements = (location: 'homepage' | 'game' = 'homepage') => {
  const [announcements, setAnnouncements] = useState<GlobalAnnouncement[]>([]);
  const [userViews, setUserViews] = useState<UserAnnouncementView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date().toISOString();
      
      // Buscar anúncios ativos
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('global_announcements')
        .select('*')
        .eq('is_active', true)
        .eq(location === 'homepage' ? 'show_on_homepage' : 'show_in_game', true)
        .lte('start_date', now)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (announcementsError) throw announcementsError;

      // Buscar visualizações do usuário
      const { data: viewsData, error: viewsError } = await supabase
        .from('user_announcement_views')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '');

      if (viewsError) throw viewsError;

      setAnnouncements((announcementsData || []) as GlobalAnnouncement[]);
      setUserViews((viewsData || []) as UserAnnouncementView[]);
    } catch (err) {
      console.error('Erro ao carregar anúncios globais:', err);
      setError('Erro ao carregar anúncios');
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = async (announcementId: string) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      // Verificar se já existe um registro
      const existingView = userViews.find(view => view.announcement_id === announcementId);
      
      if (existingView) {
        // Se já foi visualizado, não fazer nada
        if (existingView.viewed_at && !existingView.dismissed) {
          return;
        }
        
        // Atualizar registro existente
        const { error } = await supabase
          .from('user_announcement_views')
          .update({ 
            viewed_at: new Date().toISOString(),
            dismissed: false,
            dismissed_at: null
          })
          .eq('id', existingView.id);

        if (error) throw error;
      } else {
        // Criar novo registro
        const { error } = await supabase
          .from('user_announcement_views')
          .insert({
            user_id: userId,
            announcement_id: announcementId,
            viewed_at: new Date().toISOString(),
            dismissed: false
          });

        if (error) throw error;
      }

      // Atualizar estado local sem recarregar tudo
      const newView: UserAnnouncementView = {
        id: existingView?.id || `temp-${Date.now()}`,
        user_id: userId,
        announcement_id: announcementId,
        viewed_at: new Date().toISOString(),
        dismissed: false,
        dismissed_at: undefined
      };

      setUserViews(prev => {
        const filtered = prev.filter(view => view.announcement_id !== announcementId);
        return [...filtered, newView];
      });
    } catch (err) {
      console.error('Erro ao marcar anúncio como visualizado:', err);
    }
  };

  const dismissAnnouncement = async (announcementId: string) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      const existingView = userViews.find(view => view.announcement_id === announcementId);
      
      if (existingView) {
        // Atualizar registro existente
        const { error } = await supabase
          .from('user_announcement_views')
          .update({ 
            dismissed: true,
            dismissed_at: new Date().toISOString()
          })
          .eq('id', existingView.id);

        if (error) throw error;
      } else {
        // Criar novo registro
        const { error } = await supabase
          .from('user_announcement_views')
          .insert({
            user_id: userId,
            announcement_id: announcementId,
            viewed_at: new Date().toISOString(),
            dismissed: true,
            dismissed_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      // Atualizar estado local sem recarregar tudo
      const newView: UserAnnouncementView = {
        id: existingView?.id || `temp-${Date.now()}`,
        user_id: userId,
        announcement_id: announcementId,
        viewed_at: new Date().toISOString(),
        dismissed: true,
        dismissed_at: new Date().toISOString()
      };

      setUserViews(prev => {
        const filtered = prev.filter(view => view.announcement_id !== announcementId);
        return [...filtered, newView];
      });
    } catch (err) {
      console.error('Erro ao dispensar anúncio:', err);
    }
  };

  // Filtrar anúncios baseado em visualizações e configurações
  const getVisibleAnnouncements = () => {
    return announcements.filter(announcement => {
      const userView = userViews.find(view => view.announcement_id === announcement.id);
      
      // Se o anúncio não é dispensável, sempre mostrar
      if (!announcement.dismissible) return true;
      
      // Se não há visualização, mostrar
      if (!userView) return true;
      
      // Se foi dispensado, não mostrar
      if (userView.dismissed) return false;
      
      // Mostrar se foi visualizado mas não dispensado
      return true;
    });
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [location]);

  return {
    announcements: getVisibleAnnouncements(),
    allAnnouncements: announcements,
    userViews,
    loading,
    error,
    markAsViewed,
    dismissAnnouncement,
    refetch: fetchAnnouncements
  };
}; 