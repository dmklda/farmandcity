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
      <Card key={mission.id} className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getMissionTypeIcon(mission.mission_type)}
            <h3 className="font-semibold text-lg">{mission.name}</h3>
          </div>
          <Badge className={getDifficultyColor(mission.difficulty)}>
            {mission.difficulty.toUpperCase()}
          </Badge>
        </div>
        
        <p className="text-gray-600 mb-4">{mission.description}</p>
        
        {/* Progresso */}
        {isStarted && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progresso</span>
              <span>{progress}/{requiredCount}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Recompensas */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Gift className="h-4 w-4 text-green-600" />
          <span className="font-medium">Recompensas:</span>
          {mission.rewards.coins > 0 && (
            <span className="text-yellow-600">+{mission.rewards.coins} moedas</span>
          )}
          {mission.rewards.gems > 0 && (
            <span className="text-purple-600">+{mission.rewards.gems} gems</span>
          )}
          {mission.rewards.xp > 0 && (
            <span className="text-blue-600">+{mission.rewards.xp} XP</span>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-2">
          {!isStarted && (
            <Button 
              onClick={() => handleStartMission(mission.id)}
              className="flex-1"
            >
              Iniciar Missão
            </Button>
          )}
          
          {isCompleted && !isClaimed && (
            <Button 
              onClick={() => handleClaimRewards(mission.id)}
              disabled={claiming === mission.id}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {claiming === mission.id ? 'Coletando...' : 'Coletar Recompensas'}
            </Button>
          )}
          
          {isClaimed && (
            <div className="flex items-center gap-2 text-green-600 w-full justify-center">
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
        <div className="text-lg">Carregando missões...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header das Missões */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Target size={32} />
              Missões
            </h1>
            <p className="text-green-100">Complete missões para ganhar recompensas!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-yellow-500/20 rounded-lg px-3 py-2">
              <span className="font-semibold">Nível {currency?.level || 1}</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/20 rounded-lg px-3 py-2">
              <span className="font-semibold">{currency?.experience_points || 0} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs das Missões */}
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="available" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Disponíveis
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completadas
          </TabsTrigger>
          <TabsTrigger value="claimed" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Coletadas
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
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
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Estatísticas de Missões</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{getAvailableMissions().length}</div>
                <div className="text-gray-600">Missões Disponíveis</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{getCompletedMissions().length}</div>
                <div className="text-gray-600">Missões Completadas</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{getClaimedMissions().length}</div>
                <div className="text-gray-600">Recompensas Coletadas</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}; 