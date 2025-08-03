import React, { useState, useRef } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { AdminCard } from '../../types/admin';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface CardImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

interface ImportResult {
  success: boolean;
  card: Partial<AdminCard>;
  error?: string;
}

export const CardImportModal: React.FC<CardImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete
}) => {
  const [importData, setImportData] = useState('');
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateCard = (card: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!card.name?.trim()) {
      errors.push('Nome é obrigatório');
    }

    if (!card.type || !['farm', 'city', 'action', 'magic', 'defense', 'trap', 'event', 'landmark'].includes(card.type)) {
      errors.push('Tipo inválido');
    }

    if (!card.rarity || !['common', 'uncommon', 'rare', 'ultra', 'secret', 'legendary', 'crisis', 'booster'].includes(card.rarity)) {
      errors.push('Raridade inválida');
    }

    if (!card.effect?.trim()) {
      errors.push('Efeito é obrigatório');
    }

    if (card.cost_coins < 0 || card.cost_food < 0 || card.cost_materials < 0 || card.cost_population < 0) {
      errors.push('Custos não podem ser negativos');
    }

    if (card.use_per_turn < 1) {
      errors.push('Uso por turno deve ser pelo menos 1');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  const parseImportData = (data: string): Partial<AdminCard>[] => {
    try {
      // Try to parse as JSON first
      const jsonData = JSON.parse(data);
      
      if (Array.isArray(jsonData)) {
        return jsonData;
      } else if (jsonData.cards && Array.isArray(jsonData.cards)) {
        return jsonData.cards;
      } else {
        return [jsonData];
      }
    } catch (error) {
      // Try to parse as CSV
      const lines = data.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const cards: Partial<AdminCard>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const card: any = {};

        headers.forEach((header, index) => {
          const value = values[index];
          if (value) {
            // Convert numeric values
            if (['cost_coins', 'cost_food', 'cost_materials', 'cost_population', 'use_per_turn'].includes(header)) {
              card[header] = parseInt(value) || 0;
            } else if (['is_reactive', 'is_active'].includes(header)) {
              card[header] = value.toLowerCase() === 'true';
            } else {
              card[header] = value;
            }
          }
        });

        cards.push(card);
      }

      return cards;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      toast.error('Por favor, insira dados para importar');
      return;
    }

    setImporting(true);
    setResults([]);

    try {
      const cards = parseImportData(importData);
      const importResults: ImportResult[] = [];

      for (const card of cards) {
        const validation = validateCard(card);

        if (!validation.valid) {
          importResults.push({
            success: false,
            card,
            error: validation.errors.join(', ')
          });
          continue;
        }

        try {
          const cardData = {
            ...card,
            slug: card.slug || card.name?.toLowerCase().replace(/\s+/g, '-') || 'default-slug',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            // Ensure required fields are not undefined
            name: card.name || '',
            effect: card.effect || '',
            phase: card.phase || 'draw',
            rarity: card.rarity || 'common',
            type: card.type || 'farm'
          };

          const { error } = await supabase
            .from('cards')
            .insert(cardData);

          if (error) {
            importResults.push({
              success: false,
              card,
              error: error.message
            });
          } else {
            importResults.push({
              success: true,
              card
            });
          }
        } catch (error) {
          importResults.push({
            success: false,
            card,
            error: 'Erro interno'
          });
        }
      }

      setResults(importResults);
      setShowResults(true);

      const successCount = importResults.filter(r => r.success).length;
      const errorCount = importResults.filter(r => !r.success).length;

      if (successCount > 0) {
        toast.success(`${successCount} cartas importadas com sucesso`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} cartas falharam na importação`);
      }

      onImportComplete();
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Erro ao processar dados de importação');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setImportData('');
    setResults([]);
    setShowResults(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Cartas
          </CardTitle>
          <Button variant="ghost" onClick={handleClose} className="p-2">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
          {!showResults ? (
            <>
              <div className="space-y-2">
                <Label>Dados de Importação (JSON ou CSV)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label="Selecionar arquivo para importar cartas"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Selecionar Arquivo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Suporta arquivos JSON e CSV
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ou cole os dados aqui:</Label>
                <Textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Cole aqui os dados JSON ou CSV das cartas..."
                  rows={10}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button onClick={handleImport} disabled={importing || !importData.trim()}>
                  {importing ? 'Importando...' : 'Importar Cartas'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <h3 className="font-semibold">Resultados da Importação</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded border ${
                        result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium">
                          {result.card.name || 'Carta sem nome'}
                        </span>
                      </div>
                      {result.error && (
                        <p className="text-sm text-red-600 mt-1">{result.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button onClick={() => setShowResults(false)}>
                  Importar Mais
                </Button>
                <Button onClick={handleClose}>
                  Fechar
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 
