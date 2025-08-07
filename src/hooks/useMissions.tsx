import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { MissionsService, Mission, PlayerMission, ActiveDailyMission } from '../services/MissionsService';
import { toast } from 'sonner';

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [playerMissions, setPlayerMissions] = useState<PlayerMission[]>([]);
  const [dailyMissions, setDailyMissions] = useState<ActiveDailyMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = useCallback(async () => {
    try {
      const missionsData = await MissionsService.getMissions();
      if (missionsData.success) {
        setMissions(missionsData.missions || []);
      }
    } catch (err: any) {
      console.error('Error fetching missions:', err);
      setError(err.message);
    }
  }, []);

  const fetchPlayerMissions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const playerMissionsData = await MissionsService.getPlayerMissions();
      if (playerMissionsData.success) {
        setPlayerMissions(playerMissionsData.missions || []);
      }
    } catch (err: any) {
      console.error('Error fetching player missions:', err);
    }
  }, []);

  const fetchDailyMissions = useCallback(async () => {
    try {
      const dailyMissionsData = await MissionsService.getActiveDailyMissions();
      if (dailyMissionsData.success) {
        setDailyMissions(dailyMissionsData.missions || []);
      }
    } catch (err: any) {
      console.error('Error fetching daily missions:', err);
    }
  }, []);

  const checkMissions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // TODO: Implement mission checking logic when method is available
      // For now, just refresh player missions
      await fetchPlayerMissions();
    } catch (err: any) {
      console.error('Error checking missions:', err);
    }
  }, [fetchPlayerMissions]);

  const claimMissionRewards = useCallback(async (missionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const result = await MissionsService.claimMissionRewards(missionId);
      if (result.success) {
        toast.success('Recompensas reivindicadas com sucesso!');
        await fetchPlayerMissions();
        return true;
      }
      return false;
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