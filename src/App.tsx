import React, { useState, useEffect } from 'react';
import { supabase } from './integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

import AuthPage from './components/AuthPage';
import FixedSidebar from './components/FixedSidebar';
import EnhancedTopBar from './components/EnhancedTopBar';
import EnhancedGridBoard from './components/EnhancedGridBoard';
import EnhancedHand from './components/EnhancedHand';
import SavedGamesModal from './components/SavedGamesModal';
import PlayerStatsModal from './components/PlayerStatsModal';
import { DeckSelector } from './components/DeckSelector';
import { DeckBuilder } from './components/DeckBuilder';
import { CardsStatus } from './components/CardsStatus';

import { useGameState } from './hooks/useGameState';

const AppSimplified: React.FC = () => {
  // Estados de autenticação
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados de UI
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showSavedGames, setShowSavedGames] = useState(false);
  const [showPlayerStats, setShowPlayerStats] = useState(false);
  const [showDeckBuilder, setShowDeckBuilder] = useState(false);
  const [editingDeckId, setEditingDeckId] = useState<string | undefined>();

  // Hook principal do jogo que integra com Supabase
  const gameState = useGameState();

  // Setup de autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleAuthSuccess = () => {
    // Usuário será atualizado automaticamente pelo listener
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Auth page for non-authenticated users
  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // Layout principal para usuários autenticados
  return (
    <div className="h-screen bg-background w-full overflow-hidden" style={{ paddingLeft: '0px', paddingTop: '64px' }}>
      {/* User info and game controls */}
      <div className="absolute top-2 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setShowPlayerStats(true)}
          className="px-3 py-1 text-xs bg-accent hover:bg-accent/80 text-accent-foreground rounded transition-colors"
        >
          📊 Stats
        </button>
        <button
          onClick={() => setShowSavedGames(true)}
          className="px-3 py-1 text-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors"
        >
          💾 Jogos
        </button>
        <button
          onClick={() => setShowDeckBuilder(true)}
          className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded transition-colors"
        >
          🃏 Decks
        </button>
        <span className="text-sm text-muted-foreground">
          {user.email}
        </span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded transition-colors"
        >
          Sair
        </button>
      </div>

      {/* Fixed Sidebar */}
      <FixedSidebar
        resources={gameState.sidebarProps.resources}
        progress={gameState.sidebarProps.progress}
        victory={gameState.sidebarProps.victory}
        history={gameState.sidebarProps.history}
        isVisible={sidebarVisible}
        setIsVisible={setSidebarVisible}
      />

      {/* Deck Selector - Position it in the sidebar area */}
      {sidebarVisible && (
        <div className="fixed top-80 left-4 w-72 z-40">
          <DeckSelector />
        </div>
      )}

      {/* Fixed TopBar */}
      <EnhancedTopBar
        turn={gameState.topBarProps.turn}
        turnMax={gameState.topBarProps.turnMax}
        buildCount={gameState.topBarProps.buildCount}
        buildMax={gameState.topBarProps.buildMax}
        phase={gameState.topBarProps.phase}
        onNextPhase={gameState.topBarProps.onNextPhase}
        discardMode={gameState.topBarProps.discardMode}
        resources={{ coins: 0, food: 0, materials: 0, population: 0 }} // TODO: conectar
        productionPerTurn={{ coins: 0, food: 0, materials: 0, population: 0 }} // TODO: conectar
        productionDetails={{ coins: [], food: [], materials: [], population: [] }} // TODO: conectar
        onToggleSidebar={() => setSidebarVisible((v) => !v)}
      />

      {/* Main Content Area - Scrollable */}
      <div
        className="h-full overflow-y-auto overflow-x-hidden p-3"
        style={{
          paddingLeft: sidebarVisible ? '300px' : '24px',
          transition: 'padding-left 0.3s',
        }}
      >
        <EnhancedGridBoard
          farmGrid={gameState.gridBoardProps.farmGrid}
          cityGrid={gameState.gridBoardProps.cityGrid}
          eventGrid={[]} // TODO: conectar
          farmCount={gameState.gridBoardProps.farmCount}
          farmMax={gameState.gridBoardProps.farmMax}
          cityCount={gameState.gridBoardProps.cityCount}
          cityMax={gameState.gridBoardProps.cityMax}
          eventCount={0} // TODO: conectar
          eventMax={6} // TODO: conectar
          landmarkCount={gameState.gridBoardProps.landmarkCount}
          landmarkMax={gameState.gridBoardProps.landmarkMax}
          onSelectFarm={gameState.gridBoardProps.onSelectFarm}
          onSelectCity={gameState.gridBoardProps.onSelectCity}
          onSelectEvent={() => {}} // TODO: conectar
          highlightFarm={gameState.gridBoardProps.highlightFarm}
          highlightCity={gameState.gridBoardProps.highlightCity}
          highlightEvent={false} // TODO: conectar
        />
      </div>

      {/* Fixed Hand at Bottom */}
      <EnhancedHand
        hand={gameState.handProps.hand}
        onSelectCard={gameState.handProps.onSelectCard}
        selectedCardId={gameState.handProps.selectedCardId}
        canPlayCard={gameState.handProps.canPlayCard}
        sidebarVisible={sidebarVisible}
      />

      {/* Modal de descarte manual */}
      {gameState.discardModal && (
        <div>
          {/* TODO: Implementar modal de descarte */}
          {gameState.discardModal}
        </div>
      )}

      {/* Modal de jogos salvos */}
      <SavedGamesModal
        isOpen={showSavedGames}
        onClose={() => setShowSavedGames(false)}
        onLoadGame={() => {}} // TODO: conectar
        currentGameState={undefined} // TODO: conectar
      />

      {/* Modal de estatísticas do jogador */}
      <PlayerStatsModal
        isOpen={showPlayerStats}
        onClose={() => setShowPlayerStats(false)}
      />

      {/* Deck Builder Modal */}
      {showDeckBuilder && (
        <DeckBuilder 
          deckId={editingDeckId}
          onClose={() => {
            setShowDeckBuilder(false);
            setEditingDeckId(undefined);
          }}
        />
      )}

      {/* Status de carregamento das cartas */}
      <CardsStatus />
    </div>
  );
};

export default AppSimplified;