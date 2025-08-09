"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Trophy, Sword, Shield, Star, Sparkles, Castle, X } from "lucide-react";
import confetti from "canvas-confetti";

interface MedievalVictoryModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  achievements?: string[];
  showConfetti?: boolean;
  onLoadGame?: () => void;
  onNewGame?: () => void;
  onGoHome?: () => void;
}

const useDimensions = (ref: React.RefObject<HTMLElement>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateDimensions = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    const debouncedUpdateDimensions = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 250);
    };

    updateDimensions();
    window.addEventListener('resize', debouncedUpdateDimensions);

    return () => {
      window.removeEventListener('resize', debouncedUpdateDimensions);
      clearTimeout(timeoutId);
    };
  }, [ref]);

  return dimensions;
};

const AnimatedGradient: React.FC<{
  colors: string[];
  speed?: number;
  blur?: "light" | "medium" | "heavy";
}> = ({ colors, speed = 5, blur = "light" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);

  const circleSize = Math.max(dimensions.width, dimensions.height);
  const blurClass = blur === "light" ? "blur-2xl" : blur === "medium" ? "blur-3xl" : "blur-[100px]";

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 ${blurClass}`}>
        {colors.map((color, index) => (
          <svg
            key={index}
            className="absolute animate-background-gradient"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 50}%`,
              "--background-gradient-speed": `${1 / speed}s`,
              "--tx-1": Math.random() - 0.5,
              "--ty-1": Math.random() - 0.5,
              "--tx-2": Math.random() - 0.5,
              "--ty-2": Math.random() - 0.5,
              "--tx-3": Math.random() - 0.5,
              "--ty-3": Math.random() - 0.5,
              "--tx-4": Math.random() - 0.5,
              "--ty-4": Math.random() - 0.5,
            } as React.CSSProperties}
            width={circleSize * (Math.random() * 0.5 + 0.5)}
            height={circleSize * (Math.random() * 0.5 + 0.5)}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="50"
              fill={color}
              className="opacity-30 dark:opacity-[0.15]"
            />
          </svg>
        ))}
      </div>
    </div>
  );
};

const MedievalVictoryModal: React.FC<MedievalVictoryModalProps> = ({
  isOpen = false,
  onClose = () => {},
  title = "VITÓRIA CONQUISTADA!",
  subtitle = "O castelo foi tomado com honra e glória!",
  achievements = [
    "Derrotou 50 inimigos",
    "Conquistou 3 territórios",
    "Coletou 1000 moedas de ouro",
    "Completou missão épica"
  ],
  showConfetti = true,
  onLoadGame,
  onNewGame,
  onGoHome
}) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      if (showConfetti) {
        // Trigger confetti
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        const randomInRange = (min: number, max: number) =>
          Math.random() * (max - min) + min;

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ["#FFD700", "#FFA500", "#FF6347", "#8B4513", "#DAA520"]
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ["#FFD700", "#FFA500", "#FF6347", "#8B4513", "#DAA520"]
          });
        }, 250);
      }
    }
  }, [isOpen, showConfetti]);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => onClose(), 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {showModal && (
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
        // Removido onClick para evitar fechamento acidental em vitórias reais
        // onClick={handleClose}
      />

          {/* Animated Background */}
          <AnimatedGradient
            colors={["#8B4513", "#DAA520", "#FFD700", "#FFA500", "#FF6347"]}
            speed={0.5}
            blur="heavy"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -30 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: 30 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.6
            }}
            className="relative w-full max-w-2xl mx-auto"
          >
            {/* Ornamental Border */}
            <div className="relative bg-gradient-to-br from-yellow-900 via-yellow-700 to-yellow-500 p-1 rounded-3xl shadow-2xl">
              <div className="bg-gradient-to-br from-amber-950 via-amber-900 to-amber-800 rounded-3xl p-8 relative overflow-hidden">
                


                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <div className="absolute top-4 left-4">
                    <Castle className="w-16 h-16 text-yellow-400" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Sword className="w-12 h-12 text-yellow-400 rotate-45" />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Shield className="w-14 h-14 text-yellow-400" />
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Crown className="w-12 h-12 text-yellow-400" />
                  </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8 relative z-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="flex justify-center mb-4"
                  >
                                      <div className="relative">
                    <Crown className="w-12 h-12 text-yellow-400 drop-shadow-lg" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-1 -right-1"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                    </motion.div>
                  </div>
                  </motion.div>

                  <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text mb-2 drop-shadow-lg"
                    style={{ fontFamily: "serif" }}
                  >
                    {title}
                  </motion.h1>

                  <motion.p
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-yellow-200 mb-4 font-medium"
                  >
                    {subtitle}
                  </motion.p>
                </div>

                {/* Trophy Section */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
                  className="flex justify-center mb-8"
                >
                  <div className="relative">
                    <Trophy className="w-16 h-16 text-yellow-400 drop-shadow-xl" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl"
                    />
                  </div>
                </motion.div>

                {/* Achievements */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-4 mb-8"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center space-x-2 bg-yellow-900/30 rounded-lg p-3 border border-yellow-600/30"
                      >
                        <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                        <span className="text-yellow-100 text-sm">{achievement}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex gap-3 justify-center">
                    {onLoadGame && (
                      <button
                        onClick={onLoadGame}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-amber-950 font-bold text-base rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-yellow-400"
                      >
                        🔄 Carregar Jogo
                      </button>
                    )}
                    
                    {onNewGame && (
                      <button
                        onClick={onNewGame}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-amber-950 font-bold text-base rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-yellow-400"
                      >
                        🆕 Novo Jogo
                      </button>
                    )}
                  </div>
                  
                  {onGoHome && (
                    <div className="flex justify-center">
                      <button
                        onClick={onGoHome}
                        className="px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold text-base rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-amber-500"
                      >
                        🏠 Voltar ao Menu
                      </button>
                    </div>
                  )}
                </motion.div>

                {/* Decorative Border Pattern */}
                <div className="absolute inset-0 rounded-3xl border-4 border-yellow-400/20 pointer-events-none" />
                <div className="absolute inset-2 rounded-2xl border-2 border-yellow-500/10 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MedievalVictoryModal;
