-- Criar tabela de decks dos jogadores
CREATE TABLE public.player_decks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL,
  name TEXT NOT NULL,
  card_ids TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.player_decks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own decks" 
ON public.player_decks 
FOR ALL 
USING (auth.uid() = player_id);

-- Add trigger for timestamps
CREATE TRIGGER update_player_decks_updated_at
BEFORE UPDATE ON public.player_decks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();