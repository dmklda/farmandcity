import React from 'react';
import Grid from './Grid.js';
import backgroundImage from '../assets/grid-board-background.jpg';

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
    style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      borderRadius: 16,
      padding: 24,
      position: 'relative'
    }}
  >
    <div 
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 12,
        padding: 16,
        backdropFilter: 'blur(2px)'
      }}
    >
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', width: '100%', flexWrap: 'wrap' }}>
        <div style={{ background: 'rgba(35, 40, 58, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 16, color: '#fff', minWidth: 200, boxShadow: highlightFarm ? '0 0 0 3px #10B981' : '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>🚜 Fazendas</span>
        <span style={{ fontSize: 14, color: '#10B981' }}>{farmCount}/{farmMax}</span>
      </div>
          <Grid grid={farmGrid} title="" onSelectCell={onSelectFarm} highlight={highlightFarm} />
        </div>
        <div style={{ background: 'rgba(35, 40, 58, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 16, color: '#fff', minWidth: 200, boxShadow: highlightCity ? '0 0 0 3px #3B82F6' : '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>🏘️ Cidades</span>
        <span style={{ fontSize: 14, color: '#3B82F6' }}>{cityCount}/{cityMax}</span>
      </div>
          <Grid grid={cityGrid} title="" onSelectCell={onSelectCity} highlight={highlightCity} />
        </div>
        <div style={{ background: 'rgba(35, 40, 58, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 16, color: '#fff', minWidth: 200, boxShadow: highlightEvent ? '0 0 0 3px #8B5CF6' : '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>⚡ Eventos</span>
        <span style={{ fontSize: 14, color: '#8B5CF6' }}>{eventCount}/{eventMax}</span>
      </div>
          <Grid grid={eventGrid} title="" onSelectCell={onSelectEvent} highlight={highlightEvent} />
        </div>
        <div style={{ background: 'rgba(35, 40, 58, 0.9)', borderRadius: 12, padding: 16, color: '#fff', minWidth: 200, border: '2px solid #F59E0B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🏛️ Marcos Históricos</div>
      <div style={{ width: '100%', minHeight: 60, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[...Array(landmarkMax)].map((_, i) => (
          <div key={i} style={{
            background: i < landmarkCount ? '#F59E0B' : 'rgba(35, 40, 58, 0.9)',
            color: i < landmarkCount ? '#fff' : '#F59E0B',
            border: '1.5px dashed #F59E0B',
            borderRadius: 8,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 15,
          }}>{i < landmarkCount ? '🏛️' : '+'}</div>
        ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default GridBoard; 