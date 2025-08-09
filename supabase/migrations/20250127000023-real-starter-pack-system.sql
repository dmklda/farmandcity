-- Sistema do Pacote Iniciante Real usando cartas reais do banco de dados
-- Seleciona cartas balanceadas do banco e adiciona à coleção do usuário

-- 1. Criar tabela para controlar o pacote iniciante
CREATE TABLE IF NOT EXISTS public.starter_pack_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Pacote Iniciante Real',
  description TEXT NOT NULL DEFAULT '40 cartas básicas para iniciar sua jornada no reino',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Inserir configuração do pacote iniciante
INSERT INTO public.starter_pack_config (name, description, is_active)
VALUES (
  'Pacote Iniciante Real',
  '40 cartas básicas para iniciar sua jornada no reino. Exclusivo para novos jogadores.',
  true
) ON CONFLICT DO NOTHING;

-- 3. Criar função para selecionar cartas balanceadas do banco
CREATE OR REPLACE FUNCTION public.select_balanced_starter_cards()
RETURNS TABLE (
  card_id UUID,
  card_name TEXT,
  card_type TEXT,
  card_rarity TEXT,
  card_effect TEXT,
  quantity INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
  farm_cards RECORD;
  city_cards RECORD;
  action_cards RECORD;
  magic_cards RECORD;
  event_cards RECORD;
  landmark_cards RECORD;
  defense_cards RECORD;
BEGIN
  -- Limpar resultado anterior
  DELETE FROM public.starter_pack_cards WHERE pack_name = 'Pacote Iniciante Real';
  
  -- Selecionar cartas Farm (8 cartas)
  FOR farm_cards IN 
    SELECT id, name, type, rarity, effect
    FROM public.cards 
    WHERE type = 'farm' 
      AND rarity IN ('common', 'uncommon')
      AND is_active = true
      AND is_starter = true
    ORDER BY rarity, random()
    LIMIT 8
  LOOP
    INSERT INTO public.starter_pack_cards (pack_name, card_id, quantity)
    VALUES ('Pacote Iniciante Real', farm_cards.id, 
      CASE 
        WHEN farm_cards.name = 'Pequeno Jardim' THEN 3
        WHEN farm_cards.name IN ('Fazenda Simples', 'Campo de Trigo') THEN 2
        ELSE 1
      END
    );
  END LOOP;
  
  -- Selecionar cartas City (6 cartas)
  FOR city_cards IN 
    SELECT id, name, type, rarity, effect
    FROM public.cards 
    WHERE type = 'city' 
      AND rarity IN ('common', 'uncommon')
      AND is_active = true
      AND is_starter = true
    ORDER BY rarity, random()
    LIMIT 6
  LOOP
    INSERT INTO public.starter_pack_cards (pack_name, card_id, quantity)
    VALUES ('Pacote Iniciante Real', city_cards.id, 
      CASE 
        WHEN city_cards.name IN ('Barraca', 'Oficina Simples', 'Comércio Simples') THEN 2
        ELSE 1
      END
    );
  END LOOP;
  
  -- Selecionar cartas Action (5 cartas)
  FOR action_cards IN 
    SELECT id, name, type, rarity, effect
    FROM public.cards 
    WHERE type = 'action' 
      AND rarity IN ('common', 'uncommon')
      AND is_active = true
      AND is_starter = true
    ORDER BY rarity, random()
    LIMIT 5
  LOOP
    INSERT INTO public.starter_pack_cards (pack_name, card_id, quantity)
    VALUES ('Pacote Iniciante Real', action_cards.id, 
      CASE 
        WHEN action_cards.name IN ('Colheita Básica', 'Comércio Básico') THEN 2
        ELSE 1
      END
    );
  END LOOP;
  
  -- Selecionar cartas Magic (2 cartas)
  FOR magic_cards IN 
    SELECT id, name, type, rarity, effect
    FROM public.cards 
    WHERE type = 'magic' 
      AND rarity IN ('common', 'uncommon')
      AND is_active = true
      AND is_starter = true
    ORDER BY rarity, random()
    LIMIT 2
  LOOP
    INSERT INTO public.starter_pack_cards (pack_name, card_id, quantity)
    VALUES ('Pacote Iniciante Real', magic_cards.id, 1);
  END LOOP;
  
  -- Selecionar cartas Event (1 carta)
  FOR event_cards IN 
    SELECT id, name, type, rarity, effect
    FROM public.cards 
    WHERE type = 'event' 
      AND rarity IN ('common', 'uncommon')
      AND is_active = true
      AND is_starter = true
    ORDER BY rarity, random()
    LIMIT 1
  LOOP
    INSERT INTO public.starter_pack_cards (pack_name, card_id, quantity)
    VALUES ('Pacote Iniciante Real', event_cards.id, 1);
  END LOOP;
  
  -- Selecionar cartas Landmark (3 cartas - mínimo necessário)
  FOR landmark_cards IN 
    SELECT id, name, type, rarity, effect
    FROM public.cards 
    WHERE type = 'landmark' 
      AND rarity IN ('common', 'uncommon')
      AND is_active = true
      AND is_starter = true
    ORDER BY rarity, random()
    LIMIT 3
  LOOP
    INSERT INTO public.starter_pack_cards (pack_name, card_id, quantity)
    VALUES ('Pacote Iniciante Real', landmark_cards.id, 1);
  END LOOP;
  
  -- Selecionar cartas Defense (3 cartas)
  FOR defense_cards IN 
    SELECT id, name, type, rarity, effect
    FROM public.cards 
    WHERE type = 'defense' 
      AND rarity IN ('common', 'uncommon')
      AND is_active = true
      AND is_starter = true
    ORDER BY rarity, random()
    LIMIT 3
  LOOP
    INSERT INTO public.starter_pack_cards (pack_name, card_id, quantity)
    VALUES ('Pacote Iniciante Real', defense_cards.id, 
      CASE 
        WHEN defense_cards.name = 'Muro de Palha' THEN 2
        ELSE 1
      END
    );
  END LOOP;
  
  -- Retornar as cartas selecionadas
  RETURN QUERY
  SELECT 
    spc.card_id,
    c.name,
    c.type,
    c.rarity,
    c.effect,
    spc.quantity
  FROM public.starter_pack_cards spc
  JOIN public.cards c ON spc.card_id = c.id
  WHERE spc.pack_name = 'Pacote Iniciante Real'
  ORDER BY c.type, c.name;
END;
$$;

-- 4. Criar tabela para armazenar as cartas do pacote iniciante
CREATE TABLE IF NOT EXISTS public.starter_pack_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_name TEXT NOT NULL,
  card_id UUID NOT NULL REFERENCES public.cards(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(pack_name, card_id)
);

-- 5. Criar função para resgatar o pacote iniciante
CREATE OR REPLACE FUNCTION public.redeem_starter_pack(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_id UUID;
  pack_cards RECORD;
  total_cards INTEGER := 0;
  cards_added INTEGER := 0;
  all_cards TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Buscar ID do usuário
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN 'Usuário não encontrado: ' || user_email;
  END IF;
  
  -- Verificar se o usuário já resgatou o pacote
  IF EXISTS (
    SELECT 1 FROM public.player_cards pc
    JOIN public.cards c ON pc.card_id = c.id
    WHERE pc.player_id = user_id AND c.is_starter = true
  ) THEN
    RETURN 'Usuário já resgatou o pacote iniciante: ' || user_email;
  END IF;
  
  -- Selecionar cartas balanceadas do banco
  PERFORM public.select_balanced_starter_cards();
  
  -- Adicionar cartas à coleção do usuário
  FOR pack_cards IN 
    SELECT spc.card_id, spc.quantity
    FROM public.starter_pack_cards spc
    WHERE spc.pack_name = 'Pacote Iniciante Real'
  LOOP
    -- Inserir na coleção do usuário
    INSERT INTO public.player_cards (player_id, card_id, quantity)
    VALUES (user_id, pack_cards.card_id, pack_cards.quantity)
    ON CONFLICT (player_id, card_id) 
    DO UPDATE SET quantity = player_cards.quantity + pack_cards.quantity;
    
    cards_added := cards_added + pack_cards.quantity;
    
    -- Adicionar ao array de cartas para o deck
    FOR i IN 1..pack_cards.quantity LOOP
      all_cards := array_append(all_cards, pack_cards.card_id::TEXT);
    END LOOP;
  END LOOP;
  
  -- Adicionar 10 cartas adicionais aleatórias (não-starter)
  INSERT INTO public.player_cards (player_id, card_id, quantity)
  SELECT user_id, id, 1
  FROM public.cards 
  WHERE is_starter = false 
    AND is_active = true
    AND rarity IN ('common', 'uncommon')
  ORDER BY random()
  LIMIT 10
  ON CONFLICT (player_id, card_id) 
  DO UPDATE SET quantity = player_cards.quantity + 1;
  
  -- Adicionar cartas adicionais ao array
  SELECT array_cat(all_cards, array_agg(id::TEXT)) INTO all_cards
  FROM (
    SELECT id
    FROM public.cards 
    WHERE is_starter = false 
      AND is_active = true
      AND rarity IN ('common', 'uncommon')
    ORDER BY random()
    LIMIT 10
  ) AS additional;
  
  -- Criar deck inicial
  INSERT INTO public.player_decks (player_id, name, card_ids, is_active, is_starter_deck)
  VALUES (
    user_id, 
    'Deck Inicial', 
    all_cards,
    true,
    true
  );
  
  -- Calcular total de cartas
  SELECT array_length(all_cards, 1) INTO total_cards;
  
  RETURN 'Pacote Iniciante Real resgatado com sucesso: ' || user_email || 
         ' - ' || cards_added || ' cartas starter + 10 adicionais = ' || total_cards || ' cartas totais';
END;
$$;

-- 6. Executar seleção inicial de cartas
SELECT public.select_balanced_starter_cards();

-- 7. Verificar resultado
SELECT 
  'Pacote Iniciante Real configurado:' as info,
  COUNT(*) as total_cards,
  COUNT(CASE WHEN c.type = 'landmark' THEN 1 END) as landmark_cards,
  COUNT(CASE WHEN c.type = 'trap' THEN 1 END) as trap_cards,
  SUM(spc.quantity) as total_quantity
FROM public.starter_pack_cards spc
JOIN public.cards c ON spc.card_id = c.id
WHERE spc.pack_name = 'Pacote Iniciante Real';

