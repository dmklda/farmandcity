import React from 'react';
import { X, Scroll } from 'lucide-react';
import { Card } from '../types/card';
import { CardMiniature } from './CardMiniature';

interface MedievalDiscardModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  cards?: Card[];
  onDiscardCard?: (card: Card) => void;
  onShowCardDetail?: (card: Card) => void;
  title?: string;
}

// Componente de padrão medieval
const MedievalPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-10"
    viewBox="0 0 100 100"
    fill="none"
  >
    <defs>
      <pattern
        id="medieval-pattern"
        x="0"
        y="0"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <rect width="20" height="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.3" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#medieval-pattern)" />
  </svg>
);

// Componente de borda medieval
const MedievalBorder = ({ className = '' }: { className?: string }) => (
  <div className={`absolute inset-0 pointer-events-none ${className}`}>
    {/* Corner decorations */}
    <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-amber-400" />
    <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-amber-400" />
    <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-amber-400" />
    <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-amber-400" />
    
    {/* Side decorations */}
    <div className="absolute top-1/2 left-0 w-2 h-16 -translate-y-1/2 bg-gradient-to-r from-amber-600 to-amber-400 rounded-r" />
    <div className="absolute top-1/2 right-0 w-2 h-16 -translate-y-1/2 bg-gradient-to-l from-amber-600 to-amber-400 rounded-l" />
  </div>
);

const MedievalDiscardModal: React.FC<MedievalDiscardModalProps> = ({
  isOpen = false,
  onClose = () => {},
  cards = [],
  onDiscardCard = () => {},
  onShowCardDetail = () => {},
  title = 'Descarte Obrigatório'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9998] p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-amber-950 via-red-950 to-amber-950 border-4 border-amber-600 rounded-2xl shadow-2xl shadow-black/50">
        {/* Background pattern */}
        <div className="absolute inset-0 text-amber-400">
          <MedievalPattern />
        </div>
        
        {/* Medieval borders */}
        <MedievalBorder />
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-900 via-red-800 to-red-900 border-b-4 border-amber-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full shadow-lg">
                <Scroll className="w-6 h-6 text-red-900" />
              </div>
              <h2 className="text-3xl font-bold text-amber-200 tracking-wide">
                {title}
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-red-700 hover:bg-red-600 text-amber-100 border-2 border-amber-600 hover:border-amber-400 transition-all duration-200 shadow-lg hover:shadow-xl"
              title="Fechar modal de descarte"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-3 text-amber-300 text-lg font-medium">
            Escolha uma carta para descartar da sua mão:
          </div>
        </div>
        
                 {/* Content */}
         <div className="relative p-8 max-h-96 overflow-y-auto">
           <div className="flex justify-center items-center">
             <div className="flex flex-wrap justify-center gap-6 max-w-full">
               {cards.map((card, index) => (
                 <div
                   key={index}
                   className="relative group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                   onClick={() => onDiscardCard(card)}
                   onContextMenu={(e) => {
                     e.preventDefault();
                     onShowCardDetail(card);
                   }}
                 >
                   {/* Card Miniature Original */}
                   <CardMiniature
                     card={card}
                     size="medium"
                     showInfo={true}
                     isPlayable={true}
                     onSelect={() => onDiscardCard(card)}
                     onShowDetail={() => onShowCardDetail(card)}
                     className="transition-all duration-300 group-hover:ring-2 group-hover:ring-red-400 group-hover:ring-offset-2"
                   />
                   
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                   
                   {/* Discard Icon */}
                   <div className="absolute top-2 right-2 w-6 h-6 bg-red-600/90 hover:bg-red-600 border-2 border-red-400/60 rounded-full flex items-center justify-center text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                     🗑️
                   </div>
                 </div>
               ))}
             </div>
           </div>
           
           {cards.length === 0 && (
             <div className="text-center py-12">
               <div className="text-amber-400 text-lg mb-2">
                 <Scroll className="w-12 h-12 mx-auto mb-4 opacity-50" />
                 Nenhuma carta disponível para descarte
               </div>
             </div>
           )}
           
           
         </div>
        
                 {/* Footer */}
         <div className="relative bg-gradient-to-r from-amber-900/50 via-red-900/50 to-amber-900/50 border-t-2 border-amber-600 p-6">
           <div className="text-center space-y-4">
             <div className="flex items-center justify-center gap-6 text-sm text-amber-300">
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                 <span className="font-medium">Clique esquerdo para descartar</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                 <span className="font-medium">Clique direito para detalhes</span>
               </div>
             </div>
             <p className="text-amber-200 text-sm font-medium">
               Você deve descartar uma carta para continuar o jogo
             </p>
           </div>
         </div>
        
        {/* Decorative borders */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-400 to-transparent" />
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-400 to-transparent" />
      </div>
    </div>
  );
};

export default MedievalDiscardModal;
