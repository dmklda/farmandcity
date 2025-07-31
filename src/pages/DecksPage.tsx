import React, { useState, useEffect } from 'react';
import { Card } from '../types/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card as UICard } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { CardMiniature } from '../components/CardMiniature';
import { CardDetailModal } from '../components/EnhancedHand';
import { usePlayerCards } from '../hooks/usePlayerCards';
import { usePlayerDecks } from '../hooks/usePlayerDecks';
import { Plus, Minus, Info, Crown, Shield, Sword, Zap, Star, X, Save, Trash2, Plus as PlusIcon, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const DecksPage: React.FC = () => {
  const { playerCards, loading } = usePlayerCards();
  const { decks, createDeck, updateDeck, deleteDeck, setActiveDeckById } = usePlayerDecks();
  const { setCurrentView } = useAppContext();
  
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [deckName, setDeckName] = useState('Novo Deck');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState<Card | null>(null);
  const [showDeckInfo, setShowDeckInfo] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getMaxCopiesByRarity = (rarity: string, cardType?: string): number => {
    // Cartas Landmark são especiais - máximo 1 por deck independente da raridade
    if (cardType === 'landmark') {
      return 1;
    }
    
    switch (rarity) {
      case 'common': return 4;      // Cartas comuns: máximo 4 cópias por deck
      case 'uncommon': return 3;    // Cartas incomuns: máximo 3 cópias por deck
      case 'rare': return 2;        // Cartas raras: máximo 2 cópias por deck
      case 'ultra': return 2;       // Cartas ultra raras: máximo 2 cópias por deck
      case 'secret': return 1;      // Cartas secretas: máximo 1 cópia por deck
      case 'legendary': return 1;   // Cartas lendárias: máximo 1 cópia por deck
      case 'crisis': return 1;      // Cartas de crise: máximo 1 cópia por deck
      case 'booster': return 1;     // Cartas booster: máximo 1 cópia por deck
      default: return 1;
    }
  };

  const getCopiesInDeck = (cardId: string, deckId?: string): number => {
    const targetDeckId = deckId || selectedDeck;
    if (!targetDeckId) return 0;
    const deck = decks.find(d => d.id === targetDeckId);
    return deck ? deck.card_ids.filter(id => id === cardId).length : 0;
  };

  const getCopiesInSelectedCards = (cardId: string): number => {
    return selectedCards.filter(id => id === cardId).length;
  };

  const getTotalOwned = (cardId: string): number => {
    return playerCards.filter(c => c.id === cardId).length;
  };

  const getDeckUsageInfo = (baseId: string) => {
    return decks.map(deck => {
      const count = deck.card_ids.filter(id => id === baseId).length;
      return {
        deckName: deck.name,
        count,
        isActive: deck.is_active,
        deckId: deck.id
      };
    }).filter(usage => usage.count > 0);
  };

  const addCardCopy = (baseId: string) => {
    if (!selectedDeck) return;
    
    const group = groupedCards.find(g => g.baseId === baseId);
    if (!group) return;
    
    const currentCopies = getCopiesInSelectedCards(group.card.id);
    if (currentCopies >= group.maxCopies) return;
    
    // Verificar se o jogador possui cópias suficientes
    if (currentCopies >= group.totalOwned) return;
    
    setSelectedCards(prev => [...prev, group.card.id]);
  };

  const removeCardCopy = (baseId: string) => {
    if (!selectedDeck) return;
    
    const group = groupedCards.find(g => g.baseId === baseId);
    if (!group) return;
    
    const index = selectedCards.findIndex(id => id === group.card.id);
    if (index === -1) return;
    
    setSelectedCards(prev => prev.filter((_, i) => i !== index));
  };

  const showCardDetailsModal = (card: Card) => {
    setShowCardDetails(card);
  };

  const handleSaveDeck = async () => {
    setErrorMsg(null);
    if (!deckName.trim()) return;
    
    try {
      setIsProcessing(true);
      console.log('🃏 DecksPage: Tentando salvar deck...', { deckName, selectedCards: selectedCards.length, selectedDeck });
      
      if (selectedDeck) {
        await updateDeck(selectedDeck, {
          name: deckName,
          card_ids: selectedCards
        });
                  console.log('🃏 DecksPage: Deck atualizado com sucesso');
      } else {
                  console.log('🃏 DecksPage: Criando novo deck...');
        const newDeck = await createDeck(deckName, selectedCards);
                  console.log('🃏 DecksPage: Resposta do createDeck:', newDeck);
        
        if (!newDeck || !newDeck.id) {
          const errorMsg = 'Erro ao criar deck. Resposta inválida do servidor.';
          console.error('🃏 DecksPage: Erro - resposta inválida:', newDeck);
          setErrorMsg(errorMsg);
          return;
        }
                    console.log('🃏 DecksPage: Novo deck criado com sucesso:', newDeck.id);
        setSelectedDeck(newDeck.id);
      }
    } catch (err: any) {
      const errorMsg = 'Erro ao salvar deck: ' + (err?.message || err);
      console.error('🃏 DecksPage: Erro ao salvar deck:', err);
      setErrorMsg(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteDeck = async () => {
    if (!selectedDeck) return;
    
    try {
      setIsProcessing(true);
      await deleteDeck(selectedDeck);
      setSelectedDeck(null);
      setDeckName('Novo Deck');
      setSelectedCards([]);
    } catch (err: any) {
      console.error('Error deleting deck:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleActivateDeck = async (deckId: string) => {
    try {
      setIsProcessing(true);
      await setActiveDeckById(deckId);
    } catch (err: any) {
      console.error('Error activating deck:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Agrupar cartas por ID base
  const groupedCards = React.useMemo(() => {
    const groups: Record<string, {
      baseId: string;
      card: Card;
      totalOwned: number;
      copiesInDeck: number;
      copiesInSelectedCards: number;
      maxCopies: number;
      deckUsage: Array<{ deckName: string; count: number; isActive: boolean; deckId: string }>;
    }> = {};

    playerCards.forEach(card => {
      const baseId = card.id;
      if (!groups[baseId]) {
        groups[baseId] = {
          baseId,
          card,
          totalOwned: 0,
          copiesInDeck: 0,
          copiesInSelectedCards: 0,
          maxCopies: getMaxCopiesByRarity(card.rarity, card.type),
          deckUsage: getDeckUsageInfo(baseId)
        };
      }
      groups[baseId].totalOwned++;
    });

    // Contar cópias em decks e no deck selecionado
    Object.values(groups).forEach(group => {
      group.copiesInDeck = getCopiesInDeck(group.card.id);
      group.copiesInSelectedCards = getCopiesInSelectedCards(group.card.id);
    });

    return Object.values(groups);
  }, [playerCards, selectedDeck, decks, selectedCards]);

  const filteredCards = React.useMemo(() => {
    return groupedCards.filter(group => {
      const matchesType = filterType === 'all' || group.card.type === filterType;
      const matchesSearch = searchTerm === '' || group.card.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [groupedCards, filterType, searchTerm]);

  // Carregar deck selecionado
  useEffect(() => {
    if (selectedDeck) {
      const deck = decks.find(d => d.id === selectedDeck);
      if (deck) {
        setDeckName(deck.name);
        setSelectedCards(deck.card_ids);
      }
    } else {
      setDeckName('Novo Deck');
      setSelectedCards([]);
    }
  }, [selectedDeck, decks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-yellow-600/20 rounded w-64"></div>
          <div className="h-4 bg-yellow-600/20 rounded w-32"></div>
          <div className="grid grid-cols-4 gap-4">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-yellow-600/20 rounded border border-yellow-600/30"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      {/* Header Medieval */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-b border-yellow-600/30 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
              <Button
              variant="outline"
                onClick={() => setCurrentView('home')}
              className="border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20"
              >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Menu Principal
              </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-yellow-400" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Gerenciador de Decks
                </h1>
                <Shield className="w-8 h-8 text-yellow-400" />
              </div>
              <Badge variant="outline" className="border-yellow-600/50 text-yellow-400">
                {decks.length} Decks
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Deck Selection */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-800/50 border border-yellow-600/30 rounded-lg p-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Seus Decks
              </h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <Button
                  variant="outline"
                  onClick={() => setSelectedDeck(null)}
                  className={`w-full justify-start border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20 ${
                    !selectedDeck ? 'bg-yellow-600/20' : ''
                  }`}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Criar Novo Deck
                </Button>
                
                {decks.map(deck => (
                  <Button
                    key={deck.id}
                    variant="outline"
                    onClick={() => setSelectedDeck(deck.id)}
                    className={`w-full justify-start border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20 ${
                      selectedDeck === deck.id ? 'bg-yellow-600/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate">{deck.name}</span>
                      <Badge variant="secondary" className="ml-2 bg-yellow-600/20 text-yellow-400">
                        {deck.card_ids.length}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Deck Info */}
            {selectedDeck && (
              <div className="bg-slate-800/50 border border-yellow-600/30 rounded-lg p-4">
                <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Informações do Deck
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cartas:</span>
                    <span className="text-yellow-400 font-bold">{selectedCards.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    {decks.find(d => d.id === selectedDeck)?.is_active ? (
                      <Badge variant="outline" className="border-green-600/50 text-green-400">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-gray-600/50 text-gray-400">
                        Inativo
                      </Badge>
                    )}
                  </div>
                </div>
                
                {!decks.find(d => d.id === selectedDeck)?.is_active && (
                  <Button
                    onClick={() => handleActivateDeck(selectedDeck)}
                    disabled={isProcessing}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold"
                  >
                    {isProcessing ? 'Ativando...' : 'Ativar Deck'}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Deck Builder */}
          <div className="lg:col-span-2 space-y-4">
            {errorMsg && (
              <div className="mb-2 p-2 bg-red-900/80 text-red-300 rounded border border-red-600 text-sm">
                {errorMsg}
              </div>
            )}
            {/* Deck Name Input */}
            <div className="bg-slate-800/50 border border-yellow-600/30 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    placeholder="Nome do deck..."
                    className="bg-slate-700/50 border-yellow-600/30 text-yellow-400 placeholder:text-gray-500"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveDeck}
                    disabled={!deckName.trim() || isProcessing}
                    className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {selectedDeck ? 'Atualizar' : 'Criar'}
                  </Button>
                  
                  {selectedDeck && (
                    <Button
                      onClick={handleDeleteDeck}
                      variant="destructive"
                      disabled={isProcessing}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Cards Selection */}
            <div className="bg-slate-800/50 border border-yellow-600/30 rounded-lg p-4">
              <div className="flex flex-col md:flex-row gap-2 mb-4 items-center">
                <div className="flex gap-2 w-full md:w-auto">
                  <select
                    title="Filtrar por tipo"
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-slate-900 text-yellow-300 border-yellow-600/50"
                  >
                    <option value="all">Todos os Tipos</option>
                    <option value="farm">Fazenda</option>
                    <option value="city">Cidade</option>
                    <option value="action">Ação</option>
                    <option value="magic">Mágica</option>
                    <option value="defense">Defesa</option>
                    <option value="trap">Armadilha</option>
                    <option value="event">Evento</option>
                    <option value="landmark">Marco</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Buscar por nome..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-slate-900 text-yellow-300 border-yellow-600/50"
                  />
                  <Button
                    onClick={() => setSearchTerm(searchInput)}
                    className="bg-yellow-600/80 text-yellow-100 hover:bg-yellow-600"
                  >
                    Pesquisar
                  </Button>
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      onClick={() => { setSearchInput(''); setSearchTerm(''); }}
                      className="text-yellow-400 border border-yellow-600/50"
                    >
                      Limpar
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
                  <Sword className="w-5 h-5" />
                  Cartas Disponíveis ({filteredCards.length})
                </h3>
                <Badge variant="outline" className="border-yellow-600/50 text-yellow-400">
                  {selectedCards.length} Selecionadas
                </Badge>
              </div>
              
              {playerCards.length === 0 ? (
                <div className="text-center py-8 text-yellow-400 border border-yellow-600/30 rounded">
                  <p>Nenhuma carta disponível.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
                  {filteredCards.map(group => {
                    const canAdd = group.copiesInSelectedCards < group.maxCopies;
                    const canRemove = group.copiesInSelectedCards > 0;
                    const hasDeckUsage = group.deckUsage.length > 0;
                    
                    return (
                      <div
                        key={group.baseId}
                        className={`
                          relative overflow-hidden cursor-pointer transition-all duration-300 transform
                          bg-gradient-to-br from-slate-800 to-slate-900 border-2 rounded-lg
                          hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20
                          ${group.copiesInSelectedCards > 0
                            ? 'border-yellow-400 bg-yellow-600/10'
                            : 'border-yellow-600/30 hover:border-yellow-400/50'
                          }
                        `}
                      >
                        {/* Decorative corners */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-yellow-400"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-yellow-400"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-yellow-400"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-yellow-400"></div>

                        <div className="p-2">
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <CardMiniature
                                  card={group.card}
                                  size="small"
                                  showInfo={true}
                                  onShowDetail={() => showCardDetailsModal(group.card)}
                                  showPlayableIndicator={false}
                                />
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setShowDeckInfo(showDeckInfo === group.baseId ? null : group.baseId)}
                                  className="h-5 w-5 p-0 bg-black/30 hover:bg-black/50 border border-yellow-600/30"
                                  title="Ver uso em decks"
                                >
                                  <Info className="h-2.5 w-2.5 text-yellow-400" />
                                </Button>
                              </div>
                            </div>
                          
                            {/* Informações de uso em decks */}
                            {showDeckInfo === group.baseId && (
                              <div className="p-2 bg-black/30 rounded border border-yellow-600/30 text-xs">
                                <div className="font-medium mb-1 text-yellow-400">Usada em:</div>
                                {group.deckUsage.length > 0 ? (
                                  group.deckUsage.map((usage, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                      <span className={usage.isActive ? 'text-yellow-400 font-medium' : 'text-gray-400'}>
                                        {usage.deckName}
                                      </span>
                                      <span className="text-gray-400">
                                        {usage.count} {usage.count === 1 ? 'cópia' : 'cópias'}
                                      </span>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-gray-400">Não usada em outros decks</span>
                                )}
                              </div>
                            )}
                          
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-yellow-400">
                                <div>{group.copiesInSelectedCards}/{group.maxCopies} no Deck</div>
                                <div className="text-gray-400">
                                  {group.totalOwned} possuídas
                                  {group.card.type === 'landmark' && (
                                    <span className="text-purple-400 ml-1"> • Landmark: Máx 1</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeCardCopy(group.baseId)}
                                  disabled={!canRemove || isProcessing}
                                  className="h-5 w-5 p-0 border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20"
                                  title="Remover do deck"
                                >
                                  <Minus className="h-2.5 w-2.5" />
                                </Button>
                                
                                <span className="text-xs font-medium min-w-[16px] text-center text-yellow-400">
                                  {group.copiesInSelectedCards}
                                </span>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addCardCopy(group.baseId)}
                                  disabled={!canAdd || isProcessing}
                                  className="h-5 w-5 p-0 border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20"
                                  title="Adicionar ao deck"
                                >
                                  <Plus className="h-2.5 w-2.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes da Carta */}
      <CardDetailModal
        card={showCardDetails}
        isOpen={!!showCardDetails}
        onClose={() => setShowCardDetails(null)}
      />
    </div>
  );
};

export default DecksPage; 
