-- Adicionar constraint única para garantir que apenas um deck pode estar ativo por jogador
-- Primeiro, limpar decks duplicados ativos (manter apenas o mais recente)
UPDATE public.player_decks 
SET is_active = false 
WHERE id NOT IN (
  SELECT DISTINCT ON (player_id) id 
  FROM public.player_decks 
  WHERE is_active = true 
  ORDER BY player_id, updated_at DESC
);

-- Adicionar constraint única
ALTER TABLE public.player_decks 
ADD CONSTRAINT unique_active_deck_per_player 
UNIQUE (player_id, is_active) 
WHERE is_active = true;

-- Criar função para gerenciar ativação de deck
CREATE OR REPLACE FUNCTION public.activate_player_deck(deck_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Criar trigger para garantir que apenas um deck esteja ativo
CREATE OR REPLACE FUNCTION public.ensure_single_active_deck()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Se estamos ativando um deck, desativar todos os outros
  IF NEW.is_active = true AND (OLD.is_active = false OR OLD.is_active IS NULL) THEN
    UPDATE public.player_decks 
    SET is_active = false, updated_at = now()
    WHERE player_id = NEW.player_id AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger
DROP TRIGGER IF EXISTS ensure_single_active_deck_trigger ON public.player_decks;
CREATE TRIGGER ensure_single_active_deck_trigger
  BEFORE UPDATE ON public.player_decks
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_active_deck();

-- Comentários
COMMENT ON CONSTRAINT unique_active_deck_per_player ON public.player_decks IS 'Garante que apenas um deck pode estar ativo por jogador';
COMMENT ON FUNCTION public.activate_player_deck(UUID) IS 'Função segura para ativar um deck, desativando automaticamente outros';
COMMENT ON FUNCTION public.ensure_single_active_deck() IS 'Trigger que garante consistência do deck ativo'; 