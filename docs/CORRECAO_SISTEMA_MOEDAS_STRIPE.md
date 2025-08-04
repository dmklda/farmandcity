# Correção do Sistema de Moedas e Preparação para Stripe

## Problema Identificado

O usuário reportou que as funções de dedução e adição de gemas e moedas não estavam funcionando corretamente:
- Comprar gemas e moedas não aumentava a quantidade
- Comprar coisas com gemas e moedas não diminuía a quantidade
- Sistema não estava preparado para integração com Stripe para dinheiro real

## Causa Raiz

### Problema 1: Sistema de Moedas Inconsistente

O sistema tinha múltiplas implementações de gerenciamento de moedas:
- `useCurrency.ts` (não utilizado)
- `usePlayerCurrency.ts` (implementação principal)
- Funções diretas no `useShop.ts`

Isso causava inconsistências e bugs na atualização das moedas.

### Problema 2: Itens de Moeda com Preços Incorretos

Os itens de moeda na tabela `shop_items` tinham:
- `price_coins: 0` e `price_gems: 0` (gratuitos)
- `price_dollars` definido mas não utilizado
- Sistema tentava comprar com moedas/gemas em vez de dinheiro real

### Problema 3: Falta de Preparação para Stripe

Não havia:
- Tabela para rastrear compras de moeda
- Sistema de pagamentos com dinheiro real
- Integração preparada para Stripe

## Solução Implementada

### 1. Criação do CurrencyService

**Arquivo:** `src/services/CurrencyService.ts`

Sistema centralizado para gerenciar todas as operações de moeda:

```typescript
export class CurrencyService {
  // Operações básicas de moeda
  static async addCoins(playerId: string, amount: number): Promise<void>
  static async addGems(playerId: string, amount: number): Promise<void>
  static async spendCoins(playerId: string, amount: number): Promise<boolean>
  static async spendGems(playerId: string, amount: number): Promise<boolean>
  
  // Operações de compra de moeda
  static async createCurrencyPurchase(...): Promise<CurrencyPurchase>
  static async completeCurrencyPurchase(...): Promise<void>
  static async getCurrencyPurchaseHistory(...): Promise<CurrencyPurchase[]>
  
  // Preparação para Stripe
  static async createStripePaymentIntent(...): Promise<{ clientSecret: string; paymentIntentId: string }>
  static async validateStripePayment(...): Promise<boolean>
}
```

**Melhorias:**
- Uso de `supabase.sql` para operações atômicas
- Verificação de saldo antes de gastar
- Logs detalhados para debugging
- Tratamento de erros robusto

### 2. Tabela de Compras de Moeda

**Migração:** `create_currency_purchases_table`

```sql
CREATE TABLE currency_purchases (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES auth.users(id),
  item_id UUID REFERENCES shop_items(id),
  item_name TEXT NOT NULL,
  amount_coins INTEGER DEFAULT 0,
  amount_gems INTEGER DEFAULT 0,
  price_dollars DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending',
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

**Políticas RLS:**
- Usuários podem ver/inserir/atualizar suas próprias compras
- Admins podem ver/atualizar todas as compras

### 3. Hook useCurrencyPurchase

**Arquivo:** `src/hooks/useCurrencyPurchase.ts`

Hook especializado para compras de moeda:

```typescript
export const useCurrencyPurchase = () => {
  const purchaseCurrency = async (itemId: string) => {
    // 1. Buscar item de moeda
    // 2. Criar registro de compra
    // 3. Simular pagamento Stripe (placeholder)
    // 4. Completar compra e adicionar moedas
    // 5. Atualizar estado da aplicação
  };
  
  return {
    purchaseCurrency,
    getPurchaseHistory,
    getCurrencyItems,
    prepareStripePayment, // Placeholder
    validateStripePayment  // Placeholder
  };
};
```

### 4. Atualização do usePlayerCurrency

**Arquivo:** `src/hooks/usePlayerCurrency.ts`

Refatorado para usar o CurrencyService:

```typescript
const addCoins = async (amount: number) => {
  if (!currency) return;
  
  try {
    await CurrencyService.addCoins(currency.player_id, amount);
    await fetchPlayerCurrency(); // Refresh automático
  } catch (error) {
    console.error('Error adding coins:', error);
    throw error;
  }
};
```

**Melhorias:**
- Operações atômicas no banco
- Refresh automático após operações
- Tratamento de erros consistente

### 5. Interface de Compra de Moeda

**Arquivo:** `src/components/Shop.tsx`

Nova função `renderCurrencyItem` para itens de moeda:

```typescript
const renderCurrencyItem = (item: any) => {
  const coinAmount = extractCoinAmount(item.name);
  const gemAmount = extractGemAmount(item.name);
  const priceDollars = parseFloat(item.price_dollars || '0');
  
  return (
    <Card>
      {/* Preview visual das moedas/gemas */}
      {/* Preço em dólares */}
      {/* Botão de compra com Stripe */}
    </Card>
  );
};
```

**Características:**
- Preview visual das moedas/gemas
- Preço em dólares (preparado para Stripe)
- Badge "PREMIUM" para diferenciação
- Botão de compra com loading state

## Funcionalidades Implementadas

### ✅ Sistema de Moedas Funcional
- Adição de moedas/gemas funciona corretamente
- Dedução de moedas/gemas funciona corretamente
- Verificação de saldo antes de gastar
- Operações atômicas no banco de dados

### ✅ Compra de Moeda com Dinheiro Real
- Interface preparada para Stripe
- Sistema de preços em dólares
- Registro de compras no banco
- Simulação de pagamento para testes

### ✅ Preparação para Stripe
- Estrutura de dados para pagamentos
- Placeholders para integração Stripe
- Sistema de status de compra
- Rastreamento de payment intents

### ✅ Melhorias na UX
- Loading states durante compras
- Feedback visual de sucesso/erro
- Preview visual das moedas/gemas
- Interface responsiva

## Estrutura para Integração Stripe

### 1. Placeholders Implementados

```typescript
// CurrencyService.ts
static async createStripePaymentIntent(amount: number, currency: string = 'usd', metadata: any = {}) {
  // TODO: Integrar com Stripe
  throw new Error('Stripe integration not yet implemented');
}

