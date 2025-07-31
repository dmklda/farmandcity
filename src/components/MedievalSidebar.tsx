import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Trophy, 
  Clock, 
  Star, 
  Building2, 
  Zap, 
  TrendingUp,
  Crown,
  Shield,
  Sword,
  Heart,
  Gem,
  MapPin,
  Calendar,
  Users,
  Coins,
  Wheat,
  Hammer
} from 'lucide-react';
import { 
  CoinsIconPNG, 
  FoodsIconPNG, 
  MaterialsIconPNG, 
  PopulationIconPNG 
} from './IconComponentsPNG';

interface MedievalSidebarProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  onToggleSidebar: () => void;
  gameStats: {
    reputation: number;
    maxReputation: number;
    totalProduction: number;
    maxProduction: number;
    landmarks: number;
    maxLandmarks: number;
    turn: number;
    maxTurns: number;
  };
  victoryMode: string;
  victoryPoints: number;
  history: string[];
  resources: {
    coins: number;
    foods: number;
    materials: number;
    population: number;
  };
  productionPerTurn: {
    coins: number;
    foods: number;
    materials: number;
    population: number;
  };
}

const MedievalSidebar: React.FC<MedievalSidebarProps> = ({
  isVisible,
  setIsVisible,
  onToggleSidebar,
  gameStats,
  victoryMode,
  victoryPoints,
  history,
  resources,
  productionPerTurn
}) => {
  const getVictoryModeIcon = (mode: string) => {
    switch (mode) {
      case 'landmarks': return <Building2 className="w-4 h-4" />;
      case 'production': return <TrendingUp className="w-4 h-4" />;
      case 'reputation': return <Star className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const getVictoryModeColor = (mode: string) => {
    switch (mode) {
      case 'landmarks': return 'from-purple-600 to-purple-800';
      case 'production': return 'from-green-600 to-green-800';
      case 'reputation': return 'from-yellow-600 to-yellow-800';
      default: return 'from-amber-600 to-amber-800';
    }
  };

  const getVictoryModeName = (mode: string) => {
    switch (mode) {
      case 'landmarks': return 'Marcos Históricos';
      case 'production': return 'Produção Total';
      case 'reputation': return 'Reputação';
      default: return 'Vitória Geral';
    }
  };

  const calculateEfficiency = () => {
    const totalResources = resources.coins + resources.foods + resources.materials + resources.population;
    const totalProduction = productionPerTurn.coins + productionPerTurn.foods + productionPerTurn.materials + productionPerTurn.population;
    return totalProduction > 0 ? Math.min(100, (totalProduction / 10) * 100) : 0;
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-400';
    if (efficiency >= 60) return 'text-yellow-400';
    if (efficiency >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getEfficiencyStatus = (efficiency: number) => {
    if (efficiency >= 80) return 'Excelente';
    if (efficiency >= 60) return 'Boa';
    if (efficiency >= 40) return 'Regular';
    return 'Baixa';
  };

  const efficiency = calculateEfficiency();

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen z-30 w-80 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 border-r border-amber-700/30 shadow-2xl"
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.div 
        className="h-16 bg-gradient-to-r from-amber-900/50 to-amber-800/50 border-b border-amber-700/50 flex items-center justify-center p-3"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg">
            <Crown className="w-5 h-5 text-amber-100" />
          </div>
          <h2 className="text-amber-100 font-bold text-lg">Reino de Famand</h2>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="p-3 space-y-4 h-[calc(100vh-4rem)] overflow-y-auto">
        
        {/* Kingdom Status */}
        <motion.div 
          className="bg-gradient-to-br from-stone-800/60 to-stone-900/60 rounded-xl p-4 border border-stone-700/50"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg">
                <Shield className="w-4 h-4 text-blue-100" />
              </div>
              <h3 className="text-amber-100 font-semibold text-sm">Status do Reino</h3>
            </div>
            <div className="text-xs text-stone-400">Turno {gameStats.turn}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-gradient-to-br from-stone-700/50 to-stone-800/50 rounded-lg border border-stone-600/30">
              <div className="text-amber-100 text-xs mb-1">Eficiência</div>
              <div className={`text-lg font-bold ${getEfficiencyColor(efficiency)}`}>
                {efficiency.toFixed(0)}%
              </div>
              <div className="text-stone-400 text-xs">{getEfficiencyStatus(efficiency)}</div>
            </div>
            
            <div className="text-center p-2 bg-gradient-to-br from-stone-700/50 to-stone-800/50 rounded-lg border border-stone-600/30">
              <div className="text-amber-100 text-xs mb-1">Tempo</div>
              <div className="text-lg font-bold text-blue-400">
                {gameStats.turn}/{gameStats.maxTurns}
              </div>
              <div className="text-stone-400 text-xs">Turnos</div>
            </div>
          </div>
        </motion.div>

        {/* Victory Quest */}
        <motion.div 
          className="bg-gradient-to-br from-stone-800/60 to-stone-900/60 rounded-xl p-4 border border-stone-700/50"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className={`p-1.5 bg-gradient-to-br ${getVictoryModeColor(victoryMode)} rounded-lg`}>
              {getVictoryModeIcon(victoryMode)}
            </div>
            <h3 className="text-amber-100 font-semibold text-sm">Missão de Vitória</h3>
          </div>
          
          <div className="bg-gradient-to-br from-stone-700/50 to-stone-800/50 rounded-lg p-3 border border-stone-600/30">
            <div className="text-center mb-2">
              <div className="text-amber-100 text-xs mb-1">{getVictoryModeName(victoryMode)}</div>
              <div className="text-2xl font-bold text-amber-400">{victoryPoints}</div>
              <div className="text-stone-400 text-xs">pontos necessários</div>
            </div>
            
            <div className="w-full bg-stone-700 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (victoryPoints / 10) * 100)}%` }}
              />
            </div>
            
            <div className="text-xs text-stone-400 text-center">
              Complete esta missão para conquistar o reino!
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div 
          className="bg-gradient-to-br from-stone-800/60 to-stone-900/60 rounded-xl p-4 border border-stone-700/50"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 bg-gradient-to-br from-green-600 to-green-800 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-100" />
            </div>
            <h3 className="text-amber-100 font-semibold text-sm">Progresso do Reino</h3>
          </div>
          
          <div className="space-y-3">
            {/* Reputation */}
            <div className="flex items-center justify-between p-2 bg-gradient-to-br from-stone-700/50 to-stone-800/50 rounded-lg border border-stone-600/30">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded">
                  <Star className="w-3 h-3 text-yellow-100" />
                </div>
                <span className="text-stone-300 text-xs">Reputação</span>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 text-sm font-semibold">{gameStats.reputation}/{gameStats.maxReputation}</div>
                <div className="w-16 bg-stone-700 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-1 rounded-full"
                    style={{ width: `${(gameStats.reputation / gameStats.maxReputation) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Production */}
            <div className="flex items-center justify-between p-2 bg-gradient-to-br from-stone-700/50 to-stone-800/50 rounded-lg border border-stone-600/30">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-gradient-to-br from-green-600 to-green-800 rounded">
                  <Hammer className="w-3 h-3 text-green-100" />
                </div>
                <span className="text-stone-300 text-xs">Produção</span>
              </div>
              <div className="text-right">
                <div className="text-green-400 text-sm font-semibold">{gameStats.totalProduction}/{gameStats.maxProduction}</div>
                <div className="w-16 bg-stone-700 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-1 rounded-full"
                    style={{ width: `${Math.min(100, (gameStats.totalProduction / gameStats.maxProduction) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Landmarks */}
            <div className="flex items-center justify-between p-2 bg-gradient-to-br from-stone-700/50 to-stone-800/50 rounded-lg border border-stone-600/30">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-gradient-to-br from-purple-600 to-purple-800 rounded">
                  <Building2 className="w-3 h-3 text-purple-100" />
                </div>
                <span className="text-stone-300 text-xs">Marcos</span>
              </div>
              <div className="text-right">
                <div className="text-purple-400 text-sm font-semibold">{gameStats.landmarks}/{gameStats.maxLandmarks}</div>
                <div className="w-16 bg-stone-700 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-1 rounded-full"
                    style={{ width: `${(gameStats.landmarks / gameStats.maxLandmarks) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Kingdom Chronicle */}
        <motion.div 
          className="bg-gradient-to-br from-stone-800/60 to-stone-900/60 rounded-xl p-4 border border-stone-700/50"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg">
              <Calendar className="w-4 h-4 text-amber-100" />
            </div>
            <h3 className="text-amber-100 font-semibold text-sm">Crônicas do Reino</h3>
          </div>
          
          <div className="bg-gradient-to-br from-stone-700/50 to-stone-800/50 rounded-lg p-3 border border-stone-600/30 max-h-32 overflow-y-auto">
            {history.length > 0 ? (
              <div className="space-y-2">
                {history.slice(-5).map((entry, index) => (
                  <motion.div
                    key={index}
                    className="text-xs text-stone-300 p-2 bg-gradient-to-br from-stone-600/30 to-stone-700/30 rounded border-l-2 border-amber-600/50"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {entry}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-stone-400 text-xs py-4">
                <MapPin className="w-6 h-6 mx-auto mb-2 opacity-50" />
                Suas ações aparecerão aqui...
              </div>
            )}
          </div>
        </motion.div>

        {/* Resource Efficiency */}
        <motion.div 
          className="bg-gradient-to-br from-stone-800/60 to-stone-900/60 rounded-xl p-4 border border-stone-700/50"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg">
              <Gem className="w-4 h-4 text-emerald-100" />
            </div>
            <h3 className="text-amber-100 font-semibold text-sm">Economia</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-gradient-to-br from-stone-700/50 to-stone-800/50 rounded-lg border border-stone-600/30">
              <CoinsIconPNG size={16} className="mx-auto mb-1" />
              <div className="text-amber-400 text-xs font-semibold">+{productionPerTurn.coins}/t</div>
            </div>
            
            <div className="text-center p-2 bg-gradient-to-br from-stone-700/50 to-stone-800/50 rounded-lg border border-stone-600/30">
              <FoodsIconPNG size={16} className="mx-auto mb-1" />
              <div className="text-green-400 text-xs font-semibold">+{productionPerTurn.foods}/t</div>
            </div>
            
            <div className="text-center p-2 bg-gradient-to-br from-stone-700/50 to-stone-800/50 rounded-lg border border-stone-600/30">
              <MaterialsIconPNG size={16} className="mx-auto mb-1" />
              <div className="text-blue-400 text-xs font-semibold">+{productionPerTurn.materials}/t</div>
            </div>
            
            <div className="text-center p-2 bg-gradient-to-br from-stone-700/50 to-stone-800/50 rounded-lg border border-stone-600/30">
              <PopulationIconPNG size={16} className="mx-auto mb-1" />
              <div className="text-purple-400 text-xs font-semibold">+{productionPerTurn.population}/t</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default MedievalSidebar; 
