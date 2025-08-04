import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Card } from '../types/card';

export interface CardCopyLimit {
  id: string;
  rarity: string;
  max_copies: number;
  description: string;
}

export const useCardCopyLimits = () => {
  const [copyLimits, setCopyLimits] = useState<CardCopyLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar limites de cópias
  const fetchCopyLimits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('card_copy_limits')
        .select('*')
        .order('rarity', { ascending: true });

      if (error) throw error;
      setCopyLimits((data || []) as CardCopyLimit[]);
    } catch (err: any) {
      console.error('Error fetching copy limits:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter limite de cópias para uma raridade específica
  const getCopyLimit = useCallback((rarity: string): number => {
    const limit = copyLimits.find(limit => limit.rarity === rarity);
    return limit?.max_copies || 1; // Padrão: 1 cópia
  }, [copyLimits]);

  // Verificar se um deck é válido baseado nos limites de cópias
  const validateDeck = useCallback((cards: Card[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const cardCounts = new Map<string, number>();
    const landmarkCounts = new Map<string, number>();

    // Contar cartas por ID
    cards.forEach(card => {
      const cardId = card.id;
      cardCounts.set(cardId, (cardCounts.get(cardId) || 0) + 1);
      
      // Contar landmarks separadamente
      if (card.type === 'landmark') {
        landmarkCounts.set(cardId, (landmarkCounts.get(cardId) || 0) + 1);
      }
    });

    // Verificar limites por raridade
    cardCounts.forEach((count, cardId) => {
      const card = cards.find(c => c.id === cardId);
      if (!card) return;

      const limit = getCopyLimit(card.rarity);
      
      if (count > limit) {
        errors.push(`${card.name}: máximo ${limit} cópia${limit > 1 ? 's' : ''} permitida${limit > 1 ? 's' : ''} para raridade ${card.rarity}`);
      }
    });

    // Verificar limite especial para landmarks (1 cópia de cada)
    landmarkCounts.forEach((count, cardId) => {
      if (count > 1) {
        const card = cards.find(c => c.id === cardId);
        if (card) {
          errors.push(`${card.name}: apenas 1 cópia de cada carta landmark é permitida`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }, [getCopyLimit]);

  // Verificar se uma carta pode ser adicionada ao deck
  const canAddCardToDeck = useCallback((card: Card, currentDeck: Card[]): { canAdd: boolean; reason?: string } => {
    const currentCount = currentDeck.filter(c => c.id === card.id).length;
    const limit = getCopyLimit(card.rarity);

    // Verificar limite especial para landmarks
    if (card.type === 'landmark') {
      if (currentCount >= 1) {
        return {
          canAdd: false,
          reason: `Apenas 1 cópia de cada carta landmark é permitida`
        };
      }
    } else {
      // Verificar limite por raridade
      if (currentCount >= limit) {
        return {
          canAdd: false,
          reason: `Máximo ${limit} cópia${limit > 1 ? 's' : ''} permitida${limit > 1 ? 's' : ''} para raridade ${card.rarity}`
        };
      }
    }

    return { canAdd: true };
  }, [getCopyLimit]);

  // Obter estatísticas do deck
  const getDeckStats = useCallback((cards: Card[]) => {
    const stats = {
      totalCards: cards.length,
      byRarity: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      landmarks: 0,
      uniqueLandmarks: 0
    };

    const uniqueLandmarkIds = new Set<string>();

    cards.forEach(card => {
      // Contar por raridade
      stats.byRarity[card.rarity] = (stats.byRarity[card.rarity] || 0) + 1;
      
      // Contar por tipo
      stats.byType[card.type] = (stats.byType[card.type] || 0) + 1;
      
      // Contar landmarks
      if (card.type === 'landmark') {
        stats.landmarks++;
        uniqueLandmarkIds.add(card.id);
      }
    });

    stats.uniqueLandmarks = uniqueLandmarkIds.size;

    return stats;
  }, []);

  // Verificar se o deck está dentro dos limites de tamanho
  const validateDeckSize = useCallback((cards: Card[], minCards: number = 23, maxCards: number = 40): { valid: boolean; reason?: string } => {
    if (cards.length < minCards) {
      return {
        valid: false,
        reason: `Deck deve ter pelo menos ${minCards} cartas (atual: ${cards.length})`
      };
    }

    if (cards.length > maxCards) {
      return {
        valid: false,
        reason: `Deck deve ter no máximo ${maxCards} cartas (atual: ${cards.length})`
      };
    }

    return { valid: true };
  }, []);

  // Validar deck completo (tamanho + cópias)
  const validateCompleteDeck = useCallback((cards: Card[], minCards: number = 23, maxCards: number = 40) => {
    const sizeValidation = validateDeckSize(cards, minCards, maxCards);
    const copyValidation = validateDeck(cards);

    return {
      valid: sizeValidation.valid && copyValidation.valid,
      errors: [
        ...(sizeValidation.reason ? [sizeValidation.reason] : []),
        ...copyValidation.errors
      ],
      stats: getDeckStats(cards)
    };
  }, [validateDeckSize, validateDeck, getDeckStats]);

  useEffect(() => {
    fetchCopyLimits();
  }, [fetchCopyLimits]);

  return {
    copyLimits,
    loading,
    error,
    fetchCopyLimits,
    getCopyLimit,
    validateDeck,
    canAddCardToDeck,
    getDeckStats,
    validateDeckSize,
    validateCompleteDeck
  };
}; 