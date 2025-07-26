import React, { useState, useRef } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { AdminCard, CardType, CardRarity } from '../../types/admin';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { ArrowLeft, Save, Upload, Eye, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface CardEditorProps {
  card: AdminCard | null;
  onSave: (card: AdminCard) => void;
  onCancel: () => void;
  onDuplicate?: (card: AdminCard) => void;
}

export const CardEditor: React.FC<CardEditorProps> = ({
  card,
  onSave,
  onCancel,
  onDuplicate
}) => {
  const [formData, setFormData] = useState<Partial<AdminCard>>({
    name: card?.name || '',
    type: card?.type || 'farm',
    rarity: card?.rarity || 'common',
    effect: card?.effect || '',
    effect_logic: card?.effect_logic || undefined,
    cost_coins: card?.cost_coins || 0,
    cost_food: card?.cost_food || 0,
    cost_materials: card?.cost_materials || 0,
    cost_population: card?.cost_population || 0,
    use_per_turn: card?.use_per_turn || 1,
    is_reactive: card?.is_reactive || false,
    is_active: card?.is_active ?? true,
    art_url: card?.art_url || undefined,
    tags: card?.tags || undefined,
    ...card
  });

  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof AdminCard, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `cards/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('card-arts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('card-arts')
        .getPublicUrl(filePath);

      handleInputChange('art_url', data.publicUrl);
      toast.success('Imagem carregada com sucesso!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao carregar imagem');
    }
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (!formData.effect?.trim()) {
      toast.error('Efeito é obrigatório');
      return;
    }

    setLoading(true);

    try {
      // Database insert data  
      const insertData = {
        name: formData.name!,
        effect: formData.effect!,
        type: formData.type!,
        rarity: formData.rarity!,
        cost_coins: formData.cost_coins || 0,
        cost_food: formData.cost_food || 0,
        cost_materials: formData.cost_materials || 0,
        cost_population: formData.cost_population || 0,
        use_per_turn: formData.use_per_turn || 1,
        is_reactive: formData.is_reactive || false,
        is_active: formData.is_active ?? true,
        effect_logic: formData.effect_logic || null,
        art_url: formData.art_url || null,
        tags: formData.tags || null
      };

      let savedCard: AdminCard;

      if (card?.id) {
        // Update existing card
        const { data, error } = await supabase
          .from('cards')
          .update({
            ...insertData,
            updated_at: new Date().toISOString()
          })
          .eq('id', card.id)
          .select()
          .single();

        if (error) throw error;
        savedCard = data as AdminCard;
      } else {
        // Create new card
        const { data, error } = await supabase
          .from('cards')
          .insert({
            ...insertData
          })
          .select()
          .single();

        if (error) throw error;
        savedCard = data as AdminCard;
      }

      onSave(savedCard);
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Erro ao salvar carta');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = () => {
    if (card && onDuplicate) {
      const duplicatedCard = {
        ...card,
        id: '',
        name: `${card.name} (Cópia)`,
        slug: '',
        created_at: '',
        updated_at: ''
      } as AdminCard;
      
      onDuplicate(duplicatedCard);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold">
              {card?.id ? 'Editar Carta' : 'Nova Carta'}
            </h2>
            <p className="text-muted-foreground">
              {card?.id ? `Editando: ${card.name}` : 'Criar uma nova carta'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Editar' : 'Preview'}
          </Button>
          {card?.id && onDuplicate && (
            <Button variant="outline" onClick={handleDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicar
            </Button>
          )}
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Carta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nome da carta"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value as CardType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farm">Farm</SelectItem>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="action">Action</SelectItem>
                    <SelectItem value="magic">Magic</SelectItem>
                    <SelectItem value="defense">Defense</SelectItem>
                    <SelectItem value="trap">Trap</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="landmark">Landmark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rarity">Raridade *</Label>
              <Select value={formData.rarity} onValueChange={(value) => handleInputChange('rarity', value as CardRarity)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="uncommon">Uncommon</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="ultra">Ultra</SelectItem>
                  <SelectItem value="secret">Secret</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                  <SelectItem value="crisis">Crisis</SelectItem>
                  <SelectItem value="booster">Booster</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Costs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost_coins">Custo - Moedas</Label>
                <Input
                  id="cost_coins"
                  type="number"
                  min="0"
                  value={formData.cost_coins || 0}
                  onChange={(e) => handleInputChange('cost_coins', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost_food">Custo - Comida</Label>
                <Input
                  id="cost_food"
                  type="number"
                  min="0"
                  value={formData.cost_food || 0}
                  onChange={(e) => handleInputChange('cost_food', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost_materials">Custo - Materiais</Label>
                <Input
                  id="cost_materials"
                  type="number"
                  min="0"
                  value={formData.cost_materials || 0}
                  onChange={(e) => handleInputChange('cost_materials', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost_population">Custo - População</Label>
                <Input
                  id="cost_population"
                  type="number"
                  min="0"
                  value={formData.cost_population || 0}
                  onChange={(e) => handleInputChange('cost_population', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Effect */}
            <div className="space-y-2">
              <Label htmlFor="effect">Efeito *</Label>
              <Textarea
                id="effect"
                value={formData.effect || ''}
                onChange={(e) => handleInputChange('effect', e.target.value)}
                placeholder="Descrição do efeito da carta"
                rows={4}
              />
            </div>

            {/* Effect Logic */}
            <div className="space-y-2">
              <Label htmlFor="effect_logic">Lógica do Efeito</Label>
              <Textarea
                id="effect_logic"
                value={formData.effect_logic || ''}
                onChange={(e) => handleInputChange('effect_logic', e.target.value)}
                placeholder="Código/tag da lógica do efeito"
                rows={3}
              />
            </div>

            {/* Usage */}
            <div className="space-y-2">
              <Label htmlFor="use_per_turn">Uso por Turno</Label>
              <Input
                id="use_per_turn"
                type="number"
                min="1"
                value={formData.use_per_turn || 1}
                onChange={(e) => handleInputChange('use_per_turn', parseInt(e.target.value) || 1)}
              />
            </div>

            {/* Switches */}
            <div className="flex items-center justify-between">
              <Label htmlFor="is_reactive">Carta Reativa</Label>
              <Switch
                id="is_reactive"
                checked={formData.is_reactive || false}
                onCheckedChange={(value) => handleInputChange('is_reactive', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Carta Ativa</Label>
              <Switch
                id="is_active"
                checked={formData.is_active ?? true}
                onCheckedChange={(value) => handleInputChange('is_active', value)}
              />
            </div>

            {/* Art Upload */}
            <div className="space-y-2">
              <Label>Arte da Carta</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {formData.art_url ? (
                  <div className="space-y-2">
                    <img
                      src={formData.art_url}
                      alt="Preview"
                      className="max-w-full h-32 object-cover mx-auto rounded"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Alterar Imagem
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar Imagem
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview da Carta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-center text-muted-foreground">
                Preview visual será implementado aqui
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <p><strong>Nome:</strong> {formData.name || 'Nome da carta'}</p>
                <p><strong>Tipo:</strong> {formData.type}</p>
                <p><strong>Raridade:</strong> {formData.rarity}</p>
                <p><strong>Efeito:</strong> {formData.effect || 'Descrição do efeito'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};