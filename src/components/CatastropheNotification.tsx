import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, AlertTriangle } from 'lucide-react';

interface CatastropheNotificationProps {
  name: string;
  description: string;
  effectType: string;
  onClose: () => void;
  duration?: number;
}

export const CatastropheNotification: React.FC<CatastropheNotificationProps> = ({
  name,
  description,
  effectType,
  onClose,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Aguarda a animação terminar
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getEffectIcon = (type: string) => {
    switch (type) {
      case 'resource_loss':
        return '💰';
      case 'production_reduction':
        return '📉';
      case 'population_loss':
        return '👥';
      case 'card_destruction':
        return '🗑️';
      case 'mixed':
        return '🌪️';
      default:
        return '⚠️';
    }
  };

  const getEffectColor = (type: string) => {
    switch (type) {
      case 'resource_loss':
        return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      case 'production_reduction':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-950/20';
      case 'population_loss':
        return 'border-purple-500 bg-purple-50 dark:bg-purple-950/20';
      case 'card_destruction':
        return 'border-gray-500 bg-gray-50 dark:bg-gray-950/20';
      case 'mixed':
        return 'border-red-600 bg-red-50 dark:bg-red-950/20';
      default:
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
    }
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-md w-full
        transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <Card className={`p-4 border-2 ${getEffectColor(effectType)} shadow-lg`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <span className="text-xl">{getEffectIcon(effectType)}</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <h3 className="font-bold text-red-900 dark:text-red-100">
                {name}
              </h3>
            </div>
            <p className="text-sm text-red-800 dark:text-red-200 mb-2">
              {description}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                Catástrofe Ativa
              </span>
              <div className="flex-1 h-1 bg-red-200 dark:bg-red-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}; 