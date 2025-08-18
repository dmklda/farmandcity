import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { CommunityService, CommunityTopic, CommunityReply, CommunityRanking } from '../../services/CommunityService';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageSquare, ThumbsUp, Eye, MessageCircle, Trophy, Home, Plus, X, Send } from 'lucide-react';

interface CommunityTabProps {
  className?: string;
}

export default function CommunityTab({ className }: CommunityTabProps) {
  const { user } = useAuth();
  const [topics, setTopics] = useState<CommunityTopic[]>([]);
  const [globalRanking, setGlobalRanking] = useState<CommunityRanking[]>([]);
  const [localRanking, setLocalRanking] = useState<CommunityRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<CommunityTopic | null>(null);
  const [replies, setReplies] = useState<CommunityReply[]>([]);
  const [newTopicForm, setNewTopicForm] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  });
  const [newReplyForm, setNewReplyForm] = useState({
    content: ''
  });
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [userLikes, setUserLikes] = useState<{ [key: string]: boolean }>({});
  const [replySort, setReplySort] = useState<'recent' | 'oldest' | 'votes'>('recent');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyForms, setReplyForms] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadCommunityData();
    if (user) {
      loadUserLikes();
    }
  }, [user]);

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      // Carregar tópicos
      const topicsResult = await CommunityService.getTopics();
      if (topicsResult.success && topicsResult.topics) {
        setTopics(topicsResult.topics);
      }

      // Carregar rankings
      const globalRankingResult = await CommunityService.getRankings('global');
      if (globalRankingResult.success && globalRankingResult.rankings) {
        setGlobalRanking(globalRankingResult.rankings);
      }

      const localRankingResult = await CommunityService.getRankings('local');
      if (localRankingResult.success && localRankingResult.rankings) {
        setLocalRanking(localRankingResult.rankings);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da comunidade:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserLikes = async () => {
    if (!user) return;
    try {
      const result = await CommunityService.getUserLikes(user.id);
      if (result.success && result.likes) {
        const likesMap: { [key: string]: boolean } = {};
        result.likes.forEach((like: any) => {
          likesMap[`${like.target_type}_${like.target_id}`] = true;
        });
        setUserLikes(likesMap);
      }
    } catch (error) {
      // Silenciar erro
    }
  };

  const handleCreateTopic = async () => {
    if (!user) {
      alert('Você precisa estar logado para criar um tópico');
      return;
    }

    if (!newTopicForm.title.trim() || !newTopicForm.content.trim()) {
      alert('Título e conteúdo são obrigatórios');
      return;
    }

    try {
      const topicData = {
        title: newTopicForm.title.trim(),
        content: newTopicForm.content.trim(),
        author_id: user.id,
        category: newTopicForm.category,
        tags: newTopicForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        is_pinned: false,
        is_locked: false
      };
      const result = await CommunityService.createTopic(topicData);
      if (result.success) {
        setNewTopicForm({ title: '', content: '', category: 'general', tags: '' });
        setShowNewTopicForm(false);
        loadCommunityData();
      } else {
        alert(`Erro ao criar tópico: ${result.error}`);
      }
    } catch (error) {
      alert(`Erro inesperado: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCreateReply = async () => {
    if (!user || !selectedTopic) return;
    try {
      const replyData = {
        topic_id: selectedTopic.id,
        author_id: user.id,
        content: newReplyForm.content,
        likes_count: 0,
        is_solution: false
      };
      const result = await CommunityService.createReply(replyData);
      if (result.success) {
        setNewReplyForm({ content: '' });
        loadTopicReplies(selectedTopic.id);
      } else {
        alert(result.error || 'Erro ao criar resposta');
      }
    } catch (error) {
      alert('Erro ao criar resposta');
    }
  };

  const handleReplyToReply = async (parentReplyId: string) => {
    if (!user || !selectedTopic) return;
    const content = replyForms[parentReplyId]?.trim();
    if (!content) return;
    const replyData = {
      topic_id: selectedTopic.id,
      author_id: user.id,
      content,
      parent_reply_id: parentReplyId,
      likes_count: 0,
      is_solution: false
    };
    const result = await CommunityService.createReply(replyData);
    if (result.success) {
      setReplyForms((prev) => ({ ...prev, [parentReplyId]: '' }));
      setReplyingTo(null);
      loadTopicReplies(selectedTopic.id);
    }
  };

  const loadTopicReplies = async (topicId: string) => {
    try {
      const result = await CommunityService.getReplies(topicId);
      if (result.success && result.replies) {
        setReplies(result.replies);
      }
    } catch (error) {
      console.error('Erro ao carregar respostas:', error);
    }
  };

  const handleTopicClick = async (topic: CommunityTopic) => {
    setSelectedTopic(topic);
    if (user) {
      await CommunityService.viewTopic(topic.id, user.id);
    } else {
      await CommunityService.viewTopic(topic.id);
    }
    await loadTopicReplies(topic.id);
  };

  const handleLikeTopic = async (topicId: string) => {
    if (!user) return;
    const likeKey = `topic_${topicId}`;
    try {
      if (userLikes[likeKey]) {
        const result = await CommunityService.unlikeContent(topicId, 'topic', user.id);
        if (result.success) {
          setUserLikes((prev) => ({ ...prev, [likeKey]: false }));
          loadCommunityData();
        }
      } else {
        const result = await CommunityService.likeContent(topicId, 'topic', user.id);
        if (result.success) {
          setUserLikes((prev) => ({ ...prev, [likeKey]: true }));
          loadCommunityData();
        }
      }
    } catch (error) {}
  };

  const handleLikeReply = async (replyId: string) => {
    if (!user) return;
    const likeKey = `reply_${replyId}`;
    try {
      if (userLikes[likeKey]) {
        const result = await CommunityService.unlikeContent(replyId, 'reply', user.id);
        if (result.success) {
          setUserLikes((prev) => ({ ...prev, [likeKey]: false }));
          loadTopicReplies(selectedTopic!.id);
        }
      } else {
        const result = await CommunityService.likeContent(replyId, 'reply', user.id);
        if (result.success) {
          setUserLikes((prev) => ({ ...prev, [likeKey]: true }));
          loadTopicReplies(selectedTopic!.id);
        }
      }
    } catch (error) {}
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      general: 'bg-gray-600 hover:bg-gray-700',
      strategy: 'bg-blue-600 hover:bg-blue-700',
      cards: 'bg-green-600 hover:bg-green-700',
      events: 'bg-purple-600 hover:bg-purple-700',
      help: 'bg-yellow-600 hover:bg-yellow-700',
      off_topic: 'bg-red-600 hover:bg-red-700'
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
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Carregando comunidade...</p>
        </div>
      </div>
    );
  }

  const renderReplies = (parentId: string | null = null, level = 0) =>
    [...replies]
      .filter(r => (r.parent_reply_id || null) === parentId)
      .sort((a, b) => {
        if (replySort === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (replySort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (replySort === 'votes') return b.likes_count - a.likes_count;
        return 0;
      })
      .map((reply) => (
        <div key={reply.id} className={`p-5 border-2 border-gray-600 rounded-xl bg-gray-700/50 hover:bg-gray-700 transition-all duration-200 ml-${level * 6}`}> {/* indent */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-blue-500/30">
                <AvatarImage src={reply.author_avatar} />
                <AvatarFallback className="bg-gray-600 text-gray-200 font-semibold">
                  {reply.author_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-200">{reply.author_name}</p>
                <p className="text-sm text-gray-400">
                  {formatDistanceToNow(new Date(reply.created_at), { locale: ptBR, addSuffix: true })}
                </p>
              </div>
            </div>
            {reply.is_solution && (
              <Badge className="bg-green-600/20 text-green-400 border-green-500/30 font-medium">
                ✅ Solução
              </Badge>
            )}
          </div>
          
          <p className="text-gray-300 mb-4 leading-relaxed">{reply.content}</p>

          <div className="flex items-center justify-between">
            <button
              onClick={() => handleLikeReply(reply.id)}
              className={`flex items-center gap-2 text-sm transition-colors duration-200 ${userLikes[`reply_${reply.id}`] ? 'text-blue-400' : 'hover:text-blue-400 text-gray-400'}`}
              disabled={!user}
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="font-medium">{reply.likes_count}</span>
            </button>
            {/* Só mostrar botão Responder para comentários de primeiro nível */}
            {level === 0 && (
              <button
                onClick={() => setReplyingTo(reply.id)}
                className="ml-4 text-xs text-blue-300 hover:underline"
                disabled={!user}
              >Responder</button>
            )}
          </div>
          {/* Só mostrar campo de resposta para comentários de primeiro nível */}
          {level === 0 && replyingTo === reply.id && (
            <div className="mt-2 flex gap-2">
              <Textarea
                value={replyForms[reply.id] || ''}
                onChange={e => setReplyForms(prev => ({ ...prev, [reply.id]: e.target.value }))}
                placeholder="Digite sua resposta..."
                className="flex-1 min-h-[60px] bg-gray-800 text-gray-200 border-gray-600 rounded-lg"
              />
              <Button
                onClick={() => handleReplyToReply(reply.id)}
                disabled={!replyForms[reply.id]?.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >Enviar</Button>
              <Button variant="ghost" onClick={() => setReplyingTo(null)} className="text-gray-400">Cancelar</Button>
            </div>
          )}
          {/* Não renderizar sub-respostas de subcomentários */}
          {level === 0 && renderReplies(reply.id, level + 1)}
        </div>
      ));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Rankings removidos temporariamente para futuras atualizações */}
      {/*
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
          <CardHeader className="pb-3 border-b border-gray-700">
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Ranking Global
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {globalRanking.slice(0, 5).map((player, index) => (
                <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 border border-gray-600 hover:bg-gray-700 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-600 text-yellow-100 font-bold text-sm">
                      #{index + 1}
                    </div>
                    <Avatar className="h-10 w-10 ring-2 ring-yellow-500/30">
                      <AvatarImage src={player.user_avatar} />
                      <AvatarFallback className="bg-gray-600 text-gray-200">
                        {player.user_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-semibold text-gray-200">{player.user_name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-yellow-400">Nível {player.level}</div>
                    <div className="text-xs text-yellow-300">
                      {player.score} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
          <CardHeader className="pb-3 border-b border-gray-700">
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Home className="h-5 w-5 text-blue-500" />
              Ranking Local
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {localRanking.slice(0, 5).map((player, index) => (
                <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 border border-gray-600 hover:bg-gray-700 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-blue-100 font-bold text-sm">
                      #{index + 1}
                    </div>
                    <Avatar className="h-10 w-10 ring-2 ring-blue-500/30">
                      <AvatarImage src={player.user_avatar} />
                      <AvatarFallback className="bg-gray-600 text-gray-200">
                        {player.user_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-semibold text-gray-200">{player.user_name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-blue-400">Nível {player.level}</div>
                    <div className="text-xs text-blue-300">
                      {player.score} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      */}

      {/* Tópicos e Discussões */}
      <Card className="shadow-xl border-gray-700 bg-gray-800/50">
        <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-gray-200">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              Discussões da Comunidade
            </CardTitle>
            {user && (
              <Button 
                onClick={() => setShowNewTopicForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Tópico
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {showNewTopicForm && (
            <div className="mb-8 p-6 border-2 border-dashed border-purple-500/30 rounded-2xl bg-purple-900/10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-200">Criar Novo Tópico</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewTopicForm(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
                  <Input
                    type="text"
                    placeholder="Digite o título do seu tópico..."
                    value={newTopicForm.title}
                    onChange={(e) => setNewTopicForm({ ...newTopicForm, title: e.target.value })}
                    className="w-full p-3 border-2 border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 bg-gray-700 text-gray-200 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
                  <Select value={newTopicForm.category} onValueChange={(value) => setNewTopicForm({ ...newTopicForm, category: value })}>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags (opcional)</label>
                  <Input
                    type="text"
                    placeholder="tag1, tag2, tag3..."
                    value={newTopicForm.tags}
                    onChange={(e) => setNewTopicForm({ ...newTopicForm, tags: e.target.value })}
                    className="w-full p-3 border-2 border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 bg-gray-700 text-gray-200 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Conteúdo</label>
                  <Textarea
                    placeholder="Digite o conteúdo do seu tópico..."
                    value={newTopicForm.content}
                    onChange={(e) => setNewTopicForm({ ...newTopicForm, content: e.target.value })}
                    className="w-full p-3 border-2 border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 min-h-[120px] resize-none bg-gray-700 text-gray-200 placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={handleCreateTopic} 
                    disabled={!newTopicForm.title || !newTopicForm.content}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 border-0"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Criar Tópico
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewTopicForm(false)}
                    className="border-2 border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-2 rounded-xl transition-all duration-200"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                  selectedTopic?.id === topic.id 
                    ? 'border-purple-500 bg-purple-900/20 shadow-lg' 
                    : topic.is_pinned
                      ? 'border-yellow-500/50 bg-yellow-900/10 shadow-md'
                      : 'border-gray-600 bg-gray-700/50 hover:border-purple-500/50'
                }`}
                onClick={() => handleTopicClick(topic)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-purple-500/30">
                      <AvatarImage src={topic.author_avatar} />
                      <AvatarFallback className="bg-gray-600 text-gray-200 font-semibold">
                        {topic.author_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg text-gray-200 mb-1">{topic.title}</h3>
                      <p className="text-sm text-gray-400">
                        por <span className="font-medium text-purple-400">{topic.author_name}</span> • {formatDistanceToNow(new Date(topic.created_at), { locale: ptBR, addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getCategoryColor(topic.category)} text-white font-medium px-3 py-1 rounded-full`}>
                    {getCategoryName(topic.category)}
                  </Badge>
                </div>
                
                <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                  {topic.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeTopic(topic.id);
                      }}
                      className={`flex items-center gap-2 transition-colors duration-200 ${userLikes[`topic_${topic.id}`] ? 'text-purple-400' : 'hover:text-purple-400 text-gray-400'}`}
                      disabled={!user}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="font-medium">{topic.likes_count}</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-medium">{topic.replies_count}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">{topic.views_count}</span>
                    </div>
                  </div>
                  {topic.is_pinned && (
                    <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="17" x2="12" y2="22"></line>
                        <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                      </svg>
                      Fixado
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Respostas do Tópico Selecionado */}
      {selectedTopic && (
        <Card className="shadow-xl border-gray-700 bg-gray-800/50">
          <CardHeader className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-200">
                <MessageCircle className="h-5 w-5 text-blue-400" />
                Respostas - {selectedTopic.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTopic(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Formulário de resposta */}
            {user && (
              <div className="mb-6 p-4 border-2 border-dashed border-blue-500/30 rounded-xl bg-blue-900/10">
                <h4 className="font-semibold text-gray-200 mb-3">Adicionar Resposta</h4>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Digite sua resposta..."
                    value={newReplyForm.content}
                    onChange={(e) => setNewReplyForm({ content: e.target.value })}
                    className="w-full p-3 border-2 border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 min-h-[100px] resize-none bg-gray-700 text-gray-200 placeholder-gray-400"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleCreateReply}
                      disabled={!newReplyForm.content.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 border-0"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Resposta
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <label className="text-gray-300 font-medium">Ordenar por:</label>
              <Select value={replySort} onValueChange={v => setReplySort(v as 'recent' | 'oldest' | 'votes')}>
                <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="recent">Mais recente</SelectItem>
                  <SelectItem value="oldest">Mais antigo</SelectItem>
                  <SelectItem value="votes">Mais votado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">{renderReplies()}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
