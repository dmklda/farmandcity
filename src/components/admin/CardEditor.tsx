import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { AdminCard, CardType, CardRarity } from '../../types/admin';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { X, Upload, Eye, Save, Copy, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface CardEditorProps {
  card?: AdminCard | null;
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
    name: '',
    type: 'farm',
    rarity: 'common',
    cost_coins: 0,
    cost_food: 0,
    cost_materials: 0,
    cost_population: 0,
    effect: '',
    effect_logic: '',
    use_per_turn: 1,
    is_reactive: false,
    is_active: true,
    tags: [],
    art_url: '',
    frame_url: ''
  });

  const [artFile, setArtFile] = useState<File | null>(null);
  const [artPreview, setArtPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!card;

  useEffect(() => {
    if (card) {
      setFormData({
        ...card,
        tags: card.tags || []
      });
      if (card.art_url) {
        setArtPreview(card.art_url);
      }
    }
  }, [card]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.effect?.trim()) {
      newErrors.effect = 'Efeito é obrigatório';
    }

    if (formData.cost_coins! < 0 || formData.cost_food! < 0 || 
        formData.cost_materials! < 0 || formData.cost_population! < 0) {
      newErrors.costs = 'Custos não podem ser negativos';
    }

    if (formData.use_per_turn! < 1) {
      newErrors.use_per_turn = 'Uso por turno deve ser pelo menos 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `card-arts/${fileName}`;

    try {
      setUploading(true);
      
      const { error: uploadError } = await supabase.storage
        .from('card-arts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('card-arts')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, art_url: publicUrl }));
      setArtPreview(publicUrl);
      toast.success('Arte enviada com sucesso!');
    } catch (error) {
      console.error('Error uploading art:', error);
      toast.error('Erro ao enviar arte');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setArtFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setArtPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    try {
      setSaving(true);

      // Upload art if new file selected
      if (artFile) {
        await handleFileUpload(artFile);
      }

      const cardData = {
        ...formData,
        slug: formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-'),
        updated_at: new Date().toISOString()
      };

      if (isEditing) {
        const { error } = await supabase
          .from('cards')
          .update(cardData)
          .eq('id', card!.id);

        if (error) throw error;
        toast.success('Carta atualizada com sucesso!');
      } else {
        const { error } = await supabase
          .from('cards')
          .insert([cardData]);

        if (error) throw error;
        toast.success('Carta criada com sucesso!');
      }

      onSave(cardData as AdminCard);
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Erro ao salvar carta');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = () => {
    if (card && onDuplicate) {
      const duplicatedCard = {
        ...card,
        id: undefined,
        name: `${card.name} (Cópia)`,
        slug: undefined,
        created_at: undefined,
        updated_at: undefined
      };
      onDuplicate(duplicatedCard);
    }
  };

  const getRarityColor = (rarity: CardRarity) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800',
      uncommon: 'bg-green-100 text-green-800',
      rare: 'bg-blue-100 text-blue-800',
      ultra: 'bg-purple-100 text-purple-800',
      secret: 'bg-pink-100 text-pink-800',
      legendary: 'bg-yellow-100 text-yellow-800',
      crisis: 'bg-red-100 text-red-800',
      booster: 'bg-indigo-100 text-indigo-800'
    };
    return colors[rarity] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: CardType) => {
    const colors = {
      farm: 'bg-green-100 text-green-800',
      city: 'bg-blue-100 text-blue-800',
      action: 'bg-orange-100 text-orange-800',
      magic: 'bg-purple-100 text-purple-800',
      defense: 'bg-gray-100 text-gray-800',
      trap: 'bg-red-100 text-red-800',
      event: 'bg-yellow-100 text-yellow-800',
      landmark: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold">
              {isEditing ? 'Editar Carta' : 'Nova Carta'}
            </h2>
            <p className="text-muted-foreground">
              {isEditing ? 'Modifique os dados da carta' : 'Crie uma nova carta para o jogo'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing && onDuplicate && (
            <Button variant="outline" onClick={handleDuplicate} className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Duplicar
            </Button>
          )}
          <Button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {showPreview ? 'Ocultar Preview' : 'Preview'}
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor="name">Nome da Carta *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Campo de Trigo"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Type and Rarity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: CardType) => setFormData(prev => ({ ...prev, type: value }))}
                  >
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
                <div>
                  <Label htmlFor="rarity">Raridade *</Label>
                  <Select
                    value={formData.rarity}
                    onValueChange={(value: CardRarity) => setFormData(prev => ({ ...prev, rarity: value }))}
                  >
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
              </div>

              {/* Costs */}
              <div>
                <Label>Custos</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="cost_coins" className="text-sm">Moedas</Label>
                    <Input
                      id="cost_coins"
                      type="number"
                      min="0"
                      value={formData.cost_coins || 0}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost_coins: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost_food" className="text-sm">Comida</Label>
                    <Input
                      id="cost_food"
                      type="number"
                      min="0"
                      value={formData.cost_food || 0}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost_food: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost_materials" className="text-sm">Materiais</Label>
                    <Input
                      id="cost_materials"
                      type="number"
                      min="0"
                      value={formData.cost_materials || 0}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost_materials: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost_population" className="text-sm">População</Label>
                    <Input
                      id="cost_population"
                      type="number"
                      min="0"
                      value={formData.cost_population || 0}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost_population: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                {errors.costs && <p className="text-red-500 text-sm mt-1">{errors.costs}</p>}
              </div>

              {/* Effect */}
              <div>
                <Label htmlFor="effect">Efeito *</Label>
                <Textarea
                  id="effect"
                  value={formData.effect || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, effect: e.target.value }))}
                  placeholder="Descreva o efeito da carta..."
                  rows={3}
                  className={errors.effect ? 'border-red-500' : ''}
                />
                {errors.effect && <p className="text-red-500 text-sm mt-1">{errors.effect}</p>}
              </div>

              {/* Effect Logic */}
              <div>
                <Label htmlFor="effect_logic">Lógica do Efeito (Opcional)</Label>
                <Textarea
                  id="effect_logic"
                  value={formData.effect_logic || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, effect_logic: e.target.value }))}
                  placeholder="Código ou tag para implementação do efeito..."
                  rows={2}
                />
              </div>

              {/* Usage Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="use_per_turn">Uso por Turno</Label>
                  <Input
                    id="use_per_turn"
                    type="number"
                    min="1"
                    value={formData.use_per_turn || 1}
                    onChange={(e) => setFormData(prev => ({ ...prev, use_per_turn: parseInt(e.target.value) || 1 }))}
                  />
                  {errors.use_per_turn && <p className="text-red-500 text-sm mt-1">{errors.use_per_turn}</p>}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_reactive"
                    checked={formData.is_reactive || false}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_reactive: checked }))}
                  />
                  <Label htmlFor="is_reactive">Reativa</Label>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Ativa</Label>
              </div>
            </CardContent>
          </Card>

          {/* Art Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Arte da Carta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Enviando...' : 'Selecionar Imagem'}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  PNG, JPG ou SVG até 5MB
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview da Carta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-64 h-96 mx-auto border-2 border-gray-300 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* Frame based on type and rarity */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getTypeColor(formData.type || 'farm')} opacity-20`} />
                  
                  {/* Art */}
                  {artPreview && (
                    <div className="absolute inset-4">
                      <img
                        src={artPreview}
                        alt="Card Art"
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                  
                  {/* Card Content */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <Badge className={getRarityColor(formData.rarity || 'common')}>
                          {formData.rarity}
                        </Badge>
                        <Badge className={getTypeColor(formData.type || 'farm')}>
                          {formData.type}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Name */}
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-gray-800 drop-shadow-sm">
                        {formData.name || 'Nome da Carta'}
                      </h3>
                    </div>
                    
                    {/* Costs */}
                    <div className="flex justify-center gap-2">
                      {formData.cost_coins! > 0 && (
                        <span className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded text-sm">
                          💰 {formData.cost_coins}
                        </span>
                      )}
                      {formData.cost_food! > 0 && (
                        <span className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded text-sm">
                          🌾 {formData.cost_food}
                        </span>
                      )}
                      {formData.cost_materials! > 0 && (
                        <span className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded text-sm">
                          🏗️ {formData.cost_materials}
                        </span>
                      )}
                      {formData.cost_population! > 0 && (
                        <span className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded text-sm">
                          👥 {formData.cost_population}
                        </span>
                      )}
                    </div>
                    
                    {/* Effect */}
                    <div className="bg-white/80 p-3 rounded text-sm">
                      <p className="text-gray-800">
                        {formData.effect || 'Descrição do efeito da carta...'}
                      </p>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>Uso: {formData.use_per_turn || 1}/turno</span>
                      {formData.is_reactive && <span>🔄 Reativa</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}; 