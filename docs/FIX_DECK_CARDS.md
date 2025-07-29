# 🔧 Corrigir Deck Inicial com 0 Cartas

## 🚨 **Problema Identificado**
O Deck Manager está mostrando "0 cartas" no deck inicial quando deveria ter 38 cartas (28 básicas + 10 adicionais).

---

## 🎯 **Causas Possíveis**

### **1. Cartas não inseridas no banco**
- ❌ Tabela `cards` vazia ou sem cartas starter
- ❌ Cartas não marcadas como `is_starter = true`

### **2. Trigger não funcionou**
- ❌ Trigger `handle_new_user()` não executou
- ❌ Erro no trigger impediu criação de cartas

### **3. Usuário existente**
- ❌ Usuário criado antes do trigger estar funcionando
- ❌ Usuário não recebeu cartas automaticamente

---

## ✅ **Soluções Implementadas**

### **1. Inserir Cartas Starter**
- ✅ **`supabase/migrations/20250127000008-insert-starter-cards.sql`**
  - Insere 6 cartas starter
  - Insere 10 cartas não-starter
  - Verifica estrutura da tabela

### **2. Corrigir Trigger**
- ✅ **`supabase/migrations/20250127000009-fix-trigger-final.sql`**
  - Trigger robusto e corrigido
  - Tratamento de erro adequado
  - Garante 38 cartas para novos usuários

### **3. Corrigir Usuários Existentes**
- ✅ **`supabase/migrations/20250127000010-fix-existing-users.sql`**
  - Função para corrigir usuários específicos
  - Verificação de usuários sem cartas

---

## 🚀 **Como Aplicar as Correções**

### **Passo 1: Aplicar Migrações na Ordem**
```sql
-- 1. Inserir cartas
supabase/migrations/20250127000008-insert-starter-cards.sql

-- 2. Corrigir trigger
supabase/migrations/20250127000009-fix-trigger-final.sql

-- 3. Verificar usuários existentes
supabase/migrations/20250127000010-fix-existing-users.sql
```

### **Passo 2: Verificar Cartas no Banco**
```sql
-- Verificar cartas starter
SELECT 
  id, 
  name, 
  type, 
  rarity, 
  is_starter, 
  is_active 
FROM public.cards 
WHERE is_starter = true AND is_active = true
ORDER BY name;

-- Verificar total de cartas
SELECT 
  'Starter Cards' as category,
  COUNT(*) as count
FROM public.cards 
WHERE is_starter = true AND is_active = true

UNION ALL

SELECT 
  'Non-Starter Cards' as category,
  COUNT(*) as count
FROM public.cards 
WHERE is_starter = false AND is_active = true

UNION ALL

SELECT 
  'Total Active Cards' as category,
  COUNT(*) as count
FROM public.cards 
WHERE is_active = true;
```

### **Passo 3: Verificar Usuário Atual**
```sql
-- Verificar se o usuário tem cartas
SELECT 
  u.email,
  COUNT(pc.id) as cards_count,
  COUNT(pd.id) as decks_count
FROM auth.users u
LEFT JOIN public.player_cards pc ON u.id = pc.player_id
LEFT JOIN public.player_decks pd ON u.id = pd.player_id
WHERE u.email = 'SEU_EMAIL_AQUI'
GROUP BY u.email;
```

### **Passo 4: Corrigir Usuário Específico**
```sql
-- Se o usuário não tem cartas, corrigir
SELECT public.fix_user_cards('SEU_EMAIL_AQUI');
```

---

## 🧪 **Testes de Verificação**

### **Teste 1: Verificar Cartas no Banco**
```sql
-- Deve retornar 6 cartas starter
SELECT COUNT(*) FROM public.cards WHERE is_starter = true AND is_active = true;

-- Deve retornar pelo menos 10 cartas não-starter
SELECT COUNT(*) FROM public.cards WHERE is_starter = false AND is_active = true;
```

### **Teste 2: Verificar Deck do Usuário**
```sql
-- Substitua USER_ID pelo ID do seu usuário
SELECT 
  name,
  card_ids,
  array_length(card_ids, 1) as total_cards,
  is_starter_deck,
  is_active
FROM player_decks 
WHERE player_id = 'USER_ID';
```

### **Teste 3: Verificar Cartas do Usuário**
```sql
-- Substitua USER_ID pelo ID do seu usuário
SELECT 
  pc.player_id,
  c.name as card_name,
  c.is_starter,
  pc.quantity
FROM player_cards pc
JOIN cards c ON pc.card_id = c.id
WHERE pc.player_id = 'USER_ID'
ORDER BY c.is_starter DESC, c.name;
```

---

## 🔍 **Comandos de Debug**

### **Verificar Trigger**
```sql
-- Verificar se o trigger existe
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Verificar função do trigger
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';
```

### **Verificar Estrutura da Tabela**
```sql
-- Verificar estrutura da tabela cards
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'cards'
ORDER BY ordinal_position;
```

### **Verificar Políticas RLS**
```sql
-- Verificar políticas das tabelas
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('cards', 'player_cards', 'player_decks');
```

---

## 🎯 **Resultado Esperado**

### **Após aplicar as correções:**
- ✅ **6 cartas starter** no banco
- ✅ **10+ cartas não-starter** no banco
- ✅ **Usuário recebe** 38 cartas (28 básicas + 10 adicionais)
- ✅ **Deck inicial** com 38 cartas
- ✅ **Deck Manager** mostra "38 cartas (28 básicas + 10 adicionais)"

### **Para novos usuários:**
- ✅ **Trigger executa** automaticamente
- ✅ **38 cartas** distribuídas
- ✅ **Deck inicial** criado com cartas

### **Para usuários existentes:**
- ✅ **Função `fix_user_cards()`** corrige manualmente
- ✅ **38 cartas** adicionadas ao usuário
- ✅ **Deck inicial** atualizado com cartas

---

## 🚨 **Se Ainda Houver Problemas**

### **Problema 1: Cartas não inseridas**
```sql
-- Verificar se há cartas no banco
SELECT COUNT(*) FROM public.cards;

-- Se 0, aplicar migração novamente
-- supabase/migrations/20250127000008-insert-starter-cards.sql
```

### **Problema 2: Trigger não funciona**
```sql
-- Verificar se o trigger existe
SELECT trigger_name FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';

-- Se não existe, aplicar migração
-- supabase/migrations/20250127000009-fix-trigger-final.sql
```

### **Problema 3: Usuário não tem cartas**
```sql
-- Corrigir usuário específico
SELECT public.fix_user_cards('SEU_EMAIL_AQUI');
```

---

## 📋 **Checklist Final**

### **✅ Banco de Dados**
- [ ] 6 cartas starter inseridas
- [ ] 10+ cartas não-starter inseridas
- [ ] Trigger `handle_new_user()` existe
- [ ] Políticas RLS configuradas

### **✅ Usuário Atual**
- [ ] Tem cartas no `player_cards`
- [ ] Tem deck no `player_decks`
- [ ] Deck inicial tem 38 cartas
- [ ] Deck inicial está ativo

### **✅ Interface**
- [ ] Deck Manager mostra 38 cartas
- [ ] Não há erros no console
- [ ] Cartas aparecem na lista
- [ ] Funcionalidades funcionam

---

**🎉 Após aplicar todas as correções, o deck inicial deve ter 38 cartas corretamente!** 