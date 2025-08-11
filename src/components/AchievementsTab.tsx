import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AchievementsService, Achievement, PlayerAchievement } from '../services/AchievementsService';
import { useAuth } from '../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trophy, Star, Target, Filter, CheckCircle, Clock, Award, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ALL_VICTORY_ACHIEVEMENTS, getVictoryAchievementsByCategory, getVictoryAchievementsByRarity, getVictoryAchievementsByDifficulty } from '../data/achievementsData';
import { CardDescription } from './ui/card';

interface AchievementsTabProps {
  className?: string;
}

export default function AchievementsTab({ className }: AchievementsTabProps) {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<PlayerAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showInProgress, setShowInProgress] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const [allAchievementsResult, userAchievementsResult] = await Promise.all([
        AchievementsService.getAchievements(),
        AchievementsService.getPlayerAchievements()
      ]);
      
      // Combinar conquistas padrão com conquistas de vitória
      const allAchievementsCombined = [
        ...(allAchievementsResult.achievements || []), 
        ...ALL_VICTORY_ACHIEVEMENTS
      ];
      setAchievements(allAchievementsCombined);
      setUserAchievements(userAchievementsResult.achievements || []);
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAchievementProgress = (achievementId: string) => {
    const userAchievement = userAchievements.find(ua => ua.achievement_id === achievementId);
    if (!userAchievement) return 0;
    return userAchievement.progress || 0;
  };

  const isAchievementUnlocked = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId);
  };

  const getAchievementStatus = (achievement: Achievement) => {
    const isUnlocked = isAchievementUnlocked(achievement.id);
    const progress = getAchievementProgress(achievement.id);
    const maxProgress = achievement.max_progress || 1;
    
    return {
      isUnlocked,
      progress,
      maxProgress,
      percentage: Math.min((progress / maxProgress) * 100, 100)
    };
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'legendary': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderAchievementCard = (achievement: Achievement) => {
    const status = getAchievementStatus(achievement);
    
    return (
      <Card key={achievement.id} className={`transition-all duration-300 ${
        status.isUnlocked ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-lg'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{achievement.icon}</span>
              <div>
                <CardTitle className="text-lg">{achievement.title}</CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={getRarityColor(achievement.rarity)}>
                {achievement.rarity}
              </Badge>
              <Badge className={getDifficultyColor(achievement.difficulty_level)}>
                {achievement.difficulty_level}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Barra de progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{status.progress} / {status.maxProgress}</span>
              </div>
              <Progress value={status.percentage} className="h-2" />
            </div>
            
            {/* Recompensas */}
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-yellow-600">💰</span>
                <span>{achievement.reward_coins} moedas</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-600">💎</span>
                <span>{achievement.reward_gems} gemas</span>
              </div>
            </div>
            
            {/* Status */}
            {status.isUnlocked && (
              <div className="text-center">
                <Badge className="bg-green-500 text-white">
                  ✓ Desbloqueado
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderAchievementsGrid = (achievementsToRender: Achievement[]) => {
    if (achievementsToRender.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Nenhuma conquista encontrada nesta categoria.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievementsToRender.map(renderAchievementCard)}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const unlockedCount = userAchievements.length;
  const totalCount = achievements.length;
  const completionPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Conquistas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{unlockedCount}</div>
            <div className="text-sm text-gray-600">Conquistas Desbloqueadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{totalCount}</div>
            <div className="text-sm text-gray-600">Total de Conquistas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{completionPercentage.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Conclusão</div>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={completionPercentage} className="h-3" />
        </div>
      </div>

      {/* Tabs de categorias */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="victory">Vitória</TabsTrigger>
          <TabsTrigger value="collection">Coleção</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="special">Especiais</TabsTrigger>
          <TabsTrigger value="hidden">Ocultas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <h3 className="text-xl font-semibold">Todas as Conquistas</h3>
          {renderAchievementsGrid(achievements)}
        </TabsContent>

        <TabsContent value="victory" className="space-y-4">
          <h3 className="text-xl font-semibold">Conquistas de Vitória</h3>
          {renderAchievementsGrid(getVictoryAchievementsByCategory('victory'))}
        </TabsContent>

        <TabsContent value="collection" className="space-y-4">
          <h3 className="text-xl font-semibold">Conquistas de Coleção</h3>
          {renderAchievementsGrid(achievements.filter(a => a.category === 'collection'))}
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <h3 className="text-xl font-semibold">Conquistas Sociais</h3>
          {renderAchievementsGrid(achievements.filter(a => a.category === 'social'))}
        </TabsContent>

        <TabsContent value="special" className="space-y-4">
          <h3 className="text-xl font-semibold">Conquistas Especiais</h3>
          {renderAchievementsGrid(achievements.filter(a => a.category === 'special'))}
        </TabsContent>

        <TabsContent value="hidden" className="space-y-4">
          <h3 className="text-xl font-semibold">Conquistas Ocultas</h3>
          {renderAchievementsGrid(achievements.filter(a => a.is_hidden))}
        </TabsContent>
      </Tabs>

      {/* Filtros adicionais */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-3">Filtros Avançados</h4>
        <div className="flex flex-wrap gap-2">
          <select 
            className="px-3 py-2 border rounded-md text-sm"
            aria-label="Filtrar por raridade"
            onChange={(e) => {
              const rarity = e.target.value;
              if (rarity) {
                const filtered = getVictoryAchievementsByRarity(rarity);
                setAchievements([...achievements.filter(a => !a.type.startsWith('victory_')), ...filtered]);
              }
            }}
          >
            <option value="">Todas as raridades</option>
            <option value="common">Comum</option>
            <option value="rare">Rara</option>
            <option value="epic">Épica</option>
            <option value="legendary">Lendária</option>
          </select>

          <select 
            className="px-3 py-2 border rounded-md text-sm"
            aria-label="Filtrar por dificuldade"
            onChange={(e) => {
              const difficulty = e.target.value;
              if (difficulty) {
                const filtered = getVictoryAchievementsByDifficulty(difficulty);
                setAchievements([...achievements.filter(a => !a.type.startsWith('victory_')), ...filtered]);
              }
            }}
          >
            <option value="">Todas as dificuldades</option>
            <option value="easy">Fácil</option>
            <option value="medium">Médio</option>
            <option value="hard">Difícil</option>
            <option value="legendary">Lendário</option>
          </select>
        </div>
      </div>
    </div>
  );
} 