# 🌍 Sistema de Anúncios Globais

## 🎯 Visão Geral

O sistema de anúncios globais permite que administradores criem e gerenciem avisos que aparecem em todo o jogo, não apenas na loja. Este sistema é separado do sistema de anúncios da loja e oferece controle granular sobre onde e quando os anúncios aparecem.

## 🚀 Funcionalidades Principais

### ✨ Recursos Exclusivos
- **Anúncios Globais**: Aparecem em todo o jogo, não apenas na loja
- **Controle de Localização**: Escolha onde o anúncio aparece (página inicial, durante o jogo, ou ambos)
- **Sistema de Dispensar**: Usuários podem fechar anúncios (configurável)
- **Rastreamento de Visualizações**: Sistema rastreia quais anúncios cada usuário viu
- **4 Níveis de Prioridade**: Baixa, Média, Alta e Crítica
- **6 Tipos de Anúncio**: Informação, Notícia, Atualização, Evento, Manutenção, Aviso

### 🎨 Tipos de Anúncio Globais

#### 1. **Informação** (ℹ️)
- **Uso**: Informações gerais sobre o jogo
- **Exemplo**: "Bem-vindo ao Famand! Novo jogo de estratégia medieval"
- **Prioridade**: Geralmente baixa (1-2)
- **Cor**: Azul (padrão)

#### 2. **Notícia** (📢)
- **Uso**: Novidades e atualizações importantes
- **Exemplo**: "Sistema de Anúncios Ativo - Agora você pode receber atualizações!"
- **Prioridade**: Média (2-3)
- **Cor**: Verde (padrão)

#### 3. **Atualização** (🔔)
- **Uso**: Atualizações do sistema e correções
- **Exemplo**: "Nova versão disponível com melhorias de performance"
- **Prioridade**: Média (2-3)
- **Cor**: Azul (padrão)

#### 4. **Evento** (📅)
- **Uso**: Eventos especiais e temporários
- **Exemplo**: "Evento de Natal ativo! Ganhe recompensas especiais"
- **Prioridade**: Alta (3-4)
- **Cor**: Roxo (padrão)

#### 5. **Manutenção** (🔧)
- **Uso**: Avisos de manutenção e downtime
- **Exemplo**: "Servidor será reiniciado amanhã às 03:00"
- **Prioridade**: Alta (3-4)
- **Cor**: Laranja (padrão)

#### 6. **Aviso** (⚠️)
- **Uso**: Alertas importantes e críticos
- **Exemplo**: "Problemas técnicos detectados - estamos trabalhando na solução"
- **Prioridade**: Crítica (4)
- **Cor**: Vermelho (padrão)

## 🛠️ Como Usar

### 📍 Acessando o Sistema
1. Faça login no painel administrativo
2. No menu lateral, clique em **"Anúncios Globais"** (ícone 🔔)
3. Você verá a interface de gerenciamento de anúncios globais

### ➕ Criando um Novo Anúncio Global
1. Clique no botão **"Novo Anúncio Global"**
2. Preencha os campos:
   - **Título**: Nome do anúncio
   - **Mensagem**: Descrição detalhada
   - **Tipo**: Selecione o tipo apropriado
   - **Ícone**: Emoji ou símbolo
   - **Cor**: Escolha a cor do tema
   - **Prioridade**: Baixa (1), Média (2), Alta (3), Crítica (4)
   - **Mostrar na Página Inicial**: Marque se deve aparecer na home
   - **Mostrar Durante o Jogo**: Marque se deve aparecer durante o jogo
   - **Permitir Fechar**: Se o usuário pode dispensar o anúncio
   - **Data de Início**: Quando o anúncio deve aparecer
   - **Data de Fim**: Quando deve parar (opcional)
   - **Ativo**: Marque para exibir imediatamente
3. Clique em **"Criar"**

### ✏️ Editando um Anúncio Global
1. Na lista de anúncios, clique no botão **"Editar"** (ícone ✏️)
2. Modifique os campos desejados
3. Clique em **"Atualizar"**

