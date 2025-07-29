-- Corrigir trigger de novo usuário para usar cartas starter reais
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
  
  -- Criar deck inicial com cartas starter
  INSERT INTO public.player_decks (player_id, name, card_ids, is_active)
  VALUES (
    NEW.id, 
    'Deck Inicial', 
    ARRAY(
      SELECT id 
      FROM public.cards 
      WHERE is_starter = true AND is_active = true
    ), 
    true
  );
    
  RETURN NEW;
END;
$$; 