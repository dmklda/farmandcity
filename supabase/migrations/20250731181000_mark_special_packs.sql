-- Marcar packs e boosters específicos como especiais
-- ================================================

-- Marcar packs temáticos e especiais como especiais
UPDATE public.shop_items 
SET is_special = true 
WHERE name ILIKE '%temático%' 
   OR name ILIKE '%festival%'
   OR name ILIKE '%crise%'
   OR name ILIKE '%sobrevivência%'
   OR name ILIKE '%coleção completa%'
   OR name ILIKE '%deck completo%'
   OR name ILIKE '%defensor%'
   OR name ILIKE '%lendário%'
   OR name ILIKE '%legendary%'
   OR name ILIKE '%premium%'
   OR name ILIKE '%vip%'
   OR name ILIKE '%exclusivo%'
   OR name ILIKE '%limitado%'
   OR name ILIKE '%mega%'
   OR name ILIKE '%poderosa%'
   OR name ILIKE '%abundante%';

-- Marcar boosters temáticos como especiais
UPDATE public.shop_items 
SET is_special = true 
WHERE item_type = 'booster' 
   AND (name ILIKE '%temático%' 
        OR name ILIKE '%vip%' 
        OR name ILIKE '%crise%'
        OR name ILIKE '%poderosa%'
        OR name ILIKE '%abundante%');

-- Garantir que packs básicos e iniciantes NÃO sejam especiais
UPDATE public.shop_items 
SET is_special = false 
WHERE name ILIKE '%básico%' 
   OR name ILIKE '%iniciante%'
   OR name ILIKE '%diário%'
   OR name ILIKE '%semanal%'
   OR name ILIKE '%rápido%'
   OR name ILIKE '%avançado%';

-- Verificar resultado
SELECT 
  name, 
  item_type, 
  is_special,
  CASE 
    WHEN is_special THEN '✅ ESPECIAL'
    ELSE '❌ NORMAL'
  END as status
FROM shop_items 
WHERE item_type IN ('pack', 'booster')
ORDER BY is_special DESC, name; 