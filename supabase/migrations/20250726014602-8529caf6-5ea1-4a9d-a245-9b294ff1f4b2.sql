-- Primeiro, criar cartas básicas com UUIDs gerados automaticamente
-- mas com slugs conhecidos para referência
DO $$
DECLARE
    garden_id UUID := gen_random_uuid();
    tent_id UUID := gen_random_uuid();
    harvest_id UUID := gen_random_uuid();
    farm_id UUID := gen_random_uuid();
    workshop_id UUID := gen_random_uuid();
    shop_id UUID := gen_random_uuid();
BEGIN
    -- Inserir cartas básicas com IDs conhecidos
    INSERT INTO public.cards (id, name, slug, type, rarity, cost_coins, cost_food, cost_materials, cost_population, phase, effect, is_active)
    VALUES 
      (garden_id, 'Pequeno Jardim', 'starter-garden', 'farm', 'common', 0, 0, 0, 0, 'draw', 'Produz 1 comida por turno.', true),
      (tent_id, 'Barraca', 'starter-tent', 'city', 'common', 0, 0, 0, 0, 'draw', 'Fornece 1 população imediatamente.', true),
      (harvest_id, 'Colheita Básica', 'starter-harvest', 'action', 'common', 0, 0, 0, 0, 'action', 'Ganhe 1 comida instantaneamente.', true),
      (farm_id, 'Fazenda Simples', 'starter-farm', 'farm', 'common', 0, 0, 0, 0, 'draw', 'Produz 1 comida quando ativada por dado.', true),
      (workshop_id, 'Oficina Simples', 'starter-workshop', 'city', 'common', 0, 0, 0, 0, 'draw', 'Produz 1 material por turno.', true),
      (shop_id, 'Comércio Simples', 'starter-shop', 'action', 'common', 0, 0, 0, 0, 'action', 'Ganhe 1 moeda instantaneamente.', true)
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      type = EXCLUDED.type,
      rarity = EXCLUDED.rarity,
      cost_coins = EXCLUDED.cost_coins,
      cost_food = EXCLUDED.cost_food,
      cost_materials = EXCLUDED.cost_materials,
      cost_population = EXCLUDED.cost_population,
      phase = EXCLUDED.phase,
      effect = EXCLUDED.effect,
      is_active = EXCLUDED.is_active;
END $$;

-- Criar função auxiliar para buscar IDs das cartas básicas por slug
CREATE OR REPLACE FUNCTION get_starter_card_id(card_slug TEXT)
RETURNS UUID
LANGUAGE SQL
STABLE
AS $$
  SELECT id FROM public.cards WHERE slug = card_slug AND is_active = true;
$$;

-- Atualizar a função handle_new_user para usar os IDs corretos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
    garden_id UUID;
    tent_id UUID;
    harvest_id UUID;
    farm_id UUID;
    workshop_id UUID;
    shop_id UUID;
BEGIN
    INSERT INTO public.profiles (user_id, username, display_name)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'username',
        COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
    );
    
    -- Buscar IDs das cartas básicas
    SELECT get_starter_card_id('starter-garden') INTO garden_id;
    SELECT get_starter_card_id('starter-tent') INTO tent_id;
    SELECT get_starter_card_id('starter-harvest') INTO harvest_id;
    SELECT get_starter_card_id('starter-farm') INTO farm_id;
    SELECT get_starter_card_id('starter-workshop') INTO workshop_id;
    SELECT get_starter_card_id('starter-shop') INTO shop_id;
    
    -- Give starter cards to new user (28 cards total)
    INSERT INTO public.player_cards (player_id, card_id, quantity)
    VALUES 
        (NEW.id, garden_id::text, 6),     -- 6 Pequeno Jardim
        (NEW.id, tent_id::text, 4),       -- 4 Barraca  
        (NEW.id, harvest_id::text, 4),    -- 4 Colheita Básica
        (NEW.id, farm_id::text, 5),       -- 5 Fazenda Simples
        (NEW.id, workshop_id::text, 5),   -- 5 Oficina Simples
        (NEW.id, shop_id::text, 4);       -- 4 Comércio Simples = 28 total

    -- Create default basic deck for new user
    INSERT INTO public.player_decks (player_id, name, card_ids, is_active)
    VALUES (
        NEW.id, 
        'Deck Básico', 
        ARRAY[
            garden_id::text, garden_id::text, garden_id::text, garden_id::text, garden_id::text, garden_id::text,
            tent_id::text, tent_id::text, tent_id::text, tent_id::text,
            harvest_id::text, harvest_id::text, harvest_id::text, harvest_id::text,  
            farm_id::text, farm_id::text, farm_id::text, farm_id::text, farm_id::text,
            workshop_id::text, workshop_id::text, workshop_id::text, workshop_id::text, workshop_id::text,
            shop_id::text, shop_id::text, shop_id::text, shop_id::text
        ]::text[],
        true
    );
        
    RETURN NEW;
END;
$$;