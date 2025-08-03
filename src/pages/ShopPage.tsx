import React from 'react';
import { Button } from '../components/ui/button';
import { useAppContext } from '../contexts/AppContext';
import { Shop } from '../components/Shop';
import { Home } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background texture */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 relative z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={handleBackClick}
                  onMouseDown={() => console.log('Mouse down no botão voltar')}
                  onMouseEnter={() => console.log('Mouse enter no botão voltar')}
                  className="mr-4 px-4 py-2 bg-black/40 backdrop-blur-sm border border-yellow-600/30 text-white hover:bg-yellow-600/20 relative z-50 cursor-pointer rounded-md transition-colors"
                  style={{ 
                    pointerEvents: 'auto',
                    position: 'relative',
                    zIndex: 9999,
                    userSelect: 'none'
                  }}
                >
                  <Home className="h-4 w-4 mr-2 inline" />
                  Voltar
                </button>
                
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
                  ⚔️ Taverna do Comerciante
                </h1>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shop Content */}
        <div className="relative z-0">
          <Shop />
        </div>
      </div>
    </div>
  );
};

export default ShopPage; 
