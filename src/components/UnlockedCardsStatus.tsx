import React from 'react';
import { useUnlockedCards } from '../hooks/useUnlockedCards';

export const UnlockedCardsStatus: React.FC = () => {
  const { unlockedCards, loading, starterDeck, playerCards } = useUnlockedCards();

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-background border border-border rounded-lg p-3 shadow-lg z-50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          Carregando cartas desbloqueadas...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-background border border-border rounded-lg p-3 shadow-lg z-50">
      <div className="text-sm text-muted-foreground">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">Cartas Desbloqueadas:</span>
          <span className="text-primary font-bold">{unlockedCards.length}</span>
        </div>
        <div className="text-xs space-y-1">
          <div>Starter: {starterDeck.length} cartas</div>
          <div>Adquiridas: {playerCards.length} cartas</div>
        </div>
      </div>
    </div>
  );
}; 