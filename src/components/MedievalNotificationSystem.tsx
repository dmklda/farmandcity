import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dice1, 
  Dice2, 
  Dice3, 
  Dice4, 
  Dice5, 
  Dice6,
  Coins,
  Scroll,
  Crown,
  X,
  Sword,
  Shield,
  Gem,
  AlertCircle,
  CheckCircle,
  Info,
  Zap,
  Leaf,
  Building2,
  Landmark
} from 'lucide-react';
import { cn } from '../lib/utils';

// Types
type NotificationType = 'dice' | 'production' | 'card-discarded' | 'victory' | 'error' | 'info' | 'action' | 'resource' | 'landmark' | 'city' | 'farm' | 'event';

interface MedievalNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  duration?: number;
  data?: any;
}

interface NotificationSystemProps {
  maxNotifications?: number;
  defaultDuration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

// Particles Component
interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map((char) => char + char).join("");
  }
  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 30,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffd700",
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [color]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = () => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const rgb = hexToRgb(color);

  const drawCircle = (circle: any, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle: any, i: number) => {
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.alpha += 0.02;
      if (circle.alpha > circle.targetAlpha) {
        circle.alpha = circle.targetAlpha;
      }

      drawCircle(circle, true);

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(newCircle);
      }
    });
    window.requestAnimationFrame(animate);
  };

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};

// Notification Icons
const getNotificationIcon = (type: NotificationType, diceValue?: number) => {
  const iconClass = "w-6 h-6";
  
  switch (type) {
    case 'dice':
      const DiceIcon = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][Math.min((diceValue || 1) - 1, 5)];
      return <DiceIcon className={iconClass} />;
    case 'production':
      return <Coins className={iconClass} />;
    case 'card-discarded':
      return <Scroll className={iconClass} />;
    case 'victory':
      return <Crown className={iconClass} />;
    case 'error':
      return <AlertCircle className={iconClass} />;
    case 'info':
      return <Info className={iconClass} />;
    case 'action':
      return <Zap className={iconClass} />;
    case 'resource':
      return <Gem className={iconClass} />;
    case 'landmark':
      return <Landmark className={iconClass} />;
    case 'city':
      return <Building2 className={iconClass} />;
    case 'farm':
      return <Leaf className={iconClass} />;
    case 'event':
      return <Zap className={iconClass} />;
    default:
      return <Sword className={iconClass} />;
  }
};

