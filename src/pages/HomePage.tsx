import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePlayerCards } from '../hooks/usePlayerCards';
import { usePlayerCurrency } from '../hooks/usePlayerCurrency';
import { usePlayerDecks } from '../hooks/usePlayerDecks';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import { useAppContext } from '../contexts/AppContext';
import PlayerStatsModal from '../components/PlayerStatsModal';
import { MedievalHorizontalTabs } from '../components/MedievalHorizontalTabs';
import { MedievalOverviewTab } from '../components/tabs/MedievalOverviewTab';
import EventsTab from '../components/tabs/EventsTab';
import CommunityTab from '../components/tabs/CommunityTab';
import NewsTab from '../components/tabs/NewsTab';
import AchievementsTab from '../components/AchievementsTab';
import MissionsTab from '../components/MissionsTab';
import { MedievalAnimatedBackground } from '../components/MedievalAnimatedBackground';
import { MedievalHeader } from '../components/MedievalHeader';
import { GlobalAnnouncements } from '../components/GlobalAnnouncements';
import { MedievalNotifications } from '../components/MedievalNotifications';

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
      {/* Medieval Animated Background */}
      <MedievalAnimatedBackground />

      {/* Medieval Header */}
      <MedievalHeader
        user={user}
        hasAdminAccess={hasAdminAccess}
        onShowPlayerStats={() => setShowPlayerStats(true)}
        onLogout={handleLogout}
      />

      {/* Medieval Notifications */}
      <MedievalNotifications />

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Anúncios Globais */}
        <div className="mb-8">
          <GlobalAnnouncements location="homepage" maxVisible={3} />
        </div>



        {/* Medieval Horizontal Tabs Navigation */}
        <MedievalHorizontalTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <MedievalOverviewTab
            userName={user?.email?.split('@')[0] || 'Guerreiro'}
            onStartGame={startNewGame}
            onSelectGameMode={selectGameMode}
            onGoToShop={() => setCurrentView('shop')}
            onGoToCollection={() => setCurrentView('collection')}
            onGoToMissions={() => setCurrentView('missions')}
            onGoToDecks={() => setCurrentView('decks')}
            onGoToSettings={() => setCurrentView('settings')}
            currency={transformedCurrency}
            playerCards={playerCards}
            decks={decks}
          />
        )}

        {activeTab === 'events' && <EventsTab />}

        {activeTab === 'community' && <CommunityTab />}

        {activeTab === 'news' && <NewsTab />}

        {activeTab === 'achievements' && <AchievementsTab />}

        {activeTab === 'missions' && <MissionsTab />}
      </div>

      {/* Modal de estatísticas do jogador */}
      {showPlayerStats && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95 rounded-3xl w-full max-w-4xl h-full max-h-[90vh] overflow-hidden border border-purple-500/30 shadow-2xl backdrop-blur-md">
            {/* Decorative border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60"></div>
            
            <div className="flex justify-between items-center p-8 border-b border-purple-500/30">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Estatísticas do Jogador
              </h2>
              <button
                onClick={() => setShowPlayerStats(false)}
                className="relative group p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-purple-500/30 hover:border-purple-400/50 text-purple-200 hover:text-red-300 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 text-xl font-bold">✕</span>
              </button>
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
