# Mecânicas das Cartas - Famand

## Visão Geral

As cartas criadas no painel administrativo são **integradas automaticamente** ao jogo e afetam diretamente o gameplay. Este documento explica como as mecânicas funcionam e como criar cartas que funcionem corretamente.

## Como as Cartas São Carregadas

### 1. **Integração Automática**
- As cartas criadas no painel admin são salvas no Supabase
- O jogo carrega automaticamente todas as cartas ativas (`is_active = true`)
- As cartas são convertidas do formato Admin para o formato do jogo
- **Não é necessário reiniciar o jogo** - as cartas aparecem automaticamente

### 2. **Fluxo de Carregamento**
```
Painel Admin → Supabase → useCards Hook → Jogo
```

## Tipos de Cartas e Suas Mecânicas

### 🏠 **Farm (Fazenda)**
- **Onde jogar**: Grid de fazenda (3x4)
- **Mecânica**: Produção automática por turno ou ativação por dado
- **Exemplo**: "Produz 2 comida por turno" ou "Produz 1 comida quando dado = 3"

### 🏙️ **City (Cidade)**
- **Onde jogar**: Grid de cidade (2x3)
- **Mecânica**: Efeitos imediatos ou produção contínua
- **Exemplo**: "Fornece 1 população" ou "Produz 1 material por turno"

### ⚡ **Action (Ação)**
- **Onde jogar**: Mão do jogador
- **Mecânica**: Efeitos instantâneos na fase de ação
- **Exemplo**: "Ganhe 3 moedas" ou "Compre 2 cartas"

### 🎯 **Magic (Magia)**
- **Onde jogar**: Mão do jogador
- **Mecânica**: Efeitos especiais únicos por turno
- **Exemplo**: "Transforme 2 comida em 1 material"

### 🛡️ **Defense (Defesa)**
- **Onde jogar**: Grid de eventos
- **Mecânica**: Proteção contra eventos negativos
- **Exemplo**: "Bloqueia o próximo evento negativo"

### 🪤 **Trap (Armadilha)**
- **Onde jogar**: Grid de eventos
- **Mecânica**: Efeitos reativos a eventos
- **Exemplo**: "Quando evento negativo, ganhe 2 moedas"

### 📅 **Event (Evento)**
- **Onde jogar**: Grid de eventos
- **Mecânica**: Efeitos que se ativam em momentos específicos
- **Exemplo**: "No final do turno, todos ganham 1 comida"

### 🏛️ **Landmark (Marco)**
- **Onde jogar**: Grid de marcos (limitado)
- **Mecânica**: Efeitos poderosos e únicos
- **Exemplo**: "Todas as fazendas produzem +1 comida"

## Como as Mecânicas São Processadas

### 1. **Análise de Texto (NLP)**
O jogo usa **expressões regulares** para interpretar os efeitos:

```javascript
// Produção por turno
/produz (\d+) (comida|moeda|material)/

// Efeitos instantâneos
/ganhe (\d+) (comida|moeda|material)/

// Produção por dado
/produz (\d+) (comida|moeda|material)[^\d]*dado (\d)/
```

### 2. **Fases do Jogo**
- **Draw**: Compra de cartas
- **Action**: Uso de cartas de ação
- **Build**: Construção de estruturas
- **Production**: Produção automática
- **End**: Fim do turno

### 3. **Ativação de Efeitos**
```javascript
// Produção automática por turno
if (/por turno/.test(effect) && !/dado/.test(effect)) {
  // Aplica produção automaticamente
}

// Efeitos por dado
if (/dado (\d)/.test(effect)) {
  // Ativa quando dado = número específico
}

// Efeitos instantâneos
if (/ganhe/.test(effect)) {
  // Aplica imediatamente
}
```

## Padrões de Texto Reconhecidos

### ✅ **Produção Automática**
- "Produz X comida por turno"
- "Produz X moedas por turno"
- "Produz X materiais por turno"

### ✅ **Produção por Dado**
- "Produz X comida quando dado = Y"
- "Produz X moedas se dado for Y"
- "Produz X materiais com dado Y"

### ✅ **Efeitos Instantâneos**
- "Ganhe X comida"
- "Ganhe X moedas"
- "Ganhe X materiais"
- "Ganhe X população"

