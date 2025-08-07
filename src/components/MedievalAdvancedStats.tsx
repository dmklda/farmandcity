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
  Activity,
  Crown,
  Gem,
  Scroll,
  Castle
} from 'lucide-react';

interface MedievalAdvancedStatsProps {
  playerCards: any[];
  decks: any[];
  currency: { coins: number; gems: number } | null;
}

export const MedievalAdvancedStats: React.FC<MedievalAdvancedStatsProps> = ({
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
      progress: 68.5,
      gradient: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/30"
    },
    {
      title: "Partidas Jogadas",
      value: "247",
      change: "+12",
      changeType: "positive" as const,
      icon: Target,
      color: "text-blue-400",
      progress: 75,
      gradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30"
    },
    {
      title: "Tempo de Jogo",
      value: "156h",
      change: "+8h",
      changeType: "positive" as const,
      icon: Clock,
      color: "text-green-400",
      progress: 60,
      gradient: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30"
    },
    {
      title: "Nível Atual",
      value: "42",
      change: "+3",
      changeType: "positive" as const,
      icon: Star,
      color: "text-purple-400",
      progress: 84,
      gradient: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30"
    }
  ];

  const achievements = [
    {
      title: "Primeiro Império",
      description: "Construiu 10 fazendas",
      progress: 100,
      rarity: "common" as const,
      icon: Shield,
      reward: "50 moedas",
      gradient: "from-gray-500/20 to-slate-500/20"
    },
    {
      title: "Mestre das Cartas",
      description: "Colecionou 50 cartas",
      progress: 75,
      rarity: "rare" as const,
      icon: Star,
      reward: "100 moedas",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Construtor",
      description: "Construiu 5 cidades",
      progress: 60,
      rarity: "epic" as const,
      icon: Castle,
      reward: "25 gemas",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      title: "Lendário",
      description: "Alcançou o nível máximo",
      progress: 25,
      rarity: "legendary" as const,
      icon: Crown,
      reward: "500 moedas",
      gradient: "from-yellow-500/20 to-orange-500/20"
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
      case 'purchase': return <Gem className="w-4 h-4 text-blue-400" />;
      case 'mission': return <Scroll className="w-4 h-4 text-green-400" />;
      case 'deck': return <Shield className="w-4 h-4 text-purple-400" />;
      case 'level': return <Crown className="w-4 h-4 text-orange-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-12">
      {/* Performance Metrics */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-lg opacity-60"></div>
            <div className="relative bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-3 rounded-full border border-purple-500/30">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Métricas de Performance
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="group relative">
                <div className={`absolute -inset-1 bg-gradient-to-r ${metric.gradient} rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300`}></div>
                <Card className={`relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border ${metric.borderColor} hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-r ${metric.gradient} rounded-lg blur-sm opacity-60`}></div>
                        <div className={`relative bg-gradient-to-r ${metric.gradient} p-2 rounded-lg border border-white/10`}>
                          <Icon className={`w-5 h-5 ${metric.color}`} />
                        </div>
                      </div>
                      <Badge className={`${
                        metric.changeType === 'positive' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      } backdrop-blur-sm`}>
                        {metric.changeType === 'positive' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {metric.change}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg font-semibold">{metric.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white mb-3">{metric.value}</div>
                    <Progress value={metric.progress} className="h-3 bg-slate-700/50">
                      <div className={`h-3 bg-gradient-to-r ${getRarityColor('epic')} rounded-full transition-all duration-300 shadow-lg`} 
                           style={{ width: `${metric.progress}%` }}></div>
                    </Progress>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Achievements */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full blur-lg opacity-60"></div>
              <div className="relative bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-3 rounded-full border border-yellow-500/30">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Conquistas Recentes
            </h3>
          </div>
          
          <div className="space-y-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="group relative">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${achievement.gradient} rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300`}></div>
                  <Card className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className={`absolute inset-0 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-xl blur-lg opacity-60`}></div>
                          <div className={`relative p-3 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-xl border border-white/20 shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-base mb-1">{achievement.title}</h4>
                          <p className="text-white/60 text-sm mb-3">{achievement.description}</p>
                          <div className="flex items-center justify-between mb-3">
                            <Progress value={achievement.progress} className="flex-1 h-2 bg-slate-700/50 mr-3">
                              <div className={`h-2 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-full transition-all duration-300 shadow-lg`} 
                                   style={{ width: `${achievement.progress}%` }}></div>
                            </Progress>
                            <span className="text-white/60 text-sm font-medium">{achievement.progress}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className={`text-xs backdrop-blur-sm ${
                              achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                              achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                              achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }`}>
                              {achievement.rarity}
                            </Badge>
                            <span className="text-white/60 text-sm font-medium">{achievement.reward}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full blur-lg opacity-60"></div>
              <div className="relative bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-3 rounded-full border border-green-500/30">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Atividade Recente
            </h3>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <Card className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 hover:border-green-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-slate-700/30 transition-colors group/item">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/30 to-slate-700/30 rounded-lg blur-sm opacity-60"></div>
                        <div className="relative p-2 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg border border-white/10">
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium group-hover/item:text-purple-300 transition-colors">{activity.action}</p>
                        <p className="text-white/60 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <button className="w-full text-center text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors group">
                    <span className="group-hover:underline">Ver toda atividade</span>
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-lg opacity-60"></div>
            <div className="relative bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-3 rounded-full border border-blue-500/30">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Resumo Geral
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Cartas", value: playerCards.length, icon: Scroll, gradient: "from-purple-500/20 to-pink-500/20" },
            { label: "Decks", value: decks.length, icon: Shield, gradient: "from-blue-500/20 to-cyan-500/20" },
            { label: "Moedas", value: currency?.coins || 0, icon: Gem, gradient: "from-yellow-500/20 to-orange-500/20" },
            { label: "Gemas", value: currency?.gems || 0, icon: Crown, gradient: "from-green-500/20 to-emerald-500/20" }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="group relative">
                <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300`}></div>
                <Card className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 text-center">
                  <CardContent className="p-6">
                    <div className="relative mb-3">
                      <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-lg blur-sm opacity-60`}></div>
                      <div className={`relative bg-gradient-to-r ${stat.gradient} p-3 rounded-lg border border-white/10 inline-block`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-white/60 text-sm font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
