// Sistema de Debug de Efeitos de Cartas
// Disponível globalmente via window.debugGameEffects()

import { GameState } from '../types/gameState';
import { parseEffectLogic } from './effectParser';
import { Card } from '../types/card';

interface EffectDebugInfo {
  cardId: string;
  cardName: string;
  cardType: string;
  effectLogic: string | null;
  parsedEffects: any;
  isActive: boolean;
  isDeactivated: boolean;
  location: string;
}

interface GameDebugSnapshot {
  timestamp: string;
  turn: number;
  phase: string;
  resources: {
    coins: number;
    food: number;
    materials: number;
    population: number;
  };
  playerStats: {
    reputation: number;
    totalProduction: number;
    buildings: number;
    landmarks: number;
  };
  activeCards: EffectDebugInfo[];
  handCards: EffectDebugInfo[];
  effectTracking: Record<string, any>;
  temporaryBoosts: any[];
  continuousBoosts: any[];
  cardRestrictions: any[];
}

/**
 * Coleta informações de debug sobre o estado atual do jogo
 */
export function collectGameDebugInfo(
  gameState: GameState,
  temporaryBoosts: any[] = [],
  continuousBoosts: any[] = []
): GameDebugSnapshot {
  const activeCards: EffectDebugInfo[] = [];
  
  // Coletar cartas do grid de fazendas
  gameState.farmGrid.flat().forEach((cell, index) => {
    if (cell.card) {
      activeCards.push({
        cardId: cell.card.id,
        cardName: cell.card.name,
        cardType: cell.card.type,
        effectLogic: cell.card.effect_logic || null,
        parsedEffects: cell.card.effect_logic ? parseEffectLogic(cell.card.effect_logic) : null,
        isActive: !cell.card.deactivated,
        isDeactivated: !!cell.card.deactivated,
        location: `farmGrid[${Math.floor(index / 4)}][${index % 4}]`
      });
    }
  });
  
  // Coletar cartas do grid de cidades
  gameState.cityGrid.flat().forEach((cell, index) => {
    if (cell.card) {
      activeCards.push({
        cardId: cell.card.id,
        cardName: cell.card.name,
        cardType: cell.card.type,
        effectLogic: cell.card.effect_logic || null,
        parsedEffects: cell.card.effect_logic ? parseEffectLogic(cell.card.effect_logic) : null,
        isActive: !cell.card.deactivated,
        isDeactivated: !!cell.card.deactivated,
        location: `cityGrid[${Math.floor(index / 4)}][${index % 4}]`
      });
    }
  });
  
  // Coletar cartas do grid de landmarks
  gameState.landmarksGrid.flat().forEach((cell, index) => {
    if (cell.card) {
      activeCards.push({
        cardId: cell.card.id,
        cardName: cell.card.name,
        cardType: cell.card.type,
        effectLogic: cell.card.effect_logic || null,
        parsedEffects: cell.card.effect_logic ? parseEffectLogic(cell.card.effect_logic) : null,
        isActive: true,
        isDeactivated: false,
        location: `landmarksGrid[${index}]`
      });
    }
  });
  
  // Coletar cartas da mão
  const handCards: EffectDebugInfo[] = gameState.hand.map((card, index) => ({
    cardId: card.id,
    cardName: card.name,
    cardType: card.type,
    effectLogic: card.effect_logic || null,
    parsedEffects: card.effect_logic ? parseEffectLogic(card.effect_logic) : null,
    isActive: true,
    isDeactivated: false,
    location: `hand[${index}]`
  }));
  
  return {
    timestamp: new Date().toISOString(),
    turn: gameState.turn,
    phase: gameState.phase,
    resources: { ...gameState.resources },
    playerStats: { ...gameState.playerStats },
    activeCards,
    handCards,
    effectTracking: gameState.effectTracking || {},
    temporaryBoosts: [...temporaryBoosts],
    continuousBoosts: [...continuousBoosts],
    cardRestrictions: gameState.cardRestrictions || []
  };
}

/**
 * Imprime informações de debug no console de forma formatada
 */
