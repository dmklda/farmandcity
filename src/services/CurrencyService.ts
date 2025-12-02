// @ts-nocheck
import { supabase } from '../integrations/supabase/client';

export interface CurrencyPurchase {
  id: string;
  player_id: string;
  item_id: string;
  item_name: string;
  amount_coins?: number;
  amount_gems?: number;
  price_dollars: number;
  stripe_payment_intent_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  purchased_at: string;
  completed_at?: string;
}

export interface CurrencyItem {
  id: string;
  name: string;
  description: string;
  amount_coins?: number;
  amount_gems?: number;
  price_dollars: number;
  currency_type: 'coins' | 'gems' | 'both';
  rarity: string;
  is_active: boolean;
}

export class CurrencyService {
  /**
   * Get all available currency items for purchase
   */
  static async getCurrencyItems(): Promise<CurrencyItem[]> {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('item_type', 'currency')
        .eq('is_active', true)
        .order('price_dollars', { ascending: true });

      if (error) throw error;

             return data?.map(item => ({
         id: item.id,
         name: item.name,
         description: item.description,
         amount_coins: this.extractCoinAmount(item.description || item.name),
         amount_gems: this.extractGemAmount(item.description || item.name),
         price_dollars: parseFloat(item.price_dollars || '0'),
         currency_type: item.currency_type,
         rarity: item.rarity,
         is_active: item.is_active
       })) || [];
    } catch (error) {
      console.error('Error fetching currency items:', error);
      throw error;
    }
  }

  /**
   * Get current player currency
   */
  static async getPlayerCurrency(playerId: string) {
    try {
      const { data, error } = await supabase
        .from('player_currency')
        .select('*')
        .eq('player_id', playerId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching player currency:', error);
      throw error;
    }
  }

  /**
   * Add coins to player
   */
  static async addCoins(playerId: string, amount: number): Promise<void> {
    try {
      console.log(`Adding ${amount} coins to player ${playerId}`);
      
      // First get current balance
      const { data: currentData, error: fetchError } = await supabase
        .from('player_currency')
        .select('coins')
        .eq('player_id', playerId)
        .single();

      if (fetchError) throw fetchError;
      
      const newBalance = (currentData.coins || 0) + amount;
      
      // Update with new balance
      const { data, error } = await supabase
        .from('player_currency')
        .update({ 
          coins: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('player_id', playerId)
        .select()
        .single();

      if (error) throw error;
      
      console.log(`Successfully added ${amount} coins. New balance: ${data.coins}`);
    } catch (error) {
      console.error('Error adding coins:', error);
      throw error;
    }
  }

  /**
   * Add gems to player
   */
  static async addGems(playerId: string, amount: number): Promise<void> {
    try {
      console.log(`Adding ${amount} gems to player ${playerId}`);
      
      // First get current balance
      const { data: currentData, error: fetchError } = await supabase
        .from('player_currency')
        .select('gems')
        .eq('player_id', playerId)
        .single();

      if (fetchError) throw fetchError;
      
      const newBalance = (currentData.gems || 0) + amount;
      
      // Update with new balance
      const { data, error } = await supabase
        .from('player_currency')
        .update({ 
          gems: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('player_id', playerId)
        .select()
        .single();

      if (error) throw error;
      
      console.log(`Successfully added ${amount} gems. New balance: ${data.gems}`);
    } catch (error) {
      console.error('Error adding gems:', error);
      throw error;
    }
  }

  /**
   * Spend coins from player
   */
  static async spendCoins(playerId: string, amount: number): Promise<boolean> {
    try {
      console.log(`Attempting to spend ${amount} coins from player ${playerId}`);
      
      // First check if player has enough coins
      const currentCurrency = await this.getPlayerCurrency(playerId);
      if ((currentCurrency.coins || 0) < amount) {
        console.log(`Insufficient coins. Required: ${amount}, Available: ${currentCurrency.coins}`);
        return false;
      }

      const newBalance = (currentCurrency.coins || 0) - amount;
      
      const { data, error } = await supabase
        .from('player_currency')
        .update({ 
          coins: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('player_id', playerId)
        .select()
        .single();

      if (error) throw error;
      
      console.log(`Successfully spent ${amount} coins. New balance: ${data.coins}`);
      return true;
    } catch (error) {
      console.error('Error spending coins:', error);
      throw error;
    }
  }

  /**
   * Spend gems from player
   */
  static async spendGems(playerId: string, amount: number): Promise<boolean> {
    try {
      console.log(`Attempting to spend ${amount} gems from player ${playerId}`);
      
      // First check if player has enough gems
      const currentCurrency = await this.getPlayerCurrency(playerId);
      if ((currentCurrency.gems || 0) < amount) {
        console.log(`Insufficient gems. Required: ${amount}, Available: ${currentCurrency.gems}`);
        return false;
      }

      const newBalance = (currentCurrency.gems || 0) - amount;
      
      const { data, error } = await supabase
        .from('player_currency')
        .update({ 
          gems: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('player_id', playerId)
        .select()
        .single();

      if (error) throw error;
      
      console.log(`Successfully spent ${amount} gems. New balance: ${data.gems}`);
      return true;
    } catch (error) {
      console.error('Error spending gems:', error);
      throw error;
    }
  }

  /**
   * Create a currency purchase record (for Stripe integration)
   */
  static async createCurrencyPurchase(
    playerId: string, 
    itemId: string, 
    itemName: string,
    amountCoins: number,
    amountGems: number,
    priceDollars: number,
    stripePaymentIntentId?: string
  ): Promise<CurrencyPurchase> {
    try {
      const purchaseData = {
        player_id: playerId,
        item_id: itemId,
        item_name: itemName,
        amount_coins: amountCoins,
        amount_gems: amountGems,
        price_dollars: priceDollars,
        stripe_payment_intent_id: stripePaymentIntentId,
        status: 'pending',
        purchased_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('currency_purchases')
        .insert(purchaseData)
        .select()
        .single();

      if (error) throw error;
      
      console.log('Currency purchase created:', data);
      return data;
    } catch (error) {
      console.error('Error creating currency purchase:', error);
      throw error;
    }
  }

  /**
   * Complete a currency purchase (after successful Stripe payment)
   */
  static async completeCurrencyPurchase(
    purchaseId: string,
    stripePaymentIntentId: string
  ): Promise<void> {
    try {
      console.log(`Completing currency purchase ${purchaseId} with Stripe payment ${stripePaymentIntentId}`);
      
      // Update purchase status
      const { data: purchase, error: purchaseError } = await supabase
        .from('currency_purchases')
        .update({
          status: 'completed',
          stripe_payment_intent_id: stripePaymentIntentId,
          completed_at: new Date().toISOString()
        })
        .eq('id', purchaseId)
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Add currency to player
      if (purchase.amount_coins && purchase.amount_coins > 0) {
        await this.addCoins(purchase.player_id, purchase.amount_coins);
      }
      
      if (purchase.amount_gems && purchase.amount_gems > 0) {
        await this.addGems(purchase.player_id, purchase.amount_gems);
      }

      console.log(`Currency purchase ${purchaseId} completed successfully`);
    } catch (error) {
      console.error('Error completing currency purchase:', error);
      throw error;
    }
  }

  /**
   * Get currency purchase history for a player
   */
  static async getCurrencyPurchaseHistory(playerId: string): Promise<CurrencyPurchase[]> {
    try {
      const { data, error } = await supabase
        .from('currency_purchases')
        .select('*')
        .eq('player_id', playerId)
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching currency purchase history:', error);
      throw error;
    }
  }

  /**
   * Extract coin amount from item name or description
   */
  private static extractCoinAmount(text: string): number {
    // Try multiple patterns for Portuguese text
    const patterns = [
      /(\d+)\s*moedas?/i,
      /(\d+)\s*Moedas?/i,
      /(\d+)\s*coins?/i,
      /(\d+)\s*Coins?/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseInt(match[1]);
      }
    }
    return 0;
  }

  /**
   * Extract gem amount from item name or description
   */
  private static extractGemAmount(text: string): number {
    // Try multiple patterns for Portuguese text
    const patterns = [
      /(\d+)\s*gems?/i,
      /(\d+)\s*Gems?/i,
      /(\d+)\s*gemas?/i,
      /(\d+)\s*Gemas?/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseInt(match[1]);
      }
    }
    return 0;
  }

  /**
   * Prepare Stripe payment intent (placeholder for future implementation)
   */
  static async createStripePaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata: any = {}
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    // This is a placeholder for Stripe integration
    // In the future, this will call your backend API to create a Stripe payment intent
    throw new Error('Stripe integration not yet implemented');
  }

  /**
   * Validate Stripe payment (placeholder for future implementation)
   */
  static async validateStripePayment(paymentIntentId: string): Promise<boolean> {
    // This is a placeholder for Stripe integration
    // In the future, this will validate the payment with Stripe
    throw new Error('Stripe integration not yet implemented');
  }
} 