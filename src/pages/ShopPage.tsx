import React from 'react';
import { Button } from '../components/ui/button';
import { useAppContext } from '../contexts/AppContext';
import { Shop } from '../components/Shop';
import { Home } from 'lucide-react';
import { MedievalAnimatedBackground } from '../components/MedievalAnimatedBackground';

const ShopPage: React.FC = () => {
  const { setCurrentView } = useAppContext();

  const handleBackClick = () => {
    console.log('Botão voltar clicado!');
    console.log('Estado atual antes da mudança:', localStorage.getItem('famand_currentView'));
    setCurrentView('home');
    console.log('Estado atual depois da mudança:', localStorage.getItem('famand_currentView'));
    
    // Teste direto do localStorage
    setTimeout(() => {
      console.log('Verificação após timeout:', localStorage.getItem('famand_currentView'));
      if (localStorage.getItem('famand_currentView') === 'home') {
        console.log('Navegação bem-sucedida!');
        window.location.reload(); // Forçar reload se necessário
      }
    }, 100);
  };

  return (
    <div className="min-h-screen relative">
      {/* Medieval Animated Background */}
      <MedievalAnimatedBackground />

      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={handleBackClick}
                onMouseDown={() => console.log('Mouse down no botão voltar')}
                onMouseEnter={() => console.log('Mouse enter no botão voltar')}
                className="group relative overflow-hidden bg-gradient-to-r from-slate-700/90 to-slate-800/90 hover:from-slate-600 hover:to-slate-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 shadow-lg border border-slate-600/30 hover:border-amber-400/50 hover:scale-105 backdrop-blur-sm"
                style={{ 
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 9999,
                  userSelect: 'none'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Voltar
                </span>
              </button>
              
              <div className="ml-4">
                <div className="relative inline-block">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    ⚔️ Taverna do Comerciante
                  </h1>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 blur-xl opacity-20 -z-10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shop Content */}
      <div className="relative z-10">
        <Shop />
      </div>
    </div>
  );
};

export default ShopPage; 
