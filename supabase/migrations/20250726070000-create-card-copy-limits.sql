-- Create card_copy_limits table
CREATE TABLE IF NOT EXISTS card_copy_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rarity TEXT NOT NULL UNIQUE,
  max_copies INTEGER NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert copy limits based on rarity
INSERT INTO card_copy_limits (rarity, max_copies, description) VALUES
  ('common', 4, 'Cartas comuns: máximo 4 cópias por deck'),
  ('uncommon', 3, 'Cartas incomuns: máximo 3 cópias por deck'),
  ('rare', 2, 'Cartas raras: máximo 2 cópias por deck'),
  ('ultra', 2, 'Cartas ultra raras: máximo 2 cópias por deck'),
  ('secret', 1, 'Cartas secretas: máximo 1 cópia por deck'),
  ('legendary', 1, 'Cartas lendárias: máximo 1 cópia por deck'),
  ('crisis', 1, 'Cartas de crise: máximo 1 cópia por deck'),
  ('booster', 1, 'Cartas booster: máximo 1 cópia por deck')
ON CONFLICT (rarity) DO UPDATE SET
  max_copies = EXCLUDED.max_copies,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_card_copy_limits_updated_at
  BEFORE UPDATE ON card_copy_limits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 