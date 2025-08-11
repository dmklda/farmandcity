import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { X, AlertTriangle, Info, Wrench, Calendar, Megaphone, Bell } from 'lucide-react';
import { useGlobalAnnouncements, GlobalAnnouncement } from '../hooks/useGlobalAnnouncements';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalAnnouncementsProps {
  location: 'homepage' | 'game';
  maxVisible?: number;
  className?: string;
}

export const GlobalAnnouncements: React.FC<GlobalAnnouncementsProps> = ({
  location,
  maxVisible = 3,
  className = ''
}) => {
  const [markedAsViewed, setMarkedAsViewed] = useState<Set<string>>(new Set());
  const [markingInProgress, setMarkingInProgress] = useState(false);
  
  const {
    announcements,
    loading,
    error,
    markAsViewed,
    dismissAnnouncement
  } = useGlobalAnnouncements(location);

  // Marcar como visualizado quando o componente monta (apenas uma vez)
  useEffect(() => {
    const markAnnouncementsAsViewed = async () => {
      // Evitar múltiplas execuções simultâneas
      if (markingInProgress) return;
      
      const announcementsToMark = announcements.filter(announcement => 
        announcement.dismissible && !markedAsViewed.has(announcement.id)
      );
      
      if (announcementsToMark.length === 0) return;
      
      setMarkingInProgress(true);
      
      try {
        // Marcar todos os anúncios de uma vez para evitar múltiplas chamadas
        const promises = announcementsToMark.map(async (announcement) => {
          await markAsViewed(announcement.id);
          setMarkedAsViewed(prev => new Set([...prev, announcement.id]));
        });
        
        await Promise.all(promises);
      } catch (error) {
        console.error('Erro ao marcar anúncios como visualizados:', error);
      } finally {
        setMarkingInProgress(false);
      }
    };
    
    if (announcements.length > 0 && !loading && !markedAsViewed.size && !markingInProgress) {
      markAnnouncementsAsViewed();
    }
  }, [loading, announcements, markAsViewed, markedAsViewed, markingInProgress]);

  if (loading) {
    return null; // Não mostrar nada enquanto carrega
  }

  if (error) {
    console.error('Erro ao carregar anúncios globais:', error);
    return null;
  }

  if (announcements.length === 0) {
    return null;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'news': return <Megaphone className="w-4 h-4" />;
      case 'update': return <Bell className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getColorClasses = (color: string, priority: number) => {
    const baseColors = {
      red: 'from-red-600/20 to-red-800/20 border-red-500/40',
      green: 'from-green-600/20 to-green-800/20 border-green-500/40',
      blue: 'from-blue-600/20 to-blue-800/20 border-blue-500/40',
      purple: 'from-purple-600/20 to-purple-800/20 border-purple-500/40',
      orange: 'from-orange-600/20 to-orange-800/20 border-orange-500/40',
      yellow: 'from-yellow-600/20 to-yellow-800/20 border-yellow-500/40'
    };

    const colorClass = baseColors[color as keyof typeof baseColors] || baseColors.blue;
    
    // Adicionar intensidade baseada na prioridade
    if (priority >= 4) {
      return `${colorClass} shadow-lg shadow-red-500/20`;
    } else if (priority >= 3) {
      return `${colorClass} shadow-md`;
    }
    
    return colorClass;
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 4: return { label: 'Crítico', color: 'bg-red-600' };
      case 3: return { label: 'Alto', color: 'bg-orange-600' };
      case 2: return { label: 'Médio', color: 'bg-yellow-600' };
      case 1: return { label: 'Baixo', color: 'bg-green-600' };
      default: return { label: 'Baixo', color: 'bg-green-600' };
    }
  };

  const visibleAnnouncements = announcements.slice(0, maxVisible);

  return (
    <div className={`space-y-3 ${className}`}>
      <AnimatePresence>
        {visibleAnnouncements.map((announcement, index) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <Card className={`bg-gradient-to-r ${getColorClasses(announcement.color, announcement.priority)} border backdrop-blur-sm`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{announcement.icon}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white text-sm">
                          {announcement.title}
                        </h3>
                        <div className="flex gap-1">
                          <Badge className={`${getPriorityLabel(announcement.priority).color} text-white text-xs`}>
                            {getPriorityLabel(announcement.priority).label}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getTypeIcon(announcement.type)}
                            {announcement.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-200 text-sm leading-relaxed">
                        {announcement.message}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </span>
                        {announcement.end_date && (
                          <span>
                            Expira: {new Date(announcement.end_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {announcement.dismissible && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissAnnouncement(announcement.id)}
                      className="flex-shrink-0 h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}; 