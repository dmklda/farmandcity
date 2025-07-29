-- Corrigir usuários existentes que não receberam cartas

-- 1. Verificar usuários sem cartas
WITH users_without_cards AS (
  SELECT 
    u.id as user_id,
    u.email,
    u.created_at
  FROM auth.users u
  LEFT JOIN public.player_cards pc ON u.id = pc.player_id
  WHERE pc.player_id IS NULL
  ORDER BY u.created_at DESC
)
SELECT 
  'Users without cards' as status,
  COUNT(*) as count
FROM users_without_cards;

-- 2. Verificar usuários sem decks
WITH users_without_decks AS (
  SELECT 
    u.id as user_id,
    u.email,
    u.created_at
  FROM auth.users u
  LEFT JOIN public.player_decks pd ON u.id = pd.player_id
  WHERE pd.player_id IS NULL
  ORDER BY u.created_at DESC
)
SELECT 
  'Users without decks' as status,
  COUNT(*) as count
FROM users_without_decks;

-- 3. Função para corrigir um usuário específico
CREATE OR REPLACE FUNCTION public.fix_user_cards(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  user_id UUID;
  starter_cards_count INTEGER;
  non_starter_cards_count INTEGER;
  starter_cards TEXT[] := ARRAY[]::TEXT[];
  additional_cards TEXT[] := ARRAY[]::TEXT[];
  all_cards TEXT[] := ARRAY[]::TEXT[];
  card_id TEXT;
BEGIN
  -- Buscar ID do usuário
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN 'Usuário não encontrado: ' || user_email;
  END IF;
  
  -- Verificar se já tem cartas
  IF EXISTS (SELECT 1 FROM public.player_cards WHERE player_id = user_id) THEN
    RETURN 'Usuário já tem cartas: ' || user_email;
  END IF;
  
  -- Verificar quantas cartas starter existem
  SELECT COUNT(*) INTO starter_cards_count
  FROM public.cards 
  WHERE is_starter = true AND is_active = true;
  
  -- Verificar quantas cartas não-starter existem
  SELECT COUNT(*) INTO non_starter_cards_count
  FROM public.cards 
  WHERE is_starter = false AND is_active = true;
  
  -- Se não há cartas starter, retornar erro
  IF starter_cards_count = 0 THEN
    RETURN 'Nenhuma carta starter encontrada no banco';
  END IF;
  
  -- 1. Processar cartas starter
  -- Dar cartas starter ao usuário (3 cópias de cada)
  INSERT INTO public.player_cards (player_id, card_id, quantity)
  SELECT user_id, id, 3
  FROM public.cards 
  WHERE is_starter = true AND is_active = true;
  
  -- Adicionar cartas starter ao deck (múltiplas cópias para chegar a 28)
  FOR card_id IN 
    SELECT id FROM public.cards WHERE is_starter = true AND is_active = true
  LOOP
    -- Adicionar 5 cópias de cada carta starter (6 cartas × 5 = 30 cartas)
    starter_cards := array_cat(starter_cards, ARRAY[card_id, card_id, card_id, card_id, card_id]);
  END LOOP;
  
  -- 2. Processar cartas adicionais (se existirem)
  IF non_starter_cards_count > 0 THEN
    -- Dar 10 cartas adicionais ao usuário
    INSERT INTO public.player_cards (player_id, card_id, quantity)
    SELECT user_id, id, 1
    FROM public.cards 
    WHERE is_starter = false AND is_active = true
    ORDER BY random()
    LIMIT 10;
    
    -- Adicionar cartas adicionais ao deck
    SELECT array_agg(id) INTO additional_cards
    FROM (
      SELECT id
      FROM public.cards 
      WHERE is_starter = false AND is_active = true
      ORDER BY random()
      LIMIT 10
    ) AS additional;
  END IF;
  
  -- 3. Combinar todas as cartas
  all_cards := array_cat(starter_cards, additional_cards);
  
  -- 4. Criar deck inicial (se não existir)
  INSERT INTO public.player_decks (player_id, name, card_ids, is_active, is_starter_deck)
  VALUES (
    user_id, 
    'Deck Inicial', 
    all_cards,
    true,
    true
  )
  ON CONFLICT (player_id) DO UPDATE SET
    card_ids = EXCLUDED.card_ids,
    updated_at = now();
  
  RETURN 'Usuário corrigido com sucesso: ' || user_email || ' - ' || array_length(all_cards, 1) || ' cartas';
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'Erro ao corrigir usuário: ' || user_email || ' - ' || SQLERRM;
END;
$$;

-- 4. Comentário
COMMENT ON FUNCTION public.fix_user_cards(TEXT) IS 'Corrige um usuário específico que não recebeu cartas'; 