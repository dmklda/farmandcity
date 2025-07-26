-- Primeiro, inserir as cartas básicas com IDs conhecidos no Supabase
INSERT INTO public.cards (id, name, type, rarity, cost_coins, cost_food, cost_materials, cost_population, phase, effect, is_active)
VALUES 
  ('starter-garden'::uuid, 'Pequeno Jardim', 'farm', 'common', 0, 0, 0, 0, 'draw', 'Produz 1 comida por turno.', true),
  ('starter-tent'::uuid, 'Barraca', 'city', 'common', 0, 0, 0, 0, 'draw', 'Fornece 1 população imediatamente.', true),
  ('starter-harvest'::uuid, 'Colheita Básica', 'action', 'common', 0, 0, 0, 0, 'action', 'Ganhe 1 comida instantaneamente.', true),
  ('starter-farm'::uuid, 'Fazenda Simples', 'farm', 'common', 0, 0, 0, 0, 'draw', 'Produz 1 comida quando ativada por dado.', true),
  ('starter-workshop'::uuid, 'Oficina Simples', 'city', 'common', 0, 0, 0, 0, 'draw', 'Produz 1 material por turno.', true),
  ('starter-shop'::uuid, 'Comércio Simples', 'action', 'common', 0, 0, 0, 0, 'action', 'Ganhe 1 moeda instantaneamente.', true)
ON CONFLICT (id) DO UPDATE SET
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

-- Atualizar a função handle_new_user para criar deck básico automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
  );
  
  -- Give starter cards to new user (28 cards total: 6 types with quantities)
  INSERT INTO public.player_cards (player_id, card_id, quantity)
  VALUES 
    (NEW.id, 'starter-garden', 6),     -- 6 Pequeno Jardim
    (NEW.id, 'starter-tent', 4),       -- 4 Barraca  
    (NEW.id, 'starter-harvest', 4),    -- 4 Colheita Básica
    (NEW.id, 'starter-farm', 5),       -- 5 Fazenda Simples
    (NEW.id, 'starter-workshop', 5),   -- 5 Oficina Simples
    (NEW.id, 'starter-shop', 4);       -- 4 Comércio Simples = 28 total

  -- Create default basic deck for new user
  INSERT INTO public.player_decks (player_id, name, card_ids, is_active)
  VALUES (
    NEW.id, 
    'Deck Básico', 
    ARRAY[
      'starter-garden', 'starter-garden', 'starter-garden', 'starter-garden', 'starter-garden', 'starter-garden',
      'starter-tent', 'starter-tent', 'starter-tent', 'starter-tent',
      'starter-harvest', 'starter-harvest', 'starter-harvest', 'starter-harvest',  
      'starter-farm', 'starter-farm', 'starter-farm', 'starter-farm', 'starter-farm',
      'starter-workshop', 'starter-workshop', 'starter-workshop', 'starter-workshop', 'starter-workshop',
      'starter-shop', 'starter-shop', 'starter-shop', 'starter-shop'
    ]::text[],
    true
  );
    
  RETURN NEW;
END;
$$;