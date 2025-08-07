import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AchievementsService } from '../../services/AchievementsService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const AchievementsManager: React.FC = () => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    type: 'level',
    requirement_value: 1,
    reward_coins: 0,
    reward_gems: 0,
    rarity: 'common',
    icon: '🏆',
    category: 'general',
    difficulty_level: 'easy',
    max_progress: 1,
    is_hidden: false
  });

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    setLoading(true);
    try {
      const result = await AchievementsService.getAchievements();
      if (result.success && result.achievements) {
        setAchievements(result.achievements);
      }
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAchievement = async () => {
    try {
      const result = await AchievementsService.createAchievement({
        title: newAchievement.title,
        description: newAchievement.description,
        type: newAchievement.type,
        requirement_value: newAchievement.requirement_value,
        reward_coins: newAchievement.reward_coins,
        reward_gems: newAchievement.reward_gems,
        rarity: newAchievement.rarity as 'common' | 'rare' | 'epic' | 'legendary',
        icon: newAchievement.icon,
        category: newAchievement.category,
        difficulty_level: newAchievement.difficulty_level as 'easy' | 'medium' | 'hard' | 'legendary',
        max_progress: newAchievement.max_progress,
        is_hidden: newAchievement.is_hidden
      });

      if (result.success) {
        setNewAchievement({
          title: '',
          description: '',
          type: 'level',
          requirement_value: 1,
          reward_coins: 0,
          reward_gems: 0,
          rarity: 'common',
          icon: '🏆',
          category: 'general',
          difficulty_level: 'easy',
          max_progress: 1,
          is_hidden: false
        });
        setShowCreateForm(false);
        loadAchievements();
      } else {
        alert(result.error || 'Erro ao criar conquista');
      }
    } catch (error) {
      console.error('Erro ao criar conquista:', error);
    }
  };

  const handleEditAchievement = (achievement: any) => {
    setEditingAchievement(achievement);
    setNewAchievement({
      title: achievement.title,
      description: achievement.description,
      type: achievement.type,
      requirement_value: achievement.requirement_value,
      reward_coins: achievement.reward_coins,
      reward_gems: achievement.reward_gems,
      rarity: achievement.rarity,
      icon: achievement.icon,
      category: achievement.category,
      difficulty_level: achievement.difficulty_level,
      max_progress: achievement.max_progress,
      is_hidden: achievement.is_hidden
    });
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleUpdateAchievement = async () => {
    if (!editingAchievement) return;

    try {
      const result = await AchievementsService.updateAchievement(editingAchievement.id, {
        title: newAchievement.title,
        description: newAchievement.description,
        type: newAchievement.type,
        requirement_value: newAchievement.requirement_value,
        reward_coins: newAchievement.reward_coins,
        reward_gems: newAchievement.reward_gems,
        rarity: newAchievement.rarity as 'common' | 'rare' | 'epic' | 'legendary',
        icon: newAchievement.icon,
        category: newAchievement.category,
        difficulty_level: newAchievement.difficulty_level as 'easy' | 'medium' | 'hard' | 'legendary',
        max_progress: newAchievement.max_progress,
        is_hidden: newAchievement.is_hidden
      });

      if (result.success) {
        setEditingAchievement(null);
        setShowEditForm(false);
        setNewAchievement({
          title: '',
          description: '',
          type: 'level',
          requirement_value: 1,
          reward_coins: 0,
          reward_gems: 0,
          rarity: 'common',
          icon: '🏆',
          category: 'general',
          difficulty_level: 'easy',
          max_progress: 1,
          is_hidden: false
        });
        loadAchievements();
        alert('Conquista atualizada com sucesso!');
      } else {
        alert(result.error || 'Erro ao atualizar conquista');
      }
    } catch (error) {
      console.error('Erro ao atualizar conquista:', error);
      alert('Erro ao atualizar conquista');
    }
  };

  const handleCancelEdit = () => {
    setEditingAchievement(null);
    setShowEditForm(false);
    setNewAchievement({
      title: '',
      description: '',
      type: 'level',
      requirement_value: 1,
      reward_coins: 0,
      reward_gems: 0,
      rarity: 'common',
      icon: '🏆',
      category: 'general',
      difficulty_level: 'easy',
      max_progress: 1,
      is_hidden: false
    });
  };

  const handleToggleAchievement = async (achievementId: string, isActive: boolean) => {
    try {
      const result = await AchievementsService.toggleAchievement(achievementId, isActive);
      if (result.success) {
        loadAchievements();
      }
    } catch (error) {
      console.error('Erro ao alterar status da conquista:', error);
    }
  };

  const handleDeleteAchievement = async (achievementId: string) => {
    if (confirm('Tem certeza que deseja excluir esta conquista?')) {
      try {
        const result = await AchievementsService.deleteAchievement(achievementId);
        if (result.success) {
          loadAchievements();
        }
      } catch (error) {
        console.error('Erro ao excluir conquista:', error);
      }
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors: { [key: string]: string } = {
      common: 'bg-gray-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-yellow-500'
    };
    return colors[rarity] || colors.common;
  };

  const getRarityName = (rarity: string) => {
    const names: { [key: string]: string } = {
      common: 'Comum',
      rare: 'Rara',
      epic: 'Épica',
      legendary: 'Lendária'
    };
    return names[rarity] || rarity;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      easy: 'bg-green-500',
      medium: 'bg-yellow-500',
      hard: 'bg-orange-500',
      legendary: 'bg-red-500'
    };
    return colors[difficulty] || colors.easy;
  };

  const getDifficultyName = (difficulty: string) => {
    const names: { [key: string]: string } = {
      easy: 'Fácil',
      medium: 'Médio',
      hard: 'Difícil',
      legendary: 'Lendário'
    };
    return names[difficulty] || difficulty;
  };

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      general: 'Geral',
      collection: 'Coleção',
      gameplay: 'Jogabilidade',
      social: 'Social',
      events: 'Eventos',
      challenges: 'Desafios'
    };
    return names[category] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando conquistas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciar Conquistas</h1>
          <p className="text-gray-300">Crie e gerencie conquistas do jogo</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0">
          Criar Conquista
        </Button>
      </div>

      {/* Formulário de criação */}
      {showCreateForm && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-white">Criar Nova Conquista</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <label className="text-sm font-medium text-gray-300">Título</label>
              <Input
                value={newAchievement.title}
                onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                placeholder="Título da conquista"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Descrição</label>
              <Textarea
                value={newAchievement.description}
                onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                placeholder="Descrição da conquista"
                rows={3}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Tipo</label>
                <Select value={newAchievement.type} onValueChange={(value) => setNewAchievement({ ...newAchievement, type: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="level">Nível</SelectItem>
                    <SelectItem value="collection">Coleção</SelectItem>
                    <SelectItem value="games_played">Partidas Jogadas</SelectItem>
                    <SelectItem value="games_won">Partidas Vencidas</SelectItem>
                    <SelectItem value="cards_collected">Cartas Coletadas</SelectItem>
                    <SelectItem value="events_participated">Eventos Participados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Valor Requerido</label>
                <Input
                  type="number"
                  value={newAchievement.requirement_value}
                  onChange={(e) => setNewAchievement({ ...newAchievement, requirement_value: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Raridade</label>
                <Select value={newAchievement.rarity} onValueChange={(value) => setNewAchievement({ ...newAchievement, rarity: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="common">Comum</SelectItem>
                    <SelectItem value="rare">Rara</SelectItem>
                    <SelectItem value="epic">Épica</SelectItem>
                    <SelectItem value="legendary">Lendária</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Dificuldade</label>
                <Select value={newAchievement.difficulty_level} onValueChange={(value) => setNewAchievement({ ...newAchievement, difficulty_level: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="easy">Fácil</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="hard">Difícil</SelectItem>
                    <SelectItem value="legendary">Lendário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Categoria</label>
                <Select value={newAchievement.category} onValueChange={(value) => setNewAchievement({ ...newAchievement, category: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="general">Geral</SelectItem>
                    <SelectItem value="collection">Coleção</SelectItem>
                    <SelectItem value="gameplay">Jogabilidade</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="events">Eventos</SelectItem>
                    <SelectItem value="challenges">Desafios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Recompensa em Moedas</label>
                <Input
                  type="number"
                  value={newAchievement.reward_coins}
                  onChange={(e) => setNewAchievement({ ...newAchievement, reward_coins: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Recompensa em Gemas</label>
                <Input
                  type="number"
                  value={newAchievement.reward_gems}
                  onChange={(e) => setNewAchievement({ ...newAchievement, reward_gems: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Progresso Máximo</label>
                <Input
                  type="number"
                  value={newAchievement.max_progress}
                  onChange={(e) => setNewAchievement({ ...newAchievement, max_progress: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Ícone</label>
                <Input
                  value={newAchievement.icon}
                  onChange={(e) => setNewAchievement({ ...newAchievement, icon: e.target.value })}
                  placeholder="🏆"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="is_hidden"
                  checked={newAchievement.is_hidden}
                  onChange={(e) => setNewAchievement({ ...newAchievement, is_hidden: e.target.checked })}
                  className="rounded bg-gray-800 border-gray-600"
                />
                <label htmlFor="is_hidden" className="text-sm font-medium text-gray-300">Conquista Oculta</label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateAchievement} disabled={!newAchievement.title || !newAchievement.description} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0">
                Criar Conquista
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário de edição */}
      {showEditForm && editingAchievement && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-white">Editar Conquista</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <label className="text-sm font-medium text-gray-300">Título</label>
              <Input
                value={newAchievement.title}
                onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                placeholder="Título da conquista"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Descrição</label>
              <Textarea
                value={newAchievement.description}
                onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                placeholder="Descrição da conquista"
                rows={3}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Tipo</label>
                <Select value={newAchievement.type} onValueChange={(value) => setNewAchievement({ ...newAchievement, type: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="level">Nível</SelectItem>
                    <SelectItem value="collection">Coleção</SelectItem>
                    <SelectItem value="games_played">Partidas Jogadas</SelectItem>
                    <SelectItem value="games_won">Partidas Vencidas</SelectItem>
                    <SelectItem value="cards_collected">Cartas Coletadas</SelectItem>
                    <SelectItem value="events_participated">Eventos Participados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Valor Requerido</label>
                <Input
                  type="number"
                  value={newAchievement.requirement_value}
                  onChange={(e) => setNewAchievement({ ...newAchievement, requirement_value: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Raridade</label>
                <Select value={newAchievement.rarity} onValueChange={(value) => setNewAchievement({ ...newAchievement, rarity: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="common">Comum</SelectItem>
                    <SelectItem value="rare">Rara</SelectItem>
                    <SelectItem value="epic">Épica</SelectItem>
                    <SelectItem value="legendary">Lendária</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Dificuldade</label>
                <Select value={newAchievement.difficulty_level} onValueChange={(value) => setNewAchievement({ ...newAchievement, difficulty_level: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="easy">Fácil</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="hard">Difícil</SelectItem>
                    <SelectItem value="legendary">Lendário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Categoria</label>
                <Select value={newAchievement.category} onValueChange={(value) => setNewAchievement({ ...newAchievement, category: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="general">Geral</SelectItem>
                    <SelectItem value="collection">Coleção</SelectItem>
                    <SelectItem value="gameplay">Jogabilidade</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="events">Eventos</SelectItem>
                    <SelectItem value="challenges">Desafios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Recompensa em Moedas</label>
                <Input
                  type="number"
                  value={newAchievement.reward_coins}
                  onChange={(e) => setNewAchievement({ ...newAchievement, reward_coins: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Recompensa em Gemas</label>
                <Input
                  type="number"
                  value={newAchievement.reward_gems}
                  onChange={(e) => setNewAchievement({ ...newAchievement, reward_gems: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Progresso Máximo</label>
                <Input
                  type="number"
                  value={newAchievement.max_progress}
                  onChange={(e) => setNewAchievement({ ...newAchievement, max_progress: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Ícone</label>
                <Input
                  value={newAchievement.icon}
                  onChange={(e) => setNewAchievement({ ...newAchievement, icon: e.target.value })}
                  placeholder="🏆"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="is_hidden_edit"
                  checked={newAchievement.is_hidden}
                  onChange={(e) => setNewAchievement({ ...newAchievement, is_hidden: e.target.checked })}
                  className="rounded bg-gray-800 border-gray-600"
                />
                <label htmlFor="is_hidden_edit" className="text-sm font-medium text-gray-300">Conquista Oculta</label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateAchievement} disabled={!newAchievement.title || !newAchievement.description} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0">
                Atualizar Conquista
              </Button>
              <Button variant="outline" onClick={handleCancelEdit} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de conquistas */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-white">Conquistas do Jogo ({achievements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="p-4 border border-gray-700 rounded-lg bg-gray-800">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${getRarityColor(achievement.rarity)} flex items-center justify-center text-white text-xl`}>
                    {achievement.icon}
                  </div>
                                      <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{achievement.title}</h3>
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {getRarityName(achievement.rarity)}
                        </Badge>
                        <Badge variant="outline" className={getDifficultyColor(achievement.difficulty_level)}>
                          {getDifficultyName(achievement.difficulty_level)}
                        </Badge>
                        {achievement.is_hidden && <Badge variant="secondary">Oculta</Badge>}
                        <Badge variant={achievement.is_active ? "default" : "secondary"}>
                          {achievement.is_active ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                        <span>Tipo: {achievement.type}</span>
                        <span>Valor: {achievement.requirement_value}</span>
                        <span>Categoria: {getCategoryName(achievement.category)}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        {achievement.reward_coins > 0 && (
                          <div className="flex items-center gap-1">
                            <span>🪙</span>
                            <span>{achievement.reward_coins} moedas</span>
                          </div>
                        )}
                        {achievement.reward_gems > 0 && (
                          <div className="flex items-center gap-1">
                            <span>💎</span>
                            <span>{achievement.reward_gems} gemas</span>
                          </div>
                        )}
                      </div>
                    </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEditAchievement(achievement)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0"
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant={achievement.is_active ? "outline" : "default"}
                      onClick={() => handleToggleAchievement(achievement.id, !achievement.is_active)}
                      className={achievement.is_active ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "bg-green-600 hover:bg-green-700 text-white rounded-lg border-0"}
                    >
                      {achievement.is_active ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteAchievement(achievement.id)}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-lg border-0"
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 