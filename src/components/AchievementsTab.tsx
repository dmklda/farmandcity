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

interface AchievementsTabProps {
  className?: string;
}

export default function AchievementsTab({ className }: AchievementsTabProps) {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [playerAchievements, setPlayerAchievements] = useState<PlayerAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showInProgress, setShowInProgress] = useState(true);

  useEffect(() => {
    loadAchievementsData();
  }, []);

  const loadAchievementsData = async () => {
    setLoading(true);
    try {
      // Carregar todas as conquistas
      const achievementsResult = await AchievementsService.getAchievements();
      if (achievementsResult.success && achievementsResult.achievements) {
        setAchievements(achievementsResult.achievements);
      }

      // Carregar conquistas do jogador
      if (user) {
        const playerAchievementsResult = await AchievementsService.getPlayerAchievements();
        if (playerAchievementsResult.success && playerAchievementsResult.achievements) {
          setPlayerAchievements(playerAchievementsResult.achievements);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlayerAchievement = (achievementId: string) => {
    return playerAchievements.find(pa => pa.achievement_id === achievementId);
  };

  const getAchievementProgress = (achievement: Achievement) => {
    const playerAchievement = getPlayerAchievement(achievement.id);
    if (!playerAchievement) return 0;
    return Math.min(playerAchievement.progress, achievement.max_progress);
  };

  const isAchievementCompleted = (achievement: Achievement) => {
    const playerAchievement = getPlayerAchievement(achievement.id);
    return playerAchievement?.is_completed || false;
  };

  const getRarityColor = (rarity: string) => {
    const colors: { [key: string]: string } = {
      common: 'bg-gray-500 hover:bg-gray-600',
      rare: 'bg-blue-500 hover:bg-blue-600',
      epic: 'bg-purple-500 hover:bg-purple-600',
      legendary: 'bg-yellow-500 hover:bg-yellow-600'
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
      easy: 'bg-green-500 hover:bg-green-600',
      medium: 'bg-yellow-500 hover:bg-yellow-600',
      hard: 'bg-orange-500 hover:bg-orange-600',
      legendary: 'bg-red-500 hover:bg-red-600'
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
      combat: 'Combate',
      exploration: 'Exploração',
      collection: 'Coleção',
      social: 'Social',
      progression: 'Progressão',
      special: 'Especial'
    };
    return names[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      combat: <Target className="h-4 w-4" />,
      exploration: <Star className="h-4 w-4" />,
      collection: <Award className="h-4 w-4" />,
      social: <Sparkles className="h-4 w-4" />,
      progression: <Trophy className="h-4 w-4" />,
      special: <Star className="h-4 w-4" />
    };
    return icons[category] || <Trophy className="h-4 w-4" />;
  };

  const filteredAchievements = achievements.filter(achievement => {
    const isCompleted = isAchievementCompleted(achievement);
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
    const matchesStatus = (isCompleted && showCompleted) || (!isCompleted && showInProgress);
    return matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Carregando conquistas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header com estatísticas */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
        <CardHeader className="pb-4 border-b border-gray-700">
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Suas Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="text-2xl font-bold text-yellow-400">
                {playerAchievements.filter(pa => pa.is_completed).length}
              </div>
              <div className="text-sm text-yellow-300">Concluídas</div>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="text-2xl font-bold text-yellow-400">
                {achievements.length}
              </div>
              <div className="text-sm text-yellow-300">Total</div>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round((playerAchievements.filter(pa => pa.is_completed).length / achievements.length) * 100)}%
              </div>
              <div className="text-sm text-yellow-300">Progresso</div>
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 border-2 border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-gray-700 text-gray-200">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-gray-200 hover:bg-gray-700">Todas as Categorias</SelectItem>
                <SelectItem value="combat" className="text-gray-200 hover:bg-gray-700">Combate</SelectItem>
                <SelectItem value="exploration" className="text-gray-200 hover:bg-gray-700">Exploração</SelectItem>
                <SelectItem value="collection" className="text-gray-200 hover:bg-gray-700">Coleção</SelectItem>
                <SelectItem value="social" className="text-gray-200 hover:bg-gray-700">Social</SelectItem>
                <SelectItem value="progression" className="text-gray-200 hover:bg-gray-700">Progressão</SelectItem>
                <SelectItem value="special" className="text-gray-200 hover:bg-gray-700">Especial</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant={showCompleted ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCompleted(!showCompleted)}
              className={`rounded-xl ${showCompleted ? 'bg-green-600 hover:bg-green-700 border-0' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}`}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Concluídas
            </Button>
            
            <Button
              variant={showInProgress ? "default" : "outline"}
              size="sm"
              onClick={() => setShowInProgress(!showInProgress)}
              className={`rounded-xl ${showInProgress ? 'bg-blue-600 hover:bg-blue-700 border-0' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}`}
            >
              <Clock className="h-4 w-4 mr-2" />
              Em Progresso
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Conquistas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => {
          const isCompleted = isAchievementCompleted(achievement);
          const progress = getAchievementProgress(achievement);
          const progressPercentage = (progress / achievement.max_progress) * 100;

          return (
            <Card 
              key={achievement.id} 
              className={`shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                isCompleted 
                  ? 'border-green-500 bg-green-900/20' 
                  : 'border-gray-600 bg-gray-700/50 hover:border-purple-500/50'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      isCompleted ? 'bg-green-600/20 text-green-400' : 'bg-gray-600 text-gray-400'
                    }`}>
                      {getCategoryIcon(achievement.category)}
                    </div>
                    <div>
                      <CardTitle className={`text-lg ${isCompleted ? 'text-green-400' : 'text-gray-200'}`}>
                        {achievement.name}
                      </CardTitle>
                      <p className="text-sm text-gray-400 mt-1">
                        {getCategoryName(achievement.category)}
                      </p>
                    </div>
                  </div>
                  {isCompleted && (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  {achievement.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progresso</span>
                    <span className="font-medium text-gray-200">
                      {progress} / {achievement.max_progress}
                    </span>
                  </div>
                  <Progress 
                    value={progressPercentage} 
                    className={`h-2 ${isCompleted ? 'bg-green-900' : 'bg-gray-600'}`}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={`${getRarityColor(achievement.rarity)} text-white font-medium`}>
                    {getRarityName(achievement.rarity)}
                  </Badge>
                  <Badge className={`${getDifficultyColor(achievement.difficulty_level)} text-white font-medium`}>
                    {getDifficultyName(achievement.difficulty_level)}
                  </Badge>
                </div>

                {achievement.reward_coins > 0 && (
                  <div className="p-3 bg-yellow-600/10 border border-yellow-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <span className="text-lg">🪙</span>
                      <span className="font-medium">Recompensa: {achievement.reward_coins} moedas</span>
                    </div>
                  </div>
                )}

                {isCompleted && (
                  <div className="p-3 bg-green-600/10 border border-green-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Conquista Desbloqueada!</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <Card className="text-center py-12 bg-gray-800/50 border-gray-700">
          <CardContent>
            <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Nenhuma conquista encontrada</h3>
            <p className="text-gray-500">Tente ajustar os filtros para ver mais conquistas.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 