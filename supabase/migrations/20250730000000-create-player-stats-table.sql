-- Criar tabela player_stats para armazenar estatísticas dos jogadores
CREATE TABLE IF NOT EXISTS public.player_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL DEFAULT 1,
  experience_points INTEGER NOT NULL DEFAULT 0,
  games_played INTEGER NOT NULL DEFAULT 0,
  games_won INTEGER NOT NULL DEFAULT 0,
  games_lost INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  cards_collected INTEGER NOT NULL DEFAULT 0,
  decks_created INTEGER NOT NULL DEFAULT 0,
  total_playtime_minutes INTEGER NOT NULL DEFAULT 0,
  achievements_earned INTEGER NOT NULL DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_player_stats UNIQUE (player_id)
);

-- Adicionar RLS para a tabela player_stats
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança básicas
CREATE POLICY "Jogadores podem ver suas próprias estatísticas"
  ON public.player_stats
  FOR SELECT
  USING (auth.uid() = player_id);

CREATE POLICY "Jogadores podem atualizar suas próprias estatísticas"
  ON public.player_stats
  FOR UPDATE
  USING (auth.uid() = player_id);

-- Verificar se a tabela admin_users existe antes de criar políticas relacionadas
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_users') THEN
    -- Criar políticas para admins
    EXECUTE 'CREATE POLICY "Admins podem ver todas as estatísticas"
      ON public.player_stats
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.admin_users
          WHERE user_id = auth.uid()
        )
      )';

    EXECUTE 'CREATE POLICY "Admins podem atualizar todas as estatísticas"
      ON public.player_stats
      FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.admin_users
          WHERE user_id = auth.uid()
        )
      )';
  END IF;
END $$;

-- Criar função para inicializar estatísticas de novos jogadores
CREATE OR REPLACE FUNCTION public.initialize_player_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.player_stats (player_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Criar trigger para inicializar estatísticas quando um novo usuário é criado
DROP TRIGGER IF EXISTS initialize_player_stats_trigger ON auth.users;
CREATE TRIGGER initialize_player_stats_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_player_stats();

-- Comentários
COMMENT ON TABLE public.player_stats IS 'Armazena estatísticas dos jogadores';
COMMENT ON FUNCTION public.initialize_player_stats() IS 'Inicializa estatísticas para novos jogadores';