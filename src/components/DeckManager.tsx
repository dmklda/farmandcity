import React from 'react';
import { useAppContext } from '../contexts/AppContext';

interface DeckManagerProps {
  onClose: () => void;
}

export const DeckManager: React.FC<DeckManagerProps> = ({ onClose }) => {
  const { setCurrentView } = useAppContext();

  React.useEffect(() => {
    setCurrentView('decks');
  }, [setCurrentView]);

  return null; // A página será renderizada pelo AppRouter
}; 
