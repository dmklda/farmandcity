# Painel Administrativo - Famand

## Visão Geral

O painel administrativo do Famand é uma interface completa para gerenciar todos os aspectos do jogo de cartas digital. Ele oferece funcionalidades avançadas para criação, edição, validação e análise de cartas, além de estatísticas detalhadas do jogo.

## Funcionalidades Implementadas

### ✅ **Gerenciamento de Cartas**

#### **Editor de Cartas Completo**
- **Formulário Intuitivo**: Interface moderna com validação em tempo real
- **Upload de Arte**: Sistema de upload com preview automático
- **Preview Visual**: Visualização da carta montada com frame + arte + textos
- **Validação Automática**: Verificação de dados obrigatórios e consistência
- **Geração de Slug**: Criação automática de identificadores únicos
- **Aplicação de Ícones**: Ícones automáticos baseados em tipo e raridade

#### **Funcionalidades Avançadas**
- **Duplicação de Cartas**: Criação rápida de variações
- **Importação em Massa**: Suporte para JSON e CSV
- **Exportação de Dados**: Download de cartas em formato JSON
- **Filtros Avançados**: Por tipo, raridade, status ativo
- **Busca Inteligente**: Por nome e descrição de efeito

#### **Validador de Mecânica**
- **Consistência de Fase**: Verificação automática de fase baseada no tipo
- **Balanceamento de Custo**: Validação de custos por raridade
- **Limites de Uso**: Verificação de uso por turno apropriado
- **Completude de Efeito**: Validação de descrições
- **Reatividade**: Verificação de configurações reativas

### ✅ **Sistema de Estatísticas**

#### **Estatísticas Básicas**
- Total de cartas, usuários, compras
- Receita total em moedas
- Métricas de crescimento

#### **Estatísticas Avançadas**
- **Cartas Mais Usadas**: Ranking de popularidade
- **Taxa de Vitória**: Performance dos jogadores
- **Receita por Carta**: Análise de monetização
- **Atividade de Usuários**: DAU, WAU, MAU
- **Duração de Jogos**: Métricas de engajamento

### ✅ **Monetização**

#### **Gerenciamento de Pacotes**
- Criação e edição de pacotes booster
- Configuração de preços e garantias de raridade
- Histórico de compras
- Análise de receita por pacote

### ✅ **Endpoints Públicos**

#### **API REST**
- `GET /api/cards` - Lista todas as cartas ativas
- `GET /api/cards/[id]` - Busca carta específica por ID
- Respostas padronizadas com status e dados
- Filtros automáticos por status ativo

## Estrutura do Banco de Dados

### **Tabela `cards`**
```sql
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type card_type NOT NULL,
  rarity card_rarity NOT NULL,
  cost_coins INTEGER DEFAULT 0,
  cost_food INTEGER DEFAULT 0,
  cost_materials INTEGER DEFAULT 0,
  cost_population INTEGER DEFAULT 0,
  effect TEXT NOT NULL,
  effect_logic TEXT,
  phase game_phase NOT NULL,
  use_per_turn INTEGER DEFAULT 1,
  is_reactive BOOLEAN DEFAULT false,
  art_url TEXT,
  frame_url TEXT,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);
```

### **Triggers Automáticos**
- **Geração de Slug**: Baseada no nome da carta
- **Definição de Fase**: Baseada no tipo da carta
- **Geração de Frame**: Baseada em tipo e raridade
- **Atualização de Timestamps**: Automática

### **Storage**
- **Bucket `card-arts`**: Para upload de artes das cartas
- **Políticas de Acesso**: Público para leitura, autenticado para escrita

## Componentes Principais

### **CardEditor**
- Editor completo de cartas com preview visual
- Upload e preview de arte
- Validação em tempo real
- Suporte a duplicação

### **CardManager**
- Listagem com filtros avançados
- Ações de CRUD completas
- Importação/exportação em massa
- Integração com editor

### **CardValidator**
- Validação de mecânica de jogo
- Regras de balanceamento
- Verificação de consistência
- Relatórios detalhados

### **AdvancedStatsPanel**
- Métricas de engajamento
- Análise de performance
- Gráficos de tendências
- Filtros por período

## Fluxo de Trabalho

### **Criação de Nova Carta**
1. Acessar "Gerenciar Cartas"
2. Clicar em "Nova Carta"
3. Preencher formulário com dados
4. Upload de arte (opcional)
5. Preview visual da carta
6. Validação automática
7. Salvar carta

### **Importação em Massa**
1. Acessar "Gerenciar Cartas"
2. Clicar em "Importar"
3. Selecionar arquivo JSON/CSV ou colar dados
4. Validação automática de cada carta
5. Relatório de resultados
6. Confirmação de importação

### **Validação de Mecânica**
1. Selecionar carta no editor
2. Clicar em "Executar Validação"
3. Revisar resultados por regra
4. Corrigir problemas identificados
5. Revalidar até aprovação

## Segurança e Controle de Acesso

### **Autenticação**
- Login obrigatório para acesso
- Verificação de sessão ativa
- Redirecionamento para login

### **Políticas de Banco**
- Leitura pública para cartas ativas
- Escrita apenas para usuários autenticados
- Controle de acesso por usuário

### **Validação de Dados**
- Validação no frontend e backend
- Sanitização de inputs
- Verificação de tipos e limites

## Tecnologias Utilizadas

### **Frontend**
- React 18 com TypeScript
- Tailwind CSS para estilização
- Radix UI para componentes
- Lucide React para ícones
- React Hook Form para formulários

### **Backend**
- Supabase para banco de dados
- PostgreSQL com triggers
- Storage para arquivos
- Row Level Security (RLS)

### **APIs**
- Next.js API Routes
- Supabase Client
- REST endpoints padronizados

## Próximas Implementações

### **Funcionalidades Planejadas**
- [ ] Editor visual de lógica de jogo
- [ ] Preview mobile/desktop
- [ ] Sistema de versionamento de cartas
- [ ] Análise de balanceamento automática
- [ ] Integração com analytics externos
- [ ] Sistema de notificações
- [ ] Backup automático de dados

### **Melhorias de UX**
- [ ] Drag & drop para upload de arte
- [ ] Preview em tempo real
- [ ] Atalhos de teclado
- [ ] Modo escuro
- [ ] Responsividade mobile

## Como Usar

### **Acesso ao Painel**
1. Fazer login no sistema
2. Navegar para `/admin`
3. Verificar permissões de administrador

### **Criação de Carta**
1. Ir para aba "Gerenciar Cartas"
2. Clicar em "Nova Carta"
3. Preencher todos os campos obrigatórios
4. Upload de arte (recomendado)
5. Executar validação
6. Salvar carta

### **Importação em Massa**
1. Preparar arquivo JSON/CSV com estrutura correta
2. Usar funcionalidade de importação
3. Revisar resultados
4. Corrigir erros se necessário

### **Análise de Estatísticas**
1. Navegar para "Estatísticas Avançadas"
2. Selecionar período desejado
3. Analisar métricas de engajamento
4. Identificar tendências e oportunidades

## Suporte e Manutenção

### **Logs e Monitoramento**
- Logs de erro no console
- Métricas de performance
- Alertas de sistema

### **Backup e Recuperação**
- Backup automático do banco
- Versionamento de cartas
- Recuperação de dados

### **Documentação**
- Este documento
- Comentários no código
- Guias de uso

---

**Versão**: 1.0.0  
**Última Atualização**: Janeiro 2025  
**Desenvolvido por**: Equipe Famand 