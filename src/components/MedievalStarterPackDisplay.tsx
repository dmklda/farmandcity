import React from 'react';
import { useStarterPack } from '../hooks/useStarterPack';
import { useDialog } from './ui/dialog';
import { usePlayerCards } from '../hooks/usePlayerCards';
import { Gift, Crown, Sparkles, CheckCircle } from 'lucide-react';

interface MedievalStarterPackDisplayProps {
  onGoToDecks?: () => void;
}

export const MedievalStarterPackDisplay: React.FC<MedievalStarterPackDisplayProps> = ({ onGoToDecks }) => {
  const { packInfo, loading, error, purchaseStarterPack } = useStarterPack();
  const { showAlert, showConfirm } = useDialog();
  const { refresh } = usePlayerCards();

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
      
      await refresh();
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
      {/* Enhanced Glow effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/40 via-orange-500/40 to-yellow-500/40 rounded-2xl blur-xl opacity-80 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
      
      {/* Main container */}
      <div className="relative bg-gradient-to-r from-amber-600/30 via-orange-600/30 to-yellow-600/30 backdrop-blur-sm border-2 border-amber-400/50 rounded-2xl p-8 shadow-2xl overflow-hidden">
        {/* Enhanced decorative background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Enhanced floating particles */}
        <div className="absolute top-4 right-4 animate-medieval-float">
          <Sparkles className="h-8 w-8 text-yellow-400/80" />
        </div>
        <div className="absolute bottom-4 left-4 animate-medieval-float animation-delay-2000">
          <Crown className="h-6 w-6 text-amber-400/80" />
        </div>
        <div className="absolute top-1/2 right-8 animate-medieval-float animation-delay-1000">
          <Gift className="h-5 w-5 text-orange-400/60" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Enhanced Icon container */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-lg opacity-80 animate-medieval-glow"></div>
              <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 p-5 rounded-2xl border-2 border-amber-300/50 shadow-lg">
                <Gift className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  🎁 Pacote Iniciante Real
                </h3>
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  NOVO!
                </div>
              </div>
              <p className="text-amber-200/90 text-lg leading-relaxed mb-3">
                <strong>40 cartas básicas</strong> para iniciar sua jornada no reino
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-amber-300/90 text-sm">
                  <Crown className="h-4 w-4" />
                  <span className="font-medium">Exclusivo para novos jogadores</span>
                </div>
                <div className="flex items-center gap-2 text-green-300/90 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">100% GRÁTIS</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-amber-500/10 rounded-lg border border-amber-400/30">
                <p className="text-amber-200/90 text-sm">
                  <strong>Próximo passo:</strong> Após resgatar, crie seu primeiro deck para começar a jogar!
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            {/* Status and Action - Only show one based on purchase status */}
            {packInfo.can_purchase ? (
              <>
                {/* Enhanced Status badge for available purchase */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/40 to-orange-500/40 rounded-full blur-sm animate-pulse"></div>
                  <span className="relative bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-200 px-6 py-3 rounded-full text-lg font-bold border-2 border-amber-400/50 backdrop-blur-sm">
                    🎁 GRÁTIS
                  </span>
                </div>
                
                {/* Enhanced Purchase button */}
                <button
                  onClick={handlePurchase}
                  className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 shadow-2xl border-2 border-amber-300/50 hover:scale-105 hover:shadow-amber-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-3 text-lg">
                    <Gift className="h-6 w-6" />
                    RESGATAR AGORA
                  </span>
                </button>
                
                {/* Call to action text */}
                <div className="text-center">
                  <p className="text-amber-200/80 text-sm font-medium">
                    ⚡ Clique para receber suas cartas!
                  </p>
                </div>
              </>
            ) : (
              /* Enhanced Purchased status */
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-200 px-6 py-4 rounded-xl border-2 border-green-400/50 backdrop-blur-sm">
                  <CheckCircle className="h-6 w-6" />
                  <span className="font-bold text-lg">✅ Pacote Resgatado!</span>
                </div>
                <div className="text-center">
                  <p className="text-green-200/80 text-sm font-medium">
                    🎯 Agora crie seu primeiro deck para começar a jogar!
                  </p>
                  <button
                    onClick={() => onGoToDecks && onGoToDecks()}
                    className="mt-2 text-green-300 hover:text-green-200 text-sm font-medium underline transition-colors duration-300"
                  >
                    Ir para Arsenal Real →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
