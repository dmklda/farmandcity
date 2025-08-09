import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useMissions } from '../hooks/useMissions';
import { usePlayerCurrency } from '../hooks/usePlayerCurrency';
import { Target, Trophy, Clock, Star, CheckCircle, XCircle, Gift } from 'lucide-react';

export const Missions: React.FC = () => {
  const { 
    missions, 
    playerMissions, 
    loading, 
    error, 
    startMission, 
    claimMissionRewards, 
    getAvailableMissions, 
    getCompletedMissions, 
    getClaimedMissions 
  } = useMissions();
  
  const { currency } = usePlayerCurrency();
  const [claiming, setClaiming] = useState<string | null>(null);

  const handleStartMission = async (missionId: string) => {
    try {
      await startMission(missionId);
      alert('Missão iniciada com sucesso!');
    } catch (err: any) {
      alert(`Erro ao iniciar missão: ${err.message}`);
    }
  };

  const handleClaimRewards = async (missionId: string) => {
    try {
      setClaiming(missionId);
      await claimMissionRewards(missionId);
      alert('Recompensas coletadas com sucesso!');
      // Recarregar dados
      window.location.reload();
    } catch (error) {
      console.error('Erro ao coletar recompensas:', error);
      alert('Erro ao coletar recompensas');
    } finally {
      setClaiming(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'legendary': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getMissionTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Clock className="h-4 w-4" />;
      case 'weekly': return <Target className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      case 'story': return <Star className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const renderMission = (mission: any, playerMission?: any) => {
    const isStarted = !!playerMission;
    const isCompleted = playerMission?.is_completed;
    const isClaimed = playerMission?.claimed_rewards;
    const progress = playerMission?.progress || 0;
    const requiredCount = mission.requirements.count || 1;
    const progressPercentage = Math.min((progress / requiredCount) * 100, 100);

    return (
      <Card key={mission.id} className="p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/30 shadow-xl">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-amber-400">
              {getMissionTypeIcon(mission.mission_type)}
            </div>
            <h3 className="font-semibold text-lg text-white">{mission.name}</h3>
          </div>
          <Badge className={`${getDifficultyColor(mission.difficulty)} border border-white/20`}>
            {mission.difficulty.toUpperCase()}
          </Badge>
        </div>
        
        <p className="text-gray-300/80 mb-4">{mission.description}</p>
        
        {/* Progresso */}
        {isStarted && (
          <div className="mb-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/30 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white">Progresso</span>
              <span className="text-amber-300">{progress}/{requiredCount}</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-slate-600" />
          </div>
        )}

        {/* Recompensas */}
        <div className="flex items-center gap-2 mb-4 text-sm bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-400/20 rounded-lg p-2 backdrop-blur-sm">
          <Gift className="h-4 w-4 text-amber-400" />
          <span className="font-medium text-white">Recompensas:</span>
          {mission.rewards.coins > 0 && (
            <span className="text-amber-300">+{mission.rewards.coins} moedas</span>
          )}
          {mission.rewards.gems > 0 && (
            <span className="text-purple-300">+{mission.rewards.gems} gems</span>
          )}
          {mission.rewards.xp > 0 && (
            <span className="text-blue-300">+{mission.rewards.xp} XP</span>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-2">
          {!isStarted && (
            <Button 
              onClick={() => handleStartMission(mission.id)}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Iniciar Quest
            </Button>
          )}
          
          {isCompleted && !isClaimed && (
            <Button 
              onClick={() => handleClaimRewards(mission.id)}
              disabled={claiming === mission.id}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {claiming === mission.id ? 'Coletando...' : 'Coletar Recompensas'}
            </Button>
          )}
          
          {isClaimed && (
            <div className="flex items-center gap-2 text-green-400 w-full justify-center bg-green-500/10 border border-green-500/20 rounded-lg p-2 backdrop-blur-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Recompensas Coletadas</span>
            </div>
          )}
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
          <div className="text-lg text-white">Carregando quests épicas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-600/30 rounded-2xl p-6 mb-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-200/90 text-lg">Complete quests épicas para ganhar recompensas reais!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-amber-500/20 rounded-lg px-3 py-2 border border-amber-400/30 backdrop-blur-sm">
              <span className="font-semibold text-amber-300">Nível {currency?.level || 1}</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-500/20 rounded-lg px-3 py-2 border border-purple-400/30 backdrop-blur-sm">
              <span className="font-semibold text-purple-300">{currency?.experience_points || 0} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs das Missões */}
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-1">
          <TabsTrigger value="available" className="flex items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
            <Target className="h-4 w-4" />
            Disponíveis
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
            <CheckCircle className="h-4 w-4" />
            Completadas
          </TabsTrigger>
          <TabsTrigger value="claimed" className="flex items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
            <Trophy className="h-4 w-4" />
            Coletadas
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
            <Star className="h-4 w-4" />
            Estatísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getAvailableMissions().map(mission => {
              const playerMission = playerMissions.find(pm => pm.mission_id === mission.id);
              return renderMission(mission, playerMission);
            })}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCompletedMissions().map(playerMission => {
              const mission = missions.find(m => m.id === playerMission.mission_id);
              return mission ? renderMission(mission, playerMission) : null;
            })}
          </div>
        </TabsContent>

        <TabsContent value="claimed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getClaimedMissions().map(playerMission => {
              const mission = missions.find(m => m.id === playerMission.mission_id);
              return mission ? renderMission(mission, playerMission) : null;
            })}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-white">Estatísticas de Quests</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm border border-slate-600/30 p-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold text-amber-400">{getAvailableMissions().length}</div>
                <div className="text-gray-300/80">Quests Disponíveis</div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm border border-slate-600/30 p-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold text-green-400">{getCompletedMissions().length}</div>
                <div className="text-gray-300/80">Quests Completadas</div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm border border-slate-600/30 p-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold text-purple-400">{getClaimedMissions().length}</div>
                <div className="text-gray-300/80">Recompensas Coletadas</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg backdrop-blur-sm">
          {error}
        </div>
      )}
    </div>
  );
}; 
