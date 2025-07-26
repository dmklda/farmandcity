import React, { useState } from 'react';
import { usePlayerDecks } from '../hooks/usePlayerDecks';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

export const DeckSelector: React.FC = () => {
  const { 
    decks, 
    activeDeck, 
    loading, 
    error, 
    setActiveDeckById,
    createDeck 
  } = usePlayerDecks();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');

  const handleCreateDeck = async () => {
    if (!newDeckName.trim()) return;
    
    try {
      setIsCreating(true);
      await createDeck(newDeckName.trim());
      setNewDeckName('');
    } catch (err: any) {
      console.error('Error creating deck:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectDeck = async (deckId: string) => {
    try {
      await setActiveDeckById(deckId);
    } catch (err: any) {
      console.error('Error selecting deck:', err);
    }
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-32 mb-2"></div>
          <div className="h-8 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 border-destructive">
        <p className="text-destructive text-sm">{error}</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Decks</h3>
          <Badge variant="secondary">
            {activeDeck?.cards.length || 0}/28 cartas
          </Badge>
        </div>

        {/* Seletor de Deck Ativo */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Deck Ativo:</label>
          <select 
            value={activeDeck?.id || ''}
            onChange={(e) => handleSelectDeck(e.target.value)}
            className="w-full p-2 border rounded-md bg-background"
          >
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.name} ({deck.cards.length}/28)
              </option>
            ))}
          </select>
        </div>

        {/* Criar Novo Deck */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Criar Novo Deck:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              placeholder="Nome do deck..."
              className="flex-1 p-2 border rounded-md bg-background text-sm"
              disabled={isCreating}
            />
            <Button 
              onClick={handleCreateDeck}
              disabled={!newDeckName.trim() || isCreating}
              size="sm"
            >
              {isCreating ? 'Criando...' : 'Criar'}
            </Button>
          </div>
        </div>

        {/* Info do Deck Ativo */}
        {activeDeck && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Deck: {activeDeck.name}</h4>
            <div className="text-xs text-muted-foreground">
              <p>Cartas: {activeDeck.cards.length}/28</p>
              <p>Criado: {new Date(activeDeck.created_at).toLocaleDateString()}</p>
            </div>
            
            {/* Preview das cartas no deck */}
            <div className="max-h-32 overflow-y-auto">
              <div className="text-xs space-y-1">
                {Object.entries(
                  activeDeck.cards.reduce((acc, card) => {
                    const baseName = card.name;
                    acc[baseName] = (acc[baseName] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([cardName, count]) => (
                  <div key={cardName} className="flex justify-between">
                    <span className="truncate">{cardName}</span>
                    <span className="text-muted-foreground">x{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};