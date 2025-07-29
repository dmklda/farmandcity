import React from 'react';
import { VictoryCondition, ComplexVictorySystem } from '../types/gameState';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface VictoryProgressProps {
  victorySystem: ComplexVictorySystem;
}

export const VictoryProgress: React.FC<VictoryProgressProps> = ({ victorySystem }) => {
  const majorConditions = victorySystem.conditions.filter(c => c.type === 'major');
  const minorConditions = victorySystem.conditions.filter(c => c.type === 'minor');
  
  const majorCompleted = majorConditions.filter(c => c.completed).length;
  const minorCompleted = minorConditions.filter(c => c.completed).length;
  
  const majorProgress = (majorCompleted / victorySystem.requiredMajor) * 100;
  const minorProgress = (minorCompleted / victorySystem.requiredMinor) * 100;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'reputation': return '⭐';
      case 'landmarks': return '🏛️';
      case 'resources': return '💰';
      case 'production': return '⚙️';
      case 'diversity': return '🌈';
      case 'survival': return '⏰';
      default: return '🎯';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reputation': return 'bg-yellow-500';
      case 'landmarks': return 'bg-purple-500';
      case 'resources': return 'bg-green-500';
      case 'production': return 'bg-blue-500';
      case 'diversity': return 'bg-pink-500';
      case 'survival': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const renderCondition = (condition: VictoryCondition) => {
    const progress = Math.min((condition.current / condition.target) * 100, 100);
    const isCompleted = condition.completed;
    
    return (
      <div 
        key={condition.id} 
        className={`p-3 rounded-lg border transition-all duration-300 ${
          isCompleted 
            ? 'bg-green-50 border-green-200 shadow-sm' 
            : 'bg-white border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCategoryIcon(condition.category)}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              condition.type === 'major' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {condition.type === 'major' ? 'Maior' : 'Menor'}
            </span>
            {isCompleted && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ✓ Completa
              </Badge>
            )}
          </div>
          <span className={`text-sm font-medium ${
            isCompleted ? 'text-green-600' : 'text-gray-600'
          }`}>
            {condition.current}/{condition.target}
          </span>
        </div>
        
        <h4 className={`font-medium mb-1 ${
          isCompleted ? 'text-green-800' : 'text-gray-800'
        }`}>
          {condition.name}
        </h4>
        
        <p className="text-sm text-gray-600 mb-2">
          {condition.description}
        </p>
        
        <Progress 
          value={progress} 
          className={`h-2 ${
            isCompleted ? 'bg-green-100' : 'bg-gray-100'
          }`}
        />
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 Sistema de Vitória Complexo
        </CardTitle>
        <div className="text-sm text-gray-600">
          Complete {victorySystem.requiredMajor} vitórias maiores e {victorySystem.requiredMinor} vitória menor
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progresso Geral */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Vitórias Maiores: {majorCompleted}/{victorySystem.requiredMajor}</span>
            <span className="text-purple-600 font-medium">{Math.round(majorProgress)}%</span>
          </div>
          <Progress value={majorProgress} className="h-3 bg-purple-100" />
          
          <div className="flex justify-between text-sm">
            <span>Vitórias Menores: {minorCompleted}/{victorySystem.requiredMinor}</span>
            <span className="text-blue-600 font-medium">{Math.round(minorProgress)}%</span>
          </div>
          <Progress value={minorProgress} className="h-3 bg-blue-100" />
        </div>

        {/* Vitórias Maiores */}
        <div>
          <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            🏆 Vitórias Maiores ({majorCompleted}/{victorySystem.requiredMajor})
          </h3>
          <div className="grid gap-3">
            {majorConditions.map(renderCondition)}
          </div>
        </div>

        {/* Vitórias Menores */}
        <div>
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            ⭐ Vitórias Menores ({minorCompleted}/{victorySystem.requiredMinor})
          </h3>
          <div className="grid gap-3">
            {minorConditions.map(renderCondition)}
          </div>
        </div>

        {/* Status Final */}
        {victorySystem.victoryAchieved && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 font-semibold">
              🎉 VITÓRIA COMPLETA!
            </div>
            <p className="text-green-700 text-sm mt-1">
              Todas as condições necessárias foram atendidas!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 