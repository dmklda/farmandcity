import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package, 
  FileBarChart, 
  ScrollText, 
  Settings, 
  Shield,
  Menu,
  X,
  Gift,
  Calendar,
  Palette,
  Megaphone,
  Bell,
  Trophy
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', description: 'Visão geral do sistema', icon: LayoutDashboard },
  { id: 'cards', label: 'Gerenciar Cartas', description: 'Criar e editar cartas', icon: FileText },
  { id: 'packs', label: 'Packs e Boosters', description: 'Gerenciar pacotes', icon: Package },
  { id: 'events', label: 'Eventos', description: 'Eventos especiais', icon: Gift },
  { id: 'rotation', label: 'Rotação Diária', description: 'Ciclo diário de cartas', icon: Calendar },
  { id: 'announcements', label: 'Avisos da Loja', description: 'Gerenciar anúncios', icon: Megaphone },
  { id: 'global-announcements', label: 'Anúncios Globais', description: 'Avisos em todo o jogo', icon: Bell },
  { id: 'users', label: 'Usuários', description: 'Gerenciar jogadores', icon: Users },
  { id: 'stats', label: 'Estatísticas', description: 'Dados do jogo', icon: BarChart3 },
  { id: 'advanced-stats', label: 'Estatísticas Avançadas', description: 'Análises detalhadas', icon: TrendingUp },
  { id: 'monetization', label: 'Monetização', description: 'Pacotes e vendas', icon: DollarSign },
  { id: 'reports', label: 'Relatórios', description: 'Relatórios gerenciais', icon: FileBarChart },
  { id: 'logs', label: 'Logs do Sistema', description: 'Logs e auditoria', icon: ScrollText },
  { id: 'customizations', label: 'Customizações', description: 'Campos de batalha e containers', icon: Palette },
  { id: 'settings', label: 'Configurações', description: 'Configurações gerais', icon: Settings },
  { id: 'security', label: 'Segurança', description: 'Controle de acesso', icon: Shield },
  { id: 'achievements', label: 'Conquistas', description: 'Gerenciar conquistas', icon: Trophy },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={cn(
        "bg-card border-r transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-80" : "w-16"
      )}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h2 className="text-lg font-semibold">Admin Panel</h2>
                <p className="text-sm text-muted-foreground">Famand Game</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 p-0"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground",
                  !sidebarOpen && "justify-center px-2"
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary-foreground")} />
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className={cn(
                      "text-xs opacity-70 truncate",
                      isActive ? "text-primary-foreground" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
