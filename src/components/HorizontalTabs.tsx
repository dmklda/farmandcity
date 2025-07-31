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
  Newspaper
} from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface HorizontalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const tabItems: TabItem[] = [
  {
    id: 'overview',
    label: 'Visão Geral',
    icon: Home,
    description: 'Cards de navegação, estatísticas, conquistas, missões diárias'
  },
  {
    id: 'events',
    label: 'Eventos',
    icon: Calendar,
    description: 'Eventos especiais, rankings, torneios'
  },
  {
    id: 'community',
    label: 'Comunidade',
    icon: Users,
    description: 'Estatísticas da comunidade, fórum, discussões'
  },
  {
    id: 'news',
    label: 'Notícias',
    icon: Newspaper,
    description: 'Últimas atualizações, manutenções, próximas features'
  }
];

export const HorizontalTabs: React.FC<HorizontalTabsProps> = ({
  activeTab,
  onTabChange,
  className
}) => {
  return (
    <div className={cn("w-full", className)}>
      {/* Tabs Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-1 border border-slate-700/50 shadow-lg">
          <div className="flex space-x-1">
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 relative group",
                    "hover:bg-slate-700/50 hover:text-white",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-white/70"
                  )}
                  title={tab.description}
                >
                  <Icon className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    isActive && "scale-110"
                  )} />
                  <span className="font-medium">{tab.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
                  )}
                  
                  {/* Hover effect */}
                  <div className={cn(
                    "absolute inset-0 rounded-lg transition-opacity duration-300",
                    "bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100",
                    isActive && "opacity-100"
                  )}></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}; 
