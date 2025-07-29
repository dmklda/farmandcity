import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BarChart3, Save, LogOut, User, Home } from 'lucide-react';

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
  // Props para o sistema de dado
  onDiceRoll?: () => void;
  diceUsed?: boolean;
  diceResult?: number | null;
}

interface ResourceChipProps {
  icon: string;
  value: number;
  label: string;
  color: string;
  perTurn?: number;
  details?: string[];
}

import { CoinsIconPNG, FoodsIconPNG, MaterialsIconPNG, PopulationIconPNG } from './IconComponentsPNG';

const ResourceChip: React.FC<ResourceChipProps> = ({ icon, value, label, color, perTurn = 0, details = [] }) => {
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
    <div className="resource-chip group relative text-xs px-1 py-0.5">
      {getIconComponent(icon)}
      <span className="font-bold text-text-primary text-xs">{value}</span>
      {perTurn > 0 && (
        <span className="ml-0.5 text-xs text-green-400 font-bold">(+{perTurn})</span>
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
};

interface GameInfoChipProps {
  label: string;
  value: string;
  color: string;
}

const GameInfoChip: React.FC<GameInfoChipProps> = ({ label, value, color }) => (
  <div className={`px-1 py-0.5 rounded font-medium text-xs border transition-colors ${color}`}>
    <span className="text-text-secondary">{label}:</span>
    <span className="ml-0.5 text-text-primary font-bold">{value}</span>
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
  onDiceRoll,
  diceUsed,
  diceResult
}) => {
  // Debug das props do dado
  console.log('🎲 EnhancedTopBar - Props do dado:', {
    onDiceRoll: !!onDiceRoll,
    diceUsed,
    diceResult,
    phase
  });

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
    <header className="w-full bg-surface border-b border-border px-1 py-1 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-lg">
      {/* Left Section - Logo & Menu */}
      <div className="flex items-center gap-1 min-w-0 flex-shrink-0">
        {/* Hamburger Button */}
        <Button
          variant="ghost"
          size="sm"
          className="p-0.5 h-6 w-6 flex-shrink-0"
          onClick={onToggleSidebar}
          aria-label="Alternar sidebar"
        >
          <div className="flex flex-col gap-0.5">
            <span className="block w-2.5 h-0.5 bg-text-primary rounded"></span>
            <span className="block w-2.5 h-0.5 bg-text-primary rounded"></span>
            <span className="block w-2.5 h-0.5 bg-text-primary rounded"></span>
          </div>
        </Button>
        
        {/* Logo */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-sm">👑</span>
          <h1 className="text-sm font-bold text-text-primary">Famand</h1>
        </div>
      </div>
      
      {/* Center Section - Resources & Active Deck */}
      <div className="flex items-center gap-1 flex-1 min-w-0 mx-1 overflow-hidden">
        {/* Active Deck Display */}
        {activeDeck && activeDeck.name ? (
          <div className="bg-surface-card px-1.5 py-0.5 rounded border border-border shadow-sm min-w-0 flex-shrink-0">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-primary flex-shrink-0">🃏</span>
              <span className="font-medium text-text-primary truncate max-w-[80px]">{activeDeck.name}</span>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {activeDeck.cards?.length || 0}/28
              </Badge>
            </div>
          </div>
        ) : (
          <div className="bg-surface-card px-1.5 py-0.5 rounded border border-border shadow-sm min-w-0 flex-shrink-0">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground flex-shrink-0">🃏</span>
              <span className="font-medium text-muted-foreground truncate">Nenhum deck</span>
            </div>
          </div>
        )}
        
        {/* Resources */}
        <div className="flex items-center gap-1 bg-surface-card px-1.5 py-0.5 rounded border border-border shadow-sm flex-shrink-0">
          <ResourceChip 
            icon="💰" 
            value={resources?.coins || 0} 
            label="Moedas"
            color="text-secondary" 
            perTurn={productionPerTurn?.coins || 0}
            details={productionDetails?.coins || []}
          />
          <ResourceChip 
            icon="🌾" 
            value={resources?.food || 0} 
            label="Comida"
            color="text-farm-color" 
            perTurn={productionPerTurn?.food || 0}
            details={productionDetails?.food || []}
          />
          <ResourceChip 
            icon="🏗️" 
            value={resources?.materials || 0} 
            label="Materiais"
            color="text-event-color" 
            perTurn={productionPerTurn?.materials || 0}
            details={productionDetails?.materials || []}
          />
          <ResourceChip 
            icon="👥" 
            value={resources?.population || 0} 
            label="População"
            color="text-city-color" 
            perTurn={productionPerTurn?.population || 0}
            details={productionDetails?.population || []}
          />
        </div>
      </div>
      
      {/* Right Section - Game Info & Actions */}
      <div className="flex items-center gap-0.5 min-w-0 flex-shrink-0">
        {/* Game Status */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
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
        
        {/* Action Buttons */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {/* Botão de Dado - SEMPRE VISÍVEL */}
          <Button
            variant="outline"
            size="sm"
            onClick={onDiceRoll || (() => console.log('🎲 Dado clicado mas onDiceRoll não está definido'))}
            disabled={diceUsed || phase !== 'action' || !onDiceRoll}
            className={`h-6 px-1.5 text-xs ${
              diceUsed || phase !== 'action' || !onDiceRoll
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105 hover:bg-purple-50 hover:border-purple-300'
            } transition-all duration-200`}
            title={
              !onDiceRoll
                ? 'Sistema de dado não carregado'
                : diceUsed 
                  ? `Dado já usado neste turno: ${diceResult}` 
                  : phase !== 'action' 
                    ? 'Dado só pode ser usado na fase de Ação' 
                    : 'Rolar dado para ativar cartas'
            }
          >
            <span className="text-sm mr-0.5">🎲</span>
            {diceResult ? `D${diceResult}` : 'Dado'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onShowStats}
            className="h-6 px-1.5 text-xs"
          >
            
            <BarChart3 className="w-3 h-3 mr-0.5" />
            Stats
          </Button>
          

          
          <Button
            variant="outline"
            size="sm"
            onClick={onShowSavedGames}
            className="h-6 px-1.5 text-xs"
          >
            <Save className="w-3 h-3 mr-0.5" />
            Jogos
          </Button>
          
          {/* Next Phase Button */}
          <Button
            onClick={onNextPhase}
            disabled={discardMode || (phase === 'action' && !diceUsed)}
            className={`h-6 px-2 font-semibold text-xs ${
              discardMode || (phase === 'action' && !diceUsed) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            } transition-all duration-200`}
            title={
              discardMode 
                ? 'Complete o descarte primeiro' 
                : phase === 'action' && !diceUsed
                  ? 'Jogue o dado antes de avançar'
                  : 'Avançar para próxima fase'
            }
          >
            <span>→</span>
            <span className="ml-0.5">Próxima Fase</span>
          </Button>
        </div>
        
        {/* User Section */}
        <div className="flex items-center gap-0.5 pl-1 border-l border-border flex-shrink-0">
          {userEmail && (
            <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <User className="w-3 h-3 flex-shrink-0" />
              <span className="max-w-[60px] truncate">{userEmail}</span>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onGoHome}
            className="h-6 px-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex-shrink-0"
            title="Voltar para página inicial"
          >
            <Home className="w-3 h-3 mr-0.5" />
            Início
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="h-6 px-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
            title="Fazer logout"
          >
            <LogOut className="w-3 h-3 mr-0.5" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default EnhancedTopBar;