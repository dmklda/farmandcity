# 🏪 Sistema de Loja e Missões

## 📋 Visão Geral

O sistema de Loja e Missões foi implementado para fornecer aos jogadores uma forma de adquirir novas cartas, ganhar recompensas e progredir no jogo através de objetivos específicos.

## 🏗️ Arquitetura do Sistema

### **Banco de Dados**

#### **Tabelas Principais:**

1. **`player_currency`** - Moedas e XP do jogador
   - `coins` - Moedas básicas do jogo
   - `gems` - Moedas premium
   - `experience_points` - Pontos de experiência
   - `level` - Nível do jogador

2. **`missions`** - Missões disponíveis
   - `mission_type` - daily, weekly, achievement, story
   - `requirements` - JSON com requisitos da missão
   - `rewards` - JSON com recompensas
   - `difficulty` - easy, medium, hard, legendary

3. **`player_missions`** - Progresso das missões
   - `progress` - Progresso atual
   - `is_completed` - Se foi completada
   - `claimed_rewards` - Se recompensas foram coletadas

4. **`shop_items`** - Itens da loja
   - `item_type` - pack, booster, card, currency, cosmetic
   - `price_coins` / `price_gems` - Preços
   - `card_ids` - Cartas incluídas (para packs/boosters)
   - `is_limited` - Se tem estoque limitado

5. **`shop_purchases`** - Histórico de compras
   - `items_received` - JSON com itens recebidos
   - `total_price_coins` / `total_price_gems` - Preços pagos

6. **`special_events`** - Eventos especiais
   - `bonuses` - JSON com bônus ativos
   - `special_items` - Itens especiais do evento

### **Hooks React**

#### **`usePlayerCurrency`**
- Gerencia moedas, gems e XP do jogador
- Funções: `addCoins`, `addGems`, `addExperience`, `spendCoins`, `spendGems`
- Cria automaticamente moeda inicial para novos usuários

#### **`useMissions`**
- Gerencia missões e progresso do jogador
- Funções: `startMission`, `updateMissionProgress`, `claimMissionRewards`
- Filtros: `getAvailableMissions`, `getCompletedMissions`, `getClaimedMissions`

#### **`useShop`**
- Gerencia loja e compras
- Funções: `purchaseItem`, `processItemPurchase`
- Filtros: `getAvailablePacks`, `getAvailableBoosters`, `getAvailableCurrency`

### **Componentes React**

#### **`Shop`**
- Interface da loja com tabs para diferentes tipos de itens
- Exibe preços em moedas e gems
- Mostra estoque para itens limitados
- Processa compras e entrega recompensas

#### **`Missions`**
- Interface de missões com progresso visual
- Diferentes tipos: diárias, semanais, conquistas
- Sistema de coleta de recompensas
- Estatísticas de progresso

## 🎮 Funcionalidades

### **Sistema de Moedas**
- **Moedas**: Moeda básica do jogo, ganha em missões e jogos
- **Gems**: Moeda premium, mais rara e valiosa
- **XP**: Pontos de experiência para subir de nível
- **Nível**: Calculado automaticamente (100 XP por nível)

### **Tipos de Missões**
1. **Diárias** - Resetam diariamente
2. **Semanais** - Resetam semanalmente  
3. **Conquistas** - Permanentes, progresso acumulativo
4. **História** - Missões narrativas (futuro)

### **Tipos de Itens da Loja**
1. **Packs** - Conjuntos de cartas com raridade garantida
2. **Boosters** - Cartas aleatórias com chance de raras
3. **Moedas** - Pacotes de moedas ou gems
4. **Cartas** - Cartas específicas
5. **Cosméticos** - Itens visuais (futuro)

### **Sistema de Recompensas**
- **Moedas**: Para compras na loja
- **Gems**: Para itens premium
- **XP**: Para progressão de nível
- **Cartas**: Adicionadas automaticamente à coleção

## 🔧 Implementação Técnica

### **RLS (Row Level Security)**
Todas as tabelas têm políticas RLS configuradas:
- Usuários só podem ver/editar seus próprios dados
- Missões e itens da loja são visíveis para todos
- Compras são registradas por usuário

### **Performance**
- Índices criados para consultas frequentes
- Políticas RLS otimizadas
- Paginação implementada para grandes listas

### **Integração**
- Sistema integrado com `usePlayerCards` para adicionar cartas
- Sistema integrado com `usePlayerCurrency` para gerenciar moedas
- Notificações automáticas de recompensas

## 🎯 Fluxo de Uso

### **Missões:**
1. Jogador vê missões disponíveis
2. Inicia missão clicando "Iniciar Missão"
3. Joga normalmente (progresso é atualizado automaticamente)
4. Quando completa, clica "Coletar Recompensas"
5. Recompensas são adicionadas automaticamente

### **Loja:**
1. Jogador navega pelos itens disponíveis
2. Verifica se tem moedas suficientes
3. Clica "Comprar"
4. Moedas são deduzidas
5. Itens são entregues automaticamente

## 🚀 Funcionalidades Futuras

### **Próximas Implementações:**
- [ ] Sistema de eventos sazonais
- [ ] Missões de história narrativa
- [ ] Sistema de conquistas avançado
- [ ] Itens cosméticos
- [ ] Sistema de amigos e missões cooperativas
- [ ] Rankings e competições

### **Melhorias Planejadas:**
- [ ] Notificações push para missões diárias
- [ ] Sistema de streak (sequência de dias)
- [ ] Missões personalizadas baseadas no estilo de jogo
- [ ] Sistema de crafting de cartas
- [ ] Marketplace entre jogadores

## 🐛 Troubleshooting

### **Problemas Comuns:**

1. **"Moedas insuficientes"**
   - Verificar se o jogador tem moeda inicial criada
   - Verificar se as missões estão dando recompensas corretamente

2. **"Missão não inicia"**
   - Verificar se a missão já foi iniciada anteriormente
   - Verificar se o usuário está autenticado

3. **"Cartas não aparecem na coleção"**
   - Verificar se `addCardToPlayer` foi chamada corretamente
   - Verificar se há erros no console

4. **"Progresso não atualiza"**
   - Verificar se `updateMissionProgress` está sendo chamada
   - Verificar se os requisitos da missão estão corretos

### **Logs de Debug:**
- Todos os hooks têm logs detalhados
- Verificar console do navegador para erros
- Verificar logs do Supabase para problemas de banco

## 📊 Métricas e Analytics

### **Dados Coletados:**
- Compras realizadas por tipo
- Missões completadas por dificuldade
- Tempo gasto em cada seção
- Conversão de moedas/gems
- Cartas mais populares

### **Relatórios Disponíveis:**
- Relatório de vendas da loja
- Progresso de missões por usuário
- Distribuição de recompensas
- Análise de engajamento

---

**Sistema desenvolvido com foco em escalabilidade, performance e experiência do usuário.** 