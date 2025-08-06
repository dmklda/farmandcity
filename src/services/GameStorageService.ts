import { supabase } from '../integrations/supabase/client';
import { GameState } from '../types/gameState';
import { AchievementService } from './AchievementService';

export interface SavedGame {
  id: string;
  player_id: string;
  game_state: GameState;
  turn: number;
  phase: string;
  is_finished: boolean;
  score: number;
  created_at: string;
  updated_at: string;
}

export class GameStorageService {
  // Salvar jogo atual
  static async saveGame(gameState: GameState): Promise<{ success: boolean; gameId?: string; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const score = this.calculateScore(gameState);
      
      const { data, error } = await supabase
        .from('games')
        .upsert({
          player_id: user.id,
          game_state: gameState as any,
          turn: gameState.turn,
          phase: gameState.phase,
          is_finished: false,
          score: score,
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, gameId: data.id };
    } catch (error: any) {
      console.error('Erro ao salvar jogo:', error);
      return { success: false, error: error.message };
    }
  }

  // Carregar jogos salvos do usuário
  static async loadUserGames(): Promise<{ success: boolean; games?: SavedGame[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('player_id', user.id)
        .eq('is_finished', false)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return { success: true, games: (data as unknown as SavedGame[]) || [] };
    } catch (error: any) {
      console.error('Erro ao carregar jogos:', error);
      return { success: false, error: error.message };
    }
  }

  // Carregar jogo específico
  static async loadGame(gameId: string): Promise<{ success: boolean; gameState?: GameState; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .eq('player_id', user.id)
        .single();

      if (error) throw error;

      return { success: true, gameState: data.game_state as unknown as GameState };
    } catch (error: any) {
      console.error('Erro ao carregar jogo:', error);
      return { success: false, error: error.message };
    }
  }

  // Deletar jogo salvo
  static async deleteGame(gameId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId)
        .eq('player_id', user.id);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao deletar jogo:', error);
      return { success: false, error: error.message };
    }
  }

  // Finalizar jogo e salvar no histórico
  static async finishGame(gameState: GameState, gameDurationMinutes?: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const score = this.calculateScore(gameState);
      const isVictory = gameState.victorySystem?.victoryAchieved || false;

      // Salvar no histórico
      const { error: historyError } = await supabase
        .from('game_history')
        .insert({
          player_id: user.id,
          final_score: score,
          turns_played: gameState.turn,
          resources_final: gameState.resources as any,
          buildings_built: gameState.playerStats.buildings,
          landmarks_built: gameState.playerStats.landmarks,
          game_duration_minutes: gameDurationMinutes,
        });

      if (historyError) throw historyError;

      // Marcar jogo atual como finalizado (se existir)
      await supabase
        .from('games')
        .update({ is_finished: true })
        .eq('player_id', user.id)
        .eq('is_finished', false);

      // TODO: Atualizar estatísticas do jogador
      // await this.updatePlayerStats(user.id, {
      //   games_played: 1,
      //   games_won: isVictory ? 1 : 0,
      //   total_playtime_minutes: gameDurationMinutes || 0,
      //   experience_points: Math.floor(score / 10),
      //   last_activity: new Date().toISOString()
      // });

      // TODO: Verificar conquistas após finalizar o jogo
      // await AchievementService.forceCheckAchievements(user.id);

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao finalizar jogo:', error);
      return { success: false, error: error.message };
    }
  }

  // TODO: Implementar atualização de estatísticas do jogador
  // static async updatePlayerStats(playerId: string, updates: any): Promise<void> {
  //   // Implementação futura
  // }

  // Calcular pontuação do jogo
  private static calculateScore(gameState: GameState): number {
    const { resources, playerStats, turn } = gameState;
    
    let score = 0;
    
    // Pontos por recursos (1 ponto cada)
    score += resources.coins + resources.food + resources.materials + resources.population;
    
    // Pontos por estatísticas do jogador
    score += playerStats.reputation * 10; // 10 pontos por reputação
    score += playerStats.buildings * 5; // 5 pontos por construção
    score += playerStats.landmarks * 50; // 50 pontos por marco
    
    // Bônus por eficiência (menos turnos = mais pontos)
    score += Math.max(0, (50 - turn) * 2);
    
    return Math.max(0, score);
  }

  // Carregar cartas do jogador
  static async loadPlayerCards(): Promise<{ success: boolean; cards?: any[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('player_cards')
        .select('*')
        .eq('player_id', user.id);

      if (error) throw error;

      return { success: true, cards: data || [] };
    } catch (error: any) {
      console.error('Erro ao carregar cartas do jogador:', error);
      return { success: false, error: error.message };
    }
  }

  // Adicionar carta ao inventário do jogador
  static async unlockCard(cardId: string, quantity: number = 1): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('player_cards')
        .upsert({
          player_id: user.id,
          card_id: cardId,
          quantity: quantity,
        });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao desbloquear carta:', error);
      return { success: false, error: error.message };
    }
  }
}