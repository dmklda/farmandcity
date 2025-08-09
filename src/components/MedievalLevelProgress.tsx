import React from 'react';
import { Crown, Star, Zap } from 'lucide-react';
import { usePlayerCurrency } from '../hooks/usePlayerCurrency';

interface MedievalLevelProgressProps {
  // Props opcionais para casos onde queremos sobrescrever os dados reais
  currentLevel?: number;
  currentXP?: number;
  xpToNextLevel?: number;
  totalXP?: number;
}

export const MedievalLevelProgress: React.FC<MedievalLevelProgressProps> = ({
  currentLevel: overrideLevel,
  currentXP: overrideXP,
  xpToNextLevel: overrideXPToNext,
  totalXP: overrideTotalXP
}) => {
  const { currency } = usePlayerCurrency();
  
  // Usar dados reais do usuário ou valores padrão
  const currentLevel = overrideLevel ?? (currency?.level || 1);
  const currentXP = overrideXP ?? (currency?.experience_points || 0);
  const xpToNextLevel = overrideXPToNext ?? 100; // 100 XP por nível
  const totalXP = overrideTotalXP ?? currentXP;
  
  const progressPercentage = (currentXP % xpToNextLevel) / xpToNextLevel * 100;
  const nextLevel = currentLevel + 1;

  const getLevelTitle = (level: number) => {
    if (level >= 50) return 'Lendário';
    if (level >= 30) return 'Mestre';
    if (level >= 20) return 'Experiente';
    if (level >= 10) return 'Aventureiro';
    return 'Iniciante';
  };

  const getNextLevelRewards = () => {
    const baseRewards = [
      { type: 'coins', amount: 50, icon: '🪙' },
      { type: 'gems', amount: 5, icon: '💎' }
    ];
    
    if (nextLevel % 10 === 0) {
      baseRewards.push({ type: 'special', amount: 1, icon: '👑' });
    }
    
    return baseRewards;
  };

  const nextRewards = getNextLevelRewards();

  return (
    <div className="group relative">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 via-orange-500/30 to-red-500/30 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
      
      {/* Main container */}
      <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4 shadow-xl overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10zm0 0c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-2 right-2 animate-medieval-float">
          <Star className="h-3 w-3 text-yellow-400/60" />
        </div>
        <div className="absolute bottom-2 left-2 animate-medieval-float animation-delay-2000">
          <Zap className="h-2 w-2 text-orange-400/60" />
        </div>

        <div className="relative z-10">
          {/* Header - Compact */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-md opacity-60 animate-medieval-glow"></div>
                <div className="relative bg-gradient-to-r from-yellow-500 to-orange-600 p-2 rounded-full border border-yellow-400/50 shadow-lg">
                  <Crown className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Nível {currentLevel}
                </h3>
                <p className="text-yellow-200/80 text-xs">{getLevelTitle(currentLevel)}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-bold text-white">{Math.round(progressPercentage)}%</div>
              <div className="text-yellow-200/60 text-xs">Progresso</div>
            </div>
          </div>

          {/* Progress Bar - Compact */}
          <div className="mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-sm"></div>
              <div className="relative bg-slate-700/50 rounded-full h-2 border border-yellow-500/20 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-yellow-200/80 mt-1">
              <span>{currentXP % xpToNextLevel} / {xpToNextLevel} XP</span>
              <span>Nível {nextLevel}</span>
            </div>
          </div>

          {/* Next Level Rewards - Compact */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3">
            <h4 className="text-purple-300 font-semibold text-xs mb-2 flex items-center gap-1">
              <Star className="w-3 h-3" />
              Próximo Nível {nextLevel}
            </h4>
            <div className="flex items-center gap-3">
              {nextRewards.map((reward, index) => (
                <div key={index} className="flex items-center gap-1 text-xs">
                  <span className="text-white/80">{reward.icon}</span>
                  <span className="text-purple-300 font-medium">+{reward.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Level Up Hint - Only show when close */}
          {progressPercentage >= 90 && (
            <div className="mt-2 p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
              <div className="flex items-center gap-1 text-yellow-300 text-xs">
                <Zap className="w-3 h-3 animate-pulse" />
                <span>Quase no próximo nível!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

