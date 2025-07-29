import React from 'react';
import { Card, } from '../ui/card';
import { Badge as BadgeComponent } from '../ui/badge';

interface ValidationResult {
  isValid: boolean;
  recognizedPattern: string | null;
  parsedEffect: {
    coins?: number;
    food?: number;
    materials?: number;
    population?: number;
  };
  suggestions: string[];
}

interface CardValidatorProps {
  effect: string;
  cardType: string;
}

export const CardValidator: React.FC<CardValidatorProps> = ({ effect, cardType }) => {
  const validateEffect = (effectText: string, type: string): ValidationResult => {
    const effect = effectText.toLowerCase();
    const suggestions: string[] = [];
    let recognizedPattern: string | null = null;
    let parsedEffect: any = {};

    // Padrões para efeitos instantâneos (action, magic)
    const instantPatterns: Array<{ pattern: RegExp; name: string; isDeduction?: boolean; isBidirectional?: boolean }> = [
      // Múltiplos recursos
      { pattern: /ganhe (\d+) (comida|moeda|material|população) e (\d+) (comida|moeda|material|população)/, name: 'ganhe X recurso e Y recurso' },
      { pattern: /ganho instantâneo de (\d+) (comida|moeda|material|população) e (\d+) (comida|moeda|material|população)/, name: 'ganho instantâneo de X recurso e Y recurso' },
      { pattern: /receba (\d+) (comida|moeda|material|população) e (\d+) (comida|moeda|material|população)/, name: 'receba X recurso e Y recurso' },
      { pattern: /obtenha (\d+) (comida|moeda|material|população) e (\d+) (comida|moeda|material|população)/, name: 'obtenha X recurso e Y recurso' },
      { pattern: /adicione (\d+) (comida|moeda|material|população) e (\d+) (comida|moeda|material|população)/, name: 'adicione X recurso e Y recurso' },
      
      // Recurso único
      { pattern: /ganhe (\d+) (comida|moeda|material|população)/, name: 'ganhe X recurso' },
      { pattern: /ganho instantâneo de (\d+) (comida|moeda|material|população)/, name: 'ganho instantâneo de X recurso' },
      { pattern: /receba (\d+) (comida|moeda|material|população)/, name: 'receba X recurso' },
      { pattern: /obtenha (\d+) (comida|moeda|material|população)/, name: 'obtenha X recurso' },
      { pattern: /adicione (\d+) (comida|moeda|material|população)/, name: 'adicione X recurso' },
      
      // Efeitos de população específicos
      { pattern: /aumenta população em (\d+)/, name: 'aumenta população em X' },
      { pattern: /aumenta população máxima em (\d+)/, name: 'aumenta população máxima em X' },
      { pattern: /fornece (\d+) população/, name: 'fornece X população' },
      { pattern: /contratar trabalhadores/, name: 'contratar trabalhadores' },
      
      // Efeitos de reputação
      { pattern: /\+(\d+) reputação/, name: '+X reputação' },
      { pattern: /fornece (\d+) reputação/, name: 'fornece X reputação' },
      { pattern: /garante (\d+) reputação/, name: 'garante X reputação' },
      
      // Efeitos de conversão/troca
      { pattern: /troque (\d+) (comida|moeda|material|população) por (\d+) (comida|moeda|material|população)/, name: 'troque X recurso por Y recurso' },
      { pattern: /converta (\d+) (comida|moeda|material|população) em (\d+) (comida|moeda|material|população)/, name: 'converta X recurso em Y recurso' },
      { pattern: /transforme (\d+) (comida|moeda|material|população) em (\d+) (comida|moeda|material|população)/, name: 'transforme X recurso em Y recurso' },
      
      { pattern: /reduz custo de construção em (\d+) material/, name: 'reduz custo de construção em X material' },
      
      // Efeitos condicionais simples
      { pattern: /ganha (\d+) moedas/, name: 'ganha X moedas' },
      { pattern: /ganha (\d+) comida/, name: 'ganha X comida' },
      { pattern: /ganha (\d+) material/, name: 'ganha X material' },
      
      // Efeitos condicionais complexos
      { pattern: /ganha (\d+) (comida|moeda|material|população)\. se você tiver (\d+) ou mais (trabalhadores|fazendas|cidades|materiais|moedas|comida)/, name: 'ganha X recurso se tiver Y ou mais Z' },
      { pattern: /ganha (\d+) (comida|moeda|material|população) se você tiver (\d+) ou mais (trabalhadores|fazendas|cidades|materiais|moedas|comida)/, name: 'ganha X recurso se tiver Y ou mais Z' },
      { pattern: /se você tiver (\d+) ou mais (trabalhadores|fazendas|cidades|materiais|moedas|comida), ganha (\d+) (comida|moeda|material|população)/, name: 'se tiver X ou mais Y, ganha Z recurso' },
      
      // Efeitos condicionais com "em vez disso"
      { pattern: /ganha (\d+) (comida|moeda|material|população)\. se você tiver (uma|alguma) (cidade|fazenda), ganha (\d+) (comida|moeda|material|população) em vez disso/, name: 'ganha X recurso, se tiver cidade/fazenda ganha Y em vez disso' },
      { pattern: /ganha (\d+) (comida|moeda|material|população)\. se você tiver (\d+) ou mais (trabalhadores|fazendas|cidades), ganha (\d+) (comida|moeda|material|população) em vez disso/, name: 'ganha X recurso, se tiver Y ou mais Z ganha W em vez disso' },
      
      // Efeitos "para cada X que você tem"
      { pattern: /ganha (\d+) (comida|moeda|material|população) para cada (\d+) (moedas|materiais|comida|fazendas|cidades) que você tem/, name: 'ganha X recurso para cada Y Z que você tem' },
      { pattern: /no final do turno, ganha (\d+) (comida|moeda|material|população) para cada (\d+) (moedas|materiais|comida|fazendas|cidades) que você tem/, name: 'no final do turno, ganha X recurso para cada Y Z' },
      { pattern: /no início de cada turno, ganha (\d+) (comida|moeda|material|população)/, name: 'no início de cada turno, ganha X recurso' },
      
      // Efeitos de perda/dano
      { pattern: /perde (\d+) (comida|moeda|material|população)/, name: 'perde X recurso', isDeduction: true },
      { pattern: /todos os jogadores perdem (\d+) (comida|moeda|material|população)/, name: 'todos perdem X recurso', isDeduction: true },
      { pattern: /perdem metade de suas (moedas|materiais|comida)/, name: 'perdem metade de suas X', isDeduction: true },
      
      // Efeitos de duplicação/multiplicação
      { pattern: /duplica (produção de comida|produção de moedas|produção de materiais)/, name: 'duplica produção de X' },
      { pattern: /dobra (produção de comida|produção de moedas|produção de materiais)/, name: 'dobra produção de X' },
      { pattern: /duplica (produção de comida|produção de moedas|produção de materiais) por (\d+) turno/, name: 'duplica produção de X por Y turno' },
      { pattern: /dobra (produção de comida|produção de moedas|produção de materiais) por (\d+) turno/, name: 'dobra produção de X por Y turno' },
      { pattern: /duplica (produção de comida|produção de moedas|produção de materiais) por (\d+) turnos/, name: 'duplica produção de X por Y turnos' },
      { pattern: /dobra (produção de comida|produção de moedas|produção de materiais) por (\d+) turnos/, name: 'dobra produção de X por Y turnos' },
      { pattern: /duplica (produção de comida|produção de moedas|produção de materiais) neste turno/, name: 'duplica produção de X neste turno' },
      { pattern: /dobra (produção de comida|produção de moedas|produção de materiais) neste turno/, name: 'dobra produção de X neste turno' },
      { pattern: /todas as suas fazendas produzem \+(\d+) comida/, name: 'todas as fazendas produzem +X comida' },
      { pattern: /todas as suas cidades produzem \+(\d+) (moeda|material)/, name: 'todas as cidades produzem +X recurso' },
    ];

    // Padrões para produção por turno (farm, city)
    const productionPatterns: Array<{ pattern: RegExp; name: string; isDeduction?: boolean; isBidirectional?: boolean }> = [
      // Múltiplos recursos (DEVE VIR PRIMEIRO - padrões mais específicos)
      { pattern: /produz (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) e (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/, name: 'produz X recurso e Y recurso por turno' },
      { pattern: /produz (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) e (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) a cada turno/, name: 'produz X recurso e Y recurso a cada turno' },
      { pattern: /fornece (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) e (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/, name: 'fornece X recurso e Y recurso por turno' },
      { pattern: /gera (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) e (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/, name: 'gera X recurso e Y recurso por turno' },
      { pattern: /produz (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno e (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações)/, name: 'produz X recurso por turno e Y recurso' },
      
      // Efeitos de dedução por turno (NOVO)
      { pattern: /custa (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/, name: 'custa X recurso por turno', isDeduction: true },
      { pattern: /gasta (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/, name: 'gasta X recurso por turno', isDeduction: true },
      { pattern: /consome (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/, name: 'consome X recurso por turno', isDeduction: true },
      { pattern: /deduz (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/, name: 'deduz X recurso por turno', isDeduction: true },
      
      // Recurso único (DEVE VIR DEPOIS - padrões mais genéricos)
      { pattern: /produz (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/, name: 'produz X recurso por turno' },
      { pattern: /produz (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) a cada turno/, name: 'produz X recurso a cada turno' },
      { pattern: /fornece (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/, name: 'fornece X recurso por turno' },
      { pattern: /gera (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/, name: 'gera X recurso por turno' },
      { pattern: /produz (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações)/, name: 'produz X recurso' },
      
      // Efeitos de população específicos
      { pattern: /aumenta população em (\d+)/, name: 'aumenta população em X' },
      { pattern: /aumenta população máxima em (\d+)/, name: 'aumenta população máxima em X' },
      { pattern: /fornece (\d+) população/, name: 'fornece X população' },
      { pattern: /população direta/, name: 'população direta' },
      
      // Efeitos de reputação
      { pattern: /\+(\d+) reputação/, name: '+X reputação' },
      { pattern: /fornece (\d+) reputação/, name: 'fornece X reputação' },
      { pattern: /garante (\d+) reputação/, name: 'garante X reputação' },
      
      // Efeitos condicionais de produção
      { pattern: /produz (\d+) (comida|comidas|moeda|moedas|material|materiais) se você tiver (\d+) ou mais/, name: 'produz X recurso se tiver Y ou mais' },
      { pattern: /para cada (fazenda|cidade) que você tem, produz \+(\d+) (moeda|moedas|comida|comidas|material|materiais)/, name: 'para cada fazenda/cidade, produz +X recurso' },
      
      // Efeitos de produção contínua
      { pattern: /produção contínua de (comida|comidas|moeda|moedas|material|materiais)/, name: 'produção contínua de X' },
      { pattern: /produção ativada por dado/, name: 'produção ativada por dado' },
    ];

    // Padrões para produção por dado
    const dicePatterns: Array<{ pattern: RegExp; name: string; isDeduction?: boolean; isBidirectional?: boolean }> = [
      // Múltiplos recursos por dado
      { pattern: /produz (\d+) (comida|moeda|material) e (\d+) (comida|moeda|material|reputação) quando ativado por dado (\d+)/, name: 'produz X e Y recurso quando dado Z' },
      { pattern: /produz (\d+) (comida|moeda|material) e (\d+) (comida|moeda|material|reputação) se dado for (\d+)/, name: 'produz X e Y recurso se dado Z' },
      { pattern: /produz (\d+) (comida|moeda|material) e (\d+) (comida|moeda|material|reputação) com dado (\d+)/, name: 'produz X e Y recurso com dado Z' },
      
      // Recurso único por dado
      { pattern: /produz (\d+) (comida|moeda|material) quando ativado por dado (\d+)/, name: 'produz X recurso quando dado Y' },
      { pattern: /produz (\d+) (comida|moeda|material) se dado for (\d+)/, name: 'produz X recurso se dado for Y' },
      { pattern: /produz (\d+) (comida|moeda|material) com dado (\d+)/, name: 'produz X recurso com dado Y' },
      { pattern: /produz (\d+) (comida|moeda|material) quando dado = (\d+)/, name: 'produz X recurso quando dado = Y' },
      
      // Produção com dado específico
      { pattern: /produção com dado (\d+)/, name: 'produção com dado X' },
      { pattern: /produção ativada por dado/, name: 'produção ativada por dado' },
    ];

    // Padrões bidirecionais (sempre incluídos)
    const bidirectionalPatterns: Array<{ pattern: RegExp; name: string; isDeduction?: boolean; isBidirectional?: boolean }> = [
      // Efeitos de conversão bidirecional (NOVO)
      { pattern: /transforme (\d+) (comida|moeda|material|população) em (\d+) (comida|moeda|material|população) ou (\d+) (comida|moeda|material|população) em (\d+) (comida|moeda|material|população)/i, name: 'transforme X recurso em Y ou Z em W', isBidirectional: true },
      { pattern: /troque (\d+) (comida|moeda|material|população) por (\d+) (comida|moeda|material|população) ou (\d+) (comida|moeda|material|população) por (\d+) (comida|moeda|material|população)/i, name: 'troque X por Y ou Z por W', isBidirectional: true },
      { pattern: /converta (\d+) (comida|moeda|material|população) em (\d+) (comida|moeda|material|população) ou (\d+) (comida|moeda|material|população) em (\d+) (comida|moeda|material|população)/i, name: 'converta X em Y ou Z em W', isBidirectional: true },
    ];

    let patternsToCheck = [];
    
    if (['action', 'magic'].includes(type)) {
      patternsToCheck = [...instantPatterns, ...bidirectionalPatterns];
    } else if (['farm', 'city'].includes(type)) {
      patternsToCheck = [...productionPatterns, ...dicePatterns, ...bidirectionalPatterns];
    } else {
      patternsToCheck = [...instantPatterns, ...productionPatterns, ...dicePatterns, ...bidirectionalPatterns];
    }

    // Processar padrões em ordem de especificidade (mais específico primeiro)
    const processedRanges: Array<{start: number, end: number}> = [];
    
    for (const { pattern, name, isDeduction = false, isBidirectional = false } of patternsToCheck) {
      const matches = effect.matchAll(new RegExp(pattern, 'g'));
      
      for (const match of matches) {
        const matchStart = match.index!;
        const matchEnd = matchStart + match[0].length;
        
        // Verificar se esta parte do texto já foi processada
        const isAlreadyProcessed = processedRanges.some(range => 
          (matchStart >= range.start && matchStart < range.end) ||
          (matchEnd > range.start && matchEnd <= range.end) ||
          (matchStart <= range.start && matchEnd >= range.end)
        );
        
        if (isAlreadyProcessed) {
          console.log('🔍 CardValidator - Pulando padrão já processado:', name, 'em posição', matchStart, '-', matchEnd);
          continue;
        }
        
        console.log('🔍 CardValidator - Padrão encontrado:', name);
        console.log('🔍 CardValidator - Match:', match);
        console.log('🔍 CardValidator - Match length:', match.length);
        console.log('🔍 CardValidator - Posição:', matchStart, '-', matchEnd);
        console.log('🔍 CardValidator - É bidirecional?', isBidirectional);
        
        recognizedPattern = name;
        
        // Marcar esta parte do texto como processada
        processedRanges.push({ start: matchStart, end: matchEnd });
        
        // Verificar se é efeito bidirecional (tem 6 grupos de captura)
        if (isBidirectional && match.length >= 7) {
          // Padrão: "transforme X recurso1 em Y recurso2 ou Z recurso3 em W recurso4"
          const value1 = parseInt(match[1], 10);
          const resourceType1 = match[2];
          const value2 = parseInt(match[3], 10);
          const resourceType2 = match[4];
          const value3 = parseInt(match[5], 10);
          const resourceType3 = match[6];
          const value4 = parseInt(match[7], 10);
          const resourceType4 = match[8];
          
          console.log('🔍 CardValidator - Efeito bidirecional:', { 
            value1, resourceType1, value2, resourceType2, 
            value3, resourceType3, value4, resourceType4 
          });
          
          // Para efeitos bidirecionais, mostrar ambas as opções
          // Opção 1: X recurso1 → Y recurso2
          // Opção 2: Z recurso3 → W recurso4
          
          // Adicionar primeira opção (dedução do primeiro, adição do segundo)
          switch (resourceType1) {
            case 'comida':
            case 'comidas':
              parsedEffect.food = (parsedEffect.food || 0) - value1;
              break;
            case 'moeda':
            case 'moedas':
              parsedEffect.coins = (parsedEffect.coins || 0) - value1;
              break;
            case 'material':
            case 'materiais':
              parsedEffect.materials = (parsedEffect.materials || 0) - value1;
              break;
            case 'população':
            case 'populações':
              parsedEffect.population = (parsedEffect.population || 0) - value1;
              break;
          }
          
          switch (resourceType2) {
            case 'comida':
            case 'comidas':
              parsedEffect.food = (parsedEffect.food || 0) + value2;
              break;
            case 'moeda':
            case 'moedas':
              parsedEffect.coins = (parsedEffect.coins || 0) + value2;
              break;
            case 'material':
            case 'materiais':
              parsedEffect.materials = (parsedEffect.materials || 0) + value2;
              break;
            case 'população':
            case 'populações':
              parsedEffect.population = (parsedEffect.population || 0) + value2;
              break;
          }
          
          // Adicionar segunda opção (dedução do terceiro, adição do quarto)
          switch (resourceType3) {
            case 'comida':
            case 'comidas':
              parsedEffect.food = (parsedEffect.food || 0) - value3;
              break;
            case 'moeda':
            case 'moedas':
              parsedEffect.coins = (parsedEffect.coins || 0) - value3;
              break;
            case 'material':
            case 'materiais':
              parsedEffect.materials = (parsedEffect.materials || 0) - value3;
              break;
            case 'população':
            case 'populações':
              parsedEffect.population = (parsedEffect.population || 0) - value3;
              break;
          }
          
          switch (resourceType4) {
            case 'comida':
            case 'comidas':
              parsedEffect.food = (parsedEffect.food || 0) + value4;
              break;
            case 'moeda':
            case 'moedas':
              parsedEffect.coins = (parsedEffect.coins || 0) + value4;
              break;
            case 'material':
            case 'materiais':
              parsedEffect.materials = (parsedEffect.materials || 0) + value4;
              break;
            case 'população':
            case 'populações':
              parsedEffect.population = (parsedEffect.population || 0) + value4;
              break;
          }
          
        } else if (match.length >= 5) {
          // Padrão: "produz X recurso1 e Y recurso2 por turno"
          const value1 = parseInt(match[1], 10);
          const resourceType1 = match[2];
          const value2 = parseInt(match[3], 10);
          const resourceType2 = match[4];
          
          console.log('🔍 CardValidator - Múltiplos recursos:', { value1, resourceType1, value2, resourceType2 });
          
          // Aplicar multiplicador para deduções
          const multiplier = isDeduction ? -1 : 1;
          console.log('🔍 CardValidator - É dedução?', isDeduction, 'Multiplicador:', multiplier);
          
          // Adicionar primeiro recurso
          switch (resourceType1) {
            case 'comida':
            case 'comidas':
              parsedEffect.food = (parsedEffect.food || 0) + (value1 * multiplier);
              break;
            case 'moeda':
            case 'moedas':
              parsedEffect.coins = (parsedEffect.coins || 0) + (value1 * multiplier);
              break;
            case 'material':
            case 'materiais':
              parsedEffect.materials = (parsedEffect.materials || 0) + (value1 * multiplier);
              break;
            case 'população':
            case 'populações':
              parsedEffect.population = (parsedEffect.population || 0) + (value1 * multiplier);
              break;
          }
          
          // Adicionar segundo recurso
          switch (resourceType2) {
            case 'comida':
            case 'comidas':
              parsedEffect.food = (parsedEffect.food || 0) + (value2 * multiplier);
              break;
            case 'moeda':
            case 'moedas':
              parsedEffect.coins = (parsedEffect.coins || 0) + (value2 * multiplier);
              break;
            case 'material':
            case 'materiais':
              parsedEffect.materials = (parsedEffect.materials || 0) + (value2 * multiplier);
              break;
            case 'população':
            case 'populações':
              parsedEffect.population = (parsedEffect.population || 0) + (value2 * multiplier);
              break;
            case 'reputação':
              parsedEffect.reputation = value2 * multiplier;
              break;
          }
        } else {
          // Padrão: "produz X recurso por turno" (recurso único)
          const value = parseInt(match[1], 10);
          const resourceType = match[2];
          
          console.log('🔍 CardValidator - Recurso único:', { value, resourceType });
          
          // Aplicar multiplicador para deduções
          const multiplier = isDeduction ? -1 : 1;
          console.log('🔍 CardValidator - É dedução?', isDeduction, 'Multiplicador:', multiplier);
          
          switch (resourceType) {
            case 'comida':
            case 'comidas':
              parsedEffect.food = (parsedEffect.food || 0) + (value * multiplier);
              break;
            case 'moeda':
            case 'moedas':
              parsedEffect.coins = (parsedEffect.coins || 0) + (value * multiplier);
              break;
            case 'material':
            case 'materiais':
              parsedEffect.materials = (parsedEffect.materials || 0) + (value * multiplier);
              break;
            case 'população':
            case 'populações':
              parsedEffect.population = (parsedEffect.population || 0) + (value * multiplier);
              break;
            case 'reputação':
              parsedEffect.reputation = value * multiplier;
              break;
          }
        }
        
        console.log('🔍 CardValidator - Parsed effect após processamento:', parsedEffect);
      }
    }

    // Sugestões baseadas no tipo de carta
    if (!recognizedPattern) {
      if (['action', 'magic'].includes(type)) {
        suggestions.push('Para cartas de ação/magia, use: "Ganhe X moeda", "Receba X comida", etc.');
        suggestions.push('Para múltiplos recursos: "Ganhe X moeda e Y comida"');
      } else if (['farm', 'city'].includes(type)) {
        suggestions.push('Para cartas de fazenda/cidade, use: "Produz X comida por turno", "Fornece X material", etc.');
        suggestions.push('Para múltiplos recursos: "Produz X comida e Y material por turno"');
      }
      suggestions.push('Verifique se o texto está em português e usa números.');
      suggestions.push('Exemplos válidos: "Ganhe 2 moedas", "Produz 1 comida e 1 material por turno"');
      }

      return {
      isValid: !!recognizedPattern,
      recognizedPattern,
      parsedEffect,
      suggestions
    };
  };

  const result = validateEffect(effect, cardType);

  if (!effect.trim()) {
    return null;
  }

  return (
    <Card className="p-4 mt-4">
      <h4 className="font-semibold mb-2">Validação do Efeito</h4>

            <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">Status:</span>
          {result.isValid ? (
            <BadgeComponent variant="default" className="bg-green-100 text-green-800">
              ✅ Válido
            </BadgeComponent>
          ) : (
            <BadgeComponent variant="destructive">
              ❌ Não reconhecido
            </BadgeComponent>
          )}
                    </div>

        {result.recognizedPattern && (
          <div className="text-sm text-green-600">
            <strong>Padrão reconhecido:</strong> {result.recognizedPattern}
                  </div>
        )}

        {Object.keys(result.parsedEffect).length > 0 && (
          <div className="text-sm">
            <strong>Efeito parseado:</strong>
            <div className="mt-1 space-x-2">
              {Object.entries(result.parsedEffect).map(([key, value]) => (
                <BadgeComponent key={key} variant="outline">
                  +{value} {key}
                </BadgeComponent>
              ))}
            </div>
          </div>
        )}

        {result.suggestions.length > 0 && (
          <div className="text-sm">
            <strong>Sugestões:</strong>
            <ul className="mt-1 list-disc list-inside text-red-600">
              {result.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}; 