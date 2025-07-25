import React from 'react';

interface EnhancedTopBarProps {
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
}

interface ResourceChipProps {
  icon: string;
  value: number;
  label: string;
  color: string;
}

const ResourceChip: React.FC<ResourceChipProps> = ({ icon, value, label, color }) => (
  <div className="resource-chip group relative text-xs px-2 py-1">
    <span className="text-sm">{icon}</span>
    <span className="font-bold text-text-primary text-sm">{value}</span>
    
    {/* Tooltip */}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-surface-card text-text-secondary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
      {label}: {value}
    </div>
  </div>
);

interface GameInfoChipProps {
  label: string;
  value: string;
  color: string;
}

const GameInfoChip: React.FC<GameInfoChipProps> = ({ label, value, color }) => (
  <div className={`px-2 py-1 rounded-md font-medium text-xs border transition-colors ${color}`}>
    <span className="text-text-secondary">{label}:</span>
    <span className="ml-1 text-text-primary font-bold">{value}</span>
  </div>
);

const EnhancedTopBar: React.FC<EnhancedTopBarProps> = ({ 
  turn, 
  turnMax, 
  buildCount, 
  buildMax, 
  phase, 
  onNextPhase, 
  discardMode,
  resources 
}) => {
  const getPhaseColor = (phase: string) => {
    switch (phase.toLowerCase()) {
      case 'draw': return 'text-city-color';
      case 'build': return 'text-farm-color';
      case 'action': return 'text-magic-color';
      case 'end': return 'text-event-color';
      default: return 'text-text-primary';
    }
  };

  return (
    <header className="w-full bg-surface border-b border-border px-4 py-2 flex items-center justify-between relative z-40">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xl">👑</span>
          <h1 className="text-lg font-bold text-text-primary">Famand</h1>
        </div>
      </div>
      
      {/* Resources Section */}
      <div className="flex items-center gap-2 bg-surface-card px-3 py-1.5 rounded-lg border border-border">
        <ResourceChip 
          icon="💰" 
          value={resources.coins} 
          label="Moedas"
          color="text-secondary" 
        />
        <ResourceChip 
          icon="🌾" 
          value={resources.food} 
          label="Comida"
          color="text-farm-color" 
        />
        <ResourceChip 
          icon="🏗️" 
          value={resources.materials} 
          label="Materiais"
          color="text-event-color" 
        />
        <ResourceChip 
          icon="👥" 
          value={resources.population} 
          label="População"
          color="text-city-color" 
        />
      </div>
      
      {/* Game Status & Actions */}
      <div className="flex items-center gap-2">
        {/* Game Info */}
        <div className="flex items-center gap-2">
          <GameInfoChip 
            label="Turno" 
            value={`${turn}/${turnMax}`}
            color="bg-city-color/10 border-city-color/30 text-city-color"
          />
          <GameInfoChip 
            label="Construções" 
            value={`${buildCount}/${buildMax}`}
            color="bg-farm-color/10 border-farm-color/30 text-farm-color"
          />
          <GameInfoChip 
            label="Fase" 
            value={phase.toUpperCase()}
            color={`bg-surface-card border-border ${getPhaseColor(phase)}`}
          />
        </div>
        
        {/* Next Phase Button */}
        <button
          onClick={onNextPhase}
          disabled={discardMode}
          className={`
            btn-primary px-4 py-1.5 text-sm font-semibold rounded-md flex items-center gap-1.5
            ${discardMode ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            transition-all duration-200
          `}
          title={discardMode ? 'Complete o descarte primeiro' : 'Avançar para próxima fase'}
        >
          <span>→</span>
          <span>Próxima Fase</span>
        </button>
      </div>
    </header>
  );
};

export default EnhancedTopBar;