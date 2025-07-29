# 🔧 Diagnóstico: Erro 500 no Signup

## 🚨 **Problema**
```
POST https://iaphpsvzwzlpzsjsgsja.supabase.co/auth/v1/signup?redirect_to=http%3A%2F%2Flocalhost%3A8085%2F 500 (Internal Server Error)
```

## 🎯 **Causas Possíveis**

### **1. Trigger de Novo Usuário com Problema**
- ❌ **Função `handle_new_user()`** com erro
- ❌ **Tabelas não existem** ou sem permissões
- ❌ **Políticas RLS** mal configuradas
- ❌ **Cartas não existem** no banco

### **2. Problemas de Estrutura**
- ❌ **Tabela `profiles`** não existe
- ❌ **Tabela `player_cards`** não existe
- ❌ **Tabela `player_decks`** não existe
- ❌ **Tabela `cards`** não existe

### **3. Problemas de Permissões**
- ❌ **RLS (Row Level Security)** mal configurado
- ❌ **Políticas** não permitem inserção
- ❌ **Trigger** sem permissões adequadas

---

## 🔧 **Soluções**

### **Passo 1: Aplicar Migrações**
```bash
# Aplicar as migrações na ordem:
1. supabase/migrations/20250127000005-fix-tables-and-policies.sql
2. supabase/migrations/20250127000004-simplify-new-user-trigger.sql
```

### **Passo 2: Verificar Estrutura**
```sql
-- Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'player_cards', 'player_decks', 'cards');

-- Verificar se há cartas no banco
SELECT COUNT(*) as total_cards FROM public.cards;
SELECT COUNT(*) as starter_cards FROM public.cards WHERE is_starter = true;
SELECT COUNT(*) as active_cards FROM public.cards WHERE is_active = true;
```

### **Passo 3: Verificar Trigger**
```sql
-- Verificar se o trigger existe
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Verificar se a função existe
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';
```

### **Passo 4: Verificar Políticas RLS**
```sql
-- Verificar políticas das tabelas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'player_cards', 'player_decks', 'cards');
```

---

## 🧪 **Teste de Diagnóstico**

### **1. Teste Simples de Inserção**
```sql
-- Testar inserção manual (substitua USER_ID por um ID real)
INSERT INTO public.profiles (user_id, username, display_name)
VALUES ('USER_ID', 'teste', 'Usuário Teste');

-- Se funcionar, o problema está no trigger
-- Se falhar, o problema está nas políticas/tabelas
```

### **2. Teste do Trigger Manual**
```sql
-- Testar a função do trigger diretamente
SELECT public.handle_new_user();

-- Verificar logs de erro
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

### **3. Verificar Logs do Supabase**
```bash
# No painel do Supabase:
1. Ir para "Logs" > "Database"
2. Filtrar por "ERROR"
3. Procurar por erros relacionados ao signup
```

---

## 🚀 **Soluções Rápidas**

### **Solução 1: Trigger Simplificado**
```sql
-- Aplicar migração que simplifica o trigger
-- supabase/migrations/20250127000004-simplify-new-user-trigger.sql
```

### **Solução 2: Desabilitar Trigger Temporariamente**
```sql
-- Desabilitar o trigger para teste
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

-- Testar signup
-- Se funcionar, o problema está no trigger

-- Reabilitar após correção
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
```

### **Solução 3: Criar Usuário Manualmente**
```sql
-- Se o signup não funcionar, criar usuário manualmente
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'teste@exemplo.com',
  crypt('senha123', gen_salt('bf')),
  now(),
  now(),
  now()
);

-- Depois executar o trigger manualmente
SELECT public.handle_new_user();
```

---

## 📋 **Checklist de Verificação**

### **✅ Estrutura do Banco**
- [ ] Tabela `profiles` existe
- [ ] Tabela `player_cards` existe
- [ ] Tabela `player_decks` existe
- [ ] Tabela `cards` existe
- [ ] Coluna `is_starter` existe em `cards`
- [ ] Coluna `is_starter_deck` existe em `player_decks`

### **✅ Políticas RLS**
- [ ] RLS habilitado nas tabelas
- [ ] Políticas de INSERT configuradas
- [ ] Políticas de SELECT configuradas
- [ ] Políticas de UPDATE configuradas

### **✅ Trigger**
- [ ] Função `handle_new_user()` existe
- [ ] Trigger `on_auth_user_created` existe
- [ ] Trigger está habilitado
- [ ] Função não tem erros de sintaxe

### **✅ Dados**
- [ ] Existem cartas no banco
- [ ] Existem cartas starter (`is_starter = true`)
- [ ] Existem cartas ativas (`is_active = true`)
- [ ] Existem cartas não-starter para seleção

---

## 🔍 **Comandos de Debug**

### **Verificar Status Geral**
```sql
-- Status das tabelas
SELECT 
  table_name,
  table_type,
  is_insertable_into
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'player_cards', 'player_decks', 'cards');

-- Status do RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'player_cards', 'player_decks', 'cards');
```

### **Verificar Permissões**
```sql
-- Permissões das tabelas
SELECT 
  grantee,
  table_name,
  privilege_type
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'player_cards', 'player_decks', 'cards');
```

### **Verificar Função**
```sql
-- Detalhes da função
SELECT 
  proname,
  prosrc,
  proconfig
FROM pg_proc 
WHERE proname = 'handle_new_user';
```

---

## 🎯 **Próximos Passos**

### **Se o erro persistir:**
1. 🔧 **Aplicar migração de correção**
2. 🔧 **Verificar logs do Supabase**
3. 🔧 **Testar com trigger desabilitado**
4. 🔧 **Criar usuário manualmente**

### **Se o erro for resolvido:**
1. ✅ **Testar signup normal**
2. ✅ **Verificar se usuário recebe cartas**
3. ✅ **Verificar se deck inicial é criado**
4. ✅ **Testar funcionalidades do jogo**

---

**🔧 Siga este guia para diagnosticar e resolver o erro 500 no signup!** 


