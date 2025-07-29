-- Adicionar cartas starter que estão faltando
-- Precisamos de 24 cartas starter, atualmente temos 18
-- Vamos adicionar 6 cartas para completar o deck inicial

-- 1. Verificar quantas cartas starter temos atualmente
SELECT 
  'Cartas starter atuais:' as info,
  COUNT(*) as count
FROM public.cards 
WHERE is_starter = true AND is_active = true;

-- 2. Adicionar 6 cartas starter que estão faltando
-- Vamos adicionar mais cartas de cada tipo para completar o deck

-- Mais cartas de Farm (2 adicionais)
INSERT INTO public.cards (
  id, name, type, rarity, effect, is_active, is_starter,
  cost_coins, cost_food, cost_materials, cost_population,
  phase, use_per_turn, is_reactive, limitations, tags
) VALUES 
  (gen_random_uuid(), 'Horta Comunitária', 'farm', 'common', 'Produz 2 comidas por turno e 1 população', true, true, 0, 0, 2, 0, 'action', 1, false, NULL, ARRAY['starter', 'farm', 'food', 'population']),
  (gen_random_uuid(), 'Pomar Simples', 'farm', 'common', 'Produz 1 comida e 1 material por turno', true, true, 0, 0, 1, 0, 'action', 1, false, NULL, ARRAY['starter', 'farm', 'food', 'material']);

-- Mais cartas de City (2 adicionais)
INSERT INTO public.cards (
  id, name, type, rarity, effect, is_active, is_starter,
  cost_coins, cost_food, cost_materials, cost_population,
  phase, use_per_turn, is_reactive, limitations, tags
) VALUES 
  (gen_random_uuid(), 'Mercado Local', 'city', 'common', 'Gera 2 moedas por turno e permite trocas', true, true, 0, 0, 2, 1, 'action', 1, false, NULL, ARRAY['starter', 'city', 'coins', 'trade']),
  (gen_random_uuid(), 'Escola Básica', 'city', 'common', 'Aumenta população máxima em 2', true, true, 1, 0, 1, 0, 'action', 1, false, NULL, ARRAY['starter', 'city', 'population', 'education']);

-- Mais cartas de Action (1 adicional)
INSERT INTO public.cards (
  id, name, type, rarity, effect, is_active, is_starter,
  cost_coins, cost_food, cost_materials, cost_population,
  phase, use_per_turn, is_reactive, limitations, tags
) VALUES 
  (gen_random_uuid(), 'Construção Rápida', 'action', 'common', 'Reduz custo de construção em 1 material', true, true, 0, 0, 0, 0, 'action', 1, false, NULL, ARRAY['starter', 'action', 'construction', 'discount']);

-- Mais carta de Magic (1 adicional)
INSERT INTO public.cards (
  id, name, type, rarity, effect, is_active, is_starter,
  cost_coins, cost_food, cost_materials, cost_population,
  phase, use_per_turn, is_reactive, limitations, tags
) VALUES 
  (gen_random_uuid(), 'Bênção da Terra', 'magic', 'common', 'Duplica produção de comida por 1 turno', true, true, 0, 1, 0, 0, 'action', 1, false, NULL, ARRAY['starter', 'magic', 'food', 'boost']);

-- 3. Verificar se agora temos 24 cartas starter
SELECT 
  'Cartas starter após adição:' as info,
  COUNT(*) as total_starter_cards
FROM public.cards 
WHERE is_starter = true AND is_active = true;

-- 4. Verificar distribuição por tipo
SELECT 
  'Distribuição por tipo:' as info,
  type,
  COUNT(*) as count,
  STRING_AGG(name, ', ') as card_names
FROM public.cards 
WHERE is_starter = true AND is_active = true
GROUP BY type
ORDER BY type;

-- 5. Verificar se temos cartas suficientes para distribuição
SELECT 
  'Verificação final:' as info,
  CASE 
    WHEN (SELECT COUNT(*) FROM public.cards WHERE is_starter = true AND is_active = true) >= 24 
      AND (SELECT COUNT(*) FROM public.cards WHERE is_starter = false AND is_active = true) >= 10
    THEN '✅ Sistema pronto para distribuição de cartas'
    ELSE '❌ Sistema não está pronto - faltam cartas'
  END as status;

-- 6. Comentário sobre a migração
COMMENT ON TABLE public.cards IS 'Sistema completo: 24 cartas starter + cartas não-starter suficientes'; 