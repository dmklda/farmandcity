import React, { useState, useEffect } from 'react';
import { GameStorageService, SavedGame } from '../services/GameStorageService';
import { GameState } from '../types/gameState';
import { Save, Trash2, Play, Clock, Trophy } from 'lucide-react';

interface SavedGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadGame: (gameState: GameState) => void;
  currentGameState?: GameState;
}

const SavedGamesModal: React.FC<SavedGamesModalProps> = ({
  isOpen,
  onClose,
  onLoadGame,
  currentGameState
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
    if (!currentGameState) return;
    
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Jogos Salvos</h2>
          {currentGameState && (
            <button
              onClick={handleSaveCurrentGame}
              disabled={saving}
              className="mt-4 w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  <Save size={16} />
                  Salvar Jogo Atual
                </>
              )}
            </button>
          )}
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
          ) : savedGames.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum jogo salvo encontrado
            </div>
          ) : (
            <div className="space-y-3">
              {savedGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-background border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock size={14} />
                          Turno {game.turn}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Trophy size={14} />
                          {game.score} pts
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          Fase: {game.phase}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Salvo em: {formatDate(game.updated_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLoadGame(game.id)}
                        className="px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded text-sm flex items-center gap-1 transition-colors"
                      >
                        <Play size={12} />
                        Carregar
                      </button>
                      <button
                        onClick={() => handleDeleteGame(game.id)}
                        className="px-3 py-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded text-sm flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={12} />
                        Deletar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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

export default SavedGamesModal;