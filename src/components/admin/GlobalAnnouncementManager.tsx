import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  Megaphone,
  AlertTriangle,
  Info,
  Wrench,
  Calendar,
  Bell,
  Home,
  Gamepad2
} from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../ui/toast';

interface GlobalAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'update' | 'maintenance' | 'event' | 'news' | 'warning' | 'info';
  icon: string;
  color: 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'yellow';
  is_active: boolean;
  priority: 1 | 2 | 3 | 4;
  show_on_homepage: boolean;
  show_in_game: boolean;
  dismissible: boolean;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export const GlobalAnnouncementManager: React.FC = () => {
  const [announcements, setAnnouncements] = useState<GlobalAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as GlobalAnnouncement['type'],
    icon: '📢',
    color: 'blue' as GlobalAnnouncement['color'],
    is_active: true,
    priority: 1 as GlobalAnnouncement['priority'],
    show_on_homepage: true,
    show_in_game: true,
    dismissible: true,
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('global_announcements')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements((data || []) as GlobalAnnouncement[]);
    } catch (error) {
      console.error('Erro ao carregar anúncios globais:', error);
      showToast('Erro ao carregar anúncios globais', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      icon: '📢',
      color: 'blue',
      is_active: true,
      priority: 1,
      show_on_homepage: true,
      show_in_game: true,
      dismissible: true,
      start_date: new Date().toISOString().split('T')[0],
      end_date: ''
    });
    setEditingId(null);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      showToast('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    try {
      const announcementData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null
      };

      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('global_announcements')
          .update(announcementData)
          .eq('id', editingId);

        if (error) throw error;
        showToast('Anúncio global atualizado com sucesso!', 'success');
      } else {
        // Create new
        const { error } = await supabase
          .from('global_announcements')
          .insert(announcementData);

        if (error) throw error;
        showToast('Anúncio global criado com sucesso!', 'success');
      }

      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error('Erro ao salvar anúncio global:', error);
      showToast('Erro ao salvar anúncio global', 'error');
    }
  };

  const handleEdit = (announcement: GlobalAnnouncement) => {
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      icon: announcement.icon,
      color: announcement.color,
      is_active: announcement.is_active,
      priority: announcement.priority,
      show_on_homepage: announcement.show_on_homepage,
      show_in_game: announcement.show_in_game,
      dismissible: announcement.dismissible,
      start_date: new Date(announcement.start_date).toISOString().split('T')[0],
      end_date: announcement.end_date ? new Date(announcement.end_date).toISOString().split('T')[0] : ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio global?')) return;

    try {
      const { error } = await supabase
        .from('global_announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Anúncio global excluído com sucesso!', 'success');
      fetchAnnouncements();
    } catch (error) {
      console.error('Erro ao excluir anúncio global:', error);
      showToast('Erro ao excluir anúncio global', 'error');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('global_announcements')
        .update({ is_active: !currentActive })
        .eq('id', id);

      if (error) throw error;
      showToast(`Anúncio global ${!currentActive ? 'ativado' : 'desativado'} com sucesso!`, 'success');
      fetchAnnouncements();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      showToast('Erro ao alterar status', 'error');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'news': return <Megaphone className="w-4 h-4" />;
      case 'update': return <Bell className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red': return 'from-red-600/20 to-red-800/20 border-red-500/40';
      case 'green': return 'from-green-600/20 to-green-800/20 border-green-500/40';
      case 'blue': return 'from-blue-600/20 to-blue-800/20 border-blue-500/40';
      case 'purple': return 'from-purple-600/20 to-purple-800/20 border-purple-500/40';
      case 'orange': return 'from-orange-600/20 to-orange-800/20 border-orange-500/40';
      case 'yellow': return 'from-yellow-600/20 to-yellow-800/20 border-yellow-500/40';
      default: return 'from-blue-600/20 to-blue-800/20 border-blue-500/40';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 4: return { label: 'Crítico', color: 'bg-red-600' };
      case 3: return { label: 'Alto', color: 'bg-orange-600' };
      case 2: return { label: 'Médio', color: 'bg-yellow-600' };
      case 1: return { label: 'Baixo', color: 'bg-green-600' };
      default: return { label: 'Baixo', color: 'bg-green-600' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando anúncios globais...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciar Anúncios Globais</h1>
          <p className="text-gray-300">
            Crie e gerencie anúncios que aparecem em todo o jogo
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0">
          <Plus className="w-4 h-4" />
          Novo Anúncio Global
        </Button>
      </div>

      {/* Form */}
      {(isCreating || editingId) && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="flex items-center gap-2 text-white">
              {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingId ? 'Editar Anúncio Global' : 'Novo Anúncio Global'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Manutenção Programada"
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-gray-300">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="info" className="text-white hover:bg-gray-700">Informação</SelectItem>
                      <SelectItem value="news" className="text-white hover:bg-gray-700">Notícia</SelectItem>
                      <SelectItem value="update" className="text-white hover:bg-gray-700">Atualização</SelectItem>
                      <SelectItem value="event" className="text-white hover:bg-gray-700">Evento</SelectItem>
                      <SelectItem value="maintenance" className="text-white hover:bg-gray-700">Manutenção</SelectItem>
                      <SelectItem value="warning" className="text-white hover:bg-gray-700">Aviso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-gray-300">Mensagem *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Digite a mensagem do anúncio..."
                  rows={3}
                  required
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="icon" className="text-gray-300">Ícone</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="📢"
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="color" className="text-gray-300">Cor</Label>
                  <Select value={formData.color} onValueChange={(value: any) => setFormData({ ...formData, color: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="red" className="text-white hover:bg-gray-700">Vermelho</SelectItem>
                      <SelectItem value="green" className="text-white hover:bg-gray-700">Verde</SelectItem>
                      <SelectItem value="blue" className="text-white hover:bg-gray-700">Azul</SelectItem>
                      <SelectItem value="purple" className="text-white hover:bg-gray-700">Roxo</SelectItem>
                      <SelectItem value="orange" className="text-white hover:bg-gray-700">Laranja</SelectItem>
                      <SelectItem value="yellow" className="text-white hover:bg-gray-700">Amarelo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority" className="text-gray-300">Prioridade</Label>
                  <Select value={formData.priority.toString()} onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) as any })}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="1" className="text-white hover:bg-gray-700">Baixa</SelectItem>
                      <SelectItem value="2" className="text-white hover:bg-gray-700">Média</SelectItem>
                      <SelectItem value="3" className="text-white hover:bg-gray-700">Alta</SelectItem>
                      <SelectItem value="4" className="text-white hover:bg-gray-700">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="start_date" className="text-gray-300">Data de Início</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="end_date" className="text-gray-300">Data de Fim (Opcional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active" className="text-gray-300">Ativo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show_on_homepage"
                      checked={formData.show_on_homepage}
                      onCheckedChange={(checked) => setFormData({ ...formData, show_on_homepage: checked })}
                    />
                    <Label htmlFor="show_on_homepage" className="text-gray-300">Mostrar na Página Inicial</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show_in_game"
                      checked={formData.show_in_game}
                      onCheckedChange={(checked) => setFormData({ ...formData, show_in_game: checked })}
                    />
                    <Label htmlFor="show_in_game" className="text-gray-300">Mostrar Durante o Jogo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dismissible"
                      checked={formData.dismissible}
                      onCheckedChange={(checked) => setFormData({ ...formData, dismissible: checked })}
                    />
                    <Label htmlFor="dismissible" className="text-gray-300">Permitir Fechar</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0">
                  <Save className="w-4 h-4" />
                  {editingId ? 'Atualizar' : 'Criar'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                  <X className="w-4 h-4" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Anúncios Globais Existentes ({announcements.length})</h2>
        
        {announcements.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center">
                <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300">Nenhum anúncio global criado ainda</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className={`bg-gradient-to-r ${getColorClasses(announcement.color)} border`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{announcement.icon}</span>
                        <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={announcement.is_active ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}>
                            {announcement.is_active ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                            {announcement.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Badge className={getPriorityLabel(announcement.priority).color}>
                            {getPriorityLabel(announcement.priority).label}
                          </Badge>
                          <Badge variant="outline">
                            {getTypeIcon(announcement.type)}
                            {announcement.type}
                          </Badge>
                          {announcement.show_on_homepage && (
                            <Badge variant="outline" className="bg-blue-600 text-white">
                              <Home className="w-3 h-3 mr-1" />
                              Home
                            </Badge>
                          )}
                          {announcement.show_in_game && (
                            <Badge variant="outline" className="bg-purple-600 text-white">
                              <Gamepad2 className="w-3 h-3 mr-1" />
                              Jogo
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{announcement.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Início: {new Date(announcement.start_date).toLocaleDateString()}</span>
                        {announcement.end_date && (
                          <span>Fim: {new Date(announcement.end_date).toLocaleDateString()}</span>
                        )}
                        <span>Criado: {new Date(announcement.created_at).toLocaleDateString()}</span>
                        <span>Dispensável: {announcement.dismissible ? 'Sim' : 'Não'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(announcement.id, announcement.is_active)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        {announcement.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(announcement)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(announcement.id)}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-lg border-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 