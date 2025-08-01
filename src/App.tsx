import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './components/auth/AuthGuard';
import { AppProvider } from './contexts/AppContext';
import { DialogProvider } from './components/ui/dialog';
import AppRouter from './components/AppRouter';
import { AdminPage } from './pages/AdminPage';
import { AdminDebugPage } from './pages/AdminDebugPage';
import { AdminAuthGuard } from './components/auth/AdminAuthGuard';

function App() {
  return (
    <Router>
      <DialogProvider>
        <Routes>
          {/* Rotas Admin - Protegidas */}
          <Route path="/admin" element={
            <AdminAuthGuard>
              <AdminPage />
            </AdminAuthGuard>
          } />
          
          <Route path="/admin/debug" element={
            <AdminDebugPage />
          } />
          
          {/* Rota principal do jogo */}
          <Route path="/*" element={
            <AuthGuard>
              <AppProvider>
                <AppRouter />
              </AppProvider>
            </AuthGuard>
          } />
        </Routes>
      </DialogProvider>
    </Router>
  );
}

export default App;
