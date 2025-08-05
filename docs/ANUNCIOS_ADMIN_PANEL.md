# 📢 Sistema de Anúncios - Painel Admin

## 🎯 Visão Geral

O sistema de anúncios permite que administradores criem, editem e gerenciem avisos e promoções que aparecem na loja do jogo. Todos os anúncios são dinâmicos e podem ser controlados através do painel administrativo.

## 🚀 Funcionalidades

### ✨ Recursos Principais
- **Criação de Anúncios**: Formulário completo para criar novos avisos
- **Edição em Tempo Real**: Modificar anúncios existentes instantaneamente
- **Controle de Status**: Ativar/desativar anúncios sem deletá-los
- **Sistema de Prioridades**: 3 níveis de prioridade (Baixa, Média, Alta)
- **Datas de Validade**: Definir período de exibição dos anúncios
- **Tipos de Anúncio**: Promoção, Alerta, Informação, Aviso
- **Personalização Visual**: Cores e ícones personalizáveis

### 🎨 Tipos de Anúncio

#### 1. **Promoção** (🔥)
- **Uso**: Ofertas especiais, descontos, promoções
- **Exemplo**: "MEGA PROMOÇÃO! Todos os pacotes especiais com 50% de desconto"
- **Prioridade**: Geralmente alta (3)
- **Cor**: Vermelho (padrão)

#### 2. **Alerta** (⚡)
- **Uso**: Avisos importantes, eventos especiais
- **Exemplo**: "Eventos Especiais Ativos! Participe e ganhe recompensas"
- **Prioridade**: Média (2)
- **Cor**: Roxo (padrão)

#### 3. **Informação** (📢)
- **Uso**: Novidades, atualizações, informações gerais
- **Exemplo**: "NOVO: Decks Temáticos Disponíveis!"
- **Prioridade**: Baixa (1)
- **Cor**: Verde (padrão)

#### 4. **Aviso** (⚠️)
- **Uso**: Alertas de manutenção, problemas técnicos
- **Prioridade**: Variável
- **Cor**: Laranja (padrão)

## 🛠️ Como Usar

### 📍 Acessando o Sistema
1. Faça login no painel administrativo
2. No menu lateral, clique em **"Avisos da Loja"** (ícone 📢)
3. Você verá a interface de gerenciamento de anúncios

### ➕ Criando um Novo Anúncio
1. Clique no botão **"Novo Aviso"**
2. Preencha os campos:
   - **Título**: Nome do anúncio (ex: "MEGA PROMOÇÃO!")
   - **Mensagem**: Descrição detalhada
   - **Tipo**: Selecione o tipo apropriado
   - **Ícone**: Emoji ou símbolo (ex: 🔥, ⚡, 🆕)
   - **Cor**: Escolha a cor do tema
   - **Prioridade**: Baixa (1), Média (2), Alta (3)
   - **Data de Início**: Quando o anúncio deve aparecer
   - **Data de Fim**: Quando deve parar (opcional)
   - **Ativo**: Marque para exibir imediatamente
3. Clique em **"Criar"**

### ✏️ Editando um Anúncio
1. Na lista de anúncios, clique no botão **"Editar"** (ícone ✏️)
2. Modifique os campos desejados
3. Clique em **"Atualizar"**

### 👁️ Controlando Visibilidade
- **Ativar/Desativar**: Use o botão com ícone de olho
- **Excluir**: Use o botão vermelho com ícone de lixeira

## 🎨 Personalização Visual

### 🌈 Cores Disponíveis
- **Vermelho**: Para promoções e ofertas especiais
- **Verde**: Para informações positivas e novidades
- **Azul**: Para informações neutras
- **Roxo**: Para eventos especiais
- **Laranja**: Para avisos importantes
- **Amarelo**: Para destaque geral

### 📱 Ícones Recomendados
- **Promoções**: 🔥 💰 🎉
- **Eventos**: ⚡ 🎊 🏆
- **Novidades**: 🆕 ✨ 🎯
- **Alertas**: ⚠️ 🚨 📢
- **Informações**: ℹ️ 📋 📝

## 📊 Sistema de Prioridades

