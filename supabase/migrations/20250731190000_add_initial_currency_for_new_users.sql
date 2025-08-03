-- Migração: Adicionar moedas iniciais para novos usuários
-- Data: 2025-07-31
-- Descrição: Todo usuário que criar uma conta receberá automaticamente 100 moedas e 10 gemas

-- Função para dar moedas iniciais aos novos usuários
CREATE OR REPLACE FUNCTION give_initial_currency()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir moedas iniciais (100 coins e 10 gems)
  INSERT INTO player_currency (player_id, coins, gems, experience_points, level, created_at, updated_at)
  VALUES (NEW.id, 100, 10, 0, 1, NOW(), NOW())
  ON CONFLICT (player_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para executar a função quando um novo usuário for criado
DROP TRIGGER IF EXISTS trigger_give_initial_currency ON auth.users;
CREATE TRIGGER trigger_give_initial_currency
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION give_initial_currency();

-- Função para testar manualmente a atribuição de moedas iniciais
CREATE OR REPLACE FUNCTION test_initial_currency(user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Inserir moedas iniciais para um usuário específico
  INSERT INTO player_currency (player_id, coins, gems, experience_points, level, created_at, updated_at)
  VALUES (user_id, 100, 10, 0, 1, NOW(), NOW())
  ON CONFLICT (player_id) 
  DO UPDATE SET 
    coins = 100,
    gems = 10,
    updated_at = NOW();
  
  RAISE NOTICE 'Moedas iniciais atribuídas para o usuário %', user_id;
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON FUNCTION give_initial_currency() IS 'Função que atribui 100 moedas e 10 gemas para novos usuários';
COMMENT ON FUNCTION test_initial_currency(UUID) IS 'Função para testar manualmente a atribuição de moedas iniciais';
COMMENT ON TRIGGER trigger_give_initial_currency ON auth.users IS 'Trigger que executa automaticamente quando um novo usuário é criado'; 