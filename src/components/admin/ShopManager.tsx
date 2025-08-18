import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { 
  Package, 
  ShoppingCart, 
  Edit, 
  Plus, 
  Trash2, 
  Save, 
  X,
  Star,
  Crown,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '../ui/toast';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  item_type: 'pack' | 'booster' | 'card' | 'currency' | 'cosmetic' | 'event' | 'bundle';
  price_coins: number;
  price_gems: number;
  price_dollars?: number;
  currency_type: 'coins' | 'gems' | 'both' | 'dollars';
  rarity?: string;
  card_ids?: string[];
  guaranteed_cards?: any;
  is_limited: boolean;
  stock_quantity?: number;
  sold_quantity: number;
  is_active: boolean;
  discount_percentage: number;
  real_discount_percentage: number;
  is_daily_rotation: boolean;
  rotation_date?: string;
  event_id?: string;
  is_special: boolean;
  // Campos específicos para itens de moeda
  currency_amount_coins?: number;
  currency_amount_gems?: number;
  // Campos para pacotes de múltiplos itens
  bundle_type?: 'single' | 'bundle' | 'starter' | 'premium';
  included_customizations?: string[];
  included_cards_count?: number;
  bundle_contents?: any;
  created_at: string;
  updated_at: string;
}

export const ShopManager: React.FC = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ShopItem[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [customizations, setCustomizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    fetchShopItems();
    fetchCards();
    fetchCustomizations();
  }, []);

  const fetchShopItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar itens da loja:', error);
        showToast('Erro ao carregar itens da loja', 'error');
        return;
      }

      setShopItems((data || []).map(item => ({
        ...item,
        description: item.description || '',
        item_type: item.item_type as 'pack' | 'booster' | 'card' | 'currency' | 'cosmetic' | 'event' | 'bundle',
        currency_type: item.currency_type as 'coins' | 'gems' | 'both' | 'dollars',
        is_special: (item as any).is_special || false
      } as ShopItem)));
    } catch (err) {
      console.error('Erro inesperado:', err);
      showToast('Erro inesperado ao carregar itens', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('id, name, type, rarity, art_url')
        .order('name');

      if (error) {
        console.error('Erro ao buscar cartas:', error);
        return;
      }

      setCards(data || []);
    } catch (err) {
      console.error('Erro inesperado ao buscar cartas:', err);
    }
  };

  const fetchCustomizations = async () => {
    try {
      const { data, error } = await supabase
        .from('battlefield_customizations')
        .select('id, name, description, rarity')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Erro ao buscar customizações:', error);
        return;
      }

      setCustomizations(data || []);
    } catch (err) {
      console.error('Erro inesperado ao buscar customizações:', err);
    }
  };

  // Filtrar itens baseado no tipo selecionado
  useEffect(() => {
    if (filterType === 'all') {
      setFilteredItems(shopItems);
    } else {
      setFilteredItems(shopItems.filter(item => item.item_type === filterType));
    }
  }, [shopItems, filterType]);

  const handleEdit = (item: ShopItem) => {
    setEditingItem({ ...item });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingItem({
      id: '',
      name: '',
      description: '',
      item_type: 'pack',
      price_coins: 0,
      price_gems: 0,
      price_dollars: 0,
      currency_type: 'coins',
      rarity: '',
      card_ids: [],
      guaranteed_cards: {},
      is_limited: false,
      stock_quantity: 0,
      sold_quantity: 0,
      is_active: true,
      discount_percentage: 0,
      real_discount_percentage: 0,
      is_daily_rotation: false,
      rotation_date: '',
      event_id: '',
      is_special: false,
      currency_amount_coins: 0,
      currency_amount_gems: 0,
      created_at: '',
      updated_at: ''
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!editingItem) return;

    try {
      if (isCreating) {
        const { error } = await supabase
          .from('shop_items')
          .insert([editingItem]);

        if (error) {
          console.error('Erro ao criar item:', error);
          showToast('Erro ao criar item', 'error');
          return;
        }

        showToast('Item criado com sucesso!', 'success');
      } else {
        const { error } = await supabase
          .from('shop_items')
          .update(editingItem)
          .eq('id', editingItem.id);

        if (error) {
          console.error('Erro ao atualizar item:', error);
          showToast('Erro ao atualizar item', 'error');
          return;
        }

        showToast('Item atualizado com sucesso!', 'success');
      }

      setEditingItem(null);
      setIsCreating(false);
      fetchShopItems();
    } catch (err) {
      console.error('Erro inesperado:', err);
      showToast('Erro inesperado ao salvar', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir item:', error);
        showToast('Erro ao excluir item', 'error');
        return;
      }

      showToast('Item excluído com sucesso!', 'success');
      fetchShopItems();
    } catch (err) {
      console.error('Erro inesperado:', err);
      showToast('Erro inesperado ao excluir', 'error');
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsCreating(false);
  };

  // Funções para gerenciar seleção de cartas
  const toggleCardSelection = (cardId: string) => {
    if (!editingItem) return;
    
    const currentCardIds = editingItem.card_ids || [];
    const newCardIds = currentCardIds.includes(cardId)
      ? currentCardIds.filter(id => id !== cardId)
      : [...currentCardIds, cardId];
    
    setEditingItem({ ...editingItem, card_ids: newCardIds });
  };

  // Funções para gerenciar seleção de customizações
  const toggleCustomizationSelection = (customizationId: string) => {
    if (!editingItem) return;
    
    const currentCustomizations = editingItem.included_customizations || [];
    const newCustomizations = currentCustomizations.includes(customizationId)
      ? currentCustomizations.filter(id => id !== customizationId)
      : [...currentCustomizations, customizationId];
    
    setEditingItem({ ...editingItem, included_customizations: newCustomizations });
  };

  const getRarityIcon = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'common': return <Package className="w-4 h-4" />;
      case 'uncommon': return <Zap className="w-4 h-4" />;
      case 'rare': return <Star className="w-4 h-4" />;
      case 'ultra': return <Crown className="w-4 h-4" />;
      case 'legendary': return <Crown className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'ultra': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Carregando itens da loja...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciador da Loja</h2>
          <p className="text-gray-300">Gerencie itens, packs e boosters da loja</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0">
          <Plus className="w-4 h-4" />
          Novo Item
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-sm">Filtrar por tipo:</span>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all" className="text-white hover:bg-gray-700">Todos</SelectItem>
              <SelectItem value="currency" className="text-white hover:bg-gray-700">Moedas</SelectItem>
              <SelectItem value="pack" className="text-white hover:bg-gray-700">Packs</SelectItem>
              <SelectItem value="booster" className="text-white hover:bg-gray-700">Boosters</SelectItem>
              <SelectItem value="bundle" className="text-white hover:bg-gray-700">Bundles</SelectItem>
              <SelectItem value="card" className="text-white hover:bg-gray-700">Cartas</SelectItem>
              <SelectItem value="cosmetic" className="text-white hover:bg-gray-700">Cosméticos</SelectItem>
              <SelectItem value="event" className="text-white hover:bg-gray-700">Eventos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-400">
          {filteredItems.length} de {shopItems.length} itens
        </div>
      </div>

      {/* Formulário de Edição/Criação */}
      {editingItem && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="flex items-center gap-2 text-white">
              {isCreating ? <Plus className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {isCreating ? 'Criar Novo Item' : 'Editar Item'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Nome</Label>
                <Input
                  id="name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Nome do item"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <Label htmlFor="item_type" className="text-gray-300">Tipo</Label>
                <Select
                  value={editingItem.item_type}
                  onValueChange={(value: any) => setEditingItem({ ...editingItem, item_type: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="pack" className="text-white hover:bg-gray-700">Pack</SelectItem>
                    <SelectItem value="booster" className="text-white hover:bg-gray-700">Booster</SelectItem>
                    <SelectItem value="card" className="text-white hover:bg-gray-700">Card</SelectItem>
                    <SelectItem value="currency" className="text-white hover:bg-gray-700">Currency</SelectItem>
                    <SelectItem value="bundle" className="text-white hover:bg-gray-700">Bundle (Múltiplos Itens)</SelectItem>
                    <SelectItem value="cosmetic" className="text-white hover:bg-gray-700">Cosmetic</SelectItem>
                    <SelectItem value="event" className="text-white hover:bg-gray-700">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price_coins" className="text-gray-300">Preço (Moedas)</Label>
                <Input
                  id="price_coins"
                  type="number"
                  value={editingItem.price_coins}
                  onChange={(e) => setEditingItem({ ...editingItem, price_coins: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="price_gems" className="text-gray-300">Preço (Gemas)</Label>
                <Input
                  id="price_gems"
                  type="number"
                  value={editingItem.price_gems}
                  onChange={(e) => setEditingItem({ ...editingItem, price_gems: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="price_dollars" className="text-gray-300">Preço (Dólares)</Label>
                <Input
                  id="price_dollars"
                  type="number"
                  step="0.01"
                  value={editingItem.price_dollars || 0}
                  onChange={(e) => setEditingItem({ ...editingItem, price_dollars: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="rarity" className="text-gray-300">Raridade</Label>
                <Select
                  value={editingItem.rarity || ''}
                  onValueChange={(value) => setEditingItem({ ...editingItem, rarity: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Selecione a raridade" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="common" className="text-white hover:bg-gray-700">Common</SelectItem>
                    <SelectItem value="uncommon" className="text-white hover:bg-gray-700">Uncommon</SelectItem>
                    <SelectItem value="rare" className="text-white hover:bg-gray-700">Rare</SelectItem>
                    <SelectItem value="ultra" className="text-white hover:bg-gray-700">Ultra</SelectItem>
                    <SelectItem value="legendary" className="text-white hover:bg-gray-700">Legendary</SelectItem>
                    <SelectItem value="landmark" className="text-white hover:bg-gray-700">Landmark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discount" className="text-gray-300">Desconto Falso (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={editingItem.discount_percentage}
                  onChange={(e) => setEditingItem({ ...editingItem, discount_percentage: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">Desconto mostrado na loja (50% falso multiplica preço por 2)</p>
              </div>

              <div>
                <Label htmlFor="real_discount" className="text-gray-300">Desconto Real (%)</Label>
                <Input
                  id="real_discount"
                  type="number"
                  value={editingItem.real_discount_percentage || 0}
                  onChange={(e) => setEditingItem({ ...editingItem, real_discount_percentage: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">Desconto real aplicado na compra</p>
              </div>

              {/* Campos específicos para itens de moeda */}
              {editingItem.item_type === 'currency' && (
                <>
                  <div>
                    <Label htmlFor="currency_amount_coins" className="text-gray-300">Quantidade de Moedas Fornecidas</Label>
                    <Input
                      id="currency_amount_coins"
                      type="number"
                      value={editingItem.currency_amount_coins || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, currency_amount_coins: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">Quantidade de moedas que o jogador receberá</p>
                  </div>

                  <div>
                    <Label htmlFor="currency_amount_gems" className="text-gray-300">Quantidade de Gemas Fornecidas</Label>
                    <Input
                      id="currency_amount_gems"
                      type="number"
                      value={editingItem.currency_amount_gems || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, currency_amount_gems: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">Quantidade de gemas que o jogador receberá</p>
                  </div>
                </>
              )}

              {/* Campos específicos para pacotes de múltiplos itens */}
              {editingItem.item_type === 'bundle' && (
                <>
                  <div>
                    <Label htmlFor="bundle_type" className="text-gray-300">Tipo de Pacote</Label>
                    <Select
                      value={editingItem.bundle_type || 'single'}
                      onValueChange={(value: any) => setEditingItem({ ...editingItem, bundle_type: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="single" className="text-white hover:bg-gray-700">Pacote Único</SelectItem>
                        <SelectItem value="bundle" className="text-white hover:bg-gray-700">Bundle</SelectItem>
                        <SelectItem value="starter" className="text-white hover:bg-gray-700">Pacote Iniciante</SelectItem>
                        <SelectItem value="premium" className="text-white hover:bg-gray-700">Pacote Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="included_cards_count" className="text-gray-300">Quantidade de Cartas Incluídas</Label>
                    <Input
                      id="included_cards_count"
                      type="number"
                      value={editingItem.included_cards_count || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, included_cards_count: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">Quantidade de cartas que o jogador receberá</p>
                  </div>

                  <div>
                    <Label htmlFor="currency_amount_coins" className="text-gray-300">Moedas Incluídas</Label>
                    <Input
                      id="currency_amount_coins"
                      type="number"
                      value={editingItem.currency_amount_coins || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, currency_amount_coins: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">Quantidade de moedas incluídas no pacote</p>
                  </div>

                  <div>
                    <Label htmlFor="currency_amount_gems" className="text-gray-300">Gemas Incluídas</Label>
                    <Input
                      id="currency_amount_gems"
                      type="number"
                      value={editingItem.currency_amount_gems || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, currency_amount_gems: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">Quantidade de gemas incluídas no pacote</p>
                  </div>

                  <div>
                    <Label htmlFor="included_customizations" className="text-gray-300">Customizações Incluídas (IDs separados por vírgula)</Label>
                    <Input
                      id="included_customizations"
                      value={editingItem.included_customizations?.join(', ') || ''}
                      onChange={(e) => {
                        const customizations = e.target.value.split(',').map(id => id.trim()).filter(id => id);
                        setEditingItem({ ...editingItem, included_customizations: customizations });
                      }}
                      placeholder="uuid1, uuid2, uuid3"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">IDs das customizações incluídas no pacote</p>
                  </div>

                  {/* Seleção de Cartas */}
                  <div className="col-span-2">
                    <Label className="text-gray-300">Cartas Disponíveis</Label>
                    <div className="mt-2 p-4 bg-gray-800/50 rounded-lg border border-gray-600 max-h-64 overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                 {cards.map((card) => {
                           const isSelected = editingItem.card_ids?.includes(card.id) || false;
                           return (
                             <div
                               key={card.id || `card-${Math.random()}`}
                              className={`p-2 border rounded-lg cursor-pointer transition-colors ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-900/20'
                                  : 'border-gray-600 hover:border-gray-500'
                              }`}
                              onClick={() => toggleCardSelection(card.id)}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleCardSelection(card.id)}
                                  className="rounded"
                                  aria-label={`Selecionar carta ${card.name}`}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-white truncate">{card.name}</div>
                                  <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Badge variant="outline" className="text-xs">
                                      {card.type}
                                    </Badge>
                                    <Badge className={`text-xs ${getRarityColor(card.rarity)}`}>
                                      {card.rarity}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {editingItem.card_ids?.length || 0} cartas selecionadas
                    </p>
                  </div>

                  {/* Seleção de Customizações */}
                  <div className="col-span-2">
                    <Label className="text-gray-300">Customizações Disponíveis</Label>
                    <div className="mt-2 p-4 bg-gray-800/50 rounded-lg border border-gray-600 max-h-64 overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                 {customizations.map((customization) => {
                           const isSelected = editingItem.included_customizations?.includes(customization.id) || false;
                           return (
                             <div
                               key={customization.id || `customization-${Math.random()}`}
                              className={`p-2 border rounded-lg cursor-pointer transition-colors ${
                                isSelected
                                  ? 'border-green-500 bg-green-900/20'
                                  : 'border-gray-600 hover:border-gray-500'
                              }`}
                              onClick={() => toggleCustomizationSelection(customization.id)}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleCustomizationSelection(customization.id)}
                                  className="rounded"
                                  aria-label={`Selecionar customização ${customization.name}`}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-white truncate">{customization.name}</div>
                                  <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Badge className={`text-xs ${getRarityColor(customization.rarity)}`}>
                                      {customization.rarity}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {editingItem.included_customizations?.length || 0} customizações selecionadas
                    </p>
                  </div>
                </>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-300">Descrição</Label>
              <Textarea
                id="description"
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                placeholder="Descrição do item"
                rows={3}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={editingItem.is_active}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_active: checked })}
                />
                <Label htmlFor="is_active" className="text-gray-300">Ativo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_limited"
                  checked={editingItem.is_limited}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_limited: checked })}
                />
                <Label htmlFor="is_limited" className="text-gray-300">Limitado</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_special"
                  checked={editingItem.is_special}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_special: checked })}
                />
                <Label htmlFor="is_special" className="text-gray-300">Especial (aparece apenas na aba Especiais)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_daily_rotation"
                  checked={editingItem.is_daily_rotation}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_daily_rotation: checked })}
                />
                <Label htmlFor="is_daily_rotation" className="text-gray-300">Rotação Diária</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0">
                <Save className="w-4 h-4" />
                Salvar
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                <X className="w-4 h-4" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Lista de Itens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="relative bg-gray-900 border-gray-700">
            <CardHeader className="pb-3 border-b border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-white">{item.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="border-gray-600 text-gray-300">{item.item_type}</Badge>
                    {item.rarity && (
                      <Badge className={`${getRarityColor(item.rarity)} text-white`}>
                        {getRarityIcon(item.rarity)}
                        <span className="ml-1">{item.rarity}</span>
                      </Badge>
                    )}
                    {item.is_special && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Especial
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 pt-6">
              <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                {item.description || 'Sem descrição'}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Preço:</span>
                  <div className="flex items-center gap-1">
                    {item.price_coins > 0 && (
                      <span className="text-yellow-400">💰 {item.price_coins}</span>
                    )}
                    {item.price_gems > 0 && (
                      <span className="text-purple-400">💎 {item.price_gems}</span>
                    )}
                    {item.price_dollars && item.price_dollars > 0 && (
                      <span className="text-green-400">💵 ${item.price_dollars}</span>
                    )}
                  </div>
                </div>

                {/* Mostrar quantidades fornecidas para itens de moeda */}
                {item.item_type === 'currency' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Fornece:</span>
                    <div className="flex items-center gap-1">
                      {item.currency_amount_coins && item.currency_amount_coins > 0 && (
                        <span className="text-yellow-400">💰 +{item.currency_amount_coins}</span>
                      )}
                      {item.currency_amount_gems && item.currency_amount_gems > 0 && (
                        <span className="text-purple-400">💎 +{item.currency_amount_gems}</span>
                      )}
                    </div>
                  </div>
                )}
                
                {item.discount_percentage > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Desconto:</span>
                    <Badge className="bg-orange-600 text-white">
                      -{item.discount_percentage}%
                    </Badge>
                  </div>
                )}
                

                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Status:</span>
                  <Badge variant={item.is_active ? "default" : "secondary"} className={item.is_active ? "bg-green-600 text-white" : "bg-gray-600 text-white"}>
                    {item.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-lg border-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-300">
            {shopItems.length === 0 
              ? 'Nenhum item encontrado na loja' 
              : `Nenhum item do tipo "${filterType}" encontrado`
            }
          </p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}; 