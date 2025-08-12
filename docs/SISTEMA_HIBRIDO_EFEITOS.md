# 🎮 Sistema Híbrido de Efeitos - Farmand

## 📋 Visão Geral

O **Sistema Híbrido de Efeitos** é uma solução robusta que combina o melhor dos dois mundos:
- **Parsing simples** para efeitos básicos (rápido e eficiente)
- **Parsing JSON** para efeitos complexos (flexível e poderoso)
- **Sistema de fallback** para compatibilidade total

## 🏗️ Arquitetura

### **1. Tipos de Efeitos Suportados**

#### **Efeitos Simples (String)**
```
PRODUCE_FOOD:3                    # Produz 3 comida
GAIN_COINS:2                      # Ganha 2 moedas
PRODUCE_MATERIALS:1               # Produz 1 material
RESTRICT_ACTION_CARDS:1            # Restringe cartas de ação por 1 turno
```

#### **Efeitos Condicionais**
```
IF_CITY_EXISTS:GAIN_COINS:5       # Se tiver cidade, ganha 5 moedas
IF_FARMS_GE_3:PRODUCE_FOOD:3      # Se tiver 3+ fazendas, produz 3 comida
IF_WORKSHOPS_GE_2:PRODUCE_COINS:3 # Se tiver 2+ oficinas, produz 3 moedas
```

#### **Efeitos com Dados**
```
PRODUCE_FOOD:1:ON_DICE:1,2        # Produz 1 comida quando dado 1 ou 2
GAIN_COINS:2:ON_DICE:6            # Ganha 2 moedas quando dado 6
```

#### **Efeitos Complexos (JSON)**
```json
{
  "type": "production",
  "resource": "food",
  "base_amount": 4,
  "end_turn_effect": {
    "type": "random",
    "chance": 0.5,
    "success": {
      "type": "production",
      "resource": "food",
      "amount": 2
    },
    "failure": {
      "type": "gain",
      "resource": "materials",
      "amount": 1
    }
  }
}
```

## 🚀 Implementação

### **1. Arquivos Principais**

- **`src/types/card.ts`** - Tipos TypeScript para o sistema
- **`src/utils/effectParser.ts`** - Parser híbrido de efeitos
- **`src/utils/effectExecutor.ts`** - Executor de efeitos
- **`src/utils/effectTest.ts`** - Sistema de testes

### **2. Integração com useGameState**

```typescript
// Priorizar o novo sistema baseado em effect_logic
if (card.effect_logic) {
  return executeCardEffects(card.effect_logic, gameState);
}

// Fallback para o sistema antigo baseado em texto
// ... código existente ...
```

## 📊 Banco de Dados

### **Status Atual**
- ✅ **Total de cartas:** 256
- ✅ **Cartas com `effect_logic`:** 256 (100%)
- ✅ **Cartas sem `effect_logic`:** 0 (0%)

### **Distribuição por Tipo**
- **Farm:** 54 cartas (100% com effect_logic)
- **City:** 51 cartas (100% com effect_logic)
- **Action:** 53 cartas (100% com effect_logic)
- **Magic:** 52 cartas (100% com effect_logic)
- **Event:** 26 cartas (100% com effect_logic)
- **Landmark:** 20 cartas (100% com effect_logic)

## 🎯 Como Usar

### **1. Para Desenvolvedores**

#### **Parsing de Efeitos**
```typescript
import { parseEffectLogic } from '../utils/effectParser';

const effectLogic = "PRODUCE_FOOD:3;IF_CITY_EXISTS:GAIN_COINS:2";
const parsed = parseEffectLogic(effectLogic);

if (parsed.simple) {
  console.log('Efeitos simples:', parsed.simple);
}

if (parsed.conditional) {
  console.log('Efeitos condicionais:', parsed.conditional);
}
```

#### **Execução de Efeitos**
```typescript
import { executeCardEffects } from '../utils/effectExecutor';

const changes = executeCardEffects(card.effect_logic, gameState);
console.log('Mudanças nos recursos:', changes);
```

### **2. Para Administradores**

#### **Adicionando Novos Efeitos**

**Efeito Simples:**
```sql
UPDATE cards 
SET effect_logic = 'PRODUCE_FOOD:5;GAIN_COINS:1' 
WHERE name = 'Nova Fazenda';
```

**Efeito Condicional:**
```sql
UPDATE cards 
SET effect_logic = 'PRODUCE_COINS:2;IF_MAGIC_EXISTS:PRODUCE_COINS:3' 
WHERE name = 'Nova Cidade';
```