### 🥉 Prioridade Baixa (1)
- Anúncios informativos gerais
- Não aparecem como banner principal
- Cor: Verde

### 🥈 Prioridade Média (2)
- Eventos e novidades importantes
- Aparecem na seção de anúncios
- Cor: Amarelo

### 🥇 Prioridade Alta (3)
- Promoções principais
- Aparecem como banner principal com animação
- Cor: Vermelho

## ⏰ Controle de Datas

### 📅 Data de Início
- Define quando o anúncio deve começar a aparecer
- Se não definida, aparece imediatamente

### 📅 Data de Fim
- Define quando o anúncio deve parar de aparecer
- Se não definida, o anúncio fica ativo indefinidamente
- Útil para promoções com prazo limitado

## 🔄 Comportamento na Loja

### 🎯 Banner Principal
- Apenas anúncios de **promoção** com **prioridade alta (3)**
- Aparecem no topo da loja com animação
- Máximo de 1 banner principal por vez

### 📢 Seção de Anúncios
- Todos os outros anúncios ativos
- Ordenados por prioridade (maior primeiro)
- Aparecem abaixo do banner principal

## 🛡️ Segurança e Permissões

### 👥 Acesso
- Apenas usuários com role `admin` ou `super_admin`
- Controle via RLS (Row Level Security) no Supabase

### 🔒 Validações
- Título e mensagem obrigatórios
- Datas válidas
- Prioridade entre 1-3
- Tipos válidos

## 📝 Exemplos Práticos

### 🎉 Promoção de Natal
```
Título: "🎄 PROMOÇÃO DE NATAL!"
Mensagem: "Todos os pacotes com 60% de desconto até 25/12!"
Tipo: Promoção
Ícone: 🎄
Cor: Vermelho
Prioridade: Alta (3)
Data de Início: 01/12/2024
Data de Fim: 25/12/2024
```

### 🆕 Novo Conteúdo
```
Título: "NOVO: Sistema de Clãs!"
Mensagem: "Forme clãs com outros jogadores e participe de batalhas épicas"
Tipo: Informação
Ícone: 🆕
Cor: Verde
Prioridade: Média (2)
Data de Início: 15/01/2024
```

### ⚠️ Manutenção
```
Título: "Manutenção Programada"
Mensagem: "Servidor ficará offline das 02:00 às 04:00 para atualizações"
Tipo: Aviso
Ícone: ⚠️
Cor: Laranja
Prioridade: Alta (3)
Data de Início: 20/01/2024 01:30
Data de Fim: 20/01/2024 04:30
```

## 🔧 Troubleshooting

### ❌ Problemas Comuns

#### Anúncio não aparece na loja
- Verifique se está **ativo**
- Confirme se a **data de início** já passou
- Verifique se a **data de fim** não expirou
- Recarregue a página da loja

#### Erro ao salvar
- Preencha todos os campos obrigatórios
- Verifique se as datas são válidas
- Confirme se tem permissões de admin

#### Anúncio não atualiza
- Recarregue a página do admin
- Verifique se não há erros no console
- Confirme se a conexão com o banco está ok

### 🔄 Atualizações em Tempo Real
- Os anúncios são carregados dinamicamente
- Mudanças aparecem imediatamente na loja
- Não é necessário reiniciar o servidor

## 📈 Melhores Práticas

### ✅ Recomendações
- Use títulos curtos e impactantes
- Mantenha mensagens claras e objetivas
- Defina datas de fim para promoções
- Use cores apropriadas para cada tipo
- Teste anúncios antes de ativar

### ❌ Evite
- Anúncios muito longos
- Muitos anúncios ativos simultaneamente
- Promoções sem data de fim
- Cores que não combinam com o tema
- Anúncios desatualizados

## 🎯 Próximas Funcionalidades

### 🔮 Roadmap
- [ ] Anúncios por região/idioma
- [ ] Templates pré-definidos
- [ ] Estatísticas de visualização
- [ ] Agendamento automático
- [ ] Integração com eventos do jogo
- [ ] Anúncios personalizados por usuário

---

**💡 Dica**: Use o sistema de anúncios para manter os jogadores informados sobre novidades, promoções e eventos especiais. Anúncios bem feitos aumentam o engajamento e as vendas! 