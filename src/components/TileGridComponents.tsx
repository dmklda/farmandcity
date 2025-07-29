import React from 'react';

// Imports dos tiles PNG
import cityTileMobile from '../assets/grids_background/Tile_grids_background/City_grid_mobile.png';
import cityTileDesktop from '../assets/grids_background/Tile_grids_background/City_grid_desktop.png';
import farmTileMobile from '../assets/grids_background/Tile_grids_background/Farm_grid_mobile.png';
import farmTileDesktop from '../assets/grids_background/Tile_grids_background/Farm_grid_desktop.png';
import landmarkTileMobile from '../assets/grids_background/Tile_grids_background/Landmark_grid_mobile.png';
import landmarkTileDesktop from '../assets/grids_background/Tile_grids_background/Landmark_grid_desktop.png';
import eventTileMobile from '../assets/grids_background/Tile_grids_background/Event_grid_mobile.png';
import eventTileDesktop from '../assets/grids_background/Tile_grids_background/Event_grid_desktop.png';

interface TileGridProps {
  type: 'city' | 'farm' | 'landmark' | 'event';
  className?: string;
}

export const TileGrid: React.FC<TileGridProps> = ({ type, className = "" }) => {
  const getTileSrc = () => {
    switch (type) {
      case 'city':
        return {
          mobile: cityTileMobile,
          desktop: cityTileDesktop
        };
      case 'farm':
        return {
          mobile: farmTileMobile,
          desktop: farmTileDesktop
        };
      case 'landmark':
        return {
          mobile: landmarkTileMobile,
          desktop: landmarkTileDesktop
        };
      case 'event':
        return {
          mobile: eventTileMobile,
          desktop: eventTileDesktop
        };
      default:
        return {
          mobile: cityTileMobile,
          desktop: cityTileDesktop
        };
    }
  };

  const tileSrc = getTileSrc();

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Mobile tile */}
      <img
        src={tileSrc.mobile}
        alt={`${type} tile mobile`}
        className="w-full h-full object-cover md:hidden"
      />
      {/* Desktop tile */}
      <img
        src={tileSrc.desktop}
        alt={`${type} tile desktop`}
        className="w-full h-full object-cover hidden md:block"
      />
    </div>
  );
};

// Componentes específicos para cada tipo
export const CityTileGrid: React.FC<{ className?: string }> = ({ className }) => (
  <TileGrid type="city" className={className} />
);

export const FarmTileGrid: React.FC<{ className?: string }> = ({ className }) => (
  <TileGrid type="farm" className={className} />
);

export const LandmarkTileGrid: React.FC<{ className?: string }> = ({ className }) => (
  <TileGrid type="landmark" className={className} />
);

export const EventTileGrid: React.FC<{ className?: string }> = ({ className }) => (
  <TileGrid type="event" className={className} />
); 