import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useGameEvents } from '../../hooks/useGameEvents';
import { 
  Calendar, 
  Trophy, 
  Users, 
  Star, 
  Clock, 
  Award,
  TrendingUp,
  Zap,
  Crown,
  Target,
  Gift,
  Flame
} from 'lucide-react';

export const EventsTab: React.FC = () => {
  const { 
    events, 
    loading, 
    error, 
    joinEvent, 
    leaveEvent, 
    isParticipating,
    getActiveEvents,
    getUpcomingEvents 
  } = useGameEvents();

  const activeEvents = getActiveEvents();
  const upcomingEvents = getUpcomingEvents();

  // Mock data para leaderboard (será implementado posteriormente)
  const leaderboard = [
    { rank: 1, name: "ImperadorMax", score: 12500, avatar: "👑", level: 25, trophies: 15 },
    { rank: 2, name: "ConstrutorPro", score: 11800, avatar: "🏗️", level: 23, trophies: 12 },
    { rank: 3, name: "FazendeiroElite", score: 11200, avatar: "🚜", level: 22, trophies: 10 },
    { rank: 4, name: "MestreCartas", score: 10500, avatar: "🃏", level: 21, trophies: 8 },
    { rank: 5, name: "Estrategista", score: 9800, avatar: "⚔️", level: 20, trophies: 7 },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'tournament': return <Trophy className="h-5 w-5" />;
      case 'festival': return <Gift className="h-5 w-5" />;
      case 'challenge': return <Target className="h-5 w-5" />;
      case 'championship': return <Crown className="h-5 w-5" />;
      case 'seasonal': return <Flame className="h-5 w-5" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'tournament': return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400';
      case 'festival': return 'bg-purple-500/20 border-purple-500/40 text-purple-400';
      case 'challenge': return 'bg-blue-500/20 border-blue-500/40 text-blue-400';
      case 'championship': return 'bg-red-500/20 border-red-500/40 text-red-400';
      case 'seasonal': return 'bg-orange-500/20 border-orange-500/40 text-orange-400';
      default: return 'bg-gray-500/20 border-gray-500/40 text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleJoinEvent = async (eventId: string) => {
    const result = await joinEvent(eventId);
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    const result = await leaveEvent(eventId);
    if (!result.success) {
      alert(result.error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="text-white/60 mt-2">Carregando eventos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <p className="text-red-400">Erro ao carregar eventos: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Eventos Ativos */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          Eventos Ativos
        </h2>
        
        {activeEvents.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <p className="text-white/60">Nenhum evento ativo no momento.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeEvents.map((event) => {
              const progress = (event.current_participants / event.max_participants) * 100;
              const participating = isParticipating(event.id);
              
              return (
                <Card key={event.id} className={`bg-slate-800/50 border-slate-700/50 ${getEventColor(event.type)}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getEventIcon(event.type)}
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        Ativo
                      </Badge>
                    </div>
                    <CardDescription className="text-white/70">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Participantes</span>
                      <span>{event.current_participants}/{event.max_participants}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4" />
                        <span>Termina em: {formatDate(event.end_date)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Recompensas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {event.rewards.map((reward, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {participating ? (
                        <Button 
                          onClick={() => handleLeaveEvent(event.id)}
                          variant="outline" 
                          size="sm"
                          className="flex-1 bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-400"
                        >
                          Sair
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleJoinEvent(event.id)}
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={event.current_participants >= event.max_participants}
                        >
                          Participar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Eventos Futuros */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-400" />
          Eventos Futuros
        </h2>
        
        {upcomingEvents.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <p className="text-white/60">Nenhum evento futuro programado.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className={`bg-slate-800/50 border-slate-700/50 ${getEventColor(event.type)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getEventIcon(event.type)}
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                        Futuro
                      </Badge>
                  </div>
                  <CardDescription className="text-white/70">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>Inicia em: {formatDate(event.start_date)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Recompensas:</h4>
                    <div className="flex flex-wrap gap-1">
                      {event.rewards.map((reward, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {reward}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-white"
                    disabled
                  >
                    Em Breve
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Award className="h-6 w-6 text-yellow-400" />
          Ranking Global
        </h2>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="space-y-3">
              {leaderboard.map((player, index) => (
                <div key={player.rank} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm">
                      {player.rank}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{player.avatar}</span>
                      <div>
                        <div className="font-semibold text-white">{player.name}</div>
                        <div className="text-xs text-white/60">Nível {player.level}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-400">{player.score.toLocaleString()}</div>
                    <div className="text-xs text-white/60">{player.trophies} troféus</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 
