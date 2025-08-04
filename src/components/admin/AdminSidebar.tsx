import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  BarChart3, 
  DollarSign, 
  Settings, 
  FileText, 
  Shield, 
  Database,
  Activity,
  TrendingUp,
  Package,
  LogOut,
  User,
  Gift,
  Calendar,
  Zap,
  Palette
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      description: 'Visão geral do sistema'
    },
    {
      title: 'Gerenciar Cartas',
      icon: CreditCard,
      path: '/admin/cards',
      description: 'Criar e editar cartas'
    },
    {
      title: 'Packs e Boosters',
      icon: Package,
      path: '/admin/packs',
      description: 'Gerenciar pacotes'
    },
    {
      title: 'Eventos',
      icon: Gift,
      path: '/admin/events',
      description: 'Eventos especiais'
    },
    {
      title: 'Rotação Diária',
      icon: Calendar,
      path: '/admin/rotation',
      description: 'Ciclo diário de cartas'
    },
    {
      title: 'Usuários',
      icon: Users,
      path: '/admin/users',
      description: 'Gerenciar jogadores'
    },
    {
      title: 'Estatísticas',
      icon: BarChart3,
      path: '/admin/stats',
      description: 'Dados do jogo'
    },
    {
      title: 'Estatísticas Avançadas',
      icon: Activity,
      path: '/admin/advanced-stats',
      description: 'Análises detalhadas'
    },
    {
      title: 'Monetização',
      icon: DollarSign,
      path: '/admin/monetization',
      description: 'Pacotes e vendas'
    },
    {
      title: 'Relatórios',
      icon: FileText,
      path: '/admin/reports',
      description: 'Relatórios gerenciais'
    },
    {
      title: 'Logs do Sistema',
      icon: Database,
      path: '/admin/logs',
      description: 'Logs e auditoria'
    },
    {
      title: 'Customizações',
      icon: Palette,
      path: '/admin/customizations',
      description: 'Campos de batalha e containers'
    },
    {
      title: 'Configurações',
      icon: Settings,
      path: '/admin/settings',
      description: 'Configurações gerais'
    },
    {
      title: 'Segurança',
      icon: Shield,
      path: '/admin/security',
      description: 'Controle de acesso'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className={`bg-surface-card border-r border-border h-screen transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-1"
          >
            <div className="w-4 h-4 flex flex-col justify-center items-center">
              <div className={`w-3 h-0.5 bg-current transition-all ${
                isCollapsed ? 'rotate-45 translate-y-0.5' : '-rotate-45 -translate-y-0.5'
              }`} />
              <div className={`w-3 h-0.5 bg-current transition-all mt-0.5 ${
                isCollapsed ? '-rotate-45 -translate-y-0.5' : 'rotate-45 translate-y-0.5'
              }`} />
            </div>
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
                  }`}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${
                    active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  }`} />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{item.title}</span>
                      <p className="text-xs opacity-75 truncate">{item.description}</p>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  );
}; 
