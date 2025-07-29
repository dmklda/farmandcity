-- Inserir exatamente as cartas starter especificadas pelo usuário

-- 1. Limpar cartas existentes (opcional - comentado para segurança)
-- DELETE FROM public.cards WHERE is_starter = true;

-- 2. Inserir cartas starter exatas com quantidades corretas
INSERT INTO public.cards (id, name, type, rarity, effect, is_starter, is_active) 
VALUES 
  -- Farm cards (8 total)
  ('starter-farm-1', 'Pequeno Jardim', 'farm', 'common', 'Produção contínua de comida', true, true),
  ('starter-farm-2', 'Fazenda Simples', 'farm', 'common', 'Produção ativada por dado', true, true),
  ('starter-farm-3', 'Campo de Trigo', 'farm', 'common', 'Produção com dado 1', true, true),
  ('starter-farm-4', 'Rancho de Gado', 'farm', 'common', 'Produção com dado 2', true, true),
  
  -- City cards (6 total)
  ('starter-city-1', 'Barraca', 'city', 'common', 'População inicial', true, true),
  ('starter-city-2', 'Oficina Simples', 'city', 'common', 'Produz material', true, true),
  ('starter-city-3', 'Comércio Simples', 'city', 'common', 'Gera moeda', true, true),
  ('starter-city-4', 'Casa', 'city', 'common', 'População direta', true, true),
  
  -- Action cards (3 total)
  ('starter-action-1', 'Colheita Básica', 'action', 'common', 'Ganho instantâneo de comida', true, true),
  ('starter-action-2', 'Comércio Básico', 'action', 'common', 'Ganho instantâneo de moeda', true, true),
  ('starter-action-3', 'Colheita', 'action', 'common', '2 comida instantâneo', true, true),
  
  -- Defense cards (3 total)
  ('starter-defense-1', 'Muro de Palha', 'defense', 'common', 'Proteção simples por 1 turno', true, true),
  ('starter-defense-2', 'Rede de Defesa', 'defense', 'common', 'Bloqueia carta de evento', true, true),
  
  -- Magic cards (2 total)
  ('starter-magic-1', 'Magia do Crescimento', 'magic', 'common', 'Dobrar comida (efeito básico)', true, true),
  ('starter-magic-2', 'Chama do Trabalho', 'magic', 'common', 'Faz todas cidades produzirem 2x neste turno', true, true),
  
  -- Trap cards (1 total)
  ('starter-trap-1', 'Poço Raso', 'trap', 'common', 'Anula ativação de fazenda do oponente', true, true),
  
  -- Event cards (1 total)
  ('starter-event-1', 'Chuva Leve', 'event', 'common', '+1 comida para todos', true, true),
  
  -- Landmark cards (1 total)
  ('starter-landmark-1', 'Estátua Simples', 'landmark', 'common', '+1 reputação', true, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  rarity = EXCLUDED.rarity,
  effect = EXCLUDED.effect,
  is_starter = EXCLUDED.is_starter,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- 3. Inserir cartas não-starter (para completar o deck)
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

-- 4. Verificar se as cartas foram inseridas corretamente
SELECT 
  type,
  COUNT(*) as total_cards,
  SUM(CASE WHEN is_starter = true THEN 1 ELSE 0 END) as starter_cards
FROM public.cards 
WHERE is_active = true
GROUP BY type
ORDER BY type; 