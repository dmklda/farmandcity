-- Corrigir IDs das cartas para usar UUIDs válidos

-- 1. Alterar a coluna id da tabela cards para TEXT (se for UUID)
ALTER TABLE public.cards 
ALTER COLUMN id TYPE TEXT;

-- 2. Inserir cartas starter com IDs válidos
INSERT INTO public.cards (id, name, type, rarity, effect, is_starter, is_active) 
VALUES 
  ('starter-farm-1', 'Pequeno Jardim', 'farm', 'common', 'Produz 1 comida por turno', true, true),
  ('starter-city-1', 'Vila Simples', 'city', 'common', 'Aumenta população em 2', true, true),
  ('starter-action-1', 'Trabalho Básico', 'action', 'common', 'Ganha 2 moedas', true, true),
  ('starter-magic-1', 'Feitiço Menor', 'magic', 'common', 'Efeito mágico básico', true, true),
  ('starter-defense-1', 'Escudo Simples', 'defense', 'common', 'Proteção básica', true, true),
  ('starter-event-1', 'Festival Local', 'event', 'common', 'Evento comunitário', true, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Inserir cartas não-starter com IDs válidos
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
ON CONFLICT (id) DO NOTHING;

-- 4. Verificar se as cartas foram inseridas
SELECT 
  id, 
  name, 
  type, 
  rarity, 
  is_starter, 
  is_active 
FROM public.cards 
ORDER BY is_starter DESC, name; 