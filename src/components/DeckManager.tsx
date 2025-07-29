import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import CardComponent from './CardComponent';
import { usePlayerDecks } from '../hooks/usePlayerDecks';
import { usePlayerCards } from '../hooks/usePlayerCards';
import { Card } from '../types/card';
import { PlayerDeck } from '../types/admin';
import { Plus, Minus, Eye, X, Info } from 'lucide-react';

interface DeckManagerProps {
  onClose: () => void;
}

export const DeckManager: React.FC<DeckManagerProps> = ({ onClose }) => {
  const { decks, activeDeck, createDeck, updateDeck, deleteDeck, setActiveDeckById, loading, error: decksError } = usePlayerDecks();
  const { playerCards, loading: cardsLoading, error: cardsError } = usePlayerCards();
  
  const [selectedDeck, setSelectedDeck] = useState<PlayerDeck | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [deckName, setDeckName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState<Card | null>(null);
  const [showDeckInfo, setShowDeckInfo] = useState<string | null>(null);

  // Carregar dados do deck quando selecionado
  useEffect(() => {
    if (selectedDeck) {
      setDeckName(selectedDeck.name);
      setSelectedCards(selectedDeck.card_ids || []);
    } else {
      setDeckName('');
      setSelectedCards([]);
    }
  }, [selectedDeck]);

  // Obter informações sobre em quais decks a carta está sendo usada
  const getDeckUsageInfo = useCallback((baseId: string) => {
    const usage: { deckName: string; count: number; isActive: boolean }[] = [];
    
    decks.forEach(deck => {
      if (deck.card_ids) {
        const count = deck.card_ids.filter(id => id === baseId).length;
        if (count > 0) {
          usage.push({
            deckName: deck.name,
            count,
            isActive: deck.is_active
          });
        }
      }
    });
    
    return usage;
  }, [decks]);

  // Limite de cópias por raridade
  const getMaxCopiesByRarity = (rarity: string): number => {
    switch (rarity) {
      case 'common': return 4;
      case 'uncommon': return 3;
      case 'rare':
      case 'ultra': return 2;
      default: return 1;
    }
  };

  // Agrupar cartas por tipo base (remover sufixos _0, _1, etc.)
  const groupedCards = useMemo(() => {
    const groups = new Map<string, {
      baseId: string;
      card: Card;
      totalOwned: number;
      copiesInDeck: number;
      maxCopies: number;
      deckUsage: { deckName: string; count: number; isActive: boolean }[];
    }>();

    playerCards.forEach(card => {
      const baseId = card.id;
      if (!groups.has(baseId)) {
        const copiesInDeck = selectedCards.filter(id => id === baseId).length;
        const maxCopies = getMaxCopiesByRarity(card.rarity);
        const deckUsage = getDeckUsageInfo(baseId);
        groups.set(baseId, {
          baseId,
          card,
          totalOwned: 0,
          copiesInDeck,
          maxCopies,
          deckUsage
        });
      }
      groups.get(baseId)!.totalOwned++;
    });

    return Array.from(groups.values());
  }, [playerCards, selectedCards, getDeckUsageInfo]);

  // Adicionar cópia de uma carta
  const addCardCopy = (baseId: string) => {
    const group = groupedCards.find(g => g.baseId === baseId);
    if (!group) return;

    if (group.copiesInDeck < group.maxCopies && group.copiesInDeck < group.totalOwned) {
      // Verificar se o deck não está cheio
      if (selectedCards.length >= 28) {
        alert('Deck está cheio (máximo 28 cartas)');
        return;
      }
      
      // Para cartas com múltiplas cópias, simplesmente adicionar o ID base
      // O sistema de deck vai gerenciar as cópias
      setSelectedCards(prev => [...prev, baseId]);
    }
  };

  // Remover cópia de uma carta
  const removeCardCopy = (baseId: string) => {
    const group = groupedCards.find(g => g.baseId === baseId);
    if (!group || group.copiesInDeck <= 0) return;

    // Encontrar uma cópia no deck para remover
    const copyInDeck = selectedCards.find(id => id === baseId);
    if (copyInDeck) {
      setSelectedCards(prev => prev.filter(id => id !== copyInDeck));
    }
  };

  // Ver detalhes da carta
  const showCardDetailsModal = (card: Card) => {
    setShowCardDetails(card);
  };

  const handleSaveDeck = async () => {
    if (!selectedDeck) {
      try {
        setIsProcessing(true);
        if (!deckName.trim()) {
          throw new Error('Nome do deck é obrigatório');
        }
        if (selectedCards.length < 10) {
          throw new Error('Deck deve ter pelo menos 10 cartas');
        }
        if (selectedCards.length > 28) {
          throw new Error('Deck não pode ter mais de 28 cartas');
        }
        await createDeck(deckName, selectedCards, false);
        setDeckName('');
        setSelectedCards([]);
      } catch (err: any) {
        alert(err.message); // Usar um alert para feedback
      } finally {
        setIsProcessing(false);
      }
    } else {
      try {
        setIsProcessing(true);
        const currentDeck = decks.find(d => d.id === selectedDeck.id);
        if (!currentDeck) return;

        if (currentDeck.is_starter_deck) {
          if (selectedCards.length !== 38) {
            throw new Error('Deck inicial deve ter exatamente 38 cartas (28 básicas + 10 adicionais)');
          }
        } else {
          if (selectedCards.length < 10 || selectedCards.length > 28) {
            throw new Error('Deck customizado deve ter entre 10 e 28 cartas');
          }
        }

        await updateDeck(selectedDeck.id, {
          name: deckName,
          card_ids: selectedCards
        });
        
        setSelectedDeck(null);
        setDeckName('');
        setSelectedCards([]);
      } catch (err: any) {
        alert(err.message); // Usar um alert para feedback
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleDeleteDeck = async () => {
    if (!selectedDeck) return;
    try {
      setIsProcessing(true);
      await deleteDeck(selectedDeck.id);
      setSelectedDeck(null);
      setDeckName('');
      setSelectedCards([]);
    } catch (err: any) {
      alert(err.message); // Usar um alert para feedback
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Gerenciador de Decks</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Status do Sistema */}
        <div className="mb-4 p-3 bg-muted rounded">
          <h4 className="font-medium mb-2">Status do Sistema</h4>
          <div className="text-sm space-y-1">
            <p>• Cartas disponíveis: {playerCards.length}</p>
            <p>• Decks criados: {decks.length}</p>
            <p>• Deck ativo: {activeDeck?.name || 'Nenhum'}</p>
          </div>
        </div>

        {/* Seleção de Deck */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Deck Ativo</label>
          <select
            value={activeDeck?.id || ''}
            onChange={(e) => {
              if (e.target.value) {
                setActiveDeckById(e.target.value);
              }
            }}
            className="w-full p-2 border border-border rounded bg-background"
            disabled={loading}
            title="Selecionar deck ativo"
          >
            <option value="">Selecione um deck</option>
            {decks.map(deck => (
              <option key={deck.id} value={deck.id}>
                {deck.name} ({deck.card_ids?.length || 0} cartas)
              </option>
            ))}
          </select>
        </div>

        {/* Editor de Deck */}
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <Button
              onClick={() => setSelectedDeck(null)}
              variant={selectedDeck === null ? "default" : "outline"}
              size="sm"
            >
              Novo Deck
            </Button>
            {decks.map(deck => (
              <Button
                key={deck.id}
                onClick={() => setSelectedDeck(deck)}
                variant={selectedDeck?.id === deck.id ? "default" : "outline"}
                size="sm"
              >
                {deck.name}
              </Button>
            ))}
          </div>

          {selectedDeck && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded">
              <p className="text-sm text-destructive">
                Editando: {selectedDeck.name}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Deck</label>
              <Input
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="Nome do deck"
                disabled={isProcessing}
              />
            </div>
            
            <div className="flex gap-2 items-end">
              <Button
                onClick={handleSaveDeck}
                disabled={!deckName.trim() || isProcessing}
                className="flex-1"
              >
                {selectedDeck ? 'Atualizar' : 'Criar'} Deck
              </Button>
              
              {selectedDeck && (
                <Button
                  onClick={handleDeleteDeck}
                  variant="destructive"
                  disabled={isProcessing}
                >
                  Excluir
                </Button>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Cartas Selecionadas ({selectedCards.length})
            </label>
            
            {playerCards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-border rounded">
                <p>Nenhuma carta disponível.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto border border-border rounded p-3">
                {groupedCards.map(group => {
                  const canAdd = group.copiesInDeck < group.maxCopies && group.copiesInDeck < group.totalOwned;
                  const canRemove = group.copiesInDeck > 0;
                  const hasDeckUsage = group.deckUsage.length > 0;
                  
                  return (
                    <div
                      key={group.baseId}
                      className={`p-3 border rounded-lg ${
                        group.copiesInDeck > 0
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{group.card.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">{group.card.type}</div>
                        </div>
                        <div className="flex gap-1">
                          {hasDeckUsage && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowDeckInfo(showDeckInfo === group.baseId ? null : group.baseId)}
                              className="h-6 w-6 p-0"
                              title="Ver uso em decks"
                            >
                              <Info className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => showCardDetailsModal(group.card)}
                            className="h-6 w-6 p-0"
                            title="Ver detalhes"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Informações de uso em decks */}
                      {showDeckInfo === group.baseId && hasDeckUsage && (
                        <div className="mb-2 p-2 bg-muted rounded text-xs">
                          <div className="font-medium mb-1">Usada em:</div>
                          {group.deckUsage.map((usage, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className={usage.isActive ? 'text-primary font-medium' : ''}>
                                {usage.deckName}
                              </span>
                              <span className="text-muted-foreground">
                                {usage.count} {usage.count === 1 ? 'cópia' : 'cópias'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {group.copiesInDeck}/{Math.min(group.maxCopies, group.totalOwned)} no Deck
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCardCopy(group.baseId)}
                            disabled={!canRemove || isProcessing}
                            className="h-6 w-6 p-0"
                            title="Remover do deck"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="text-xs font-medium min-w-[20px] text-center">
                            {group.copiesInDeck}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addCardCopy(group.baseId)}
                            disabled={!canAdd || isProcessing}
                            className="h-6 w-6 p-0"
                            title="Adicionar ao deck"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>

      {/* Modal de Detalhes da Carta */}
      {showCardDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Detalhes da Carta</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCardDetails(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <CardComponent card={showCardDetails} />
            
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setShowCardDetails(null)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 