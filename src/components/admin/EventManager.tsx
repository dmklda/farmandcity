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
import { Plus, Trash2, Edit, Save, X, Calendar, Gift } from 'lucide-react';

interface ShopEvent {
  id: string;
  name: string;
  description: string;
  event_type: 'sale' | 'limited' | 'exclusive' | 'seasonal';
  start_date: string;
  end_date: string;
  discount_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const EventManager: React.FC = () => {
  const [events, setEvents] = useState<ShopEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<ShopEvent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    event_type: 'sale' as 'sale' | 'limited' | 'exclusive' | 'seasonal',
    start_date: '',
    end_date: '',
    discount_percentage: 0,
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      event_type: 'sale',
      start_date: '',
      end_date: '',
      discount_percentage: 0,
      is_active: true
    });
    setEditingEvent(null);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents((data || []).map(event => ({
        ...event,
        description: event.description || '',
        is_active: event.is_active || false,
        discount_percentage: event.discount_percentage || 0,
        event_type: event.event_type as 'sale' | 'limited' | 'exclusive' | 'seasonal',
        created_at: event.created_at || new Date().toISOString(),
        updated_at: event.updated_at || new Date().toISOString()
      })));
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.start_date || !formData.end_date) {
        alert('Preencha todos os campos obrigatórios');
        return;
      }

      if (editingEvent) {
        // Atualizar evento existente
        const { error } = await supabase
          .from('shop_events')
          .update({
            name: formData.name,
            description: formData.description,
            event_type: formData.event_type,
            start_date: formData.start_date,
            end_date: formData.end_date,
            discount_percentage: formData.discount_percentage,
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEvent.id);

        if (error) throw error;
        alert('Evento atualizado com sucesso!');
      } else {
        // Criar novo evento
        const { error } = await supabase
          .from('shop_events')
          .insert({
            name: formData.name,
            description: formData.description,
            event_type: formData.event_type,
            start_date: formData.start_date,
            end_date: formData.end_date,
            discount_percentage: formData.discount_percentage,
            is_active: formData.is_active,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
        alert('Evento criado com sucesso!');
      }

      resetForm();
      fetchEvents();
    } catch (err: any) {
      console.error('Erro ao salvar evento:', err);
      alert(`Erro ao salvar evento: ${err.message}`);
    }
  };

  const editEvent = (event: ShopEvent) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      event_type: event.event_type,
      start_date: event.start_date,
      end_date: event.end_date,
      discount_percentage: event.discount_percentage,
      is_active: event.is_active
    });
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const { error } = await supabase
        .from('shop_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Evento excluído com sucesso!');
      fetchEvents();
    } catch (err: any) {
      console.error('Erro ao excluir evento:', err);
      alert(`Erro ao excluir evento: ${err.message}`);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'sale': return 'bg-green-500';
      case 'limited': return 'bg-orange-500';
      case 'exclusive': return 'bg-purple-500';
      case 'seasonal': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'sale': return 'Promoção';
      case 'limited': return 'Limitado';
      case 'exclusive': return 'Exclusivo';
      case 'seasonal': return 'Sazonal';
      default: return type;
    }
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
          <h2 className="text-2xl font-bold">Gerenciar Eventos da Loja</h2>
          <p className="text-muted-foreground">Crie e gerencie eventos especiais e promoções</p>
        </div>
        <Button onClick={resetForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Evento
        </Button>
      </div>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Criar/Editar Evento</TabsTrigger>
          <TabsTrigger value="list">Eventos Existentes</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingEvent ? 'Editar Evento' : 'Criar Novo Evento'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Evento *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Black Friday"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Evento</Label>
                  <Select
                    value={formData.event_type}
                    onValueChange={(value: 'sale' | 'limited' | 'exclusive' | 'seasonal') => 
                      setFormData(prev => ({ ...prev, event_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Promoção</SelectItem>
                      <SelectItem value="limited">Edição Limitada</SelectItem>
                      <SelectItem value="exclusive">Exclusivo</SelectItem>
                      <SelectItem value="seasonal">Sazonal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Data de Início *</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">Data de Fim *</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Desconto (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva o evento..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Evento Ativo</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingEvent ? 'Atualizar' : 'Criar'} Evento
                </Button>
                {editingEvent && (
                  <Button variant="outline" onClick={resetForm} className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-purple-500" />
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                    </div>
                    <Badge className={getEventTypeColor(event.event_type)}>
                      {getEventTypeLabel(event.event_type)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{event.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={event.is_active ? "default" : "secondary"}>
                      {event.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    {event.discount_percentage > 0 && (
                      <Badge variant="outline" className="text-green-600">
                        -{event.discount_percentage}%
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editEvent(event)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 