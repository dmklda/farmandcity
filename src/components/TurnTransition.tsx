import React, { useEffect } from 'react';

interface TurnTransitionProps {
  isVisible: boolean;
  turnNumber: number;
  onAnimationComplete: () => void;
}

export const TurnTransition: React.FC<TurnTransitionProps> = ({
  isVisible,
  turnNumber,
  onAnimationComplete
}) => {
  useEffect(() => {
    if (isVisible) {
      // Auto-hide after 2 seconds
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl text-white text-center animate-bounce">
        <div className="text-6xl mb-4">🎲</div>
        <div className="text-4xl font-bold mb-2">Turno {turnNumber}</div>
        <div className="text-xl opacity-90">Preparando...</div>
        
        {/* Animações de partículas */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 