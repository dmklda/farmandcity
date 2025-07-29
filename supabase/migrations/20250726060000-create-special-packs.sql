-- Packs Especiais Atrativos
-- ========================

-- 1. Pack "Deck Completo - Fazendeiro"
INSERT INTO public.shop_items (
  name, 
  description, 
  item_type, 
  price_coins, 
  price_gems, 
  currency_type, 
  rarity, 
  card_ids,
  guaranteed_cards,
  is_limited,
  stock_quantity,
  is_active,
  discount_percentage,
  is_daily_rotation
) VALUES (
  'Deck Completo - Fazendeiro',
  'Deck completo com 20 cartas de fazenda para dominar a agricultura! Inclui todas as fazendas básicas e avançadas.',
  'pack',
  1500,
  0,
  'coins',
  'rare',
  ARRAY[
    'fad6b4a0-f752-429b-9d8f-173a20ae0bab', -- Campo de Arroz
    'f86db4a1-9cda-44c9-8bcf-14d473d7d7e1', -- Fazenda Simples
    'd475fb06-42b1-4283-8c60-a9516122676e', -- Campo de Trigo
    '878cbf7b-695f-48eb-913e-36482d83cb72', -- Fazenda de Milho
    'f12ddfac-1e52-4151-99c8-f045f6adfc22', -- Pomar Simples
    'db594df3-4a6a-4375-ab06-6e384e0a98b6', -- Horta Comunitária
    'fe8a88d7-64a6-4394-b7f7-fbc2f73c77e7', -- Cultivo de Cogumelos
    '81e9faed-5949-4553-bfc1-b3f4021ee077', -- Rancho de Gado
    'eeada263-5ce0-4b2e-b287-47afbedabacd', -- Pequeno Jardim
    '9557c2c3-146f-4728-a873-fedd2ec0689b', -- Colmeia
    'fa8dfa3a-dc55-4ab2-a06e-982cdd6935ad', -- Plantação de Arroz
    'dc177b57-9c77-4143-b53e-1c78c2cf3cdd', -- Horta Média
    '35610551-2ee5-4875-b916-4329fb97a766', -- Pomar Exótico
    '2607bbd5-28bb-4ac1-84e5-8bf00b33f55e', -- Horta Hidropônica
    '44c0e580-d275-4afc-a91e-07a766af02de', -- Fazenda Grande
    'bc19349e-78e1-4722-ac14-4317ec7f5259', -- Vinhedo
    'db61905a-36a7-4f31-81db-c12c63b07b43', -- Fazenda Avançada
    'efd64c1c-2150-4106-87f5-2d0d5856d197', -- Colheita
    '8e8641c7-44aa-4fd2-9937-54e29e5d0cc5', -- Colheita Básica
    'fae0f422-53f8-43d5-91cb-a4fc9018c2bb'  -- Bênção da Terra
  ],
  '{"guaranteed_rarity": "rare", "min_rare_cards": 3, "min_uncommon_cards": 5}',
  true,
  50,
  true,
  0,
  false
);

