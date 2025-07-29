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
O jogo usa **expressões regulares** para interpretar os efeitos. O sistema foi melhorado para reconhecer múltiplas variações de texto e **múltiplos efeitos em uma única descrição**:

```javascript
// Efeitos instantâneos (Action, Magic)
/ganhe (\d+) (comida|moeda|material|população)/
/ganho instantâneo de (\d+) (comida|moeda|material|população)/
/receba (\d+) (comida|moeda|material|população)/
/obtenha (\d+) (comida|moeda|material|população)/
/adicione (\d+) (comida|moeda|material|população)/

// Produção por turno (Farm, City)
/produz (\d+) (comida|moeda|material|população) por turno/
/produz (\d+) (comida|moeda|material|população) a cada turno/
/fornece (\d+) (comida|moeda|material|população) por turno/
/gera (\d+) (comida|moeda|material|população) por turno/

// Produção por dado
/produz (\d+) (comida|moeda|material) quando dado = (\d)/
/produz (\d+) (comida|moeda|material) se dado for (\d)/
```

**✅ NOVO**: O sistema agora processa **TODOS** os efeitos encontrados em uma descrição, não apenas o primeiro. Por exemplo, "Ganha 1 material. Se você tiver 2 ou mais trabalhadores, ganha 2 materiais" será reconhecido como **dois efeitos separados**.

