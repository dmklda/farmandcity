# Sistema de Customização de Containers

## Visão Geral

O sistema de customização de containers permite que os usuários personalizem os backgrounds dos diferentes tipos de containers no jogo (Cidade, Fazenda, Marco, Eventos). O sistema segue o mesmo padrão das customizações de campo de batalha, com compra na loja e gerenciamento nas definições.

## Arquitetura do Sistema

### 1. **Banco de Dados**

#### Tabela: `container_customizations`
```sql
CREATE TABLE container_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  image_url TEXT,
  container_type VARCHAR NOT NULL CHECK (container_type IN ('city', 'farm', 'landmark', 'events')),
  rarity VARCHAR DEFAULT 'common',
  price_coins INTEGER DEFAULT 0,
  price_gems INTEGER DEFAULT 0,
  currency_type VARCHAR,
  is_active BOOLEAN DEFAULT true,
  is_special BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabela: `user_container_customizations`
```sql
CREATE TABLE user_container_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customization_id UUID REFERENCES container_customizations(id) ON DELETE CASCADE,
  container_type VARCHAR NOT NULL CHECK (container_type IN ('city', 'farm', 'landmark', 'events')),
  is_equipped BOOLEAN DEFAULT false,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, customization_id)
);
```

### 2. **Hooks React**

#### `useContainerCustomization.ts`
- **Estado**: Gerencia customizações disponíveis, customizações do usuário e customizações equipadas
- **Funções**:
  - `fetchCustomizations()`: Busca todas as customizações ativas
  - `fetchUserCustomizations()`: Busca customizações do usuário
  - `purchaseCustomization()`: Compra uma customização
  - `equipCustomization()`: Equipa uma customização
  - `getCurrentContainerBackground()`: Retorna o background atual de um container

### 3. **Componentes**

#### **Loja (`src/components/Shop.tsx`)**
- **Aba "Containers"**: Exibe todas as customizações disponíveis para compra
- **Indicadores visuais**: Badges com ícones e cores específicas para cada tipo de container
- **Funcionalidades**:
  - Compra de customizações
  - Equipar customizações já possuídas
  - Exibição de preços em moedas/gemas
  - Badge "GRÁTIS" para itens gratuitos

#### **Definições (`src/pages/SettingsPage.tsx`)**
- **Aba "Containers"**: Mostra apenas as customizações possuídas pelo usuário
- **Seções**:
  - **Containers Atuais**: Exibe os containers equipados atualmente
  - **Seus Containers**: Lista todas as customizações possuídas com opção de equipar

#### **Painel Admin (`src/components/admin/ContainerCustomizationManager.tsx`)**
- **Gerenciamento completo**: CRUD de customizações de containers
- **Funcionalidades**:
  - Criar novas customizações
  - Editar customizações existentes
  - Ativar/desativar customizações
  - Excluir customizações
  - Visualizar estatísticas

#### **Campo de Batalha (`src/components/EpicBattlefield.tsx`)**
- **Aplicação dinâmica**: Carrega os backgrounds personalizados dos containers
- **Fallback**: Usa backgrounds padrão quando nenhuma customização está equipada

## Tipos de Container

### 1. **Cidade (city)**
- **Ícone**: 🏙️
- **Cor**: Azul (`from-blue-500 to-blue-600`)
- **Background padrão**: `/src/assets/grids_background/City_background.png`

### 2. **Fazenda (farm)**
- **Ícone**: 🌾
- **Cor**: Verde (`from-green-500 to-green-600`)
- **Background padrão**: `/src/assets/grids_background/Farm_background.png`

### 3. **Marco (landmark)**
- **Ícone**: 🏛️
- **Cor**: Roxo (`from-purple-500 to-purple-600`)
- **Background padrão**: `/src/assets/grids_background/Landmark_background.png`

### 4. **Eventos (events)**
- **Ícone**: 🎪
- **Cor**: Laranja (`from-orange-500 to-orange-600`)
- **Background padrão**: `/src/assets/grids_background/Events_background.png`

## Fluxo do Usuário

### 1. **Compra na Loja**
1. Usuário acessa a aba "Containers" na loja
2. Visualiza todas as customizações disponíveis com indicadores visuais
3. Clica em "Comprar" ou "Obter Grátis"
4. Sistema verifica se já possui a customização
5. Se não possui, adiciona à coleção do usuário

### 2. **Personalização nas Definições**
1. Usuário acessa a aba "Containers" nas definições
2. Visualiza containers atualmente equipados
3. Na seção "Seus Containers", vê apenas as customizações possuídas
4. Clica em "Equipar" para aplicar uma customização
5. Sistema desequipa a customização anterior do mesmo tipo e equipa a nova

### 3. **Aplicação no Jogo**
1. O campo de batalha carrega dinamicamente os backgrounds personalizados
2. Se nenhuma customização está equipada, usa o background padrão
3. Mudanças são aplicadas em tempo real

## Funcionalidades Administrativas

### 1. **Criação de Customizações**
- **Campos obrigatórios**: Nome, Tipo de Container
- **Campos opcionais**: Descrição, URL da imagem, Raridade, Preços
- **Validações**: Tipo de container deve ser válido, preços não negativos

### 2. **Gerenciamento**
- **Edição**: Modificar todos os campos de uma customização
- **Ativação/Desativação**: Controlar visibilidade na loja
- **Exclusão**: Remover customizações (com confirmação)

### 3. **Visualização**
- **Lista completa**: Todas as customizações com status
- **Filtros visuais**: Badges para tipo, raridade e status
- **Preview**: Imagem da customização

## Dados Iniciais

### Customizações Gratuitas
```sql
-- Cidade
INSERT INTO container_customizations (name, description, container_type, rarity, price_coins, price_gems, is_active) 
VALUES ('Cidade Medieval', 'Uma cidade medieval tradicional', 'city', 'common', 0, 0, true);

