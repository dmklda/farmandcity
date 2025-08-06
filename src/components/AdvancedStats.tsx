import React, { useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { usePlayerStats } from '../hooks/usePlayerStats';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Trophy, 
  Star, 
  Clock,
  Award,
  Zap,
  Shield,
  Sword,
  Users,
  Activity
} from 'lucide-react';

interface AdvancedStatsProps {
  playerCards: any[];
  decks: any[];
  currency: { coins: number; gems: number } | null;
}

export const AdvancedStats: React.FC<AdvancedStatsProps> = ({
  playerCards,
  decks,
  currency
}) => {
  const { 
    stats, 
    achievements, 
    playerAchievements, 
    loading, 
    error,
    getWinRate,
    getPlaytimeHours,
    getCompletedAchievements,
    getAchievementProgress,
    checkAchievements
  } = usePlayerStats();

  // Verificar conquistas quando o componente monta
  useEffect(() => {
    if (stats && achievements.length > 0) {
      checkAchievements();
    }
  }, [stats, achievements, checkAchievements]);

  const performanceMetrics = useMemo(() => [
    {
      title: "Taxa de Vitória",
      value: `${getWinRate()}%`,
      change: stats ? "+5.2%" : "0%",
      changeType: "positive" as const,
      icon: Trophy,
      color: "text-yellow-400",
      progress: getWinRate()
    },
    {
      title: "Partidas Jogadas",
      value: stats?.games_played.toString() || "0",
      change: stats ? "+12" : "0",
      changeType: "positive" as const,
      icon: Target,
      color: "text-blue-400",
      progress: stats ? Math.min((stats.games_played / 100) * 100, 100) : 0
    },
    {
      title: "Tempo de Jogo",
      value: `${getPlaytimeHours()}h`,
      change: stats ? "+8h" : "0h",
      changeType: "positive" as const,
      icon: Clock,
      color: "text-green-400",
      progress: stats ? Math.min((getPlaytimeHours() / 200) * 100, 100) : 0
    },
    {
      title: "Nível Atual",
      value: stats?.level.toString() || "1",
      change: stats ? "+3" : "0",
      changeType: "positive" as const,
      icon: Star,
      color: "text-purple-400",
      progress: stats ? Math.min((stats.level / 100) * 100, 100) : 0
    }
  ], [stats, getWinRate, getPlaytimeHours]);

  const getRarityColor = useCallback((rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  }, []);

  const getActivityIcon = useCallback((type: string) => {
    switch (type) {
      case 'farms_built': return <Shield className="h-4 w-4" />;
      case 'cards_collected': return <Star className="h-4 w-4" />;
      case 'cities_built': return <Award className="h-4 w-4" />;
      case 'max_level': return <Zap className="h-4 w-4" />;
      case 'games_won': return <Trophy className="h-4 w-4" />;
      case 'decks_created': return <Sword className="h-4 w-4" />;
      case 'experience': return <TrendingUp className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  }, []);

  const getRarityBadge = useCallback((rarity: string) => {
    switch (rarity) {
      case 'common': return <Badge variant="secondary" className="bg-gray-500/20 text-gray-400">Comum</Badge>;
      case 'rare': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Rara</Badge>;
      case 'epic': return <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">Épica</Badge>;
      case 'legendary': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">Lendária</Badge>;
      default: return <Badge variant="secondary" className="bg-gray-500/20 text-gray-400">Comum</Badge>;
    }
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-white/60 mt-2">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-400">Erro ao carregar estatísticas: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas de Performance */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-green-400" />
          Métricas de Performance
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-slate-700/50 ${metric.color}`}>
                    <metric.icon className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1">
                    {metric.changeType === 'positive' ? (
                      <TrendingUp className="h-3 w-3 text-green-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    )}
                    <span className={`text-xs ${metric.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <CardTitle className="text-lg text-white">{metric.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-white mb-2">{metric.value}</div>
                <Progress value={metric.progress} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Conquistas */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Award className="h-6 w-6 text-yellow-400" />
          Conquistas ({getCompletedAchievements().length}/{achievements.length})
        </h2>
        
        {achievements.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <p className="text-white/60">Nenhuma conquista disponível.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => {
              const progress = getAchievementProgress(achievement.id);
              const isCompleted = progress >= achievement.requirement_value;
              const progressPercentage = Math.min((progress / achievement.requirement_value) * 100, 100);
              
              return (
                <Card key={achievement.id} className={`bg-slate-800/50 border-slate-700/50 ${isCompleted ? 'border-yellow-500/40' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg bg-slate-700/50 ${getRarityColor(achievement.rarity)}`}>
                        {getActivityIcon(achievement.type)}
                      </div>
                      {getRarityBadge(achievement.rarity)}
                    </div>
                    <CardTitle className="text-lg text-white">{achievement.title}</CardTitle>
                    <p className="text-sm text-white/70">{achievement.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Progresso</span>
                      <span className="text-white">{progress}/{achievement.requirement_value}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    
                    {isCompleted && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-yellow-400">✅ Concluída!</span>
                        {achievement.reward_coins > 0 && (
                          <span className="text-yellow-400">+{achievement.reward_coins} moedas</span>
                        )}
                        {achievement.reward_gems > 0 && (
                          <span className="text-purple-400">+{achievement.reward_gems} gemas</span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Estatísticas Gerais */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-400" />
          Estatísticas Gerais
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🃏</div>
              <div className="text-2xl font-bold text-white">{playerCards.length}</div>
              <div className="text-sm text-white/60">Cartas na Coleção</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-white">{decks.length}</div>
              <div className="text-sm text-white/60">Decks Criados</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-white">{getCompletedAchievements().length}</div>
              <div className="text-sm text-white/60">Conquistas</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-white">{stats?.experience_points || 0}</div>
              <div className="text-sm text-white/60">Pontos de XP</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 
