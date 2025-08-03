-- Adicionar campo is_special à tabela shop_items
-- =============================================

-- Adicionar coluna is_special
ALTER TABLE public.shop_items 
ADD COLUMN is_special BOOLEAN DEFAULT false;

-- Adicionar comentário explicativo
COMMENT ON COLUMN public.shop_items.is_special IS 'Indica se o item é um pack/booster especial que deve aparecer apenas na aba Especiais';

-- Criar índice para melhor performance nas consultas filtradas
CREATE INDEX idx_shop_items_is_special ON public.shop_items(is_special);

-- Atualizar alguns itens existentes para serem especiais (exemplo)
UPDATE public.shop_items 
SET is_special = true 
WHERE name ILIKE '%especial%' 
   OR name ILIKE '%premium%' 
   OR name ILIKE '%lendário%' 
   OR name ILIKE '%exclusivo%'; 