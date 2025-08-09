import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { GameState } from '../types/gameState';
import { MedievalNotificationSystem, useMedievalNotifications } from '../components/MedievalNotificationSystem';
import { useDialog } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Card as UICard } from '../components/ui/card';
import { Settings, Save, RotateCcw, Home } from 'lucide-react';

import AuthPage from '../components/AuthPage';
import MedievalSidebar from '../components/MedievalSidebar';
import MedievalTopBar from '../components/MedievalTopBar';
import EpicBattlefield from '../components/EpicBattlefield';
import EnhancedHand, { CardDetailModal } from '../components/EnhancedHand';
import MedievalDiceButton from '../components/MedievalDiceButton';
import SavedGamesModal from '../components/SavedGamesModal';
import PlayerStatsModal from '../components/PlayerStatsModal';
import { CardMiniature } from '../components/CardMiniature';

import { useAppContext } from '../contexts/AppContext';
import { useUserSettings } from '../hooks/useUserSettings';
import { GlobalAnnouncements } from '../components/GlobalAnnouncements';

const GamePage: React.FC = () => {
  // Estados de autenticação
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados de UI
  const [showStats, setShowStats] = useState(false);
  const [showSavedGames, setShowSavedGames] = useState(false);
  const [handVisible, setHandVisible] = useState(true);
  const [selectedCardForDetail, setSelectedCardForDetail] = useState<Card | null>(null);

  // Hook principal do jogo que integra com Supabase
  const gameState = useGameState();
  const { activeDeck, decks, loading: decksLoading } = usePlayerDecks();
  const { setCurrentView } = useAppContext();
  const { settings } = useUserSettings();
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
    // Limpar estado salvo quando sair do jogo
    gameState.clearSavedGame();
    setCurrentView('home');
  };

  const handleSettingsClick = () => {
    setCurrentView('settings');
  };

  const handleLogout = async () => {
    try {
      // Limpar estado salvo quando fazer logout
      gameState.clearSavedGame();
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

  const handleLoadGame = (loadedGameState: GameState) => {
    // Atualizar o estado do jogo com o jogo carregado
    try {
      // Verificar se o estado carregado é válido
      if (!loadedGameState || !loadedGameState.resources) {
        throw new Error('Estado do jogo inválido');
      }

      console.log('🎮 Carregando jogo salvo:', {
        turn: loadedGameState.turn,
        victoryMode: loadedGameState.victorySystem?.mode,
        currentSettings: settings?.game_preferences?.victoryMode
      });

      // Salvar o estado carregado no localStorage (sem o sistema de vitória)
      const stateToSave = {
        ...loadedGameState,
        // Remover o sistema de vitória do save para que seja aplicado o correto
        victorySystem: undefined,
        timestamp: Date.now(),
        deckActiveId: activeDeck?.id
      };
      localStorage.setItem('famand_gameState', JSON.stringify(stateToSave));
      
      // Atualizar o estado do jogo diretamente (o sistema de vitória será aplicado pela updateGameState)
      gameState.updateGameState(loadedGameState);
      
      notify('info', 'Jogo Carregado', 'Seu jogo foi carregado com sucesso!', undefined, 4000);
    } catch (error) {
      console.error('Erro ao carregar jogo:', error);
      notify('error', 'Erro', 'Erro ao carregar o jogo. Tente novamente.', undefined, 4000);
    }
  };

  // Setup de autenticação
  useEffect(() => {
    // // console.log('GamePage: Iniciando setup de autenticação');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: string, session: Session | null) => {
        // // console.log('GamePage: Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      // // console.log('GamePage: Session inicial:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Logs de debug para estados
  useEffect(() => {
    // // console.log('GamePage: Estado atualizado:', {
    //   loading,
    //   user: user?.email,
    //   gameStateLoading: gameState.loading,
    //   decksLoading,
    //   activeDeck: activeDeck?.name,
    //   activeDeckCards: activeDeck?.cards?.length
    // });
  }, [loading, user, gameState.loading, decksLoading, activeDeck]);

  // Limpar estado salvo quando sair da página do jogo
  useEffect(() => {
    return () => {
      // Este código executa quando o componente é desmontado
      console.log('🎮 Saindo da página do jogo, limpando estado salvo...');
      gameState.clearSavedGame();
    };
  }, [gameState.clearSavedGame]);

  // Sistema de Notificações Medievais - usando refs para evitar loops infinitos
  const notificationRefs = useRef({
    error: '',
    highlight: '',
    productionSummary: '',
    actionSummary: '',
    diceResult: null as number | null,
    diceProductionSummary: '',
    pendingDefense: '',
    victory: ''
  });

  useEffect(() => {
    if (gameState.error && gameState.error !== notificationRefs.current.error) {
      notificationRefs.current.error = gameState.error;
      notify('error', 'Erro no Jogo', gameState.error, undefined, 6000);
    }
  }, [gameState.error]);

  useEffect(() => {
    if (gameState.highlight && gameState.highlight !== notificationRefs.current.highlight) {
      notificationRefs.current.highlight = gameState.highlight;
      notify('info', 'Informação', gameState.highlight, undefined, 4000);
    }
  }, [gameState.highlight]);

  useEffect(() => {
    if (gameState.productionSummary && gameState.productionSummary !== notificationRefs.current.productionSummary) {
      notificationRefs.current.productionSummary = gameState.productionSummary;
      notify('production', 'Produção Ativada', gameState.productionSummary, undefined, 5000);
    }
  }, [gameState.productionSummary]);

  useEffect(() => {
    if (gameState.actionSummary && gameState.actionSummary !== notificationRefs.current.actionSummary) {
      notificationRefs.current.actionSummary = gameState.actionSummary;
      notify('action', 'Ação Executada', gameState.actionSummary, undefined, 4000);
    }
  }, [gameState.actionSummary]);

  useEffect(() => {
    if (gameState.diceResult && gameState.diceResult !== notificationRefs.current.diceResult) {
      notificationRefs.current.diceResult = gameState.diceResult;
      notify('dice', 'Dados Lançados', `Você rolou ${gameState.diceResult}!`, { diceValue: gameState.diceResult }, 4000);
    }
  }, [gameState.diceResult]);

  useEffect(() => {
    if (gameState.diceProductionSummary && gameState.diceProductionSummary !== notificationRefs.current.diceProductionSummary) {
      notificationRefs.current.diceProductionSummary = gameState.diceProductionSummary;
      notify('production', 'Produção do Dado', gameState.diceProductionSummary, undefined, 5000);
    }
  }, [gameState.diceProductionSummary]);

  useEffect(() => {
    if (gameState.pendingDefense && gameState.pendingDefense.name !== notificationRefs.current.pendingDefense) {
      notificationRefs.current.pendingDefense = gameState.pendingDefense.name;
      notify('error', 'Crise Detectada!', `Use carta de defesa: ${gameState.pendingDefense.name}`, undefined, 8000);
    }
  }, [gameState.pendingDefense]);

  useEffect(() => {
    if (gameState.victory && gameState.victory !== notificationRefs.current.victory) {
      notificationRefs.current.victory = gameState.victory;
      notify('victory', 'Vitória Conquistada!', gameState.victory, undefined, 10000);
    }
  }, [gameState.victory]);

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
        victorySystem={gameState.game.victorySystem}
        isInfiniteMode={gameState.sidebarProps.victory.mode === 'infinite'}
        discardedCardsCount={gameState.discardedCards.length}
        deckReshuffled={gameState.deckReshuffled}
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
        catastropheLosses={gameState.topBarProps.catastropheLosses}
        catastropheDuration={gameState.topBarProps.catastropheDuration}
        onToggleSidebar={() => {}}
        onShowStats={handleShowStats}
        onShowSavedGames={handleShowSavedGames}
        onGoHome={handleGoHome}
        onLogout={handleLogout}
        onSettingsClick={handleSettingsClick}
        userEmail={user?.email}
        userName={settings?.display_name || settings?.username || user?.email?.split('@')[0] || 'Guerreiro'}
        activeDeck={activeDeck}
      />

      {/* Anúncios Globais */}
      <div className="fixed top-16 left-0 right-0 z-20 px-4 py-2">
        <GlobalAnnouncements location="game" maxVisible={2} />
      </div>

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
          activatedCards={gameState.activatedCards}
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
          activatedCards={gameState.activatedCards}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl max-w-4xl w-full mx-4 border-2 border-amber-500/50 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full">
                  <span className="text-2xl">🗑️</span>
                </div>
                <h3 className="text-3xl font-bold text-white">Descarte Obrigatório</h3>
              </div>
              <p className="text-gray-300 text-lg">Escolha uma carta para descartar da sua mão:</p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center mb-8">
              {gameState.game.hand.map((card, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  onClick={() => gameState.handleDiscardCard(card)}
                >
                  {/* Card Miniature */}
                  <CardMiniature
                    card={card}
                    size="medium"
                    showInfo={true}
                    isPlayable={true}
                    onSelect={() => gameState.handleDiscardCard(card)}
                    onShowDetail={() => setSelectedCardForDetail(card)}
                    className="transition-all duration-300 group-hover:ring-2 group-hover:ring-amber-400 group-hover:ring-offset-2"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {/* Discard Icon */}
                  <div className="absolute top-2 right-2 w-6 h-6 bg-red-600/80 hover:bg-red-600 border border-red-400/60 rounded-full flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    🗑️
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span>Clique para descartar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Clique direito para detalhes</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs">
                Você deve descartar uma carta para continuar o jogo
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => gameState.handleDiscardCard(gameState.game.hand[0])}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              title="Cancelar descarte (descartar primeira carta)"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      {selectedCardForDetail && (
        <CardDetailModal
          card={selectedCardForDetail}
          isOpen={!!selectedCardForDetail}
          onClose={() => setSelectedCardForDetail(null)}
        />
      )}

      {/* Modal de jogos salvos */}
      <SavedGamesModal
        isOpen={showSavedGames}
        onClose={() => setShowSavedGames(false)}
        onLoadGame={handleLoadGame}
        currentGameState={gameState.game}
      />

      {/* Modal de estatísticas do jogador */}
      <PlayerStatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />



      {/* Sistema de Notificações Medievais */}
      <MedievalNotificationSystem position="top-right" maxNotifications={8} defaultDuration={4000} />

      {/* Sistema de vitória */}
      {gameState.victory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-8 rounded-xl shadow-2xl border-2 border-green-500 max-w-md text-center">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-3xl font-bold mb-4 text-green-100">Vitória!</h2>
            <p className="text-lg mb-8 text-green-50">{gameState.victory}</p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-100 font-medium transition-all duration-200 hover:scale-105"
              >
                🎮 Jogar Novamente
              </button>
              
              <button
                onClick={handleNewGame}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 font-medium transition-all duration-200 hover:scale-105"
              >
                🆕 Novo Jogo
              </button>
              
              <button
                onClick={handleGoHome}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 font-medium transition-all duration-200 hover:scale-105"
              >
                🏠 Voltar ao Menu
              </button>
            </div>
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
