import React from 'react';
import { Button } from '../components/ui/button';
import { useAppContext } from '../contexts/AppContext';
import { Shop } from '../components/Shop';
import { Home } from 'lucide-react';

const ShopPage: React.FC = () => {
  const { setCurrentView } = useAppContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background texture */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Button
                  onClick={() => setCurrentView('home')}
                  variant="outline"
                  className="mr-4 bg-black/40 backdrop-blur-sm border-yellow-600/30 text-white hover:bg-yellow-600/20"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
                  ⚔️ Taverna do Comerciante
                </h1>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shop Content */}
        <Shop />
      </div>
    </div>
  );
};

export default ShopPage; 
