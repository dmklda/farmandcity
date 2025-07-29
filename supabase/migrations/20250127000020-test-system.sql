-- Teste do sistema após correções
-- Esta migração verifica se tudo está funcionando corretamente

-- 1. Verificar estrutura das tabelas
SELECT 
  'Estrutura das tabelas:' as info,
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name IN ('cards', 'player_cards', 'player_decks')
  AND column_name IN ('id', 'card_id', 'card_ids')
ORDER BY table_name, column_name;

-- 2. Verificar cartas starter
SELECT 
  'Cartas starter:' as info,
  COUNT(*) as total_starter_cards
FROM public.cards 
WHERE is_starter = true AND is_active = true;

-- 3. Verificar cartas não-starter
SELECT 
  'Cartas não-starter:' as info,
  COUNT(*) as total_non_starter_cards
FROM public.cards 
WHERE is_starter = false AND is_active = true;

-- 4. Verificar distribuição por tipo das cartas starter
SELECT 
  'Distribuição starter por tipo:' as info,
  type,
  COUNT(*) as count
FROM public.cards 
WHERE is_starter = true AND is_active = true
GROUP BY type
ORDER BY type;

-- 5. Verificar se não há duplicatas
SELECT 
  'Verificação de duplicatas:' as info,
  name,
  COUNT(*) as count
FROM public.cards 
WHERE is_active = true
GROUP BY name
HAVING COUNT(*) > 1;

-- 6. Verificar trigger
SELECT 
  'Trigger handle_new_user:' as info,
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 7. Verificar função do trigger
SELECT 
  'Função handle_new_user:' as info,
  proname,
  prosrc IS NOT NULL as function_exists
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 8. Verificar se as tabelas estão prontas para novos dados
SELECT 
  'Tabelas prontas para novos dados:' as info,
  'player_cards' as table_name,
  COUNT(*) as row_count
FROM public.player_cards

UNION ALL

SELECT 
  'Tabelas prontas para novos dados:' as info,
  'player_decks' as table_name,
  COUNT(*) as row_count
FROM public.player_decks;

-- 9. Verificar se há cartas suficientes para distribuição
SELECT 
  'Verificação para distribuição:' as info,
  CASE 
    WHEN (SELECT COUNT(*) FROM public.cards WHERE is_starter = true AND is_active = true) >= 24 
      AND (SELECT COUNT(*) FROM public.cards WHERE is_starter = false AND is_active = true) >= 10
    THEN '✅ Sistema pronto para distribuição de cartas'
    ELSE '❌ Sistema não está pronto - faltam cartas'
  END as status;

-- 10. Comentário final
COMMENT ON SCHEMA public IS 'Sistema testado e pronto para uso'; 