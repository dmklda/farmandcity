import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CommunityService } from '../../services/CommunityService';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageSquare, ThumbsUp, Eye, MessageCircle, Trophy, Plus, X, Pin, Lock, Trash2, Users, TrendingUp } from 'lucide-react';

export const CommunityManager: React.FC = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [populatingRankings, setPopulatingRankings] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  });

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    setLoading(true);
    try {
      const result = await CommunityService.getTopics();
      if (result.success && result.topics) {
        setTopics(result.topics);
      }
    } catch (error) {
      console.error('Erro ao carregar tópicos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async () => {
    if (!user?.id) {
      alert('Usuário não autenticado');
      return;
    }

    try {
      console.log('User object:', user);
      console.log('User ID:', user.id);
      console.log('Creating topic with user ID:', user.id);
      
      const topicData = {
        title: newTopic.title,
        content: newTopic.content,
        author_id: user.id,
        category: newTopic.category,
        tags: newTopic.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        is_pinned: false,
        is_locked: false
      };
      
      console.log('Topic data being sent:', topicData);
      
      const result = await CommunityService.createTopic(topicData);

      console.log('Create topic result:', result);

      if (result.success) {
        setNewTopic({ title: '', content: '', category: 'general', tags: '' });
        setShowCreateForm(false);
        loadTopics();
      } else {
        console.error('Failed to create topic:', result.error);
        alert(`Erro ao criar tópico: ${result.error}`);
      }
    } catch (error) {
      console.error('Error in handleCreateTopic:', error);
      alert(`Erro inesperado: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEditTopic = (topic: any) => {
    setEditingTopic(topic);
    setNewTopic({
      title: topic.title,
      content: topic.content,
      category: topic.category,
      tags: topic.tags?.join(', ') || ''
    });
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleUpdateTopic = async () => {
    if (!editingTopic || !user?.id) return;

    try {
      const result = await CommunityService.updateTopic(editingTopic.id, {
        title: newTopic.title,
        content: newTopic.content,
        category: newTopic.category,
        tags: newTopic.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });

      if (result.success) {
        setEditingTopic(null);
        setShowEditForm(false);
        setNewTopic({ title: '', content: '', category: 'general', tags: '' });
        loadTopics();
        alert('Tópico atualizado com sucesso!');
      } else {
        alert(result.error || 'Erro ao atualizar tópico');
      }
    } catch (error) {
      console.error('Erro ao atualizar tópico:', error);
      alert('Erro ao atualizar tópico');
    }
  };

  const handleCancelEdit = () => {
    setEditingTopic(null);
    setShowEditForm(false);
    setNewTopic({ title: '', content: '', category: 'general', tags: '' });
  };

  const handlePopulateRankings = async () => {
    setPopulatingRankings(true);
    try {
      const result = await CommunityService.populateRankings();
      if (result.success) {
        alert('Rankings populados com sucesso!');
      } else {
        alert(result.error || 'Erro ao popular rankings');
      }
    } catch (error) {
      console.error('Erro ao popular rankings:', error);
      alert('Erro ao popular rankings');
    } finally {
      setPopulatingRankings(false);
    }
  };

  const handlePinTopic = async (topicId: string, isPinned: boolean) => {
    try {
      const result = await CommunityService.pinTopic(topicId, isPinned);
      if (result.success) {
        loadTopics();
      }
    } catch (error) {
      console.error('Erro ao fixar tópico:', error);
    }
  };

  const handleLockTopic = async (topicId: string, isLocked: boolean) => {
    try {
      const result = await CommunityService.lockTopic(topicId, isLocked);
      if (result.success) {
        loadTopics();
      }
    } catch (error) {
      console.error('Erro ao bloquear tópico:', error);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (confirm('Tem certeza que deseja excluir este tópico?')) {
      try {
        const result = await CommunityService.deleteTopic(topicId);
        if (result.success) {
          loadTopics();
        }
      } catch (error) {
        console.error('Erro ao excluir tópico:', error);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      general: 'bg-slate-500 hover:bg-slate-600',
      strategy: 'bg-blue-500 hover:bg-blue-600',
      cards: 'bg-green-500 hover:bg-green-600',
      events: 'bg-purple-500 hover:bg-purple-600',
      help: 'bg-yellow-500 hover:bg-yellow-600',
      off_topic: 'bg-red-500 hover:bg-red-600'
    };
    return colors[category] || colors.general;
  };

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      general: 'Geral',
      strategy: 'Estratégia',
      cards: 'Cartas',
      events: 'Eventos',
      help: 'Ajuda',
      off_topic: 'Off Topic'
    };
    return names[category] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Carregando tópicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 p-6 rounded-2xl border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-200 mb-2">Gerenciar Comunidade</h1>
            <p className="text-gray-400">Gerencie tópicos, respostas e moderação da comunidade</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handlePopulateRankings} 
              disabled={populatingRankings}
              variant="outline"
              className="border-2 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 rounded-xl"
            >
              {populatingRankings ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                  Populando...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Popular Rankings
                </>
              )}
            </Button>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Tópico
            </Button>
          </div>
        </div>
      </div>

      {/* Formulário de criação */}
      {showCreateForm && (
        <Card className="shadow-xl border-2 border-purple-500/30 bg-purple-900/10">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                Criar Novo Tópico
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
              <Input
                value={newTopic.title}
                onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                placeholder="Digite o título do tópico..."
                className="w-full p-3 border-2 border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 bg-gray-700 text-gray-200 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
              <Select value={newTopic.category} onValueChange={(value) => setNewTopic({ ...newTopic, category: value })}>
                <SelectTrigger className="w-full p-3 border-2 border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 bg-gray-700 text-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="general" className="text-gray-200 hover:bg-gray-700">Geral</SelectItem>
                  <SelectItem value="strategy" className="text-gray-200 hover:bg-gray-700">Estratégia</SelectItem>
                  <SelectItem value="cards" className="text-gray-200 hover:bg-gray-700">Cartas</SelectItem>
                  <SelectItem value="events" className="text-gray-200 hover:bg-gray-700">Eventos</SelectItem>
                  <SelectItem value="help" className="text-gray-200 hover:bg-gray-700">Ajuda</SelectItem>
                  <SelectItem value="off_topic" className="text-gray-200 hover:bg-gray-700">Off Topic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags (separadas por vírgula)</label>
              <Input
                value={newTopic.tags}
                onChange={(e) => setNewTopic({ ...newTopic, tags: e.target.value })}
                placeholder="tag1, tag2, tag3..."
                className="w-full p-3 border-2 border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 bg-gray-700 text-gray-200 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Conteúdo</label>
              <Textarea
                value={newTopic.content}
                onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                placeholder="Digite o conteúdo do tópico..."
                rows={6}
                className="w-full p-3 border-2 border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none bg-gray-700 text-gray-200 placeholder-gray-400"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={handleCreateTopic} 
                disabled={!newTopic.title || !newTopic.content}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 border-0"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Criar Tópico
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
                className="border-2 border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-2 rounded-xl transition-all duration-200"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário de edição */}
      {showEditForm && editingTopic && (
        <Card className="shadow-xl border-2 border-blue-500/30 bg-blue-900/10">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                Editar Tópico: {editingTopic.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
              <Input
                value={newTopic.title}
                onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                placeholder="Digite o título do tópico..."
                className="w-full p-3 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-700 text-gray-200 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
              <Select value={newTopic.category} onValueChange={(value) => setNewTopic({ ...newTopic, category: value })}>
                <SelectTrigger className="w-full p-3 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-700 text-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="general" className="text-gray-200 hover:bg-gray-700">Geral</SelectItem>
                  <SelectItem value="strategy" className="text-gray-200 hover:bg-gray-700">Estratégia</SelectItem>
                  <SelectItem value="cards" className="text-gray-200 hover:bg-gray-700">Cartas</SelectItem>
                  <SelectItem value="events" className="text-gray-200 hover:bg-gray-700">Eventos</SelectItem>
                  <SelectItem value="help" className="text-gray-200 hover:bg-gray-700">Ajuda</SelectItem>
                  <SelectItem value="off_topic" className="text-gray-200 hover:bg-gray-700">Off Topic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags (separadas por vírgula)</label>
              <Input
                value={newTopic.tags}
                onChange={(e) => setNewTopic({ ...newTopic, tags: e.target.value })}
                placeholder="tag1, tag2, tag3..."
                className="w-full p-3 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-700 text-gray-200 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Conteúdo</label>
              <Textarea
                value={newTopic.content}
                onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                placeholder="Digite o conteúdo do tópico..."
                rows={6}
                className="w-full p-3 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-700 text-gray-200 placeholder-gray-400 resize-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleUpdateTopic}
                disabled={!newTopic.title || !newTopic.content}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl border-0"
              >
                Salvar Edição
              </Button>
              <Button 
                variant="outline"
                onClick={handleCancelEdit}
                className="border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 rounded-xl"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de tópicos */}
      <Card className="shadow-lg border-gray-700 bg-gray-800/50">
        <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-700">
          <CardTitle className="flex items-center gap-2 text-gray-200">
            <Users className="h-5 w-5 text-purple-400" />
            Tópicos da Comunidade ({topics.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {topics.map((topic) => (
              <div key={topic.id} className="p-6 border-2 border-gray-600 rounded-2xl bg-gray-700/50 hover:bg-gray-700 transition-all duration-300 hover:scale-[1.01]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-gray-200">{topic.title}</h3>
                      <Badge className={`${getCategoryColor(topic.category)} text-white font-medium px-3 py-1 rounded-full`}>
                        {getCategoryName(topic.category)}
                      </Badge>
                      {topic.is_pinned && (
                        <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                          <Pin className="h-3 w-3 mr-1" />
                          Fixado
                        </Badge>
                      )}
                      {topic.is_locked && (
                        <Badge variant="destructive" className="bg-red-600/20 text-red-400 border-red-500/30">
                          <Lock className="h-3 w-3 mr-1" />
                          Bloqueado
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      por <span className="font-medium text-purple-400">{topic.author_name}</span> • {formatDistanceToNow(new Date(topic.created_at), { locale: ptBR, addSuffix: true })}
                    </p>
                    <p className="text-gray-300 line-clamp-2 leading-relaxed">
                      {topic.content}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="font-medium">{topic.likes_count}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-medium">{topic.replies_count}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">{topic.views_count}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEditTopic(topic)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0"
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant={topic.is_pinned ? "default" : "outline"}
                      onClick={() => handlePinTopic(topic.id, !topic.is_pinned)}
                      className={`rounded-lg ${topic.is_pinned ? 'bg-yellow-600 hover:bg-yellow-700 border-0' : 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-600/20'}`}
                    >
                      <Pin className="h-3 w-3 mr-1" />
                      {topic.is_pinned ? 'Desfixar' : 'Fixar'}
                    </Button>
                    <Button
                      size="sm"
                      variant={topic.is_locked ? "default" : "outline"}
                      onClick={() => handleLockTopic(topic.id, !topic.is_locked)}
                      className={`rounded-lg ${topic.is_locked ? 'bg-red-600 hover:bg-red-700 border-0' : 'border-red-500/30 text-red-400 hover:bg-red-600/20'}`}
                    >
                      <Lock className="h-3 w-3 mr-1" />
                      {topic.is_locked ? 'Desbloquear' : 'Bloquear'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="rounded-lg bg-red-600 hover:bg-red-700 border-0"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
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