import React, { useState, useEffect } from 'react';
import { usePlayerCards } from '../hooks/usePlayerCards';
import { usePlayerDecks } from '../hooks/usePlayerDecks';
import { useGameSettings } from '../hooks/useGameSettings';
import { useCardCopyLimits } from '../hooks/useCardCopyLimits';
import { Card } from '../types/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card as UICard } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CardMiniature } from './CardMiniature';
import { CardDetailModal } from './EnhancedHand';

interface DeckBuilderProps {
  deckId?: string;
  onClose: () => void;
}

export const DeckBuilder: React.FC<DeckBuilderProps> = ({ deckId, onClose }) => {
  const { playerCards, loading: cardsLoading } = usePlayerCards();
  const { decks, updateDeck, createDeck } = usePlayerDecks();
  const { settings: gameSettings } = useGameSettings();
  const { validateCompleteDeck, canAddCardToDeck, getDeckStats } = useCardCopyLimits();
  
  const [deckName, setDeckName] = useState('Novo Deck');
  const [deckCards, setDeckCards] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Carregar deck existente para edição
  useEffect(() => {
    if (deckId) {
      const existingDeck = decks.find(d => d.id === deckId);
      if (existingDeck) {
        setDeckName(existingDeck.name);
        setDeckCards(existingDeck.card_ids);
      }
    }
  }, [deckId, decks]);

  // Converter IDs para objetos Card para validação
  const deckCardsObjects = React.useMemo(() => {
    return deckCards.map(cardId => {
      const card = playerCards.find(c => c.id === cardId);
      return card;
    }).filter(Boolean) as Card[];
  }, [deckCards, playerCards]);

  // Validar deck
  const deckValidation = React.useMemo(() => {
    if (deckCardsObjects.length === 0) {
      return { valid: false, errors: ['Deck deve ter pelo menos uma carta'], stats: null };
    }
    
    const minCards = gameSettings.deckMinCards || 23;
    const maxCards = gameSettings.deckMaxCards || 40;
    
    return validateCompleteDeck(deckCardsObjects, minCards, maxCards);
  }, [deckCardsObjects, gameSettings.deckMinCards, gameSettings.deckMaxCards, validateCompleteDeck]);

  // Atualizar erros de validação
  useEffect(() => {
    setValidationErrors(deckValidation.errors);
  }, [deckValidation.errors]);

  // Agrupar cartas do jogador por ID base (sem considerar cópias)
  const availableCards = React.useMemo(() => {
    const cardGroups: Record<string, { card: Card; owned: number; inDeck: number; canAdd: boolean; reason?: string }> = {};
    
    playerCards.forEach(card => {
      const baseId = card.id; // Usar ID completo
      if (!cardGroups[baseId]) {
        cardGroups[baseId] = {
          card: { ...card, id: baseId }, // Usar ID completo
          owned: 0,
          inDeck: 0,
          canAdd: true
        };
      }
      cardGroups[baseId].owned++;
    });

    // Contar quantas de cada carta estão no deck e verificar se pode adicionar
    deckCards.forEach(cardId => {
      if (cardGroups[cardId]) {
        cardGroups[cardId].inDeck++;
      }
    });

    // Verificar se cada carta pode ser adicionada
    Object.values(cardGroups).forEach(group => {
      // Verificar se o jogador possui cópias suficientes
      if (group.inDeck >= group.owned) {
        group.canAdd = false;
        group.reason = `Você possui apenas ${group.owned} cópia${group.owned > 1 ? 's' : ''} desta carta`;
        return;
      }
      
      const currentDeck = deckCardsObjects.filter(c => c.id !== group.card.id);
      const canAdd = canAddCardToDeck(group.card, currentDeck);
      group.canAdd = canAdd.canAdd;
      group.reason = canAdd.reason;
    });

    return Object.values(cardGroups);
  }, [playerCards, deckCards, deckCardsObjects, canAddCardToDeck]);

  const addCardToDeck = (cardId: string) => {
    const maxCards = gameSettings.deckMaxCards || 40;
    if (deckCards.length >= maxCards) return;
    
    const cardGroup = availableCards.find(g => g.card.id === cardId);
    if (!cardGroup || !cardGroup.canAdd) return;
    
    setDeckCards(prev => [...prev, cardId]);
  };

  const removeCardFromDeck = (cardId: string) => {
    const index = deckCards.findIndex(id => id === cardId);
    if (index === -1) return;
    
    setDeckCards(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!deckValidation.valid) {
      setValidationErrors(deckValidation.errors);
      return;
    }

    try {
      setSaving(true);
      
      if (deckId) {
        // Atualizar deck existente
        await updateDeck(deckId, {
          name: deckName,
          card_ids: deckCards
        });
      } else {
        // Criar novo deck
        await createDeck(deckName, deckCards);
      }
      
      onClose();
    } catch (err: any) {
      console.error('Error saving deck:', err);
    } finally {
      setSaving(false);
    }
  };

  const canSave = deckName.trim() && deckValidation.valid;

  if (cardsLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <UICard className="w-4/5 max-w-4xl h-4/5 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-48"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
            <div className="grid grid-cols-6 gap-4">
              {Array(12).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </UICard>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <UICard className="w-4/5 max-w-6xl h-4/5 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <input
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="text-xl font-bold bg-transparent border-none outline-none"
                placeholder="Nome do deck"
              />
              <div className="flex items-center gap-4">
                <Badge variant={deckValidation.valid ? "default" : "destructive"}>
                  {deckCards.length}/{gameSettings.deckMaxCards || 40} cartas
                </Badge>
                <Badge variant="outline">
                  {availableCards.length} tipos disponíveis
                </Badge>
                {deckValidation.stats && (
                  <Badge variant="secondary">
                    {deckValidation.stats.uniqueLandmarks} landmarks únicos
                  </Badge>
                )}
              </div>
              {validationErrors.length > 0 && (
                <div className="text-sm text-destructive space-y-1">
                  {validationErrors.map((error, index) => (
                    <div key={index}>• {error}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!canSave || saving}
              >
                {saving ? 'Salvando...' : deckId ? 'Atualizar' : 'Criar Deck'}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          <Tabs defaultValue="cards" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cards">Cartas Disponíveis</TabsTrigger>
              <TabsTrigger value="deck">Deck Atual</TabsTrigger>
            </TabsList>
            
            {/* Cartas Disponíveis */}
            <TabsContent value="cards" className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-4 gap-4 p-4">
                {availableCards.map(({ card, owned, inDeck, canAdd, reason }) => (
                  <div key={card.id} className="space-y-2">
                    <div className="relative">
                      <CardMiniature
                        card={card}
                        onSelect={() => addCardToDeck(card.id)}
                        isPlayable={canAdd && deckCards.length < (gameSettings.deckMaxCards || 40)}
                        size="small"
                        showInfo={true}
                      />
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {owned}
                      </div>
                      {inDeck > 0 && (
                        <div className="absolute -bottom-2 -right-2 bg-secondary text-secondary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          {inDeck}
                        </div>
                      )}
                      {!canAdd && (
                        <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                          <div className="text-white text-xs text-center p-1">
                            ❌
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-xs font-medium truncate">{card.name}</p>
                      {reason && (
                        <p className="text-xs text-muted-foreground truncate" title={reason}>
                          {reason}
                        </p>
                      )}
                      <div className="flex justify-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs"
                          onClick={() => addCardToDeck(card.id)}
                          disabled={!canAdd || deckCards.length >= (gameSettings.deckMaxCards || 40)}
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs"
                          onClick={() => removeCardFromDeck(card.id)}
                          disabled={inDeck === 0}
                        >
                          -
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Deck Atual */}
            <TabsContent value="deck" className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                <div className="text-sm text-muted-foreground">
                  Cartas no deck ({deckCards.length}/{gameSettings.deckMaxCards || 40}):
                </div>
                
                {deckCards.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma carta no deck. Adicione cartas da aba "Cartas Disponíveis".
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(
                      deckCards.reduce((acc, cardId) => {
                        const card = availableCards.find(g => g.card.id === cardId)?.card;
                        if (card) {
                          acc[cardId] = acc[cardId] || { card, count: 0 };
                          acc[cardId].count++;
                        }
                        return acc;
                      }, {} as Record<string, { card: Card; count: number }>)
                    ).map(([cardId, { card, count }]) => (
                      <div key={cardId} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-3">
                          <CardMiniature 
                            card={card} 
                            size="small"
                            showInfo={true}
                          />
                          <div>
                            <p className="font-medium">{card.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {card.type} • {card.rarity}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">x{count}</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeCardFromDeck(cardId)}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </UICard>
    </div>
  );
};
