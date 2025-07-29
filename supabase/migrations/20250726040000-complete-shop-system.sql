-- Sistema completo de loja
-- ========================

-- 1. Tabela de itens da loja
CREATE TABLE public.shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  item_type TEXT NOT NULL CHECK (item_type IN ('pack', 'booster', 'card', 'currency', 'cosmetic', 'event')),
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
  is_daily_rotation BOOLEAN DEFAULT false,
  rotation_date DATE,
  event_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Tabela de eventos especiais
CREATE TABLE public.shop_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('sale', 'limited', 'exclusive', 'seasonal')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  discount_percentage INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Tabela de cartas em rotação diária
CREATE TABLE public.daily_rotation_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES public.cards(id),
  rotation_date DATE NOT NULL,
  price_coins INTEGER DEFAULT 0,
  price_gems INTEGER DEFAULT 0,
  currency_type TEXT NOT NULL DEFAULT 'coins' CHECK (currency_type IN ('coins', 'gems', 'both')),
  discount_percentage INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Tabela de histórico de compras
CREATE TABLE public.shop_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES auth.users(id),
  item_id UUID REFERENCES public.shop_items(id),
  item_type TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  total_price_coins INTEGER DEFAULT 0,
  total_price_gems INTEGER DEFAULT 0,
  items_received JSONB,
  event_id UUID REFERENCES public.shop_events(id),
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Tabela de compras de cartas individuais
CREATE TABLE public.card_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES auth.users(id),
  card_id UUID REFERENCES public.cards(id),
  price_coins INTEGER DEFAULT 0,
  price_gems INTEGER DEFAULT 0,
  currency_type TEXT NOT NULL DEFAULT 'coins',
  discount_percentage INTEGER DEFAULT 0,
  event_id UUID REFERENCES public.shop_events(id),
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_rotation_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_purchases ENABLE ROW LEVEL SECURITY;

-- Políticas para shop_items (leitura pública, escrita admin)
CREATE POLICY "Shop items are viewable by everyone" 
ON public.shop_items FOR SELECT USING (true);

CREATE POLICY "Admins can manage shop items" 
ON public.shop_items FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM public.admin_roles WHERE role IN ('admin', 'super_admin') AND is_active = true
));

-- Políticas para shop_events (leitura pública, escrita admin)
CREATE POLICY "Shop events are viewable by everyone" 
ON public.shop_events FOR SELECT USING (true);

CREATE POLICY "Admins can manage shop events" 
ON public.shop_events FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM public.admin_roles WHERE role IN ('admin', 'super_admin') AND is_active = true
));

-- Políticas para daily_rotation_cards (leitura pública, escrita admin)
CREATE POLICY "Daily rotation cards are viewable by everyone" 
ON public.daily_rotation_cards FOR SELECT USING (true);

CREATE POLICY "Admins can manage daily rotation cards" 
ON public.daily_rotation_cards FOR ALL 
USING (auth.uid() IN (
  SELECT user_id FROM public.admin_roles WHERE role IN ('admin', 'super_admin') AND is_active = true
));

-- Políticas para shop_purchases (usuários veem suas próprias compras)
CREATE POLICY "Users can view their own shop purchases" 
ON public.shop_purchases FOR SELECT 
USING (auth.uid() = player_id);

CREATE POLICY "Users can create their own shop purchases" 
ON public.shop_purchases FOR INSERT 
WITH CHECK (auth.uid() = player_id);

-- Políticas para card_purchases (usuários veem suas próprias compras)
CREATE POLICY "Users can view their own card purchases" 
ON public.card_purchases FOR SELECT 
USING (auth.uid() = player_id);

CREATE POLICY "Users can create their own card purchases" 
ON public.card_purchases FOR INSERT 
WITH CHECK (auth.uid() = player_id);

-- Triggers para updated_at
CREATE TRIGGER update_shop_items_updated_at
  BEFORE UPDATE ON public.shop_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shop_events_updated_at
  BEFORE UPDATE ON public.shop_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_shop_items_active ON public.shop_items(is_active);
CREATE INDEX idx_shop_items_type ON public.shop_items(item_type);
CREATE INDEX idx_shop_events_active ON public.shop_events(is_active);
CREATE INDEX idx_shop_events_dates ON public.shop_events(start_date, end_date);
CREATE INDEX idx_daily_rotation_date ON public.daily_rotation_cards(rotation_date);
CREATE INDEX idx_shop_purchases_player ON public.shop_purchases(player_id);
CREATE INDEX idx_card_purchases_player ON public.card_purchases(player_id);

-- Função para obter cartas em rotação diária
CREATE OR REPLACE FUNCTION get_daily_rotation_cards(p_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  card_id UUID,
  card_name TEXT,
  card_type TEXT,
  card_rarity TEXT,
  price_coins INTEGER,
  price_gems INTEGER,
  currency_type TEXT,
  discount_percentage INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.type::TEXT,
    c.rarity::TEXT,
    drc.price_coins,
    drc.price_gems,
    drc.currency_type,
    drc.discount_percentage
  FROM public.daily_rotation_cards drc
  JOIN public.cards c ON c.id = drc.card_id
  WHERE drc.rotation_date = p_date
  AND drc.is_active = true
  AND c.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter eventos ativos
CREATE OR REPLACE FUNCTION get_active_shop_events()
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  event_type TEXT,
  discount_percentage INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    se.id,
    se.name,
    se.description,
    se.event_type,
    se.discount_percentage
  FROM public.shop_events se
  WHERE se.is_active = true
  AND se.start_date <= CURRENT_TIMESTAMP
  AND se.end_date >= CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 