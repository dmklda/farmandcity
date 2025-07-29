import React, { useState, useEffect } from 'react';
import { Activity, Users, Trophy, Star, Zap, Heart, MessageCircle, Gift } from 'lucide-react';

interface ActivityItem {
  id: number;
  type: 'achievement' | 'game' | 'social' | 'reward';
  user: string;
  action: string;
  target?: string;
  time: string;
  icon: string;
  color: string;
}

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 1,
      type: 'achievement',
      user: 'ImperadorMax',
      action: 'desbloqueou a conquista',
      target: 'Mestre das Cartas',
      time: '2 min atrás',
      icon: '🏆',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 2,
      type: 'game',
      user: 'ConstrutorPro',
      action: 'construiu uma nova cidade',
      target: 'Metrópole do Norte',
      time: '5 min atrás',
      icon: '🏘️',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 3,
      type: 'social',
      user: 'FazendeiroElite',
      action: 'juntou-se ao clã',
      target: 'Guilda dos Construtores',
      time: '8 min atrás',
      icon: '👥',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 4,
      type: 'reward',
      user: 'JogadorNovo',
      action: 'ganhou um pacote de cartas',
      target: 'Pacote Lendário',
      time: '12 min atrás',
      icon: '🎁',
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 5,
      type: 'game',
      user: 'MestreEstrategista',
      action: 'completou uma partida em',
      target: '15 minutos',
      time: '15 min atrás',
      icon: '⚡',
      color: 'from-red-400 to-pink-500'
    }
  ]);

  const [isExpanded, setIsExpanded] = useState(false);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="h-4 w-4" />;
      case 'game': return <Activity className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      case 'reward': return <Gift className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'text-yellow-400';
      case 'game': return 'text-blue-400';
      case 'social': return 'text-green-400';
      case 'reward': return 'text-purple-400';
      default: return 'text-white/60';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl shadow-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Activity className="h-6 w-6 text-blue-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
            Atividades em Tempo Real
          </h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/60 hover:text-white transition-colors duration-300"
        >
          {isExpanded ? 'Ver Menos' : 'Ver Mais'}
        </button>
      </div>

      <div className="space-y-4">
        {(isExpanded ? activities : activities.slice(0, 3)).map((activity, index) => (
          <div
            key={activity.id}
            className={`bg-slate-700/50 rounded-xl p-4 border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 transform hover:scale-105 ${
              index === 0 ? 'animate-pulse' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${activity.color} flex items-center justify-center text-lg relative`}>
                <span>{activity.icon}</span>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{activity.user}</span>
                  <span className="text-white/70">{activity.action}</span>
                  {activity.target && (
                    <span className="font-semibold text-white/90">{activity.target}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <span>{activity.time}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    3
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    1
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button 
                  className="text-white/40 hover:text-white/80 transition-colors duration-300"
                  title="Curtir atividade"
                  aria-label="Curtir atividade"
                >
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Curtir atividade</span>
                </button>
                <button 
                  className="text-white/40 hover:text-white/80 transition-colors duration-300"
                  title="Comentar atividade"
                  aria-label="Comentar atividade"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="sr-only">Comentar atividade</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isExpanded && activities.length > 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-300 text-sm font-medium"
          >
            Ver mais {activities.length - 3} atividades
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed; 