# Sistema de Customização do Campo de Batalha

## Visão Geral
Sistema completo para personalização do campo de batalha, incluindo compra na loja, configuração nas definições e aplicação visual no jogo.

## Funcionalidades Implementadas

### 1. Hook de Customização ✅
**Arquivo:** `src/hooks/useBattlefieldCustomization.ts`

**Funcionalidades:**
- Buscar customizações disponíveis
- Gerenciar customizações do usuário
- Comprar customizações
- Equipar customizações
- Obter background atual

**Métodos principais:**
```typescript
const {
  customizations,           // Lista de customizações disponíveis
  userCustomizations,       // Customizações do usuário
  equippedCustomization,    // Customização atualmente equipada
  purchaseCustomization,    // Comprar customização
  equipCustomization,       // Equipar customização
  getCurrentBackground      // Obter URL do background atual
} = useBattlefieldCustomization();
```

### 2. Loja - Aba de Customizações ✅
**Arquivo:** `src/components/Shop.tsx`

**Funcionalidades:**
- Nova aba "Campos" na loja
- Exibição de customizações disponíveis
- Sistema de raridade com badges coloridos
- Preços em moedas e gemas
- Botões de compra e equipamento
- Estados visuais para itens possuídos/equipados

**Interface:**
- Grid responsivo de customizações
- Preview visual de cada campo
- Informações de raridade e preço
- Botões contextuais (Comprar/Equipar/Equipado)

### 3. Configurações - Aba Campo de Batalha ✅
**Arquivo:** `src/pages/SettingsPage.tsx`

**Funcionalidades:**
- Exibição da customização atualmente equipada
- Grid de customizações disponíveis
- Sistema de compra direta
- Sistema de equipamento
- Estados visuais para itens possuídos/equipados

### 4. Campo de Batalha - Aplicação Visual ✅
**Arquivo:** `src/components/EpicBattlefield.tsx`

**Funcionalidades:**
- Integração com hook de customização
- Aplicação automática do background equipado
- Fallback para background padrão
- Transições suaves entre backgrounds

## Banco de Dados

### Tabela: `battlefield_customizations`
```sql
CREATE TABLE battlefield_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  image_url VARCHAR,
  rarity VARCHAR CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  price_coins INTEGER DEFAULT 0,
  price_gems INTEGER DEFAULT 0,
  currency_type VARCHAR CHECK (currency_type IN ('coins', 'gems')),
  is_active BOOLEAN DEFAULT true,
  is_special BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: `user_customizations`
```sql
CREATE TABLE user_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customization_id UUID REFERENCES battlefield_customizations(id) ON DELETE CASCADE,
  is_equipped BOOLEAN DEFAULT false,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, customization_id)
);
```

## Customizações Disponíveis

### Common (Comum)
1. **Campo Clássico** - Background padrão (Gratuito)
2. **Campo Verde** - 500 moedas
3. **Vila Rural** - 300 moedas

### Rare (Raro)
1. **Floresta Encantada** - 1000 moedas
2. **Floresta Mística** - 25 gemas
3. **Montanha Nevada** - 30 gemas

### Epic (Épico)
1. **Montanha Sagrada** - 50 gemas
2. **Castelo Medieval** - 50 gemas
3. **Deserto Dourado** - 40 gemas

### Legendary (Lendário)
1. **Castelo Real** - 5000 moedas + 100 gemas
2. **Cidade Real** - 150 gemas
3. **Porto Marítimo** - 100 gemas

## Fluxo de Uso

### 1. Compra na Loja
1. Acesse a loja (`/shop`)
2. Navegue para a aba "Campos"
3. Visualize as customizações disponíveis
4. Clique em "Comprar" na customização desejada
5. Confirme a compra (moedas/gemas serão deduzidas)

### 2. Configuração nas Definições
1. Acesse as configurações (`/settings`)
2. Navegue para a aba "Campo de Batalha"
3. Visualize customizações possuídas
4. Clique em "Equipar" na customização desejada
5. A customização será aplicada imediatamente

### 3. Aplicação no Campo de Batalha
1. O background é aplicado automaticamente
2. Transições suaves entre mudanças
3. Fallback para background padrão se nenhuma customização estiver equipada

## Imagens Utilizadas

### Backgrounds Disponíveis
- **Padrão:** `/src/assets/grid-board-background.jpg`
- **Fazenda:** `/src/assets/grids_background/Farm_background.png`
- **Cidade:** `/src/assets/grids_background/City_background.png`
- **Marco:** `/src/assets/grids_background/Landmark_background.png`

## Políticas RLS (Row Level Security)

### `battlefield_customizations`
```sql
-- Permitir leitura para todos os usuários autenticados
CREATE POLICY "Users can view battlefield customizations" ON battlefield_customizations
FOR SELECT USING (auth.role() = 'authenticated');
```

### `user_customizations`
```sql
-- Usuários podem ver apenas suas próprias customizações
CREATE POLICY "Users can view own customizations" ON user_customizations
FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem inserir suas próprias customizações
CREATE POLICY "Users can insert own customizations" ON user_customizations
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias customizações
CREATE POLICY "Users can update own customizations" ON user_customizations
FOR UPDATE USING (auth.uid() = user_id);
```

## Como Testar

### 1. Teste de Compra
1. Acesse `http://localhost:8082`
2. Faça login
3. Vá para a loja
4. Navegue para a aba "Campos"
5. Compre uma customização
6. Verifique se aparece nas configurações

### 2. Teste de Equipamento
1. Vá para configurações
2. Aba "Campo de Batalha"
3. Equipe uma customização
4. Verifique se o background muda no campo de batalha

### 3. Teste de Persistência
1. Recarregue a página
2. Verifique se a customização equipada permanece
3. Teste equipar diferentes customizações

## Status
✅ **CONCLUÍDO** - Sistema completo implementado com:
- Compra na loja funcionando
- Configuração nas definições funcionando
- Aplicação visual no campo de batalha funcionando
- Banco de dados configurado e populado
- Políticas RLS implementadas
- Interface responsiva e intuitiva

## Próximos Passos Sugeridos
1. Adicionar mais imagens de background
2. Implementar sistema de moedas/gemas real
3. Adicionar animações de transição
4. Implementar preview em tempo real
5. Adicionar sistema de descontos
6. Implementar customizações sazonais 