**🔧 CORREÇÃO**: Padrão genérico `/(\d+) (comida|moeda|material|população)/` foi removido para evitar duplicação de efeitos.

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
if (/ganhe|ganho|receba|obtenha|adicione/.test(effect)) {
  // Aplica imediatamente
}
```

## Padrões de Texto Reconhecidos

### ✅ **Efeitos Instantâneos (Action/Magic)**
- "Ganhe X moeda"
- "Ganho instantâneo de X moeda"
- "Receba X comida"
- "Obtenha X material"
- "Adicione X população"
- "Ganhe X moeda e Y comida"
- "Receba X material e Y população"
- "Aumenta população em X"
- "+X reputação"
- "Troque X material por Y comida"

### ✅ **Produção Automática (Farm/City)**
- "Produz X comida por turno"
- "Produz X moedas a cada turno"
- "Fornece X material por turno"
- "Gera X população por turno"
- "Produz X comida e Y material por turno"
- "Fornece X moeda e Y comida a cada turno"
- "Aumenta população máxima em X"
- "Produz X recurso se tiver Y ou mais"

### ✅ **Produção por Dado (Farm/City)**
- "Produz X comida quando dado = Y"
- "Produz X moedas se dado for Y"
- "Produz X materiais com dado Y"
- "Produz X comida e Y reputação quando dado Z"
- "Produção com dado X"

### ✅ **Efeitos Condicionais**
- "Se você tiver Y comida, ganhe X moedas"
- "Quando evento negativo, ganhe X recursos"
- **"Ganha X material. Se você tiver Y ou mais trabalhadores, ganha Z materiais"** ✅ **NOVO**
- **"Ganha X moedas. Se você tiver uma cidade, ganha Y moedas em vez disso"** ✅ **NOVO**
- **"Se você tiver X ou mais fazendas, ganha Y comida"** ✅ **NOVO**
- **"Ganha X moeda para cada Y moedas que você tem"** ✅ **NOVO**
- **"No início de cada turno, ganha X moeda"** ✅ **NOVO**

### ✅ **Efeitos de Perda/Dano** ✅ **NOVO**
- **"Perde X moeda"**
- **"Todos os jogadores perdem X material"**
- **"Perdem metade de suas moedas"**

### ✅ **Efeitos de Duplicação/Multiplicação** ✅ **NOVO**
- **"Duplica produção de comida"**
- **"Dobra produção de moedas"**
- **"Duplica produção de comida por 1 turno"** ✅ **NOVO**
- **"Dobra produção de materiais por 2 turnos"** ✅ **NOVO**
- **"Duplica produção de comida neste turno"** ✅ **NOVO**
- **"Todas as suas fazendas produzem +1 comida"**
- **"Todas as suas cidades produzem +2 moedas"**

### ✅ **Efeitos de Conversão**
- "Transforme X comida em Y moedas"
- "Troque X materiais por Y população"

## Exemplos de Cartas Funcionais

### **Ação Básica (Funcional)**
```json
{
  "name": "Comércio Básico",
  "type": "action",
  "cost": { "coins": 0 },
  "effect": "Ganho instantâneo de 1 moeda",
  "rarity": "common"
}
```

### **Fazenda Básica**
```json
{
  "name": "Campo de Milho",
  "type": "farm",
  "cost": { "coins": 2 },
  "effect": "Produz 1 comida por turno",
  "rarity": "common"
}
```

### **Fazenda com Múltiplos Recursos** ✅ **NOVO**
```json
{
  "name": "Pomar Simples",
  "type": "farm",
  "cost": { "materials": 1 },
  "effect": "Produz 1 comida e 1 material por turno",
  "rarity": "common"
}
```

### **Ação de Comércio**
```json
{
  "name": "Mercado",
  "type": "action",
  "cost": { "coins": 1 },
  "effect": "Ganhe 3 moedas instantaneamente",
  "rarity": "uncommon"
}
```

### **Ação com Múltiplos Recursos** ✅ **NOVO**
```json
{
  "name": "Comércio Avançado",
  "type": "action",
  "cost": { "coins": 2 },
  "effect": "Ganhe 2 moedas e 1 comida",
  "rarity": "uncommon"
}
```

### **Ação com Efeito Condicional** ✅ **NOVO**
```json
{
  "name": "Trabalho em Equipe",
  "type": "action",
  "cost": { "population": 1 },
  "effect": "Ganha 1 material. Se você tiver 2 ou mais trabalhadores, ganha 2 materiais.",
  "rarity": "common"
}
```

### **Fazenda por Dado**
```json
{
  "name": "Pomar",
  "type": "farm",
  "cost": { "coins": 3 },
  "effect": "Produz 2 comida quando dado = 4",
  "rarity": "rare"
}
```

### **Magia de Conversão**
```json
{
  "name": "Alquimia",
  "type": "magic",
  "cost": { "materials": 2 },
  "effect": "Transforme 3 comida em 1 material",
  "rarity": "ultra"
}
```

### **Cidade com População** ✅ **NOVO**
```json
{
  "name": "Cidade Média",
  "type": "city",
  "cost": { "coins": 4 },
  "effect": "Aumenta população em 3",
  "rarity": "uncommon"
}
```

### **Marco com Reputação** ✅ **NOVO**
```json
{
  "name": "Estátua Simples",
  "type": "landmark",
  "cost": { "materials": 3 },
  "effect": "+1 reputação",
  "rarity": "rare"
}
```

### **Fazenda com Múltiplos Recursos por Dado** ✅ **NOVO**
```json
{
  "name": "Vinhedo",
  "type": "farm",
  "cost": { "coins": 5 },
  "effect": "Produz 1 comida e 1 reputação quando ativado por dado 6",
  "rarity": "rare"
}
```

### **Cidade com Efeito "Para Cada"** ✅ **NOVO**
```json
{
  "name": "Banco Local",
  "type": "city",
  "cost": { "coins": 6 },
  "effect": "Produz 2 moedas por turno. No final do turno, ganha 1 moeda para cada 5 moedas que você tem.",
  "rarity": "rare"
}
```

### **Ação com "Em Vez Disso"** ✅ **NOVO**
```json
{
  "name": "Expedição de Comércio",
  "type": "action",
  "cost": { "coins": 2 },
  "effect": "Ganha 3 moedas. Se você tiver uma cidade, ganha 5 moedas em vez disso.",
  "rarity": "uncommon"
}
```

### **Marco com Efeito por Turno** ✅ **NOVO**
```json
{
  "name": "Torre do Relógio",
  "type": "landmark",
  "cost": { "materials": 8 },
  "effect": "No início de cada turno, ganha 1 moeda. Se você tiver 10 ou mais moedas, ganha 2 moedas em vez disso.",
  "rarity": "legendary"
}
```

## ⬆️ **Sistema de Empilhamento de Cartas**

### **📋 Regras do Empilhamento:**
- **Duas cartas iguais** = Pode empilhar uma em cima da outra
- **Efeito duplicado**: Produção e efeitos são multiplicados pelo nível
- **Tipos empilháveis**: Farm, City, Landmark, Event
- **Limite**: Sem limite teórico (mas prático por recursos)

### **🎮 Como Funciona:**
1. **Construir primeira carta** = Nível 1 (efeito normal)
2. **Jogar carta igual no mesmo espaço** = Nível 2 (efeito duplicado)
3. **Jogar terceira carta igual** = Nível 3 (efeito triplicado)
4. **E assim por diante...**

### **💡 Exemplo Prático:**
```
Barraca (Nível 1): +2 comida por turno
Barraca + Barraca (Nível 2): +4 comida por turno
Barraca + Barraca + Barraca (Nível 3): +6 comida por turno
```

### **🎯 Benefícios do Empilhamento:**
- **Produção aumentada**: Mais recursos por turno
- **Eficiência espacial**: Melhor uso do grid limitado
- **Estratégia**: Foco em poucas cartas poderosas
- **Combos**: Cartas empilhadas contam para combos

### **⚠️ Considerações:**
- **Custo**: Cada carta empilhada custa recursos
- **Oportunidade**: Espaço usado não pode ter outras cartas
- **Diversidade**: Muitas cartas iguais reduzem diversidade
- **Flexibilidade**: Menos variedade de efeitos

### **🏆 Estratégias de Empilhamento:**

#### **Estratégia 1: Produção Massiva**
```
Foco: Barracas e Fazendas
Objetivo: Máxima produção de comida
Resultado: Sustentar população grande
```

#### **Estratégia 2: Recursos Específicos**
```
Foco: Oficinas ou Mercados
Objetivo: Produção específica de materiais/moedas
Resultado: Recursos para construções caras
```

#### **Estratégia 3: Marcos Históricos**
```
Foco: Marcos históricos
Objetivo: Reputação máxima
Resultado: Vitória rápida por reputação
```

## 🎯 **Sistema de Combo**

### **📋 Regras do Combo:**
- **3 cartas do mesmo tipo** = Combo ativado
- **Exceções**: Cartas de "action" e "magic" não contam para combo
- **Recompensa**: +1 reputação por combo
- **Detecção**: Automática quando você constrói uma carta

### **🎮 Tipos de Cartas que Formam Combo:**
- 🏠 **Farm** (Fazenda)
- 🏙️ **City** (Cidade) 
- 🏛️ **Landmark** (Marco Histórico)
- 🛡️ **Defense** (Defesa)
- 🎯 **Event** (Evento)
- ⚡ **Trap** (Armadilha)

### **❌ Tipos que NÃO Formam Combo:**
- ⚡ **Action** (Ação) - Cartas de efeito instantâneo
- ✨ **Magic** (Magia) - Cartas de efeito instantâneo

### **💡 Exemplo de Combo:**
```
Grid da Fazenda:
- Fazenda Básica (Farm)
- Pomar Simples (Farm) 
- Campo de Trigo (Farm) ← Nova carta

