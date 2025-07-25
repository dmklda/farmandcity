import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const GameStatsPanel: React.FC = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameStats();
  }, []);

  const fetchGameStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('game_stats')
        .select(`
          *,
          cards (name, type, rarity)
        `)
        .order('times_used', { ascending: false })
        .limit(20);

      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      console.error('Error fetching game stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Carregando estatísticas...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Estatísticas do Jogo</h2>
        <p className="text-muted-foreground">Cartas mais utilizadas e dados de performance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cartas Mais Utilizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={stat.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-lg">#{index + 1}</span>
                  <div>
                    <p className="font-medium">{stat.cards?.name || 'Carta Desconhecida'}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.cards?.type} • {stat.cards?.rarity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{stat.times_used} usos</p>
                  <p className="text-sm text-muted-foreground">{stat.wins_with_card} vitórias</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {stats.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">Nenhuma estatística disponível</p>
        </div>
      )}
    </div>
  );
};