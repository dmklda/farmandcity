import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Crown, Gem, Scroll } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'achievement';
  title: string;
  message: string;
  icon?: React.ReactNode;
  duration?: number;
}

export const MedievalNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Simulated notifications for demo purposes
  useEffect(() => {
    const demoNotifications: Notification[] = [
      {
        id: '1',
        type: 'achievement',
        title: 'Nova Conquista!',
        message: 'Você desbloqueou "Primeiro Império"',
        icon: <Crown className="w-4 h-4 text-yellow-400" />,
        duration: 5000
      },
      {
        id: '2',
        type: 'success',
        title: 'Missão Completa',
        message: 'Missão diária concluída com sucesso!',
        icon: <CheckCircle className="w-4 h-4 text-green-400" />,
        duration: 4000
      },
      {
        id: '3',
        type: 'info',
        title: 'Novo Evento',
        message: 'Evento "Festival Medieval" começará em 2 horas',
        icon: <Scroll className="w-4 h-4 text-blue-400" />,
        duration: 6000
      }
    ];

    // Add notifications with delay
    demoNotifications.forEach((notification, index) => {
      setTimeout(() => {
        addNotification(notification);
      }, index * 2000);
    });
  }, []);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after duration
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30',
          icon: 'text-green-400',
          title: 'text-green-300',
          message: 'text-green-200/80'
        };
      case 'warning':
        return {
          container: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
          icon: 'text-yellow-400',
          title: 'text-yellow-300',
          message: 'text-yellow-200/80'
        };
      case 'achievement':
        return {
          container: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30',
          icon: 'text-purple-400',
          title: 'text-purple-300',
          message: 'text-purple-200/80'
        };
      default:
        return {
          container: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30',
          icon: 'text-blue-400',
          title: 'text-blue-300',
          message: 'text-blue-200/80'
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          title="Abrir notificações"
          className="group relative bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full p-3 hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-300 shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
          <Bell className="relative w-6 h-6 text-purple-300 group-hover:text-purple-200 transition-colors" />
          
          {/* Notification count badge */}
          {notifications.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white/20">
              {notifications.length}
            </div>
          )}
        </button>
      </div>

      {/* Notifications List */}
      {isOpen && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl blur-lg opacity-75"></div>
          <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-purple-500/30 rounded-2xl p-4 shadow-2xl min-w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Notificações
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                title="Fechar notificações"
                className="text-purple-300 hover:text-purple-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-8 h-8 text-purple-400/50 mx-auto mb-2" />
                  <p className="text-purple-200/60 text-sm">Nenhuma notificação</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const styles = getNotificationStyles(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`group relative ${styles.container} backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 hover:scale-105`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="relative flex items-start gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg blur-sm opacity-60"></div>
                          <div className="relative bg-gradient-to-r from-white/10 to-transparent p-2 rounded-lg border border-white/20">
                            {notification.icon || <Info className={`w-4 h-4 ${styles.icon}`} />}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-sm ${styles.title} mb-1`}>
                            {notification.title}
                          </h4>
                          <p className={`text-xs ${styles.message} leading-relaxed`}>
                            {notification.message}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => removeNotification(notification.id)}
                          title="Remover notificação"
                          className="text-purple-300/60 hover:text-purple-300 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="mt-4 pt-3 border-t border-purple-500/20">
                <button
                  onClick={() => setNotifications([])}
                  className="w-full text-center text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                >
                  Limpar todas
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="space-y-2">
        {notifications.slice(0, 3).map((notification) => {
          const styles = getNotificationStyles(notification.type);
          return (
            <div
              key={notification.id}
              className={`group relative ${styles.container} backdrop-blur-sm border rounded-xl p-4 transition-all duration-500 transform translate-x-full animate-slide-in`}
              style={{ animationDelay: '0.1s' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative flex items-start gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg blur-sm opacity-60"></div>
                  <div className="relative bg-gradient-to-r from-white/10 to-transparent p-2 rounded-lg border border-white/20">
                    {notification.icon || <Info className={`w-4 h-4 ${styles.icon}`} />}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm ${styles.title} mb-1`}>
                    {notification.title}
                  </h4>
                  <p className={`text-xs ${styles.message} leading-relaxed`}>
                    {notification.message}
                  </p>
                </div>
                
                                 <button
                   onClick={() => removeNotification(notification.id)}
                   title="Remover notificação"
                   className="text-purple-300/60 hover:text-purple-300 transition-colors"
                 >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
