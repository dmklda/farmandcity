import React, { useState } from 'react';
import { AppLayout } from './layout/AppLayout';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TestDeckDisplay } from './TestDeckDisplay';

export const ExampleGameLayout: React.FC = () => {
  const [showStats, setShowStats] = useState(false);
  const [showSavedGames, setShowSavedGames] = useState(false);
  const [currentView, setCurrentView] = useState('game');

  // Dados de exemplo para o jogo
  const gameData = {
    // TopBar props
    turn: 3,
    turnMax: 20,
    buildCount: 2,
    buildMax: 3,
    phase: 'build',
    onNextPhase: () => {/* // console.log('Próxima fase') */},
    discardMode: false,
    resources: {
      coins: 150,
      food: 25,
      materials: 12,
      population: 8
    },
    productionPerTurn: {
      coins: 10,
      food: 5,
      materials: 2,
      population: 1
    },
    productionDetails: {
      coins: ['Fazenda: +5', 'Mercado: +5'],
      food: ['Fazenda: +3', 'Horta: +2'],
      materials: ['Mina: +2'],
      population: ['Casa: +1']
    },
    
    // Sidebar props
    sidebarResources: {
      coins: 150,
      food: 25,
      materials: 12,
      population: 8,
      coinsPerTurn: 10,
      foodPerTurn: 5,
      materialsPerTurn: 2,
      populationStatus: '+1'
    },
    progress: {
      reputation: 7,
      reputationMax: 10,
      production: 450,
      productionMax: 1000,
      landmarks: 1,
      landmarksMax: 3,
      turn: 3,
      turnMax: 20
    },
    victory: {
      reputation: 7,
      production: 450,
      landmarks: 1,
      turn: 3,
      mode: 'landmarks' as const,
      value: 3
    },
    history: [
      'Deck carregado: 28 cartas',
      '🌈 Bônus de diversidade: +1 reputação',
      '📦 Comprou carta: Rede de Defesa',
      '✨ Usou magia: Bênção da Terra',
      '🏗️ Construiu: Fazenda Básica',
      '💰 Ganhou: +5 moedas'
    ],
    
    // Action handlers
    onShowStats: () => setShowStats(true),
    onShowSavedGames: () => setShowSavedGames(true),
    onLogout: () => {
      // // console.log('Logout');
      setCurrentView('home');
    },
    onGoHome: () => {
              // // console.log('Voltando para página inicial');
      setCurrentView('home');
    },
    userEmail: 'marcior631@gmail.com',
    activeDeck: {
      id: 'deck-1',
      name: 'Meu Deck',
      cards: Array.from({ length: 28 }, (_, i) => ({ id: `card-${i}`, name: `Carta ${i + 1}` }))
    }
  };

  // Se estiver na página inicial, mostrar tela de boas-vindas
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">🏠 Página Inicial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Bem-vindo de volta! Você saiu do jogo.
            </p>
            <Button 
              onClick={() => setCurrentView('game')} 
              className="w-full"
            >
              🎮 Voltar ao Jogo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AppLayout {...gameData}>
      {/* Conteúdo principal do jogo */}
      <div className="space-y-6">
        {/* Componente de teste para debug */}
        <TestDeckDisplay activeDeck={gameData.activeDeck} />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🎮</span>
              Área Principal do Jogo
              <Badge variant="secondary">Sem Sobreposições</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Esta é a área principal onde o jogo acontece. O layout agora está completamente organizado:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• <strong>TopBar fixa</strong> no topo com z-index alto (z-50)</li>
              <li>• <strong>Sidebar colapsável</strong> com z-index adequado (z-30)</li>
              <li>• <strong>Área principal</strong> com z-index baixo (z-10)</li>
              <li>• <strong>Elementos flexíveis</strong> que não se sobrepõem</li>
              <li>• <strong>Espaçamento adequado</strong> entre todos os componentes</li>
            </ul>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>🏗️ Grid do Jogo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }, (_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🃏 Mão de Cartas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className="w-16 h-24 bg-primary/10 rounded border border-primary/20 flex items-center justify-center text-xs text-primary hover:bg-primary/20 transition-colors flex-shrink-0"
                  >
                    Carta {i + 1}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>⚙️ Controles de Exemplo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => setShowStats(true)} variant="outline">
                📊 Mostrar Stats
              </Button>
              <Button onClick={() => setShowSavedGames(true)} variant="outline">
                💾 Mostrar Jogos Salvos
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
              <p><strong>✅ Problemas Corrigidos:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>TopBar com z-index alto (z-50) para ficar sempre no topo</li>
                <li>Sidebar com z-index médio (z-30) para não sobrepor a TopBar</li>
                <li>Conteúdo principal com z-index baixo (z-10)</li>
                <li>Elementos com flex-shrink-0 para não comprimir</li>
                <li>Espaçamento adequado entre seções</li>
                <li>Email truncado para não ocupar muito espaço</li>
                <li>Deck ativo visível na TopBar</li>
                <li>Botões funcionais: Stats, Jogos, Início e Sair</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎯 Como Usar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Navegação:</h4>
                <ul className="space-y-1">
                  <li>• Clique no botão hambúrguer para alternar a sidebar</li>
                  <li>• Use os botões na TopBar para navegar</li>
                  <li>• A sidebar pode ser recolhida em telas menores</li>
                  <li>• Deck ativo visível no centro da TopBar</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Botões da TopBar:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Stats</strong>: Mostra estatísticas do jogador</li>
                  <li>• <strong>Jogos</strong>: Lista jogos salvos</li>
                  <li>• <strong>Início</strong>: Volta para página inicial</li>
                  <li>• <strong>Sair</strong>: Faz logout e volta ao início</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modais de exemplo */}
      {showStats && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>📊 Estatísticas do Jogador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Recursos Atuais:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>💰 Moedas: 150</div>
                    <div>🌾 Comida: 25</div>
                    <div>🏗️ Materiais: 12</div>
                    <div>👥 População: 8</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Progresso:</h4>
                  <div className="space-y-1 text-sm">
                    <div>⭐ Reputação: 7/10</div>
                    <div>⚙️ Produção: 450/1000</div>
                    <div>🏛️ Marcos: 1/3</div>
                  </div>
                </div>
              </div>
              <Button onClick={() => setShowStats(false)} className="mt-4 w-full">
                Fechar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showSavedGames && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>💾 Jogos Salvos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 border rounded hover:bg-muted/50 cursor-pointer">
                  <div className="font-semibold">Jogo 1 - Turno 15</div>
                  <div className="text-sm text-muted-foreground">Salvo em 25/01/2025</div>
                </div>
                <div className="p-3 border rounded hover:bg-muted/50 cursor-pointer">
                  <div className="font-semibold">Jogo 2 - Turno 8</div>
                  <div className="text-sm text-muted-foreground">Salvo em 24/01/2025</div>
                </div>
                <div className="p-3 border rounded hover:bg-muted/50 cursor-pointer">
                  <div className="font-semibold">Jogo 3 - Turno 20</div>
                  <div className="text-sm text-muted-foreground">Salvo em 23/01/2025</div>
                </div>
              </div>
              <Button onClick={() => setShowSavedGames(false)} className="mt-4 w-full">
                Fechar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}; 
