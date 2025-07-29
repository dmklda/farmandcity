import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import type { Tables } from '../integrations/supabase/types';

type Mission = Tables<'missions'>;
type PlayerMission = Tables<'player_missions'> & {
  mission?: Mission;
};

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [playerMissions, setPlayerMissions] = useState<PlayerMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Buscar missões disponíveis
      const { data: missionsData, error: missionsError } = await supabase
        .from('missions')
        .select('*')
        .eq('is_active', true)
        .order('mission_type', { ascending: true });

      if (missionsError) throw missionsError;

      // Buscar progresso do jogador
      const { data: playerMissionsData, error: playerMissionsError } = await supabase
        .from('player_missions')
        .select(`
          *,
          mission:missions(*)
        `)
        .eq('player_id', user.id);

      if (playerMissionsError) throw playerMissionsError;

      setMissions(missionsData || []);
      setPlayerMissions(playerMissionsData || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startMission = async (missionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('player_missions')
        .insert({
          player_id: user.id,
          mission_id: missionId,
          progress: 0,
          is_completed: false,
          claimed_rewards: false
        });

      if (error) throw error;

      await fetchMissions();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateMissionProgress = async (missionId: string, progress: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const mission = missions.find(m => m.id === missionId);
      if (!mission) throw new Error('Missão não encontrada');

      const requiredCount = (mission.requirements as any).count || 1;
      const isCompleted = progress >= requiredCount;

      const { error } = await supabase
        .from('player_missions')
        .upsert({
          player_id: user.id,
          mission_id: missionId,
          progress: Math.min(progress, requiredCount),
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      await fetchMissions();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const claimMissionRewards = async (missionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const playerMission = playerMissions.find(pm => pm.mission_id === missionId);
      if (!playerMission || !playerMission.is_completed || playerMission.claimed_rewards) {
        throw new Error('Missão não pode ter recompensas coletadas');
      }

      const { error } = await supabase
        .from('player_missions')
        .update({
          claimed_rewards: true,
          updated_at: new Date().toISOString()
        })
        .eq('player_id', user.id)
        .eq('mission_id', missionId);

      if (error) throw error;

      await fetchMissions();
      return playerMission.mission?.rewards;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getMissionProgress = (missionId: string) => {
    const playerMission = playerMissions.find(pm => pm.mission_id === missionId);
    return playerMission || null;
  };

  const getAvailableMissions = () => {
    return missions.filter(mission => {
      const playerMission = getMissionProgress(mission.id);
      return !playerMission || (!playerMission.is_completed && !playerMission.claimed_rewards);
    });
  };

  const getCompletedMissions = () => {
    return playerMissions.filter(pm => pm.is_completed && !pm.claimed_rewards);
  };

  const getClaimedMissions = () => {
    return playerMissions.filter(pm => pm.claimed_rewards);
  };

  return {
    missions,
    playerMissions,
    loading,
    error,
    startMission,
    updateMissionProgress,
    claimMissionRewards,
    getMissionProgress,
    getAvailableMissions,
    getCompletedMissions,
    getClaimedMissions,
    refresh: fetchMissions
  };
}; 