static async validateStripePayment(paymentIntentId: string): Promise<boolean> {
  // TODO: Validar com Stripe
  throw new Error('Stripe integration not yet implemented');
}
```

### 2. Fluxo de Compra Preparado

```typescript
// useCurrencyPurchase.ts
const purchaseCurrency = async (itemId: string) => {
  // 1. Criar registro de compra
  const purchase = await CurrencyService.createCurrencyPurchase(...);
  
  // 2. TODO: Criar payment intent com Stripe
  // const { clientSecret, paymentIntentId } = await CurrencyService.createStripePaymentIntent(...);
  
  // 3. TODO: Processar pagamento com Stripe
  // const paymentSuccess = await processStripePayment(clientSecret);
  
  // 4. Completar compra
  await CurrencyService.completeCurrencyPurchase(purchase.id, paymentIntentId);
};
```

### 3. Dados Necessários para Stripe

- `price_dollars` em todos os itens de moeda
- `stripe_payment_intent_id` para rastreamento
- `status` para controle de pagamento
- `metadata` para informações adicionais

## Verificação da Solução

### Teste 1: Operações Básicas de Moeda
1. **Adicionar moedas:** Verificar se o saldo aumenta
2. **Adicionar gemas:** Verificar se o saldo aumenta
3. **Gastar moedas:** Verificar se o saldo diminui
4. **Gastar gemas:** Verificar se o saldo diminui

### Teste 2: Compra de Moeda
1. **Selecionar item de moeda:** Verificar interface
2. **Clicar em comprar:** Verificar simulação
3. **Verificar saldo:** Confirmar que moedas foram adicionadas
4. **Verificar histórico:** Confirmar registro da compra

### Teste 3: Validações
1. **Saldo insuficiente:** Verificar erro ao gastar mais do que tem
2. **Item não encontrado:** Verificar erro para item inválido
3. **Usuário não autenticado:** Verificar erro sem login

## Próximos Passos para Stripe

### 1. Instalação e Configuração
```bash
npm install @stripe/stripe-js
npm install stripe # Para backend
```

### 2. Configuração do Backend
```typescript
// api/stripe/create-payment-intent.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createPaymentIntent(amount: number, metadata: any) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe usa centavos
    currency: 'usd',
    metadata
  });
}
```

### 3. Integração no Frontend
```typescript
// useCurrencyPurchase.ts
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!);

const purchaseCurrency = async (itemId: string) => {
  // 1. Criar payment intent no backend
  const { clientSecret } = await createPaymentIntent(amount, metadata);
  
  // 2. Confirmar pagamento com Stripe
  const { error } = await stripe.confirmCardPayment(clientSecret);
  
  // 3. Completar compra se sucesso
  if (!error) {
    await CurrencyService.completeCurrencyPurchase(purchaseId, paymentIntentId);
  }
};
```

## Impacto

### Positivo
- ✅ Sistema de moedas totalmente funcional
- ✅ Compra de moeda com dinheiro real preparada
- ✅ Estrutura completa para integração Stripe
- ✅ Interface melhorada para compras
- ✅ Rastreamento completo de transações

### Compatibilidade
- ✅ Não afeta compras existentes com moedas/gemas
- ✅ Mantém compatibilidade com sistema atual
- ✅ Preserva dados existentes de usuários

## Arquivos Modificados

1. **`src/services/CurrencyService.ts`** (Novo)
   - Sistema centralizado de moedas
   - Preparação para Stripe

2. **`src/hooks/useCurrencyPurchase.ts`** (Novo)
   - Hook para compras de moeda
   - Integração com CurrencyService

3. **`src/hooks/usePlayerCurrency.ts`**
   - Refatorado para usar CurrencyService
   - Operações atômicas

4. **`src/components/Shop.tsx`**
   - Nova interface para compra de moeda
   - Integração com novo sistema

5. **Banco de Dados**
   - Nova tabela `currency_purchases`
   - Políticas RLS para segurança

## Status

✅ **RESOLVIDO** - Sistema de moedas totalmente funcional e preparado para integração Stripe. 