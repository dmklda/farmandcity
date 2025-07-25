-- Create enum types for card system
CREATE TYPE card_type AS ENUM ('farm', 'city', 'action', 'magic', 'defense', 'trap', 'event', 'landmark');
CREATE TYPE card_rarity AS ENUM ('common', 'uncommon', 'rare', 'ultra', 'secret', 'legendary', 'crisis', 'booster');
CREATE TYPE game_phase AS ENUM ('draw', 'action', 'reaction');

-- Create cards table
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type card_type NOT NULL,
  rarity card_rarity NOT NULL,
  cost_coins INTEGER DEFAULT 0,
  cost_food INTEGER DEFAULT 0,
  cost_materials INTEGER DEFAULT 0,
  cost_population INTEGER DEFAULT 0,
  effect TEXT NOT NULL,
  effect_logic TEXT,
  phase game_phase NOT NULL,
  use_per_turn INTEGER DEFAULT 1,
  is_reactive BOOLEAN DEFAULT false,
  art_url TEXT,
  frame_url TEXT,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create trigger for automatic slug generation
CREATE OR REPLACE FUNCTION generate_card_slug()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug = LOWER(TRIM(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9\s]', '', 'g')));
  NEW.slug = REGEXP_REPLACE(NEW.slug, '\s+', '-', 'g');
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.cards WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)) LOOP
    NEW.slug = NEW.slug || '-' || FLOOR(RANDOM() * 1000)::TEXT;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_card_slug_trigger
  BEFORE INSERT OR UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION generate_card_slug();

-- Create function to auto-set phase based on card type
CREATE OR REPLACE FUNCTION set_card_phase()
RETURNS TRIGGER AS $$
BEGIN
  CASE NEW.type
    WHEN 'action', 'magic' THEN NEW.phase = 'action';
    WHEN 'defense', 'trap' THEN NEW.phase = 'reaction';
    ELSE NEW.phase = 'draw';
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_card_phase_trigger
  BEFORE INSERT OR UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION set_card_phase();

-- Create function to auto-generate frame URL
CREATE OR REPLACE FUNCTION generate_frame_url()
RETURNS TRIGGER AS $$
BEGIN
  NEW.frame_url = '/assets/frames/' || NEW.type || '_' || NEW.rarity || '.png';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_frame_url_trigger
  BEFORE INSERT OR UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION generate_frame_url();

-- Create booster_packs table
CREATE TABLE public.booster_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_coins INTEGER NOT NULL,
  cards_count INTEGER DEFAULT 5,
  guaranteed_rarity card_rarity,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create pack_purchases table
CREATE TABLE public.pack_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  pack_id UUID REFERENCES public.booster_packs(id),
  cards_received JSONB,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create game_stats table
CREATE TABLE public.game_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  card_id UUID REFERENCES public.cards(id),
  times_used INTEGER DEFAULT 0,
  wins_with_card INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booster_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pack_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for cards (public read, admin write)
CREATE POLICY "Cards are viewable by everyone" 
ON public.cards FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage cards" 
ON public.cards FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create policies for booster packs
CREATE POLICY "Booster packs are viewable by everyone" 
ON public.booster_packs FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage packs" 
ON public.booster_packs FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create policies for purchases
CREATE POLICY "Users can view their own purchases" 
ON public.pack_purchases FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases" 
ON public.pack_purchases FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for game stats
CREATE POLICY "Users can view their own stats" 
ON public.game_stats FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own stats" 
ON public.game_stats FOR ALL 
USING (auth.uid() = user_id);

-- Create storage bucket for card arts
INSERT INTO storage.buckets (id, name, public) VALUES ('card-arts', 'card-arts', true);

-- Create storage policies
CREATE POLICY "Card arts are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'card-arts');

CREATE POLICY "Authenticated users can upload card arts" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'card-arts' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update card arts" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'card-arts' AND auth.uid() IS NOT NULL);

-- Create updated_at trigger for cards
CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON public.cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();