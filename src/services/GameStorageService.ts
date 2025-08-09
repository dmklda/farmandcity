import { supabase } from '../integrations/supabase/client';
import { GameState } from '../types/gameState';

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
  static async saveGame(gameState: GameState, gameMode?: string): Promise<{ success: boolean; gameId?: string; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Verificar se o estado do jogo é válido
      if (!gameState || !gameState.resources) {
        return { success: false, error: 'Estado do jogo inválido' };
      }

      const score = this.calculateScore(gameState);
      
      const gameData = {
        player_id: user.id,
        game_state: gameState as any,
        turn: gameState.turn || 0,
        phase: gameState.phase || 'draw',
        is_finished: false,
        score: score,
        game_mode: gameMode || 'classic',
      };
      
      const { data, error } = await supabase
        .from('games')
        .upsert(gameData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { success: true, gameId: data.id };
    } catch (error: any) {
      console.error('Erro ao salvar jogo:', error);
      return { success: false, error: error.message };
    }
  }

  // Carregar jogos salvos do usuário
  static async loadUserGames(): Promise<{ success: boolean; games?: (SavedGame & { game_mode?: string })[]; error?: string }> {
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

      if (error) {
        throw error;
      }

      // Filtrar jogos com estado válido e garantir que todos os campos existem
      const validGames = (data as unknown as SavedGame[]).filter(game => 
        game.game_state && game.game_state.resources
      ).map(game => ({
        ...game,
        turn: game.turn || 0,
        phase: game.phase || 'draw',
        score: game.score || 0,
        game_state: {
          ...game.game_state,
          turn: game.game_state.turn || 0,
          phase: game.game_state.phase || 'draw',
          resources: {
            coins: game.game_state.resources.coins || 0,
            food: game.game_state.resources.food || 0,
            materials: game.game_state.resources.materials || 0,
            population: game.game_state.resources.population || 0,
          },
          playerStats: {
            reputation: game.game_state.playerStats?.reputation || 0,
            totalProduction: game.game_state.playerStats?.totalProduction || 0,
            buildings: game.game_state.playerStats?.buildings || 0,
            landmarks: game.game_state.playerStats?.landmarks || 0,
          },
          farmGrid: game.game_state.farmGrid || [],
          cityGrid: game.game_state.cityGrid || [],
          landmarksGrid: game.game_state.landmarksGrid || [],
          eventGrid: game.game_state.eventGrid || [],
          hand: game.game_state.hand || [],
          deck: game.game_state.deck || [],
          activeEvents: game.game_state.activeEvents || [],
          comboEffects: game.game_state.comboEffects || [],
          magicUsedThisTurn: game.game_state.magicUsedThisTurn || false,
          builtCountThisTurn: game.game_state.builtCountThisTurn || 0,
        }
      }));

      return { success: true, games: validGames || [] };
    } catch (error: any) {
      console.error('Erro ao carregar jogos:', error);
      return { success: false, error: error.message };
    }
  }

  // Carregar jogo específico
  static async loadGame(gameId: string): Promise<{ success: boolean; gameState?: GameState; gameMode?: string; error?: string }> {
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

      if (error) {
        throw error;
      }

      // Verificar se o estado do jogo é válido
      if (!data.game_state || !data.game_state.resources) {
        return { success: false, error: 'Estado do jogo corrompido' };
      }

      // Garantir que todos os campos obrigatórios existem
      const gameState = {
        ...data.game_state,
        turn: data.game_state.turn || 0,
        phase: data.game_state.phase || 'draw',
        resources: {
          coins: data.game_state.resources.coins || 0,
          food: data.game_state.resources.food || 0,
          materials: data.game_state.resources.materials || 0,
          population: data.game_state.resources.population || 0,
        },
        playerStats: {
          reputation: data.game_state.playerStats?.reputation || 0,
          totalProduction: data.game_state.playerStats?.totalProduction || 0,
          buildings: data.game_state.playerStats?.buildings || 0,
          landmarks: data.game_state.playerStats?.landmarks || 0,
        },
        farmGrid: data.game_state.farmGrid || [],
        cityGrid: data.game_state.cityGrid || [],
        landmarksGrid: data.game_state.landmarksGrid || [],
        eventGrid: data.game_state.eventGrid || [],
        hand: data.game_state.hand || [],
        deck: data.game_state.deck || [],
        activeEvents: data.game_state.activeEvents || [],
        comboEffects: data.game_state.comboEffects || [],
        magicUsedThisTurn: data.game_state.magicUsedThisTurn || false,
        builtCountThisTurn: data.game_state.builtCountThisTurn || 0,
      };

      return { success: true, gameState: gameState as GameState, gameMode: data.game_mode };
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

      // Primeiro verificar se o jogo existe
      const { data: existingGame, error: checkError } = await supabase
        .from('games')
        .select('id')
        .eq('id', gameId)
        .eq('player_id', user.id)
        .single();

      if (checkError) {
        if (checkError.code === 'PGRST116') {
          // Jogo não encontrado - considerar como sucesso (já foi deletado)
          return { success: true };
        }
        throw checkError;
      }

      // Se chegou aqui, o jogo existe, então deletar
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId)
        .eq('player_id', user.id);

      if (error) {
        throw error;
      }

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

      // Salvar no histórico
      const { error: historyError } = await supabase
        .from('game_history')
        .insert({
          player_id: user.id,
          final_score: score,
          turns_played: gameState.turn || 0,
          resources_final: gameState.resources as any,
          buildings_built: gameState.playerStats?.buildings || 0,
          landmarks_built: gameState.playerStats?.landmarks || 0,
          game_duration_minutes: gameDurationMinutes,
        });

      if (historyError) throw historyError;

      // Marcar jogo atual como finalizado (se existir)
      await supabase
        .from('games')
        .update({ is_finished: true })
        .eq('player_id', user.id)
        .eq('is_finished', false);

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao finalizar jogo:', error);
      return { success: false, error: error.message };
    }
  }

  // Calcular pontuação do jogo
  private static calculateScore(gameState: GameState): number {
    const { resources, playerStats, turn, farmGrid, cityGrid, landmarksGrid, eventGrid } = gameState;
    
    let score = 0;
    
    // Pontos base dos recursos
    if (resources) {
      score += (resources.coins || 0) * 2; // 2 pontos por moeda
      score += (resources.food || 0) * 1; // 1 ponto por comida
      score += (resources.materials || 0) * 1; // 1 ponto por material
      score += (resources.population || 0) * 3; // 3 pontos por população
    }
    
    // Pontos das estatísticas do jogador
    if (playerStats) {
      score += (playerStats.reputation || 0) * 10; // 10 pontos por reputação
      score += (playerStats.totalProduction || 0) * 0.5; // 0.5 pontos por produção total
      score += (playerStats.buildings || 0) * 5; // 5 pontos por construção
      score += (playerStats.landmarks || 0) * 50; // 50 pontos por marco
    }
    
    // Pontos das cartas nos grids
    const farmCards = farmGrid?.flat().filter(cell => cell.card).length || 0;
    const cityCards = cityGrid?.flat().filter(cell => cell.card).length || 0;
    const landmarkCards = landmarksGrid?.flat().filter(cell => cell.card).length || 0;
    const eventCards = eventGrid?.flat().filter(cell => cell.card).length || 0;
    
    score += farmCards * 3; // 3 pontos por carta de fazenda
    score += cityCards * 5; // 5 pontos por carta de cidade
    score += landmarkCards * 25; // 25 pontos por marco
    score += eventCards * 10; // 10 pontos por evento
    
    // Bônus por progresso (turno atual)
    score += (turn || 0) * 2; // 2 pontos por turno jogado
    
    // Bônus por eficiência (baseado no modo de vitória)
    if (gameState.victorySystem?.mode === 'simple') {
      // Bônus extra para modo simples (produção)
      const currentProduction = (resources?.coins || 0) + (resources?.food || 0) + 
                               (resources?.materials || 0) + (resources?.population || 0);
      if (currentProduction >= 50) {
        score += 100; // Bônus por atingir meta de produção
      }
    }
    
    return Math.max(0, Math.round(score));
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