-- 2. Pack "Deck Completo - Comerciante"
INSERT INTO public.shop_items (
  name, 
  description, 
  item_type, 
  price_coins, 
  price_gems, 
  currency_type, 
  rarity, 
  card_ids,
  guaranteed_cards,
  is_limited,
  stock_quantity,
  is_active,
  discount_percentage,
  is_daily_rotation
) VALUES (
  'Deck Completo - Comerciante',
  'Deck completo com 20 cartas de cidade para dominar o comércio! Inclui mercados, bancos e estruturas urbanas.',
  'pack',
  1800,
  0,
  'coins',
  'rare',
  ARRAY[
    'd9f60758-b4fc-4a20-814b-b79e9bbe7bb6', -- Comércio Simples
    '9f7c0fcc-4922-48d7-8674-2cc9efb08023', -- Mercado Local
    '3fe41c42-6058-474a-a3ba-33359c496339', -- Oficina Simples
    '6288c7dc-c3c2-48e5-9e65-64e28c2e6a44', -- Barraca
    'e38e69b3-6689-4ea3-bf1d-08db8393a030', -- Oficina Básica
    'e6a77c4d-6fb1-4874-91e9-07db0eb646cb', -- Casa
    '7e426c79-3b30-4126-8b3f-8ebc93075960', -- Escola Básica
    '344cc717-22bb-4112-bbb7-0438cd083a3e', -- Posto de Saúde
    '9dfd972f-d649-4efe-a94a-a1954d07766e', -- Cidade Média
    'efd698a7-647d-4f79-b52b-74564b3eca21', -- Feira de Artesanato
    '09dbf7bf-f606-4888-9c96-ea3e4f5bc271', -- Mercado
    '994e58e5-677c-42a1-93d3-3e468ea9f971', -- Mercado Central
    'd4ce8e3b-35cc-48f7-87a8-c8cb356fe0fc', -- Torre de Vigia
    '38c91821-0b2f-4c1b-9dcc-d4fbaa940c28', -- Cidade Próspera
    '8b6265e9-68a4-4516-9980-f3db94a5474d', -- Fábrica de Tijolos
    '7ea7ae53-313e-4bbe-8086-b98dbe3bbdb5', -- Banco Local
    '749c1c92-223d-46a0-923a-974dadc1cb6d', -- Troca Comercial
    '84a5fef1-d0ed-4b74-854e-9c49437c3a04', -- Comércio Básico
    'fd34a70c-170e-4d8c-a98b-d5cae2cc3063', -- Expedição de Comércio
    'fa9e5e99-f9cc-414e-830b-ab42f87cccdb'  -- Negócio Lucrativo
  ],
  '{"guaranteed_rarity": "rare", "min_rare_cards": 3, "min_uncommon_cards": 5}',
  true,
  50,
  true,
  0,
  false
);

-- 3. Boost Temático "Colheita Abundante"
INSERT INTO public.shop_items (
  name, 
  description, 
  item_type, 
  price_coins, 
  price_gems, 
  currency_type, 
  rarity, 
  card_ids,
  guaranteed_cards,
  is_limited,
  stock_quantity,
  is_active,
  discount_percentage,
  is_daily_rotation
) VALUES (
  'Boost Temático - Colheita Abundante',
  'Pack especial focado em produção de comida! Garantia de cartas de fazenda raras e ações de colheita.',
  'booster',
  800,
  0,
  'coins',
  'rare',
  ARRAY[
    '35610551-2ee5-4875-b916-4329fb97a766', -- Pomar Exótico
    '2607bbd5-28bb-4ac1-84e5-8bf00b33f55e', -- Horta Hidropônica
    '44c0e580-d275-4afc-a91e-07a766af02de', -- Fazenda Grande
    'bc19349e-78e1-4722-ac14-4317ec7f5259', -- Vinhedo
    'db61905a-36a7-4f31-81db-c12c63b07b43', -- Fazenda Avançada
    'efd64c1c-2150-4106-87f5-2d0d5856d197', -- Colheita
    '8e8641c7-44aa-4fd2-9937-54e29e5d0cc5', -- Colheita Básica
    'fae0f422-53f8-43d5-91cb-a4fc9018c2bb', -- Bênção da Terra
    'a3c9f12b-e2c7-4632-be84-7b320f08d8ab', -- Magia do Crescimento
    '50ac985f-3162-4efb-b30f-fc015d7a3a73', -- Bênção do Sol
    '5bcd1ee5-bc95-42fd-aa76-310b6998b7d5', -- Feitiço de Crescimento
    '4c72ab22-5a3f-4e56-8b7b-df8c79a98137', -- Magia de Crescimento
    'b2f614dc-42b6-4cb0-92cc-3ef214cc6d8c', -- Chuva Mágica
    'aefbcd2d-249f-4408-bb34-3610a6c3bcaa'  -- Festival da Colheita
  ],
  '{"guaranteed_rarity": "rare", "min_rare_cards": 2, "min_farm_cards": 3, "min_food_production": true}',
  true,
  100,
  true,
  10,
  false
);

