import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Trophy, 
  Star, 
  Clock,
  Award,
  Zap,
  Shield,
  Sword,
  Users,
  Activity
} from 'lucide-react';

interface AdvancedStatsProps {
  playerCards: any[];
  decks: any[];
  currency: { coins: number; gems: number } | null;
}

export const AdvancedStats: React.FC<AdvancedStatsProps> = ({
  playerCards,
  decks,
  currency
}) => {
  const performanceMetrics = [
    {
      title: "Taxa de Vitória",
      value: "68.5%",
      change: "+5.2%",
      changeType: "positive" as const,
      icon: Trophy,
      color: "text-yellow-400",
      progress: 68.5
    },
    {
      title: "Partidas Jogadas",
      value: "247",
      change: "+12",
      changeType: "positive" as const,
      icon: Target,
      color: "text-blue-400",
      progress: 75
    },
    {
      title: "Tempo de Jogo",
      value: "156h",
      change: "+8h",
      changeType: "positive" as const,
      icon: Clock,
      color: "text-green-400",
      progress: 60
    },
    {
      title: "Nível Atual",
      value: "42",
      change: "+3",
      changeType: "positive" as const,
      icon: Star,
      color: "text-purple-400",
      progress: 84
    }
  ];

  const achievements = [
    {
      title: "Primeiro Império",
      description: "Construiu 10 fazendas",
      progress: 100,
      rarity: "common" as const,
      icon: Shield,
      reward: "50 moedas"
    },
    {
      title: "Mestre das Cartas",
      description: "Colecionou 50 cartas",
      progress: 75,
      rarity: "rare" as const,
      icon: Star,
      reward: "100 moedas"
    },
    {
      title: "Construtor",
      description: "Construiu 5 cidades",
      progress: 60,
      rarity: "epic" as const,
      icon: Award,
      reward: "25 gemas"
    },
    {
      title: "Lendário",
      description: "Alcançou o nível máximo",
      progress: 25,
      rarity: "legendary" as const,
      icon: Zap,
      reward: "500 moedas"
    }
  ];

  const recentActivity = [
    { action: "Venceu uma partida", time: "2h atrás", type: "victory" },
    { action: "Comprou um pack", time: "4h atrás", type: "purchase" },
    { action: "Completou missão diária", time: "6h atrás", type: "mission" },
    { action: "Criou novo deck", time: "1d atrás", type: "deck" },
    { action: "Alcançou novo nível", time: "2d atrás", type: "level" }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 to-orange-600';
      case 'epic': return 'from-purple-500 to-pink-600';
      case 'rare': return 'from-blue-500 to-cyan-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'victory': return <Trophy className="w-4 h-4 text-yellow-400" />;
      case 'purchase': return <Star className="w-4 h-4 text-blue-400" />;
      case 'mission': return <Target className="w-4 h-4 text-green-400" />;
      case 'deck': return <Shield className="w-4 h-4 text-purple-400" />;
      case 'level': return <Zap className="w-4 h-4 text-orange-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-400" />
          Métricas de Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="bg-slate-800/80 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                    <Badge className={`${
                      metric.changeType === 'positive' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {metric.changeType === 'positive' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {metric.change}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg">{metric.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-3">{metric.value}</div>
                  <Progress value={metric.progress} className="h-2 bg-slate-700">
                    <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300" 
                         style={{ width: `${metric.progress}%` }}></div>
                  </Progress>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Achievements and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Achievements */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-400" />
            Conquistas Recentes
          </h3>
          <div className="space-y-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Card key={index} className="bg-slate-800/80 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm">{achievement.title}</h4>
                        <p className="text-white/60 text-xs mb-2">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <Progress value={achievement.progress} className="flex-1 h-2 bg-slate-700 mr-3">
                            <div className={`h-2 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-full transition-all duration-300`} 
                                 style={{ width: `${achievement.progress}%` }}></div>
                          </Progress>
                          <span className="text-white/60 text-xs">{achievement.progress}%</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge className={`text-xs ${
                            achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                            achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }`}>
                            {achievement.rarity}
                          </Badge>
                          <span className="text-white/60 text-xs">{achievement.reward}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-400" />
            Atividade Recente
          </h3>
          <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700/50">
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{activity.action}</p>
                      <p className="text-white/60 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/50">
                <button className="w-full text-center text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                  Ver toda atividade →
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" />
          Resumo Geral
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700/50 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white mb-1">{playerCards.length}</div>
              <div className="text-white/60 text-sm">Cartas</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700/50 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white mb-1">{decks.length}</div>
              <div className="text-white/60 text-sm">Decks</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700/50 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white mb-1">{currency?.coins || 0}</div>
              <div className="text-white/60 text-sm">Moedas</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700/50 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white mb-1">{currency?.gems || 0}</div>
              <div className="text-white/60 text-sm">Gemas</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 
