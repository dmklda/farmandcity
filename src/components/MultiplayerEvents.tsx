import React, { useState } from 'react';
import { GameEvent, PlayerStats } from '../types/game';
import { Users, Trophy, Star, TrendingUp, Calendar, Award } from 'lucide-react';

interface MultiplayerEventsProps {
  playerStats: PlayerStats;
  onClose: () => void;
}

const multiplayerEvents = [
  {
    id: 'agricultural-fair',
    name: 'Feira Agrícola',
    description: 'Competição de produção agrícola entre jogadores',
    duration: 3,
    rewards: {
      reputation: 50,
      coins: 20,
      achievement: 'Agricultor Exemplar'
    },
    requirements: {
      buildingsBuilt: 5,
      totalProduction: 100
    }
  },
  {
    id: 'city-building-contest',
    name: 'Concurso de Construção',
    description: 'Quem constrói a cidade mais bonita e funcional?',
    duration: 2,
    rewards: {
      reputation: 75,
      materials: 15,
      achievement: 'Arquiteto Mestre'
    },
    requirements: {
      buildingsBuilt: 8,
      landmarksCompleted: 1
    }
  },
  {
    id: 'crisis-response',
    name: 'Resposta à Crise',
    description: 'Trabalhe em equipe para superar desafios globais',
    duration: 1,
    rewards: {
      reputation: 100,
      coins: 30,
      achievement: 'Herói da Comunidade'
    },
    requirements: {
      crisisSurvived: 2
    }
  },
  {
    id: 'trade-festival',
    name: 'Festival de Comércio',
    description: 'Troque recursos e cartas com outros jogadores',
    duration: 2,
    rewards: {
      reputation: 40,
      coins: 25,
      achievement: 'Comerciante Experiente'
    },
    requirements: {
      totalProduction: 50
    }
  }
];

export const MultiplayerEvents: React.FC<MultiplayerEventsProps> = ({
  playerStats,
  onClose
}) => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [activeEvents, setActiveEvents] = useState<any[]>([]);

  const canParticipate = (event: any) => {
    return Object.entries(event.requirements).every(([key, value]) => 
      playerStats[key as keyof PlayerStats] >= value
    );
  };

  const joinEvent = (event: any) => {
    if (!canParticipate(event)) return;
    
    setActiveEvents(prev => [...prev, { ...event, joinedAt: Date.now() }]);
    setSelectedEvent(null);
  };

  const getReputationLevel = (reputation: number) => {
    if (reputation >= 500) return { level: 'Lendário', color: 'text-purple-600', icon: '👑' };
    if (reputation >= 300) return { level: 'Honrado', color: 'text-blue-600', icon: '⭐' };
    if (reputation >= 150) return { level: 'Respeitado', color: 'text-green-600', icon: '🌟' };
    if (reputation >= 50) return { level: 'Conhecido', color: 'text-yellow-600', icon: '✨' };
    return { level: 'Novato', color: 'text-gray-600', icon: '🌱' };
  };

  const reputationLevel = getReputationLevel(playerStats.reputation);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Eventos Multiplayer</h2>
              <p className="text-gray-600">Participe de eventos com outros jogadores!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Player Stats */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Seu Perfil</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{reputationLevel.icon}</span>
              <span className={`font-bold ${reputationLevel.color}`}>
                {reputationLevel.level}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-bold text-purple-600">{playerStats.reputation}</div>
              <div className="text-xs text-gray-600">Reputação</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🏗️</div>
              <div className="font-bold text-blue-600">{playerStats.buildingsBuilt}</div>
              <div className="text-xs text-gray-600">Construções</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">⭐</div>
              <div className="font-bold text-yellow-600">{playerStats.landmarksCompleted}</div>
              <div className="text-xs text-gray-600">Marcos</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🛡️</div>
              <div className="font-bold text-green-600">{playerStats.crisisSurvived}</div>
              <div className="text-xs text-gray-600">Crises Superadas</div>
            </div>
          </div>
        </div>

        {/* Available Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {multiplayerEvents.map((event) => (
            <div
              key={event.id}
              className={`bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border-2 transition-all duration-200 hover:shadow-lg ${
                selectedEvent === event.id
                  ? 'border-blue-400 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedEvent(event.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{event.name}</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{event.duration} turnos</div>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Requisitos:</div>
                <div className="space-y-1">
                  {Object.entries(event.requirements).map(([key, value]) => {
                    const currentValue = playerStats[key as keyof PlayerStats];
                    const met = currentValue >= value;
                    return (
                      <div key={key} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">
                          {key === 'buildingsBuilt' ? 'Construções' :
                           key === 'totalProduction' ? 'Produção Total' :
                           key === 'landmarksCompleted' ? 'Marcos Completos' :
                           key === 'crisisSurvived' ? 'Crises Superadas' : key}
                        </span>
                        <span className={`font-medium ${met ? 'text-green-600' : 'text-red-600'}`}>
                          {currentValue}/{value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rewards */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Recompensas:</div>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(event.rewards).map(([key, value]) => (
                    <div key={key} className="bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-full text-xs font-medium text-green-700">
                      {key === 'reputation' ? '🏆' : key === 'coins' ? '🪙' : key === 'materials' ? '🔨' : '⭐'} {value}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  joinEvent(event);
                }}
                disabled={!canParticipate(event)}
                className={`w-full py-2 px-4 rounded-lg font-bold transition-all duration-200 ${
                  canParticipate(event)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canParticipate(event) ? 'Participar' : 'Requisitos não atendidos'}
              </button>
            </div>
          ))}
        </div>

        {/* Active Events */}
        {activeEvents.length > 0 && (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Eventos Ativos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeEvents.map((event, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-gray-800">{event.name}</div>
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Ativo
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{event.description}</div>
                  <div className="text-xs text-gray-500">
                    Iniciado há {Math.floor((Date.now() - event.joinedAt) / 1000)}s
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboards */}
        <div className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Rankings Globais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-center">
                <div className="text-2xl mb-2">🏆</div>
                <div className="font-bold text-gray-800">Maior Reputação</div>
                <div className="text-sm text-gray-600">Você: #{Math.floor(Math.random() * 100) + 1}</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-center">
                <div className="text-2xl mb-2">🏗️</div>
                <div className="font-bold text-gray-800">Mais Construções</div>
                <div className="text-sm text-gray-600">Você: #{Math.floor(Math.random() * 50) + 1}</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-center">
                <div className="text-2xl mb-2">⭐</div>
                <div className="font-bold text-gray-800">Mais Marcos</div>
                <div className="text-sm text-gray-600">Você: #{Math.floor(Math.random() * 20) + 1}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 