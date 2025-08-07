import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { supabase } from '../../integrations/supabase/client';
import { usePackOpening } from '../../hooks/usePackOpening';
import { Plus, Trash2, Edit, Save, X, Package, Zap, Star, Crown, Play, RefreshCw } from 'lucide-react';

interface Card {
  id: string;
  name: string;
  type: string;
  rarity: string;
  art_url: string | null;
}

interface Pack {
  id: string;
  name: string;
  description: string | null;
  item_type: string;
  price_coins: number | null;
  price_gems: number | null;
  currency_type: string;
  rarity: string | null;
  card_ids: string[] | null;
  guaranteed_cards: any;
  is_limited: boolean | null;
  stock_quantity: number | null;
  sold_quantity: number | null;
  is_active: boolean | null;
  discount_percentage: number | null;
  real_discount_percentage: number | null;
  is_daily_rotation: boolean | null;
  rotation_date: string | null;
  event_id: string | null;
  pack_type: string | null;
  pack_conditions: any;
  max_purchases_per_user: number | null;
  purchase_time_limit: string | null;
  cards_per_pack: number | null;
  is_special: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export const PackManager: React.FC = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [testResults, setTestResults] = useState<any[]>([]);
  const { openPack, loading: openingPack, error: openingError } = usePackOpening();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    item_type: 'pack' as 'pack' | 'booster',
    price_coins: 0,
    price_gems: 0,
    currency_type: 'coins' as 'coins' | 'gems' | 'both',
    rarity: 'common',
    card_ids: [] as string[],
    card_quantities: {} as Record<string, number>,
    guaranteed_cards: {},
    is_limited: false,
    stock_quantity: 0,
    is_active: true,
    discount_percentage: 0,
    real_discount_percentage: 0,
    is_daily_rotation: false,
    event_id: undefined as string | undefined,
    pack_type: 'unrestricted' as 'unrestricted' | 'random' | 'conditional' | 'unlimited',
    pack_conditions: {} as Record<string, number>,
    max_purchases_per_user: null as number | null,
    purchase_time_limit: null as string | null,
    cards_per_pack: null as number | null,
    is_special: false
  });

  // Estados para filtros de cartas
  const [cardFilters, setCardFilters] = useState({
    type: 'all' as string,
    rarity: 'all' as string
  });

  // Debug: Log formData changes
  useEffect(() => {
    // // console.log('FormData atualizado:', formData);
  }, [formData]);

  // Debug: Log activeTab and editingPack changes
  useEffect(() => {
    // // console.log('ActiveTab mudou para:', activeTab);
          // // console.log('EditingPack:', editingPack);
  }, [activeTab, editingPack]);

  useEffect(() => {
    fetchPacks();
    fetchCards();
  }, []);

  const fetchPacks = async () => {
    try {
      // // console.log('Buscando packs...');
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .in('item_type', ['pack', 'booster'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      // // console.log('Packs encontrados:', data);
      setPacks((data as Pack[]) || []);
    } catch (err) {
      console.error('Erro ao buscar packs:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      item_type: 'pack',
      price_coins: 0,
      price_gems: 0,
      currency_type: 'coins',
      rarity: 'common',
      card_ids: [],
      card_quantities: {},
      guaranteed_cards: {},
      is_limited: false,
      stock_quantity: 0,
      is_active: true,
      discount_percentage: 0,
      real_discount_percentage: 0,
      is_daily_rotation: false,
      event_id: undefined,
      pack_type: 'unrestricted',
      pack_conditions: {},
      max_purchases_per_user: null,
      purchase_time_limit: null,
      cards_per_pack: null,
      is_special: false
    });
    setCardFilters({
      type: 'all',
      rarity: 'all'
    });
    setEditingPack(null);
    setActiveTab('form');
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.description) {
        alert('Preencha todos os campos obrigatórios');
        return;
      }

      if (formData.card_ids.length === 0) {
        alert('Selecione pelo menos uma carta para o pack');
        return;
      }

      const packData = {
        name: formData.name,
        description: formData.description,
        item_type: formData.item_type,
        price_coins: formData.price_coins,
        price_gems: formData.price_gems,
        currency_type: formData.currency_type,
        rarity: formData.rarity,
        card_ids: formData.card_ids,
        guaranteed_cards: formData.guaranteed_cards,
        is_limited: formData.is_limited,
        stock_quantity: formData.is_limited ? formData.stock_quantity : null,
        sold_quantity: editingPack ? editingPack.sold_quantity : 0,
        is_active: formData.is_active,
        discount_percentage: formData.discount_percentage,
        real_discount_percentage: formData.real_discount_percentage,
        is_daily_rotation: formData.is_daily_rotation,
        event_id: formData.event_id,
        pack_type: formData.pack_type,
        pack_conditions: formData.pack_conditions,
        max_purchases_per_user: formData.max_purchases_per_user,
        purchase_time_limit: formData.purchase_time_limit,
        cards_per_pack: formData.cards_per_pack,
        is_special: formData.is_special,
        updated_at: new Date().toISOString()
      };

      if (editingPack) {
        // Atualizar pack existente
        const { error } = await supabase
          .from('shop_items')
          .update(packData)
          .eq('id', editingPack.id);

        if (error) throw error;
        alert('Pack atualizado com sucesso!');
      } else {
        // Criar novo pack
        const { error } = await supabase
          .from('shop_items')
          .insert({
            ...packData,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
        alert('Pack criado com sucesso!');
      }

      resetForm();
      fetchPacks();
    } catch (err: any) {
      console.error('Erro ao salvar pack:', err);
      alert(`Erro ao salvar pack: ${err.message}`);
    }
  };

  const editPack = (pack: Pack) => {
            // // console.log('Editando pack:', pack);
        // // console.log('Pack ID:', pack.id);
        // // console.log('Pack name:', pack.name);
        // // console.log('Pack card_ids:', pack.card_ids);
    
    // Calcular quantidades de cada carta
    const cardQuantities: Record<string, number> = {};
    if (pack.card_ids) {
      pack.card_ids.forEach(cardId => {
        cardQuantities[cardId] = (cardQuantities[cardId] || 0) + 1;
      });
    }
    
    setEditingPack(pack);
    setActiveTab('form'); // Mudar para a aba do formulário
    setFormData({
      name: pack.name,
      description: pack.description || '',
      item_type: pack.item_type as 'pack' | 'booster',
      price_coins: pack.price_coins || 0,
      price_gems: pack.price_gems || 0,
      currency_type: pack.currency_type as 'coins' | 'gems' | 'both',
      rarity: pack.rarity || 'common',
      card_ids: pack.card_ids || [],
      card_quantities: cardQuantities,
      guaranteed_cards: pack.guaranteed_cards || {},
      is_limited: pack.is_limited || false,
      stock_quantity: pack.stock_quantity || 0,
      is_active: pack.is_active || false,
      discount_percentage: pack.discount_percentage || 0,
      real_discount_percentage: pack.real_discount_percentage || 0,
      is_daily_rotation: pack.is_daily_rotation || false,
      event_id: pack.event_id || undefined,
      pack_type: (pack.pack_type as 'unrestricted' | 'random' | 'conditional' | 'unlimited') || 'unrestricted',
      pack_conditions: pack.pack_conditions || {},
      max_purchases_per_user: pack.max_purchases_per_user,
      purchase_time_limit: pack.purchase_time_limit,
      cards_per_pack: pack.cards_per_pack,
      is_special: pack.is_special || false
    });
    
            /*// console.log('FormData atualizado:', {
      name: pack.name,
      card_ids: pack.card_ids || [],
      card_quantities: cardQuantities
    });*/
  };

  const reactivatePack = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shop_items')
        .update({ 
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      alert('Pack reativado com sucesso!');
      fetchPacks();
    } catch (err: any) {
      console.error('Erro ao reativar pack:', err);
      alert(`Erro ao reativar pack: ${err.message}`);
    }
  };

  const deletePack = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este pack?')) return;

    try {
      // Primeiro, verificar se há compras associadas
      const { data: purchases, error: purchasesError } = await supabase
        .from('shop_purchases')
        .select('id')
        .eq('item_id', id);

      if (purchasesError) throw purchasesError;

      if (purchases && purchases.length > 0) {
        const action = confirm(
          `Este pack tem ${purchases.length} compra(s) associada(s).\n\n` +
          'Escolha uma opção:\n' +
          'OK = Desativar o pack (manter histórico)\n' +
          'Cancelar = Cancelar exclusão'
        );

        if (action) {
          // Desativar o pack em vez de excluir
          const { error: updateError } = await supabase
            .from('shop_items')
            .update({ 
              is_active: false,
              updated_at: new Date().toISOString()
            })
            .eq('id', id);

          if (updateError) throw updateError;
          alert('Pack desativado com sucesso! (Histórico de compras preservado)');
        } else {
          // Perguntar se quer excluir forçadamente
          const forceDelete = confirm(
            'ATENÇÃO: Exclusão forçada irá remover TODAS as compras associadas!\n\n' +
            'Esta ação é irreversível e pode afetar o histórico dos usuários.\n\n' +
            'Tem certeza que deseja continuar?'
          );

          if (forceDelete) {
            // Excluir compras primeiro
            const { error: deletePurchasesError } = await supabase
              .from('shop_purchases')
              .delete()
              .eq('item_id', id);

            if (deletePurchasesError) throw deletePurchasesError;

            // Agora excluir o pack
            const { error: deletePackError } = await supabase
              .from('shop_items')
              .delete()
              .eq('id', id);

            if (deletePackError) throw deletePackError;
            alert('Pack e histórico de compras excluídos com sucesso!');
          } else {
            return; // Cancelar exclusão
          }
        }
      } else {
        // Não há compras, pode excluir normalmente
        const { error } = await supabase
          .from('shop_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
        alert('Pack excluído com sucesso!');
      }

      fetchPacks();
    } catch (err: any) {
      console.error('Erro ao excluir pack:', err);
      alert(`Erro ao excluir pack: ${err.message}`);
    }
  };

  const toggleCardSelection = (cardId: string) => {
    setFormData(prev => {
      const currentQuantity = prev.card_quantities[cardId] || 0;
      const newQuantity = currentQuantity > 0 ? 0 : 1; // Toggle entre 0 e 1
      
      const newCardQuantities = {
        ...prev.card_quantities,
        [cardId]: newQuantity
      };
      
      // Reconstruir card_ids baseado nas quantidades
      const newCardIds: string[] = [];
      Object.entries(newCardQuantities).forEach(([id, quantity]) => {
        for (let i = 0; i < quantity; i++) {
          newCardIds.push(id);
        }
      });
      
      return {
        ...prev,
        card_ids: newCardIds,
        card_quantities: newCardQuantities
      };
    });
  };

  const addCardQuantity = (cardId: string) => {
    setFormData(prev => {
      const currentQuantity = prev.card_quantities[cardId] || 0;
      const newQuantity = currentQuantity + 1;
      
      const newCardQuantities = {
        ...prev.card_quantities,
        [cardId]: newQuantity
      };
      
      // Reconstruir card_ids baseado nas quantidades
      const newCardIds: string[] = [];
      Object.entries(newCardQuantities).forEach(([id, quantity]) => {
        for (let i = 0; i < quantity; i++) {
          newCardIds.push(id);
        }
      });
      
      return {
        ...prev,
        card_ids: newCardIds,
        card_quantities: newCardQuantities
      };
    });
  };

  const removeCardQuantity = (cardId: string) => {
    setFormData(prev => {
      const currentQuantity = prev.card_quantities[cardId] || 0;
      const newQuantity = Math.max(0, currentQuantity - 1);
      
      const newCardQuantities = {
        ...prev.card_quantities,
        [cardId]: newQuantity
      };
      
      // Reconstruir card_ids baseado nas quantidades
      const newCardIds: string[] = [];
      Object.entries(newCardQuantities).forEach(([id, quantity]) => {
        for (let i = 0; i < quantity; i++) {
          newCardIds.push(id);
        }
      });
      
      return {
        ...prev,
        card_ids: newCardIds,
        card_quantities: newCardQuantities
      };
    });
  };

  const updatePackCondition = (rarity: string, count: number) => {
    setFormData(prev => ({
      ...prev,
      pack_conditions: {
        ...prev.pack_conditions,
        [rarity]: count
      }
    }));
  };

  const removePackCondition = (rarity: string) => {
    setFormData(prev => {
      const newConditions = { ...prev.pack_conditions };
      delete newConditions[rarity];
      return {
        ...prev,
        pack_conditions: newConditions
      };
    });
  };

  // Função para selecionar todas as cartas visíveis
  const selectAllVisibleCards = () => {
    const filteredCards = cards.filter(card => {
      const typeMatch = cardFilters.type === 'all' || card.type === cardFilters.type;
      const rarityMatch = cardFilters.rarity === 'all' || card.rarity === cardFilters.rarity;
      return typeMatch && rarityMatch;
    });

    setFormData(prev => {
      const newCardQuantities = { ...prev.card_quantities };
      
      // Adicionar todas as cartas filtradas com quantidade 1
      filteredCards.forEach(card => {
        newCardQuantities[card.id] = 1;
      });
      
      // Reconstruir card_ids baseado nas quantidades
      const newCardIds: string[] = [];
      Object.entries(newCardQuantities).forEach(([id, quantity]) => {
        for (let i = 0; i < quantity; i++) {
          newCardIds.push(id);
        }
      });
      
      return {
        ...prev,
        card_ids: newCardIds,
        card_quantities: newCardQuantities
      };
    });
  };

  // Função para desmarcar todas as cartas
  const deselectAllCards = () => {
    setFormData(prev => ({
      ...prev,
      card_ids: [],
      card_quantities: {}
    }));
  };

  // Função para obter tipos únicos de cartas
  const getUniqueCardTypes = () => {
    const types = cards.map(card => card.type);
    return ['all', ...Array.from(new Set(types))];
  };

  // Função para obter raridades únicas de cartas
  const getUniqueCardRarities = () => {
    const rarities = cards.map(card => card.rarity);
    return ['all', ...Array.from(new Set(rarities))];
  };

  const testPackOpening = async (packId: string) => {
    const result = await openPack(packId);
    if (result) {
      setTestResults(prev => [...prev, { packId, cards: result, timestamp: new Date() }]);
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
      case 'booster': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'secret': return <Zap className="h-4 w-4 text-yellow-400" />;
      case 'ultra': return <Star className="h-4 w-4 text-purple-400" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Packs e Boosters</h2>
          <p className="text-gray-300">Crie e gerencie packs de cartas e boosters</p>
        </div>
        <Button onClick={resetForm} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0">
          <Plus className="h-4 w-4" />
          Novo Pack
        </Button>
      </div>

      <div className="w-full">
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'form'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Criar/Editar Pack
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Packs Existentes
          </button>
        </div>

        {activeTab === 'form' && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white">
                {editingPack ? 'Editar Pack' : 'Criar Novo Pack'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Pack *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Pack Iniciante"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={formData.item_type}
                    onValueChange={(value: 'pack' | 'booster') => 
                      setFormData(prev => ({ ...prev, item_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pack">Pack</SelectItem>
                      <SelectItem value="booster">Booster</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rarity">Raridade</Label>
                  <Select
                    value={formData.rarity}
                    onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, rarity: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">Comum</SelectItem>
                      <SelectItem value="uncommon">Incomum</SelectItem>
                      <SelectItem value="rare">Raro</SelectItem>
                      <SelectItem value="ultra">Ultra</SelectItem>
                      <SelectItem value="secret">Secreto</SelectItem>
                      <SelectItem value="legendary">Lendário</SelectItem>
                      <SelectItem value="crisis">Crise</SelectItem>
                      <SelectItem value="booster">Booster</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Tipo de Moeda</Label>
                  <Select
                    value={formData.currency_type}
                    onValueChange={(value: 'coins' | 'gems' | 'both') => 
                      setFormData(prev => ({ ...prev, currency_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coins">Apenas Moedas</SelectItem>
                      <SelectItem value="gems">Apenas Gems</SelectItem>
                      <SelectItem value="both">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_coins">Preço em Moedas</Label>
                  <Input
                    id="price_coins"
                    type="number"
                    value={formData.price_coins}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_coins: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
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

                                 <div className="space-y-2">
                   <Label htmlFor="discount">Desconto Falso (%)</Label>
                   <Input
                     id="discount"
                     type="number"
                     value={formData.discount_percentage}
                     onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: parseInt(e.target.value) || 0 }))}
                     placeholder="0"
                   />
                   <p className="text-xs text-gray-500">Desconto mostrado na loja (50% falso multiplica preço por 2)</p>
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="real_discount">Desconto Real (%)</Label>
                   <Input
                     id="real_discount"
                     type="number"
                     value={formData.real_discount_percentage}
                     onChange={(e) => setFormData(prev => ({ ...prev, real_discount_percentage: parseInt(e.target.value) || 0 }))}
                     placeholder="0"
                   />
                   <p className="text-xs text-gray-500">Desconto real aplicado na compra</p>
                 </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Quantidade em Estoque</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                    placeholder="0 (ilimitado)"
                    disabled={!formData.is_limited}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o conteúdo do pack..."
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_limited"
                    checked={formData.is_limited}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_limited: checked }))}
                  />
                  <Label htmlFor="is_limited">Pack Limitado</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_special"
                    checked={formData.is_special}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_special: checked }))}
                  />
                  <Label htmlFor="is_special">Pack Especial</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_daily_rotation"
                    checked={formData.is_daily_rotation}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_daily_rotation: checked }))}
                  />
                  <Label htmlFor="is_daily_rotation">Rotação Diária</Label>
                </div>
              </div>

              {/* Configuração do Tipo de Pack */}
              <div className="space-y-4">
                <Label>Tipo de Pack</Label>
                <Select
                  value={formData.pack_type}
                  onValueChange={(value: 'unrestricted' | 'conditional' | 'unlimited') => 
                    setFormData(prev => ({ ...prev, pack_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unrestricted">Sem Restrições (todas as cartas do pack)</SelectItem>
                    <SelectItem value="random">Aleatório (X cartas de Y totais)</SelectItem>
                    <SelectItem value="conditional">Com Condições (distribuição por raridade)</SelectItem>
                    <SelectItem value="unlimited">Ilimitado (com restrições por usuário)</SelectItem>
                  </SelectContent>
                </Select>

                {/* Configurações específicas por tipo */}
                {formData.pack_type === 'unrestricted' && (
                  <div className="space-y-2">
                    <Label htmlFor="cards_per_pack">Cartas por Pack</Label>
                    <Input
                      id="cards_per_pack"
                      type="number"
                      value={formData.cards_per_pack || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        cards_per_pack: e.target.value ? parseInt(e.target.value) : null 
                      }))}
                      placeholder="Deixe vazio para usar todas as cartas do pack"
                    />
                  </div>
                )}

                {formData.pack_type === 'random' && (
                  <div className="space-y-2">
                    <Label htmlFor="cards_per_pack">Cartas Aleatórias por Pack</Label>
                    <Input
                      id="cards_per_pack"
                      type="number"
                      min="1"
                      value={formData.cards_per_pack || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        cards_per_pack: e.target.value ? parseInt(e.target.value) : null 
                      }))}
                      placeholder="Ex: 5 (seleciona 5 cartas aleatórias)"
                    />
                    <p className="text-sm text-gray-500">
                      Seleciona X cartas aleatórias independente da raridade
                    </p>
                  </div>
                )}

                {formData.pack_type === 'conditional' && (
                  <div className="space-y-4">
                    <Label>Condições por Raridade</Label>
                    <div className="space-y-2">
                      {['common', 'uncommon', 'rare', 'ultra', 'secret', 'legendary', 'crisis'].map((rarity) => (
                        <div key={rarity} className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.pack_conditions[rarity] || ''}
                            onChange={(e) => {
                              const count = e.target.value ? parseInt(e.target.value) : 0;
                              if (count > 0) {
                                updatePackCondition(rarity, count);
                              } else {
                                removePackCondition(rarity);
                              }
                            }}
                            placeholder="0"
                            className="w-20"
                          />
                          <Label className="min-w-[80px] capitalize">{rarity}</Label>
                          {formData.pack_conditions[rarity] && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removePackCondition(rarity)}
                              className="h-6 w-6 p-0"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      Total: {Object.values(formData.pack_conditions).reduce((sum, count) => sum + count, 0)} cartas
                    </div>
                  </div>
                )}

                {formData.pack_type === 'unlimited' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="max_purchases">Máximo de Compras por Usuário</Label>
                      <Input
                        id="max_purchases"
                        type="number"
                        min="1"
                        value={formData.max_purchases_per_user || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          max_purchases_per_user: e.target.value ? parseInt(e.target.value) : null 
                        }))}
                        placeholder="Deixe vazio para sem limite"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time_limit">Limite de Tempo entre Compras</Label>
                      <Select
                        value={formData.purchase_time_limit || 'none'}
                        onValueChange={(value) => setFormData(prev => ({ 
                          ...prev, 
                          purchase_time_limit: value === 'none' ? null : value 
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um limite de tempo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sem limite</SelectItem>
                          <SelectItem value="1 hour">1 hora</SelectItem>
                          <SelectItem value="6 hours">6 horas</SelectItem>
                          <SelectItem value="12 hours">12 horas</SelectItem>
                          <SelectItem value="1 day">1 dia</SelectItem>
                          <SelectItem value="3 days">3 dias</SelectItem>
                          <SelectItem value="7 days">7 dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label>Cartas do Pack *</Label>
                
                {/* Filtros e controles */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAllVisibleCards}
                        className="text-sm"
                      >
                        Selecionar Todas (Filtradas)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={deselectAllCards}
                        className="text-sm"
                      >
                        Desmarcar Todas
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formData.card_ids.length} cartas selecionadas
                    </div>
                  </div>

                  {/* Filtros */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="filter-type">Filtrar por Tipo</Label>
                      <Select
                        value={cardFilters.type}
                        onValueChange={(value) => setCardFilters(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getUniqueCardTypes().map((type) => (
                            <SelectItem key={type} value={type}>
                              {type === 'all' ? 'Todos os Tipos' : type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="filter-rarity">Filtrar por Raridade</Label>
                      <Select
                        value={cardFilters.rarity}
                        onValueChange={(value) => setCardFilters(prev => ({ ...prev, rarity: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getUniqueCardRarities().map((rarity) => (
                            <SelectItem key={rarity} value={rarity}>
                              {rarity === 'all' ? 'Todas as Raridades' : rarity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Lista de cartas filtradas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto border rounded-lg p-4">
                  {cards
                    .filter(card => {
                      const typeMatch = cardFilters.type === 'all' || card.type === cardFilters.type;
                      const rarityMatch = cardFilters.rarity === 'all' || card.rarity === cardFilters.rarity;
                      return typeMatch && rarityMatch;
                    })
                    .map((card) => {
                      const quantity = formData.card_quantities[card.id] || 0;
                      const isSelected = quantity > 0;
                      
                      return (
                        <div
                          key={card.id}
                          className={`p-3 border rounded-lg transition-colors ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCardSelection(card.id)}
                              className="rounded"
                              aria-label={`Selecionar ${card.name}`}
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{card.name}</div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Badge variant="outline" className="text-xs">
                                  {card.type}
                                </Badge>
                                <Badge className={`text-xs ${getRarityColor(card.rarity)}`}>
                                  {card.rarity}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {isSelected && (
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCardQuantity(card.id);
                                }}
                                className="h-6 w-6 p-0"
                              >
                                -
                              </Button>
                              <span className="text-sm font-medium min-w-[20px] text-center">
                                {quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addCardQuantity(card.id);
                                }}
                                className="h-6 w-6 p-0"
                              >
                                +
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
                
                <div className="text-sm text-gray-500">
                  Mostrando {cards.filter(card => {
                    const typeMatch = cardFilters.type === 'all' || card.type === cardFilters.type;
                    const rarityMatch = cardFilters.rarity === 'all' || card.rarity === cardFilters.rarity;
                    return typeMatch && rarityMatch;
                  }).length} de {cards.length} cartas
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingPack ? 'Atualizar' : 'Criar'} Pack
                </Button>
                {editingPack && (
                  <Button variant="outline" onClick={resetForm} className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'list' && (
          <>
            {openingError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">Erro ao testar pack: {openingError}</p>
              </div>
            )}

            {testResults.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Resultados dos Testes</h3>
                <div className="space-y-3">
                  {testResults.slice(-3).reverse().map((result, index) => (
                    <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Teste {testResults.length - index}</span>
                        <span className="text-sm text-gray-500">
                          {result.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm">
                        <p><strong>Pack ID:</strong> {result.packId}</p>
                        <p><strong>Cartas obtidas:</strong> {result.cards.length}</p>
                        <div className="mt-2">
                          {result.cards.map((card: any, cardIndex: number) => (
                            <div key={cardIndex} className="flex items-center gap-2 text-xs">
                              <Badge className={`${getRarityColor(card.rarity)} text-xs`}>
                                {card.rarity}
                              </Badge>
                              <span>{card.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packs.map((pack) => (
              <Card key={pack.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getRarityIcon(pack.rarity || 'common')}
                      <CardTitle className="text-lg">{pack.name}</CardTitle>
                    </div>
                    <Badge className={getRarityColor(pack.rarity || 'common')}>
                      {(pack.rarity || 'common').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    {pack.item_type === 'pack' ? 'Pack' : 'Booster'}
                                         {pack.pack_type && (
                       <Badge variant="outline" className="text-xs">
                         {pack.pack_type === 'unrestricted' ? 'Sem Restrições' :
                          pack.pack_type === 'random' ? 'Aleatório' :
                          pack.pack_type === 'conditional' ? 'Com Condições' :
                          pack.pack_type === 'unlimited' ? 'Ilimitado' : pack.pack_type}
                       </Badge>
                     )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{pack.description || 'Sem descrição'}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    {pack.price_coins && pack.price_coins > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-600">🪙</span>
                        <span>{pack.price_coins}</span>
                      </div>
                    )}
                    {pack.price_gems && pack.price_gems > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-purple-600">💎</span>
                        <span>{pack.price_gems}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    {pack.card_ids?.length || 0} cartas • {pack.sold_quantity || 0} vendidos
                    {pack.is_limited && pack.stock_quantity && (
                      <span> • Estoque: {pack.stock_quantity - (pack.sold_quantity || 0)}</span>
                    )}
                    {pack.pack_type === 'conditional' && pack.pack_conditions && (
                      <div className="mt-1 text-xs">
                        Condições: {Object.entries(pack.pack_conditions).map(([rarity, count]) => 
                          `${count} ${rarity}`
                        ).join(', ')}
                      </div>
                    )}
                    {pack.pack_type === 'unlimited' && (
                      <div className="mt-1 text-xs">
                        {pack.max_purchases_per_user && `Máx: ${pack.max_purchases_per_user}/usuário`}
                        {pack.purchase_time_limit && ` • Tempo: ${pack.purchase_time_limit}`}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={pack.is_active ? "default" : "secondary"}>
                      {pack.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    {pack.is_limited && (
                      <Badge variant="outline">Limitado</Badge>
                    )}
                    {pack.is_special && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                        Especial
                      </Badge>
                    )}
                    {pack.is_daily_rotation && (
                      <Badge variant="outline">Rotação</Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                                // // console.log('Botão Editar clicado para pack:', pack.id);
        // // console.log('Pack completo:', pack);
                        editPack(pack);
                      }}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testPackOpening(pack.id)}
                      disabled={openingPack}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Play className="h-4 w-4" />
                      Testar
                    </Button>
                    {pack.is_active ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePack(pack.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => reactivatePack(pack.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                                              <RefreshCw className="h-4 w-4" />
                      Reativar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
        )}
      </div>
    </div>
  );
}; 
