import React, { useState, useRef, DragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Shield, Cloud, Plus, Eye, EyeOff, Trophy, Target, Zap } from 'lucide-react';
import { CardDetailModal } from './EnhancedHand';
import { Card } from '../types/card';
import { getCardTypeIconPNG, CityIconPNG, FarmIconPNG, LandmarkIconPNG, EventIconPNG, GameLogoPNG } from './IconComponentsPNG';
import { CityTileGrid, FarmTileGrid, LandmarkTileGrid, EventTileGrid } from './TileGridComponents';
import backgroundImage from '../assets/grid-board-background.jpg';
import cityBackground from '../assets/grids_background/City_background.png';
import farmBackground from '../assets/grids_background/Farm_background.png';
import landmarkBackground from '../assets/grids_background/Landmark_background.png';
import eventsBackground from '../assets/grids_background/Events_background.png';


interface GridCell {
  card?: Card | null;
  x: number;
  y: number;
}

interface EpicBattlefieldProps {
  farmGrid: GridCell[][];
  cityGrid: GridCell[][];
  eventGrid: GridCell[][];
  landmarksGrid: GridCell[][];
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
  onSelectLandmark: (x: number, y: number) => void;
  highlightFarm: boolean;
  highlightCity: boolean;
  highlightEvent: boolean;
  highlightLandmark: boolean;
  onToggleHand?: () => void;
  handVisible?: boolean;
}

interface CardSlotProps {
  id: string;
  type: 'landmark' | 'city' | 'farm' | 'event';
  size?: 'large' | 'medium';
  cell: GridCell;
  x: number;
  y: number;
  onSelect: (x: number, y: number) => void;
  highlight: boolean;
  className?: string;
}



