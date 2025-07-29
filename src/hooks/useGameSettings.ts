import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface GameSettings {
  gameName: string;
  version: string;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  maxPlayersPerGame: number;
  defaultStartingResources: {
    coins: number;
    food: number;
    materials: number;
    population: number;
  };
  gameRules: string;
  contactEmail: string;
  supportDiscord: string;
  victoryMode: 'reputation' | 'landmarks' | 'elimination' | 'infinite' | 'complex';
  victoryValue: number;
}

export const useGameSettings = () => {
  const [settings, setSettings] = useState<GameSettings>({
    gameName: 'Famand',
    version: '1.0.0',
    maintenanceMode: false,
    allowNewRegistrations: true,
    maxPlayersPerGame: 1,
    defaultStartingResources: {
      coins: 5,
      food: 3,
      materials: 2,
      population: 3
    },
    gameRules: 'Regras padrão do jogo Famand...',
    contactEmail: 'support@famand.com',
    supportDiscord: 'https://discord.gg/famand',
    victoryMode: 'landmarks',
    victoryValue: 3
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('game_settings')
        .select('*')
        .eq('setting_key', 'global_config')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Se não há dados ou erro, usar configurações padrão
      if (error || !data || !data.setting_value) {
        console.log('Using default game settings');
        setSettings({
          gameName: 'Famand',
          version: '1.0.0',
          maintenanceMode: false,
          allowNewRegistrations: true,
          maxPlayersPerGame: 1,
          defaultStartingResources: {
            coins: 5,
            food: 3,
            materials: 2,
            population: 3
          },
          gameRules: 'Regras padrão do jogo Famand...',
          contactEmail: 'support@famand.com',
          supportDiscord: 'https://discord.gg/famand',
          victoryMode: 'landmarks',
          victoryValue: 3
        });
        return;
      }
      
      // Se há dados, usar as configurações do banco
      const settingValue = data.setting_value as any;
      setSettings({
        gameName: settingValue.gameName || 'Famand',
        version: settingValue.version || '1.0.0',
        maintenanceMode: settingValue.maintenanceMode || false,
        allowNewRegistrations: settingValue.allowNewRegistrations || true,
        maxPlayersPerGame: settingValue.maxPlayersPerGame || 1,
        defaultStartingResources: settingValue.defaultStartingResources || {
          coins: 5,
          food: 3,
          materials: 2,
          population: 3
        },
        gameRules: settingValue.gameRules || 'Regras padrão do jogo Famand...',
        contactEmail: settingValue.contactEmail || 'support@famand.com',
        supportDiscord: settingValue.supportDiscord || 'https://discord.gg/famand',
        victoryMode: settingValue.victoryMode || 'landmarks',
        victoryValue: settingValue.victoryValue || 3
      });
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      // Em caso de erro, usar configurações padrão
      setSettings({
        gameName: 'Famand',
        version: '1.0.0',
        maintenanceMode: false,
        allowNewRegistrations: true,
        maxPlayersPerGame: 1,
        defaultStartingResources: {
          coins: 5,
          food: 3,
          materials: 2,
          population: 3
        },
        gameRules: 'Regras padrão do jogo Famand...',
        contactEmail: 'support@famand.com',
        supportDiscord: 'https://discord.gg/famand',
        victoryMode: 'landmarks',
        victoryValue: 3
      });
      setError(null); // Não mostrar erro, usar padrão
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
  };
};