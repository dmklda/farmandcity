import { useState, useEffect, useCallback } from 'react';
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
  rewards: string[];
  requirements: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EventParticipation {
  id: string;
  event_id: string;
  player_id: string;
  joined_at: string;
  score: number;
  rewards_claimed: boolean;
}

export const useGameEvents = () => {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [participations, setParticipations] = useState<EventParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('game_events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;

      // Converter rewards de JSONB para array
      const eventsWithParsedRewards = (data || []).map(event => ({
        ...event,
        rewards: Array.isArray(event.rewards) ? event.rewards : []
      }));

      setEvents(eventsWithParsedRewards);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchParticipations = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('event_participants')
        .select('*')
        .eq('player_id', user.id);

      if (error) throw error;
      setParticipations(data || []);
    } catch (err: any) {
      console.error('Error fetching participations:', err);
    }
  }, []);

  const joinEvent = useCallback(async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Verificar se já está participando
      const existingParticipation = participations.find(p => p.event_id === eventId);
      if (existingParticipation) {
        throw new Error('Você já está participando deste evento');
      }

      // Verificar se o evento está ativo
      const event = events.find(e => e.id === eventId);
      if (!event || event.status !== 'active') {
        throw new Error('Evento não está disponível para participação');
      }

      // Verificar se há vagas
      if (event.current_participants >= event.max_participants) {
        throw new Error('Evento está lotado');
      }

      const { data, error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          player_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar participações locais
      setParticipations(prev => [...prev, data]);

      // Atualizar contador de participantes no evento
      setEvents(prev => prev.map(e => 
        e.id === eventId 
          ? { ...e, current_participants: e.current_participants + 1 }
          : e
      ));

      return { success: true, data };
    } catch (err: any) {
      console.error('Error joining event:', err);
      return { success: false, error: err.message };
    }
  }, [events, participations]);

  const leaveEvent = useCallback(async (eventId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('player_id', user.id);

      if (error) throw error;

      // Atualizar participações locais
      setParticipations(prev => prev.filter(p => p.event_id !== eventId));

      // Atualizar contador de participantes no evento
      setEvents(prev => prev.map(e => 
        e.id === eventId 
          ? { ...e, current_participants: Math.max(0, e.current_participants - 1) }
          : e
      ));

      return { success: true };
    } catch (err: any) {
      console.error('Error leaving event:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const isParticipating = useCallback((eventId: string) => {
    return participations.some(p => p.event_id === eventId);
  }, [participations]);

  const getActiveEvents = useCallback(() => {
    return events.filter(e => e.status === 'active');
  }, [events]);

  const getUpcomingEvents = useCallback(() => {
    return events.filter(e => e.status === 'upcoming');
  }, [events]);

  useEffect(() => {
    fetchEvents();
    fetchParticipations();
  }, [fetchEvents, fetchParticipations]);

  return {
    events,
    participations,
    loading,
    error,
    joinEvent,
    leaveEvent,
    isParticipating,
    getActiveEvents,
    getUpcomingEvents,
    refreshEvents: fetchEvents,
    refreshParticipations: fetchParticipations
  };
}; 