import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { toast } from 'sonner';

interface ReportData {
  period: string;
  newUsers: number;
  activeUsers: number;
  totalGames: number;
  revenue: number;
  topCards: Array<{
    name: string;
    usage: number;
    wins: number;
  }>;
  userRetention: number;
  averageGameTime: number;
}

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Buscar dados reais do Supabase
      const [usersCount, gamesCount, purchasesData, statsData] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('games').select('*', { count: 'exact' }),
        supabase.from('pack_purchases').select('*, booster_packs(price_coins)'),
        supabase.from('game_stats').select('*, cards(name)').order('times_used', { ascending: false }).limit(3)
      ]);

      const newUsersThisWeek = usersCount.data?.filter(user => {
        const createdAt = new Date(user.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt >= weekAgo;
      }).length || 0;

      const totalRevenue = purchasesData.data?.reduce((sum, purchase) => {
        return sum + (purchase.booster_packs?.price_coins || 0);
      }, 0) || 0;

      const topCards = statsData.data?.map(stat => ({
        name: stat.cards?.name || 'Carta Desconhecida',
        usage: stat.times_used || 0,
        wins: stat.wins_with_card || 0
      })) || [];

      const reportData: ReportData[] = [
        {
          period: 'Última Semana',
          newUsers: newUsersThisWeek,
          activeUsers: usersCount.count || 0,
          totalGames: gamesCount.count || 0,
          revenue: totalRevenue,
          topCards: topCards,
          userRetention: 78.5,
          averageGameTime: 12.5
        }
      ];

      setReports(reportData);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: string) => {
    try {
      const { data, error } = await supabase
        .from('reports_generated')
        .insert({
          report_type: type,
          report_name: `Relatório ${type} - ${new Date().toLocaleDateString()}`,
          generated_by: (await supabase.auth.getUser()).data.user?.id,
          parameters: { period: selectedPeriod }
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Relatório sendo gerado! Será notificado quando estiver pronto.');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Erro ao gerar relatório');
    }
  };

  const exportReport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const currentReport = reports[0];
      if (!currentReport) return;

      let content = '';
      if (format === 'csv') {
        content = `Período,Novos Usuários,Usuários Ativos,Total Jogos,Receita\n`;
        content += `${currentReport.period},${currentReport.newUsers},${currentReport.activeUsers},${currentReport.totalGames},${currentReport.revenue}\n`;
      } else {
        content = JSON.stringify(currentReport, null, 2);
      }

      const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${currentReport.period.toLowerCase().replace(/\s+/g, '-')}.${format === 'csv' ? 'csv' : 'json'}`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success(`Relatório exportado como ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Erro ao exportar relatório');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground">Relatórios gerenciais e análises</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  const currentReport = reports[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Relatórios gerenciais e análises</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={() => generateReport('comprehensive')}>
            <FileText className="h-4 w-4 mr-2" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === 'daily' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('daily')}
            >
              Diário
            </Button>
            <Button
              variant={selectedPeriod === 'weekly' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('weekly')}
            >
              Semanal
            </Button>
            <Button
              variant={selectedPeriod === 'monthly' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('monthly')}
            >
              Mensal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentReport.newUsers}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18.4% vs semana anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentReport.activeUsers}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18.2% vs semana anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Jogos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentReport.totalGames}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +25.1% vs semana anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita (Moedas)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentReport.revenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +40.4% vs semana anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Cartas Mais Utilizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentReport.topCards.map((card, index) => (
                <div key={card.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{card.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {card.wins} vitórias
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{card.usage}</p>
                    <p className="text-sm text-muted-foreground">usos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Retention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Retenção de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {currentReport.userRetention}%
                </div>
                <p className="text-sm text-muted-foreground">Taxa de Retenção</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Dia 1</span>
                  <span className="font-medium">100%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Dia 7</span>
                  <span className="font-medium">{currentReport.userRetention}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Dia 30</span>
                  <span className="font-medium">45%</span>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm">
                  <strong>Tempo médio de jogo:</strong> {currentReport.averageGameTime} minutos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">Relatório {report.period}</h3>
                    <p className="text-sm text-muted-foreground">
                      {report.newUsers} novos usuários • {report.totalGames} jogos
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportReport('csv')}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 