-- 4. Boost Temático "Magia Poderosa"
INSERT INTO public.shop_items (
  name, 
  description, 
  item_type, 
  price_coins, 
  price_gems, 
  currency_type, 
  rarity, 
  card_ids,
  guaranteed_cards,
  is_limited,
  stock_quantity,
  is_active,
  discount_percentage,
  is_daily_rotation
) VALUES (
  'Boost Temático - Magia Poderosa',
  'Pack mágico com feitiços poderosos! Garantia de cartas mágicas raras e lendárias.',
  'booster',
  1200,
  0,
  'coins',
  'legendary',
  ARRAY[
    '4c72ab22-5a3f-4e56-8b7b-df8c79a98137', -- Magia de Crescimento
    '87b68ed1-9d98-454a-b8d4-de28b1786e65', -- Feitiço Poderoso
    'c94c3628-27ba-4c80-a535-cd516a8d2c76', -- Transmutação de Recursos
    'b2f614dc-42b6-4cb0-92cc-3ef214cc6d8c', -- Chuva Mágica
    '78ceef4d-ff45-4977-86d7-a8bf43bf5e18', -- Magia de Cura
    '2f2bd412-e6c0-4f14-9750-ee24a3f8d381', -- Portal Dimensional (secret)
    'e90fea38-6909-412f-a1d3-a76aa05a7f19', -- Portal Dimensional (legendary)
    'fae0f422-53f8-43d5-91cb-a4fc9018c2bb', -- Bênção da Terra
    'a3c9f12b-e2c7-4632-be84-7b320f08d8ab', -- Magia do Crescimento
    '494a5fe4-3edf-499b-9642-91e8d24a1f4f', -- Chama do Trabalho
    '50ac985f-3162-4efb-b30f-fc015d7a3a73', -- Bênção do Sol
    '5bcd1ee5-bc95-42fd-aa76-310b6998b7d5', -- Feitiço de Crescimento
    '5b0e97d6-8e58-4486-b681-8ff2cc5466c1'  -- Feitiço Médio
  ],
  '{"guaranteed_rarity": "legendary", "min_legendary_cards": 1, "min_magic_cards": 4, "chance_secret": 0.1}',
  true,
  75,
  true,
  15,
  false
);

-- 5. Pack Especial "Defensor da Cidade"
INSERT INTO public.shop_items (
  name, 
  description, 
  item_type, 
  price_coins, 
  price_gems, 
  currency_type, 
  rarity, 
  card_ids,
  guaranteed_cards,
  is_limited,
  stock_quantity,
  is_active,
  discount_percentage,
  is_daily_rotation
) VALUES (
  'Pack Especial - Defensor da Cidade',
  'Pack defensivo com armadilhas e estruturas de defesa! Ideal para proteger sua cidade de ataques.',
  'pack',
  1000,
  0,
  'coins',
  'rare',
  ARRAY[
    'ce1f4b7c-5270-4458-9bf2-60af3e2c093a', -- Rede de Defesa
    '0c2f031c-91fb-47e8-a394-0792301b2381', -- Muro de Palha
    '1f847533-11fd-4bb1-83a2-552ba88492d9', -- Cão de Guarda
    'f88140b5-6f1c-4fab-98ab-dd228fd3d1fa', -- Torre de Defesa
    'f715e18a-4830-4c52-9f03-addaec52b346', -- Muralha de Pedra
    'e7444bf0-d971-4e6e-9fd7-727778b69572', -- Barricada
    '77ec5d65-6b6e-41c2-bc0d-78b139d60dde', -- Muralha de Pedra (rare)
    'bce9293f-3cec-4faf-b22b-dba4bd853ab1', -- Fortaleza
    '329e5f6f-4b88-4cf7-be4e-b840db3e1350', -- Escudo Mágico
    'f84f69f7-c517-4ed5-8cd1-34e74eccee78', -- Poço Raso
    '641fb54a-b2d6-45f9-8cec-87182e8becd2', -- Armadilha de Gelo
    '5eaf6e96-627a-4115-b57e-8ae24b459e38', -- Armadilha Explosiva
    '28fb7d56-294e-4359-b9e1-c8489ebe6644', -- Mina Explosiva
    '08aadc36-666f-4eb0-92aa-891e904d3e18', -- Colapso Estrutural
    'd1413a02-9b18-43bb-aedc-ecf141451a08', -- Armadilha de Fossa
    '401e5893-90be-449d-b961-77a94ac529e6'  -- Armadilha de Rede
  ],
  '{"guaranteed_rarity": "ultra", "min_ultra_cards": 1, "min_defense_cards": 5, "min_trap_cards": 3}',
  true,
  60,
  true,
  20,
  false
);

