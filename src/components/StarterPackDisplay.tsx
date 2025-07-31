import React from 'react';
import { useStarterPack } from '../hooks/useStarterPack';
import { useDialog } from './ui/dialog';
import { usePlayerCards } from '../hooks/usePlayerCards';

export const StarterPackDisplay: React.FC = () => {
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
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-white/20 rounded w-1/3"></div>
      </div>
    );
  }

  if (error || !packInfo) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-3xl">🎁</div>
          <div>
            <h3 className="text-white font-bold text-lg">Pacote Iniciante</h3>
            <p className="text-white/80 text-sm">40 cartas básicas para começar</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
            GRÁTIS
          </span>
          
          {packInfo.can_purchase ? (
            <button
              onClick={handlePurchase}
              className="bg-white text-amber-600 font-bold py-2 px-6 rounded-lg hover:bg-white/90 transition-colors"
            >
              Comprar
            </button>
          ) : (
            <span className="bg-white/20 text-white px-3 py-2 rounded-lg text-sm">
              ✅ Comprado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}; 