# Configuração do Sistema de Login - Famand

## Visão Geral

O painel administrativo do Famand utiliza autenticação via Supabase para controlar o acesso. Este guia explica como configurar e usar o sistema de login.

## Configuração Inicial

### 1. Configurar Supabase

1. **Acesse o Supabase Dashboard**
   - Vá para https://supabase.com
   - Faça login ou crie uma conta

2. **Criar/Selecionar Projeto**
   - Crie um novo projeto ou use um existente
   - Anote a URL e chave anônima

3. **Configurar Variáveis de Ambiente**
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 2. Configurar Autenticação no Supabase

1. **Acessar Authentication Settings**
   - No dashboard do Supabase, vá para Authentication > Settings

2. **Configurar Site URL**
   - Adicione a URL do seu site (ex: `http://localhost:5173` para desenvolvimento)
   - Adicione URLs de redirecionamento se necessário

3. **Configurar Email Templates (Opcional)**
   - Personalize os templates de email de confirmação
   - Configure o remetente dos emails

## Como Fazer Login

### Método 1: Criar Nova Conta

1. **Acessar o Painel**
   - Navegue para `/admin` no seu site
   - Você será redirecionado para a tela de login

2. **Criar Conta**
   - Digite seu email
   - Digite uma senha forte
   - Clique em "Criar Conta"

3. **Confirmar Email**
   - Verifique seu email
   - Clique no link de confirmação
   - Volte para o painel e faça login

### Método 2: Login Direto

1. **Acessar Login**
   - Vá para `/admin`
   - Digite seu email e senha
   - Clique em "Entrar"

### Método 3: Login via Supabase Dashboard

1. **Criar Usuário Manualmente**
   - No Supabase Dashboard, vá para Authentication > Users
   - Clique em "Add User"
   - Digite email e senha
   - O usuário será criado sem necessidade de confirmação

## Funcionalidades do Sistema

### ✅ **Autenticação Segura**
- Login com email/senha
- Sessões persistentes
- Logout automático
- Proteção de rotas

### ✅ **Interface Intuitiva**
- Formulário de login moderno
- Validação em tempo real
- Feedback visual de erros
- Loading states

### ✅ **Gerenciamento de Sessão**
- Verificação automática de sessão
- Redirecionamento inteligente
- Proteção contra acesso não autorizado

## Componentes Criados

### **LoginForm**
- Formulário de login/cadastro
- Validação de campos
- Integração com Supabase Auth
- Feedback de erros

### **AuthGuard**
- Proteção de rotas
- Verificação de autenticação
- Redirecionamento automático

### **useAuth Hook**
- Gerenciamento de estado de autenticação
- Funções de login/logout
- Listener de mudanças de sessão

## Fluxo de Autenticação

```
1. Usuário acessa /admin
2. AuthGuard verifica sessão
3. Se não autenticado → LoginForm
4. Usuário digita credenciais
5. Supabase valida credenciais
6. Se válido → Redireciona para AdminDashboard
7. Se inválido → Mostra erro
```

## Segurança

### **Proteções Implementadas**
- Validação de email
- Senhas fortes
- Sessões seguras
- Tokens JWT
- Row Level Security (RLS)

### **Boas Práticas**
- Nunca exponha chaves secretas
- Use HTTPS em produção
- Configure CORS adequadamente
- Monitore tentativas de login

## Troubleshooting

### **Problema: "Invalid login credentials"**
- Verifique se o email está correto
- Confirme se a conta foi criada
- Verifique se o email foi confirmado

### **Problema: "Email not confirmed"**
- Verifique a caixa de entrada
- Clique no link de confirmação
- Verifique spam/lixo eletrônico

### **Problema: "Cannot read properties of undefined"**
- Verifique se as variáveis de ambiente estão configuradas
- Confirme se o Supabase está acessível
- Verifique a conexão com a internet

### **Problema: "Session expired"**
- Faça logout e login novamente
- Verifique se o token não expirou
- Limpe o cache do navegador

## Configuração Avançada

### **Personalizar Templates de Email**
1. Vá para Authentication > Email Templates
2. Edite os templates conforme necessário
3. Teste o envio de emails

### **Configurar Políticas RLS**
1. Vá para Authentication > Policies
2. Configure políticas para suas tabelas
3. Teste as permissões

### **Adicionar Provedores OAuth**
1. Vá para Authentication > Providers
2. Configure Google, GitHub, etc.
3. Adicione as credenciais necessárias

## Comandos Úteis

### **Verificar Status da Autenticação**
```javascript
// No console do navegador
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

### **Fazer Logout Programático**
```javascript
await supabase.auth.signOut();
```

### **Verificar Usuário Atual**
```javascript
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);
```

## Próximos Passos

### **Melhorias Planejadas**
- [ ] Autenticação com Google/GitHub
- [ ] Recuperação de senha
- [ ] Verificação em duas etapas
- [ ] Logs de auditoria
- [ ] Gerenciamento de permissões

### **Integrações**
- [ ] Analytics de login
- [ ] Notificações de segurança
- [ ] Backup de sessões
- [ ] Sincronização multi-dispositivo

---

**Versão**: 1.0.0  
**Última Atualização**: Janeiro 2025  
**Desenvolvido por**: Equipe Famand 