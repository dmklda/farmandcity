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
  Zap
} from 'lucide-react';
import { useToast } from '../ui/toast';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  item_type: 'pack' | 'booster' | 'card' | 'currency' | 'cosmetic' | 'event';
  price_coins: number;
  price_gems: number;
  price_dollars?: number;
  currency_type: 'coins' | 'gems' | 'both';
  rarity?: string;
  card_ids?: string[];
  guaranteed_cards?: any;
  is_limited: boolean;
  stock_quantity?: number;
  sold_quantity: number;
  is_active: boolean;
  discount_percentage: number;
  is_daily_rotation: boolean;
  rotation_date?: string;
  event_id?: string;
  is_special: boolean;
  created_at: string;
  updated_at: string;
}

export const ShopManager: React.FC = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    fetchShopItems();
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
        item_type: item.item_type as 'pack' | 'booster' | 'card' | 'currency' | 'cosmetic' | 'event',
        currency_type: item.currency_type as 'coins' | 'gems' | 'both',
        is_special: (item as any).is_special || false
      } as ShopItem)));
    } catch (err) {
      console.error('Erro inesperado:', err);
      showToast('Erro inesperado ao carregar itens', 'error');
    } finally {
      setLoading(false);
    }
  };

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
      is_daily_rotation: false,
      rotation_date: '',
      event_id: '',
      is_special: false,
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
          <h2 className="text-2xl font-bold">Gerenciador da Loja</h2>
          <p className="text-muted-foreground">Gerencie itens, packs e boosters da loja</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Item
        </Button>
      </div>

      {/* Formulário de Edição/Criação */}
      {editingItem && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isCreating ? <Plus className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {isCreating ? 'Criar Novo Item' : 'Editar Item'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Nome do item"
                />
              </div>
              
              <div>
                <Label htmlFor="item_type">Tipo</Label>
                <Select
                  value={editingItem.item_type}
                  onValueChange={(value: any) => setEditingItem({ ...editingItem, item_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pack">Pack</SelectItem>
                    <SelectItem value="booster">Booster</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="currency">Currency</SelectItem>
                    <SelectItem value="cosmetic">Cosmetic</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price_coins">Preço (Moedas)</Label>
                <Input
                  id="price_coins"
                  type="number"
                  value={editingItem.price_coins}
                  onChange={(e) => setEditingItem({ ...editingItem, price_coins: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="price_gems">Preço (Gemas)</Label>
                <Input
                  id="price_gems"
                  type="number"
                  value={editingItem.price_gems}
                  onChange={(e) => setEditingItem({ ...editingItem, price_gems: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="price_dollars">Preço (Dólares)</Label>
                <Input
                  id="price_dollars"
                  type="number"
                  step="0.01"
                  value={editingItem.price_dollars || 0}
                  onChange={(e) => setEditingItem({ ...editingItem, price_dollars: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="rarity">Raridade</Label>
                <Select
                  value={editingItem.rarity || ''}
                  onValueChange={(value) => setEditingItem({ ...editingItem, rarity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a raridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="uncommon">Uncommon</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                    <SelectItem value="landmark">Landmark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discount">Desconto (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={editingItem.discount_percentage}
                  onChange={(e) => setEditingItem({ ...editingItem, discount_percentage: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                placeholder="Descrição do item"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={editingItem.is_active}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_active: checked })}
                />
                <Label htmlFor="is_active">Ativo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_limited"
                  checked={editingItem.is_limited}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_limited: checked })}
                />
                <Label htmlFor="is_limited">Limitado</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_special"
                  checked={editingItem.is_special}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_special: checked })}
                />
                <Label htmlFor="is_special">Especial (aparece apenas na aba Especiais)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_daily_rotation"
                  checked={editingItem.is_daily_rotation}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_daily_rotation: checked })}
                />
                <Label htmlFor="is_daily_rotation">Rotação Diária</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Salvar
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
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
        {shopItems.map((item) => (
          <Card key={item.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{item.item_type}</Badge>
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
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {item.description || 'Sem descrição'}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Preço:</span>
                  <div className="flex items-center gap-1">
                    {item.price_coins > 0 && (
                      <span className="text-yellow-600">💰 {item.price_coins}</span>
                    )}
                    {item.price_gems > 0 && (
                      <span className="text-purple-600">💎 {item.price_gems}</span>
                    )}
                  </div>
                </div>
                
                {item.discount_percentage > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Desconto:</span>
                    <Badge className="bg-green-500 text-white">
                      -{item.discount_percentage}%
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span>Status:</span>
                  <Badge variant={item.is_active ? "default" : "secondary"}>
                    {item.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {shopItems.length === 0 && (
        <div className="text-center py-8">
          <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum item encontrado na loja</p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}; 