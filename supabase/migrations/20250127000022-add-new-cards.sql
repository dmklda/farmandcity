-- Adicionar novas cartas interessantes e necessárias
-- Data: 2025-01-27

-- === CARTAS DE FARM (PRODUÇÃO DE COMIDA) ===

-- Fazenda de Milho
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Fazenda de Milho',
  'fazenda-de-milho',
  'farm',
  'common',
  'action',
  'Produz 2 comida por turno. Se você tiver 3 ou mais fazendas, produz 3 comida por turno.',
  'food_production_conditional',
  1, 0, 1, 0,
  false, false, true, 1,
  ARRAY['produção', 'comida', 'milho'],
  NOW(), NOW()
);

-- Horta Hidropônica
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Horta Hidropônica',
  'horta-hidroponica',
  'farm',
  'rare',
  'action',
  'Produz 4 comida por turno. Custa 1 material por turno para manter.',
  'food_production_costly',
  3, 0, 2, 0,
  false, false, true, 1,
  ARRAY['produção', 'comida', 'tecnologia'],
  NOW(), NOW()
);

-- Plantação de Arroz
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Plantação de Arroz',
  'plantacao-de-arroz',
  'farm',
  'uncommon',
  'action',
  'Produz 3 comida por turno. Se você tiver água (poço), produz 4 comida por turno.',
  'food_production_water_bonus',
  2, 0, 1, 0,
  false, false, true, 1,
  ARRAY['produção', 'comida', 'arroz', 'água'],
  NOW(), NOW()
);

-- === CARTAS DE CITY (PRODUÇÃO DE MOEDAS) ===

-- Mercado Central
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Mercado Central',
  'mercado-central',
  'city',
  'rare',
  'action',
  'Produz 3 moedas por turno. Para cada fazenda que você tem, produz +1 moeda adicional.',
  'coin_production_farm_bonus',
  2, 1, 2, 1,
  false, false, true, 1,
  ARRAY['produção', 'moedas', 'mercado', 'comércio'],
  NOW(), NOW()
);

-- Banco Local
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Banco Local',
  'banco-local',
  'city',
  'ultra',
  'action',
  'Produz 2 moedas por turno. No final do turno, ganha 1 moeda para cada 5 moedas que você tem.',
  'coin_production_interest',
  5, 0, 3, 2,
  false, false, true, 1,
  ARRAY['produção', 'moedas', 'banco', 'juros'],
  NOW(), NOW()
);

-- Feira de Artesanato
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Feira de Artesanato',
  'feira-de-artesanato',
  'city',
  'uncommon',
  'action',
  'Produz 2 moedas por turno. Se você tiver 2 ou mais oficinas, produz 3 moedas por turno.',
  'coin_production_workshop_bonus',
  1, 0, 2, 0,
  false, false, true, 1,
  ARRAY['produção', 'moedas', 'artesanato', 'feira'],
  NOW(), NOW()
);

-- === CARTAS DE MAGIC (EFEITOS MÁGICOS) ===

-- Feitiço de Crescimento
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Feitiço de Crescimento',
  'feitico-de-crescimento',
  'magic',
  'uncommon',
  'action',
  'Todas as suas fazendas produzem +1 comida neste turno.',
  'boost_farm_production',
  2, 1, 0, 0,
  false, false, true, 1,
  ARRAY['magia', 'boost', 'crescimento', 'fazenda'],
  NOW(), NOW()
);

-- Transmutação de Recursos
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Transmutação de Recursos',
  'transmutacao-de-recursos',
  'magic',
  'rare',
  'action',
  'Converta 3 comida em 2 materiais ou 2 materiais em 3 comida.',
  'resource_conversion',
  1, 0, 0, 0,
  false, false, true, 1,
  ARRAY['magia', 'conversão', 'recursos', 'transmutação'],
  NOW(), NOW()
);

-- Portal Dimensional
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Portal Dimensional',
  'portal-dimensional',
  'magic',
  'legendary',
  'action',
  'Rouba 1 carta aleatória da mão do oponente. Se não houver cartas, ganha 2 moedas.',
  'steal_card_or_gain_coins',
  4, 2, 2, 1,
  false, false, true, 1,
  ARRAY['magia', 'roubo', 'portal', 'dimensional'],
  NOW(), NOW()
);

-- === CARTAS DE ACTION (AÇÕES ESPECIAIS) ===

-- Expedição de Comércio
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Expedição de Comércio',
  'expedicao-de-comercio',
  'action',
  'uncommon',
  'action',
  'Ganha 3 moedas. Se você tiver uma cidade, ganha 5 moedas em vez disso.',
  'gain_coins_city_bonus',
  0, 1, 0, 0,
  false, false, true, 1,
  ARRAY['ação', 'comércio', 'expedição', 'moedas'],
  NOW(), NOW()
);

