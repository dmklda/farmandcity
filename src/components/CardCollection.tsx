import React from 'react';
import { useAppContext } from '../contexts/AppContext';

interface CardCollectionProps {
  onClose: () => void;
}

export const CardCollection: React.FC<CardCollectionProps> = ({ onClose }) => {
  const { setCurrentView } = useAppContext();

  React.useEffect(() => {
    setCurrentView('collection');
  }, [setCurrentView]);

  return null; // A página será renderizada pelo AppRouter
}; 
