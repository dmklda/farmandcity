# Configuração do Painel Administrativo - Famand

## 🔐 Acesso Restrito

O painel administrativo do Famand possui **acesso restrito** apenas para o email específico:

### **Email Autorizado**
- **marcior631@gmail.com** - Único administrador com acesso total

### **Segurança Implementada**
- ✅ Verificação de email específico
- ✅ Autenticação via Supabase
- ✅ Proteção de rotas
- ✅ Interface de acesso negado

## 🚀 Como Acessar o Painel

### **Passo 1: Criar Conta**
1. Acesse `http://localhost:8081/admin`
2. Clique em "Criar Conta"
3. Use o email: **marcior631@gmail.com**
4. Defina uma senha forte
5. Confirme o email

### **Passo 2: Fazer Login**
1. Acesse `http://localhost:8081/admin`
2. Digite: **marcior631@gmail.com**
3. Digite sua senha
4. Clique em "Entrar"

### **Passo 3: Acesso ao Painel**
- Se o email for correto → Acesso total ao painel
- Se o email for diferente → Tela de "Acesso Negado"

## 📋 Páginas do Painel Administrativo

### **🏠 Dashboard Principal** (`/admin`)
- Visão geral do sistema
- Estatísticas principais
- Cards de resumo

### **🃏 Gerenciar Cartas** (`/admin/cards`)
- Criar e editar cartas
- Upload de imagens
- Validação de mecânicas
- Importação em massa

### **👥 Usuários** (`/admin/users`)
- Lista de jogadores
- Estatísticas por usuário
- Filtros por atividade
- Gerenciamento de perfis

### **📊 Estatísticas** (`/admin/stats`)
- Dados do jogo
- Cartas mais utilizadas
- Performance geral

### **📈 Estatísticas Avançadas** (`/admin/advanced-stats`)
- Análises detalhadas
- Métricas avançadas
- Relatórios temporais

### **💰 Monetização** (`/admin/monetization`)
- Pacotes booster
- Vendas e receita
- Histórico de compras

### **📦 Booster Packs** (`/admin/boosters`)
- Gerenciar pacotes
- Configurar preços
- Definir conteúdo

### **📄 Relatórios** (`/admin/reports`)
- Relatórios gerenciais
- Exportação de dados
- Análises personalizadas

### **⚙️ Configurações** (`/admin/settings`)
- Configurações gerais
- Modo de manutenção
- Recursos iniciais
- Contatos de suporte

### **🔒 Segurança** (`/admin/security`)
- Controle de acesso
- Logs de auditoria
- Políticas de segurança

### **📝 Logs do Sistema** (`/admin/logs`)
- Logs de atividade
- Monitoramento
- Debugging

## 🛡️ Segurança e Permissões

### **Acesso Total (marcior631@gmail.com)**
- ✅ Todas as páginas do admin
- ✅ Criação e edição de cartas
- ✅ Gerenciamento de usuários
- ✅ Configurações do sistema
- ✅ Relatórios e análises
- ✅ Monetização e pacotes

### **Acesso Negado (Outros Emails)**
- ❌ Nenhuma página do admin
- ❌ Mensagem de "Acesso Negado"
- ❌ Redirecionamento para o jogo

## 🔧 Configuração do Sistema

### **Variáveis de Ambiente**
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### **Configuração do Supabase**
1. **Authentication Settings**
   - Site URL: `http://localhost:8081`
   - Redirect URLs: `http://localhost:8081/admin`

2. **Email Templates**
   - Personalizar templates de confirmação
   - Configurar remetente

3. **Row Level Security (RLS)**
   - Políticas para tabelas admin
   - Restrições de acesso

## 📱 Interface Responsiva

### **Desktop**
- Sidebar colapsável
- Navegação completa
- Todas as funcionalidades

### **Mobile**
- Sidebar oculta por padrão
- Menu hamburger
- Layout adaptativo

## 🎯 Funcionalidades Principais

### **Gerenciamento de Cartas**
- ✅ Criação visual de cartas
- ✅ Upload de imagens
- ✅ Preview em tempo real
- ✅ Validação automática
- ✅ Importação em massa

### **Análise de Usuários**
- ✅ Estatísticas detalhadas
- ✅ Filtros avançados
- ✅ Histórico de atividades
- ✅ Métricas de retenção

### **Relatórios**
- ✅ Exportação PDF/CSV
- ✅ Gráficos interativos
- ✅ Análises temporais
- ✅ Métricas de negócio

### **Configurações**
- ✅ Modo de manutenção
- ✅ Recursos iniciais
- ✅ Regras do jogo
- ✅ Contatos de suporte

## 🔄 Atualizações em Tempo Real

### **Cartas**
- Criação → Aparece instantaneamente no jogo
- Edição → Atualiza em tempo real
- Desativação → Remove do jogo

### **Configurações**
- Modo manutenção → Aplica imediatamente
- Recursos iniciais → Próximo jogo
- Regras → Atualiza interface

## 🚨 Troubleshooting

### **Problema: "Acesso Negado"**
- ✅ Verifique se está usando **marcior631@gmail.com**
- ✅ Confirme se a conta foi criada
- ✅ Verifique se o email foi confirmado

### **Problema: Páginas não carregam**
- ✅ Verifique a conexão com Supabase
- ✅ Confirme as variáveis de ambiente
- ✅ Verifique os logs do console

### **Problema: Sidebar não funciona**
- ✅ Recarregue a página
- ✅ Verifique se o React Router está instalado
- ✅ Confirme as importações

## 📞 Suporte

### **Contato Principal**
- **Email**: marcior631@gmail.com
- **Discord**: https://discord.gg/famand

### **Logs de Erro**
- Console do navegador (F12)
- Logs do Supabase
- Logs do servidor

## 🔮 Próximas Funcionalidades

### **Planejadas**
- [ ] Múltiplos administradores
- [ ] Níveis de permissão
- [ ] Logs de auditoria avançados
- [ ] Backup automático
- [ ] Notificações push

### **Integrações**
- [ ] Analytics avançados
- [ ] Sistema de tickets
- [ ] Chat de suporte
- [ ] API pública

---

**⚠️ Importante**: Apenas o email **marcior631@gmail.com** tem acesso ao painel administrativo. Qualquer tentativa de acesso com outro email será bloqueada automaticamente. 