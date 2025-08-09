import React, { useState, useEffect } from 'react';
import { GameStorageService, SavedGame } from '../services/GameStorageService';
import { GameState } from '../types/gameState';
import { Save, Trash2, Play, Clock, Trophy, Crown, Landmark, Star, X, Gamepad2, Scroll, Castle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SavedGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadGame: (gameState: GameState, gameMode?: string) => void;
  currentGameState?: GameState;
  currentGameMode?: string;
}

const SavedGamesModal: React.FC<SavedGamesModalProps> = ({
  isOpen,
  onClose,
  onLoadGame,
  currentGameState,
  currentGameMode
}) => {
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Carregar jogos salvos quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      loadSavedGames();
    }
  }, [isOpen]);

  const loadSavedGames = async () => {
    setLoading(true);
    setError('');
    
    const result = await GameStorageService.loadUserGames();
    
    if (result.success) {
      setSavedGames(result.games || []);
    } else {
      setError(result.error || 'Erro ao carregar jogos');
    }
    
    setLoading(false);
  };

  const handleSaveCurrentGame = async () => {
    if (!currentGameState) {
      setError('Estado do jogo atual não disponível');
      return;
    }
    
    setSaving(true);
    setError('');
    
    const result = await GameStorageService.saveGame(currentGameState);
    
    if (result.success) {
      await loadSavedGames(); // Recarregar a lista
    } else {
      setError(result.error || 'Erro ao salvar jogo');
    }
    
    setSaving(false);
  };

  const handleLoadGame = async (gameId: string) => {
    setLoading(true);
    setError('');
    
    const result = await GameStorageService.loadGame(gameId);
    
    if (result.success && result.gameState) {
      onLoadGame(result.gameState);
      onClose();
    } else {
      setError(result.error || 'Erro ao carregar jogo');
    }
    
    setLoading(false);
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('Tem certeza que quer deletar este jogo?')) return;
    
    setLoading(true);
    setError('');
    
    const result = await GameStorageService.deleteGame(gameId);
    
    if (result.success) {
      await loadSavedGames(); // Recarregar a lista
    } else {
      setError(result.error || 'Erro ao deletar jogo');
    }
    
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getGameIcon = (game: SavedGame) => {
    if (game.score >= 500) return <Crown className="h-5 w-5 text-yellow-400" />;
    if (game.score >= 300) return <Landmark className="h-5 w-5 text-purple-400" />;
    if (game.score >= 200) return <Star className="h-5 w-5 text-blue-400" />;
    return <Gamepad2 className="h-5 w-5 text-green-400" />;
  };

  const getGameTitle = (game: SavedGame) => {
    if (game.score >= 500) return "Reino Lendário";
    if (game.score >= 300) return "Império em Ascensão";
    if (game.score >= 200) return "Domínio Real";
    if (game.score >= 100) return "Território Conquistado";
    return "Aventura Iniciante";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-md border border-green-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-900/80 via-slate-800/80 to-green-900/80 border-b border-green-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full border border-green-400/50 shadow-lg">
                  <Scroll className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  📜 Arquivos do Reino
                </h2>
                <p className="text-green-200/80 text-sm">Gerencie suas partidas salvas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              title="Fechar arquivos"
              className="relative group p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-green-400/50 transition-all duration-300"
            >
              <X className="h-5 w-5 text-slate-300 group-hover:text-white" />
            </button>
          </div>

          {/* Save Current Game Button */}
          {currentGameState && (
            <div className="mt-6">
              <motion.button
                onClick={handleSaveCurrentGame}
                disabled={saving}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-green-800 disabled:to-emerald-800 text-white font-bold py-3 px-6 rounded-xl border border-green-400/50 shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Salvando Jogo Atual...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Salvar Jogo Atual
                  </>
                )}
              </motion.button>
            </div>
          )}
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
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
                <div className="relative animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
              </div>
            </div>
          ) : savedGames.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📜</div>
              <div className="text-xl text-white mb-2">Nenhum arquivo encontrado</div>
              <div className="text-green-200/80">Salve seu primeiro jogo para começar sua coleção!</div>
            </div>
          ) : (
            <div className="space-y-4">
              {savedGames.map((game) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-600/30 via-emerald-500/30 to-teal-500/30 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                            {getGameIcon(game)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{getGameTitle(game)}</h3>
                            <div className="flex items-center gap-4 text-sm text-green-200/80">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>Turno {game.game_state.turn || game.turn}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Trophy className="h-4 w-4" />
                                <span>{game.score} pts</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Castle className="h-4 w-4" />
                                <span className="capitalize">{game.game_state.phase || game.phase}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Gamepad2 className="h-4 w-4" />
                                <span>{game.game_state.hand?.length || 0} cartas</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-green-200/60 mb-4">
                          Salvo em: {formatDate(game.updated_at)}
                        </div>

                        {/* Resources Display */}
                        <div className="grid grid-cols-4 gap-3 mb-3">
                          {[
                            { icon: "💰", value: game.game_state.resources.coins, label: "Ouro", color: "text-yellow-400" },
                            { icon: "🌾", value: game.game_state.resources.food, label: "Comida", color: "text-green-400" },
                            { icon: "🏗️", value: game.game_state.resources.materials, label: "Materiais", color: "text-blue-400" },
                            { icon: "👥", value: game.game_state.resources.population, label: "População", color: "text-purple-400" }
                          ].map((resource, index) => (
                            <div key={index} className="text-center p-2 bg-slate-700/50 rounded-lg border border-slate-600/50">
                              <div className="text-sm font-bold text-white">{resource.value}</div>
                              <div className={`text-xs ${resource.color}`}>{resource.label}</div>
                            </div>
                          ))}
                        </div>

                        {/* Progress Display */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-2 bg-slate-700/50 rounded-lg border border-slate-600/50">
                            <div className="text-sm font-bold text-white">{game.game_state.playerStats?.reputation || 0}</div>
                            <div className="text-xs text-yellow-400">Reputação</div>
                          </div>
                          <div className="text-center p-2 bg-slate-700/50 rounded-lg border border-slate-600/50">
                            <div className="text-sm font-bold text-white">
                              {(game.game_state.farmGrid?.flat().filter(cell => cell.card).length || 0) + 
                               (game.game_state.cityGrid?.flat().filter(cell => cell.card).length || 0)}
                            </div>
                            <div className="text-xs text-blue-400">Construções</div>
                          </div>
                          <div className="text-center p-2 bg-slate-700/50 rounded-lg border border-slate-600/50">
                            <div className="text-sm font-bold text-white">{game.game_state.playerStats?.landmarks || 0}</div>
                            <div className="text-xs text-purple-400">Marcos</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <motion.button
                          onClick={() => handleLoadGame(game.id)}
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Play className="h-4 w-4" />
                          Carregar
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteGame(game.id)}
                          className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Trash2 className="h-4 w-4" />
                          Deletar
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-green-500/30 bg-gradient-to-r from-green-900/20 to-emerald-900/20">
          <motion.button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-xl font-semibold transition-all duration-300 border border-slate-600/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Fechar Arquivos
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SavedGamesModal;
