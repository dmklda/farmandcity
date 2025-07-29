# 🔧 Guia de Resolução de Erros

## 🚨 **Erros Identificados**

### **1. Erro de Autenticação**
```
Error: Usuário não autenticado
```
**Causa**: Hooks tentando buscar dados sem verificar se o usuário está logado.

### **2. Erro de Tabela Faltando**
```
GET https://iaphpsvzwzlpzsjsgsja.supabase.co/rest/v1/game_settings 406 (Not Acceptable)
```
**Causa**: Tabela `game_settings` não existe no banco.

### **3. Erro de Favicon**
```
GET http://localhost:8085/favicon.ico 404 (Not Found)
```
**Causa**: Arquivo favicon não existe.

---

## ✅ **Soluções Implementadas**

### **1. Hooks Corrigidos**
- ✅ **`usePlayerDecks.ts`**: Verifica autenticação antes de buscar dados
- ✅ **`usePlayerCards.ts`**: Verifica autenticação antes de buscar dados
- ✅ **`useGameSettings.ts`**: Usa valores padrão quando tabela não existe

### **2. Tabela Game Settings**
- ✅ **`supabase/migrations/20250127000007-fix-game-settings-table.sql`**
  - Cria tabela `game_settings`
  - Insere configurações padrão
  - Configura políticas RLS

### **3. Favicon**
- ✅ **`public/favicon.svg`**: Favicon SVG criado
- ✅ **`index.html`**: Link para favicon adicionado

---

## 🚀 **Como Aplicar as Correções**

### **Passo 1: Aplicar Migração**
```sql
-- No Supabase, aplicar:
supabase/migrations/20250127000007-fix-game-settings-table.sql
```

### **Passo 2: Verificar Estrutura**
```sql
-- Verificar se a tabela foi criada
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'game_settings';

-- Verificar se há configurações
SELECT * FROM public.game_settings;
```

### **Passo 3: Testar Aplicação**
```bash
# 1. Recarregar a página http://localhost:8085
# 2. Verificar se não há mais erros no console
# 3. Testar login/signup
```

---

## 🧪 **Testes de Verificação**

### **Teste 1: Console Limpo**
```bash
# Abrir DevTools > Console
# Verificar se não há mais erros de:
# - "Usuário não autenticado"
# - "406 Not Acceptable"
# - "404 Not Found" (favicon)
```

### **Teste 2: Autenticação**
```bash
# 1. Fazer logout (se logado)
# 2. Verificar se hooks não tentam buscar dados
# 3. Fazer login
# 4. Verificar se dados são carregados corretamente
```

### **Teste 3: Configurações**
```bash
# 1. Verificar se configurações padrão são carregadas
# 2. Verificar se não há erros relacionados a game_settings
```

---

## 📋 **Checklist de Verificação**

### **✅ Hooks Corrigidos**
- [ ] `usePlayerDecks` não tenta buscar dados sem autenticação
- [ ] `usePlayerCards` não tenta buscar dados sem autenticação
- [ ] `useGameSettings` usa valores padrão quando necessário

### **✅ Banco de Dados**
- [ ] Tabela `game_settings` existe
- [ ] Configurações padrão inseridas
- [ ] Políticas RLS configuradas

### **✅ Frontend**
- [ ] Favicon carrega corretamente
- [ ] Console sem erros de autenticação
- [ ] Console sem erros de tabelas faltando

---

## 🔍 **Comandos de Debug**

### **Verificar Tabela Game Settings**
```sql
-- Verificar se a tabela existe
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'game_settings';

-- Verificar configurações
SELECT setting_key, setting_value 
FROM public.game_settings;

-- Verificar políticas RLS
SELECT policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'game_settings';
```

### **Verificar Autenticação**
```sql
-- Verificar usuários ativos
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Verificar perfis
SELECT user_id, username, display_name 
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## 🎯 **Resultado Esperado**

### **Após aplicar as correções:**
- ✅ **Console limpo** sem erros de autenticação
- ✅ **Console limpo** sem erros de tabelas faltando
- ✅ **Favicon carrega** corretamente
- ✅ **Hooks funcionam** adequadamente
- ✅ **Login/Signup** funcionam sem problemas

### **Comportamento dos Hooks:**
- ✅ **Usuário não logado**: Hooks não tentam buscar dados
- ✅ **Usuário logado**: Hooks buscam dados normalmente
- ✅ **Erro de tabela**: Hooks usam valores padrão

---

## 🚨 **Se Ainda Houver Problemas**

### **Problema 1: Erros de Autenticação Persistem**
```bash
# Verificar se os hooks foram atualizados
# Recarregar a página completamente (Ctrl+F5)
# Limpar cache do navegador
```

### **Problema 2: Tabela Game Settings Não Existe**
```sql
-- Aplicar migração manualmente
-- Verificar se há erros na migração
-- Verificar permissões do usuário do banco
```

### **Problema 3: Favicon Não Carrega**
```bash
# Verificar se o arquivo favicon.svg existe em public/
# Verificar se o link no index.html está correto
# Limpar cache do navegador
```

---

**🎉 Após aplicar todas as correções, a aplicação deve funcionar sem erros no console!** 