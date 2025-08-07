import React from 'react';
import { MedievalHeroSection } from '../MedievalHeroSection';
import { MedievalNavigationCards } from '../MedievalNavigationCards';
import { MedievalAdvancedStats } from '../MedievalAdvancedStats';
import { MedievalStarterPackDisplay } from '../MedievalStarterPackDisplay';

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
      {/* Medieval Hero Section */}
      <MedievalHeroSection
        userName={userName}
        onStartGame={onStartGame}
        onSelectGameMode={onSelectGameMode}
        currency={currency}
        playerCards={playerCards}
        decks={decks}
      />

      {/* Medieval Navigation Cards */}
      <MedievalNavigationCards
        onStartGame={onStartGame}
        onGoToShop={onGoToShop}
        onGoToCollection={onGoToCollection}
        onGoToMissions={onGoToMissions}
        onGoToDecks={onGoToDecks}
        onGoToSettings={onGoToSettings}
      />

      {/* Medieval Starter Pack Display */}
      <MedievalStarterPackDisplay />

      {/* Medieval Advanced Stats */}
      <MedievalAdvancedStats
        playerCards={playerCards}
        decks={decks}
        currency={currency}
      />
    </div>
  );
};