const CardSlot = ({ 
  id, 
  type, 
  size = 'medium', 
  cell, 
  x, 
  y, 
  onSelect, 
  highlight, 
  className 
}: CardSlotProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showDetail, setShowDetail] = useState<Card | null>(null);
  
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (highlight && !cell.card) {
      setIsDragOver(true);
    }
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (highlight && !cell.card) {
      onSelect(x, y);
    }
  };

  const handleClick = () => {
    if (cell.card) {
      setShowDetail(cell.card);
    } else if (highlight) {
      onSelect(x, y);
    }
  };

  const getSlotIcon = () => {
    switch (type) {
      case 'landmark': return <LandmarkIconPNG size={24} />;
      case 'city': return <CityIconPNG size={24} />;
      case 'farm': return <FarmIconPNG size={24} />;
      case 'event': return <EventIconPNG size={24} />;
      default: return <Plus className="w-4 h-4" />;
    }
  };

  const getSlotBackground = () => {
    switch (type) {
      case 'landmark': return 'bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20';
      case 'city': return 'bg-gradient-to-br from-stone-800/20 via-gray-700/20 to-slate-800/20';
      case 'farm': return 'bg-gradient-to-br from-green-900/20 via-emerald-800/20 to-lime-900/20';
      case 'event': return 'bg-gradient-to-br from-amber-900/20 via-orange-800/20 to-red-900/20';
      default: return 'bg-gradient-to-br from-gray-800/20 to-gray-900/20';
    }
  };

  const getBorderColor = () => {
    if (highlight && !cell.card) {
      return 'border-yellow-400/60 shadow-lg shadow-yellow-400/20';
    }
    switch (type) {
      case 'landmark': return cell.card ? 'border-purple-400/60' : 'border-purple-500/30';
      case 'city': return cell.card ? 'border-stone-400/60' : 'border-stone-500/30';
      case 'farm': return cell.card ? 'border-green-400/60' : 'border-green-500/30';
      case 'event': return cell.card ? 'border-amber-400/60' : 'border-amber-500/30';
      default: return 'border-gray-500/30';
    }
  };

  const sizeClasses = size === 'large' 
    ? 'h-32 w-24 md:h-40 md:w-28' 
    : 'h-24 w-20 md:h-28 md:w-24';

  const isPlayable = highlight && !cell.card;
  const hasCard = !!cell.card;

  return (
    <>
      <motion.div
        className={`
          relative rounded-lg border-2 transition-all duration-300 backdrop-blur-sm
          ${sizeClasses}
          ${getSlotBackground()}
          ${getBorderColor()}
          ${isDragOver ? 'border-yellow-400 shadow-lg shadow-yellow-400/20 scale-105' : ''}
          ${isPlayable ? 'hover:border-opacity-60 cursor-pointer' : hasCard ? 'cursor-pointer' : 'cursor-default'}
          ${className}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        whileHover={{ scale: isPlayable || hasCard ? 1.02 : 1 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {!hasCard ? (
          <div className="relative flex flex-col items-center justify-center h-full text-white/60">
            {/* Tile background */}
            <div className="absolute inset-0 rounded-lg overflow-hidden opacity-30">
              {type === 'city' && <CityTileGrid />}
              {type === 'farm' && <FarmTileGrid />}
              {type === 'landmark' && <LandmarkTileGrid />}
              {type === 'event' && <EventTileGrid />}
            </div>
            {/* Content overlay */}
            <div className="relative z-10 flex flex-col items-center">
              {getSlotIcon()}
              <span className="text-xs mt-1 capitalize">{type}</span>
            </div>
          </div>
        ) : (
          <div className="p-2 h-full flex flex-col">
            <div className="flex-1 bg-gradient-to-b from-white/10 to-white/5 rounded border border-white/20">
              <div className="p-2 text-center">
                <div className="mb-1">{getCardTypeIconPNG(cell.card!.type, 16)}</div>
                <div className="text-xs font-semibold text-white truncate">
                  {cell.card!.name.slice(0, 8)}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isDragOver && (
          <motion.div
            className="absolute inset-0 bg-yellow-400/20 rounded-lg border-2 border-yellow-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* Glow effect for highlighted slots */}
        {isPlayable && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-yellow-400/10"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
      
      <CardDetailModal card={showDetail} isOpen={!!showDetail} onClose={() => setShowDetail(null)} />
    </>
  );
};

const ZoneHeader = ({ 
  title, 
  icon, 
  count, 
  max, 
  className 
}: { 
  title: string; 
  icon: React.ReactNode; 
  count: number; 
  max: number; 
  className?: string; 
}) => {
  return (
    <motion.div 
      className={`flex items-center gap-2 mb-2 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="ml-auto bg-black/60 text-white px-2 py-1 rounded-md text-xs font-bold backdrop-blur-sm">
        {count}/{max}
      </div>
    </motion.div>
  );
};

