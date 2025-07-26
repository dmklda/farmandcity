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
  EyeOff
} from 'lucide-react';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { cn } from '../../lib/utils';

interface BoosterPack {
  id: string;
  name: string;
  description: string;
  price_coins: number;
  cards_count: number;
  guaranteed_rarity: string | null;
  is_active: boolean;
  created_at: string;
}

export const BoosterPacksPage: React.FC = () => {
  const [packs, setPacks] = useState<BoosterPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPack, setEditingPack] = useState<BoosterPack | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_coins: 0,
    cards_count: 5,
    guaranteed_rarity: 'none',
    is_active: true
  });

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    try {
      const { data, error } = await supabase
        .from('booster_packs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPacks((data || []).map(pack => ({
        ...pack,
        description: pack.description || '',
        cards_count: pack.cards_count || 5,
        guaranteed_rarity: pack.guaranteed_rarity || null,
        is_active: pack.is_active !== false,
        created_at: pack.created_at || new Date().toISOString()
      })));
    } catch (error) {
      console.error('Error fetching packs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPack) {
        const { error } = await supabase
          .from('booster_packs')
          .update({
            ...formData,
            guaranteed_rarity: formData.guaranteed_rarity === 'none' ? null : (formData.guaranteed_rarity as any) || null
          })
          .eq('id', editingPack.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('booster_packs')
          .insert([{
            ...formData,
            guaranteed_rarity: formData.guaranteed_rarity === 'none' ? null : (formData.guaranteed_rarity as any) || null
          }]);
        
        if (error) throw error;
      }

      await fetchPacks();
      setShowForm(false);
      setEditingPack(null);
      setFormData({
        name: '',
        description: '',
        price_coins: 0,
        cards_count: 5,
        guaranteed_rarity: 'none',
        is_active: true
      });
    } catch (error) {
      console.error('Error saving pack:', error);
    }
  };

  const handleEdit = (pack: BoosterPack) => {
    setEditingPack(pack);
    setFormData({
      name: pack.name,
      description: pack.description || '',
      price_coins: pack.price_coins,
      cards_count: pack.cards_count,
      guaranteed_rarity: pack.guaranteed_rarity || 'none',
      is_active: pack.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este pacote?')) return;
    
    try {
      const { error } = await supabase
        .from('booster_packs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await fetchPacks();
    } catch (error) {
      console.error('Error deleting pack:', error);
    }
  };

  const togglePackStatus = async (pack: BoosterPack) => {
    try {
      const { error } = await supabase
        .from('booster_packs')
        .update({ is_active: !pack.is_active })
        .eq('id', pack.id);
      
      if (error) throw error;
      await fetchPacks();
    } catch (error) {
      console.error('Error updating pack status:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Booster Packs</h1>
            <p className="text-muted-foreground">Gerenciar pacotes de cartas</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando pacotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Booster Packs</h1>
          <p className="text-muted-foreground">Gerenciar pacotes de cartas disponíveis na loja</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Pacote
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>{editingPack ? 'Editar Pacote' : 'Novo Pacote'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Pacote</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Preço (Moedas)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price_coins}
                    onChange={(e) => setFormData({ ...formData, price_coins: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cards_count">Número de Cartas</Label>
                  <Input
                    id="cards_count"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.cards_count}
                    onChange={(e) => setFormData({ ...formData, cards_count: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="guaranteed_rarity">Raridade Garantida</Label>
                  <Select 
                    value={formData.guaranteed_rarity} 
                    onValueChange={(value) => setFormData({ ...formData, guaranteed_rarity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma raridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      <SelectItem value="common">Comum</SelectItem>
                      <SelectItem value="uncommon">Incomum</SelectItem>
                      <SelectItem value="rare">Rara</SelectItem>
                      <SelectItem value="ultra">Ultra</SelectItem>
                      <SelectItem value="legendary">Lendária</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Pacote Ativo</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingPack ? 'Atualizar' : 'Criar'} Pacote
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingPack(null);
                    setFormData({
                      name: '',
                      description: '',
                      price_coins: 0,
                      cards_count: 5,
                      guaranteed_rarity: 'none',
                      is_active: true
                    });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packs.map((pack) => (
          <Card key={pack.id} className={cn("relative", !pack.is_active && "opacity-60")}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {pack.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={pack.is_active ? "default" : "secondary"}>
                      {pack.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                    {pack.guaranteed_rarity && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {pack.guaranteed_rarity}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePackStatus(pack)}
                  className="p-1"
                >
                  {pack.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pack.description && (
                  <p className="text-sm text-muted-foreground">{pack.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">{pack.price_coins} moedas</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Gift className="h-4 w-4 text-blue-600" />
                    <span>{pack.cards_count} cartas</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(pack)}
                    className="flex items-center gap-1 flex-1"
                  >
                    <Edit className="h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(pack.id)}
                    className="flex items-center gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                    Deletar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum pacote encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro pacote de cartas para começar.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Pacote
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};