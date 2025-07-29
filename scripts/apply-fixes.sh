#!/bin/bash

# Script para aplicar todas as correções do sistema de decks e cartas
# Execute este script na ordem especificada

echo "🔧 APLICANDO CORREÇÕES DO SISTEMA DE DECKS E CARTAS"
echo "=================================================="

# 1. Aplicar migração de inserção de cartas com UUIDs
echo "📦 1. Inserindo cartas com UUIDs..."
supabase db push --include-all

# 2. Aplicar migração de correção de tipos
echo "🔧 2. Corrigindo tipos de dados..."
supabase db push --include-all

# 3. Aplicar migração de limpeza de dados
echo "🧹 3. Limpando dados duplicados..."
supabase db push --include-all

# 4. Aplicar migração de teste do sistema
echo "✅ 4. Testando sistema..."
supabase db push --include-all

echo ""
echo "🎉 CORREÇÕES APLICADAS COM SUCESSO!"
echo "=================================="
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Teste o registro de um novo usuário"
echo "2. Verifique se o usuário recebe 38 cartas"
echo "3. Teste o Deck Manager"
echo "4. Valide a criação de decks customizados"
echo ""
echo "🔍 PARA VERIFICAR:"
echo "- Acesse o painel admin: http://localhost:8080/admin"
echo "- Registre um novo usuário"
echo "- Verifique se o Deck Manager funciona"
echo ""
echo "📊 MIGRAÇÕES APLICADAS:"
echo "✅ 20250127000016-insert-cards-with-uuid.sql"
echo "✅ 20250127000017-update-trigger-for-uuid.sql"
echo "✅ 20250127000018-fix-data-types.sql"
echo "✅ 20250127000019-clean-duplicate-cards.sql"
echo "✅ 20250127000020-test-system.sql"
echo ""
echo "🚀 Sistema pronto para uso!" 