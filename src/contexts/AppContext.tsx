import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePlayerCurrency } from '../hooks/usePlayerCurrency';
import { usePlayerCards } from '../hooks/usePlayerCards';
import { usePlayerDecks } from '../hooks/usePlayerDecks';

interface AppContextType {
  // Estado do usuário
  user: any;
  loading: boolean;
  
  // Estado das moedas
  currency: any;
  currencyLoading: boolean;
  refreshCurrency: () => Promise<void>;
  spendCoins: (amount: number) => Promise<void>;
  spendGems: (amount: number) => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  addGems: (amount: number) => Promise<void>;
  
  // Estado das cartas
  playerCards: any[];
  cardsLoading: boolean;
  refreshPlayerCards: () => Promise<void>;
  addCardToPlayer: (cardId: string, quantity?: number) => Promise<void>;
  
  // Estado dos decks
  decks: any[];
  decksLoading: boolean;
  
  // Estado da aplicação
  currentView: 'home' | 'game' | 'gameMode' | 'collection' | 'shop' | 'missions' | 'decks' | 'settings';
  setCurrentView: (view: 'home' | 'game' | 'gameMode' | 'collection' | 'shop' | 'missions' | 'decks' | 'settings') => void;
  
  // Funções de logout
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { 
    currency, 
    loading: currencyLoading, 
    refresh: refreshCurrency,
    spendCoins,
    spendGems,
    addCoins,
    addGems
  } = usePlayerCurrency();
  const { 
    playerCards, 
    loading: cardsLoading, 
    refresh: refreshPlayerCards,
    addCardToPlayer
  } = usePlayerCards();
  const { decks, loading: decksLoading } = usePlayerDecks();
  
  // Inicializar currentView do localStorage ou usar 'home' como padrão
  const [currentView, setCurrentViewState] = useState<'home' | 'game' | 'gameMode' | 'collection' | 'shop' | 'missions' | 'decks' | 'settings'>(() => {
    const savedView = localStorage.getItem('famand_currentView');
    return (savedView as 'home' | 'game' | 'gameMode' | 'collection' | 'shop' | 'missions' | 'decks' | 'settings') || 'home';
  });

  // Função para atualizar currentView e salvar no localStorage
  const setCurrentView = (view: 'home' | 'game' | 'gameMode' | 'collection' | 'shop' | 'missions' | 'decks' | 'settings') => {
    setCurrentViewState(view);
    localStorage.setItem('famand_currentView', view);
    // // console.log('Navegação alterada para:', view);
  };

  // Log para debug
  useEffect(() => {
    console.log('AppContext: currency atualizado:', currency);
  }, [currency]);

  useEffect(() => {
    console.log('AppContext: playerCards atualizado:', playerCards?.length);
  }, [playerCards]);

  // Log quando currentView muda
  useEffect(() => {
    console.log('AppContext: currentView atualizado:', currentView);
  }, [currentView]);

  // Debug hook states
  useEffect(() => {
    console.log('AppContext: Hook states:', {
      authLoading,
      currencyLoading,
      cardsLoading,
      decksLoading,
      user: !!user
    });
  }, [authLoading, currencyLoading, cardsLoading, decksLoading, user]);

  const value: AppContextType = {
    user: user || null,
    loading: authLoading || false,
    currency: currency || null,
    currencyLoading: currencyLoading || false,
    refreshCurrency: refreshCurrency || (() => Promise.resolve()),
    spendCoins: spendCoins || (() => Promise.resolve()),
    spendGems: spendGems || (() => Promise.resolve()),
    addCoins: addCoins || (() => Promise.resolve()),
    addGems: addGems || (() => Promise.resolve()),
    playerCards: playerCards || [],
    cardsLoading: cardsLoading || false,
    refreshPlayerCards: refreshPlayerCards || (() => Promise.resolve()),
    addCardToPlayer: addCardToPlayer || (() => Promise.resolve()),
    decks: decks || [],
    decksLoading: decksLoading || false,
    currentView,
    setCurrentView,
    signOut: signOut || (() => Promise.resolve()),
  };

  // Show loading state while hooks are initializing
  // Only show loading if user is authenticated and hooks are still loading
  if (user && (authLoading || currencyLoading || cardsLoading || decksLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
          <span className="text-amber-500">Carregando...</span>
        </div>
      </div>
    );
  }

  // If no user, don't show loading state - let AuthGuard handle it
  if (!user) {
    return (
      <AppContext.Provider value={value}>
        {children}
      </AppContext.Provider>
    );
  }

  // Ensure all hooks are fully initialized before rendering children
  if (authLoading || currencyLoading || cardsLoading || decksLoading) {
    return (
      <AppContext.Provider value={value}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
            <span className="text-amber-500">Carregando...</span>
          </div>
        </div>
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 
