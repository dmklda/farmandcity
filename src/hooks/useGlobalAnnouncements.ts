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
  
  // Controlar operações em andamento para evitar condições de corrida
  const [operationsInProgress, setOperationsInProgress] = useState<Set<string>>(new Set());

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
    // Verificar se a operação já está em andamento
    if (operationsInProgress.has(announcementId)) {
      return;
    }

    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      // Marcar operação como em andamento
      setOperationsInProgress(prev => new Set([...prev, announcementId]));

      // Verificar se já foi marcado como visualizado para evitar chamadas desnecessárias
      const existingView = userViews.find(view => 
        view.announcement_id === announcementId && 
        view.viewed_at && 
        !view.dismissed
      );
      
      if (existingView) {
        return; // Já foi visualizado e não foi dispensado
      }

      // Usar UPSERT para evitar erros de constraint única
      const { error } = await supabase
        .from('user_announcement_views')
        .upsert({
          user_id: userId,
          announcement_id: announcementId,
          viewed_at: new Date().toISOString(),
          dismissed: false,
          dismissed_at: undefined
        }, {
          onConflict: 'user_id,announcement_id'
        });

      if (error) throw error;

      // Atualizar estado local de forma mais segura
      setUserViews(prev => {
        // Verificar se já existe uma visualização para este anúncio
        const existingIndex = prev.findIndex(view => view.announcement_id === announcementId);
        
        if (existingIndex >= 0) {
          // Atualizar visualização existente
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            viewed_at: new Date().toISOString(),
            dismissed: false,
            dismissed_at: undefined
          };
          return updated;
        } else {
          // Adicionar nova visualização
          const newView: UserAnnouncementView = {
            id: `temp-${Date.now()}`,
            user_id: userId,
            announcement_id: announcementId,
            viewed_at: new Date().toISOString(),
            dismissed: false,
            dismissed_at: undefined
          };
          return [...prev, newView];
        }
      });
    } catch (err) {
      console.error('Erro ao marcar anúncio como visualizado:', err);
    } finally {
      // Remover operação da lista de operações em andamento
      setOperationsInProgress(prev => {
        const newSet = new Set(prev);
        newSet.delete(announcementId);
        return newSet;
      });
    }
  };

  const dismissAnnouncement = async (announcementId: string) => {
    // Verificar se a operação já está em andamento
    if (operationsInProgress.has(announcementId)) {
      return;
    }

    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      // Marcar operação como em andamento
      setOperationsInProgress(prev => new Set([...prev, announcementId]));

      // Verificar se já foi dispensado para evitar chamadas desnecessárias
      const existingView = userViews.find(view => 
        view.announcement_id === announcementId && 
        view.dismissed
      );
      
      if (existingView) {
        return; // Já foi dispensado
      }

      // Usar UPSERT para evitar erros de constraint única
      const { error } = await supabase
        .from('user_announcement_views')
        .upsert({
          user_id: userId,
          announcement_id: announcementId,
          viewed_at: new Date().toISOString(),
          dismissed: true,
          dismissed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,announcement_id'
        });

      if (error) throw error;

      // Atualizar estado local de forma mais segura
      setUserViews(prev => {
        // Verificar se já existe uma visualização para este anúncio
        const existingIndex = prev.findIndex(view => view.announcement_id === announcementId);
        
        if (existingIndex >= 0) {
          // Atualizar visualização existente
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            viewed_at: new Date().toISOString(),
            dismissed: true,
            dismissed_at: new Date().toISOString()
          };
          return updated;
        } else {
          // Adicionar nova visualização
          const newView: UserAnnouncementView = {
            id: `temp-${Date.now()}`,
            user_id: userId,
            announcement_id: announcementId,
            viewed_at: new Date().toISOString(),
            dismissed: true,
            dismissed_at: new Date().toISOString()
          };
          return [...prev, newView];
        }
      });
    } catch (err) {
      console.error('Erro ao dispensar anúncio:', err);
    } finally {
      // Remover operação da lista de operações em andamento
      setOperationsInProgress(prev => {
        const newSet = new Set(prev);
        newSet.delete(announcementId);
        return newSet;
      });
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