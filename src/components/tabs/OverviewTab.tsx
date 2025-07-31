import React from 'react';
import { GamingHero } from '../GamingHero';
import { AdvancedStats } from '../AdvancedStats';
import { StarterPackDisplay } from '../StarterPackDisplay';

interface OverviewTabProps {
  onStartGame: () => void;
  onSelectGameMode: () => void;
  onGoToShop: () => void;
  onGoToCollection: () => void;
  onGoToMissions: () => void;
  onGoToDecks: () => void;
  currency: { coins: number; gems: number } | null;
  playerCards: any[];
  decks: any[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onStartGame,
  onSelectGameMode,
  onGoToShop,
  onGoToCollection,
  onGoToMissions,
  onGoToDecks,
  currency,
  playerCards,
  decks
}) => {
  return (
    <div className="space-y-8">
      {/* Gaming Hero Section */}
      <GamingHero
        onStartGame={onStartGame}
        onSelectGameMode={onSelectGameMode}
        onGoToShop={onGoToShop}
        onGoToCollection={onGoToCollection}
        onGoToMissions={onGoToMissions}
        onGoToDecks={onGoToDecks}
        currency={currency}
        playerCards={playerCards}
        decks={decks}
      />

      {/* Starter Pack Section */}
      <StarterPackDisplay />

      {/* Advanced Stats Section */}
      <AdvancedStats
        playerCards={playerCards}
        decks={decks}
        currency={currency}
      />
    </div>
  );
}; 
