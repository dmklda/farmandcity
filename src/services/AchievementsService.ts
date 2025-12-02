// @ts-nocheck
import { supabase } from '../integrations/supabase/client';
import { ALL_VICTORY_ACHIEVEMENTS, VICTORY_ACHIEVEMENTS, SPECIAL_VICTORY_ACHIEVEMENTS } from '../data/achievementsData';

export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  type: string;
  requirement_value: number;
  reward_coins: number | null;
  reward_gems: number | null;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | string;
  icon?: string | null;
  is_active: boolean | null;
  category: string | null;
  difficulty_level: 'easy' | 'medium' | 'hard' | 'legendary' | string | null;
  progress_type: string | null;
  max_progress: number | null;
  is_hidden: boolean | null;
  unlock_condition: any;
  created_at: string | null;
}

export interface PlayerAchievement {
  id: string;
  player_id: string | null;
  achievement_id: string | null;
  earned_at: string | null;
  progress: number | null;
  is_completed: boolean | null;
  achievements?: any | null;
}

export interface PlayerAchievementProgress {
  id: string;
  player_id: string;
  achievement_id: string;
  current_progress: number | null;
  is_completed: boolean | null;
  completed_at?: string | null;
  last_updated: string | null;
  achievements?: any;
}

export interface AchievementCategory {
  id: string;
  name: string;
  description?: string | null;
  color: string | null;
  icon?: string | null;
  sort_order: number | null;
  is_active: boolean | null;
  created_at: string | null;
}

