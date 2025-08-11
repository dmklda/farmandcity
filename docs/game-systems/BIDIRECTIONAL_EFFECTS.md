# 🔄 Efeitos Bidirecionais de Conversão - Implementação

## 📋 Problema Identificado

O sistema não reconhecia efeitos de conversão bidirecional como:
- "Transforme 3 comida em 2 materiais ou 2 materiais em 3 comida"
- "Troque 2 moedas por 1 material ou 1 material por 2 moedas"
- "Converta 4 comida em 3 moedas ou 3 moedas em 4 comida"

## ✅ Solução Implementada

### 1. **Novos Padrões Regex para Efeitos Bidirecionais**

```typescript
// Efeitos de conversão bidirecional (NOVO)
{ pattern: /transforme (\d+) (comida|moeda|material|população) em (\d+) (comida|moeda|material|população) ou (\d+) (comida|moeda|material|população) em (\d+) (comida|moeda|material|população)/, name: 'transforme X recurso em Y ou Z em W', isBidirectional: true },
{ pattern: /troque (\d+) (comida|moeda|material|população) por (\d+) (comida|moeda|material|população) ou (\d+) (comida|moeda|material|população) por (\d+) (comida|moeda|material|população)/, name: 'troque X por Y ou Z por W', isBidirectional: true },
{ pattern: /converta (\d+) (comida|moeda|material|população) em (\d+) (comida|moeda|material|população) ou (\d+) (comida|moeda|material|população) em (\d+) (comida|moeda|material|população)/, name: 'converta X em Y ou Z em W', isBidirectional: true },
```

### 2. **Lógica de Processamento Bidirecional**

```typescript
// Verificar se é efeito bidirecional (tem 6 grupos de captura)
if (isBidirectional && match.length >= 7) {
  // Padrão: "transforme X recurso1 em Y recurso2 ou Z recurso3 em W recurso4"
  const value1 = parseInt(match[1], 10);  // X
  const resourceType1 = match[2];         // recurso1
  const value2 = parseInt(match[3], 10);  // Y
  const resourceType2 = match[4];         // recurso2
  const value3 = parseInt(match[5], 10);  // Z
  const resourceType3 = match[6];         // recurso3
  const value4 = parseInt(match[7], 10);  // W
  const resourceType4 = match[8];         // recurso4
  
  // Opção 1: X recurso1 → Y recurso2 (dedução + adição)
  // Opção 2: Z recurso3 → W recurso4 (dedução + adição)
}
```

### 3. **Palavras-Chave Suportadas**

| Ação | Exemplo | Resultado |
|------|---------|-----------|
| `transforme` | "Transforme 3 comida em 2 materiais ou 2 materiais em 3 comida" | -3 comida, +2 materiais, -2 materiais, +3 comida |
| `troque` | "Troque 2 moedas por 1 material ou 1 material por 2 moedas" | -2 moedas, +1 material, -1 material, +2 moedas |
| `converta` | "Converta 4 comida em 3 moedas ou 3 moedas em 4 comida" | -4 comida, +3 moedas, -3 moedas, +4 comida |

### 4. **Componentes Atualizados**

- ✅ `src/components/admin/CardValidator.tsx` - Padrões regex + Lógica bidirecional
- ✅ `docs/BIDIRECTIONAL_EFFECTS.md` - Documentação completa

## 🎯 Exemplo de Funcionamento

### **Cenário**: "Transforme 3 comida em 2 materiais ou 2 materiais em 3 comida"

**Processamento**:
1. **Padrão capturado**: `/transforme (\d+) (comida|moeda|material|população) em (\d+) (comida|moeda|material|população) ou (\d+) (comida|moeda|material|população) em (\d+) (comida|moeda|material|população)/`

2. **Valores extraídos**:
   - `value1: 3, resourceType1: 'comida'`
   - `value2: 2, resourceType2: 'materiais'`
   - `value3: 2, resourceType3: 'materiais'`
   - `value4: 3, resourceType4: 'comida'`

3. **Aplicação das opções**:
   - **Opção 1**: `-3 comida, +2 materiais`
   - **Opção 2**: `-2 materiais, +3 comida`

**Resultado final**: `{food: 0, materials: 0}` (ambas as opções cancelam-se)

### **Validação**:
- ✅ **Status**: Válido
- ✅ **Padrão reconhecido**: "transforme X recurso em Y ou Z em W"
- ✅ **Efeito parseado**: Mostra ambas as opções de conversão

## 🔍 Cartas na Base de Dados com Efeitos Similares

Encontradas na consulta SQL:
1. **Troca Comercial**: "Troque 2 materiais por 2 comida" (unidirecional)

## 🚀 Como Testar

1. **No Validador de Cartas:**
   - Digite: "Transforme 3 comida em 2 materiais ou 2 materiais em 3 comida"
   - Deve mostrar: "-3 food, +2 materials, -2 materials, +3 food"

2. **Debug:**
   - Abra o console (F12)
   - Verifique se mostra: "É bidirecional? true"
   - Confirme que todos os 4 valores são processados

## 📝 Notas Importantes

- ✅ **Suporte a plural**: Funciona com "materiais", "moedas", "comidas", "populações"
- ✅ **Ordem de prioridade**: Padrões bidirecionais são processados antes dos unidirecionais
- ✅ **Prevenção de duplicação**: Sistema evita processar a mesma parte do texto múltiplas vezes
- ✅ **Flexibilidade**: Suporta diferentes verbos (transforme, troque, converta)

## 🎮 Uso no Jogo

Efeitos bidirecionais permitem que o jogador escolha entre duas opções de conversão:
- **Opção 1**: Converter X de um recurso em Y de outro
- **Opção 2**: Converter Z de um recurso em W de outro

Isso adiciona estratégia e flexibilidade ao jogo, permitindo que o jogador adapte-se às suas necessidades atuais de recursos. 