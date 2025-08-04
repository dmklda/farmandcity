import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, FileText, TrendingUp, DollarSign, LogOut, User, CreditCard, Package, Palette, Activity } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCards: 0,
    totalUsers: 0,
    totalPurchases: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch cards count
      const { count: cardsCount } = await supabase
        .from('cards')
        .select('*', { count: 'exact', head: true });

      // Fetch users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch purchases count
      const { count: purchasesCount } = await supabase
        .from('pack_purchases')
        .select('*', { count: 'exact', head: true });

      // Calculate revenue (simplified)
      const { data: packs } = await supabase
        .from('booster_packs')
        .select('price_coins');

      const revenue = packs?.reduce((total: number, pack: any) => total + pack.price_coins, 0) || 0;

      setStats({
        totalCards: cardsCount || 0,
        totalUsers: usersCount || 0,
        totalPurchases: purchasesCount || 0,
        totalRevenue: revenue
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Você precisa estar logado para acessar o painel administrativo.</p>
            <Button onClick={() => window.location.href = '/admin'} className="w-full">
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Painel Administrativo - Famand</h1>
              <p className="text-muted-foreground">Gerencie cartas, usuários e estatísticas do jogo</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Cartas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCards}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compras</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPurchases}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita (Moedas)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-yellow-600/30 hover:border-yellow-500/60 transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/admin/cards')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Gerenciar Cartas</h3>
                  <p className="text-gray-400 text-sm">Criar e editar cartas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-blue-600/30 hover:border-blue-500/60 transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/admin/packs')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Packs e Boosters</h3>
                  <p className="text-gray-400 text-sm">Gerenciar pacotes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-purple-600/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/admin/customizations')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Customizações</h3>
                  <p className="text-gray-400 text-sm">Campos e containers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-green-600/30 hover:border-green-500/60 transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/admin/users')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Usuários</h3>
                  <p className="text-gray-400 text-sm">Gerenciar jogadores</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-2 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Novas cartas criadas</p>
                  <p className="text-gray-400 text-sm">5 cartas foram adicionadas ao sistema</p>
                </div>
                <span className="text-gray-500 text-sm">2h atrás</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Packs atualizados</p>
                  <p className="text-gray-400 text-sm">3 packs foram modificados</p>
                </div>
                <span className="text-gray-500 text-sm">4h atrás</span>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Customizações ativas</p>
                  <p className="text-gray-400 text-sm">2 novas customizações disponíveis</p>
                </div>
                <span className="text-gray-500 text-sm">6h atrás</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
