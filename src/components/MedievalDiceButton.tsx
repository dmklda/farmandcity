import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dice1, Sparkles } from 'lucide-react';

interface MedievalDiceButtonProps {
  onDiceRoll: () => void;
  diceUsed: boolean;
  diceResult?: number;
  disabled?: boolean;
  currentPhase?: string;
}

const MedievalDiceButton: React.FC<MedievalDiceButtonProps> = ({
  onDiceRoll,
  diceUsed,
  diceResult,
  disabled = false,
  currentPhase = 'action'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipDirection, setTooltipDirection] = useState<'up' | 'down'>('up');

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    
    // Calcular posição do tooltip baseado na posição do mouse
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = 200; // Largura estimada do tooltip
    const tooltipHeight = 50; // Altura estimada do tooltip
    
    let x = rect.left + rect.width / 2 - tooltipWidth / 2;
    let y;
    let direction: 'up' | 'down' = 'up';
    
    // Verificar se cabe em cima
    if (rect.top > tooltipHeight + 20) {
      y = rect.top - tooltipHeight - 8;
      direction = 'up';
    } else {
      // Se não couber em cima, colocar embaixo
      y = rect.bottom + 8;
      direction = 'down';
    }
    
    // Ajustar horizontalmente se estiver saindo da tela
    if (x < 10) x = 10;
    if (x + tooltipWidth > window.innerWidth - 10) x = window.innerWidth - tooltipWidth - 10;
    
    setTooltipPosition({ x, y });
    setTooltipDirection(direction);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    if (!isClickable) return; // Não fazer nada se não for clicável
    setIsPressed(true);
    onDiceRoll();
    setTimeout(() => setIsPressed(false), 200);
  };

  const getDiceColor = () => {
    if (disabled || diceUsed || currentPhase !== 'build') return 'from-stone-600 to-stone-800';
    if (isHovered) return 'from-amber-500 to-amber-700';
    return 'from-amber-600 to-amber-800';
  };

  const getDiceGlow = () => {
    if (disabled || diceUsed || currentPhase !== 'build') return 'shadow-stone-600/20';
    if (isHovered) return 'shadow-amber-500/40';
    return 'shadow-amber-600/30';
  };

  const getTooltipText = () => {
    if (currentPhase !== 'build') return 'Aguarde a fase de construção';
    if (diceUsed) return 'Dado já usado neste turno';
    if (disabled) return 'Dado indisponível';
    return 'Rolar dado na fase de construção';
  };

  const getTooltipContent = () => {
    const text = getTooltipText();
    // Se o texto for muito longo, quebrar em duas linhas
    if (text.length > 30) {
      const words = text.split(' ');
      const mid = Math.ceil(words.length / 2);
      return (
        <div className="text-center">
          <div>{words.slice(0, mid).join(' ')}</div>
          <div>{words.slice(mid).join(' ')}</div>
        </div>
      );
    }
    return text;
  };

  const isClickable = !disabled && !diceUsed && currentPhase === 'build';

  return (
    <motion.div
      className="relative"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Background glow */}
      <motion.div
        className={`absolute inset-0 rounded-full blur-md ${getDiceGlow()}`}
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.6 : 0.3,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      {/* Main button */}
      <motion.button
        className={`
          relative w-16 h-16 rounded-full 
          bg-gradient-to-br ${getDiceColor()}
          border-2 border-amber-400/50
          shadow-lg shadow-black/30
          flex items-center justify-center
          transition-all duration-200
          ${!isClickable ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-105'}
        `}
        whileHover={isClickable ? { scale: 1.05, y: -2 } : {}}
        whileTap={isClickable ? { scale: 0.95, y: 0 } : {}}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        disabled={false} // Sempre permitir eventos de mouse para tooltip
      >
        {/* Inner glow effect */}
        <motion.div
          className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-300/20 to-transparent"
          animate={{
            opacity: isHovered ? 0.8 : 0.4,
          }}
        />

        {/* Dice icon */}
        <motion.div
          className="relative z-10"
          animate={{
            rotate: isPressed ? [0, 360] : 0,
            scale: isPressed ? 1.2 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {diceResult && currentPhase === 'build' ? (
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-100">{diceResult}</div>
              <div className="text-xs text-amber-200">Resultado</div>
            </div>
          ) : (
            <Dice1 className="w-8 h-8 text-amber-100" />
          )}
        </motion.div>

        {/* Sparkle effects */}
        {isHovered && isClickable && (
          <>
            <motion.div
              className="absolute -top-1 -right-1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </motion.div>
            <motion.div
              className="absolute -bottom-1 -left-1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </motion.div>
          </>
        )}

        {/* Status indicator */}
        {diceUsed && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          />
        )}
      </motion.button>

      {/* Tooltip - positioned to stay on screen */}
      {isHovered && (
        <div
          className="fixed px-3 py-2 bg-stone-900 text-amber-100 text-xs rounded-lg border border-amber-600/50 z-50 shadow-lg"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            whiteSpace: 'nowrap',
            maxWidth: '200px'
          }}
        >
          {getTooltipContent()}
          {/* Seta do tooltip */}
          <div 
            className={`absolute w-0 h-0 border-l-4 border-r-4 border-transparent ${
              tooltipDirection === 'up' 
                ? 'border-t-4 border-t-stone-900' 
                : 'border-b-4 border-b-stone-900'
            }`}
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              [tooltipDirection === 'up' ? 'top' : 'bottom']: '100%'
            }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default MedievalDiceButton; 
