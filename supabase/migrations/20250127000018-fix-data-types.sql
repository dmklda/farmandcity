-- Corrigir tipos de dados para UUIDs
-- Esta migração corrige os problemas de incompatibilidade de tipos

-- 1. Limpar dados corrompidos primeiro
DELETE FROM public.player_cards;
DELETE FROM public.player_decks;

-- 2. Alterar tipo da coluna card_id em player_cards
ALTER TABLE public.player_cards ALTER COLUMN card_id TYPE UUID USING gen_random_uuid();

-- 3. Alterar tipo da coluna card_ids em player_decks
ALTER TABLE public.player_decks ALTER COLUMN card_ids TYPE UUID[] USING ARRAY[]::UUID[];

-- 4. Verificar se as alterações foram aplicadas
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name IN ('player_cards', 'player_decks')
  AND column_name IN ('card_id', 'card_ids')
ORDER BY table_name, column_name;

-- 5. Verificar se as tabelas estão vazias (prontas para novos dados)
SELECT 
  'player_cards' as table_name,
  COUNT(*) as row_count
FROM public.player_cards

UNION ALL

SELECT 
  'player_decks' as table_name,
  COUNT(*) as row_count
FROM public.player_decks;

-- 6. Comentário sobre a migração
COMMENT ON TABLE public.player_cards IS 'Tabela corrigida: card_id agora é UUID';
COMMENT ON TABLE public.player_decks IS 'Tabela corrigida: card_ids agora é UUID[]'; 