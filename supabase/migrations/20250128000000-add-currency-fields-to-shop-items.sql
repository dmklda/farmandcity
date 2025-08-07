-- Adicionar campos específicos para itens de moeda
ALTER TABLE public.shop_items 
ADD COLUMN IF NOT EXISTS currency_amount_coins INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency_amount_gems INTEGER DEFAULT 0;

-- Adicionar comentários para documentar os novos campos
COMMENT ON COLUMN public.shop_items.currency_amount_coins IS 'Quantidade de moedas que o item de moeda fornece ao jogador';
COMMENT ON COLUMN public.shop_items.currency_amount_gems IS 'Quantidade de gemas que o item de moeda fornece ao jogador';

-- Criar índices para melhorar performance em consultas de itens de moeda
CREATE INDEX IF NOT EXISTS idx_shop_items_currency_type ON public.shop_items(item_type) WHERE item_type = 'currency';
CREATE INDEX IF NOT EXISTS idx_shop_items_active ON public.shop_items(is_active) WHERE is_active = true;
