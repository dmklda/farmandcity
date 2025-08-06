import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Trophy, 
  Star, 
  Shield, 
  Award, 
  Zap, 
  Crown,
  Sword
} from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: string;
  requirement_value: number;
  reward_coins: number;
  reward_gems: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  is_active: boolean;
  created_at: string;
}

const ACHIEVEMENT_TYPES = [
  { value: 'cards_collected', label: 'Cartas Coletadas' },
  { value: 'decks_created', label: 'Decks Criados' },
  { value: 'games_won', label: 'Jogos Vencidos' },
  { value: 'farms_built', label: 'Fazendas Construídas' },
  { value: 'cities_built', label: 'Cidades Construídas' },
  { value: 'max_level', label: 'Nível Máximo' },
  { value: 'experience', label: 'Pontos de Experiência' }
];

const ACHIEVEMENT_ICONS = [
  { value: 'Trophy', label: 'Troféu', icon: Trophy },
  { value: 'Star', label: 'Estrela', icon: Star },
  { value: 'Shield', label: 'Escudo', icon: Shield },
  { value: 'Award', label: 'Prêmio', icon: Award },
  { value: 'Zap', label: 'Raio', icon: Zap },
  { value: 'Crown', label: 'Coroa', icon: Crown },
  { value: 'Sword', label: 'Espada', icon: Sword }
];

const ACHIEVEMENT_RARITIES = [
  { value: 'common', label: 'Comum', color: 'bg-gray-500' },
  { value: 'rare', label: 'Rara', color: 'bg-blue-500' },
  { value: 'epic', label: 'Épica', color: 'bg-purple-500' },
  { value: 'legendary', label: 'Lendária', color: 'bg-yellow-500' }
];

export const AchievementManager: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    requirement_value: 0,
    reward_coins: 0,
    reward_gems: 0,
    rarity: 'common' as const,
    icon: 'Trophy',
    is_active: true
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('requirement_value', { ascending: true });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error: any) {
      console.error('Error fetching achievements:', error);
      toast.error('Erro ao carregar conquistas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingAchievement(null);
    setFormData({
      title: '',
      description: '',
      type: '',
      requirement_value: 0,
      reward_coins: 0,
      reward_gems: 0,
      rarity: 'common',
      icon: 'Trophy',
      is_active: true
    });
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsCreating(false);
    setFormData({
      title: achievement.title,
      description: achievement.description,
      type: achievement.type,
      requirement_value: achievement.requirement_value,
      reward_coins: achievement.reward_coins,
      reward_gems: achievement.reward_gems,
      rarity: achievement.rarity,
      icon: achievement.icon,
      is_active: achievement.is_active
    });
  };

  const handleCancel = () => {
    setEditingAchievement(null);
    setIsCreating(false);
    setFormData({
      title: '',
      description: '',
      type: '',
      requirement_value: 0,
      reward_coins: 0,
      reward_gems: 0,
      rarity: 'common',
      icon: 'Trophy',
      is_active: true
    });
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.description || !formData.type) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      if (editingAchievement) {
        // Atualizar conquista existente
        const { error } = await supabase
          .from('achievements')
          .update({
            title: formData.title,
            description: formData.description,
            type: formData.type,
            requirement_value: formData.requirement_value,
            reward_coins: formData.reward_coins,
            reward_gems: formData.reward_gems,
            rarity: formData.rarity,
            icon: formData.icon,
            is_active: formData.is_active
          })
          .eq('id', editingAchievement.id);

        if (error) throw error;
        toast.success('Conquista atualizada com sucesso!');
      } else {
        // Criar nova conquista
        const { error } = await supabase
          .from('achievements')
          .insert({
            title: formData.title,
            description: formData.description,
            type: formData.type,
            requirement_value: formData.requirement_value,
            reward_coins: formData.reward_coins,
            reward_gems: formData.reward_gems,
            rarity: formData.rarity,
            icon: formData.icon,
            is_active: formData.is_active
          });

        if (error) throw error;
        toast.success('Conquista criada com sucesso!');
      }

      handleCancel();
      fetchAchievements();
    } catch (error: any) {
      console.error('Error saving achievement:', error);
      toast.error('Erro ao salvar conquista');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conquista?')) return;

    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Conquista excluída com sucesso!');
      fetchAchievements();
    } catch (error: any) {
      console.error('Error deleting achievement:', error);
      toast.error('Erro ao excluir conquista');
    }
  };

  const getRarityColor = (rarity: string) => {
    const rarityData = ACHIEVEMENT_RARITIES.find(r => r.value === rarity);
    return rarityData?.color || 'bg-gray-500';
  };

  const getIconComponent = (iconName: string) => {
    const iconData = ACHIEVEMENT_ICONS.find(i => i.value === iconName);
    return iconData?.icon || Trophy;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-white/60 mt-2">Carregando conquistas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          Gerenciar Conquistas
        </h2>
        <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Conquista
        </Button>
      </div>

      {/* Formulário de Criação/Edição */}
      {(isCreating || editingAchievement) && (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">
              {editingAchievement ? 'Editar Conquista' : 'Nova Conquista'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-white">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nome da conquista"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="type" className="text-white">Tipo *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACHIEVEMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição da conquista"
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="requirement" className="text-white">Valor Requerido</Label>
                <Input
                  id="requirement"
                  type="number"
                  value={formData.requirement_value}
                  onChange={(e) => setFormData({ ...formData, requirement_value: parseInt(e.target.value) || 0 })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="reward_coins" className="text-white">Recompensa (Moedas)</Label>
                <Input
                  id="reward_coins"
                  type="number"
                  value={formData.reward_coins}
                  onChange={(e) => setFormData({ ...formData, reward_coins: parseInt(e.target.value) || 0 })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="reward_gems" className="text-white">Recompensa (Gemas)</Label>
                <Input
                  id="reward_gems"
                  type="number"
                  value={formData.reward_gems}
                  onChange={(e) => setFormData({ ...formData, reward_gems: parseInt(e.target.value) || 0 })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="rarity" className="text-white">Raridade</Label>
                <Select value={formData.rarity} onValueChange={(value: any) => setFormData({ ...formData, rarity: value })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACHIEVEMENT_RARITIES.map((rarity) => (
                      <SelectItem key={rarity.value} value={rarity.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${rarity.color}`}></div>
                          {rarity.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon" className="text-white">Ícone</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACHIEVEMENT_ICONS.map((icon) => {
                      const IconComponent = icon.icon;
                      return (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {icon.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active" className="text-white">Ativa</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Conquistas */}
      <div className="grid gap-4">
        {achievements.map((achievement) => {
          const IconComponent = getIconComponent(achievement.icon);
          return (
            <Card key={achievement.id} className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${getRarityColor(achievement.rarity)}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{achievement.title}</h3>
                      <p className="text-sm text-white/70">{achievement.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className={getRarityColor(achievement.rarity)}>
                          {ACHIEVEMENT_RARITIES.find(r => r.value === achievement.rarity)?.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {ACHIEVEMENT_TYPES.find(t => t.value === achievement.type)?.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {achievement.requirement_value}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm text-white/60">Recompensas:</div>
                      <div className="text-sm text-white">
                        {achievement.reward_coins > 0 && <span className="text-yellow-400 mr-2">🪙 {achievement.reward_coins}</span>}
                        {achievement.reward_gems > 0 && <span className="text-purple-400">💎 {achievement.reward_gems}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(achievement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(achievement.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                {!achievement.is_active && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                      Inativa
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {achievements.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6 text-center">
            <p className="text-white/60">Nenhuma conquista encontrada.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 