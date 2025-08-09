-- Criar tabela para modos de jogo
CREATE TABLE IF NOT EXISTS public.game_modes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  detailed_description TEXT,
  victory_mode VARCHAR(50) NOT NULL,
  victory_value INTEGER NOT NULL DEFAULT 0,
  icon VARCHAR(10) NOT NULL,
  color VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL DEFAULT 'medium',
  category VARCHAR(20) NOT NULL DEFAULT 'main',
  tips JSONB DEFAULT '[]',
  requirements JSONB DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_test_mode BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar comentários
COMMENT ON TABLE public.game_modes IS 'Tabela para armazenar modos de jogo configuráveis';
COMMENT ON COLUMN public.game_modes.id IS 'ID único do modo de jogo';
COMMENT ON COLUMN public.game_modes.name IS 'Nome do modo de jogo';
COMMENT ON COLUMN public.game_modes.description IS 'Descrição curta do modo';
COMMENT ON COLUMN public.game_modes.detailed_description IS 'Descrição detalhada do modo';
COMMENT ON COLUMN public.game_modes.victory_mode IS 'Tipo de condição de vitória';
COMMENT ON COLUMN public.game_modes.victory_value IS 'Valor necessário para vitória';
COMMENT ON COLUMN public.game_modes.icon IS 'Ícone do modo (emoji)';
COMMENT ON COLUMN public.game_modes.color IS 'Cor do tema do modo';
COMMENT ON COLUMN public.game_modes.difficulty IS 'Nível de dificuldade';
COMMENT ON COLUMN public.game_modes.category IS 'Categoria do modo';
COMMENT ON COLUMN public.game_modes.tips IS 'Dicas em formato JSON';
COMMENT ON COLUMN public.game_modes.requirements IS 'Requisitos em formato JSON';
COMMENT ON COLUMN public.game_modes.is_active IS 'Se o modo está ativo';
COMMENT ON COLUMN public.game_modes.is_test_mode IS 'Se é um modo de teste';

-- Habilitar RLS
ALTER TABLE public.game_modes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Admins can manage game modes" ON public.game_modes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_settings 
      WHERE user_id = auth.uid() 
      AND (game_preferences->>'is_admin')::boolean = true
    )
  );

CREATE POLICY "Users can view active game modes" ON public.game_modes
  FOR SELECT USING (is_active = true);

-- Índices
CREATE INDEX idx_game_modes_active ON public.game_modes(is_active);
CREATE INDEX idx_game_modes_category ON public.game_modes(category);
CREATE INDEX idx_game_modes_difficulty ON public.game_modes(difficulty);
