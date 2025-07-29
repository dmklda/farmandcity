import { useState, useEffect, useMemo } from 'react';
import { Card } from '../types/card';
import { usePlayerCards } from './usePlayerCards';
import { useStarterDeck } from './useStarterDeck';

export const useUnlockedCards = () => {
  const { playerCards, loading: playerCardsLoading, error: playerCardsError } = usePlayerCards();
  const { starterDeck, loading: starterDeckLoading, error: starterDeckError } = useStarterDeck();

  // Combinar cartas starter + cartas desbloqueadas pelo usuário
  const unlockedCards = useMemo(() => {
    const allCards = [...starterDeck, ...playerCards];
    
    // Remover duplicatas baseado no ID base da carta
    const uniqueCards = new Map<string, Card>();
    
    allCards.forEach(card => {
      const baseId = card.id.split('_')[0]; // Remover sufixo de cópia
      if (!uniqueCards.has(baseId)) {
        uniqueCards.set(baseId, card);
      }
    });
    
    return Array.from(uniqueCards.values());
  }, [starterDeck, playerCards]);

  const loading = playerCardsLoading || starterDeckLoading;
  const error = playerCardsError || starterDeckError;

  // Verificar se usuário possui uma carta específica
  const hasCard = (cardId: string): boolean => {
    const baseId = cardId.split('_')[0];
    return unlockedCards.some(card => card.id.split('_')[0] === baseId);
  };

  // Obter quantidade de uma carta específica
  const getCardQuantity = (cardId: string): number => {
    const baseId = cardId.split('_')[0];
    const starterCount = starterDeck.filter(card => 
      card.id.split('_')[0] === baseId
    ).length;
    
    const playerCount = playerCards.filter(card => 
      card.id.split('_')[0] === baseId
    ).length;
    
    return starterCount + playerCount;
  };

  // Filtrar cartas por tipo
  const getCardsByType = (type: Card['type']): Card[] => {
    return unlockedCards.filter(card => card.type === type);
  };

  // Filtrar cartas por raridade
  const getCardsByRarity = (rarity: Card['rarity']): Card[] => {
    return unlockedCards.filter(card => card.rarity === rarity);
  };

  // Buscar carta por ID
  const getCardById = (cardId: string): Card | undefined => {
    const baseId = cardId.split('_')[0];
    return unlockedCards.find(card => card.id.split('_')[0] === baseId);
  };

  return {
    unlockedCards,
    loading,
    error,
    hasCard,
    getCardQuantity,
    getCardsByType,
    getCardsByRarity,
    getCardById,
    starterDeck,
    playerCards,
  };
}; 