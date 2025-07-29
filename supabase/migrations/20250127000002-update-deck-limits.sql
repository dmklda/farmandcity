-- Atualizar trigger de novo usuário para criar deck inicial com 28 cartas
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Inserir perfil do usuário
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
  );
  
  -- Dar cartas starter (buscar do Supabase)
  INSERT INTO public.player_cards (player_id, card_id, quantity)
  SELECT NEW.id, id, 3 
  FROM public.cards 
  WHERE is_starter = true AND is_active = true;
  
  -- Criar deck inicial com 28 cartas starter (múltiplas cópias se necessário)
  WITH starter_cards AS (
    SELECT id FROM public.cards WHERE is_starter = true AND is_active = true
  ),
  deck_cards AS (
    SELECT id FROM starter_cards
    UNION ALL
    SELECT id FROM starter_cards LIMIT 22  -- Adicionar mais cartas para chegar a 28
  )
  INSERT INTO public.player_decks (player_id, name, card_ids, is_active, is_starter_deck)
  VALUES (
    NEW.id, 
    'Deck Inicial', 
    ARRAY(
      SELECT id FROM deck_cards LIMIT 28
    ), 
    true,
    true
  );
    
  RETURN NEW;
END;
$$;

-- Adicionar campo para identificar deck inicial
ALTER TABLE public.player_decks 
ADD COLUMN IF NOT EXISTS is_starter_deck BOOLEAN DEFAULT FALSE;

-- Criar função para validar limites de deck
CREATE OR REPLACE FUNCTION public.validate_deck_limits()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verificar se é deck inicial (sempre 28 cartas)
  IF NEW.is_starter_deck = true THEN
    IF array_length(NEW.card_ids, 1) != 28 THEN
      RAISE EXCEPTION 'Deck inicial deve ter exatamente 28 cartas';
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

-- Criar trigger para validar limites
DROP TRIGGER IF EXISTS validate_deck_limits_trigger ON public.player_decks;
CREATE TRIGGER validate_deck_limits_trigger
  BEFORE INSERT OR UPDATE ON public.player_decks
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_deck_limits();

-- Comentários sobre os campos
COMMENT ON COLUMN public.player_decks.is_starter_deck IS 'Indica se é o deck inicial gratuito do usuário';
COMMENT ON FUNCTION public.validate_deck_limits() IS 'Valida limites de cartas nos decks: inicial (28) ou customizado (10-28)'; 