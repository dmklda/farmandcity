import React, { useState } from 'react';
import { Button } from './ui/button';
import { TestTube, Target, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useDialog } from './ui/dialog';
import { GameState } from '../types/gameState';

interface TestModeButtonProps {
  gameState: GameState;
  victorySystem: any;
  onTestVictory: () => void;
  onTestDefeat: (defeatType?: 'population' | 'reputation' | 'turns' | 'deck') => void;
  isTestMode: boolean;
  onUpdateGameState?: (updates: Partial<GameState>) => void;
}

export const TestModeButton: React.FC<TestModeButtonProps> = ({
  gameState,
  victorySystem,
  onTestVictory,
  onTestDefeat,
  isTestMode,
  onUpdateGameState
}) => {
  const { showAlert } = useDialog();
  const [testing, setTesting] = useState(false);
  const [testingDefeat, setTestingDefeat] = useState(false);

  const runVictoryTest = async () => {
    setTesting(true);
    
    try {
      console.log('🔍 Iniciando teste de vitória...');
      console.log('Modo:', victorySystem.mode);
      console.log('Condições:', victorySystem.conditions);
      
      // Simular um pequeno delay para mostrar o teste
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar condições de vitória atuais
      const testResults = checkVictoryConditions();
      console.log('📊 Resultados iniciais:', testResults);
      
      // Mostrar resultados atuais
      showTestResults(testResults);
      
      // Perguntar se quer preencher as condições automaticamente
      if (confirm(`Deseja preencher automaticamente todas as condições de vitória para testar o modal?\n\nModo: ${victorySystem.mode.toUpperCase()}\nIsso irá simular o preenchimento das condições necessárias.`)) {
        console.log('⚡ Preenchendo condições automaticamente...');
        
        // Preencher condições automaticamente
        fillVictoryConditions();
        
        // Aguardar um pouco para o estado atualizar
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar novamente as condições
        const newTestResults = checkVictoryConditions();
        console.log('📊 Novos resultados:', newTestResults);
        
        // Mostrar novos resultados
        showTestResults(newTestResults);
        
        // Se todas as condições foram atendidas, simular vitória
        if (newTestResults.allConditionsMet) {
          console.log('🏆 Todas as condições atendidas! Simulando vitória...');
          onTestVictory();
        } else {
          console.log('❌ Condições ainda não atendidas após preenchimento');
        }
      }
      
    } catch (error) {
      console.error('Erro no teste de vitória:', error);
      showAlert('Erro no Teste', 'Ocorreu um erro durante o teste de vitória.');
    } finally {
      setTesting(false);
    }
  };

  const runDefeatTest = async () => {
    setTestingDefeat(true);
    
    try {
      console.log('💀 Iniciando teste de derrota...');
      
      // Simular um pequeno delay para mostrar o teste
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Perguntar qual tipo de derrota simular
      const defeatType = prompt(`Escolha o tipo de derrota para simular:\n\n1 - População = 0\n2 - Reputação = -1\n3 - Limite de turnos\n4 - Baralho vazio\n\nDigite o número (1-4):`);
      
      if (defeatType) {
        console.log('💀 Simulando derrota tipo:', defeatType);
        
        // Simular condições reais de derrota
        const updates: Partial<GameState> = {};
        
        switch (defeatType) {
          case '1':
            // População = 0
            updates.resources = {
              ...gameState.resources,
              population: 0
            };
            break;
          case '2':
            // Reputação = -1
            updates.playerStats = {
              ...gameState.playerStats,
              reputation: -1
            };
            break;
          case '3':
            // Limite de turnos
            updates.turn = 51; // Acima do limite padrão de 50
            break;
          case '4':
            // Baralho vazio + reputação baixa
            updates.deck = [];
            updates.playerStats = {
              ...gameState.playerStats,
              reputation: -1
            };
            break;
          default:
            showAlert('Erro', 'Opção inválida. Escolha 1, 2, 3 ou 4.');
            setTestingDefeat(false);
            return;
        }
        
        // Aplicar as mudanças para simular a derrota real
        if (onUpdateGameState) {
          onUpdateGameState(updates);
          console.log('💀 Condições de derrota aplicadas:', updates);
          
          // Aguardar um pouco para o estado atualizar
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Agora simular a derrota com o tipo específico
          const defeatTypeMap = {
            '1': 'population' as const,
            '2': 'reputation' as const,
            '3': 'turns' as const,
            '4': 'deck' as const
          };
          onTestDefeat(defeatTypeMap[defeatType as keyof typeof defeatTypeMap]);
        } else {
          showAlert('Erro', 'Função de atualização do estado não disponível.');
        }
      }
      
    } catch (error) {
      console.error('Erro no teste de derrota:', error);
      showAlert('Erro no Teste', 'Ocorreu um erro durante o teste de derrota.');
    } finally {
      setTestingDefeat(false);
    }
  };

  const checkVictoryConditions = () => {
    const results = {
      mode: victorySystem.mode,
      conditions: [] as any[],
      allConditionsMet: false,
      summary: ''
    };

    // Verificar cada condição baseada no modo
    if (victorySystem.mode === 'infinite') {
      results.conditions.push({
        name: 'Sobrevivência Infinita',
        met: true,
        current: gameState.turn,
        target: '∞',
        description: 'Modo infinito - sempre ativo'
      });
      results.allConditionsMet = false; // Infinito nunca vence
      results.summary = 'Modo infinito ativo - continue jogando!';
    } else if (victorySystem.mode === 'classic') {
      // Verificar condições clássicas
      const majorConditions = victorySystem.conditions.filter((c: any) => c.type === 'major');
      const minorConditions = victorySystem.conditions.filter((c: any) => c.type === 'minor');
      
      majorConditions.forEach((condition: any) => {
        const met = checkCondition(condition, gameState);
        results.conditions.push({
          name: condition.name,
          met,
          current: getCurrentValue(condition, gameState),
          target: condition.target,
          description: condition.description
        });
      });
      
      minorConditions.forEach((condition: any) => {
        const met = checkCondition(condition, gameState);
        results.conditions.push({
          name: condition.name,
          met,
          current: getCurrentValue(condition, gameState),
          target: condition.target,
          description: condition.description
        });
      });
      
      const majorMet = results.conditions.filter(c => c.met && majorConditions.some((mc: any) => mc.name === c.name)).length;
      const minorMet = results.conditions.filter(c => c.met && minorConditions.some((mc: any) => mc.name === c.name)).length;
      
      results.allConditionsMet = majorMet >= victorySystem.requiredMajor && minorMet >= victorySystem.requiredMinor;
      results.summary = `Clássico: ${majorMet}/${victorySystem.requiredMajor} principais, ${minorMet}/${victorySystem.requiredMinor} secundárias`;
    } else {
      // Verificar condições simples para todos os outros modos
      console.log('🔍 Verificando condições para modo:', victorySystem.mode);
      console.log('Condições disponíveis:', victorySystem.conditions);
      
      victorySystem.conditions.forEach((condition: any) => {
        const met = checkCondition(condition, gameState);
        const currentValue = getCurrentValue(condition, gameState);
        
        console.log(`🔍 Condição: ${condition.name} - Atual: ${currentValue}/${condition.target} - Atendida: ${met}`);
        
        results.conditions.push({
          name: condition.name,
          met,
          current: currentValue,
          target: condition.target,
          description: condition.description
        });
      });
      
      results.allConditionsMet = results.conditions.every(c => c.met);
      results.summary = `${victorySystem.mode}: ${results.conditions.filter(c => c.met).length}/${results.conditions.length} condições atendidas`;
      
      console.log('📊 Resultado final:', results.summary, 'Todas atendidas:', results.allConditionsMet);
    }

    return results;
  };

  const checkCondition = (condition: any, gameState: GameState) => {
    const currentValue = getCurrentValue(condition, gameState);
    return currentValue >= condition.target;
  };

  const getCurrentValue = (condition: any, gameState: GameState) => {
    console.log('🔍 getCurrentValue - categoria:', condition.category, 'ID:', condition.id);
    
    switch (condition.category) {
      case 'landmarks':
        return gameState.playerStats.landmarks;
      case 'reputation':
        return gameState.playerStats.reputation;
      case 'survival':
        return gameState.turn;
      case 'coins':
        return gameState.resources.coins;
      case 'resources':
        // Para vitória por prosperidade, contar apenas moedas
        if (condition.id === 'classic_prosperity_1000') {
          return gameState.resources.coins;
        } else {
          return gameState.resources.coins + gameState.resources.food + 
                 gameState.resources.materials + gameState.resources.population;
        }
      case 'production':
        const { prod } = getProductionPerTurnDetails(gameState.farmGrid, gameState.cityGrid);
        return prod.coins + prod.food + prod.materials + prod.population;
      case 'diversity':
        // Para vitória por domínio mágico, contar cartas mágicas
        if (condition.id === 'classic_magic_dominance_4') {
          const allCards = [
            ...gameState.farmGrid.flat().map(cell => cell.card).filter((card): card is any => card !== null),
            ...gameState.cityGrid.flat().map(cell => cell.card).filter((card): card is any => card !== null),
            ...gameState.landmarksGrid.flat().map(cell => cell.card).filter((card): card is any => card !== null),
            ...gameState.eventGrid.flat().map(cell => cell.card).filter((card): card is any => card !== null)
          ];
          const magicCards = allCards.filter(card => card.type === 'magic');
          return magicCards.length;
        } else {
          const allCards = [
            ...gameState.farmGrid.flat().map(cell => cell.card).filter((card): card is any => card !== null),
            ...gameState.cityGrid.flat().map(cell => cell.card).filter((card): card is any => card !== null)
          ];
          const types = new Set(allCards.map(card => card.type));
          return types.size;
        }
      default:
        console.log('⚠️ Categoria não reconhecida:', condition.category);
        return 0;
    }
  };

  const getProductionPerTurnDetails = (farmGrid: any[][], cityGrid: any[][]) => {
    // Função simplificada para calcular produção
    let totalCoins = 0, totalFood = 0, totalMaterials = 0, totalPopulation = 0;
    
         // Calcular produção das fazendas
     farmGrid.forEach(row => {
       row.forEach(cell => {
         if (cell.card && cell.card.production) {
           totalFood += cell.card.production.food || 0;
           totalMaterials += cell.card.production.materials || 0;
         }
       });
     });
     
     // Calcular produção das cidades
     cityGrid.forEach(row => {
       row.forEach(cell => {
         if (cell.card && cell.card.production) {
           totalCoins += cell.card.production.coins || 0;
           totalPopulation += cell.card.production.population || 0;
         }
       });
     });
    
    return {
      prod: {
        coins: totalCoins,
        food: totalFood,
        materials: totalMaterials,
        population: totalPopulation
      }
    };
  };

    const fillVictoryConditions = () => {
    if (!onUpdateGameState) {
      console.error('Função de atualização do estado não fornecida');
      return;
    }

    console.log('🔧 Preenchendo condições de vitória para modo:', victorySystem.mode);
    console.log('Condições disponíveis:', victorySystem.conditions);

    const updates: Partial<GameState> = {};
    
    // Preencher condições baseadas no modo de vitória
    if (victorySystem.mode === 'landmarks' || victorySystem.mode === 'simple') {
      // Preencher marcos históricos
      const target = victorySystem.conditions[0]?.target || 3;
      updates.playerStats = {
        ...gameState.playerStats,
        landmarks: target
      };
      console.log('🏛️ Preenchendo landmarks:', target);
    } else if (victorySystem.mode === 'reputation') {
      // Preencher reputação
      const target = victorySystem.conditions[0]?.target || 10;
      updates.playerStats = {
        ...gameState.playerStats,
        reputation: target
      };
      console.log('👑 Preenchendo reputação:', target);
    } else if (victorySystem.mode === 'elimination' || victorySystem.mode === 'survival') {
      // Preencher turnos de sobrevivência
      const target = victorySystem.conditions[0]?.target || 20;
      updates.turn = target;
      console.log('⏰ Preenchendo turnos:', target);
    } else if (victorySystem.mode === 'resources' || victorySystem.mode === 'coins') {
      // Preencher moedas
      const target = victorySystem.conditions[0]?.target || 50;
      updates.resources = {
        ...gameState.resources,
        coins: target
      };
      console.log('💰 Preenchendo moedas:', target);
    } else if (victorySystem.mode === 'production') {
      // Para produção, vamos simular adicionando cartas que geram produção
      const targetProduction = victorySystem.conditions[0]?.target || 10;
      
      // Simular cartas que geram produção
      const simulatedCityCards = Array(Math.ceil(targetProduction / 2)).fill(null).map(() => ({
        production: { coins: 2, population: 1 }
      }));
      
      const simulatedFarmCards = Array(Math.ceil(targetProduction / 2)).fill(null).map(() => ({
        production: { food: 2, materials: 1 }
      }));
      
      // Calcular produção total
      const totalCoins = simulatedCityCards.reduce((sum, card) => sum + (card.production?.coins || 0), 0);
      const totalFood = simulatedFarmCards.reduce((sum, card) => sum + (card.production?.food || 0), 0);
      const totalMaterials = simulatedFarmCards.reduce((sum, card) => sum + (card.production?.materials || 0), 0);
      const totalPopulation = simulatedCityCards.reduce((sum, card) => sum + (card.production?.population || 0), 0);
      
      updates.resources = {
        ...gameState.resources,
        coins: totalCoins,
        food: totalFood,
        materials: totalMaterials
      };
      
      console.log('🏭 Produção simulada:', { totalCoins, totalFood, totalMaterials, totalPopulation });
    } else if (victorySystem.mode === 'classic') {
      // Para modo clássico, preencher TODAS as condições principais
      const majorConditions = victorySystem.conditions.filter((c: any) => c.type === 'major');
      console.log('🎯 Condições principais encontradas:', majorConditions.length);
      
      // Inicializar valores máximos
      let maxLandmarks = gameState.playerStats.landmarks;
      let maxReputation = gameState.playerStats.reputation;
      let maxCoins = gameState.resources.coins;
      let maxTurn = gameState.turn;
      
      // Processar cada condição principal
      majorConditions.forEach((condition: any) => {
        console.log('🔍 Processando condição:', condition.name, condition.category, condition.target);
        
        switch (condition.category) {
          case 'landmarks':
            maxLandmarks = Math.max(maxLandmarks, condition.target);
            console.log('🏛️ Atualizando landmarks para:', maxLandmarks);
            break;
          case 'reputation':
            maxReputation = Math.max(maxReputation, condition.target);
            console.log('👑 Atualizando reputação para:', maxReputation);
            break;
          case 'resources':
            // Para vitória por prosperidade (moedas)
            maxCoins = Math.max(maxCoins, condition.target);
            console.log('💰 Atualizando moedas para:', maxCoins);
            break;
          case 'survival':
            maxTurn = Math.max(maxTurn, condition.target);
            console.log('⏰ Atualizando turnos para:', maxTurn);
            break;
          case 'diversity':
            // Para vitória por domínio mágico, vamos simular cartas mágicas
            if (condition.id === 'classic_magic_dominance_4') {
              console.log('🔮 Simulando 4 relíquias mágicas para vitória por domínio mágico');
              // Por enquanto, vamos apenas simular que as cartas existem
            }
            break;
        }
      });
      
      // Aplicar todas as atualizações
      updates.playerStats = {
        ...gameState.playerStats,
        landmarks: maxLandmarks,
        reputation: maxReputation
      };
      
      updates.resources = {
        ...gameState.resources,
        coins: maxCoins
      };
      
      updates.turn = maxTurn;
      
      console.log('✅ Modo clássico - valores finais:', {
        landmarks: maxLandmarks,
        reputation: maxReputation,
        coins: maxCoins,
        turn: maxTurn
      });
    }
    
    // Aplicar as atualizações
    console.log('🚀 Aplicando atualizações:', updates);
    onUpdateGameState(updates);
    console.log('✅ Condições de vitória preenchidas automaticamente!');
  };

  const showTestResults = (results: any) => {
    let message = `🎯 **Teste de Vitória - ${results.mode.toUpperCase()}**\n\n`;
    message += `📊 **Resumo:** ${results.summary}\n\n`;
    
    if (results.conditions.length > 0) {
      message += `📋 **Condições:**\n`;
      results.conditions.forEach((condition: any) => {
        const icon = condition.met ? '✅' : '❌';
        const status = condition.met ? 'ATENDIDA' : 'PENDENTE';
        message += `${icon} **${condition.name}:** ${condition.current}/${condition.target} (${status})\n`;
        message += `   ${condition.description}\n\n`;
      });
    }
    
    if (results.allConditionsMet) {
      message += `🏆 **RESULTADO:** TODAS AS CONDIÇÕES ATENDIDAS!\n`;
      message += `🎉 O modal de vitória deve aparecer automaticamente!\n`;
      message += `✨ Se o modal não aparecer, verifique se o sistema de vitória está funcionando corretamente.`;
    } else {
      message += `⏳ **RESULTADO:** Condições ainda não atendidas.\n`;
      message += `Continue jogando para completar os objetivos ou use o botão de teste novamente para preencher automaticamente!`;
    }
    
    showAlert('Resultado do Teste', message);
  };

  console.log('TestModeButton render - isTestMode:', isTestMode, 'victorySystem:', victorySystem);
  
  if (!isTestMode) {
    console.log('TestModeButton: Not in test mode, not rendering');
    return null; // Não mostrar o botão se não estiver em modo de teste
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {/* Botão de Teste de Vitória */}
      <Button
        onClick={runVictoryTest}
        disabled={testing}
        variant="outline"
        size="sm"
        className="bg-yellow-100 border-yellow-400 text-yellow-800 hover:bg-yellow-200"
      >
        {testing ? (
          <>
            <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            Testando...
          </>
        ) : (
          <>
            <TestTube className="h-4 w-4 mr-2" />
            Testar Vitória
          </>
        )}
      </Button>

      {/* Botão de Teste de Derrota */}
      <Button
        onClick={runDefeatTest}
        disabled={testingDefeat}
        variant="outline"
        size="sm"
        className="bg-red-100 border-red-400 text-red-800 hover:bg-red-200"
      >
        {testingDefeat ? (
          <>
            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            Testando...
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 mr-2" />
            Testar Derrota
          </>
        )}
      </Button>
    </div>
  );
};
