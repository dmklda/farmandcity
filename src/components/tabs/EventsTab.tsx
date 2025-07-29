import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
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
  // Mock data for events
  const activeEvents = [
    {
      id: 1,
      title: "Torneio de Verão",
      description: "Competição especial com prêmios exclusivos",
      type: "tournament",
      participants: 156,
      maxParticipants: 200,
      endDate: "2024-02-15",
      rewards: ["Cartas Lendárias", "1000 Moedas", "50 Gemas"],
      status: "active",
      progress: 78
    },
    {
      id: 2,
      title: "Festival da Colheita",
      description: "Evento temático focado em cartas de fazenda",
      type: "festival",
      participants: 89,
      maxParticipants: 100,
      endDate: "2024-02-10",
      rewards: ["Pack Especial", "500 Moedas"],
      status: "active",
      progress: 89
    },
    {
      id: 3,
      title: "Desafio Semanal",
      description: "Complete missões especiais para recompensas",
      type: "challenge",
      participants: 234,
      maxParticipants: 300,
      endDate: "2024-02-08",
      rewards: ["Boosters Premium", "200 Moedas"],
      status: "active",
      progress: 45
    }
  ];

  const upcomingEvents = [
    {
      id: 4,
      title: "Campeonato Mundial",
      description: "A maior competição do ano",
      type: "championship",
      startDate: "2024-02-20",
      rewards: ["Título Exclusivo", "5000 Moedas", "200 Gemas"],
      status: "upcoming"
    },
    {
      id: 5,
      title: "Evento de Halloween",
      description: "Cartas especiais com tema assustador",
      type: "seasonal",
      startDate: "2024-10-31",
      rewards: ["Cartas Únicas", "Pack Temático"],
      status: "upcoming"
    }
  ];

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
      case 'tournament': return 'from-yellow-500 to-orange-500';
      case 'festival': return 'from-purple-500 to-pink-500';
      case 'challenge': return 'from-blue-500 to-cyan-500';
      case 'championship': return 'from-red-500 to-pink-500';
      case 'seasonal': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Eventos Ativos */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap className="h-6 w-6 text-yellow-500" />
          Eventos Ativos
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeEvents.map((event) => (
            <Card key={event.id} className="bg-slate-800/80 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getEventColor(event.type)} flex items-center justify-center text-white`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div>
                      <CardTitle className="text-white">{event.title}</CardTitle>
                      <CardDescription className="text-white/70">{event.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Ativo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Participantes:</span>
                  <span className="text-white font-medium">{event.participants}/{event.maxParticipants}</span>
                </div>
                <Progress value={event.progress} className="w-full" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Termina em:</span>
                  <span className="text-white font-medium">{event.endDate}</span>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-white">Recompensas:</span>
                  <div className="flex flex-wrap gap-1">
                    {event.rewards.map((reward, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-yellow-500/30 text-yellow-400">
                        {reward}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white">
                  Participar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Próximos Eventos */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Clock className="h-6 w-6 text-blue-500" />
          Próximos Eventos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="bg-slate-800/80 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getEventColor(event.type)} flex items-center justify-center text-white`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <CardTitle className="text-white">{event.title}</CardTitle>
                    <CardDescription className="text-white/70">{event.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Inicia em:</span>
                  <span className="text-white font-medium">{event.startDate}</span>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-white">Recompensas:</span>
                  <div className="flex flex-wrap gap-1">
                    {event.rewards.map((reward, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-purple-500/30 text-purple-400">
                        {reward}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                  <Clock className="h-4 w-4 mr-2" />
                  Lembrar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ranking */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-green-500" />
          Ranking Global
        </h2>
        <Card className="bg-slate-800/80 border-slate-700/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              {leaderboard.map((player, index) => (
                <div key={player.rank} className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-sm">
                    {player.rank}
                  </div>
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{player.avatar}</span>
                    <div>
                      <div className="font-medium text-white">{player.name}</div>
                      <div className="text-sm text-white/70">Nível {player.level}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium text-white">{player.score.toLocaleString()}</div>
                      <div className="text-sm text-white/70">pontos</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-white/70">{player.trophies}</span>
                    </div>
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