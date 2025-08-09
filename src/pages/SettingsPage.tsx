import React, { useState } from 'react';
import { useUserSettings } from '../hooks/useUserSettings';
import { useBattlefieldCustomization } from '../hooks/useBattlefieldCustomization';
import { useContainerCustomization } from '../hooks/useContainerCustomization';
import { useToast } from '../components/ui/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAppContext } from '../contexts/AppContext';
import { 
  Settings, 
  User, 
  Palette, 
  Volume2, 
  Bell, 
  Save, 
  Globe, 
  Image,
  Crown,
  Coins,
  Gem,
  Check,
  X,
  ArrowLeft,
  Music,
  Download,
  Shield,
  Eye,
  Lock,
  Gamepad2
} from 'lucide-react';
import { MedievalAnimatedBackground } from '../components/MedievalAnimatedBackground';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    loading: settingsLoading,
    error: settingsError,
    updateUserSettings,
    changePassword
  } = useUserSettings();

  const {
    customizations,
    userCustomizations,
    equippedCustomization,
    loading: battlefieldLoading,
    error: battlefieldError,
    purchaseCustomization,
    equipCustomization
  } = useBattlefieldCustomization();

  const {
    customizations: containerCustomizations,
    userCustomizations: userContainerCustomizations,
    equippedCustomizations: equippedContainerCustomizations,
    loading: containerLoading,
    error: containerError,
    purchaseCustomization: purchaseContainerCustomization,
    equipCustomization: equipContainerCustomization
  } = useContainerCustomization();

  const { showToast, ToastContainer } = useToast();
  const { setCurrentView } = useAppContext();
  const [saving, setSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState<any>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Inicializar settings locais quando settings carregar
  React.useEffect(() => {
    if (settings && !localSettings) {
      setLocalSettings(settings);
    }
  }, [settings, localSettings]);

  const handleInputChange = (field: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    if (!localSettings) return;
    
    try {
      setSaving(true);
      await updateUserSettings(localSettings);
      showToast('Configurações salvas com sucesso!', 'success');
    } catch (err: any) {
      showToast(`Erro ao salvar: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('As senhas não coincidem!', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showToast('A nova senha deve ter pelo menos 6 caracteres!', 'error');
      return;
    }

    try {
      setChangingPassword(true);
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      showToast('Senha alterada com sucesso!', 'success');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      showToast(`Erro ao alterar senha: ${err.message}`, 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  const handlePurchaseCustomization = async (customizationId: string) => {
    try {
      await purchaseCustomization(customizationId);
      showToast('Customização comprada com sucesso!', 'success');
    } catch (err: any) {
      showToast(`Erro ao comprar: ${err.message}`, 'error');
    }
  };

  const handleEquipCustomization = async (customizationId: string) => {
    try {
      await equipCustomization(customizationId);
      showToast('Customização equipada com sucesso!', 'success');
    } catch (err: any) {
      showToast(`Erro ao equipar: ${err.message}`, 'error');
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="w-4 h-4" />;
      default: return null;
    }
  };

  const getRarityBadge = (rarity: string) => {
    const colors = {
      common: 'bg-gray-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-yellow-500'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${colors[rarity as keyof typeof colors] || colors.common}`}>
        {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
      </span>
    );
  };

  const loading = settingsLoading || battlefieldLoading || containerLoading;
  const error = settingsError || battlefieldError || containerError;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Carregando configurações...</p>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Medieval Animated Background */}
      <MedievalAnimatedBackground />
      
      <ToastContainer />
      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => setCurrentView('home')}
            className="group relative overflow-hidden bg-gradient-to-r from-slate-700/90 to-slate-800/90 hover:from-slate-600 hover:to-slate-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 shadow-lg border border-slate-600/30 hover:border-amber-400/50 hover:scale-105 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
              Voltar ao Reino
            </span>
          </Button>
          <div className="text-center">
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
                <Settings className="w-8 h-8 text-amber-400" />
                Conselho Real
          </h1>
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 blur-xl opacity-20 -z-10"></div>
            </div>
            <p className="text-purple-200/90">Personalize sua experiência no reino</p>
        </div>
          <div className="w-24"></div>
        </div>

        {/* Debug Info - Apenas para desenvolvimento */}
        {error && (
          <Card className="bg-gradient-to-br from-red-800/80 to-red-900/80 backdrop-blur-sm border-2 border-red-600/30 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Erro do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white space-y-2">
                <p>Error: {error}</p>
                <p>Settings: {settings ? 'Carregado' : 'Não carregado'}</p>
                <p>Customizations: {customizations?.length || 0} itens</p>
                <p>User Customizations: {userCustomizations?.length || 0} itens</p>
                <p>Equipped: {equippedCustomization ? equippedCustomization.name : 'Nenhum'}</p>
              </div>
            </CardContent>
          </Card>
        )}

                 {/* Tabs de Configurações */}
        <Tabs defaultValue="profile" className="w-full">
           <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-1">
             <TabsTrigger value="profile" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
             <TabsTrigger value="preferences" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
              <Palette className="w-4 h-4 mr-2" />
              Preferências
            </TabsTrigger>
             <TabsTrigger value="battlefield" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
              <Image className="w-4 h-4 mr-2" />
               Campo de Batalha
             </TabsTrigger>
             <TabsTrigger value="containers" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
               <Shield className="w-4 h-4 mr-2" />
               Containers
            </TabsTrigger>
             <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg transition-all duration-300">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </TabsTrigger>
          </TabsList>

          {/* Aba: Perfil */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            {/* Informações Básicas */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-slate-600/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" />
                  Informações Básicas
                </CardTitle>
                <p className="text-gray-400 text-sm">Configure suas informações principais de perfil</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-300">Nome de Usuário</Label>
                    <Input
                      id="username"
                      value={localSettings?.username || ''}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="bg-slate-700/50 border-slate-600/30 text-white focus:border-amber-400/50 focus:ring-amber-400/20"
                      placeholder="Seu nome de usuário"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_name" className="text-gray-300">Nome de Exibição</Label>
                    <Input
                      id="display_name"
                      value={localSettings?.display_name || ''}
                      onChange={(e) => handleInputChange('display_name', e.target.value)}
                      className="bg-slate-700/50 border-slate-600/30 text-white focus:border-amber-400/50 focus:ring-amber-400/20"
                      placeholder="Nome que aparece no jogo"
                    />
                  </div>
                </div>

                                  <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={localSettings?.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-slate-700/50 border-slate-600/30 text-white focus:border-amber-400/50 focus:ring-amber-400/20"
                      placeholder="seu@email.com"
                    />
                    <Badge variant={localSettings?.email_verified ? "default" : "secondary"} className="px-3 py-2">
                      {localSettings?.email_verified ? "✓ Verificado" : "⚠ Não verificado"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar_url" className="text-gray-300">URL do Avatar</Label>
                  <Input
                    id="avatar_url"
                    value={localSettings?.avatar_url || ''}
                    onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/30 text-white focus:border-amber-400/50 focus:ring-amber-400/20"
                    placeholder="https://exemplo.com/avatar.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-300">Biografia</Label>
                  <textarea
                    id="bio"
                    value={localSettings?.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600/30 text-white focus:border-amber-400/50 focus:ring-amber-400/20 rounded-lg p-3 min-h-[100px] resize-none"
                    placeholder="Conte um pouco sobre você..."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500">{(localSettings?.bio?.length || 0)}/500 caracteres</p>
                </div>
              </CardContent>
            </Card>

            {/* Informações Pessoais */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-slate-600/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" />
                  Informações Pessoais
                </CardTitle>
                <p className="text-gray-400 text-sm">Informações opcionais para personalizar seu perfil</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-300">Localização</Label>
                    <Input
                      id="location"
                      value={localSettings?.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="bg-slate-700/50 border-slate-600/30 text-white focus:border-amber-400/50 focus:ring-amber-400/20"
                      placeholder="Sua cidade, país"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-gray-300">Gênero</Label>
                    <Select value={localSettings?.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600/30 text-white focus:border-amber-400/50 focus:ring-amber-400/20">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="nao_binario">Não-binário</SelectItem>
                        <SelectItem value="prefiro_nao_dizer">Prefiro não dizer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="birth_date" className="text-gray-300">Data de Nascimento</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={localSettings?.birth_date || ''}
                      onChange={(e) => handleInputChange('birth_date', e.target.value)}
                      className="bg-slate-700/50 border-slate-600/30 text-white focus:border-amber-400/50 focus:ring-amber-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="text-gray-300">Telefone</Label>
                    <div className="flex gap-2">
                      <Input
                        id="phone_number"
                        value={localSettings?.phone_number || ''}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                        className="bg-slate-700/50 border-slate-600/30 text-white focus:border-amber-400/50 focus:ring-amber-400/20"
                        placeholder="+55 (11) 99999-9999"
                      />
                      <Badge variant={localSettings?.phone_verified ? "default" : "secondary"} className="px-3 py-2">
                        {localSettings?.phone_verified ? "✓ Verificado" : "⚠ Não verificado"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website_url" className="text-gray-300">Website</Label>
                  <Input
                    id="website_url"
                    value={localSettings?.website_url || ''}
                    onChange={(e) => handleInputChange('website_url', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/30 text-white focus:border-amber-400/50 focus:ring-amber-400/20"
                    placeholder="https://meusite.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configurações de Segurança */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-slate-600/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  Segurança da Conta
                </CardTitle>
                <p className="text-gray-400 text-sm">Configure as opções de segurança da sua conta</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-300">Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-gray-400">Adicione uma camada extra de segurança</p>
                  </div>
                  <Switch
                    checked={localSettings?.two_factor_enabled || false}
                    onCheckedChange={(checked) => handleInputChange('two_factor_enabled', checked)}
                  />
                </div>
                <Separator className="bg-slate-600/30" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-300">Status da Conta</Label>
                    <p className="text-sm text-gray-400">Status atual da sua conta</p>
                  </div>
                  <Badge variant={localSettings?.account_status === 'active' ? "default" : "destructive"}>
                    {localSettings?.account_status === 'active' ? 'Ativa' : localSettings?.account_status || 'Ativa'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Alteração de Senha */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-slate-600/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  Alterar Senha
                </CardTitle>
                <p className="text-gray-400 text-sm">Altere sua senha de acesso ao reino</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-gray-300">Senha Atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600/30 text-white focus:border-amber-400/50 focus:ring-amber-400/20"
                    placeholder="Digite sua senha atual"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-300">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600/30 text-white focus:border-amber-400/50 focus:ring-amber-400/20"
                    placeholder="Digite a nova senha"
                  />
                  <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600/30 text-white focus:border-amber-400/50 focus:ring-amber-400/20"
                    placeholder="Confirme a nova senha"
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={changingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {changingPassword ? 'Alterando Senha...' : 'Alterar Senha'}
                </Button>

                {localSettings?.last_password_change && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Última alteração: {new Date(localSettings.last_password_change).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Total de alterações: {localSettings.password_change_count || 0}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estatísticas do Perfil */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-slate-600/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  Estatísticas do Perfil
                </CardTitle>
                <p className="text-gray-400 text-sm">Informações sobre sua atividade no jogo</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-amber-400">{localSettings?.profile_completion_percentage || 0}%</div>
                    <div className="text-sm text-gray-400">Perfil Completo</div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">{localSettings?.login_count || 0}</div>
                    <div className="text-sm text-gray-400">Logins</div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">
                      {localSettings?.last_login ? new Date(localSettings.last_login).toLocaleDateString('pt-BR') : 'Nunca'}
                    </div>
                    <div className="text-sm text-gray-400">Último Login</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSaveSettings}
              disabled={saving}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {saving ? 'Salvando...' : 'Salvar Todas as Configurações'}
            </Button>
          </TabsContent>

          {/* Aba: Preferências */}
          <TabsContent value="preferences" className="mt-6">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-yellow-600/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-yellow-500" />
                  Preferências de Jogo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-300">Tema Escuro</Label>
                      <p className="text-sm text-gray-400">Usar tema escuro medieval</p>
                    </div>
                    <Switch
                      checked={settings?.theme === 'dark'}
                      onCheckedChange={(checked) => handleSaveSettings({ theme: checked ? 'dark' : 'light' })}
                    />
                  </div>
                  <Separator className="bg-yellow-600/30" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-300 flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        Efeitos Sonoros
                      </Label>
                      <p className="text-sm text-gray-400">Ativar sons do jogo</p>
                    </div>
                    <Switch
                      checked={settings?.sound_enabled ?? true}
                      onCheckedChange={(checked) => handleSaveSettings({ sound_enabled: checked })}
                    />
                  </div>
                  <Separator className="bg-yellow-600/30" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-300 flex items-center gap-2">
                        <Music className="w-4 h-4" />
                        Música de Fundo
                      </Label>
                      <p className="text-sm text-gray-400">Ativar música de fundo</p>
                    </div>
                    <Switch
                      checked={settings?.music_enabled ?? true}
                      onCheckedChange={(checked) => handleSaveSettings({ music_enabled: checked })}
                    />
                  </div>
                  <Separator className="bg-yellow-600/30" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-300 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Auto-Save
                      </Label>
                      <p className="text-sm text-gray-400">Salvar automaticamente o progresso</p>
                    </div>
                    <Switch
                      checked={settings?.auto_save_enabled ?? true}
                      onCheckedChange={(checked) => handleSaveSettings({ auto_save_enabled: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="text-gray-300">Idioma</Label>
                  <Select
                    value={settings?.language || 'pt-BR'}
                    onValueChange={(value) => handleSaveSettings({ language: value })}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-yellow-600/30 text-white">
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-yellow-600/30">
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => handleSaveSettings({})}
                  disabled={saving}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {saving ? 'Salvando...' : 'Salvar Preferências'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Campo de Batalha */}
          <TabsContent value="battlefield" className="mt-6">
            <div className="space-y-6">
              {/* Customização Atual */}
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-yellow-600/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-yellow-500" />
                      Campo de Batalha Atual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                  {equippedCustomization ? (
                    <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg border border-yellow-600/30">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Image className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{equippedCustomization.name}</h3>
                        <p className="text-gray-400 text-sm">{equippedCustomization.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {getRarityBadge(equippedCustomization.rarity || 'common')}
                          {getRarityIcon(equippedCustomization.rarity || 'common')}
                        </div>
                      </div>
                      <div className="text-green-400 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Equipado
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Image className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Nenhum campo de batalha equipado</p>
                      <p className="text-gray-500 text-sm">Compre um campo de batalha personalizado na loja</p>
                    </div>
                  )}
                  </CardContent>
                </Card>

                             {/* Customizações Possuídas */}
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-yellow-600/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                     <Eye className="w-5 h-5 text-yellow-500" />
                     Seus Campos de Batalha
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {userCustomizations?.map((userCustomization) => {
                       const customization = userCustomization.customization;
                       if (!customization) return null;
                       
                      const isEquipped = equippedCustomization?.id === customization.id;

                      return (
                         <div key={customization.id} className="bg-slate-700/50 rounded-lg p-4 border border-yellow-600/30">
                           <div className="w-full h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                             <img 
                               src={customization.image_url || ''} 
                               alt={customization.name || ''}
                               className="w-full h-full object-cover"
                               onError={(e) => {
                                 const target = e.currentTarget as HTMLElement;
                                 target.style.display = 'none';
                                 const nextSibling = target.nextElementSibling as HTMLElement;
                                 if (nextSibling) {
                                   nextSibling.style.display = 'flex';
                                 }
                               }}
                             />
                             <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                               <Image className="w-8 h-8 text-white" />
                          </div>
                          </div>
                          
                           <h3 className="text-white font-semibold mb-1">{customization.name || ''}</h3>
                           <p className="text-gray-400 text-sm mb-3">{customization.description || ''}</p>

                                                        <div className="flex items-center justify-between mb-3">
                               <div className="flex items-center gap-2">
                                 {getRarityBadge(customization.rarity || 'common')}
                                 {getRarityIcon(customization.rarity || 'common')}
                                </div>
                            </div>

                            <div className="space-y-2">
                              <Button
                                 onClick={() => handleEquipCustomization(customization.id || '')}
                                 className={`w-full ${isEquipped ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                                size="sm"
                                 disabled={isEquipped}
                              >
                                 {isEquipped ? 'Equipado' : 'Equipar'}
                              </Button>
                            </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

                     {/* Aba: Containers */}
           <TabsContent value="containers" className="mt-6">
             <div className="space-y-6">
               {/* Containers Atuais */}
               <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-yellow-600/30">
                 <CardHeader>
                   <CardTitle className="text-white flex items-center gap-2">
                     <Shield className="w-5 h-5 text-yellow-500" />
                     Containers Atuais
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     {['city', 'farm', 'landmark', 'events'].map((containerType) => {
                       const equipped = equippedContainerCustomizations[containerType];
                       const containerName = {
                         city: 'Cidade',
                         farm: 'Fazenda',
                         landmark: 'Marco',
                         events: 'Eventos'
                       }[containerType];

                       return (
                         <div key={containerType} className="bg-slate-700/50 rounded-lg p-4 border border-yellow-600/30">
                           <div className="w-full h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                             <img 
                               src={equipped?.image_url || `/src/assets/grids_background/${containerName}_background.png`} 
                               alt={equipped?.name || containerName}
                               className="w-full h-full object-cover"
                               onError={(e) => {
                                 const target = e.currentTarget as HTMLElement;
                                 target.style.display = 'none';
                                 const nextSibling = target.nextElementSibling as HTMLElement;
                                 if (nextSibling) {
                                   nextSibling.style.display = 'flex';
                                 }
                               }}
                             />
                             <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                               <Shield className="w-6 h-6 text-white" />
                             </div>
                           </div>

                           <h3 className="text-white font-semibold mb-1">{equipped?.name || `${containerName} Padrão`}</h3>
                           <p className="text-gray-400 text-sm mb-3">{equipped?.description || 'Background padrão'}</p>

                           <div className="flex items-center justify-between mb-3">
                             <div className="flex items-center gap-2">
                               {getRarityBadge(equipped?.rarity || 'common')}
                               {getRarityIcon(equipped?.rarity || 'common')}
                             </div>
                           </div>

                           <div className="text-green-400 flex items-center gap-1 text-sm">
                             <Check className="w-4 h-4" />
                             Equipado
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </CardContent>
               </Card>

               {/* Seus Containers - TEMPORARILY DISABLED */}
               <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-yellow-600/30">
                 <CardHeader>
                   <CardTitle className="text-white flex items-center gap-2">
                     <Eye className="w-5 h-5 text-yellow-500" />
                     Seus Containers
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   {/* Temporary Disabled Message */}
                   <div className="text-center py-8">
                     <Palette className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                     <p className="text-gray-400">Funcionalidade Temporariamente Desabilitada</p>
                     <p className="text-gray-500 text-sm">As customizações de containers estão temporariamente indisponíveis</p>
                   </div>

                   {/* 
                   // TEMPORARILY COMMENTED OUT - CONTAINER CUSTOMIZATIONS LOGIC
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {userContainerCustomizations?.map((userCustomization) => {
                       const customization = userCustomization.customization;
                       if (!customization) return null;
                       
                       const isEquipped = equippedContainerCustomizations[customization.container_type]?.id === customization.id;
                       
                       const getContainerTypeInfo = (type: string) => {
                         const containerTypes = {
                           city: { name: 'Cidade', icon: '🏙️', color: 'from-blue-500 to-blue-600' },
                           farm: { name: 'Fazenda', icon: '🌾', color: 'from-green-500 to-green-600' },
                           landmark: { name: 'Marco', icon: '🏛️', color: 'from-purple-500 to-purple-600' },
                           events: { name: 'Eventos', icon: '🎪', color: 'from-orange-500 to-orange-600' }
                         };
                         return containerTypes[type as keyof typeof containerTypes] || containerTypes.city;
                       };

                       const containerInfo = getContainerTypeInfo(customization.container_type);

                       return (
                         <div key={customization.id} className="bg-slate-700/50 rounded-lg p-4 border border-yellow-600/30">
                           // Container Type Badge
                           <div className="flex items-center gap-2 mb-3">
                             <Badge className={`bg-gradient-to-r ${containerInfo.color} text-white border-0`}>
                               {containerInfo.icon} {containerInfo.name}
                             </Badge>
                           </div>

                           <div className="w-full h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                             <img 
                               src={customization.image_url || ''} 
                               alt={customization.name || ''}
                               className="w-full h-full object-cover"
                               onError={(e) => {
                                 const target = e.currentTarget as HTMLElement;
                                 target.style.display = 'none';
                                 const nextSibling = target.nextElementSibling as HTMLElement;
                                 if (nextSibling) {
                                   nextSibling.style.display = 'flex';
                                 }
                               }}
                             />
                             <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                               <Shield className="w-8 h-8 text-white" />
                             </div>
                           </div>

                           <h3 className="text-white font-semibold mb-1">{customization.name || ''}</h3>
                           <p className="text-gray-400 text-sm mb-3">{customization.description || ''}</p>

                           <div className="flex items-center justify-between mb-3">
                             <div className="flex items-center gap-2">
                               {getRarityBadge(customization.rarity || 'common')}
                               {getRarityIcon(customization.rarity || 'common')}
                             </div>
                           </div>

                           <div className="space-y-2">
                             <Button
                               onClick={() => equipContainerCustomization(customization.id || '', customization.container_type || 'city')}
                               className={`w-full ${isEquipped ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                               size="sm"
                               disabled={isEquipped}
                             >
                               {isEquipped ? 'Equipado' : 'Equipar'}
                             </Button>
                           </div>
                         </div>
                       );
                     })}
                   </div>

                   {(!userContainerCustomizations || userContainerCustomizations.length === 0) && (
                     <div className="text-center py-8">
                       <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                       <p className="text-gray-400">Nenhum container personalizado encontrado</p>
                       <p className="text-gray-500 text-sm">Compre containers personalizados na loja</p>
                     </div>
                   )}
                   */}
                 </CardContent>
               </Card>
             </div>
           </TabsContent>

           {/* Aba: Notificações */}
          <TabsContent value="notifications" className="mt-6">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-yellow-600/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-500" />
                  Configurações de Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-300">Notificações Gerais</Label>
                      <p className="text-sm text-gray-400">Receber notificações do jogo</p>
                    </div>
                    <Switch
                      checked={settings?.notifications_enabled ?? true}
                      onCheckedChange={(checked) => handleSaveSettings({ notifications_enabled: checked })}
                    />
                  </div>
                  <Separator className="bg-yellow-600/30" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-300">Notificações de Missões</Label>
                      <p className="text-sm text-gray-400">Novas missões disponíveis</p>
                    </div>
                    <Switch
                      checked={settings?.notifications_enabled ?? true}
                      onCheckedChange={(checked) => handleSaveSettings({ notifications_enabled: checked })}
                    />
                  </div>
                  <Separator className="bg-yellow-600/30" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-300">Notificações de Loja</Label>
                      <p className="text-sm text-gray-400">Novos itens na loja</p>
                    </div>
                    <Switch
                      checked={settings?.notifications_enabled ?? true}
                      onCheckedChange={(checked) => handleSaveSettings({ notifications_enabled: checked })}
                    />
                  </div>
                  <Separator className="bg-yellow-600/30" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-300">Notificações de Eventos</Label>
                      <p className="text-sm text-gray-400">Eventos especiais e promoções</p>
                    </div>
                    <Switch
                      checked={settings?.notifications_enabled ?? true}
                      onCheckedChange={(checked) => handleSaveSettings({ notifications_enabled: checked })}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => handleSaveSettings({})}
                  disabled={saving}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {saving ? 'Salvando...' : 'Salvar Notificações'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}; 