export class AchievementsService {
  // Buscar todas as conquistas
  static async getAchievements(filters?: {
    category?: string;
    rarity?: string;
    difficulty?: string;
    is_active?: boolean;
  }): Promise<{ success: boolean; achievements?: Achievement[]; error?: string }> {
    try {
      let query = supabase
        .from('achievements')
        .select('*')
        .order('category', { ascending: true })
        .order('difficulty_level', { ascending: true });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.rarity) {
        query = query.eq('rarity', filters.rarity);
      }
      if (filters?.difficulty) {
        query = query.eq('difficulty_level', filters.difficulty);
      }
      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, achievements: data || [] };
    } catch (error: any) {
      console.error('Erro ao buscar conquistas:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar conquistas do jogador
  static async getPlayerAchievements(): Promise<{ success: boolean; achievements?: PlayerAchievement[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('player_achievements')
        .select(`
          *,
          achievements:achievement_id(*)
        `)
        .eq('player_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;

      return { success: true, achievements: data || [] };
    } catch (error: any) {
      console.error('Erro ao buscar conquistas do jogador:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar progresso das conquistas do jogador
  static async getPlayerAchievementProgress(): Promise<{ success: boolean; progress?: PlayerAchievementProgress[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('player_achievement_progress')
        .select(`
          *,
          achievements:achievement_id(*)
        `)
        .eq('player_id', user.id)
        .order('last_updated', { ascending: false });

      if (error) throw error;

      return { success: true, progress: data || [] };
    } catch (error: any) {
      console.error('Erro ao buscar progresso das conquistas:', error);
      return { success: false, error: error.message };
    }
  }

  // Atualizar progresso de uma conquista
  static async updateAchievementProgress(achievementId: string, progress: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Buscar a conquista para verificar os requisitos
      const { data: achievement } = await supabase
        .from('achievements')
        .select('*')
        .eq('id', achievementId)
        .single();

      if (!achievement) {
        return { success: false, error: 'Conquista não encontrada' };
      }

      // Verificar se já foi completada
      const { data: existingProgress } = await supabase
        .from('player_achievement_progress')
        .select('*')
        .eq('player_id', user.id)
        .eq('achievement_id', achievementId)
        .single();

      if (existingProgress?.is_completed) {
        return { success: true }; // Já completada
      }

      const isCompleted = progress >= achievement.requirement_value;

      // Atualizar ou criar progresso
      const { error } = await supabase
        .from('player_achievement_progress')
        .upsert({
          player_id: user.id,
          achievement_id: achievementId,
          current_progress: progress,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          last_updated: new Date().toISOString()
        });

      if (error) throw error;

      // Se foi completada, adicionar à lista de conquistas do jogador
      if (isCompleted && !existingProgress?.is_completed) {
        await this.unlockAchievement(achievementId);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao atualizar progresso:', error);
      return { success: false, error: error.message };
    }
  }

  // Desbloquear conquista
  static async unlockAchievement(achievementId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Verificar se já foi desbloqueada
      const { data: existingAchievement } = await supabase
        .from('player_achievements')
        .select('id')
        .eq('player_id', user.id)
        .eq('achievement_id', achievementId)
        .single();

      if (existingAchievement) {
        return { success: true }; // Já desbloqueada
      }

      // Buscar dados da conquista
      const { data: achievement } = await supabase
        .from('achievements')
        .select('*')
        .eq('id', achievementId)
        .single();

      if (!achievement) {
        return { success: false, error: 'Conquista não encontrada' };
      }

      // Adicionar à lista de conquistas do jogador
      const { error: achievementError } = await supabase
        .from('player_achievements')
        .insert({
          player_id: user.id,
          achievement_id: achievementId,
          earned_at: new Date().toISOString(),
          progress: achievement.requirement_value,
          is_completed: true
        });

      if (achievementError) throw achievementError;

      // Adicionar recompensas
      if ((achievement.reward_coins ?? 0) > 0 || (achievement.reward_gems ?? 0) > 0) {
        await supabase.rpc('add_player_currency', {
          player_id: user.id,
          coins_to_add: achievement.reward_coins ?? 0,
          gems_to_add: achievement.reward_gems ?? 0
        });
      }

      // Atualizar estatísticas do jogador (RPC pode não existir)
      try {
        await (supabase as any).rpc('increment_player_achievements', { player_id: user.id });
      } catch (e) {
        console.warn('RPC increment_player_achievements não disponível');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao desbloquear conquista:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar categorias de conquistas
  static async getAchievementCategories(): Promise<{ success: boolean; categories?: AchievementCategory[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('achievement_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      return { success: true, categories: data || [] };
    } catch (error: any) {
      console.error('Erro ao buscar categorias:', error);
      return { success: false, error: error.message };
    }
  }

  // Verificar conquistas baseadas em ações do jogador
  static async checkActionBasedAchievements(action: string, value: number = 1): Promise<{ success: boolean; unlocked?: string[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Buscar conquistas relacionadas à ação
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('type', action)
        .eq('is_active', true);

      if (!achievements || achievements.length === 0) {
        return { success: true, unlocked: [] };
      }

      const unlockedAchievements: string[] = [];

      for (const achievement of achievements) {
        // Buscar progresso atual
        const { data: progress } = await supabase
          .from('player_achievement_progress')
          .select('current_progress, is_completed')
          .eq('player_id', user.id)
          .eq('achievement_id', achievement.id)
          .single();

        const currentProgress = progress?.current_progress || 0;
        const newProgress = currentProgress + value;

        // Atualizar progresso
        const result = await this.updateAchievementProgress(achievement.id, newProgress);
        
        if (result.success && newProgress >= achievement.requirement_value && !progress?.is_completed) {
          unlockedAchievements.push(achievement.title);
        }
      }

      return { success: true, unlocked: unlockedAchievements };
    } catch (error: any) {
      console.error('Erro ao verificar conquistas baseadas em ações:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar conquistas raras
  static async getRareAchievements(): Promise<{ success: boolean; achievements?: Achievement[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .in('rarity', ['rare', 'epic', 'legendary'])
        .eq('is_active', true)
        .order('rarity', { ascending: false });

      if (error) throw error;

      return { success: true, achievements: data || [] };
    } catch (error: any) {
      console.error('Erro ao buscar conquistas raras:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar conquistas ocultas
  static async getHiddenAchievements(): Promise<{ success: boolean; achievements?: Achievement[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_hidden', true)
        .eq('is_active', true)
        .order('difficulty_level', { ascending: true });

      if (error) throw error;

      return { success: true, achievements: data || [] };
    } catch (error: any) {
      console.error('Erro ao buscar conquistas ocultas:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar estatísticas de conquistas do jogador
  static async getPlayerAchievementStats(): Promise<{ success: boolean; stats?: any; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Total de conquistas desbloqueadas
      const { data: unlockedAchievements } = await supabase
        .from('player_achievements')
        .select('id', { count: 'exact' })
        .eq('player_id', user.id);

      // Total de conquistas disponíveis
      const { data: totalAchievements } = await supabase
        .from('achievements')
        .select('id', { count: 'exact' })
        .eq('is_active', true);

      // Conquistas por raridade
      const { data: achievementsByRarity } = await supabase
        .from('player_achievements')
        .select(`
          achievements:achievement_id(rarity)
        `)
        .eq('player_id', user.id);

      const rarityCounts = {
        common: 0,
        rare: 0,
        epic: 0,
        legendary: 0
      };

      achievementsByRarity?.forEach(item => {
        const rarity = (item.achievements as any)?.rarity;
        if (rarity && rarityCounts.hasOwnProperty(rarity)) {
          rarityCounts[rarity as keyof typeof rarityCounts]++;
        }
      });

      const stats = {
        unlocked_count: unlockedAchievements?.length || 0,
        total_count: totalAchievements?.length || 0,
        completion_percentage: totalAchievements?.length ? Math.round((unlockedAchievements?.length || 0) / totalAchievements.length * 100) : 0,
        rarity_breakdown: rarityCounts
      };

      return { success: true, stats };
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar conquistas recentes
  static async getRecentAchievements(limit: number = 5): Promise<{ success: boolean; achievements?: PlayerAchievement[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('player_achievements')
        .select(`
          *,
          achievements:achievement_id(*)
        `)
        .eq('player_id', user.id)
        .order('earned_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { success: true, achievements: data || [] };
    } catch (error: any) {
      console.error('Erro ao buscar conquistas recentes:', error);
      return { success: false, error: error.message };
    }
  }

  // Admin methods
  static async createAchievement(achievementData: {
    title: string;
    description: string;
    type: string;
    requirement_value: number;
    reward_coins: number;
    reward_gems: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    icon?: string;
    category: string;
    difficulty_level: 'easy' | 'medium' | 'hard' | 'legendary';
    max_progress: number;
    is_hidden: boolean;
  }): Promise<{ success: boolean; achievement_id?: string; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .insert({
          title: achievementData.title,
          description: achievementData.description,
          type: achievementData.type,
          requirement_value: achievementData.requirement_value,
          reward_coins: achievementData.reward_coins,
          reward_gems: achievementData.reward_gems,
          rarity: achievementData.rarity,
          icon: achievementData.icon || '🏆',
          category: achievementData.category,
          difficulty_level: achievementData.difficulty_level,
          max_progress: achievementData.max_progress,
          is_hidden: achievementData.is_hidden,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, achievement_id: data.id };
    } catch (error: any) {
      console.error('Erro ao criar conquista:', error);
      return { success: false, error: error.message };
    }
  }

  static async updateAchievement(achievementId: string, updates: Partial<{
    title: string;
    description: string;
    type: string;
    requirement_value: number;
    reward_coins: number;
    reward_gems: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    icon?: string;
    category: string;
    difficulty_level: 'easy' | 'medium' | 'hard' | 'legendary';
    max_progress: number;
    is_hidden: boolean;
  }>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('achievements')
        .update(updates)
        .eq('id', achievementId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao atualizar conquista:', error);
      return { success: false, error: error.message };
    }
  }

  static async toggleAchievement(achievementId: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('achievements')
        .update({ is_active: isActive })
        .eq('id', achievementId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao alterar status da conquista:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteAchievement(achievementId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', achievementId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao excluir conquista:', error);
      return { success: false, error: error.message };
    }
  }
} 

// Função para verificar conquistas de vitória
export async function checkVictoryAchievements(
  userId: string,
  victoryData: {
    victoryMode: string;
    victoryType?: string;
    victoryValue?: number;
    turnCount?: number;
    totalResources?: number;
    productionPerTurn?: number;
    cardsLost?: number;
    catastrophesSurvived?: number;
    gameMode?: string;
  }
): Promise<Achievement[]> {
  try {
    // Obter conquistas de vitória relevantes
    const relevantAchievements = VICTORY_ACHIEVEMENTS.filter(achievement => {
      const unlockCondition = achievement.unlock_condition;
      
      // Verificar conquistas por modo de vitória
      if (unlockCondition.victoryMode && unlockCondition.victoryMode === victoryData.victoryMode) {
        if (unlockCondition.victoryValue && victoryData.victoryValue) {
          return victoryData.victoryValue >= unlockCondition.victoryValue;
        }
        return true;
      }
      
      // Verificar conquistas por tipo de vitória
      if (unlockCondition.victoryType && unlockCondition.victoryType === victoryData.victoryType) {
        return true;
      }
      
      // Verificar conquistas especiais
      if (unlockCondition.type === 'speed_victory' && unlockCondition.maxTurns && victoryData.turnCount) {
        return victoryData.turnCount <= unlockCondition.maxTurns;
      }
      
      if (unlockCondition.type === 'perfect_victory') {
        if (unlockCondition.victoryMode === 'landmarks' && victoryData.cardsLost !== undefined) {
          return victoryData.cardsLost === 0;
        }
        // Outras verificações de vitória perfeita podem ser adicionadas aqui
      }
      
      if (unlockCondition.type === 'catastrophe_survivor' && victoryData.catastrophesSurvived) {
        return victoryData.catastrophesSurvived >= 3;
      }
      
      if (unlockCondition.type === 'resource_scarcity' && victoryData.totalResources) {
        return victoryData.totalResources < 100;
      }
      
      return false;
    });
    
    // Verificar conquistas especiais
    const specialAchievements = await checkSpecialVictoryAchievements(userId, victoryData);
    
    const allUnlockedAchievements = [...relevantAchievements, ...specialAchievements];
    
    // Verificar se as conquistas já foram desbloqueadas
    const { data: existingAchievements } = await (supabase as any)
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId)
      .in('achievement_id', allUnlockedAchievements.map(a => a.id));
    
    const existingIds = existingAchievements?.map((a: any) => a.achievement_id) || [];
    const newAchievements = allUnlockedAchievements.filter(a => !existingIds.includes(a.id));
    
    // Desbloquear novas conquistas
    if (newAchievements.length > 0) {
      await unlockAchievements(userId, newAchievements);
    }
    
    return newAchievements;
  } catch (error) {
    console.error('Erro ao verificar conquistas de vitória:', error);
    return [];
  }
}

// Função para verificar conquistas especiais de vitória
async function checkSpecialVictoryAchievements(
  userId: string,
  victoryData: any
): Promise<Achievement[]> {
  const unlockedAchievements: Achievement[] = [];
  
  try {
    // Verificar conquista de múltiplas vitórias
    const { data: userVictories } = await (supabase as any)
      .from('user_victories')
      .select('victory_mode, victory_type')
      .eq('user_id', userId);
    
    if (userVictories) {
      const uniqueModes = new Set(userVictories.map((v: any) => v.victory_mode));
      
      // Conquista de 5 modos diferentes
      if (uniqueModes.size >= 5) {
        const achievement = SPECIAL_VICTORY_ACHIEVEMENTS.find(a => a.id === 'victory_multiple_5');
        if (achievement) unlockedAchievements.push(achievement);
      }
      
      // Conquista de 10 modos diferentes
      if (uniqueModes.size >= 10) {
        const achievement = SPECIAL_VICTORY_ACHIEVEMENTS.find(a => a.id === 'victory_multiple_10');
        if (achievement) unlockedAchievements.push(achievement);
      }
      
      // Conquista de todos os modos
      const totalVictories = userVictories.length;
      if (totalVictories >= 100) {
        const achievement = SPECIAL_VICTORY_ACHIEVEMENTS.find(a => a.id === 'victory_century');
        if (achievement) unlockedAchievements.push(achievement);
      }
      
      if (totalVictories >= 1000) {
        const achievement = SPECIAL_VICTORY_ACHIEVEMENTS.find(a => a.id === 'victory_millennium');
        if (achievement) unlockedAchievements.push(achievement);
      }
    }
    
    // Verificar conquista de Grão-Mestre (todos os modos)
    const allGameModes = ['classic', 'complex', 'infinite', 'landmarks', 'reputation', 'elimination', 'resources', 'production'];
    const hasAllModes = allGameModes.every(mode => 
      userVictories?.some(v => v.victory_mode === mode)
    );
    
    if (hasAllModes) {
      const achievement = SPECIAL_VICTORY_ACHIEVEMENTS.find(a => a.id === 'victory_grandmaster');
      if (achievement) unlockedAchievements.push(achievement);
    }
    
  } catch (error) {
    console.error('Erro ao verificar conquistas especiais:', error);
  }
  
  return unlockedAchievements;
}

// Função para registrar vitória do usuário
export async function recordUserVictory(
  userId: string,
  victoryData: {
    victoryMode: string;
    victoryType?: string;
    victoryValue?: number;
    turnCount?: number;
    totalResources?: number;
    productionPerTurn?: number;
    cardsLost?: number;
    catastrophesSurvived?: number;
    gameMode?: string;
    timestamp?: string;
  }
): Promise<void> {
  try {
    // Registrar vitória na tabela
    const { error } = await supabase
      .from('user_victories')
      .insert({
        user_id: userId,
        victory_mode: victoryData.victoryMode,
        victory_type: victoryData.victoryType,
        victory_value: victoryData.victoryValue,
        turn_count: victoryData.turnCount,
        total_resources: victoryData.totalResources,
        production_per_turn: victoryData.productionPerTurn,
        cards_lost: victoryData.cardsLost,
        catastrophes_survived: victoryData.catastrophesSurvived,
        game_mode: victoryData.gameMode,
        timestamp: victoryData.timestamp || new Date().toISOString()
      });
    
    if (error) {
      console.error('Erro ao registrar vitória:', error);
      return;
    }
    
    // Verificar conquistas de vitória
    await checkVictoryAchievements(userId, victoryData);
    
  } catch (error) {
    console.error('Erro ao registrar vitória do usuário:', error);
  }
} 

// Função para desbloquear conquistas
export async function unlockAchievements(userId: string, achievements: Achievement[]): Promise<void> {
  try {
    const achievementsToInsert = achievements.map(achievement => ({
      user_id: userId,
      achievement_id: achievement.id,
      unlocked_at: new Date().toISOString(),
      progress: achievement.max_progress || 1,
      is_completed: true
    }));

    const { error } = await supabase
      .from('user_achievements')
      .insert(achievementsToInsert);

    if (error) {
      console.error('Erro ao desbloquear conquistas:', error);
    }
  } catch (error) {
    console.error('Erro ao desbloquear conquistas:', error);
  }
} 