// Notification Colors
const getNotificationColors = (type: NotificationType) => {
  switch (type) {
    case 'dice':
      return {
        bg: 'bg-gradient-to-br from-purple-900/90 to-indigo-900/90',
        border: 'border-purple-500/50',
        glow: 'shadow-purple-500/20',
        icon: 'text-purple-300',
        title: 'text-purple-100',
        message: 'text-purple-200',
        particles: '#9333ea'
      };
    case 'production':
      return {
        bg: 'bg-gradient-to-br from-amber-900/90 to-yellow-900/90',
        border: 'border-amber-500/50',
        glow: 'shadow-amber-500/20',
        icon: 'text-amber-300',
        title: 'text-amber-100',
        message: 'text-amber-200',
        particles: '#f59e0b'
      };
    case 'card-discarded':
      return {
        bg: 'bg-gradient-to-br from-slate-900/90 to-gray-900/90',
        border: 'border-slate-500/50',
        glow: 'shadow-slate-500/20',
        icon: 'text-slate-300',
        title: 'text-slate-100',
        message: 'text-slate-200',
        particles: '#64748b'
      };
    case 'victory':
      return {
        bg: 'bg-gradient-to-br from-emerald-900/90 to-green-900/90',
        border: 'border-emerald-500/50',
        glow: 'shadow-emerald-500/20',
        icon: 'text-emerald-300',
        title: 'text-emerald-100',
        message: 'text-emerald-200',
        particles: '#10b981'
      };
    case 'error':
      return {
        bg: 'bg-gradient-to-br from-red-900/90 to-rose-900/90',
        border: 'border-red-500/50',
        glow: 'shadow-red-500/20',
        icon: 'text-red-300',
        title: 'text-red-100',
        message: 'text-red-200',
        particles: '#ef4444'
      };
    case 'info':
      return {
        bg: 'bg-gradient-to-br from-blue-900/90 to-cyan-900/90',
        border: 'border-blue-500/50',
        glow: 'shadow-blue-500/20',
        icon: 'text-blue-300',
        title: 'text-blue-100',
        message: 'text-blue-200',
        particles: '#3b82f6'
      };
    case 'action':
      return {
        bg: 'bg-gradient-to-br from-orange-900/90 to-red-900/90',
        border: 'border-orange-500/50',
        glow: 'shadow-orange-500/20',
        icon: 'text-orange-300',
        title: 'text-orange-100',
        message: 'text-orange-200',
        particles: '#f97316'
      };
    case 'resource':
      return {
        bg: 'bg-gradient-to-br from-yellow-900/90 to-amber-900/90',
        border: 'border-yellow-500/50',
        glow: 'shadow-yellow-500/20',
        icon: 'text-yellow-300',
        title: 'text-yellow-100',
        message: 'text-yellow-200',
        particles: '#eab308'
      };
    case 'landmark':
      return {
        bg: 'bg-gradient-to-br from-violet-900/90 to-purple-900/90',
        border: 'border-violet-500/50',
        glow: 'shadow-violet-500/20',
        icon: 'text-violet-300',
        title: 'text-violet-100',
        message: 'text-violet-200',
        particles: '#8b5cf6'
      };
    case 'city':
      return {
        bg: 'bg-gradient-to-br from-sky-900/90 to-blue-900/90',
        border: 'border-sky-500/50',
        glow: 'shadow-sky-500/20',
        icon: 'text-sky-300',
        title: 'text-sky-100',
        message: 'text-sky-200',
        particles: '#0ea5e9'
      };
    case 'farm':
      return {
        bg: 'bg-gradient-to-br from-green-900/90 to-emerald-900/90',
        border: 'border-green-500/50',
        glow: 'shadow-green-500/20',
        icon: 'text-green-300',
        title: 'text-green-100',
        message: 'text-green-200',
        particles: '#22c55e'
      };
    case 'event':
      return {
        bg: 'bg-gradient-to-br from-pink-900/90 to-rose-900/90',
        border: 'border-pink-500/50',
        glow: 'shadow-pink-500/20',
        icon: 'text-pink-300',
        title: 'text-pink-100',
        message: 'text-pink-200',
        particles: '#ec4899'
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-gray-900/90 to-slate-900/90',
        border: 'border-gray-500/50',
        glow: 'shadow-gray-500/20',
        icon: 'text-gray-300',
        title: 'text-gray-100',
        message: 'text-gray-200',
        particles: '#6b7280'
      };
  }
};