RESULTADO: Combo "Farm" ativado! +1 reputação
```

## Sistema de Validação

### **Validador em Tempo Real**
O painel administrativo agora inclui um **validador em tempo real** que:
- ✅ Verifica se o texto do efeito será reconhecido pelo jogo
- ✅ Mostra o padrão reconhecido
- ✅ Exibe o efeito parseado (quantidade e tipo de recurso)
- ✅ Fornece sugestões quando o texto não é reconhecido

### **Como Usar o Validador**
1. Acesse o painel administrativo (`/admin`)
2. Vá para "Gerenciar Cartas"
3. Crie ou edite uma carta
4. Digite o efeito no campo "Efeito"
5. O validador aparecerá automaticamente abaixo do campo
6. Siga as sugestões para corrigir problemas

## Limitações e Regras

### **Restrições de Uso (Atualizadas)**
- **Magic**: Pode ser usada em qualquer fase (Action ou Build), **sem limite** de uso por turno
- **Action**: Só pode ser usada na fase **Action**, **limitada a 1 vez por turno**
- **Farm/City**: Só podem ser usadas na fase **Build**, **limitadas a 2 por turno** (pode ser 1 farm + 1 city, ou 2 farm, ou 2 city)
- **Landmark**: Só pode ser usado na fase **Build**, **limitado a 1 por turno**
- **Event**: Só pode ser usado na fase **Build**, **substitui evento anterior**

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
- **Use o validador em tempo real**
- Marque como "Ativa"

### 3. **Testar no Jogo**
- Volte para o jogo principal (`/`)
- As cartas aparecerão automaticamente
- Teste as mecânicas em diferentes fases

### 4. **Debug e Logs**
- Abra o console do navegador (F12)
- Procure por logs que começam com "=== DEBUG:"
- Estes logs mostram o processamento das cartas

### 5. **Ajustar se Necessário**
- Volte ao painel admin
- Edite a carta baseado nos logs
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
- **Use o validador em tempo real no painel admin**
- Verifique se o texto segue os padrões reconhecidos
- Confirme a fase de ativação
- Verifique se os custos estão corretos

### **Problema: Carta muito poderosa/fraca**
- Ajuste os custos
- Modifique a quantidade de recursos
- Teste com diferentes estratégias

### **Problema: Logs de Debug**
- Abra o console do navegador (F12)
- Procure por mensagens que começam com "=== DEBUG:"
- Estas mensagens mostram o processamento detalhado

## Próximos Passos

### **Melhorias Planejadas**
- [x] Sistema de validação em tempo real
- [x] Padrões de texto mais abrangentes
- [x] Logs de debug detalhados
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

**Versão**: 2.0.0  
**Última Atualização**: Janeiro 2025  
**Desenvolvido por**: Equipe Famand 

### **�� Grids de Construção:**

#### **🏠 Grid da Fazenda (Farm Grid)**
- **Tamanho**: 3x4 (12 slots)
- **Cartas**: Apenas cartas do tipo "Farm"
- **Função**: Produção de comida e recursos básicos

#### **🏙️ Grid da Cidade (City Grid)**
- **Tamanho**: 2x3 (6 slots)
- **Cartas**: Apenas cartas do tipo "City"
- **Função**: Produção de materiais, moedas e população

#### **🏛️ Grid de Marcos (Landmarks Grid)**
- **Tamanho**: 1x3 (3 slots)
- **Cartas**: Apenas cartas do tipo "Landmark"
- **Função**: Marcos históricos que dão reputação

#### **⚡ Grid de Eventos (Event Grid)**
- **Tamanho**: 1x2 (2 slots)
- **Cartas**: Apenas cartas do tipo "Event"
- **Função**: Eventos ativos que afetam o jogo
- **Mecânica**: Substitui o evento anterior quando um novo é jogado
- **Status**: ✅ **Implementado e funcionando** 