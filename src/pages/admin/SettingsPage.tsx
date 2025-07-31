import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Textarea } from '../../components/ui/textarea';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Globe, 
  Shield, 
  Bell,
  Database,
  Server,
  Mail,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

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
  victoryMode: string;
  victoryValue: number;
}

export const SettingsPage: React.FC = () => {
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
    victoryMode: 'reputation',
    victoryValue: 1000
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('game_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data && data.setting_value) {
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
          victoryMode: settingValue.victoryMode || 'reputation',
          victoryValue: settingValue.victoryValue || 1000
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const { data, error } = await supabase
        .from('game_settings')
        .upsert({
          setting_key: 'global_config',
          setting_value: settings as any,
          description: 'Configurações globais do jogo',
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Tem certeza que deseja redefinir todas as configurações?')) {
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
        victoryMode: 'reputation',
        victoryValue: 1000
      });
      toast.success('Configurações redefinidas para padrão');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">Configurações gerais do sistema</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Configurações gerais do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Redefinir
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="gameName">Nome do Jogo</Label>
              <Input
                id="gameName"
                value={settings.gameName}
                onChange={(e) => setSettings({ ...settings, gameName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Versão</Label>
              <Input
                id="version"
                value={settings.version}
                onChange={(e) => setSettings({ ...settings, version: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo de Manutenção</Label>
                <p className="text-sm text-muted-foreground">
                  Bloqueia o acesso ao jogo para todos os usuários
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permitir Novos Registros</Label>
                <p className="text-sm text-muted-foreground">
                  Permite que novos usuários se registrem
                </p>
              </div>
              <Switch
                checked={settings.allowNewRegistrations}
                onCheckedChange={(checked) => setSettings({ ...settings, allowNewRegistrations: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Configurações do Jogo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="maxPlayers">Máximo de Jogadores por Jogo</Label>
            <Input
              id="maxPlayers"
              type="number"
              value={settings.maxPlayersPerGame}
              onChange={(e) => setSettings({ ...settings, maxPlayersPerGame: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <Label>Recursos Iniciais Padrão</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="coins">Moedas</Label>
                <Input
                  id="coins"
                  type="number"
                  value={settings.defaultStartingResources.coins}
                  onChange={(e) => setSettings({
                    ...settings,
                    defaultStartingResources: {
                      ...settings.defaultStartingResources,
                      coins: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="food">Comida</Label>
                <Input
                  id="food"
                  type="number"
                  value={settings.defaultStartingResources.food}
                  onChange={(e) => setSettings({
                    ...settings,
                    defaultStartingResources: {
                      ...settings.defaultStartingResources,
                      food: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="materials">Materiais</Label>
                <Input
                  id="materials"
                  type="number"
                  value={settings.defaultStartingResources.materials}
                  onChange={(e) => setSettings({
                    ...settings,
                    defaultStartingResources: {
                      ...settings.defaultStartingResources,
                      materials: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="population">População</Label>
                <Input
                  id="population"
                  type="number"
                  value={settings.defaultStartingResources.population}
                  onChange={(e) => setSettings({
                    ...settings,
                    defaultStartingResources: {
                      ...settings.defaultStartingResources,
                      population: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gameRules">Regras do Jogo</Label>
            <Textarea
              id="gameRules"
              value={settings.gameRules}
              onChange={(e) => setSettings({ ...settings, gameRules: e.target.value })}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Victory Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Configurações de Vitória
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="victoryMode">Condição de Vitória</Label>
            <select
              id="victoryMode"
              title="Condição de Vitória"
              value={settings.victoryMode}
              onChange={e => setSettings(s => ({ ...s, victoryMode: e.target.value as any }))}
              className="block w-full border rounded p-2 mt-1"
            >
              <option value="reputation">Reputação</option>
              <option value="landmarks">Marcos</option>
              <option value="elimination">Eliminação</option>
              <option value="infinite">Infinito</option>
            </select>
          </div>
          <div>
            <Label htmlFor="victoryValue">Valor para Vitória</Label>
            <Input
              id="victoryValue"
              type="number"
              min={1}
              value={settings.victoryValue}
              onChange={e => setSettings(s => ({ ...s, victoryValue: parseInt(e.target.value) }))}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Configurações de Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email de Suporte</Label>
            <Input
              id="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supportDiscord">Discord de Suporte</Label>
            <Input
              id="supportDiscord"
              value={settings.supportDiscord}
              onChange={(e) => setSettings({ ...settings, supportDiscord: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Versão do Sistema</span>
                <span className="text-sm font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Última Atualização</span>
                <span className="text-sm font-medium">Hoje, 14:30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status do Banco</span>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Usuários Ativos</span>
                <span className="text-sm font-medium">234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Jogos em Andamento</span>
                <span className="text-sm font-medium">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cartas Ativas</span>
                <span className="text-sm font-medium">156</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
