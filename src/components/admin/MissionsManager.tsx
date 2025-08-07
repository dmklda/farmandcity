import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MissionsService } from '../../services/MissionsService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const MissionsManager: React.FC = () => {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMission, setEditingMission] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newMission, setNewMission] = useState({
    title: '',
    description: '',
    type: 'daily',
    objective: '',
    target_value: 1,
    reward_coins: 0,
    reward_gems: 0,
    reward_cards: '',
    difficulty: 'easy',
    category: 'general',
    auto_reset: true,
    reset_interval: 'daily',
    max_daily_completions: 1,
    target_audience: 'all',
    audience_criteria: '',
    start_date: '',
    end_date: '',
    is_active: true
  });

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    setLoading(true);
    try {
      const result = await MissionsService.getMissions();
      if (result.success && result.missions) {
        setMissions(result.missions);
      }
    } catch (error) {
      console.error('Erro ao carregar missões:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMission = async () => {
    try {
      const result = await MissionsService.createMission({
        title: newMission.title,
        description: newMission.description,
        type: newMission.type as 'daily' | 'weekly' | 'global' | 'specific',
        objective: newMission.objective,
        target_value: newMission.target_value,
        reward_coins: newMission.reward_coins,
        reward_gems: newMission.reward_gems,
        reward_cards: newMission.reward_cards.split(',').map(card => card.trim()).filter(card => card),
        difficulty: newMission.difficulty as 'easy' | 'medium' | 'hard' | 'legendary',
        category: newMission.category,
        auto_reset: newMission.auto_reset,
        reset_interval: newMission.reset_interval as 'daily' | 'weekly' | 'monthly',
        max_daily_completions: newMission.max_daily_completions,
        target_audience: newMission.target_audience as 'all' | 'specific_level' | 'specific_class' | 'specific_region',
        audience_criteria: newMission.audience_criteria,
        start_date: newMission.start_date || null,
        end_date: newMission.end_date || null,
        is_active: newMission.is_active
      });

      if (result.success) {
        setNewMission({
          title: '',
          description: '',
          type: 'daily',
          objective: '',
          target_value: 1,
          reward_coins: 0,
          reward_gems: 0,
          reward_cards: '',
          difficulty: 'easy',
          category: 'general',
          auto_reset: true,
          reset_interval: 'daily',
          max_daily_completions: 1,
          target_audience: 'all',
          audience_criteria: '',
          start_date: '',
          end_date: '',
          is_active: true
        });
        setShowCreateForm(false);
        loadMissions();
      } else {
        alert(result.error || 'Erro ao criar missão');
      }
    } catch (error) {
      console.error('Erro ao criar missão:', error);
    }
  };

  const handleEditMission = (mission: any) => {
    setEditingMission(mission);
    setNewMission({
      title: mission.title,
      description: mission.description,
      type: mission.mission_type,
      objective: mission.objective,
      target_value: mission.requirement_value,
      reward_coins: mission.reward_coins,
      reward_gems: mission.reward_gems,
      reward_cards: mission.reward_cards ? mission.reward_cards.join(', ') : '',
      difficulty: mission.difficulty,
      category: mission.category,
      auto_reset: mission.auto_reset,
      reset_interval: mission.reset_interval,
      max_daily_completions: mission.max_daily_completions,
      target_audience: mission.target_audience,
      audience_criteria: mission.audience_criteria,
      start_date: mission.start_date || '',
      end_date: mission.end_date || '',
      is_active: mission.is_active
    });
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleUpdateMission = async () => {
    if (!editingMission) return;

    try {
      const result = await MissionsService.updateMission(editingMission.id, {
        title: newMission.title,
        description: newMission.description,
        type: newMission.type as 'daily' | 'weekly' | 'global' | 'specific',
        objective: newMission.objective,
        target_value: newMission.target_value,
        reward_coins: newMission.reward_coins,
        reward_gems: newMission.reward_gems,
        reward_cards: newMission.reward_cards.split(',').map(card => card.trim()).filter(card => card),
        difficulty: newMission.difficulty as 'easy' | 'medium' | 'hard' | 'legendary',
        category: newMission.category,
        auto_reset: newMission.auto_reset,
        reset_interval: newMission.reset_interval as 'daily' | 'weekly' | 'monthly',
        max_daily_completions: newMission.max_daily_completions,
        target_audience: newMission.target_audience as 'all' | 'specific_level' | 'specific_class' | 'specific_region',
        audience_criteria: newMission.audience_criteria,
        start_date: newMission.start_date || null,
        end_date: newMission.end_date || null,
        is_active: newMission.is_active
      });

      if (result.success) {
        setEditingMission(null);
        setShowEditForm(false);
        setNewMission({
          title: '',
          description: '',
          type: 'daily',
          objective: '',
          target_value: 1,
          reward_coins: 0,
          reward_gems: 0,
          reward_cards: '',
          difficulty: 'easy',
          category: 'general',
          auto_reset: true,
          reset_interval: 'daily',
          max_daily_completions: 1,
          target_audience: 'all',
          audience_criteria: '',
          start_date: '',
          end_date: '',
          is_active: true
        });
        loadMissions();
        alert('Missão atualizada com sucesso!');
      } else {
        alert(result.error || 'Erro ao atualizar missão');
      }
    } catch (error) {
      console.error('Erro ao atualizar missão:', error);
      alert('Erro ao atualizar missão');
    }
  };

  const handleCancelEdit = () => {
    setEditingMission(null);
    setShowEditForm(false);
    setNewMission({
      title: '',
      description: '',
      type: 'daily',
      objective: '',
      target_value: 1,
      reward_coins: 0,
      reward_gems: 0,
      reward_cards: '',
      difficulty: 'easy',
      category: 'general',
      auto_reset: true,
      reset_interval: 'daily',
      max_daily_completions: 1,
      target_audience: 'all',
      audience_criteria: '',
      start_date: '',
      end_date: '',
      is_active: true
    });
  };

  const handleToggleMission = async (missionId: string, isActive: boolean) => {
    try {
      const result = await MissionsService.toggleMission(missionId, isActive);
      if (result.success) {
        loadMissions();
      }
    } catch (error) {
      console.error('Erro ao alterar status da missão:', error);
    }
  };

  const handleDeleteMission = async (missionId: string) => {
    if (confirm('Tem certeza que deseja excluir esta missão?')) {
      try {
        const result = await MissionsService.deleteMission(missionId);
        if (result.success) {
          loadMissions();
        }
      } catch (error) {
        console.error('Erro ao excluir missão:', error);
      }
    }
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      daily: 'bg-blue-500',
      weekly: 'bg-purple-500',
      global: 'bg-green-500',
      specific: 'bg-orange-500'
    };
    return colors[type] || colors.daily;
  };

  const getTypeName = (type: string) => {
    const names: { [key: string]: string } = {
      daily: 'Diária',
      weekly: 'Semanal',
      global: 'Global',
      specific: 'Específica'
    };
    return names[type] || type;
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
          <p className="text-gray-300">Carregando missões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciar Missões</h1>
          <p className="text-gray-300">Crie e gerencie missões do jogo</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0">
          Criar Missão
        </Button>
      </div>

      {/* Formulário de criação */}
      {showCreateForm && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-white">Criar Nova Missão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <label className="text-sm font-medium text-gray-300">Título</label>
              <Input
                value={newMission.title}
                onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                placeholder="Título da missão"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Descrição</label>
              <Textarea
                value={newMission.description}
                onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                placeholder="Descrição da missão"
                rows={3}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Tipo</label>
                <Select value={newMission.type} onValueChange={(value) => setNewMission({ ...newMission, type: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="daily">Diária</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="specific">Específica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Objetivo</label>
                <Input
                  value={newMission.objective}
                  onChange={(e) => setNewMission({ ...newMission, objective: e.target.value })}
                  placeholder="Ex: Jogar 5 partidas"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Valor Alvo</label>
                <Input
                  type="number"
                  value={newMission.target_value}
                  onChange={(e) => setNewMission({ ...newMission, target_value: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Dificuldade</label>
                <Select value={newMission.difficulty} onValueChange={(value) => setNewMission({ ...newMission, difficulty: value })}>
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
                <Select value={newMission.category} onValueChange={(value) => setNewMission({ ...newMission, category: value })}>
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
                  value={newMission.reward_coins}
                  onChange={(e) => setNewMission({ ...newMission, reward_coins: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Recompensa em Gemas</label>
                <Input
                  type="number"
                  value={newMission.reward_gems}
                  onChange={(e) => setNewMission({ ...newMission, reward_gems: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Cartas (separadas por vírgula)</label>
                <Input
                  value={newMission.reward_cards}
                  onChange={(e) => setNewMission({ ...newMission, reward_cards: e.target.value })}
                  placeholder="carta1, carta2, carta3"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Reset Automático</label>
                <Select value={newMission.reset_interval} onValueChange={(value) => setNewMission({ ...newMission, reset_interval: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Máximo de Completamentos/Dia</label>
                <Input
                  type="number"
                  value={newMission.max_daily_completions}
                  onChange={(e) => setNewMission({ ...newMission, max_daily_completions: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Público-Alvo</label>
                <Select value={newMission.target_audience} onValueChange={(value) => setNewMission({ ...newMission, target_audience: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="specific_level">Nível Específico</SelectItem>
                    <SelectItem value="specific_class">Classe Específica</SelectItem>
                    <SelectItem value="specific_region">Região Específica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Critérios do Público</label>
                <Input
                  value={newMission.audience_criteria}
                  onChange={(e) => setNewMission({ ...newMission, audience_criteria: e.target.value })}
                  placeholder="Ex: level_10, warrior, north_region"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Data de Início</label>
                <Input
                  type="datetime-local"
                  value={newMission.start_date}
                  onChange={(e) => setNewMission({ ...newMission, start_date: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Data de Fim</label>
                <Input
                  type="datetime-local"
                  value={newMission.end_date}
                  onChange={(e) => setNewMission({ ...newMission, end_date: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="auto_reset"
                checked={newMission.auto_reset}
                onChange={(e) => setNewMission({ ...newMission, auto_reset: e.target.checked })}
                className="rounded bg-gray-800 border-gray-600"
              />
              <label htmlFor="auto_reset" className="text-sm font-medium text-gray-300">Reset Automático</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={newMission.is_active}
                onChange={(e) => setNewMission({ ...newMission, is_active: e.target.checked })}
                className="rounded bg-gray-800 border-gray-600"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-300">Missão Ativa</label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateMission} disabled={!newMission.title || !newMission.description} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0">
                Criar Missão
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário de edição */}
      {showEditForm && editingMission && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-white">Editar Missão: {editingMission.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <label className="text-sm font-medium text-gray-300">Título</label>
              <Input
                value={newMission.title}
                onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                placeholder="Título da missão"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Descrição</label>
              <Textarea
                value={newMission.description}
                onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                placeholder="Descrição da missão"
                rows={3}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Tipo</label>
                <Select value={newMission.type} onValueChange={(value) => setNewMission({ ...newMission, type: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="daily">Diária</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="specific">Específica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Objetivo</label>
                <Input
                  value={newMission.objective}
                  onChange={(e) => setNewMission({ ...newMission, objective: e.target.value })}
                  placeholder="Ex: Jogar 5 partidas"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Valor Alvo</label>
                <Input
                  type="number"
                  value={newMission.target_value}
                  onChange={(e) => setNewMission({ ...newMission, target_value: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Dificuldade</label>
                <Select value={newMission.difficulty} onValueChange={(value) => setNewMission({ ...newMission, difficulty: value })}>
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
                <Select value={newMission.category} onValueChange={(value) => setNewMission({ ...newMission, category: value })}>
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
                  value={newMission.reward_coins}
                  onChange={(e) => setNewMission({ ...newMission, reward_coins: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Recompensa em Gemas</label>
                <Input
                  type="number"
                  value={newMission.reward_gems}
                  onChange={(e) => setNewMission({ ...newMission, reward_gems: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Cartas (separadas por vírgula)</label>
                <Input
                  value={newMission.reward_cards}
                  onChange={(e) => setNewMission({ ...newMission, reward_cards: e.target.value })}
                  placeholder="carta1, carta2, carta3"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Reset Automático</label>
                <Select value={newMission.reset_interval} onValueChange={(value) => setNewMission({ ...newMission, reset_interval: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Máximo de Completamentos/Dia</label>
                <Input
                  type="number"
                  value={newMission.max_daily_completions}
                  onChange={(e) => setNewMission({ ...newMission, max_daily_completions: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Público-Alvo</label>
                <Select value={newMission.target_audience} onValueChange={(value) => setNewMission({ ...newMission, target_audience: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="specific_level">Nível Específico</SelectItem>
                    <SelectItem value="specific_class">Classe Específica</SelectItem>
                    <SelectItem value="specific_region">Região Específica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Critérios do Público</label>
                <Input
                  value={newMission.audience_criteria}
                  onChange={(e) => setNewMission({ ...newMission, audience_criteria: e.target.value })}
                  placeholder="Ex: level_10, warrior, north_region"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Data de Início</label>
                <Input
                  type="datetime-local"
                  value={newMission.start_date}
                  onChange={(e) => setNewMission({ ...newMission, start_date: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Data de Fim</label>
                <Input
                  type="datetime-local"
                  value={newMission.end_date}
                  onChange={(e) => setNewMission({ ...newMission, end_date: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="auto_reset_edit"
                checked={newMission.auto_reset}
                onChange={(e) => setNewMission({ ...newMission, auto_reset: e.target.checked })}
                className="rounded bg-gray-800 border-gray-600"
              />
              <label htmlFor="auto_reset_edit" className="text-sm font-medium text-gray-300">Reset Automático</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active_edit"
                checked={newMission.is_active}
                onChange={(e) => setNewMission({ ...newMission, is_active: e.target.checked })}
                className="rounded bg-gray-800 border-gray-600"
              />
              <label htmlFor="is_active_edit" className="text-sm font-medium text-gray-300">Missão Ativa</label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateMission} disabled={!newMission.title || !newMission.description} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0">
                Atualizar Missão
              </Button>
              <Button variant="outline" onClick={handleCancelEdit} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de missões */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-white">Missões do Jogo ({missions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {missions.map((mission) => (
              <div key={mission.id} className="p-4 border border-gray-700 rounded-lg bg-gray-800">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{mission.title}</h3>
                      <Badge className={getTypeColor(mission.mission_type)}>
                        {getTypeName(mission.mission_type)}
                      </Badge>
                      <Badge variant="outline" className={getDifficultyColor(mission.difficulty)}>
                        {getDifficultyName(mission.difficulty)}
                      </Badge>
                      <Badge variant={mission.is_active ? "default" : "secondary"}>
                        {mission.is_active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      {mission.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                      <span>Objetivo: {mission.objective}</span>
                      <span>Alvo: {mission.requirement_value}</span>
                      <span>Categoria: {getCategoryName(mission.category)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {mission.reward_coins > 0 && (
                        <div className="flex items-center gap-1">
                          <span>🪙</span>
                          <span>{mission.reward_coins} moedas</span>
                        </div>
                      )}
                      {mission.reward_gems > 0 && (
                        <div className="flex items-center gap-1">
                          <span>💎</span>
                          <span>{mission.reward_gems} gemas</span>
                        </div>
                      )}
                      {mission.reward_cards && mission.reward_cards.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span>🃏</span>
                          <span>{mission.reward_cards.length} cartas</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    {mission.auto_reset && (
                      <div className="flex items-center gap-1">
                        <span>🔄</span>
                        <span>Reset {mission.reset_interval}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span>📊</span>
                      <span>Máx: {mission.max_daily_completions}/dia</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEditMission(mission)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0"
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant={mission.is_active ? "outline" : "default"}
                      onClick={() => handleToggleMission(mission.id, !mission.is_active)}
                      className={mission.is_active ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "bg-green-600 hover:bg-green-700 text-white rounded-lg border-0"}
                    >
                      {mission.is_active ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteMission(mission.id)}
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