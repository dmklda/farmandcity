import React from 'react';
import { PremiumBackgroundsShop } from '../components/PremiumBackgroundsShop';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Crown, Star, Zap } from 'lucide-react';

export const PremiumBackgroundsPage: React.FC = () => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    // Atualizar estatísticas ou fazer outras ações após compra
    console.log('Background premium comprado!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header com navegação */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Crown className="w-8 h-8 text-yellow-400" />
              Loja Premium
            </h1>
            <p className="text-gray-300">Backgrounds exclusivos para seu campo de batalha</p>
          </div>
          
          <div className="w-20"></div> {/* Espaçador */}
        </div>

        {/* Informações sobre raridades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-purple-400">Épicos</h3>
            </div>
            <p className="text-sm text-gray-300">
              Backgrounds raros com efeitos especiais e designs únicos
            </p>
          </div>
          
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-yellow-400">Lendários</h3>
            </div>
            <p className="text-sm text-gray-300">
              Backgrounds ultra-raros com animações e efeitos especiais
            </p>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-400">Animados</h3>
            </div>
            <p className="text-sm text-gray-300">
              Backgrounds com animações fluidas e efeitos dinâmicos
            </p>
          </div>
        </div>

        {/* Loja de Backgrounds */}
        <PremiumBackgroundsShop onPurchase={handlePurchase} />
      </div>
    </div>
  );
}; 