import React from 'react';
import { Resources } from '../types/game';
import { Coins, Apple, Hammer, Users, TrendingUp, Zap, Crown } from 'lucide-react';

interface ResourceBarProps {
  resources: Resources;
  previousResources?: Resources;
}

const ResourceItem: React.FC<{
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
  bgColor: string;
  change?: number;
}> = ({ icon, value, label, color, bgColor, change }) => (
  <div className={`${bgColor} rounded-2xl p-6 text-center relative overflow-hidden group hover:scale-110 transition-all duration-500 shadow-xl hover:shadow-2xl border-2 border-white/50`}>
    {/* Background gradient animation */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Shimmer effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
    
    <div className="relative z-10">
      <div className="flex items-center justify-center mb-2">
        <div className={`p-3 rounded-xl bg-white/30 ${color} shadow-lg`}>
          {icon}
        </div>
      </div>
      <div className={`font-bold text-3xl ${color} mb-2`}>
        {value}
        {change !== undefined && change !== 0 && (
          <span className={`ml-3 text-lg font-extrabold ${change > 0 ? 'text-green-600' : 'text-red-600'} animate-pulse`}>
            {change > 0 ? '+' : ''}{change}
          </span>
        )}
      </div>
      <div className="text-lg font-bold text-gray-700">{label}</div>
      
      {/* Trending indicator */}
      {change !== undefined && change > 0 && (
        <div className="absolute top-3 right-3">
          <TrendingUp className="w-6 h-6 text-green-500 animate-bounce" />
        </div>
      )}
    </div>
  </div>
);

export const ResourceBar: React.FC<ResourceBarProps> = ({ resources, previousResources }) => {
  const getChange = (current: number, previous?: number) => {
    if (previous === undefined) return undefined;
    return current - previous;
  };

  return (
    <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-xl p-6 mb-6 border border-gray-200">
      <h3 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Recursos do Império
        </span>
        <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ResourceItem
          icon={<Coins className="w-8 h-8" />}
          value={resources.coins}
          label="Moedas"
          color="text-yellow-600"
          bgColor="bg-gradient-to-br from-yellow-100 to-yellow-200"
          change={getChange(resources.coins, previousResources?.coins)}
        />
        <ResourceItem
          icon={<Apple className="w-8 h-8" />}
          value={resources.food}
          label="Comida"
          color="text-green-600"
          bgColor="bg-gradient-to-br from-green-100 to-green-200"
          change={getChange(resources.food, previousResources?.food)}
        />
        <ResourceItem
          icon={<Hammer className="w-8 h-8" />}
          value={resources.materials}
          label="Materiais"
          color="text-blue-600"
          bgColor="bg-gradient-to-br from-blue-100 to-blue-200"
          change={getChange(resources.materials, previousResources?.materials)}
        />
        <ResourceItem
          icon={<Users className="w-8 h-8" />}
          value={resources.population}
          label="População"
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-100 to-purple-200"
          change={getChange(resources.population, previousResources?.population)}
        />
      </div>
    </div>
  );
};