### ✅ **Efeitos Condicionais**
- "Se você tiver Y comida, ganhe X moedas"
- "Quando evento negativo, ganhe X recursos"

### ✅ **Efeitos de Conversão**
- "Transforme X comida em Y moedas"
- "Troque X materiais por Y população"

## Exemplos de Cartas Funcionais

### **Fazenda Básica**
```json
{
  "name": "Campo de Milho",
  "type": "farm",
  "cost": { "coins": 2 },
  "effect": "Produz 1 comida por turno.",
  "rarity": "common"
}
```

### **Ação de Comércio**
```json
{
  "name": "Mercado",
  "type": "action",
  "cost": { "coins": 1 },
  "effect": "Ganhe 3 moedas instantaneamente.",
  "rarity": "uncommon"
}
```

### **Fazenda por Dado**
```json
{
  "name": "Pomar",
  "type": "farm",
  "cost": { "coins": 3 },
  "effect": "Produz 2 comida quando dado = 4.",
  "rarity": "rare"
}
```

### **Magia de Conversão**
```json
{
  "name": "Alquimia",
  "type": "magic",
  "cost": { "materials": 2 },
  "effect": "Transforme 3 comida em 1 material.",
  "rarity": "ultra"
}
```

## Limitações e Regras

### **Restrições de Uso**
- **Magic**: Máximo 1 por turno
- **Action**: Múltiplas por turno (se permitido)
- **Farm/City**: Sem limite de uso

### **Custos**
- Deve ser possível pagar com recursos disponíveis
- Custos são deduzidos automaticamente
- Se não tiver recursos suficientes, carta não pode ser jogada

### **Fases de Ativação**
- **Draw**: Cartas de compra
- **Action**: Cartas de ação e magia
- **Build**: Estruturas (farm, city, landmark)
- **Production**: Produção automática
- **End**: Eventos e efeitos finais

## Como Testar Suas Cartas

### 1. **Criar no Painel Admin**
- Acesse `/admin`
- Vá para "Gerenciar Cartas"
- Clique em "Nova Carta"

### 2. **Configurar Corretamente**
- Escolha o tipo apropriado
- Defina custos balanceados
- Use padrões de texto reconhecidos
- Marque como "Ativa"

### 3. **Testar no Jogo**
- Volte para o jogo principal (`/`)
- As cartas aparecerão automaticamente
- Teste as mecânicas em diferentes fases

### 4. **Ajustar se Necessário**
- Volte ao painel admin
- Edite a carta
- Teste novamente

## Dicas para Criar Cartas Balanceadas

### **Custos Recomendados**
- **Common**: 0-2 moedas
- **Uncommon**: 2-4 moedas
- **Rare**: 4-6 moedas
- **Ultra/Legendary**: 6+ moedas

### **Produção Balanceada**
- **Por turno**: 1-2 recursos
- **Por dado**: 2-3 recursos
- **Instantâneo**: 2-4 recursos

### **Efeitos Especiais**
- **Conversão**: Taxa 2:1 ou 3:1
- **Condicionais**: Bônus de 50-100%
- **Únicos**: Efeitos poderosos mas limitados

## Troubleshooting

### **Problema: Carta não aparece no jogo**
- Verifique se `is_active = true`
- Confirme se o tipo está correto
- Verifique se não há erros no console

### **Problema: Efeito não funciona**
- Use padrões de texto exatos
- Verifique a fase de ativação
- Confirme se os custos estão corretos

### **Problema: Carta muito poderosa/fraca**
- Ajuste os custos
- Modifique a quantidade de recursos
- Teste com diferentes estratégias

## Próximos Passos

### **Melhorias Planejadas**
- [ ] Sistema de efeitos mais complexos
- [ ] Combinações de cartas
- [ ] Efeitos de área
- [ ] Cartas únicas por jogo

### **Integrações Futuras**
- [ ] Sistema de crafting
- [ ] Evolução de cartas
- [ ] Eventos sazonais
- [ ] Modo competitivo

---

**Versão**: 1.0.0  
**Última Atualização**: Janeiro 2025  
**Desenvolvido por**: Equipe Famand 