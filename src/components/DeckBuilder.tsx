import React, { useState, useEffect } from 'react';
import { usePlayerCards } from '../hooks/usePlayerCards';
import { usePlayerDecks } from '../hooks/usePlayerDecks';
import { Card } from '../types/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card as UICard } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import CardComponent from './CardComponent';

interface DeckBuilderProps {
  deckId?: string;
  onClose: () => void;
}

export const DeckBuilder: React.FC<DeckBuilderProps> = ({ deckId, onClose }) => {
  const { playerCards, loading: cardsLoading } = usePlayerCards();
  const { decks, updateDeck, createDeck } = usePlayerDecks();
  
  const [deckName, setDeckName] = useState('Novo Deck');
  const [deckCards, setDeckCards] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

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

  // Agrupar cartas do jogador por ID base (sem considerar cópias)
  const availableCards = React.useMemo(() => {
    const cardGroups: Record<string, { card: Card; owned: number; inDeck: number }> = {};
    
    playerCards.forEach(card => {
      const baseId = card.id.split('_')[0]; // Remove sufixo de cópia
      if (!cardGroups[baseId]) {
        cardGroups[baseId] = {
          card: { ...card, id: baseId }, // Usar ID base
          owned: 0,
          inDeck: 0
        };
      }
      cardGroups[baseId].owned++;
    });

    // Contar quantas de cada carta estão no deck
    deckCards.forEach(cardId => {
      if (cardGroups[cardId]) {
        cardGroups[cardId].inDeck++;
      }
    });

    return Object.values(cardGroups);
  }, [playerCards, deckCards]);

  const addCardToDeck = (cardId: string) => {
    if (deckCards.length >= 28) return;
    
    const cardGroup = availableCards.find(g => g.card.id === cardId);
    if (!cardGroup || cardGroup.inDeck >= cardGroup.owned) return;
    
    setDeckCards(prev => [...prev, cardId]);
  };

  const removeCardFromDeck = (cardId: string) => {
    const index = deckCards.findIndex(id => id === cardId);
    if (index === -1) return;
    
    setDeckCards(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
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

  const canSave = deckName.trim() && deckCards.length === 28;

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
                <Badge variant={deckCards.length === 28 ? "default" : "secondary"}>
                  {deckCards.length}/28 cartas
                </Badge>
                <Badge variant="outline">
                  {availableCards.length} tipos disponíveis
                </Badge>
              </div>
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
                {availableCards.map(({ card, owned, inDeck }) => (
                  <div key={card.id} className="space-y-2">
                    <div className="relative">
                      <CardComponent
                        card={card}
                        size="small"
                        onClick={() => addCardToDeck(card.id)}
                        playable={inDeck < owned && deckCards.length < 28}
                      />
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {owned}
                      </div>
                      {inDeck > 0 && (
                        <div className="absolute -bottom-2 -right-2 bg-secondary text-secondary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          {inDeck}
                        </div>
                      )}
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-xs font-medium truncate">{card.name}</p>
                      <div className="flex justify-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs"
                          onClick={() => addCardToDeck(card.id)}
                          disabled={inDeck >= owned || deckCards.length >= 28}
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
                  Cartas no deck ({deckCards.length}/28):
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
                          <CardComponent card={card} size="small" />
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