// Individual Notification Component
interface NotificationItemProps {
  notification: MedievalNotification;
  onRemove: (id: string) => void;
  index: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onRemove, 
  index 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(notification.duration || 5000);
  const colors = getNotificationColors(notification.type);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          setIsVisible(false);
          setTimeout(() => onRemove(notification.id), 300);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [notification.id, onRemove]);

  const progressPercentage = ((notification.duration || 5000) - timeLeft) / (notification.duration || 5000) * 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            delay: index * 0.1 
          }}
          className={cn(
            "relative overflow-hidden rounded-lg border backdrop-blur-sm",
            "shadow-lg transform-gpu",
            colors.bg,
            colors.border,
            colors.glow
          )}
          style={{
            boxShadow: `0 10px 25px -5px ${colors.glow.replace('shadow-', '').replace('/20', '')}20, 0 4px 6px -2px ${colors.glow.replace('shadow-', '').replace('/20', '')}10`
          }}
        >
          {/* Particles Effect */}
          <Particles
            className="absolute inset-0"
            quantity={15}
            color={colors.particles}
            size={0.3}
          />

          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-1 bg-black/20 w-full">
            <motion.div
              className="h-full bg-gradient-to-r from-white/60 to-white/80"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-4 flex items-start gap-3">
            {/* Icon */}
            <div className={cn(
              "flex-shrink-0 p-2 rounded-full",
              "bg-black/20 backdrop-blur-sm",
              colors.icon
            )}>
              {getNotificationIcon(notification.type, notification.data?.diceValue)}
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h4 className={cn("font-bold text-sm mb-1", colors.title)}>
                {notification.title}
              </h4>
              <p className={cn("text-xs leading-relaxed", colors.message)}>
                {notification.message}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-xs opacity-60">
                  <Sword className="w-3 h-3" />
                  <span>{new Date(notification.timestamp).toLocaleTimeString()}</span>
                </div>
                {notification.data?.value && (
                  <div className="flex items-center gap-1 text-xs">
                    <Gem className="w-3 h-3" />
                    <span>{notification.data.value}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onRemove(notification.id), 300);
              }}
              className={cn(
                "flex-shrink-0 p-1 rounded-full transition-colors",
                "hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50",
                colors.icon
              )}
              title="Fechar notificação"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 right-0 w-16 h-16 opacity-10">
            <Shield className="w-full h-full" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Notification Context
interface NotificationContextType {
  addNotification: (type: NotificationType, title: string, message: string, data?: any, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

// Notification queue for notifications sent before context is ready
let notificationQueue: Array<{
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  duration?: number;
}> = [];

// Main Notification System
export const MedievalNotificationSystem: React.FC<NotificationSystemProps> = ({
  maxNotifications = 5,
  defaultDuration = 5000,
  position = 'top-right'
}) => {
  const [notifications, setNotifications] = useState<MedievalNotification[]>([]);

  const addNotification = useCallback((
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
    duration?: number
  ) => {
    const notification: MedievalNotification = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
      timestamp: new Date(),
      duration: duration || defaultDuration,
      data
    };

    console.log('🔔 Adicionando notificação:', { type, title, message });

    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      return newNotifications.slice(0, maxNotifications);
    });
  }, [maxNotifications, defaultDuration]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Process queued notifications when component mounts
  useEffect(() => {
    if (notificationQueue.length > 0) {
      console.log('🔔 Processando notificações enfileiradas:', notificationQueue.length);
      notificationQueue.forEach(({ type, title, message, data, duration }) => {
        addNotification(type, title, message, data, duration);
      });
      notificationQueue = [];
    }
  }, [addNotification]);

  // Position classes
  const positionClasses = {
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  // Expose addNotification globally and provide context
  useEffect(() => {
    (window as any).medievalNotify = addNotification;
    return () => {
      delete (window as any).medievalNotify;
    };
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      <div className={cn(
        "fixed z-50 flex flex-col gap-3 w-80 max-w-sm",
        positionClasses[position]
      )}>
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
            index={index}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Hook para usar o sistema de notificações
export const useMedievalNotifications = () => {
  const context = useContext(NotificationContext);

  const notify = useCallback((
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
    duration?: number
  ) => {
    console.log('🔔 Tentando enviar notificação:', { type, title, message });
    
    // Try context first (preferred method)
    if (context?.addNotification) {
      console.log('🔔 Enviando via context');
      context.addNotification(type, title, message, data, duration);
      return;
    }

    // Fallback to global method
    if ((window as any).medievalNotify) {
      console.log('🔔 Enviando via window global');
      (window as any).medievalNotify(type, title, message, data, duration);
      return;
    }

    // Queue notification if neither is available
    console.log('🔔 Enfileirando notificação para depois');
    notificationQueue.push({ type, title, message, data, duration });
  }, [context]);

  return { notify };
};
