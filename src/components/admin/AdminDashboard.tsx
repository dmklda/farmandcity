import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { CardManager } from './CardManager';
import { UserStatsPanel } from './UserStatsPanel';
import { GameStatsPanel } from './GameStatsPanel';
import { MonetizationPanel } from './MonetizationPanel';
import { AdvancedStatsPanel } from './AdvancedStatsPanel';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users, FileText, TrendingUp, DollarSign, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminDashboard: React.FC = () => {
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

        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="cards">Gerenciar Cartas</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="advanced-stats">Estatísticas Avançadas</TabsTrigger>
            <TabsTrigger value="monetization">Monetização</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="mt-6">
            <CardManager onStatsUpdate={fetchDashboardStats} />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserStatsPanel />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <GameStatsPanel />
          </TabsContent>

          <TabsContent value="advanced-stats" className="mt-6">
            <AdvancedStatsPanel />
          </TabsContent>

          <TabsContent value="monetization" className="mt-6">
            <MonetizationPanel onStatsUpdate={fetchDashboardStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};