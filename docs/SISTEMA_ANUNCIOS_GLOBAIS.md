# Sistema de Anúncios Globais

## Visão Geral

O Sistema de Anúncios Globais permite que administradores criem e gerenciem anúncios que aparecem em todo o jogo, incluindo a página inicial e durante o gameplay. Diferente do sistema de anúncios da loja, estes anúncios são globais e podem ser configurados para aparecer em locais específicos.

## Estrutura do Banco de Dados

### Tabela `global_announcements`

```sql
CREATE TABLE global_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type announcement_type NOT NULL DEFAULT 'info',
  icon TEXT NOT NULL DEFAULT '📢',
  color announcement_color NOT NULL DEFAULT 'blue',
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 1,
  show_on_homepage BOOLEAN NOT NULL DEFAULT true,
  show_in_game BOOLEAN NOT NULL DEFAULT true,
  dismissible BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela `user_announcement_views`

```sql
CREATE TABLE user_announcement_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  announcement_id UUID NOT NULL REFERENCES global_announcements(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dismissed BOOLEAN NOT NULL DEFAULT false,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, announcement_id)
);
```

### Tipos e Cores Disponíveis

#### Tipos de Anúncio (`announcement_type`)
- `info` - Informações gerais
- `warning` - Avisos importantes
- `success` - Sucessos/conquistas
- `error` - Erros/críticas
- `promotion` - Promoções especiais
- `update` - Atualizações do jogo
- `event` - Eventos especiais

#### Cores de Anúncio (`announcement_color`)
- `red` - Vermelho (crítico/erro)
- `green` - Verde (sucesso)
- `blue` - Azul (informação)
- `purple` - Roxo (promoção)
- `orange` - Laranja (aviso)
- `yellow` - Amarelo (destaque)

## Componentes Frontend

### 1. Hook `useGlobalAnnouncements`

**Arquivo:** `src/hooks/useGlobalAnnouncements.ts`

**Funcionalidades:**
- Busca anúncios ativos do banco de dados
- Gerencia visualizações e dispensas de anúncios
- Filtra anúncios por localização (homepage/game)
- Controla limite de anúncios visíveis

**Uso:**
```typescript
const { announcements, markAsViewed, dismissAnnouncement } = useGlobalAnnouncements({
  location: 'homepage',
  maxVisible: 3
});
```

### 2. Componente `GlobalAnnouncements`

**Arquivo:** `src/components/GlobalAnnouncements.tsx`

**Funcionalidades:**
- Renderiza anúncios com animações
- Aplica estilos dinâmicos baseados no tipo e cor
- Permite dispensar anúncios (se configurado)
- Responsivo e acessível

**Props:**
- `location`: 'homepage' | 'game'
- `maxVisible`: número máximo de anúncios visíveis

### 3. Componente `GlobalAnnouncementManager`

**Arquivo:** `src/components/admin/GlobalAnnouncementManager.tsx`

**Funcionalidades:**
- CRUD completo para anúncios globais
- Formulário de criação/edição
- Lista de anúncios com ações
- Controle de ativação/desativação

## Integração nas Páginas

### Página Inicial (`HomePage.tsx`)

```typescript
import { GlobalAnnouncements } from '../components/GlobalAnnouncements';

// No JSX:
<div className="mb-8">
  <GlobalAnnouncements location="homepage" maxVisible={3} />
</div>
```

### Página do Jogo (`GamePage.tsx`)

```typescript
import { GlobalAnnouncements } from '../components/GlobalAnnouncements';

// No JSX:
<div className="fixed top-16 left-0 right-0 z-20 px-4 py-2">
  <GlobalAnnouncements location="game" maxVisible={2} />
</div>
```

### Painel Admin (`AdminPage.tsx`)

```typescript
import { GlobalAnnouncementManager } from '../components/admin/GlobalAnnouncementManager';

// No renderContent():
case 'global-announcements':
  return <GlobalAnnouncementManager />;
```

## Como Usar o Sistema

### 1. Criar um Anúncio Global

1. Acesse o Painel Admin
2. Navegue para "Anúncios Globais" no sidebar
3. Clique em "Criar Novo Anúncio"
4. Preencha os campos:
   - **Título**: Título do anúncio
   - **Mensagem**: Conteúdo detalhado
   - **Tipo**: Selecione o tipo apropriado
   - **Ícone**: Emoji ou símbolo (ex: 🎉, ⚠️, 🔥)
   - **Cor**: Cor do tema do anúncio
   - **Prioridade**: 1-5 (maior = mais importante)
   - **Mostrar na Página Inicial**: Se deve aparecer na homepage
   - **Mostrar no Jogo**: Se deve aparecer durante o gameplay
   - **Dispensável**: Se o usuário pode fechar o anúncio
   - **Data de Início/Fim**: Período de exibição (opcional)

### 2. Gerenciar Anúncios Existentes

- **Editar**: Clique no ícone de edição na lista
- **Ativar/Desativar**: Use o toggle na lista
- **Excluir**: Clique no ícone de lixeira (cuidado!)

### 3. Configurações Avançadas

#### Prioridades
- **1-2**: Anúncios informativos normais
- **3**: Anúncios importantes
- **4-5**: Anúncios críticos/urgentes

#### Período de Exibição
- Deixe vazio para exibição permanente
- Configure datas para anúncios temporários
- Útil para eventos e promoções

#### Localização
- **Apenas Homepage**: Para anúncios gerais
- **Apenas Jogo**: Para anúncios específicos do gameplay
- **Ambos**: Para anúncios importantes

## Políticas de Segurança (RLS)

### `global_announcements`
```sql
-- Permitir leitura para todos os usuários autenticados
CREATE POLICY "Users can view active global announcements" ON global_announcements
  FOR SELECT USING (is_active = true);

