import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../types/card';
import { CardMiniature } from './CardMiniature';

interface CardGridProps {
  cards: Card[];
  title?: string;
  onCardSelect?: (card: Card) => void;
  selectedCardId?: string;
  canPlayCard?: (card: Card) => boolean;
  gridCols?: number;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  showInfo?: boolean;
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  title,
  onCardSelect,
  selectedCardId,
  canPlayCard = () => true,
  gridCols = 4,
  size = 'medium',
  showInfo = true,
  className
}) => {
  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }[gridCols] || 'grid-cols-4';

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {title && (
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      )}
      
      <div className={`grid ${gridColsClass} gap-4`}>
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex justify-center"
            >
              <CardMiniature
                card={card}
                isSelected={selectedCardId === card.id}
                isPlayable={canPlayCard(card)}
                onSelect={onCardSelect}
                size={size}
                showInfo={showInfo}
                className="transition-all duration-200"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {cards.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>Nenhuma carta encontrada</p>
        </div>
      )}
    </div>
  );
}; 
