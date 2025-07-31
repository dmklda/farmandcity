import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { usePlayerCards } from '../hooks/usePlayerCards';
import { usePlayerDecks } from '../hooks/usePlayerDecks';
import { useCards } from '../hooks/useCards';
import { useGameSettings } from '../hooks/useGameSettings';
import { useStarterDeck } from '../hooks/useStarterDeck';
import { useUnlockedCards } from '../hooks/useUnlockedCards';
import { Card } from '../types/card';
import { MedievalNotificationSystem, useMedievalNotifications } from '../components/MedievalNotificationSystem';
import { useDialog } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Card as UICard } from '../components/ui/card';
import { Settings, Save, RotateCcw, Home } from 'lucide-react';

import AuthPage from '../components/AuthPage';
import MedievalSidebar from '../components/MedievalSidebar';
import MedievalTopBar from '../components/MedievalTopBar';
import EpicBattlefield from '../components/EpicBattlefield';
import EnhancedHand from '../components/EnhancedHand';
import MedievalDiceButton from '../components/MedievalDiceButton';
import SavedGamesModal from '../components/SavedGamesModal';
import PlayerStatsModal from '../components/PlayerStatsModal';

import { useAppContext } from '../contexts/AppContext';

const GamePage: React.FC = () => {
  // Estados de autenticação
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados de UI
  const [showStats, setShowStats] = useState(false);
  const [showSavedGames, setShowSavedGames] = useState(false);
  const [handVisible, setHandVisible] = useState(true);

  // Hook principal do jogo que integra com Supabase
  const gameState = useGameState();
  const { activeDeck, decks, loading: decksLoading } = usePlayerDecks();
  const { setCurrentView } = useAppContext();
  const { notify } = useMedievalNotifications();
  const { showConfirm, showAlert } = useDialog();

  // Função para iniciar novo jogo
  const handleNewGame = async () => {
    const confirmed = await showConfirm('Tem certeza que deseja iniciar um novo jogo? O jogo atual será perdido.', 'Novo Jogo', 'warning');
    if (confirmed) {
      gameState.clearSavedGame();
      window.location.reload(); // Recarregar para iniciar novo jogo
    }
  };

  // Handlers para os botões da TopBar
  const handleShowStats = () => {
    setShowStats(true);
  };

  const handleShowSavedGames = () => {
    setShowSavedGames(true);
  };

  const handleGoHome = () => {
    setCurrentView('home');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentView('home');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleAuthSuccess = () => {
    // Usuário será atualizado automaticamente pelo listener
  };

  // Handlers para o jogo
  const handleNextPhase = () => {
    gameState.handleNextPhase();
  };

  const handleSelectFarm = (x: number, y: number) => {
    gameState.handleSelectCell('farm', x, y);
  };

  const handleSelectCity = (x: number, y: number) => {
    gameState.handleSelectCell('city', x, y);
  };

  const handleSelectEvent = (x: number, y: number) => {
    gameState.handleSelectCell('event', x, y);
  };

  const handleSelectCard = (card: Card) => {
    gameState.handleSelectCard(card);
  };

  const handleLoadGame = () => {
    // TODO: Implementar carregamento de jogo
    console.log('Carregar jogo');
  };

  // Setup de autenticação
  useEffect(() => {
    console.log('GamePage: Iniciando setup de autenticação');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: string, session: Session | null) => {
        console.log('GamePage: Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      console.log('GamePage: Session inicial:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Logs de debug para estados
  useEffect(() => {
    console.log('GamePage: Estado atualizado:', {
      loading,
      user: user?.email,
      gameStateLoading: gameState.loading,
      decksLoading,
      activeDeck: activeDeck?.name,
      activeDeckCards: activeDeck?.cards?.length
    });
  }, [loading, user, gameState.loading, decksLoading, activeDeck]);

  // Sistema de Notificações Medievais
  useEffect(() => {
    if (gameState.error) {
      notify('error', 'Erro no Jogo', gameState.error, undefined, 6000);
    }
  }, [gameState.error, notify]);

  useEffect(() => {
    if (gameState.highlight) {
      notify('info', 'Informação', gameState.highlight, undefined, 4000);
    }
  }, [gameState.highlight, notify]);

  useEffect(() => {
    if (gameState.productionSummary) {
      notify('production', 'Produção Ativada', gameState.productionSummary, undefined, 5000);
    }
  }, [gameState.productionSummary, notify]);

  useEffect(() => {
    if (gameState.actionSummary) {
      notify('action', 'Ação Executada', gameState.actionSummary, undefined, 4000);
    }
  }, [gameState.actionSummary, notify]);

  useEffect(() => {
    if (gameState.diceResult) {
      notify('dice', 'Dados Lançados', `Você rolou ${gameState.diceResult}!`, { diceValue: gameState.diceResult }, 4000);
    }
  }, [gameState.diceResult, notify]);

  useEffect(() => {
    if (gameState.diceProductionSummary) {
      notify('production', 'Produção do Dado', gameState.diceProductionSummary, undefined, 5000);
    }
  }, [gameState.diceProductionSummary, notify]);

  useEffect(() => {
    if (gameState.pendingDefense) {
      notify('error', 'Crise Detectada!', `Use carta de defesa: ${gameState.pendingDefense.name}`, undefined, 8000);
    }
  }, [gameState.pendingDefense, notify]);

  useEffect(() => {
    if (gameState.victory) {
      notify('victory', 'Vitória Conquistada!', gameState.victory, undefined, 10000);
    }
  }, [gameState.victory, notify]);

  // Loading state
  if (loading || gameState.loading || decksLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando jogo...</p>
        </div>
      </div>
    );
  }

  // Auth page for non-authenticated users
  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // Verificar se o usuário tem um deck ativo
  if (!activeDeck || activeDeck.cards.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Nenhum Deck Ativo</h2>
          <p className="text-muted-foreground mb-6">
            Você precisa selecionar um deck ativo na página inicial antes de jogar.
          </p>
          <button
            onClick={() => setCurrentView('home')}
            className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Voltar à Página Inicial
          </button>
        </div>
      </div>
    );
  }

  // Verificar se o jogo ainda está carregando
  if (gameState.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Carregando Jogo...</h2>
          <p className="text-muted-foreground">
            Preparando seu deck e cartas...
          </p>
        </div>
      </div>
    );
  }

  // Layout principal para usuários autenticados
  return (
    <div className="h-screen bg-background w-full overflow-hidden">
      {/* Medieval Sidebar */}
      <MedievalSidebar
        isVisible={true}
        setIsVisible={() => {}}
        onToggleSidebar={() => {}}
        gameStats={{
          reputation: gameState.game.playerStats.reputation,
          maxReputation: gameState.sidebarProps.progress.reputationMax,
          totalProduction: gameState.game.playerStats.totalProduction,
          maxProduction: gameState.sidebarProps.progress.productionMax,
          landmarks: gameState.game.playerStats.landmarks,
          maxLandmarks: gameState.sidebarProps.progress.landmarksMax,
          turn: gameState.game.turn,
          maxTurns: gameState.sidebarProps.progress.turnMax
        }}
        victoryMode={gameState.sidebarProps.victory.mode}
        victoryPoints={gameState.sidebarProps.victory.value}
        history={gameState.sidebarProps.history}
        resources={{
          coins: gameState.game.resources.coins,
          foods: gameState.game.resources.food,
          materials: gameState.game.resources.materials,
          population: gameState.game.resources.population
        }}
        productionPerTurn={{
          coins: gameState.topBarProps.productionPerTurn.coins,
          foods: gameState.topBarProps.productionPerTurn.food,
          materials: gameState.topBarProps.productionPerTurn.materials,
          population: gameState.topBarProps.productionPerTurn.population
        }}
      />

      {/* Medieval TopBar */}
      <MedievalTopBar
        turn={gameState.topBarProps.turn}
        turnMax={gameState.topBarProps.turnMax}
        buildCount={gameState.topBarProps.buildCount}
        buildMax={gameState.topBarProps.buildMax}
        phase={gameState.topBarProps.phase}
        onNextPhase={handleNextPhase}
        discardMode={gameState.topBarProps.discardMode}
        resources={gameState.topBarProps.resources}
        productionPerTurn={gameState.topBarProps.productionPerTurn}
        productionDetails={gameState.topBarProps.productionDetails}
        onToggleSidebar={() => {}}
        onShowStats={handleShowStats}
        onShowSavedGames={handleShowSavedGames}
        onGoHome={handleGoHome}
        onLogout={handleLogout}
        userEmail={user?.email}
        activeDeck={activeDeck}
      />

      {/* Main Content Area - Scrollable with proper spacing */}
      <div
        className="h-full overflow-y-auto overflow-x-hidden p-3"
        style={{
          paddingLeft: '340px', // Fixed spacing for sidebar
          paddingTop: '64px', // Space for top bar
          paddingBottom: '0px', // Space for hand
        }}
      >
        <EpicBattlefield
          farmGrid={gameState.gridBoardProps.farmGrid}
          cityGrid={gameState.gridBoardProps.cityGrid}
          eventGrid={gameState.gridBoardProps.eventGrid}
          landmarksGrid={gameState.gridBoardProps.landmarksGrid}
          farmCount={gameState.gridBoardProps.farmCount}
          farmMax={gameState.gridBoardProps.farmMax}
          cityCount={gameState.gridBoardProps.cityCount}
          cityMax={gameState.gridBoardProps.cityMax}
          eventCount={gameState.gridBoardProps.eventCount}
          eventMax={gameState.gridBoardProps.eventMax}
          landmarkCount={gameState.gridBoardProps.landmarkCount}
          landmarkMax={gameState.gridBoardProps.landmarkMax}
          onSelectFarm={handleSelectFarm}
          onSelectCity={handleSelectCity}
          onSelectEvent={handleSelectEvent}
          onSelectLandmark={gameState.gridBoardProps.onSelectLandmark}
          highlightFarm={gameState.gridBoardProps.highlightFarm}
          highlightCity={gameState.gridBoardProps.highlightCity}
          highlightEvent={gameState.gridBoardProps.highlightEvent}
          highlightLandmark={gameState.gridBoardProps.highlightLandmark}
          onToggleHand={() => setHandVisible(!handVisible)}
          handVisible={handVisible}
        />
      </div>

      {/* Fixed Hand at Bottom with proper z-index */}
      {handVisible && (
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <EnhancedHand
          key={`hand-${gameState.handProps.deckSize}-${gameState.handProps.hand.length}`}
          hand={gameState.handProps.hand}
          onSelectCard={handleSelectCard}
          selectedCardId={gameState.handProps.selectedCardId}
          canPlayCard={gameState.handProps.canPlayCard}
          sidebarVisible={true}
          deckSize={gameState.handProps.deckSize}
        />
      </div>
      )}

      {/* Medieval Dice Button - Positioned near hand */}
      <div className="fixed bottom-20 right-6 z-40">
        <MedievalDiceButton
          onDiceRoll={gameState.handleDiceRoll}
          diceUsed={gameState.diceUsed}
          diceResult={gameState.diceResult || undefined}
          disabled={false}
          currentPhase={gameState.game.phase}
        />
      </div>

      {/* Modal de descarte manual */}
      {gameState.discardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-lg max-w-2xl w-full mx-4 border-2 border-amber-500 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-3">Descarte obrigatório</h3>
              <p className="text-gray-300 text-lg">Escolha uma carta para descartar:</p>
            </div>
            <div className="flex gap-6 justify-center flex-wrap">
              {gameState.game.hand.map((card, index) => (
                <div
                  key={index}
                  className="cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg"
                  onClick={() => gameState.handleDiscardCard(card)}
                >
                  <div className="bg-gradient-to-br from-green-600 to-green-700 border-2 border-green-400 rounded-lg p-4 min-w-[140px] text-center shadow-lg">
                    <div className="text-white font-semibold text-sm mb-2 leading-tight">{card.name}</div>
                    <div className="text-green-200 text-xs font-medium">
                      {card.type} | {card.rarity}
                    </div>
                    <div className="mt-2 text-green-100 text-xs opacity-75">
                      {card.cost.coins ? `💰 ${card.cost.coins}` : ''}
                      {card.cost.food ? ` 🍎 ${card.cost.food}` : ''}
                      {card.cost.materials ? ` 🧱 ${card.cost.materials}` : ''}
                      {card.cost.population ? ` 👥 ${card.cost.population}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Clique em uma carta para descartá-la
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de jogos salvos */}
      {showSavedGames && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-lg max-w-2xl w-full mx-4 border-2 border-green-500 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-white mb-3">💾 Jogos Salvos</h3>
              <p className="text-gray-300">Gerencie suas partidas salvas</p>
            </div>
            
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {/* Jogo atual */}
              <div className="bg-slate-700 p-4 rounded-lg border-2 border-blue-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-white">🎮 Jogo Atual</h4>
                    <p className="text-gray-300 text-sm">Turno {gameState.game.turn} - {gameState.game.phase}</p>
                    <p className="text-gray-400 text-xs">Última atualização: {new Date().toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">
                      <div>💰 {gameState.game.resources.coins}</div>
                      <div>🌾 {gameState.game.resources.food}</div>
                      <div>🏗️ {gameState.game.resources.materials}</div>
                      <div>👥 {gameState.game.resources.population}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jogos salvos (exemplo) */}
              <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 cursor-pointer transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-white">🏛️ Vitória por Marcos</h4>
                    <p className="text-gray-300 text-sm">Turno 15 - 2/3 landmarks</p>
                    <p className="text-gray-400 text-xs">Salvo em 25/01/2025 às 14:30</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">
                      <div>💰 250</div>
                      <div>🌾 45</div>
                      <div>🏗️ 18</div>
                      <div>👥 12</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 cursor-pointer transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-white">⭐ Desafio Reputação</h4>
                    <p className="text-gray-300 text-sm">Turno 8 - 12/15 reputação</p>
                    <p className="text-gray-400 text-xs">Salvo em 24/01/2025 às 16:45</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">
                      <div>💰 180</div>
                      <div>🌾 30</div>
                      <div>🏗️ 8</div>
                      <div>👥 6</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 cursor-pointer transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-white">⏰ Modo Sobrevivência</h4>
                    <p className="text-gray-300 text-sm">Turno 22 - Sobrevivendo</p>
                    <p className="text-gray-400 text-xs">Salvo em 23/01/2025 às 10:15</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">
                      <div>💰 320</div>
                      <div>🌾 60</div>
                      <div>🏗️ 25</div>
                      <div>👥 15</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowSavedGames(false)}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={async () => {
                  // TODO: Implementar salvamento automático
                  await showAlert('Jogo salvo automaticamente!', 'Jogo Salvo', 'success');
                  setShowSavedGames(false);
                }}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                💾 Salvar Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de estatísticas do jogador */}
      <PlayerStatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />

      {/* Modal de estatísticas do jogo */}
      {showStats && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-lg max-w-2xl w-full mx-4 border-2 border-blue-500 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-white mb-3">📊 Estatísticas do Jogo</h3>
              <p className="text-gray-300">Informações detalhadas sobre sua partida</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Recursos Atuais */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-3">💰 Recursos Atuais</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Moedas:</span>
                    <span className="text-yellow-400 font-bold">{gameState.game.resources.coins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Comida:</span>
                    <span className="text-green-400 font-bold">{gameState.game.resources.food}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Materiais:</span>
                    <span className="text-orange-400 font-bold">{gameState.game.resources.materials}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">População:</span>
                    <span className="text-blue-400 font-bold">{gameState.game.resources.population}</span>
                  </div>
                </div>
              </div>

              {/* Produção por Turno */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-3">⚙️ Produção por Turno</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Moedas:</span>
                    <span className="text-yellow-400 font-bold">+{gameState.topBarProps.productionPerTurn.coins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Comida:</span>
                    <span className="text-green-400 font-bold">+{gameState.topBarProps.productionPerTurn.food}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Materiais:</span>
                    <span className="text-orange-400 font-bold">+{gameState.topBarProps.productionPerTurn.materials}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">População:</span>
                    <span className="text-blue-400 font-bold">+{gameState.topBarProps.productionPerTurn.population}</span>
                  </div>
                </div>
              </div>

              {/* Progresso */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-3">📈 Progresso</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Reputação:</span>
                    <span className="text-purple-400 font-bold">{gameState.game.playerStats.reputation}/{gameState.sidebarProps.progress.reputationMax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Produção Total:</span>
                    <span className="text-cyan-400 font-bold">{gameState.game.playerStats.totalProduction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Marcos:</span>
                    <span className="text-indigo-400 font-bold">{gameState.game.playerStats.landmarks}/{gameState.sidebarProps.progress.landmarksMax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Turno:</span>
                    <span className="text-white font-bold">{gameState.game.turn}</span>
                  </div>
                </div>
              </div>

              {/* Informações do Deck */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-3">🃏 Deck Ativo</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Nome:</span>
                    <span className="text-white font-bold">{activeDeck?.name || 'Nenhum'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Cartas no Deck:</span>
                    <span className="text-white font-bold">{gameState.game.deck.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Cartas na Mão:</span>
                    <span className="text-white font-bold">{gameState.game.hand.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Fase Atual:</span>
                    <span className="text-white font-bold capitalize">{gameState.game.phase}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowStats(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sistema de Notificações Medievais */}
      <MedievalNotificationSystem position="top-right" maxNotifications={8} defaultDuration={4000} />

      {/* Sistema de vitória */}
      {gameState.victory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-green-600 text-white p-8 rounded-lg shadow-lg border max-w-md text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-4">Vitória!</h2>
            <p className="text-lg mb-6">{gameState.victory}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white text-green-600 rounded hover:bg-gray-100 font-medium"
            >
              Jogar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Sistema de derrota */}
      {gameState.defeat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-red-600 text-white p-8 rounded-lg shadow-lg border max-w-md text-center">
            <div className="text-4xl mb-4">💀</div>
            <h2 className="text-2xl font-bold mb-4">Derrota!</h2>
            <p className="text-lg mb-6">{gameState.defeat}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white text-red-600 rounded hover:bg-gray-100 font-medium"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;