-- 6. Pack Premium "Coleção Lendária"
INSERT INTO public.shop_items (
  name, 
  description, 
  item_type, 
  price_coins, 
  price_gems, 
  currency_type, 
  rarity, 
  card_ids,
  guaranteed_cards,
  is_limited,
  stock_quantity,
  is_active,
  discount_percentage,
  is_daily_rotation
) VALUES (
  'Pack Premium - Coleção Lendária',
  'Pack premium com cartas lendárias e secretas! A chance de obter as cartas mais raras do jogo.',
  'pack',
  0,
  500,
  'gems',
  'secret',
  ARRAY[
    '80e3acfa-efaa-4fd6-bebe-8403248ca459', -- Palácio Real (secret)
    'de3c2342-7bde-4a29-b19e-d205811fe3ec', -- Grande Biblioteca (secret)
    '5d9b26a6-54c9-4408-a808-00572782a64b', -- Torre do Relógio (legendary)
    '8e50417a-4e23-44cd-af8e-ce616603ba84', -- Obelisco Antigo (legendary)
    'a2c2c4f8-93ab-4d4a-893d-fcf5c5761529', -- Jardim Suspenso (legendary)
    '587bac87-4031-4637-8a3a-1060fdf37580', -- Portão da Cidade (legendary)
    '94b70df3-b388-4e75-a6e3-228a41cb3e0a', -- Grande Biblioteca (legendary)
    'fc3825c6-7c9e-4d7c-8267-bc8c7e4d3726', -- Festival da Prosperidade (legendary)
    '2f2bd412-e6c0-4f14-9750-ee24a3f8d381', -- Portal Dimensional (secret)
    'e90fea38-6909-412f-a1d3-a76aa05a7f19', -- Portal Dimensional (legendary)
    '5d806f1b-0354-4734-b253-e5497f6f9fbc', -- Inovação Tecnológica (secret)
    '7ea7ae53-313e-4bbe-8086-b98dbe3bbdb5', -- Banco Local (ultra)
    '329e5f6f-4b88-4cf7-be4e-b840db3e1350', -- Escudo Mágico (ultra)
    'd1413a02-9b18-43bb-aedc-ecf141451a08', -- Armadilha de Fossa (ultra)
    '401e5893-90be-449d-b961-77a94ac529e6'  -- Armadilha de Rede (ultra)
  ],
  '{"guaranteed_rarity": "legendary", "min_legendary_cards": 2, "chance_secret": 0.3, "min_ultra_cards": 1}',
  true,
  25,
  true,
  0,
  false
);

