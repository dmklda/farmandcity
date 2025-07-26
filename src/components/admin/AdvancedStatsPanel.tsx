import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TrendingUp, Users, Gamepad2, Trophy, DollarSign, BarChart3 } from 'lucide-react';

interface GameStats {
  totalGames: number;
  activePlayers: number;
  averageGameDuration: number;
  mostUsedCards: Array<{ card_name: string; usage_count: number }>;
  winRates: Array<{ player_name: string; wins: number; total_games: number }>;
  revenueByCard: Array<{ card_name: string; revenue: number }>;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
}

export const AdvancedStatsPanel: React.FC = () => {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAdvancedStats();
  }, [timeRange]);

  const fetchAdvancedStats = async () => {
    try {
      setLoading(true);

      // Simular dados de estatísticas avançadas
      // Em produção, isso viria de queries complexas no Supabase
      const mockStats: GameStats = {
        totalGames: 1247,
        activePlayers: 89,
        averageGameDuration: 23.5,
        mostUsedCards: [
          { card_name: 'Campo de Trigo', usage_count: 342 },
          { card_name: 'Mercado', usage_count: 298 },
          { card_name: 'Casa', usage_count: 267 },
          { card_name: 'Colheita', usage_count: 234 },
          { card_name: 'Oficina Simples', usage_count: 198 }
        ],
        winRates: [
          { player_name: 'Player1', wins: 15, total_games: 20 },
          { player_name: 'Player2', wins: 12, total_games: 18 },
          { player_name: 'Player3', wins: 8, total_games: 15 },
          { player_name: 'Player4', wins: 6, total_games: 12 },
          { player_name: 'Player5', wins: 4, total_games: 10 }
        ],
        revenueByCard: [
          { card_name: 'Pacote Lendário', revenue: 1250 },
          { card_name: 'Pacote Ultra', revenue: 890 },
          { card_name: 'Pacote Raro', revenue: 567 },
          { card_name: 'Pacote Incomum', revenue: 234 },
          { card_name: 'Pacote Comum', revenue: 123 }
        ],
        dailyActiveUsers: 45,
        weeklyActiveUsers: 156,
        monthlyActiveUsers: 423
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching advanced stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Carregando estatísticas avançadas...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-muted-foreground">Erro ao carregar estatísticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Estatísticas Avançadas</h2>
          <p className="text-muted-foreground">
            Métricas detalhadas do jogo e comportamento dos jogadores
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 dias
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30 dias
          </Button>
          <Button
            variant={timeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
          >
            90 dias
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Jogos</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGames.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jogadores Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePlayers}</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageGameDuration}min</div>
            <p className="text-xs text-muted-foreground">
              -2% em relação ao período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.revenueByCard.reduce((sum, card) => sum + card.revenue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +15% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Used Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Cartas Mais Usadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.mostUsedCards.map((card, index) => (
                <div key={card.card_name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="w-6 h-6 flex items-center justify-center text-xs">
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{card.card_name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {card.usage_count} usos
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Win Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Taxa de Vitória
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.winRates.map((player) => {
                const winRate = ((player.wins / player.total_games) * 100).toFixed(1);
                return (
                  <div key={player.player_name} className="flex items-center justify-between">
                    <span className="font-medium">{player.player_name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(player.wins / player.total_games) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {winRate}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Receita por Carta/Pacote
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.revenueByCard.map((item, index) => (
              <div key={item.card_name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="w-6 h-6 flex items-center justify-center text-xs">
                    {index + 1}
                  </Badge>
                  <span className="font-medium">{item.card_name}</span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {item.revenue.toLocaleString()} moedas
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Atividade de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.dailyActiveUsers}</div>
              <p className="text-sm text-blue-800">Usuários Ativos (Hoje)</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.weeklyActiveUsers}</div>
              <p className="text-sm text-green-800">Usuários Ativos (Semana)</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.monthlyActiveUsers}</div>
              <p className="text-sm text-purple-800">Usuários Ativos (Mês)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 