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
import { GlobalAnnouncementManager } from '../components/admin/GlobalAnnouncementManager';
import { CommunityManager } from '../components/admin/CommunityManager';
import { NewsManager } from '../components/admin/NewsManager';
import { AchievementsManager } from '../components/admin/AchievementsManager';
import { MissionsManager } from '../components/admin/MissionsManager';
import { ShopManager } from '../components/admin/ShopManager';

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
      case 'shop':
        return <ShopManager />;
      case 'events':
        return <EventManager />;
      case 'rotation':
        return <DailyRotationManager />;
      case 'community':
        return <CommunityManager />;
      case 'news':
        return <NewsManager />;
      case 'achievements':
        return <AchievementsManager />;
      case 'missions':
        return <MissionsManager />;
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
      case 'global-announcements':
        return <GlobalAnnouncementManager />;
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
