import React from 'react';
import { Button } from './ui/button';
import { Play, Crown, Shield, Sword, Zap, Star } from 'lucide-react';
import { MedievalLevelProgress } from './MedievalLevelProgress';

interface MedievalHeroSectionProps {
  userName: string;
  onStartGame: () => void;
  onSelectGameMode: () => void;
  currency: { coins: number; gems: number } | null;
  playerCards: any[];
  decks: any[];
}

export const MedievalHeroSection: React.FC<MedievalHeroSectionProps> = ({
  userName,
  onStartGame,
  onSelectGameMode,
  currency,
  playerCards,
  decks
}) => {
  const quickStats = [
    { 
      label: "Cartas", 
      value: playerCards.length, 
      icon: Star, 
      color: "text-yellow-400",
      gradient: "from-yellow-500/20 to-orange-500/20"
    },
    { 
      label: "Decks", 
      value: decks.length, 
      icon: Shield, 
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    { 
      label: "Moedas", 
      value: currency?.coins || 0, 
      icon: Crown, 
      color: "text-yellow-500",
      gradient: "from-yellow-500/20 to-amber-500/20"
    },
    { 
      label: "Gemas", 
      value: currency?.gems || 0, 
      icon: Zap, 
      color: "text-purple-400",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Main Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background with Medieval Texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/60 to-blue-900/60 backdrop-blur-sm border border-purple-500/30 rounded-3xl shadow-2xl">
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-600/20 to-transparent rounded-full blur-3xl"></div>
          
          {/* Subtle Medieval Pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10 p-8 lg:p-12">
          {/* Welcome Text */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4 tracking-wide">
                Bem-vindo de volta, {userName}!
              </h2>
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 blur-2xl opacity-20 -z-10"></div>
            </div>
            
            <p className="text-xl lg:text-2xl text-purple-200/90 mb-6 font-medium">
              Seu império medieval aguarda sua sabedoria
            </p>
            
            {/* Decorative Divider */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-purple-400"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-purple-400"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <Button 
              onClick={onSelectGameMode}
              className="relative group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold px-10 py-4 text-lg transition-all duration-300 hover:scale-105 shadow-2xl shadow-green-500/25 border border-green-400/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Play className="h-6 w-6 mr-3 relative z-10" />
              <span className="relative z-10">Escolher Modo de Jogo</span>
            </Button>
            
            <Button 
              onClick={onStartGame}
              variant="outline"
              className="relative group bg-white/10 hover:bg-white/20 text-white font-bold px-10 py-4 text-lg transition-all duration-300 backdrop-blur-sm border-purple-400/30 hover:border-purple-300/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Sword className="h-6 w-6 mr-3 relative z-10" />
              <span className="relative z-10">Jogo Rápido</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-blue-500/30 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
              
              {/* Card Content */}
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 shadow-xl">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 bg-slate-700/50 rounded-lg border border-slate-600/50`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  
                  <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value.toLocaleString()}
                  </div>
                  
                  <div className="text-purple-200/80 text-sm font-medium tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Level Progress Section */}
      <MedievalLevelProgress
        currentLevel={42}
        currentXP={1250}
        xpToNextLevel={1500}
        totalXP={15680}
      />
    </div>
  );
};
