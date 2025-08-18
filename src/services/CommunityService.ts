import { supabase } from '../integrations/supabase/client'
import type { Database } from '../integrations/supabase/types'

type Tables = Database['public']['Tables']
type CommunityTopicRow = Tables['community_topics']['Row']
type CommunityReplyRow = Tables['community_replies']['Row']
type CommunityRankingRow = Tables['community_rankings']['Row']
type ProfileRow = Tables['profiles']['Row']

export interface CommunityTopic {
  id: string
  title: string
  content: string
  author_id: string
  author_name?: string
  author_avatar?: string
  category: string
  tags: string[]
  likes_count: number
  replies_count: number
  views_count: number
  is_pinned: boolean
  is_locked: boolean
  created_at: string
  updated_at: string
}

export interface CommunityReply {
  id: string
  topic_id: string
  author_id: string
  author_name?: string
  author_avatar?: string
  content: string
  parent_reply_id?: string
  likes_count: number
  is_solution: boolean
  created_at: string
  updated_at: string
}

export interface CommunityRanking {
  id: string;
  user_id: string;
  ranking_type: string;
  score: number;
  level: number;
  contributions_count: number;
  last_updated: string;
  user_name?: string;
  user_avatar?: string;
}

export class CommunityService {
  static async getTopics(limit = 20, offset = 0): Promise<{ success: boolean; topics?: CommunityTopic[]; error?: string }> {
    try {
      const { data: topics, error } = await supabase
        .from('community_topics')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      // Get user information separately
      const userIds = [...new Set((topics || []).map(topic => topic.author_id))];
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('user_id, display_name, username, avatar_url')
        .in('user_id', userIds)

      if (usersError) throw usersError

      const userMap = new Map();
      (users || []).forEach(user => {
        userMap.set(user.user_id, user);
      });

      const formattedTopics: CommunityTopic[] = (topics || []).map((topic: CommunityTopicRow) => {
        const user = userMap.get(topic.author_id);
        return {
          id: topic.id,
          title: topic.title,
          content: topic.content,
          author_id: topic.author_id,
          author_name: user?.display_name || user?.username || 'Anonymous',
          author_avatar: user?.avatar_url || undefined,
          category: topic.category || 'general',
          tags: topic.tags || [],
          likes_count: topic.likes_count || 0,
          replies_count: topic.replies_count || 0,
          views_count: topic.views_count || 0,
          is_pinned: topic.is_pinned || false,
          is_locked: topic.is_locked || false,
          created_at: topic.created_at || new Date().toISOString(),
          updated_at: topic.updated_at || new Date().toISOString()
        };
      });

      return { success: true, topics: formattedTopics }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async getTopic(id: string): Promise<{ success: boolean; topic?: CommunityTopic; error?: string }> {
    try {
      const { data: topic, error } = await supabase
        .from('community_topics')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      // Get user information separately
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('display_name, username, avatar_url')
        .eq('user_id', topic.author_id)
        .single()

      if (userError && userError.code !== 'PGRST116') throw userError

      const formattedTopic: CommunityTopic = {
        id: topic.id,
        title: topic.title,
        content: topic.content,
        author_id: topic.author_id,
        author_name: user?.display_name || user?.username || 'Anonymous',
        author_avatar: user?.avatar_url || undefined,
        category: topic.category || 'general',
        tags: topic.tags || [],
        likes_count: topic.likes_count || 0,
        replies_count: topic.replies_count || 0,
        views_count: topic.views_count || 0,
        is_pinned: topic.is_pinned || false,
        is_locked: topic.is_locked || false,
        created_at: topic.created_at || new Date().toISOString(),
        updated_at: topic.updated_at || new Date().toISOString()
      }

      return { success: true, topic: formattedTopic }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async createTopic(topicData: Omit<CommunityTopic, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'replies_count' | 'views_count' | 'author_name' | 'author_avatar'>): Promise<{ success: boolean; topic?: CommunityTopic; error?: string }> {
    try {
      console.log('Creating topic with data:', topicData);
      
      const { data: topic, error } = await supabase
        .from('community_topics')
        .insert({
          title: topicData.title,
          content: topicData.content,
          author_id: topicData.author_id,
          category: topicData.category,
          tags: topicData.tags
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Topic created successfully:', topic);
      return { success: true, topic: topic as any }
    } catch (error) {
      console.error('Error in createTopic:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async updateTopic(topicId: string, updates: Partial<Pick<CommunityTopic, 'title' | 'content' | 'category' | 'tags'>>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('community_topics')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', topicId)

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return { success: true }
    } catch (error) {
      console.error('Error in updateTopic:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async getReplies(topicId: string): Promise<{ success: boolean; replies?: CommunityReply[]; error?: string }> {
    try {
      const { data: replies, error } = await supabase
        .from('community_replies')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Get user information separately
      const userIds = [...new Set((replies || []).map(reply => reply.author_id))];
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('user_id, display_name, username, avatar_url')
        .in('user_id', userIds)

      if (usersError) throw usersError

      const userMap = new Map();
      (users || []).forEach(user => {
        userMap.set(user.user_id, user);
      });

      const formattedReplies: CommunityReply[] = (replies || []).map((reply: CommunityReplyRow) => {
        const user = userMap.get(reply.author_id);
        return {
          id: reply.id,
          topic_id: reply.topic_id,
          author_id: reply.author_id,
          author_name: user?.display_name || user?.username || 'Anonymous',
          author_avatar: user?.avatar_url || undefined,
          content: reply.content,
          parent_reply_id: reply.parent_reply_id || undefined,
          likes_count: reply.likes_count || 0,
          is_solution: reply.is_solution || false,
          created_at: reply.created_at || new Date().toISOString(),
          updated_at: reply.updated_at || new Date().toISOString()
        };
      });

      return { success: true, replies: formattedReplies }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async createReply(replyData: Omit<CommunityReply, 'id' | 'created_at' | 'updated_at' | 'author_name' | 'author_avatar'>): Promise<{ success: boolean; reply?: CommunityReply; error?: string }> {
    try {
      const { data: reply, error } = await supabase
        .from('community_replies')
        .insert({
          topic_id: replyData.topic_id,
          author_id: replyData.author_id,
          content: replyData.content,
          parent_reply_id: replyData.parent_reply_id
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, reply: reply as any }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async getRankings(type: 'global' | 'local'): Promise<{ success: boolean; rankings?: CommunityRanking[]; error?: string }> {
    try {
      const { data: rankings, error } = await supabase
        .from('community_rankings')
        .select('*')
        .eq('ranking_type', type)
        .order('score', { ascending: false })
        .limit(50)

      if (error) throw error

      // Get user information separately
      const userIds = [...new Set((rankings || []).map(ranking => ranking.user_id))];
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('user_id, display_name, username, avatar_url')
        .in('user_id', userIds)

      if (usersError) throw usersError

      const userMap = new Map();
      (users || []).forEach(user => {
        userMap.set(user.user_id, user);
      });

      const formattedRankings: CommunityRanking[] = (rankings || []).map((ranking: CommunityRankingRow) => {
        const user = userMap.get(ranking.user_id);
        return {
          id: ranking.id,
          user_id: ranking.user_id,
          ranking_type: ranking.ranking_type,
          score: ranking.score || 0,
          level: ranking.level || 1,
          contributions_count: ranking.contributions_count || 0,
          last_updated: ranking.last_updated || new Date().toISOString(),
          // Add user info for display
          user_name: user?.display_name || user?.username || 'Anonymous',
          user_avatar: user?.avatar_url || undefined
        };
      });

      return { success: true, rankings: formattedRankings }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async likeContent(targetId: string, targetType: 'topic' | 'reply', userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('community_likes')
        .insert({
          target_id: targetId,
          target_type: targetType,
          user_id: userId
        })

      if (error) throw error

      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async unlikeContent(targetId: string, targetType: 'topic' | 'reply', userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('community_likes')
        .delete()
        .eq('target_id', targetId)
        .eq('target_type', targetType)
        .eq('user_id', userId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async viewTopic(topicId: string, userId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('community_views')
        .insert({
          topic_id: topicId,
          user_id: userId
        })

      if (error) throw error

      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async getUserLikes(userId: string): Promise<{ success: boolean; likes?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('community_likes')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return { success: true, likes: data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Admin methods
  static async populateRankings(): Promise<{ success: boolean; error?: string }> {
    try {
      // Get all players with their levels from player_stats
      const { data: players, error: playersError } = await supabase
        .from('player_stats')
        .select('player_id, level, experience_points')
        .order('level', { ascending: false })

      if (playersError) throw playersError

      if (!players || players.length === 0) {
        return { success: false, error: 'Nenhum jogador encontrado' }
      }

      // Clear existing rankings
      const { error: deleteError } = await supabase
        .from('community_rankings')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

      if (deleteError) throw deleteError

      // Create new rankings
      const rankingData = players.map((player, index) => ({
        user_id: player.player_id,
        ranking_type: 'global',
        score: player.experience_points || 0,
        level: player.level || 1,
        contributions_count: 0,
        last_updated: new Date().toISOString()
      }))

      const { error: insertError } = await supabase
        .from('community_rankings')
        .insert(rankingData)

      if (insertError) throw insertError

      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async pinTopic(topicId: string, isPinned: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('community_topics')
        .update({ is_pinned: isPinned })
        .eq('id', topicId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async lockTopic(topicId: string, isLocked: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('community_topics')
        .update({ is_locked: isLocked })
        .eq('id', topicId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async deleteTopic(topicId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Delete replies first
      const { error: repliesError } = await supabase
        .from('community_replies')
        .delete()
        .eq('topic_id', topicId)

      if (repliesError) throw repliesError

      // Delete likes for the topic
      const { error: likesError } = await supabase
        .from('community_likes')
        .delete()
        .eq('target_id', topicId)
        .eq('target_type', 'topic')

      if (likesError) throw likesError

      // Delete views for the topic
      const { error: viewsError } = await supabase
        .from('community_views')
        .delete()
        .eq('topic_id', topicId)

      if (viewsError) throw viewsError

      // Delete the topic
      const { error: topicError } = await supabase
        .from('community_topics')
        .delete()
        .eq('id', topicId)

      if (topicError) throw topicError

      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
} 