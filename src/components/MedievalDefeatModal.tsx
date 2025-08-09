"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import { Skull, Swords, Shield, Crown, X } from 'lucide-react';

function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(' ');
}

// Noise component for texture effects
function Noise({
  patternSize = 100,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 1,
  patternAlpha = 30,
  intensity = 0.8,
}) {
  const grainRef = useRef<HTMLCanvasElement>(null);
  const canvasCssSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;

    const patternCtx = patternCanvas.getContext('2d');
    if (!patternCtx) return;
    
    const patternData = patternCtx.createImageData(patternSize, patternSize);
    const patternPixelDataLength = patternSize * patternSize * 4;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      let newCssWidth = window.innerWidth;
      let newCssHeight = window.innerHeight;

      if (canvas.parentElement) {
        const parentRect = canvas.parentElement.getBoundingClientRect();
        newCssWidth = parentRect.width;
        newCssHeight = parentRect.height;
      }
      
      canvasCssSizeRef.current = { width: newCssWidth, height: newCssHeight };
      canvas.width = newCssWidth * dpr;
      canvas.height = newCssHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const updatePattern = () => {
      for (let i = 0; i < patternPixelDataLength; i += 4) {
        const value = Math.random() * 255 * intensity;
        patternData.data[i] = value;
        patternData.data[i + 1] = value;
        patternData.data[i + 2] = value;
        patternData.data[i + 3] = patternAlpha;
      }
      patternCtx.putImageData(patternData, 0, 0);
    };

    const drawGrain = () => {
      const { width: cssWidth, height: cssHeight } = canvasCssSizeRef.current;
      if (cssWidth === 0 || cssHeight === 0) return;

      ctx.clearRect(0, 0, cssWidth, cssHeight);
      ctx.save();
      
      const safePatternScaleX = Math.max(0.001, patternScaleX);
      const safePatternScaleY = Math.max(0.001, patternScaleY);
      ctx.scale(safePatternScaleX, safePatternScaleY);

      const fillPattern = ctx.createPattern(patternCanvas, 'repeat');
      if (fillPattern) {
        ctx.fillStyle = fillPattern;
        ctx.fillRect(0, 0, cssWidth / safePatternScaleX, cssHeight / safePatternScaleY);
      }
      
      ctx.restore();
    };

    let animationFrameId: number;
    const loop = () => {
      if (canvasCssSizeRef.current.width > 0 && canvasCssSizeRef.current.height > 0) {
        if (frame % patternRefreshInterval === 0) {
          updatePattern();
          drawGrain();
        }
      }
      frame++;
      animationFrameId = window.requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    resize();
    if (patternRefreshInterval > 0) {
      loop();
    } else {
      updatePattern();
      drawGrain();
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha, intensity]);

  return <canvas className="absolute inset-0 w-full h-full pointer-events-none" ref={grainRef} />;
}

