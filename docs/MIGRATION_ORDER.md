# 📋 Ordem de Aplicação das Migrações

## 🎯 **Objetivo**
Resolver o erro 500 no signup aplicando as migrações na ordem correta.

---

## 📝 **Ordem de Aplicação**

### **1. Estrutura e Políticas**
```sql
-- Aplicar primeiro: Estrutura das tabelas e políticas RLS
-- Arquivo: supabase/migrations/20250127000005-fix-tables-and-policies.sql
```

**O que faz:**
- ✅ Cria todas as tabelas necessárias
- ✅ Configura RLS (Row Level Security)
- ✅ Define políticas de acesso
- ✅ Cria índices para performance
- ✅ Garante que o trigger existe

### **2. Corrigir Tipo de ID das Cartas**
```sql
-- Aplicar segundo: Corrigir tipo de ID das cartas
-- Arquivo: supabase/migrations/20250127000006-fix-card-ids-uuid.sql
```

**O que faz:**
- ✅ Altera coluna `id` da tabela `cards` para TEXT
- ✅ Insere cartas starter com IDs válidos
- ✅ Insere cartas não-starter com IDs válidos
- ✅ Verifica se as cartas foram inseridas

### **3. Trigger Simplificado**
```sql
-- Aplicar terceiro: Trigger robusto para novos usuários
-- Arquivo: supabase/migrations/20250127000004-simplify-new-user-trigger.sql
```

**O que faz:**
- ✅ Cria trigger simplificado e robusto
- ✅ Tratamento de erro adequado
- ✅ Verificação de cartas disponíveis
- ✅ Fallback para deck vazio se necessário

---

## 🚀 **Como Aplicar**

### **No Supabase Dashboard:**

1. **Ir para SQL Editor**
2. **Aplicar migração 1**:
   ```sql
   -- Copiar e colar o conteúdo de:
   -- supabase/migrations/20250127000005-fix-tables-and-policies.sql
   ```

3. **Aplicar migração 2**:
   ```sql
   -- Copiar e colar o conteúdo de:
   -- supabase/migrations/20250127000006-fix-card-ids-uuid.sql
   ```

4. **Aplicar migração 3**:
   ```sql
   -- Copiar e colar o conteúdo de:
   -- supabase/migrations/20250127000004-simplify-new-user-trigger.sql
   ```

### **Verificar Aplicação:**

```sql
-- Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'player_cards', 'player_decks', 'cards');

-- Verificar se há cartas
SELECT COUNT(*) as total_cards FROM public.cards;
SELECT COUNT(*) as starter_cards FROM public.cards WHERE is_starter = true;
SELECT COUNT(*) as active_cards FROM public.cards WHERE is_active = true;

-- Verificar se o trigger existe
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

---

## 🧪 **Teste Após Aplicação**

### **1. Testar Signup**
```bash
# 1. Acessar http://localhost:8085
# 2. Clicar em "Sign Up"
# 3. Criar conta com email: teste@exemplo.com
# 4. Verificar se não há erro 500
```

### **2. Verificar Dados Criados**
```sql
-- Verificar se o usuário foi criado
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'teste@exemplo.com';

-- Verificar se o perfil foi criado
SELECT * FROM public.profiles 
WHERE user_id = 'ID_DO_USUARIO_CRIADO';

-- Verificar se as cartas foram dadas
SELECT 
  pc.player_id,
  c.name as card_name,
  c.is_starter,
  pc.quantity
FROM player_cards pc
JOIN cards c ON pc.card_id = c.id
WHERE pc.player_id = 'ID_DO_USUARIO_CRIADO';

-- Verificar se o deck foi criado
SELECT 
  name,
  card_ids,
  array_length(card_ids, 1) as total_cards,
  is_starter_deck,
  is_active
FROM player_decks 
WHERE player_id = 'ID_DO_USUARIO_CRIADO';
```

---

## 🚨 **Possíveis Problemas**

### **Problema 1: Erro ao alterar tipo de coluna**
```sql
-- Se a tabela cards já tem dados, pode dar erro
-- Solução: Fazer backup e recriar a tabela
```

### **Problema 2: Trigger já existe**
```sql
-- Se o trigger já existe, pode dar erro
-- Solução: A migração usa DROP IF EXISTS, então deve funcionar
```

### **Problema 3: Políticas conflitantes**
```sql
-- Se já existem políticas, podem ser sobrescritas
-- Solução: As migrações usam DROP IF EXISTS
```

---

## ✅ **Resultado Esperado**

### **Após aplicar as 3 migrações:**
- ✅ **Signup funciona** sem erro 500
- ✅ **Novos usuários** recebem cartas automaticamente
- ✅ **Deck inicial** é criado com cartas
- ✅ **Políticas RLS** funcionam corretamente
- ✅ **Trigger** executa sem erros

### **Dados esperados:**
- ✅ **6 cartas starter** no banco
- ✅ **10 cartas não-starter** no banco
- ✅ **Usuário recebe** 38 cartas (28 básicas + 10 adicionais)
- ✅ **Deck inicial** com 38 cartas

---

## 🔧 **Comandos de Debug**

### **Se ainda houver erro 500:**
```sql
-- Verificar logs de erro
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- Verificar se a função existe
SELECT proname, prosrc FROM pg_proc WHERE proname = 'handle_new_user';

-- Testar a função manualmente
SELECT public.handle_new_user();
```

### **Se as cartas não forem inseridas:**
```sql
-- Verificar se a tabela cards existe
SELECT table_name FROM information_schema.tables WHERE table_name = 'cards';

-- Verificar estrutura da tabela
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'cards';

-- Inserir cartas manualmente se necessário
```

---

**🎯 Siga esta ordem exata para resolver o erro 500 no signup!** 