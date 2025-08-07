import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { NewsService } from '../../services/NewsService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const NewsManager: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'draft',
    featured_image_url: '',
    read_time_minutes: 5
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('Carregando dados de notícias...');
      
      const [postsResult, categoriesResult] = await Promise.all([
        NewsService.getPosts(),
        NewsService.getCategories()
      ]);

      console.log('Resultado posts:', postsResult);
      console.log('Resultado categorias:', categoriesResult);

      if (postsResult.success && postsResult.posts) {
        setPosts(postsResult.posts);
      } else {
        console.error('Erro ao carregar posts:', postsResult.error);
      }

      if (categoriesResult.success && categoriesResult.categories) {
        setCategories(categoriesResult.categories);
        if (categoriesResult.categories.length > 0) {
          setNewPost(prev => ({ ...prev, category: categoriesResult.categories[0].slug }));
        }
      } else {
        console.error('Erro ao carregar categorias:', categoriesResult.error);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      const result = await NewsService.createPost({
        title: newPost.title,
        content: newPost.content,
        excerpt: newPost.excerpt,
        category: newPost.category,
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: newPost.status as 'draft' | 'published' | 'archived',
        featured_image_url: newPost.featured_image_url,
        read_time_minutes: newPost.read_time_minutes
      });

      if (result.success) {
        setNewPost({
          title: '',
          content: '',
          excerpt: '',
          category: categories.length > 0 ? categories[0].slug : '',
          tags: '',
          status: 'draft',
          featured_image_url: '',
          read_time_minutes: 5
        });
        setShowCreateForm(false);
        loadData();
      } else {
        alert(result.error || 'Erro ao criar post');
      }
    } catch (error) {
      console.error('Erro ao criar post:', error);
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      category: post.category,
      tags: post.tags?.join(', ') || '',
      status: post.status,
      featured_image_url: post.featured_image_url || '',
      read_time_minutes: post.read_time_minutes || 5
    });
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;

    try {
      const result = await NewsService.updatePost(editingPost.id, {
        title: newPost.title,
        content: newPost.content,
        excerpt: newPost.excerpt,
        category: newPost.category,
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: newPost.status as 'draft' | 'published' | 'archived',
        featured_image_url: newPost.featured_image_url,
        read_time_minutes: newPost.read_time_minutes
      });

      if (result.success) {
        setEditingPost(null);
        setShowEditForm(false);
        setNewPost({
          title: '',
          content: '',
          excerpt: '',
          category: categories.length > 0 ? categories[0].slug : '',
          tags: '',
          status: 'draft',
          featured_image_url: '',
          read_time_minutes: 5
        });
        loadData();
        alert('Post atualizado com sucesso!');
      } else {
        alert(result.error || 'Erro ao atualizar post');
      }
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      alert('Erro ao atualizar post');
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setShowEditForm(false);
    setNewPost({
      title: '',
      content: '',
      excerpt: '',
      category: categories.length > 0 ? categories[0].slug : '',
      tags: '',
      status: 'draft',
      featured_image_url: '',
      read_time_minutes: 5
    });
  };

  const handleUpdatePostStatus = async (postId: string, status: string) => {
    try {
      const result = await NewsService.updatePostStatus(postId, status as 'draft' | 'published' | 'archived');
      if (result.success) {
        loadData();
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      try {
        const result = await NewsService.deletePost(postId);
        if (result.success) {
          loadData();
        }
      } catch (error) {
        console.error('Erro ao excluir post:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: 'bg-gray-500',
      published: 'bg-green-500',
      archived: 'bg-red-500'
    };
    return colors[status] || colors.draft;
  };

  const getStatusName = (status: string) => {
    const names: { [key: string]: string } = {
      draft: 'Rascunho',
      published: 'Publicado',
      archived: 'Arquivado'
    };
    return names[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Gerenciar Notícias</h1>
          <p className="text-gray-400">Crie e gerencie posts do blog</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Criar Post
        </Button>
      </div>

      {/* Formulário de criação */}
      {showCreateForm && (
        <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-700">
            <CardTitle className="text-gray-200">Criar Novo Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 bg-gray-800/30">
            <div>
              <label className="text-sm font-medium text-gray-300">Título</label>
              <Input
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Título do post"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Resumo</label>
              <Textarea
                value={newPost.excerpt}
                onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                placeholder="Resumo do post"
                rows={3}
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Categoria</label>
                <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug} className="text-gray-200 hover:bg-gray-700">
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Status</label>
                <Select value={newPost.status} onValueChange={(value) => setNewPost({ ...newPost, status: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="draft" className="text-gray-200 hover:bg-gray-700">Rascunho</SelectItem>
                    <SelectItem value="published" className="text-gray-200 hover:bg-gray-700">Publicado</SelectItem>
                    <SelectItem value="archived" className="text-gray-200 hover:bg-gray-700">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Tags (separadas por vírgula)</label>
              <Input
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">URL da Imagem</label>
                <Input
                  value={newPost.featured_image_url}
                  onChange={(e) => setNewPost({ ...newPost, featured_image_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Tempo de Leitura (minutos)</label>
                <Input
                  type="number"
                  value={newPost.read_time_minutes}
                  onChange={(e) => setNewPost({ ...newPost, read_time_minutes: parseInt(e.target.value) || 5 })}
                  min="1"
                  max="60"
                  className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Conteúdo</label>
              <Textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Conteúdo do post (HTML permitido)"
                rows={10}
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreatePost} disabled={!newPost.title || !newPost.content} className="bg-purple-600 hover:bg-purple-700 text-white">
                Criar Post
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)} className="text-gray-300 hover:bg-gray-700">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário de edição */}
      {showEditForm && editingPost && (
        <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-700">
            <CardTitle className="text-gray-200">Editar Post: {editingPost.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 bg-gray-800/30">
            <div>
              <label className="text-sm font-medium text-gray-300">Título</label>
              <Input
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Título do post"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Resumo</label>
              <Textarea
                value={newPost.excerpt}
                onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                placeholder="Resumo do post"
                rows={3}
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Categoria</label>
                <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug} className="text-gray-200 hover:bg-gray-700">
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Status</label>
                <Select value={newPost.status} onValueChange={(value) => setNewPost({ ...newPost, status: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="draft" className="text-gray-200 hover:bg-gray-700">Rascunho</SelectItem>
                    <SelectItem value="published" className="text-gray-200 hover:bg-gray-700">Publicado</SelectItem>
                    <SelectItem value="archived" className="text-gray-200 hover:bg-gray-700">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Tags (separadas por vírgula)</label>
              <Input
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">URL da Imagem</label>
                <Input
                  value={newPost.featured_image_url}
                  onChange={(e) => setNewPost({ ...newPost, featured_image_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Tempo de Leitura (minutos)</label>
                <Input
                  type="number"
                  value={newPost.read_time_minutes}
                  onChange={(e) => setNewPost({ ...newPost, read_time_minutes: parseInt(e.target.value) || 5 })}
                  min="1"
                  max="60"
                  className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Conteúdo</label>
              <Textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Conteúdo do post (HTML permitido)"
                rows={10}
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdatePost} disabled={!newPost.title || !newPost.content} className="bg-purple-600 hover:bg-purple-700 text-white">
                Salvar Edição
              </Button>
              <Button variant="outline" onClick={handleCancelEdit} className="text-gray-300 hover:bg-gray-700">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de posts */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-700">
          <CardTitle className="text-gray-200">Posts do Blog ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent className="bg-gray-800/30">
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="p-4 border rounded-lg border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-100">{post.title}</h3>
                      <Badge className={getStatusColor(post.status)}>
                        {getStatusName(post.status)}
                      </Badge>
                      {post.category && (
                        <Badge variant="outline" className="bg-gray-700 border-gray-600 text-gray-200">
                          {categories.find(c => c.slug === post.category)?.name || post.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      por {post.author_name} • {formatDistanceToNow(new Date(post.created_at), { locale: ptBR, addSuffix: true })}
                    </p>
                    {post.excerpt && (
                      <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <span>👁️</span>
                      <span>{post.views_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>👍</span>
                      <span>{post.likes_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{post.read_time_minutes} min</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={post.status} onValueChange={(value) => handleUpdatePostStatus(post.id, value)} className="bg-gray-700 border-gray-600 text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20">
                      <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="draft" className="text-gray-200 hover:bg-gray-700">Rascunho</SelectItem>
                        <SelectItem value="published" className="text-gray-200 hover:bg-gray-700">Publicado</SelectItem>
                        <SelectItem value="archived" className="text-gray-200 hover:bg-gray-700">Arquivado</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletePost(post.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Excluir
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEditPost(post)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Editar
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