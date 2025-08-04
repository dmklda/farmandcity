-- Adicionar customizações padrão de containers como compradas por padrão para todos os usuários
-- Esta migração garante que todos os usuários tenham acesso às customizações básicas de containers

-- Primeiro, vamos garantir que as customizações padrão existam
INSERT INTO container_customizations (id, name, description, image_url, container_type, rarity, price_coins, price_gems, is_active, is_special, created_at)
VALUES 
  (gen_random_uuid(), 'Cidade Medieval', 'Uma cidade medieval tradicional com torres e muralhas', '/src/assets/grids_background/City_background.png', 'city', 'common', 0, 0, true, false, NOW()),
  (gen_random_uuid(), 'Fazenda Tradicional', 'Uma fazenda rural com campos e celeiros', '/src/assets/grids_background/Farm_background.png', 'farm', 'common', 0, 0, true, false, NOW()),
  (gen_random_uuid(), 'Marco Histórico', 'Um marco histórico importante da região', '/src/assets/grids_background/Landmark_background.png', 'landmark', 'common', 0, 0, true, false, NOW()),
  (gen_random_uuid(), 'Festival Local', 'Um festival local animado com decorações', '/src/assets/grids_background/Events_background.png', 'events', 'common', 0, 0, true, false, NOW())
ON CONFLICT (name, container_type) DO NOTHING;

-- Agora vamos dar essas customizações para todos os usuários existentes
-- Primeiro, vamos pegar os IDs das customizações padrão
WITH default_customizations AS (
  SELECT id, container_type 
  FROM container_customizations 
  WHERE name IN ('Cidade Medieval', 'Fazenda Tradicional', 'Marco Histórico', 'Festival Local')
    AND price_coins = 0 AND price_gems = 0
),
all_users AS (
  SELECT id FROM auth.users
)
INSERT INTO user_container_customizations (user_id, customization_id, container_type, is_equipped, purchased_at)
SELECT 
  u.id as user_id,
  dc.id as customization_id,
  dc.container_type,
  CASE 
    WHEN dc.container_type = 'city' THEN true  -- Cidade é equipada por padrão
    ELSE false
  END as is_equipped,
  NOW() as purchased_at
FROM all_users u
CROSS JOIN default_customizations dc
WHERE NOT EXISTS (
  SELECT 1 FROM user_container_customizations ucc 
  WHERE ucc.user_id = u.id AND ucc.customization_id = dc.id
);

-- Criar uma função para dar customizações padrão para novos usuários
CREATE OR REPLACE FUNCTION give_default_container_customizations()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir customizações padrão para o novo usuário
  INSERT INTO user_container_customizations (user_id, customization_id, container_type, is_equipped, purchased_at)
  SELECT 
    NEW.id as user_id,
    cc.id as customization_id,
    cc.container_type,
    CASE 
      WHEN cc.container_type = 'city' THEN true  -- Cidade é equipada por padrão
      ELSE false
    END as is_equipped,
    NOW() as purchased_at
  FROM container_customizations cc
  WHERE cc.name IN ('Cidade Medieval', 'Fazenda Tradicional', 'Marco Histórico', 'Festival Local')
    AND cc.price_coins = 0 AND cc.price_gems = 0
    AND cc.is_active = true;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para novos usuários
DROP TRIGGER IF EXISTS trigger_give_default_container_customizations ON auth.users;
CREATE TRIGGER trigger_give_default_container_customizations
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION give_default_container_customizations(); 