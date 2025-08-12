import React, { useState } from 'react';
import { Card } from '../types/card';

interface OptionalEffectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (shouldActivate: boolean) => void;
  card: Card;
  effectDescription: string;
  costDescription: string;
}

/**
 * Componente para perguntar ao jogador se deseja ativar efeitos opcionais
 */
export const OptionalEffectDialog: React.FC<OptionalEffectDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  card,
  effectDescription,
  costDescription
}) => {
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedOption !== null) {
      onConfirm(selectedOption === 'yes');
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            🎯 Efeito Opcional: {card.name}
          </h3>
          
          <div className="text-sm text-gray-600 mb-6 space-y-3">
            <p><strong>Efeito:</strong> {effectDescription}</p>
            <p><strong>Custo:</strong> {costDescription}</p>
          </div>

          <div className="space-y-3 mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="option"
                value="yes"
                checked={selectedOption === 'yes'}
                onChange={() => setSelectedOption('yes')}
                className="text-blue-600"
              />
              <span className="text-sm">✅ Sim, ativar o efeito</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="option"
                value="no"
                checked={selectedOption === 'no'}
                onChange={() => setSelectedOption('no')}
                className="text-blue-600"
              />
              <span className="text-sm">❌ Não, apenas o efeito básico</span>
            </label>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={selectedOption === null}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionalEffectDialog;
