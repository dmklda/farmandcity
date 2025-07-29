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
  currentView: 'home' | 'game' | 'gameMode' | 'collection' | 'shop' | 'missions' | 'decks';
  setCurrentView: (view: 'home' | 'game' | 'gameMode' | 'collection' | 'shop' | 'missions' | 'decks') => void;
  
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
  const { user, loading, signOut } = useAuth();
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
  const [currentView, setCurrentViewState] = useState<'home' | 'game' | 'gameMode' | 'collection' | 'shop' | 'missions' | 'decks'>(() => {
    const savedView = localStorage.getItem('famand_currentView');
    return (savedView as 'home' | 'game' | 'gameMode' | 'collection' | 'shop' | 'missions' | 'decks') || 'home';
  });

  // Função para atualizar currentView e salvar no localStorage
  const setCurrentView = (view: 'home' | 'game' | 'gameMode' | 'collection' | 'shop' | 'missions' | 'decks') => {
    setCurrentViewState(view);
    localStorage.setItem('famand_currentView', view);
    console.log('Navegação alterada para:', view);
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

  const value: AppContextType = {
    user,
    loading,
    currency,
    currencyLoading,
    refreshCurrency,
    spendCoins,
    spendGems,
    addCoins,
    addGems,
    playerCards,
    cardsLoading,
    refreshPlayerCards,
    addCardToPlayer,
    decks,
    decksLoading,
    currentView,
    setCurrentView,
    signOut,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 