import React, { useState } from 'react';
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
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
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
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={color}>{icon}</span>
          <span className="text-xs font-medium text-text-primary">{label}</span>
        </div>
        <span className="text-xs text-text-secondary">{current}/{max}</span>
      </div>
      <div className="w-full bg-surface-card rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full transition-all duration-500 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const FixedSidebar: React.FC<SidebarProps> = ({ resources, progress, victory, history, isVisible, setIsVisible }) => {

  return (
    <>
      {/* Sidebar */}
      <aside className={`
        bg-surface border-r border-border z-30 h-screen transition-all duration-300 fixed left-0 top-0
        ${isVisible ? 'w-72' : 'w-0 overflow-hidden'}
      `}>
        <div className="p-2 h-full overflow-hidden flex flex-col">
          {/* Progress Section */}
          <div className="surface-elevated p-2 space-y-2">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-primary" />
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
          <div className="surface-elevated p-2 space-y-1 mt-2">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              <Trophy className="w-3 h-3 text-secondary" />
              Condições de Vitória
            </h3>
          
            <div className="space-y-1 text-xs">
              <div className={`flex items-center justify-between p-1.5 rounded text-xs ${victory.landmarks >= 3 ? 'bg-farm-color/20 text-farm-color' : 'text-text-secondary'}`}>
                <span>3 Marcos Históricos</span>
                <span className="font-bold">{victory.landmarks}/3</span>
              </div>
              
              <div className={`flex items-center justify-between p-1.5 rounded text-xs ${victory.production >= 1000 ? 'bg-farm-color/20 text-farm-color' : 'text-text-secondary'}`}>
                <span>1000 Produção Total</span>
                <span className="font-bold">{victory.production}/1000</span>
              </div>
              
              <div className={`flex items-center justify-between p-1.5 rounded text-xs ${victory.reputation >= 10 ? 'bg-farm-color/20 text-farm-color' : 'text-text-secondary'}`}>
                <span>10 Reputação</span>
                <span className="font-bold">{victory.reputation}/10</span>
              </div>
              
              <div className={`flex items-center justify-between p-1.5 rounded text-xs ${victory.turn >= 20 ? 'bg-destructive/20 text-destructive' : 'text-text-secondary'}`}>
                <span>Sobreviver 20 Turnos</span>
                <span className="font-bold">{victory.turn}/20</span>
              </div>
            </div>
          </div>

          {/* History - Scrollable */}
          <div className="surface-elevated p-2 flex-1 min-h-0 mt-2 flex flex-col">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5 mb-1">
              <Clock className="w-3 h-3 text-magic-color" />
              Histórico
            </h3>
            
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pr-1">
              <div className="space-y-0.5">
                {history.length > 0 ? (
                  history.slice(-50).reverse().map((event, index) => (
                    <div 
                      key={index}
                      className="text-xs text-text-secondary bg-surface-card p-1.5 rounded border-l-2 border-border"
                    >
                      {event}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-text-muted italic">
                    Nenhuma ação ainda.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FixedSidebar;