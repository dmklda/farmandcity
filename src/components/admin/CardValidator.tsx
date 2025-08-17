import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Badge as BadgeComponent } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { SimpleEffectType } from '../../types/card';

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
  effect_logic?: string;
}

export const CardValidator: React.FC<CardValidatorProps> = ({ effect, cardType, effect_logic }) => {
  const [testGameState, setTestGameState] = useState<any>({
    resources: { coins: 10, food: 10, materials: 10, population: 5 },
    cityGrid: Array(3).fill(Array(3).fill({ card: null })),
    farmGrid: Array(3).fill(Array(3).fill({ card: null })),
    magicGrid: Array(3).fill(Array(3).fill({ card: null })),
    hand: [],
    deck: Array(10).fill({}),
    turn: 1
  });
  const [effectResult, setEffectResult] = useState<any>(null);
  const [showEffectTester, setShowEffectTester] = useState(false);
  
  // Versão simplificada da função checkCondition para o testador
  const checkConditionForTester = (condition: string, gameState: any): boolean => {
    console.log('Verificando condição:', condition, gameState.resources);
    switch(condition) {
      case 'IF_COINS_GE_5':
        return (gameState.resources.coins || 0) >= 5;
      case 'IF_COINS_GE_10':
        return (gameState.resources.coins || 0) >= 10;
      case 'IF_POPULATION_GE_2':
        return (gameState.resources.population || 0) >= 2;
      case 'IF_CITY_GE_3':
        const cityCount = gameState.cityGrid.flat().filter((cell: any) => cell.card).length;
        return cityCount >= 3;
      case 'IF_FARMS_GE_3':
        const farmCount = gameState.farmGrid.flat().filter((cell: any) => cell.card).length;
        return farmCount >= 3;
      // Adicione mais condições conforme necessário
      default:
        console.warn('Condição não implementada no testador:', condition);
        return false;
    }
  };
  
  // Versão simplificada da função executeSimpleEffect para o testador
  const executeSimpleEffectForTester = (effect: { type: string, amount: number }, changes: any) => {
    console.log('Executando efeito:', effect.type, effect.amount);
    switch(effect.type) {
      case 'GAIN_COINS':
        changes.coins = (changes.coins || 0) + effect.amount;
        break;
      case 'GAIN_FOOD':
        changes.food = (changes.food || 0) + effect.amount;
        break;
      case 'GAIN_MATERIALS':
        changes.materials = (changes.materials || 0) + effect.amount;
        break;
      case 'GAIN_POPULATION':
        changes.population = (changes.population || 0) + effect.amount;
        break;
      case 'COST_COINS':
        changes.coins = (changes.coins || 0) - effect.amount;
        break;
      case 'COST_FOOD':
        changes.food = (changes.food || 0) - effect.amount;
        break;
      case 'COST_MATERIALS':
        changes.materials = (changes.materials || 0) - effect.amount;
        break;
      case 'COST_POPULATION':
        changes.population = (changes.population || 0) - effect.amount;
        break;
      case 'PRODUCE_COINS':
        changes.coins = (changes.coins || 0) + effect.amount;
        break;
      case 'PRODUCE_FOOD':
        changes.food = (changes.food || 0) + effect.amount;
        break;
      case 'PRODUCE_MATERIALS':
        changes.materials = (changes.materials || 0) + effect.amount;
        break;
      case 'PRODUCE_POPULATION':
        changes.population = (changes.population || 0) + effect.amount;
        break;
      case 'TRADE_FOOD_FOR_MATERIALS':
        changes.food = (changes.food || 0) - effect.amount;
        changes.materials = (changes.materials || 0) + effect.amount;
        break;
      case 'TRADE_MATERIALS_FOR_FOOD':
        changes.materials = (changes.materials || 0) - effect.amount;
        changes.food = (changes.food || 0) + effect.amount;
        break;
      case 'TRADE_COINS_FOR_MATERIALS':
        changes.coins = (changes.coins || 0) - effect.amount;
        changes.materials = (changes.materials || 0) + effect.amount;
        break;
      case 'TRADE_MATERIALS_FOR_COINS':
        changes.materials = (changes.materials || 0) - effect.amount;
        changes.coins = (changes.coins || 0) + effect.amount;
        break;
      case 'TRADE_FOOD_FOR_COINS':
        changes.food = (changes.food || 0) - effect.amount;
        changes.coins = (changes.coins || 0) + effect.amount;
        break;
      case 'TRADE_COINS_FOR_FOOD':
        changes.coins = (changes.coins || 0) - effect.amount;
        changes.food = (changes.food || 0) + effect.amount;
        break;
      case 'BOOST_ALL_FARMS_FOOD':
      case 'BOOST_ALL_CITIES_COINS':
      case 'BOOST_ALL_CITIES_MATERIALS':
      case 'BOOST_ALL_CONSTRUCTIONS':
        changes.boost = `${effect.type}:${effect.amount}`;
        break;
      // Outros efeitos podem ser adicionados conforme necessário
      default:
        // Para efeitos não implementados no testador, apenas registramos
        changes[`effect_${effect.type}`] = effect.amount;
    }
  };
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
          // // console.log('🔍 CardValidator - Pulando padrão já processado:', name, 'em posição', matchStart, '-', matchEnd);
          continue;
        }
        
        // // console.log('🔍 CardValidator - Padrão encontrado:', name);
        // // console.log('🔍 CardValidator - Match:', match);
        // // console.log('🔍 CardValidator - Match length:', match.length);
        // // console.log('🔍 CardValidator - Posição:', matchStart, '-', matchEnd);
        // // console.log('🔍 CardValidator - É bidirecional?', isBidirectional);
        
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
          
          /*// console.log('🔍 CardValidator - Efeito bidirecional:', { 
            value1, resourceType1, value2, resourceType2, 
            value3, resourceType3, value4, resourceType4 
          });*/
          
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
          
          // // console.log('🔍 CardValidator - Múltiplos recursos:', { value1, resourceType1, value2, resourceType2 });
          
          // Aplicar multiplicador para deduções
          const multiplier = isDeduction ? -1 : 1;
          // console.log('🔍 CardValidator - É dedução?', isDeduction, 'Multiplicador:', multiplier);
          
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
          
          // console.log('🔍 CardValidator - Recurso único:', { value, resourceType });
          
          // Aplicar multiplicador para deduções
          const multiplier = isDeduction ? -1 : 1;
          // console.log('🔍 CardValidator - É dedução?', isDeduction, 'Multiplicador:', multiplier);
          
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
        
        // console.log('🔍 CardValidator - Parsed effect após processamento:', parsedEffect);
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

  // Função para testar o efeito lógico
  const testEffectLogic = () => {
    if (!effect_logic) return;
    
    try {
      // Criar uma cópia do estado do jogo para testar
      const gameStateCopy = JSON.parse(JSON.stringify(testGameState));
      const changes: any = {
        coins: 0,
        food: 0,
        materials: 0,
        population: 0
      };
      
      // Processar cada parte do efeito lógico
      const effectParts = effect_logic.split(';').filter(part => part.trim());
      console.log('Partes do efeito:', effectParts);
      
      effectParts.forEach(part => {
        // Verificar se é um efeito condicional (IF_X:EFFECT_Y:Z;EFFECT_W:V ou formato antigo com |)
        if (part.startsWith('IF_')) {
          // Primeiro separamos a condição da string de efeitos
          const conditionSeparatorIndex = part.indexOf(':');
          const condition = part.substring(0, conditionSeparatorIndex);
          const restOfString = part.substring(conditionSeparatorIndex + 1);
          
          // Agora separamos os efeitos verdadeiro e falso pelo separador (';' ou '|' para compatibilidade)
          const separator = restOfString.includes(';') ? ';' : '|';
          const separatorIndex = restOfString.indexOf(separator);
          const trueEffect = separatorIndex > -1 ? restOfString.substring(0, separatorIndex) : restOfString;
          const falseEffect = separatorIndex > -1 ? restOfString.substring(separatorIndex + 1) : '';
          
          console.log('Condição:', condition, 'Efeito verdadeiro:', trueEffect, 'Efeito falso:', falseEffect);
          
          try {
            const conditionMet = checkConditionForTester(condition, gameStateCopy);
            // O formato correto é IF_CONDITION:EFFECT_TYPE:AMOUNT;EFFECT_TYPE:AMOUNT
            // Precisamos extrair o efeito completo
            let effectToApply = '';
            if (conditionMet) {
              effectToApply = trueEffect;
            } else {
              effectToApply = falseEffect;
            }
            
            console.log('Condição atendida?', conditionMet, 'Efeito a aplicar completo:', effectToApply);
            
            if (effectToApply) {
              // Extrair tipo e quantidade do efeito
              // O formato pode ser GAIN_MATERIALS:2
              const effectParts = effectToApply.split(':');
              const effectType = effectParts[0];
              const amount = parseInt(effectParts[1]) || 0;
              
              console.log('Effect parts:', effectParts, 'Effect type:', effectType, 'Amount:', amount);
              
              console.log('Tipo de efeito:', effectType, 'Quantidade:', amount);
              
              if (effectType) {
                executeSimpleEffectForTester({ 
                  type: effectType, 
                  amount: amount 
                }, changes);
              }
            }
          } catch (err) {
            console.error('Erro ao processar condição:', condition, err);
          }
        } else if (part.includes(':')) {
          // Efeito simples (EFFECT_X:Y)
          const [effectType, ...params] = part.split(':');
          if (effectType) {
            try {
              executeSimpleEffectForTester({ 
                type: effectType, 
                amount: parseInt(params[0]) || 0 
              }, changes);
            } catch (err) {
              console.error('Erro ao processar efeito simples:', effectType, err);
            }
          }
        }
      });
      
      // Limpar quaisquer chaves de objeto inválidas
      Object.keys(changes).forEach(key => {
        if (key.includes('undefined_') || typeof changes[key] === 'object') {
          delete changes[key];
        }
      });
      
      // Aplicar as mudanças ao estado de teste
      const newGameState = {
        ...gameStateCopy,
        resources: {
          ...gameStateCopy.resources,
          coins: (gameStateCopy.resources.coins || 0) + (changes.coins || 0),
          food: (gameStateCopy.resources.food || 0) + (changes.food || 0),
          materials: (gameStateCopy.resources.materials || 0) + (changes.materials || 0),
          population: (gameStateCopy.resources.population || 0) + (changes.population || 0)
        }
      };
      
      console.log('Resultado final:', changes, newGameState.resources);
      setEffectResult({
        changes,
        newState: newGameState.resources
      });
    } catch (error) {
      console.error('Erro ao processar efeito:', error);
      setEffectResult({
        error: `Erro ao processar efeito: ${error}`
      });
    }
  };

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
      
      {effect_logic && (
        <div className="mt-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Teste de Efeito Lógico</h4>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-500 text-gray-600 hover:bg-gray-100"
              onClick={() => setShowEffectTester(!showEffectTester)}
            >
              {showEffectTester ? 'Esconder' : 'Mostrar'} Testador
            </Button>
          </div>
          
          {showEffectTester && (
            <div className="mt-3 space-y-4">
              <div className="p-3 bg-gray-100 border border-gray-200 rounded-md">
                <div className="text-sm font-medium mb-2 text-gray-700">Código do Efeito:</div>
                <code className="block p-2 bg-gray-800 text-gray-100 rounded text-sm overflow-x-auto">
                  {effect_logic}
                </code>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-sm font-medium mb-1 text-gray-700">Estado Inicial:</div>
                  <div className="p-2 bg-gray-700 text-gray-100 rounded text-sm border border-gray-600">
                    <div>Moedas: {testGameState.resources.coins}</div>
                    <div>Comida: {testGameState.resources.food}</div>
                    <div>Material: {testGameState.resources.materials}</div>
                    <div>População: {testGameState.resources.population}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1 text-gray-700">Modificar Estado:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      type="number" 
                      placeholder="Moedas" 
                      value={testGameState.resources.coins}
                      onChange={(e) => setTestGameState({
                        ...testGameState,
                        resources: {
                          ...testGameState.resources,
                          coins: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                    <Input 
                      type="number" 
                      placeholder="Comida" 
                      value={testGameState.resources.food}
                      onChange={(e) => setTestGameState({
                        ...testGameState,
                        resources: {
                          ...testGameState.resources,
                          food: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                    <Input 
                      type="number" 
                      placeholder="Material" 
                      value={testGameState.resources.materials}
                      onChange={(e) => setTestGameState({
                        ...testGameState,
                        resources: {
                          ...testGameState.resources,
                          materials: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                    <Input 
                      type="number" 
                      placeholder="População" 
                      value={testGameState.resources.population}
                      onChange={(e) => setTestGameState({
                        ...testGameState,
                        resources: {
                          ...testGameState.resources,
                          population: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gray-800 hover:bg-gray-900 text-white" 
                onClick={testEffectLogic}
              >
                Testar Efeito
              </Button>
              
              {effectResult && (
                <div className="p-3 bg-gray-100 border border-gray-200 rounded-md">
                  <div className="text-sm font-medium mb-2 text-gray-700">Resultado:</div>
                  
                  {effectResult.error ? (
                    <div className="text-red-500">{effectResult.error}</div>
                  ) : (
                    <>
                      <div className="mb-2">
                        <div className="text-sm font-medium text-gray-700">Mudanças:</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {effectResult.changes.coins !== undefined && (
                            <BadgeComponent variant={effectResult.changes.coins >= 0 ? "default" : "destructive"}>
                              {effectResult.changes.coins >= 0 ? '+' : ''}{effectResult.changes.coins} moedas
                            </BadgeComponent>
                          )}
                          {effectResult.changes.food !== undefined && (
                            <BadgeComponent variant={effectResult.changes.food >= 0 ? "default" : "destructive"}>
                              {effectResult.changes.food >= 0 ? '+' : ''}{effectResult.changes.food} comida
                            </BadgeComponent>
                          )}
                          {effectResult.changes.materials !== undefined && (
                            <BadgeComponent variant={effectResult.changes.materials >= 0 ? "default" : "destructive"}>
                              {effectResult.changes.materials >= 0 ? '+' : ''}{effectResult.changes.materials} material
                            </BadgeComponent>
                          )}
                          {effectResult.changes.population !== undefined && (
                            <BadgeComponent variant={effectResult.changes.population >= 0 ? "default" : "destructive"}>
                              {effectResult.changes.population >= 0 ? '+' : ''}{effectResult.changes.population} população
                            </BadgeComponent>
                          )}
                          {Object.keys(effectResult.changes).filter(key => 
                            !['coins', 'food', 'materials', 'population'].includes(key) && 
                            typeof effectResult.changes[key] !== 'object' && 
                            effectResult.changes[key] !== undefined
                          ).map(key => (
                            <BadgeComponent key={key} variant="outline">
                              {key}: {String(effectResult.changes[key])}
                            </BadgeComponent>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700">Estado Final:</div>
                        <div className="p-2 bg-gray-700 text-gray-100 rounded text-sm mt-1 border border-gray-600">
                          <div>Moedas: {effectResult.newState.coins}</div>
                          <div>Comida: {effectResult.newState.food}</div>
                          <div>Material: {effectResult.newState.materials}</div>
                          <div>População: {effectResult.newState.population}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}; 
