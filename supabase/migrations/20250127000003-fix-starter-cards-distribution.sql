-- Corrigir trigger de novo usuário para dar 28 cartas básicas + 10 cartas adicionais
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  starter_card RECORD;
  additional_cards TEXT[] := ARRAY[]::TEXT[];
  all_cards TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Inserir perfil do usuário
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
  );
  
  -- 1. Dar cartas starter básicas (28 cartas)
  -- Cada carta starter recebe múltiplas cópias para chegar a 28 cartas
  FOR starter_card IN 
    SELECT id FROM public.cards WHERE is_starter = true AND is_active = true
  LOOP
    -- Calcular quantas cópias de cada carta starter para chegar a 28 cartas
    -- Se temos 6 cartas starter, cada uma recebe 28/6 ≈ 5 cópias
    INSERT INTO public.player_cards (player_id, card_id, quantity)
    VALUES (NEW.id, starter_card.id, 5); -- 5 cópias de cada carta starter
    
    -- Adicionar ao array de cartas para o deck
    all_cards := array_cat(all_cards, ARRAY[starter_card.id, starter_card.id, starter_card.id, starter_card.id, starter_card.id]);
  END LOOP;
  
  -- 2. Dar 10 cartas adicionais (não-starter, ativas)
  -- Selecionar 10 cartas aleatórias que não são starter
  INSERT INTO public.player_cards (player_id, card_id, quantity)
  SELECT NEW.id, id, 1
  FROM public.cards 
  WHERE is_starter = false AND is_active = true
  ORDER BY random()
  LIMIT 10;
  
  -- Adicionar essas 10 cartas ao array
  SELECT array_agg(id) INTO additional_cards
  FROM (
    SELECT id
    FROM public.cards 
    WHERE is_starter = false AND is_active = true
    ORDER BY random()
    LIMIT 10
  ) AS additional;
  
  all_cards := array_cat(all_cards, additional_cards);
  
  -- 3. Criar deck inicial com todas as cartas (28 + 10 = 38 cartas)
  INSERT INTO public.player_decks (player_id, name, card_ids, is_active, is_starter_deck)
  VALUES (
    NEW.id, 
    'Deck Inicial', 
    all_cards,
    true,
    true
  );
    
  RETURN NEW;
END;
$$;

-- Atualizar função de validação para aceitar 38 cartas no deck inicial
CREATE OR REPLACE FUNCTION public.validate_deck_limits()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verificar se é deck inicial (38 cartas: 28 básicas + 10 adicionais)
  IF NEW.is_starter_deck = true THEN
    IF array_length(NEW.card_ids, 1) != 38 THEN
      RAISE EXCEPTION 'Deck inicial deve ter exatamente 38 cartas (28 básicas + 10 adicionais)';
    END IF;
  ELSE
    -- Decks customizados: 10-28 cartas
    IF array_length(NEW.card_ids, 1) < 10 OR array_length(NEW.card_ids, 1) > 28 THEN
      RAISE EXCEPTION 'Deck customizado deve ter entre 10 e 28 cartas';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Comentários atualizados
COMMENT ON FUNCTION public.handle_new_user() IS 'Cria perfil, dá 28 cartas básicas + 10 adicionais, e cria deck inicial com 38 cartas';
COMMENT ON FUNCTION public.validate_deck_limits() IS 'Valida limites: deck inicial (38 cartas) ou customizado (10-28 cartas)'; 