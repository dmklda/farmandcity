import { supabase } from '../integrations/supabase/client';

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

export class AchievementService {
  // Verificar e atualizar progresso de todas as conquistas do jogador
  static async checkAndUpdateAchievements(playerId: string): Promise<{
    newlyCompleted: string[];
    updatedProgress: PlayerAchievement[];
  }> {
    try {
      // Buscar estatísticas do jogador
      const { data: playerStats, error: statsError } = await supabase
        .from('player_stats')
        .select('*')
        .eq('player_id', playerId)
        .single();

      if (statsError) throw statsError;

      // Buscar todas as conquistas ativas
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true);

      if (achievementsError) throw achievementsError;

      // Buscar conquistas do jogador
      const { data: playerAchievements, error: playerAchievementsError } = await supabase
        .from('player_achievements')
        .select('*')
        .eq('player_id', playerId);

      if (playerAchievementsError) throw playerAchievementsError;

      const newlyCompleted: string[] = [];
      const updatedProgress: PlayerAchievement[] = [];

      for (const achievement of achievements) {
        const currentProgress = this.calculateProgress(achievement, playerStats);
        const existingPlayerAchievement = playerAchievements?.find(
          pa => pa.achievement_id === achievement.id
        );

        const isCompleted = currentProgress >= achievement.requirement_value;
        const wasCompleted = existingPlayerAchievement?.is_completed || false;

        if (!existingPlayerAchievement) {
          // Criar nova conquista do jogador
          const { data: newPlayerAchievement, error: createError } = await supabase
            .from('player_achievements')
            .insert({
              player_id: playerId,
              achievement_id: achievement.id,
              progress: currentProgress,
              is_completed: isCompleted
            })
            .select()
            .single();

          if (!createError && newPlayerAchievement) {
            updatedProgress.push(newPlayerAchievement);
            if (isCompleted) {
              newlyCompleted.push(achievement.title);
              await this.giveRewards(playerId, achievement);
            }
          }
        } else if (existingPlayerAchievement.progress !== currentProgress) {
          // Atualizar progresso existente
          const { data: updatedPlayerAchievement, error: updateError } = await supabase
            .from('player_achievements')
            .update({
              progress: currentProgress,
              is_completed: isCompleted
            })
            .eq('id', existingPlayerAchievement.id)
            .select()
            .single();

          if (!updateError && updatedPlayerAchievement) {
            updatedProgress.push(updatedPlayerAchievement);
            
            // Se acabou de completar, dar recompensas
            if (isCompleted && !wasCompleted) {
              newlyCompleted.push(achievement.title);
              await this.giveRewards(playerId, achievement);
            }
          }
        }
      }

      return { newlyCompleted, updatedProgress };
    } catch (error: any) {
      console.error('Error checking achievements:', error);
      return { newlyCompleted: [], updatedProgress: [] };
    }
  }

  // Calcular progresso baseado no tipo de conquista
  private static calculateProgress(achievement: Achievement, playerStats: any): number {
    switch (achievement.type) {
      case 'cards_collected':
        return playerStats.cards_collected || 0;
      
      case 'decks_created':
        return playerStats.decks_created || 0;
      
      case 'games_won':
        return playerStats.games_won || 0;
      
      case 'farms_built':
        // Contar cartas de fazenda na coleção (aproximação)
        return Math.floor((playerStats.cards_collected || 0) / 10);
      
      case 'cities_built':
        // Contar cartas de cidade na coleção (aproximação)
        return Math.floor((playerStats.cards_collected || 0) / 20);
      
      case 'max_level':
        return playerStats.level || 1;
      
      case 'experience':
        return playerStats.experience_points || 0;
      
      default:
        return 0;
    }
  }

  // Dar recompensas ao jogador
  private static async giveRewards(playerId: string, achievement: Achievement): Promise<void> {
    try {
      const updates: any = {
        achievements_earned: 1, // Incrementar
        updated_at: new Date().toISOString()
      };

      if (achievement.reward_coins > 0) {
        updates.coins = achievement.reward_coins; // Incrementar moedas
      }

      if (achievement.reward_gems > 0) {
        updates.gems = achievement.reward_gems; // Incrementar gemas
      }

      // Atualizar estatísticas do jogador
      await supabase
        .from('player_stats')
        .update(updates)
        .eq('player_id', playerId);

      // Se há recompensas de moedas/gemas, atualizar também a tabela de moedas do jogador
      if (achievement.reward_coins > 0 || achievement.reward_gems > 0) {
        // Buscar moedas atuais do jogador
        const { data: currentCurrency } = await supabase
          .from('player_currency')
          .select('coins, gems')
          .eq('player_id', playerId)
          .single();

        if (currentCurrency) {
          // Atualizar moedas existentes
          await supabase
            .from('player_currency')
            .update({
              coins: (currentCurrency.coins || 0) + achievement.reward_coins,
              gems: (currentCurrency.gems || 0) + achievement.reward_gems,
              updated_at: new Date().toISOString()
            })
            .eq('player_id', playerId);
        } else {
          // Criar entrada de moedas se não existir
          await supabase
            .from('player_currency')
            .insert({
              player_id: playerId,
              coins: achievement.reward_coins,
              gems: achievement.reward_gems
            });
        }
      }
    } catch (error: any) {
      console.error('Error giving rewards:', error);
    }
  }

  // Buscar conquistas do jogador
  static async getPlayerAchievements(playerId: string): Promise<PlayerAchievement[]> {
    try {
      const { data, error } = await supabase
        .from('player_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('player_id', playerId);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching player achievements:', error);
      return [];
    }
  }

  // Buscar todas as conquistas ativas
  static async getActiveAchievements(): Promise<Achievement[]> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('requirement_value', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  }

  // Verificar se uma conquista específica foi completada
  static async isAchievementCompleted(playerId: string, achievementId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('player_achievements')
        .select('is_completed')
        .eq('player_id', playerId)
        .eq('achievement_id', achievementId)
        .single();

      if (error) return false;
      return data?.is_completed || false;
    } catch (error: any) {
      console.error('Error checking achievement completion:', error);
      return false;
    }
  }

  // Forçar verificação de conquistas (útil após ações específicas)
  static async forceCheckAchievements(playerId: string): Promise<void> {
    try {
      await this.checkAndUpdateAchievements(playerId);
    } catch (error: any) {
      console.error('Error forcing achievement check:', error);
    }
  }
} 