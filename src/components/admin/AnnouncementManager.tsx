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
  Gift,
  Calendar
} from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../ui/toast';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'promotion' | 'alert' | 'info' | 'warning';
  icon: string;
  color: 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'yellow';
  is_active: boolean;
  priority: 1 | 2 | 3;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export const AnnouncementManager: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as Announcement['type'],
    icon: '📢',
    color: 'blue' as Announcement['color'],
    is_active: true,
    priority: 1 as Announcement['priority'],
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
        .from('shop_announcements')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Erro ao carregar avisos:', error);
      showToast('Erro ao carregar avisos', 'error');
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
          .from('shop_announcements')
          .update(announcementData)
          .eq('id', editingId);

        if (error) throw error;
        showToast('Aviso atualizado com sucesso!', 'success');
      } else {
        // Create new
        const { error } = await supabase
          .from('shop_announcements')
          .insert(announcementData);

        if (error) throw error;
        showToast('Aviso criado com sucesso!', 'success');
      }

      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error('Erro ao salvar aviso:', error);
      showToast('Erro ao salvar aviso', 'error');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      icon: announcement.icon,
      color: announcement.color,
      is_active: announcement.is_active,
      priority: announcement.priority,
      start_date: new Date(announcement.start_date).toISOString().split('T')[0],
      end_date: announcement.end_date ? new Date(announcement.end_date).toISOString().split('T')[0] : ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este aviso?')) return;

    try {
      const { error } = await supabase
        .from('shop_announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Aviso excluído com sucesso!', 'success');
      fetchAnnouncements();
    } catch (error) {
      console.error('Erro ao excluir aviso:', error);
      showToast('Erro ao excluir aviso', 'error');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('shop_announcements')
        .update({ is_active: !currentActive })
        .eq('id', id);

      if (error) throw error;
      showToast(`Aviso ${!currentActive ? 'ativado' : 'desativado'} com sucesso!`, 'success');
      fetchAnnouncements();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      showToast('Erro ao alterar status', 'error');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'promotion': return <Gift className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
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
      case 3: return { label: 'Alta', color: 'bg-red-600' };
      case 2: return { label: 'Média', color: 'bg-yellow-600' };
      case 1: return { label: 'Baixa', color: 'bg-green-600' };
      default: return { label: 'Baixa', color: 'bg-green-600' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando avisos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Avisos da Loja</h1>
          <p className="text-muted-foreground">
            Crie e gerencie avisos e anúncios que aparecem na loja
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Aviso
        </Button>
      </div>

      {/* Form */}
      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingId ? 'Editar Aviso' : 'Novo Aviso'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: MEGA PROMOÇÃO!"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Informação</SelectItem>
                      <SelectItem value="promotion">Promoção</SelectItem>
                      <SelectItem value="alert">Alerta</SelectItem>
                      <SelectItem value="warning">Aviso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="message">Mensagem *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Digite a mensagem do aviso..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="icon">Ícone</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🔥"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Cor</Label>
                  <Select value={formData.color} onValueChange={(value: any) => setFormData({ ...formData, color: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="red">Vermelho</SelectItem>
                      <SelectItem value="green">Verde</SelectItem>
                      <SelectItem value="blue">Azul</SelectItem>
                      <SelectItem value="purple">Roxo</SelectItem>
                      <SelectItem value="orange">Laranja</SelectItem>
                      <SelectItem value="yellow">Amarelo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select value={formData.priority.toString()} onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Baixa</SelectItem>
                      <SelectItem value="2">Média</SelectItem>
                      <SelectItem value="3">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="start_date">Data de Início</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="end_date">Data de Fim (Opcional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingId ? 'Atualizar' : 'Criar'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="flex items-center gap-2">
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
        <h2 className="text-xl font-semibold">Avisos Existentes ({announcements.length})</h2>
        
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center">
                <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Nenhum aviso criado ainda</p>
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
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{announcement.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Início: {new Date(announcement.start_date).toLocaleDateString()}</span>
                        {announcement.end_date && (
                          <span>Fim: {new Date(announcement.end_date).toLocaleDateString()}</span>
                        )}
                        <span>Criado: {new Date(announcement.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(announcement.id, announcement.is_active)}
                      >
                        {announcement.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(announcement.id)}
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