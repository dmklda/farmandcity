import React, { useState } from 'react';
import { Card } from '../types/card';
// import CardFrame from './CardFrame';
import { CardMiniature } from './CardMiniature';
import { CardGrid } from './CardGrid';

// Exemplo de cartas com artwork
const exampleCards: Card[] = [
  {
    id: "1",
    name: "Golden Citadel",
    type: "city",
    cost: { coins: 6, materials: 2 },
    effect: { description: "Uma fortaleza magnífica que gera riqueza e proteção para seu reino." },
    rarity: "ultra",
    activation: "immediate",
    artworkUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
  },
  {
    id: "2",
    name: "Fertile Grounds",
    type: "farm",
    cost: { food: 1, population: 1 },
    effect: { description: "Terras férteis que fornecem sustento e recursos para sua civilização crescente." },
    rarity: "rare",
    activation: "immediate",
    artworkUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop"
  },
  {
    id: "3",
    name: "Arcane Mastery",
    type: "magic",
    cost: { coins: 8, materials: 3 },
    effect: { description: "Canalize o poder bruto do arcano para devastar seus inimigos com energia mística." },
    rarity: "legendary",
    activation: "immediate",
    artworkUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
  },
  {
    id: "4",
    name: "Ancient Monument",
    type: "landmark",
    cost: { coins: 4, materials: 1 },
    effect: { description: "Uma estrutura misteriosa de eras passadas que guarda segredos de conhecimento esquecido." },
    rarity: "uncommon",
    activation: "immediate",
    artworkUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop"
  },
  {
    id: "5",
    name: "Solar Eclipse",
    type: "event",
    cost: { coins: 5 },
    effect: { description: "Um raro evento celestial que traz tanto oportunidade quanto perigo para todos que o testemunham." },
    rarity: "rare",
    activation: "immediate",
    artworkUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
  },
  {
    id: "6",
    name: "Hidden Snare",
    type: "trap",
    cost: { materials: 2 },
    effect: { description: "Uma armadilha simples mas eficaz que pega aventureiros desavisados de surpresa." },
    rarity: "common",
    activation: "triggered",
    artworkUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop"
  }
];

