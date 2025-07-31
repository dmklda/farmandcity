import React from 'react';
import { MapPin, Star, Trophy, Target, Zap, Crown } from 'lucide-react';

interface ProgressNode {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  completed: boolean;
  current: boolean;
  progress: number;
  rewards: string[];
}

const ProgressMap: React.FC = () => {
  const progressNodes: ProgressNode[] = [
    {
      id: 1,
      title: "Iniciante",
      description: "Complete o tutorial básico",
      icon: "🌱",
      color: "from-green-400 to-emerald-500",
      completed: true,
      current: false,
      progress: 100,
      rewards: ["100 Moedas", "Pacote Iniciante"]
    },
    {
      id: 2,
      title: "Fazendeiro",
      description: "Construa 5 fazendas",
      icon: "🚜",
      color: "from-green-500 to-emerald-600",
      completed: true,
      current: false,
      progress: 100,
      rewards: ["200 Moedas", "Carta Rara"]
    },
    {
      id: 3,
      title: "Construtor",
      description: "Construa 3 cidades",
      icon: "🏗️",
      color: "from-blue-400 to-cyan-500",
      completed: false,
      current: true,
      progress: 66,
      rewards: ["300 Moedas", "Pacote Especial"]
    },
    {
      id: 4,
      title: "Estrategista",
      description: "Ganhe 10 partidas",
      icon: "⚔️",
      color: "from-purple-400 to-pink-500",
      completed: false,
      current: false,
      progress: 0,
      rewards: ["500 Moedas", "Carta Épica"]
    },
    {
      id: 5,
      title: "Imperador",
      description: "Alcance 1000 pontos de reputação",
      icon: "👑",
      color: "from-yellow-400 to-orange-500",
      completed: false,
      current: false,
      progress: 0,
      rewards: ["1000 Moedas", "Título Especial"]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl shadow-2xl p-8 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-8">
        <MapPin className="h-6 w-6 text-purple-400" />
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Mapa de Progresso
        </h3>
      </div>

      <div className="relative">
        {/* Linha de conexão */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 via-blue-400 to-yellow-400 opacity-30"></div>

        <div className="space-y-8">
          {progressNodes.map((node, index) => (
            <div key={node.id} className="relative">
              {/* Nó de progresso */}
              <div className="flex items-start gap-6">
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl relative ${
                    node.completed 
                      ? `bg-gradient-to-r ${node.color} shadow-lg shadow-green-500/30` 
                      : node.current 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 animate-pulse' 
                        : 'bg-slate-700 border-2 border-slate-600'
                  }`}>
                    <span>{node.icon}</span>
                    
                    {/* Indicador de status */}
                    {node.completed && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                    )}
                    
                    {node.current && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                        <Zap className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Conteúdo do nó */}
                <div className="flex-1 bg-slate-700/50 rounded-xl p-6 border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{node.title}</h4>
                      <p className="text-white/70">{node.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        node.completed ? 'text-green-400' : 
                        node.current ? 'text-blue-400' : 'text-white/40'
                      }`}>
                        {node.progress}%
                      </div>
                      <div className="text-sm text-white/60">Progresso</div>
                    </div>
                  </div>

                  {/* Barra de progresso */}
                  <div className="w-full bg-slate-600 rounded-full h-3 mb-4">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        node.completed ? `bg-gradient-to-r ${node.color}` :
                        node.current ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                        'bg-slate-500'
                      }`}
                      style={{ width: `${node.progress}%` }}
                    ></div>
                  </div>

                  {/* Recompensas */}
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-white/60">Recompensas:</span>
                    <div className="flex gap-2">
                      {node.rewards.map((reward, rewardIndex) => (
                        <span 
                          key={rewardIndex}
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            node.completed 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-slate-600/50 text-white/60'
                          }`}
                        >
                          {reward}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Conector para o próximo nó */}
              {index < progressNodes.length - 1 && (
                <div className="absolute left-15 top-16 w-1 h-8 bg-gradient-to-b from-slate-600 to-slate-500 opacity-50"></div>
              )}
            </div>
          ))}
        </div>

        {/* Estatísticas gerais */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">2</div>
            <div className="text-sm text-white/60">Concluídos</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">1</div>
            <div className="text-sm text-white/60">Em Progresso</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white/40 mb-1">2</div>
            <div className="text-sm text-white/60">Pendentes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressMap; 
