import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useGameSettings } from '../hooks/useGameSettings';
import { supabase } from '../integrations/supabase/client';

interface GameMode {
  id: string;
  name: string;
  description: string;
  victoryMode: 'reputation' | 'landmarks' | 'elimination' | 'infinite' | 'complex';
  victoryValue: number;
  icon: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
}

const GameModePage: React.FC = () => {
  const { setCurrentView } = useAppContext();
  const { gameSettings, updateSettings } = useGameSettings();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [loading, setLoading] = useState(false);

  const gameModes: GameMode[] = [
    {
      id: 'complex-victory',
      name: 'Vitória Complexa',
      description: 'Complete múltiplos objetivos para vencer. 2 vitórias maiores + 1 menor.',
      victoryMode: 'complex',
      victoryValue: 0,
      icon: '🏆',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      difficulty: 'hard'
    },
    {
      id: 'classic-landmarks',
      name: 'Clássico - Marcos',
      description: 'Construa marcos históricos para vencer. Modo tradicional do jogo.',
      victoryMode: 'landmarks',
      victoryValue: 3,
      icon: '🏛️',
      color: 'bg-blue-500',
      difficulty: 'easy'
    },
    {
      id: 'reputation-challenge',
      name: 'Desafio - Reputação',
      description: 'Alcance uma alta reputação para se tornar lendário.',
      victoryMode: 'reputation',
      victoryValue: 15,
      icon: '⭐',
      color: 'bg-yellow-500',
      difficulty: 'medium'
    },
    {
      id: 'survival-mode',
      name: 'Modo Sobrevivência',
      description: 'Sobreviva o máximo de turnos possível em um mundo hostil.',
      victoryMode: 'elimination',
      victoryValue: 25,
      icon: '⏰',
      color: 'bg-red-500',
      difficulty: 'hard'
    },
    {
      id: 'infinite-challenge',
      name: 'Desafio Infinito',
      description: 'Jogue indefinidamente enquanto o jogo fica cada vez mais difícil.',
      victoryMode: 'infinite',
      victoryValue: 0,
      icon: '∞',
      color: 'bg-purple-500',
      difficulty: 'extreme'
    },
    {
      id: 'speed-run',
      name: 'Speed Run',
      description: 'Construa 5 marcos históricos rapidamente.',
      victoryMode: 'landmarks',
      victoryValue: 5,
      icon: '⚡',
      color: 'bg-green-500',
      difficulty: 'medium'
    },
    {
      id: 'master-builder',
      name: 'Mestre Construtor',
      description: 'Construa 8 marcos históricos para se tornar um mestre.',
      victoryMode: 'landmarks',
      victoryValue: 8,
      icon: '👷',
      color: 'bg-orange-500',
      difficulty: 'extreme'
    },
    {
      id: 'legendary-status',
      name: 'Status Lendário',
      description: 'Alcance 25 pontos de reputação para se tornar uma lenda.',
      victoryMode: 'reputation',
      victoryValue: 25,
      icon: '👑',
      color: 'bg-pink-500',
      difficulty: 'extreme'
    },
    {
      id: 'endurance-test',
      name: 'Teste de Resistência',
      description: 'Sobreviva 50 turnos em condições extremas.',
      victoryMode: 'elimination',
      victoryValue: 50,
      icon: '🛡️',
      color: 'bg-gray-500',
      difficulty: 'extreme'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-orange-400';
      case 'extreme': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      case 'extreme': return 'Extremo';
      default: return 'Desconhecido';
    }
  };

  const handleModeSelect = async (mode: GameMode) => {
    setSelectedMode(mode);
    setLoading(true);

    try {
      // Atualizar configurações no Supabase
      const { error } = await supabase
        .from('game_settings')
        .upsert({
          id: 1,
          victory_mode: mode.victoryMode,
          victory_value: mode.victoryValue,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao atualizar modo de jogo:', error);
        return;
      }

      // Atualizar contexto local
      await updateSettings();

      // Iniciar novo jogo
      setCurrentView('game');
    } catch (error) {
      console.error('Erro ao configurar modo de jogo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎮 Escolha seu Modo de Jogo
          </h1>
          <p className="text-slate-300 text-lg">
            Selecione um modo de jogo e desafie-se com diferentes condições de vitória
          </p>
        </div>

        {/* Game Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {gameModes.map((mode) => (
            <div
              key={mode.id}
              className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedMode?.id === mode.id ? 'ring-4 ring-white/50' : ''
              }`}
              onClick={() => handleModeSelect(mode)}
            >
              {/* Card Background */}
              <div className={`${mode.color} rounded-xl p-6 h-full shadow-lg hover:shadow-2xl transition-all duration-300`}>
                {/* Icon */}
                <div className="text-4xl mb-4 text-center">
                  {mode.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 text-center">
                  {mode.name}
                </h3>

                {/* Difficulty Badge */}
                <div className="flex justify-center mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white ${getDifficultyColor(mode.difficulty)}`}>
                    {getDifficultyText(mode.difficulty)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-white/90 text-sm text-center leading-relaxed">
                  {mode.description}
                </p>

                {/* Victory Condition */}
                <div className="mt-4 p-3 bg-white/10 rounded-lg">
                  <p className="text-white/80 text-xs font-semibold text-center">
                    {mode.victoryMode === 'landmarks' && `${mode.victoryValue} Marcos Históricos`}
                    {mode.victoryMode === 'reputation' && `${mode.victoryValue} Reputação`}
                    {mode.victoryMode === 'elimination' && `Sobreviver ${mode.victoryValue} Turnos`}
                    {mode.victoryMode === 'infinite' && 'Modo Infinito'}
                    {mode.victoryMode === 'complex' && '2 Vitórias Maiores + 1 Menor'}
                  </p>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => setCurrentView('home')}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors duration-300"
          >
            ← Voltar ao Menu Principal
          </button>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-700">Configurando modo de jogo...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameModePage; 