import React from 'react';
import { MedievalHeroSection } from '../MedievalHeroSection';
import { MedievalNavigationCards } from '../MedievalNavigationCards';
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
      {/* 1. Hero Section - Boas-vindas e Ações Principais */}
      <MedievalHeroSection
        userName={userName}
        onStartGame={onStartGame}
        onSelectGameMode={onSelectGameMode}
        onGoToDecks={onGoToDecks}
        decks={decks}
      />

      {/* 2. Pacote Inicial - PRIORIDADE MÁXIMA para novos jogadores */}
      <MedievalStarterPackDisplay onGoToDecks={onGoToDecks} />

      {/* 3. Portais do Reino - Navegação Principal */}
      <MedievalNavigationCards
        onStartGame={onSelectGameMode}
        onGoToShop={onGoToShop}
        onGoToCollection={onGoToCollection}
        onGoToMissions={onGoToMissions}
        onGoToDecks={onGoToDecks}
        onGoToSettings={onGoToSettings}
        decks={decks}
      />
    </div>
  );
};
