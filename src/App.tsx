import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { useDragDrop } from './hooks/useDragDrop';
import { ResourceBar } from './components/ResourceBar';
import { Grid } from './components/Grid';
import { Hand } from './components/Hand';
import { GameControls } from './components/GameControls';
import { Landmarks } from './components/Landmarks';
import { BoosterShop } from './components/BoosterShop';
import { MultiplayerEvents } from './components/MultiplayerEvents';
import { TurnTransition } from './components/TurnTransition';
import { Gamepad2, Sparkles, ShoppingBag, Users } from 'lucide-react';

function App() {
  const { gameState, previousResources, streak, achievements, rollDice, playCard, selectCard, selectCell, nextPhase, purchaseCard } = useGameState();
  const { dragState, startDrag, endDrag } = useDragDrop();
  const [showBoosterShop, setShowBoosterShop] = useState(false);
  const [showMultiplayerEvents, setShowMultiplayerEvents] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousTurn, setPreviousTurn] = useState(gameState.turn);

  // Detectar mudança de turno
  useEffect(() => {
    if (gameState.turn !== previousTurn) {
      setIsTransitioning(true);
      setPreviousTurn(gameState.turn);
    }
  }, [gameState.turn, previousTurn]);

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
  };

  // Sistema simplificado - não precisa de eventos de mouse

  const handleCardClick = (card: any) => {
    selectCard(card);
  };

  const handleCellClick = (row: number, col: number, type: 'farm' | 'city') => {
    selectCell(row, col, type);
  };

  const handleDragStart = (card: any) => {
    console.log('Card selected for placement:', { card: card.name, type: card.type });
    startDrag(card);
  };

  const handleCardDrop = (row: number, col: number, type: 'farm' | 'city') => {
    console.log('Card placement requested:', { row, col, type, draggedCard: dragState.draggedCard });
    if (dragState.draggedCard) {
      // Verificar se o tipo da carta corresponde ao tipo do grid
      if (dragState.draggedCard.type === type) {
        console.log('Playing card:', dragState.draggedCard.name, 'at', row, col, type);
        playCard(dragState.draggedCard, row, col, type);
        endDrag(); // Limpar seleção após jogar a carta
      } else {
        console.log('Card type mismatch:', dragState.draggedCard.type, 'cannot be placed on', type, 'grid');
      }
    } else {
      console.log('No card selected for placement');
    }
  };

  const handlePlaySelectedCard = () => {
    if (gameState.selectedCard) {
      if (gameState.selectedCard.type === 'action') {
        playCard(gameState.selectedCard);
      } else if (gameState.selectedCell) {
        playCard(
          gameState.selectedCard,
          gameState.selectedCell.row,
          gameState.selectedCell.col,
          gameState.selectedCell.type === 'empty' ? 'farm' : gameState.selectedCell.type
        );
      }
    }
  };

  const handleLandmarkClick = (landmark: any) => {
    // For now, just log landmark selection
    console.log('Landmark selected:', landmark.name);
  };

  const handlePurchaseCard = (card: any) => {
    purchaseCard(card);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-32 h-32 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-36 h-36 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full animate-float delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full animate-float delay-500"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-full animate-float delay-1500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 relative z-10">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-2xl animate-pulse">
              <Gamepad2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              Fazenda & Cidade
            </h1>
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-2xl animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <p className="text-2xl text-gray-700 font-bold mb-3">
            Construa sua fazenda e cidade usando cartas estratégicas
          </p>
          <p className="text-lg text-gray-600 font-medium mb-4">
            Combine recursos, construa edifícios e complete marcos históricos
          </p>
          
          {/* Streak and Achievement Display */}
          {(streak > 0 || achievements.length > 0) && (
            <div className="flex items-center justify-center gap-6 mt-6">
              {streak > 0 && (
                <div className="bg-gradient-to-r from-orange-100 to-red-100 px-6 py-3 rounded-2xl border-2 border-orange-300 shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <div className="text-lg font-bold text-orange-700">Sequência: {streak}</div>
                      <div className="text-sm text-orange-600">Ações consecutivas!</div>
                    </div>
                  </div>
                </div>
              )}
              {achievements.length > 0 && (
                <div className="bg-gradient-to-r from-yellow-100 to-amber-100 px-6 py-3 rounded-2xl border-2 border-yellow-300 shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <div className="text-lg font-bold text-yellow-700">Conquistas: {achievements.length}</div>
                      <div className="text-sm text-yellow-600">{achievements[achievements.length - 1]}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resources */}
        <ResourceBar resources={gameState.resources} previousResources={previousResources} />

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Grids */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Grid
                grid={gameState.farmGrid}
                type="farm"
                selectedCard={gameState.selectedCard}
                onCellClick={(row, col) => handleCellClick(row, col, 'farm')}
                draggedCard={dragState.draggedCard || undefined}
                onCardDrop={(row, col) => handleCardDrop(row, col, 'farm')}
                isDragActive={dragState.isDragging}
              />
              <Grid
                grid={gameState.cityGrid}
                type="city"
                selectedCard={gameState.selectedCard}
                onCellClick={(row, col) => handleCellClick(row, col, 'city')}
                draggedCard={dragState.draggedCard || undefined}
                onCardDrop={(row, col) => handleCardDrop(row, col, 'city')}
                isDragActive={dragState.isDragging}
              />
            </div>
            
            {/* Hand */}
            <Hand
              cards={gameState.hand}
              selectedCard={gameState.selectedCard}
              resources={gameState.resources}
              onCardClick={handleCardClick}
              onDragStart={handleDragStart}
              draggedCard={dragState.draggedCard || undefined}
              cardsToDiscard={gameState.cardsToDiscard}
            />
          </div>

          {/* Right Column - Controls and Landmarks */}
          <div className="space-y-8">
            <GameControls
              gameState={gameState}
              onRollDice={rollDice}
              onNextPhase={nextPhase}
              onPlaySelectedCard={handlePlaySelectedCard}
            />
            
            {/* Booster Shop Button */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                Loja de Boosters
              </h3>
              <p className="text-gray-600 mb-4">
                Expanda seu deck com cartas poderosas e raras!
              </p>
              <button
                onClick={() => setShowBoosterShop(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="w-5 h-5" />
                Abrir Loja
              </button>
            </div>

            {/* Multiplayer Events Button */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                Eventos Multiplayer
              </h3>
              <p className="text-gray-600 mb-4">
                Participe de eventos e competições com outros jogadores!
              </p>
              <button
                onClick={() => setShowMultiplayerEvents(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Users className="w-5 h-5" />
                Ver Eventos
              </button>
            </div>
            
            <Landmarks
              landmarks={gameState.landmarks}
              completedLandmarks={gameState.completedLandmarks}
              resources={gameState.resources}
              onLandmarkClick={handleLandmarkClick}
            />
          </div>
        </div>

        {/* Game Rules Help */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              📋
            </div>
            Como Jogar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-700">
            <div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl">
                <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                  🌱 Fase de Compra
                </h4>
                <p className="text-green-600">Compre uma nova carta para sua mão</p>
              </div>
            </div>
            <div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl">
                <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                  🎲 Fase de Ação
                </h4>
                <p className="text-blue-600">Role o dado e ative edifícios correspondentes</p>
              </div>
            </div>
            <div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl">
                <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                  🏗️ Fase de Construção
                </h4>
                <p className="text-purple-600">Jogue cartas da mão nos grids apropriados</p>
              </div>
            </div>
            <div>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-xl">
                <h4 className="font-bold text-yellow-700 mb-2 flex items-center gap-2">
                  ⚡ Fase de Produção
                </h4>
                <p className="text-yellow-600">Colete recursos de edifícios com gatilho de turno</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Selection Indicator */}
      {dragState.isDragging && dragState.draggedCard && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span>Selecionado: {dragState.draggedCard.name}</span>
            <button 
              onClick={() => endDrag()}
              className="ml-2 bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showBoosterShop && (
        <BoosterShop
          onClose={() => setShowBoosterShop(false)}
          onPurchase={handlePurchaseCard}
          resources={gameState.resources}
        />
      )}
      
      {showMultiplayerEvents && (
        <MultiplayerEvents
          onClose={() => setShowMultiplayerEvents(false)}
          playerStats={gameState.playerStats}
        />
      )}

      {/* Turn Transition Animation */}
      <TurnTransition
        isVisible={isTransitioning}
        turnNumber={gameState.turn}
        onAnimationComplete={handleTransitionComplete}
      />
    </div>
  );
}

export default App;