# 🔴 Efeitos de Dedução de Recursos - Implementação

## 📋 Problema Identificado

O sistema não estava reconhecendo efeitos de dedução de recursos como:
- "Custa 1 material por turno para manter"
- "Gasta 2 moedas por turno"
- "Consome 1 comida por turno"
- "Deduz 1 população por turno"

## ✅ Solução Implementada

### 1. **Novos Padrões Regex para Dedução**

```typescript
// Efeitos de dedução por turno (NOVO)
{ pattern: /custa (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/, name: 'custa X recurso por turno', isDeduction: true },
{ pattern: /gasta (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/, name: 'gasta X recurso por turno', isDeduction: true },
{ pattern: /consome (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/, name: 'consome X recurso por turno', isDeduction: true },
{ pattern: /deduz (\d+) (comida|comidas|moeda|moedas|material|materiais|população|populações) por turno/, name: 'deduz X recurso por turno', isDeduction: true },
```

### 2. **Lógica de Multiplicador**

```typescript
// Verificar se é efeito de dedução
const isDeduction = pattern.source.includes('custa') || 
                   pattern.source.includes('gasta') || 
                   pattern.source.includes('consome') || 
                   pattern.source.includes('deduz');
const multiplier = isDeduction ? -1 : 1;

// Aplicar multiplicador aos valores
prod.materials = (prod.materials || 0) + (value * multiplier);
```

### 3. **Processamento de Múltiplos Padrões** ⭐ **NOVO**

```typescript
// Controle de duplicação usando ranges processados
const processedRanges: Array<{start: number, end: number}> = [];

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
    console.log('Pulando padrão já processado em posição', matchStart, '-', matchEnd);
    continue;
  }
  
  // Marcar esta parte do texto como processada
  processedRanges.push({ start: matchStart, end: matchEnd });
}
```

**Importante**: O sistema agora processa **múltiplos padrões diferentes** mas evita duplicação controlando quais partes do texto já foram processadas. Isso permite que efeitos como "Produz 4 comida por turno. Custa 1 material por turno" sejam processados completamente sem duplicação.

### 4. **Palavras-Chave Suportadas**

| Ação | Exemplo | Resultado |
|------|---------|-----------|
| `custa` | "Custa 1 material por turno" | -1 material |
| `gasta` | "Gasta 2 moedas por turno" | -2 moedas |
| `consome` | "Consome 1 comida por turno" | -1 comida |
| `deduz` | "Deduz 1 população por turno" | -1 população |

### 5. **Componentes Atualizados**

- ✅ `src/components/admin/CardValidator.tsx` - Padrões regex + Lógica de dedução
- ✅ `src/hooks/useGameState.ts` - Padrões regex + Lógica de dedução

## 🎯 Exemplo de Funcionamento

### **Cenário**: "Produz 4 comida por turno. Custa 1 material por turno para manter"

**Processamento**:
1. **Primeiro padrão**: "produz 4 comida por turno"
   - `multiplier = 1` (produção)
   - `prod.food = +4`

2. **Segundo padrão**: "custa 1 material por turno"
   - `multiplier = -1` (dedução)
   - `prod.materials = -1`

**Resultado final**: `{food: 4, materials: -1}`

### **Validação**:
- ✅ **Status**: Válido
- ✅ **Padrão reconhecido**: "produz X recurso por turno" + "custa X recurso por turno"
- ✅ **Efeito parseado**: "+4 food, -1 material"

## 🔍 Cartas na Base de Dados com Efeitos de Dedução

Encontradas na consulta SQL:
1. **Horta Hidropônica**: "Produz 4 comida por turno. Custa 1 material por turno para manter"
2. **Inovação Tecnológica**: "Todas as suas construções produzem +1 recurso neste turno. Custa 2 materiais para ativar."
3. **Invasão de Bandidos**: "Todos os jogadores perdem 1 moeda e 1 material."
4. **Armadilha de Gelo**: "Quando ativada, o oponente perde 2 moedas e não pode jogar cartas de ação no próximo turno."
5. **Crise Econômica**: "Todos os jogadores perdem metade de suas moedas. Você ganha 1 moeda para cada 3 moedas perdidas."

## 🚀 Como Testar

1. **No Validador de Cartas:**
   - Digite: "Produz 4 comida por turno. Custa 1 material por turno para manter"
   - Deve mostrar: "+4 food, -1 material"

2. **Debug:**
   - Abra o console (F12)
   - Verifique se mostra: "É dedução? true Multiplicador: -1"
   - Confirme que os valores negativos aparecem corretamente

## 📝 Notas Importantes

- ✅ **Não quebra funcionalidade existente**: Todos os efeitos de produção continuam funcionando
- ✅ **Suporte a plural**: Funciona com "materiais", "moedas", "comidas", "populações"
- ✅ **Ordem de prioridade**: Padrões mais específicos são processados primeiro
- ✅ **Prevenção de duplicação**: Sistema para após encontrar o primeiro match válido 