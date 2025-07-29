-- Versão simplificada e robusta do trigger de novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  starter_count INTEGER;
  non_starter_count INTEGER;
  starter_cards TEXT[] := ARRAY[]::TEXT[];
  additional_cards TEXT[] := ARRAY[]::TEXT[];
  all_cards TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Verificar se há cartas starter disponíveis
  SELECT COUNT(*) INTO starter_count
  FROM public.cards 
  WHERE is_starter = true AND is_active = true;
  
  -- Verificar se há cartas não-starter disponíveis
  SELECT COUNT(*) INTO non_starter_count
  FROM public.cards 
  WHERE is_starter = false AND is_active = true;
  
  -- Se não há cartas suficientes, criar um deck mínimo
  IF starter_count = 0 AND non_starter_count = 0 THEN
    -- Criar apenas o perfil e um deck vazio
    INSERT INTO public.profiles (user_id, username, display_name)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'username',
      COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
    );
    
    INSERT INTO public.player_decks (player_id, name, card_ids, is_active, is_starter_deck)
    VALUES (NEW.id, 'Deck Inicial', ARRAY[]::TEXT[], true, true);
    
    RETURN NEW;
  END IF;
  
  -- Inserir perfil do usuário
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
  );
  
  -- 1. Processar cartas starter (se existirem)
  IF starter_count > 0 THEN
    -- Dar cartas starter ao usuário
    INSERT INTO public.player_cards (player_id, card_id, quantity)
    SELECT NEW.id, id, 3  -- 3 cópias de cada carta starter
    FROM public.cards 
    WHERE is_starter = true AND is_active = true;
    
    -- Adicionar cartas starter ao deck (múltiplas cópias para chegar a 28)
    SELECT array_agg(id) INTO starter_cards
    FROM (
      SELECT id FROM public.cards 
      WHERE is_starter = true AND is_active = true
      UNION ALL
      SELECT id FROM public.cards 
      WHERE is_starter = true AND is_active = true
      UNION ALL
      SELECT id FROM public.cards 
      WHERE is_starter = true AND is_active = true
      UNION ALL
      SELECT id FROM public.cards 
      WHERE is_starter = true AND is_active = true
      UNION ALL
      SELECT id FROM public.cards 
      WHERE is_starter = true AND is_active = true
      LIMIT 28
    ) AS starter_duplicates;
  END IF;
  
  -- 2. Processar cartas adicionais (se existirem)
  IF non_starter_count > 0 THEN
    -- Dar 10 cartas adicionais ao usuário
    INSERT INTO public.player_cards (player_id, card_id, quantity)
    SELECT NEW.id, id, 1
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
  
  -- 4. Criar deck inicial
  INSERT INTO public.player_decks (player_id, name, card_ids, is_active, is_starter_deck)
  VALUES (
    NEW.id, 
    'Deck Inicial', 
    all_cards,
    true,
    true
  );
    
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Em caso de erro, criar pelo menos o perfil
    INSERT INTO public.profiles (user_id, username, display_name)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'username',
      COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
    );
    
    -- E um deck vazio
    INSERT INTO public.player_decks (player_id, name, card_ids, is_active, is_starter_deck)
    VALUES (NEW.id, 'Deck Inicial', ARRAY[]::TEXT[], true, true);
    
    RETURN NEW;
END;
$$;

-- Comentário atualizado
COMMENT ON FUNCTION public.handle_new_user() IS 'Cria perfil e deck inicial com cartas disponíveis, com tratamento de erro robusto'; 