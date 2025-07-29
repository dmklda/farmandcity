-- Criar tabela game_settings que está faltando

CREATE TABLE IF NOT EXISTS public.game_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_game_settings_key ON public.game_settings(setting_key);

-- Configurar RLS
ALTER TABLE public.game_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para game_settings (leitura pública, escrita apenas para admins)
DROP POLICY IF EXISTS "Anyone can view game settings" ON public.game_settings;
CREATE POLICY "Anyone can view game settings" ON public.game_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can modify game settings" ON public.game_settings;
CREATE POLICY "Admins can modify game settings" ON public.game_settings
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'marcior631@gmail.com'
  );

-- Inserir configuração global padrão
INSERT INTO public.game_settings (setting_key, setting_value, description)
VALUES (
  'global_config',
  '{
    "max_deck_size": 28,
    "min_deck_size": 10,
    "starter_deck_size": 38,
    "booster_pack_price": 100,
    "cards_per_booster": 5,
    "max_booster_packs_per_purchase": 10,
    "game_version": "1.0.0",
    "maintenance_mode": false,
    "allow_registration": true,
    "default_resources": {
      "coins": 50,
      "food": 20,
      "materials": 10,
      "population": 5
    }
  }'::jsonb,
  'Configurações globais do jogo'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Comentários
COMMENT ON TABLE public.game_settings IS 'Configurações globais do jogo';
COMMENT ON COLUMN public.game_settings.setting_key IS 'Chave da configuração';
COMMENT ON COLUMN public.game_settings.setting_value IS 'Valor da configuração em formato JSON'; 