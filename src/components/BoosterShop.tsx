import React, { useState } from 'react';
import { Card } from '../types/game';
import { boosterCards } from '../data/cards';
import { Resources } from '../types/game';
import { ShoppingBag, Star, Zap, Crown } from 'lucide-react';

interface BoosterShopProps {
  resources: Resources;
  onPurchase: (card: Card) => void;
  onClose: () => void;
}

const getRarityColor = (rarity: string) => {
  const colors = {
    common: 'bg-gray-500',
    uncommon: 'bg-green-500',
    rare: 'bg-blue-500',
    legendary: 'bg-purple-500',
    booster: 'bg-orange-500'
  };
  return colors[rarity as keyof typeof colors] || 'bg-gray-500';
};

const getRarityIcon = (rarity: string) => {
  const icons = {
    common: '⭐',
    uncommon: '⭐⭐',
    rare: '⭐⭐⭐',
    legendary: '👑',
    booster: '🚀'
  };
  return icons[rarity as keyof typeof icons] || '⭐';
};

export const BoosterShop: React.FC<BoosterShopProps> = ({
  resources,
  onPurchase,
  onClose
}) => {
  const [selectedBooster, setSelectedBooster] = useState<string>('basic');

  const boosterPacks = [
    {
      id: 'basic',
      name: 'Pacote Básico',
      description: '3 cartas comuns e 1 incomum',
      cost: { coins: 5 },
      cards: 4,
      rarity: 'common'
    },
    {
      id: 'advanced',
      name: 'Pacote Avançado',
      description: '2 incomuns, 1 rara e 1 booster',
      cost: { coins: 15 },
      cards: 4,
      rarity: 'uncommon'
    },
    {
      id: 'premium',
      name: 'Pacote Premium',
      description: '1 rara, 2 boosters e 1 lendária',
      cost: { coins: 30 },
      cards: 4,
      rarity: 'rare'
    },
    {
      id: 'legendary',
      name: 'Pacote Lendário',
      description: '2 lendárias e 2 boosters especiais',
      cost: { coins: 50 },
      cards: 4,
      rarity: 'legendary'
    }
  ];

  const canAfford = (cost: any) => {
    return Object.entries(cost).every(([resource, amount]) => 
      resources[resource as keyof Resources] >= (amount as number)
    );
  };

  const handlePurchase = (boosterPack: any) => {
    if (!canAfford(boosterPack.cost)) return;

    // Simular abertura do booster
    const cards = getBoosterCards(boosterPack);
    cards.forEach(card => onPurchase(card));
    onClose();
  };

  const getBoosterCards = (boosterPack: any): Card[] => {
    const cards: Card[] = [];
    
    switch (boosterPack.id) {
      case 'basic':
        cards.push(...getRandomCards(3, 'common'));
        cards.push(...getRandomCards(1, 'uncommon'));
        break;
      case 'advanced':
        cards.push(...getRandomCards(2, 'uncommon'));
        cards.push(...getRandomCards(1, 'rare'));
        cards.push(...getRandomCards(1, 'booster'));
        break;
      case 'premium':
        cards.push(...getRandomCards(1, 'rare'));
        cards.push(...getRandomCards(2, 'booster'));
        cards.push(...getRandomCards(1, 'legendary'));
        break;
      case 'legendary':
        cards.push(...getRandomCards(2, 'legendary'));
        cards.push(...getRandomCards(2, 'booster'));
        break;
    }
    
    return cards;
  };

  const getRandomCards = (count: number, rarity: string): Card[] => {
    const filteredCards = boosterCards.filter(card => card.rarity === rarity);
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Loja de Boosters</h2>
              <p className="text-gray-600">Expanda seu deck com cartas poderosas!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Resources Display */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-xl mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Seus Recursos</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg text-center">
              <div className="text-2xl">🪙</div>
              <div className="font-bold text-yellow-600">{resources.coins}</div>
              <div className="text-xs text-gray-600">Moedas</div>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <div className="text-2xl">🍎</div>
              <div className="font-bold text-green-600">{resources.food}</div>
              <div className="text-xs text-gray-600">Comida</div>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <div className="text-2xl">🔨</div>
              <div className="font-bold text-gray-600">{resources.materials}</div>
              <div className="text-xs text-gray-600">Materiais</div>
            </div>
            <div className="bg-white p-3 rounded-lg text-center">
              <div className="text-2xl">👥</div>
              <div className="font-bold text-blue-600">{resources.population}</div>
              <div className="text-xs text-gray-600">População</div>
            </div>
          </div>
        </div>

        {/* Booster Packs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {boosterPacks.map((pack) => (
            <div
              key={pack.id}
              className={`bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border-2 transition-all duration-200 hover:shadow-lg ${
                selectedBooster === pack.id
                  ? 'border-orange-400 shadow-lg'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
              onClick={() => setSelectedBooster(pack.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getRarityColor(pack.rarity)}`}>
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{pack.name}</h3>
                    <p className="text-sm text-gray-600">{pack.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">{pack.cost.coins}</div>
                  <div className="text-xs text-gray-500">moedas</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {pack.cards} cartas incluídas
                  </span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: pack.cards }, (_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-12 rounded border-2 ${
                        pack.rarity === 'legendary' ? 'border-purple-400 bg-purple-100' :
                        pack.rarity === 'rare' ? 'border-blue-400 bg-blue-100' :
                        pack.rarity === 'uncommon' ? 'border-green-400 bg-green-100' :
                        'border-gray-400 bg-gray-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePurchase(pack);
                }}
                disabled={!canAfford(pack.cost)}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
                  canAfford(pack.cost)
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canAfford(pack.cost) ? 'Comprar Pacote' : 'Recursos Insuficientes'}
              </button>
            </div>
          ))}
        </div>

        {/* Special Offers */}
        <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-purple-800">Ofertas Especiais</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-bold text-gray-800">Primeira Compra</div>
                <div className="text-sm text-gray-600">50% de desconto</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-center">
                <div className="text-2xl mb-2">🔥</div>
                <div className="font-bold text-gray-800">Combo Especial</div>
                <div className="text-sm text-gray-600">3 pacotes = 1 grátis</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-center">
                <div className="text-2xl mb-2">⭐</div>
                <div className="font-bold text-gray-800">Fidelidade</div>
                <div className="text-sm text-gray-600">+1 carta por compra</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview of Available Cards */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Cartas Disponíveis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boosterCards.slice(0, 6).map((card) => (
              <div key={card.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-gray-800">{card.name}</div>
                  <div className={`px-2 py-1 rounded text-xs text-white ${getRarityColor(card.rarity)}`}>
                    {getRarityIcon(card.rarity)}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">{card.effect.description}</div>
                <div className="flex gap-1">
                  {Object.entries(card.cost).map(([resource, amount]) => (
                    <div key={resource} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {resource === 'coins' ? '🪙' : resource === 'food' ? '🍎' : '🔨'} {amount}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 