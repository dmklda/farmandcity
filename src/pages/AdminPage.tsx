import React, { useState } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { CardManager } from '../components/admin/CardManager';
import { PackManager } from '../components/admin/PackManager';
import { EventManager } from '../components/admin/EventManager';
import { DailyRotationManager } from '../components/admin/DailyRotationManager';
import { UserStatsPanel } from '../components/admin/UserStatsPanel';
import { GameStatsPanel } from '../components/admin/GameStatsPanel';
import { AdvancedStatsPanel } from '../components/admin/AdvancedStatsPanel';
import { MonetizationPanel } from '../components/admin/MonetizationPanel';
import { BoosterPacksPage } from './admin/BoosterPacksPage';
import { ReportsPage } from './admin/ReportsPage';
import { SystemLogsPage } from './admin/SystemLogsPage';
import { SettingsPage } from './admin/SettingsPage';
import { SecurityPage } from './admin/SecurityPage';
import { UsersPage } from './admin/UsersPage';
import { CustomizationsPage } from './admin/CustomizationsPage';
import { AnnouncementManager } from '../components/admin/AnnouncementManager';

export const AdminPage: React.FC = () => {
  // Persistir a aba ativa no localStorage
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('admin_activeTab');
    return savedTab || 'dashboard';
  });

  // Função para atualizar a aba e salvar no localStorage
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem('admin_activeTab', tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'cards':
        return <CardManager onStatsUpdate={() => {}} />;
      case 'packs':
        return <PackManager />;
      case 'events':
        return <EventManager />;
      case 'rotation':
        return <DailyRotationManager />;
      case 'users':
        return <UsersPage />;
      case 'stats':
        return <GameStatsPanel />;
      case 'advanced-stats':
        return <AdvancedStatsPanel />;
      case 'monetization':
        return <MonetizationPanel onStatsUpdate={() => {}} />;
      case 'booster-packs':
        return <BoosterPacksPage />;
      case 'reports':
        return <ReportsPage />;
      case 'logs':
        return <SystemLogsPage />;
      case 'customizations':
        return <CustomizationsPage />;
      case 'announcements':
        return <AnnouncementManager />;
      case 'settings':
        return <SettingsPage />;
      case 'security':
        return <SecurityPage />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </AdminLayout>
  );
};
