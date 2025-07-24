import React from 'react';
import { Resources } from '../types/resources';

interface ResourceBarProps {
  resources: Resources;
}

const tooltips = {
  coins: 'Moedas: usadas para comprar cartas e construir edifícios.',
  food: 'Comida: necessária para sustentar a população e construir.',
  materials: 'Materiais: usados para construir edifícios e marcos.',
  population: 'População: limita construções e produção.',
};

const ResourceBar: React.FC<ResourceBarProps> = ({ resources }) => (
  <div style={{ display: 'flex', gap: 16, margin: '16px 0' }}>
    <span title={tooltips.coins}>💰 {resources.coins}</span>
    <span title={tooltips.food}>🌾 {resources.food}</span>
    <span title={tooltips.materials}>🏗️ {resources.materials}</span>
    <span title={tooltips.population}>👥 {resources.population}</span>
  </div>
);

export default ResourceBar; 