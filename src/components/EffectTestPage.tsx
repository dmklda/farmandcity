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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🧪 Sistema de Teste de Efeitos de Cartas
          </h1>
          <p className="text-gray-600 mb-6">
            Teste individual ou em lote o sistema de effect_logic das cartas do jogo.
          </p>
          
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={runFullTest} 
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? 'Testando...' : `Testar Todas as ${cards.length} Cartas`}
            </Button>
            
            <Button 
              onClick={() => setTestResults([])}
              variant="outline"
            >
              Limpar Resultados
            </Button>
          </div>

          {/* Resumo */}
          {testResults.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">
                  {testResults.filter(r => r.status === 'success').length}
                </div>
                <div className="text-green-600">Sucessos</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-700">
                  {testResults.filter(r => r.status === 'failed').length}
                </div>
                <div className="text-red-600">Falhas</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-700">
                  {testResults.filter(r => r.status === 'warning').length}
                </div>
                <div className="text-yellow-600">Avisos</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Cartas por Tipo */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Cartas por Tipo
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(cardsByType).map(([type, typeCards]) => (
                <div key={type} className="border rounded-lg p-3">
                  <h3 className="font-semibold text-gray-700 mb-2 capitalize">
                    {type} ({typeCards.length})
                  </h3>
                  <div className="space-y-1">
                    {typeCards.slice(0, 10).map(card => (
                      <div key={card.id} className="flex items-center justify-between text-sm">
                        <span className="truncate">{card.name}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline" 
                            onClick={() => testSingleCard(card)}
                            className="text-xs"
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
                                  className="text-xs w-6 h-6 p-0"
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
                              className="text-xs"
                            >
                              Cond
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {typeCards.length > 10 && (
                      <div className="text-xs text-gray-500">
                        ... e mais {typeCards.length - 10} cartas
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resultados dos Testes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Resultados dos Testes
            </h2>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  Nenhum teste executado ainda.
                  <br />
                  Clique em "Testar" em uma carta ou execute o teste completo.
                </div>
              ) : (
                testResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      result.status === 'success' 
                        ? 'bg-green-50 border-green-500' 
                        : result.status === 'failed'
                        ? 'bg-red-50 border-red-500'
                        : 'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="font-semibold text-sm">
                      {result.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {result.message}
                    </div>
                    {result.details && typeof result.details === 'string' && (
                      <div className="text-xs text-gray-500 mt-2 whitespace-pre-line">
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
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📊 Estatísticas do Sistema
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{cards.length}</div>
              <div className="text-sm text-gray-600">Total de Cartas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {cards.filter(c => c.effect_logic).length}
              </div>
              <div className="text-sm text-gray-600">Com effect_logic</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {cards.filter(c => c.effect_logic?.includes('ON_DICE')).length}
              </div>
              <div className="text-sm text-gray-600">Efeitos de Dado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {cards.filter(c => c.effect_logic?.includes('IF_')).length}
              </div>
              <div className="text-sm text-gray-600">Efeitos Condicionais</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}