-- Fazenda
INSERT INTO container_customizations (name, description, container_type, rarity, price_coins, price_gems, is_active) 
VALUES ('Fazenda Tradicional', 'Uma fazenda rural tradicional', 'farm', 'common', 0, 0, true);

-- Marco
INSERT INTO container_customizations (name, description, container_type, rarity, price_coins, price_gems, is_active) 
VALUES ('Marco Histórico', 'Um marco histórico importante', 'landmark', 'common', 0, 0, true);

-- Eventos
INSERT INTO container_customizations (name, description, container_type, rarity, price_coins, price_gems, is_active) 
VALUES ('Festival Local', 'Um festival local animado', 'events', 'common', 0, 0, true);
```

### Customizações Premium
```sql
-- Cidade Premium
INSERT INTO container_customizations (name, description, container_type, rarity, price_coins, price_gems, is_active) 
VALUES ('Metrópole Futurista', 'Uma cidade do futuro com tecnologia avançada', 'city', 'rare', 1000, 0, true);

-- Fazenda Premium
INSERT INTO container_customizations (name, description, container_type, rarity, price_coins, price_gems, is_active) 
VALUES ('Fazenda Mágica', 'Uma fazenda com elementos mágicos', 'farm', 'epic', 0, 50, true);
```

## Segurança e Validações

### 1. **Row Level Security (RLS)**
```sql
-- Política para container_customizations
CREATE POLICY "Container customizations are viewable by everyone" ON container_customizations
FOR SELECT USING (is_active = true);

-- Política para user_container_customizations
CREATE POLICY "Users can view their own container customizations" ON user_container_customizations
FOR ALL USING (auth.uid() = user_id);
```

### 2. **Validações de Negócio**
- **Compra única**: Usuário não pode comprar a mesma customização duas vezes
- **Equipamento único**: Apenas uma customização por tipo pode estar equipada
- **Preços válidos**: Preços não podem ser negativos
- **Tipos válidos**: Container type deve ser um dos valores permitidos

## Performance e Otimização

### 1. **Carregamento Lazy**
- Customizações são carregadas apenas quando necessário
- Imagens são carregadas com fallback para ícones

### 2. **Cache de Estado**
- Hooks mantêm estado local para evitar requisições desnecessárias
- Atualizações otimistas para melhor UX

### 3. **Queries Otimizadas**
- Uso de índices em campos frequentemente consultados
- Joins eficientes para buscar dados relacionados

## Testes e Qualidade

### 1. **Testes de Funcionalidade**
- [ ] Compra de customizações
- [ ] Equipamento de customizações
- [ ] Aplicação de backgrounds no jogo
- [ ] Gerenciamento administrativo

### 2. **Testes de Interface**
- [ ] Responsividade em diferentes dispositivos
- [ ] Acessibilidade (contraste, navegação por teclado)
- [ ] Performance de carregamento

### 3. **Testes de Integração**
- [ ] Integração com sistema de moedas
- [ ] Sincronização entre loja e definições
- [ ] Persistência de dados

## Próximos Passos

### 1. **Melhorias Planejadas**
- [ ] Sistema de preview em 3D
- [ ] Customizações sazonais
- [ ] Sistema de coleções
- [ ] Estatísticas de uso

### 2. **Otimizações**
- [ ] Compressão de imagens
- [ ] CDN para assets
- [ ] Cache mais inteligente
- [ ] Lazy loading avançado

### 3. **Funcionalidades Adicionais**
- [ ] Sistema de favoritos
- [ ] Recomendações personalizadas
- [ ] Histórico de customizações
- [ ] Sistema de avaliações

## Conclusão

O sistema de customização de containers oferece uma experiência completa e integrada para personalização do jogo. Com indicadores visuais claros, gerenciamento administrativo robusto e integração perfeita entre loja e definições, os usuários podem facilmente personalizar seus containers e os administradores podem gerenciar o conteúdo de forma eficiente.

O sistema segue as melhores práticas de desenvolvimento React, com hooks customizados, componentes reutilizáveis e uma arquitetura escalável que permite futuras expansões e melhorias. 