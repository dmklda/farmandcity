import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import HomePage from '../pages/HomePage';
import ShopPage from '../pages/ShopPage';
import CollectionPage from '../pages/CollectionPage';
import MissionsPage from '../pages/MissionsPage';
import DecksPage from '../pages/DecksPage';
import GamePage from '../pages/GamePage';
import GameModePage from '../pages/GameModePage';
import { SettingsPage } from '../pages/SettingsPage';

const AppRouter: React.FC = () => {
  const { currentView } = useAppContext();

  // // console.log('AppRouter: renderizando view:', currentView);

  switch (currentView) {
    case 'home':
      return <HomePage />;
    case 'shop':
      return <ShopPage />;
    case 'collection':
      return <CollectionPage />;
    case 'missions':
      return <MissionsPage />;
    case 'decks':
      return <DecksPage />;
    case 'gameMode':
      return <GameModePage />;
    case 'game':
      return <GamePage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <HomePage />;
  }
};

export default AppRouter; 
