-- Insert test data for booster_packs
INSERT INTO public.booster_packs (name, description, price_coins, cards_count, guaranteed_rarity, is_active) VALUES
('Pack Básico', 'Pack com 3 cartas aleatórias', 100, 3, 'common', true),
('Pack Raro', 'Pack com 3 cartas, garantia de 1 rara', 250, 3, 'rare', true),
('Pack Lendário', 'Pack com 3 cartas, chance de lendária', 500, 3, 'legendary', true),
('Pack Ultra', 'Pack com 3 cartas, chance de ultra rara', 750, 3, 'ultra', true),
('Pack Secreto', 'Pack com 3 cartas, chance de secreta', 1000, 3, 'secret', true); 