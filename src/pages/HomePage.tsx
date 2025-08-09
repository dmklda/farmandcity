import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePlayerCards } from '../hooks/usePlayerCards';
import { usePlayerCurrency } from '../hooks/usePlayerCurrency';
import { usePlayerDecks } from '../hooks/usePlayerDecks';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import { useAppContext } from '../contexts/AppContext';
import { useUserSettings } from '../hooks/useUserSettings';
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
  const { settings } = useUserSettings();
  const { playerCards } = usePlayerCards();
  const { currency } = usePlayerCurrency();
  const { decks } = usePlayerDecks();
  const { isAuthenticated: hasAdminAccess } = useAdminPermissions();
  const { setCurrentView } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [showPlayerStats, setShowPlayerStats] = useState(false);

  const startNewGame = () => {
    // Limpar estado salvo antes de iniciar novo jogo
    try {
      localStorage.removeItem('famand_gameState');
      console.log('🎮 Estado salvo limpo antes de iniciar novo jogo');
    } catch (error) {
      console.error('Erro ao limpar estado salvo:', error);
    }
    setCurrentView('game');
  };

  const selectGameMode = () => {
    // Limpar estado salvo antes de selecionar modo de jogo
    try {
      localStorage.removeItem('famand_gameState');
      console.log('🎮 Estado salvo limpo antes de selecionar modo de jogo');
    } catch (error) {
      console.error('Erro ao limpar estado salvo:', error);
    }
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
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10 pt-28">
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
            userName={settings?.display_name || settings?.username || user?.email?.split('@')[0] || 'Guerreiro'}
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
      <PlayerStatsModal 
        isOpen={showPlayerStats}
        onClose={() => setShowPlayerStats(false)}
      />
    </div>
  );
};

export default HomePage; 
