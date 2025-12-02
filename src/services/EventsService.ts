// @ts-nocheck
import { supabase } from '../integrations/supabase/client';

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'tournament' | 'festival' | 'challenge' | 'championship' | 'seasonal';
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  max_participants: number;
  current_participants: number;
  rewards: any;
  requirements: any;
  rules?: string;
  registration_deadline?: string;
  min_level: number;
  max_level?: number;
  entry_fee_coins: number;
  entry_fee_gems: number;
  auto_rewards: boolean;
  leaderboard_type: 'global' | 'local';
  created_at: string;
  updated_at: string;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  player_id: string;
  player_name?: string;
  player_avatar?: string;
  joined_at: string;
  score: number;
  rewards_claimed: boolean;
  claimed_at?: string;
}

export interface EventRanking {
  id: string;
  event_id: string;
  player_id: string;
  player_name?: string;
  player_avatar?: string;
  score: number;
  rank: number;
  rewards_claimed: boolean;
  claimed_at?: string;
  created_at: string;
  updated_at: string;
}

export class EventsService {
  // Buscar eventos
  static async getEvents(filters?: {
    status?: 'upcoming' | 'active' | 'completed' | 'cancelled';
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ success: boolean; events?: GameEvent[]; error?: string }> {
    try {
      let query = supabase
        .from('game_events')
        .select('*')
        .order('start_date', { ascending: true });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, events: data || [] };
    } catch (error: any) {
      console.error('Erro ao buscar eventos:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar evento específico
  static async getEvent(eventId: string): Promise<{ success: boolean; event?: GameEvent; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('game_events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;

      return { success: true, event: data };
    } catch (error: any) {
      console.error('Erro ao buscar evento:', error);
      return { success: false, error: error.message };
    }
  }

  // Participar de um evento
  static async joinEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Verificar se o evento existe e está ativo
      const { data: event } = await supabase
        .from('game_events')
        .select('*')
        .eq('id', eventId)
        .eq('status', 'active')
        .single();

      if (!event) {
        return { success: false, error: 'Evento não encontrado ou não está ativo' };
      }

      // Verificar se já está participando
      const { data: existingParticipation } = await supabase
        .from('event_participants')
        .select('id')
        .eq('event_id', eventId)
        .eq('player_id', user.id)
        .single();

      if (existingParticipation) {
        return { success: false, error: 'Você já está participando deste evento' };
      }

      // Verificar limite de participantes
      if (event.current_participants >= event.max_participants) {
        return { success: false, error: 'Evento está lotado' };
      }

      // Verificar nível mínimo
      const { data: playerStats } = await supabase
        .from('player_stats')
        .select('level')
        .eq('player_id', user.id)
        .single();

      if (playerStats && playerStats.level < event.min_level) {
        return { success: false, error: `Nível mínimo necessário: ${event.min_level}` };
      }

      // Verificar taxa de entrada e salvar referência para playerCurrency
      let playerCurrency = null;
      if (event.entry_fee_coins > 0 || event.entry_fee_gems > 0) {
        const { data: currencyData } = await supabase
          .from('player_currency')
          .select('coins, gems')
          .eq('player_id', user.id)
          .single();

        playerCurrency = currencyData;
        if (playerCurrency) {
          if (event.entry_fee_coins > 0 && playerCurrency.coins < event.entry_fee_coins) {
            return { success: false, error: 'Moedas insuficientes para participar' };
          }
          if (event.entry_fee_gems > 0 && playerCurrency.gems < event.entry_fee_gems) {
            return { success: false, error: 'Gemas insuficientes para participar' };
          }
        }
      }

      // Inserir participação
      const { error: joinError } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          player_id: user.id,
          score: 0
        });

      if (joinError) throw joinError;

      // Atualizar contador de participantes
      await supabase.rpc('increment_event_participants', { event_id: eventId });

      // Deduzir taxa de entrada se houver
      if ((event.entry_fee_coins > 0 || event.entry_fee_gems > 0) && playerCurrency) {
        await supabase
          .from('player_currency')
          .update({
            coins: playerCurrency.coins - event.entry_fee_coins,
            gems: playerCurrency.gems - event.entry_fee_gems
          })
          .eq('player_id', user.id);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao participar do evento:', error);
      return { success: false, error: error.message };
    }
  }

  // Sair de um evento
  static async leaveEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('player_id', user.id);

      if (error) throw error;

