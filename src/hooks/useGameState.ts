import { useState, useEffect } from 'react';
import { GameState, GamePhase, GridCell } from '../types/gameState';
import { starterCards, baseDeck } from '../data/cards';
import { Resources } from '../types/resources';
import { Card } from '../types/card';
import { createEmptyGrid, shuffle, parseProduction, parseInstantEffect, parseDiceProduction, getInitialState } from '../utils/gameUtils';
import { usePlayerCards } from './usePlayerCards';
import { useGameSettings } from './useGameSettings';

const DECK_LIMIT = 28;
const phaseOrder: GamePhase[] = ['draw', 'action', 'build', 'production', 'end'];

export function useGameState() {
  // Hooks para dados do Supabase
  const { playerCards, loading: cardsLoading } = usePlayerCards();
  const { settings: gameSettings, loading: settingsLoading } = useGameSettings();

  // --- ESTADO PRINCIPAL ---
  const [customDeck, setCustomDeck] = useState<Card[]>([]);
  const [magicUsedThisTurn, setMagicUsedThisTurn] = useState(false);
  const [pendingDefense, setPendingDefense] = useState<Card | null>(null);
  
  const getActiveDeck = () => {
    if (customDeck.length > 0) {
      return customDeck.slice(0, DECK_LIMIT);
    }
    // Usar cartas do jogador se disponíveis, senão usar o deck base
    const deckToUse = playerCards.length > 0 ? playerCards : baseDeck;
    return shuffle(deckToUse).slice(0, DECK_LIMIT);
  };

  const [game, setGame] = useState<GameState>(() => {
    const initialState = getInitialState(getActiveDeck());
    // Usar configurações do Supabase se disponíveis
    if (gameSettings && !settingsLoading) {
      initialState.resources = gameSettings.defaultStartingResources;
    }
    return initialState;
  });
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedGrid, setSelectedGrid] = useState<'farm' | 'city' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [productionSummary, setProductionSummary] = useState<string | null>(null);
  const [actionSummary, setActionSummary] = useState<string | null>(null);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [diceUsed, setDiceUsed] = useState<boolean>(false);
  const [diceProductionSummary, setDiceProductionSummary] = useState<string | null>(null);
  const [victory, setVictory] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [discardMode, setDiscardMode] = useState(false);
  const [defeat, setDefeat] = useState<string | null>(null);
  const [builtThisTurn, setBuiltThisTurn] = useState<{ farm: boolean; city: boolean }>({ farm: false, city: false });
  const [actionThisTurn, setActionThisTurn] = useState(false);
  const [discardedCards, setDiscardedCards] = useState<Card[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [builtCountThisTurn, setBuiltCountThisTurn] = useState(0);
  const [discardedThisTurn, setDiscardedThisTurn] = useState(false);
  const [lastDrawn, setLastDrawn] = useState<string | undefined>(undefined);

  // Atualizar recursos quando as configurações carregarem
  useEffect(() => {
    if (!settingsLoading && gameSettings && !cardsLoading) {
      setGame(prev => ({
        ...prev,
        resources: gameSettings.defaultStartingResources
      }));
    }
  }, [settingsLoading, gameSettings, cardsLoading]);

  // Atualizar deck quando as cartas do jogador carregarem
  useEffect(() => {
    if (!cardsLoading && playerCards.length > 0) {
      const newDeck = shuffle(playerCards).slice(0, DECK_LIMIT);
      setGame(prev => ({
        ...prev,
        deck: newDeck,
        hand: newDeck.slice(0, 5) // Dar 5 cartas iniciais
      }));
    }
  }, [cardsLoading, playerCards]);

  // --- EFFECTS E HANDLERS (resumido para exemplo) ---
  // ... (copiar todos os useEffect e handlers do App.tsx para cá)

  // --- PROPS PARA COMPONENTES ---
  const sidebarProps = {
    resources: {
      coins: game.resources.coins,
      food: game.resources.food,
      materials: game.resources.materials,
      population: game.resources.population,
      coinsPerTurn: 0, // TODO: calcular produção por turno
      foodPerTurn: 0,
      materialsPerTurn: 0,
      populationStatus: game.resources.population > 0 ? 'Estável' : 'Crítico',
    },
    progress: {
      reputation: game.playerStats.reputation,
      reputationMax: 10,
      production: game.playerStats.totalProduction,
      productionMax: 1000,
      landmarks: game.playerStats.landmarks,
      landmarksMax: 3,
      turn: game.turn,
      turnMax: 20,
    },
    victory: {
      reputation: game.playerStats.reputation,
      production: game.playerStats.totalProduction,
      landmarks: game.playerStats.landmarks,
      turn: game.turn,
    },
    history,
  };
  const topBarProps = {
    turn: game.turn,
    turnMax: 20,
    buildCount: builtCountThisTurn,
    buildMax: 2,
    phase: game.phase,
    onNextPhase: victory || discardMode ? () => {} : () => {}, // TODO: conectar handler
    discardMode,
  };
  const gridBoardProps = {
    farmGrid: game.farmGrid,
    cityGrid: game.cityGrid,
    farmCount: game.farmGrid.flat().filter(cell => cell.card).length,
    farmMax: 12, // 3x4 grid
    cityCount: game.cityGrid.flat().filter(cell => cell.card).length,
    cityMax: 6, // 2x3 grid
    landmarkCount: game.playerStats.landmarks,
    landmarkMax: 3,
    onSelectFarm: victory ? () => {} : (x: number, y: number) => {}, // TODO: conectar handler
    onSelectCity: victory ? () => {} : (x: number, y: number) => {}, // TODO: conectar handler
    highlightFarm: selectedGrid === 'farm',
    highlightCity: selectedGrid === 'city',
  };
  const handProps = {
    hand: game.hand,
    onSelectCard: victory ? () => {} : (card: Card) => {}, // TODO: conectar handler
    selectedCardId: selectedCard?.id,
    canPlayCard: (card: Card) => ({ playable: true }), // TODO: conectar lógica
  };
  const discardModal = discardMode ? "Modal de descarte aqui" : null;

  return {
    sidebarProps,
    topBarProps,
    gridBoardProps,
    
    handProps,
    discardModal,
    // ...outros handlers e estados se necessário
  };
} 