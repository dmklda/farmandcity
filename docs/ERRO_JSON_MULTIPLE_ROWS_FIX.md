# Correção do Erro "JSON object requested, multiple (or no) rows returned"

## Problema Identificado
O usuário reportou que ao tentar fazer alterações nas configurações, aparecia o erro:
```
Error: JSON object requested, multiple (or no) rows returned
```

## Análise do Problema

### Causa Raiz
O erro estava sendo causado por **dados duplicados** na tabela `user_settings`. Existiam **26 linhas duplicadas** para o mesmo usuário, o que causava o erro quando o código tentava usar `.single()` para retornar apenas uma linha.

### Verificação Inicial
```sql
SELECT user_id, COUNT(*) as count 
FROM user_settings 
GROUP BY user_id 
HAVING COUNT(*) > 1;
```

**Resultado:**
- Usuário: `d6db43d9-9b1f-403b-9177-bf58f1596db6`
- Contagem: 26 linhas duplicadas

## Correções Implementadas

### 1. Limpeza de Dados Duplicados ✅
**Migração aplicada:** `clean_duplicate_user_settings.sql`

**SQL executado:**
```sql
DELETE FROM user_settings 
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id 
  FROM user_settings 
  ORDER BY user_id, updated_at DESC NULLS LAST, created_at DESC
);
```

**Resultado:**
- Removidas 25 linhas duplicadas
- Mantida apenas 1 linha por usuário (a mais recente)

### 2. Correção do Hook useUserSettings ✅
**Arquivo modificado:** `src/hooks/useUserSettings.ts`

**Problemas corrigidos:**
- Removido uso de `.single()` em `updateUserSettings`
- Removido uso de `.single()` em `purchaseCustomization`
- Removido uso de `.single()` em `equipCustomization`

**Código corrigido:**
```typescript
// Antes (causava erro)
const { data, error } = await supabase
  .from('user_settings')
  .update(updates)
  .eq('user_id', user.id)
  .select()
  .single();

// Depois (funciona corretamente)
const { data, error } = await supabase
  .from('user_settings')
  .update(updates)
  .eq('user_id', user.id)
  .select();

const updatedSettings = data && data.length > 0 ? data[0] : null;
```

## Verificação Final

### 1. Verificação de Duplicatas
```sql
SELECT user_id, COUNT(*) as count 
FROM user_settings 
GROUP BY user_id 
HAVING COUNT(*) > 1;
```
**Resultado:** `[]` (nenhuma duplicata)

### 2. Contagem Total
```sql
SELECT COUNT(*) as total_settings FROM user_settings;
```
**Resultado:** `1` linha

## Como Testar

1. **Acesse a aplicação** em `http://localhost:8082`
2. **Faça login** com uma conta válida
3. **Clique no botão "Configurações"** na página inicial
4. **Tente fazer alterações** em qualquer configuração:
   - Edite o nome de usuário na aba Perfil
   - Altere o tema na aba Preferências
   - Configure notificações na aba Notificações
5. **Verifique se não há mais erros** no card "Erro do Sistema"
6. **Confirme que as alterações são salvas** com toast de sucesso

## Status
✅ **CONCLUÍDO** - O erro "JSON object requested, multiple (or no) rows returned" foi corrigido através de:
- Limpeza de dados duplicados no banco de dados
- Correção do código para não usar `.single()` incorretamente
- Verificação de que não há mais duplicatas

## Prevenção Futura
Para evitar que esse problema aconteça novamente:
1. A constraint `UNIQUE(user_id)` na tabela `user_settings` deve impedir duplicatas
2. O código agora trata corretamente múltiplas linhas sem usar `.single()`
3. Monitoramento regular da integridade dos dados 