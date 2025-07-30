import React from 'react';
import { BarChart3, Save, LogOut, User, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface MedievalTopBarProps {
  turn: number;
  turnMax: number;
  buildCount: number;
  buildMax: number;
  phase: string;
  onNextPhase: () => void;
  discardMode?: boolean;
  resources: {
    coins: number;
    food: number;
    materials: number;
    population: number;
  };
  onToggleSidebar?: () => void;
  productionPerTurn: {
    coins: number;
    food: number;
    materials: number;
    population: number;
  };
  productionDetails: {
    coins: string[];
    food: string[];
    materials: string[];
    population: string[];
  };
  onShowStats?: () => void;
  onShowSavedGames?: () => void;
  onLogout?: () => void;
  onGoHome?: () => void;
  userEmail?: string;
  activeDeck?: {
    id: string;
    name: string;
    cards: any[];
  } | null;

}

import { CoinsIconPNG, FoodsIconPNG, MaterialsIconPNG, PopulationIconPNG } from './IconComponentsPNG';

const ResourceChip: React.FC<{
  icon: string;
  value: number;
  label: string;
  color: string;
  perTurn?: number;
  details?: string[];
}> = ({ icon, value, label, color, perTurn = 0, details = [] }) => {
  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case '💰': return <CoinsIconPNG size={16} />;
      case '🌾': return <FoodsIconPNG size={16} />;
      case '🏗️': return <MaterialsIconPNG size={16} />;
      case '👥': return <PopulationIconPNG size={16} />;
      default: return <span className="text-xs">{icon}</span>;
    }
  };

  return (
    <motion.div 
      className="group relative"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gradient-to-br from-stone-800/80 to-stone-900/80 rounded-lg border border-amber-700/50 shadow-lg hover:from-stone-700/80 hover:to-stone-800/80 transition-all duration-300">
        <div className="p-1 bg-gradient-to-br from-amber-800 to-amber-900 rounded-md border border-amber-600">
          {getIconComponent(icon)}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-amber-100 text-sm leading-tight">{value}</span>
          {perTurn > 0 && (
            <span className="text-xs text-green-400 font-medium leading-tight">+{perTurn}/t</span>
          )}
        </div>
      </div>
      
      {/* Tooltip */}
      <div 
        className="absolute left-0 top-full mt-2 px-3 py-2 bg-gradient-to-br from-stone-900 to-stone-800 text-amber-100 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 min-w-[160px] max-w-[300px] shadow-2xl border border-amber-700"
      >
        <div className="font-bold text-amber-100 mb-1">{label}: {value}{perTurn > 0 && <span className='text-green-400'> (+{perTurn}/turno)</span>}</div>
        {perTurn > 0 && details && details.length > 0 && (
          <ul className="text-xs text-amber-200 list-disc pl-4 space-y-0.5">
            {details.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        )}
        {perTurn === 0 && <div className="text-xs text-amber-300">Nenhum ganho por turno de cartas em campo.</div>}
      </div>
    </motion.div>
  );
};

