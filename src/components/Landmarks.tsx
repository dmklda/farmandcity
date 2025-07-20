import React from 'react';
import { Card as CardType, Resources } from '../types/game';
import { Card } from './Card';
import { Crown, Trophy, Star } from 'lucide-react';

interface LandmarksProps {
  landmarks: CardType[];
  completedLandmarks: CardType[];
  resources: Resources;
  onLandmarkClick: (landmark: CardType) => void;
}

export const Landmarks: React.FC<LandmarksProps> = ({ 
  landmarks, 
  completedLandmarks, 
  resources,
  onLandmarkClick 
}) => {
  const canAffordLandmark = (landmark: CardType) => {
    return Object.entries(landmark.cost).every(([resource, cost]) => 
      resources[resource as keyof Resources] >= cost
    );
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
          <Crown className="w-6 h-6 text-white" />
        </div>
        Marcos Históricos
      </h3>
      
      {completedLandmarks.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Concluídos
          </h4>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {completedLandmarks.map((landmark) => (
              <div key={landmark.id} className="relative">
                <Card card={landmark} isPlayable={false} resources={resources} />
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <div className="bg-green-500 text-white rounded-full p-3 shadow-lg">
                    <Trophy className="w-6 h-6" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-1 shadow-lg animate-pulse">
                  <Star className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Star className="w-5 h-5" />
          Disponíveis
        </h4>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {landmarks.map((landmark) => (
            <Card
              key={landmark.id}
              card={landmark}
              isPlayable={canAffordLandmark(landmark)}
              resources={resources}
              showGlow={canAffordLandmark(landmark)}
              onClick={() => onLandmarkClick(landmark)}
            />
          ))}
          {landmarks.length === 0 && (
            <div className="text-gray-500 text-center py-8 w-full">
              <Crown className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Todos os marcos foram construídos!</p>
              <p className="text-sm">Parabéns pela conquista!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};