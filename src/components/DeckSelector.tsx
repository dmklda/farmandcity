import React, { useState } from 'react';
import { usePlayerDecks } from '../hooks/usePlayerDecks';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Eye, Edit, Plus } from 'lucide-react';

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
      <Card className="p-4 bg-background/80 backdrop-blur-sm border">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-32"></div>
          <div className="h-8 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 border-destructive bg-destructive/10">
        <p className="text-destructive text-sm">{error}</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-background/80 backdrop-blur-sm border shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span>Decks</span>
            <Badge variant="secondary" className="text-xs">
              {decks.length} total
            </Badge>
          </h3>
        </div>

        {/* Seletor de Deck Ativo */}
        <div className="space-y-2">
          <label htmlFor="deck-select" className="text-sm font-medium text-muted-foreground">Deck Ativo:</label>
          <select 
            id="deck-select"
            value={activeDeck?.id || ''}
            onChange={(e) => handleSelectDeck(e.target.value)}
            className="w-full p-2 border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Selecione um deck...</option>
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.name} ({deck.cards.length}/28)
              </option>
            ))}
          </select>
        </div>

        {/* Criar Novo Deck */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Criar Novo Deck:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              placeholder="Nome do deck..."
              className="flex-1 p-2 border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              disabled={isCreating}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreateDeck();
                }
              }}
            />
            <Button 
              onClick={handleCreateDeck}
              disabled={!newDeckName.trim() || isCreating}
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              {isCreating ? 'Criando...' : 'Criar'}
            </Button>
          </div>
        </div>

        {/* Info do Deck Ativo */}
        {activeDeck && (
          <div className="space-y-3 p-3 bg-muted/30 rounded-lg border">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">{activeDeck.name}</h4>
              <Badge variant={activeDeck.cards.length === 28 ? "default" : "secondary"}>
                {activeDeck.cards.length}/28
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Criado: {new Date(activeDeck.created_at).toLocaleDateString()}</p>
              <p>Última atualização: {new Date(activeDeck.updated_at || activeDeck.created_at).toLocaleDateString()}</p>
            </div>
            
            {/* Preview das cartas no deck */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Composição:</span>
                <Eye className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="max-h-32 overflow-y-auto bg-background/50 rounded p-2">
                {activeDeck.cards.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    Deck vazio
                  </p>
                ) : (
                  <div className="text-xs space-y-1">
                    {Object.entries(
                      activeDeck.cards.reduce((acc, card) => {
                        const baseName = card.name;
                        acc[baseName] = (acc[baseName] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([cardName, count]) => (
                      <div key={cardName} className="flex justify-between items-center">
                        <span className="truncate flex-1">{cardName}</span>
                        <Badge variant="outline" className="text-xs ml-2">
                          x{count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lista de todos os decks */}
        {decks.length > 1 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Todos os Decks:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {decks.map((deck) => (
                <div 
                  key={deck.id} 
                  className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer transition-colors ${
                    activeDeck?.id === deck.id 
                      ? 'bg-primary/20 border border-primary/30' 
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                  onClick={() => handleSelectDeck(deck.id)}
                >
                  <span className="truncate flex-1">{deck.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {deck.cards.length}/28
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};