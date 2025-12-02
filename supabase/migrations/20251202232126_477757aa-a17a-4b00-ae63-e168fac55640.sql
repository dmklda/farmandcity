-- Fix purchase_starter_pack function to handle empty string auth.uid()
CREATE OR REPLACE FUNCTION purchase_starter_pack()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID;
  starter_pack_id UUID;
  purchase_record RECORD;
  card_record RECORD;
  result JSON;
BEGIN
  -- Get and validate user ID
  BEGIN
    user_id := auth.uid();
  EXCEPTION WHEN OTHERS THEN
    user_id := NULL;
  END;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado. Faça login para continuar.';
  END IF;

  -- Verify user exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
    RAISE EXCEPTION 'Usuário não encontrado. Faça login novamente.';
  END IF;

  -- Verificar se pode comprar
  IF NOT can_purchase_starter_pack() THEN
    RAISE EXCEPTION 'Pacote iniciante já foi comprado ou não está disponível';
  END IF;

  -- Obter ID do pacote iniciante
  SELECT id INTO starter_pack_id
  FROM special_packs
  WHERE is_starter_pack = true AND is_active = true
  LIMIT 1;

  IF starter_pack_id IS NULL THEN
    RAISE EXCEPTION 'Pacote iniciante não encontrado';
  END IF;

  -- Registrar a compra
  INSERT INTO player_pack_purchases (player_id, pack_id)
  VALUES (user_id, starter_pack_id)
  RETURNING * INTO purchase_record;

  -- Adicionar cartas ao jogador
  FOR card_record IN 
    SELECT spi.card_id, spi.quantity
    FROM special_pack_items spi
    WHERE spi.pack_id = starter_pack_id
  LOOP
    -- Inserir cartas na coleção do jogador
    INSERT INTO player_cards (player_id, card_id, quantity)
    VALUES (user_id, card_record.card_id, card_record.quantity)
    ON CONFLICT (player_id, card_id) 
    DO UPDATE SET quantity = player_cards.quantity + card_record.quantity;
  END LOOP;

  -- Retornar resultado
  SELECT json_build_object(
    'success', true,
    'message', 'Pacote iniciante comprado com sucesso!',
    'purchase_id', purchase_record.id,
    'cards_added', (
      SELECT COUNT(*) 
      FROM special_pack_items 
      WHERE pack_id = starter_pack_id
    )
  ) INTO result;

  RETURN result;
END;
$$;