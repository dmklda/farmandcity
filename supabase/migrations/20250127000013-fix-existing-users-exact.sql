-- Atualizar função para corrigir usuários existentes com quantidades exatas

CREATE OR REPLACE FUNCTION public.fix_user_cards(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  user_id UUID;
  starter_cards_count INTEGER;
  non_starter_cards_count INTEGER;
  all_cards TEXT[] := ARRAY[]::TEXT[];
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
  
  -- 1. Processar cartas starter com quantidades específicas
  INSERT INTO public.player_cards (player_id, card_id, quantity)
  VALUES
    -- Farm cards (8 total)
    (user_id, 'starter-farm-1', 3),  -- Pequeno Jardim
    (user_id, 'starter-farm-2', 2),  -- Fazenda Simples
    (user_id, 'starter-farm-3', 2),  -- Campo de Trigo
    (user_id, 'starter-farm-4', 1),  -- Rancho de Gado
    
    -- City cards (6 total)
    (user_id, 'starter-city-1', 2),  -- Barraca
    (user_id, 'starter-city-2', 2),  -- Oficina Simples
    (user_id, 'starter-city-3', 2),  -- Comércio Simples
    (user_id, 'starter-city-4', 1),  -- Casa
    
    -- Action cards (3 total)
    (user_id, 'starter-action-1', 2),  -- Colheita Básica
    (user_id, 'starter-action-2', 2),  -- Comércio Básico
    (user_id, 'starter-action-3', 1),  -- Colheita
    
    -- Defense cards (3 total)
    (user_id, 'starter-defense-1', 2),  -- Muro de Palha
    (user_id, 'starter-defense-2', 1),  -- Rede de Defesa
    
    -- Magic cards (2 total)
    (user_id, 'starter-magic-1', 1),  -- Magia do Crescimento
    (user_id, 'starter-magic-2', 1),  -- Chama do Trabalho
    
    -- Trap cards (1 total)
    (user_id, 'starter-trap-1', 1),  -- Poço Raso
    
    -- Event cards (1 total)
    (user_id, 'starter-event-1', 1),  -- Chuva Leve
    
    -- Landmark cards (1 total)
    (user_id, 'starter-landmark-1', 1);  -- Estátua Simples
  
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
    SELECT user_id, id, 1
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

-- Comentário atualizado
COMMENT ON FUNCTION public.fix_user_cards(TEXT) IS 'Corrige um usuário específico com cartas starter exatas + 10 adicionais'; 