-- Inserir cartas starter que estão faltando

-- 1. Verificar se a tabela cards existe e tem a estrutura correta
DO $$
BEGIN
  -- Garantir que a coluna id é TEXT
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cards' AND column_name = 'id' AND data_type != 'text'
  ) THEN
    ALTER TABLE public.cards ALTER COLUMN id TYPE TEXT;
  END IF;
END $$;

-- 2. Inserir cartas starter (se não existirem)
INSERT INTO public.cards (id, name, type, rarity, effect, is_starter, is_active) 
VALUES 
  ('starter-farm-1', 'Pequeno Jardim', 'farm', 'common', 'Produz 1 comida por turno', true, true),
  ('starter-city-1', 'Barraca', 'city', 'common', 'Aumenta população em 2', true, true),
  ('starter-action-1', 'Colheita Básica', 'action', 'common', 'Ganha 2 moedas', true, true),
  ('starter-farm-2', 'Fazenda Simples', 'farm', 'common', 'Produz 2 comida por turno', true, true),
  ('starter-city-2', 'Oficina Simples', 'city', 'common', 'Aumenta população em 3', true, true),
  ('starter-action-2', 'Comércio Simples', 'action', 'common', 'Ganha 3 moedas', true, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  rarity = EXCLUDED.rarity,
  effect = EXCLUDED.effect,
  is_starter = EXCLUDED.is_starter,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- 3. Inserir cartas não-starter (se não existirem)
INSERT INTO public.cards (id, name, type, rarity, effect, is_starter, is_active) 
VALUES 
  ('rare-farm-1', 'Fazenda Avançada', 'farm', 'rare', 'Produz 3 comida por turno', false, true),
  ('rare-city-1', 'Cidade Próspera', 'city', 'rare', 'Aumenta população em 5', false, true),
  ('rare-action-1', 'Negócio Lucrativo', 'action', 'rare', 'Ganha 5 moedas', false, true),
  ('rare-magic-1', 'Feitiço Poderoso', 'magic', 'rare', 'Efeito mágico avançado', false, true),
  ('rare-defense-1', 'Fortaleza', 'defense', 'rare', 'Proteção avançada', false, true),
  ('rare-event-1', 'Festival Nacional', 'event', 'rare', 'Grande evento', false, true),
  ('uncommon-farm-1', 'Horta Média', 'farm', 'uncommon', 'Produz 2 comida por turno', false, true),
  ('uncommon-city-1', 'Cidade Média', 'city', 'uncommon', 'Aumenta população em 3', false, true),
  ('uncommon-action-1', 'Trabalho Extra', 'action', 'uncommon', 'Ganha 3 moedas', false, true),
  ('uncommon-magic-1', 'Feitiço Médio', 'magic', 'uncommon', 'Efeito mágico médio', false, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  rarity = EXCLUDED.rarity,
  effect = EXCLUDED.effect,
  is_starter = EXCLUDED.is_starter,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- 4. Verificar se as cartas foram inseridas
SELECT 
  'Starter Cards' as category,
  COUNT(*) as count
FROM public.cards 
WHERE is_starter = true AND is_active = true

UNION ALL

SELECT 
  'Non-Starter Cards' as category,
  COUNT(*) as count
FROM public.cards 
WHERE is_starter = false AND is_active = true

UNION ALL

SELECT 
  'Total Active Cards' as category,
  COUNT(*) as count
FROM public.cards 
WHERE is_active = true; 