// Gradient Background component
function GradientBackground({
  gradientType = 'radial-gradient',
  gradientSize = '125% 125%',
  gradientOrigin = 'center',
  colors = [
    { color: 'rgba(139,0,0,1)', stop: '0%' },
    { color: 'rgba(75,0,0,1)', stop: '30%' },
    { color: 'rgba(25,0,0,1)', stop: '70%' },
    { color: 'rgba(0,0,0,1)', stop: '100%' }
  ],
  enableNoise = true,
  noisePatternSize = 80,
  noisePatternScaleX = 1,
  noisePatternScaleY = 1,
  noisePatternRefreshInterval = 2,
  noisePatternAlpha = 40,
  noiseIntensity = 0.6,
  className = '',
  style = {},
  children,
  customGradient = null
}: {
  gradientType?: string;
  gradientSize?: string;
  gradientOrigin?: string;
  colors?: Array<{ color: string; stop: string }>;
  enableNoise?: boolean;
  noisePatternSize?: number;
  noisePatternScaleX?: number;
  noisePatternScaleY?: number;
  noisePatternRefreshInterval?: number;
  noisePatternAlpha?: number;
  noiseIntensity?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  customGradient?: string | null;
}) {
  const generateGradient = () => {
    if (customGradient) return customGradient;
    
    const getGradientPosition = (origin: string) => {
      const positions: Record<string, string> = {
        'center': '50% 50%',
        'top': '50% 0%',
        'bottom': '50% 100%',
        'left': '0% 50%',
        'right': '100% 50%'
      };
      return positions[origin] || positions['center'];
    };
    
    const position = getGradientPosition(gradientOrigin);
    const colorStops = colors.map(({ color, stop }) => `${color} ${stop}`).join(',');
    
    if (gradientType === 'radial-gradient') {
      return `radial-gradient(${gradientSize} at ${position},${colorStops})`;
    }
    
    return `${gradientType}(${colorStops})`;
  };

  const gradientStyle = {
    background: generateGradient(),
    ...style
  };

  return (
    <div 
      className={`absolute inset-0 w-full h-full ${className}`}
      style={gradientStyle}
    >
      {enableNoise && (
        <Noise
          patternSize={noisePatternSize}
          patternScaleX={noisePatternScaleX}
          patternScaleY={noisePatternScaleY}
          patternRefreshInterval={noisePatternRefreshInterval}
          patternAlpha={noisePatternAlpha}
          intensity={noiseIntensity}
        />
      )}
      {children}
    </div>
  );
}

// Medieval ornamental border component
function MedievalBorder({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Corner ornaments */}
      <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-red-400/60"></div>
      <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-red-400/60"></div>
      <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-red-400/60"></div>
      <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-red-400/60"></div>
      
      {/* Side decorations */}
      <div className="absolute top-1/2 left-0 w-1 h-16 bg-gradient-to-b from-red-600/40 to-transparent transform -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-1 h-16 bg-gradient-to-b from-red-600/40 to-transparent transform -translate-y-1/2"></div>
    </div>
  );
}

