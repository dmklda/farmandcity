import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { AchievementService } from '../services/AchievementService';
import { toast } from 'sonner';

export interface PlayerStats {
  id: string;
  player_id: string;
  games_played: number;
  games_won: number;
  total_playtime_minutes: number;
  level: number;
  experience_points: number;
  achievements_earned: number;
  cards_collected: number;
  decks_created: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: string;
  requirement_value: number;
  reward_coins: number;
  reward_gems: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  is_active: boolean;
  created_at: string;
}

export interface PlayerAchievement {
  id: string;
  player_id: string;
  achievement_id: string;
  earned_at: string;
  progress: number;
  is_completed: boolean;
  achievement?: Achievement;
}

export const usePlayerStats = () => {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [playerAchievements, setPlayerAchievements] = useState<PlayerAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedAchievements, setCompletedAchievements] = useState<Set<string>>(new Set());

  const fetchStats = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .eq('player_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Criar estatísticas iniciais se não existirem
        const { data: newStats, error: createError } = await supabase
          .from('player_stats')
          .insert({
            player_id: user.id,
            games_played: 0,
            games_won: 0,
            total_playtime_minutes: 0,
            level: 1,
            experience_points: 0,
            achievements_earned: 0,
            cards_collected: 0,
            decks_created: 0
          })
          .select()
          .single();

        if (createError) throw createError;
        setStats(newStats);
      } else {
        setStats(data);
      }
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      setError(err.message);
    }
  }, []);

  const fetchAchievements = useCallback(async () => {
    try {
      const achievementsData = await AchievementService.getActiveAchievements();
      setAchievements(achievementsData);
    } catch (err: any) {
      console.error('Error fetching achievements:', err);
    }
  }, []);

  const fetchPlayerAchievements = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const playerAchievementsData = await AchievementService.getPlayerAchievements(user.id);
      setPlayerAchievements(playerAchievementsData);
    } catch (err: any) {
      console.error('Error fetching player achievements:', err);
    }
  }, []);

  const updateStats = useCallback(async (updates: Partial<PlayerStats>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !stats) return;

      const { data, error } = await supabase
        .from('player_stats')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('player_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setStats(data);
    } catch (err: any) {
      console.error('Error updating stats:', err);
      setError(err.message);
    }
  }, [stats]);

  const checkAchievements = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { newlyCompleted, updatedProgress } = await AchievementService.checkAndUpdateAchievements(user.id);
      
      // Mostrar notificações para conquistas recém-completadas
      newlyCompleted.forEach((achievementTitle) => {
        const achievement = achievements.find(a => a.title === achievementTitle);
        if (achievement) {
          // Criar mensagem de recompensa
          let rewardMessage = '';
          if (achievement.reward_coins > 0 && achievement.reward_gems > 0) {
            rewardMessage = `+${achievement.reward_coins} moedas e +${achievement.reward_gems} gemas`;
          } else if (achievement.reward_coins > 0) {
            rewardMessage = `+${achievement.reward_coins} moedas`;
          } else if (achievement.reward_gems > 0) {
            rewardMessage = `+${achievement.reward_gems} gemas`;
          }

          // Determinar cor baseada na raridade
          let toastColor = 'default';
          switch (achievement.rarity) {
            case 'common':
              toastColor = 'default';
              break;
            case 'rare':
              toastColor = 'blue';
              break;
            case 'epic':
              toastColor = 'purple';
              break;
            case 'legendary':
              toastColor = 'yellow';
              break;
          }

          // Mostrar toast de conquista
          toast.success(
            <div className="space-y-1">
              <div className="font-bold text-lg">🏆 {achievement.title}</div>
              <div className="text-sm opacity-90">{achievement.description}</div>
              {rewardMessage && (
                <div className="text-sm font-medium text-green-400">
                  Recompensa: {rewardMessage}
                </div>
              )}
            </div>,
            {
              duration: 5000,
              icon: '🎉',
              style: {
                background: toastColor === 'yellow' ? '#fef3c7' : 
                           toastColor === 'purple' ? '#f3e8ff' :
                           toastColor === 'blue' ? '#dbeafe' : '#f8fafc',
                border: toastColor === 'yellow' ? '1px solid #f59e0b' :
                        toastColor === 'purple' ? '1px solid #8b5cf6' :
                        toastColor === 'blue' ? '1px solid #3b82f6' : '1px solid #e2e8f0'
              }
            }
          );

          // Adicionar à lista de conquistas já notificadas
          setCompletedAchievements(prev => new Set(prev).add(achievement.id));
        }
      });

      // Atualizar dados locais
      await fetchStats();
      await fetchPlayerAchievements();
    } catch (err: any) {
      console.error('Error checking achievements:', err);
    }
  }, [fetchStats, fetchPlayerAchievements, achievements]);

  const getWinRate = useCallback(() => {
    if (!stats || stats.games_played === 0) return 0;
    return Math.round((stats.games_won / stats.games_played) * 100);
  }, [stats?.games_played, stats?.games_won]);

  const getPlaytimeHours = useCallback(() => {
    if (!stats) return 0;
    return Math.round(stats.total_playtime_minutes / 60);
  }, [stats?.total_playtime_minutes]);

  const getCompletedAchievements = useCallback(() => {
    return playerAchievements.filter(pa => pa.is_completed);
  }, [playerAchievements]);

  const getAchievementProgress = useCallback((achievementId: string) => {
    const playerAchievement = playerAchievements.find(pa => pa.achievement_id === achievementId);
    return playerAchievement?.progress || 0;
  }, [playerAchievements]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchStats(),
          fetchAchievements(),
          fetchPlayerAchievements()
        ]);
      } catch (err: any) {
        console.error('Error loading player stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Carregamento único sem dependências

  // Verificar conquistas quando as estatísticas mudam
  useEffect(() => {
    if (stats && achievements.length > 0) {
      checkAchievements();
    }
  }, [stats?.cards_collected, stats?.decks_created, stats?.games_won, stats?.level, stats?.experience_points, checkAchievements]);

  return {
    stats,
    achievements,
    playerAchievements,
    loading,
    error,
    updateStats,
    getWinRate,
    getPlaytimeHours,
    getCompletedAchievements,
    getAchievementProgress,
    checkAchievements,
    refreshStats: fetchStats,
    refreshAchievements: fetchAchievements,
    refreshPlayerAchievements: fetchPlayerAchievements
  };
}; 