### 👁️ Controlando Visibilidade
- **Ativar/Desativar**: Use o botão com ícone de olho
- **Excluir**: Use o botão vermelho com ícone de lixeira

## 📊 Sistema de Prioridades

### 🥉 Prioridade Baixa (1)
- Anúncios informativos gerais
- Cor: Verde
- Não aparecem com destaque especial

### 🥈 Prioridade Média (2)
- Eventos e novidades importantes
- Cor: Amarelo
- Aparecem com destaque moderado

### 🥇 Prioridade Alta (3)
- Manutenções e eventos críticos
- Cor: Laranja
- Aparecem com destaque e sombra

### 🚨 Prioridade Crítica (4)
- Alertas urgentes e críticos
- Cor: Vermelho
- Aparecem com destaque máximo e sombra vermelha

## 🎯 Controle de Localização

### 🏠 Página Inicial
- Anúncios marcados como "Mostrar na Página Inicial"
- Aparecem no topo da página inicial
- Máximo de 3 anúncios visíveis
- Ordenados por prioridade

### 🎮 Durante o Jogo
- Anúncios marcados como "Mostrar Durante o Jogo"
- Aparecem no topo da tela do jogo
- Máximo de 2 anúncios visíveis
- Posicionados para não interferir no gameplay

## 🔄 Sistema de Dispensar

### ✅ Anúncios Dispensáveis
- Usuários podem fechar clicando no X
- Sistema rastreia quem dispensou
- Não aparecem novamente para quem dispensou
- Útil para anúncios informativos

### ❌ Anúncios Não Dispensáveis
- Usuários não podem fechar
- Sempre aparecem para todos
- Útil para avisos críticos e manutenção
- Apenas admin pode desativar

## 📈 Rastreamento de Visualizações

### 👀 Visualizações
- Sistema rastreia quando cada usuário vê um anúncio
- Armazenado na tabela `user_announcement_views`
- Permite analytics de engajamento

### 🗑️ Dispensas
- Sistema rastreia quando usuários dispensam anúncios
- Permite entender quais anúncios são menos relevantes
- Dados úteis para melhorar comunicação

## 🎨 Personalização Visual

### 🌈 Cores Disponíveis
- **Vermelho**: Para avisos críticos e manutenção
- **Verde**: Para notícias positivas e novidades
- **Azul**: Para informações neutras e atualizações
- **Roxo**: Para eventos especiais
- **Laranja**: Para manutenções e avisos importantes
- **Amarelo**: Para destaque geral

### 📱 Ícones Recomendados
- **Informações**: ℹ️ 📋 📝
- **Notícias**: 📢 🆕 ✨
- **Atualizações**: 🔔 🔄 ⚡
- **Eventos**: 📅 🎊 🏆
- **Manutenção**: 🔧 🛠️ ⚙️
- **Avisos**: ⚠️ 🚨 🚩

## ⏰ Controle de Datas

### 📅 Data de Início
- Define quando o anúncio deve começar a aparecer
- Se não definida, aparece imediatamente
- Útil para agendar anúncios futuros

### 📅 Data de Fim
- Define quando o anúncio deve parar de aparecer
- Se não definida, o anúncio fica ativo indefinidamente
- Útil para eventos temporários

## 🔄 Comportamento no Jogo

### 🏠 Página Inicial
- Anúncios aparecem no topo, antes da seção de boas-vindas
- Máximo de 3 anúncios simultâneos
- Animações suaves de entrada
- Responsivo para diferentes tamanhos de tela

### 🎮 Durante o Jogo
- Anúncios aparecem no topo da tela, abaixo da barra superior
- Máximo de 2 anúncios simultâneos
- Posicionamento fixo para não interferir no gameplay
- Animações discretas

## 🛡️ Segurança e Permissões

### 👥 Acesso
- Apenas usuários com role `admin` ou `super_admin`
- Controle via RLS (Row Level Security) no Supabase
- Separação clara entre anúncios da loja e globais

