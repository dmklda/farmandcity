import { useState, useEffect } from 'react';
import { GameState, GamePhase, GridCell } from '../types/gameState';
import { starterCards, baseDeck } from '../data/cards';
import { Resources } from '../types/resources';
import { Card } from '../types/card';
import { createEmptyGrid, shuffle, parseProduction, parseInstantEffect, parseDiceProduction, getInitialState } from '../utils/gameUtils';

const DECK_LIMIT = 28;
const phaseOrder: GamePhase[] = ['draw', 'action', 'build', 'production', 'end'];

export function useGameState() {
  // --- ESTADO PRINCIPAL ---
  const [customDeck, setCustomDeck] = useState<Card[]>([]);
  const [magicUsedThisTurn, setMagicUsedThisTurn] = useState(false);
  const [pendingDefense, setPendingDefense] = useState<Card | null>(null);
  const getActiveDeck = () => (customDeck.length > 0 ? customDeck.slice(0, DECK_LIMIT) : shuffle(baseDeck).slice(0, DECK_LIMIT));
  const [game, setGame] = useState<GameState>(() => getInitialState(getActiveDeck()));
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
  const deckAreaProps = {
    deckCount: game.deck.length,
    lastDrawn,
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
    deckAreaProps,
    handProps,
    discardModal,
    // ...outros handlers e estados se necessário
  };
} 