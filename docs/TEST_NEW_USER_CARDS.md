# 🧪 Teste: Cartas Iniciais de Novos Usuários

## 🎯 **Objetivo**
Verificar se novos usuários recebem corretamente **38 cartas iniciais** (28 básicas + 10 adicionais) ao se registrarem.

---

## 📋 **Pré-requisitos**

### **1. Banco de Dados**
- ✅ Migração `20250127000003-fix-starter-cards-distribution.sql` aplicada
- ✅ Tabela `cards` com cartas marcadas como `is_starter = true`
- ✅ Cartas não-starter disponíveis para seleção aleatória

### **2. Aplicação**
- ✅ Servidor rodando em `http://localhost:8085`
- ✅ Supabase configurado e conectado
- ✅ Sistema de autenticação funcionando

---

## 🧪 **Passos do Teste**

### **1. Criar Novo Usuário**
```bash
# 1. Acessar http://localhost:8085
# 2. Clicar em "Login" ou "Sign Up"
# 3. Criar conta com email: teste@exemplo.com
# 4. Verificar se login foi bem-sucedido
```

### **2. Verificar Cartas no Banco**
```sql
-- Conectar ao Supabase e executar:
SELECT 
  pc.player_id,
  c.name as card_name,
  c.is_starter,
  pc.quantity,
  COUNT(*) as total_cards
FROM player_cards pc
JOIN cards c ON pc.card_id = c.id
WHERE pc.player_id = 'ID_DO_USUARIO_CRIADO'
GROUP BY pc.player_id, c.name, c.is_starter, pc.quantity
ORDER BY c.is_starter DESC, c.name;

-- Verificar total de cartas:
SELECT 
  SUM(quantity) as total_cards_owned
FROM player_cards 
WHERE player_id = 'ID_DO_USUARIO_CRIADO';
```

### **3. Verificar Deck Inicial**
```sql
-- Verificar deck inicial criado:
SELECT 
  name,
  card_ids,
  array_length(card_ids, 1) as total_cards_in_deck,
  is_starter_deck,
  is_active
FROM player_decks 
WHERE player_id = 'ID_DO_USUARIO_CRIADO';
```

### **4. Verificar no Frontend**
```bash
# 1. Fazer login com o usuário criado
# 2. Clicar no botão "🃏 Decks"
# 3. Verificar se mostra "Deck Inicial" com 38 cartas
# 4. Verificar se o deck está ativo
```

---

## ✅ **Resultados Esperados**

### **1. Cartas no Banco**
- ✅ **Total de cartas**: 38 cartas
- ✅ **Cartas starter**: 28 cartas (5 cópias de cada carta starter)
- ✅ **Cartas adicionais**: 10 cartas (1 cópia de cada)
- ✅ **Distribuição**: Variedade de tipos e raridades

### **2. Deck Inicial**
- ✅ **Nome**: "Deck Inicial"
- ✅ **Total de cartas**: 38 cartas
- ✅ **Status**: `is_starter_deck = true`
- ✅ **Ativo**: `is_active = true`

### **3. Interface**
- ✅ **DeckManager**: Mostra "38 cartas (28 básicas + 10 adicionais)"
- ✅ **Status**: "Ativo" para o deck inicial
- ✅ **Proteção**: Botão "Excluir" não aparece para deck inicial

---

## 🚨 **Possíveis Problemas**

### **Problema 1: Menos de 38 cartas**
```sql
-- Verificar se há cartas starter suficientes:
SELECT COUNT(*) as starter_cards_count
FROM cards 
WHERE is_starter = true AND is_active = true;

-- Se < 6 cartas starter, adicionar mais:
INSERT INTO cards (name, type, rarity, is_starter, is_active) 
VALUES ('Nova Carta Starter', 'farm', 'common', true, true);
```

### **Problema 2: Cartas adicionais não selecionadas**
```sql
-- Verificar se há cartas não-starter disponíveis:
SELECT COUNT(*) as non_starter_cards
FROM cards 
WHERE is_starter = false AND is_active = true;

-- Se < 10 cartas, adicionar mais cartas ativas
```

### **Problema 3: Trigger não executado**
```sql
-- Verificar se o trigger existe:
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'handle_new_user';

-- Se não existe, aplicar a migração novamente
```

---

## 🔧 **Comandos de Debug**

### **Verificar Trigger**
```sql
-- Verificar função do trigger:
SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'handle_new_user';
```

### **Verificar Cartas do Usuário**
```sql
-- Listar todas as cartas do usuário:
SELECT 
  c.name,
  c.type,
  c.rarity,
  c.is_starter,
  pc.quantity
FROM player_cards pc
JOIN cards c ON pc.card_id = c.id
WHERE pc.player_id = 'ID_DO_USUARIO'
ORDER BY c.is_starter DESC, c.name;
```

### **Verificar Decks do Usuário**
```sql
-- Listar todos os decks:
SELECT 
  name,
  array_length(card_ids, 1) as card_count,
  is_starter_deck,
  is_active,
  created_at
FROM player_decks 
WHERE player_id = 'ID_DO_USUARIO'
ORDER BY created_at;
```

---

## 📊 **Métricas de Sucesso**

### **Performance**
- ✅ **Criação de usuário**: < 2s
- ✅ **Distribuição de cartas**: < 1s
- ✅ **Criação do deck**: < 500ms

### **Dados**
- ✅ **38 cartas** distribuídas corretamente
- ✅ **28 cartas básicas** (starter)
- ✅ **10 cartas adicionais** (não-starter)
- ✅ **1 deck inicial** criado e ativo

### **Interface**
- ✅ **DeckManager** mostra informações corretas
- ✅ **Validações** funcionam adequadamente
- ✅ **Proteções** do deck inicial ativas

---

## 🎯 **Próximos Passos**

### **Se o teste passar:**
1. ✅ **Sistema funcionando** corretamente
2. ✅ **Novos usuários** recebem 38 cartas
3. ✅ **Deck inicial** criado adequadamente
4. ✅ **Interface** mostra informações corretas

### **Se o teste falhar:**
1. 🔧 **Verificar logs** do Supabase
2. 🔧 **Aplicar migração** novamente
3. 🔧 **Verificar dados** das cartas
4. 🔧 **Testar com usuário** diferente

---

**🎉 Teste concluído! O sistema deve distribuir 38 cartas corretamente para novos usuários.** 