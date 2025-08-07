import React from 'react';
import { useStarterPack } from '../hooks/useStarterPack';
import { useDialog } from './ui/dialog';
import { usePlayerCards } from '../hooks/usePlayerCards';
import { Gift, Crown, Sparkles, CheckCircle } from 'lucide-react';

export const MedievalStarterPackDisplay: React.FC = () => {
  const { packInfo, loading, error, purchaseStarterPack } = useStarterPack();
  const { showAlert, showConfirm } = useDialog();
  const { refreshCards } = usePlayerCards();

  const handlePurchase = async () => {
    if (!packInfo?.can_purchase) {
      showAlert('Pacote iniciante não está disponível para compra.');
      return;
    }

    const confirmed = await showConfirm(
      'Comprar Pacote Iniciante',
      `Tem certeza que deseja comprar o pacote iniciante?\n\nVocê receberá 40 cartas diferentes.\n\nEsta compra só pode ser feita uma vez por conta.`
    );

    if (!confirmed) return;

    const result = await purchaseStarterPack();

    if (result.success) {
      showAlert(
        'Pacote Iniciante Comprado!',
        `Parabéns! Você recebeu ${result.cards_added} cartas no seu pacote iniciante.`
      );
      
      await refreshCards();
    } else {
      showAlert('Erro na Compra', result.message);
    }
  };

  if (loading) {
    return (
      <div className="relative bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-yellow-600/20 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl"></div>
        <div className="relative z-10">
          <div className="h-6 bg-white/20 rounded-lg w-1/3 mb-4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !packInfo) {
    return null;
  }

  return (
    <div className="group relative">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-yellow-500/30 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
      
      {/* Main container */}
      <div className="relative bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-yellow-600/20 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-8 shadow-2xl overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-4 right-4 animate-medieval-float">
          <Sparkles className="h-6 w-6 text-yellow-400/60" />
        </div>
        <div className="absolute bottom-4 left-4 animate-medieval-float animation-delay-2000">
          <Crown className="h-5 w-5 text-amber-400/60" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Icon container */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-lg opacity-60 animate-medieval-glow"></div>
              <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 p-4 rounded-2xl border border-amber-400/50 shadow-lg">
                <Gift className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
                Pacote Iniciante Real
              </h3>
              <p className="text-amber-200/80 text-sm leading-relaxed">
                40 cartas básicas para iniciar sua jornada no reino
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-amber-300/80 text-xs">
                  <Crown className="h-3 w-3" />
                  <span>Exclusivo para novos jogadores</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Status badge */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full blur-sm"></div>
              <span className="relative bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-semibold border border-green-500/30 backdrop-blur-sm">
                {packInfo.can_purchase ? 'GRÁTIS' : 'COMPRADO'}
              </span>
            </div>
            
            {/* Action button */}
            {packInfo.can_purchase ? (
              <button
                onClick={handlePurchase}
                className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg border border-amber-400/50 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Comprar
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 px-4 py-3 rounded-xl border border-green-500/30 backdrop-blur-sm">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">✅ Comprado</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
