import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { BarChart3, Trophy, Clock, Target, TrendingUp, Calendar, Building2, Landmark, Star, BarChart } from 'lucide-react';

interface GameHistory {
  id: string;
  final_score: number;
  turns_played: number;
  resources_final: any;
  buildings_built: number;
  landmarks_built: number;
  game_duration_minutes: number | null;
  completed_at: string;
}

interface PlayerStats {
  totalGames: number;
  averageScore: number;
  bestScore: number;
  totalTurns: number;
  averageTurns: number;
  totalBuildings: number;
  totalLandmarks: number;
  averageGameTime: number;
}

interface PlayerStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlayerStatsModal: React.FC<PlayerStatsModalProps> = ({ isOpen, onClose }) => {
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'stats' | 'history'>('stats');

  useEffect(() => {
    if (isOpen) {
      loadPlayerData();
    }
  }, [isOpen]);

  const loadPlayerData = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      // Carregar histórico de jogos
      const { data: history, error: historyError } = await supabase
        .from('game_history')
        .select('*')
        .eq('player_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(20);

      if (historyError) throw historyError;

      setGameHistory(history || []);

      // Calcular estatísticas
      if (history && history.length > 0) {
        const stats: PlayerStats = {
          totalGames: history.length,
          averageScore: Math.round(history.reduce((sum, game) => sum + game.final_score, 0) / history.length),
          bestScore: Math.max(...history.map(game => game.final_score)),
          totalTurns: history.reduce((sum, game) => sum + game.turns_played, 0),
          averageTurns: Math.round(history.reduce((sum, game) => sum + game.turns_played, 0) / history.length),
          totalBuildings: history.reduce((sum, game) => sum + game.buildings_built, 0),
          totalLandmarks: history.reduce((sum, game) => sum + game.landmarks_built, 0),
          averageGameTime: Math.round(
            history
              .filter(game => game.game_duration_minutes)
              .reduce((sum, game) => sum + (game.game_duration_minutes || 0), 0) / 
            history.filter(game => game.game_duration_minutes).length
          ),
        };
        setPlayerStats(stats);
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados do jogador:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getRankByScore = (score: number) => {
    if (score >= 500) return { rank: 'Lendário', color: 'text-yellow-500', icon: '👑' };
    if (score >= 300) return { rank: 'Mestre', color: 'text-purple-500', icon: '💎' };
    if (score >= 200) return { rank: 'Experiente', color: 'text-blue-500', icon: '⭐' };
    if (score >= 100) return { rank: 'Aventureiro', color: 'text-green-500', icon: '🌟' };
    return { rank: 'Iniciante', color: 'text-gray-500', icon: '🌱' };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 size={24} />
            Estatísticas do Jogador
          </h2>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'stats' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <BarChart3 size={16} />
              Estatísticas
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'history' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <TrendingUp size={16} />
              Histórico
            </button>
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          ) : activeTab === 'stats' ? (
            <div>
              {playerStats ? (
                <div className="space-y-6">
                  {/* Rank do jogador */}
                  <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                    <div className="text-4xl mb-2">{getRankByScore(playerStats.bestScore).icon}</div>
                    <div className={`text-xl font-bold ${getRankByScore(playerStats.bestScore).color}`}>
                      {getRankByScore(playerStats.bestScore).rank}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Melhor pontuação: {playerStats.bestScore}
                    </div>
                  </div>

                  {/* Grid de estatísticas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-background border border-border rounded-lg p-4 text-center">
                      <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                      <div className="text-2xl font-bold text-foreground">{playerStats.totalGames}</div>
                      <div className="text-sm text-muted-foreground">Jogos</div>
                    </div>
                    
                    <div className="bg-background border border-border rounded-lg p-4 text-center">
                      <Target className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold text-foreground">{playerStats.averageScore}</div>
                      <div className="text-sm text-muted-foreground">Pontuação Média</div>
                    </div>
                    
                    <div className="bg-background border border-border rounded-lg p-4 text-center">
                      <Clock className="w-6 h-6 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold text-foreground">{playerStats.averageTurns}</div>
                      <div className="text-sm text-muted-foreground">Turnos Médios</div>
                    </div>
                    
                    <div className="bg-background border border-border rounded-lg p-4 text-center">
                      <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                      <div className="text-2xl font-bold text-foreground">{playerStats.totalLandmarks}</div>
                      <div className="text-sm text-muted-foreground">Marcos Totais</div>
                    </div>
                  </div>

                  {/* Estatísticas detalhadas */}
                  <div className="bg-background border border-border rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3">Estatísticas Detalhadas</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Building2 size={16} />
                          Total de Construções:
                        </span>
                        <span className="text-foreground font-medium">{playerStats.totalBuildings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Landmark size={16} />
                          Total de Marcos:
                        </span>
                        <span className="text-foreground font-medium">{playerStats.totalLandmarks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Target size={16} />
                          Total de Turnos Jogados:
                        </span>
                        <span className="text-foreground font-medium">{playerStats.totalTurns}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Clock size={16} />
                          Tempo Médio por Jogo:
                        </span>
                        <span className="text-foreground font-medium">{playerStats.averageGameTime} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma estatística disponível. Termine ao menos um jogo para ver suas estatísticas!
                </div>
              )}
            </div>
          ) : (
            <div>
              {gameHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum jogo finalizado encontrado
                </div>
              ) : (
                <div className="space-y-3">
                  {gameHistory.map((game) => (
                    <div
                      key={game.id}
                      className="bg-background border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center gap-1">
                              <Trophy size={16} className="text-yellow-500" />
                              <span className="font-bold text-lg">{game.final_score} pts</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock size={14} />
                              <span className="text-sm">{game.turns_played} turnos</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <span className="text-sm">🏗️ {game.buildings_built}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <span className="text-sm">🏛️ {game.landmarks_built}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar size={12} />
                            {formatDate(game.completed_at)}
                            {game.game_duration_minutes && (
                              <span>• {game.game_duration_minutes} min</span>
                            )}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded text-xs font-medium ${getRankByScore(game.final_score).color}`}>
                          {getRankByScore(game.final_score).icon} {getRankByScore(game.final_score).rank}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsModal;