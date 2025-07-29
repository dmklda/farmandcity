-- Atualizar trigger para trabalhar com UUIDs

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  starter_cards_count INTEGER;
  non_starter_cards_count INTEGER;
  all_cards UUID[] := ARRAY[]::UUID[];
  card_id UUID;
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
    VALUES (NEW.id, 'Deck Inicial', ARRAY[]::UUID[], true, true);
    RETURN NEW;
  END IF;
  
  -- 1. Processar cartas starter com quantidades específicas
  -- Buscar IDs das cartas starter
  DECLARE
    pequeno_jardim_id UUID;
    fazenda_simples_id UUID;
    campo_trigo_id UUID;
    rancho_gado_id UUID;
    barraca_id UUID;
    oficina_simples_id UUID;
    comercio_simples_id UUID;
    casa_id UUID;
    colheita_basica_id UUID;
    comercio_basico_id UUID;
    colheita_id UUID;
    muro_palha_id UUID;
    rede_defesa_id UUID;
    magia_crescimento_id UUID;
    chama_trabalho_id UUID;
    poco_raso_id UUID;
    chuva_leve_id UUID;
    estatua_simples_id UUID;
  BEGIN
    -- Buscar IDs das cartas starter
    SELECT id INTO pequeno_jardim_id FROM public.cards WHERE name = 'Pequeno Jardim' AND is_starter = true;
    SELECT id INTO fazenda_simples_id FROM public.cards WHERE name = 'Fazenda Simples' AND is_starter = true;
    SELECT id INTO campo_trigo_id FROM public.cards WHERE name = 'Campo de Trigo' AND is_starter = true;
    SELECT id INTO rancho_gado_id FROM public.cards WHERE name = 'Rancho de Gado' AND is_starter = true;
    SELECT id INTO barraca_id FROM public.cards WHERE name = 'Barraca' AND is_starter = true;
    SELECT id INTO oficina_simples_id FROM public.cards WHERE name = 'Oficina Simples' AND is_starter = true;
    SELECT id INTO comercio_simples_id FROM public.cards WHERE name = 'Comércio Simples' AND is_starter = true;
    SELECT id INTO casa_id FROM public.cards WHERE name = 'Casa' AND is_starter = true;
    SELECT id INTO colheita_basica_id FROM public.cards WHERE name = 'Colheita Básica' AND is_starter = true;
    SELECT id INTO comercio_basico_id FROM public.cards WHERE name = 'Comércio Básico' AND is_starter = true;
    SELECT id INTO colheita_id FROM public.cards WHERE name = 'Colheita' AND is_starter = true;
    SELECT id INTO muro_palha_id FROM public.cards WHERE name = 'Muro de Palha' AND is_starter = true;
    SELECT id INTO rede_defesa_id FROM public.cards WHERE name = 'Rede de Defesa' AND is_starter = true;
    SELECT id INTO magia_crescimento_id FROM public.cards WHERE name = 'Magia do Crescimento' AND is_starter = true;
    SELECT id INTO chama_trabalho_id FROM public.cards WHERE name = 'Chama do Trabalho' AND is_starter = true;
    SELECT id INTO poco_raso_id FROM public.cards WHERE name = 'Poço Raso' AND is_starter = true;
    SELECT id INTO chuva_leve_id FROM public.cards WHERE name = 'Chuva Leve' AND is_starter = true;
    SELECT id INTO estatua_simples_id FROM public.cards WHERE name = 'Estátua Simples' AND is_starter = true;
    
    -- Inserir cartas starter com quantidades específicas
    INSERT INTO public.player_cards (player_id, card_id, quantity)
    VALUES
      -- Farm cards (8 total)
      (NEW.id, pequeno_jardim_id, 3),  -- Pequeno Jardim
      (NEW.id, fazenda_simples_id, 2),  -- Fazenda Simples
      (NEW.id, campo_trigo_id, 2),  -- Campo de Trigo
      (NEW.id, rancho_gado_id, 1),  -- Rancho de Gado
      
      -- City cards (6 total)
      (NEW.id, barraca_id, 2),  -- Barraca
      (NEW.id, oficina_simples_id, 2),  -- Oficina Simples
      (NEW.id, comercio_simples_id, 2),  -- Comércio Simples
      (NEW.id, casa_id, 1),  -- Casa
      
      -- Action cards (3 total)
      (NEW.id, colheita_basica_id, 2),  -- Colheita Básica
      (NEW.id, comercio_basico_id, 2),  -- Comércio Básico
      (NEW.id, colheita_id, 1),  -- Colheita
      
      -- Defense cards (3 total)
      (NEW.id, muro_palha_id, 2),  -- Muro de Palha
      (NEW.id, rede_defesa_id, 1),  -- Rede de Defesa
      
      -- Magic cards (2 total)
      (NEW.id, magia_crescimento_id, 1),  -- Magia do Crescimento
      (NEW.id, chama_trabalho_id, 1),  -- Chama do Trabalho
      
      -- Trap cards (1 total)
      (NEW.id, poco_raso_id, 1),  -- Poço Raso
      
      -- Event cards (1 total)
      (NEW.id, chuva_leve_id, 1),  -- Chuva Leve
      
      -- Landmark cards (1 total)
      (NEW.id, estatua_simples_id, 1);  -- Estátua Simples
    
    -- 2. Adicionar cartas starter ao deck com quantidades corretas
    -- Farm cards
    all_cards := array_cat(all_cards, ARRAY[pequeno_jardim_id, pequeno_jardim_id, pequeno_jardim_id]);  -- 3x Pequeno Jardim
    all_cards := array_cat(all_cards, ARRAY[fazenda_simples_id, fazenda_simples_id]);  -- 2x Fazenda Simples
    all_cards := array_cat(all_cards, ARRAY[campo_trigo_id, campo_trigo_id]);  -- 2x Campo de Trigo
    all_cards := array_cat(all_cards, ARRAY[rancho_gado_id]);  -- 1x Rancho de Gado
    
    -- City cards
    all_cards := array_cat(all_cards, ARRAY[barraca_id, barraca_id]);  -- 2x Barraca
    all_cards := array_cat(all_cards, ARRAY[oficina_simples_id, oficina_simples_id]);  -- 2x Oficina Simples
    all_cards := array_cat(all_cards, ARRAY[comercio_simples_id, comercio_simples_id]);  -- 2x Comércio Simples
    all_cards := array_cat(all_cards, ARRAY[casa_id]);  -- 1x Casa
    
    -- Action cards
    all_cards := array_cat(all_cards, ARRAY[colheita_basica_id, colheita_basica_id]);  -- 2x Colheita Básica
    all_cards := array_cat(all_cards, ARRAY[comercio_basico_id, comercio_basico_id]);  -- 2x Comércio Básico
    all_cards := array_cat(all_cards, ARRAY[colheita_id]);  -- 1x Colheita
    
    -- Defense cards
    all_cards := array_cat(all_cards, ARRAY[muro_palha_id, muro_palha_id]);  -- 2x Muro de Palha
    all_cards := array_cat(all_cards, ARRAY[rede_defesa_id]);  -- 1x Rede de Defesa
    
    -- Magic cards
    all_cards := array_cat(all_cards, ARRAY[magia_crescimento_id]);  -- 1x Magia do Crescimento
    all_cards := array_cat(all_cards, ARRAY[chama_trabalho_id]);  -- 1x Chama do Trabalho
    
    -- Trap cards
    all_cards := array_cat(all_cards, ARRAY[poco_raso_id]);  -- 1x Poço Raso
    
    -- Event cards
    all_cards := array_cat(all_cards, ARRAY[chuva_leve_id]);  -- 1x Chuva Leve
    
    -- Landmark cards
    all_cards := array_cat(all_cards, ARRAY[estatua_simples_id]);  -- 1x Estátua Simples
  END;
  
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
    SELECT array_cat(all_cards, array_agg(id)) INTO all_cards
    FROM (
      SELECT id
      FROM public.cards 
      WHERE is_starter = false AND is_active = true
      ORDER BY random()
      LIMIT 10
    ) AS additional;
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
    VALUES (NEW.id, 'Deck Inicial', ARRAY[]::UUID[], true, true);
    
    RETURN NEW;
END;
$$;

-- Garantir que o trigger existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Comentário atualizado
COMMENT ON FUNCTION public.handle_new_user() IS 'Cria perfil, dá cartas starter com quantidades exatas + 10 adicionais, e cria deck inicial usando UUIDs'; 