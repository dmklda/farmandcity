# 🚫 Sistema de Restrições Temporárias

## 📋 Visão Geral

O Sistema de Restrições Temporárias permite que cartas apliquem restrições temporárias ao jogador, impedindo-o de jogar certos tipos de carta por um número específico de turnos.

## 🎯 Funcionalidades Implementadas

### ✅ **1. Limpeza Automática de Restrições**
- **Localização:** `useGameState.ts` - função `handleNextPhase`
- **Funcionamento:** Chama `cleanupExpiredRestrictions()` automaticamente a cada turno
- **Status:** ✅ **IMPLEMENTADO**

### ✅ **2. Validação de Jogada**
- **Localização:** `useGameState.ts` - função `canPlayCardUI`
- **Funcionamento:** Verifica restrições antes de permitir jogar uma carta
- **Status:** ✅ **IMPLEMENTADO**

### ✅ **3. UI Feedback**
- **Localização:** `src/components/RestrictionsDisplay.tsx`
- **Funcionamento:** Mostra restrições ativas com animações e descrições
- **Status:** ✅ **IMPLEMENTADO**

## 🧊 Exemplo: Armadilha de Gelo

### **Effect_logic:**
```
"GAIN_COINS:2;RESTRICT_CARD_TYPES:action,magic:1:next_turn"
```

### **Componentes:**
1. **`GAIN_COINS:2`** - Ganha 2 moedas imediatamente
2. **`RESTRICT_CARD_TYPES:action,magic:1:next_turn`** - Restrição temporária

### **Funcionamento:**
1. **Turno Atual:** Jogador joga a carta, ganha 2 moedas
2. **Restrição Aplicada:** Sistema bloqueia cartas de ação e magia
3. **Próximo Turno:** Jogador não pode jogar cartas de ação ou magia
4. **Turno Seguinte:** Restrição expira automaticamente

## 🛠️ Como Usar na Interface

### **1. Importar o Hook:**
```tsx
import { useGameState } from '../hooks/useGameState';

const MyComponent = () => {
  const { RestrictionsDisplay } = useGameState();
  
  return (
    <div>
      {/* Componente de restrições ativas */}
      <RestrictionsDisplay />
    </div>
  );
};
```

### **2. Componente Automático:**
```tsx
// O componente mostra automaticamente:
// - Restrições ativas
// - Duração restante
// - Descrição da restrição
// - Animações visuais
```

## 🔧 Formato das Restrições

### **Sintaxe:**
```
RESTRICT_CARD_TYPES:tipo1,tipo2:duracao:escopo
```

### **Parâmetros:**
- **`tipo1,tipo2`** - Tipos de carta restritos (action, magic, city, farm, etc.)
- **`duracao`** - Número de turnos que a restrição dura
- **`escopo`** - Escopo da restrição (next_turn, current_turn, permanent)

### **Exemplos:**
```
RESTRICT_CARD_TYPES:action,magic:1:next_turn
RESTRICT_CARD_TYPES:city:2:next_turn
RESTRICT_CARD_TYPES:event:999:permanent
```

## 🎮 Integração com o Sistema de Jogo

### **1. Aplicação Automática:**
- Restrições são aplicadas quando `executeCardEffects()` é chamado
- Sistema detecta automaticamente `RESTRICT_CARD_TYPES:` no effect_logic

### **2. Validação Automática:**
- `canPlayCardUI()` verifica restrições antes de permitir jogar
- Mensagens de erro específicas para cada restrição

### **3. Limpeza Automática:**
- `cleanupExpiredRestrictions()` é chamado a cada turno
- Restrições expiradas são removidas automaticamente

## 📊 Tipos de Restrição Suportados

### **Tipos de Carta:**
- `action` - Cartas de ação
- `magic` - Cartas de magia
- `city` - Cartas de cidade
- `farm` - Cartas de fazenda
- `landmark` - Cartas de marco histórico
- `event` - Cartas de evento
- `defense` - Cartas de defesa
- `trap` - Cartas de armadilha

### **Escopos:**
- `next_turn` - Aplica-se ao próximo turno
- `current_turn` - Aplica-se ao turno atual
- `permanent` - Aplica-se permanentemente
- `next_x_turns` - Aplica-se aos próximos X turnos

## 🚀 Vantagens do Sistema

### **✅ Flexibilidade:**
- Pode restringir qualquer combinação de tipos
- Duração configurável
- Escopo inteligente

### **✅ Integração Total:**
- Funciona com efeitos simples e complexos
- Sistema de tracking automático
- Validação em tempo real

### **✅ UI Inteligente:**
- Mostra apenas restrições ativas
- Descrições claras e específicas
- Animações visuais atrativas

### **✅ Manutenção Automática:**
- Limpeza automática de restrições expiradas
- Tracking de duração restante
- Sistema robusto e confiável

## 🔍 Debugging e Testes

### **1. Verificar Restrições Ativas:**
```tsx
const { game } = useGameState();
console.log('Restrições ativas:', game.cardRestrictions);
```

### **2. Testar Validação:**
```tsx
const { canPlayCardUI } = useGameState();
const result = canPlayCardUI(card);
console.log('Pode jogar?', result);
```

### **3. Componente de Teste:**
```tsx
import RestrictionsExample from '../components/RestrictionsExample';
// Usar para testar o sistema
```

## 📝 Status de Implementação

- **✅ Tipos TypeScript:** Implementados
- **✅ GameState:** Atualizado
- **✅ Parser:** Funcionando
- **✅ Executor:** Integrado
- **✅ Validação:** Funcionando
- **✅ Limpeza Automática:** Implementada
- **✅ UI Component:** Criado
- **✅ Integração:** Completa

## 🎉 Conclusão

O Sistema de Restrições Temporárias está **100% IMPLEMENTADO** e funcionando perfeitamente com:

1. **Limpeza automática** a cada turno
2. **Validação em tempo real** de cartas
3. **UI feedback** visual atrativo
4. **Integração total** com o sistema existente

**A Armadilha de Gelo agora funciona exatamente como descrito, aplicando tanto o ganho de recursos quanto a restrição temporária!** 🧊✨
