import React, { useState, useMemo } from 'react';
import { usePlayerCards } from '../hooks/usePlayerCards';
import { usePlayerDecks } from '../hooks/usePlayerDecks';
import { useGameSettings } from '../hooks/useGameSettings';
import { useCardCopyLimits } from '../hooks/useCardCopyLimits';
import { useDialog } from './ui/dialog';
import { Card, CardType, CardRarity } from '../types/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card as UICard } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import CardComponent from './CardComponent';
import { Input } from './ui/input';
import { Grid, List, Plus, Minus, Eye, X, Info } from 'lucide-react';
import { getCardTypeIconPNG } from './IconComponentsPNG';

interface CardCollectionProps {
  onClose: () => void;
}

export const CardCollection: React.FC<CardCollectionProps> = ({ onClose }) => {
  const { playerCards, loading, error } = usePlayerCards();
  const { activeDeck, decks, updateDeck } = usePlayerDecks();
  const { settings: gameSettings } = useGameSettings();
  const { validateCompleteDeck, canAddCardToDeck } = useCardCopyLimits();
  const { showAlert } = useDialog();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<CardType | 'all'>('all');
  const [selectedRarity, setSelectedRarity] = useState<CardRarity | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCardDetails, setShowCardDetails] = useState<Card | null>(null);
  const [showDeckInfo, setShowDeckInfo] = useState<string | null>(null);
  const [isUpdatingDeck, setIsUpdatingDeck] = useState(false);

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

  // Quantas cópias de uma carta estão no deck ativo
  const getCopiesInDeck = (cardId: string): number => {
    if (!activeDeck?.card_ids) return 0;
    return activeDeck.card_ids.filter(id => id === cardId).length;
  };

  // Obter informações sobre em quais decks a carta está sendo usada
  const getDeckUsageInfo = (baseId: string) => {
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
        const copiesInDeck = getCopiesInDeck(card.id);
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
  }, [playerCards, activeDeck, decks]);

  // Filtrar cartas agrupadas
  const filteredCards = useMemo(() => {
    return groupedCards.filter(group => {
      const matchesSearch = group.card.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || group.card.type === selectedType;
      const matchesRarity = selectedRarity === 'all' || group.card.rarity === selectedRarity;
      
      return matchesSearch && matchesType && matchesRarity;
    });
  }, [groupedCards, searchTerm, selectedType, selectedRarity]);

  // Adicionar carta ao deck ativo
  const handleAddToDeck = async (baseId: string) => {
    if (!activeDeck) {
      await showAlert('Nenhum deck ativo selecionado', 'Erro', 'error');
      return;
    }

    const group = groupedCards.find(g => g.baseId === baseId);
    if (!group) return;

    if (group.copiesInDeck >= group.maxCopies) {
      await showAlert(`Limite de ${group.maxCopies} cópias atingido para esta carta`, 'Limite Atingido', 'warning');
      return;
    }

    if (group.copiesInDeck >= group.totalOwned) {
      await showAlert('Você não possui mais cópias desta carta', 'Sem Cópias', 'warning');
      return;
    }

    // Verificar se o deck não está cheio
    const maxCards = gameSettings.deckMaxCards || 40;
    if (activeDeck.card_ids && activeDeck.card_ids.length >= maxCards) {
      await showAlert(`Deck está cheio (máximo ${maxCards} cartas)`, 'Deck Cheio', 'warning');
      return;
    }

    try {
      setIsUpdatingDeck(true);
      const newCardIds = [...(activeDeck.card_ids || []), baseId];
      await updateDeck(activeDeck.id, { card_ids: newCardIds });
    } catch (err: any) {
      console.error('Erro ao adicionar carta ao deck:', err);
      await showAlert(`Erro ao adicionar carta: ${err.message}`, 'Erro', 'error');
    } finally {
      setIsUpdatingDeck(false);
    }
  };

  // Remover carta do deck ativo
  const handleRemoveFromDeck = async (baseId: string) => {
    if (!activeDeck) return;

    try {
      setIsUpdatingDeck(true);
      const newCardIds = activeDeck.card_ids?.filter(id => id !== baseId) || [];
      await updateDeck(activeDeck.id, { card_ids: newCardIds });
    } catch (err: any) {
      console.error('Erro ao remover carta do deck:', err);
      await showAlert(`Erro ao remover carta: ${err.message}`, 'Erro', 'error');
    } finally {
      setIsUpdatingDeck(false);
    }
  };

  // Ver detalhes da carta
  const showCardDetailsModal = (card: Card) => {
    setShowCardDetails(card);
  };

  // Função para obter ícone de tipo de carta
  const getTypeIcon = (type: CardType) => {
    return getCardTypeIconPNG(type, 16);
  };

  // Função para obter cor de raridade
  const getRarityColor = (rarity: CardRarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'ultra': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      case 'secret': return 'bg-red-500';
      case 'crisis': return 'bg-orange-500';
      case 'booster': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Coleção de Cartas</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Filtros */}
        <div className="mb-4 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Buscar cartas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as CardType | 'all')}
              className="px-3 py-1 border border-border rounded bg-background text-sm"
              title="Filtrar por tipo"
            >
              <option value="all">Todos os tipos</option>
              <option value="farm">Farm</option>
              <option value="city">City</option>
              <option value="landmark">Landmark</option>
              <option value="action">Action</option>
              <option value="event">Event</option>
              <option value="trap">Trap</option>
              <option value="defense">Defense</option>
              <option value="magic">Magic</option>
            </select>

            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value as CardRarity | 'all')}
              className="px-3 py-1 border border-border rounded bg-background text-sm"
              title="Filtrar por raridade"
            >
              <option value="all">Todas as raridades</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="ultra">Ultra</option>
              <option value="legendary">Legendary</option>
              <option value="secret">Secret</option>
              <option value="crisis">Crisis</option>
              <option value="booster">Booster</option>
            </select>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mb-4 p-3 bg-muted rounded">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Total de cartas:</span> {playerCards.length}
            </div>
            <div>
              <span className="font-medium">Tipos únicos:</span> {groupedCards.length}
            </div>
            <div>
              <span className="font-medium">Deck ativo:</span> {activeDeck?.name || 'Nenhum'}
            </div>
            <div>
              <span className="font-medium">Cartas no deck:</span> {activeDeck?.card_ids?.length || 0}
            </div>
          </div>
        </div>

        {/* Lista de Cartas */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto" />
            <p className="mt-2">Carregando coleção...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            <p>Erro ao carregar coleção: {error}</p>
          </div>
        ) : playerCards.length === 0 ? (
          <div className="text-center py-8">
            {/* CreditCard is not imported, assuming it's a placeholder or typo */}
            {/* <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" /> */}
            <p className="text-muted-foreground">Nenhuma carta encontrada</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              🔄 Recarregar e Criar Cartas Starter
            </Button>
          </div>
        ) : (
          <div className={`grid gap-3 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredCards.map(group => {
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
                      <Badge variant="outline" className="text-xs mt-1">
                        {group.card.rarity}
                      </Badge>
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
                        onClick={() => handleRemoveFromDeck(group.baseId)}
                        disabled={!canRemove || isUpdatingDeck}
                        className="h-6 w-6 p-0"
                        title="Remover do deck"
                      >
                        {isUpdatingDeck ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                      </Button>
                      
                      <span className="text-xs font-medium min-w-[20px] text-center">
                        {group.copiesInDeck}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToDeck(group.baseId)}
                        disabled={!canAdd || isUpdatingDeck}
                        className="h-6 w-6 p-0"
                        title="Adicionar ao deck"
                      >
                        {isUpdatingDeck ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Plus className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex justify-end gap-2 mt-4">
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