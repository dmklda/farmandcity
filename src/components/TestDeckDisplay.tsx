import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface TestDeckDisplayProps {
  activeDeck?: {
    id: string;
    name: string;
    cards: any[];
  } | null;
}

export const TestDeckDisplay: React.FC<TestDeckDisplayProps> = ({ activeDeck }) => {
  console.log('TestDeckDisplay - activeDeck:', activeDeck);
  
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>🔍 Teste - Deck Ativo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <strong>activeDeck existe:</strong> {activeDeck ? 'Sim' : 'Não'}
          </div>
          {activeDeck && (
            <>
              <div>
                <strong>ID:</strong> {activeDeck.id}
              </div>
              <div>
                <strong>Nome:</strong> {activeDeck.name}
              </div>
              <div>
                <strong>Cartas:</strong> {activeDeck.cards?.length || 0}
              </div>
              <div className="bg-surface-card px-3 py-2 rounded-lg border border-border shadow-sm">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-primary">🃏</span>
                  <span className="font-medium text-text-primary">{activeDeck.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {activeDeck.cards?.length || 0}/28
                  </Badge>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 