-- Fix security warnings by setting search_path on functions
CREATE OR REPLACE FUNCTION generate_card_slug()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.slug = LOWER(TRIM(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9\s]', '', 'g')));
  NEW.slug = REGEXP_REPLACE(NEW.slug, '\s+', '-', 'g');
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.cards WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)) LOOP
    NEW.slug = NEW.slug || '-' || FLOOR(RANDOM() * 1000)::TEXT;
  END LOOP;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION set_card_phase()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  CASE NEW.type
    WHEN 'action', 'magic' THEN NEW.phase = 'action';
    WHEN 'defense', 'trap' THEN NEW.phase = 'reaction';
    ELSE NEW.phase = 'draw';
  END CASE;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION generate_frame_url()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.frame_url = '/assets/frames/' || NEW.type || '_' || NEW.rarity || '.png';
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;