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
  Eye
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    loading: settingsLoading,
    error: settingsError,
    updateUserSettings
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

  const handleSaveSettings = async (updates: Partial<any>) => {
    try {
      setSaving(true);
      await updateUserSettings(updates);
      showToast('Configurações salvas com sucesso!', 'success');
    } catch (err: any) {
      showToast(`Erro ao salvar: ${err.message}`, 'error');
    } finally {
      setSaving(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => setCurrentView('home')}
            variant="outline"
            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-white hover:text-blue-400 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Settings className="w-8 h-8 text-yellow-500" />
            Configurações do Reino
          </h1>
          <p className="text-gray-300">Personalize sua experiência no jogo</p>
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
           <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-yellow-600/30">
             <TabsTrigger value="profile" className="text-white data-[state=active]:bg-yellow-600/30">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
             <TabsTrigger value="preferences" className="text-white data-[state=active]:bg-yellow-600/30">
              <Palette className="w-4 h-4 mr-2" />
              Preferências
            </TabsTrigger>
             <TabsTrigger value="battlefield" className="text-white data-[state=active]:bg-yellow-600/30">
              <Image className="w-4 h-4 mr-2" />
               Campo de Batalha
             </TabsTrigger>
             <TabsTrigger value="containers" className="text-white data-[state=active]:bg-yellow-600/30">
               <Shield className="w-4 h-4 mr-2" />
               Containers
            </TabsTrigger>
             <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-yellow-600/30">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </TabsTrigger>
          </TabsList>

          {/* Aba: Perfil */}
          <TabsContent value="profile" className="mt-6">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-yellow-600/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-yellow-500" />
                  Informações do Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-300">Nome de Usuário</Label>
                    <Input
                      id="username"
                      value={settings?.username || ''}
                      onChange={(e) => handleSaveSettings({ username: e.target.value })}
                      className="bg-slate-700/50 border-yellow-600/30 text-white"
                      placeholder="Seu nome de usuário"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_name" className="text-gray-300">Nome de Exibição</Label>
                    <Input
                      id="display_name"
                      value={settings?.display_name || ''}
                      onChange={(e) => handleSaveSettings({ display_name: e.target.value })}
                      className="bg-slate-700/50 border-yellow-600/30 text-white"
                      placeholder="Nome que aparece no jogo"
                    />
                  </div>
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings?.email || ''}
                      onChange={(e) => handleSaveSettings({ email: e.target.value })}
                      className="bg-slate-700/50 border-yellow-600/30 text-white"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                  <Label htmlFor="avatar_url" className="text-gray-300">URL do Avatar</Label>
                  <Input
                    id="avatar_url"
                    value={settings?.avatar_url || ''}
                    onChange={(e) => handleSaveSettings({ avatar_url: e.target.value })}
                    className="bg-slate-700/50 border-yellow-600/30 text-white"
                    placeholder="https://exemplo.com/avatar.jpg"
                  />
                </div>

                <Button
                  onClick={() => handleSaveSettings({})}
                  disabled={saving}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {saving ? 'Salvando...' : 'Salvar Perfil'}
                </Button>
              </CardContent>
            </Card>
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