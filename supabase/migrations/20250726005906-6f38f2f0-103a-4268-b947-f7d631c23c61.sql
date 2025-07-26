-- Criar tabela game_settings para configurações do jogo
CREATE TABLE public.game_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.game_settings ENABLE ROW LEVEL SECURITY;

-- Criar políticas para game_settings
CREATE POLICY "Game settings are viewable by everyone" 
ON public.game_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated admins can modify game settings" 
ON public.game_settings 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_game_settings_updated_at
BEFORE UPDATE ON public.game_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir configurações padrão do jogo
INSERT INTO public.game_settings (setting_key, setting_value, description) VALUES
('max_hand_size', '7', 'Tamanho máximo da mão'),
('starting_resources', '{"coins": 10, "food": 5, "materials": 3, "population": 2}', 'Recursos iniciais do jogador'),
('max_turns', '50', 'Número máximo de turnos por jogo'),
('victory_conditions', '{"score": 100, "landmarks": 5}', 'Condições de vitória'),
('card_draw_per_turn', '2', 'Número de cartas compradas por turno'),
('resource_generation', '{"base_coins": 1, "base_food": 1}', 'Geração base de recursos por turno');