const EpicBattlefield: React.FC<EpicBattlefieldProps> = ({
  farmGrid,
  cityGrid,
  eventGrid,
  landmarksGrid,
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
  onSelectLandmark,
  highlightFarm,
  highlightCity,
  highlightEvent,
  highlightLandmark,
  onToggleHand,
  handVisible = true
}) => {
  return (
    <motion.div 
      className="relative rounded-2xl overflow-hidden min-h-[700px] select-none"
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Epic Header */}
        <motion.div 
          className="text-center mb-3 -mt-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <GameLogoPNG size={128} />
            </motion.div>
          </div>
        </motion.div>

        {/* Battlefield Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Left Column - City Cards */}
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ZoneHeader 
              title="Cidades" 
              icon={<CityIconPNG size={24} />} 
              count={cityCount}
              max={cityMax}
            />
            <div 
              className="grid grid-cols-3 gap-3 p-4 rounded-xl border border-stone-600/30 backdrop-blur-sm" 
              style={{ 
                gridTemplateRows: 'repeat(4, 1fr)',
                backgroundImage: `url(${cityBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {cityGrid.flatMap((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <CardSlot
                    key={`city-${rowIndex}-${colIndex}`}
                    id={`city-${rowIndex}-${colIndex}`}
                    type="city"
                    cell={cell}
                    x={colIndex}
                    y={rowIndex}
                    onSelect={onSelectCity}
                    highlight={highlightCity}
                  />
                ))
              )}
            </div>
          </motion.div>

          {/* Center Column - Landmarks & Events */}
          <motion.div 
            className="order-1 lg:order-2 space-y-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Landmarks */}
            <div>
              <ZoneHeader 
                title="Marcos Históricos" 
                icon={<LandmarkIconPNG size={24} />} 
                count={landmarkCount}
                max={landmarkMax}
              />
              <div 
                className="flex justify-center gap-4 p-4 rounded-xl border border-purple-600/30 backdrop-blur-sm"
                style={{
                  backgroundImage: `url(${landmarkBackground})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {landmarksGrid.flatMap((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <CardSlot
                      key={`landmark-${rowIndex}-${colIndex}`}
                      id={`landmark-${rowIndex}-${colIndex}`}
                      type="landmark"
                      size="large"
                      cell={cell}
                      x={colIndex}
                      y={rowIndex}
                      onSelect={onSelectLandmark}
                      highlight={highlightLandmark}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Weather Zone (Future) */}
            <motion.div 
              className="p-4 rounded-xl bg-gradient-to-br from-sky-900/20 to-blue-900/20 border border-sky-600/20 border-dashed backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center gap-2 text-white/60">
                <Cloud className="w-5 h-5" />
                <span className="text-sm">Zona Climática (Em Breve)</span>
              </div>
            </motion.div>

            {/* Events */}
            <div>
              <ZoneHeader 
                title="Eventos" 
                icon={<EventIconPNG size={24} />} 
                count={eventCount}
                max={eventMax}
              />
              <div 
                className="flex justify-center gap-4 p-4 rounded-xl border border-amber-600/30 backdrop-blur-sm"
                style={{
                  backgroundImage: `url(${eventsBackground})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {eventGrid.flatMap((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <CardSlot
                      key={`event-${rowIndex}-${colIndex}`}
                      id={`event-${rowIndex}-${colIndex}`}
                      type="event"
                      size="large"
                      cell={cell}
                      x={colIndex}
                      y={rowIndex}
                      onSelect={onSelectEvent}
                      highlight={highlightEvent}
                    />
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Farm Cards */}
          <motion.div 
            className="order-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <ZoneHeader 
              title="Fazendas" 
              icon={<FarmIconPNG size={24} />} 
              count={farmCount}
              max={farmMax}
            />
            <div 
              className="grid grid-cols-3 gap-3 p-4 rounded-xl border border-green-600/30 backdrop-blur-sm" 
              style={{ 
                gridTemplateRows: 'repeat(4, 1fr)',
                backgroundImage: `url(${farmBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {farmGrid.flatMap((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <CardSlot
                    key={`farm-${rowIndex}-${colIndex}`}
                    id={`farm-${rowIndex}-${colIndex}`}
                    type="farm"
                    cell={cell}
                    x={colIndex}
                    y={rowIndex}
                    onSelect={onSelectFarm}
                    highlight={highlightFarm}
                  />
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Defense Zone (Future) - Com espaço extra para evitar sobreposição */}
        <motion.div 
          className="p-6 rounded-xl bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-600/20 border-dashed backdrop-blur-sm mb-32"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-center gap-2 text-white/60">
            <Shield className="w-6 h-6" />
            <span>Fortificações de Defesa (Em Breve)</span>
          </div>
        </motion.div>


      </div>

      {/* Hand Toggle Button */}
      {onToggleHand && (
        <motion.button
          className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-gradient-to-r from-purple-600/80 to-blue-600/80 border border-purple-400/50 backdrop-blur-sm text-white shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={onToggleHand}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          {handVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EpicBattlefield; 