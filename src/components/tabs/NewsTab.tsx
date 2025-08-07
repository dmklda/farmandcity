import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { NewsService, BlogPost, BlogCategory } from '../../services/NewsService';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Eye, ThumbsUp, Calendar, Clock, User, Tag, Filter, Heart, MessageSquare } from 'lucide-react';

interface NewsTabProps {
  className?: string;
}

export default function NewsTab({ className }: NewsTabProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFullPost, setShowFullPost] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadNewsData();
  }, [selectedCategory]);

  const loadNewsData = async () => {
    setLoading(true);
    try {
      console.log('NewsTab: Carregando dados de notícias...');
      
      // Carregar categorias
      const categoriesResult = await NewsService.getCategories();
      console.log('NewsTab: Resultado categorias:', categoriesResult);
      if (categoriesResult.success && categoriesResult.categories) {
        setCategories(categoriesResult.categories);
      } else {
        console.error('NewsTab: Erro ao carregar categorias:', categoriesResult.error);
      }

      // Carregar posts
      const filters = {
        status: 'published' as const,
        ...(selectedCategory !== 'all' ? { category: selectedCategory } : {})
      };
      console.log('NewsTab: Filtros aplicados:', filters);
      
      const postsResult = await NewsService.getPosts(filters);
      console.log('NewsTab: Resultado posts:', postsResult);
      if (postsResult.success && postsResult.posts) {
        setPosts(postsResult.posts);
      } else {
        console.error('NewsTab: Erro ao carregar posts:', postsResult.error);
      }
    } catch (error) {
      console.error('NewsTab: Erro ao carregar notícias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = async (post: BlogPost) => {
    setSelectedPost(post);
    setShowFullPost(true);
    
    // Registrar visualização
    if (user?.id) {
      await NewsService.recordView(post.id);
      // Atualizar contador localmente
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === post.id 
            ? { ...p, views_count: p.views_count + 1 }
            : p
        )
      );
    }
  };

  const handleBackToList = () => {
    setShowFullPost(false);
    setSelectedPost(null);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLikePost = async (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user?.id) {
      alert('Você precisa estar logado para curtir posts');
      return;
    }

    try {
      const result = await NewsService.toggleLike(post.id);
      if (result.success) {
        // Atualizar estado local
        const isLiked = likedPosts.has(post.id);
        if (isLiked) {
          setLikedPosts(prev => {
            const newSet = new Set(prev);
            newSet.delete(post.id);
            return newSet;
          });
          setPosts(prevPosts => 
            prevPosts.map(p => 
              p.id === post.id 
                ? { ...p, likes_count: Math.max(0, p.likes_count - 1) }
                : p
            )
          );
        } else {
          setLikedPosts(prev => new Set([...prev, post.id]));
          setPosts(prevPosts => 
            prevPosts.map(p => 
              p.id === post.id 
                ? { ...p, likes_count: p.likes_count + 1 }
                : p
            )
          );
        }
      } else {
        console.error('Erro ao curtir post:', result.error);
      }
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  const handleLikeFullPost = async (e: React.MouseEvent) => {
    if (!selectedPost || !user?.id) return;
    await handleLikePost(selectedPost, e);
    
    // Atualizar o post selecionado também
    setSelectedPost(prev => prev ? {
      ...prev,
      likes_count: likedPosts.has(prev.id) 
        ? Math.max(0, prev.likes_count - 1)
        : prev.likes_count + 1
    } : null);
  };

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find(c => c.slug === category);
    return categoryData?.color || '#6b7280';
  };

  const getCategoryName = (category: string) => {
    const categoryData = categories.find(c => c.slug === category);
    return categoryData?.name || category;
  };

  const formatReadTime = (minutes: number) => {
    if (minutes < 1) return 'Menos de 1 min';
    if (minutes === 1) return '1 min';
    return `${minutes} mins`;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Carregando notícias...</p>
        </div>
      </div>
    );
  }

  if (showFullPost && selectedPost) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Button 
          variant="outline" 
          onClick={handleBackToList} 
          className="mb-4 bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gray-700/50 hover:border-gray-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar às Notícias
        </Button>

        <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-700">
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge 
                  className="bg-purple-600/20 text-purple-400 border-purple-500/30"
                  style={{ backgroundColor: getCategoryColor(selectedPost.category) + '20', borderColor: getCategoryColor(selectedPost.category) + '30' }}
                >
                  {getCategoryName(selectedPost.category)}
                </Badge>
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDistanceToNow(new Date(selectedPost.published_at || selectedPost.created_at), { locale: ptBR, addSuffix: true })}
                </span>
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatReadTime(selectedPost.read_time_minutes)}
                </span>
              </div>
              
              <CardTitle className="text-2xl text-gray-100">{selectedPost.title}</CardTitle>
              
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-purple-500/30">
                  <AvatarImage src={selectedPost.author_avatar} />
                  <AvatarFallback className="bg-gray-600 text-gray-200">{selectedPost.author_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-200">{selectedPost.author_name}</p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Autor
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="bg-gray-800/30">
            {selectedPost.featured_image_url && (
              <img
                src={selectedPost.featured_image_url}
                alt={selectedPost.title}
                className="w-full h-64 object-cover rounded-lg mb-6 border border-gray-600"
              />
            )}
            
            <div className="prose prose-invert max-w-none text-gray-300">
              <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{selectedPost.views_count} visualizações</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{selectedPost.likes_count} curtidas</span>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLikeFullPost}
                  className={`flex items-center gap-2 ${
                    likedPosts.has(selectedPost.id)
                      ? 'text-red-400 hover:text-red-300'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts.has(selectedPost.id) ? 'fill-current' : ''}`} />
                  {likedPosts.has(selectedPost.id) ? 'Curtido' : 'Curtir'}
                </Button>
              </div>
              
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Tags:
                    </span>
                    {selectedPost.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-gray-700/50 border-gray-600 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header com estatísticas */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
        <CardHeader className="pb-4 border-b border-gray-700">
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <MessageSquare className="h-6 w-6 text-purple-500" />
            Notícias e Atualizações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="text-2xl font-bold text-purple-400">
                {posts.length}
              </div>
              <div className="text-sm text-purple-300">Notícias</div>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="text-2xl font-bold text-purple-400">
                {categories.length}
              </div>
              <div className="text-sm text-purple-300">Categorias</div>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="text-2xl font-bold text-purple-400">
                {posts.reduce((sum, post) => sum + (post.views_count || 0), 0)}
              </div>
              <div className="text-sm text-purple-300">Visualizações</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card className="shadow-md border-gray-700 bg-gray-800/50">
        <CardHeader className="pb-3 border-b border-gray-700">
          <CardTitle className="flex items-center gap-2 text-gray-200">
            <Filter className="h-5 w-5 text-purple-400" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('all')}
              className={selectedCategory === 'all' 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50 hover:border-gray-500'
              }
            >
              Todas as Categorias
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(category.slug)}
                className={selectedCategory === category.slug 
                  ? 'text-white' 
                  : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50 hover:border-gray-500'
                }
                style={selectedCategory === category.slug ? { backgroundColor: category.color } : {}}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card 
            key={post.id} 
            className="cursor-pointer hover:shadow-xl transition-all duration-200 bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600" 
            onClick={() => handlePostClick(post)}
          >
            <CardContent className="p-6">
              <div className="flex gap-4">
                {post.featured_image_url && (
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0 border border-gray-600"
                  />
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge 
                      className="bg-purple-600/20 text-purple-400 border-purple-500/30"
                      style={{ backgroundColor: getCategoryColor(post.category) + '20', borderColor: getCategoryColor(post.category) + '30' }}
                    >
                      {getCategoryName(post.category)}
                    </Badge>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDistanceToNow(new Date(post.published_at || post.created_at), { locale: ptBR, addSuffix: true })}
                    </span>
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatReadTime(post.read_time_minutes)}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-200">{post.title}</h3>
                  
                  {post.excerpt && (
                    <p className="text-gray-400 mb-3 line-clamp-2">{post.excerpt}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 ring-2 ring-purple-500/30">
                        <AvatarImage src={post.author_avatar} />
                        <AvatarFallback className="bg-gray-600 text-gray-200">{post.author_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-300">{post.author_name}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.views_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{post.likes_count}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleLikePost(post, e)}
                        className={`p-1 h-auto ${
                          likedPosts.has(post.id)
                            ? 'text-red-400 hover:text-red-300'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-200">Nenhuma notícia encontrada</h3>
            <p className="text-gray-400">
              {selectedCategory === 'all' 
                ? 'Não há notícias publicadas no momento.'
                : `Não há notícias na categoria "${getCategoryName(selectedCategory)}".`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
