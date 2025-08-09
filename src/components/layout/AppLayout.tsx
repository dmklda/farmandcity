import React, { useState } from 'react';
import EnhancedTopBar from '../EnhancedTopBar';
import Sidebar from '../Sidebar';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  // TopBar props
  turn: number;
  turnMax: number;
  buildCount: number;
  buildMax: number;
  phase: string;
  onNextPhase: () => void;
  discardMode?: boolean;
  resources: {
    coins: number;
    food: number;
    materials: number;
    population: number;
  };
  productionPerTurn: {
    coins: number;
    food: number;
    materials: number;
    population: number;
  };
  productionDetails: {
    coins: string[];
    food: string[];
    materials: string[];
    population: string[];
  };
  // Sidebar props
  sidebarResources: {
    coins: number;
    food: number;
    materials: number;
    population: number;
    coinsPerTurn: number;
    foodPerTurn: number;
    materialsPerTurn: number;
    populationStatus: string;
  };
  progress: {
    reputation: number;
    reputationMax: number;
    production: number;
    productionMax: number;
    landmarks: number;
    landmarksMax: number;
    turn: number;
    turnMax: number;
  };
  victory: {
    reputation: number;
    production: number;
    landmarks: number;
    turn: number;
    mode: 'reputation' | 'landmarks' | 'elimination' | 'infinite';
    value: number;
  };
  history: string[];
  // Action handlers
  onShowStats?: () => void;
  onShowSavedGames?: () => void;
  onLogout?: () => void;
  onGoHome?: () => void;
  userEmail?: string;
  userName?: string;
  activeDeck?: {
    id: string;
    name: string;
    cards: any[];
  } | null;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  // TopBar props
  turn = 1,
  turnMax = 20,
  buildCount = 0,
  buildMax = 3,
  phase = 'draw',
  onNextPhase = () => {},
  discardMode = false,
  resources = { coins: 0, food: 0, materials: 0, population: 0 },
  productionPerTurn = { coins: 0, food: 0, materials: 0, population: 0 },
  productionDetails = { coins: [], food: [], materials: [], population: [] },
  // Sidebar props
  sidebarResources = { 
    coins: 0, 
    food: 0, 
    materials: 0, 
    population: 0, 
    coinsPerTurn: 0, 
    foodPerTurn: 0, 
    materialsPerTurn: 0, 
    populationStatus: '0' 
  },
  progress = { 
    reputation: 0, 
    reputationMax: 10, 
    production: 0, 
    productionMax: 1000, 
    landmarks: 0, 
    landmarksMax: 3, 
    turn: 1, 
    turnMax: 20 
  },
  victory = { 
    reputation: 0, 
    production: 0, 
    landmarks: 0, 
    turn: 1, 
    mode: 'reputation', 
    value: 0 
  },
  history = [],
  // Action handlers
  onShowStats,
  onShowSavedGames,
  onLogout,
  onGoHome,
  userEmail,
  userName,
  activeDeck
}) => {
  // Debug log para verificar se o activeDeck está chegando no AppLayout
  // // console.log('AppLayout - activeDeck:', activeDeck);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* TopBar - Fixed at top */}
      <EnhancedTopBar
        turn={turn}
        turnMax={turnMax}
        buildCount={buildCount}
        buildMax={buildMax}
        phase={phase}
        onNextPhase={onNextPhase}
        discardMode={discardMode}
        resources={resources}
        onToggleSidebar={toggleSidebar}
        productionPerTurn={productionPerTurn}
        productionDetails={productionDetails}
        onShowStats={onShowStats}
        onShowSavedGames={onShowSavedGames}
        onLogout={onLogout}
        onGoHome={onGoHome}
        userEmail={userEmail}
        userName={userName}
        activeDeck={activeDeck}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16"> {/* pt-16 accounts for fixed TopBar */}
        {/* Sidebar */}
        <Sidebar
          resources={sidebarResources}
          progress={progress}
          victory={victory}
          history={history}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 relative ${
          sidebarOpen ? 'ml-0' : 'ml-16'
        }`}>
          <div className="p-6 relative z-10">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Toggle (only visible on small screens) */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button
          onClick={toggleSidebar}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}; 
