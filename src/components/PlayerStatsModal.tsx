import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { 
  BarChart3, 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar, 
  Building2, 
  Landmark, 
  Star, 
  Crown,
  Shield,
  Sword,
  Zap,
  Gem,
  User,
  Award,
  X,
  ChevronRight,
  Activity,
  Medal,
  Bell,
  Eye
} from 'lucide-react';
import { MedievalLevelProgress } from './MedievalLevelProgress';
import { usePlayerCurrency } from '../hooks/usePlayerCurrency';
import { usePlayerCards } from '../hooks/usePlayerCards';
import { usePlayerDecks } from '../hooks/usePlayerDecks';

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
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'history' | 'achievements' | 'activity' | 'notifications'>('profile');
  
  // Hooks para dados do jogador
  const { currency } = usePlayerCurrency();
  const { playerCards } = usePlayerCards();
  const { decks } = usePlayerDecks();

  // Dados simulados para demonstração (consolidados do MedievalQuickInfo e MedievalRecentActivity)
  const quickInfoItems = [
    {
      label: "Notificações",
      value: "Novas",
      icon: Bell,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      gradient: "from-blue-500/20 to-cyan-500/20",
      show: true
    },
    {
      label: "Missões Ativas",
      value: 2,
      icon: Target,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      gradient: "from-green-500/20 to-emerald-500/20",
      show: true
    },
    {
      label: "Eventos Próximos",
      value: 1,
      icon: Calendar,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      gradient: "from-purple-500/20 to-pink-500/20",
      show: true
    },
    {
      label: "Conquistas Recentes",
      value: 3,
      icon: Trophy,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      gradient: "from-yellow-500/20 to-orange-500/20",
      show: true
    }
  ];

  const performanceMetrics = [
    { label: "Taxa de Vitória", value: "68.5%", change: "+5.2%", icon: TrendingUp, color: "text-green-400" },
    { label: "Partidas Jogadas", value: "247", change: "+12", icon: Activity, color: "text-blue-400" },
    { label: "Tempo de Jogo", value: "156h", change: "+8h", icon: Clock, color: "text-purple-400" },
    { label: "Nível Atual", value: "42", change: "+2", icon: Crown, color: "text-yellow-400" }
  ];

  const recentActivities = [
    { action: "Venceu uma partida", time: "2h atrás", icon: Trophy, color: "text-yellow-400" },
    { action: "Comprou um pack", time: "4h atrás", icon: Star, color: "text-blue-400" },
    { action: "Completou missão diária", time: "6h atrás", icon: Target, color: "text-green-400" },
    { action: "Criou novo deck", time: "1d atrás", icon: Shield, color: "text-purple-400" },
    { action: "Alcançou novo nível", time: "2d atrás", icon: Crown, color: "text-orange-400" }
  ];

  const recentAchievements = [
    { 
      title: "Primeiro Império", 
      description: "Construiu 10 fazendas", 
      progress: 100, 
      reward: "50 moedas",
      rarity: "common",
      icon: Crown
    },
    { 
      title: "Mestre das Cartas", 
      description: "Colecionou 50 cartas", 
      progress: 75, 
      reward: "100 moedas",
      rarity: "rare",
      icon: Star
    },
    { 
      title: "Construtor", 
      description: "Construiu 5 cidades", 
      progress: 60, 
      reward: "25 gemas",
      rarity: "epic",
      icon: Shield
    }
  ];

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
    if (score >= 500) return { rank: 'Lendário', color: 'text-yellow-500', icon: '👑', bgColor: 'bg-yellow-500/10' };
    if (score >= 300) return { rank: 'Mestre', color: 'text-purple-500', icon: '💎', bgColor: 'bg-purple-500/10' };
    if (score >= 200) return { rank: 'Experiente', color: 'text-blue-500', icon: '⭐', bgColor: 'bg-blue-500/10' };
    if (score >= 100) return { rank: 'Aventureiro', color: 'text-green-500', icon: '🌟', bgColor: 'bg-green-500/10' };
    return { rank: 'Iniciante', color: 'text-gray-500', icon: '🌱', bgColor: 'bg-gray-500/10' };
  };

  const getLevelTitle = (level: number) => {
    if (level >= 50) return 'Lendário';
    if (level >= 30) return 'Mestre';
    if (level >= 20) return 'Experiente';
    if (level >= 10) return 'Aventureiro';
    return 'Iniciante';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const achievements = [
    { id: 'first_game', title: 'Primeiro Jogo', description: 'Complete seu primeiro jogo', icon: Trophy, unlocked: playerStats?.totalGames > 0 },
    { id: 'builder', title: 'Construtor', description: 'Construa 10 edifícios', icon: Building2, unlocked: (playerStats?.totalBuildings || 0) >= 10 },
    { id: 'architect', title: 'Arquiteto', description: 'Construa 5 marcos', icon: Landmark, unlocked: (playerStats?.totalLandmarks || 0) >= 5 },
    { id: 'veteran', title: 'Veterano', description: 'Jogue 20 jogos', icon: Shield, unlocked: (playerStats?.totalGames || 0) >= 20 },
    { id: 'master', title: 'Mestre', description: 'Alcance 300 pontos em um jogo', icon: Crown, unlocked: (playerStats?.bestScore || 0) >= 300 },
    { id: 'collector', title: 'Colecionador', description: 'Colete 50 cartas', icon: Star, unlocked: playerCards.length >= 50 },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-md border border-purple-500/30 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-900/80 via-slate-800/80 to-purple-900/80 border-b border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full border border-purple-400/50 shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Perfil do Guerreiro
          </h2>
                <p className="text-purple-200/80 text-sm">Gerencie suas conquistas e estatísticas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              title="Fechar perfil"
              className="relative group p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-purple-400/50 transition-all duration-300"
            >
              <X className="h-5 w-5 text-slate-300 group-hover:text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto">
            {[
              { id: 'profile', label: 'Perfil', icon: User },
              { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
              { id: 'history', label: 'Histórico', icon: TrendingUp },
              { id: 'achievements', label: 'Conquistas', icon: Award },
              { id: 'activity', label: 'Atividade', icon: Activity },
              { id: 'notifications', label: 'Notificações', icon: Bell }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
            <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-600/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
            </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
                <div className="relative animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Level Progress */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-400" />
                      Progresso de Nível
                    </h3>
                    <MedievalLevelProgress />
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Cartas", value: playerCards.length, icon: Star, color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
                      { label: "Decks", value: decks.length, icon: Shield, color: "text-blue-400", bgColor: "bg-blue-500/10" },
                      { label: "Moedas", value: currency?.coins || 0, icon: Crown, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
                      { label: "Gemas", value: currency?.gems || 0, icon: Gem, color: "text-purple-400", bgColor: "bg-purple-500/10" }
                    ].map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <div key={index} className="group relative">
                          <div className={`absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-blue-500/30 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300`}></div>
                          <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300 shadow-xl">
                            <div className="flex items-center justify-between mb-3">
                              <div className={`p-2 ${stat.bgColor} rounded-lg border border-slate-600/50`}>
                                <Icon className={`w-5 h-5 ${stat.color}`} />
                              </div>
                              <div className="relative">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                              {stat.value.toLocaleString()}
                            </div>
                            <div className="text-purple-200/80 text-sm font-medium">
                              {stat.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Player Info */}
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-400" />
                      Informações do Guerreiro
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                        <span className="text-slate-300">Nível Atual:</span>
                        <span className="text-white font-bold">{currency?.level || 1}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                        <span className="text-slate-300">Título:</span>
                        <span className="text-purple-300 font-bold">{getLevelTitle(currency?.level || 1)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                        <span className="text-slate-300">XP Total:</span>
                        <span className="text-white font-bold">{currency?.experience_points || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                        <span className="text-slate-300">Jogos Jogados:</span>
                        <span className="text-white font-bold">{playerStats?.totalGames || 0}</span>
                      </div>
                    </div>
                  </div>
            </div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
              {playerStats ? (
                    <>
                  {/* Rank do jogador */}
                      <div className="text-center p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/30 rounded-xl">
                        <div className="text-6xl mb-4">{getRankByScore(playerStats.bestScore).icon}</div>
                        <div className={`text-2xl font-bold ${getRankByScore(playerStats.bestScore).color} mb-2`}>
                      {getRankByScore(playerStats.bestScore).rank}
                    </div>
                        <div className="text-purple-200/80">
                          Melhor pontuação: <span className="text-white font-bold">{playerStats.bestScore}</span>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                            📊 Métricas de Performance
                          </h3>
                          <p className="text-purple-200/80 text-sm">
                            Seu progresso e estatísticas de jogo
                          </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {performanceMetrics.map((metric, index) => {
                            const Icon = metric.icon;
                            return (
                              <div key={index} className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-blue-500/30 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300 shadow-xl">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-slate-700/50 rounded-lg border border-slate-600/50">
                                      <Icon className={`w-5 h-5 ${metric.color}`} />
                                    </div>
                                    <div className="text-xs text-green-400 font-medium">
                                      {metric.change}
                                    </div>
                                  </div>
                                  <div className="text-xl font-bold text-white mb-1">
                                    {metric.value}
                                  </div>
                                  <div className="text-purple-200/80 text-xs font-medium">
                                    {metric.label}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                    </div>
                  </div>

                  {/* Grid de estatísticas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { icon: Trophy, label: 'Jogos', value: playerStats.totalGames, color: 'text-yellow-500' },
                          { icon: Target, label: 'Pontuação Média', value: playerStats.averageScore, color: 'text-blue-500' },
                          { icon: Clock, label: 'Turnos Médios', value: playerStats.averageTurns, color: 'text-green-500' },
                          { icon: Landmark, label: 'Marcos Totais', value: playerStats.totalLandmarks, color: 'text-purple-500' }
                        ].map((stat, index) => {
                          const Icon = stat.icon;
                          return (
                            <div key={index} className="group relative">
                              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-blue-500/30 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300 shadow-xl">
                                <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                                <div className="text-2xl font-bold text-white text-center mb-1">{stat.value}</div>
                                <div className="text-purple-200/80 text-sm text-center">{stat.label}</div>
                    </div>
                    </div>
                          );
                        })}
                  </div>

                  {/* Estatísticas detalhadas */}
                      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                          <Activity className="h-5 w-5 text-purple-400" />
                          Estatísticas Detalhadas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { icon: Building2, label: 'Total de Construções', value: playerStats.totalBuildings },
                            { icon: Landmark, label: 'Total de Marcos', value: playerStats.totalLandmarks },
                            { icon: Target, label: 'Total de Turnos Jogados', value: playerStats.totalTurns },
                            { icon: Clock, label: 'Tempo Médio por Jogo', value: `${playerStats.averageGameTime} min` }
                          ].map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                              <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                                <span className="text-slate-300 flex items-center gap-2">
                                  <Icon size={16} />
                                  {stat.label}:
                        </span>
                                <span className="text-white font-bold">{stat.value}</span>
                      </div>
                            );
                          })}
                      </div>
                    </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎮</div>
                      <div className="text-xl text-white mb-2">Nenhuma estatística disponível</div>
                      <div className="text-purple-200/80">Termine ao menos um jogo para ver suas estatísticas!</div>
                </div>
              )}
            </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="space-y-4">
              {gameHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📜</div>
                      <div className="text-xl text-white mb-2">Nenhum jogo finalizado encontrado</div>
                      <div className="text-purple-200/80">Comece a jogar para criar seu histórico!</div>
                </div>
              ) : (
                    gameHistory.map((game) => (
                    <div
                      key={game.id}
                        className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                <span className="font-bold text-xl text-white">{game.final_score} pts</span>
                            </div>
                              <div className="flex items-center gap-2 text-purple-200/80">
                                <Clock className="h-4 w-4" />
                              <span className="text-sm">{game.turns_played} turnos</span>
                            </div>
                              <div className="flex items-center gap-2 text-purple-200/80">
                                <Building2 className="h-4 w-4" />
                                <span className="text-sm">{game.buildings_built}</span>
                            </div>
                              <div className="flex items-center gap-2 text-purple-200/80">
                                <Landmark className="h-4 w-4" />
                                <span className="text-sm">{game.landmarks_built}</span>
                            </div>
                          </div>
                            <div className="flex items-center gap-2 text-xs text-purple-200/60">
                              <Calendar className="h-3 w-3" />
                            {formatDate(game.completed_at)}
                            {game.game_duration_minutes && (
                              <span>• {game.game_duration_minutes} min</span>
                            )}
                          </div>
                        </div>
                          <div className={`px-3 py-1 rounded-lg text-xs font-medium ${getRankByScore(game.final_score).bgColor} ${getRankByScore(game.final_score).color}`}>
                          {getRankByScore(game.final_score).icon} {getRankByScore(game.final_score).rank}
                        </div>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              )}

              {/* Achievements Tab */}
              {activeTab === 'achievements' && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">Conquistas do Reino</h3>
                    <p className="text-purple-200/80">Complete desafios para desbloquear conquistas especiais</p>
                  </div>

                  {/* Recent Achievements */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                        🏆 Conquistas Recentes
                      </h3>
                      <p className="text-purple-200/80 text-sm">
                        Desafios completados e recompensas ganhas
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recentAchievements.map((achievement, index) => {
                        const Icon = achievement.icon;
                        return (
                          <div key={index} className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600/30 via-orange-500/30 to-red-500/30 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300 shadow-xl">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-slate-700/50 rounded-lg border border-slate-600/50">
                                  <Icon className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-white text-sm">
                                    {achievement.title}
                                  </h4>
                                  <p className="text-purple-200/80 text-xs">
                                    {achievement.description}
                                  </p>
                                </div>
                                <div className={`text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                                  {achievement.rarity}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span className="text-purple-200/80">Progresso</span>
                                  <span className="text-white font-medium">{achievement.progress}%</span>
                                </div>
                                <div className="relative bg-slate-700/50 rounded-full h-2 border border-slate-600/50 overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${achievement.progress}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-green-400 font-medium">
                                  Recompensa: {achievement.reward}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* All Achievements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => {
                      const Icon = achievement.icon;
                      return (
                        <div
                          key={achievement.id}
                          className={`group relative ${
                            achievement.unlocked 
                              ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30' 
                              : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-600/30'
                          } backdrop-blur-sm border rounded-xl p-4 transition-all duration-300`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-lg ${
                              achievement.unlocked 
                                ? 'bg-green-500/20 border-green-500/30' 
                                : 'bg-slate-700/50 border-slate-600/50'
                              } border`}
                            >
                              <Icon className={`h-6 w-6 ${
                                achievement.unlocked ? 'text-green-400' : 'text-slate-400'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-bold ${
                                achievement.unlocked ? 'text-green-300' : 'text-slate-300'
                              }`}>
                                {achievement.title}
                              </h4>
                              <p className={`text-sm ${
                                achievement.unlocked ? 'text-green-200/80' : 'text-slate-400'
                              }`}>
                                {achievement.description}
                              </p>
                            </div>
                            {achievement.unlocked && (
                              <div className="text-green-400">
                                <Medal className="h-5 w-5" />
                </div>
              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
            </div>
          )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                      📈 Atividade Recente
                    </h3>
                    <p className="text-purple-200/80">Suas últimas ações no reino</p>
                  </div>

                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                    <div className="space-y-3">
                      {recentActivities.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-purple-400/50 transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-600/50 rounded-lg border border-slate-500/50">
                                <Icon className={`w-4 h-4 ${activity.color}`} />
                              </div>
                              <span className="text-white font-medium text-sm">
                                {activity.action}
                              </span>
                            </div>
                            <span className="text-purple-200/60 text-xs">
                              {activity.time}
                            </span>
                          </div>
                        );
                      })}
        </div>

                    <div className="mt-6 text-center">
                      <button className="text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors duration-300">
                        Ver toda atividade →
          </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      ⚡ Informações Rápidas
                    </h3>
                    <p className="text-purple-200/80">Fique por dentro das novidades do reino</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickInfoItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-blue-500/30 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                          
                          <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300 shadow-xl">
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            
                            <div className="relative z-10">
                              <div className="flex items-center justify-between mb-3">
                                <div className={`p-2 ${item.bgColor} rounded-lg border border-slate-600/50`}>
                                  <Icon className={`w-5 h-5 ${item.color}`} />
                                </div>
                                <div className="relative">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                  <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                                </div>
                              </div>
                              
                              <div className="text-lg font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                              </div>
                              
                              <div className="text-purple-200/80 text-xs font-medium tracking-wide uppercase">
                                {item.label}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsModal;