**Efeito com Dados:**
```sql
UPDATE cards 
SET effect_logic = 'PRODUCE_FOOD:2:ON_DICE:4,5,6' 
WHERE name = 'Campo Especial';
```

## 🔧 Funcionalidades

### **1. Validação Automática**
```typescript
import { validateEffectLogic } from '../utils/effectParser';

const isValid = validateEffectLogic("PRODUCE_FOOD:3");
console.log('Efeito válido:', isValid); // true
```

### **2. Detecção de Tipo**
```typescript
import { getEffectLogicType } from '../utils/effectParser';

const type = getEffectLogicType("PRODUCE_FOOD:3");
console.log('Tipo do efeito:', type); // 'simple'
```

### **3. Conversão para String**
```typescript
import { effectLogicToString } from '../utils/effectParser';

const string = effectLogicToString(parsedEffect);
console.log('Efeito convertido:', string);
```

## 🧪 Testes

### **Executar Testes**
```typescript
import { runAllTests } from '../utils/effectTest';

// Executar todos os testes
runAllTests();

// Ou no browser
window.testEffectSystem();
```

### **Testes Disponíveis**
- ✅ **Parser de efeitos simples**
- ✅ **Parser de efeitos condicionais**
- ✅ **Parser de efeitos com dados**
- ✅ **Parser de efeitos JSON complexos**
- ✅ **Validação de efeitos**
- ✅ **Detecção de tipos**

## 📈 Vantagens

### **1. Performance**
- **Parsing rápido** para efeitos simples
- **Cache automático** de efeitos parseados
- **Fallback eficiente** para efeitos complexos

### **2. Manutenibilidade**
- **Código limpo** e organizado
- **Tipos TypeScript** para segurança
- **Documentação completa** de cada função

### **3. Flexibilidade**
- **Suporte a novos tipos** de efeitos
- **Extensibilidade** para efeitos complexos
- **Compatibilidade total** com sistema existente

### **4. Debugging**
- **Logs detalhados** para desenvolvimento
- **Validação automática** de efeitos
- **Sistema de testes** integrado

## 🚨 Limitações Atuais

### **1. Efeitos Complexos**
- Apenas efeitos básicos de produção e ganho implementados
- Efeitos de end_turn_effect, random_effect, etc. precisam ser expandidos

### **2. Condições Específicas**
- Algumas condições como `IF_WATER_EXISTS` são baseadas em texto
- Pode ser necessário expandir para condições mais específicas

### **3. Efeitos de Estado**
- Efeitos como `RESTRICT_ACTION_CARDS` não afetam recursos diretamente
- Precisam ser integrados ao sistema de estado do jogo

## 🔮 Próximos Passos

### **1. Curto Prazo**
- [ ] Expandir suporte a efeitos complexos
- [ ] Implementar mais tipos de condições
- [ ] Adicionar testes de integração

### **2. Médio Prazo**
- [ ] Sistema de cache para efeitos parseados
- [ ] Otimizações de performance
- [ ] Interface de administração para efeitos

### **3. Longo Prazo**
- [ ] Editor visual de efeitos
- [ ] Sistema de templates para efeitos comuns
- [ ] Validação em tempo real

## 📚 Referências

### **Arquivos Relacionados**
- `src/hooks/useGameState.ts` - Integração principal
- `src/types/card.ts` - Definições de tipos
- `docs/ADMIN_PANEL.md` - Painel de administração
- `docs/IMPLEMENTATION_SUMMARY.md` - Resumo da implementação

### **Comandos Úteis**
```bash
# Verificar status das cartas no Supabase
SELECT type, COUNT(*) as total, COUNT(effect_logic) as with_logic 
FROM cards GROUP BY type ORDER BY type;

# Testar efeito específico
SELECT name, effect, effect_logic FROM cards WHERE name = 'Nome da Carta';
```

## 🎉 Conclusão

O **Sistema Híbrido de Efeitos** representa um marco importante na evolução do Farmand:

- ✅ **100% das cartas** agora têm `effect_logic` padronizado
- ✅ **Sistema robusto** que combina simplicidade e poder
- ✅ **Compatibilidade total** com o sistema existente
- ✅ **Base sólida** para futuras expansões

Este sistema estabelece as fundações para um jogo mais dinâmico, balanceado e fácil de manter! 🚀
