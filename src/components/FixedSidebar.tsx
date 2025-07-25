import React from 'react';
import { ChevronLeft, ChevronRight, Target, Trophy, Clock, Activity } from 'lucide-react';

interface SidebarProps {
  resources: {
    coins: number;
    food: number;
    materials: number;
    population: number;
    coinsPerTurn: number;
    foodPerTurn: number;
    materialsPerTurn: number;
    populationStatus: string;
  };
  progress: {
    reputation: number;
    reputationMax: number;
    production: number;
    productionMax: number;
    landmarks: number;
    landmarksMax: number;
    turn: number;
    turnMax: number;
  };
  victory: {
    reputation: number;
    production: number;
    landmarks: number;
    turn: number;
  };
  history: string[];
}

interface ProgressBarProps {
  label: string;
  current: number;
  max: number;
  icon: React.ReactNode;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, current, max, icon, color }) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={color}>{icon}</span>
          <span className="text-sm font-medium text-text-primary">{label}</span>
        </div>
        <span className="text-sm text-text-secondary">{current}/{max}</span>
      </div>
      <div className="w-full bg-surface-card rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const FixedSidebar: React.FC<SidebarProps> = ({ resources, progress, victory, history }) => {
  return (
    <aside className="w-80 bg-surface border-r border-border flex flex-col relative z-30 h-screen">
      <div className="p-3 flex flex-col h-full">
        {/* Progress Section */}
        <div className="surface-elevated p-3 space-y-3">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Progresso
          </h3>
          
          <ProgressBar
            label="Reputação"
            current={progress.reputation}
            max={progress.reputationMax}
            icon="⭐"
            color="text-secondary"
          />
          
          <ProgressBar
            label="Produção Total"
            current={progress.production}
            max={progress.productionMax}
            icon="⚙️"
            color="text-farm-color"
          />
          
          <ProgressBar
            label="Marcos Históricos"
            current={progress.landmarks}
            max={progress.landmarksMax}
            icon="🏛️"
            color="text-event-color"
          />
        </div>

        {/* Victory Conditions */}
        <div className="surface-elevated p-3 space-y-2 mt-4">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Trophy className="w-4 h-4 text-secondary" />
            Condições de Vitória
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className={`flex items-center justify-between p-2 rounded ${victory.landmarks >= 3 ? 'bg-farm-color/20 text-farm-color' : 'text-text-secondary'}`}>
              <span>3 Marcos Históricos</span>
              <span className="font-bold">{victory.landmarks}/3</span>
            </div>
            
            <div className={`flex items-center justify-between p-2 rounded ${victory.production >= 1000 ? 'bg-farm-color/20 text-farm-color' : 'text-text-secondary'}`}>
              <span>1000 Produção Total</span>
              <span className="font-bold">{victory.production}/1000</span>
            </div>
            
            <div className={`flex items-center justify-between p-2 rounded ${victory.reputation >= 10 ? 'bg-farm-color/20 text-farm-color' : 'text-text-secondary'}`}>
              <span>10 Reputação</span>
              <span className="font-bold">{victory.reputation}/10</span>
            </div>
            
            <div className={`flex items-center justify-between p-2 rounded ${victory.turn >= 20 ? 'bg-destructive/20 text-destructive' : 'text-text-secondary'}`}>
              <span>Sobreviver 20 Turnos</span>
              <span className="font-bold">{victory.turn}/20</span>
            </div>
          </div>
        </div>

        {/* History - Scrollable */}
        <div className="surface-elevated p-3 flex-1 min-h-0 mt-4 flex flex-col">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-magic-color" />
            Histórico
          </h3>
          
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            <div className="space-y-1">
              {history.length > 0 ? (
                history.slice(-50).reverse().map((event, index) => (
                  <div 
                    key={index}
                    className="text-sm text-text-secondary bg-surface-card p-2 rounded border-l-2 border-border"
                  >
                    {event}
                  </div>
                ))
              ) : (
                <div className="text-sm text-text-muted italic">
                  Nenhuma ação ainda.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FixedSidebar;