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
}

interface ResourceChipProps {
  icon: string;
  value: number;
  label: string;
  color: string;
  perTurn?: number;
  details?: string[];
}

const ResourceChip: React.FC<ResourceChipProps> = ({ icon, value, label, color, perTurn = 0, details = [] }) => (
  <div className="resource-chip group relative text-xs px-2 py-1">
    <span className="text-sm">{icon}</span>
    <span className="font-bold text-text-primary text-sm">{value}</span>
    {perTurn > 0 && (
      <span className="ml-1 text-xs text-green-400 font-bold">(+{perTurn})</span>
    )}
    {/* Tooltip */}
    <div className="fixed left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-surface-card text-text-secondary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 min-w-[120px] max-w-[260px] shadow-xl border border-border">
      <div className="font-bold text-text-primary mb-1">{label}: {value}{perTurn > 0 && <span className='text-green-400'> (+{perTurn}/turno)</span>}</div>
      {perTurn > 0 && details && details.length > 0 && (
        <ul className="text-xs text-text-secondary list-disc pl-4">
          {details.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      )}
      {perTurn === 0 && <div className="text-xs text-text-muted">Nenhum ganho por turno de cartas em campo.</div>}
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
  resources,
  onToggleSidebar,
  productionPerTurn,
  productionDetails
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
    <header className="w-full bg-surface border-b border-border px-4 py-2 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        {/* Hamburger Button */}
        <button
          className="mr-2 flex flex-col justify-center items-center w-8 h-8 rounded hover:bg-surface-hover transition-colors focus:outline-none"
          aria-label="Alternar sidebar"
          onClick={onToggleSidebar}
          type="button"
        >
          <span className="block w-5 h-0.5 bg-text-primary mb-1 rounded"></span>
          <span className="block w-5 h-0.5 bg-text-primary mb-1 rounded"></span>
          <span className="block w-5 h-0.5 bg-text-primary rounded"></span>
        </button>
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
          perTurn={productionPerTurn.coins}
          details={productionDetails.coins}
        />
        <ResourceChip 
          icon="🌾" 
          value={resources.food} 
          label="Comida"
          color="text-farm-color" 
          perTurn={productionPerTurn.food}
          details={productionDetails.food}
        />
        <ResourceChip 
          icon="🏗️" 
          value={resources.materials} 
          label="Materiais"
          color="text-event-color" 
          perTurn={productionPerTurn.materials}
          details={productionDetails.materials}
        />
        <ResourceChip 
          icon="👥" 
          value={resources.population} 
          label="População"
          color="text-city-color" 
          perTurn={productionPerTurn.population}
          details={productionDetails.population}
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