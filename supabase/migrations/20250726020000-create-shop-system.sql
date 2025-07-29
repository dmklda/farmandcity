-- Create shop system tables
-- Create shop_items table
CREATE TABLE public.shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  item_type TEXT NOT NULL CHECK (item_type IN ('pack', 'booster', 'card', 'currency', 'cosmetic')),
  price_coins INTEGER DEFAULT 0,
  price_gems INTEGER DEFAULT 0,
  currency_type TEXT NOT NULL DEFAULT 'coins' CHECK (currency_type IN ('coins', 'gems', 'both')),
  rarity TEXT,
  card_ids TEXT[],
  guaranteed_cards JSONB,
  is_limited BOOLEAN DEFAULT false,
  stock_quantity INTEGER,
  sold_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  discount_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create shop_purchases table
CREATE TABLE public.shop_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES auth.users(id),
  item_id UUID REFERENCES public.shop_items(id),
  quantity INTEGER DEFAULT 1,
  total_price_coins INTEGER DEFAULT 0,
  total_price_gems INTEGER DEFAULT 0,
  items_received JSONB,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on shop tables
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for shop_items (public read, admin write)
CREATE POLICY "Shop items are viewable by everyone" 
ON public.shop_items FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage shop items" 
ON public.shop_items FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create policies for shop_purchases
CREATE POLICY "Users can view their own purchases" 
ON public.shop_purchases FOR SELECT 
USING (auth.uid() = player_id);

CREATE POLICY "Users can create their own purchases" 
ON public.shop_purchases FOR INSERT 
WITH CHECK (auth.uid() = player_id);

-- Create updated_at trigger for shop_items
CREATE TRIGGER update_shop_items_updated_at
  BEFORE UPDATE ON public.shop_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample shop items
INSERT INTO public.shop_items (name, description, item_type, price_coins, currency_type, rarity, is_active) VALUES
('Pack Básico', 'Pack com 3 cartas aleatórias', 'pack', 100, 'coins', 'common', true),
('Pack Raro', 'Pack com 3 cartas, garantia de 1 rara', 'pack', 250, 'coins', 'rare', true),
('Pack Lendário', 'Pack com 3 cartas, chance de lendária', 'pack', 500, 'coins', 'legendary', true),
('100 Moedas', 'Pacote de 100 moedas', 'currency', 50, 'gems', 'common', true),
('500 Moedas', 'Pacote de 500 moedas', 'currency', 200, 'gems', 'common', true),
('1000 Moedas', 'Pacote de 1000 moedas', 'currency', 350, 'gems', 'common', true),
('10 Gems', 'Pacote de 10 gems', 'currency', 100, 'coins', 'common', true),
('50 Gems', 'Pacote de 50 gems', 'currency', 450, 'coins', 'common', true),
('100 Gems', 'Pacote de 100 gems', 'currency', 800, 'coins', 'common', true); 