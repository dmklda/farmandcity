-- Dados de exemplo para o sistema de loja
-- ======================================

-- 1. Inserir eventos especiais
INSERT INTO public.shop_events (name, description, event_type, start_date, end_date, discount_percentage, is_active) VALUES
('Black Friday', 'Descontos especiais em toda a loja!', 'sale', '2024-11-29 00:00:00+00', '2024-11-30 23:59:59+00', 30, true),
('Evento de Verão', 'Packs especiais de verão com cartas exclusivas', 'seasonal', '2024-12-01 00:00:00+00', '2024-12-31 23:59:59+00', 20, true),
('Pack Limitado', 'Pack exclusivo por tempo limitado', 'limited', '2024-12-15 00:00:00+00', '2024-12-20 23:59:59+00', 15, true);

-- 2. Inserir itens da loja (packs e boosters)
INSERT INTO public.shop_items (name, description, item_type, price_coins, price_gems, currency_type, rarity, is_active) VALUES
-- Packs básicos
('Pack Iniciante', 'Pack com 3 cartas básicas para iniciantes', 'pack', 50, 0, 'coins', 'common', true),
('Pack Avançado', 'Pack com 3 cartas, garantia de 1 rara', 'pack', 150, 0, 'coins', 'rare', true),
('Pack Expert', 'Pack com 3 cartas, chance de lendária', 'pack', 300, 0, 'coins', 'legendary', true),
('Pack Premium', 'Pack com 3 cartas premium', 'pack', 0, 50, 'gems', 'ultra', true),

-- Boosters
('Booster Comum', 'Booster com 5 cartas comuns', 'booster', 100, 0, 'coins', 'common', true),
('Booster Raro', 'Booster com 5 cartas, 2 raras garantidas', 'booster', 250, 0, 'coins', 'rare', true),
('Booster Lendário', 'Booster com 5 cartas, chance de lendária', 'booster', 500, 0, 'coins', 'legendary', true),
('Booster Premium', 'Booster premium com gems', 'booster', 0, 100, 'gems', 'ultra', true),

-- Moedas
('100 Moedas', 'Pacote de 100 moedas', 'currency', 0, 25, 'gems', 'common', true),
('500 Moedas', 'Pacote de 500 moedas', 'currency', 0, 100, 'gems', 'common', true),
('1000 Moedas', 'Pacote de 1000 moedas', 'currency', 0, 180, 'gems', 'common', true),

-- Gems
('10 Gems', 'Pacote de 10 gems', 'currency', 200, 0, 'coins', 'common', true),
('50 Gems', 'Pacote de 50 gems', 'currency', 900, 0, 'coins', 'common', true),
('100 Gems', 'Pacote de 100 gems', 'currency', 1600, 0, 'coins', 'common', true);

-- 3. Inserir cartas em rotação diária (exemplo para hoje)
INSERT INTO public.daily_rotation_cards (card_id, rotation_date, price_coins, price_gems, currency_type, discount_percentage, is_active) 
SELECT 
  c.id,
  CURRENT_DATE,
  CASE 
    WHEN c.rarity = 'common' THEN 50
    WHEN c.rarity = 'uncommon' THEN 100
    WHEN c.rarity = 'rare' THEN 200
    WHEN c.rarity = 'ultra' THEN 400
    WHEN c.rarity = 'secret' THEN 600
    WHEN c.rarity = 'legendary' THEN 800
    WHEN c.rarity = 'crisis' THEN 1000
    ELSE 100
  END,
  0,
  'coins',
  0,
  true
FROM public.cards c
WHERE c.is_active = true
LIMIT 3;

-- 4. Inserir cartas para amanhã (rotação)
INSERT INTO public.daily_rotation_cards (card_id, rotation_date, price_coins, price_gems, currency_type, discount_percentage, is_active) 
SELECT 
  c.id,
  CURRENT_DATE + INTERVAL '1 day',
  CASE 
    WHEN c.rarity = 'common' THEN 50
    WHEN c.rarity = 'uncommon' THEN 100
    WHEN c.rarity = 'rare' THEN 200
    WHEN c.rarity = 'ultra' THEN 400
    WHEN c.rarity = 'secret' THEN 600
    WHEN c.rarity = 'legendary' THEN 800
    WHEN c.rarity = 'crisis' THEN 1000
    ELSE 100
  END,
  0,
  'coins',
  0,
  true
FROM public.cards c
WHERE c.is_active = true
LIMIT 3; 