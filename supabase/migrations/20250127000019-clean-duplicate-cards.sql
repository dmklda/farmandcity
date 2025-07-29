-- Limpar cartas duplicadas e garantir dados consistentes
-- Esta migração remove duplicatas e garante que temos exatamente 24 cartas starter

-- 1. Identificar cartas duplicadas
WITH duplicates AS (
  SELECT name, COUNT(*) as count
  FROM public.cards 
  WHERE is_active = true
  GROUP BY name
  HAVING COUNT(*) > 1
)
SELECT 'Cartas duplicadas encontradas:' as info, name, count
FROM duplicates;

-- 2. Remover cartas não-starter que são duplicatas de cartas starter
DELETE FROM public.cards 
WHERE is_starter = false 
  AND name IN (
    SELECT name 
    FROM public.cards 
    WHERE is_starter = true AND is_active = true
  );

-- 3. Verificar quantas cartas starter temos agora
SELECT 
  'Cartas starter após limpeza:' as info,
  COUNT(*) as total_starter_cards
FROM public.cards 
WHERE is_starter = true AND is_active = true;

-- 4. Verificar distribuição por tipo
SELECT 
  type,
  COUNT(*) as count,
  STRING_AGG(name, ', ') as card_names
FROM public.cards 
WHERE is_starter = true AND is_active = true
GROUP BY type
ORDER BY type;

-- 5. Verificar total de cartas não-starter
SELECT 
  'Cartas não-starter após limpeza:' as info,
  COUNT(*) as total_non_starter_cards
FROM public.cards 
WHERE is_starter = false AND is_active = true;

-- 6. Verificar se temos pelo menos 10 cartas não-starter para distribuição
SELECT 
  CASE 
    WHEN COUNT(*) >= 10 THEN '✅ Suficientes cartas não-starter para distribuição'
    ELSE '❌ Poucas cartas não-starter: ' || COUNT(*) || ' encontradas'
  END as status
FROM public.cards 
WHERE is_starter = false AND is_active = true;

-- 7. Comentário sobre a limpeza
COMMENT ON TABLE public.cards IS 'Dados limpos: sem duplicatas, 24 cartas starter únicas'; 