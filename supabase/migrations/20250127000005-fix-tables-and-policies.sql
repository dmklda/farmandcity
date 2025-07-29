-- Verificar e corrigir problemas nas tabelas e políticas

-- 1. Garantir que as tabelas existem
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.player_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT REFERENCES public.cards(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.player_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  card_ids TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  is_starter_deck BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Garantir que a tabela cards existe e tem as colunas necessárias
CREATE TABLE IF NOT EXISTS public.cards (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  rarity TEXT NOT NULL,
  cost_coins INTEGER DEFAULT 0,
  cost_food INTEGER DEFAULT 0,
  cost_materials INTEGER DEFAULT 0,
  cost_population INTEGER DEFAULT 0,
  effect TEXT,
  effect_logic TEXT,
  phase TEXT,
  use_per_turn INTEGER DEFAULT 1,
  is_reactive BOOLEAN DEFAULT false,
  art_url TEXT,
  frame_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_starter BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Adicionar colunas se não existirem
ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS is_starter BOOLEAN DEFAULT false;

ALTER TABLE public.player_decks 
ADD COLUMN IF NOT EXISTS is_starter_deck BOOLEAN DEFAULT false;

-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_player_cards_player_id ON public.player_cards(player_id);
CREATE INDEX IF NOT EXISTS idx_player_cards_card_id ON public.player_cards(card_id);
CREATE INDEX IF NOT EXISTS idx_player_decks_player_id ON public.player_decks(player_id);
CREATE INDEX IF NOT EXISTS idx_cards_is_starter ON public.cards(is_starter);
CREATE INDEX IF NOT EXISTS idx_cards_is_active ON public.cards(is_active);

-- 5. Configurar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- 6. Políticas para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Políticas para player_cards
DROP POLICY IF EXISTS "Users can view own cards" ON public.player_cards;
CREATE POLICY "Users can view own cards" ON public.player_cards
  FOR SELECT USING (auth.uid() = player_id);

DROP POLICY IF EXISTS "Users can update own cards" ON public.player_cards;
CREATE POLICY "Users can update own cards" ON public.player_cards
  FOR UPDATE USING (auth.uid() = player_id);

DROP POLICY IF EXISTS "Users can insert own cards" ON public.player_cards;
CREATE POLICY "Users can insert own cards" ON public.player_cards
  FOR INSERT WITH CHECK (auth.uid() = player_id);

-- 8. Políticas para player_decks
DROP POLICY IF EXISTS "Users can view own decks" ON public.player_decks;
CREATE POLICY "Users can view own decks" ON public.player_decks
  FOR SELECT USING (auth.uid() = player_id);

DROP POLICY IF EXISTS "Users can update own decks" ON public.player_decks;
CREATE POLICY "Users can update own decks" ON public.player_decks
  FOR UPDATE USING (auth.uid() = player_id);

DROP POLICY IF EXISTS "Users can insert own decks" ON public.player_decks;
CREATE POLICY "Users can insert own decks" ON public.player_decks
  FOR INSERT WITH CHECK (auth.uid() = player_id);

DROP POLICY IF EXISTS "Users can delete own decks" ON public.player_decks;
CREATE POLICY "Users can delete own decks" ON public.player_decks
  FOR DELETE USING (auth.uid() = player_id);

-- 9. Políticas para cards (leitura pública)
DROP POLICY IF EXISTS "Anyone can view active cards" ON public.cards;
CREATE POLICY "Anyone can view active cards" ON public.cards
  FOR SELECT USING (is_active = true);

-- 10. Garantir que o trigger existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$; 