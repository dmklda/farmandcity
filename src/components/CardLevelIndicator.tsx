import React from 'react';
import { Badge } from './ui/badge';

interface CardLevelIndicatorProps {
  level: number;
  className?: string;
}

export const CardLevelIndicator: React.FC<CardLevelIndicatorProps> = ({ level, className = '' }) => {
  if (level <= 1) return null;
  
  const getLevelColor = (level: number) => {
    if (level === 2) return 'bg-blue-500 text-white';
    if (level === 3) return 'bg-purple-500 text-white';
    if (level === 4) return 'bg-orange-500 text-white';
    return 'bg-red-500 text-white';
  };
  
  const getLevelText = (level: number) => {
    if (level === 2) return 'Nv.2';
    if (level === 3) return 'Nv.3';
    if (level === 4) return 'Nv.4';
    return `Nv.${level}`;
  };
  
  return (
    <Badge 
      className={`absolute -top-2 -right-2 text-xs font-bold px-2 py-1 ${getLevelColor(level)} ${className}`}
    >
      {getLevelText(level)}
    </Badge>
  );
}; 