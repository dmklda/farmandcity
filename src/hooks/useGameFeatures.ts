import { useState, useEffect } from 'react';
import { CommunityService, CommunityRanking, CommunityTopic } from '../services/CommunityService';
import { NewsService, BlogPost, BlogCategory } from '../services/NewsService';
import { EventsService, GameEvent, EventParticipant } from '../services/EventsService';
import { AchievementsService, Achievement, PlayerAchievement } from '../services/AchievementsService';
import { MissionsService, Mission, PlayerMission, ActiveDailyMission, ActiveWeeklyMission } from '../services/MissionsService';
import { useAuth } from './useAuth';

export const useGameFeatures = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para dados
  const [communityData, setCommunityData] = useState({
    topics: [] as CommunityTopic[],
    globalRanking: [] as CommunityRanking[],
    localRanking: [] as CommunityRanking[]
  });

  const [newsData, setNewsData] = useState({
    posts: [] as BlogPost[],
    categories: [] as BlogCategory[]
  });

  const [eventsData, setEventsData] = useState({
    events: [] as GameEvent[],
    userParticipations: [] as EventParticipant[]
  });

  const [achievementsData, setAchievementsData] = useState({
    achievements: [] as Achievement[],
    playerAchievements: [] as PlayerAchievement[]
  });

  const [missionsData, setMissionsData] = useState({
    missions: [] as Mission[],
    playerMissions: [] as PlayerMission[],
    dailyMissions: [] as ActiveDailyMission[],
    weeklyMissions: [] as ActiveWeeklyMission[],
    stats: null as any
  });

  // Carregar todos os dados
  const loadAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Carregar dados da comunidade
      const [topicsResult, globalRankingResult, localRankingResult] = await Promise.all([
        CommunityService.getTopics(),
        CommunityService.getRankings('global'),
        CommunityService.getRankings('local')
      ]);

      setCommunityData({
        topics: topicsResult.success ? topicsResult.topics || [] : [],
        globalRanking: globalRankingResult.success ? globalRankingResult.rankings || [] : [],
        localRanking: localRankingResult.success ? localRankingResult.rankings || [] : []
      });

      // Carregar dados de notícias
      const [postsResult, categoriesResult] = await Promise.all([
        NewsService.getPosts(),
        NewsService.getCategories()
      ]);

      setNewsData({
        posts: postsResult.success ? postsResult.posts || [] : [],
        categories: categoriesResult.success ? categoriesResult.categories || [] : []
      });

      // Carregar dados de eventos
      const eventsResult = await EventsService.getEvents();

      setEventsData({
        events: eventsResult.success ? eventsResult.events || [] : [],
        userParticipations: [] // TODO: Implement user participations when method is available
      });

      // Carregar dados de conquistas
      const [achievementsResult, playerAchievementsResult] = await Promise.all([
        AchievementsService.getAchievements(),
        user ? AchievementsService.getPlayerAchievements() : Promise.resolve({ success: true, achievements: [] })
      ]);

      setAchievementsData({
        achievements: achievementsResult.success ? achievementsResult.achievements || [] : [],
        playerAchievements: playerAchievementsResult.success ? playerAchievementsResult.achievements || [] : []
      });

      // Carregar dados de missões
      const [missionsResult, playerMissionsResult, dailyMissionsResult, weeklyMissionsResult, statsResult] = await Promise.all([
        MissionsService.getMissions(),
        user ? MissionsService.getPlayerMissions() : Promise.resolve({ success: true, missions: [] }),
        MissionsService.getActiveDailyMissions(),
        MissionsService.getActiveWeeklyMissions(),
        user ? MissionsService.getMissionStats() : Promise.resolve({ success: true, stats: null })
      ]);

      setMissionsData({
        missions: missionsResult.success ? missionsResult.missions || [] : [],
        playerMissions: playerMissionsResult.success ? playerMissionsResult.missions || [] : [],
        dailyMissions: dailyMissionsResult.success ? dailyMissionsResult.missions || [] : [],
        weeklyMissions: weeklyMissionsResult.success ? weeklyMissionsResult.missions || [] : [],
        stats: statsResult.success ? statsResult.stats : null
      });

    } catch (err: any) {
      console.error('Erro ao carregar dados do jogo:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // Funções para comunidade
  const createTopic = async (topicData: { title: string; content: string; category: string; tags?: string[] }) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };
    
    try {
      const result = await CommunityService.createTopic({
        ...topicData,
        author_id: user.id,
        tags: topicData.tags || [],
        is_pinned: false,
        is_locked: false
      });
      if (result.success) {
        await loadAllData();
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Erro ao criar tópico' };
    }
  };

  const createReply = async (replyData: { topic_id: string; content: string; parent_reply_id?: string }) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };
    
    try {
      const result = await CommunityService.createReply({
        ...replyData,
        author_id: user.id,
        likes_count: 0,
        is_solution: false
      });
      if (result.success) {
        await loadAllData();
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Erro ao criar resposta' };
    }
  };

  // Funções para eventos
  const joinEvent = async (eventId: string) => {
    try {
      const result = await EventsService.joinEvent(eventId);
      if (result.success) {
        await loadAllData();
      }
      return result;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const leaveEvent = async (eventId: string) => {
    try {
      const result = await EventsService.leaveEvent(eventId);
      if (result.success) {
        await loadAllData();
      }
      return result;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Funções para missões
  const claimMissionRewards = async (missionId: string) => {
    try {
      const result = await MissionsService.claimMissionRewards(missionId);
      if (result.success) {
        await loadAllData();
      }
      return result;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateMissionProgress = async (missionId: string, progress: number) => {
    try {
      const result = await MissionsService.updateMissionProgress(missionId, progress);
      if (result.success) {
        await loadAllData();
      }
      return result;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Carregar dados quando o usuário mudar
  useEffect(() => {
    loadAllData();
  }, [user]);

  return {
    // Estados
    loading,
    error,
    communityData,
    newsData,
    eventsData,
    achievementsData,
    missionsData,

    // Funções
    loadAllData,
    createTopic,
    createReply,
    joinEvent,
    leaveEvent,
    claimMissionRewards,
    updateMissionProgress
  };
}; 