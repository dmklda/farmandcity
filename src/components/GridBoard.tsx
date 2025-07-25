import React from 'react';
import Grid from './Grid.js';

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
  <div style={{ display: 'flex', gap: 24, justifyContent: 'center', width: '100%', flexWrap: 'wrap' }}>
    <div style={{ background: '#23283a', borderRadius: 12, padding: 16, color: '#fff', minWidth: 200, boxShadow: highlightFarm ? '0 0 0 3px #10B981' : undefined }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>🚜 Fazendas</span>
        <span style={{ fontSize: 14, color: '#10B981' }}>{farmCount}/{farmMax}</span>
      </div>
      <Grid grid={farmGrid} title="" onSelectCell={onSelectFarm} highlight={highlightFarm} />
    </div>
    <div style={{ background: '#23283a', borderRadius: 12, padding: 16, color: '#fff', minWidth: 200, boxShadow: highlightCity ? '0 0 0 3px #3B82F6' : undefined }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>🏘️ Cidades</span>
        <span style={{ fontSize: 14, color: '#3B82F6' }}>{cityCount}/{cityMax}</span>
      </div>
      <Grid grid={cityGrid} title="" onSelectCell={onSelectCity} highlight={highlightCity} />
    </div>
    <div style={{ background: '#23283a', borderRadius: 12, padding: 16, color: '#fff', minWidth: 200, boxShadow: highlightEvent ? '0 0 0 3px #8B5CF6' : undefined }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>⚡ Eventos</span>
        <span style={{ fontSize: 14, color: '#8B5CF6' }}>{eventCount}/{eventMax}</span>
      </div>
      <Grid grid={eventGrid} title="" onSelectCell={onSelectEvent} highlight={highlightEvent} />
    </div>
    <div style={{ background: '#23283a', borderRadius: 12, padding: 16, color: '#fff', minWidth: 200, border: '2px solid #F59E0B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🏛️ Marcos Históricos</div>
      <div style={{ width: '100%', minHeight: 60, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[...Array(landmarkMax)].map((_, i) => (
          <div key={i} style={{
            background: i < landmarkCount ? '#F59E0B' : '#23283a',
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
);

export default GridBoard; 