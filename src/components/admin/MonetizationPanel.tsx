import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { 
  DollarSign, 
  Coins, 
  Gem, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Package, 
  Star,
  Calendar,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface MonetizationPanelProps {
  onStatsUpdate: () => void;
}

interface TransactionStats {
  totalRevenue: number;
  totalTransactions: number;
  averageTransactionValue: number;
  topSellingItems: any[];
  recentTransactions: any[];
  userStats: any[];
  dailyStats: any[];
  monthlyStats: any[];
}

export const MonetizationPanel: React.FC<MonetizationPanelProps> = ({ onStatsUpdate }) => {
  const [stats, setStats] = useState<TransactionStats>({
    totalRevenue: 0,
    totalTransactions: 0,
    averageTransactionValue: 0,
    topSellingItems: [],
    recentTransactions: [],
    userStats: [],
    dailyStats: [],
    monthlyStats: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    fetchAllTransactionData();
  }, [selectedPeriod]);

  const fetchAllTransactionData = async () => {
    try {
      setLoading(true);
      
      // Buscar todas as transações da loja
      const { data: shopPurchases, error: shopError } = await supabase
        .from('shop_purchases')
        .select(`
          *,
          shop_items (name, price_dollars, item_type),
          profiles (display_name, email)
        `)
        .order('purchased_at', { ascending: false });

      if (shopError) throw shopError;

      // Buscar compras de cartas
      const { data: cardPurchases, error: cardError } = await supabase
        .from('card_purchases')
        .select(`
          *,
          profiles (display_name, email)
        `)
        .order('purchased_at', { ascending: false });

      if (cardError) throw cardError;

      // Buscar compras de packs
      const { data: packPurchases, error: packError } = await supabase
        .from('pack_purchases')
        .select(`
          *,
          booster_packs (name, price_coins),
          profiles (display_name, email)
        `)
        .order('purchased_at', { ascending: false });

      if (packError) throw packError;

      // Buscar compras de starter pack
      const { data: starterPackPurchases, error: starterError } = await supabase
        .from('player_pack_purchases')
        .select(`
          *,
          special_packs (name),
          profiles (display_name, email)
        `)
        .order('purchased_at', { ascending: false });

      if (starterError) throw starterError;

      // Calcular estatísticas
      const allTransactions = [
        ...(shopPurchases || []),
        ...(cardPurchases || []),
        ...(packPurchases || []),
        ...(starterPackPurchases || [])
      ];

      const totalRevenue = calculateTotalRevenue(allTransactions);
      const totalTransactions = allTransactions.length;
      const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
      const topSellingItems = calculateTopSellingItems(allTransactions);
      const userStats = calculateUserStats(allTransactions);
      const dailyStats = calculateDailyStats(allTransactions);
      const monthlyStats = calculateMonthlyStats(allTransactions);

      setStats({
        totalRevenue,
        totalTransactions,
        averageTransactionValue,
        topSellingItems,
        recentTransactions: allTransactions.slice(0, 20),
        userStats,
        dailyStats,
        monthlyStats
      });

      onStatsUpdate();
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      toast.error('Erro ao carregar dados de transação');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalRevenue = (transactions: any[]): number => {
    return transactions.reduce((total, transaction) => {
      // Calcular valor baseado no tipo de transação
      if (transaction.shop_items?.price_dollars) {
        return total + parseFloat(transaction.shop_items.price_dollars);
      }
      // Para outras transações, estimar valor baseado em moedas/gemas
      if (transaction.total_price_coins) {
        return total + (transaction.total_price_coins / 100); // Estimativa: 100 moedas = $1
      }
      if (transaction.total_price_gems) {
        return total + (transaction.total_price_gems * 0.1); // Estimativa: 1 gema = $0.10
      }
      return total;
    }, 0);
  };

  const calculateTopSellingItems = (transactions: any[]): any[] => {
    const itemCounts: { [key: string]: number } = {};
    
    transactions.forEach(transaction => {
      const itemName = transaction.shop_items?.name || 
                      transaction.booster_packs?.name || 
                      transaction.special_packs?.name || 
                      'Carta Individual';
      
      itemCounts[itemName] = (itemCounts[itemName] || 0) + 1;
    });

    return Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const calculateUserStats = (transactions: any[]): any[] => {
    const userStats: { [key: string]: any } = {};
    
    transactions.forEach(transaction => {
      const userId = transaction.player_id || transaction.user_id;
      const userName = transaction.profiles?.display_name || transaction.profiles?.email || 'Usuário Desconhecido';
      
      if (!userStats[userId]) {
        userStats[userId] = {
          id: userId,
          name: userName,
          totalSpent: 0,
          transactions: 0,
          lastPurchase: null
        };
      }
      
      userStats[userId].transactions++;
      userStats[userId].totalSpent += calculateTransactionValue(transaction);
      
      if (!userStats[userId].lastPurchase || 
          new Date(transaction.purchased_at) > new Date(userStats[userId].lastPurchase)) {
        userStats[userId].lastPurchase = transaction.purchased_at;
      }
    });

    return Object.values(userStats)
      .sort((a: any, b: any) => b.totalSpent - a.totalSpent)
      .slice(0, 20);
  };

  const calculateTransactionValue = (transaction: any): number => {
    if (transaction.shop_items?.price_dollars) {
      return parseFloat(transaction.shop_items.price_dollars);
    }
    if (transaction.total_price_coins) {
      return transaction.total_price_coins / 100;
    }
    if (transaction.total_price_gems) {
      return transaction.total_price_gems * 0.1;
    }
    return 0;
  };

  const calculateDailyStats = (transactions: any[]): any[] => {
    const dailyStats: { [key: string]: any } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.purchased_at).toISOString().split('T')[0];
      
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date,
          revenue: 0,
          transactions: 0
        };
      }
      
      dailyStats[date].revenue += calculateTransactionValue(transaction);
      dailyStats[date].transactions++;
    });

    return Object.values(dailyStats)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30);
  };

  const calculateMonthlyStats = (transactions: any[]): any[] => {
    const monthlyStats: { [key: string]: any } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.purchased_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          month: monthKey,
          revenue: 0,
          transactions: 0
        };
      }
      
      monthlyStats[monthKey].revenue += calculateTransactionValue(transaction);
      monthlyStats[monthKey].transactions++;
    });

    return Object.values(monthlyStats)
      .sort((a: any, b: any) => b.month.localeCompare(a.month));
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-yellow-500" />
          <p className="text-gray-400">Carregando dados de monetização...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-800/20 border-green-600/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-400">Receita Total</p>
                <p className="text-2xl font-bold text-green-300">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/20 to-indigo-800/20 border-blue-600/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-400">Total de Transações</p>
                <p className="text-2xl font-bold text-blue-300">
                  {stats.totalTransactions}
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-violet-800/20 border-purple-600/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-400">Ticket Médio</p>
                <p className="text-2xl font-bold text-purple-300">
                  {formatCurrency(stats.averageTransactionValue)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/20 to-amber-800/20 border-yellow-600/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-400">Usuários Ativos</p>
                <p className="text-2xl font-bold text-yellow-300">
                  {stats.userStats.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes visualizações */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="transactions">Transações Recentes</TabsTrigger>
          <TabsTrigger value="top-items">Itens Mais Vendidos</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="daily">Estatísticas Diárias</TabsTrigger>
          <TabsTrigger value="monthly">Estatísticas Mensais</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Transações Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-yellow-600/20 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {transaction.shop_items?.name || 
                           transaction.booster_packs?.name || 
                           transaction.special_packs?.name || 
                           'Carta Individual'}
                        </p>
                        <p className="text-sm text-gray-400">
                          {transaction.profiles?.display_name || transaction.profiles?.email || 'Usuário Desconhecido'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">
                        {formatCurrency(calculateTransactionValue(transaction))}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatDate(transaction.purchased_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-items" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Itens Mais Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topSellingItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-yellow-600 text-white">
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-gray-400">
                          {item.count} vendas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-400">
                        {item.count} unidades
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Usuários com Maior Gasto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.userStats.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-purple-600 text-white">
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-sm text-gray-400">
                          {user.transactions} transações
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-400">
                        {formatCurrency(user.totalSpent)}
                      </p>
                      <p className="text-sm text-gray-400">
                        Última: {user.lastPurchase ? formatDate(user.lastPurchase) : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Estatísticas Diárias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.dailyStats.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {new Date(day.date).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-400">
                          {day.transactions} transações
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-400">
                        {formatCurrency(day.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Estatísticas Mensais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.monthlyStats.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {new Date(month.month + '-01').toLocaleDateString('pt-BR', { 
                            year: 'numeric', 
                            month: 'long' 
                          })}
                        </p>
                        <p className="text-sm text-gray-400">
                          {month.transactions} transações
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">
                        {formatCurrency(month.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botão de atualização */}
      <div className="flex justify-center">
        <Button 
          onClick={fetchAllTransactionData}
          className="bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar Dados
        </Button>
      </div>
    </div>
  );
};
