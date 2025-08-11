-- Criar tabela para armazenar vitórias dos usuários
CREATE TABLE IF NOT EXISTS user_victories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  victory_mode TEXT NOT NULL,
  victory_type TEXT,
  victory_value INTEGER,
  turn_count INTEGER,
  total_resources INTEGER,
  production_per_turn INTEGER,
  cards_lost INTEGER DEFAULT 0,
  catastrophes_survived INTEGER DEFAULT 0,
  game_mode TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_victories_user_id ON user_victories(user_id);
CREATE INDEX IF NOT EXISTS idx_user_victories_victory_mode ON user_victories(victory_mode);
CREATE INDEX IF NOT EXISTS idx_user_victories_timestamp ON user_victories(timestamp);

-- Habilitar RLS
ALTER TABLE user_victories ENABLE ROW LEVEL SECURITY;

-- Política RLS: usuários só podem ver suas próprias vitórias
CREATE POLICY "Users can view own victories" ON user_victories
  FOR SELECT USING (auth.uid() = user_id);

-- Política RLS: usuários só podem inserir suas próprias vitórias
CREATE POLICY "Users can insert own victories" ON user_victories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política RLS: usuários só podem atualizar suas próprias vitórias
CREATE POLICY "Users can update own victories" ON user_victories
  FOR UPDATE USING (auth.uid() = user_id);

-- Política RLS: usuários só podem deletar suas próprias vitórias
CREATE POLICY "Users can delete own victories" ON user_victories
  FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_user_victories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamp
CREATE TRIGGER update_user_victories_updated_at
  BEFORE UPDATE ON user_victories
  FOR EACH ROW
  EXECUTE FUNCTION update_user_victories_updated_at();