### 🔒 Validações
- Título e mensagem obrigatórios
- Datas válidas
- Prioridade entre 1-4
- Tipos válidos
- Pelo menos uma localização deve ser selecionada

## 📝 Exemplos Práticos

### 🔧 Manutenção Programada
```
Título: "Manutenção Programada"
Mensagem: "Servidor ficará offline das 02:00 às 04:00 para atualizações importantes"
Tipo: Manutenção
Ícone: 🔧
Cor: Laranja
Prioridade: Alta (3)
Mostrar na Página Inicial: Sim
Mostrar Durante o Jogo: Sim
Permitir Fechar: Não
Data de Início: 20/01/2024 01:30
Data de Fim: 20/01/2024 04:30
```

### 🎉 Evento Especial
```
Título: "Evento de Natal Ativo!"
Mensagem: "Participe do evento de Natal e ganhe recompensas exclusivas até 25/12!"
Tipo: Evento
Ícone: 🎄
Cor: Roxo
Prioridade: Alta (3)
Mostrar na Página Inicial: Sim
Mostrar Durante o Jogo: Sim
Permitir Fechar: Sim
Data de Início: 01/12/2024
Data de Fim: 25/12/2024
```

### 🆕 Nova Funcionalidade
```
Título: "Nova Funcionalidade: Sistema de Clãs"
Mensagem: "Forme clãs com outros jogadores e participe de batalhas épicas!"
Tipo: Notícia
Ícone: 🆕
Cor: Verde
Prioridade: Média (2)
Mostrar na Página Inicial: Sim
Mostrar Durante o Jogo: Não
Permitir Fechar: Sim
Data de Início: 15/01/2024
```

## 🔧 Troubleshooting

### ❌ Problemas Comuns

#### Anúncio não aparece
- Verifique se está **ativo**
- Confirme se a **data de início** já passou
- Verifique se a **data de fim** não expirou
- Confirme se a **localização** está correta
- Recarregue a página

#### Erro ao salvar
- Preencha todos os campos obrigatórios
- Verifique se as datas são válidas
- Confirme se tem permissões de admin
- Selecione pelo menos uma localização

#### Anúncio não atualiza
- Recarregue a página do admin
- Verifique se não há erros no console
- Confirme se a conexão com o banco está ok

### 🔄 Atualizações em Tempo Real
- Os anúncios são carregados dinamicamente
- Mudanças aparecem imediatamente no jogo
- Não é necessário reiniciar o servidor

## 📈 Melhores Práticas

### ✅ Recomendações
- Use títulos claros e objetivos
- Mantenha mensagens concisas
- Defina datas de fim para eventos temporários
- Use cores apropriadas para cada tipo
- Teste anúncios antes de ativar
- Monitore o engajamento dos usuários

### ❌ Evite
- Anúncios muito longos
- Muitos anúncios ativos simultaneamente
- Anúncios críticos dispensáveis
- Cores que não combinam com o tema
- Anúncios desatualizados

## 🎯 Diferenças do Sistema da Loja

### 🏪 Anúncios da Loja
- Aparecem apenas na loja
- Foco em promoções e vendas
- Sistema de prioridades simples (1-3)
- Sem rastreamento de visualizações

### 🌍 Anúncios Globais
- Aparecem em todo o jogo
- Foco em comunicação geral
- Sistema de prioridades avançado (1-4)
- Rastreamento completo de visualizações
- Controle de localização granular
- Sistema de dispensar configurável

## 🎯 Próximas Funcionalidades

### 🔮 Roadmap
- [ ] Anúncios por região/idioma
- [ ] Templates pré-definidos
- [ ] Estatísticas de visualização detalhadas
- [ ] Agendamento automático
- [ ] Integração com eventos do jogo
- [ ] Anúncios personalizados por usuário
- [ ] Sistema de notificações push
- [ ] Analytics avançados de engajamento

---

**💡 Dica**: Use o sistema de anúncios globais para manter os jogadores informados sobre novidades, manutenções e eventos importantes. Anúncios bem feitos melhoram a experiência do usuário e aumentam o engajamento! 