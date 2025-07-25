import React, { useState } from 'react';
import { Sprout, Building, Zap, Crown, Plus } from 'lucide-react';
import backgroundImage from '../assets/grid-board-background.jpg';

interface GridCell {
  card?: any;
  x: number;
  y: number;
}

interface EnhancedGridBoardProps {
  farmGrid: GridCell[][];
  cityGrid: GridCell[][];
  eventGrid: GridCell[][];
  farmCount: number;
  farmMax: number;
  cityCount: number;
  cityMax: number;
  eventCount: number;
  eventMax: number;
  landmarkCount: number;
  landmarkMax: number;
  onSelectFarm: (x: number, y: number) => void;
  onSelectCity: (x: number, y: number) => void;
  onSelectEvent: (x: number, y: number) => void;
  highlightFarm: boolean;
  highlightCity: boolean;
  highlightEvent: boolean;
}

interface GridSectionProps {
  title: string;
  icon: React.ReactNode;
  grid: GridCell[][];
  count: number;
  max: number;
  onSelectCell: (x: number, y: number) => void;
  highlight: boolean;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

const GridSection: React.FC<GridSectionProps> = ({
  title,
  icon,
  grid,
  count,
  max,
  onSelectCell,
  highlight,
  color,
  isActive,
  onClick
}) => {
  const renderGrid = () => (
    <div className="grid grid-cols-4 gap-2 p-4">
      {grid.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`
              grid-cell aspect-square min-h-[60px] flex items-center justify-center text-xs font-medium
              ${highlight ? 'available' : ''}
              ${cell.card ? 'bg-surface-hover border-solid' : ''}
            `}
            onClick={() => onSelectCell(colIndex, rowIndex)}
          >
            {cell.card ? (
              <div className="text-center">
                <div className="text-lg mb-1">{cell.card.icon || '🏠'}</div>
                <div className="text-xs text-text-muted truncate">
                  {cell.card.name}
                </div>
              </div>
            ) : (
              <Plus className="w-6 h-6 text-text-muted opacity-50" />
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div
      className={`
        surface-elevated transition-all duration-300 cursor-pointer relative overflow-hidden
        ${isActive ? 'ring-2 ring-offset-2 ring-offset-background' : ''}
        ${highlight ? 'ring-2 ring-offset-2 ring-offset-background' : ''}
        ${color}
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-surface-card/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-xl">{icon}</div>
            <h3 className="font-bold text-text-primary">{title}</h3>
          </div>
          <div className={`text-sm font-bold px-3 py-1 rounded-full ${
            count >= max ? 'bg-destructive/20 text-destructive' : 'bg-surface text-text-secondary'
          }`}>
            {count}/{max}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {isActive && renderGrid()}

      {/* Preview when not active */}
      {!isActive && (
        <div className="p-6 text-center">
          <div className="text-2xl mb-2">{icon}</div>
          <div className="text-sm text-text-secondary mb-2">
            {count} de {max} construídos
          </div>
          <div className="text-xs text-text-muted">
            Clique para expandir
          </div>
        </div>
      )}

      {/* Highlight overlay */}
      {highlight && (
        <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
      )}
    </div>
  );
};

const LandmarkSection: React.FC<{
  landmarkCount: number;
  landmarkMax: number;
}> = ({ landmarkCount, landmarkMax }) => (
  <div className="surface-elevated border-2 border-secondary">
    <div className="p-4 border-b border-border bg-gradient-to-r from-secondary/10 to-secondary/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-secondary" />
          <h3 className="font-bold text-text-primary">Marcos Históricos</h3>
        </div>
        <div className="text-sm font-bold text-secondary">
          {landmarkCount}/{landmarkMax}
        </div>
      </div>
    </div>

    <div className="p-4">
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: landmarkMax }, (_, i) => (
          <div
            key={i}
            className={`
              aspect-square rounded-lg border-2 border-dashed flex items-center justify-center
              transition-all duration-300
              ${i < landmarkCount
                ? 'border-secondary bg-secondary/20 text-secondary'
                : 'border-border bg-surface-card text-text-muted'
              }
            `}
          >
            {i < landmarkCount ? (
              <Crown className="w-8 h-8" />
            ) : (
              <Plus className="w-6 h-6 opacity-50" />
            )}
          </div>
        ))}
      </div>

      {landmarkCount >= landmarkMax && (
        <div className="mt-4 p-3 bg-secondary/10 rounded-lg text-center">
          <div className="text-secondary font-bold text-sm">
            🎉 Vitória por Marcos Históricos!
          </div>
        </div>
      )}
    </div>
  </div>
);

const EnhancedGridBoard: React.FC<EnhancedGridBoardProps> = ({
  farmGrid,
  cityGrid,
  eventGrid,
  farmCount,
  farmMax,
  cityCount,
  cityMax,
  eventCount,
  eventMax,
  landmarkCount,
  landmarkMax,
  onSelectFarm,
  onSelectCity,
  onSelectEvent,
  highlightFarm,
  highlightCity,
  highlightEvent
}) => {
  const [activeSection, setActiveSection] = useState<'farm' | 'city' | 'event'>('farm');

  const sections = [
    {
      id: 'farm' as const,
      title: 'Fazendas',
      icon: <Sprout className="w-5 h-5" />,
      grid: farmGrid,
      count: farmCount,
      max: farmMax,
      onSelect: onSelectFarm,
      highlight: highlightFarm,
      color: 'ring-farm-color'
    },
    {
      id: 'city' as const,
      title: 'Cidades',
      icon: <Building className="w-5 h-5" />,
      grid: cityGrid,
      count: cityCount,
      max: cityMax,
      onSelect: onSelectCity,
      highlight: highlightCity,
      color: 'ring-city-color'
    },
    {
      id: 'event' as const,
      title: 'Eventos',
      icon: <Zap className="w-5 h-5" />,
      grid: eventGrid,
      count: eventCount,
      max: eventMax,
      onSelect: onSelectEvent,
      highlight: highlightEvent,
      color: 'ring-magic-color'
    }
  ];

  return (
    <div 
      className="relative rounded-2xl overflow-hidden"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-surface-card/80 backdrop-blur rounded-xl p-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${activeSection === section.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }
              `}
            >
              {section.icon}
              <span>{section.title}</span>
              <span className="text-xs bg-surface/50 px-2 py-0.5 rounded-full">
                {section.count}/{section.max}
              </span>
            </button>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Grid Section */}
          <div className="lg:col-span-2">
            {sections.map((section) => (
              <GridSection
                key={section.id}
                title={section.title}
                icon={section.icon}
                grid={section.grid}
                count={section.count}
                max={section.max}
                onSelectCell={section.onSelect}
                highlight={section.highlight}
                color={section.color}
                isActive={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              />
            ))}
          </div>

          {/* Landmarks Section */}
          <div className="lg:col-span-1">
            <LandmarkSection 
              landmarkCount={landmarkCount}
              landmarkMax={landmarkMax}
            />
            
            {/* Quick Stats */}
            <div className="mt-6 surface-elevated p-4">
              <h4 className="font-bold text-text-primary mb-3">Resumo</h4>
              <div className="space-y-2 text-sm">
                {sections.map((section) => (
                  <div key={section.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {section.icon}
                      <span className="text-text-secondary">{section.title}</span>
                    </div>
                    <span className="text-text-primary font-medium">
                      {section.count}/{section.max}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGridBoard;