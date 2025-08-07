import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MissionsService, Mission, PlayerMission, ActiveDailyMission, ActiveWeeklyMission } from '../services/MissionsService';
import { useAuth } from '../hooks/useAuth';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Target, Calendar, Clock, Filter, CheckCircle, Award, Star, Zap, TrendingUp, Gift } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface MissionsTabProps {
  className?: string;
}

export default function MissionsTab({ className }: MissionsTabProps) {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [playerMissions, setPlayerMissions] = useState<PlayerMission[]>([]);
  const [dailyMissions, setDailyMissions] = useState<ActiveDailyMission[]>([]);
  const [weeklyMissions, setWeeklyMissions] = useState<ActiveWeeklyMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showInProgress, setShowInProgress] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadMissionsData();
  }, []);

  const loadMissionsData = async () => {
    setLoading(true);
    try {
      // Carregar missões disponíveis
      const missionsResult = await MissionsService.getMissions();
      if (missionsResult.success && missionsResult.missions) {
        setMissions(missionsResult.missions);
      }

      // Carregar missões do jogador
      if (user) {
        const playerMissionsResult = await MissionsService.getPlayerMissions();
        if (playerMissionsResult.success && playerMissionsResult.missions) {
          setPlayerMissions(playerMissionsResult.missions);
        }

        // Carregar estatísticas
        const statsResult = await MissionsService.getMissionStats();
        if (statsResult.success && statsResult.stats) {
          setStats(statsResult.stats);
        }
      }

      // Carregar missões diárias ativas
      const dailyMissionsResult = await MissionsService.getActiveDailyMissions();
      if (dailyMissionsResult.success && dailyMissionsResult.missions) {
        setDailyMissions(dailyMissionsResult.missions);
      }

      // Carregar missões semanais ativas
      const weeklyMissionsResult = await MissionsService.getActiveWeeklyMissions();
      if (weeklyMissionsResult.success && weeklyMissionsResult.missions) {
        setWeeklyMissions(weeklyMissionsResult.missions);
      }
    } catch (error) {
      console.error('Erro ao carregar missões:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlayerMission = (missionId: string) => {
    return playerMissions.find(pm => pm.mission_id === missionId);
  };

  const isMissionCompleted = (mission: Mission) => {
    const playerMission = getPlayerMission(mission.id);
    return playerMission?.is_completed || false;
  };

  const getMissionProgress = (mission: Mission) => {
    const playerMission = getPlayerMission(mission.id);
    if (!playerMission) return 0;
    return Math.min(playerMission.progress, mission.requirement_value);
  };

  const handleClaimRewards = async (missionId: string) => {
    try {
      const result = await MissionsService.claimMissionRewards(missionId);
      if (result.success) {
        loadMissionsData();
      } else {
        alert(result.error || 'Erro ao reivindicar recompensas');
      }
    } catch (error) {
      console.error('Erro ao reivindicar recompensas:', error);
    }
  };

  const getMissionTypeName = (type: string) => {
    const names: { [key: string]: string } = {
      daily: 'Diária',
      weekly: 'Semanal',
      global: 'Global',
      specific: 'Específica'
    };
    return names[type] || type;
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

  const formatMissionDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  const filteredMissions = missions.filter(mission => {
    const isCompleted = isMissionCompleted(mission);
    const matchesType = selectedType === 'all' || mission.mission_type === selectedType;
    const matchesStatus = (isCompleted && showCompleted) || (!isCompleted && showInProgress);
    return matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Carregando missões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header com estatísticas */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
        <CardHeader className="pb-4 border-b border-gray-700">
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Target className="h-6 w-6 text-blue-500" />
            Suas Missões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="text-2xl font-bold text-blue-400">
                {playerMissions.filter(pm => pm.is_completed).length}
              </div>
              <div className="text-sm text-blue-300">Concluídas</div>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="text-2xl font-bold text-blue-400">
                {dailyMissions.length}
              </div>
              <div className="text-sm text-blue-300">Diárias Ativas</div>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="text-2xl font-bold text-blue-400">
                {weeklyMissions.length}
              </div>
              <div className="text-sm text-blue-300">Semanais Ativas</div>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="text-2xl font-bold text-blue-400">
                {missions.length}
              </div>
              <div className="text-sm text-blue-300">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Missões Diárias */}
      {dailyMissions.length > 0 && (
        <Card className="shadow-xl border-gray-700 bg-gray-800/50">
          <CardHeader className="pb-3 border-b border-gray-700">
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Calendar className="h-5 w-5 text-green-500" />
              Missões Diárias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dailyMissions.map((dailyMission) => (
                <div key={dailyMission.id} className="p-4 bg-gray-700/50 border border-gray-600 rounded-xl hover:bg-gray-700 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-600/20 text-green-400 rounded-lg">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-200">{dailyMission.mission_name}</h4>
                        <p className="text-sm text-gray-400">{dailyMission.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progresso</span>
                      <span className="font-medium text-gray-200">
                        {dailyMission.progress} / {dailyMission.requirement_value}
                      </span>
                    </div>
                    <Progress 
                      value={(dailyMission.progress / dailyMission.requirement_value) * 100} 
                      className="h-2 bg-green-900"
                    />
                  </div>

                  {dailyMission.reward_coins > 0 && (
                    <div className="mt-3 p-2 bg-yellow-600/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-400 text-sm">
                        <span>🪙</span>
                        <span className="font-medium">{dailyMission.reward_coins} moedas</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48 border-2 border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-gray-700 text-gray-200">
                <SelectValue placeholder="Tipo de Missão" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-gray-200 hover:bg-gray-700">Todas as Missões</SelectItem>
                <SelectItem value="daily" className="text-gray-200 hover:bg-gray-700">Diárias</SelectItem>
                <SelectItem value="weekly" className="text-gray-200 hover:bg-gray-700">Semanais</SelectItem>
                <SelectItem value="global" className="text-gray-200 hover:bg-gray-700">Globais</SelectItem>
                <SelectItem value="specific" className="text-gray-200 hover:bg-gray-700">Específicas</SelectItem>
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

      {/* Lista de Missões */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMissions.map((mission) => {
          const isCompleted = isMissionCompleted(mission);
          const progress = getMissionProgress(mission);
          const progressPercentage = (progress / mission.requirement_value) * 100;

          return (
            <Card 
              key={mission.id} 
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
                      isCompleted ? 'bg-green-600/20 text-green-400' : 'bg-blue-600/20 text-blue-400'
                    }`}>
                      <Target className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className={`text-lg ${isCompleted ? 'text-green-400' : 'text-gray-200'}`}>
                        {mission.name}
                      </CardTitle>
                      <p className="text-sm text-gray-400 mt-1">
                        {getMissionTypeName(mission.mission_type)}
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
                  {mission.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progresso</span>
                    <span className="font-medium text-gray-200">
                      {progress} / {mission.requirement_value}
                    </span>
                  </div>
                  <Progress 
                    value={progressPercentage} 
                    className={`h-2 ${isCompleted ? 'bg-green-900' : 'bg-gray-600'}`}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={`${getDifficultyColor(mission.difficulty_level)} text-white font-medium`}>
                    {getDifficultyName(mission.difficulty_level)}
                  </Badge>
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 font-medium">
                    {getCategoryName(mission.category)}
                  </Badge>
                </div>

                {mission.reward_coins > 0 && (
                  <div className="p-3 bg-yellow-600/10 border border-yellow-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <span className="text-lg">🪙</span>
                      <span className="font-medium">Recompensa: {mission.reward_coins} moedas</span>
                    </div>
                  </div>
                )}

                {isCompleted && !mission.rewards_claimed && (
                  <Button
                    onClick={() => handleClaimRewards(mission.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl border-0"
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Reivindicar Recompensa
                  </Button>
                )}

                {isCompleted && mission.rewards_claimed && (
                  <div className="p-3 bg-green-600/10 border border-green-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Recompensa Reivindicada!</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMissions.length === 0 && (
        <Card className="text-center py-12 bg-gray-800/50 border-gray-700">
          <CardContent>
            <Target className="h-16 w-16 mx-auto mb-4 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Nenhuma missão encontrada</h3>
            <p className="text-gray-500">Tente ajustar os filtros para ver mais missões.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 