# 🏪 Painel Admin - Gerenciamento de Loja e Moedas

## 📋 Visão Geral

Implementação completa do sistema de gerenciamento de itens da loja no painel administrativo, com funcionalidades específicas para itens de moeda.

## 🆕 Funcionalidades Implementadas

### 1. Nova Aba "Loja" no Painel Admin

**Localização:** `src/components/admin/AdminLayout.tsx`
- Adicionada nova aba "Loja" com ícone de carrinho de compras
- Posicionada entre "Packs e Boosters" e "Eventos"
- Descrição: "Gerenciar itens da loja"

### 2. ShopManager Aprimorado

**Arquivo:** `src/components/admin/ShopManager.tsx`

#### Funcionalidades Principais:
- ✅ **Criar novos itens** da loja
- ✅ **Editar itens existentes**
- ✅ **Excluir itens**
- ✅ **Filtros por tipo** (Moedas, Packs, Boosters, Cartas, etc.)
- ✅ **Campos específicos para itens de moeda**

#### Campos Específicos para Itens de Moeda:
- **Quantidade de Moedas Fornecidas** (`currency_amount_coins`)
- **Quantidade de Gemas Fornecidas** (`currency_amount_gems`)

#### Interface Melhorada:
- **Filtros dinâmicos** por tipo de item
- **Contador de itens** (ex: "5 de 20 itens")
- **Exibição de preços** em múltiplas moedas (💰 Moedas, 💎 Gemas, 💵 Dólares)
- **Informações de desconto** (falso e real)
- **Status ativo/inativo**
- **Badges de raridade** com cores

### 3. Banco de Dados Atualizado

**Migração:** `supabase/migrations/20250128000000-add-currency-fields-to-shop-items.sql`

#### Novos Campos:
```sql
ALTER TABLE public.shop_items 
ADD COLUMN IF NOT EXISTS currency_amount_coins INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency_amount_gems INTEGER DEFAULT 0;
```

#### Índices de Performance:
```sql
CREATE INDEX IF NOT EXISTS idx_shop_items_currency_type ON public.shop_items(item_type) WHERE item_type = 'currency';
CREATE INDEX IF NOT EXISTS idx_shop_items_active ON public.shop_items(is_active) WHERE is_active = true;
```

### 4. Tipos TypeScript Atualizados

**Arquivo:** `src/integrations/supabase/types.ts`

Adicionados os novos campos na interface da tabela `shop_items`:
- `currency_amount_coins?: number | null`
- `currency_amount_gems?: number | null`

## 🎯 Como Usar

### 1. Acessar o Painel Admin
1. Faça login como administrador
2. Navegue para o painel admin
3. Clique na aba "Loja"

### 2. Criar Item de Moeda
1. Clique em "Novo Item"
2. Selecione tipo "Currency"
3. Preencha:
   - **Nome:** "Pacote de 1000 Moedas"
   - **Descrição:** "Receba 1000 moedas para usar no jogo"
   - **Preço:** Defina preço em dólares (ex: $4.99)
   - **Quantidade de Moedas Fornecidas:** 1000
   - **Quantidade de Gemas Fornecidas:** 0 (ou valor desejado)
4. Clique em "Salvar"

### 3. Filtrar Itens
- Use o dropdown "Filtrar por tipo" para ver apenas itens de moeda
- Visualize contador: "3 de 15 itens"

### 4. Editar Item Existente
1. Clique em "Editar" no card do item
2. Modifique os campos desejados
3. Clique em "Salvar"

## 🔧 Campos Disponíveis

### Campos Gerais:
- **Nome** - Nome do item
- **Tipo** - pack, booster, card, currency, cosmetic, event
- **Descrição** - Descrição detalhada
- **Preço (Moedas)** - Preço em moedas do jogo
- **Preço (Gemas)** - Preço em gemas do jogo
- **Preço (Dólares)** - Preço em dinheiro real
- **Raridade** - common, uncommon, rare, ultra, legendary
- **Desconto Falso (%)** - Desconto mostrado na loja
- **Desconto Real (%)** - Desconto real aplicado

### Campos Específicos para Moeda:
- **Quantidade de Moedas Fornecidas** - Moedas que o jogador receberá
- **Quantidade de Gemas Fornecidas** - Gemas que o jogador receberá

### Configurações:
- **Ativo** - Se o item está disponível na loja
- **Limitado** - Se tem estoque limitado
- **Especial** - Aparece apenas na aba Especiais
- **Rotação Diária** - Se participa da rotação diária

## 📊 Exemplos de Itens de Moeda

### Pacote Básico:
- **Nome:** "Pacote de 500 Moedas"
- **Preço:** $2.99
- **Moedas Fornecidas:** 500
- **Gemas Fornecidas:** 0

### Pacote Premium:
- **Nome:** "Pacote Premium"
- **Preço:** $9.99
- **Moedas Fornecidas:** 2000
- **Gemas Fornecidas:** 50

### Pacote Especial:
- **Nome:** "Pacote de Gemas"
- **Preço:** $4.99
- **Moedas Fornecidas:** 0
- **Gemas Fornecidas:** 100

## 🔒 Segurança

- Apenas administradores podem acessar o painel
- Validação de campos obrigatórios
- Confirmação antes de excluir itens
- Logs de todas as operações

## 🚀 Próximos Passos

1. **Integração com Stripe** para pagamentos reais
2. **Sistema de cupons** e promoções
3. **Relatórios de vendas** detalhados
4. **Sistema de reembolso** automático
5. **Notificações** para compras bem-sucedidas

## 📝 Notas Técnicas

- Os campos `currency_amount_coins` e `currency_amount_gems` são específicos para itens do tipo "currency"
- O sistema suporta múltiplas moedas simultaneamente
- Índices otimizados para consultas frequentes
- Interface responsiva para desktop e mobile
- Validação em tempo real dos campos


