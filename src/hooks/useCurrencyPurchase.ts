import { useState, useCallback } from 'react';
import { CurrencyService, CurrencyItem, CurrencyPurchase } from '../services/CurrencyService';
import { useAppContext } from '../contexts/AppContext';

export const useCurrencyPurchase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, refreshCurrency } = useAppContext();

  /**
   * Purchase currency with real money (prepared for Stripe)
   */
  const purchaseCurrency = useCallback(async (itemId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Iniciando compra de moeda para item ${itemId}`);

      // Get currency items to find the selected item
      const currencyItems = await CurrencyService.getCurrencyItems();
      const selectedItem = currencyItems.find(item => item.id === itemId);

      if (!selectedItem) {
        throw new Error('Item de moeda não encontrado');
      }

      console.log('Item selecionado:', selectedItem);

      // Create currency purchase record
      const purchase = await CurrencyService.createCurrencyPurchase(
        user.id,
        itemId,
        selectedItem.name,
        selectedItem.amount_coins || 0,
        selectedItem.amount_gems || 0,
        selectedItem.price_dollars
      );

      console.log('Compra de moeda criada:', purchase);

      // TODO: Integrate with Stripe here
      // For now, we'll simulate a successful purchase for testing
      console.log('Simulando pagamento Stripe bem-sucedido...');
      
      // Simulate Stripe payment success
      await CurrencyService.completeCurrencyPurchase(
        purchase.id,
        'simulated_stripe_payment_intent_' + Date.now()
      );

      // Refresh currency in the app context
      await refreshCurrency();

      console.log('Compra de moeda concluída com sucesso');
      
      return {
        success: true,
        purchase,
        message: `Compra realizada com sucesso! ${selectedItem.amount_coins || 0} moedas e ${selectedItem.amount_gems || 0} gemas adicionadas.`
      };

    } catch (err: any) {
      console.error('Erro na compra de moeda:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, refreshCurrency]);

  /**
   * Get currency purchase history
   */
  const getPurchaseHistory = useCallback(async (): Promise<CurrencyPurchase[]> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      return await CurrencyService.getCurrencyPurchaseHistory(user.id);
    } catch (err: any) {
      console.error('Erro ao buscar histórico de compras:', err);
      throw err;
    }
  }, [user]);

  /**
   * Get available currency items
   */
  const getCurrencyItems = useCallback(async (): Promise<CurrencyItem[]> => {
    try {
      return await CurrencyService.getCurrencyItems();
    } catch (err: any) {
      console.error('Erro ao buscar itens de moeda:', err);
      throw err;
    }
  }, []);

  /**
   * Prepare Stripe payment (placeholder for future implementation)
   */
  const prepareStripePayment = useCallback(async (
    amount: number,
    currency: string = 'usd',
    metadata: any = {}
  ) => {
    try {
      return await CurrencyService.createStripePaymentIntent(amount, currency, metadata);
    } catch (err: any) {
      console.error('Erro ao preparar pagamento Stripe:', err);
      throw err;
    }
  }, []);

  /**
   * Validate Stripe payment (placeholder for future implementation)
   */
  const validateStripePayment = useCallback(async (paymentIntentId: string): Promise<boolean> => {
    try {
      return await CurrencyService.validateStripePayment(paymentIntentId);
    } catch (err: any) {
      console.error('Erro ao validar pagamento Stripe:', err);
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    purchaseCurrency,
    getPurchaseHistory,
    getCurrencyItems,
    prepareStripePayment,
    validateStripePayment
  };
}; 