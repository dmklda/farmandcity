import React from 'react';
import { ComplexVictorySystem } from '../types/gameState';
import { Trophy, Crown, Landmark, Clock, Coins, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClassicVictoryDisplayProps {
  victorySystem: ComplexVictorySystem;
}

export const ClassicVictoryDisplay: React.FC<ClassicVictoryDisplayProps> = ({ victorySystem }) => {
  if (victorySystem.mode !== 'classic') return null;

  const getConditionIcon = (conditionId: string) => {
    if (conditionId.includes('construction')) return <Landmark className="h-4 w-4" />;
    if (conditionId.includes('survival')) return <Clock className="h-4 w-4" />;
    if (conditionId.includes('prosperity')) return <Coins className="h-4 w-4" />;
    if (conditionId.includes('prestige')) return <Crown className="h-4 w-4" />;
    if (conditionId.includes('magic')) return <Sparkles className="h-4 w-4" />;
    return <Trophy className="h-4 w-4" />;
  };

  const getConditionColor = (conditionId: string) => {
    if (conditionId.includes('construction')) return 'text-blue-400';
    if (conditionId.includes('survival')) return 'text-orange-400';
    if (conditionId.includes('prosperity')) return 'text-yellow-400';
    if (conditionId.includes('prestige')) return 'text-purple-400';
    if (conditionId.includes('magic')) return 'text-pink-400';
    return 'text-green-400';
  };

  const getConditionBgColor = (conditionId: string) => {
    if (conditionId.includes('construction')) return 'bg-blue-500/20';
    if (conditionId.includes('survival')) return 'bg-orange-500/20';
    if (conditionId.includes('prosperity')) return 'bg-yellow-500/20';
    if (conditionId.includes('prestige')) return 'bg-purple-500/20';
    if (conditionId.includes('magic')) return 'bg-pink-500/20';
    return 'bg-green-500/20';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-yellow-400" />
        <h3 className="text-lg font-bold text-white">Modo Clássico - Condições de Vitória</h3>
      </div>
      
      <div className="text-sm text-gray-300 mb-4">
        Complete qualquer uma das condições abaixo para vencer:
      </div>

      <div className="space-y-3">
        {victorySystem.conditions.map((condition, index) => (
          <motion.div
            key={condition.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-3 rounded-lg border transition-all duration-300 ${
              condition.completed 
                ? 'bg-green-500/20 border-green-400/50 shadow-lg shadow-green-500/20' 
                : 'bg-slate-800/50 border-slate-600/50 hover:border-slate-500/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getConditionBgColor(condition.id)}`}>
                <div className={getConditionColor(condition.id)}>
                  {getConditionIcon(condition.id)}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-semibold text-sm ${
                    condition.completed ? 'text-green-400' : 'text-white'
                  }`}>
                    {condition.name}
                  </h4>
                  <div className={`text-xs font-bold ${
                    condition.completed ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {condition.current}/{condition.target}
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 mb-2">
                  {condition.description}
                </p>
                
                {/* Barra de progresso */}
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <motion.div
                    className={`h-1.5 rounded-full ${
                      condition.completed ? 'bg-green-400' : 'bg-blue-400'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((condition.current / condition.target) * 100, 100)}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
              </div>
            </div>
            
            {/* Indicador de vitória */}
            {condition.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-green-400 text-white rounded-full p-1"
              >
                <Trophy className="h-3 w-3" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Vitória alcançada */}
      {victorySystem.victoryAchieved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 rounded-lg text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="h-6 w-6 text-yellow-400" />
            <span className="text-lg font-bold text-green-400">VITÓRIA ALCANÇADA!</span>
          </div>
          <p className="text-sm text-green-300">
            Parabéns! Você completou uma das condições de vitória do modo clássico!
          </p>
        </motion.div>
      )}
    </div>
  );
};
