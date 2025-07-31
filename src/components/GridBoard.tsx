import React from 'react';
import Grid from './Grid.js';
import backgroundImage from '../assets/grid-board-background.jpg';
import { FarmIconPNG, CityIconPNG, EventIconPNG, LandmarkIconPNG } from './IconComponentsPNG';

interface GridBoardProps {
  farmGrid: any[][];
  cityGrid: any[][];
  eventGrid: any[][];
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

const GridBoard: React.FC<GridBoardProps> = ({ 
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
}) => (
  <div 
    className="relative rounded-2xl p-6 overflow-hidden"
    style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    {/* Background overlay with animated effects */}
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1),transparent_50%)]"></div>
    
    {/* Content */}
    <div className="relative z-10 bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10">
      <div className="flex gap-6 justify-center w-full flex-wrap">
        
        {/* Farm Grid */}
        <div className={`
          bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-white/10 rounded-xl p-4 text-white min-w-[200px] 
          transition-all duration-300 transform hover:scale-105
          ${highlightFarm 
            ? 'shadow-[0_0_20px_rgba(16,185,129,0.5)] border-emerald-400/50' 
            : 'shadow-lg hover:shadow-xl'
          }
        `}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <FarmIconPNG size={24} />
              <span className="font-bold text-lg">Fazendas</span>
            </div>
            <div className={`
              px-3 py-1 rounded-full text-sm font-bold
              ${highlightFarm 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/50' 
                : 'bg-slate-700/50 text-slate-300'
              }
            `}>
              {farmCount}/{farmMax}
            </div>
          </div>
          <Grid grid={farmGrid} title="" onSelectCell={onSelectFarm} highlight={highlightFarm} />
        </div>

        {/* City Grid */}
        <div className={`
          bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-white/10 rounded-xl p-4 text-white min-w-[200px] 
          transition-all duration-300 transform hover:scale-105
          ${highlightCity 
            ? 'shadow-[0_0_20px_rgba(59,130,246,0.5)] border-blue-400/50' 
            : 'shadow-lg hover:shadow-xl'
          }
        `}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <CityIconPNG size={24} />
              <span className="font-bold text-lg">Cidades</span>
            </div>
            <div className={`
              px-3 py-1 rounded-full text-sm font-bold
              ${highlightCity 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-400/50' 
                : 'bg-slate-700/50 text-slate-300'
              }
            `}>
              {cityCount}/{cityMax}
            </div>
          </div>
          <Grid grid={cityGrid} title="" onSelectCell={onSelectCity} highlight={highlightCity} />
        </div>

        {/* Event Grid */}
        <div className={`
          bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-white/10 rounded-xl p-4 text-white min-w-[200px] 
          transition-all duration-300 transform hover:scale-105
          ${highlightEvent 
            ? 'shadow-[0_0_20px_rgba(139,92,246,0.5)] border-purple-400/50' 
            : 'shadow-lg hover:shadow-xl'
          }
        `}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <EventIconPNG size={24} />
              <span className="font-bold text-lg">Eventos</span>
            </div>
            <div className={`
              px-3 py-1 rounded-full text-sm font-bold
              ${highlightEvent 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-400/50' 
                : 'bg-slate-700/50 text-slate-300'
              }
            `}>
              {eventCount}/{eventMax}
            </div>
          </div>
          <Grid grid={eventGrid} title="" onSelectCell={onSelectEvent} highlight={highlightEvent} />
        </div>

        {/* Landmarks */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-2 border-amber-500/50 rounded-xl p-4 text-white min-w-[200px] shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center gap-2 mb-3">
            <LandmarkIconPNG size={24} />
            <span className="font-bold text-lg">Marcos Históricos</span>
          </div>
          <div className="w-full min-h-[60px] flex flex-col gap-2">
            {[...Array(landmarkMax)].map((_, i) => (
              <div 
                key={i} 
                className={`
                  h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-300
                  ${i < landmarkCount 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg animate-pulse' 
                    : 'bg-slate-700/50 text-amber-400 border border-dashed border-amber-500/50 hover:border-amber-400/70'
                  }
                `}
              >
                {i < landmarkCount ? <LandmarkIconPNG size={16} /> : '+'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default GridBoard; 
