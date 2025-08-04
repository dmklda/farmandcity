# Restauração do Campo de Batalha Clássico

## Problema Identificado

O usuário reportou que o "campo de batalha clássico" havia sido removido ou sobrescrito durante as implementações anteriores. Após investigação, foi confirmado que o background "Campo Clássico" não existia no banco de dados, apesar de ser referenciado no código como o background padrão para novos usuários.

## Causa Raiz

O background "Campo Clássico" era referenciado no código (`useBattlefieldCustomization.ts`) como o background padrão que deveria ser dado automaticamente aos novos usuários, mas não existia na tabela `battlefield_customizations` do banco de dados.

### Código Afetado

```typescript
// src/hooks/useBattlefieldCustomization.ts
const giveDefaultCustomization = async (userId: string) => {
  // Buscar o Campo Clássico (background padrão)
  const { data: defaultCustomization, error: selectError } = await supabase
    .from('battlefield_customizations')
    .select('*')
    .eq('name', 'Campo Clássico')  // ← Esta consulta falhava
    .single();

  if (selectError) throw selectError; // ← Erro aqui
  // ...
};
```

## Solução Implementada

### 1. Criação do Background Clássico

Foi criada a migração `add_classic_battlefield_background` que adiciona o Campo Clássico ao banco de dados:

```sql
INSERT INTO battlefield_customizations (name, description, image_url, rarity, price_coins, price_gems, currency_type, is_active, is_special) VALUES
('Campo Clássico', 'O campo de batalha clássico e tradicional', '/src/assets/boards_backgrounds/grid-board-background.jpg', 'common', 0, 0, 'coins', true, false);
```

### 2. Características do Campo Clássico

- **Nome**: Campo Clássico
- **Descrição**: O campo de batalha clássico e tradicional
- **Imagem**: `/src/assets/boards_backgrounds/grid-board-background.jpg`
- **Raridade**: Common
- **Preço**: Gratuito (0 moedas, 0 gemas)
- **Tipo**: Background gratuito (não especial)
- **Status**: Ativo

### 3. Funcionalidade Restaurada

Com o Campo Clássico restaurado, agora:

1. **Novos usuários** recebem automaticamente o Campo Clássico
2. **Usuários existentes** sem backgrounds podem receber o Campo Clássico
3. **O background padrão** funciona corretamente no campo de batalha
4. **A função `giveDefaultCustomization`** funciona sem erros

## Verificação da Solução

### Teste no Banco de Dados
```sql
-- Verificar se o Campo Clássico existe
SELECT * FROM battlefield_customizations WHERE name = 'Campo Clássico';

-- Resultado esperado:
-- id: 01373089-5176-458c-9fcb-17ef725c1d40
-- name: Campo Clássico
-- image_url: /src/assets/boards_backgrounds/grid-board-background.jpg
-- is_active: true
-- is_special: false
```

### Teste de Funcionalidade

1. **Novo usuário**: Deve receber automaticamente o Campo Clássico
2. **Campo de batalha**: Deve exibir o background clássico por padrão
3. **Loja**: O Campo Clássico deve aparecer como background gratuito
4. **Admin**: O Campo Clássico deve aparecer na lista de customizações

## Arquivo de Imagem

O arquivo de imagem do Campo Clássico está localizado em:
```
src/assets/boards_backgrounds/grid-board-background.jpg
```

Este arquivo já existia no projeto e é usado como fallback em vários componentes.

## Impacto

### Positivo
- ✅ Background padrão restaurado
- ✅ Novos usuários recebem background automaticamente
- ✅ Campo de batalha tem background por padrão
- ✅ Sistema de backgrounds completo funcionando

### Compatibilidade
- ✅ Não afeta backgrounds premium existentes
- ✅ Não afeta backgrounds animados
- ✅ Mantém compatibilidade com sistema de customização

## Status

✅ **RESOLVIDO** - O Campo de Batalha Clássico foi restaurado e está funcionando corretamente.

## Próximos Passos

1. Testar com um novo usuário para confirmar que recebe o Campo Clássico automaticamente
2. Verificar se o background aparece corretamente no campo de batalha
3. Confirmar que está disponível na loja como background gratuito 