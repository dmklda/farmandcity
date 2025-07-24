import React from 'react';
import Grid from './Grid';

interface GridBoardProps {
  farmGrid: any[][];
  cityGrid: any[][];
  farmCount: number;
  farmMax: number;
  cityCount: number;
  cityMax: number;
  landmarkCount: number;
  landmarkMax: number;
  onSelectFarm: (x: number, y: number) => void;
  onSelectCity: (x: number, y: number) => void;
  highlightFarm: boolean;
  highlightCity: boolean;
}

const GridBoard: React.FC<GridBoardProps> = ({ farmGrid, cityGrid, farmCount, farmMax, cityCount, cityMax, landmarkCount, landmarkMax, onSelectFarm, onSelectCity, highlightFarm, highlightCity }) => (
  <div style={{ display: 'flex', gap: 32, justifyContent: 'center', width: '100%' }}>
    <div style={{ background: '#23283a', borderRadius: 12, padding: 16, color: '#fff', minWidth: 220, boxShadow: highlightFarm ? '0 0 0 3px #10B981' : undefined }}>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Fazendas</span>
        <span style={{ fontSize: 15, color: '#10B981' }}>{farmCount}/{farmMax}</span>
      </div>
      <Grid grid={farmGrid} title="" onSelectCell={onSelectFarm} highlight={highlightFarm} />
    </div>
    <div style={{ background: '#23283a', borderRadius: 12, padding: 16, color: '#fff', minWidth: 220, boxShadow: highlightCity ? '0 0 0 3px #3B82F6' : undefined }}>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Cidades</span>
        <span style={{ fontSize: 15, color: '#3B82F6' }}>{cityCount}/{cityMax}</span>
      </div>
      <Grid grid={cityGrid} title="" onSelectCell={onSelectCity} highlight={highlightCity} />
    </div>
    <div style={{ background: '#23283a', borderRadius: 12, padding: 16, color: '#fff', minWidth: 220, border: '2px solid #F59E0B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Marcos Históricos</div>
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