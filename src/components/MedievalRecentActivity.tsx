import React from 'react';
import { TrendingUp, Trophy, Clock, Target, Star, Crown, Gem, Shield, Activity, Calendar } from 'lucide-react';

interface MedievalRecentActivityProps {
  playerCards: any[];
  decks: any[];
  currency: { coins: number; gems: number } | null;
}

export const MedievalRecentActivity: React.FC<MedievalRecentActivityProps> = ({
  playerCards,
  decks,
  currency
}) => {
  // Dados simulados para demonstração
  const recentActivities = [
    { action: "Venceu uma partida", time: "2h atrás", icon: Trophy, color: "text-yellow-400" },
    { action: "Comprou um pack", time: "4h atrás", icon: Star, color: "text-blue-400" },
    { action: "Completou missão diária", time: "6h atrás", icon: Target, color: "text-green-400" },
    { action: "Criou novo deck", time: "1d atrás", icon: Shield, color: "text-purple-400" },
    { action: "Alcançou novo nível", time: "2d atrás", icon: Crown, color: "text-orange-400" }
  ];

  const recentAchievements = [
    { 
      title: "Primeiro Império", 
      description: "Construiu 10 fazendas", 
      progress: 100, 
      reward: "50 moedas",
      rarity: "common",
      icon: Crown
    },
    { 
      title: "Mestre das Cartas", 
      description: "Colecionou 50 cartas", 
      progress: 75, 
      reward: "100 moedas",
      rarity: "rare",
      icon: Star
    },
    { 
      title: "Construtor", 
      description: "Construiu 5 cidades", 
      progress: 60, 
      reward: "25 gemas",
      rarity: "epic",
      icon: Shield
    }
  ];

  const performanceMetrics = [
    { label: "Taxa de Vitória", value: "68.5%", change: "+5.2%", icon: TrendingUp, color: "text-green-400" },
    { label: "Partidas Jogadas", value: "247", change: "+12", icon: Activity, color: "text-blue-400" },
    { label: "Tempo de Jogo", value: "156h", change: "+8h", icon: Clock, color: "text-purple-400" },
    { label: "Nível Atual", value: "42", change: "+2", icon: Crown, color: "text-yellow-400" }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            📊 Métricas de Performance
          </h3>
          <p className="text-purple-200/80 text-sm">
            Seu progresso e estatísticas de jogo
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-blue-500/30 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-slate-700/50 rounded-lg border border-slate-600/50">
                      <Icon className={`w-5 h-5 ${metric.color}`} />
                    </div>
                    <div className="text-xs text-green-400 font-medium">
                      {metric.change}
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="text-purple-200/80 text-xs font-medium">
                    {metric.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
            🏆 Conquistas Recentes
          </h3>
          <p className="text-purple-200/80 text-sm">
            Desafios completados e recompensas ganhas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentAchievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600/30 via-orange-500/30 to-red-500/30 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300 shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-slate-700/50 rounded-lg border border-slate-600/50">
                      <Icon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm">
                        {achievement.title}
                      </h4>
                      <p className="text-purple-200/80 text-xs">
                        {achievement.description}
                      </p>
                    </div>
                    <div className={`text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-200/80">Progresso</span>
                      <span className="text-white font-medium">{achievement.progress}%</span>
                    </div>
                    <div className="relative bg-slate-700/50 rounded-full h-2 border border-slate-600/50 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-green-400 font-medium">
                      Recompensa: {achievement.reward}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            📈 Atividade Recente
          </h3>
          <p className="text-purple-200/80 text-sm">
            Suas últimas ações no reino
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <div className="space-y-3">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-purple-400/50 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-600/50 rounded-lg border border-slate-500/50">
                      <Icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <span className="text-white font-medium text-sm">
                      {activity.action}
                    </span>
                  </div>
                  <span className="text-purple-200/60 text-xs">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 text-center">
            <button className="text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors duration-300">
              Ver toda atividade →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
