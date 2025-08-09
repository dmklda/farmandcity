-- Corrigir pacote iniciante: adicionar 2 landmarks adicionais e remover trap
-- Total: 28 cartas starter + 10 cartas adicionais = 38 cartas

-- 1. Remover carta trap do starter deck
UPDATE public.cards 
SET is_starter = false, is_active = false
WHERE id = 'starter-trap-1' AND name = 'Poço Raso';

-- 2. Adicionar 2 landmarks adicionais ao starter deck
INSERT INTO public.cards (id, name, type, rarity, effect, is_starter, is_active) 
VALUES 
  ('starter-landmark-2', 'Torre de Vigia', 'landmark', 'common', '+2 população e +1 defesa', true, true),
  ('starter-landmark-3', 'Fonte da Prosperidade', 'landmark', 'common', '+1 comida e +1 moeda por turno', true, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  rarity = EXCLUDED.rarity,
  effect = EXCLUDED.effect,
  is_starter = EXCLUDED.is_starter,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- 3. Atualizar trigger para novos usuários com 3 landmarks e sem traps
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
  
  -- 1. Inserir cartas starter com quantidades específicas (SEM TRAPS)
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
    
    -- Event cards (1 total)
    (NEW.id, 'starter-event-1', 1),  -- Chuva Leve
    
    -- Landmark cards (3 total) - AGORA COM 3 LANDMARKS
    (NEW.id, 'starter-landmark-1', 1),  -- Estátua Simples
    (NEW.id, 'starter-landmark-2', 1),  -- Torre de Vigia
    (NEW.id, 'starter-landmark-3', 1);  -- Fonte da Prosperidade
  
  -- 2. Adicionar cartas starter ao deck com quantidades corretas (SEM TRAPS)
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
  
  -- Event cards
  all_cards := array_cat(all_cards, ARRAY['starter-event-1']);  -- 1x Chuva Leve
  
  -- Landmark cards (3 total) - AGORA COM 3 LANDMARKS
  all_cards := array_cat(all_cards, ARRAY['starter-landmark-1']);  -- 1x Estátua Simples
  all_cards := array_cat(all_cards, ARRAY['starter-landmark-2']);  -- 1x Torre de Vigia
  all_cards := array_cat(all_cards, ARRAY['starter-landmark-3']);  -- 1x Fonte da Prosperidade
  
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
END;
$$;

-- 4. Criar função para corrigir usuários existentes
CREATE OR REPLACE FUNCTION public.fix_user_cards_landmarks(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
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
  
  -- 1. Limpar cartas existentes do usuário
  DELETE FROM public.player_cards WHERE player_id = user_id;
  DELETE FROM public.player_decks WHERE player_id = user_id;
  
  -- 2. Inserir cartas starter com quantidades específicas (SEM TRAPS)
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
    
    -- Event cards (1 total)
    (user_id, 'starter-event-1', 1),  -- Chuva Leve
    
    -- Landmark cards (3 total) - AGORA COM 3 LANDMARKS
    (user_id, 'starter-landmark-1', 1),  -- Estátua Simples
    (user_id, 'starter-landmark-2', 1),  -- Torre de Vigia
    (user_id, 'starter-landmark-3', 1);  -- Fonte da Prosperidade
  
  -- 3. Adicionar cartas starter ao deck com quantidades corretas (SEM TRAPS)
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
  
  -- Event cards
  all_cards := array_cat(all_cards, ARRAY['starter-event-1']);  -- 1x Chuva Leve
  
  -- Landmark cards (3 total) - AGORA COM 3 LANDMARKS
  all_cards := array_cat(all_cards, ARRAY['starter-landmark-1']);  -- 1x Estátua Simples
  all_cards := array_cat(all_cards, ARRAY['starter-landmark-2']);  -- 1x Torre de Vigia
  all_cards := array_cat(all_cards, ARRAY['starter-landmark-3']);  -- 1x Fonte da Prosperidade
  
  -- 4. Processar cartas adicionais (se existirem)
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
  
  -- 5. Criar deck inicial
  INSERT INTO public.player_decks (player_id, name, card_ids, is_active, is_starter_deck)
  VALUES (
    user_id, 
    'Deck Inicial', 
    all_cards,
    true,
    true
  );
  
  RETURN 'Usuário corrigido com sucesso: ' || user_email || ' - 27 cartas starter + 10 adicionais = 37 cartas (3 landmarks, sem traps)';
END;
$$;

-- 5. Verificar resultado
SELECT 
  'Pacote iniciante corrigido:' as info,
  COUNT(*) as total_starter_cards,
  COUNT(CASE WHEN type = 'landmark' THEN 1 END) as landmark_cards,
  COUNT(CASE WHEN type = 'trap' THEN 1 END) as trap_cards
FROM public.cards 
WHERE is_starter = true AND is_active = true;
