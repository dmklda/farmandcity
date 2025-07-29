import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp, Target, Trophy, BarChart3 } from 'lucide-react';

interface SidebarProps {
  resources: { 
    coins: number; 
    food: number; 
    materials: number; 
    population: number; 
    coinsPerTurn: number; 
    foodPerTurn: number; 
    materialsPerTurn: number; 
    populationStatus: string; 
  };
  progress: { 
    reputation: number; 
    reputationMax: number; 
    production: number; 
    productionMax: number; 
    landmarks: number; 
    landmarksMax: number; 
    turn: number; 
    turnMax: number; 
  };
  victory: {
    reputation: number;
    production: number;
    landmarks: number;
    turn: number;
    mode: 'reputation' | 'landmarks' | 'elimination' | 'infinite';
    value: number;
  };
  history: string[];
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  resources = { 
    coins: 0, 
    food: 0, 
    materials: 0, 
    population: 0, 
    coinsPerTurn: 0, 
    foodPerTurn: 0, 
    materialsPerTurn: 0, 
    populationStatus: '0' 
  }, 
  progress = { 
    reputation: 0, 
    reputationMax: 10, 
    production: 0, 
    productionMax: 1000, 
    landmarks: 0, 
    landmarksMax: 3, 
    turn: 1, 
    turnMax: 20 
  }, 
  victory = { 
    reputation: 0, 
    production: 0, 
    landmarks: 0, 
    turn: 1,
    mode: 'reputation',
    value: 10
  }, 
  history = [],
  isOpen = true,
  onToggle 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    resources: true,
    progress: true,
    victory: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

import { CoinsIconPNG, FoodsIconPNG, MaterialsIconPNG, PopulationIconPNG } from './IconComponentsPNG';

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'coins': return <CoinsIconPNG size={20} />;
      case 'food': return <FoodsIconPNG size={20} />;
      case 'materials': return <MaterialsIconPNG size={20} />;
      case 'population': return <PopulationIconPNG size={20} />;
      default: return <span className="text-lg">📊</span>;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'coins': return 'text-yellow-400';
      case 'food': return 'text-green-400';
      case 'materials': return 'text-orange-400';
      case 'population': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getProgressColor = (type: string) => {
    switch (type) {
      case 'reputation': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'production': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'landmarks': return 'bg-gradient-to-r from-yellow-500 to-amber-500';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  if (!isOpen) {
    return (
      <aside className="w-16 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 min-h-screen flex flex-col items-center py-4 space-y-4 relative z-30">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-10 h-10 p-0 bg-slate-800/50 hover:bg-slate-700/50 text-white hover:text-blue-400 transition-all duration-300"
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
      </aside>
    );
  }

  return (
    <aside className={`
      bg-surface border-r border-border z-30 h-[calc(100vh-4rem)] transition-all duration-300 fixed left-0 top-16
      ${isOpen ? 'w-80' : 'w-0 overflow-hidden'}
    `}>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.1),transparent_50%)]"></div>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-xl animate-pulse">👑</span>
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm opacity-30 animate-ping"></div>
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Famand
            </h2>
          </div>
          {onToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="w-8 h-8 p-0 bg-slate-700/50 hover:bg-slate-600/50 text-white hover:text-blue-400 transition-all duration-300"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        {/* Resources Section */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-white group-hover:text-blue-400 transition-colors duration-300">
                <div className="p-1 bg-blue-500/20 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                </div>
                Recursos
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('resources')}
                className="w-6 h-6 p-0 bg-slate-700/50 hover:bg-slate-600/50 text-white hover:text-blue-400 transition-all duration-300"
              >
                {expandedSections.resources ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {expandedSections.resources && (
            <CardContent className="pt-0 space-y-3">
              {[
                { key: 'coins', label: 'Moedas', value: resources?.coins || 0, perTurn: resources?.coinsPerTurn || 0 },
                { key: 'food', label: 'Comida', value: resources?.food || 0, perTurn: resources?.foodPerTurn || 0 },
                { key: 'materials', label: 'Materiais', value: resources?.materials || 0, perTurn: resources?.materialsPerTurn || 0 },
                { key: 'population', label: 'População', value: resources?.population || 0, perTurn: resources?.populationStatus || '0' }
              ].map((resource) => (
                <div key={resource.key} className="flex items-center justify-between p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 group/item">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="text-lg group-hover/item:scale-110 transition-transform duration-300">{getResourceIcon(resource.key)}</span>
                      <div className="absolute inset-0 bg-current rounded-full blur-sm opacity-20 group-hover/item:opacity-40 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-200">{resource.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-lg ${getResourceColor(resource.key)}`}>
                      {resource.value}
                    </span>
                    {resource.perTurn && (
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                        +{resource.perTurn}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Progress Section */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-white group-hover:text-emerald-400 transition-colors duration-300">
                <div className="p-1 bg-emerald-500/20 rounded-lg">
                  <Target className="w-4 h-4 text-emerald-400" />
                </div>
                Progresso
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('progress')}
                className="w-6 h-6 p-0 bg-slate-700/50 hover:bg-slate-600/50 text-white hover:text-emerald-400 transition-all duration-300"
              >
                {expandedSections.progress ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {expandedSections.progress && (
            <CardContent className="pt-0 space-y-4">
              {[
                { 
                  key: 'reputation', 
                  label: 'Reputação', 
                  current: progress?.reputation || 0, 
                  max: progress?.reputationMax || 10,
                  icon: '⭐'
                },
                { 
                  key: 'production', 
                  label: 'Produção Total', 
                  current: progress?.production || 0, 
                  max: progress?.productionMax || 1000,
                  icon: '⚙️'
                },
                { 
                  key: 'landmarks', 
                  label: 'Marcos Históricos', 
                  current: progress?.landmarks || 0, 
                  max: progress?.landmarksMax || 3,
                  icon: '🏛️'
                }
              ].map((item) => (
                <div key={item.key} className="space-y-2 p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="text-lg">{item.icon}</span>
                        <div className="absolute inset-0 bg-current rounded-full blur-sm opacity-20"></div>
                      </div>
                      <span className="text-sm font-medium text-slate-200">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {item.current}/{item.max}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={(item.current / item.max) * 100} 
                      className="h-3 bg-slate-600"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Victory Conditions Section */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-white group-hover:text-yellow-400 transition-colors duration-300">
                <div className="p-1 bg-yellow-500/20 rounded-lg">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                </div>
                Condições de Vitória
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('victory')}
                className="w-6 h-6 p-0 bg-slate-700/50 hover:bg-slate-600/50 text-white hover:text-yellow-400 transition-all duration-300"
              >
                {expandedSections.victory ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {expandedSections.victory && (
            <CardContent className="pt-0 space-y-3">
              {victory.mode === 'landmarks' && (
                <div key="landmarks" className="flex items-center justify-between p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 group/item">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="text-lg group-hover/item:scale-110 transition-transform duration-300">🏛️</span>
                      <div className="absolute inset-0 bg-current rounded-full blur-sm opacity-20 group-hover/item:opacity-40 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-sm text-slate-200">{victory.value} Marcos Históricos</span>
                  </div>
                  <Badge 
                    variant={victory.landmarks >= victory.value ? "default" : "secondary"}
                    className={`text-xs ${
                      victory.landmarks >= victory.value 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-slate-600/50 text-slate-300 border-slate-500/30'
                    }`}
                  >
                    {victory.landmarks}/{victory.value}
                  </Badge>
                </div>
              )}
              
              {victory.mode === 'reputation' && (
                <div key="reputation" className="flex items-center justify-between p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 group/item">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="text-lg group-hover/item:scale-110 transition-transform duration-300">⭐</span>
                      <div className="absolute inset-0 bg-current rounded-full blur-sm opacity-20 group-hover/item:opacity-40 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-sm text-slate-200">{victory.value} Reputação</span>
                  </div>
                  <Badge 
                    variant={victory.reputation >= victory.value ? "default" : "secondary"}
                    className={`text-xs ${
                      victory.reputation >= victory.value 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-slate-600/50 text-slate-300 border-slate-500/30'
                    }`}
                  >
                    {victory.reputation}/{victory.value}
                  </Badge>
                </div>
              )}
              
              {victory.mode === 'elimination' && (
                <div key="elimination" className="flex items-center justify-between p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 group/item">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="text-lg group-hover/item:scale-110 transition-transform duration-300">⏰</span>
                      <div className="absolute inset-0 bg-current rounded-full blur-sm opacity-20 group-hover/item:opacity-40 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-sm text-slate-200">Sobreviver 20 Turnos</span>
                  </div>
                  <Badge 
                    variant={victory.turn >= 20 ? "default" : "secondary"}
                    className={`text-xs ${
                      victory.turn >= 20 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-slate-600/50 text-slate-300 border-slate-500/30'
                    }`}
                  >
                    {victory.turn}/20
                  </Badge>
                </div>
              )}
              
              {victory.mode === 'infinite' && (
                <div key="infinite" className="flex items-center justify-between p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 group/item">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="text-lg group-hover/item:scale-110 transition-transform duration-300">∞</span>
                      <div className="absolute inset-0 bg-current rounded-full blur-sm opacity-20 group-hover/item:opacity-40 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-sm text-slate-200">Modo Infinito</span>
                  </div>
                  <Badge 
                    variant="secondary"
                    className="text-xs bg-slate-600/50 text-slate-300 border-slate-500/30"
                  >
                    Turno {victory.turn}
                  </Badge>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </aside>
  );
};

export default Sidebar; 