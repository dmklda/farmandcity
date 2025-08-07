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
  Crown,
  Shield,
  Sword,
  ScrollText,
  Map
} from 'lucide-react';

interface MedievalNavigationCardsProps {
  onStartGame: () => void;
  onGoToShop: () => void;
  onGoToCollection: () => void;
  onGoToMissions: () => void;
  onGoToDecks: () => void;
  onGoToSettings: () => void;
}

export const MedievalNavigationCards: React.FC<MedievalNavigationCardsProps> = ({
  onStartGame,
  onGoToShop,
  onGoToCollection,
  onGoToMissions,
  onGoToDecks,
  onGoToSettings
}) => {
  const navigationCards = [
    {
      title: "Jogar",
      description: "Inicie uma nova partida e construa seu império",
      icon: Play,
      action: onStartGame,
      gradient: "from-green-600 to-emerald-700",
      hoverGradient: "from-green-500 to-emerald-600",
      buttonGradient: "from-green-700 to-emerald-700",
      buttonHover: "from-green-600 to-emerald-600",
      borderColor: "border-green-500/30",
      hoverBorderColor: "border-green-400/50",
      iconBg: "bg-green-600/20",
      iconColor: "text-green-400"
    },
    {
      title: "Loja",
      description: "Compre packs, boosters e cartas especiais",
      icon: Trophy,
      action: onGoToShop,
      gradient: "from-blue-600 to-cyan-700",
      hoverGradient: "from-blue-500 to-cyan-600",
      buttonGradient: "from-blue-700 to-cyan-700",
      buttonHover: "from-blue-600 to-cyan-600",
      borderColor: "border-blue-500/30",
      hoverBorderColor: "border-blue-400/50",
      iconBg: "bg-blue-600/20",
      iconColor: "text-blue-400"
    },
    {
      title: "Coleção",
      description: "Visualize e organize suas cartas",
      icon: Target,
      action: onGoToCollection,
      gradient: "from-purple-600 to-pink-700",
      hoverGradient: "from-purple-500 to-pink-600",
      buttonGradient: "from-purple-700 to-pink-700",
      buttonHover: "from-purple-600 to-pink-600",
      borderColor: "border-purple-500/30",
      hoverBorderColor: "border-purple-400/50",
      iconBg: "bg-purple-600/20",
      iconColor: "text-purple-400"
    },
    {
      title: "Missões",
      description: "Complete desafios e ganhe recompensas",
      icon: TrendingUp,
      action: onGoToMissions,
      gradient: "from-orange-600 to-red-700",
      hoverGradient: "from-orange-500 to-red-600",
      buttonGradient: "from-orange-700 to-red-700",
      buttonHover: "from-orange-600 to-red-600",
      borderColor: "border-orange-500/30",
      hoverBorderColor: "border-orange-400/50",
      iconBg: "bg-orange-600/20",
      iconColor: "text-orange-400"
    },
    {
      title: "Decks",
      description: "Crie e gerencie seus baralhos",
      icon: Shield,
      action: onGoToDecks,
      gradient: "from-indigo-600 to-blue-700",
      hoverGradient: "from-indigo-500 to-blue-600",
      buttonGradient: "from-indigo-700 to-blue-700",
      buttonHover: "from-indigo-600 to-blue-600",
      borderColor: "border-indigo-500/30",
      hoverBorderColor: "border-indigo-400/50",
      iconBg: "bg-indigo-600/20",
      iconColor: "text-indigo-400"
    },
    {
      title: "Configurações",
      description: "Personalize sua experiência de jogo",
      icon: Settings,
      action: onGoToSettings,
      gradient: "from-slate-600 to-gray-700",
      hoverGradient: "from-slate-500 to-gray-600",
      buttonGradient: "from-slate-700 to-gray-700",
      buttonHover: "from-slate-600 to-gray-600",
      borderColor: "border-slate-500/30",
      hoverBorderColor: "border-slate-400/50",
      iconBg: "bg-slate-600/20",
      iconColor: "text-slate-400"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Section Title */}
      <div className="text-center">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Navegue pelo Reino
        </h3>
        <div className="flex items-center justify-center space-x-4">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-purple-400"></div>
          <Crown className="w-5 h-5 text-purple-400" />
          <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-purple-400"></div>
        </div>
      </div>

      {/* Navigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="group relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-blue-500/30 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
              
              {/* Card Container */}
              <div className={`relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border ${card.borderColor} hover:${card.hoverBorderColor} rounded-2xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl`}>
                {/* Header with Icon */}
                <div className={`bg-gradient-to-r ${card.gradient} p-6 relative overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  {/* Icon Container */}
                  <div className={`relative z-10 ${card.iconBg} p-3 rounded-xl border border-white/20 backdrop-blur-sm`}>
                    <Icon className={`h-8 w-8 ${card.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full"></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/20 rounded-full"></div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {card.title}
                  </h3>
                  
                  <p className="text-purple-200/70 mb-6 text-sm leading-relaxed">
                    {card.description}
                  </p>
                  
                  {/* Action Button */}
                  <Button 
                    onClick={card.action}
                    className={`w-full bg-gradient-to-r ${card.buttonGradient} hover:${card.buttonHover} text-white font-semibold transition-all duration-300 group-hover:scale-105 shadow-lg border border-white/20`}
                  >
                    <ChevronRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    Acessar
                  </Button>
                </div>
                
                {/* Corner Decoration */}
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-white/10"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
