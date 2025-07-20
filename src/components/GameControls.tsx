import React from 'react';
import { GameState } from '../types/game';
import { Dice1, ArrowRight, Shield, TrendingUp, Trophy, AlertTriangle } from 'lucide-react';

interface GameControlsProps {
  gameState: GameState;
  onRollDice: () => void;
  onNextPhase: () => void;
  onPlaySelectedCard: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onRollDice,
  onNextPhase,
  onPlaySelectedCard
}) => {
  const getPhaseName = (phase: string) => {
    const phaseNames = {
      draw: 'Compra',
      action: 'Ação',
      build: 'Construção',
      production: 'Produção',
      end: 'Fim do Turno'
    };
    return phaseNames[phase as keyof typeof phaseNames] || phase;
  };

  const getPhaseColor = (phase: string) => {
    const colors = {
      draw: 'bg-blue-500',
      action: 'bg-green-500',
      build: 'bg-purple-500',
      production: 'bg-yellow-500',
      end: 'bg-red-500'
    };
    return colors[phase as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Game Status */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
            🎮
          </div>
          Status do Jogo
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Turno</div>
            <div className="text-2xl font-bold text-blue-700">{gameState.turn}</div>
          </div>
          <div className={`bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-lg`}>
            <div className="text-sm text-green-600 font-medium">Fase</div>
            <div className="text-lg font-bold text-green-700">{getPhaseName(gameState.phase)}</div>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Progresso do Turno</span>
          </div>
          <div className="flex space-x-1">
            {['draw', 'action', 'build', 'production', 'end'].map((phase, index) => (
              <div
                key={phase}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  index <= ['draw', 'action', 'build', 'production', 'end'].indexOf(gameState.phase)
                    ? getPhaseColor(phase)
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Dice Results */}
        {gameState.lastDiceRoll && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Dice1 className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700">Resultado do Dado</span>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-lg text-center">
              <div className="text-4xl font-bold text-purple-700 mb-2">
                🎲 {gameState.lastDiceRoll}
              </div>
              <div className="text-sm text-purple-600">
                Cartas ativadas: {gameState.activatedCards?.length || 0}
              </div>
            </div>
          </div>
        )}

        {/* Active Events */}
        {gameState.activeEvents.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700">Eventos Ativos</span>
            </div>
            <div className="space-y-2">
              {gameState.activeEvents.map((event) => (
                <div key={event.id} className="bg-gradient-to-br from-orange-100 to-red-100 p-3 rounded-lg border border-orange-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-orange-800">{event.name}</div>
                      <div className="text-sm text-orange-700">{event.description}</div>
                    </div>
                    <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      {event.duration} turno{event.duration > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Special Effects */}
        {(gameState.crisisProtection || gameState.weatherPrediction || gameState.enhancedTrading || gameState.cardsToDiscard > 0 || gameState.cardsToBuyExtra > 0) && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-700">Efeitos Ativos</span>
            </div>
            <div className="space-y-1">
              {gameState.crisisProtection && (
                <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  🛡️ Proteção contra crises
                </div>
              )}
              {gameState.weatherPrediction && (
                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  🌤️ Previsão meteorológica
                </div>
              )}
              {gameState.enhancedTrading && (
                <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                  💰 Comércio aprimorado
                </div>
              )}
              {gameState.cardsToDiscard > 0 && (
                <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                  🗑️ {gameState.cardsToDiscard} carta(s) serão descartadas no próximo turno
                </div>
              )}
              {gameState.cardsToBuyExtra > 0 && (
                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  🃏 +{gameState.cardsToBuyExtra} carta(s) extra no próximo turno
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Player Stats */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          Estatísticas
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Reputação</div>
            <div className="text-xl font-bold text-purple-700">{gameState.playerStats.reputation}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-3 rounded-lg">
            <div className="text-sm text-yellow-600 font-medium">Produção Total</div>
            <div className="text-xl font-bold text-yellow-700">{gameState.playerStats.totalProduction}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Construções</div>
            <div className="text-xl font-bold text-blue-700">{gameState.playerStats.buildingsBuilt}</div>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Marcos</div>
            <div className="text-xl font-bold text-green-700">{gameState.playerStats.landmarksCompleted}</div>
          </div>
        </div>

        {/* Achievements */}
        {gameState.playerStats.achievements.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-700">Conquistas</span>
            </div>
            <div className="space-y-1">
              {gameState.playerStats.achievements.slice(-3).map((achievement, index) => (
                <div key={index} className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                  🏆 {achievement}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
            ⚡
          </div>
          Ações
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={onRollDice}
            disabled={gameState.phase !== 'action'}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            <Dice1 className="w-5 h-5" />
            Rolar Dado
          </button>
          
          <button
            onClick={() => {
              console.log('Next phase button clicked');
              onNextPhase();
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <ArrowRight className="w-5 h-5" />
            Próxima Fase
          </button>
          
          {gameState.selectedCard && (
            <button
              onClick={onPlaySelectedCard}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Jogar {gameState.selectedCard.name}
            </button>
          )}
        </div>
      </div>

      {/* Combo Effects */}
      {gameState.comboEffects.length > 0 && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              🔥
            </div>
            Combos Ativos
          </h3>
          
          <div className="space-y-2">
            {gameState.comboEffects.map((combo, index) => (
              <div key={index} className="bg-gradient-to-br from-orange-100 to-red-100 p-3 rounded-lg border border-orange-200">
                <div className="font-bold text-orange-800">{combo.description}</div>
                <div className="text-sm text-orange-700">Multiplicador: x{combo.multiplier}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};