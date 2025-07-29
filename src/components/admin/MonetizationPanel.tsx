import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

interface MonetizationPanelProps {
  onStatsUpdate: () => void;
}

export const MonetizationPanel: React.FC<MonetizationPanelProps> = ({ onStatsUpdate }) => {
  const [packs, setPacks] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPackModal, setShowPackModal] = useState(false);
  const [editingPack, setEditingPack] = useState<any>(null);
  const [packForm, setPackForm] = useState({
    name: '',
    description: '',
    price_coins: 100,
    cards_count: 5,
    guaranteed_rarity: '',
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch booster packs
      const { data: packsData, error: packsError } = await supabase
        .from('booster_packs')
        .select('*')
        .order('created_at', { ascending: false });

      if (packsError) throw packsError;

      // Fetch recent purchases
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('pack_purchases')
        .select(`
          *,
          booster_packs (name, price_coins),
          profiles (display_name)
        `)
        .order('purchased_at', { ascending: false })
        .limit(10);

      if (purchasesError) throw purchasesError;

      setPacks(packsData || []);
      setPurchases(purchasesData || []);
      onStatsUpdate();
    } catch (error) {
      console.error('Error fetching monetization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePack = async () => {
    try {
      const { error } = await supabase
        .from('booster_packs')
        .insert([packForm]);

      if (error) throw error;

      toast.success('Pacote criado com sucesso!');
      setShowPackModal(false);
      setPackForm({
        name: '',
        description: '',
        price_coins: 100,
        cards_count: 5,
        guaranteed_rarity: '',
        is_active: true
      });
      fetchData();
    } catch (error) {
      console.error('Error creating pack:', error);
      toast.error('Erro ao criar pacote');
    }
  };

  const handleUpdatePack = async () => {
    try {
      const { error } = await supabase
        .from('booster_packs')
        .update(packForm)
        .eq('id', editingPack.id);

      if (error) throw error;

      toast.success('Pacote atualizado com sucesso!');
      setShowPackModal(false);
      setEditingPack(null);
      setPackForm({
        name: '',
        description: '',
        price_coins: 100,
        cards_count: 5,
        guaranteed_rarity: '',
        is_active: true
      });
      fetchData();
    } catch (error) {
      console.error('Error updating pack:', error);
      toast.error('Erro ao atualizar pacote');
    }
  };

  const handleEditPack = (pack: any) => {
    setEditingPack(pack);
    setPackForm({
      name: pack.name,
      description: pack.description || '',
      price_coins: pack.price_coins,
      cards_count: pack.cards_count,
      guaranteed_rarity: pack.guaranteed_rarity || '',
      is_active: pack.is_active
    });
    setShowPackModal(true);
  };

  const handleDeletePack = async (packId: string) => {
    if (!confirm('Tem certeza que deseja excluir este pacote?')) return;

    try {
      const { error } = await supabase
        .from('booster_packs')
        .delete()
        .eq('id', packId);

      if (error) throw error;

      toast.success('Pacote excluído com sucesso!');
      fetchData();
    } catch (error) {
      console.error('Error deleting pack:', error);
      toast.error('Erro ao excluir pacote');
    }
  };

  if (loading) {
    return <div className="text-center p-8">Carregando dados de monetização...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Painel de Monetização</h2>
          <p className="text-muted-foreground">Gerencie pacotes booster e vendas</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => {
            setEditingPack(null);
            setShowPackModal(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Novo Pacote
        </Button>
      </div>

      {/* Booster Packs */}
      <Card>
        <CardHeader>
          <CardTitle>Pacotes Booster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packs.map((pack) => (
              <Card key={pack.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{pack.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pack.description || 'Sem descrição'}
                      </p>
                    </div>
                    {!pack.is_active && (
                      <Badge variant="destructive">Inativo</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Preço:</span>
                    <span className="font-semibold">🪙 {pack.price_coins}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cartas:</span>
                    <span>{pack.cards_count}</span>
                  </div>
                  {pack.guaranteed_rarity && (
                    <div className="flex justify-between text-sm">
                      <span>Raridade Garantida:</span>
                      <Badge variant="secondary">{pack.guaranteed_rarity}</Badge>
                    </div>
                  )}
                  <div className="pt-2 border-t flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditPack(pack)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeletePack(pack.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Purchases */}
      <Card>
        <CardHeader>
          <CardTitle>Compras Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium">
                      {purchase.profiles?.display_name || 'Usuário Anônimo'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {purchase.booster_packs?.name || 'Pacote Desconhecido'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">🪙 {purchase.booster_packs?.price_coins || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(purchase.purchased_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {purchases.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">Nenhuma compra realizada ainda</p>
        </div>
      )}

      {/* Pack Modal */}
      {showPackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingPack ? 'Editar Pacote' : 'Novo Pacote'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Pacote</Label>
                <Input
                  id="name"
                  value={packForm.name}
                  onChange={(e) => setPackForm({...packForm, name: e.target.value})}
                  placeholder="Ex: Pacote Lendário"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={packForm.description}
                  onChange={(e) => setPackForm({...packForm, description: e.target.value})}
                  placeholder="Descrição do pacote..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço (Moedas)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={packForm.price_coins}
                    onChange={(e) => setPackForm({...packForm, price_coins: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="cards">Número de Cartas</Label>
                  <Input
                    id="cards"
                    type="number"
                    value={packForm.cards_count}
                    onChange={(e) => setPackForm({...packForm, cards_count: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="rarity">Raridade Garantida (Opcional)</Label>
                <Select 
                  value={packForm.guaranteed_rarity} 
                  onValueChange={(value) => setPackForm({...packForm, guaranteed_rarity: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma raridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma</SelectItem>
                    <SelectItem value="common">Comum</SelectItem>
                    <SelectItem value="uncommon">Incomum</SelectItem>
                    <SelectItem value="rare">Raro</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                    <SelectItem value="legendary">Lendário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={packForm.is_active}
                  onCheckedChange={(checked) => setPackForm({...packForm, is_active: checked})}
                />
                <Label htmlFor="active">Pacote Ativo</Label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button 
                onClick={editingPack ? handleUpdatePack : handleCreatePack}
                className="flex-1"
              >
                {editingPack ? 'Atualizar' : 'Criar'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowPackModal(false);
                  setEditingPack(null);
                  setPackForm({
                    name: '',
                    description: '',
                    price_coins: 100,
                    cards_count: 5,
                    guaranteed_rarity: '',
                    is_active: true
                  });
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};