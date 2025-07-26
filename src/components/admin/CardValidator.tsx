import React, { useState } from 'react';
import { AdminCard, CardType, CardRarity } from '../../types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

interface CardValidatorProps {
  card: AdminCard;
}

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  validate: (card: AdminCard) => { valid: boolean; message: string };
}

const validationRules: ValidationRule[] = [
  {
    id: 'phase-type-consistency',
    name: 'Consistência de Fase e Tipo',
    description: 'A fase deve ser consistente com o tipo da carta',
    validate: (card: AdminCard) => {
      const expectedPhase = (() => {
        switch (card.type) {
          case 'action':
          case 'magic':
            return 'action';
          case 'defense':
          case 'trap':
            return 'reaction';
          default:
            return 'draw';
        }
      })();

      if (card.phase !== expectedPhase) {
        return {
          valid: false,
          message: `Cartas do tipo ${card.type} devem ter fase '${expectedPhase}', mas têm '${card.phase}'`
        };
      }

      return {
        valid: true,
        message: `Fase '${card.phase}' é consistente com o tipo '${card.type}'`
      };
    }
  },
  {
    id: 'cost-balance',
    name: 'Balanceamento de Custo',
    description: 'O custo total deve ser apropriado para a raridade',
    validate: (card: AdminCard) => {
      const totalCost = card.cost_coins + card.cost_food + card.cost_materials + card.cost_population;
      
      const maxCosts = {
        common: 3,
        uncommon: 5,
        rare: 8,
        ultra: 12,
        secret: 15,
        legendary: 20,
        crisis: 10,
        booster: 6
      };

      const maxCost = maxCosts[card.rarity] || 10;

      if (totalCost > maxCost) {
        return {
          valid: false,
          message: `Custo total ${totalCost} é muito alto para raridade ${card.rarity} (máx: ${maxCost})`
        };
      }

      return {
        valid: true,
        message: `Custo total ${totalCost} está dentro do limite para raridade ${card.rarity}`
      };
    }
  },
  {
    id: 'usage-limits',
    name: 'Limites de Uso',
    description: 'Uso por turno deve ser apropriado para o tipo de carta',
    validate: (card: AdminCard) => {
      if (card.type === 'action' && card.use_per_turn > 3) {
        return {
          valid: false,
          message: 'Cartas de ação não devem ter uso por turno maior que 3'
        };
      }

      if (card.type === 'magic' && card.use_per_turn > 1) {
        return {
          valid: false,
          message: 'Cartas de magia devem ter uso por turno limitado a 1'
        };
      }

      if (card.use_per_turn < 1) {
        return {
          valid: false,
          message: 'Uso por turno deve ser pelo menos 1'
        };
      }

      return {
        valid: true,
        message: `Uso por turno ${card.use_per_turn} é apropriado para o tipo ${card.type}`
      };
    }
  },
  {
    id: 'effect-completeness',
    name: 'Completude do Efeito',
    description: 'O efeito deve ser descritivo e completo',
    validate: (card: AdminCard) => {
      if (!card.effect || card.effect.trim().length < 10) {
        return {
          valid: false,
          message: 'Descrição do efeito deve ter pelo menos 10 caracteres'
        };
      }

      if (card.effect.length > 200) {
        return {
          valid: false,
          message: 'Descrição do efeito deve ter no máximo 200 caracteres'
        };
      }

      return {
        valid: true,
        message: 'Descrição do efeito tem tamanho apropriado'
      };
    }
  },
  {
    id: 'rarity-consistency',
    name: 'Consistência de Raridade',
    description: 'A raridade deve ser consistente com o poder da carta',
    validate: (card: AdminCard) => {
      const totalCost = card.cost_coins + card.cost_food + card.cost_materials + card.cost_population;
      const effectLength = card.effect.length;

      // Regras básicas de consistência
      if (card.rarity === 'common' && totalCost > 2) {
        return {
          valid: false,
          message: 'Cartas comuns não devem ter custo total maior que 2'
        };
      }

      if (card.rarity === 'legendary' && totalCost < 5) {
        return {
          valid: false,
          message: 'Cartas lendárias devem ter custo total de pelo menos 5'
        };
      }

      return {
        valid: true,
        message: `Raridade ${card.rarity} é consistente com o poder da carta`
      };
    }
  },
  {
    id: 'reactive-validation',
    name: 'Validação de Reatividade',
    description: 'Cartas reativas devem ter configurações apropriadas',
    validate: (card: AdminCard) => {
      if (card.is_reactive) {
        if (card.type !== 'defense' && card.type !== 'trap') {
          return {
            valid: false,
            message: 'Apenas cartas de defesa e armadilha podem ser reativas'
          };
        }

        if (card.phase !== 'reaction') {
          return {
            valid: false,
            message: 'Cartas reativas devem ter fase "reaction"'
          };
        }
      }

      return {
        valid: true,
        message: 'Configuração de reatividade está correta'
      };
    }
  }
];

export const CardValidator: React.FC<CardValidatorProps> = ({ card }) => {
  const [validationResults, setValidationResults] = useState<Array<{
    rule: ValidationRule;
    result: { valid: boolean; message: string };
  }>>([]);

  const runValidation = () => {
    const results = validationRules.map(rule => ({
      rule,
      result: rule.validate(card)
    }));
    setValidationResults(results);
  };

  const validCount = validationResults.filter(r => r.result.valid).length;
  const totalCount = validationResults.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Validador de Mecânica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Valide as regras de mecânica da carta
          </p>
          <Button onClick={runValidation} size="sm">
            Executar Validação
          </Button>
        </div>

        {validationResults.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Resultados:</span>
              <Badge variant={validCount === totalCount ? 'default' : 'destructive'}>
                {validCount}/{totalCount} válidas
              </Badge>
            </div>

            <div className="space-y-2">
              {validationResults.map(({ rule, result }) => (
                <div
                  key={rule.id}
                  className={`p-3 rounded border ${
                    result.valid
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {result.valid ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{rule.name}</h4>
                      <p className="text-xs text-muted-foreground mb-1">
                        {rule.description}
                      </p>
                      <p className={`text-sm ${
                        result.valid ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {validCount === totalCount && (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Todas as validações passaram! A carta está pronta para uso.
                  </span>
                </div>
              </div>
            )}

            {validCount < totalCount && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    {totalCount - validCount} problema(s) encontrado(s). Corrija antes de publicar.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {validationResults.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Clique em "Executar Validação" para verificar a carta</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 