const CardExamples: React.FC = () => {
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>();

  const handleCardSelect = (card: Card) => {
    setSelectedCardId(card.id);
    console.log('Carta selecionada:', card.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-900 to-stone-900 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-amber-100 mb-4">
            Sistema de Cartas - Exemplos
          </h1>
          <p className="text-amber-200/80 text-lg">
            Demonstração dos componentes de carta com artwork e efeitos 3D
          </p>
        </div>

        {/* Hand Cards Section */}
        {/* 
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-amber-100">Hand Cards (Mão do Jogador)</h2>
          <div className="flex items-end gap-4 flex-wrap justify-center">
            {exampleCards.slice(0, 4).map((card, index) => (
              <div key={card.id} className="flex-shrink-0">
                <CardFrame
                  card={card}
                  isSelected={selectedCardId === card.id}
                  isPlayable={true}
                  onSelect={() => handleCardSelect(card)}
                  onShowDetail={() => console.log('Ver detalhes:', card.name)}
                  size="small"
                  artworkUrl={card.artworkUrl}
                />
              </div>
            ))}
          </div>
        </div>
        */}

        {/* Grid Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-amber-100">Grid de Cartas (Todas as Cartas)</h2>
          <div className="bg-black/20 rounded-xl p-6 border border-amber-600/30">
            <CardGrid
              cards={exampleCards}
              title="Todas as Cartas Disponíveis"
              onCardSelect={handleCardSelect}
              selectedCardId={selectedCardId}
              gridCols={4}
              size="small"
              showInfo={true}
            />
          </div>
        </div>

        {/* Grid Section - Farm Only */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-amber-100">Grid de Cartas (Apenas Fazendas)</h2>
          <div className="bg-black/20 rounded-xl p-6 border border-amber-600/30">
            <CardGrid
              cards={exampleCards.filter(card => card.type === 'farm')}
              title="Fazendas Disponíveis"
              onCardSelect={handleCardSelect}
              selectedCardId={selectedCardId}
              gridCols={6}
              size="small"
              showInfo={true}
            />
          </div>
        </div>

        {/* Miniatures Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-amber-100">Miniaturas de Carta</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Tiny Size */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-100">Tamanho Tiny</h3>
              <div className="grid grid-cols-4 gap-2">
                {exampleCards.slice(0, 4).map((card) => (
                  <CardMiniature
                    key={card.id}
                    card={card}
                    size="tiny"
                    showInfo={false}
                    onShowDetail={() => console.log('Ver detalhes:', card.name)}
                  />
                ))}
              </div>
            </div>

            {/* Small Size */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-100">Tamanho Small</h3>
              <div className="grid grid-cols-3 gap-3">
                {exampleCards.slice(0, 3).map((card) => (
                  <CardMiniature
                    key={card.id}
                    card={card}
                    size="small"
                    showInfo={true}
                    onShowDetail={() => console.log('Ver detalhes:', card.name)}
                  />
                ))}
              </div>
            </div>

            {/* Medium Size */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-100">Tamanho Medium</h3>
              <div className="grid grid-cols-2 gap-4">
                {exampleCards.slice(0, 2).map((card) => (
                  <CardMiniature
                    key={card.id}
                    card={card}
                    size="medium"
                    showInfo={true}
                    onShowDetail={() => console.log('Ver detalhes:', card.name)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Simple Test Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-amber-100">Teste Simples - CardMiniature</h2>
          <div className="bg-black/20 rounded-xl p-6 border border-amber-600/30">
            <div className="grid grid-cols-4 gap-4">
              {exampleCards.slice(0, 4).map((card) => (
                <div key={card.id} className="flex justify-center">
                  <CardMiniature
                    card={card}
                    size="small"
                    showInfo={true}
                    onSelect={() => handleCardSelect(card)}
                    onShowDetail={() => console.log('Ver detalhes:', card.name)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Miniatures Test */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-amber-100">Teste Miniaturas de Grid</h2>
          
          {/* City Grid Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-100">City Grid (4×3) - Medium</h3>
            <div className="bg-black/20 rounded-xl p-4 border border-amber-600/30">
              <div className="grid grid-cols-4 gap-2">
                {exampleCards.filter(card => card.type === 'city').slice(0, 12).map((card, index) => (
                  <div key={card.id} className="flex justify-center">
                    <CardMiniature
                      card={card}
                      size="cityGrid"
                      showInfo={true}
                      onSelect={() => handleCardSelect(card)}
                      onShowDetail={() => console.log('Ver detalhes:', card.name)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Farm Grid Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-100">Farm Grid (4×3) - Medium</h3>
            <div className="bg-black/20 rounded-xl p-4 border border-green-600/30">
              <div className="grid grid-cols-4 gap-2">
                {exampleCards.filter(card => card.type === 'farm').slice(0, 12).map((card, index) => (
                  <div key={card.id} className="flex justify-center">
                    <CardMiniature
                      card={card}
                      size="farmGrid"
                      showInfo={true}
                      onSelect={() => handleCardSelect(card)}
                      onShowDetail={() => console.log('Ver detalhes:', card.name)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Landmark Grid Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-100">Landmark Grid (1×3) - Large</h3>
            <div className="bg-black/20 rounded-xl p-4 border border-blue-600/30">
              <div className="flex justify-center gap-4">
                {exampleCards.filter(card => card.type === 'landmark').slice(0, 3).map((card, index) => (
                  <div key={card.id} className="flex justify-center">
                    <CardMiniature
                      card={card}
                      size="landmarkGrid"
                      showInfo={true}
                      onSelect={() => handleCardSelect(card)}
                      onShowDetail={() => console.log('Ver detalhes:', card.name)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Event Grid Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-100">Event Grid (1×2) - Large</h3>
            <div className="bg-black/20 rounded-xl p-4 border border-red-600/30">
              <div className="flex justify-center gap-4">
                {exampleCards.filter(card => card.type === 'event').slice(0, 2).map((card, index) => (
                  <div key={card.id} className="flex justify-center">
                    <CardMiniature
                      card={card}
                      size="eventGrid"
                      showInfo={true}
                      onSelect={() => handleCardSelect(card)}
                      onShowDetail={() => console.log('Ver detalhes:', card.name)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Debug Test - Single Card */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-amber-100">Debug - Carta Única</h2>
          <div className="bg-black/20 rounded-xl p-4 border border-amber-600/30">
            <div className="flex justify-center">
              <CardMiniature
                card={exampleCards[0]}
                size="cityGrid"
                showInfo={true}
                onSelect={() => handleCardSelect(exampleCards[0])}
                onShowDetail={() => console.log('Ver detalhes:', exampleCards[0].name)}
              />
            </div>
            <div className="mt-4 text-center text-amber-200">
              <p>Carta: {exampleCards[0].name}</p>
              <p>Tipo: {exampleCards[0].type}</p>
              <p>Raridade: {exampleCards[0].rarity}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-900/20 border border-blue-600/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-100 mb-4">📋 Instruções de Uso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-200/80 text-sm">
            <div>
              <h4 className="font-semibold text-blue-100 mb-2">CardFrame (Hand Cards)</h4>
              <ul className="space-y-1">
                <li>• Efeito 3D no hover com rotação</li>
                <li>• Artwork central da carta</li>
                <li>• Informações básicas (custo, tipo, raridade)</li>
                <li>• Botão de detalhes para modal</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-100 mb-2">CardMiniature (Grids)</h4>
              <ul className="space-y-1">
                <li>• Miniaturas compactas para grids</li>
                <li>• Artwork como background</li>
                <li>• Tooltip com informações no hover</li>
                <li>• 3 tamanhos: tiny, small, medium</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CardExamples; 