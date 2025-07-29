import React from 'react';
import { Button } from './ui/button';
import { 
  Play, 
  Trophy, 
  Target, 
  TrendingUp, 
  Users, 
  Settings,
  ChevronRight,
  Star,
  Crown,
  Zap,
  Shield,
  Sword
} from 'lucide-react';

interface GamingHeroProps {
  onStartGame: () => void;
  onSelectGameMode: () => void;
  onGoToShop: () => void;
  onGoToCollection: () => void;
  onGoToMissions: () => void;
  onGoToDecks: () => void;
  currency: { coins: number; gems: number } | null;
  playerCards: any[];
  decks: any[];
}

export const GamingHero: React.FC<GamingHeroProps> = ({
  onStartGame,
  onSelectGameMode,
  onGoToShop,
  onGoToCollection,
  onGoToMissions,
  onGoToDecks,
  currency,
  playerCards,
  decks
}) => {
  const quickStats = [
    { label: "Cartas", value: playerCards.length, icon: Star, color: "text-yellow-400" },
    { label: "Decks", value: decks.length, icon: Shield, color: "text-blue-400" },
    { label: "Moedas", value: currency?.coins || 0, icon: Crown, color: "text-yellow-500" },
    { label: "Gemas", value: currency?.gems || 0, icon: Zap, color: "text-purple-400" },
  ];

  const navigationCards = [
    {
      title: "Jogar",
      description: "Inicie uma nova partida e construa seu império",
      icon: Play,
      action: onStartGame,
      gradient: "from-green-500 to-emerald-600",
      hoverGradient: "from-green-400 to-emerald-500",
      buttonGradient: "from-green-600 to-emerald-600",
      buttonHover: "from-green-500 to-emerald-500"
    },
    {
      title: "Loja",
      description: "Compre packs, boosters e cartas especiais",
      icon: Trophy,
      action: onGoToShop,
      gradient: "from-blue-500 to-cyan-600",
      hoverGradient: "from-blue-400 to-cyan-500",
      buttonGradient: "from-blue-600 to-cyan-600",
      buttonHover: "from-blue-500 to-cyan-500"
    },
    {
      title: "Coleção",
      description: "Visualize e organize suas cartas",
      icon: Target,
      action: onGoToCollection,
      gradient: "from-purple-500 to-pink-600",
      hoverGradient: "from-purple-400 to-pink-500",
      buttonGradient: "from-purple-600 to-pink-600",
      buttonHover: "from-purple-500 to-pink-500"
    },
    {
      title: "Missões",
      description: "Complete desafios e ganhe recompensas",
      icon: TrendingUp,
      action: onGoToMissions,
      gradient: "from-orange-500 to-red-600",
      hoverGradient: "from-orange-400 to-red-500",
      buttonGradient: "from-orange-600 to-red-600",
      buttonHover: "from-orange-500 to-red-500"
    },
    {
      title: "Decks",
      description: "Crie e gerencie seus baralhos",
      icon: Shield,
      action: onGoToDecks,
      gradient: "from-indigo-500 to-blue-600",
      hoverGradient: "from-indigo-400 to-blue-500",
      buttonGradient: "from-indigo-600 to-blue-600",
      buttonHover: "from-indigo-500 to-blue-500"
    },
    {
      title: "Configurações",
      description: "Personalize sua experiência de jogo",
      icon: Settings,
      action: () => {},
      gradient: "from-gray-500 to-slate-600",
      hoverGradient: "from-gray-400 to-slate-500",
      buttonGradient: "from-gray-600 to-slate-600",
      buttonHover: "from-gray-500 to-slate-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900/80 via-purple-900/40 to-blue-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            Pronto para a Aventura?
          </h2>
          <p className="text-white/80 text-lg mb-6 max-w-2xl">
            Seu império aguarda! Construa fazendas, desenvolva cidades e domine o mundo com estratégia e habilidade.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button 
              onClick={onSelectGameMode}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25"
            >
              <Play className="h-5 w-5 mr-2" />
              Escolher Modo de Jogo
            </Button>
            <Button 
              onClick={onStartGame}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 text-lg transition-all duration-300 backdrop-blur-sm border-white/20 hover:border-white/40"
            >
              Jogo Rápido
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-blue-500/30 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-blue-500/30 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300">
                <div className={`bg-gradient-to-r ${card.gradient} p-6 relative overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <Icon className="h-12 w-12 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-white/70 mb-4 text-sm">
                    {card.description}
                  </p>
                  <Button 
                    onClick={card.action}
                    className={`w-full bg-gradient-to-r ${card.buttonGradient} hover:${card.buttonHover} text-white font-semibold transition-all duration-300 group-hover:scale-105`}
                  >
                    <ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    Acessar
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 