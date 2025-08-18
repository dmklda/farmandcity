import { supabase } from '../integrations/supabase/client';

export interface Mission {
  id: string;
  name: string;
  title?: string;
  description: string;
  mission_type: 'daily' | 'weekly' | 'achievement' | 'story';
  requirements: any;
  rewards: any;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  difficulty_level?: 'easy' | 'medium' | 'hard' | 'legendary';
  is_active: boolean;
  expires_at?: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  reward_coins: number;
  reward_gems: number;
  reward_cards: any;
  is_repeatable: boolean;
  max_completions: number;
  start_date: string;
  end_date?: string;
  auto_reset: boolean;
  reset_interval?: string;
  max_daily_completions: number;
  target_audience: string;
  audience_criteria: any;
  created_at: string;
  rewards_claimed?: boolean;
  progress?: number; // For joined results
}

export interface PlayerMission {
  id: string;
  player_id: string;
  mission_id: string;
  progress: number;
  is_completed: boolean;
  completed_at?: string;
  claimed_rewards: boolean;
  created_at: string;
  updated_at: string;
  completions_count: number;
  last_progress_update: string;
}

export interface ActiveDailyMission {
  id: string;
  mission_id: string;
  day_date: string;
  is_active: boolean;
  created_at: string;
  missions?: Mission;
  name?: string;
  mission_name?: string;
  description?: string;
  progress?: number;
  requirement_value?: number;
  reward_coins?: number;
}

export interface ActiveWeeklyMission {
  id: string;
  mission_id: string;
  week_start: string;
  week_end: string;
  is_active: boolean;
  created_at: string;
  missions?: Mission;
  name?: string;
  mission_name?: string;
  description?: string;
  progress?: number;
  requirement_value?: number;
  reward_coins?: number;
}

