import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { AdminCard, CardType, CardRarity } from '../../types/admin';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Edit, Copy, Trash2, Search, Filter, Upload, Download } from 'lucide-react';
import { CardEditor } from './CardEditor';
import { toast } from 'sonner';

interface CardManagerProps {
  onStatsUpdate: () => void;
}

export const CardManager: React.FC<CardManagerProps> = ({ onStatsUpdate }) => {
  const [cards, setCards] = useState<AdminCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<CardType | 'all'>('all');
  const [filterRarity, setFilterRarity] = useState<CardRarity | 'all'>('all');
  const [filterActive, setFilterActive] = useState<boolean | 'all'>('all');
  const [editingCard, setEditingCard] = useState<AdminCard | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards((data || []) as AdminCard[]);
      onStatsUpdate();
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.effect.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || card.type === filterType;
    const matchesRarity = filterRarity === 'all' || card.rarity === filterRarity;
    const matchesActive = filterActive === 'all' || card.is_active === filterActive;

    return matchesSearch && matchesType && matchesRarity && matchesActive;
  });

  const getRarityColor = (rarity: CardRarity) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800',
      uncommon: 'bg-green-100 text-green-800',
      rare: 'bg-blue-100 text-blue-800',
      ultra: 'bg-purple-100 text-purple-800',
      secret: 'bg-pink-100 text-pink-800',
      legendary: 'bg-yellow-100 text-yellow-800',
      crisis: 'bg-red-100 text-red-800',
      booster: 'bg-indigo-100 text-indigo-800'
    };
    return colors[rarity] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: CardType) => {
    const colors = {
      farm: 'bg-green-100 text-green-800',
      city: 'bg-blue-100 text-blue-800',
      action: 'bg-orange-100 text-orange-800',
      magic: 'bg-purple-100 text-purple-800',
      defense: 'bg-gray-100 text-gray-800',
      trap: 'bg-red-100 text-red-800',
      event: 'bg-yellow-100 text-yellow-800',
      landmark: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const handleCreateCard = () => {
    setEditingCard(null);
    setShowEditor(true);
  };

  const handleEditCard = (card: AdminCard) => {
    setEditingCard(card);
    setShowEditor(true);
  };

  const handleDuplicateCard = (card: AdminCard) => {
    setEditingCard({
      ...card,
      id: crypto.randomUUID(),
      name: `${card.name} (Cópia)`,
      slug: `${card.slug}-copy-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as AdminCard);
    setShowEditor(true);
  };

  const handleSaveCard = async (card: AdminCard) => {
    await fetchCards();
    setShowEditor(false);
    setEditingCard(null);
    toast.success('Carta salva com sucesso!');
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setEditingCard(null);
  };

  const handleDeleteCard = async (cardId: string) => {
    if (confirm('Tem certeza que deseja excluir esta carta?')) {
      try {
        const { error } = await supabase
          .from('cards')
          .delete()
          .eq('id', cardId);

        if (error) throw error;

        await fetchCards();
        toast.success('Carta excluída com sucesso!');
      } catch (error) {
        console.error('Error deleting card:', error);
        toast.error('Erro ao excluir carta');
      }
    }
  };

  const handleImportCards = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const cardsData = JSON.parse(text);
        
        if (!Array.isArray(cardsData)) {
          throw new Error('Arquivo deve conter um array de cartas');
        }

        const { data, error } = await supabase
          .from('cards')
          .insert(cardsData);

        if (error) throw error;

        await fetchCards();
        toast.success(`${cardsData.length} cartas importadas com sucesso!`);
      } catch (error) {
        console.error('Error importing cards:', error);
        toast.error('Erro ao importar cartas');
      }
    };
    input.click();
  };

  const handleExportCards = () => {
    // TODO: Implementar exportação
    const dataStr = JSON.stringify(cards, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cards-export.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Cartas exportadas com sucesso!');
  };

  if (showEditor) {
    return (
      <CardEditor
        card={editingCard}
        onSave={handleSaveCard}
        onCancel={handleCancelEdit}
        onDuplicate={handleDuplicateCard}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-white">Carregando cartas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Cartas</h2>
          <p className="text-gray-300">
            Crie, edite e gerencie todas as cartas do jogo
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleImportCards} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg border-0">
            <Upload className="h-4 w-4" />
            Importar
          </Button>
          <Button onClick={handleExportCards} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg border-0">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={handleCreateCard} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0">
            <Plus className="h-4 w-4" />
            Nova Carta
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-lg text-white">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar cartas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white placeholder-gray-400"
              />
            </div>

            {/* Type Filter */}
            <select
              title="Filtrar por tipo"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as CardType | 'all')}
              className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
            >
              <option value="all" className="bg-gray-800 text-white">Todos os Tipos</option>
              <option value="farm" className="bg-gray-800 text-white">Farm</option>
              <option value="city" className="bg-gray-800 text-white">City</option>
              <option value="action" className="bg-gray-800 text-white">Action</option>
              <option value="magic" className="bg-gray-800 text-white">Magic</option>
              <option value="defense" className="bg-gray-800 text-white">Defense</option>
              <option value="trap" className="bg-gray-800 text-white">Trap</option>
              <option value="event" className="bg-gray-800 text-white">Event</option>
              <option value="landmark" className="bg-gray-800 text-white">Landmark</option>
            </select>

            {/* Rarity Filter */}
            <select
              title="Filtrar por raridade"
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value as CardRarity | 'all')}
              className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
            >
              <option value="all" className="bg-gray-800 text-white">Todas as Raridades</option>
              <option value="common" className="bg-gray-800 text-white">Common</option>
              <option value="uncommon" className="bg-gray-800 text-white">Uncommon</option>
              <option value="rare" className="bg-gray-800 text-white">Rare</option>
              <option value="ultra" className="bg-gray-800 text-white">Ultra</option>
              <option value="secret" className="bg-gray-800 text-white">Secret</option>
              <option value="legendary" className="bg-gray-800 text-white">Legendary</option>
              <option value="crisis" className="bg-gray-800 text-white">Crisis</option>
              <option value="booster" className="bg-gray-800 text-white">Booster</option>
            </select>

            {/* Active Filter */}
            <select
              title="Filtrar por status"
              value={filterActive.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setFilterActive(value === 'all' ? 'all' : value === 'true');
              }}
              className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
            >
              <option value="all" className="bg-gray-800 text-white">Todos os Status</option>
              <option value="true" className="bg-gray-800 text-white">Ativo</option>
              <option value="false" className="bg-gray-800 text-white">Inativo</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <Card key={card.id} className="relative bg-gray-900 border-gray-700">
            <CardHeader className="pb-3 border-b border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1 text-white">{card.name}</CardTitle>
                  <p className="text-sm text-gray-400 mt-1">#{card.slug}</p>
                </div>
                <div className="flex gap-1">
                  <Button onClick={() => handleEditCard(card)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDuplicateCard(card)} className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg border-0">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDeleteCard(card.id)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg border-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 pt-6">
              {/* Type and Rarity */}
              <div className="flex gap-2">
                <Badge className={getRarityColor(card.rarity)}>
                  {card.rarity}
                </Badge>
                <Badge className={getTypeColor(card.type)}>
                  {card.type}
                </Badge>
                {!card.is_active && (
                  <Badge variant="destructive" className="bg-red-600 text-white">Inativo</Badge>
                )}
              </div>

              {/* Costs */}
              <div className="flex gap-3 text-sm text-gray-300">
                {card.cost_coins > 0 && (
                  <span className="flex items-center gap-1">
                    🪙 {card.cost_coins}
                  </span>
                )}
                {card.cost_food > 0 && (
                  <span className="flex items-center gap-1">
                    🍞 {card.cost_food}
                  </span>
                )}
                {card.cost_materials > 0 && (
                  <span className="flex items-center gap-1">
                    🔨 {card.cost_materials}
                  </span>
                )}
                {card.cost_population > 0 && (
                  <span className="flex items-center gap-1">
                    👥 {card.cost_population}
                  </span>
                )}
              </div>

              {/* Effect */}
              <p className="text-sm text-gray-300 line-clamp-3">
                {card.effect}
              </p>

              {/* Phase and Usage */}
              <div className="flex justify-between text-xs text-gray-400">
                <span>Fase: {card.phase}</span>
                <span>Uso: {card.use_per_turn}/turno</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-300">Nenhuma carta encontrada</p>
          <p className="text-sm text-gray-400 mt-2">
            Tente ajustar os filtros ou criar uma nova carta
          </p>
        </div>
      )}
    </div>
  );
};
