import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Activity,
  Calendar,
  Trophy,
  Target,
  Plus,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  user_metadata?: {
    display_name?: string;
    username?: string;
  };
  stats?: {
    games_played: number;
    total_score: number;
    reputation: number;
    achievements: number;
  };
}

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    display_name: '',
    username: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Buscar dados dos perfis
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar estatísticas de jogos para cada usuário
      const { data: gameStats, error: gameStatsError } = await supabase
        .from('game_history')
        .select('player_id, final_score, turns_played, buildings_built, landmarks_built');

      if (gameStatsError) throw gameStatsError;

      // Buscar estatísticas de compras
      const { data: purchaseStats, error: purchaseStatsError } = await supabase
        .from('pack_purchases')
        .select('user_id, purchased_at');

      if (purchaseStatsError) throw purchaseStatsError;

      // Criar mapa de estatísticas por usuário
      const statsMap = new Map();
      gameStats?.forEach(stat => {
        if (!statsMap.has(stat.player_id)) {
          statsMap.set(stat.player_id, {
            games_played: 0,
            total_score: 0,
            reputation: 0,
            achievements: 0,
            total_purchases: 0
          });
        }
        const userStats = statsMap.get(stat.player_id);
        userStats.games_played++;
        userStats.total_score += stat.final_score || 0;
        userStats.reputation += (stat.buildings_built || 0) + (stat.landmarks_built || 0);
        userStats.achievements += stat.turns_played > 10 ? 1 : 0; // Achievement simples
      });

      // Adicionar estatísticas de compras
      purchaseStats?.forEach(purchase => {
        if (statsMap.has(purchase.user_id)) {
          statsMap.get(purchase.user_id).total_purchases++;
        }
      });

      // Mapear profiles para o formato esperado com estatísticas reais
      const enrichedUsers = (profiles || []).map((profile: any) => {
        const userStats = statsMap.get(profile.user_id) || {
          games_played: 0,
          total_score: 0,
          reputation: 0,
          achievements: 0,
          total_purchases: 0
        };

        return {
          id: profile.user_id,
          email: profile.username || profile.display_name || 'N/A',
          created_at: profile.created_at,
          email_confirmed_at: profile.created_at,
          last_sign_in_at: profile.updated_at,
          stats: userStats
        };
      });

      setUsers(enrichedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUserForm.email,
        password: newUserForm.password,
        email_confirm: true
      });

      if (authError) throw authError;

      // Criar perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          user_id: authData.user.id,
          username: newUserForm.username,
          display_name: newUserForm.display_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (profileError) throw profileError;

      toast.success('Usuário criado com sucesso!');
      setShowAddUserModal(false);
      setNewUserForm({
        email: '',
        password: '',
        display_name: '',
        username: ''
      });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Erro ao criar usuário');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.user_metadata?.display_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isActive = user.last_sign_in_at && 
                    new Date(user.last_sign_in_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 dias
    
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && isActive) ||
                         (filterActive === 'inactive' && !isActive);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.last_sign_in_at && 
      new Date(u.last_sign_in_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
    newThisMonth: users.filter(u => 
      new Date(u.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Usuários</h1>
            <p className="text-muted-foreground">Gerencie jogadores e suas estatísticas</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 p-6 rounded-2xl border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-200 mb-2">Gerenciar Usuários</h1>
            <p className="text-gray-400">Gerencie jogadores e suas estatísticas</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowAddUserModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl border-0"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Usuário
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-gray-700 bg-gray-800/50">
          <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-700">
            <CardTitle className="flex items-center gap-2 text-gray-200">
              <Users className="h-5 w-5 text-purple-400" />
              Total de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-gray-200">{stats.total}</div>
            <p className="text-sm text-gray-400 mt-2">
              +{stats.newThisMonth} este mês
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-gray-700 bg-gray-800/50">
          <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-700">
            <CardTitle className="flex items-center gap-2 text-gray-200">
              <Activity className="h-5 w-5 text-purple-400" />
              Usuários Ativos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-gray-200">{stats.active}</div>
            <p className="text-sm text-gray-400 mt-2">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-gray-700 bg-gray-800/50">
          <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-700">
            <CardTitle className="flex items-center gap-2 text-gray-200">
              <Calendar className="h-5 w-5 text-purple-400" />
              Novos Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-gray-200">{stats.newThisMonth}</div>
            <p className="text-sm text-gray-400 mt-2">
              Este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-gray-700 bg-gray-800/50">
        <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-700">
          <CardTitle className="flex items-center gap-2 text-gray-200">
            <Filter className="h-5 w-5 text-purple-400" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por email ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterActive === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterActive('all')}
                className={filterActive === 'all' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
              >
                Todos
              </Button>
              <Button
                variant={filterActive === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterActive('active')}
                className={filterActive === 'active' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
              >
                Ativos
              </Button>
              <Button
                variant={filterActive === 'inactive' ? 'default' : 'outline'}
                onClick={() => setFilterActive('inactive')}
                className={filterActive === 'inactive' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
              >
                Inativos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{user.email}</h3>
                    <p className="text-sm text-muted-foreground">
                      Criado em {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        <Trophy className="h-3 w-3 mr-1" />
                        {user.stats?.games_played || 0} jogos
                      </Badge>
                      <Badge variant="outline">
                        <Target className="h-3 w-3 mr-1" />
                        {user.stats?.total_score || 0} pontos
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Último acesso: {user.last_sign_in_at ? 
                        new Date(user.last_sign_in_at).toLocaleDateString() : 'Nunca'}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Adicionar Novo Usuário</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddUserModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                  placeholder="usuario@exemplo.com"
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                  placeholder="Senha forte"
                />
              </div>

              <div>
                <Label htmlFor="display_name">Nome de Exibição</Label>
                <Input
                  id="display_name"
                  value={newUserForm.display_name}
                  onChange={(e) => setNewUserForm({...newUserForm, display_name: e.target.value})}
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  value={newUserForm.username}
                  onChange={(e) => setNewUserForm({...newUserForm, username: e.target.value})}
                  placeholder="nome_usuario"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button 
                onClick={handleCreateUser}
                className="flex-1"
                disabled={!newUserForm.email || !newUserForm.password}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Usuário
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddUserModal(false);
                  setNewUserForm({
                    email: '',
                    password: '',
                    display_name: '',
                    username: ''
                  });
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 
