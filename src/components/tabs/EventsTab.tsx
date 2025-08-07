import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { EventsService, GameEvent, EventParticipant, EventRanking } from '../../services/EventsService';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventsTabProps {
  className?: string;
}

export default function EventsTab({ className }: EventsTabProps) {
  const { user } = useAuth();
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [rankings, setRankings] = useState<EventRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [userParticipations, setUserParticipations] = useState<string[]>([]);

  useEffect(() => {
    loadEventsData();
  }, []);

  const loadEventsData = async () => {
    setLoading(true);
    try {
      // Carregar eventos
      const eventsResult = await EventsService.getEvents();
      if (eventsResult.success && eventsResult.events) {
        setEvents(eventsResult.events);
      }

      // Carregar participações do usuário
      if (user) {
        const participationsResult = await EventsService.getUserParticipations();
        if (participationsResult.success && participationsResult.participations) {
          setUserParticipations(participationsResult.participations.map(p => p.event_id));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = async (event: GameEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
    
    // Carregar participantes e ranking do evento
    try {
      const participantsResult = await EventsService.getEventParticipants(event.id);
      if (participantsResult.success && participantsResult.participants) {
        setParticipants(participantsResult.participants);
      }

      const rankingsResult = await EventsService.getEventRanking(event.id);
      if (rankingsResult.success && rankingsResult.ranking) {
        setRankings(rankingsResult.ranking);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do evento:', error);
    }
  };

  const handleBackToList = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
    setParticipants([]);
    setRankings([]);
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!user) return;

    try {
      const result = await EventsService.joinEvent(eventId);
      if (result.success) {
        loadEventsData();
        if (selectedEvent && selectedEvent.id === eventId) {
          // Recarregar participantes do evento atual
          const participantsResult = await EventsService.getEventParticipants(eventId);
          if (participantsResult.success && participantsResult.participants) {
            setParticipants(participantsResult.participants);
          }
        }
      } else {
        alert(result.error || 'Erro ao entrar no evento');
      }
    } catch (error) {
      console.error('Erro ao entrar no evento:', error);
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    if (!user) return;

    try {
      const result = await EventsService.leaveEvent(eventId);
      if (result.success) {
        loadEventsData();
        if (selectedEvent && selectedEvent.id === eventId) {
          // Recarregar participantes do evento atual
          const participantsResult = await EventsService.getEventParticipants(eventId);
          if (participantsResult.success && participantsResult.participants) {
            setParticipants(participantsResult.participants);
          }
        }
      } else {
        alert(result.error || 'Erro ao sair do evento');
      }
    } catch (error) {
      console.error('Erro ao sair do evento:', error);
    }
  };

  const getEventStatus = (event: GameEvent) => {
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    if (now < startDate) {
      return { status: 'upcoming', label: 'Em Breve', color: 'bg-blue-500' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'active', label: 'Ativo', color: 'bg-green-500' };
    } else {
      return { status: 'completed', label: 'Concluído', color: 'bg-gray-500' };
    }
  };

  const getEventTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      tournament: '🏆',
      festival: '🎉',
      challenge: '⚔️',
      championship: '👑',
      seasonal: '🍂'
    };
    return icons[type] || '🎮';
  };

  const getEventTypeName = (type: string) => {
    const names: { [key: string]: string } = {
      tournament: 'Torneio',
      festival: 'Festival',
      challenge: 'Desafio',
      championship: 'Campeonato',
      seasonal: 'Sazonal'
    };
    return names[type] || type;
  };

  const formatEventDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const formatEventDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInHours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.ceil(diffInHours / 24);
      return `${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando eventos...</p>
        </div>
      </div>
    );
  }

  if (showEventDetails && selectedEvent) {
    const eventStatus = getEventStatus(selectedEvent);
    const isUserParticipating = userParticipations.includes(selectedEvent.id);

    return (
      <div className={`space-y-6 ${className}`}>
        <Button variant="outline" onClick={handleBackToList} className="mb-4">
          ← Voltar aos Eventos
        </Button>

        <Card>
          <CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getEventTypeIcon(selectedEvent.type)}</span>
                  <div>
                    <CardTitle className="text-2xl">{selectedEvent.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={eventStatus.color}>
                        {eventStatus.label}
                      </Badge>
                      <Badge variant="outline">
                        {getEventTypeName(selectedEvent.type)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {user && eventStatus.status === 'active' && (
                  <Button
                    onClick={() => isUserParticipating 
                      ? handleLeaveEvent(selectedEvent.id)
                      : handleJoinEvent(selectedEvent.id)
                    }
                    variant={isUserParticipating ? 'destructive' : 'default'}
                  >
                    {isUserParticipating ? 'Sair do Evento' : 'Entrar no Evento'}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">Início</p>
                  <p className="text-muted-foreground">{formatEventDate(selectedEvent.start_date)}</p>
                </div>
                <div>
                  <p className="font-medium">Fim</p>
                  <p className="text-muted-foreground">{formatEventDate(selectedEvent.end_date)}</p>
                </div>
                <div>
                  <p className="font-medium">Duração</p>
                  <p className="text-muted-foreground">{formatEventDuration(selectedEvent.start_date, selectedEvent.end_date)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">Participantes</p>
                  <p className="text-muted-foreground">{selectedEvent.current_participants}/{selectedEvent.max_participants}</p>
                </div>
                <div>
                  <p className="font-medium">Nível Mínimo</p>
                  <p className="text-muted-foreground">{selectedEvent.min_level}</p>
                </div>
                <div>
                  <p className="font-medium">Taxa de Entrada</p>
                  <p className="text-muted-foreground">
                    {selectedEvent.entry_fee_coins > 0 && `${selectedEvent.entry_fee_coins} moedas`}
                    {selectedEvent.entry_fee_coins > 0 && selectedEvent.entry_fee_gems > 0 && ' + '}
                    {selectedEvent.entry_fee_gems > 0 && `${selectedEvent.entry_fee_gems} gemas`}
                    {(selectedEvent.entry_fee_coins === 0 && selectedEvent.entry_fee_gems === 0) && 'Gratuito'}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground">{selectedEvent.description}</p>
            </div>

            {selectedEvent.rules && (
              <div>
                <h3 className="font-semibold mb-2">Regras</h3>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div dangerouslySetInnerHTML={{ __html: selectedEvent.rules }} />
                </div>
              </div>
            )}

            {selectedEvent.rewards && (
              <div>
                <h3 className="font-semibold mb-2">Recompensas</h3>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div dangerouslySetInnerHTML={{ __html: JSON.stringify(selectedEvent.rewards, null, 2) }} />
                </div>
              </div>
            )}

            {/* Ranking do Evento */}
            {rankings.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Ranking do Evento</h3>
                <div className="space-y-2">
                  {rankings.slice(0, 10).map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={player.user_avatar} />
                          <AvatarFallback>{player.user_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{player.user_name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{player.ranking_value} pontos</div>
                        <div className="text-xs text-muted-foreground">
                          Nível {player.player_level}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de Participantes */}
            {participants.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Participantes ({participants.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.player_avatar} />
                        <AvatarFallback>{participant.player_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{participant.player_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Entrou {formatDistanceToNow(new Date(participant.joined_at), { locale: ptBR, addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Eventos Ativos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-green-500">🎮</span>
            Eventos Ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.filter(event => getEventStatus(event).status === 'active').map((event) => (
              <div
                key={event.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleEventClick(event)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500">Ativo</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Participantes</p>
                    <p className="text-muted-foreground">{event.current_participants}/{event.max_participants}</p>
                  </div>
                  <div>
                    <p className="font-medium">Duração</p>
                    <p className="text-muted-foreground">{formatEventDuration(event.start_date, event.end_date)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Nível Mín.</p>
                    <p className="text-muted-foreground">{event.min_level}</p>
                  </div>
                  <div>
                    <p className="font-medium">Taxa</p>
                    <p className="text-muted-foreground">
                      {event.entry_fee_coins > 0 ? `${event.entry_fee_coins} moedas` : 'Gratuito'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Eventos Futuros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-blue-500">⏰</span>
            Eventos Futuros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.filter(event => getEventStatus(event).status === 'upcoming').map((event) => (
              <div
                key={event.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleEventClick(event)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500">Em Breve</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Início</p>
                    <p className="text-muted-foreground">{formatEventDate(event.start_date)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Duração</p>
                    <p className="text-muted-foreground">{formatEventDuration(event.start_date, event.end_date)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Nível Mín.</p>
                    <p className="text-muted-foreground">{event.min_level}</p>
                  </div>
                  <div>
                    <p className="font-medium">Taxa</p>
                    <p className="text-muted-foreground">
                      {event.entry_fee_coins > 0 ? `${event.entry_fee_coins} moedas` : 'Gratuito'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Eventos Concluídos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-gray-500">🏁</span>
            Eventos Concluídos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.filter(event => getEventStatus(event).status === 'completed').slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleEventClick(event)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-500">Concluído</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Fim</p>
                    <p className="text-muted-foreground">{formatEventDate(event.end_date)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Participantes</p>
                    <p className="text-muted-foreground">{event.current_participants}</p>
                  </div>
                  <div>
                    <p className="font-medium">Duração</p>
                    <p className="text-muted-foreground">{formatEventDuration(event.start_date, event.end_date)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Tipo</p>
                    <p className="text-muted-foreground">{getEventTypeName(event.type)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {events.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-lg font-semibold mb-2">Nenhum evento encontrado</h3>
            <p className="text-muted-foreground">
              Não há eventos disponíveis no momento. Volte mais tarde!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
