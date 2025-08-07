import React from 'react';
import { Crown, Star, Zap, Target } from 'lucide-react';

interface MedievalLevelProgressProps {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
}

export const MedievalLevelProgress: React.FC<MedievalLevelProgressProps> = ({
  currentLevel,
  currentXP,
  xpToNextLevel,
  totalXP
}) => {
  const progressPercentage = (currentXP / xpToNextLevel) * 100;
  const nextLevel = currentLevel + 1;

  const getLevelRewards = (level: number) => {
    const rewards = [
      { type: 'coins', amount: 50, icon: '🪙' },
      { type: 'gems', amount: 5, icon: '💎' },
      { type: 'cards', amount: 3, icon: '🃏' }
    ];
    
    if (level % 10 === 0) {
      rewards.push({ type: 'special', amount: 1, icon: '👑' });
    }
    
    return rewards;
  };

  const currentRewards = getLevelRewards(currentLevel);
  const nextRewards = getLevelRewards(nextLevel);

  return (
    <div className="group relative">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 via-orange-500/30 to-red-500/30 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
      
      {/* Main container */}
      <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-4 right-4 animate-medieval-float">
          <Star className="h-5 w-5 text-yellow-400/60" />
        </div>
        <div className="absolute bottom-4 left-4 animate-medieval-float animation-delay-2000">
          <Zap className="h-4 w-4 text-orange-400/60" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-60 animate-medieval-glow"></div>
                <div className="relative bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-full border border-yellow-400/50 shadow-lg">
                  <Crown className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Nível {currentLevel}
                </h3>
                <p className="text-yellow-200/80 text-sm">Guerreiro Experiente</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{currentLevel}</div>
              <div className="text-yellow-200/60 text-xs">Nível Atual</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-200/80 text-sm">Progresso para o Nível {nextLevel}</span>
              <span className="text-yellow-200/80 text-sm">{currentXP} / {xpToNextLevel} XP</span>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-sm"></div>
              <div className="relative bg-slate-700/50 rounded-full h-4 border border-yellow-500/20 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
              
              {/* Progress percentage indicator */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 text-white text-xs font-bold px-2 py-1 rounded-full border border-yellow-400/50 backdrop-blur-sm">
                  {Math.round(progressPercentage)}%
                </div>
              </div>
            </div>
          </div>

          {/* XP Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{currentXP}</div>
              <div className="text-yellow-200/60 text-xs">XP Atual</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{xpToNextLevel - currentXP}</div>
              <div className="text-yellow-200/60 text-xs">XP Restante</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{totalXP}</div>
              <div className="text-yellow-200/60 text-xs">XP Total</div>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Level Rewards */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg opacity-75"></div>
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-green-500/30 rounded-xl p-4">
                <h4 className="text-green-300 font-semibold text-sm mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Recompensas do Nível {currentLevel}
                </h4>
                <div className="space-y-2">
                  {currentRewards.map((reward, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-white/80">{reward.icon} {reward.type}</span>
                      <span className="text-green-300 font-medium">+{reward.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Level Rewards */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-75"></div>
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4">
                <h4 className="text-purple-300 font-semibold text-sm mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Próximo Nível {nextLevel}
                </h4>
                <div className="space-y-2">
                  {nextRewards.map((reward, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-white/80">{reward.icon} {reward.type}</span>
                      <span className="text-purple-300 font-medium">+{reward.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Level Up Hint */}
          {progressPercentage >= 90 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
              <div className="flex items-center gap-2 text-yellow-300 text-sm">
                <Zap className="w-4 h-4 animate-pulse" />
                <span>Quase no próximo nível! Continue jogando para subir de nível.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
