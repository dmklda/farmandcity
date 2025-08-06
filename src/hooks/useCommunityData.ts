import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface CommunityDiscussion {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  replies_count: number;
  likes_count: number;
  views_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  is_hot: boolean;
}

export interface CommunityStats {
  active_players: number;
  games_today: number;
  cards_created: number;
  decks_shared: number;
}

export interface TopContributor {
  id: string;
  name: string;
  avatar: string;
  contributions: number;
  level: number;
  specialty: string;
}

export const useCommunityData = () => {
  const [discussions, setDiscussions] = useState<CommunityDiscussion[]>([]);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [contributors, setContributors] = useState<TopContributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunityStats = useCallback(async () => {
    try {
      // Mock data por enquanto - será implementado com dados reais posteriormente
      setStats({
        active_players: 1247,
        games_today: 5892,
        cards_created: 89234,
        decks_shared: 12456
      });
    } catch (err: any) {
      console.error('Error fetching community stats:', err);
    }
  }, []);

  const fetchDiscussions = useCallback(async () => {
    try {
      // Mock data por enquanto - será implementado com dados reais posteriormente
      const mockDiscussions: CommunityDiscussion[] = [
        {
          id: '1',
          title: 'Melhor estratégia para deck de fazenda?',
          content: 'Estou tentando criar um deck focado em produção de recursos. Alguém tem dicas?',
          author_id: 'user1',
          author_name: 'FazendeiroPro',
          author_avatar: '🚜',
          replies_count: 24,
          likes_count: 156,
          views_count: 892,
          tags: ['Estratégia', 'Fazenda'],
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          is_hot: true
        },
        {
          id: '2',
          title: 'Novas cartas lendárias são muito poderosas?',
          content: 'As últimas cartas lendárias parecem estar desbalanceadas. O que vocês acham?',
          author_id: 'user2',
          author_name: 'MestreCartas',
          author_avatar: '🃏',
          replies_count: 18,
          likes_count: 89,
          views_count: 567,
          tags: ['Discussão', 'Balanceamento'],
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          is_hot: false
        },
        {
          id: '3',
          title: 'Como melhorar minha coleção rapidamente?',
          content: 'Sou novo no jogo e quero expandir minha coleção. Algumas dicas?',
          author_id: 'user3',
          author_name: 'Colecionador',
          author_avatar: '⭐',
          replies_count: 31,
          likes_count: 203,
          views_count: 1245,
          tags: ['Dicas', 'Coleção'],
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          is_hot: true
        },
        {
          id: '4',
          title: 'Evento de verão foi incrível!',
          content: 'Participar do evento de verão foi uma experiência fantástica!',
          author_id: 'user4',
          author_name: 'EventLover',
          author_avatar: '🎉',
          replies_count: 42,
          likes_count: 278,
          views_count: 1567,
          tags: ['Eventos', 'Feedback'],
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          is_hot: true
        }
      ];
      
      setDiscussions(mockDiscussions);
    } catch (err: any) {
      console.error('Error fetching discussions:', err);
    }
  }, []);

  const fetchTopContributors = useCallback(async () => {
    try {
      // Mock data por enquanto - será implementado com dados reais posteriormente
      const mockContributors: TopContributor[] = [
        { id: '1', name: 'ImperadorMax', avatar: '👑', contributions: 156, level: 25, specialty: 'Estratégia' },
        { id: '2', name: 'ConstrutorPro', avatar: '🏗️', contributions: 134, level: 23, specialty: 'Construção' },
        { id: '3', name: 'FazendeiroElite', avatar: '🚜', contributions: 98, level: 22, specialty: 'Agricultura' },
        { id: '4', name: 'MestreCartas', avatar: '🃏', contributions: 87, level: 21, specialty: 'Coleção' },
        { id: '5', name: 'Estrategista', avatar: '⚔️', contributions: 76, level: 20, specialty: 'Táticas' }
      ];
      
      setContributors(mockContributors);
    } catch (err: any) {
      console.error('Error fetching contributors:', err);
    }
  }, []);

  const getHotDiscussions = useCallback(() => {
    return discussions.filter(d => d.is_hot);
  }, [discussions]);

  const getRecentDiscussions = useCallback(() => {
    return discussions
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [discussions]);

  const formatTimeAgo = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchCommunityStats(),
          fetchDiscussions(),
          fetchTopContributors()
        ]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchCommunityStats, fetchDiscussions, fetchTopContributors]);

  return {
    discussions,
    stats,
    contributors,
    loading,
    error,
    getHotDiscussions,
    getRecentDiscussions,
    formatTimeAgo,
    refreshData: () => {
      fetchCommunityStats();
      fetchDiscussions();
      fetchTopContributors();
    }
  };
}; 