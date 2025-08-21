import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useCards } from '../hooks/useCards';
import { testCardEffect, testDiceEffect, testConditionalEffect, runEffectTestSuite } from '../utils/effectTester';

interface TestResult {
  name: string;
  status: 'success' | 'failed' | 'warning';
  message: string;
  details?: any;
}

export default function EffectTestPage() {
  const { cards, loading } = useCards();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [diceNumber, setDiceNumber] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed' | 'warning'>('all');

  const runFullTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      const cardsToTest = cards.map(card => ({
        name: card.name,
        effect_logic: card.effect_logic || null
      }));
      
      const results = runEffectTestSuite(cardsToTest);
      setTestResults(results.details);
      
    } catch (error) {
      console.error('Erro ao executar testes:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const testSingleCard = (card: any) => {
    if (!card.effect_logic) {
      setTestResults([{
        name: card.name,
        status: 'warning',
        message: 'Carta sem effect_logic'
      }]);
      return;
    }

    const result = testCardEffect(card.effect_logic, card.name);
    setTestResults([{
      name: card.name,
      status: result.success ? 'success' : 'failed',
      message: result.message,
      details: result
    }]);
  };

  const testDiceForCard = (card: any, dice: number) => {
    if (!card.effect_logic) return;

    const result = testDiceEffect(card.effect_logic, dice, card.name);
    setTestResults([{
      name: `${card.name} (Dado ${dice})`,
      status: result.success ? 'success' : 'failed',
      message: result.message,
      details: result
    }]);
  };

  const testConditionalForCard = (card: any) => {
    if (!card.effect_logic) return;

    const result = testConditionalEffect(card.effect_logic, card.name);
    setTestResults([{
      name: `${card.name} (Condicional)`,
      status: result.success ? 'success' : 'failed',
      message: result.message,
      details: result.details
    }]);
  };

  const cardsByType = cards.reduce((acc, card) => {
    if (!acc[card.type]) acc[card.type] = [];
    acc[card.type].push(card);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) {
    return <div className="p-6">Carregando cartas...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="surface-elevated p-6 mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            🧪 Sistema de Teste de Efeitos de Cartas
          </h1>
          <p className="text-text-secondary mb-6">
            Teste individual ou em lote o sistema de effect_logic das cartas do jogo.
          </p>
          
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={runFullTest} 
              disabled={isRunning}
              className="btn-primary"
            >
              {isRunning ? 'Testando...' : `Testar Todas as ${cards.length} Cartas`}
            </Button>
            
            <Button 
              onClick={() => setTestResults([])}
              variant="outline"
              className="border-border text-text-secondary hover:bg-surface-hover"
            >
              Limpar Resultados
            </Button>
          </div>

          {/* Resumo */}
          {testResults.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                <div className="text-2xl font-bold text-accent">
                  {testResults.filter(r => r.status === 'success').length}
                </div>
                <div className="text-text-secondary">Sucessos</div>
              </div>
              <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/30">
                <div className="text-2xl font-bold text-destructive">
                  {testResults.filter(r => r.status === 'failed').length}
                </div>
                <div className="text-text-secondary">Falhas</div>
              </div>
              <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/30">
                <div className="text-2xl font-bold text-secondary">
                  {testResults.filter(r => r.status === 'warning').length}
                </div>
                <div className="text-text-secondary">Avisos</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Cartas por Tipo */}
          <div className="surface-elevated p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Cartas por Tipo
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(cardsByType).map(([type, typeCards]) => (
                <div key={type} className="border border-border rounded-lg p-3 bg-surface">
                  <h3 className="font-semibold text-text-primary mb-2 capitalize">
                    {type} ({typeCards.length})
                  </h3>
                  <div className="space-y-1">
                    {typeCards.slice(0, 10).map(card => (
                      <div key={card.id} className="flex items-center justify-between text-sm">
                        <span className="truncate text-text-secondary">{card.name}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline" 
                            onClick={() => testSingleCard(card)}
                            className="text-xs border-border text-text-secondary hover:bg-surface-hover"
                          >
                            Testar
                          </Button>
                          {card.effect_logic?.includes('ON_DICE') && (
                            <div className="flex">
                              {[1,2,3,4,5,6].map(dice => (
                                <Button
                                  key={dice}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => testDiceForCard(card, dice)}
                                  className="text-xs w-6 h-6 p-0 text-text-muted hover:bg-surface-hover hover:text-text-primary"
                                >
                                  {dice}
                                </Button>
                              ))}
                            </div>
                          )}
                          {card.effect_logic?.includes('IF_') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => testConditionalForCard(card)}
                              className="text-xs border-border text-text-secondary hover:bg-surface-hover"
                            >
                              Cond
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {typeCards.length > 10 && (
                      <div className="text-xs text-text-muted">
                        ... e mais {typeCards.length - 10} cartas
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resultados dos Testes */}
          <div className="surface-elevated p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Resultados dos Testes
            </h2>
            
            {/* Filtros de Status */}
            {testResults.length > 0 && (
              <div className="flex gap-2 mb-4 p-3 bg-surface rounded-lg">
                <span className="text-sm text-text-secondary mr-2">Filtrar:</span>
                <Button
                  size="sm"
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  className="text-xs h-8"
                >
                  Todos ({testResults.length})
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === 'success' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('success')}
                  className="text-xs h-8 bg-accent/20 border-accent text-accent hover:bg-accent hover:text-white"
                >
                  ✅ Sucessos ({testResults.filter(r => r.status === 'success').length})
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === 'failed' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('failed')}
                  className="text-xs h-8 bg-destructive/20 border-destructive text-destructive hover:bg-destructive hover:text-white"
                >
                  ❌ Erros ({testResults.filter(r => r.status === 'failed').length})
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === 'warning' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('warning')}
                  className="text-xs h-8 bg-secondary/20 border-secondary text-secondary hover:bg-secondary hover:text-white"
                >
                  ⚠️ Avisos ({testResults.filter(r => r.status === 'warning').length})
                </Button>
              </div>
            )}
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <div className="text-text-muted text-center py-8">
                  Nenhum teste executado ainda.
                  <br />
                  Clique em "Testar" em uma carta ou execute o teste completo.
                </div>
              ) : (
                testResults
                  .filter(result => statusFilter === 'all' || result.status === statusFilter)
                  .map((result, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      result.status === 'success' 
                        ? 'bg-accent/10 border-accent' 
                        : result.status === 'failed'
                        ? 'bg-destructive/10 border-destructive'
                        : 'bg-secondary/10 border-secondary'
                    }`}
                  >
                    <div className="font-semibold text-sm text-text-primary">
                      {result.name}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      {result.message}
                    </div>
                    {result.details && typeof result.details === 'string' && (
                      <div className="text-xs text-text-muted mt-2 whitespace-pre-line">
                        {result.details}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Estatísticas do Sistema */}
        <div className="surface-elevated p-6 mt-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">
            📊 Estatísticas do Sistema
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-city-color">{cards.length}</div>
              <div className="text-sm text-text-secondary">Total de Cartas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {cards.filter(c => c.effect_logic).length}
              </div>
              <div className="text-sm text-text-secondary">Com effect_logic</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-magic-color">
                {cards.filter(c => c.effect_logic?.includes('ON_DICE')).length}
              </div>
              <div className="text-sm text-text-secondary">Efeitos de Dado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-event-color">
                {cards.filter(c => c.effect_logic?.includes('IF_')).length}
              </div>
              <div className="text-sm text-text-secondary">Efeitos Condicionais</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}