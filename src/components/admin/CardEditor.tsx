import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { AdminCard, CardType, CardRarity } from '../../types/admin';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { X, Upload, Eye, Save, Copy, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { CardValidator } from './CardValidator';
import { cn } from '../../lib/utils';
import './adminStyles.css';

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
      // Sempre definir o artPreview se houver art_url, mesmo se for uma string vazia
      setArtPreview(card.art_url || '');
    } else {
      // Reset para nova carta
      setFormData({
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
      setArtPreview('');
      setArtFile(null);
    }
  }, [card]);

  // Sincronizar artPreview com formData.art_url sempre que houver mudanças
  useEffect(() => {
    if (formData.art_url && formData.art_url !== artPreview) {
      setArtPreview(formData.art_url);
    }
  }, [formData.art_url, artPreview]);

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

      console.log('Uploaded art URL:', publicUrl); // Debug log

      // Atualizar tanto o formData quanto o artPreview
      setFormData(prev => ({ ...prev, art_url: publicUrl }));
      setArtPreview(publicUrl);
      
      // Limpar o arquivo temporário após upload bem-sucedido
      setArtFile(null);
      
      toast.success('Arte enviada com sucesso!');
      return publicUrl; // Retornar a URL para uso no handleSave
    } catch (error) {
      console.error('Error uploading art:', error);
      toast.error('Erro ao enviar arte');
      throw error; // Re-throw para que o handleSave possa capturar
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

      let finalArtUrl = formData.art_url;

      // Upload art if new file selected
      if (artFile) {
        const uploadedUrl = await handleFileUpload(artFile);
        finalArtUrl = uploadedUrl || formData.art_url;
      }

      // Garantir que temos a URL da arte correta
      if (artPreview && !finalArtUrl) {
        finalArtUrl = artPreview;
      }

      const cardData = {
        ...formData,
        art_url: finalArtUrl, // Garantir que a URL da arte seja incluída
        slug: formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-') || 'default-slug',
        updated_at: new Date().toISOString(),
        // Ensure required fields are not undefined
        name: formData.name || '',
        effect: formData.effect || '',
        phase: formData.phase || 'draw',
        rarity: formData.rarity || 'common',
        type: formData.type || 'farm'
      };

      console.log('Saving card with art_url:', finalArtUrl); // Debug log

      if (isEditing) {
        const { data, error } = await supabase
          .from('cards')
          .update(cardData)
          .eq('id', card!.id)
          .select()
          .single();

        if (error) throw error;
        console.log('Updated card data:', data); // Debug log
        toast.success('Carta atualizada com sucesso!');
      } else {
        const { data, error } = await supabase
          .from('cards')
          .insert(cardData)
          .select()
          .single();

        if (error) throw error;
        console.log('Created card data:', data); // Debug log
        toast.success('Carta criada com sucesso!');
      }

      // Atualizar o formData local com os dados salvos
      setFormData(cardData);
      
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
        id: crypto.randomUUID(),
        name: `${card.name} (Cópia)`,
        slug: `${card.slug}-copy-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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

  const getRarityGems = (rarity: CardRarity) => {
    switch (rarity) {
      case 'common': return 1;
      case 'uncommon': return 2;
      case 'rare': return 3;
      case 'ultra': return 4;
      case 'legendary': return 5;
      case 'secret': return 5;
      case 'crisis': return 3;
      case 'booster': return 2;
      default: return 1;
    }
  };

  const getRarityGemColor = (rarity: CardRarity) => {
    switch (rarity) {
      case 'common': return '#9CA3AF';
      case 'uncommon': return '#10B981';
      case 'rare': return '#3B82F6';
      case 'ultra': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      case 'secret': return '#EF4444';
      case 'crisis': return '#DC2626';
      case 'booster': return '#6366F1';
      default: return '#9CA3AF';
    }
  };

  // Card type configuration - EXACTLY like CollectionPage
  const getCardTypeConfig = (type: CardType) => {
    const cardTypeConfig = {
      city: {
        icon: "🏰",
        color: "#8B5A3C",
        gradient: "from-amber-900/20 to-orange-800/20",
        border: "border-amber-700",
        accent: "#D4AF37"
      },
      farm: {
        icon: "🌾",
        color: "#4A7C59",
        gradient: "from-green-800/20 to-emerald-700/20",
        border: "border-green-600",
        accent: "#90EE90"
      },
      magic: {
        icon: "✨",
        color: "#6B46C1",
        gradient: "from-purple-800/20 to-violet-700/20",
        border: "border-purple-600",
        accent: "#9F7AEA"
      },
      landmark: {
        icon: "🏛️",
        color: "#1E40AF",
        gradient: "from-blue-800/20 to-indigo-700/20",
        border: "border-blue-600",
        accent: "#60A5FA"
      },
      event: {
        icon: "📅",
        color: "#DC2626",
        gradient: "from-red-800/20 to-rose-700/20",
        border: "border-red-600",
        accent: "#F87171"
      },
      trap: {
        icon: "🛡️",
        color: "#374151",
        gradient: "from-gray-800/20 to-slate-700/20",
        border: "border-gray-600",
        accent: "#9CA3AF"
      },
      defense: {
        icon: "⚔️",
        color: "#059669",
        gradient: "from-teal-800/20 to-cyan-700/20",
        border: "border-teal-600",
        accent: "#34D399"
      },
      action: {
        icon: "⚡",
        color: "#D97706",
        gradient: "from-orange-800/20 to-amber-700/20",
        border: "border-orange-600",
        accent: "#FBBF24"
      }
    };
    return cardTypeConfig[type] || cardTypeConfig.magic;
  };

  // Rarity configuration - EXACTLY like CollectionPage
  const getRarityConfig = (rarity: CardRarity) => {
    const rarityConfig = {
      common: {
        borderWidth: "border-2",
        glow: "shadow-md",
        gems: 1,
        gemColor: "#9CA3AF",
        frameStyle: "simple"
      },
      uncommon: {
        borderWidth: "border-[3px]",
        glow: "shadow-lg shadow-green-500/20",
        gems: 2,
        gemColor: "#10B981",
        frameStyle: "enhanced"
      },
      rare: {
        borderWidth: "border-[3px]",
        glow: "shadow-lg shadow-blue-500/30",
        gems: 3,
        gemColor: "#3B82F6",
        frameStyle: "ornate"
      },
      ultra: {
        borderWidth: "border-4",
        glow: "shadow-xl shadow-purple-500/40",
        gems: 4,
        gemColor: "#8B5CF6",
        frameStyle: "elaborate"
      },
      legendary: {
        borderWidth: "border-4",
        glow: "shadow-2xl shadow-yellow-500/50",
        gems: 5,
        gemColor: "#F59E0B",
        frameStyle: "legendary"
      },
      secret: {
        borderWidth: "border-4",
        glow: "shadow-2xl shadow-pink-500/50",
        gems: 5,
        gemColor: "#EF4444",
        frameStyle: "legendary"
      },
      crisis: {
        borderWidth: "border-[3px]",
        glow: "shadow-lg shadow-red-500/30",
        gems: 3,
        gemColor: "#DC2626",
        frameStyle: "ornate"
      },
      booster: {
        borderWidth: "border-[3px]",
        glow: "shadow-lg shadow-indigo-500/30",
        gems: 2,
        gemColor: "#6366F1",
        frameStyle: "enhanced"
      }
    };
    return rarityConfig[rarity] || rarityConfig.rare;
    };

  // Helper functions for rendering card elements - EXACTLY like CollectionPage
  const renderGems = (rarity: CardRarity) => {
    const raritySettings = getRarityConfig(rarity);
    return Array.from({ length: raritySettings.gems }).map((_, index) => (
      <div
        key={index}
        className="relative"
      >
        <div 
          className="w-3 h-3 gem-text" 
          data-gem-color={raritySettings.gemColor}
        >
          💎
        </div>
        <div 
          className="absolute inset-0 w-3 h-3 rounded-full blur-sm opacity-60 gem-glow"
          data-gem-color={raritySettings.gemColor}
        />
      </div>
    ));
  };

  const renderOrnateCorners = (type: CardType, rarity: CardRarity) => {
    if (rarity === "common" || rarity === "uncommon") return null;
    
    const typeConfig = getCardTypeConfig(type);

    return (
      <>
        {/* Top corners */}
        <div className="absolute top-2 left-2 w-6 h-6">
          <div 
            className="absolute inset-0 border-l-2 border-t-2 rounded-tl-lg card-ornate-border"
            data-accent-color={typeConfig.accent}
          />
          <div 
            className="absolute top-1 left-1 w-2 h-2 rounded-full card-ornate-dot"
            data-accent-color={typeConfig.accent}
          />
        </div>
        <div className="absolute top-2 right-2 w-6 h-6">
          <div 
            className="absolute inset-0 border-r-2 border-t-2 rounded-tr-lg card-ornate-border"
            data-accent-color={typeConfig.accent}
          />
          <div 
            className="absolute top-1 right-1 w-2 h-2 rounded-full card-ornate-dot"
            data-accent-color={typeConfig.accent}
          />
        </div>

        {/* Bottom corners */}
        <div className="absolute bottom-2 left-2 w-6 h-6">
          <div 
            className="absolute inset-0 border-l-2 border-b-2 rounded-bl-lg card-ornate-border"
            data-accent-color={typeConfig.accent}
          />
          <div 
            className="absolute bottom-1 left-1 w-2 h-2 rounded-full card-ornate-dot"
            data-accent-color={typeConfig.accent}
          />
        </div>
        <div className="absolute bottom-2 right-2 w-6 h-6">
          <div 
            className="absolute inset-0 border-r-2 border-b-2 rounded-br-lg card-ornate-border"
            data-accent-color={typeConfig.accent}
          />
          <div 
            className="absolute bottom-1 right-1 w-2 h-2 rounded-full card-ornate-dot"
            data-accent-color={typeConfig.accent}
          />
        </div>
      </>
    );
  };

  const renderLegendaryEffects = (type: CardType, rarity: CardRarity) => {
    if (rarity !== "legendary") return null;
    
    const typeConfig = getCardTypeConfig(type);

    return (
      <div
        className="absolute inset-0 rounded-xl pointer-events-none legendary-effect"
        data-gradient-color={`${typeConfig.accent}20`}
        data-type={type}
      />
    );
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
                      placeholder="0"
                      value={formData.cost_coins ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                        setFormData(prev => ({ ...prev, cost_coins: value }));
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost_food" className="text-sm">Comida</Label>
                    <Input
                      id="cost_food"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.cost_food ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                        setFormData(prev => ({ ...prev, cost_food: value }));
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost_materials" className="text-sm">Materiais</Label>
                    <Input
                      id="cost_materials"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.cost_materials ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                        setFormData(prev => ({ ...prev, cost_materials: value }));
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost_population" className="text-sm">População</Label>
                    <Input
                      id="cost_population"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.cost_population ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                        setFormData(prev => ({ ...prev, cost_population: value }));
                      }}
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
                
                {/* Card Validator */}
                <CardValidator 
                  effect={formData.effect || ''} 
                  cardType={formData.type || 'farm'} 
                  effect_logic={formData.effect_logic || ''}
                />
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
                             {/* Current Artwork */}
               {(artPreview || formData.art_url) && (
                 <div className="space-y-2">
                   <Label>Arte Atual</Label>
                   <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-300">
                                           <img
                        src={(artPreview || formData.art_url) ?? ''}
                        alt="Current artwork"
                       className="w-full h-full object-cover"
                       onError={(e) => {
                         // Fallback se a imagem falhar ao carregar
                         const target = e.target as HTMLImageElement;
                         target.style.display = 'none';
                         target.nextElementSibling?.classList.remove('hidden');
                       }}
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                   </div>
                   <div className="flex gap-2">
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => {
                         setArtPreview('');
                         setArtFile(null);
                         setFormData(prev => ({ ...prev, art_url: '' }));
                         if (fileInputRef.current) {
                           fileInputRef.current.value = '';
                         }
                       }}
                       className="flex items-center gap-1"
                     >
                       <X className="h-3 w-3" />
                       Remover
                     </Button>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => fileInputRef.current?.click()}
                       className="flex items-center gap-1"
                     >
                       <Upload className="h-3 w-3" />
                       Trocar
                     </Button>
                   </div>
                 </div>
               )}

                             {/* Upload Area */}
               {!artPreview && !formData.art_url && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    aria-label="Selecionar imagem da carta"
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
                  <p className="text-xs text-gray-500 mt-1">
                    A arte será exibida em todo o jogo: hand, deck, coleção, etc.
                  </p>
                </div>
              )}

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Enviando arte...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview da Carta (EXATAMENTE Igual ao Jogo)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-72 h-[28rem] mx-auto">
                  {/* EXACT SAME STRUCTURE AS CollectionPage FullCardComponent */}
                  <div 
                    className={cn(
                      "relative w-full h-full rounded-xl overflow-hidden cursor-pointer select-none card-border",
                      "bg-gradient-to-br from-background to-muted",
                      getCardTypeConfig(formData.type || 'magic').border,
                      getRarityConfig(formData.rarity || 'common').borderWidth,
                      getRarityConfig(formData.rarity || 'common').glow
                    )}
                    data-card-color={getCardTypeConfig(formData.type || 'magic').color}
                  >
                    {/* Legendary rotating border effect */}
                    {renderLegendaryEffects(formData.type || 'magic', formData.rarity || 'common')}

                    {/* Background gradient */}
                    <div className={cn("absolute inset-0 bg-gradient-to-br", getCardTypeConfig(formData.type || 'magic').gradient)} />

                    {/* Ornate corner decorations */}
                    {renderOrnateCorners(formData.type || 'magic', formData.rarity || 'common')}

                    {/* Header section */}
                    <div className="relative p-3 pb-1">
                      <div className="flex items-center justify-between mb-2">
                        {/* Type icon and dice activation */}
                        <div className="flex items-center gap-2">
                          <div 
                            className="p-1.5 rounded-lg border-2 card-type-icon"
                            data-bg-color={`${getCardTypeConfig(formData.type || 'magic').color}20`}
                            data-border-color={getCardTypeConfig(formData.type || 'magic').color}
                          >
                            <span className="text-lg">{getCardTypeConfig(formData.type || 'magic').icon}</span>
                          </div>
                          <div 
                            className="p-1.5 rounded-lg border-2 card-type-icon"
                            data-bg-color={`${getCardTypeConfig(formData.type || 'magic').color}20`}
                            data-border-color={getCardTypeConfig(formData.type || 'magic').color}
                          >
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-white rounded-sm flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-gray-800 rounded-sm"></div>
                              </div>
                              <span className="text-xs font-bold card-text-color" data-text-color={getCardTypeConfig(formData.type || 'magic').color}>
                                {0} {/* Default dice number */}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Rarity gems */}
                        <div className="flex gap-1">
                          {renderGems(formData.rarity || 'common')}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-base text-foreground leading-tight">
                        {formData.name || 'Nome da Carta'}
                      </h3>

                      {/* Rarity indicator */}
                      <div className="flex items-center gap-1 mt-1">
                        {formData.rarity === "legendary" && <span className="text-yellow-500">👑</span>}
                        {(formData.rarity === "ultra" || formData.rarity === "legendary") && <span className="text-purple-400">⭐</span>}
                        <span 
                          className="text-xs font-semibold uppercase tracking-wider card-text-color"
                          data-text-color={getRarityConfig(formData.rarity || 'common').gemColor}
                        >
                          {formData.rarity}
                        </span>
                      </div>
                    </div>

                                         {/* Image section */}
                     <div className="relative mx-4 mb-3 h-40 rounded-lg overflow-hidden border-2 border-border">
                       {(artPreview || formData.art_url) ? (
                                                   <img 
                            src={(artPreview || formData.art_url) ?? ''} 
                            alt={formData.name || 'Card Art'}
                           className="w-full h-full object-cover"
                           onError={(e) => {
                             // Fallback se a imagem falhar ao carregar
                             const target = e.target as HTMLImageElement;
                             target.style.display = 'none';
                             target.nextElementSibling?.classList.remove('hidden');
                           }}
                         />
                       ) : null}
                       {!artPreview && !formData.art_url && (
                         <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                           <div className="text-center">
                             <div className="text-2xl mb-1">🎨</div>
                             <p className="text-xs text-gray-400">Artwork será carregado no painel admin</p>
                           </div>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                     </div>

                    {/* Cost section */}
                    <div className="px-4 mb-2">
                      <div className="flex justify-center items-center gap-2">
                        {formData.cost_coins! > 0 && (
                          <div className="flex items-center gap-1 bg-amber-900/50 border border-amber-600/50 rounded px-2 py-1">
                            <span className="text-amber-400">💰</span>
                            <span className="font-bold text-amber-100 text-sm">{formData.cost_coins}</span>
                          </div>
                        )}
                        {formData.cost_food! > 0 && (
                          <div className="flex items-center gap-1 bg-green-900/50 border border-green-600/50 rounded px-2 py-1">
                            <span className="text-green-400">🌾</span>
                            <span className="font-bold text-green-100 text-sm">{formData.cost_food}</span>
                          </div>
                        )}
                        {formData.cost_materials! > 0 && (
                          <div className="flex items-center gap-1 bg-blue-900/50 border border-blue-600/50 rounded px-2 py-1">
                            <span className="text-blue-400">🏗️</span>
                            <span className="font-bold text-blue-100 text-sm">{formData.cost_materials}</span>
                          </div>
                        )}
                        {formData.cost_population! > 0 && (
                          <div className="flex items-center gap-1 bg-purple-900/50 border border-purple-600/50 rounded px-2 py-1">
                            <span className="text-purple-400">👥</span>
                            <span className="font-bold text-purple-100 text-sm">{formData.cost_population}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="px-4 pb-3">
                      <div 
                        className="text-xs leading-relaxed p-3 rounded-lg border-2 card-description"
                        data-bg-color={`${getCardTypeConfig(formData.type || 'magic').color}15`}
                        data-border-color={`${getCardTypeConfig(formData.type || 'magic').color}40`}
                        data-shadow-color={`${getCardTypeConfig(formData.type || 'magic').color}20`}
                      >
                        {formData.effect || "A magnificent fortress that generates wealth and provides protection for your realm."}
                      </div>
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
