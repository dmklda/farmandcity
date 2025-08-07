import React from 'react';
import { cn } from '../lib/utils';
import { 
  Home, 
  Calendar, 
  Users, 
  Bell, 
  BarChart3, 
  Trophy, 
  Target, 
  Star,
  TrendingUp,
  Award,
  MessageSquare,
  Newspaper,
  Crown,
  Shield,
  Sword,
  ScrollText,
  Map,
  BookOpen
} from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  medievalIcon?: React.ComponentType<{ className?: string }>;
}

interface MedievalHorizontalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const tabItems: TabItem[] = [
  {
    id: 'overview',
    label: 'Visão Geral',
    icon: Home,
    medievalIcon: Crown,
    description: 'Cards de navegação, estatísticas, conquistas, missões diárias'
  },
  {
    id: 'events',
    label: 'Eventos',
    icon: Calendar,
    medievalIcon: Trophy,
    description: 'Eventos especiais, rankings, torneios'
  },
  {
    id: 'community',
    label: 'Comunidade',
    icon: Users,
    medievalIcon: Users,
    description: 'Estatísticas da comunidade, fórum, discussões'
  },
  {
    id: 'news',
    label: 'Notícias',
    icon: Newspaper,
    medievalIcon: ScrollText,
    description: 'Últimas atualizações, manutenções, próximas features'
  },
  {
    id: 'achievements',
    label: 'Conquistas',
    icon: Trophy,
    medievalIcon: Award,
    description: 'Conquistas desbloqueadas, progresso, recompensas'
  },
  {
    id: 'missions',
    label: 'Missões',
    icon: Target,
    medievalIcon: Sword,
    description: 'Missões diárias, semanais, progresso, recompensas'
  }
];

export const MedievalHorizontalTabs: React.FC<MedievalHorizontalTabsProps> = ({
  activeTab,
  onTabChange,
  className
}) => {
  return (
    <div className={cn("w-full", className)}>
      {/* Medieval Tabs Navigation */}
      <div className="flex justify-center mb-12">
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-blue-500/30 rounded-2xl blur-lg opacity-75"></div>
          
          {/* Tabs Container */}
          <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-2 border border-purple-500/30 shadow-2xl">
            <div className="flex space-x-2">
              {tabItems.map((tab) => {
                const Icon = tab.medievalIcon || tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                      "relative px-6 py-4 rounded-xl flex items-center gap-3 transition-all duration-300 group",
                      "hover:bg-white/10 hover:text-white",
                      isActive
                        ? "bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white shadow-lg"
                        : "text-purple-200/80 hover:text-purple-100"
                    )}
                    title={tab.description}
                  >
                    {/* Background gradient for active state */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl"></div>
                    )}
                    
                    {/* Icon Container */}
                    <div className={cn(
                      "relative z-10 p-2 rounded-lg transition-all duration-300",
                      isActive 
                        ? "bg-white/20 border border-white/30" 
                        : "bg-slate-700/50 border border-slate-600/50 group-hover:bg-slate-600/50 group-hover:border-slate-500/50"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5 transition-all duration-300",
                        isActive && "scale-110 text-white",
                        !isActive && "group-hover:scale-105"
                      )} />
                    </div>
                    
                    {/* Label */}
                    <span className={cn(
                      "font-semibold transition-all duration-300 relative z-10",
                      isActive && "text-white",
                      !isActive && "group-hover:text-purple-100"
                    )}>
                      {tab.label}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg"></div>
                    )}
                    
                    {/* Hover glow effect */}
                    <div className={cn(
                      "absolute inset-0 rounded-xl transition-opacity duration-300",
                      "bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100",
                      isActive && "opacity-100"
                    )}></div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
