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
  victoryMode: 'reputation' | 'landmarks' | 'elimination' | 'infinite' | 'complex' | 'classic' | 'resources' | 'production';
  victoryValue: number;
  // Novas configurações de jogabilidade
  deckMinCards: number;
  deckMaxCards: number;
  gameTurnLimit: number; // 0 = infinito
  prestigeGoal: number;
  landmarkUniqueLimit: number;
  // Configurações de deck starter
  starterDeckCardCount: number;
  minDeckCardCount: number;
  maxDeckCardCount: number;
}

export const useGameSettings = () => {
  const [settings, setSettings] = useState<GameSettings>({
    gameName: 'Famand',
    version: '1.0.0',
    maintenanceMode: false,
    allowNewRegistrations: true,
    maxPlayersPerGame: 1,
    defaultStartingResources: {
      coins: 3,
      food: 2,
      materials: 2,
      population: 2
    },
    gameRules: 'Regras padrão do jogo Famand...',
    contactEmail: 'support@famand.com',
    supportDiscord: 'https://discord.gg/famand',
    victoryMode: 'landmarks',
    victoryValue: 3,
    // Novas configurações padrão
    deckMinCards: 23,
    deckMaxCards: 40,
    gameTurnLimit: 50,
    prestigeGoal: 30,
    landmarkUniqueLimit: 1,
    // Configurações de deck starter
    starterDeckCardCount: 38, // Deck inicial com 38 cartas
    minDeckCardCount: 23, // Mínimo de 23 cartas
    maxDeckCardCount: 40 // Máximo de 40 cartas
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

      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      let userGamePreferences = null;
      
      if (user) {
        // Buscar preferências de jogo do usuário
        const { data: userSettings, error: userError } = await supabase
          .from('user_settings')
          .select('game_preferences')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!userError && userSettings?.game_preferences) {
          userGamePreferences = userSettings.game_preferences;
          console.log('🎮 Preferências do usuário carregadas:', userGamePreferences);
        } else if (userError) {
          console.log('⚠️ Usuário não tem configurações salvas ainda, usando padrão');
        }
      }

      // Buscar configurações globais (para configurações que não são específicas do usuário)
      const { data: globalData, error: globalError } = await supabase
        .from('game_settings')
        .select('*')
        .eq('setting_key', 'global_config')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Buscar configurações específicas de jogabilidade
      const { data: gameSettingsData, error: gameSettingsError } = await supabase
        .from('game_settings')
        .select('*')
        .in('setting_key', ['deck_min_cards', 'deck_max_cards', 'game_turn_limit', 'prestige_goal', 'landmark_unique_limit']);

      // Configurações padrão
      let defaultSettings = {
          gameName: 'Famand',
          version: '1.0.0',
          maintenanceMode: false,
          allowNewRegistrations: true,
          maxPlayersPerGame: 1,
          defaultStartingResources: {
            coins: 3,
            food: 2,
            materials: 2,
            population: 2
          },
          gameRules: 'Regras padrão do jogo Famand...',
          contactEmail: 'support@famand.com',
          supportDiscord: 'https://discord.gg/famand',
        victoryMode: 'landmarks' as const,
        victoryValue: 3,
        deckMinCards: 23,
        deckMaxCards: 40,
        gameTurnLimit: 50,
        prestigeGoal: 30,
        landmarkUniqueLimit: 1,
        // Configurações de deck starter
        starterDeckCardCount: 38, // Deck inicial com 38 cartas
        minDeckCardCount: 23, // Mínimo de 23 cartas
        maxDeckCardCount: 40 // Máximo de 40 cartas
      };

      // Processar configurações globais
      if (!globalError && globalData && globalData.setting_value) {
        const globalValue = globalData.setting_value as any;
        defaultSettings = {
          ...defaultSettings,
          gameName: globalValue.gameName || defaultSettings.gameName,
          version: globalValue.version || defaultSettings.version,
          maintenanceMode: globalValue.maintenanceMode || defaultSettings.maintenanceMode,
          allowNewRegistrations: globalValue.allowNewRegistrations || defaultSettings.allowNewRegistrations,
          maxPlayersPerGame: globalValue.maxPlayersPerGame || defaultSettings.maxPlayersPerGame,
          defaultStartingResources: globalValue.defaultStartingResources || defaultSettings.defaultStartingResources,
          gameRules: globalValue.gameRules || defaultSettings.gameRules,
          contactEmail: globalValue.contactEmail || defaultSettings.contactEmail,
          supportDiscord: globalValue.supportDiscord || defaultSettings.supportDiscord,
        };
      }

      // Processar preferências do usuário (prioridade sobre configurações globais)
      if (userGamePreferences) {
        defaultSettings = {
          ...defaultSettings,
          victoryMode: userGamePreferences.victoryMode || defaultSettings.victoryMode,
          victoryValue: userGamePreferences.victoryValue || defaultSettings.victoryValue,
        };
        console.log('🎮 Aplicando preferências do usuário:', {
          victoryMode: userGamePreferences.victoryMode,
          victoryValue: userGamePreferences.victoryValue
        });
      }

      // Processar configurações específicas de jogabilidade
      if (!gameSettingsError && gameSettingsData) {
        const gameSettingsMap = new Map(
          gameSettingsData.map(item => [item.setting_key, item.setting_value])
        );

        defaultSettings = {
          ...defaultSettings,
          deckMinCards: parseInt(gameSettingsMap.get('deck_min_cards') as string) || defaultSettings.deckMinCards,
          deckMaxCards: parseInt(gameSettingsMap.get('deck_max_cards') as string) || defaultSettings.deckMaxCards,
          gameTurnLimit: parseInt(gameSettingsMap.get('game_turn_limit') as string) || defaultSettings.gameTurnLimit,
          prestigeGoal: parseInt(gameSettingsMap.get('prestige_goal') as string) || defaultSettings.prestigeGoal,
          landmarkUniqueLimit: parseInt(gameSettingsMap.get('landmark_unique_limit') as string) || defaultSettings.landmarkUniqueLimit,
          // Configurações de deck starter
          starterDeckCardCount: parseInt(gameSettingsMap.get('starter_deck_card_count') as string) || defaultSettings.starterDeckCardCount,
          minDeckCardCount: parseInt(gameSettingsMap.get('deck_min_cards') as string) || defaultSettings.minDeckCardCount,
          maxDeckCardCount: parseInt(gameSettingsMap.get('deck_max_cards') as string) || defaultSettings.maxDeckCardCount,
        };
      }

      setSettings(defaultSettings);
      console.log('🔧 Configurações carregadas:', defaultSettings);
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
        victoryValue: 3,
        deckMinCards: 23,
        deckMaxCards: 40,
        gameTurnLimit: 50,
        prestigeGoal: 30,
        landmarkUniqueLimit: 1,
        // Configurações de deck starter
        starterDeckCardCount: 38, // Deck inicial com 38 cartas
        minDeckCardCount: 23, // Mínimo de 23 cartas
        maxDeckCardCount: 40 // Máximo de 40 cartas
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