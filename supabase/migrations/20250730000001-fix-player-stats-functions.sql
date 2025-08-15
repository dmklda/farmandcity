-- Corrigir a função activate_player_deck para incluir o esquema public no search_path
CREATE OR REPLACE FUNCTION public.activate_player_deck(deck_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verificar se o deck pertence ao usuário autenticado
  IF NOT EXISTS (
    SELECT 1 FROM public.player_decks 
    WHERE id = deck_id AND player_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Deck não encontrado ou não pertence ao usuário';
  END IF;

  -- Desativar todos os outros decks do jogador
  UPDATE public.player_decks 
  SET is_active = false, updated_at = now()
  WHERE player_id = auth.uid() AND id != deck_id;

  -- Ativar o deck selecionado
  UPDATE public.player_decks 
  SET is_active = true, updated_at = now()
  WHERE id = deck_id AND player_id = auth.uid();

  -- Verificar se a atualização foi bem-sucedida
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Erro ao ativar o deck';
  END IF;
END;
$$;

-- Corrigir a função update_decks_created_stats para incluir o esquema public explicitamente
CREATE OR REPLACE FUNCTION public.update_decks_created_stats()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Atualizar decks_created baseado no total de decks do jogador
  UPDATE public.player_stats 
  SET 
    decks_created = (
      SELECT COUNT(*) 
      FROM public.player_decks 
      WHERE player_id = COALESCE(NEW.player_id, OLD.player_id)
    ),
    updated_at = now()
  WHERE player_id = COALESCE(NEW.player_id, OLD.player_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Corrigir a função update_last_activity para incluir o esquema public explicitamente
CREATE OR REPLACE FUNCTION public.update_last_activity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Atualizar last_activity para a ação mais recente
  UPDATE public.player_stats 
  SET 
    last_activity = now(),
    updated_at = now()
  WHERE player_id = COALESCE(NEW.player_id, OLD.player_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Corrigir a função update_cards_collected_stats para incluir o esquema public explicitamente
CREATE OR REPLACE FUNCTION public.update_cards_collected_stats()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Atualizar cards_collected baseado no total de cartas únicas do jogador
  UPDATE public.player_stats 
  SET 
    cards_collected = (
      SELECT COUNT(DISTINCT card_id) 
      FROM public.player_cards 
      WHERE player_id = COALESCE(NEW.player_id, OLD.player_id)
    ),
    updated_at = now()
  WHERE player_id = COALESCE(NEW.player_id, OLD.player_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Corrigir a função update_achievements_earned_stats para incluir o esquema public explicitamente
CREATE OR REPLACE FUNCTION public.update_achievements_earned_stats()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Atualizar achievements_earned baseado no total de conquistas completadas
  UPDATE public.player_stats 
  SET 
    achievements_earned = (
      SELECT COUNT(*) 
      FROM public.player_achievements 
      WHERE player_id = COALESCE(NEW.player_id, OLD.player_id) 
      AND is_completed = true
    ),
    updated_at = now()
  WHERE player_id = COALESCE(NEW.player_id, OLD.player_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;
