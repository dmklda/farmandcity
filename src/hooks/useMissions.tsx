import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { MissionService, Mission, PlayerMission, DailyMission } from '../services/MissionService';
import { toast } from 'sonner';

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [playerMissions, setPlayerMissions] = useState<PlayerMission[]>([]);
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = useCallback(async () => {
    try {
      const missionsData = await MissionService.getActiveMissions();
      setMissions(missionsData);
    } catch (err: any) {
      console.error('Error fetching missions:', err);
      setError(err.message);
    }
  }, []);

  const fetchPlayerMissions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const playerMissionsData = await MissionService.getPlayerMissions(user.id);
      setPlayerMissions(playerMissionsData);
    } catch (err: any) {
      console.error('Error fetching player missions:', err);
    }
  }, []);

  const fetchDailyMissions = useCallback(async () => {
    try {
      const dailyMissionsData = await MissionService.getDailyMissions();
      setDailyMissions(dailyMissionsData);
    } catch (err: any) {
      console.error('Error fetching daily missions:', err);
    }
  }, []);

  const checkMissions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { newlyCompleted, updatedProgress } = await MissionService.checkAndUpdateMissions(user.id);
      
      // Mostrar notificações para missões recém-completadas
      newlyCompleted.forEach((missionTitle) => {
        const mission = missions.find(m => m.title === missionTitle);
        if (mission) {
          // Criar mensagem de recompensa
          let rewardMessage = '';
          if (mission.reward_coins > 0 && mission.reward_gems > 0) {
            rewardMessage = `+${mission.reward_coins} moedas e +${mission.reward_gems} gemas`;
          } else if (mission.reward_coins > 0) {
            rewardMessage = `+${mission.reward_coins} moedas`;
          } else if (mission.reward_gems > 0) {
            rewardMessage = `+${mission.reward_gems} gemas`;
          }

          // Determinar cor baseada na dificuldade
          let toastColor = 'default';
          switch (mission.difficulty) {
            case 'easy':
              toastColor = 'default';
              break;
            case 'medium':
              toastColor = 'blue';
              break;
            case 'hard':
              toastColor = 'purple';
              break;
            case 'legendary':
              toastColor = 'yellow';
              break;
          }

          // Mostrar toast de missão
          toast.success(
            <div className="space-y-1">
              <div className="font-bold text-lg">🎯 {mission.title}</div>
              <div className="text-sm opacity-90">{mission.description}</div>
              {rewardMessage && (
                <div className="text-sm font-medium text-green-400">
                  Recompensa: {rewardMessage}
                </div>
              )}
            </div>,
            {
              duration: 5000,
              icon: '🎯',
              style: {
                background: toastColor === 'yellow' ? '#fef3c7' : 
                           toastColor === 'purple' ? '#f3e8ff' :
                           toastColor === 'blue' ? '#dbeafe' : '#f8fafc',
                border: toastColor === 'yellow' ? '1px solid #f59e0b' :
                        toastColor === 'purple' ? '1px solid #8b5cf6' :
                        toastColor === 'blue' ? '1px solid #3b82f6' : '1px solid #e2e8f0'
              }
            }
          );
        }
      });

      // Atualizar dados locais
      await fetchPlayerMissions();
    } catch (err: any) {
      console.error('Error checking missions:', err);
    }
  }, [fetchPlayerMissions, missions]);

  const claimMissionRewards = useCallback(async (missionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const success = await MissionService.claimMissionRewards(user.id, missionId);
      if (success) {
        toast.success('Recompensas reivindicadas com sucesso!');
        await fetchPlayerMissions();
      }
      return success;
    } catch (err: any) {
      console.error('Error claiming mission rewards:', err);
      toast.error('Erro ao reivindicar recompensas');
      return false;
    }
  }, [fetchPlayerMissions]);

  const getMissionProgress = useCallback((missionId: string) => {
    const playerMission = playerMissions.find(pm => pm.mission_id === missionId);
    return playerMission?.progress || 0;
  }, [playerMissions]);

  const isMissionCompleted = useCallback((missionId: string) => {
    const playerMission = playerMissions.find(pm => pm.mission_id === missionId);
    return playerMission?.is_completed || false;
  }, [playerMissions]);

  const hasClaimedRewards = useCallback((missionId: string) => {
    const playerMission = playerMissions.find(pm => pm.mission_id === missionId);
    return playerMission?.claimed_rewards || false;
  }, [playerMissions]);

  const getMissionsByType = useCallback((type: string) => {
    return missions.filter(mission => mission.mission_type === type);
  }, [missions]);

  const getCompletedMissions = useCallback(() => {
    return playerMissions.filter(pm => pm.is_completed);
  }, [playerMissions]);

  const getAvailableMissions = useCallback(() => {
    return missions.filter(mission => {
      const playerMission = playerMissions.find(pm => pm.mission_id === mission.id);
      return !playerMission || !playerMission.is_completed;
    });
  }, [missions, playerMissions]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchMissions(),
          fetchPlayerMissions(),
          fetchDailyMissions()
        ]);
      } catch (err: any) {
        console.error('Error loading missions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Verificar missões quando as estatísticas mudam
  useEffect(() => {
    if (missions.length > 0 && playerMissions.length > 0) {
      checkMissions();
    }
  }, [missions, playerMissions, checkMissions]);

  return {
    missions,
    playerMissions,
    dailyMissions,
    loading,
    error,
    checkMissions,
    claimMissionRewards,
    getMissionProgress,
    isMissionCompleted,
    hasClaimedRewards,
    getMissionsByType,
    getCompletedMissions,
    getAvailableMissions,
    refreshMissions: fetchMissions,
    refreshPlayerMissions: fetchPlayerMissions,
    refreshDailyMissions: fetchDailyMissions
  };
}; 