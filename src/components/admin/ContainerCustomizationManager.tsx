import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../ui/toast';
import { supabase } from '../../integrations/supabase/client';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Image, 
  Shield,
  Building,
  TreePine,
  Landmark,
  Calendar,
  Coins,
  Gem,
  Eye,
  EyeOff,
  Star
} from 'lucide-react';

interface ContainerCustomization {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  container_type: 'city' | 'farm' | 'landmark' | 'events';
  rarity: string | null;
  price_coins: number | null;
  price_gems: number | null;
  currency_type: string | null;
  is_active: boolean | null;
  is_special: boolean | null;
  created_at: string | null;
}

export const ContainerCustomizationManager: React.FC = () => {
  const [customizations, setCustomizations] = useState<ContainerCustomization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCustomization, setEditingCustomization] = useState<Partial<ContainerCustomization>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newCustomization, setNewCustomization] = useState<Partial<ContainerCustomization>>({});
  const { showToast, ToastContainer } = useToast();

  const containerTypes = [
    { value: 'city', label: 'Cidade', icon: '🏙️', color: 'from-blue-500 to-blue-600' },
    { value: 'farm', label: 'Fazenda', icon: '🌾', color: 'from-green-500 to-green-600' },
    { value: 'landmark', label: 'Marco', icon: '🏛️', color: 'from-purple-500 to-purple-600' },
    { value: 'events', label: 'Eventos', icon: '🎪', color: 'from-orange-500 to-orange-600' }
  ];

  const rarityOptions = [
    { value: 'common', label: 'Comum', color: 'bg-gray-500' },
    { value: 'uncommon', label: 'Incomum', color: 'bg-green-500' },
    { value: 'rare', label: 'Raro', color: 'bg-blue-500' },
    { value: 'epic', label: 'Épico', color: 'bg-purple-500' },
    { value: 'legendary', label: 'Lendário', color: 'bg-yellow-500' }
  ];

  const fetchCustomizations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('container_customizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomizations((data || []) as ContainerCustomization[]);
    } catch (err: any) {
      console.error('Erro ao buscar customizações:', err);
      setError(err.message);
      showToast(`Erro ao carregar customizações: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const createCustomization = async () => {
    try {
      if (!newCustomization.name || !newCustomization.container_type) {
        showToast('Nome e tipo de container são obrigatórios', 'error');
        return;
      }

      const { data, error } = await supabase
        .from('container_customizations')
        .insert({
          name: newCustomization.name,
          description: newCustomization.description || null,
          image_url: newCustomization.image_url || null,
          container_type: newCustomization.container_type,
          rarity: newCustomization.rarity || null,
          price_coins: newCustomization.price_coins || null,
          price_gems: newCustomization.price_gems || null,
          currency_type: newCustomization.currency_type || null,
          is_special: newCustomization.is_special || null
        })
        .select()
        .single();

      if (error) throw error;

      setCustomizations(prev => [data as ContainerCustomization, ...prev]);
      setNewCustomization({});
      setIsCreating(false);
      showToast('Customização criada com sucesso!', 'success');
    } catch (err: any) {
      console.error('Erro ao criar customização:', err);
      showToast(`Erro ao criar customização: ${err.message}`, 'error');
    }
  };

  const updateCustomization = async () => {
    try {
      if (!editingId || !editingCustomization.name || !editingCustomization.container_type) {
        showToast('Nome e tipo de container são obrigatórios', 'error');
        return;
      }

      const { data, error } = await supabase
        .from('container_customizations')
        .update(editingCustomization)
        .eq('id', editingId)
        .select()
        .single();

      if (error) throw error;

      setCustomizations(prev => 
        prev.map(cat => cat.id === editingId ? data as ContainerCustomization : cat)
      );
      setEditingId(null);
      setEditingCustomization({});
      showToast('Customização atualizada com sucesso!', 'success');
    } catch (err: any) {
      console.error('Erro ao atualizar customização:', err);
      showToast(`Erro ao atualizar customização: ${err.message}`, 'error');
    }
  };

  const deleteCustomization = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta customização?')) return;

    try {
      const { error } = await supabase
        .from('container_customizations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustomizations(prev => prev.filter(cat => cat.id !== id));
      showToast('Customização excluída com sucesso!', 'success');
    } catch (err: any) {
      console.error('Erro ao excluir customização:', err);
      showToast(`Erro ao excluir customização: ${err.message}`, 'error');
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('container_customizations')
        .update({ is_active: !currentActive })
        .eq('id', id);

      if (error) throw error;

      setCustomizations(prev => 
        prev.map(cat => cat.id === id ? { ...cat, is_active: !currentActive } : cat)
      );
      showToast(`Customização ${!currentActive ? 'ativada' : 'desativada'} com sucesso!`, 'success');
    } catch (err: any) {
      console.error('Erro ao alterar status:', err);
      showToast(`Erro ao alterar status: ${err.message}`, 'error');
    }
  };

  const startEditing = (customization: ContainerCustomization) => {
    setEditingId(customization.id);
    setEditingCustomization(customization);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingCustomization({});
  };

  const getContainerTypeInfo = (type: string) => {
    return containerTypes.find(t => t.value === type) || containerTypes[0];
  };

  const getRarityInfo = (rarity: string) => {
    return rarityOptions.find(r => r.value === rarity) || rarityOptions[0];
  };

  useEffect(() => {
    fetchCustomizations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Carregando customizações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            Gerenciador de Customizações de Containers
          </h1>
          <p className="text-gray-300">Gerencie as customizações de containers disponíveis na loja</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Customização
        </Button>
      </div>

      {/* Create New Customization */}
      {isCreating && (
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-blue-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-500" />
              Nova Customização de Container
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Nome</Label>
                <Input
                  id="name"
                  value={newCustomization.name || ''}
                  onChange={(e) => setNewCustomization(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome da customização"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="container_type" className="text-white">Tipo de Container</Label>
                <Select
                  value={newCustomization.container_type || ''}
                  onValueChange={(value) => setNewCustomization(prev => ({ ...prev, container_type: value as any }))}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {containerTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          {type.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Descrição</Label>
              <Textarea
                id="description"
                value={newCustomization.description || ''}
                onChange={(e) => setNewCustomization(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição da customização"
                className="bg-slate-700/50 border-slate-600 text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="image_url" className="text-white">URL da Imagem</Label>
                <Input
                  id="image_url"
                  value={newCustomization.image_url || ''}
                  onChange={(e) => setNewCustomization(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="URL da imagem"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="rarity" className="text-white">Raridade</Label>
                <Select
                  value={newCustomization.rarity || ''}
                  onValueChange={(value) => setNewCustomization(prev => ({ ...prev, rarity: value }))}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Selecione a raridade" />
                  </SelectTrigger>
                  <SelectContent>
                    {rarityOptions.map(rarity => (
                      <SelectItem key={rarity.value} value={rarity.value}>
                        <span className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${rarity.color}`}></span>
                          {rarity.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price_coins" className="text-white">Preço em Moedas</Label>
                <Input
                  id="price_coins"
                  type="number"
                  value={newCustomization.price_coins || ''}
                  onChange={(e) => setNewCustomization(prev => ({ ...prev, price_coins: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_gems" className="text-white">Preço em Gemas</Label>
                <Input
                  id="price_gems"
                  type="number"
                  value={newCustomization.price_gems || ''}
                  onChange={(e) => setNewCustomization(prev => ({ ...prev, price_gems: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => setNewCustomization(prev => ({ ...prev, is_special: !prev.is_special }))}
                  variant={newCustomization.is_special ? "default" : "outline"}
                  className="w-full"
                >
                  {newCustomization.is_special ? (
                    <>
                      <Star className="w-4 h-4 mr-2" />
                      Especial
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4 mr-2" />
                      Marcar como Especial
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={createCustomization} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Criar Customização
              </Button>
              <Button onClick={() => { setIsCreating(false); setNewCustomization({}); }} variant="outline" className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customizations List */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-blue-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Customizações de Containers ({customizations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customizations.map(customization => (
              <div key={customization.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                {editingId === customization.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Nome</Label>
                        <Input
                          value={editingCustomization.name || ''}
                          onChange={(e) => setEditingCustomization(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Tipo de Container</Label>
                        <Select
                          value={editingCustomization.container_type || ''}
                          onValueChange={(value) => setEditingCustomization(prev => ({ ...prev, container_type: value as any }))}
                        >
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {containerTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                <span className="flex items-center gap-2">
                                  <span>{type.icon}</span>
                                  {type.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">Descrição</Label>
                      <Textarea
                        value={editingCustomization.description || ''}
                        onChange={(e) => setEditingCustomization(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-slate-700/50 border-slate-600 text-white"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-white">URL da Imagem</Label>
                        <Input
                          value={editingCustomization.image_url || ''}
                          onChange={(e) => setEditingCustomization(prev => ({ ...prev, image_url: e.target.value }))}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Raridade</Label>
                        <Select
                          value={editingCustomization.rarity || ''}
                          onValueChange={(value) => setEditingCustomization(prev => ({ ...prev, rarity: value }))}
                        >
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {rarityOptions.map(rarity => (
                              <SelectItem key={rarity.value} value={rarity.value}>
                                <span className="flex items-center gap-2">
                                  <span className={`w-3 h-3 rounded-full ${rarity.color}`}></span>
                                  {rarity.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white">Preço em Moedas</Label>
                        <Input
                          type="number"
                          value={editingCustomization.price_coins || ''}
                          onChange={(e) => setEditingCustomization(prev => ({ ...prev, price_coins: parseInt(e.target.value) || 0 }))}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Preço em Gemas</Label>
                        <Input
                          type="number"
                          value={editingCustomization.price_gems || ''}
                          onChange={(e) => setEditingCustomization(prev => ({ ...prev, price_gems: parseInt(e.target.value) || 0 }))}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={() => setEditingCustomization(prev => ({ ...prev, is_special: !prev.is_special }))}
                          variant={editingCustomization.is_special ? "default" : "outline"}
                          className="w-full"
                        >
                          {editingCustomization.is_special ? (
                            <>
                              <Star className="w-4 h-4 mr-2" />
                              Especial
                            </>
                          ) : (
                            <>
                              <Star className="w-4 h-4 mr-2" />
                              Marcar como Especial
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={updateCustomization} className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </Button>
                      <Button onClick={cancelEditing} variant="outline" className="flex-1">
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Preview Image */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
                        {customization.image_url ? (
                          <img 
                            src={customization.image_url} 
                            alt={customization.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLElement;
                              target.style.display = 'none';
                              const nextSibling = target.nextElementSibling as HTMLElement;
                              if (nextSibling) {
                                nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                        ) : (
                          <Shield className="w-8 h-8 text-white" />
                        )}
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">{customization.name}</h3>
                          {customization.is_special && (
                            <Badge className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Especial
                            </Badge>
                          )}
                          <Badge className={`bg-gradient-to-r ${getContainerTypeInfo(customization.container_type).color} text-white`}>
                            {getContainerTypeInfo(customization.container_type).icon} {getContainerTypeInfo(customization.container_type).label}
                          </Badge>
                          <Badge className={getRarityInfo(customization.rarity || 'common').color}>
                            {getRarityInfo(customization.rarity || 'common').label}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm">{customization.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          {(customization.price_coins ?? 0) > 0 && (
                            <div className="flex items-center gap-1">
                              <Coins className="w-4 h-4 text-yellow-500" />
                              <span className="text-yellow-400 text-sm">{customization.price_coins ?? 0}</span>
                            </div>
                          )}
                          {(customization.price_gems ?? 0) > 0 && (
                            <div className="flex items-center gap-1">
                              <Gem className="w-4 h-4 text-purple-500" />
                              <span className="text-purple-400 text-sm">{customization.price_gems ?? 0}</span>
                            </div>
                          )}
                          {((customization.price_coins ?? 0) === 0 && (customization.price_gems ?? 0) === 0) && (
                            <Badge className="bg-green-600 text-white">GRÁTIS</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => toggleActive(customization.id, customization.is_active || false)}
                        variant={customization.is_active ? "default" : "outline"}
                        size="sm"
                      >
                        {customization.is_active ? (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            Ativo
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            Inativo
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => startEditing(customization)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => deleteCustomization(customization.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {customizations.length === 0 && (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Nenhuma customização de container encontrada</p>
                <p className="text-gray-500 text-sm">Crie a primeira customização para começar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 