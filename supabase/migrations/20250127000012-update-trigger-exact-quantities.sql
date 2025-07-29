-- Atualizar trigger para distribuir cartas com quantidades exatas

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  starter_cards_count INTEGER;
  non_starter_cards_count INTEGER;
  all_cards TEXT[] := ARRAY[]::TEXT[];
  card_id TEXT;
  card_quantity INTEGER;
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
  
  -- Se não há cartas starter, criar deck vazio
  IF starter_cards_count = 0 THEN
    INSERT INTO public.player_decks (player_id, name, card_ids, is_active, is_starter_deck)
    VALUES (NEW.id, 'Deck Inicial', ARRAY[]::TEXT[], true, true);
    RETURN NEW;
  END IF;
  
  -- 1. Processar cartas starter com quantidades específicas
  -- Definir quantidades baseadas na lista do usuário
  INSERT INTO public.player_cards (player_id, card_id, quantity)
  VALUES
    -- Farm cards (8 total)
    (NEW.id, 'starter-farm-1', 3),  -- Pequeno Jardim
    (NEW.id, 'starter-farm-2', 2),  -- Fazenda Simples
    (NEW.id, 'starter-farm-3', 2),  -- Campo de Trigo
    (NEW.id, 'starter-farm-4', 1),  -- Rancho de Gado
    
    -- City cards (6 total)
    (NEW.id, 'starter-city-1', 2),  -- Barraca
    (NEW.id, 'starter-city-2', 2),  -- Oficina Simples
    (NEW.id, 'starter-city-3', 2),  -- Comércio Simples
    (NEW.id, 'starter-city-4', 1),  -- Casa
    
    -- Action cards (3 total)
    (NEW.id, 'starter-action-1', 2),  -- Colheita Básica
    (NEW.id, 'starter-action-2', 2),  -- Comércio Básico
    (NEW.id, 'starter-action-3', 1),  -- Colheita
    
    -- Defense cards (3 total)
    (NEW.id, 'starter-defense-1', 2),  -- Muro de Palha
    (NEW.id, 'starter-defense-2', 1),  -- Rede de Defesa
    
    -- Magic cards (2 total)
    (NEW.id, 'starter-magic-1', 1),  -- Magia do Crescimento
    (NEW.id, 'starter-magic-2', 1),  -- Chama do Trabalho
    
    -- Trap cards (1 total)
    (NEW.id, 'starter-trap-1', 1),  -- Poço Raso
    
    -- Event cards (1 total)
    (NEW.id, 'starter-event-1', 1),  -- Chuva Leve
    
    -- Landmark cards (1 total)
    (NEW.id, 'starter-landmark-1', 1);  -- Estátua Simples
  
  -- 2. Adicionar cartas starter ao deck com quantidades corretas
  -- Farm cards
  all_cards := array_cat(all_cards, ARRAY['starter-farm-1', 'starter-farm-1', 'starter-farm-1']);  -- 3x Pequeno Jardim
  all_cards := array_cat(all_cards, ARRAY['starter-farm-2', 'starter-farm-2']);  -- 2x Fazenda Simples
  all_cards := array_cat(all_cards, ARRAY['starter-farm-3', 'starter-farm-3']);  -- 2x Campo de Trigo
  all_cards := array_cat(all_cards, ARRAY['starter-farm-4']);  -- 1x Rancho de Gado
  
  -- City cards
  all_cards := array_cat(all_cards, ARRAY['starter-city-1', 'starter-city-1']);  -- 2x Barraca
  all_cards := array_cat(all_cards, ARRAY['starter-city-2', 'starter-city-2']);  -- 2x Oficina Simples
  all_cards := array_cat(all_cards, ARRAY['starter-city-3', 'starter-city-3']);  -- 2x Comércio Simples
  all_cards := array_cat(all_cards, ARRAY['starter-city-4']);  -- 1x Casa
  
  -- Action cards
  all_cards := array_cat(all_cards, ARRAY['starter-action-1', 'starter-action-1']);  -- 2x Colheita Básica
  all_cards := array_cat(all_cards, ARRAY['starter-action-2', 'starter-action-2']);  -- 2x Comércio Básico
  all_cards := array_cat(all_cards, ARRAY['starter-action-3']);  -- 1x Colheita
  
  -- Defense cards
  all_cards := array_cat(all_cards, ARRAY['starter-defense-1', 'starter-defense-1']);  -- 2x Muro de Palha
  all_cards := array_cat(all_cards, ARRAY['starter-defense-2']);  -- 1x Rede de Defesa
  
  -- Magic cards
  all_cards := array_cat(all_cards, ARRAY['starter-magic-1']);  -- 1x Magia do Crescimento
  all_cards := array_cat(all_cards, ARRAY['starter-magic-2']);  -- 1x Chama do Trabalho
  
  -- Trap cards
  all_cards := array_cat(all_cards, ARRAY['starter-trap-1']);  -- 1x Poço Raso
  
  -- Event cards
  all_cards := array_cat(all_cards, ARRAY['starter-event-1']);  -- 1x Chuva Leve
  
  -- Landmark cards
  all_cards := array_cat(all_cards, ARRAY['starter-landmark-1']);  -- 1x Estátua Simples
  
  -- 3. Processar cartas adicionais (se existirem)
  IF non_starter_cards_count > 0 THEN
    -- Dar 10 cartas adicionais ao usuário
    INSERT INTO public.player_cards (player_id, card_id, quantity)
    SELECT NEW.id, id, 1
    FROM public.cards 
    WHERE is_starter = false AND is_active = true
    ORDER BY random()
    LIMIT 10;
    
    -- Adicionar cartas adicionais ao deck
    SELECT array_agg(id) INTO all_cards
    FROM (
      SELECT all_cards
      UNION ALL
      SELECT id
      FROM public.cards 
      WHERE is_starter = false AND is_active = true
      ORDER BY random()
      LIMIT 10
    ) AS combined;
  END IF;
  
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
COMMENT ON FUNCTION public.handle_new_user() IS 'Cria perfil, dá cartas starter com quantidades exatas + 10 adicionais, e cria deck inicial'; 