-- 7. Pack Limitado "Festival Especial"
INSERT INTO public.shop_items (
  name, 
  description, 
  item_type, 
  price_coins, 
  price_gems, 
  currency_type, 
  rarity, 
  card_ids,
  guaranteed_cards,
  is_limited,
  stock_quantity,
  is_active,
  discount_percentage,
  is_daily_rotation
) VALUES (
  'Pack Limitado - Festival Especial',
  'Pack limitado com cartas de eventos especiais! Apenas 30 unidades disponíveis.',
  'pack',
  600,
  0,
  'coins',
  'rare',
  ARRAY[
    '968841d6-2b59-4124-b9a0-bef462de34e3', -- Chuva Leve
    'aefbcd2d-249f-4408-bb34-3610a6c3bcaa', -- Festival da Colheita
    'd5d9bd5f-299b-4912-964f-6f974a46de63', -- Festival Nacional
    'fc3825c6-7c9e-4d7c-8267-bc8c7e4d3726', -- Festival da Prosperidade
    'dce19c49-2130-45e7-81dc-7b4018ffd271', -- Invasão de Bandidos
    'b2d4a4f8-cd24-46cd-b0d3-f15043a22a75', -- Tempestade Repentina
    '1e0f8fb3-435c-44da-99a4-216e3e8a8d73', -- Crise Econômica
    '2f636019-e00c-4148-9b15-b4d710b19100', -- Estátua Simples
    '5d9b26a6-54c9-4408-a808-00572782a64b', -- Torre do Relógio
    '8e50417a-4e23-44cd-af8e-ce616603ba84'  -- Obelisco Antigo
  ],
  '{"guaranteed_rarity": "rare", "min_event_cards": 3, "min_landmark_cards": 1, "chance_legendary": 0.2}',
  true,
  30,
  true,
  25,
  false
);

-- 8. Pack "Starter Plus" (Melhorado)
INSERT INTO public.shop_items (
  name, 
  description, 
  item_type, 
  price_coins, 
  price_gems, 
  currency_type, 
  rarity, 
  card_ids,
  guaranteed_cards,
  is_limited,
  stock_quantity,
  is_active,
  discount_percentage,
  is_daily_rotation
) VALUES (
  'Pack Starter Plus',
  'Pack melhorado para iniciantes! Cartas básicas + algumas raras para começar bem no jogo.',
  'pack',
  300,
  0,
  'coins',
  'uncommon',
  ARRAY[
    'f86db4a1-9cda-44c9-8bcf-14d473d7d7e1', -- Fazenda Simples
    'd475fb06-42b1-4283-8c60-a9516122676e', -- Campo de Trigo
    'e6a77c4d-6fb1-4874-91e9-07db0eb646cb', -- Casa
    '9f7c0fcc-4922-48d7-8674-2cc9efb08023', -- Mercado Local
    'efd64c1c-2150-4106-87f5-2d0d5856d197', -- Colheita
    '749c1c92-223d-46a0-923a-974dadc1cb6d', -- Troca Comercial
    'fae0f422-53f8-43d5-91cb-a4fc9018c2bb', -- Bênção da Terra
    'ce1f4b7c-5270-4458-9bf2-60af3e2c093a', -- Rede de Defesa
    '9557c2c3-146f-4728-a873-fedd2ec0689b', -- Colmeia
    '344cc717-22bb-4112-bbb7-0438cd083a3e', -- Posto de Saúde
    'daf773ca-d023-4db0-b158-47c3a5400a4a', -- Trabalho Extra
    '50ac985f-3162-4efb-b30f-fc015d7a3a73', -- Bênção do Sol
    'f88140b5-6f1c-4fab-98ab-dd228fd3d1fa', -- Torre de Defesa
    'aefbcd2d-249f-4408-bb34-3610a6c3bcaa', -- Festival da Colheita
    '2f636019-e00c-4148-9b15-b4d710b19100'  -- Estátua Simples
  ],
  '{"guaranteed_rarity": "uncommon", "min_uncommon_cards": 4, "balanced_types": true, "new_player_friendly": true}',
  false,
  null,
  true,
  0,
  false
);

