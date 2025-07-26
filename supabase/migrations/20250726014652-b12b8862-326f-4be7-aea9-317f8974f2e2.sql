-- Corrigir search_path nas funções para resolver warnings de segurança
CREATE OR REPLACE FUNCTION get_starter_card_id(card_slug TEXT)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT id FROM public.cards WHERE slug = card_slug AND is_active = true;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_frame_url()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.frame_url = '/assets/frames/' || NEW.type || '_' || NEW.rarity || '.png';
  RETURN NEW;
END;
$$;