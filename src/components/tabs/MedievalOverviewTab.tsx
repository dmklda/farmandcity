import React, { Suspense, lazy } from 'react';

// Lazy loading para melhorar performance
const MedievalHeroSection = lazy(() => import('../MedievalHeroSection.js').then(module => ({ default: module.MedievalHeroSection })));
const MedievalNavigationCards = lazy(() => import('../MedievalNavigationCards.js').then(module => ({ default: module.MedievalNavigationCards })));
const MedievalStarterPackDisplay = lazy(() => import('../MedievalStarterPackDisplay.js').then(module => ({ default: module.MedievalStarterPackDisplay })));

interface MedievalOverviewTabProps {
  userName: string;
  onStartGame: () => void;
  onSelectGameMode: () => void;
  onGoToShop: () => void;
  onGoToCollection: () => void;
  onGoToMissions: () => void;
  onGoToDecks: () => void;
  onGoToSettings: () => void;
  currency: { coins: number; gems: number } | null;
  playerCards: any[];
  decks: any[];
}

export const MedievalOverviewTab: React.FC<MedievalOverviewTabProps> = ({
  userName,
  onStartGame,
  onSelectGameMode,
  onGoToShop,
  onGoToCollection,
  onGoToMissions,
  onGoToDecks,
  onGoToSettings,
  currency,
  playerCards,
  decks
}) => {
  return (
    <div className="space-y-12">
      {/* 1. Hero Section - Boas-vindas e Ações Principais */}
      <Suspense fallback={
        <div className="bg-gradient-to-br from-slate-900/90 via-purple-900/60 to-blue-900/60 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8 animate-pulse">
          <div className="h-8 bg-white/20 rounded-lg w-1/3 mb-4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      }>
        <MedievalHeroSection
          userName={userName}
          onStartGame={onStartGame}
          onSelectGameMode={onSelectGameMode}
          onGoToDecks={onGoToDecks}
          decks={decks}
        />
      </Suspense>

      {/* 2. Pacote Inicial - PRIORIDADE MÁXIMA para novos jogadores */}
      <Suspense fallback={
        <div className="bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-yellow-600/20 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      }>
        <MedievalStarterPackDisplay onGoToDecks={onGoToDecks} />
      </Suspense>

      {/* 3. Portais do Reino - Navegação Principal */}
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-stone-800/60 to-stone-900/60 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-white/20 rounded-lg w-1/2 mb-4"></div>
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      }>
        <MedievalNavigationCards
          onStartGame={onSelectGameMode}
          onGoToShop={onGoToShop}
          onGoToCollection={onGoToCollection}
          onGoToMissions={onGoToMissions}
          onGoToDecks={onGoToDecks}
          onGoToSettings={onGoToSettings}
          decks={decks}
        />
      </Suspense>
    </div>
  );
};
