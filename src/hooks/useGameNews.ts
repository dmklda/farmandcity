import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface GameNews {
  id: string;
  title: string;
  content: string;
  type: 'update' | 'announcement' | 'maintenance' | 'feature' | 'balance';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export const useGameNews = () => {
  const [news, setNews] = useState<GameNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('game_news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getNewsByType = useCallback((type: GameNews['type']) => {
    return news.filter(item => item.type === type);
  }, [news]);

  const getNewsByPriority = useCallback((priority: GameNews['priority']) => {
    return news.filter(item => item.priority === priority);
  }, [news]);

  const getLatestNews = useCallback((limit: number = 5) => {
    return news.slice(0, limit);
  }, [news]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    news,
    loading,
    error,
    getNewsByType,
    getNewsByPriority,
    getLatestNews,
    refreshNews: fetchNews
  };
}; 