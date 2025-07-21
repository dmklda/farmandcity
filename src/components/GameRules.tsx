import React, { useState } from 'react';
import { Book, X, Dice1, Crown, Target, Star, Users, TrendingUp } from 'lucide-react';

interface GameRulesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameRules: React.FC<GameRulesProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', name: 'Visão Geral', icon: Book },
    { id: 'gameplay', name: 'Como Jogar', icon: Dice1 },
    { id: 'cards', name: 'Tipos de Cartas', icon: Star },
    { id: 'combos', name: 'Combos & Estratégias', icon: Target },
    { id: 'victory', name: 'Condições de Vitória', icon: Crown }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Objetivo do Jogo
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Construa uma próspera civilização combinando fazendas e cidades. Use cartas estratégicas para produzir recursos, 
                construir edifícios poderosos e completar marcos históricos para alcançar a vitória!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <h4 className="font-bold text-card-foreground mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-success" />
                  Recursos
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>🪙 <strong>Moedas:</strong> Comprar cartas e construir</li>
                  <li>🍎 <strong>Comida:</strong> Sustentar população</li>
                  <li>🔨 <strong>Materiais:</strong> Construir edifícios</li>
                  <li>👥 <strong>População:</strong> Trabalhar em edifícios</li>
                </ul>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <h4 className="font-bold text-card-foreground mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-warning" />
                  Progressão
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>📊 <strong>Reputação:</strong> Pontuação principal</li>
                  <li>🏗️ <strong>Construções:</strong> Edifícios construídos</li>
                  <li>🏛️ <strong>Marcos:</strong> Marcos completados</li>
                  <li>🎯 <strong>Conquistas:</strong> Objetivos especiais</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'gameplay':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-secondary/10 to-accent/10 p-6 rounded-xl border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">Sequência de Turno</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <div className="font-bold text-primary-foreground mb-2 flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    Fase de Compra
                  </div>
                  <p className="text-sm text-muted-foreground">Compre uma nova carta para sua mão</p>
                </div>

                <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                  <div className="font-bold text-secondary-foreground mb-2 flex items-center gap-2">
                    <div className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    Fase de Ação
                  </div>
                  <p className="text-sm text-muted-foreground">Role o dado e ative edifícios correspondentes</p>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <div className="font-bold text-accent-foreground mb-2 flex items-center gap-2">
                    <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    Fase de Construção
                  </div>
                  <p className="text-sm text-muted-foreground">Jogue cartas da mão nos grids apropriados</p>
                </div>

                <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                  <div className="font-bold text-warning mb-2 flex items-center gap-2">
                    <div className="w-6 h-6 bg-warning text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    Fase de Produção
                  </div>
                  <p className="text-sm text-muted-foreground">Colete recursos de edifícios com gatilho de turno</p>
                </div>

                <div className="bg-error/10 p-4 rounded-lg border border-error/20">
                  <div className="font-bold text-error mb-2 flex items-center gap-2">
                    <div className="w-6 h-6 bg-error text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                    Fim do Turno
                  </div>
                  <p className="text-sm text-muted-foreground">Aplique efeitos finais e avance para o próximo turno</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
              <h4 className="font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Dice1 className="w-5 h-5 text-primary" />
                Sistema de Dados
              </h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <div key={num} className="bg-muted p-3 rounded text-center font-bold text-muted-foreground">
                    🎲 {num}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Cada edifício é ativado quando o dado mostra seu número correspondente. 
                Edifícios com múltiplos números têm mais chances de ativação!
              </p>
            </div>
          </div>
        );

      case 'cards':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-farm/10 to-farm/5 p-6 rounded-xl border border-farm/20">
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-farm text-white rounded-lg flex items-center justify-center">🌱</div>
                  Cartas de Fazenda
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Produzem comida e recursos básicos. Colocadas no grid de fazenda (6x6).
                </p>
                <div className="space-y-2 text-xs">
                  <div className="bg-farm/10 p-2 rounded border border-farm/20">
                    <strong>Exemplo:</strong> Campo de Trigo - Produz 1 comida quando o dado mostra 1
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-city/10 to-city/5 p-6 rounded-xl border border-city/20">
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-city text-white rounded-lg flex items-center justify-center">🏢</div>
                  Cartas de Cidade
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Fornecem população e serviços avançados. Colocadas no grid de cidade (4x4).
                </p>
                <div className="space-y-2 text-xs">
                  <div className="bg-city/10 p-2 rounded border border-city/20">
                    <strong>Exemplo:</strong> Mercado - Produz 1 moeda por população quando o dado mostra 3
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-action/10 to-action/5 p-6 rounded-xl border border-action/20">
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-action text-white rounded-lg flex items-center justify-center">⚡</div>
                  Cartas de Ação
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Efeitos instantâneos ou temporários. Jogadas diretamente da mão.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="bg-action/10 p-2 rounded border border-action/20">
                    <strong>Exemplo:</strong> Colheita - Ativa todas as fazendas e ganha +1 comida
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-landmark/10 to-landmark/5 p-6 rounded-xl border border-landmark/20">
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-landmark text-white rounded-lg flex items-center justify-center">👑</div>
                  Marcos Históricos
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Construções especiais que fornecem bônus permanentes e pontos de vitória.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="bg-landmark/10 p-2 rounded border border-landmark/20">
                    <strong>Exemplo:</strong> Universidade - Ganha moedas baseado em edifícios diferentes
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
              <h4 className="font-bold text-card-foreground mb-4">Raridade das Cartas</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="w-6 h-6 bg-gray-400 rounded mx-auto mb-2"></div>
                  <div className="font-bold text-sm">Comum</div>
                  <div className="text-xs text-muted-foreground">Básicas</div>
                </div>
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <div className="w-6 h-6 bg-success rounded mx-auto mb-2"></div>
                  <div className="font-bold text-sm">Incomum</div>
                  <div className="text-xs text-muted-foreground">Melhores</div>
                </div>
                <div className="text-center p-3 bg-secondary/10 rounded-lg">
                  <div className="w-6 h-6 bg-secondary rounded mx-auto mb-2"></div>
                  <div className="font-bold text-sm">Rara</div>
                  <div className="text-xs text-muted-foreground">Poderosas</div>
                </div>
                <div className="text-center p-3 bg-accent/10 rounded-lg">
                  <div className="w-6 h-6 bg-accent rounded mx-auto mb-2"></div>
                  <div className="font-bold text-sm">Lendária</div>
                  <div className="text-xs text-muted-foreground">Épicas</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'combos':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-warning/10 to-error/10 p-6 rounded-xl border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-warning" />
                Sistema de Combos
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Combos são formados quando cartas específicas são colocadas adjacentes umas às outras ou quando certas condições são atendidas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <h4 className="font-bold text-card-foreground mb-3 flex items-center gap-2">
                  🍇 Combo: Vinhedos em Cadeia
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Condição:</strong> Vinhedos adjacentes
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Efeito:</strong> +1 moeda por vinhedo adjacente
                </p>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <h4 className="font-bold text-card-foreground mb-3 flex items-center gap-2">
                  🏪 Combo: Celeiro + Fazendas
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Condição:</strong> Celeiro próximo a fazendas
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Efeito:</strong> Dobra produção de comida das fazendas adjacentes
                </p>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <h4 className="font-bold text-card-foreground mb-3 flex items-center gap-2">
                  🏬 Combo: Shopping + Mercados
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Condição:</strong> Shopping adjacente a mercados
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Efeito:</strong> Dobra produção de moedas dos mercados
                </p>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <h4 className="font-bold text-card-foreground mb-3 flex items-center gap-2">
                  🐝 Combo: Colmeia + Pomares
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Condição:</strong> Colmeia construída
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Efeito:</strong> +50% produção para todos os pomares
                </p>
              </div>
            </div>

            <div className="bg-success/10 p-6 rounded-xl border border-success/20">
              <h4 className="font-bold text-success mb-3">💡 Dicas Estratégicas</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Planeje adjacências:</strong> Posicione edifícios estrategicamente para maximizar combos</li>
                <li>• <strong>Diversifique números:</strong> Construa edifícios com diferentes números de dado</li>
                <li>• <strong>Equilibre recursos:</strong> Mantenha uma boa proporção entre fazendas e cidades</li>
                <li>• <strong>Use ações wisamente:</strong> Cartas de ação podem mudar o rumo do jogo</li>
                <li>• <strong>Foque nos marcos:</strong> Marcos fornecem grandes vantagens permanentes</li>
              </ul>
            </div>
          </div>
        );

      case 'victory':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-success/10 to-warning/10 p-6 rounded-xl border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-warning" />
                Condições de Vitória
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Existem múltiplas formas de alcançar a vitória. Escolha sua estratégia com base no seu estilo de jogo!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border">
                <h4 className="font-bold text-card-foreground mb-4 flex items-center gap-2">
                  🏛️ Vitória por Marcos
                </h4>
                <div className="space-y-3">
                  <div className="bg-warning/10 p-3 rounded border border-warning/20">
                    <div className="font-bold text-warning mb-1">🥉 Bronze (Fácil)</div>
                    <div className="text-sm text-muted-foreground">Complete 2 marcos históricos</div>
                  </div>
                  <div className="bg-secondary/10 p-3 rounded border border-secondary/20">
                    <div className="font-bold text-secondary-foreground mb-1">🥈 Prata (Médio)</div>
                    <div className="text-sm text-muted-foreground">Complete 3 marcos históricos</div>
                  </div>
                  <div className="bg-accent/10 p-3 rounded border border-accent/20">
                    <div className="font-bold text-accent-foreground mb-1">🥇 Ouro (Difícil)</div>
                    <div className="text-sm text-muted-foreground">Complete 4 marcos históricos</div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border">
                <h4 className="font-bold text-card-foreground mb-4 flex items-center gap-2">
                  📊 Vitória por Pontuação
                </h4>
                <div className="space-y-3">
                  <div className="bg-primary/10 p-3 rounded border border-primary/20">
                    <div className="font-bold text-primary-foreground mb-1">🌟 Reputação</div>
                    <div className="text-sm text-muted-foreground">Alcance 100+ pontos de reputação</div>
                  </div>
                  <div className="bg-success/10 p-3 rounded border border-success/20">
                    <div className="font-bold text-success mb-1">⚡ Produção</div>
                    <div className="text-sm text-muted-foreground">Produção total de 500+ recursos</div>
                  </div>
                  <div className="bg-error/10 p-3 rounded border border-error/20">
                    <div className="font-bold text-error mb-1">🏗️ Construção</div>
                    <div className="text-sm text-muted-foreground">Construa 20+ edifícios</div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border">
                <h4 className="font-bold text-card-foreground mb-4 flex items-center gap-2">
                  ⏰ Vitória por Sobrevivência
                </h4>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded">
                    <div className="font-bold text-muted-foreground mb-1">🛡️ Resistência</div>
                    <div className="text-sm text-muted-foreground">Sobreviva a 10 eventos de crise</div>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    <div className="font-bold text-muted-foreground mb-1">⏳ Persistência</div>
                    <div className="text-sm text-muted-foreground">Alcance o turno 50</div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border">
                <h4 className="font-bold text-card-foreground mb-4 flex items-center gap-2">
                  🏆 Vitória por Conquistas
                </h4>
                <div className="space-y-3">
                  <div className="bg-accent/10 p-3 rounded border border-accent/20">
                    <div className="font-bold text-accent-foreground mb-1">🎯 Especialista</div>
                    <div className="text-sm text-muted-foreground">Complete 10 conquistas únicas</div>
                  </div>
                  <div className="bg-accent/10 p-3 rounded border border-accent/20">
                    <div className="font-bold text-accent-foreground mb-1">🌟 Mestre</div>
                    <div className="text-sm text-muted-foreground">Complete todas as conquistas disponíveis</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl border border-border">
              <h4 className="font-bold text-foreground mb-3">🎖️ Sistema de Pontuação</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-primary">+10</div>
                  <div className="text-muted-foreground">Por marco completado</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-secondary">+2</div>
                  <div className="text-muted-foreground">Por edifício raro</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-success">+1</div>
                  <div className="text-muted-foreground">Por combo ativo</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-warning">+5</div>
                  <div className="text-muted-foreground">Por conquista</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Book className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Manual do Jogo</h2>
                <p className="text-white/80">Fazenda & Cidade - Guia Completo</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-muted border-r border-border">
            <div className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-background hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};