export class MissionsService {
  // Buscar missões disponíveis
  static async getMissions(filters?: {
    mission_type?: 'daily' | 'weekly' | 'achievement' | 'story';
    difficulty?: string;
    category?: string;
    is_active?: boolean;
  }): Promise<{ success: boolean; missions?: Mission[]; error?: string }> {
    try {
      let query = supabase
        .from('missions')
        .select('*')
        .order('mission_type', { ascending: true })
        .order('difficulty', { ascending: true });

      if (filters?.mission_type) {
        query = query.eq('mission_type', filters.mission_type);
      }
      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, missions: data || [] };
    } catch (error: any) {
      console.error('Erro ao buscar missões:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar missões do jogador
  static async getPlayerMissions(): Promise<{ success: boolean; missions?: PlayerMission[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('player_missions')
        .select(`
          *,
          missions:mission_id(*)
        `)
        .eq('player_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, missions: data || [] };
    } catch (error: any) {
      console.error('Erro ao buscar missões do jogador:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar missões diárias ativas
  static async getActiveDailyMissions(): Promise<{ success: boolean; missions?: ActiveDailyMission[]; error?: string }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('active_daily_missions')
        .select(`
          *,
          missions:mission_id(*)
        `)
        .eq('day_date', today)
        .eq('is_active', true);

      if (error) throw error;

      return { success: true, missions: data || [] };
    } catch (error: any) {
      console.error('Erro ao buscar missões diárias:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar missões semanais ativas
  static async getActiveWeeklyMissions(): Promise<{ success: boolean; missions?: ActiveWeeklyMission[]; error?: string }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('active_weekly_missions')
        .select(`
          *,
          missions:mission_id(*)
        `)
        .lte('week_start', today)
        .gte('week_end', today)
        .eq('is_active', true);

      if (error) throw error;

      return { success: true, missions: data || [] };
    } catch (error: any) {
      console.error('Erro ao buscar missões semanais:', error);
      return { success: false, error: error.message };
    }
  }

  // Atribuir missão ao jogador
  static async assignMissionToPlayer(missionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Verificar se a missão já foi atribuída
      const { data: existingMission } = await supabase
        .from('player_missions')
        .select('id')
        .eq('player_id', user.id)
        .eq('mission_id', missionId)
        .single();

      if (existingMission) {
        return { success: true }; // Já atribuída
      }

      // Buscar dados da missão
      const { data: mission } = await supabase
        .from('missions')
        .select('*')
        .eq('id', missionId)
        .eq('is_active', true)
        .single();

      if (!mission) {
        return { success: false, error: 'Missão não encontrada ou inativa' };
      }

      // Verificar se o jogador atende aos critérios da missão
      if (!this.checkMissionEligibility(user.id, mission)) {
        return { success: false, error: 'Você não atende aos critérios desta missão' };
      }

      // Atribuir missão
      const { error } = await supabase
        .from('player_missions')
        .insert({
          player_id: user.id,
          mission_id: missionId,
          progress: 0,
          is_completed: false,
          claimed_rewards: false
        });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao atribuir missão:', error);
      return { success: false, error: error.message };
    }
  }

  // Atualizar progresso da missão
  static async updateMissionProgress(missionId: string, progress: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Buscar dados da missão
      const { data: mission } = await supabase
        .from('missions')
        .select('*')
        .eq('id', missionId)
        .single();

      if (!mission) {
        return { success: false, error: 'Missão não encontrada' };
      }

      // Buscar progresso atual
      const { data: playerMission } = await supabase
        .from('player_missions')
        .select('*')
        .eq('player_id', user.id)
        .eq('mission_id', missionId)
        .single();

      if (!playerMission) {
        return { success: false, error: 'Missão não atribuída ao jogador' };
      }

      if (playerMission.is_completed) {
        return { success: true }; // Já completada
      }

      const isCompleted = progress >= mission.requirement_value;

      // Atualizar progresso
      const { error } = await supabase
        .from('player_missions')
        .update({
          progress: progress,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          last_progress_update: new Date().toISOString()
        })
        .eq('player_id', user.id)
        .eq('mission_id', missionId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao atualizar progresso:', error);
      return { success: false, error: error.message };
    }
  }

  // Reivindicar recompensas da missão
  static async claimMissionRewards(missionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Buscar missão do jogador
      const { data: playerMission } = await supabase
        .from('player_missions')
        .select(`
          *,
          missions:mission_id(*)
        `)
        .eq('player_id', user.id)
        .eq('mission_id', missionId)
        .single();

      if (!playerMission) {
        return { success: false, error: 'Missão não encontrada' };
      }

      if (!playerMission.is_completed) {
        return { success: false, error: 'Missão ainda não foi completada' };
      }

      if (playerMission.claimed_rewards) {
        return { success: false, error: 'Recompensas já foram reivindicadas' };
      }

      const mission = playerMission.missions;

      // Adicionar recompensas
      if (mission.reward_coins > 0 || mission.reward_gems > 0) {
        await supabase.rpc('add_player_currency', {
          player_id: user.id,
          coins_to_add: mission.reward_coins,
          gems_to_add: mission.reward_gems
        });
      }

      // Adicionar cartas se houver
      if (mission.reward_cards && mission.reward_cards.length > 0) {
        for (const cardReward of mission.reward_cards) {
          await supabase
            .from('player_cards')
            .upsert({
              player_id: user.id,
              card_id: cardReward.card_id,
              quantity: cardReward.quantity || 1
            });
        }
      }

      // Marcar recompensas como reivindicadas
      const { error } = await supabase
        .from('player_missions')
        .update({
          claimed_rewards: true,
          updated_at: new Date().toISOString()
        })
        .eq('player_id', user.id)
        .eq('mission_id', missionId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao reivindicar recompensas:', error);
      return { success: false, error: error.message };
    }
  }

  // Verificar elegibilidade do jogador para uma missão
  private static async checkMissionEligibility(userId: string, mission: Mission): Promise<boolean> {
    try {
      switch (mission.target_audience) {
        case 'all':
          return true;
        
        case 'new_players':
          const { data: playerStats } = await supabase
            .from('player_stats')
            .select('level')
            .eq('player_id', userId)
            .single();
          return playerStats ? playerStats.level <= 10 : false;
        
        case 'veterans':
          const { data: veteranStats } = await supabase
            .from('player_stats')
            .select('level')
            .eq('player_id', userId)
            .single();
          return veteranStats ? veteranStats.level >= 20 : false;
        
        case 'specific_level':
          const { data: specificStats } = await supabase
            .from('player_stats')
            .select('level')
            .eq('player_id', userId)
            .single();
          const requiredLevel = mission.audience_criteria?.level || 1;
          return specificStats ? specificStats.level >= requiredLevel : false;
        
        default:
          return true;
      }
    } catch (error) {
      console.error('Erro ao verificar elegibilidade:', error);
      return false;
    }
  }

  // Gerar missões diárias (apenas admin)
  static async generateDailyMissions(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Verificar se é admin (implementar verificação de permissão)

      const today = new Date().toISOString().split('T')[0];

      // Buscar missões diárias disponíveis
      const { data: dailyMissions } = await supabase
        .from('missions')
        .select('*')
        .eq('mission_type', 'daily')
        .eq('is_active', true);

      if (!dailyMissions || dailyMissions.length === 0) {
        return { success: false, error: 'Nenhuma missão diária disponível' };
      }

      // Selecionar missões aleatórias (máximo 3 por dia)
      const selectedMissions = this.shuffleArray(dailyMissions).slice(0, 3);

      // Criar missões diárias ativas
      for (const mission of selectedMissions) {
        await supabase
          .from('active_daily_missions')
          .upsert({
            mission_id: mission.id,
            day_date: today,
            is_active: true
          });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao gerar missões diárias:', error);
      return { success: false, error: error.message };
    }
  }

  // Gerar missões semanais (apenas admin)
  static async generateWeeklyMissions(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Verificar se é admin (implementar verificação de permissão)

      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekStartStr = weekStart.toISOString().split('T')[0];
      const weekEndStr = weekEnd.toISOString().split('T')[0];

      // Buscar missões semanais disponíveis
      const { data: weeklyMissions } = await supabase
        .from('missions')
        .select('*')
        .eq('mission_type', 'weekly')
        .eq('is_active', true);

      if (!weeklyMissions || weeklyMissions.length === 0) {
        return { success: false, error: 'Nenhuma missão semanal disponível' };
      }

      // Selecionar missões aleatórias (máximo 5 por semana)
      const selectedMissions = this.shuffleArray(weeklyMissions).slice(0, 5);

      // Criar missões semanais ativas
      for (const mission of selectedMissions) {
        await supabase
          .from('active_weekly_missions')
          .upsert({
            mission_id: mission.id,
            week_start: weekStartStr,
            week_end: weekEndStr,
            is_active: true
          });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao gerar missões semanais:', error);
      return { success: false, error: error.message };
    }
  }

  // Resetar missões diárias
  static async resetDailyMissions(): Promise<{ success: boolean; error?: string }> {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Desativar missões diárias antigas
      await supabase
        .from('active_daily_missions')
        .update({ is_active: false })
        .lt('day_date', today);

      // Limpar progresso das missões diárias antigas
      await supabase
        .from('player_missions')
        .delete()
        .in('mission_id', 
          supabase
            .from('active_daily_missions')
            .select('mission_id')
            .lt('day_date', today)
        );

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao resetar missões diárias:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar estatísticas de missões
  static async getMissionStats(): Promise<{ success: boolean; stats?: any; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Total de missões completadas
      const { data: completedMissions } = await supabase
        .from('player_missions')
        .select('id', { count: 'exact' })
        .eq('player_id', user.id)
        .eq('is_completed', true);

      // Missões diárias completadas hoje
      const today = new Date().toISOString().split('T')[0];
      const { data: dailyMissions } = await supabase
        .from('player_missions')
        .select(`
          *,
          missions:mission_id(mission_type)
        `)
        .eq('player_id', user.id)
        .eq('is_completed', true)
        .eq('missions.mission_type', 'daily');

      const todayCompletions = dailyMissions?.filter(m => 
        m.completed_at?.startsWith(today)
      ).length || 0;

      const stats = {
        total_completed: completedMissions?.length || 0,
        daily_completed_today: todayCompletions,
        weekly_completed: 0, // Implementar contagem semanal
        achievement_missions: 0 // Implementar contagem de missões de conquista
      };

      return { success: true, stats };
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      return { success: false, error: error.message };
    }
  }

  // Função auxiliar para embaralhar array
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Admin methods
  static async createMission(missionData: {
    title: string;
    description: string;
    type: 'daily' | 'weekly' | 'global' | 'specific';
    objective: string;
    target_value: number;
    reward_coins: number;
    reward_gems: number;
    reward_cards: string[];
    difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
    category: string;
    auto_reset: boolean;
    reset_interval: 'daily' | 'weekly' | 'monthly';
    max_daily_completions: number;
    target_audience: 'all' | 'specific_level' | 'specific_class' | 'specific_region';
    audience_criteria: string;
    start_date?: string | null;
    end_date?: string | null;
    is_active: boolean;
  }): Promise<{ success: boolean; mission_id?: string; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('missions')
        .insert({
          title: missionData.title,
          description: missionData.description,
          mission_type: missionData.type,
          objective: missionData.objective,
          requirement_value: missionData.target_value,
          reward_coins: missionData.reward_coins,
          reward_gems: missionData.reward_gems,
          reward_cards: missionData.reward_cards,
          difficulty: missionData.difficulty,
          category: missionData.category,
          auto_reset: missionData.auto_reset,
          reset_interval: missionData.reset_interval,
          max_daily_completions: missionData.max_daily_completions,
          target_audience: missionData.target_audience,
          audience_criteria: missionData.audience_criteria,
          start_date: missionData.start_date,
          end_date: missionData.end_date,
          is_active: missionData.is_active,
          is_repeatable: true,
          max_completions: 1
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, mission_id: data.id };
    } catch (error: any) {
      console.error('Erro ao criar missão:', error);
      return { success: false, error: error.message };
    }
  }

  static async updateMission(missionId: string, updates: Partial<{
    title: string;
    description: string;
    type: 'daily' | 'weekly' | 'global' | 'specific';
    objective: string;
    target_value: number;
    reward_coins: number;
    reward_gems: number;
    reward_cards: string[];
    difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
    category: string;
    auto_reset: boolean;
    reset_interval: 'daily' | 'weekly' | 'monthly';
    max_daily_completions: number;
    target_audience: 'all' | 'specific_level' | 'specific_class' | 'specific_region';
    audience_criteria: string;
    start_date?: string | null;
    end_date?: string | null;
    is_active: boolean;
  }>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('missions')
        .update({
          title: updates.title,
          description: updates.description,
          mission_type: updates.type,
          objective: updates.objective,
          requirement_value: updates.target_value,
          reward_coins: updates.reward_coins,
          reward_gems: updates.reward_gems,
          reward_cards: updates.reward_cards,
          difficulty: updates.difficulty,
          category: updates.category,
          auto_reset: updates.auto_reset,
          reset_interval: updates.reset_interval,
          max_daily_completions: updates.max_daily_completions,
          target_audience: updates.target_audience,
          audience_criteria: updates.audience_criteria,
          start_date: updates.start_date,
          end_date: updates.end_date,
          is_active: updates.is_active
        })
        .eq('id', missionId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao atualizar missão:', error);
      return { success: false, error: error.message };
    }
  }

  static async toggleMission(missionId: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('missions')
        .update({ is_active: isActive })
        .eq('id', missionId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao alterar status da missão:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteMission(missionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', missionId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao excluir missão:', error);
      return { success: false, error: error.message };
    }
  }
} 