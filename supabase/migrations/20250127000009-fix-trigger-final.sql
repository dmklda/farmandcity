-- Versão final e corrigida do trigger para novos usuários

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  starter_cards_count INTEGER;
  non_starter_cards_count INTEGER;
  starter_cards TEXT[] := ARRAY[]::TEXT[];
  additional_cards TEXT[] := ARRAY[]::TEXT[];
  all_cards TEXT[] := ARRAY[]::TEXT[];
  card_id TEXT;
BEGIN
  -- Inserir perfil do usuário
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
  );
  
  -- Verificar quantas cartas starter existem
  SELECT COUNT(*) INTO starter_cards_count
  FROM public.cards 
  WHERE is_starter = true AND is_active = true;
  
  -- Verificar quantas cartas não-starter existem
  SELECT COUNT(*) INTO non_starter_cards_count
  FROM public.cards 
  WHERE is_starter = false AND is_active = true;
  
  -- Se não há cartas suficientes, criar deck vazio
  IF starter_cards_count = 0 THEN
    INSERT INTO public.player_decks (player_id, name, card_ids, is_active, is_starter_deck)
    VALUES (NEW.id, 'Deck Inicial', ARRAY[]::TEXT[], true, true);
    RETURN NEW;
  END IF;
  
  -- 1. Processar cartas starter
  -- Dar cartas starter ao usuário (3 cópias de cada)
  INSERT INTO public.player_cards (player_id, card_id, quantity)
  SELECT NEW.id, id, 3
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
    -- Em caso de erro, criar pelo menos o perfil e um deck vazio
    INSERT INTO public.profiles (user_id, username, display_name)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'username',
      COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
    );
    
    INSERT INTO public.player_decks (player_id, name, card_ids, is_active, is_starter_deck)
    VALUES (NEW.id, 'Deck Inicial', ARRAY[]::TEXT[], true, true);
    
    RETURN NEW;
END;
$$;

-- Garantir que o trigger existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Comentário atualizado
COMMENT ON FUNCTION public.handle_new_user() IS 'Cria perfil, dá cartas starter + adicionais, e cria deck inicial com 38 cartas'; 