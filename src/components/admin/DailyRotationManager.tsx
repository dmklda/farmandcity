import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { supabase } from '../../integrations/supabase/client';
import { Calendar, Plus, Trash2, Save, X, Clock, Star, Zap, Crown, Castle } from 'lucide-react';

interface Card {
  id: string;
  name: string;
  type: string;
  rarity: string;
  art_url: string | null;
}

interface DailyRotationCard {
  id: string;
  card_id: string | null;
  rotation_date: string;
  price_coins: number | null;
  price_gems: number | null;
  currency_type: string;
  discount_percentage: number | null;
  is_active: boolean | null;
  created_at: string | null;
}

export const DailyRotationManager: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [dailyRotationCards, setDailyRotationCards] = useState<DailyRotationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    card_id: '',
    slot_type: 'common' as 'common' | 'rare' | 'legendary' | 'magic' | 'landmark',
    price_coins: 100,
    price_gems: 0,
    discount_percentage: 0,
    is_active: true
  });

  useEffect(() => {
    fetchCards();
    fetchDailyRotationCards();
  }, []);

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('id, name, type, rarity, art_url')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCards(data || []);
    } catch (err) {
      console.error('Erro ao buscar cartas:', err);
    }
  };

  const fetchDailyRotationCards = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_rotation_cards')
        .select('*')
        .order('rotation_date', { ascending: false });

      if (error) throw error;
      setDailyRotationCards(data || []);
    } catch (err) {
      console.error('Erro ao buscar cartas em rotação:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      card_id: '',
      slot_type: 'common',
      price_coins: 100,
      price_gems: 0,
      discount_percentage: 0,
      is_active: true
    });
  };

  const createDailyRotation = async () => {
    try {
      if (!formData.card_id) {
        alert('Selecione uma carta para a rotação diária');
        return;
      }

      const rotationData = {
        card_id: formData.card_id,
        rotation_date: selectedDate,
        price_coins: formData.price_coins,
        price_gems: formData.price_gems,
        currency_type: formData.price_gems > 0 ? 'both' : 'coins',
        discount_percentage: formData.discount_percentage,
        is_active: formData.is_active,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('daily_rotation_cards')
        .insert(rotationData);

      if (error) throw error;

      alert('Carta adicionada à rotação diária com sucesso!');
      resetForm();
      fetchDailyRotationCards();
    } catch (err: any) {
      console.error('Erro ao criar rotação diária:', err);
      alert(`Erro ao criar rotação diária: ${err.message}`);
    }
  };

  const deleteRotationCard = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta carta da rotação?')) return;

    try {
      const { error } = await supabase
        .from('daily_rotation_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Carta removida da rotação com sucesso!');
      fetchDailyRotationCards();
    } catch (err: any) {
      console.error('Erro ao excluir carta da rotação:', err);
      alert(`Erro ao excluir carta: ${err.message}`);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'ultra': return 'bg-purple-500';
      case 'secret': return 'bg-yellow-500';
      case 'legendary': return 'bg-orange-500';
      case 'crisis': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSlotIcon = (slotType: string) => {
    switch (slotType) {
      case 'common': return <Star className="h-4 w-4 text-gray-400" />;
      case 'rare': return <Star className="h-4 w-4 text-blue-400" />;
      case 'legendary': return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'magic': return <Zap className="h-4 w-4 text-purple-400" />;
      case 'landmark': return <Castle className="h-4 w-4 text-orange-400" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getSlotLabel = (slotType: string) => {
    switch (slotType) {
      case 'common': return 'Comum';
      case 'rare': return 'Rara';
      case 'legendary': return 'Lendária';
      case 'magic': return 'Magia';
      case 'landmark': return 'Landmark';
      default: return slotType;
    }
  };

  const getCardsByType = (type: string) => {
    return cards.filter(card => card.type === type);
  };

  const getCardsByRarity = (rarity: string) => {
    return cards.filter(card => card.rarity === rarity);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Rotação Diária</h2>
          <p className="text-muted-foreground">Configure o ciclo diário de cartas à venda</p>
        </div>
        <Button onClick={resetForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Carta
        </Button>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Adicionar Carta</TabsTrigger>
          <TabsTrigger value="cards">Cartas em Rotação</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Carta à Rotação Diária</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Data da Rotação *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slot_type">Tipo de Slot</Label>
                  <Select
                    value={formData.slot_type}
                    onValueChange={(value: 'common' | 'rare' | 'legendary' | 'magic' | 'landmark') => 
                      setFormData(prev => ({ ...prev, slot_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">Comum</SelectItem>
                      <SelectItem value="rare">Rara</SelectItem>
                      <SelectItem value="legendary">Lendária</SelectItem>
                      <SelectItem value="magic">Magia</SelectItem>
                      <SelectItem value="landmark">Landmark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card">Carta *</Label>
                  <Select
                    value={formData.card_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, card_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma carta" />
                    </SelectTrigger>
                    <SelectContent>
                      {cards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.name} ({card.rarity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Desconto (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_coins">Preço em Moedas</Label>
                  <Input
                    id="price_coins"
                    type="number"
                    value={formData.price_coins}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_coins: parseInt(e.target.value) || 0 }))}
                    placeholder="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_gems">Preço em Gems</Label>
                  <Input
                    id="price_gems"
                    type="number"
                    value={formData.price_gems}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_gems: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={createDailyRotation} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Adicionar à Rotação
                </Button>
                <Button variant="outline" onClick={resetForm} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cartas em Rotação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dailyRotationCards.map((rotationCard) => {
                const card = cards.find(c => c.id === rotationCard.card_id);
                return (
                  <Card key={rotationCard.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{card?.name || 'Carta não encontrada'}</CardTitle>
                        <Badge className={getRarityColor(card?.rarity || 'common')}>
                          {card?.rarity || 'Desconhecida'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(rotationCard.rotation_date).toLocaleDateString('pt-BR')}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm">
                        {rotationCard.price_coins && rotationCard.price_coins > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-600">🪙</span>
                            <span>{rotationCard.price_coins}</span>
                          </div>
                        )}
                        {rotationCard.price_gems && rotationCard.price_gems > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-purple-600">💎</span>
                            <span>{rotationCard.price_gems}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant={rotationCard.is_active ? "default" : "secondary"}>
                          {rotationCard.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                        {rotationCard.discount_percentage && rotationCard.discount_percentage > 0 && (
                          <Badge variant="outline" className="text-green-600">
                            -{rotationCard.discount_percentage}%
                          </Badge>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteRotationCard(rotationCard.id)}
                        className="w-full text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remover da Rotação
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 