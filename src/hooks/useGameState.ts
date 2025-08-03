import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GameState, GamePhase, GridCell } from '../types/gameState';
import { Resources } from '../types/resources';
import { Card, CardType } from '../types/card';
import { createEmptyGrid, shuffle, getInitialState, createComplexVictorySystem, createSimpleVictorySystem, updateVictoryConditions } from '../utils/gameUtils';
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
  
  //  console.log('🔍 parseInstantEffect para:', card.name);
  //console.log('Efeito:', effect);
  
  // Padrões mais abrangentes para reconhecer diferentes formas de expressar ganho
  const patterns = [
    // Efeitos de conversão bidirecional (NOVO - DEVE VIR PRIMEIRO)
    /transforme (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) em (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) ou (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) em (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações)/i,
    /troque (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) ou (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações)/i,
    /converta (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) em (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) ou (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) em (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações)/i,
    
    // Múltiplos recursos: "ganhe X recurso e Y recurso"
    /ganhe (\d+) (comida|moeda|material|população) e (\d+) (comida|moeda|material|população)/,
    /ganho instantâneo de (\d+) (comida|moeda|material|população) e (\d+) (comida|moeda|material|população)/,
    /receba (\d+) (comida|moeda|material|população) e (\d+) (comida|moeda|material|população)/,
    /obtenha (\d+) (comida|moeda|material|população) e (\d+) (comida|moeda|material|população)/,
    /adicione (\d+) (comida|moeda|material|população) e (\d+) (comida|moeda|material|população)/,
    
    // Recurso único: "ganhe X recurso"
    /ganhe (\d+) (comida|moeda|material|população)/,
    /ganho instantâneo de (\d+) (comida|moeda|material|população)/,
    /receba (\d+) (comida|moeda|material|população)/,
    /obtenha (\d+) (comida|moeda|material|população)/,
    /adicione (\d+) (comida|moeda|material|população)/,
    
    // Efeitos de população específicos
    /aumenta população em (\d+)/,
    /aumenta população máxima em (\d+)/,
    /fornece (\d+) população/,
    /contratar trabalhadores/,
    
    // Efeitos de reputação
    /\+(\d+) reputação/,
    /fornece (\d+) reputação/,
    /garante (\d+) reputação/,
    
    // Efeitos de conversão/troca
    /troque (\d+) (comida|moeda|material|população) por (\d+) (comida|moeda|material|população)/,
    /converta (\d+) (comida|moeda|material|população) em (\d+) (comida|moeda|material|população)/,
    /reduz custo de construção em (\d+) material/,
    
    // Efeitos condicionais simples
    /ganha (\d+) moedas/,
    /ganha (\d+) comida/,
    /ganha (\d+) material/,
    
    // Efeitos condicionais complexos
    /ganha (\d+) (comida|moeda|material|população)\. se você tiver (\d+) ou mais (trabalhadores|fazendas|cidades|materiais|moedas|comida)/,
    /ganha (\d+) (comida|moeda|material|população) se você tiver (\d+) ou mais (trabalhadores|fazendas|cidades|materiais|moedas|comida)/,
    /se você tiver (\d+) ou mais (trabalhadores|fazendas|cidades|materiais|moedas|comida), ganha (\d+) (comida|moeda|material|população)/,
    
    // Efeitos condicionais com "em vez disso"
    /ganha (\d+) (comida|moeda|material|população)\. se você tiver (uma|alguma) (cidade|fazenda), ganha (\d+) (comida|moeda|material|população) em vez disso/,
    /ganha (\d+) (comida|moeda|material|população)\. se você tiver (\d+) ou mais (trabalhadores|fazendas|cidades), ganha (\d+) (comida|moeda|material|população) em vez disso/,
    
    // Efeitos "para cada X que você tem"
    /ganha (\d+) (comida|moeda|material|população) para cada (\d+) (moedas|materiais|comida|fazendas|cidades) que você tem/,
    /no final do turno, ganha (\d+) (comida|moeda|material|população) para cada (\d+) (moedas|materiais|comida|fazendas|cidades) que você tem/,
    /no início de cada turno, ganha (\d+) (comida|moeda|material|população)/,
    
    // Efeitos de perda/dano
    /perde (\d+) (comida|moeda|material|população)/,
    /todos os jogadores perdem (\d+) (comida|moeda|material|população)/,
    /perdem metade de suas (moedas|materiais|comida)/,
    
    // Efeitos de duplicação/multiplicação
    /duplica (produção de comida|produção de moedas|produção de materiais)/,
    /dobra (produção de comida|produção de moedas|produção de materiais)/,
    /duplica (produção de comida|produção de moedas|produção de materiais) por (\d+) turno/,
    /dobra (produção de comida|produção de moedas|produção de materiais) por (\d+) turno/,
    /duplica (produção de comida|produção de moedas|produção de materiais) por (\d+) turnos/,
    /dobra (produção de comida|produção de moedas|produção de materiais) por (\d+) turnos/,
    /duplica (produção de comida|produção de moedas|produção de materiais) neste turno/,
    /dobra (produção de comida|produção de moedas|produção de materiais) neste turno/,
    /todas as suas fazendas produzem \+(\d+) comida/,
    /todas as suas cidades produzem \+(\d+) (moeda|material)/,
    
    // ❌ REMOVIDO: Padrão genérico que causava duplicação
    // /(\d+) (comida|moeda|material|população)/,
  ];
  
  let prod: Partial<Resources> = {};
  
  // Processar TODOS os padrões que correspondem, não apenas o primeiro
  for (const pattern of patterns) {
    const matches = effect.matchAll(new RegExp(pattern, 'g'));
    
    for (const match of matches) {
      //console.log('✅ Padrão instantâneo encontrado:', pattern);
      //console.log('Match:', match);
      
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
        
        /*console.log('🔄 Efeito bidirecional instantâneo:', { 
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
        
        //console.log('🔄 Efeito bidirecional instantâneo aplicado:', prod);
        continue; // Pular para o próximo padrão
      }
      
      // Verificar se é padrão com múltiplos recursos (tem 4 grupos de captura)
      if (match.length >= 5) {
        // Padrão: "ganhe X recurso1 e Y recurso2"
        const value1 = parseInt(match[1], 10);
        const resourceType1 = match[2];
        const value2 = parseInt(match[3], 10);
        const resourceType2 = match[4];
        
        //  console.log('Múltiplos recursos instantâneos:', { value1, resourceType1, value2, resourceType2 });
        
        // Adicionar primeiro recurso
        switch (resourceType1) {
          case 'comida':
          case 'comidas':
            prod.food = (prod.food || 0) + value1;
            break;
          case 'moeda':
          case 'moedas':
            prod.coins = (prod.coins || 0) + value1;
            break;
          case 'material':
          case 'materiais':
            prod.materials = (prod.materials || 0) + value1;
            break;
          case 'população':
          case 'populações':
            prod.population = (prod.population || 0) + value1;
            break;
        }
        
        // Adicionar segundo recurso
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
      } else {
        // Padrão: "ganhe X recurso" (recurso único)
        const value = parseInt(match[1], 10);
        const resourceType = match[2];
        
        //console.log('Recurso único instantâneo:', { value, resourceType });
        
        switch (resourceType) {
          case 'comida':
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
            prod.population = (prod.population || 0) + value;
            break;
        }
      }
    }
  }
  
  //  console.log('🎯 Efeito instantâneo parseado:', prod);
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
      /*console.log('🎭 Processando evento:', {
        nome: cell.card.name,
        efeito: cell.card.effect.description,
        efeitoParseado: eventEffect
      });*/
      
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
      //  console.log('🔍 loadGameState chamado');
      //console.log('activeDeck?.id:', activeDeck?.id);
      
      const savedState = localStorage.getItem('famand_gameState');
      //console.log('Estado salvo no localStorage:', savedState ? 'EXISTE' : 'NÃO EXISTE');
      
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        /*console.log('Estado parseado:', {
          timestamp: parsedState.timestamp,
          deckActiveId: parsedState.deckActiveId,
          turn: parsedState.turn,
          handLength: parsedState.hand?.length
        });*/
        
        // Verificar se o estado é válido e não muito antigo (24 horas)
        const isRecent = Date.now() - parsedState.timestamp < 24 * 60 * 60 * 1000;
        const isSameDeck = parsedState.deckActiveId === activeDeck?.id;
        
        /*console.log('Validações:', {
          isRecent,
          isSameDeck,
          currentTime: Date.now(),
          savedTime: parsedState.timestamp,
          timeDiff: Date.now() - parsedState.timestamp
        });*/
        
        if (isRecent && isSameDeck) {
          /*console.log('🎮 Estado do jogo carregado:', {
            turn: parsedState.turn,
            phase: parsedState.phase,
            resources: parsedState.resources,
            deckLength: parsedState.deck?.length,
            handLength: parsedState.hand?.length
          });*/
          return parsedState;
        } else {
          //console.log('🎮 Estado do jogo ignorado (antigo ou deck diferente)');
          //console.log('Razão:', !isRecent ? 'Muito antigo' : 'Deck diferente');
          localStorage.removeItem('famand_gameState');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar estado do jogo:', error);
      localStorage.removeItem('famand_gameState');
    }
    //console.log('🔍 loadGameState retornando null');
    return null;
  }, [activeDeck?.id]);

  const [game, setGame] = useState<GameState>(() => {
    // Estado inicial com recursos padrão
    const initialState = getInitialState([]);
    initialState.resources = { coins: 5, food: 5, materials: 5, population: 3 };
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
    if (!settingsLoading && gameSettings) {
      setGame(prev => {
        let victorySystem;
        
        // Configurar sistema de vitória baseado no modo
        if (gameSettings.victoryMode === 'complex') {
          victorySystem = createComplexVictorySystem();
        } else {
          // Modo simples com uma condição
          victorySystem = createSimpleVictorySystem();
          // Ajustar a condição baseada no modo
          if (gameSettings.victoryMode === 'landmarks') {
            victorySystem.conditions[0].target = gameSettings.victoryValue;
          } else if (gameSettings.victoryMode === 'reputation') {
            victorySystem.conditions[0].category = 'reputation';
            victorySystem.conditions[0].name = 'Reputação';
            victorySystem.conditions[0].description = `Alcance ${gameSettings.victoryValue} pontos de reputação`;
            victorySystem.conditions[0].target = gameSettings.victoryValue;
          } else if (gameSettings.victoryMode === 'elimination') {
            victorySystem.conditions[0].category = 'survival';
            victorySystem.conditions[0].name = 'Sobrevivência';
            victorySystem.conditions[0].description = `Sobreviva ${gameSettings.victoryValue} turnos`;
            victorySystem.conditions[0].target = gameSettings.victoryValue;
          }
        }
        
        return {
        ...prev,
          resources: gameSettings.defaultStartingResources,
          victorySystem
        };
      });
    } else if (!settingsLoading) {
      // Se não há configurações, dar recursos básicos e sistema simples
      setGame(prev => ({
        ...prev,
        resources: {
          coins: 5,
          food: 5,
          materials: 5,
          population: 3
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
      
      // TEMPORÁRIO: Remover verificação de estado salvo para debug
      //console.log('🆕 Inicializando novo jogo (debug mode)...');
      //console.log('✅ Deck ativo encontrado, chamando getActiveDeck...');
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
        saveGameState(game);
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

  // Efeito: derrota se população chegar a 0 ou reputação chegar a -1
  useEffect(() => {
    if (gameLoading) return;
    if (game.resources.population <= 0 && !defeat) {
      setDefeat('Derrota: Sua população chegou a 0!');
      addToHistory('❌ Derrota: população chegou a 0!');
    }
    if (game.playerStats.reputation <= -1 && !defeat) {
      setDefeat('💀 Derrota! Sua reputação chegou a -1. O baralho vazio consumiu toda sua credibilidade.');
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
  useEffect(() => {
    if (defeat) {
      setTimeout(() => setDefeat(null), 6000);
    }
  }, [defeat]);

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
      
      // Reduzir reputação
      setGame((g) => ({
        ...g,
        playerStats: { ...g.playerStats, reputation: g.playerStats.reputation - 1 },
      }));
      
      const newReputation = game.playerStats.reputation - 1;
      
      if (newReputation <= -1) {
        // Derrota automática se reputação chegar a -1 ou menos
        setDefeat('💀 Derrota! Sua reputação chegou a -1. O baralho vazio consumiu toda sua credibilidade.');
        addToHistory('💀 Derrota por reputação -1: baralho vazio');
      } else {
        // Apenas penalidade de reputação
        setHighlight('⚠️ Baralho vazio! -1 reputação');
        addToHistory(`⚠️ Baralho vazio! -1 reputação (${newReputation}/10)`);
        setTimeout(() => setHighlight(null), 2000);
      }
    }
    
    if (game.phase !== 'end') {
      emptyDeckPenaltyProcessed.current = false;
    }
  }, [game.phase, game.hand.length, activeDeck?.cards?.length, game.deck.length, defeat, gameLoading, game.playerStats.reputation]);

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
        setDefeat(`❌ Derrota: Limite de ${turnLimit} turnos atingido`);
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
      
      // Gerar catástrofe aleatória (10% de chance por turno)
      const catastropheChance = 0.1;
      if (Math.random() < catastropheChance) {
        const catastrophe = generateRandomCatastrophe(newTurn);
        if (catastrophe) {
          // Aplicar efeito da catástrofe
          const modifiedState = applyCatastropheEffect(catastrophe, game);
          
          // Atualizar estado do jogo com os efeitos da catástrofe
          setGame((g) => ({
            ...g,
            turn: newTurn,
            phase: 'draw',
            resources: modifiedState.resources,
            // Adicionar efeitos temporários se necessário
            ...(modifiedState.productionReduction && { productionReduction: modifiedState.productionReduction }),
            ...(modifiedState.cardDestructionCount && { cardDestructionCount: modifiedState.cardDestructionCount })
          }));
          
          addToHistory(`🌪️ Catástrofe: ${catastrophe.name} - ${catastrophe.description}`);
          setError(`🌪️ ${catastrophe.name}: ${catastrophe.description}`);
          
          // Limpar erro após 3 segundos
          setTimeout(() => setError(null), 3000);
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
    //console.log('=== PROCESSANDO CARTA DE MAGIA ===');
    //console.log('Nome:', card.name);
    //console.log('Efeito:', card.effect.description);
    
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
    
    // Processar o efeito da carta de magia
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
      
      const newState = {
        ...g,
        hand: newHand,
        resources: newResources,
        comboEffects: [...g.comboEffects, card.effect.description],
      };
      /*console.log('✨ Magia ativada - novo estado:', {
        deckLength: newState.deck.length,
        handLength: newState.hand.length,
        cartaUsada: card.name
      });*/
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
    allCards.forEach((card) => {
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
  }, [game.farmGrid, game.cityGrid, game.eventGrid]);

  // --- PROPS PARA COMPONENTES ---
  const { prod: prodPerTurn, details: prodDetails } = getProductionPerTurnDetails(game.farmGrid, game.cityGrid);

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
    catastropheActive: false, // Será implementado quando houver catástrofe ativa
    catastropheName: undefined,
    resources: game.resources,
    productionPerTurn: prodPerTurn,
    productionDetails: prodDetails,
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
      defeat,
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
    };
}