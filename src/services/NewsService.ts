import { supabase } from '../integrations/supabase/client';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author_id: string;
  author_name?: string;
  author_avatar?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured_image_url?: string;
  read_time_minutes: number;
  views_count: number;
  likes_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
}

export class NewsService {
  // Buscar posts do blog
  static async getPosts(filters?: {
    status?: 'draft' | 'published' | 'archived';
    category?: string;
    author_id?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ success: boolean; posts?: BlogPost[]; error?: string }> {
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.author_id) {
        query = query.eq('author_id', filters.author_id);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Buscar informações dos autores separadamente
      const authorIds = [...new Set(data?.map(post => post.author_id) || [])];
      let authorProfiles: any[] = [];
      
      if (authorIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, username, display_name, avatar_url')
          .in('user_id', authorIds);
        
        authorProfiles = profilesData || [];
      }

      const posts = data?.map(post => {
        const authorProfile = authorProfiles.find(profile => profile.user_id === post.author_id);
        return {
          ...post,
          author_name: authorProfile?.display_name || authorProfile?.username || 'Admin',
          author_avatar: authorProfile?.avatar_url
        };
      }) || [];

      return { success: true, posts };
    } catch (error: any) {
      console.error('Erro ao buscar posts:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar post específico
  static async getPost(postId: string): Promise<{ success: boolean; post?: BlogPost; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;

      // Buscar informações do autor separadamente
      let authorProfile: any = null;
      if (data.author_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_id, username, display_name, avatar_url')
          .eq('user_id', data.author_id)
          .single();
        
        authorProfile = profileData;
      }

      const post = {
        ...data,
        author_name: authorProfile?.display_name || authorProfile?.username || 'Admin',
        author_avatar: authorProfile?.avatar_url
      };

      // Registrar visualização
      await this.recordView(postId);

      return { success: true, post };
    } catch (error: any) {
      console.error('Erro ao buscar post:', error);
      return { success: false, error: error.message };
    }
  }

  // Criar novo post (apenas admin)
  static async createPost(post: {
    title: string;
    content: string;
    excerpt?: string;
    category: string;
    tags?: string[];
    featured_image_url?: string;
    read_time_minutes?: number;
  }): Promise<{ success: boolean; post_id?: string; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Verificar se é admin (implementar verificação de permissão)
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          author_id: user.id,
          category: post.category,
          tags: post.tags || [],
          featured_image_url: post.featured_image_url,
          read_time_minutes: post.read_time_minutes || 5,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, post_id: data.id };
    } catch (error: any) {
      console.error('Erro ao criar post:', error);
      return { success: false, error: error.message };
    }
  }

  // Atualizar post
  static async updatePost(postId: string, updates: Partial<BlogPost>): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('blog_posts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)
        .eq('author_id', user.id); // Apenas o autor pode editar

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao atualizar post:', error);
      return { success: false, error: error.message };
    }
  }

  // Publicar post
  static async publishPost(postId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('blog_posts')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)
        .eq('author_id', user.id);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao publicar post:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar categorias
  static async getCategories(): Promise<{ success: boolean; categories?: BlogCategory[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return { success: true, categories: data || [] };
    } catch (error: any) {
      console.error('Erro ao buscar categorias:', error);
      return { success: false, error: error.message };
    }
  }

  // Registrar visualização
  static async recordView(postId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Incrementar contador de visualizações usando RPC
      const { error: rpcError } = await supabase.rpc('increment_post_views', { post_id: postId });
      if (rpcError) throw rpcError;

      // Registrar visualização individual (opcional, para analytics)
      await supabase
        .from('blog_views')
        .insert({
          post_id: postId,
          user_id: user.id,
          viewed_at: new Date().toISOString()
        })
        .single();

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao registrar visualização:', error);
      return { success: false, error: error.message };
    }
  }

  // Dar like em post
  static async toggleLike(postId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Verificar se já existe like
      const { data: existingLike } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Remover like
        await supabase
          .from('blog_likes')
          .delete()
          .eq('id', existingLike.id);

        // Decrementar contador
        await supabase.rpc('decrement_post_likes', { post_id: postId });
      } else {
        // Adicionar like
        await supabase
          .from('blog_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        // Incrementar contador
        await supabase.rpc('increment_post_likes', { post_id: postId });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao alternar like:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar posts populares
  static async getPopularPosts(limit: number = 5): Promise<{ success: boolean; posts?: BlogPost[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('views_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Buscar informações dos autores separadamente
      const authorIds = [...new Set(data?.map(post => post.author_id) || [])];
      let authorProfiles: any[] = [];
      
      if (authorIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, username, display_name, avatar_url')
          .in('user_id', authorIds);
        
        authorProfiles = profilesData || [];
      }

      const posts = data?.map(post => {
        const authorProfile = authorProfiles.find(profile => profile.user_id === post.author_id);
        return {
          ...post,
          author_name: authorProfile?.display_name || authorProfile?.username || 'Admin',
          author_avatar: authorProfile?.avatar_url
        };
      }) || [];

      return { success: true, posts };
    } catch (error: any) {
      console.error('Erro ao buscar posts populares:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar posts recentes
  static async getRecentPosts(limit: number = 5): Promise<{ success: boolean; posts?: BlogPost[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Buscar informações dos autores separadamente
      const authorIds = [...new Set(data?.map(post => post.author_id) || [])];
      let authorProfiles: any[] = [];
      
      if (authorIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, username, display_name, avatar_url')
          .in('user_id', authorIds);
        
        authorProfiles = profilesData || [];
      }

      const posts = data?.map(post => {
        const authorProfile = authorProfiles.find(profile => profile.user_id === post.author_id);
        return {
          ...post,
          author_name: authorProfile?.display_name || authorProfile?.username || 'Admin',
          author_avatar: authorProfile?.avatar_url
        };
      }) || [];

      return { success: true, posts };
    } catch (error: any) {
      console.error('Erro ao buscar posts recentes:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar estatísticas do blog
  static async getBlogStats(): Promise<{ success: boolean; stats?: any; error?: string }> {
    try {
      const { data: publishedPosts } = await supabase
        .from('blog_posts')
        .select('id', { count: 'exact' })
        .eq('status', 'published');

      const { data: totalViews } = await supabase
        .from('blog_posts')
        .select('views_count');

      const totalViewsCount = totalViews?.reduce((sum, post) => sum + (post.views_count || 0), 0) || 0;

      const { data: totalLikes } = await supabase
        .from('blog_posts')
        .select('likes_count');

      const totalLikesCount = totalLikes?.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0;

      const stats = {
        total_posts: publishedPosts?.length || 0,
        total_views: totalViewsCount,
        total_likes: totalLikesCount,
        average_views_per_post: publishedPosts?.length ? Math.round(totalViewsCount / publishedPosts.length) : 0
      };

      return { success: true, stats };
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      return { success: false, error: error.message };
    }
  }

  // Admin methods
  static async updatePostStatus(postId: string, status: 'draft' | 'published' | 'archived'): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ status: status })
        .eq('id', postId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao atualizar status do post:', error);
      return { success: false, error: error.message };
    }
  }

  static async deletePost(postId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao excluir post:', error);
      return { success: false, error: error.message };
    }
  }
} 