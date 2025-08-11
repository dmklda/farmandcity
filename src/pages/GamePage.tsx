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
// import { TestModeButton } from '../components/TestModeButton'; // Removido - botões de teste desativados
import MedievalVictoryModal from '../components/MedievalVictoryModal';
import MedievalDefeatModal from '../components/MedievalDefeatModal';
import MedievalDiscardModal from '../components/MedievalDiscardModal';

import { useAppContext } from '../contexts/AppContext';
import { useUserSettings } from '../hooks/useUserSettings';
import { GlobalAnnouncements } from '../components/GlobalAnnouncements';

const GamePage: React.FC = () => {
  // Estados de autenticação
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Backgrounds animados premium disponíveis
  const premiumBackgrounds = [
    '/assets/boards_backgrounds/premium_animated/templo_arcano_com_figuras_importantes_animated/camara_dos_arcanistas_eternos_animated.mp4',
    '/assets/boards_backgrounds/premium_animated/inverno_gelido_eterno_animated/campos_de_neve_perene_animated.mp4',
    '/assets/boards_backgrounds/premium_animated/cemiterio_sombrio_macabro/necropole_de_dor_sussurrante_animated.mp4',
    '/assets/boards_backgrounds/premium_animated/deserto_dourado_misterioso_animated/ruinas_do_sol_adormecido_animated.mp4'
  ];

  // Selecionar background aleatório
  const [selectedBackground] = useState(() => {
    const randomIndex = Math.floor(Math.random() * premiumBackgrounds.length);
    return premiumBackgrounds[randomIndex];
  });

  // Estados de UI
  const [showStats, setShowStats] = useState(false);
  const [showSavedGames, setShowSavedGames] = useState(false);
  const [handVisible, setHandVisible] = useState(true);
  const [selectedCardForDetail, setSelectedCardForDetail] = useState<Card | null>(null);

  // Hook principal do jogo que integra com Supabase
  const gameState = useGameState();
  const { activeDeck, decks, loading: decksLoading } = usePlayerDecks();
  const { setCurrentView } = useAppContext();
  const { settings, fetchUserSettings } = useUserSettings();
  const { notify } = useMedievalNotifications();
  const { showConfirm, showAlert } = useDialog();

  // Função para iniciar novo jogo
  const handleNewGame = async () => {
    const confirmed = await showConfirm('Tem certeza que deseja iniciar um novo jogo? O jogo atual será perdido.', 'Novo Jogo', 'warning');
    if (confirmed) {
      // Limpar estado de derrota
      gameState.setDefeat(null);
      gameState.clearSavedGame();
      // Limpar localStorage completamente para garantir estado limpo
      localStorage.removeItem('famand_gameState');
      // Redirecionar para seleção de modo em vez de recarregar
      setCurrentView('gameMode');
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
    // Limpar estado de derrota
    gameState.setDefeat(null);
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

  const handleLoadGame = (loadedGameState: GameState, loadedGameMode?: string) => {
    // Atualizar o estado do jogo com o jogo carregado
    try {
      // Verificar se o estado carregado é válido
      if (!loadedGameState || !loadedGameState.resources) {
        throw new Error('Estado do jogo inválido');
      }

      console.log('🎮 Carregando jogo salvo:', {
        turn: loadedGameState.turn,
        savedGameMode: loadedGameMode,
        currentSettings: settings?.game_preferences?.victoryMode
      });

      // Limpar estado de derrota antes de carregar novo jogo
      gameState.setDefeat(null);

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
      gameState.updateGameState(loadedGameState, loadedGameMode);
      
      notify('info', 'Jogo Carregado', 'Seu jogo foi carregado com sucesso!', undefined, 4000);
    } catch (error) {
      console.error('Erro ao carregar jogo:', error);
      notify('error', 'Erro', 'Erro ao carregar o jogo. Tente novamente.', undefined, 4000);
    }
  };

  // Função para gerar informações detalhadas do modo de jogo
  const getGameModeInfo = () => {
    const victorySystem = gameState.game.victorySystem;
    if (!victorySystem) return { name: 'Desconhecido', description: 'Modo não identificado' };

    const modeInfo = {
      classic: { name: 'Modo Clássico', description: 'Múltiplas condições de vitória' },
      landmarks: { name: 'Modo Marcos', description: 'Construa marcos históricos' },
      reputation: { name: 'Modo Reputação', description: 'Alcance alta reputação' },
      elimination: { name: 'Modo Sobrevivência', description: 'Sobreviva por muitos turnos' },
      infinite: { name: 'Modo Infinito', description: 'Jogue indefinidamente' },
      resources: { name: 'Modo Recursos', description: 'Acumule riqueza' },
      production: { name: 'Modo Produção', description: 'Maximize a produção' },
      complex: { name: 'Modo Complexo', description: 'Complete múltiplos objetivos' },
      simple: { name: 'Modo Simples', description: 'Condição única de vitória' }
    };

    return modeInfo[victorySystem.mode] || { name: 'Modo Desconhecido', description: 'Modo não identificado' };
  };

  // Função para calcular valor atual de uma condição
  const getCurrentValue = (condition: any) => {
    switch (condition.category) {
      case 'reputation':
        return gameState.game.playerStats.reputation;
      case 'landmarks':
        return gameState.game.playerStats.landmarks;
      case 'survival':
        return gameState.game.turn;
      case 'coins':
        return gameState.game.resources.coins;
      case 'resources':
        // Para vitória por prosperidade, contar apenas moedas
        if (condition.id === 'classic_prosperity_1000') {
          return gameState.game.resources.coins;
        } else {
          return gameState.game.resources.coins + gameState.game.resources.food + 
                 gameState.game.resources.materials + gameState.game.resources.population;
        }
      case 'production':
        // Calcular produção total por turno
        const allCards = [
          ...gameState.game.farmGrid.flat().map(cell => cell.card).filter(Boolean),
          ...gameState.game.cityGrid.flat().map(cell => cell.card).filter(Boolean)
        ];
        let totalProduction = 0;
        allCards.forEach((card: any) => {
          if (card.production) {
            totalProduction += (card.production.coins || 0) + 
                             (card.production.food || 0) + 
                             (card.production.materials || 0) + 
                             (card.production.population || 0);
          }
        });
        return totalProduction;
      case 'diversity':
        // Para vitória por domínio mágico, contar cartas mágicas
        if (condition.id === 'classic_magic_dominance_4') {
          const allCards = [
            ...gameState.game.farmGrid.flat().map(cell => cell.card).filter(Boolean),
            ...gameState.game.cityGrid.flat().map(cell => cell.card).filter(Boolean),
            ...gameState.game.landmarksGrid.flat().map(cell => cell.card).filter(Boolean),
            ...gameState.game.eventGrid.flat().map(cell => cell.card).filter(Boolean)
          ];
          const magicCards = allCards.filter((card: any) => card.type === 'magic');
          return magicCards.length;
        } else {
          const allCards = [
            ...gameState.game.farmGrid.flat().map(cell => cell.card).filter(Boolean),
            ...gameState.game.cityGrid.flat().map(cell => cell.card).filter(Boolean)
          ];
          const types = new Set(allCards.map((card: any) => card.type));
          return types.size;
        }
      case 'events':
        const eventCards = gameState.game.eventGrid.flat().map(cell => cell.card).filter(Boolean);
        return eventCards.length;
      case 'magic':
        const magicAllCards = [
          ...gameState.game.farmGrid.flat().map(cell => cell.card).filter(Boolean),
          ...gameState.game.cityGrid.flat().map(cell => cell.card).filter(Boolean),
          ...gameState.game.landmarksGrid.flat().map(cell => cell.card).filter(Boolean),
          ...gameState.game.eventGrid.flat().map(cell => cell.card).filter(Boolean)
        ];
        const magicCards = magicAllCards.filter((card: any) => card.type === 'magic');
        return magicCards.length;
      case 'population':
        return gameState.game.resources.population;
      default:
        return 0;
    }
  };

  // Função para gerar detalhes das condições de vitória
  const getVictoryDetails = () => {
    const victorySystem = gameState.game.victorySystem;
    if (!victorySystem) return [];

    if (victorySystem.mode === 'classic' || victorySystem.mode === 'complex') {
      const majorConditions = victorySystem.conditions.filter((c: any) => c.type === 'major');
      const minorConditions = victorySystem.conditions.filter((c: any) => c.type === 'minor');
      
      return [
        ...majorConditions.map((c: any) => {
          const currentValue = getCurrentValue(c);
          return {
            name: c.name,
            completed: currentValue >= c.target,
            target: c.target,
            current: currentValue,
            type: 'major'
          };
        }),
        ...minorConditions.map((c: any) => {
          const currentValue = getCurrentValue(c);
          return {
            name: c.name,
            completed: currentValue >= c.target,
            target: c.target,
            current: currentValue,
            type: 'minor'
          };
        })
      ];
    } else {
      return victorySystem.conditions.map((c: any) => {
        const currentValue = getCurrentValue(c);
        return {
          name: c.name,
          completed: currentValue >= c.target,
          target: c.target,
          current: currentValue,
          type: 'simple'
        };
      });
    }
  };

  // Função para gerar resumo da vitória
  const getVictorySummary = () => {
    const victorySystem = gameState.game.victorySystem;
    if (!victorySystem) return '';

    const modeInfo = getGameModeInfo();
    const conditions = getVictoryDetails();
    const completedCount = conditions.filter(c => c.completed).length;
    const totalCount = conditions.length;

    if (victorySystem.mode === 'infinite') {
      return `Modo Infinito - Turno ${gameState.game.turn}`;
    }

    if (victorySystem.mode === 'classic') {
      const majorCompleted = conditions.filter(c => c.type === 'major' && c.completed).length;
      const minorCompleted = conditions.filter(c => c.type === 'minor' && c.completed).length;
      return `${modeInfo.name} - ${majorCompleted} vitórias maiores, ${minorCompleted} vitórias menores`;
    }

    if (victorySystem.mode === 'complex') {
      const majorCompleted = conditions.filter(c => c.type === 'major' && c.completed).length;
      const minorCompleted = conditions.filter(c => c.type === 'minor' && c.completed).length;
      return `${modeInfo.name} - ${majorCompleted}/${victorySystem.requiredMajor} maiores, ${minorCompleted}/${victorySystem.requiredMinor} menores`;
    }

    return `${modeInfo.name} - ${completedCount}/${totalCount} condições completadas`;
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

  // Forçar recarregamento das configurações quando o jogo inicia (apenas uma vez)
  useEffect(() => {
    if (user && !loading) {
      console.log('🎮 Recarregando configurações...');
      fetchUserSettings();
    }
  }, [user, loading]); // Removido fetchUserSettings da dependência

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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background animado premium */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.3) contrast(1.2)' }}
        >
          <source src={selectedBackground} type="video/mp4" />
        </video>
        
        {/* Overlay escuro para melhorar legibilidade */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Animated border glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 animate-pulse"></div>
        
        <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-3xl p-12 shadow-2xl max-w-md w-full mx-4">
          {/* Decorative border */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl"></div>
          
          <div className="relative text-center">
            {/* Medieval loading spinner */}
            <div className="relative mx-auto mb-8">
              <div className="w-20 h-20 border-4 border-amber-500/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-amber-500 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg"></div>
            </div>
            
            {/* Title with medieval styling */}
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent mb-4">
              Preparando Reino
            </h2>
            
            {/* Loading message */}
            <p className="text-gray-300/90 mb-6 text-lg">
              Carregando jogo...
            </p>
            
            {/* Progress indicators */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Verificando deck...</span>
                <span className="text-amber-400">✓</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Carregando cartas...</span>
                <span className="text-amber-400">✓</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Inicializando recursos...</span>
                <span className="text-amber-400">✓</span>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-amber-500/50 rounded-full animate-pulse"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500/50 rounded-full animate-pulse delay-75"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-500/50 rounded-full animate-pulse delay-150"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-amber-500/50 rounded-full animate-pulse delay-200"></div>
          </div>
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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background animado premium */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.3) contrast(1.2)' }}
        >
          <source src={selectedBackground} type="video/mp4" />
        </video>
        
        {/* Overlay escuro para melhorar legibilidade */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Animated border glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 animate-pulse"></div>
        
        <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-3xl p-12 shadow-2xl max-w-md w-full mx-4">
          {/* Decorative border */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl"></div>
          
          <div className="relative text-center">
            {/* Medieval loading spinner */}
            <div className="relative mx-auto mb-8">
              <div className="w-20 h-20 border-4 border-amber-500/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-amber-500 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg"></div>
            </div>
            
            {/* Title with medieval styling */}
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent mb-4">
              Inicializando Reino
            </h2>
            
            {/* Loading message */}
            <p className="text-gray-300/90 mb-6 text-lg">
            Preparando seu deck e cartas...
          </p>
            
            {/* Progress indicators */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Embaralhando cartas...</span>
                <span className="text-amber-400">✓</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Distribuindo mão inicial...</span>
                <span className="text-amber-400">✓</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Configurando recursos...</span>
                <span className="text-amber-400">✓</span>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-amber-500/50 rounded-full animate-pulse"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500/50 rounded-full animate-pulse delay-75"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-500/50 rounded-full animate-pulse delay-150"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-amber-500/50 rounded-full animate-pulse delay-200"></div>
          </div>
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

      {/* Modal de descarte medieval */}
      <MedievalDiscardModal
        isOpen={gameState.discardModal}
        onClose={() => gameState.handleDiscardCard(gameState.game.hand[0])}
        cards={gameState.game.hand}
        onDiscardCard={gameState.handleDiscardCard}
        onShowCardDetail={setSelectedCardForDetail}
        title="Descarte Obrigatório"
      />

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
        currentGameMode={settings?.game_preferences?.victoryMode}
      />

      {/* Modal de estatísticas do jogador */}
      <PlayerStatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />



      {/* Sistema de Notificações Medievais */}
      <MedievalNotificationSystem position="top-right" maxNotifications={8} defaultDuration={4000} />

      {/* Sistema de vitória */}
      <MedievalVictoryModal
        isOpen={!!gameState.victory}
        onClose={() => gameState.setVictory(null)}
        title="VITÓRIA CONQUISTADA!"
        subtitle={getGameModeInfo().name}
        achievements={getVictoryDetails().map(condition => `${condition.name}: ${condition.current}/${condition.target}`)}
        showConfetti={true}
        onLoadGame={() => setShowSavedGames(true)}
        onNewGame={handleNewGame}
        onGoHome={handleGoHome}
      />

      {/* Sistema de derrota */}
      <MedievalDefeatModal
        isOpen={!!gameState.defeat}
        onClose={() => gameState.setDefeat(null)}
        title="DERROTA"
        subtitle={getGameModeInfo().name}
        description={gameState.defeat || `Vosso castelo foi conquistado e vossas forças dispersas pelos ventos da guerra. A honra permanece, mas a vitória escapou de vossas mãos.`}
        onLoadGame={() => setShowSavedGames(true)}
        onNewGame={handleNewGame}
        onGoHome={handleGoHome}
      />

      {/* Botões de Teste Desativados - Removidos para produção */}
      {/* 
      {gameState.game.victorySystem && (
        <TestModeButton
          gameState={gameState.game}
          victorySystem={gameState.game.victorySystem}
          onTestVictory={() => {
            // Simular vitória real para teste
            const testVictoryMessage = `🏆 Teste de Vitória - ${gameState.game.victorySystem?.mode.toUpperCase()}`;
            
            // Simular vitória real
            if (gameState.game.victorySystem?.mode === 'infinite') {
              notify('info', 'Modo Infinito', 'Modo infinito ativo - continue jogando!', undefined, 5000);
            } else {
              // Simular vitória real
              gameState.setVictory(testVictoryMessage);
            }
          }}
          onTestDefeat={(defeatType?: 'population' | 'reputation' | 'turns' | 'deck') => {
            // Função para obter mensagem de derrota rotativa (cópia da função do useGameState)
            const getRandomDefeatMessage = (type: 'population' | 'reputation' | 'turns' | 'deck') => {
              const messages = {
                population: [
                  '💀 Derrota: Sua população chegou a 0! O reino foi abandonado por falta de habitantes.',
                  '🏰 Derrota: Vossa população sumiu! Parece que todos foram para o pub do reino vizinho.',
                  '👥 Derrota: População zero! Até os ratos do castelo foram embora procurar emprego.',
                  '🦗 Derrota: Reino vazio! Só restaram os grilos cantando "tudo bem, tudo bem".'
                ],
                reputation: [
                  '💀 Derrota: Sua reputação chegou a -1! O povo perdeu a confiança em vossa liderança.',
                  '👑 Derrota: Reputação no chão! Até o bobo da corte está rindo de vós.',
                  '🤡 Derrota: Reputação -1! Agora vós sois o novo bobo da corte.',
                  '🎭 Derrota: Reputação zerada! O povo prefere um dragão como rei.'
                ],
                turns: [
                  '💀 Derrota: Limite de turnos atingido! O tempo se esgotou para vossa missão.',
                  '⏰ Derrota: Tempo esgotado! O relógio do castelo parou de funcionar.',
                  '🕰️ Derrota: Turnos acabaram! O tempo voou como uma flecha mágica.',
                  '⌛ Derrota: Tempo esgotado! A ampulheta virou e não voltou mais.'
                ],
                deck: [
                  '💀 Derrota: Seu baralho ficou vazio! O baralho mágico fugiu para outro reino.',
                  '🃏 Derrota: Baralho vazio! As cartas foram jogar pôquer com os elfos.',
                  '🎴 Derrota: Sem cartas! O baralho decidiu tirar férias no reino das fadas.',
                  '🃏 Derrota: Baralho zerado! As cartas foram fazer turismo em outros castelos.'
                ]
              };
              
              const typeMessages = messages[type];
              const randomIndex = Math.floor(Math.random() * typeMessages.length);
              return typeMessages[randomIndex];
            };
            
            // Se o tipo foi fornecido, usar mensagem rotativa específica
            if (defeatType) {
              const defeatMessage = getRandomDefeatMessage(defeatType);
              console.log('💀 Teste de derrota ativado:', defeatMessage);
              gameState.setDefeat(defeatMessage);
            } else {
              // Fallback: definir mensagem baseada no estado atual
              let defeatMessage = '💀 Teste de Derrota';
              
              if (gameState.game.resources.population <= 0) {
                defeatMessage = getRandomDefeatMessage('population');
              } else if (gameState.game.playerStats.reputation <= -1) {
                defeatMessage = getRandomDefeatMessage('reputation');
              } else if (gameState.game.turn > 50) {
                defeatMessage = getRandomDefeatMessage('turns');
              } else if (gameState.game.playerStats.reputation <= -1) {
                defeatMessage = getRandomDefeatMessage('reputation');
              } else if (gameState.game.turn > 50) {
                defeatMessage = getRandomDefeatMessage('turns');
              } else if (gameState.game.deck.length === 0) {
                defeatMessage = getRandomDefeatMessage('deck');
              }
              
              console.log('💀 Teste de derrota ativado (fallback):', defeatMessage);
              gameState.setDefeat(defeatMessage);
            }
          }}
          isTestMode={true} // Sempre mostrar para admins durante desenvolvimento
          onUpdateGameState={(updates) => {
            // Atualizar o estado do jogo com as condições preenchidas
            gameState.updateGameState({
              ...gameState.game,
              ...updates
            });
          }}
        />
      )}
      */}
      

    </div>
  );
};

export default GamePage;