-- Permitir CRUD completo para admins
CREATE POLICY "Admins can manage global announcements" ON global_announcements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

### `user_announcement_views`
```sql
-- Usuários podem ver apenas suas próprias visualizações
CREATE POLICY "Users can view their own announcement views" ON user_announcement_views
  FOR SELECT USING (user_id = auth.uid());

-- Usuários podem inserir/atualizar suas próprias visualizações
CREATE POLICY "Users can manage their own announcement views" ON user_announcement_views
  FOR ALL USING (user_id = auth.uid());
```

## Funcionalidades Especiais

### Anúncios Não-Dispensáveis
- Configure `dismissible = false` para anúncios críticos
- Usuários não podem fechar estes anúncios
- Útil para avisos de manutenção ou problemas críticos

### Anúncios Temporários
- Use `start_date` e `end_date` para controle automático
- Anúncios aparecem/desaparecem automaticamente
- Ideal para eventos e promoções

### Limite de Exibição
- `maxVisible` controla quantos anúncios aparecem
- Anúncios são ordenados por prioridade e data
- Evita sobrecarga visual

## Estilos e Animações

### Cores Dinâmicas
```typescript
const getAnnouncementColorClasses = (color: string) => {
  switch (color) {
    case 'red': return 'from-red-600/20 via-orange-600/20 to-yellow-600/20';
    case 'green': return 'from-green-600/20 to-emerald-600/20';
    case 'blue': return 'from-blue-600/20 to-blue-800/20';
    case 'purple': return 'from-purple-600/20 to-pink-600/20';
    case 'orange': return 'from-orange-600/20 to-orange-800/20';
    case 'yellow': return 'from-yellow-600/20 to-yellow-800/20';
    default: return 'from-blue-600/20 to-blue-800/20';
  }
};
```

### Animações
- Fade in/out com Framer Motion
- Hover effects nos botões
- Transições suaves

## Monitoramento e Analytics

### Rastreamento de Visualizações
- Cada visualização é registrada em `user_announcement_views`
- Timestamp de quando o usuário viu o anúncio
- Permite análise de engajamento

### Dispensas
- Registra quando usuários fecham anúncios
- Útil para entender quais anúncios são ignorados
- Ajuda a otimizar conteúdo

## Boas Práticas

### 1. Conteúdo
- Mantenha títulos curtos e claros
- Use mensagens concisas mas informativas
- Escolha ícones apropriados ao contexto

### 2. Frequência
- Não sobrecarregue com muitos anúncios
- Use prioridades para destacar o importante
- Configure períodos de exibição adequados

### 3. Localização
- Homepage: Anúncios gerais e promoções
- Jogo: Anúncios específicos do gameplay
- Evite duplicação desnecessária

### 4. Testes
- Sempre teste anúncios antes de ativar
- Verifique em diferentes dispositivos
- Confirme que links funcionam corretamente

## Troubleshooting

### Anúncio não aparece
1. Verifique se `is_active = true`
2. Confirme as datas de início/fim
3. Verifique se está configurado para a localização correta
4. Verifique as políticas RLS

### Anúncio não pode ser fechado
1. Verifique se `dismissible = true`
2. Confirme que o usuário está logado
3. Verifique se há erros no console

### Problemas de performance
1. Limite o número de anúncios ativos
2. Use `maxVisible` apropriado
3. Configure períodos de exibição

## Exemplos de Uso

### Anúncio de Manutenção
```sql
INSERT INTO global_announcements (
  title, message, type, icon, color, priority, 
  show_on_homepage, show_in_game, dismissible
) VALUES (
  'Manutenção Programada',
  'O servidor estará em manutenção das 02:00 às 04:00. Pedimos desculpas pelo inconveniente.',
  'warning', '🔧', 'orange', 5,
  true, true, false
);
```

### Promoção de Evento
```sql
INSERT INTO global_announcements (
  title, message, type, icon, color, priority,
  show_on_homepage, show_in_game, dismissible,
  start_date, end_date
) VALUES (
  'Evento Especial: Festival das Cartas',
  'Participe do nosso festival especial! Cartas raras com 50% de desconto!',
  'promotion', '🎉', 'purple', 4,
  true, true, true,
  '2024-01-15 00:00:00', '2024-01-20 23:59:59'
);
```

### Atualização do Jogo
```sql
INSERT INTO global_announcements (
  title, message, type, icon, color, priority,
  show_on_homepage, show_in_game, dismissible
) VALUES (
  'Nova Atualização Disponível',
  'Nova versão com correções de bugs e melhorias de performance!',
  'update', '🆕', 'blue', 3,
  true, false, true
);
```

## Conclusão

O Sistema de Anúncios Globais fornece uma ferramenta poderosa para comunicação com os usuários em todo o jogo. Com controle granular sobre localização, período de exibição e prioridade, permite uma comunicação eficaz e não intrusiva.

O sistema é escalável, seguro e fácil de usar, proporcionando uma experiência de usuário consistente em todas as partes do jogo. 