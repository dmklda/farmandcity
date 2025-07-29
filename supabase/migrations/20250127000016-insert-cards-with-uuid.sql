-- Inserir cartas starter usando UUIDs gerados automaticamente

-- 1. Verificar se a coluna id é UUID
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'cards' AND column_name = 'id';

-- 2. Se a coluna for TEXT, alterar para UUID
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cards' AND column_name = 'id' AND data_type = 'text'
  ) THEN
    ALTER TABLE public.cards ALTER COLUMN id TYPE UUID USING gen_random_uuid();
  END IF;
END $$;

-- 3. Inserir cartas starter usando UUIDs
INSERT INTO public.cards (id, name, type, rarity, effect, is_starter, is_active) 
VALUES 
  -- Farm cards (8 total)
  (gen_random_uuid(), 'Pequeno Jardim', 'farm', 'common', 'Produção contínua de comida', true, true),
  (gen_random_uuid(), 'Fazenda Simples', 'farm', 'common', 'Produção ativada por dado', true, true),
  (gen_random_uuid(), 'Campo de Trigo', 'farm', 'common', 'Produção com dado 1', true, true),
  (gen_random_uuid(), 'Rancho de Gado', 'farm', 'common', 'Produção com dado 2', true, true),
  
  -- City cards (6 total)
  (gen_random_uuid(), 'Barraca', 'city', 'common', 'População inicial', true, true),
  (gen_random_uuid(), 'Oficina Simples', 'city', 'common', 'Produz material', true, true),
  (gen_random_uuid(), 'Comércio Simples', 'city', 'common', 'Gera moeda', true, true),
  (gen_random_uuid(), 'Casa', 'city', 'common', 'População direta', true, true),
  
  -- Action cards (3 total)
  (gen_random_uuid(), 'Colheita Básica', 'action', 'common', 'Ganho instantâneo de comida', true, true),
  (gen_random_uuid(), 'Comércio Básico', 'action', 'common', 'Ganho instantâneo de moeda', true, true),
  (gen_random_uuid(), 'Colheita', 'action', 'common', '2 comida instantâneo', true, true),
  
  -- Defense cards (3 total)
  (gen_random_uuid(), 'Muro de Palha', 'defense', 'common', 'Proteção simples por 1 turno', true, true),
  (gen_random_uuid(), 'Rede de Defesa', 'defense', 'common', 'Bloqueia carta de evento', true, true),
  
  -- Magic cards (2 total)
  (gen_random_uuid(), 'Magia do Crescimento', 'magic', 'common', 'Dobrar comida (efeito básico)', true, true),
  (gen_random_uuid(), 'Chama do Trabalho', 'magic', 'common', 'Faz todas cidades produzirem 2x neste turno', true, true),
  
  -- Trap cards (1 total)
  (gen_random_uuid(), 'Poço Raso', 'trap', 'common', 'Anula ativação de fazenda do oponente', true, true),
  
  -- Event cards (1 total)
  (gen_random_uuid(), 'Chuva Leve', 'event', 'common', '+1 comida para todos', true, true),
  
  -- Landmark cards (1 total)
  (gen_random_uuid(), 'Estátua Simples', 'landmark', 'common', '+1 reputação', true, true);

-- 4. Inserir cartas não-starter usando UUIDs
INSERT INTO public.cards (id, name, type, rarity, effect, is_starter, is_active) 
VALUES 
  (gen_random_uuid(), 'Fazenda Avançada', 'farm', 'rare', 'Produz 3 comida por turno', false, true),
  (gen_random_uuid(), 'Cidade Próspera', 'city', 'rare', 'Aumenta população em 5', false, true),
  (gen_random_uuid(), 'Negócio Lucrativo', 'action', 'rare', 'Ganha 5 moedas', false, true),
  (gen_random_uuid(), 'Feitiço Poderoso', 'magic', 'rare', 'Efeito mágico avançado', false, true),
  (gen_random_uuid(), 'Fortaleza', 'defense', 'rare', 'Proteção avançada', false, true),
  (gen_random_uuid(), 'Festival Nacional', 'event', 'rare', 'Grande evento', false, true),
  (gen_random_uuid(), 'Horta Média', 'farm', 'uncommon', 'Produz 2 comida por turno', false, true),
  (gen_random_uuid(), 'Cidade Média', 'city', 'uncommon', 'Aumenta população em 3', false, true),
  (gen_random_uuid(), 'Trabalho Extra', 'action', 'uncommon', 'Ganha 3 moedas', false, true),
  (gen_random_uuid(), 'Feitiço Médio', 'magic', 'uncommon', 'Efeito mágico médio', false, true);

-- 5. Verificar se as cartas foram inseridas corretamente
SELECT 
  type,
  COUNT(*) as total_cards,
  SUM(CASE WHEN is_starter = true THEN 1 ELSE 0 END) as starter_cards
FROM public.cards 
WHERE is_active = true
GROUP BY type
ORDER BY type;

-- 6. Verificar total de cartas
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