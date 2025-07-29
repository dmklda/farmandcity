import React from 'react';
import { Button } from '../components/ui/button';
import { useAppContext } from '../contexts/AppContext';
import { Shop } from '../components/Shop';
import { Home } from 'lucide-react';

const ShopPage: React.FC = () => {
  const { setCurrentView } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                onClick={() => setCurrentView('home')}
                variant="outline"
                className="mr-4"
              >
                <Home className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Loja</h1>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Shop />
      </div>
    </div>
  );
};

export default ShopPage; 