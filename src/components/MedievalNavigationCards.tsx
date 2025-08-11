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
  Map,
  Gem
} from 'lucide-react';

interface MedievalNavigationCardsProps {
  onStartGame: () => void;
  onGoToShop: () => void;
  onGoToCollection: () => void;
  onGoToMissions: () => void;
  onGoToDecks: () => void;
  onGoToSettings: () => void;
  decks: any[];
}

export const MedievalNavigationCards: React.FC<MedievalNavigationCardsProps> = ({
  onStartGame,
  onGoToShop,
  onGoToCollection,
  onGoToMissions,
  onGoToDecks,
  onGoToSettings,
  decks
}) => {
  const hasActiveDeck = decks && decks.length > 0;
  const navigationCards = [
    {
      title: "Modos de Jogo",
      description: hasActiveDeck 
        ? "Escolha entre diferentes modos de partida" 
        : "Crie um deck primeiro para acessar os modos de jogo",
      icon: Sword,
      action: hasActiveDeck ? onStartGame : onGoToDecks,
      gradient: hasActiveDeck ? "from-amber-600 via-orange-600 to-red-600" : "from-slate-600 via-gray-600 to-zinc-600",
      hoverGradient: hasActiveDeck ? "from-amber-500 via-orange-500 to-red-500" : "from-slate-500 via-gray-500 to-zinc-500",
      buttonGradient: hasActiveDeck ? "from-amber-700 to-red-700" : "from-slate-700 to-zinc-700",
      buttonHover: hasActiveDeck ? "from-amber-600 to-red-600" : "from-slate-600 to-zinc-600",
      borderColor: hasActiveDeck ? "border-amber-500/30" : "border-slate-500/30",
      hoverBorderColor: hasActiveDeck ? "border-amber-400/50" : "border-slate-400/50",
      iconBg: hasActiveDeck ? "bg-amber-600/20" : "bg-slate-600/20",
      iconColor: hasActiveDeck ? "text-amber-400" : "text-slate-400",
      theme: "battle",
      disabled: !hasActiveDeck
    },
    {
      title: "Taverna do Comerciante",
      description: "Compre packs, boosters e cartas especiais do reino",
      icon: Crown,
      action: onGoToShop,
      gradient: "from-yellow-600 via-amber-600 to-orange-600",
      hoverGradient: "from-yellow-500 via-amber-500 to-orange-500",
      buttonGradient: "from-yellow-700 to-orange-700",
      buttonHover: "from-yellow-600 to-orange-600",
      borderColor: "border-yellow-500/30",
      hoverBorderColor: "border-yellow-400/50",
      iconBg: "bg-yellow-600/20",
      iconColor: "text-yellow-400",
      theme: "tavern"
    },
    {
      title: "Tesouro Real",
      description: "Visualize e organize sua coleção de cartas",
      icon: Gem,
      action: onGoToCollection,
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      hoverGradient: "from-emerald-500 via-teal-500 to-cyan-500",
      buttonGradient: "from-emerald-700 to-cyan-700",
      buttonHover: "from-emerald-600 to-cyan-600",
      borderColor: "border-emerald-500/30",
      hoverBorderColor: "border-emerald-400/50",
      iconBg: "bg-emerald-600/20",
      iconColor: "text-emerald-400",
      theme: "treasure"
    },
    {
      title: "Quests Reais",
      description: "Complete desafios épicos e ganhe recompensas",
      icon: ScrollText,
      action: onGoToMissions,
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
      hoverGradient: "from-blue-500 via-indigo-500 to-purple-500",
      buttonGradient: "from-blue-700 to-purple-700",
      buttonHover: "from-blue-600 to-purple-600",
      borderColor: "border-blue-500/30",
      hoverBorderColor: "border-blue-400/50",
      iconBg: "bg-blue-600/20",
      iconColor: "text-blue-400",
      theme: "quest"
    },
    {
      title: "Arsenal Real",
      description: "Crie e gerencie seus baralhos de batalha",
      icon: Shield,
      action: onGoToDecks,
      gradient: "from-red-600 via-pink-600 to-rose-600",
      hoverGradient: "from-red-500 via-pink-500 to-rose-500",
      buttonGradient: "from-red-700 to-rose-700",
      buttonHover: "from-red-600 to-rose-600",
      borderColor: "border-red-500/30",
      hoverBorderColor: "border-red-400/50",
      iconBg: "bg-red-600/20",
      iconColor: "text-red-400",
      theme: "arsenal"
    },
    {
      title: "Conselho Real",
      description: "Personalize sua experiência de jogo",
      icon: Map,
      action: onGoToSettings,
      gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
      hoverGradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      buttonGradient: "from-violet-700 to-fuchsia-700",
      buttonHover: "from-violet-600 to-fuchsia-600",
      borderColor: "border-violet-500/30",
      hoverBorderColor: "border-violet-400/50",
      iconBg: "bg-violet-600/20",
      iconColor: "text-violet-400",
      theme: "council"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Section Title */}
      <div className="text-center">
        <p className="text-gray-300/80 text-lg mb-8 max-w-2xl mx-auto">
          Escolha seu destino e embarque em uma jornada épica através dos domínios do Farmand
        </p>
        <div className="flex items-center justify-center space-x-6">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-400"></div>
          <div className="relative">
            <Crown className="w-6 h-6 text-amber-400 animate-pulse" />
            <div className="absolute inset-0 w-6 h-6 bg-amber-400/20 rounded-full animate-ping"></div>
          </div>
          <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-400"></div>
        </div>
      </div>

      {/* Navigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {navigationCards.map((card, index) => {
          const Icon = card.icon;
          return (
                         <div key={index} className="group relative">
              {/* Enhanced Glow Effect */}
              <div className={`absolute -inset-2 bg-gradient-to-r ${card.gradient} rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500`}></div>
              
              {/* Card Container */}
              <div className={`relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-md border ${card.borderColor} hover:${card.hoverBorderColor} rounded-3xl overflow-hidden transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-105`}>
                
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10zm0 0c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10z'/%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                
                {/* Header with Icon */}
                <div className={`bg-gradient-to-r ${card.gradient} p-8 relative overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Floating Particles */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/30 rounded-full animate-pulse animation-delay-1000"></div>
                  
                  {/* Icon and Title Container */}
                  <div className={`relative z-10 ${card.iconBg} p-4 rounded-2xl border border-white/30 backdrop-blur-sm shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Icon and Title in Horizontal Layout */}
                    <div className="relative flex items-center gap-4">
                      {/* Icon */}
                      <Icon className={`relative h-8 w-8 ${card.iconColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`} />
                      
                      {/* Title */}
                      <h3 className="relative text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8 relative">
                  <p className="text-gray-300/80 mb-8 text-sm leading-relaxed group-hover:text-gray-200/90 transition-colors duration-300">
                    {card.description}
                  </p>
                  
                  {/* Enhanced Action Button */}
                  <Button 
                    onClick={card.action}
                    className={`w-full bg-gradient-to-r ${card.buttonGradient} hover:${card.buttonHover} text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-lg border border-white/20 hover:shadow-xl hover:border-white/40`}
                  >
                    <ChevronRight className="h-5 w-5 mr-3 group-hover:translate-x-2 transition-transform duration-300" />
                                         {card.disabled ? "Criar Deck Primeiro" : "Acessar"}
                  </Button>
                </div>
                
                {/* Enhanced Corner Decorations */}
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-white/10 group-hover:border-t-white/20 transition-colors duration-300"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[20px] border-r-transparent border-b-[20px] border-b-white/5 group-hover:border-b-white/10 transition-colors duration-300"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
