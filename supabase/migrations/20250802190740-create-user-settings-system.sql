-- Criar tabela de configurações do usuário
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'dark',
  language TEXT DEFAULT 'pt-BR',
  notifications_enabled BOOLEAN DEFAULT true,
  sound_enabled BOOLEAN DEFAULT true,
  music_enabled BOOLEAN DEFAULT true,
  auto_save_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Criar tabela de customizações de campo de batalha
CREATE TABLE IF NOT EXISTS battlefield_customizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  rarity TEXT DEFAULT 'common',
  price_coins INTEGER DEFAULT 0,
  price_gems INTEGER DEFAULT 0,
  currency_type TEXT DEFAULT 'coins',
  is_active BOOLEAN DEFAULT true,
  is_special BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de customizações do usuário
CREATE TABLE IF NOT EXISTS user_customizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customization_id UUID REFERENCES battlefield_customizations(id) ON DELETE CASCADE,
  is_equipped BOOLEAN DEFAULT false,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, customization_id)
);

-- Inserir customizações padrão
INSERT INTO battlefield_customizations (name, description, image_url, rarity, price_coins, price_gems) VALUES
('Campo Clássico', 'O campo de batalha tradicional do reino', '/assets/battlefields/classic.jpg', 'common', 0, 0),
('Floresta Encantada', 'Um campo cercado por árvores místicas', '/assets/battlefields/forest.jpg', 'rare', 1000, 0),
('Montanha Sagrada', 'Altos picos com vistas deslumbrantes', '/assets/battlefields/mountain.jpg', 'epic', 0, 50),
('Castelo Real', 'O campo de batalha dos nobres', '/assets/battlefields/castle.jpg', 'legendary', 5000, 100)
ON CONFLICT DO NOTHING;

-- Criar políticas RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE battlefield_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_customizations ENABLE ROW LEVEL SECURITY;

-- Políticas para user_settings
CREATE POLICY "Users can view their own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para battlefield_customizations (todos podem ver)
CREATE POLICY "Anyone can view battlefield customizations" ON battlefield_customizations
  FOR SELECT USING (true);

-- Políticas para user_customizations
CREATE POLICY "Users can view their own customizations" ON user_customizations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customizations" ON user_customizations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customizations" ON user_customizations
  FOR UPDATE USING (auth.uid() = user_id); 