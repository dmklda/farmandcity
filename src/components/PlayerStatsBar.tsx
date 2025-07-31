import React from 'react';
import { Star, Building2 } from 'lucide-react';
import { PlayerStats } from '../types/gameState';

interface PlayerStatsBarProps {
  playerStats: PlayerStats;
}

const tooltips = {
  reputation: 'Reputação: aumenta ao construir cartas, desbloqueia conquistas e pode levar à vitória.',
  totalProduction: 'Produção Total: soma de todos os recursos produzidos durante a partida.',
  buildings: 'Edifícios: total de cartas construídas no grid.',
  landmarks: 'Marcos: cartas especiais, construir 3 garante vitória.',
};

const PlayerStatsBar: React.FC<PlayerStatsBarProps> = ({ playerStats }) => (
  <div style={{ display: 'flex', gap: 24, margin: '12px 0', fontSize: 15, alignItems: 'center' }}>
    <span title={tooltips.reputation} className="flex items-center gap-1">
      <Star className="w-4 h-4 text-yellow-500" />
      <strong>Reputação:</strong> {playerStats.reputation}
    </span>
    <span title={tooltips.totalProduction}>⚙️ <strong>Produção Total:</strong> {playerStats.totalProduction}</span>
    <span title={tooltips.buildings}>🏠 <strong>Edifícios:</strong> {playerStats.buildings}</span>
    <span title={tooltips.landmarks} className="flex items-center gap-1">
      <Building2 className="w-4 h-4 text-purple-500" />
      <strong>Marcos:</strong> {playerStats.landmarks}
    </span>
  </div>
);

export default PlayerStatsBar; 
