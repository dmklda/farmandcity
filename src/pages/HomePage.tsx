import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePlayerCards } from '../hooks/usePlayerCards';
import { usePlayerCurrency } from '../hooks/usePlayerCurrency';
import { usePlayerDecks } from '../hooks/usePlayerDecks';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import { useAppContext } from '../contexts/AppContext';
import PlayerStatsModal from '../components/PlayerStatsModal';
import { HorizontalTabs } from '../components/HorizontalTabs';
import { OverviewTab } from '../components/tabs/OverviewTab';
import { EventsTab } from '../components/tabs/EventsTab';
import { CommunityTab } from '../components/tabs/CommunityTab';
import { NewsTab } from '../components/tabs/NewsTab';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Button } from '../components/ui/button';
import { User, LogOut, Settings } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { playerCards } = usePlayerCards();
  const { currency } = usePlayerCurrency();
  const { decks } = usePlayerDecks();
  const { isAuthenticated: hasAdminAccess } = useAdminPermissions();
  const { setCurrentView } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [showPlayerStats, setShowPlayerStats] = useState(false);

  const startNewGame = () => {
    setCurrentView('game');
  };

  const selectGameMode = () => {
    setCurrentView('gameMode');
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Transform currency to match expected type
  const transformedCurrency = currency ? {
    coins: currency.coins || 0,
    gems: currency.gems || 0
  } : null;

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <div className="relative z-20">
        <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-lg">F</span>
                  </div>
              </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    FarmandCity
              </h1>
                  <p className="text-xs text-white/60">Seu império aguarda</p>
            </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-white/80 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online</span>
              </div>
              
              <Button
                onClick={() => setShowPlayerStats(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-white hover:text-blue-400 transition-all duration-300"
              >
                <User className="h-4 w-4" />
                Perfil
              </Button>
                
                {hasAdminAccess && (
                  <Button
                    onClick={() => window.location.href = '/admin/debug'}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/50 text-purple-400 hover:text-purple-300 transition-all duration-300"
                  >
                    <Settings className="h-4 w-4" />
                    Admin
                  </Button>
                )}
              
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 border-red-500/50 text-red-400 hover:text-red-300 transition-all duration-300"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Seção de boas-vindas */}
        <div className="text-center mb-12">
          <div className="relative">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
              Bem-vindo de volta, {user?.email?.split('@')[0]}!
            </h2>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 blur-xl opacity-20 -z-10"></div>
          </div>
          <p className="text-xl text-white/80 mb-8">
            Pronto para construir seu império?
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Horizontal Tabs Navigation */}
        <HorizontalTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab
            onStartGame={startNewGame}
            onSelectGameMode={selectGameMode}
            onGoToShop={() => setCurrentView('shop')}
            onGoToCollection={() => setCurrentView('collection')}
            onGoToMissions={() => setCurrentView('missions')}
            onGoToDecks={() => setCurrentView('decks')}
            currency={transformedCurrency}
            playerCards={playerCards}
            decks={decks}
          />
        )}

        {activeTab === 'events' && <EventsTab />}

        {activeTab === 'community' && <CommunityTab />}

        {activeTab === 'news' && <NewsTab />}
      </div>

      {/* Modal de estatísticas do jogador */}
      {showPlayerStats && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl w-full max-w-4xl h-full max-h-[90vh] overflow-hidden border border-slate-700/50 shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Estatísticas do Jogador
              </h2>
              <Button
                onClick={() => setShowPlayerStats(false)}
                variant="outline"
                size="sm"
                className="bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-white hover:text-red-400 transition-all duration-300"
              >
                ✕
              </Button>
            </div>
            <div className="overflow-auto h-full">
              <PlayerStatsModal 
                isOpen={showPlayerStats}
                onClose={() => setShowPlayerStats(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage; 