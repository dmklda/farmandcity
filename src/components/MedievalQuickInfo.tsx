import React from 'react';
import { Bell, Calendar, Target, Trophy, Crown } from 'lucide-react';

interface MedievalQuickInfoProps {
  hasUnreadNotifications?: boolean;
  activeMissions?: number;
  upcomingEvents?: number;
  recentAchievements?: number;
}

export const MedievalQuickInfo: React.FC<MedievalQuickInfoProps> = ({
  hasUnreadNotifications = false,
  activeMissions = 0,
  upcomingEvents = 0,
  recentAchievements = 0
}) => {
  const quickInfoItems = [
    {
      label: "Notificações",
      value: hasUnreadNotifications ? "Novas" : "Atualizado",
      icon: Bell,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      gradient: "from-blue-500/20 to-cyan-500/20",
      show: true
    },
    {
      label: "Missões Ativas",
      value: activeMissions,
      icon: Target,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      gradient: "from-green-500/20 to-emerald-500/20",
      show: activeMissions > 0
    },
    {
      label: "Eventos Próximos",
      value: upcomingEvents,
      icon: Calendar,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      gradient: "from-purple-500/20 to-pink-500/20",
      show: upcomingEvents > 0
    },
    {
      label: "Conquistas Recentes",
      value: recentAchievements,
      icon: Trophy,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      gradient: "from-yellow-500/20 to-orange-500/20",
      show: recentAchievements > 0
    }
  ].filter(item => item.show);

  if (quickInfoItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          ⚡ Informações Rápidas
        </h3>
        <p className="text-purple-200/80 text-sm">
          Fique por dentro das novidades do reino
        </p>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickInfoItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="group relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-blue-500/30 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
              
              {/* Card Content */}
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300 shadow-xl">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 ${item.bgColor} rounded-lg border border-slate-600/50`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  
                  <div className="text-lg font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                    {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                  </div>
                  
                  <div className="text-purple-200/80 text-xs font-medium tracking-wide uppercase">
                    {item.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
