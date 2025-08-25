import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './components/auth/AuthGuard';
import { AppProvider } from './contexts/AppContext';
import { DialogProvider } from './components/ui/dialog';
import AppRouter from './components/AppRouter';
import { AdminPage } from './pages/AdminPage';
import { AdminDebugPage } from './pages/AdminDebugPage';
import { AdminAuthGuard } from './components/auth/AdminAuthGuard';

import { testCardEffect } from './utils/effectTester';
import { testProblematicCardsDetailed } from './utils/testSpecificCards';
import { runCompleteVerification } from './utils/cardVerification';

function App() {
  useEffect(() => {
    // Expor sistemas de verificação globalmente para debug
    if (typeof window !== 'undefined') {
      (window as any).runCardVerification = runCompleteVerification;
      (window as any).testProblematicCards = testProblematicCardsDetailed;
      (window as any).testSingleCard = testCardEffect;
    }
  }, []);

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