      // Decrementar contador de participantes
      await supabase.rpc('decrement_event_participants', { event_id: eventId });

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao sair do evento:', error);
      return { success: false, error: error.message };
    }
  }

  // Atualizar pontuação do jogador no evento
  static async updateEventScore(eventId: string, score: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('event_participants')
        .update({ score })
        .eq('event_id', eventId)
        .eq('player_id', user.id);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao atualizar pontuação:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar ranking do evento
  static async getEventRanking(eventId: string, limit: number = 10): Promise<{ success: boolean; rankings?: EventRanking[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('event_rankings')
        .select(`
          *,
          profiles:player_id(username, display_name, avatar_url)
        `)
        .eq('event_id', eventId)
        .order('score', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const rankings = data?.map(ranking => ({
        ...ranking,
        player_name: ranking.profiles?.display_name || ranking.profiles?.username || 'Jogador',
        player_avatar: ranking.profiles?.avatar_url
      })) || [];

      return { success: true, rankings };
    } catch (error: any) {
      console.error('Erro ao buscar ranking do evento:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar participantes do evento
  static async getEventParticipants(eventId: string): Promise<{ success: boolean; participants?: EventParticipant[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .select(`
          *,
          profiles:player_id(username, display_name, avatar_url)
        `)
        .eq('event_id', eventId)
        .order('score', { ascending: false });

      if (error) throw error;

      const participants = data?.map(participant => ({
        ...participant,
        player_name: participant.profiles?.display_name || participant.profiles?.username || 'Jogador',
        player_avatar: participant.profiles?.avatar_url
      })) || [];

      return { success: true, participants };
    } catch (error: any) {
      console.error('Erro ao buscar participantes:', error);
      return { success: false, error: error.message };
    }
  }

  // Verificar se o jogador está participando
  static async isParticipating(eventId: string): Promise<{ success: boolean; isParticipating?: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('event_participants')
        .select('id')
        .eq('event_id', eventId)
        .eq('player_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

      return { success: true, isParticipating: !!data };
    } catch (error: any) {
      console.error('Erro ao verificar participação:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar eventos ativos
  static async getActiveEvents(): Promise<{ success: boolean; events?: GameEvent[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('game_events')
        .select('*')
        .eq('status', 'active')
        .order('end_date', { ascending: true });

      if (error) throw error;

      return { success: true, events: data || [] };
    } catch (error: any) {
      console.error('Erro ao buscar eventos ativos:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar próximos eventos
  static async getUpcomingEvents(): Promise<{ success: boolean; events?: GameEvent[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('game_events')
        .select('*')
        .eq('status', 'upcoming')
        .order('start_date', { ascending: true });

      if (error) throw error;

      return { success: true, events: data || [] };
    } catch (error: any) {
      console.error('Erro ao buscar próximos eventos:', error);
      return { success: false, error: error.message };
    }
  }

  // Finalizar evento (apenas admin)
  static async finishEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Verificar se é admin (implementar verificação de permissão)

      // Buscar participantes ordenados por pontuação
      const { data: participants } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', eventId)
        .order('score', { ascending: false });

      if (!participants || participants.length === 0) {
        return { success: false, error: 'Nenhum participante encontrado' };
      }

      // Atualizar ranking
      for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];
        await supabase
          .from('event_rankings')
          .upsert({
            event_id: eventId,
            player_id: participant.player_id,
            score: participant.score,
            rank: i + 1
          });
      }

      // Marcar evento como concluído
      await supabase
        .from('game_events')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId);

      // Registrar no histórico
      await supabase
        .from('event_history')
        .insert({
          event_id: eventId,
          winner_id: participants[0].player_id,
          total_participants: participants.length,
          total_rewards_distributed: {} // Implementar distribuição de recompensas
        });

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao finalizar evento:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar estatísticas de eventos
  static async getEventStats(): Promise<{ success: boolean; stats?: any; error?: string }> {
    try {
      const { data: totalEvents } = await supabase
        .from('game_events')
        .select('id', { count: 'exact' });

      const { data: activeEvents } = await supabase
        .from('game_events')
        .select('id', { count: 'exact' })
        .eq('status', 'active');

      const { data: totalParticipants } = await supabase
        .from('event_participants')
        .select('id', { count: 'exact' });

      const stats = {
        total_events: totalEvents?.length || 0,
        active_events: activeEvents?.length || 0,
        total_participants: totalParticipants?.length || 0
      };

      return { success: true, stats };
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      return { success: false, error: error.message };
    }
  }
} 