-- 9. Pack "Crise e Sobrevivência"
INSERT INTO public.shop_items (
  name, 
  description, 
  item_type, 
  price_coins, 
  price_gems, 
  currency_type, 
  rarity, 
  card_ids,
  guaranteed_cards,
  is_limited,
  stock_quantity,
  is_active,
  discount_percentage,
  is_daily_rotation
) VALUES (
  'Pack Crise e Sobrevivência',
  'Pack com cartas de crise e defesa! Para jogadores que gostam de desafios extremos.',
  'pack',
  900,
  0,
  'coins',
  'crisis',
  ARRAY[
    'dce19c49-2130-45e7-81dc-7b4018ffd271', -- Invasão de Bandidos
    'b2d4a4f8-cd24-46cd-b0d3-f15043a22a75', -- Tempestade Repentina
    '1e0f8fb3-435c-44da-99a4-216e3e8a8d73', -- Crise Econômica
    'bce9293f-3cec-4faf-b22b-dba4bd853ab1', -- Fortaleza
    '329e5f6f-4b88-4cf7-be4e-b840db3e1350', -- Escudo Mágico
    'd1413a02-9b18-43bb-aedc-ecf141451a08', -- Armadilha de Fossa
    '401e5893-90be-449d-b961-77a94ac529e6', -- Armadilha de Rede
    '08aadc36-666f-4eb0-92aa-891e904d3e18', -- Colapso Estrutural
    '28fb7d56-294e-4359-b9e1-c8489ebe6644', -- Mina Explosiva
    '78ceef4d-ff45-4977-86d7-a8bf43bf5e18', -- Magia de Cura
    'c94c3628-27ba-4c80-a535-cd516a8d2c76', -- Transmutação de Recursos
    '5d806f1b-0354-4734-b253-e5497f6f9fbc'  -- Inovação Tecnológica
  ],
  '{"guaranteed_rarity": "ultra", "min_crisis_cards": 3, "min_defense_cards": 4, "min_magic_cards": 2, "high_difficulty": true}',
  true,
  40,
  true,
  0,
  false
);

-- 10. Pack "Coleção Completa - Ações"
INSERT INTO public.shop_items (
  name, 
  description, 
  item_type, 
  price_coins, 
  price_gems, 
  currency_type, 
  rarity, 
  card_ids,
  guaranteed_cards,
  is_limited,
  stock_quantity,
  is_active,
  discount_percentage,
  is_daily_rotation
) VALUES (
  'Coleção Completa - Ações',
  'Todas as cartas de ação do jogo! Para jogadores que querem dominar as ações estratégicas.',
  'pack',
  1200,
  0,
  'coins',
  'rare',
  ARRAY[
    'efd64c1c-2150-4106-87f5-2d0d5856d197', -- Colheita
    '749c1c92-223d-46a0-923a-974dadc1cb6d', -- Troca Comercial
    'acc87121-016c-4287-9cda-c75685255783', -- Contratar Trabalhadores
    '8e8641c7-44aa-4fd2-9937-54e29e5d0cc5', -- Colheita Básica
    '84a5fef1-d0ed-4b74-854e-9c49437c3a04', -- Comércio Básico
    'ba03703c-349e-475c-99f2-8c9539ed9ab7', -- Construção Rápida
    '03d1d971-839e-43c7-8e9e-176d56dba9e9', -- Trabalho em Equipe
    'daf773ca-d023-4db0-b158-47c3a5400a4a', -- Trabalho Extra
    'fd34a70c-170e-4d8c-a98b-d5cae2cc3063', -- Expedição de Comércio
    'fa9e5e99-f9cc-414e-830b-ab42f87cccdb', -- Negócio Lucrativo
    '5d806f1b-0354-4734-b253-e5497f6f9fbc'  -- Inovação Tecnológica
  ],
  '{"guaranteed_rarity": "rare", "min_rare_cards": 2, "all_action_cards": true, "strategic_focus": true}',
  true,
  80,
  true,
  10,
  false
);

-- Atualizar a tabela shop_items para incluir novos campos
ALTER TABLE public.shop_items 
ADD COLUMN IF NOT EXISTS pack_type TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS pack_conditions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS max_purchases_per_user INTEGER,
ADD COLUMN IF NOT EXISTS purchase_time_limit TIMESTAMP WITH TIME ZONE;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_shop_items_pack_type ON public.shop_items(pack_type);
CREATE INDEX IF NOT EXISTS idx_shop_items_rarity ON public.shop_items(rarity);
CREATE INDEX IF NOT EXISTS idx_shop_items_is_limited ON public.shop_items(is_limited);
CREATE INDEX IF NOT EXISTS idx_shop_items_is_active ON public.shop_items(is_active); 