const GameInfoChip: React.FC<{
  label: string;
  value: string;
  color: string;
}> = ({ label, value, color }) => (
  <motion.div 
    className={`px-3 py-2 rounded-lg font-medium text-sm border-2 transition-all duration-300 ${color} bg-gradient-to-br from-stone-800/80 to-stone-900/80 shadow-lg`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <span className="text-amber-200">{label}:</span>
    <span className="ml-1 text-amber-100 font-bold">{value}</span>
  </motion.div>
);

const MedievalTopBar: React.FC<MedievalTopBarProps> = ({ 
  turn, 
  turnMax, 
  buildCount, 
  buildMax, 
  phase, 
  onNextPhase, 
  discardMode,
  resources = { coins: 0, food: 0, materials: 0, population: 0 },
  onToggleSidebar,
  productionPerTurn = { coins: 0, food: 0, materials: 0, population: 0 },
  productionDetails = { coins: [], food: [], materials: [], population: [] },
  onShowStats,
  onShowSavedGames,
  onLogout,
  onGoHome,
  userEmail,
  activeDeck,

}) => {

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'draw':
        return 'border-blue-600 text-blue-400 bg-gradient-to-br from-blue-900/30 to-cyan-900/30';
      case 'action':
        return 'border-green-600 text-green-400 bg-gradient-to-br from-green-900/30 to-emerald-900/30';
      case 'production':
        return 'border-yellow-600 text-yellow-400 bg-gradient-to-br from-yellow-900/30 to-amber-900/30';
      case 'discard':
        return 'border-red-600 text-red-400 bg-gradient-to-br from-red-900/30 to-rose-900/30';
      default:
        return 'border-gray-600 text-gray-400 bg-gradient-to-br from-gray-900/30 to-slate-900/30';
    }
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 border-b-2 border-amber-800 shadow-2xl"
    >
      <div className="flex items-center justify-between px-4 py-3 h-16">
        {/* Left Section - Resources */}
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ResourceChip
            icon="💰"
            value={resources.coins}
            label="Ouro"
            color="text-yellow-400"
            perTurn={productionPerTurn.coins}
            details={productionDetails.coins}
          />
          
          <ResourceChip
            icon="🌾"
            value={resources.food}
            label="Comida"
            color="text-green-400"
            perTurn={productionPerTurn.food}
            details={productionDetails.food}
          />
          
          <ResourceChip
            icon="🏗️"
            value={resources.materials}
            label="Materiais"
            color="text-blue-400"
            perTurn={productionPerTurn.materials}
            details={productionDetails.materials}
          />
          
          <ResourceChip
            icon="👥"
            value={resources.population}
            label="População"
            color="text-purple-400"
            perTurn={productionPerTurn.population}
            details={productionDetails.population}
          />
        </motion.div>

        {/* Center Section - Game Info */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GameInfoChip
            label="Turno"
            value={`${turn}/${turnMax}`}
            color="border-amber-600 text-amber-400 bg-gradient-to-br from-amber-900/30 to-yellow-900/30"
          />
          
          <GameInfoChip
            label="Construções"
            value={`${buildCount}/${buildMax}`}
            color="border-blue-600 text-blue-400 bg-gradient-to-br from-blue-900/30 to-cyan-900/30"
          />
          
          <motion.div 
            className={`px-4 py-2 rounded-lg font-bold text-sm border-2 ${getPhaseColor(phase)}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="capitalize">{phase}</span>
          </motion.div>
        </motion.div>

        {/* Right Section - Actions */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >


          {/* Next Phase Button */}
          <motion.button
            onClick={onNextPhase}
            className="px-4 py-2 bg-gradient-to-br from-emerald-800 to-green-800 text-emerald-100 rounded-lg border-2 border-emerald-600 font-bold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Próxima Fase
          </motion.button>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {onShowStats && (
              <motion.button
                onClick={onShowStats}
                className="p-2 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 text-blue-400 rounded-lg border border-blue-600 hover:from-blue-800/40 hover:to-cyan-800/40 transition-all duration-300"
                title="Estatísticas"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <BarChart3 size={20} />
              </motion.button>
            )}

            {onShowSavedGames && (
              <motion.button
                onClick={onShowSavedGames}
                className="p-2 bg-gradient-to-br from-green-900/30 to-emerald-900/30 text-green-400 rounded-lg border border-green-600 hover:from-green-800/40 hover:to-emerald-800/40 transition-all duration-300"
                title="Jogos Salvos"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Save size={20} />
              </motion.button>
            )}

            {onGoHome && (
              <motion.button
                onClick={onGoHome}
                className="p-2 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 text-amber-400 rounded-lg border border-amber-600 hover:from-amber-800/40 hover:to-yellow-800/40 transition-all duration-300"
                title="Voltar ao Menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Home size={20} />
              </motion.button>
            )}

            {onLogout && (
              <motion.button
                onClick={onLogout}
                className="p-2 bg-gradient-to-br from-red-900/30 to-rose-900/30 text-red-400 rounded-lg border border-red-600 hover:from-red-800/40 hover:to-rose-800/40 transition-all duration-300"
                title="Sair"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <LogOut size={20} />
              </motion.button>
            )}
          </div>

          {/* User Info */}
          {userEmail && (
            <motion.div 
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-stone-800/80 to-stone-900/80 rounded-lg border border-amber-700/50"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-full flex items-center justify-center border border-amber-500">
                <User size={16} className="text-amber-100" />
              </div>
              <div className="hidden md:block">
                <div className="text-xs text-amber-200">Jogador</div>
                <div className="text-xs text-amber-100 font-medium truncate max-w-[120px]">
                  {userEmail}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
};

export default MedievalTopBar; 