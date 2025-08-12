import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GameState, GamePhase, GridCell } from '../types/gameState';
import { Resources } from '../types/resources';
import { Card, CardType } from '../types/card';
import { createEmptyGrid, shuffle, getInitialState, createComplexVictorySystem, createSimpleVictorySystem, createClassicVictorySystem, createInfiniteVictorySystem, updateVictoryConditions } from '../utils/gameUtils';
import { usePlayerCards } from './usePlayerCards';
import { usePlayerDecks } from './usePlayerDecks';
import { useGameSettings } from './useGameSettings';
import { useCards } from './useCards';
import { useStarterDeck } from './useStarterDeck';
import { useUnlockedCards } from './useUnlockedCards';
import { useCatastrophes } from './useCatastrophes';
import { useCardCopyLimits } from './useCardCopyLimits';

const DECK_LIMIT = 28;
const HAND_LIMIT = 7;
const phaseOrder: GamePhase[] = ['draw', 'action', 'build', 'production', 'end'];

// Funções de parsing melhoradas do código fornecido
function parseProduction(card: Card): Partial<Resources> {
  const effect = card.effect.description.toLowerCase();
  
  //console.log('🔍 parseProduction para:', card.name);
  //console.log('Efeito:', effect);
  
  // Padrões para produção por turno com múltiplos recursos
  const productionPatterns = [
    // Efeitos de conversão bidirecional (NOVO - DEVE VIR PRIMEIRO)
    /transforme (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) em (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) ou (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) em (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações)/i,
    /troque (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) ou (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações)/i,
    /converta (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) em (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) ou (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) em (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações)/i,
    
    // Múltiplos recursos (DEVE VIR PRIMEIRO - padrões mais específicos)
    /produz (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) e (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/,
    /produz (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) e (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) a cada turno/,
    /fornece (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) e (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/,
    /gera (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) e (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/,
    /produz (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno e (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações)/,
    
    // Efeitos de dedução por turno (NOVO)
    /custa (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/,
    /gasta (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/,
    /consome (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/,
    /deduz (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/,
    
    // Recurso único (DEVE VIR DEPOIS - padrões mais genéricos)
    /produz (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/,
    /produz (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) a cada turno/,
    /fornece (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/,
    /gera (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/,
    
    // Efeitos de população específicos
    /aumenta população em (\d+)/,
    /aumenta população máxima em (\d+)/,
    /fornece (\d+) população/,
    /população direta/,
    
    // Efeitos de reputação
    /\+(\d+) reputação/,
    /fornece (\d+) reputação/,
    /garante (\d+) reputação/,
    
    // Efeitos condicionais de produção
    /produz (\d+) (comida|comidas|moeda|moedas|material|materiais) se você tiver (\d+) ou mais/,
    /para cada (fazenda|cidade) que você tem, produz \+(\d+) (moeda|moedas|comida|comidas|material|materiais)/,
    
    // "produz X recurso" (sem especificar por turno) - DEVE VIR POR ÚLTIMO
    /produz (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações)/,
    
    // Efeitos de produção contínua
    /produção contínua de (comida|comidas|moeda|moedas|material|materiais)/,
    /produção ativada por dado/,
  ];
  
  let prod: Partial<Resources> = {};
  
  // Processar padrões em ordem de especificidade (mais específico primeiro)
  const processedRanges: Array<{start: number, end: number}> = [];
  
  for (const pattern of productionPatterns) {
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
        //console.log('✅ Pulando padrão já processado em posição', matchStart, '-', matchEnd);
        continue;
      }
      
      //console.log('✅ Padrão encontrado:', pattern);
      //console.log('Match:', match);
      //console.log('Posição:', matchStart, '-', matchEnd);
      
      // Marcar esta parte do texto como processada
      processedRanges.push({ start: matchStart, end: matchEnd });
      
      // Verificar se é efeito bidirecional (tem 8 grupos de captura)
      const isBidirectional = pattern.source.includes('transforme') || 
                             pattern.source.includes('troque') || 
                             pattern.source.includes('converta');
      
      if (isBidirectional && match.length >= 9) {
        // Padrão: "transforme X recurso1 em Y recurso2 ou Z recurso3 em W recurso4"
        const value1 = parseInt(match[1], 10);
        const resourceType1 = match[2];
        const value2 = parseInt(match[3], 10);
        const resourceType2 = match[4];
        const value3 = parseInt(match[5], 10);
        const resourceType3 = match[6];
        const value4 = parseInt(match[7], 10);
        const resourceType4 = match[8];
        
        /*console.log('🔄 Efeito bidirecional:', { 
          value1, resourceType1, value2, resourceType2, 
          value3, resourceType3, value4, resourceType4 
        });*/
        
        // Para efeitos bidirecionais, aplicar ambas as opções
        // Opção 1: X recurso1 → Y recurso2
        // Opção 2: Z recurso3 → W recurso4
        
        // Adicionar primeira opção (dedução do primeiro, adição do segundo)
        switch (resourceType1) {
          case 'comida':
          case 'comidas':
            prod.food = (prod.food || 0) - value1;
            break;
          case 'moeda':
          case 'moedas':
            prod.coins = (prod.coins || 0) - value1;
            break;
          case 'material':
          case 'materiais':
            prod.materials = (prod.materials || 0) - value1;
            break;
          case 'população':
          case 'populações':
            prod.population = (prod.population || 0) - value1;
            break;
        }
        
        switch (resourceType2) {
          case 'comida':
          case 'comidas':
            prod.food = (prod.food || 0) + value2;
            break;
          case 'moeda':
          case 'moedas':
            prod.coins = (prod.coins || 0) + value2;
            break;
          case 'material':
          case 'materiais':
            prod.materials = (prod.materials || 0) + value2;
            break;
          case 'população':
          case 'populações':
            prod.population = (prod.population || 0) + value2;
            break;
        }
        
        // Adicionar segunda opção (dedução do terceiro, adição do quarto)
        switch (resourceType3) {
          case 'comida':
          case 'comidas':
            prod.food = (prod.food || 0) - value3;
            break;
          case 'moeda':
          case 'moedas':
            prod.coins = (prod.coins || 0) - value3;
            break;
          case 'material':
          case 'materiais':
            prod.materials = (prod.materials || 0) - value3;
            break;
          case 'população':
          case 'populações':
            prod.population = (prod.population || 0) - value3;
            break;
        }
        
        switch (resourceType4) {
          case 'comida':
          case 'comidas':
            prod.food = (prod.food || 0) + value4;
            break;
          case 'moeda':
          case 'moedas':
            prod.coins = (prod.coins || 0) + value4;
            break;
          case 'material':
          case 'materiais':
            prod.materials = (prod.materials || 0) + value4;
            break;
          case 'população':
          case 'populações':
            prod.population = (prod.population || 0) + value4;
            break;
        }
        
        //console.log('🔄 Efeito bidirecional aplicado:', prod);
        continue; // Pular para o próximo padrão
      }
      
      // Verificar se é efeito de dedução
      const isDeduction = pattern.source.includes('custa') || 
                         pattern.source.includes('gasta') || 
                         pattern.source.includes('consome') || 
                         pattern.source.includes('deduz');
      const multiplier = isDeduction ? -1 : 1;
      
      //console.log('É dedução?', isDeduction, 'Multiplicador:', multiplier);
      
      // Verificar se é padrão com múltiplos recursos (tem 4 grupos de captura)
      if (match.length >= 5) {
        // Padrão: "produz X recurso1 e Y recurso2 por turno"
        const value1 = parseInt(match[1], 10);
        const resourceType1 = match[2];
        const value2 = parseInt(match[3], 10);
        const resourceType2 = match[4];
        
        //console.log('Múltiplos recursos:', { value1, resourceType1, value2, resourceType2 });
        
        // Adicionar primeiro recurso
        switch (resourceType1) {
          case 'comida':
          case 'comidas':
            prod.food = (prod.food || 0) + (value1 * multiplier);
            break;
          case 'moeda':
          case 'moedas':
            prod.coins = (prod.coins || 0) + (value1 * multiplier);
            break;
          case 'material':
          case 'materiais':
            prod.materials = (prod.materials || 0) + (value1 * multiplier);
            break;
          case 'população':
          case 'populações':
            prod.population = (prod.population || 0) + (value1 * multiplier);
            break;
        }
        
        // Adicionar segundo recurso
        switch (resourceType2) {
          case 'comida':
          case 'comidas':
            prod.food = (prod.food || 0) + (value2 * multiplier);
            break;
          case 'moeda':
          case 'moedas':
            prod.coins = (prod.coins || 0) + (value2 * multiplier);
            break;
          case 'material':
          case 'materiais':
            prod.materials = (prod.materials || 0) + (value2 * multiplier);
            break;
          case 'população':
          case 'populações':
            prod.population = (prod.population || 0) + (value2 * multiplier);
            break;
        }
      } else {
        // Padrão: "produz X recurso por turno" (recurso único)
        const value = parseInt(match[1], 10);
        const resourceType = match[2];
        
        //console.log('Recurso único:', { value, resourceType });
        
        switch (resourceType) {
          case 'comida':
          case 'comidas':
            prod.food = (prod.food || 0) + (value * multiplier);
            break;
          case 'moeda':
          case 'moedas':
            prod.coins = (prod.coins || 0) + (value * multiplier);
            break;
          case 'material':
          case 'materiais':
            prod.materials = (prod.materials || 0) + (value * multiplier);
            break;
          case 'população':
          case 'populações':
            prod.population = (prod.population || 0) + (value * multiplier);
            break;
        }
      }
    }
  }
  
  //console.log('🎯 Produção parseada:', prod);
  return prod;
}

function parseInstantEffect(card: Card): Partial<Resources> {
  const effect = card.effect.description.toLowerCase();
  const prod: Partial<Resources> = {};
  
  // Sistema de prioridade para evitar duplicação de efeitos
  let effectsProcessed = new Set<string>();
  
  // Debug específico para a carta "Magia do Crescimento Natural"
  if (card.name === 'Magia do Crescimento Natural') {
    console.log('🔍 DEBUG Magia do Crescimento Natural:');
    console.log('Efeito original:', card.effect.description);
    console.log('Efeito em lowercase:', effect);
  }

  // 1. EFEITOS DE CONVERSÃO BIDIRECIONAL (DEVE VIR PRIMEIRO)
  const bidirectionalPatterns = [
    /transforme (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) em (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) ou (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) em (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações)/i,
    /transforme (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) em (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações)/i,
  ];

  for (const pattern of bidirectionalPatterns) {
    const matches = effect.matchAll(new RegExp(pattern, 'g'));
    for (const match of matches) {
      if (match.length >= 4) {
        const fromValue = parseInt(match[1], 10);
        const fromType = match[2];
        const toValue = parseInt(match[3], 10);
        const toType = match[4];
        
        // Marcar como processado
        const effectKey = `bidirectional_${fromType}_${toType}`;
        if (effectsProcessed.has(effectKey)) continue;
        effectsProcessed.add(effectKey);
        
        // Aplicar conversão
        applyResourceChange(prod, fromType, -fromValue);
        applyResourceChange(prod, toType, toValue);
      }
    }
  }

  // 2. EFEITOS GLOBAIS (todos os jogadores)
  const globalPatterns = [
    /todos os jogadores ganham (\d+) (comida|moedas|materiais|população)/i,
    /todos os jogadores perdem (\d+) (comida|moedas|materiais|população)/i,
  ];

  for (const pattern of globalPatterns) {
    const matches = effect.matchAll(new RegExp(pattern, 'g'));
    for (const match of matches) {
      if (match.length >= 3) {
        const value = parseInt(match[1], 10);
        const resourceType = match[2];
        const isLoss = pattern.source.includes('perdem');
        
        // Marcar como processado
        const effectKey = `global_${resourceType}_${value}`;
        if (effectsProcessed.has(effectKey)) continue;
        effectsProcessed.add(effectKey);
        
        applyResourceChange(prod, resourceType, isLoss ? -value : value);
      }
    }
  }

  // 3. EFEITOS MÚLTIPLOS (ganha X e Y) - PRIORIDADE ALTA
  const multipleResourcePatterns = [
    /ganha (\d+) (população|populações) e (\d+) (material|materiais)/i,
    /ganha (\d+) (comida|comidas) e (\d+) (moeda|moedas)/i,
    /ganha (\d+) (material|materiais) e (\d+) (população|populações)/i,
    /ganha (\d+) (moeda|moedas) e (\d+) (comida|comidas)/i,
  ];

  for (const pattern of multipleResourcePatterns) {
    const matches = effect.matchAll(new RegExp(pattern, 'g'));
    for (const match of matches) {
      if (match.length >= 5) {
        const value1 = parseInt(match[1], 10);
        const resourceType1 = match[2];
        const value2 = parseInt(match[3], 10);
        const resourceType2 = match[4];
        
        // Debug específico para a carta "Magia do Crescimento Natural"
        if (card.name === 'Magia do Crescimento Natural') {
          console.log('🎯 Teste do padrão específico:');
          console.log('Padrão:', pattern.source);
          console.log('Match encontrado:', Array.from(match));
          console.log('Valor 1:', value1, 'Tipo 1:', resourceType1);
          console.log('Valor 2:', value2, 'Tipo 2:', resourceType2);
        }
        
        // Marcar como processado
        const effectKey = `multiple_${resourceType1}_${resourceType2}`;
        if (effectsProcessed.has(effectKey)) continue;
        effectsProcessed.add(effectKey);
        
        // Aplicar ambos os recursos
        applyResourceChange(prod, resourceType1, value1);
        applyResourceChange(prod, resourceType2, value2);
        
        // Se este padrão foi encontrado, pular os padrões mais genéricos
        effectsProcessed.add(`single_${resourceType1}`);
        effectsProcessed.add(`single_${resourceType2}`);
      }
    }
  }

  // 4. EFEITOS ÚNICOS (ganha X) - PRIORIDADE BAIXA
  const singleResourcePatterns = [
    /ganha (\d+) (comida|moedas|materiais|população)/i,
    /ganha (\d+) (população|populações)/i,
  ];

  for (const pattern of singleResourcePatterns) {
    const matches = effect.matchAll(new RegExp(pattern, 'g'));
    for (const match of matches) {
      if (match.length >= 3) {
        const value = parseInt(match[1], 10);
        const resourceType = match[2];
        
        // Debug específico para a carta "Magia do Crescimento Natural"
        if (card.name === 'Magia do Crescimento Natural') {
          console.log('🎯 Padrão recurso único encontrado para magia:');
          console.log('Padrão:', pattern.source);
          console.log('Match completo:', match[0]);
          console.log('Valor:', value, 'Tipo:', resourceType);
        }
        
        // Marcar como processado
        const effectKey = `single_${resourceType}`;
        if (effectsProcessed.has(effectKey)) continue;
        effectsProcessed.add(effectKey);
        
        applyResourceChange(prod, resourceType, value);
      }
    }
  }

  // 5. EFEITOS DE CAMPO (todas as suas construções) - PROCESSAMENTO DIRETO
  const fieldPatterns = [
    /todas as suas (cidades|fazendas|oficinas|construções) produzem (o triplo|o dobro|\+(\d+)) (de recursos?|de comida|de moedas|de materiais)/i,
    /todas as suas (cidades|fazendas|oficinas|construções) produzem (o triplo|o dobro|\+(\d+)) (recursos?|comida|moedas|materiais)/i,
    /todas as suas (cidades|fazendas|oficinas|construções) produzem (o triplo|o dobro|\+(\d+))/i,
    // Padrões específicos para efeitos de campo
    /todas as (fazendas|cidades|oficinas|construções) produzem \+(\d+) (comida|moedas|materiais|recursos)/i,
    /todas as (fazendas|cidades|oficinas|construções) produzem \+(\d+) (comida|moedas|materiais|recursos) neste turno/i,
    /todas as (fazendas|cidades|oficinas|construções) produzem \+(\d+) (comida|moedas|materiais|recursos) por turno/i,
    // NOVO: Padrões específicos para efeitos de campo com múltiplos recursos (DEVE VIR ANTES dos padrões simples)
    /todas as (fazendas|cidades|oficinas|construções) produzem \+(\d+) (comida|moedas|materiais|recursos) e \+(\d+) (comida|moedas|materiais|recursos)/i,
    /todas as (fazendas|cidades|oficinas|construções) produzem \+(\d+) (comida|moedas|materiais|recursos) e \+(\d+) (comida|moedas|materiais|recursos) neste turno/i,
    /todas as (fazendas|cidades|oficinas|construções) produzem \+(\d+) (comida|moedas|materiais|recursos) e \+(\d+) (comida|moedas|materiais|recursos) por turno/i,
  ];

  for (const pattern of fieldPatterns) {
    const matches = effect.matchAll(new RegExp(pattern, 'g'));
    for (const match of matches) {
      if (match.length >= 3) {
        const buildingType = match[1];
        const multiplierText = match[2];
        let multiplier = 1;
        let duration = 1; // Padrão: 1 turno

        // Debug específico para a carta "Bênção da Terra"
        if (card.name === 'Bênção da Terra') {
          console.log('🎯 Padrão de campo encontrado para Bênção da Terra:');
          console.log('Padrão:', pattern.source);
          console.log('Match completo:', match[0]);
          console.log('Tipo de construção:', buildingType);
          console.log('Texto do multiplicador:', multiplierText);
          console.log('Match array:', Array.from(match));
        }
        
        // Debug específico para a carta "Chuva Mágica"
        if (card.name === 'Chuva Mágica') {
          console.log('🎯 Padrão de campo encontrado para Chuva Mágica:');
          console.log('Padrão:', pattern.source);
          console.log('Match completo:', match[0]);
          console.log('Tipo de construção:', buildingType);
          console.log('Texto do multiplicador:', multiplierText);
          console.log('Match array:', Array.from(match));
        }

        // Verificar se é padrão com múltiplos recursos (6 grupos de captura)
        if (match.length >= 7) {
          // Padrão: "produzem +X recurso1 e +Y recurso2"
          const value1 = parseInt(match[2], 10);
          const resourceType1 = match[3];
          const value2 = parseInt(match[4], 10);
          const resourceType2 = match[5];
          
          console.log('🎯 Efeito de campo com múltiplos recursos detectado:');
          console.log('Tipo de construção:', buildingType);
          console.log('Recurso 1:', value1, resourceType1);
          console.log('Recurso 2:', value2, resourceType2);
          
          // Aplicar efeito de campo múltiplo diretamente
          if (buildingType === 'fazendas' || buildingType === 'fazenda') {
            // Simular 3 fazendas em jogo (valor padrão para teste)
            const farmCount = 3;
            applyResourceChange(prod, resourceType1, value1 * farmCount);
            applyResourceChange(prod, resourceType2, value2 * farmCount);
          }
        } else {
          // Padrão simples: "produzem +X recurso"
          if (multiplierText.includes('triplo')) multiplier = 3;
          else if (multiplierText.includes('dobro')) multiplier = 2;
          else if (multiplierText.includes('+')) {
            const value = multiplierText.match(/(\d+)/);
            if (value) multiplier = parseInt(value[1], 10);
          }

          // Verificar duração
          const durationMatch = effect.match(/por (\d+) turno/);
          if (durationMatch) duration = parseInt(durationMatch[1], 10);

          // Aplicar efeito de campo simples diretamente
          if (buildingType === 'fazendas' || buildingType === 'fazenda') {
            // Simular 3 fazendas em jogo (valor padrão para teste)
            const farmCount = 3;
            if (match[3] === 'comida' || match[3] === 'comidas') {
              applyResourceChange(prod, 'comida', multiplier * farmCount);
            } else if (match[3] === 'materiais' || match[3] === 'material') {
              applyResourceChange(prod, 'materiais', multiplier * farmCount);
            } else if (match[3] === 'moedas' || match[3] === 'moeda') {
              applyResourceChange(prod, 'moedas', multiplier * farmCount);
            }
          }
        }
      }
    }
  }

  return prod;
}

function parseDiceProduction(card: Card): { prod: Partial<Resources>; dice: number } | null {
  const effect = card.effect.description.toLowerCase();
  
  // Padrões para produção por dado com múltiplos recursos
  const dicePatterns = [
    // Múltiplos recursos por dado
    /produz (\d+) (comida|moeda|material) e (\d+) (comida|moeda|material|reputação) quando ativado por dado (\d+)/,
    /produz (\d+) (comida|moeda|material) e (\d+) (comida|moeda|material|reputação) se dado for (\d+)/,
    /produz (\d+) (comida|moeda|material) e (\d+) (comida|moeda|material|reputação) com dado (\d+)/,
    
    // Recurso único por dado
    /produz (\d+) (comida|moeda|material) quando ativado por dado (\d+)/,
    /produz (\d+) (comida|moeda|material) se dado for (\d+)/,
    /produz (\d+) (comida|moeda|material) com dado (\d+)/,
    /produz (\d+) (comida|moeda|material) quando dado = (\d+)/,
    
    // Produção com dado específico
    /produção com dado (\d+)/,
    /produção ativada por dado/,
  ];
  
  for (const pattern of dicePatterns) {
    const match = effect.match(pattern);
  if (match) {
      // Verificar se é padrão com múltiplos recursos (tem 5 grupos de captura)
      if (match.length >= 6) {
        // Padrão: "produz X recurso1 e Y recurso2 quando ativado por dado Z"
        const value1 = parseInt(match[1], 10);
        const type1 = match[2];
        const value2 = parseInt(match[3], 10);
        const type2 = match[4];
        const dice = parseInt(match[5], 10);
        
        let prod: Partial<Resources> = {};
        
        // Adicionar primeiro recurso
        if (type1 === 'comida') prod.food = value1;
        if (type1 === 'moeda') prod.coins = value1;
        if (type1 === 'material') prod.materials = value1;
        
        // Adicionar segundo recurso
        if (type2 === 'comida') prod.food = (prod.food || 0) + value2;
        if (type2 === 'moeda') prod.coins = (prod.coins || 0) + value2;
        if (type2 === 'material') prod.materials = (prod.materials || 0) + value2;
        if (type2 === 'reputação') prod.reputation = value2;
        
        return { prod, dice };
      } else {
        // Padrão: "produz X recurso quando ativado por dado Y"
    const value = parseInt(match[1], 10);
    const type = match[2];
    const dice = parseInt(match[3], 10);
        
    let prod: Partial<Resources> = {};
    if (type === 'comida') prod.food = value;
    if (type === 'moeda') prod.coins = value;
    if (type === 'material') prod.materials = value;
        
    return { prod, dice };
  }
    }
  }
  
  return null;
}

function canPlayCard(resources: Resources, cost: Resources) {
  return (
    (resources.coins ?? 0) >= (cost.coins ?? 0) &&
    (resources.food ?? 0) >= (cost.food ?? 0) &&
    (resources.materials ?? 0) >= (cost.materials ?? 0) &&
    (resources.population ?? 0) >= (cost.population ?? 0)
  );
}

// Função para calcular produção por turno detalhada
function getProductionPerTurnDetails(farmGrid: GridCell[][], cityGrid: GridCell[][]) {
  const prod: Resources = { coins: 0, food: 0, materials: 0, population: 0 };
  const details: { coins: string[], food: string[], materials: string[], population: string[], reputation: string[] } = {
    coins: [], food: [], materials: [], population: [], reputation: []
  };
  
  const allCells = [
    ...farmGrid.flat(),
    ...cityGrid.flat(),
  ];
  
  allCells.forEach((cell) => {
    if (!cell.card) return;
    
    // Verificar se há cartas empilhadas
    const cards = cell.stack ? [cell.card, ...cell.stack] : [cell.card];
    const level = cards.length;
    
    // Só produção automática por turno
    const effect = cell.card.effect.description.toLowerCase();
    if (/por turno/.test(effect) && !/dado/.test(effect)) {
      const p = calculateStackedProduction(cards);
      Object.entries(p).forEach(([key, value]) => {
        if (value && value > 0) {
          if (key === 'reputation') {
            prod.reputation = (prod.reputation || 0) + value;
            const levelText = level > 1 ? ` (Nível ${level})` : '';
            details.reputation!.push(`${cell.card!.name}${levelText}: +${value}`);
          } else {
          prod[key as keyof Resources] += value;
            const levelText = level > 1 ? ` (Nível ${level})` : '';
            details[key as keyof Resources].push(`${cell.card!.name}${levelText}: +${value}`);
          }
        }
      });
    }
  });
  
  return { prod, details };
}

// Função para verificar se uma carta pode ser empilhada em outra
function canStackCard(newCard: Card, existingCard: Card): boolean {
  // Só cartas de construção podem ser empilhadas
  const stackableTypes = ['farm', 'city', 'landmark', 'event'];
  if (!stackableTypes.includes(newCard.type) || !stackableTypes.includes(existingCard.type)) {
    return false;
  }
  
  // Cartas devem ser do mesmo tipo
  if (newCard.type !== existingCard.type) {
    return false;
  }
  
  // Cartas devem ter o mesmo nome (mesma carta)
  if (newCard.name !== existingCard.name) {
    return false;
  }
  
  return true;
}



// Função para calcular produção de carta empilhada com multiplicador balanceado
function calculateStackedProduction(cards: Card[]): Partial<Resources> {
  if (cards.length === 0) return {};
  
  const baseProduction = parseProduction(cards[0]);
  // Multiplicador balanceado: 1 carta = 1x, 2 cartas = 1.5x, 3 cartas = 2x, 4 cartas = 2.5x
  const multiplier = 1 + (cards.length - 1) * 0.5;
  
  const stackedProduction: Partial<Resources> = {};
  Object.entries(baseProduction).forEach(([key, value]) => {
    if (value && value > 0) {
      stackedProduction[key as keyof Resources] = Math.round(value * multiplier);
    }
  });
  
  return stackedProduction;
}

// Função para calcular efeito de carta empilhada com multiplicador balanceado
function calculateStackedEffect(cards: Card[]): Partial<Resources> {
  if (cards.length === 0) return {};
  
  const baseEffect = parseInstantEffect(cards[0]);
  // Multiplicador balanceado: 1 carta = 1x, 2 cartas = 1.5x, 3 cartas = 2x, 4 cartas = 2.5x
  const multiplier = 1 + (cards.length - 1) * 0.5;
  
  const stackedEffect: Partial<Resources> = {};
  Object.entries(baseEffect).forEach(([key, value]) => {
    if (value && value > 0) {
      stackedEffect[key as keyof Resources] = Math.round(value * multiplier);
    }
  });
  
  return stackedEffect;
}

// Função para calcular o nível de uma carta baseado no número de cartas empilhadas
function calculateCardLevel(cards: Card[]): number {
  return Math.min(cards.length, 4); // Máximo nível 4
}

// Função para processar efeitos dos eventos ativos
function processEventEffects(eventGrid: GridCell[][]): Partial<Resources> {
  let effect: Partial<Resources> = {};
  let details: string[] = [];
  
  // Processar todos os eventos ativos
  eventGrid.flat().forEach(cell => {
    if (cell.card && cell.card.type === 'event') {
      const eventEffect = parseInstantEffect(cell.card);
      console.log('🎭 Processando evento:', {
        nome: cell.card.name,
        efeito: cell.card.effect.description,
        efeitoParseado: eventEffect
      });
      
      // Acumular efeitos
      Object.entries(eventEffect).forEach(([key, value]) => {
        if (value) {
          effect[key as keyof Resources] = (effect[key as keyof Resources] || 0) + value;
          if (value > 0) {
            details.push(`+${value} ${key}`);
          } else {
            details.push(`${value} ${key}`);
          }
        }
      });
    }
  });
  
  if (details.length > 0) {
    //console.log('🎭 Efeitos dos eventos aplicados:', details);
  }
  
  return effect;
}

// Interfaces para efeitos especiais
interface CardCreationEffect {
  type: string;
  amount: number;
}

interface FieldEffect {
  type: string;
  multiplier: number;
  duration: number;
  resourceType?: string;
  isMultiple?: boolean;
  secondResource?: { value: number; type: string };
}

interface TriggerEffect {
  trigger: string;
  effect: string;
  value: number;
}

interface ConditionalEffect {
  condition: string;
  effect: string;
  value: number;
}

interface CostReductionEffect {
  type: string;
  amount: number;
}

interface SpecialEffectsResult {
  cardCreation: CardCreationEffect[];
  fieldEffects: FieldEffect[];
  triggerEffects: TriggerEffect[];
  conditionalEffects: ConditionalEffect[];
  costReductions: CostReductionEffect[];
}

// Função para processar efeitos especiais das cartas
function processSpecialEffects(card: Card, gameState: GameState): SpecialEffectsResult {
  const effect = card.effect.description.toLowerCase();
  const result: SpecialEffectsResult = {
    cardCreation: [],
    fieldEffects: [],
    triggerEffects: [],
    conditionalEffects: [],
    costReductions: []
  };

  // 1. EFEITOS DE CRIAÇÃO DE CARTAS
  const creationPatterns = [
    /cria uma carta de (city|farm|magic|action|defense|trap) do seu deck/i,
    /cria (\d+) carta de (city|farm|magic|action|defense|trap) do seu deck/i,
    /cria (\d+) cartas de (city|farm|magic|action|defense|trap) do seu deck/i,
  ];

  for (const pattern of creationPatterns) {
    const match = effect.match(pattern);
    if (match) {
      const amount = match[1] ? parseInt(match[1], 10) : 1;
      const cardType = match[match[1] ? 2 : 1];
      result.cardCreation.push({ type: cardType, amount });
    }
  }

  // 2. EFEITOS DE CAMPO (todas as suas construções)
  const fieldPatterns = [
    /todas as suas (cidades|fazendas|oficinas|construções) produzem (o triplo|o dobro|\+(\d+)) (de recursos?|de comida|de moedas|de materiais)/i,
    /todas as suas (cidades|fazendas|oficinas|construções) produzem (o triplo|o dobro|\+(\d+)) (recursos?|comida|moedas|materiais)/i,
    /todas as suas (cidades|fazendas|oficinas|construções) produzem (o triplo|o dobro|\+(\d+))/i,
    // Padrões específicos para efeitos de campo
    /todas as (fazendas|cidades|oficinas|construções) produzem \+(\d+) (comida|moedas|materiais|recursos)/i,
    /todas as (fazendas|cidades|oficinas|construções) produzem \+(\d+) (comida|moedas|materiais|recursos) neste turno/i,
    /todas as (fazendas|cidades|oficinas|construções) produzem \+(\d+) (comida|moedas|materiais|recursos) por turno/i,
    // NOVO: Padrões específicos para efeitos de campo com múltiplos recursos (DEVE VIR ANTES dos padrões simples)
    /todas as (fazendas|cidades|oficinas|construções) produzem \+(\d+) (comida|moedas|materiais|recursos) e \+(\d+) (comida|moedas|materiais|recursos)/i,
    /todas as (fazendas|cidades|oficinas|construções) produzem \+(\d+) (comida|moedas|materiais|recursos) e \+(\d+) (comida|moedas|materiais|recursos) neste turno/i,
    /todas as (fazendas|cidades|oficinas|construções) produzem \+(\d+) (comida|moedas|materiais|recursos) e \+(\d+) (comida|moedas|materiais|recursos) por turno/i,
  ];

  for (const pattern of fieldPatterns) {
    const matches = effect.matchAll(new RegExp(pattern, 'g'));
    for (const match of matches) {
      if (match.length >= 3) {
        const buildingType = match[1];
        const multiplierText = match[2];
        
        // Debug específico para a carta "Bênção da Terra"
        if (card.name === 'Bênção da Terra') {
          console.log('🎯 Padrão de campo encontrado para Bênção da Terra:');
          console.log('Padrão:', pattern.source);
          console.log('Match completo:', match[0]);
          console.log('Tipo de construção:', buildingType);
          console.log('Texto do multiplicador:', multiplierText);
          console.log('Match array:', Array.from(match));
        }
        
        // Debug específico para a carta "Chuva Mágica"
        if (card.name === 'Chuva Mágica') {
          console.log('🎯 Padrão de campo encontrado para Chuva Mágica:');
          console.log('Padrão:', pattern.source);
          console.log('Match completo:', match[0]);
          console.log('Tipo de construção:', buildingType);
          console.log('Texto do multiplicador:', multiplierText);
          console.log('Match array:', Array.from(match));
        }
        
        // Efeitos de campo são processados separadamente
        //console.log('🏗️ Efeito de campo detectado:', match[0]);
      }
    }
  }

  return result;
}

// Função para aplicar efeitos de campo
function applyFieldEffects(fieldEffects: FieldEffect[], gameState: GameState): Partial<Resources> {
  let bonus: Partial<Resources> = {};

  for (const effect of fieldEffects) {
    const { type, multiplier, duration, isMultiple, secondResource } = effect;
    
    // Contar cartas do tipo especificado
    let cardCount = 0;
    
    if (type === 'cidades' || type === 'cidade') {
      cardCount = gameState.cityGrid.flat().filter(cell => cell.card).length;
    } else if (type === 'fazendas' || type === 'fazenda') {
      cardCount = gameState.farmGrid.flat().filter(cell => cell.card).length;
    } else if (type === 'oficinas' || type === 'oficina') {
      // Contar cartas de oficina (material)
      cardCount = gameState.cityGrid.flat().filter(cell => cell.card && cell.card.type === 'city').length;
    } else if (type === 'construções' || type === 'construção') {
      cardCount = gameState.cityGrid.flat().filter(cell => cell.card).length + 
                  gameState.farmGrid.flat().filter(cell => cell.card).length;
    }

    // Aplicar bônus baseado no tipo de construção
    if (type === 'cidades' || type === 'cidade') {
      bonus.coins = (bonus.coins || 0) + (cardCount * multiplier);
      bonus.materials = (bonus.materials || 0) + (cardCount * multiplier);
    } else if (type === 'fazendas' || type === 'fazenda') {
      bonus.food = (bonus.food || 0) + (cardCount * multiplier);
      
      // Se for efeito múltiplo, aplicar o segundo recurso
      if (isMultiple && secondResource) {
        if (secondResource.type === 'material' || secondResource.type === 'materiais') {
          bonus.materials = (bonus.materials || 0) + (cardCount * secondResource.value);
        } else if (secondResource.type === 'comida' || secondResource.type === 'comidas') {
          bonus.food = (bonus.food || 0) + (cardCount * secondResource.value);
        } else if (secondResource.type === 'moeda' || secondResource.type === 'moedas') {
          bonus.coins = (bonus.coins || 0) + (cardCount * secondResource.value);
        }
      }
    } else if (type === 'oficinas' || type === 'oficina') {
      bonus.materials = (bonus.materials || 0) + (cardCount * multiplier);
    } else if (type === 'construções' || type === 'construção') {
      bonus.coins = (bonus.coins || 0) + (cardCount * multiplier);
      bonus.materials = (bonus.materials || 0) + (cardCount * multiplier);
      bonus.food = (bonus.food || 0) + (cardCount * multiplier);
    }
  }

  return bonus;
}

// Função para verificar condições de efeitos condicionais
function checkConditionalEffects(conditionalEffects: ConditionalEffect[], gameState: GameState): Partial<Resources> {
  let bonus: Partial<Resources> = {};

  for (const effect of conditionalEffects) {
    const { condition, effect: resourceType, value } = effect;
    
    let conditionMet = false;
    
    if (condition === 'cidades') {
      const cityCount = gameState.cityGrid.flat().filter(cell => cell.card).length;
      conditionMet = cityCount >= 3; // Exemplo: 3 ou mais cidades
    } else if (condition === 'fazendas') {
      const farmCount = gameState.farmGrid.flat().filter(cell => cell.card).length;
      conditionMet = farmCount >= 2; // Exemplo: 2 ou mais fazendas
    } else if (condition === 'materiais') {
      conditionMet = (gameState.resources.materials || 0) >= 5; // Exemplo: 5 ou mais materiais
    } else if (condition === 'moedas') {
      conditionMet = (gameState.resources.coins || 0) >= 3; // Exemplo: 3 ou mais moedas
    } else if (condition === 'comida') {
      conditionMet = (gameState.resources.food || 0) >= 4; // Exemplo: 4 ou mais comida
    }

    if (conditionMet) {
      applyResourceChange(bonus, resourceType, value);
    }
  }

  return bonus;
}

// Função auxiliar para aplicar mudanças de recursos
function applyResourceChange(prod: Partial<Resources>, resourceType: string, value: number) {
  console.log('🔧 applyResourceChange chamada:', { resourceType, value, prodAntes: { ...prod } });
  
  switch (resourceType.toLowerCase()) {
    case 'comida':
    case 'comidas':
    case 'alimentos':
      prod.food = (prod.food || 0) + value;
      break;
    case 'moeda':
    case 'moedas':
      prod.coins = (prod.coins || 0) + value;
      break;
    case 'material':
    case 'materiais':
      prod.materials = (prod.materials || 0) + value;
      break;
    case 'população':
    case 'populações':
      prod.population = (prod.population || 0) + value;
      break;
  }
  
  console.log('🔧 applyResourceChange resultado:', { prodDepois: { ...prod } });
}

export function useGameState() {
  // Hooks para dados do Supabase
  const { playerCards, loading: cardsLoading } = usePlayerCards();
  const { activeDeck, loading: decksLoading } = usePlayerDecks();
  const { settings: gameSettings, loading: settingsLoading } = useGameSettings();
  const { cards: supabaseCards, loading: allCardsLoading } = useCards();
  const { starterDeck, loading: starterDeckLoading } = useStarterDeck();
  const { unlockedCards, hasCard, loading: unlockedCardsLoading } = useUnlockedCards();
  const { generateRandomCatastrophe, applyCatastropheEffect } = useCatastrophes();
  const { validateCompleteDeck, canAddCardToDeck } = useCardCopyLimits();

  // Estado de loading do jogo
  const [gameLoading, setGameLoading] = useState(true);

  // --- ESTADO PRINCIPAL ---
  const [customDeck, setCustomDeck] = useState<Card[]>([]);
  const [actionUsedThisTurn, setActionUsedThisTurn] = useState(false);
  const [pendingDefense, setPendingDefense] = useState<Card | null>(null);
  
  const getActiveDeck = useCallback(() => {
    //console.log('=== DEBUG: getActiveDeck chamado ===');
    //console.log('activeDeck:', activeDeck);
    //console.log('activeDeck?.cards:', activeDeck?.cards);
    //console.log('activeDeck?.cards?.length:', activeDeck?.cards?.length);
    //console.log('playerCards:', playerCards.length);
    //console.log('starterDeck:', starterDeck.length);
    
    // Prioridade: deck ativo do usuário
    if (activeDeck && activeDeck.cards && activeDeck.cards.length > 0) {
      //console.log(`✅ Usando deck ativo: ${activeDeck.name} com ${activeDeck.cards.length} cartas`);
      //console.log('Cartas do deck ativo:', activeDeck.cards.map(c => c.name));
      const result = activeDeck.cards.slice(0, DECK_LIMIT);
      //console.log('Resultado do deck ativo:', result.length, 'cartas');
      return result;
    }
    
    // Fallback: cartas do jogador
    if (playerCards.length > 0) {
      //console.log(`🔄 Usando cartas do jogador: ${playerCards.length} cartas`);
      const result = shuffle([...playerCards]).slice(0, DECK_LIMIT);
      //console.log('Resultado das cartas do jogador:', result.length, 'cartas');
      return result;
    }
    
    // Fallback final: starter deck
    if (starterDeck.length > 0) {
      //console.log(`🔄 Usando starter deck: ${starterDeck.length} cartas`);
      const result = shuffle([...starterDeck]).slice(0, DECK_LIMIT);
      //console.log('Resultado do starter deck:', result.length, 'cartas');
      return result;
    }
    
    //console.log('❌ Nenhuma carta disponível');
    return [];
  }, [activeDeck, playerCards, starterDeck]);

  // Função para salvar estado do jogo
  const saveGameState = useCallback((gameState: GameState) => {
    try {
      const gameData = {
        ...gameState,
        timestamp: Date.now(),
        deckActiveId: activeDeck?.id || null
      };
      localStorage.setItem('famand_gameState', JSON.stringify(gameData));
      /*console.log('🎮 Estado do jogo salvo:', {
        turn: gameState.turn,
        phase: gameState.phase,
        resources: gameState.resources,
        deckLength: gameState.deck.length,
        handLength: gameState.hand.length
      });*/
    } catch (error) {
      console.error('Erro ao salvar estado do jogo:', error);
    }
  }, [activeDeck?.id]);

  // Função para carregar estado do jogo
  const loadGameState = useCallback(() => {
    try {
      const savedState = localStorage.getItem('famand_gameState');
      
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Verificar se o estado é válido e não muito antigo (24 horas)
        const isRecent = Date.now() - parsedState.timestamp < 24 * 60 * 60 * 1000;
        const isSameDeck = parsedState.deckActiveId === activeDeck?.id;
        
        if (isRecent && isSameDeck) {
          console.log('🎮 Estado salvo encontrado, turno:', parsedState.turn);
          
          // Retornar o estado sem o sistema de vitória para que seja aplicado o correto
          const { victorySystem, ...stateWithoutVictory } = parsedState;
          return stateWithoutVictory;
        } else {
          console.log('🎮 Estado ignorado:', !isRecent ? 'antigo' : 'deck diferente');
          localStorage.removeItem('famand_gameState');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar estado do jogo:', error);
      localStorage.removeItem('famand_gameState');
    }
    return null;
  }, [activeDeck?.id]);

  const [game, setGame] = useState<GameState>(() => {
    // Estado inicial com recursos padrão
    const initialState = getInitialState([]);
    initialState.resources = { coins: 3, food: 2, materials: 2, population: 2 };
    // Sistema de vitória será definido baseado no modo selecionado
    /*console.log('🎮 Estado inicial do jogo criado:', {
      deckLength: initialState.deck.length,
      handLength: initialState.hand.length,
      deckCards: initialState.deck.map(c => c.name)
    });*/ 
    return initialState;
  });
  
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedGrid, setSelectedGrid] = useState<'farm' | 'city' | 'event' | 'landmark' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [productionSummary, setProductionSummary] = useState<string | null>(null);
  const [actionSummary, setActionSummary] = useState<string | null>(null);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [diceUsed, setDiceUsed] = useState<boolean>(false);
  const [diceProductionSummary, setDiceProductionSummary] = useState<string | null>(null);
  const [activatedCards, setActivatedCards] = useState<Record<string, number>>({}); // cardId -> diceNumber
  const [victory, setVictory] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [discardMode, setDiscardMode] = useState(false);
  const [defeat, setDefeat] = useState<string | null>(null);
  const [builtThisTurn, setBuiltThisTurn] = useState({ farm: false, city: false });
  const [actionThisTurn, setActionThisTurn] = useState(false);
  const [discardedCards, setDiscardedCards] = useState<Card[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [deckReshuffled, setDeckReshuffled] = useState(false); // Para rastrear se o deck foi rebaralhado no modo infinito

  // Função para adicionar entrada ao histórico removendo duplicatas
  const addToHistory = (entry: string) => {
    setHistory(prev => {
      const newHistory = [...prev, entry];
      // Remover duplicatas consecutivas
      const filteredHistory = newHistory.filter((item, index, array) => {
        if (index === 0) return true;
        return item !== array[index - 1];
      });
      // Manter apenas as últimas 10 entradas para evitar lista muito longa
      return filteredHistory.slice(-10);
    });
  };
  const [builtCountThisTurn, setBuiltCountThisTurn] = useState(0);
  const [discardedThisTurn, setDiscardedThisTurn] = useState(false);
  const [lastDrawn, setLastDrawn] = useState<string | undefined>(undefined);
  const [landmarkBuiltThisTurn, setLandmarkBuiltThisTurn] = useState(false);

  // Atualizar recursos e sistema de vitória quando as configurações carregarem
  useEffect(() => {
    // Aguardar configurações carregarem completamente
    if (!settingsLoading && gameSettings) {
      console.log('🎮 Configurando jogo com modo:', gameSettings.victoryMode, 'valor:', gameSettings.victoryValue);
      setGame(prev => {
        let victorySystem;
        
        // Configurar sistema de vitória baseado no modo
        if (gameSettings.victoryMode === 'complex') {
          console.log('🎮 Usando modo complexo');
          victorySystem = createComplexVictorySystem();
        } else if (gameSettings.victoryMode === 'classic') {
          console.log('🎮 Usando modo clássico');
          victorySystem = createClassicVictorySystem();
        } else if (gameSettings.victoryMode === 'infinite') {
          console.log('🎮 Usando modo infinito');
          victorySystem = createInfiniteVictorySystem();
        } else if (gameSettings.victoryMode === 'landmarks') {
          console.log('🎮 Usando modo landmarks');
          victorySystem = createSimpleVictorySystem();
          victorySystem.conditions[0].category = 'landmarks';
          victorySystem.conditions[0].name = 'Marcos Históricos';
          victorySystem.conditions[0].description = `Construa ${gameSettings.victoryValue} marcos históricos`;
          victorySystem.conditions[0].target = gameSettings.victoryValue;
        } else if (gameSettings.victoryMode === 'reputation') {
          console.log('🎮 Usando modo reputação');
          victorySystem = createSimpleVictorySystem();
          victorySystem.conditions[0].category = 'reputation';
          victorySystem.conditions[0].name = 'Reputação';
          victorySystem.conditions[0].description = `Alcance ${gameSettings.victoryValue} pontos de reputação`;
          victorySystem.conditions[0].target = gameSettings.victoryValue;
        } else if (gameSettings.victoryMode === 'elimination') {
          console.log('🎮 Usando modo eliminação');
          victorySystem = createSimpleVictorySystem();
          victorySystem.conditions[0].category = 'survival';
          victorySystem.conditions[0].name = 'Sobrevivência';
          victorySystem.conditions[0].description = `Sobreviva ${gameSettings.victoryValue} turnos`;
          victorySystem.conditions[0].target = gameSettings.victoryValue;
        } else if (gameSettings.victoryMode === 'resources') {
          console.log('🎮 Usando modo recursos');
          victorySystem = createSimpleVictorySystem();
          victorySystem.conditions[0].category = 'coins';
          victorySystem.conditions[0].name = 'Prosperidade';
          victorySystem.conditions[0].description = `Acumule ${gameSettings.victoryValue} moedas`;
          victorySystem.conditions[0].target = gameSettings.victoryValue;
        } else if (gameSettings.victoryMode === 'production') {
          console.log('🎮 Usando modo produção');
          victorySystem = createSimpleVictorySystem();
          victorySystem.conditions[0].category = 'production';
          victorySystem.conditions[0].name = 'Produção';
          victorySystem.conditions[0].description = `Produza ${gameSettings.victoryValue} recursos por turno`;
          victorySystem.conditions[0].target = gameSettings.victoryValue;
        } else {
          console.log('🎮 Usando modo simples padrão:', gameSettings.victoryMode);
          victorySystem = createSimpleVictorySystem();
        }
        
        console.log('🎮 Victory system configurado:', victorySystem.mode, 'condições:', victorySystem.conditions.length);
        
        return {
        ...prev,
          resources: gameSettings.defaultStartingResources,
          victorySystem
        };
      });
    } else if (!settingsLoading) {
      console.log('🎮 Usando configurações padrão (sem settings)');
      // Se não há configurações, dar recursos básicos e sistema simples
      setGame(prev => ({
        ...prev,
        resources: {
          coins: 3,
          food: 2,
          materials: 2,
          population: 2
        },
        victorySystem: createSimpleVictorySystem()
      }));
    }
  }, [settingsLoading, gameSettings]);

  // Atualizar deck quando cartas ou deck ativo carregarem
  useEffect(() => {
    //console.log('=== DEBUG: useEffect para atualizar deck executado ===');
    //console.log('cardsLoading:', cardsLoading);
    //console.log('decksLoading:', decksLoading);
    //console.log('starterDeckLoading:', starterDeckLoading);
    //console.log('activeDeck:', activeDeck);
    //console.log('playerCards.length:', playerCards.length);
    //console.log('starterDeck.length:', starterDeck.length);
    
    // Aguardar TODOS os loadings terminarem E ter um deck ativo válido
    if (!cardsLoading && !decksLoading && !starterDeckLoading) {
      //console.log('Todos os loadings finalizados, verificando deck ativo...');
      
      // Se não há deck ativo ainda, aguardar
      if (!activeDeck || !activeDeck.cards || activeDeck.cards.length === 0) {
        //console.log('⏳ Aguardando deck ativo carregar...');
        setGameLoading(true);
        return;
      }
      
      // Verificar se já há um estado salvo para este deck
      const savedState = loadGameState();
      
      if (savedState) {
        console.log('🎮 Estado salvo encontrado, restaurando jogo...');
        setGame(savedState);
        setGameLoading(false);
        return;
      }
      
      console.log('🆕 Inicializando novo jogo...');
      const newDeck = getActiveDeck();
      //console.log('Novo deck obtido:', newDeck.length, 'cartas');
      //console.log('Cartas do deck:', newDeck.map(c => c.name));
      
      if (newDeck.length > 0) {
        const shuffledDeck = shuffle([...newDeck]);
        const initialHand = shuffledDeck.slice(0, 5);
        
        /*console.log('Atualizando jogo com:', {
          deckSize: shuffledDeck.length,
          handSize: initialHand.length,
          handCards: initialHand.map(c => c.name)
        });*/
        
        setGame(prev => {
          const newState = {
            ...prev,
            deck: shuffledDeck.slice(5), // Remover as 5 cartas da mão inicial
            hand: initialHand
          };
          /*console.log('🎮 setGame chamado - novo estado:', {
            deckLength: newState.deck.length,
            handLength: newState.hand.length,
            deckCards: newState.deck.map(c => c.name)
          });*/
          //console.log('🎮 setGame - estado anterior:', {
          //  deckLength: prev.deck.length,
          //  handLength: prev.hand.length
          //});
          //console.log('🎮 setGame - hand cards:', newState.hand.map(c => c.name));
          return newState;
        });
        
        // Verificar se o estado foi atualizado
        setTimeout(() => {
          /*console.log('🎮 Verificação pós-setGame:', {
            gameHandLength: game.hand.length,
            gameDeckLength: game.deck.length
          });*/
        }, 100);
        
        //console.log('✅ Jogo atualizado - novo deck size:', shuffledDeck.slice(5).length);
        //console.log('✅ Jogo atualizado - nova hand size:', initialHand.length);
        
        setGameLoading(false);
      } else {
        //console.log('❌ Nenhuma carta disponível para o deck');
        setGameLoading(false);
      }
    } else {
      //console.log('⏳ Ainda carregando:', { cardsLoading, decksLoading, starterDeckLoading });
      setGameLoading(true);
    }
  }, [cardsLoading, decksLoading, starterDeckLoading, activeDeck, playerCards, starterDeck, getActiveDeck]);

  // Salvar estado do jogo automaticamente quando ele mudar
  useEffect(() => {
    if (!gameLoading && game && activeDeck) {
      // Debounce para evitar salvar muito frequentemente
      const timeoutId = setTimeout(() => {
        // Garantir que todos os dados estão atualizados antes de salvar
        const currentGameState = {
          ...game,
          // Garantir que os recursos estão corretos
          resources: {
            coins: game.resources.coins || 0,
            food: game.resources.food || 0,
            materials: game.resources.materials || 0,
            population: game.resources.population || 0,
          },
          // Garantir que as estatísticas estão corretas
          playerStats: {
            reputation: game.playerStats.reputation || 0,
            totalProduction: game.playerStats.totalProduction || 0,
            buildings: game.playerStats.buildings || 0,
            landmarks: game.playerStats.landmarks || 0,
          },
          // Garantir que o turno e fase estão corretos
          turn: game.turn || 0,
          phase: game.phase || 'draw',
          // Garantir que os grids estão corretos
          farmGrid: game.farmGrid || [],
          cityGrid: game.cityGrid || [],
          landmarksGrid: game.landmarksGrid || [],
          eventGrid: game.eventGrid || [],
          // Garantir que as cartas estão corretas
          hand: game.hand || [],
          deck: game.deck || [],
          // Garantir que outros estados estão corretos
          activeEvents: game.activeEvents || [],
          comboEffects: game.comboEffects || [],
          magicUsedThisTurn: game.magicUsedThisTurn || false,
          builtCountThisTurn: game.builtCountThisTurn || 0,
          actionUsedThisTurn: game.actionUsedThisTurn || false,
          // Garantir que o sistema de vitória está correto
          victorySystem: game.victorySystem,
          // Garantir que as catástrofes estão corretas
          productionReduction: game.productionReduction,
          catastropheDuration: game.catastropheDuration,
          catastropheName: game.catastropheName,
          lastCatastropheTurn: game.lastCatastropheTurn,
        };
        
        saveGameState(currentGameState);
        
        console.log('🎮 Estado do jogo salvo com dados verdadeiros:', {
          turn: currentGameState.turn,
          phase: currentGameState.phase,
          resources: currentGameState.resources,
          playerStats: currentGameState.playerStats,
          deckLength: currentGameState.deck.length,
          handLength: currentGameState.hand.length,
          farmGridCards: currentGameState.farmGrid.flat().filter(cell => cell.card).length,
          cityGridCards: currentGameState.cityGrid.flat().filter(cell => cell.card).length,
          landmarksGridCards: currentGameState.landmarksGrid.flat().filter(cell => cell.card).length,
        });
      }, 1000); // Salvar após 1 segundo de inatividade
      
      return () => clearTimeout(timeoutId);
    }
  }, [game, gameLoading, activeDeck, saveGameState]);

  // Verificar descarte obrigatório quando mão excede limite
  useEffect(() => {
    if (gameLoading) return;
    if (game.hand.length > HAND_LIMIT && !discardMode && !victory && !defeat) {
      setDiscardMode(true);
      setError(`Descarte obrigatório: você tem ${game.hand.length} cartas, máximo é ${HAND_LIMIT}`);
              addToHistory(`🗑️ Descarte obrigatório ativado: ${game.hand.length} cartas na mão`);
    }
  }, [game.hand.length, discardMode, victory, defeat, gameLoading]);

  // Detectar compra de carta para animação
  useEffect(() => {
    if (gameLoading) return;
    if (game.phase === 'draw' && game.hand.length > 0 && game.deck.length >= 0) {
      setLastDrawn(game.hand[game.hand.length - 1]?.name);
      setTimeout(() => setLastDrawn(undefined), 900);
    }
  }, [game.hand.length, game.phase, gameLoading]);

  // Efeito: escalonamento no modo infinito
  useEffect(() => {
    if (gameLoading) return;
    if (!gameSettings || gameSettings.victoryMode !== 'infinite') return;
    
    // Escalonar a cada 10 turnos
    if (game.turn % 10 === 0 && game.turn > 0) {
      const cycle = Math.floor(game.turn / 10);
      addToHistory(`🌊 Ciclo ${cycle}: Eventos e custos aumentaram!`);
      
      // Futuro: implementar escalonamento de eventos/crises e custos
      // Por exemplo:
      // - Aumentar chance de eventos de crise
      // - Aumentar custos de cartas em 10%
      // - Reduzir produção em 5%
      //  console.log(`🔄 Modo infinito - Ciclo ${cycle}: Escalonamento ativado`);
    }
  }, [game.turn, gameLoading, gameSettings]);

  // Efeito: processar desativação de cartas e duração de catástrofes
  useEffect(() => {
    if (gameLoading) return;
    
    // Processar duração de catástrofes
    if (game.catastropheDuration !== undefined && game.catastropheDuration > 0) {
      const newDuration = game.catastropheDuration - 1;
      
      if (newDuration <= 0) {
        // Catástrofe expirou
        setGame(prev => ({
          ...prev,
          productionReduction: undefined,
          catastropheDuration: undefined,
          catastropheName: undefined
        }));
        addToHistory(`🌤️ ${game.catastropheName || 'Catástrofe'} expirou! Produção normalizada.`);
        return;
      } else {
        // Reduzir duração
        setGame(prev => ({
          ...prev,
          catastropheDuration: newDuration
        }));
      }
    }
    
    // Verificar se há cartas desativadas que precisam ser reativadas
    let hasDeactivatedCards = false;
    let newFarmGrid = [...game.farmGrid];
    let newCityGrid = [...game.cityGrid];
    
    // Processar grid da fazenda
    for (let row = 0; row < newFarmGrid.length; row++) {
      for (let col = 0; col < newFarmGrid[row].length; col++) {
        const cell = newFarmGrid[row][col];
        if (cell.card?.deactivated && cell.card.deactivationTurns) {
          hasDeactivatedCards = true;
          if (cell.card.deactivationTurns <= 1) {
            // Reativar carta
            newFarmGrid[row][col] = {
              ...cell,
              card: {
                ...cell.card,
                deactivated: false,
                deactivationTurns: undefined
              },
              isHighlighted: false // Remover highlight quando reativada
            };
            addToHistory(`✅ ${cell.card.name} foi reativada!`);
          } else {
            // Reduzir contador de turnos
            newFarmGrid[row][col] = {
              ...cell,
              card: {
                ...cell.card,
                deactivationTurns: cell.card.deactivationTurns - 1
              }
            };
          }
        }
      }
    }
    
    // Processar grid da cidade
    for (let row = 0; row < newCityGrid.length; row++) {
      for (let col = 0; col < newCityGrid[row].length; col++) {
        const cell = newCityGrid[row][col];
        if (cell.card?.deactivated && cell.card.deactivationTurns) {
          hasDeactivatedCards = true;
          if (cell.card.deactivationTurns <= 1) {
            // Reativar carta
            newCityGrid[row][col] = {
              ...cell,
              card: {
                ...cell.card,
                deactivated: false,
                deactivationTurns: undefined
              },
              isHighlighted: false // Remover highlight quando reativada
            };
            addToHistory(`✅ ${cell.card.name} foi reativada!`);
          } else {
            // Reduzir contador de turnos
            newCityGrid[row][col] = {
              ...cell,
              card: {
                ...cell.card,
                deactivationTurns: cell.card.deactivationTurns - 1
              }
            };
          }
        }
      }
    }
    
    // Atualizar grids se necessário
    if (hasDeactivatedCards) {
      setGame(prev => ({
        ...prev,
        farmGrid: newFarmGrid,
        cityGrid: newCityGrid
      }));
    }
  }, [game.turn, gameLoading]);

  // Sistema complexo de vitória
  useEffect(() => {
    if (gameLoading) return;
    if (victory) return;
    if (!game.victorySystem) return;
    
    // Atualizar condições de vitória
    const updatedVictorySystem = updateVictoryConditions(game.victorySystem, game);
    
    // Verificar se alguma condição foi completada
    const newlyCompleted = updatedVictorySystem.conditions.filter(condition => 
      condition.completed && !game.victorySystem!.conditions.find(c => c.id === condition.id)?.completed
    );
    
    // Verificar vitória final
    if (updatedVictorySystem.victoryAchieved) {
      const majorCompleted = updatedVictorySystem.conditions.filter(c => c.type === 'major' && c.completed).length;
      const minorCompleted = updatedVictorySystem.conditions.filter(c => c.type === 'minor' && c.completed).length;
      
      setVictory(`🏆 VITÓRIA COMPLETA! ${majorCompleted} vitórias maiores e ${minorCompleted} vitórias menores alcançadas!`);
      addToHistory('🏆 VITÓRIA COMPLETA! Todas as condições necessárias foram atendidas!');
    }
    
    // Atualizar o estado do jogo com o sistema de vitória atualizado (apenas se houve mudanças)
    if (newlyCompleted.length > 0 || updatedVictorySystem.victoryAchieved) {
      setGame(prev => ({
        ...prev,
        victorySystem: updatedVictorySystem
      }));
      
      // Mostrar mensagens para condições recém-completadas
      newlyCompleted.forEach(condition => {
        const typeText = condition.type === 'major' ? '🏆 Vitória Maior' : '⭐ Vitória Menor';
        addToHistory(`${typeText}: ${condition.name} completada!`);
        setHighlight(`${typeText}: ${condition.name}!`);
        setTimeout(() => setHighlight(null), 2000);
      });
    }
  }, [game.turn, game.resources, game.farmGrid, game.cityGrid, game.eventGrid, game.landmarksGrid, victory, gameLoading]);

  // Função para obter mensagem de derrota rotativa
  const getRandomDefeatMessage = (type: 'population' | 'reputation' | 'turns' | 'deck') => {
    const messages = {
      population: [
        '💀 Derrota: Sua população chegou a 0! O reino foi abandonado por falta de habitantes.',
        '🏰 Derrota: Vossa população sumiu! Parece que todos foram para o pub do reino vizinho.',
        '👥 Derrota: População zero! Até os ratos do castelo foram embora procurar emprego.',
        '🦗 Derrota: Reino vazio! Só restaram os grilos cantando "tudo bem, tudo bem".'
      ],
      reputation: [
        '💀 Derrota: Sua reputação chegou a -1! O povo perdeu a confiança em vossa liderança.',
        '👑 Derrota: Reputação no chão! Até o bobo da corte está rindo de vós.',
        '🤡 Derrota: Reputação -1! Agora vós sois o novo bobo da corte.',
        '🎭 Derrota: Reputação zerada! O povo prefere um dragão como rei.'
      ],
      turns: [
        '💀 Derrota: Limite de turnos atingido! O tempo se esgotou para vossa missão.',
        '⏰ Derrota: Tempo esgotado! O relógio do castelo parou de funcionar.',
        '🕰️ Derrota: Turnos acabaram! O tempo voou como uma flecha mágica.',
        '⌛ Derrota: Tempo esgotado! A ampulheta virou e não voltou mais.'
      ],
      deck: [
        '💀 Derrota: Seu baralho ficou vazio! O baralho mágico fugiu para outro reino.',
        '🃏 Derrota: Baralho vazio! As cartas foram jogar pôquer com os elfos.',
        '🎴 Derrota: Sem cartas! O baralho decidiu tirar férias no reino das fadas.',
        '🃏 Derrota: Baralho zerado! As cartas foram fazer turismo em outros castelos.'
      ]
    };
    
    const typeMessages = messages[type];
    const randomIndex = Math.floor(Math.random() * typeMessages.length);
    return typeMessages[randomIndex];
  };

  // Efeito: derrota se população chegar a 0 ou reputação chegar a -1
  useEffect(() => {
    if (gameLoading) return;
    if (game.resources.population <= 0 && !defeat) {
      setDefeat(getRandomDefeatMessage('population'));
      addToHistory('❌ Derrota: população chegou a 0!');
    }
    if (game.playerStats.reputation <= -1 && !defeat) {
      setDefeat(getRandomDefeatMessage('reputation'));
      addToHistory('💀 Derrota por reputação -1: baralho vazio');
    }
  }, [game.resources.population, game.playerStats.reputation, defeat, gameLoading]);

  // Efeito: descarte obrigatório manual na fase 'end' (apenas 1 vez por turno)
  useEffect(() => {
    if (gameLoading) return;
    if (game.phase === 'end' && game.hand.length > 0 && !discardMode && !victory && !defeat && !discardedThisTurn) {
      setDiscardMode(true);
      setDiscardedThisTurn(true);
              addToHistory('🗑️ Descarte obrigatório: escolha uma carta para descartar.');
    }
    if (game.phase !== 'end' && discardedThisTurn) {
      setDiscardedThisTurn(false);
    }
  }, [game.phase, game.hand.length, discardMode, victory, defeat, discardedThisTurn, gameLoading]);

  // Efeito: penalidade por falta de comida no fim do turno
  const foodPenaltyProcessed = useRef(false);
  useEffect(() => {
    if (gameLoading) return;
    if (game.phase === 'end' && game.resources.food < 0 && !defeat && !foodPenaltyProcessed.current) {
      foodPenaltyProcessed.current = true;
      setGame((g) => ({
        ...g,
        resources: { ...g.resources, food: 0, population: Math.max(0, g.resources.population - 1) },
        playerStats: { ...g.playerStats, reputation: Math.max(0, g.playerStats.reputation - 1) },
      }));
      setHighlight('⚠️ Faltou comida! -1 população, -1 reputação');
      addToHistory('⚠️ Faltou comida! -1 população, -1 reputação');
      setTimeout(() => setHighlight(null), 1500);
    }
    if (game.phase !== 'end') {
      foodPenaltyProcessed.current = false;
    }
  }, [game.phase, game.resources.food, defeat, gameLoading]);

  // Efeito: bônus de diversidade no fim do turno
  const diversityBonusProcessed = useRef(false);
  useEffect(() => {
    if (gameLoading) return;
    if (game.phase === 'end' && !diversityBonusProcessed.current) {
      const allCards = [
        ...game.farmGrid.flat().map((cell) => cell.card).filter(Boolean),
        ...game.cityGrid.flat().map((cell) => cell.card).filter(Boolean),
      ] as Card[];
      const typeCounts: Record<string, number> = {};
      allCards.forEach((c) => {
        typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
      });
      const diversityBonus = Object.keys(typeCounts).length >= 3 ? 1 : 0;
      if (diversityBonus > 0) {
        diversityBonusProcessed.current = true;
        setGame((g) => ({
          ...g,
          playerStats: { ...g.playerStats, reputation: Math.min(10, g.playerStats.reputation + diversityBonus) },
        }));
        setHighlight('✨ Bônus de diversidade! +1 reputação');
        addToHistory('✨ Bônus de diversidade! +1 reputação');
        setTimeout(() => setHighlight(null), 1500);
      }
    }
    if (game.phase !== 'end') {
      diversityBonusProcessed.current = false;
    }
  }, [game.phase, gameLoading]);

  // Efeito: derrota se população chegar a 0 (banner)
  // Removido auto-limpeza para permitir derrotas permanentes
  // useEffect(() => {
  //   if (defeat) {
  //     setTimeout(() => setDefeat(null), 6000);
  //   }
  // }, [defeat]);

  // Efeito: descarte automático se mão exceder limite na fase 'end'
  const autoDiscardProcessed = useRef(false);
  useEffect(() => {
    if (gameLoading) return;
    if (game.phase === 'end' && game.hand.length > HAND_LIMIT && !discardMode && !victory && !defeat && !autoDiscardProcessed.current) {
      autoDiscardProcessed.current = true;
      const idx = Math.floor(Math.random() * game.hand.length);
      const discarded = game.hand[idx];
      setGame((g) => {
        const newState = {
          ...g,
          hand: g.hand.filter((_, i) => i !== idx),
        };
        /*console.log('🗑️ Carta descartada - novo estado:', {
          deckLength: newState.deck.length,
          handLength: newState.hand.length,
          cartaDescartada: discarded.name
        });*/
        return newState;
      });
      setHighlight(`🗑️ Carta descartada: ${discarded.name}`);
      addToHistory(`🗑️ Carta descartada automaticamente: ${discarded.name}`);
      setTimeout(() => setHighlight(null), 1500);
    }
    if (game.phase !== 'end') {
      autoDiscardProcessed.current = false;
    }
  }, [game.phase, gameLoading]);

  // Efeito: penalidade por baralho vazio no fim do turno
  const emptyDeckPenaltyProcessed = useRef(false);
  useEffect(() => {
    if (gameLoading) return;
    
    // Calcular cartas restantes no baralho
    const totalDeckCards = activeDeck?.cards?.length || game.deck.length;
    const cardsInHand = game.hand.length;
    const remainingDeckCards = Math.max(0, totalDeckCards - cardsInHand);
    
    if (game.phase === 'end' && remainingDeckCards === 0 && !defeat && !emptyDeckPenaltyProcessed.current) {
      emptyDeckPenaltyProcessed.current = true;
      
      // Mecânica especial para modo infinito: não aplicar penalidade se há cartas descartadas
      if (gameSettings?.victoryMode === 'infinite' && discardedCards.length > 0) {
        setHighlight('🔄 Baralho vazio! Cartas descartadas serão rebaralhadas no próximo turno.');
        addToHistory('🔄 Baralho vazio! Cartas descartadas serão rebaralhadas no próximo turno.');
        setTimeout(() => setHighlight(null), 2000);
      } else {
        // Reduzir reputação
        setGame((g) => ({
          ...g,
          playerStats: { ...g.playerStats, reputation: g.playerStats.reputation - 1 },
        }));
        
        const newReputation = game.playerStats.reputation - 1;
        
        if (newReputation <= -1) {
          // Derrota automática se reputação chegar a -1 ou menos
          setDefeat(getRandomDefeatMessage('deck'));
          addToHistory('💀 Derrota por reputação -1: baralho vazio');
        } else {
          // Apenas penalidade de reputação
          setHighlight('⚠️ Baralho vazio! -1 reputação');
          addToHistory(`⚠️ Baralho vazio! -1 reputação (${newReputation}/10)`);
          setTimeout(() => setHighlight(null), 2000);
        }
      }
    }
    
    if (game.phase !== 'end') {
      emptyDeckPenaltyProcessed.current = false;
    }
  }, [game.phase, game.hand.length, activeDeck?.cards?.length, game.deck.length, defeat, gameLoading, game.playerStats.reputation, gameSettings?.victoryMode, discardedCards.length]);

  // Efeito: compra automática de carta no início da fase 'draw', penalidade se deck vazio
  const drawPhaseProcessed = useRef(false);
  useEffect(() => {
    if (gameLoading) return;
    if (game.phase === 'draw' && !drawPhaseProcessed.current) {
      drawPhaseProcessed.current = true;
      setBuiltThisTurn({ farm: false, city: false });
      setBuiltCountThisTurn(0);
      setActionThisTurn(false);
      setActionUsedThisTurn(false);
      setLandmarkBuiltThisTurn(false);
      setGame(g => ({ ...g, actionUsedThisTurn: false, builtCountThisTurn: 0 }));
      if (game.hand.length < 6) {
        if (game.deck.length > 0) {
          /*console.log('🃏 Compra de carta iniciada:', {
            deckLength: game.deck.length,
            handLength: game.hand.length,
            cartaTopo: game.deck[0]?.name
          });*/
          
          setGame((g) => {
            const cartaComprada = g.deck[0];
            const newState = {
              ...g,
              hand: [...g.hand, cartaComprada],
              deck: g.deck.slice(1),
            };
            /*console.log('🃏 Carta comprada - novo estado:', {
              deckLength: newState.deck.length,
              handLength: newState.hand.length,
              cartaComprada: cartaComprada?.name,
              handCards: newState.hand.map(c => c.name)
            });*/ 
            return newState;
          });
          setHighlight('🃏 Carta comprada!');
          addToHistory(`🃏 Comprou carta: ${game.deck[0]?.name || '???'}`);
          setTimeout(() => setHighlight(null), 900);
        } else {
          // Mecânica especial para modo infinito: rebaralhar deck com cartas descartadas
          if (gameSettings?.victoryMode === 'infinite' && discardedCards.length > 0) {
            // Rebaralhar deck com cartas descartadas
            const reshuffledDeck = shuffle([...discardedCards]);
            const cartaComprada = reshuffledDeck[0];
            
            setGame((g) => ({
              ...g,
              hand: [...g.hand, cartaComprada],
              deck: reshuffledDeck.slice(1),
            }));
            
            // Limpar cartas descartadas (agora estão no deck)
            setDiscardedCards([]);
            setDeckReshuffled(true);
            
            setHighlight('🔄 Deck rebaralhado!');
            addToHistory(`🔄 Deck rebaralhado com ${reshuffledDeck.length} cartas descartadas!`);
            setTimeout(() => setHighlight(null), 1500);
            
            // Resetar flag após um turno
            setTimeout(() => setDeckReshuffled(false), 2000);
          } else {
            // Penalidade deck vazio - só se não estiver carregando
            if (!gameLoading) {
              setGame((g) => ({
                ...g,
                playerStats: { ...g.playerStats, reputation: Math.max(0, g.playerStats.reputation - 1) },
              }));
              setHighlight('⚠️ Deck vazio! -1 reputação');
              addToHistory('⚠️ Deck vazio! -1 reputação');
              setTimeout(() => setHighlight(null), 1500);
            }
          }
        }
      }
    }
    if (game.phase !== 'draw') {
      drawPhaseProcessed.current = false;
    }
  }, [game.phase, gameLoading]);

  // NOVO: Detectar evento/crise e sugerir defesa
  useEffect(() => {
    if (game.activeEvents.some(e => e.rarity === 'crisis')) {
      // Se o jogador tem carta de defesa na mão, sugerir ativação
      const defenseCard = game.hand.find(c => c.type === 'defense');
      if (defenseCard) setPendingDefense(defenseCard);
    } else {
      setPendingDefense(null);
    }
  }, [game.activeEvents, game.hand]);

  // Monitorar mudanças no deck
  useEffect(() => {
    //console.log('🔄 Deck mudou - novo tamanho:', game.deck.length);
  }, [game.deck.length]);

  // Monitorar mudanças no game.deck
  useEffect(() => {
    /*console.log('🔄 game.deck mudou:', {
      length: game.deck.length,
      cards: game.deck.map(c => c.name)
    });*/
  }, [game.deck]);

  // Monitorar mudanças no estado do jogo para debug
  useEffect(() => {
    /*console.log('🎮 Estado do jogo atualizado:', {
      turn: game.turn,
      phase: game.phase,
      handLength: game.hand.length,
      deckLength: game.deck.length,
      handCards: game.hand.map(c => c.name),
      deckCards: game.deck.map(c => c.name)
    });*/
  }, [game]);

  // Handlers funcionais
  const handleNextPhase = useCallback(() => {
    if (victory || discardMode) return;
    
    // Verificar se o dado foi usado na fase de construção
    if (game.phase === 'build' && !diceUsed) {
      setError('Você deve jogar o dado na fase de construção antes de avançar!');
      return;
    }
    
    setSelectedCard(null);
    setSelectedGrid(null);
    setError(null);
    setActionSummary(null);
    
    // Limpar o dado quando avança para um novo turno ou quando sai da fase de construção
    if (game.phase === 'end') {
      setDiceResult(null);
      setDiceUsed(false);
      setDiceProductionSummary(null);
    } else if (game.phase === 'build') {
      // Limpar o dado quando sai da fase de construção
      setDiceResult(null);
      setDiceUsed(false);
      setDiceProductionSummary(null);
    }
    
    const currentPhaseIndex = phaseOrder.indexOf(game.phase);
    const nextPhaseIndex = (currentPhaseIndex + 1) % phaseOrder.length;
    const nextPhase = phaseOrder[nextPhaseIndex];
    
    //console.log(`Mudando fase: ${game.phase} -> ${nextPhase}`);
    
    if (game.phase === 'end') {
      // Avança para novo turno e volta para 'draw'
      const newTurn = game.turn + 1;
      
      // Verificar limite de turnos
      const turnLimit = gameSettings.gameTurnLimit || 50;
      if (turnLimit > 0 && newTurn > turnLimit) {
        setDefeat(getRandomDefeatMessage('turns'));
        addToHistory(`❌ Derrota: Limite de ${turnLimit} turnos atingido`);
        return;
      }
      
      // Verificar vitória por prestígio
      const prestigeGoal = gameSettings.prestigeGoal || 30;
      if (game.playerStats.reputation >= prestigeGoal) {
        setVictory(`🏆 Vitória: Prestígio ${game.playerStats.reputation}/${prestigeGoal} atingido!`);
        addToHistory(`🏆 Vitória: Prestígio ${game.playerStats.reputation}/${prestigeGoal} atingido!`);
        return;
      }
      
      // Verificar vitória por produção (modo simples)
      if (gameSettings.victoryMode === 'production') {
        const { prod: currentProduction } = getProductionPerTurnDetails(game.farmGrid, game.cityGrid);
        const totalProduction = currentProduction.coins + currentProduction.food + 
                               currentProduction.materials + currentProduction.population;
        const productionGoal = gameSettings.victoryValue || 100;
        
        console.log('🎯 Verificando vitória por produção:', {
          totalProduction,
          productionGoal,
          currentProduction,
          victoryMode: gameSettings.victoryMode
        });
        
        if (totalProduction >= productionGoal) {
          console.log('🏆 VITÓRIA DETECTADA!');
          setVictory(`🏆 Vitória: Produção ${totalProduction}/${productionGoal} recursos por turno atingida!`);
          addToHistory(`🏆 Vitória: Produção ${totalProduction}/${productionGoal} recursos por turno atingida!`);
          return;
        }
      }
      
      // Verificar vitória por recursos (modo simples)
      if (gameSettings.victoryMode === 'resources') {
        const resourceGoal = gameSettings.victoryValue || 1000;
        if (game.resources.coins >= resourceGoal) {
          setVictory(`🏆 Vitória: ${resourceGoal} moedas acumuladas!`);
          addToHistory(`🏆 Vitória: ${resourceGoal} moedas acumuladas!`);
          return;
        }
      }
      
      // Verificar vitória por landmarks (modo simples)
      if (gameSettings.victoryMode === 'landmarks') {
        const landmarkGoal = gameSettings.victoryValue || 3;
        if (game.playerStats.landmarks >= landmarkGoal) {
          setVictory(`🏆 Vitória: ${landmarkGoal} marcos históricos construídos!`);
          addToHistory(`🏆 Vitória: ${landmarkGoal} marcos históricos construídos!`);
          return;
        }
      }
      
      // Verificar vitória por sobrevivência (modo simples)
      if (gameSettings.victoryMode === 'elimination') {
        const survivalGoal = gameSettings.victoryValue || 25;
        if (newTurn >= survivalGoal) {
          setVictory(`🏆 Vitória: Sobreviveu ${survivalGoal} turnos!`);
          addToHistory(`🏆 Vitória: Sobreviveu ${survivalGoal} turnos!`);
          return;
        }
      }
      
      // Sistema de catástrofes com intervalo controlado
      const minTurnsBetweenCatastrophes = 3;
      const maxTurnsBetweenCatastrophes = 7;
      
      // Verificar se já passou tempo suficiente desde a última catástrofe
      const turnsSinceLastCatastrophe = newTurn - (game.lastCatastropheTurn || 0);
      const canTriggerCatastrophe = turnsSinceLastCatastrophe >= minTurnsBetweenCatastrophes;
      
      // Calcular chance baseada no tempo decorrido
      let catastropheChance = 0;
      if (canTriggerCatastrophe) {
        // Chance aumenta progressivamente após o mínimo de turnos
        const progress = Math.min(1, (turnsSinceLastCatastrophe - minTurnsBetweenCatastrophes) / (maxTurnsBetweenCatastrophes - minTurnsBetweenCatastrophes));
        catastropheChance = 0.1 + (progress * 0.4); // 10% a 50% base
        
        // Modos de sobrevivência têm chance maior
        if (gameSettings.victoryMode === 'infinite') {
          catastropheChance = Math.min(0.8, catastropheChance * 1.3); // Máximo 80%
        } else if (gameSettings.victoryMode === 'elimination') {
          catastropheChance = Math.min(0.9, catastropheChance * 1.5); // Máximo 90%
        } else if (gameSettings.victoryMode === 'production') {
          catastropheChance = Math.min(0.7, catastropheChance * 1.2); // Máximo 70%
        }
      }
      
      if (Math.random() < catastropheChance) {
        const catastrophe = generateRandomCatastrophe(newTurn, gameSettings.victoryMode);
        if (catastrophe) {
          // Aplicar efeito da catástrofe
          const modifiedState = applyCatastropheEffect(catastrophe, game, gameSettings.victoryMode);
          
          // Processar destruição de cartas
          let newFarmGrid = [...game.farmGrid];
          let newCityGrid = [...game.cityGrid];
          let destroyedCards: string[] = [];
          let deactivatedCards: string[] = [];
          
          // Destruir cartas se necessário
          if (modifiedState.cardDestructionCount) {
            const targets = modifiedState.cardDestructionTargets || ['farm', 'city'];
            const destroyCount = Math.min(modifiedState.cardDestructionCount, 3); // Máximo 3 cartas
            
            for (let i = 0; i < destroyCount; i++) {
              if (targets.includes('farm')) {
                const farmCards = newFarmGrid.flat().filter(cell => cell.card);
                if (farmCards.length > 0) {
                  const randomIndex = Math.floor(Math.random() * farmCards.length);
                  const randomCell = farmCards[randomIndex];
                  if (randomCell.card) {
                    destroyedCards.push(randomCell.card.name);
                    // Encontrar e remover a carta do grid
                    for (let row = 0; row < newFarmGrid.length; row++) {
                      for (let col = 0; col < newFarmGrid[row].length; col++) {
                        if (newFarmGrid[row][col].card?.id === randomCell.card?.id) {
                          newFarmGrid[row][col] = { card: null, isHighlighted: false };
                          break;
                        }
                      }
                    }
                  }
                }
              }
              
              if (targets.includes('city')) {
                const cityCards = newCityGrid.flat().filter(cell => cell.card);
                if (cityCards.length > 0) {
                  const randomIndex = Math.floor(Math.random() * cityCards.length);
                  const randomCell = cityCards[randomIndex];
                  if (randomCell.card) {
                    destroyedCards.push(randomCell.card.name);
                    // Encontrar e remover a carta do grid
                    for (let row = 0; row < newCityGrid.length; row++) {
                      for (let col = 0; col < newCityGrid[row].length; col++) {
                        if (newCityGrid[row][col].card?.id === randomCell.card?.id) {
                          newCityGrid[row][col] = { card: null, isHighlighted: false };
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          
          // Desativar cartas se necessário
          if (modifiedState.cardDeactivationCount) {
            const targets = modifiedState.cardDeactivationTargets || ['farm', 'city'];
            const deactivateCount = Math.min(modifiedState.cardDeactivationCount, 2); // Máximo 2 cartas
            
            for (let i = 0; i < deactivateCount; i++) {
              if (targets.includes('farm')) {
                const farmCards = newFarmGrid.flat().filter(cell => cell.card && !cell.card.deactivated);
                if (farmCards.length > 0) {
                  const randomIndex = Math.floor(Math.random() * farmCards.length);
                  const randomCell = farmCards[randomIndex];
                  if (randomCell.card) {
                    deactivatedCards.push(randomCell.card.name);
                    // Marcar carta como desativada
                    for (let row = 0; row < newFarmGrid.length; row++) {
                      for (let col = 0; col < newFarmGrid[row].length; col++) {
                        if (newFarmGrid[row][col].card?.id === randomCell.card?.id) {
                          newFarmGrid[row][col] = { 
                            ...newFarmGrid[row][col], 
                            card: { 
                              ...newFarmGrid[row][col].card!, 
                              deactivated: true,
                              deactivationTurns: modifiedState.cardDeactivationDuration || 3
                            },
                            isHighlighted: true // Destacar visualmente a carta afetada
                          };
                          break;
                        }
                      }
                    }
                  }
                }
              }
              
              if (targets.includes('city')) {
                const cityCards = newCityGrid.flat().filter(cell => cell.card && !cell.card.deactivated);
                if (cityCards.length > 0) {
                  const randomIndex = Math.floor(Math.random() * cityCards.length);
                  const randomCell = cityCards[randomIndex];
                  if (randomCell.card) {
                    deactivatedCards.push(randomCell.card.name);
                    // Marcar carta como desativada
                    for (let row = 0; row < newCityGrid.length; row++) {
                      for (let col = 0; col < newCityGrid[row].length; col++) {
                        if (newCityGrid[row][col].card?.id === randomCell.card?.id) {
                          newCityGrid[row][col] = { 
                            ...newCityGrid[row][col], 
                            card: { 
                              ...newCityGrid[row][col].card!, 
                              deactivated: true,
                              deactivationTurns: modifiedState.cardDeactivationDuration || 3
                            },
                            isHighlighted: true // Destacar visualmente a carta afetada
                          };
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          
          // Atualizar estado do jogo com os efeitos da catástrofe
          setGame((g) => ({
            ...g,
            turn: newTurn,
            phase: 'draw',
            resources: modifiedState.resources,
            farmGrid: newFarmGrid,
            cityGrid: newCityGrid,
            lastCatastropheTurn: newTurn, // Registrar turno da catástrofe
            // Limpar catástrofe anterior e aplicar nova
            productionReduction: modifiedState.productionReduction || undefined,
            catastropheDuration: modifiedState.productionReduction ? 3 : undefined, // Duração padrão de 3 turnos
            catastropheName: modifiedState.productionReduction ? catastrophe.name : undefined
          }));
          
          // Criar mensagem detalhada da catástrofe
          let catastropheMessage = `🌪️ ${catastrophe.name}: ${catastrophe.description}`;
          if (destroyedCards.length > 0) {
            catastropheMessage += `\n💥 Cartas destruídas: ${destroyedCards.join(', ')}`;
          }
          if (deactivatedCards.length > 0) {
            catastropheMessage += `\n⚠️ Cartas desativadas: ${deactivatedCards.join(', ')} (${modifiedState.cardDeactivationDuration || 3} turnos)`;
          }
          
          addToHistory(`🌪️ Catástrofe: ${catastrophe.name} - ${catastrophe.description}`);
          
          // Usar highlight em vez de error para catástrofes
          setHighlight(catastropheMessage);
          
          // Limpar highlight após 5 segundos
          setTimeout(() => setHighlight(null), 5000);
          return;
        }
      }
      
      setGame((g) => ({ ...g, turn: newTurn, phase: 'draw' }));
    } else if (game.phase === 'build') {
      handleProduction();
    } else if (currentPhaseIndex < phaseOrder.length - 1) {
      setGame((g) => ({ ...g, phase: phaseOrder[currentPhaseIndex + 1] }));
    }
  }, [game.phase, victory, discardMode, diceUsed, game.turn, game.playerStats.reputation, gameSettings.gameTurnLimit, gameSettings.prestigeGoal, generateRandomCatastrophe, applyCatastropheEffect]);

  const handleSelectCard = useCallback((card: Card) => {
    if (victory) return;
    
    //console.log('=== DEBUG: Carta selecionada ===');
    //console.log('Nome:', card.name);
    //console.log('Tipo:', card.type);
    //  console.log('Efeito:', card.effect.description);
    //console.log('Fase atual:', game.phase);
    //console.log('Custos:', card.cost);
    
    // Se já está selecionada, desmarcar
    if (selectedCard && selectedCard.id === card.id) {
      setSelectedCard(null);
      setSelectedGrid(null);
      setError(null);
      return;
    }
    
    const canPlay = canPlayCardUI(card);
    //console.log('Pode jogar:', canPlay);
    
    // Para cartas de efeito imediato (action, magic, defense)
    if (card.type === 'action' && game.phase === 'action' && canPlay.playable) {
      //console.log('=== PROCESSANDO CARTA DE AÇÃO ===');
      const cost: Resources = {
        coins: card.cost.coins ?? 0,
        food: card.cost.food ?? 0,
        materials: card.cost.materials ?? 0,
        population: card.cost.population ?? 0,
      };
      const effect = parseInstantEffect(card);
      //console.log('Efeito parseado:', effect);
      
      let details: string[] = [];
      Object.entries(effect).forEach(([key, value]) => {
        if (value && value > 0) details.push(`+${value} ${key}`);
      });
      //console.log('Detalhes do efeito:', details);
      
      setGame((g) => {
        // Remover apenas a primeira carta com este ID (não todas)
        const cardIndex = g.hand.findIndex((c) => c.id === card.id);
        const newHand = cardIndex !== -1 
          ? [...g.hand.slice(0, cardIndex), ...g.hand.slice(cardIndex + 1)]
          : g.hand;
        
        const newResources: Resources = {
          coins: g.resources.coins - (card.cost.coins ?? 0) + (effect.coins ?? 0),
          food: g.resources.food - (card.cost.food ?? 0) + (effect.food ?? 0),
          materials: g.resources.materials - (card.cost.materials ?? 0) + (effect.materials ?? 0),
          population: g.resources.population - (card.cost.population ?? 0) + (effect.population ?? 0),
        };
        //console.log('Recursos antes:', g.resources);
        //console.log('Recursos depois:', newResources);
        return {
          ...g,
          hand: newHand,
          resources: newResources,
        };
      });
      setActionSummary(`Ação: ${card.name} (${details.join(', ') || 'efeito aplicado'})`);
              addToHistory(`⚡ Usou ação: ${card.name}`);
      setSelectedCard(null);
      setSelectedGrid(null);
      setError(null);
      setTimeout(() => setActionSummary(null), 1800);
      setActionUsedThisTurn(true);
      return;
    } else if (card.type === 'magic' && ['action', 'build'].includes(game.phase) && canPlay.playable) {
      handleActivateMagic(card);
      return;
    } else if (card.type === 'defense' && canPlay.playable) {
      handleActivateDefense(card);
      return;
    }
    
    // Para cartas que não podem ser jogadas, exibir erro
    if (!canPlay.playable) {
      setError(canPlay.reason || 'Esta carta não pode ser jogada agora.');
      return;
    }
    
    // Para cartas de construção (farm, city, landmark, event)
    setSelectedCard(card);
    if (['farm', 'city', 'landmark'].includes(card.type)) {
      setSelectedGrid(card.type === 'farm' ? 'farm' : 'city');
    } else if (card.type === 'event') {
      setSelectedGrid('event');
    } else {
      setSelectedGrid(null);
    }
    setError(null);
  }, [victory, selectedCard, game.phase]);

  const handleSelectFarm = useCallback((x: number, y: number) => {
    if (victory) return;
    
    //console.log('Fazenda selecionada:', x, y);
    setSelectedGrid('farm');
    
    // Se há uma carta selecionada, tentar jogá-la
    if (selectedCard) {
      handleSelectCell('farm', x, y);
    }
  }, [victory, selectedCard]);

  const handleSelectCity = useCallback((x: number, y: number) => {
    if (victory) return;
    
    //console.log('Cidade selecionada:', x, y);
    setSelectedGrid('city');
    
    // Se há uma carta selecionada, tentar jogá-la
    if (selectedCard) {
      handleSelectCell('city', x, y);
    }
  }, [victory, selectedCard]);

  // Função para saber se uma carta pode ser jogada
  function canPlayCardUI(card: Card) {
    const cost: Resources = {
      coins: card.cost.coins ?? 0,
      food: card.cost.food ?? 0,
      materials: card.cost.materials ?? 0,
      population: card.cost.population ?? 0,
    };

    // Magic: pode ser usada em qualquer fase, sem limite
    if (card.type === 'magic') {
      if (!canPlayCard(game.resources, cost)) return { playable: false, reason: 'Recursos insuficientes' };
      return { playable: true };
    }
    
    // Action: só na fase Action, limitada a 1 por turno
    if (card.type === 'action') {
      if (game.phase !== 'action') return { playable: false, reason: 'Só pode usar Action na fase de ação' };
      if (actionUsedThisTurn) return { playable: false, reason: 'Só pode usar 1 Action por turno' };
      if (!canPlayCard(game.resources, cost)) return { playable: false, reason: 'Recursos insuficientes' };
      return { playable: true };
    }
    
    // Defense: só durante crises
    if (card.type === 'defense') {
      const hasCrisis = game.activeEvents.some(e => e.rarity === 'crisis');
      if (!hasCrisis) return { playable: false, reason: 'Só pode usar cartas de defesa durante crises' };
      if (!canPlayCard(game.resources, cost)) return { playable: false, reason: 'Recursos insuficientes' };
      return { playable: true };
    }
    
    // Trap: não disponível ainda
    if (card.type === 'trap') {
      return { playable: false, reason: 'Cartas trap só estarão disponíveis no modo multiplayer' };
    }
    
    // Event: só na fase Build, substitui evento anterior
    if (card.type === 'event') {
      if (game.phase !== 'build') return { playable: false, reason: 'Só pode jogar eventos na fase de construção' };
      if (!canPlayCard(game.resources, cost)) return { playable: false, reason: 'Recursos insuficientes' };
      return { playable: true };
    }
    
    // Landmark: só na fase Build, limitado a 1 por turno
    if (card.type === 'landmark') {
      if (game.phase !== 'build') return { playable: false, reason: 'Só pode construir landmarks na fase de construção' };
      if (landmarkBuiltThisTurn) return { playable: false, reason: 'Só pode construir 1 landmark por turno' };
      if (!canPlayCard(game.resources, cost)) return { playable: false, reason: 'Recursos insuficientes' };
      return { playable: true };
    }
    
    // Farm/City: só na fase Build, limitada a 2 por turno (qualquer combinação)
    if (card.type === 'farm' || card.type === 'city') {
      if (game.phase !== 'build') return { playable: false, reason: 'Só pode construir na fase de construção' };
      if (builtCountThisTurn >= 2) return { playable: false, reason: 'Só pode construir até 2 cartas por turno.' };
      if (!canPlayCard(game.resources, cost)) return { playable: false, reason: 'Recursos insuficientes' };
      
      // Verificar se pode empilhar em alguma carta existente
      const allCells = [
        ...game.farmGrid.flat(),
        ...game.cityGrid.flat(),
        ...game.landmarksGrid.flat(),
        ...game.eventGrid.flat(),
      ];
      const canStack = allCells.some(cell => cell.card && canStackCard(card, cell.card));
      
      return { 
        playable: true, 
        canStack,
        reason: canStack ? 'Pode construir ou empilhar' : 'Pode construir'
      };
    }
    
    return { playable: false, reason: 'Tipo de carta não jogável' };
  }

  // Handler de construção: até 2 construções por turno, qualquer grid
  const handleSelectCell = useCallback((gridType: 'farm' | 'city' | 'landmarks' | 'event', x: number, y: number) => {
    if (!selectedCard) return;
    
    // Verificar se o tipo de carta corresponde ao grid
    if (selectedCard.type === 'landmark' && gridType !== 'landmarks') {
      setError('Landmarks devem ser construídos no grid de Marcos.');
      return;
    }
    if (selectedCard.type === 'event' && gridType !== 'event') {
      setError('Eventos devem ser jogados no grid de Eventos.');
      return;
    }
    if ((selectedCard.type === 'farm' || selectedCard.type === 'city') && gridType === 'landmarks') {
      setError('Farm e City não podem ser construídos no grid de Marcos.');
      return;
    }
    if ((selectedCard.type === 'farm' || selectedCard.type === 'city') && gridType === 'event') {
      setError('Farm e City não podem ser construídos no grid de Eventos.');
      return;
    }
    
    if (game.phase !== 'build') {
      setError('Só é possível construir na fase de Construção.');
      return;
    }
    if (builtCountThisTurn >= 2) {
      setError('Só pode construir até 2 cartas por turno.');
      return;
    }
    
    const grid = gridType === 'farm' ? game.farmGrid : 
                 gridType === 'city' ? game.cityGrid : 
                 gridType === 'landmarks' ? game.landmarksGrid : 
                 game.eventGrid;
    const existingCell = grid[y][x];
    
    // Para eventos, sempre permitir substituição
    if (selectedCard.type === 'event') {
      // Eventos substituem o anterior automaticamente
    } else if (existingCell.card && !canStackCard(selectedCard, existingCell.card)) {
      setError('Espaço já ocupado ou carta não pode ser empilhada.');
      return;
    }
    if (!canPlayCard(game.resources, {
      coins: selectedCard.cost.coins ?? 0,
      food: selectedCard.cost.food ?? 0,
      materials: selectedCard.cost.materials ?? 0,
      population: selectedCard.cost.population ?? 0,
    })) {
      setError('Recursos insuficientes para jogar esta carta.');
      return;
    }
    setGame((g) => {
      const newGrid = grid.map((row, iy) =>
        row.map((cell, ix) => {
          if (ix === x && iy === y) {
            if (cell.card && canStackCard(selectedCard, cell.card)) {
              // Empilhar carta
              const newStack = cell.stack ? [...cell.stack, selectedCard] : [selectedCard];
              const totalCards = [cell.card, ...newStack];
              const level = calculateCardLevel(totalCards);
              return { 
                ...cell, 
                stack: newStack, 
                level 
              };
            } else {
              // Nova carta
              return { ...cell, card: selectedCard, level: 1 };
            }
          }
          return cell;
        })
      );
      // Remover apenas a primeira carta com este ID (não todas)
      const cardIndex = g.hand.findIndex((c) => c.id === selectedCard.id);
      const newHand = cardIndex !== -1 
        ? [...g.hand.slice(0, cardIndex), ...g.hand.slice(cardIndex + 1)]
        : g.hand;
      
      // Processar o efeito da carta construída (considerando empilhamento)
      const targetCell = newGrid[y][x];
      const cards = targetCell.stack ? [targetCell.card!, ...targetCell.stack] : [targetCell.card!];
      const effect = targetCell.level && targetCell.level > 1 
        ? calculateStackedEffect(cards)
        : parseInstantEffect(selectedCard);
      
      /*console.log('🏗️ Efeito da carta construída:', {
        nome: selectedCard.name,
        efeito: selectedCard.effect.description,
        efeitoParseado: effect,
        nivel: targetCell.level || 1,
        empilhada: targetCell.level && targetCell.level > 1
      });*/
      
      const newResources: Resources = {
        coins: g.resources.coins - (selectedCard.cost.coins ?? 0) + (effect.coins ?? 0),
        food: g.resources.food - (selectedCard.cost.food ?? 0) + (effect.food ?? 0),
        materials: g.resources.materials - (selectedCard.cost.materials ?? 0) + (effect.materials ?? 0),
        population: g.resources.population - (selectedCard.cost.population ?? 0) + (effect.population ?? 0),
      };
      
      /*console.log('🏗️ Recursos atualizados:', {
        antes: g.resources,
        depois: newResources,
        custo: {
          coins: selectedCard.cost.coins ?? 0,
          food: selectedCard.cost.food ?? 0,
          materials: selectedCard.cost.materials ?? 0,
          population: selectedCard.cost.population ?? 0,
        },
        efeito: effect
      });*/
      
      const isLandmark = selectedCard.type === 'landmark';
      // Combo simples: 3 cartas do mesmo tipo em sequência (considerando empilhamento)
      let comboMsg = null;
      const allCells = [
        ...((gridType === 'farm' ? newGrid : g.farmGrid).flat()),
        ...((gridType === 'city' ? newGrid : g.cityGrid).flat()),
        ...((gridType === 'landmarks' ? newGrid : g.landmarksGrid).flat()),
        ...((gridType === 'event' ? newGrid : g.eventGrid).flat()),
      ];
      const typeCounts: Record<string, number> = {};
      allCells.forEach((cell) => {
        if (cell.card) {
          // Contar cada carta individualmente (incluindo empilhadas)
          const cardCount = cell.stack ? cell.stack.length + 1 : 1;
          typeCounts[cell.card.type] = (typeCounts[cell.card.type] || 0) + cardCount;
        }
      });
      // Só considerar combos para tipos válidos
      const comboTypes = ['farm', 'city', 'landmark', 'event', 'defense', 'trap'];
      const comboType = Object.entries(typeCounts).find(
        ([type, count]) => count >= 3 && comboTypes.includes(type)
      );
      if (comboType) {
        comboMsg = `Combo: 3 cartas do tipo "${comboType[0]}"! +1 reputação`;
      }
      
      // Feedback visual com efeitos
      let effectDetails: string[] = [];
      Object.entries(effect).forEach(([key, value]) => {
        if (value && value > 0) effectDetails.push(`+${value} ${key}`);
      });
      
      const isStacked = targetCell.level && targetCell.level > 1;
      
      if (isStacked) {
        setHighlight(`⬆️ Carta empilhada! Nível ${targetCell.level}`);
        addToHistory(`⬆️ ${selectedCard.name} empilhada! Nível ${targetCell.level}${effectDetails.length > 0 ? ` (${effectDetails.join(', ')})` : ''}`);
        setTimeout(() => setHighlight(null), 1500);
      } else if (isLandmark) {
        setLandmarkBuiltThisTurn(true);
        setHighlight('🏛️ Marco histórico construído!');
        addToHistory(`🏛️ Marco histórico construído: ${selectedCard.name}${effectDetails.length > 0 ? ` (${effectDetails.join(', ')})` : ''}`);
        setTimeout(() => setHighlight(null), 1500);
      } else if (comboMsg) {
        setHighlight(`✨ ${comboMsg}`);
        addToHistory(`✨ ${comboMsg}`);
        setTimeout(() => setHighlight(null), 1500);
      } else {
        addToHistory(`🏗️ Construiu: ${selectedCard.name}${effectDetails.length > 0 ? ` (${effectDetails.join(', ')})` : ''}`);
      }
      
      const newState = {
        ...g,
        hand: newHand,
        resources: newResources,
        farmGrid: gridType === 'farm' ? newGrid : g.farmGrid,
        cityGrid: gridType === 'city' ? newGrid : g.cityGrid,
        landmarksGrid: gridType === 'landmarks' ? newGrid : g.landmarksGrid,
        eventGrid: gridType === 'event' ? newGrid : g.eventGrid,
        playerStats: {
          ...g.playerStats,
          buildings: g.playerStats.buildings + 1,
          reputation: g.playerStats.reputation + (isLandmark ? 3 : 0) + (comboMsg ? 1 : 0),
          landmarks: g.playerStats.landmarks + (isLandmark ? 1 : 0),
        },
      };
      /*console.log('🏗️ Carta jogada em grid - novo estado:', {
        deckLength: newState.deck.length,
        handLength: newState.hand.length,
        cartaJogada: selectedCard.name,
        gridType: gridType,
        efeitosAplicados: effectDetails
      });*/
      return newState;
    });
    setSelectedCard(null);
    setSelectedGrid(null);
    setError(null);
    setBuiltCountThisTurn((prev) => prev + 1);
  }, [selectedCard, selectedGrid, game.phase, game.resources, game.farmGrid, game.cityGrid, game.landmarksGrid, game.eventGrid, builtCountThisTurn]);

  // NOVO: Handler de ativação de magia
  const handleActivateMagic = useCallback((card: Card) => {
    console.log('=== PROCESSANDO CARTA DE MAGIA ===');
    console.log('Nome:', card.name);
    console.log('Efeito:', card.effect.description);
    console.log('Tipo:', card.type);
    
    const cost: Resources = {
      coins: card.cost.coins ?? 0,
      food: card.cost.food ?? 0,
      materials: card.cost.materials ?? 0,
      population: card.cost.population ?? 0,
    };
    if (!canPlayCard(game.resources, cost)) {
      setError('Recursos insuficientes para usar esta carta de magia.');
      return;
    }
    
    // Processar o efeito da carta de magia (inclui todos os tipos de efeitos)
    const effect = parseInstantEffect(card);
    console.log('Efeito parseado:', effect);
    
    // Combinar todos os efeitos
    const totalEffect: Partial<Resources> = { ...effect };
    
    let details: string[] = [];
    Object.entries(totalEffect).forEach(([key, value]) => {
      if (value && value > 0) details.push(`+${value} ${key}`);
    });
    console.log('Detalhes do efeito total:', details);
    
    setGame((g) => {
      // Remover apenas a primeira carta com este ID (não todas)
      const cardIndex = g.hand.findIndex((c) => c.id === card.id);
      const newHand = cardIndex !== -1 
        ? [...g.hand.slice(0, cardIndex), ...g.hand.slice(cardIndex + 1)]
        : g.hand;
      
      const newResources: Resources = {
        coins: g.resources.coins - (card.cost.coins ?? 0) + (totalEffect.coins ?? 0),
        food: g.resources.food - (card.cost.food ?? 0) + (totalEffect.food ?? 0),
        materials: g.resources.materials - (card.cost.materials ?? 0) + (totalEffect.materials ?? 0),
        population: g.resources.population - (card.cost.population ?? 0) + (totalEffect.population ?? 0),
      };
      console.log('Recursos antes:', g.resources);
      console.log('Recursos depois:', newResources);
      
      const newState = {
        ...g,
        hand: newHand,
        resources: newResources,
        comboEffects: [...g.comboEffects, card.effect.description],
      };
      console.log('✨ Magia ativada - novo estado:', {
        deckLength: newState.deck.length,
        handLength: newState.hand.length,
        cartaUsada: card.name
      });
      return newState;
    });
    setActionSummary(`Magia ativada: ${card.name} (${details.join(', ') || 'efeito aplicado'})`);
            addToHistory(`✨ Usou magia: ${card.name}`);
    setSelectedCard(null);
    setSelectedGrid(null);
    setError(null);
    setTimeout(() => setActionSummary(null), 1800);
  }, [game]);

  // NOVO: Handler de ativação de defesa (reação a evento)
  const handleActivateDefense = useCallback((card: Card) => {
    //console.log('=== PROCESSANDO CARTA DE DEFESA ===');
    //console.log('Nome:', card.name);
    //console.log('Efeito:', card.effect.description);
    
    const cost: Resources = {
      coins: card.cost.coins ?? 0,
      food: card.cost.food ?? 0,
      materials: card.cost.materials ?? 0,
      population: card.cost.population ?? 0,
    };
    if (!canPlayCard(game.resources, cost)) {
      setError('Recursos insuficientes para usar esta carta de defesa.');
      return;
    }
    
    // Processar o efeito da carta de defesa
    const effect = parseInstantEffect(card);
    //console.log('Efeito parseado:', effect);
    
    let details: string[] = [];
    Object.entries(effect).forEach(([key, value]) => {
      if (value && value > 0) details.push(`+${value} ${key}`);
    });
    //console.log('Detalhes do efeito:', details);
    
    setGame((g) => {
      // Remover apenas a primeira carta com este ID (não todas)
      const cardIndex = g.hand.findIndex((c) => c.id === card.id);
      const newHand = cardIndex !== -1 
        ? [...g.hand.slice(0, cardIndex), ...g.hand.slice(cardIndex + 1)]
        : g.hand;
      
      const newResources: Resources = {
        coins: g.resources.coins - (card.cost.coins ?? 0) + (effect.coins ?? 0),
        food: g.resources.food - (card.cost.food ?? 0) + (effect.food ?? 0),
        materials: g.resources.materials - (card.cost.materials ?? 0) + (effect.materials ?? 0),
        population: g.resources.population - (card.cost.population ?? 0) + (effect.population ?? 0),
      };
      //console.log('Recursos antes:', g.resources);
      //console.log('Recursos depois:', newResources);
      
      return {
      ...g,
        hand: newHand,
        resources: newResources,
              comboEffects: [...g.comboEffects, card.effect.description],
      };
    });
    setActionSummary(`Defesa ativada: ${card.name} (${details.join(', ') || 'efeito aplicado'})`);
            addToHistory(`🛡️ Usou defesa: ${card.name}`);
    setPendingDefense(null);
    setSelectedCard(null);
    setSelectedGrid(null);
    setError(null);
    setTimeout(() => setActionSummary(null), 1800);
  }, [game]);

  const handleDiscardCard = useCallback((card: Card) => {
    //console.log(`Descartando carta: ${card.name}`);
    
    // Remover carta da mão
    const cardIndex = game.hand.findIndex(c => c.id === card.id);
    const newHand = game.hand.filter((_, index) => index !== cardIndex);
    
    // Adicionar ao descarte
    setDiscardedCards(prev => [...prev, card]);
    
    // Atualizar jogo
    setGame(prev => {
      const newState = {
        ...prev,
        hand: newHand
      };
      /*console.log('🗑️ Carta descartada manualmente - novo estado:', {
        deckLength: newState.deck.length,
        handLength: newState.hand.length,
        cartaDescartada: card.name
      });*/
      return newState;
    });
    
    // Limpar modal e erro
    setDiscardMode(false);
    setError(null);
    
    // Adicionar ao histórico
            addToHistory(`🗑️ Descartou: ${card.name}`);
    
    // Feedback visual
    setHighlight(`🗑️ Carta descartada: ${card.name}`);
    setTimeout(() => setHighlight(null), 2000);
    
    //console.log(`Carta ${card.name} descartada`);
  }, [game.hand]);

  const handleDiceRoll = useCallback(() => {
    if (game.phase !== 'build' || diceUsed) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceResult(roll);
    setDiceUsed(true);
    // Produção baseada no dado
    let prod: Resources = { coins: 0, food: 0, materials: 0, population: 0 };
    let details: string[] = [];
    const allCards = [
      ...game.farmGrid.flat().map((cell) => cell.card).filter(Boolean),
      ...game.cityGrid.flat().map((cell) => cell.card).filter(Boolean),
    ] as Card[];
    const activatedCardIds: string[] = [];
    allCards.forEach((card) => {
      const diceProd = parseDiceProduction(card);
      if (diceProd && diceProd.dice === roll) {
        // Rastrear cartas ativadas
        activatedCardIds.push(card.id);
        
        Object.entries(diceProd.prod).forEach(([key, value]) => {
          prod[key as keyof Resources] += value || 0;
          if (value && value > 0) details.push(`${card.name}: +${value} ${key}`);
        });
      }
    });
    
    // Atualizar estado de cartas ativadas
    if (activatedCardIds.length > 0) {
      setActivatedCards(prev => {
        const newState = { ...prev };
        activatedCardIds.forEach(cardId => {
          newState[cardId] = roll;
        });
        return newState;
      });
    }
    if (prod.coins || prod.food || prod.materials) {
      setDiceProductionSummary(
        `Dado: ${roll} | Produção: ${details.join(', ')}.`
      );
    } else {
      setDiceProductionSummary(`Dado: ${roll} | Nenhuma produção ativada.`);
    }
    setGame((g) => ({
      ...g,
      resources: {
        coins: g.resources.coins + prod.coins,
        food: g.resources.food + prod.food,
        materials: g.resources.materials + prod.materials,
        population: g.resources.population,
      },
      playerStats: {
        ...g.playerStats,
        totalProduction: g.playerStats.totalProduction + prod.coins + prod.food + prod.materials,
      },
    }));
    
    // O resultado do dado persiste até a próxima fase de construção
    // Não limpar automaticamente - será limpo apenas quando necessário
  }, [game.phase, diceUsed, game.farmGrid, game.cityGrid]);
  
  // Limpar cartas ativadas quando o turno muda
  useEffect(() => {
    if (game.phase === 'draw') {
      setActivatedCards({});
    }
  }, [game.phase]);

  const handleProduction = useCallback(() => {
    let prod: Resources = { coins: 0, food: 0, materials: 0, population: 0 };
    let details: string[] = [];
    const allCards = [
      ...game.farmGrid.flat().map((cell) => cell.card).filter(Boolean),
      ...game.cityGrid.flat().map((cell) => cell.card).filter(Boolean),
    ] as Card[];
    
    // Filtrar apenas cartas não desativadas
    const activeCards = allCards.filter(card => !card.deactivated);
    
    activeCards.forEach((card) => {
      // Só produz se não for produção baseada em dado
      if (!parseDiceProduction(card)) {
        const p = parseProduction(card);
        Object.entries(p).forEach(([key, value]) => {
          prod[key as keyof Resources] += value || 0;
          if (value && value > 0) details.push(`${card.name}: +${value} ${key}`);
        });
      }
    });
    
    // Processar efeitos dos eventos ativos
    const eventEffects = processEventEffects(game.eventGrid);
    Object.entries(eventEffects).forEach(([key, value]) => {
      if (value) {
        prod[key as keyof Resources] += value;
        if (value > 0) {
          details.push(`🎭 Evento: +${value} ${key}`);
        } else {
          details.push(`🎭 Evento: ${value} ${key}`);
        }
      }
    });
    
    // APLICAR REDUÇÃO DE CATÁSTROFE SE ATIVA
    const catastropheReduction = game.productionReduction || 0;
    if (catastropheReduction > 0) {
      const originalProd = { ...prod };
      prod.coins = Math.floor(prod.coins * (1 - catastropheReduction));
      prod.food = Math.floor(prod.food * (1 - catastropheReduction));
      prod.materials = Math.floor(prod.materials * (1 - catastropheReduction));
      prod.population = Math.floor(prod.population * (1 - catastropheReduction));
      
      // Adicionar detalhes da redução
      if (originalProd.coins > prod.coins) details.push(`🌪️ Catástrofe: -${originalProd.coins - prod.coins} coins`);
      if (originalProd.food > prod.food) details.push(`🌪️ Catástrofe: -${originalProd.food - prod.food} food`);
      if (originalProd.materials > prod.materials) details.push(`🌪️ Catástrofe: -${originalProd.materials - prod.materials} materials`);
      if (originalProd.population > prod.population) details.push(`🌪️ Catástrofe: -${originalProd.population - prod.population} population`);
    }
    
    // Atualiza produção total
    setGame((g) => ({
      ...g,
      resources: {
        coins: g.resources.coins + prod.coins,
        food: g.resources.food + prod.food,
        materials: g.resources.materials + prod.materials,
        population: g.resources.population + prod.population,
      },
      playerStats: {
        ...g.playerStats,
        totalProduction: g.playerStats.totalProduction + prod.coins + prod.food + prod.materials + prod.population,
      },
      phase: 'production',
    }));
    if (prod.coins || prod.food || prod.materials || prod.population) {
      setProductionSummary(
        `Produção: ${details.join(', ')}.`
      );
    } else {
      setProductionSummary('Nenhuma produção neste turno.');
    }
    setTimeout(() => {
      setGame((g) => ({ ...g, phase: 'end' }));
      setProductionSummary(null);
    }, 1800);
  }, [game.farmGrid, game.cityGrid, game.eventGrid, game.productionReduction]);

  // --- PROPS PARA COMPONENTES ---
  const { prod: prodPerTurn, details: prodDetails } = getProductionPerTurnDetails(game.farmGrid, game.cityGrid);
  
  // Aplicar redução de produção se houver catástrofe ativa
  const catastropheReduction = game.productionReduction || 0;
  const adjustedProdPerTurn = catastropheReduction > 0 ? {
    coins: Math.floor(prodPerTurn.coins * (1 - catastropheReduction)),
    food: Math.floor(prodPerTurn.food * (1 - catastropheReduction)),
    materials: Math.floor(prodPerTurn.materials * (1 - catastropheReduction)),
    population: Math.floor(prodPerTurn.population * (1 - catastropheReduction))
  } : prodPerTurn;
  
  // Calcular perdas por turno devido à catástrofe
  const catastropheLosses = catastropheReduction > 0 ? {
    coins: prodPerTurn.coins - adjustedProdPerTurn.coins,
    food: prodPerTurn.food - adjustedProdPerTurn.food,
    materials: prodPerTurn.materials - adjustedProdPerTurn.materials,
    population: prodPerTurn.population - adjustedProdPerTurn.population
  } : { coins: 0, food: 0, materials: 0, population: 0 };

  // Debug: verificar gameSettings
  //console.log('🔍 Debug gameSettings:', {
  //  victoryMode: gameSettings?.victoryMode,
  //  victoryValue: gameSettings?.victoryValue,
  //  gameSettings: gameSettings
  //});

  const sidebarProps = {
    resources: {
      coins: game.resources.coins,
      food: game.resources.food,
      materials: game.resources.materials,
      population: game.resources.population,
      coinsPerTurn: prodPerTurn.coins,
      foodPerTurn: prodPerTurn.food,
      materialsPerTurn: prodPerTurn.materials,
      populationStatus: game.resources.population > 0 ? 'Estável' : 'Crítico',
    },
    progress: {
      reputation: game.playerStats.reputation,
      reputationMax: gameSettings.prestigeGoal || 30,
      production: game.playerStats.totalProduction,
      productionMax: 1000,
      landmarks: game.playerStats.landmarks,
      landmarksMax: gameSettings?.victoryMode === 'landmarks' ? gameSettings.victoryValue : 3,
      turn: game.turn,
      turnMax: gameSettings.gameTurnLimit || 50,
    },
    victory: {
      reputation: game.playerStats.reputation,
      production: game.playerStats.totalProduction,
      landmarks: game.playerStats.landmarks,
      turn: game.turn,
      mode: gameSettings?.victoryMode || 'landmarks',
      value: gameSettings?.victoryValue || 3,
    },
    history,
  };
  
  const topBarProps = {
    turn: game.turn,
    turnMax: gameSettings.gameTurnLimit || 50,
    buildCount: game.builtCountThisTurn,
    buildMax: 2,
    phase: game.phase,
    onNextPhase: handleNextPhase,
    discardMode,
    reputation: game.playerStats.reputation,
    reputationGoal: gameSettings.prestigeGoal || 30,
    catastropheActive: catastropheReduction > 0,
    catastropheName: game.catastropheName || (catastropheReduction > 0 ? 'Redução de Produção' : undefined),
    catastropheDuration: game.catastropheDuration,
    resources: game.resources,
    productionPerTurn: adjustedProdPerTurn,
    productionDetails: prodDetails,
    catastropheLosses, // Perdas por turno devido à catástrofe
    // Props do sistema de dado
    onDiceRoll: handleDiceRoll,
    diceUsed,
    diceResult,
  };
  
  const gridBoardProps = {
    farmGrid: game.farmGrid,
    cityGrid: game.cityGrid,
    eventGrid: game.eventGrid,
    landmarksGrid: game.landmarksGrid,
    farmCount: game.farmGrid.flat().filter(cell => cell.card).length,
    farmMax: 12, // 4x3 grid para o novo layout
    cityCount: game.cityGrid.flat().filter(cell => cell.card).length,
    cityMax: 12, // 4x3 grid para o novo layout
    eventCount: game.eventGrid.flat().filter(cell => cell.card).length,
    eventMax: 2, // 1x2 grid
    landmarkCount: game.landmarksGrid.flat().filter(cell => cell.card).length,
    landmarkMax: 3, // 1x3 grid
    onSelectFarm: handleSelectFarm,
    onSelectCity: handleSelectCity,
    onSelectEvent: (x: number, y: number) => handleSelectCell('event', x, y),
    onSelectLandmark: (x: number, y: number) => handleSelectCell('landmarks', x, y),
    highlightFarm: selectedGrid === 'farm',
    highlightCity: selectedGrid === 'city',
    highlightEvent: selectedGrid === 'event',
    highlightLandmark: selectedGrid === 'landmark',
  };
  
  const handProps = useMemo(() => {
    /*console.log('🎮 handProps useMemo executado:', {
      handLength: game.hand.length,
      handCards: game.hand.map(c => c.name),
      deckLength: game.deck.length,
      activeDeckLength: activeDeck?.cards?.length,
      selectedCardId: selectedCard?.id
    });*/
    
    // Calcular cartas restantes no baralho: total do deck ativo - cartas na mão
    const totalDeckCards = activeDeck?.cards?.length || game.deck.length;
    const cardsInHand = game.hand.length;
    const remainingDeckCards = Math.max(0, totalDeckCards - cardsInHand);
    
    return {
      hand: game.hand,
      onSelectCard: handleSelectCard,
      selectedCardId: selectedCard?.id,
      canPlayCard: canPlayCardUI,
      onDiscardCard: handleDiscardCard,
      discardMode,
      deckSize: remainingDeckCards,
    };
  }, [game.hand, game.deck.length, activeDeck?.cards?.length, selectedCard?.id, discardMode, handleSelectCard, canPlayCardUI, handleDiscardCard]);

  const discardModal = discardMode;

  // Função para limpar estado salvo
  const clearSavedGame = useCallback(() => {
    try {
      localStorage.removeItem('famand_gameState');
      //console.log('🎮 Estado do jogo salvo foi limpo');
    } catch (error) {
      console.error('Erro ao limpar estado do jogo:', error);
    }
  }, []);

  // Função para atualizar o estado do jogo (usada para carregar jogos salvos)
  const updateGameState = useCallback((newGameState: GameState, gameMode?: string) => {
    /*console.log('🎮 Atualizando estado do jogo:', {
      turn: newGameState.turn,
      handLength: newGameState.hand?.length,
      deckLength: newGameState.deck?.length,
      resources: newGameState.resources
    });*/

    // Aplicar o sistema de vitória correto baseado no modo de jogo carregado ou atual
    let correctVictorySystem;
    let targetMode = gameMode || gameSettings?.victoryMode;
    
    /*console.log('🎮 Aplicando sistema de vitória:', {
      savedMode: gameMode,
      currentMode: gameSettings?.victoryMode,
      targetMode
    });*/ 
    
    if (targetMode === 'complex') {
      correctVictorySystem = createComplexVictorySystem();
    } else if (targetMode === 'classic') {
      correctVictorySystem = createClassicVictorySystem();
    } else if (targetMode === 'infinite') {
      correctVictorySystem = createInfiniteVictorySystem();
    } else if (targetMode === 'landmarks') {
      // Modo simples - landmarks
      correctVictorySystem = createSimpleVictorySystem();
      correctVictorySystem.conditions[0].category = 'landmarks';
      correctVictorySystem.conditions[0].name = 'Marcos Históricos';
      correctVictorySystem.conditions[0].description = `Construa ${gameSettings?.victoryValue || 3} marcos históricos`;
      correctVictorySystem.conditions[0].target = gameSettings?.victoryValue || 3;
    } else if (targetMode === 'reputation') {
      // Modo simples - reputação
      correctVictorySystem = createSimpleVictorySystem();
      correctVictorySystem.conditions[0].category = 'reputation';
      correctVictorySystem.conditions[0].name = 'Reputação';
      correctVictorySystem.conditions[0].description = `Alcance ${gameSettings?.victoryValue || 10} pontos de reputação`;
      correctVictorySystem.conditions[0].target = gameSettings?.victoryValue || 10;
    } else if (targetMode === 'elimination') {
      // Modo simples - sobrevivência
      correctVictorySystem = createSimpleVictorySystem();
      correctVictorySystem.conditions[0].category = 'survival';
      correctVictorySystem.conditions[0].name = 'Sobrevivência';
      correctVictorySystem.conditions[0].description = `Sobreviva ${gameSettings?.victoryValue || 20} turnos`;
      correctVictorySystem.conditions[0].target = gameSettings?.victoryValue || 20;
    } else if (targetMode === 'resources') {
      // Modo simples - recursos
      correctVictorySystem = createSimpleVictorySystem();
      correctVictorySystem.conditions[0].category = 'coins';
      correctVictorySystem.conditions[0].name = 'Prosperidade';
      correctVictorySystem.conditions[0].description = `Acumule ${gameSettings?.victoryValue || 50} moedas`;
      correctVictorySystem.conditions[0].target = gameSettings?.victoryValue || 50;
    } else if (targetMode === 'production') {
      // Modo simples - produção
      correctVictorySystem = createSimpleVictorySystem();
      correctVictorySystem.conditions[0].category = 'production';
      correctVictorySystem.conditions[0].name = 'Produção';
      correctVictorySystem.conditions[0].description = `Produza ${gameSettings?.victoryValue || 10} recursos por turno`;
      correctVictorySystem.conditions[0].target = gameSettings?.victoryValue || 10;
    } else {
      // Fallback para modo simples padrão
      correctVictorySystem = createSimpleVictorySystem();
    }

    // Atualizar o estado com o sistema de vitória correto
    const updatedGameState = {
      ...newGameState,
      victorySystem: correctVictorySystem
    };

    /*console.log('🎮 Estado atualizado com sistema de vitória correto:', {
      mode: correctVictorySystem.mode,
      conditions: correctVictorySystem.conditions.length
    });*/ 

    setGame(updatedGameState);
  }, [gameSettings]);

      return {
      sidebarProps,
      topBarProps,
      gridBoardProps,
      handProps,
      discardModal,
      // Estados e handlers adicionais
      game,
      selectedCard,
      selectedGrid,
      error,
      setError,
      victory,
      setVictory,
      defeat,
      setDefeat,
      history,
      highlight,
      productionSummary,
      actionSummary,
      diceResult,
      diceUsed,
      diceProductionSummary,
      pendingDefense,
      activatedCards, // Cartas ativadas por dado
      // Estado de loading
      loading: gameLoading,
      // Props para modo infinito
      discardedCards,
      deckReshuffled,
      // Handlers
      handleNextPhase,
      handleSelectCard,
      handleSelectCell,
      handleSelectFarm,
      handleSelectCity,
      handleDiscardCard,
      handleDiceRoll,
      handleProduction,
      handleActivateMagic,
      handleActivateDefense,
      canPlayCardUI,
      // Funções de persistência
      saveGameState,
      clearSavedGame,
      updateGameState,
    };
}