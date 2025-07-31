import React from 'react';

const PequenoJardimSVG: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 720 960"
      className={className}
    >
      <defs>
        <linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="1"/>
          <stop offset="100%" stopColor="#22c55e" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id="b" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="1"/>
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id="c" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#84cc16" stopOpacity="1"/>
          <stop offset="100%" stopColor="#65a30d" stopOpacity="1"/>
        </linearGradient>
      </defs>
      
      {/* Fundo da carta */}
      <rect width="720" height="960" rx="40" fill="url(#a)" stroke="#166534" strokeWidth="8"/>
      
      {/* Borda dourada */}
      <rect x="4" y="4" width="712" height="952" rx="36" fill="none" stroke="#fbbf24" strokeWidth="4"/>
      
      {/* Título */}
      <text x="360" y="80" textAnchor="middle" fill="#166534" fontSize="48" fontWeight="bold">
        Pequeno Jardim
      </text>
      
      {/* Tipo da carta */}
      <text x="360" y="120" textAnchor="middle" fill="#166534" fontSize="24" fontWeight="600">
        Fazenda
      </text>
      
      {/* Custo */}
      <circle cx="80" cy="80" r="30" fill="url(#b)" stroke="#92400e" strokeWidth="3"/>
      <text x="80" y="90" textAnchor="middle" fill="#92400e" fontSize="32" fontWeight="bold">0</text>
      
      {/* Ilustração do jardim */}
      {/* Sol */}
      <circle cx="600" cy="200" r="60" fill="url(#b)" stroke="#92400e" strokeWidth="4"/>
      <g stroke="#92400e" strokeWidth="6" fill="none">
        <line x1="600" y1="120" x2="600" y2="100"/>
        <line x1="600" y1="280" x2="600" y2="300"/>
        <line x1="520" y1="200" x2="500" y2="200"/>
        <line x1="680" y1="200" x2="700" y2="200"/>
        <line x1="540" y1="140" x2="520" y2="120"/>
        <line x1="660" y1="260" x2="680" y2="280"/>
        <line x1="540" y1="260" x2="520" y2="280"/>
        <line x1="660" y1="140" x2="680" y2="120"/>
      </g>
      
      {/* Terra */}
      <rect x="100" y="400" width="520" height="200" fill="#8b4513" rx="20"/>
      
      {/* Plantas */}
      <g fill="url(#c)">
        {/* Planta 1 */}
        <ellipse cx="200" cy="350" rx="25" ry="40"/>
        <ellipse cx="180" cy="330" rx="20" ry="30"/>
        <ellipse cx="220" cy="330" rx="20" ry="30"/>
        
        {/* Planta 2 */}
        <ellipse cx="350" cy="340" rx="30" ry="45"/>
        <ellipse cx="320" cy="315" rx="25" ry="35"/>
        <ellipse cx="380" cy="315" rx="25" ry="35"/>
        
        {/* Planta 3 */}
        <ellipse cx="500" cy="345" rx="28" ry="42"/>
        <ellipse cx="472" cy="320" rx="23" ry="32"/>
        <ellipse cx="528" cy="320" rx="23" ry="32"/>
      </g>
      
      {/* Efeito */}
      <text x="360" y="650" textAnchor="middle" fill="#166534" fontSize="28" fontWeight="600">
        Produz 1 comida por turno
      </text>
      
      {/* Raridade */}
      <text x="360" y="900" textAnchor="middle" fill="#166534" fontSize="20" fontWeight="500">
        Comum
      </text>
    </svg>
  );
};

export default PequenoJardimSVG; 
