import React from 'react';
import { useCards } from '../hooks/useCards';
import { Badge } from './ui/badge';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export const CardsStatus: React.FC = () => {
  const { cards, loading, error } = useCards();

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-surface-card border border-border rounded-lg p-3 shadow-lg z-50">
        <div className="flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Carregando cartas do servidor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-destructive/10 border border-destructive/20 rounded-lg p-3 shadow-lg z-50">
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>Erro ao carregar cartas</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-surface-card border border-border rounded-lg p-3 shadow-lg z-50">
      <div className="flex items-center gap-2 text-sm">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span>Cartas carregadas:</span>
        <Badge variant="secondary">{cards.length}</Badge>
      </div>
    </div>
  );
}; 