export function printGameDebugInfo(snapshot: GameDebugSnapshot): void {
  console.log('%c═══════════════════════════════════════════════════════════', 'color: #FFD700; font-weight: bold');
  console.log('%c🎮 DEBUG DE EFEITOS DO JOGO', 'color: #FFD700; font-size: 16px; font-weight: bold');
  console.log('%c═══════════════════════════════════════════════════════════', 'color: #FFD700; font-weight: bold');
  
  console.log('\n%c📊 ESTADO GERAL', 'color: #00BFFF; font-weight: bold');
  console.log(`   Turno: ${snapshot.turn} | Fase: ${snapshot.phase}`);
  console.log(`   Timestamp: ${snapshot.timestamp}`);
  
  console.log('\n%c💰 RECURSOS', 'color: #32CD32; font-weight: bold');
  console.log(`   🪙 Moedas: ${snapshot.resources.coins}`);
  console.log(`   🍞 Comida: ${snapshot.resources.food}`);
  console.log(`   🪵 Materiais: ${snapshot.resources.materials}`);
  console.log(`   👥 População: ${snapshot.resources.population}`);
  
  console.log('\n%c📈 ESTATÍSTICAS', 'color: #FF69B4; font-weight: bold');
  console.log(`   ⭐ Reputação: ${snapshot.playerStats.reputation}`);
  console.log(`   📦 Produção Total: ${snapshot.playerStats.totalProduction}`);
  console.log(`   🏗️ Construções: ${snapshot.playerStats.buildings}`);
  console.log(`   🏛️ Landmarks: ${snapshot.playerStats.landmarks}`);
  
  console.log('\n%c🃏 CARTAS NO TABULEIRO (' + snapshot.activeCards.length + ')', 'color: #FFA500; font-weight: bold');
  snapshot.activeCards.forEach((card, i) => {
    const status = card.isDeactivated ? '⏸️ DESATIVADA' : '✅ ATIVA';
    console.log(`\n   ${i + 1}. ${card.cardName} (${card.cardType}) - ${status}`);
    console.log(`      📍 Localização: ${card.location}`);
    console.log(`      🔧 Effect Logic: ${card.effectLogic || 'N/A'}`);
    if (card.parsedEffects) {
      console.log(`      📋 Parsed:`, card.parsedEffects);
    }
  });
  
  console.log('\n%c✋ CARTAS NA MÃO (' + snapshot.handCards.length + ')', 'color: #9370DB; font-weight: bold');
  snapshot.handCards.forEach((card, i) => {
    console.log(`   ${i + 1}. ${card.cardName} (${card.cardType})`);
    console.log(`      🔧 Effect Logic: ${card.effectLogic || 'N/A'}`);
  });
  
  console.log('\n%c⚡ BOOSTS TEMPORÁRIOS (' + snapshot.temporaryBoosts.length + ')', 'color: #FF4500; font-weight: bold');
  if (snapshot.temporaryBoosts.length === 0) {
    console.log('   Nenhum boost temporário ativo');
  } else {
    snapshot.temporaryBoosts.forEach((boost, i) => {
      console.log(`   ${i + 1}. ${boost.type}: +${boost.amount} (duração: ${boost.duration || 'N/A'})`);
    });
  }
  
  console.log('\n%c🔄 BOOSTS CONTÍNUOS (' + snapshot.continuousBoosts.length + ')', 'color: #20B2AA; font-weight: bold');
  if (snapshot.continuousBoosts.length === 0) {
    console.log('   Nenhum boost contínuo ativo');
  } else {
    snapshot.continuousBoosts.forEach((boost, i) => {
      console.log(`   ${i + 1}. ${boost.type}: +${boost.amount}`);
    });
  }
  
  console.log('\n%c🚫 RESTRIÇÕES DE CARTAS (' + snapshot.cardRestrictions.length + ')', 'color: #DC143C; font-weight: bold');
  if (snapshot.cardRestrictions.length === 0) {
    console.log('   Nenhuma restrição ativa');
  } else {
    snapshot.cardRestrictions.forEach((restriction, i) => {
      console.log(`   ${i + 1}. Tipos bloqueados: ${restriction.restrictedTypes?.join(', ') || 'N/A'}`);
    });
  }
  
  console.log('\n%c📝 TRACKING DE EFEITOS EXECUTADOS', 'color: #8B4513; font-weight: bold');
  const trackingEntries = Object.entries(snapshot.effectTracking);
  if (trackingEntries.length === 0) {
    console.log('   Nenhum efeito rastreado');
  } else {
    trackingEntries.forEach(([key, value]) => {
      console.log(`   ${key}:`, value);
    });
  }
  
  console.log('\n%c═══════════════════════════════════════════════════════════', 'color: #FFD700; font-weight: bold');
}

/**
 * Inicializa o sistema de debug global
 * Chame esta função no início do jogo para disponibilizar window.debugGameEffects()
 */
export function initializeGlobalDebug(
  getGameState: () => GameState,
  getTemporaryBoosts: () => any[],
  getContinuousBoosts: () => any[]
): void {
  (window as any).debugGameEffects = () => {
    const snapshot = collectGameDebugInfo(
      getGameState(),
      getTemporaryBoosts(),
      getContinuousBoosts()
    );
    printGameDebugInfo(snapshot);
    return snapshot;
  };
  
  (window as any).getEffectSnapshot = () => {
    return collectGameDebugInfo(
      getGameState(),
      getTemporaryBoosts(),
      getContinuousBoosts()
    );
  };
  
  console.log('%c🎮 Sistema de debug de efeitos inicializado!', 'color: #00FF00; font-weight: bold');
  console.log('%c   Use window.debugGameEffects() para ver o estado atual', 'color: #00FF00');
  console.log('%c   Use window.getEffectSnapshot() para obter objeto JSON', 'color: #00FF00');
}
