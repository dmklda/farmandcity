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
    <div className="grid grid-cols-4 gap-0.5 p-0.5">
      {grid.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`
              grid-cell aspect-square min-h-[25px] flex items-center justify-center text-xs font-medium
              ${highlight ? 'available' : ''}
              ${cell.card ? 'bg-surface-hover border-solid' : ''}
            `}
            onClick={() => onSelectCell(colIndex, rowIndex)}
          >
            {cell.card ? (
              <div className="text-center">
                <div className="text-[10px] mb-0.5">{cell.card.icon || '🏠'}</div>
                <div className="text-[8px] text-text-muted truncate">
                  {cell.card.name.slice(0, 4)}
                </div>
              </div>
            ) : (
              <Plus className="w-2.5 h-2.5 text-text-muted opacity-50" />
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
      <div className="p-1 border-b border-border bg-surface-card/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="text-sm">{icon}</div>
            <h3 className="font-bold text-text-primary text-xs">{title}</h3>
          </div>
          <div className={`text-xs font-bold px-1 py-0.5 rounded-full ${
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
        <div className="p-2 text-center">
          <div className="text-sm mb-0.5">{icon}</div>
          <div className="text-xs text-text-secondary mb-0.5">
            {count}/{max}
          </div>
          <div className="text-xs text-text-muted">
            Clique
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
    <div className="p-1 border-b border-border bg-gradient-to-r from-secondary/10 to-secondary/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Crown className="w-3 h-3 text-secondary" />
          <h3 className="font-bold text-text-primary text-xs">Marcos</h3>
        </div>
        <div className="text-xs font-bold text-secondary">
          {landmarkCount}/{landmarkMax}
        </div>
      </div>
    </div>

    <div className="p-1">
      <div className="grid grid-cols-3 gap-0.5">
        {Array.from({ length: landmarkMax }, (_, i) => (
          <div
            key={i}
            className={`
              aspect-square rounded-md border-2 border-dashed flex items-center justify-center min-h-[20px]
              transition-all duration-300
              ${i < landmarkCount
                ? 'border-secondary bg-secondary/20 text-secondary'
                : 'border-border bg-surface-card text-text-muted'
              }
            `}
          >
            {i < landmarkCount ? (
              <Crown className="w-2 h-2" />
            ) : (
              <Plus className="w-2 h-2 opacity-50" />
            )}
          </div>
        ))}
      </div>

      {landmarkCount >= landmarkMax && (
        <div className="mt-1 p-1 bg-secondary/10 rounded-lg text-center">
          <div className="text-secondary font-bold text-xs">
            🎉 Vitória!
          </div>
        </div>
      )}
    </div>
  </div>
);

const EventCardsSection: React.FC<{
  eventGrid: GridCell[][];
  eventCount: number;
  eventMax: number;
  onSelectEvent: (x: number, y: number) => void;
  highlight: boolean;
}> = ({ eventGrid, eventCount, eventMax, onSelectEvent, highlight }) => (
  <div className="surface-elevated border-2 border-magic-color">
    <div className="p-1 border-b border-border bg-gradient-to-r from-magic-color/10 to-magic-color/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-magic-color" />
          <h3 className="font-bold text-text-primary text-xs">Eventos</h3>
        </div>
        <div className="text-xs font-bold text-magic-color">
          {eventCount}/{eventMax}
        </div>
      </div>
    </div>

    <div className="p-1">
      <div className="flex gap-0.5">
        {Array.from({ length: eventMax }, (_, i) => {
          const eventCard = eventGrid[0] && eventGrid[0][i]?.card;
          return (
            <div
              key={i}
              className={`
                flex-1 min-h-[40px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center
                transition-all duration-300 cursor-pointer
                ${highlight ? 'border-magic-color bg-magic-color/10' : 'border-border bg-surface-card'}
                ${eventCard ? 'border-solid bg-surface-hover' : ''}
              `}
              onClick={() => onSelectEvent(i, 0)}
            >
              {eventCard ? (
                <div className="text-center p-0.5">
                  <div className="text-xs mb-0.5">⚡</div>
                  <div className="text-xs text-text-primary font-medium line-clamp-1">
                    {eventCard.name}
                  </div>
                  <div className="text-xs text-magic-color">
                    Ativo
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Plus className="w-2 h-2 text-text-muted opacity-50 mb-0.5" />
                  <div className="text-xs text-text-muted">Evento</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {eventCount >= eventMax && (
        <div className="mt-0.5 p-1 bg-magic-color/10 rounded-lg text-center">
          <div className="text-magic-color font-bold text-xs">
            🌟 Máximo!
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
  const [activeSection, setActiveSection] = useState<'farm' | 'city'>('farm');

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
      <div className="relative z-10 p-2">
        {/* Tab Navigation */}
        <div className="flex gap-0.5 mb-2 bg-surface-card/80 backdrop-blur rounded-lg p-0.5">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all duration-200 text-xs
                ${activeSection === section.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }
              `}
            >
              {section.icon}
              <span className="text-sm">{section.title}</span>
              <span className="text-xs bg-surface/50 px-1.5 py-0.5 rounded-full">
                {section.count}/{section.max}
              </span>
            </button>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          {/* Active Grid Section - Takes 2 columns */}
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

          {/* Right Column - Events and Landmarks */}
          <div className="lg:col-span-2 space-y-2">
            {/* Events Section - Fixed like field cards */}
            <EventCardsSection
              eventGrid={eventGrid}
              eventCount={eventCount}
              eventMax={eventMax}
              onSelectEvent={onSelectEvent}
              highlight={highlightEvent}
            />

            {/* Landmarks Section */}
            <LandmarkSection 
              landmarkCount={landmarkCount}
              landmarkMax={landmarkMax}
            />
            
            {/* Quick Stats */}
            <div className="surface-elevated p-2">
              <h4 className="font-bold text-text-primary mb-1 text-xs">Resumo</h4>
              <div className="space-y-0.5 text-xs">
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    <span className="text-text-secondary">Eventos</span>
                  </div>
                  <span className="text-text-primary font-medium">
                    {eventCount}/{eventMax}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGridBoard;