import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import App from '../../App';
import { AdminPage } from '../../pages/AdminPage';
import { AdminLayout } from '../admin/AdminLayout';
import { AdminAuthGuard } from '../auth/AdminAuthGuard';
import { UsersPage } from '../../pages/admin/UsersPage';
import { ReportsPage } from '../../pages/admin/ReportsPage';
import { SettingsPage } from '../../pages/admin/SettingsPage';
import { CardManager } from '../admin/CardManager';
import { UserStatsPanel } from '../admin/UserStatsPanel';
import { GameStatsPanel } from '../admin/GameStatsPanel';
import { MonetizationPanel } from '../admin/MonetizationPanel';
import { AdvancedStatsPanel } from '../admin/AdvancedStatsPanel';

export const AppLayout: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminAuthGuard>
            <AdminPage />
          </AdminAuthGuard>
        }>
          <Route index element={<AdminPage />} />
          <Route path="cards" element={<CardManager onStatsUpdate={() => {}} />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="stats" element={<GameStatsPanel />} />
          <Route path="advanced-stats" element={<AdvancedStatsPanel />} />
          <Route path="monetization" element={<MonetizationPanel onStatsUpdate={() => {}} />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="boosters" element={<MonetizationPanel onStatsUpdate={() => {}} />} />
          <Route path="logs" element={<div className="p-6"><h1>Logs do Sistema</h1><p>Em desenvolvimento...</p></div>} />
          <Route path="security" element={<div className="p-6"><h1>Segurança</h1><p>Em desenvolvimento...</p></div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}; 