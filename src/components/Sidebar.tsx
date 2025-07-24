import React from 'react';

interface SidebarProps {
  resources: { coins: number; food: number; materials: number; population: number; coinsPerTurn: number; foodPerTurn: number; materialsPerTurn: number; populationStatus: string; };
  progress: { reputation: number; reputationMax: number; production: number; productionMax: number; landmarks: number; landmarksMax: number; turn: number; turnMax: number; };
  victory: { reputation: number; production: number; landmarks: number; turn: number; };
  history: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ resources, progress, victory, history }) => (
  <aside style={{ width: 270, background: '#23283a', color: '#fff', padding: 20, minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 18 }}>
    <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 8, letterSpacing: -1, display: 'flex', alignItems: 'center', gap: 8 }}>
      <span role="img" aria-label="coroa">👑</span> Famand
    </div>
    <div style={{ background: '#23283a', borderRadius: 10, padding: 12, marginBottom: 8 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>Recursos</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span title="Moedas"><span role="img" aria-label="moedas">🪙</span> {resources.coins} <span style={{ color: '#aaa', fontSize: 13 }}>+{resources.coinsPerTurn}/turno</span></span>
        <span title="Comida"><span role="img" aria-label="comida">🍎</span> {resources.food} <span style={{ color: '#aaa', fontSize: 13 }}>+{resources.foodPerTurn}/turno</span></span>
        <span title="Materiais"><span role="img" aria-label="materiais">🪵</span> {resources.materials} <span style={{ color: '#aaa', fontSize: 13 }}>+{resources.materialsPerTurn}/turno</span></span>
        <span title="População"><span role="img" aria-label="pop">👥</span> {resources.population} <span style={{ color: '#aaa', fontSize: 13 }}>{resources.populationStatus}</span></span>
      </div>
    </div>
    <div style={{ background: '#23283a', borderRadius: 10, padding: 12, marginBottom: 8 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>Progresso</div>
      <div style={{ marginBottom: 6 }}>Reputação: <b>{progress.reputation}/{progress.reputationMax}</b>
        <div style={{ background: '#222', borderRadius: 6, height: 8, marginTop: 2 }}>
          <div style={{ background: '#10B981', width: `${(progress.reputation/progress.reputationMax)*100}%`, height: 8, borderRadius: 6 }}></div>
        </div>
      </div>
      <div style={{ marginBottom: 6 }}>Produção Total: <b>{progress.production}/{progress.productionMax}</b>
        <div style={{ background: '#222', borderRadius: 6, height: 8, marginTop: 2 }}>
          <div style={{ background: '#3B82F6', width: `${(progress.production/progress.productionMax)*100}%`, height: 8, borderRadius: 6 }}></div>
        </div>
      </div>
      <div style={{ marginBottom: 6 }}>Marcos Históricos: <b>{progress.landmarks}/{progress.landmarksMax}</b>
        <div style={{ background: '#222', borderRadius: 6, height: 8, marginTop: 2 }}>
          <div style={{ background: '#F59E0B', width: `${(progress.landmarks/progress.landmarksMax)*100}%`, height: 8, borderRadius: 6 }}></div>
        </div>
      </div>
    </div>
    <div style={{ background: '#23283a', borderRadius: 10, padding: 12, marginBottom: 8 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>Condições de Vitória</div>
      <div style={{ fontSize: 15, color: '#eee', marginBottom: 2 }}>3 Marcos Históricos: <b>{victory.landmarks}/3</b></div>
      <div style={{ fontSize: 15, color: '#eee', marginBottom: 2 }}>1000 Produção Total: <b>{victory.production}/1000</b></div>
      <div style={{ fontSize: 15, color: '#eee', marginBottom: 2 }}>10 Reputação: <b>{victory.reputation}/10</b></div>
      <div style={{ fontSize: 15, color: '#eee', marginBottom: 2 }}>Sobreviver 20 Turnos: <b>{victory.turn}/20</b></div>
    </div>
    <div style={{ background: '#23283a', borderRadius: 10, padding: 12, flex: 1, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
      <div style={{ fontWeight: 700, color: '#3B82F6', marginBottom: 4 }}>Histórico</div>
      {history.length === 0 && <div style={{ color: '#aaa' }}>Nenhuma ação ainda.</div>}
      {history.map((h, i) => (
        <div key={i} style={{ borderBottom: '1px solid #2d3147', paddingBottom: 2 }}>{h}</div>
      ))}
    </div>
  </aside>
);

export default Sidebar; 