-- Trabalho em Equipe
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Trabalho em Equipe',
  'trabalho-em-equipe',
  'action',
  'common',
  'action',
  'Ganha 1 material. Se você tiver 2 ou mais trabalhadores, ganha 2 materiais.',
  'gain_materials_worker_bonus',
  0, 0, 0, 1,
  false, false, true, 1,
  ARRAY['ação', 'trabalho', 'equipe', 'materiais'],
  NOW(), NOW()
);

-- Inovação Tecnológica
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Inovação Tecnológica',
  'inovacao-tecnologica',
  'action',
  'secret',
  'action',
  'Todas as suas construções produzem +1 recurso neste turno. Custa 2 materiais para ativar.',
  'boost_all_production_costly',
  3, 0, 2, 1,
  false, false, true, 1,
  ARRAY['ação', 'tecnologia', 'inovação', 'boost'],
  NOW(), NOW()
);

-- === CARTAS DE DEFENSE (PROTEÇÃO) ===

-- Muralha de Pedra
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Muralha de Pedra',
  'muralha-de-pedra',
  'defense',
  'rare',
  'reaction',
  'Bloqueia o próximo ataque do oponente. Se você tiver 3 ou mais defesas, bloqueia 2 ataques.',
  'block_attacks_defense_bonus',
  2, 0, 3, 0,
  true, false, true, 1,
  ARRAY['defesa', 'muralha', 'bloqueio', 'pedra'],
  NOW(), NOW()
);

-- Escudo Mágico
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Escudo Mágico',
  'escudo-magico',
  'defense',
  'ultra',
  'reaction',
  'Bloqueia qualquer ataque e reflete 1 dano de volta ao oponente.',
  'block_and_reflect_damage',
  3, 1, 1, 0,
  true, false, true, 1,
  ARRAY['defesa', 'magia', 'escudo', 'reflexão'],
  NOW(), NOW()
);

-- === CARTAS DE TRAP (ARMADILHAS) ===

-- Armadilha de Gelo
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Armadilha de Gelo',
  'armadilha-de-gelo',
  'trap',
  'uncommon',
  'reaction',
  'Quando ativada, o oponente perde 2 moedas e não pode jogar cartas de ação no próximo turno.',
  'freeze_opponent_actions',
  1, 0, 1, 0,
  true, false, true, 1,
  ARRAY['armadilha', 'gelo', 'congelamento', 'controle'],
  NOW(), NOW()
);

-- Mina Explosiva
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Mina Explosiva',
  'mina-explosiva',
  'trap',
  'rare',
  'reaction',
  'Quando ativada, causa 3 danos ao oponente e destrói uma carta aleatória da mão dele.',
  'damage_and_destroy_card',
  2, 0, 2, 0,
  true, false, true, 1,
  ARRAY['armadilha', 'explosão', 'dano', 'destruição'],
  NOW(), NOW()
);

-- === CARTAS DE EVENT (EVENTOS) ===

-- Festival da Prosperidade
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Festival da Prosperidade',
  'festival-da-prosperidade',
  'event',
  'legendary',
  'action',
  'Todas as suas construções produzem o dobro de recursos neste turno. Dura 2 turnos.',
  'double_production_duration',
  5, 2, 2, 2,
  false, false, true, 1,
  ARRAY['evento', 'festival', 'prosperidade', 'boost'],
  NOW(), NOW()
);

-- Crise Econômica
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Crise Econômica',
  'crise-economica',
  'event',
  'crisis',
  'action',
  'Todos os jogadores perdem metade de suas moedas. Você ganha 1 moeda para cada 3 moedas perdidas.',
  'economic_crisis_steal',
  0, 0, 0, 0,
  false, false, true, 1,
  ARRAY['evento', 'crise', 'econômica', 'roubo'],
  NOW(), NOW()
);

-- === CARTAS DE LANDMARK (MARCO HISTÓRICO) ===

-- Torre do Relógio
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Torre do Relógio',
  'torre-do-relogio',
  'landmark',
  'legendary',
  'action',
  'No início de cada turno, ganha 1 moeda. Se você tiver 10 ou mais moedas, ganha 2 moedas em vez disso.',
  'passive_coin_generation_wealth_bonus',
  8, 3, 5, 3,
  false, false, true, 0,
  ARRAY['marco', 'torre', 'relógio', 'passivo'],
  NOW(), NOW()
);

-- Grande Biblioteca
INSERT INTO cards (id, name, slug, type, rarity, phase, effect, effect_logic, cost_coins, cost_food, cost_materials, cost_population, is_reactive, is_starter, is_active, use_per_turn, tags, created_at, updated_at) VALUES (
  gen_random_uuid(),
  'Grande Biblioteca',
  'grande-biblioteca',
  'landmark',
  'secret',
  'action',
  'Permite jogar uma carta adicional por turno. Se você tiver 5 ou mais cartas na mão, pode jogar 2 cartas adicionais.',
  'extra_card_plays_hand_bonus',
  10, 5, 8, 5,
  false, false, true, 0,
  ARRAY['marco', 'biblioteca', 'cartas', 'extra'],
  NOW(), NOW()
); 