// Floating particles component
function FloatingParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => i);
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-red-400/30 rounded-full"
          initial={{
            x: Math.random() * 400,
            y: Math.random() * 300,
            opacity: 0
          }}
          animate={{
            y: [null, -20, 20, -10],
            opacity: [0, 0.6, 0.3, 0],
            scale: [0.5, 1, 0.8, 0.5]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

interface MedievalDefeatModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  description?: string;
  onLoadGame?: () => void;
  onNewGame?: () => void;
  onGoHome?: () => void;
}

// Main Medieval Defeat Modal component
function MedievalDefeatModal({
  isOpen = false,
  onClose = () => {},
  title = "DERROTA",
  subtitle = "Vossa batalha chegou ao fim",
  description = "Vosso castelo foi conquistado e vossas forças dispersas pelos ventos da guerra. A honra permanece, mas a vitória escapou de vossas mãos.",
  onLoadGame,
  onNewGame,
  onGoHome
}: MedievalDefeatModalProps) {
  const [showModal, setShowModal] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const controls = useAnimation();

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShowModal(false);
    // Removido auto-fechamento para permitir derrotas permanentes
    // setTimeout(() => onClose(), 300);
    onClose();
  };

  const containerVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    }
  };

  const iconVariants = {
    hidden: { 
      scale: 0,
      rotate: -180
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 500,
        damping: 20,
        delay: 0.5
      }
    }
  };

  const shakeVariants = {
    shake: {
      x: [-2, 2, -2, 2, 0],
      transition: {
        duration: 0.5,
        repeat: 2,
        delay: 1
      }
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(10px)" }}
    >
      {/* Background Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60"
        // Removido onClick para evitar fechamento acidental em derrotas reais
        // onClick={handleClose}
      />

      <motion.div
        variants={!shouldReduceMotion ? containerVariants : {}}
        initial={!shouldReduceMotion ? "hidden" : "visible"}
        animate="visible"
        exit="exit"
                 className="relative w-full max-w-2xl mx-auto"
      >
        {/* Background with gradient and noise */}
        <div className="relative bg-black/90 backdrop-blur-md rounded-lg border-2 border-red-900/50 shadow-2xl overflow-hidden">
          <GradientBackground
            colors={[
              { color: 'rgba(139,0,0,0.9)', stop: '0%' },
              { color: 'rgba(75,0,0,0.8)', stop: '40%' },
              { color: 'rgba(25,0,0,0.9)', stop: '80%' },
              { color: 'rgba(0,0,0,0.95)', stop: '100%' }
            ]}
            gradientOrigin="center"
            enableNoise={true}
            noiseIntensity={0.4}
            noisePatternSize={60}
          />
          
          {/* Medieval border ornaments */}
          <MedievalBorder />
          
          {/* Floating particles */}
          <FloatingParticles />
          
          {/* Content */}
          <div className="relative z-10 p-8 text-center">
            

            {/* Main skull icon */}
            <motion.div
              variants={!shouldReduceMotion ? iconVariants : {}}
              animate={!shouldReduceMotion ? ["visible", "shake"] : "visible"}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <Skull className="w-12 h-12 text-red-400 drop-shadow-lg" />
                <motion.div
                  animate={!shouldReduceMotion ? {
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 w-12 h-12 bg-red-500/20 rounded-full blur-xl"
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={!shouldReduceMotion ? itemVariants : {}}
                             className="text-2xl font-bold text-red-300 mb-2 font-serif tracking-wide"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={!shouldReduceMotion ? itemVariants : {}}
              className="text-lg text-red-200/80 mb-4 font-medium"
            >
              {subtitle}
            </motion.p>

            {/* Description */}
            <motion.p
              variants={!shouldReduceMotion ? itemVariants : {}}
              className="text-base text-red-300/90 mb-6 font-medium max-w-md mx-auto leading-relaxed"
            >
              {description}
            </motion.p>

            {/* Battle icons */}
            <motion.div
              variants={!shouldReduceMotion ? itemVariants : {}}
                             className="flex justify-center space-x-4 mb-4"
            >
              <motion.div
                animate={!shouldReduceMotion ? {
                  rotate: [0, -5, 5, 0],
                  y: [0, -2, 2, 0]
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                                 <Swords className="w-6 h-6 text-red-500/70" />
              </motion.div>
              
              <motion.div
                animate={!shouldReduceMotion ? {
                  rotate: [0, 3, -3, 0],
                  scale: [1, 0.95, 1.05, 1]
                } : {}}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                                 <Shield className="w-6 h-6 text-red-600/60" />
              </motion.div>
              
              <motion.div
                animate={!shouldReduceMotion ? {
                  rotate: [0, -3, 3, 0],
                  y: [0, 1, -1, 0]
                } : {}}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                                 <Crown className="w-6 h-6 text-red-400/50" />
              </motion.div>
            </motion.div>

            

                         {/* Action buttons */}
             <motion.div
               variants={!shouldReduceMotion ? itemVariants : {}}
               className="flex flex-col gap-3"
             >
               <div className="flex gap-3 justify-center">
                 {onLoadGame && (
                                       <motion.button
                      whileHover={!shouldReduceMotion ? { scale: 1.05 } : {}}
                      whileTap={!shouldReduceMotion ? { scale: 0.95 } : {}}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-base rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-red-400"
                      onClick={onLoadGame}
                    >
                      🔄 Carregar Jogo
                    </motion.button>
                 )}
                 
                 {onNewGame && (
                                       <motion.button
                      whileHover={!shouldReduceMotion ? { scale: 1.05 } : {}}
                      whileTap={!shouldReduceMotion ? { scale: 0.95 } : {}}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-base rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-red-400"
                      onClick={onNewGame}
                    >
                      🆕 Novo Jogo
                    </motion.button>
                 )}
               </div>
               
               {onGoHome && (
                 <div className="flex justify-center">
                                       <motion.button
                      whileHover={!shouldReduceMotion ? { scale: 1.05 } : {}}
                      whileTap={!shouldReduceMotion ? { scale: 0.95 } : {}}
                      className="px-6 py-3 bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white font-bold text-base rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-red-600"
                      onClick={onGoHome}
                    >
                      🏠 Voltar ao Menu
                    </motion.button>
                 </div>
               )}
             </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default MedievalDefeatModal;
