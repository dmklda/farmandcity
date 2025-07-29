# 🔧 Corrigir Erro UUID na Coluna ID

## 🚨 **Problema Identificado**
```
ERROR: 22P02: invalid input syntax for type uuid: "starter-farm-1"
```

**Causa**: A coluna `id` da tabela `cards` está definida como `UUID`, mas estamos tentando inserir strings.

---

## ✅ **Soluções Implementadas**

### **1. Corrigir Tipo da Coluna**
- ✅ **`supabase/migrations/20250127000014-fix-uuid-column.sql`**
  - Altera a coluna `id` de `UUID` para `TEXT`
  - Verifica se a alteração foi aplicada

### **2. Inserir Cartas Após Correção**
- ✅ **`supabase/migrations/20250127000015-insert-cards-after-uuid-fix.sql`**
  - Insere as cartas starter após corrigir o tipo
  - Usa `ON CONFLICT` para evitar duplicatas

---

## 🚀 **Como Aplicar as Correções**

### **Passo 1: Aplicar Migrações na Ordem**
```sql
-- 1. Corrigir tipo da coluna id
supabase/migrations/20250127000014-fix-uuid-column.sql

-- 2. Inserir cartas após correção
supabase/migrations/20250127000015-insert-cards-after-uuid-fix.sql
```

### **Passo 2: Verificar Correção**
```sql
-- Verificar se a coluna foi alterada
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'cards' AND column_name = 'id';

-- Deve retornar: id | text | NO
```

### **Passo 3: Verificar Cartas**
```sql
-- Verificar se as cartas foram inseridas
SELECT 
  type,
  COUNT(*) as total_cards,
  SUM(CASE WHEN is_starter = true THEN 1 ELSE 0 END) as starter_cards
FROM public.cards 
WHERE is_active = true
GROUP BY type
ORDER BY type;
```

---

## 🧪 **Testes de Verificação**

### **Teste 1: Verificar Tipo da Coluna**
```sql
-- Deve retornar 'text' como data_type
SELECT data_type 
FROM information_schema.columns 
WHERE table_name = 'cards' AND column_name = 'id';
```

### **Teste 2: Verificar Cartas Starter**
```sql
-- Deve retornar 24 cartas starter
SELECT COUNT(*) 
FROM public.cards 
WHERE is_starter = true AND is_active = true;
```

### **Teste 3: Verificar Inserção de Novas Cartas**
```sql
-- Tentar inserir uma carta de teste
INSERT INTO public.cards (id, name, type, rarity, effect, is_starter, is_active) 
VALUES ('test-card-1', 'Carta Teste', 'action', 'common', 'Efeito teste', false, true)
ON CONFLICT (id) DO NOTHING;

-- Verificar se foi inserida
SELECT * FROM public.cards WHERE id = 'test-card-1';

-- Limpar carta de teste
DELETE FROM public.cards WHERE id = 'test-card-1';
```

---

## 🔍 **Comandos de Debug**

### **Verificar Estrutura da Tabela**
```sql
-- Verificar estrutura completa da tabela cards
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'cards'
ORDER BY ordinal_position;
```

### **Verificar Dados Existentes**
```sql
-- Verificar se há dados na tabela
SELECT COUNT(*) as total_cards FROM public.cards;

-- Verificar tipos de dados existentes
SELECT 
  id,
  pg_typeof(id) as id_type,
  name,
  type
FROM public.cards 
LIMIT 5;
```

### **Verificar Constraints**
```sql
-- Verificar constraints da tabela
SELECT 
  constraint_name,
  constraint_type,
  table_name
FROM information_schema.table_constraints 
WHERE table_name = 'cards';
```

---

## 🎯 **Resultado Esperado**

### **Após aplicar as correções:**
- ✅ **Coluna `id`** é do tipo `TEXT`
- ✅ **24 cartas starter** inseridas com sucesso
- ✅ **10+ cartas não-starter** inseridas
- ✅ **Não há mais erros** de UUID
- ✅ **Inserção de novas cartas** funciona

### **Para novos usuários:**
- ✅ **Trigger executa** sem erros
- ✅ **38 cartas** distribuídas corretamente
- ✅ **Deck inicial** criado com sucesso

---

## 🚨 **Se Ainda Houver Problemas**

### **Problema 1: Coluna não foi alterada**
```sql
-- Verificar se a alteração foi aplicada
SELECT data_type FROM information_schema.columns 
WHERE table_name = 'cards' AND column_name = 'id';

-- Se ainda for UUID, aplicar manualmente:
ALTER TABLE public.cards ALTER COLUMN id TYPE TEXT;
```

### **Problema 2: Dados existentes incompatíveis**
```sql
-- Verificar se há dados UUID existentes
SELECT id FROM public.cards WHERE id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Se houver, limpar e reinserir:
DELETE FROM public.cards WHERE is_starter = true;
-- Aplicar migração de inserção novamente
```

### **Problema 3: Erro de constraint**
```sql
-- Verificar se há constraints que impedem a alteração
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'cards';

-- Se houver foreign keys, pode ser necessário:
-- 1. Dropar as foreign keys
-- 2. Alterar o tipo
-- 3. Recriar as foreign keys
```

---

## 📋 **Checklist de Verificação**

### **✅ Estrutura da Tabela**
- [ ] Coluna `id` é do tipo `TEXT`
- [ ] Não há constraints conflitantes
- [ ] Tabela aceita inserções de string

### **✅ Dados**
- [ ] 24 cartas starter inseridas
- [ ] 10+ cartas não-starter inseridas
- [ ] IDs são strings válidas

### **✅ Funcionalidade**
- [ ] Inserção de novas cartas funciona
- [ ] Trigger de novo usuário funciona
- [ ] Não há erros de UUID

---

## 🔧 **Comandos de Emergência**

### **Se tudo falhar, recriar a tabela:**
```sql
-- 1. Fazer backup dos dados existentes
CREATE TABLE cards_backup AS SELECT * FROM public.cards;

-- 2. Dropar a tabela
DROP TABLE public.cards CASCADE;

-- 3. Recriar com estrutura correta
CREATE TABLE public.cards (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  rarity TEXT NOT NULL,
  cost_coins INTEGER DEFAULT 0,
  cost_food INTEGER DEFAULT 0,
  cost_materials INTEGER DEFAULT 0,
  cost_population INTEGER DEFAULT 0,
  effect TEXT,
  effect_logic TEXT,
  phase TEXT,
  use_per_turn INTEGER DEFAULT 1,
  is_reactive BOOLEAN DEFAULT false,
  art_url TEXT,
  frame_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_starter BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Aplicar migração de inserção
-- supabase/migrations/20250127000015-insert-cards-after-uuid-fix.sql
```

---

**🎉 Após aplicar as migrações na ordem correta, o erro de UUID será resolvido e as cartas serão inseridas com sucesso!** 