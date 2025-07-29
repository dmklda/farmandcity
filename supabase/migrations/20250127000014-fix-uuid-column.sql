-- Corrigir tipo da coluna id de UUID para TEXT

-- 1. Verificar o tipo atual da coluna id
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'cards' AND column_name = 'id';

-- 2. Alterar o tipo da coluna id para TEXT
ALTER TABLE public.cards 
ALTER COLUMN id TYPE TEXT;

-- 3. Verificar se a alteração foi aplicada
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'cards' AND column_name = 'id';

-- 4. Verificar se há dados na tabela
SELECT COUNT(*) as total_cards FROM public.cards;

-- 5. Se houver dados, verificar se são compatíveis
SELECT 
  id,
  name,
  type,
  is_starter,
  is_active
FROM public.cards 
LIMIT 5; 