import React from 'react';
import { Resources } from '../types/resources';
import { CoinsIconPNG, FoodsIconPNG, MaterialsIconPNG, PopulationIconPNG } from './IconComponentsPNG';

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
    <span title={tooltips.coins} className="flex items-center gap-1">
      <CoinsIconPNG size={16} />
      {resources.coins}
    </span>
    <span title={tooltips.food} className="flex items-center gap-1">
      <FoodsIconPNG size={16} />
      {resources.food}
    </span>
    <span title={tooltips.materials} className="flex items-center gap-1">
      <MaterialsIconPNG size={16} />
      {resources.materials}
    </span>
    <span title={tooltips.population} className="flex items-center gap-1">
      <PopulationIconPNG size={16} />
      {resources.population}
    </span>
  </div>
);

export default ResourceBar; 