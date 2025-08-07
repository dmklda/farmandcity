import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign,
  Gift,
  Star,
  Eye,
  EyeOff,
  AlertTriangle,
  Coins,
  Gem
} from 'lucide-react';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { cn } from '../../lib/utils';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  item_type: 'pack' | 'booster' | 'currency' | 'customization';
  price_coins: number;
  price_gems: number;
  price_dollars: number;
  currency_type: 'coins' | 'gems' | 'both' | 'dollars';
  rarity: string;
  is_special: boolean;
  is_limited: boolean;
  stock_quantity?: number;
  sold_quantity: number;
  discount_percentage: number;
  real_discount_percentage: number;
  is_active: boolean;
  created_at: string;
}

export const ShopItemsPage: React.FC = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    item_type: 'pack' as const,
    price_coins: 0,
    price_gems: 0,
    price_dollars: 0,
    currency_type: 'coins' as const,
    rarity: 'common',
    is_special: false,
    is_limited: false,
    stock_quantity: 0,
    discount_percentage: 0,
    real_discount_percentage: 0,
    is_active: true
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching shop items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('shop_items')
          .update(formData)
          .eq('id', editingItem.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('shop_items')
          .insert([formData]);
        
        if (error) throw error;
      }

      await fetchItems();
      setShowForm(false);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Error saving shop item:', error);
    }
  };

  const handleEdit = (item: ShopItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      item_type: item.item_type,
      price_coins: item.price_coins,
      price_gems: item.price_gems,
      price_dollars: item.price_dollars,
      currency_type: item.currency_type,
      rarity: item.rarity,
      is_special: item.is_special,
      is_limited: item.is_limited,
      stock_quantity: item.stock_quantity || 0,
      discount_percentage: item.discount_percentage,
      real_discount_percentage: item.real_discount_percentage,
      is_active: item.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    
    try {
      const { error } = await supabase
        .from('shop_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await fetchItems();
    } catch (error) {
      console.error('Error deleting shop item:', error);
    }
  };

  const toggleItemStatus = async (item: ShopItem) => {
    try {
      const { error } = await supabase
        .from('shop_items')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);
      
      if (error) throw error;
      await fetchItems();
    } catch (error) {
      console.error('Error toggling item status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      item_type: 'pack',
      price_coins: 0,
      price_gems: 0,
      price_dollars: 0,
      currency_type: 'coins',
      rarity: 'common',
      is_special: false,
      is_limited: false,
      stock_quantity: 0,
      discount_percentage: 0,
      real_discount_percentage: 0,
      is_active: true
    });
  };

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'pack': return <Package className="w-4 h-4" />;
      case 'booster': return <Gift className="w-4 h-4" />;
      case 'currency': return <Coins className="w-4 h-4" />;
      case 'customization': return <Star className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'ultra': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      case 'secret': return 'bg-pink-500';
      case 'crisis': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-400">Carregando itens da loja...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 p-6 rounded-2xl border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-200 mb-2">Gerenciar Itens da Loja</h1>
            <p className="text-gray-400">Gerencie itens, preços e descontos da loja</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Item
          </Button>
        </div>
      </div>

      {/* Items List */}
      <div className="grid gap-4">
        {items.map((item) => {
          const isFakeDiscount = item.is_special && item.discount_percentage === 50 && item.real_discount_percentage < item.discount_percentage;
          
          return (
            <Card key={item.id} className="shadow-lg border-gray-700 bg-gray-800/50">
              <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-700 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getItemTypeIcon(item.item_type)}
                    <div>
                      <CardTitle className="text-gray-100 text-lg">{item.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${getRarityColor(item.rarity)} text-white border-0`}>
                          {item.rarity.toUpperCase()}
                        </Badge>
                        {item.is_special && (
                          <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0">
                            ESPECIAL
                          </Badge>
                        )}
                        
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.is_active}
                      onCheckedChange={() => toggleItemStatus(item)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="border-2 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 rounded-xl"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="border-2 border-red-500/30 text-red-400 hover:bg-red-600/20 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-gray-400 text-sm">Preço</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {item.price_coins > 0 && (
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-200">{item.price_coins}</span>
                        </div>
                      )}
                      {item.price_gems > 0 && (
                        <div className="flex items-center gap-1">
                          <Gem className="w-4 h-4 text-purple-500" />
                          <span className="text-gray-200">{item.price_gems}</span>
                        </div>
                      )}
                      {item.price_dollars > 0 && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-gray-200">${item.price_dollars}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-400 text-sm">Desconto</Label>
                    <div className="mt-1">
                                             {item.discount_percentage > 0 ? (
                         <div className="flex items-center gap-2">
                           <span className="text-green-400 font-semibold">-{item.discount_percentage}%</span>
                         </div>
                       ) : (
                         <span className="text-gray-500">Sem desconto</span>
                       )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-400 text-sm">Estoque</Label>
                    <div className="mt-1">
                      {item.is_limited ? (
                        <span className="text-orange-400">
                          {item.stock_quantity ? `${item.stock_quantity - item.sold_quantity} restantes` : 'Limitado'}
                        </span>
                      ) : (
                        <span className="text-gray-500">Ilimitado</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-400 text-sm">Status</Label>
                    <div className="mt-1">
                      <Badge className={item.is_active ? 'bg-green-600 text-white border-0' : 'bg-red-600 text-white border-0'}>
                        {item.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label className="text-gray-400 text-sm">Descrição</Label>
                  <p className="text-gray-300 text-sm mt-1">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="shadow-xl border-2 border-purple-500/30 bg-purple-900/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-700">
              <CardTitle className="text-gray-100">
                {editingItem ? 'Editar Item' : 'Novo Item'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Nome</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-gray-100"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Tipo</Label>
                    <Select
                      value={formData.item_type}
                      onValueChange={(value: any) => setFormData({ ...formData, item_type: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="pack">Pack</SelectItem>
                        <SelectItem value="booster">Booster</SelectItem>
                        <SelectItem value="currency">Moeda</SelectItem>
                        <SelectItem value="customization">Customização</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Descrição</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-gray-100"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-300">Preço (Moedas)</Label>
                    <Input
                      type="number"
                      value={formData.price_coins}
                      onChange={(e) => setFormData({ ...formData, price_coins: parseInt(e.target.value) || 0 })}
                      className="bg-gray-800 border-gray-600 text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Preço (Gemas)</Label>
                    <Input
                      type="number"
                      value={formData.price_gems}
                      onChange={(e) => setFormData({ ...formData, price_gems: parseInt(e.target.value) || 0 })}
                      className="bg-gray-800 border-gray-600 text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Preço (Dólares)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price_dollars}
                      onChange={(e) => setFormData({ ...formData, price_dollars: parseFloat(e.target.value) || 0 })}
                      className="bg-gray-800 border-gray-600 text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Raridade</Label>
                    <Select
                      value={formData.rarity}
                      onValueChange={(value) => setFormData({ ...formData, rarity: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="common">Comum</SelectItem>
                        <SelectItem value="uncommon">Incomum</SelectItem>
                        <SelectItem value="rare">Raro</SelectItem>
                        <SelectItem value="ultra">Ultra</SelectItem>
                        <SelectItem value="legendary">Lendário</SelectItem>
                        <SelectItem value="secret">Secreto</SelectItem>
                        <SelectItem value="crisis">Crise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Tipo de Moeda</Label>
                    <Select
                      value={formData.currency_type}
                      onValueChange={(value: any) => setFormData({ ...formData, currency_type: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="coins">Moedas</SelectItem>
                        <SelectItem value="gems">Gemas</SelectItem>
                        <SelectItem value="both">Ambos</SelectItem>
                        <SelectItem value="dollars">Dólares</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Desconto Visual (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount_percentage}
                      onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) || 0 })}
                      className="bg-gray-800 border-gray-600 text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Desconto Real (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.real_discount_percentage}
                      onChange={(e) => setFormData({ ...formData, real_discount_percentage: parseInt(e.target.value) || 0 })}
                      className="bg-gray-800 border-gray-600 text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Estoque Limitado</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                      className="bg-gray-800 border-gray-600 text-gray-100"
                      placeholder="0 = ilimitado"
                    />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_special}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_special: checked })}
                      />
                      <Label className="text-gray-300">Item Especial</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_limited}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_limited: checked })}
                      />
                      <Label className="text-gray-300">Limitado</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                      <Label className="text-gray-300">Ativo</Label>
                    </div>
                  </div>
                </div>

                

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                    className="border-2 border-gray-500/30 text-gray-400 hover:bg-gray-600/20 rounded-xl"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl border-0"
                  >
                    {editingItem ? 'Atualizar' : 'Criar'} Item
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
