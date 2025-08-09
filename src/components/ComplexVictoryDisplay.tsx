import React from 'react';
import { ComplexVictorySystem } from '../types/gameState';
import { Trophy, Crown, Landmark, Clock, Coins, Star, Sparkles, Target, CheckCircle, Circle, Sword, Car, Dice1, ScrollText, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComplexVictoryDisplayProps {
  victorySystem: ComplexVictorySystem;
}

export const ComplexVictoryDisplay: React.FC<ComplexVictoryDisplayProps> = ({ victorySystem }) => {
  const majorConditions = victorySystem.conditions.filter(c => c.type === 'major');
  const minorConditions = victorySystem.conditions.filter(c => c.type === 'minor');
  
  const majorCompleted = majorConditions.filter(c => c.completed).length;
  const minorCompleted = minorConditions.filter(c => c.completed).length;
  
  const majorProgress = (majorCompleted / victorySystem.requiredMajor) * 100;
  const minorProgress = (minorCompleted / victorySystem.requiredMinor) * 100;

  const getConditionIcon = (category: string) => {
    switch (category) {
      case 'reputation': return <Star className="w-3 h-3" />;
      case 'landmarks': return <Landmark className="w-3 h-3" />;
      case 'resources': return <Coins className="w-3 h-3" />;
      case 'production': return <Target className="w-3 h-3" />;
      case 'diversity': return <Sparkles className="w-3 h-3" />;
      case 'survival': return <Clock className="w-3 h-3" />;
      case 'combat': return <Sword className="w-3 h-3" />;
      case 'cards': return <Car className="w-3 h-3" />;
      case 'turns': return <Dice1 className="w-3 h-3" />;
      case 'events': return <ScrollText className="w-3 h-3" />;
      case 'magic': return <Zap className="w-3 h-3" />;
      case 'efficiency': return <Target className="w-3 h-3" />;
      case 'population': return <Users className="w-3 h-3" />;
      case 'coins': return <Coins className="w-3 h-3" />;
      default: return <Trophy className="w-3 h-3" />;
    }
  };

  const getConditionColor = (category: string) => {
    switch (category) {
      case 'reputation': return 'from-yellow-500 to-yellow-600';
      case 'landmarks': return 'from-purple-500 to-purple-600';
      case 'resources': return 'from-green-500 to-green-600';
      case 'production': return 'from-blue-500 to-blue-600';
      case 'diversity': return 'from-pink-500 to-pink-600';
      case 'survival': return 'from-red-500 to-red-600';
      case 'combat': return 'from-red-600 to-red-700';
      case 'cards': return 'from-indigo-500 to-indigo-600';
      case 'turns': return 'from-teal-500 to-teal-600';
      case 'events': return 'from-amber-500 to-amber-600';
      case 'magic': return 'from-purple-500 to-purple-600';
      case 'efficiency': return 'from-cyan-500 to-cyan-600';
      case 'population': return 'from-blue-500 to-blue-600';
      case 'coins': return 'from-yellow-500 to-yellow-600';
      default: return 'from-amber-500 to-amber-600';
    }
  };

  const renderCondition = (condition: any) => {
    const progress = Math.min(100, (condition.current / condition.target) * 100);
    const isCompleted = condition.completed;
    
    return (
      <motion.div
        key={condition.id}
        className={`p-2 rounded-lg border transition-all duration-300 ${
          isCompleted 
            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30' 
            : 'bg-gradient-to-br from-stone-700/50 to-stone-800/50 border-stone-600/30'
        }`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded bg-gradient-to-r ${getConditionColor(condition.category)}`}>
              {getConditionIcon(condition.category)}
            </div>
            <span className={`text-xs font-semibold ${isCompleted ? 'text-green-400' : 'text-amber-100'}`}>
              {condition.name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {isCompleted ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Circle className="w-4 h-4 text-stone-500" />
            )}
          </div>
        </div>
        
        <div className="text-xs text-stone-400 mb-2">
          {condition.description}
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className={isCompleted ? 'text-green-400' : 'text-stone-300'}>
            {condition.current}/{condition.target}
          </span>
          <span className={isCompleted ? 'text-green-400' : 'text-stone-400'}>
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className="w-full bg-stone-700 rounded-full h-1 mt-1">
          <div 
            className={`h-1 rounded-full transition-all duration-300 ${
              isCompleted 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1.5 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg">
          <Trophy className="w-4 h-4 text-purple-100" />
        </div>
        <h3 className="text-amber-100 font-semibold text-sm">Vitória Complexa</h3>
      </div>
      
      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-stone-700/50 to-stone-800/50 rounded-lg p-3 border border-stone-600/30">
        <div className="text-center mb-3">
          <div className="text-amber-100 text-xs mb-1">Progresso Geral</div>
          <div className="text-lg font-bold text-amber-400">
            {majorCompleted}/{victorySystem.requiredMajor} Maiores + {minorCompleted}/{victorySystem.requiredMinor} Menor
          </div>
        </div>
        
        {/* Major Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-stone-400 mb-1">
            <span>🏆 Vitórias Maiores</span>
            <span>{Math.round(majorProgress)}%</span>
          </div>
          <div className="w-full bg-stone-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${majorProgress}%` }}
            />
          </div>
        </div>
        
        {/* Minor Progress */}
        <div>
          <div className="flex justify-between text-xs text-stone-400 mb-1">
            <span>⭐ Vitórias Menores</span>
            <span>{Math.round(minorProgress)}%</span>
          </div>
          <div className="w-full bg-stone-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${minorProgress}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Major Conditions */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-semibold text-purple-400">
            Vitórias Maiores ({majorCompleted}/{victorySystem.requiredMajor})
          </h4>
        </div>
        <div className="space-y-2">
          {majorConditions.map(renderCondition)}
        </div>
      </div>
      
      {/* Minor Conditions */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-semibold text-blue-400">
            Vitórias Menores ({minorCompleted}/{victorySystem.requiredMinor})
          </h4>
        </div>
        <div className="space-y-2">
          {minorConditions.map(renderCondition)}
        </div>
      </div>
      
      {/* Victory Status */}
      {victorySystem.victoryAchieved && (
        <motion.div
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-3 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-green-400 text-sm font-bold">🏆 VITÓRIA ALCANÇADA!</div>
          <div className="text-green-300 text-xs">
            Todas as condições necessárias foram completadas!
          </div>
        </motion.div>
      )}
    </div>
  );
};
