# Sistema de Backgrounds Gratuitos do Campo de Batalha

## Visão Geral
Sistema atualizado com 13 backgrounds gratuitos da pasta `@boards_backgrounds/` e background padrão `@grid-board-background.jpg` para novos usuários.

## Backgrounds Disponíveis

### 🎁 Backgrounds Gratuitos (13)
Todos os usuários têm acesso gratuito a estes backgrounds:

1. **Campo Clássico** - Background padrão (automático para novos usuários)
2. **Campo de Batalha 2** - Paisagem épica única
3. **Campo de Batalha 3** - Terreno estratégico
4. **Campo de Batalha 4** - Paisagem mística
5. **Campo de Batalha 5** - Terreno sagrado
6. **Campo de Batalha 6** - Campo dos heróis
7. **Campo de Batalha 7** - Terreno lendário
8. **Campo de Batalha 8** - Paisagem mágica
9. **Campo de Batalha 9** - Terreno sagrado dos campeões
10. **Campo de Batalha 10** - Campo dos mestres
11. **Campo de Batalha 11** - Terreno épico das conquistas
12. **Campo de Batalha 12** - Paisagem lendária dos vencedores
13. **Campo de Batalha 13** - Terreno supremo das batalhas finais

### 💰 Backgrounds Premium (11)
Backgrounds que requerem compra com moedas ou gemas:

- **Common:** Campo Verde (500 moedas), Vila Rural (300 moedas)
- **Rare:** Floresta Encantada (1000 moedas), Floresta Mística (25 gemas), Montanha Nevada (30 gemas)
- **Epic:** Montanha Sagrada (50 gemas), Castelo Medieval (50 gemas), Deserto Dourado (40 gemas)
- **Legendary:** Castelo Real (5000 moedas + 100 gemas), Cidade Real (150 gemas), Porto Marítimo (100 gemas)

## Funcionalidades Implementadas

### 1. Background Padrão Automático ✅
**Arquivo:** `src/hooks/useBattlefieldCustomization.ts`

**Funcionalidades:**
- Novos usuários recebem automaticamente o "Campo Clássico"
- Background padrão equipado automaticamente
- Função `giveDefaultCustomization()` para novos usuários

**Código:**
```typescript
const giveDefaultCustomization = async (userId: string) => {
  // Buscar o Campo Clássico (background padrão)
  const { data: defaultCustomization } = await supabase
    .from('battlefield_customizations')
    .select('*')
    .eq('name', 'Campo Clássico')
    .single();

  // Dar o Campo Clássico ao usuário e equipar automaticamente
  await supabase
    .from('user_customizations')
    .insert({
      user_id: userId,
      customization_id: defaultCustomization.id,
      is_equipped: true
    });
};
```

### 2. Interface Atualizada na Loja ✅
**Arquivo:** `src/components/Shop.tsx`

**Melhorias:**
- Badge "GRÁTIS" para backgrounds gratuitos
- Preview real das imagens de background
- Botão "Obter Grátis" para backgrounds gratuitos
- Fallback para ícone se imagem não carregar
- Diferenciação visual entre gratuitos e premium

**Características visuais:**
- 🎁 Ícone para backgrounds gratuitos
- Badge verde "GRÁTIS" no canto superior esquerdo
- Preview real da imagem de background
- Botões contextuais (Obter Grátis/Comprar/Equipar)

### 3. Caminhos de Imagem Corrigidos ✅
**Arquivos atualizados:**
- `src/hooks/useBattlefieldCustomization.ts`
- `src/components/EpicBattlefield.tsx`

**Caminhos:**
- Background padrão: `/src/assets/boards_backgrounds/grid-board-background.jpg`
- Backgrounds gratuitos: `/src/assets/boards_backgrounds/grid-board-background_X.png`

## Banco de Dados

### Customizações Gratuitas Adicionadas
```sql
INSERT INTO battlefield_customizations (name, description, image_url, rarity, price_coins, price_gems, currency_type, is_active, is_special) VALUES
('Campo de Batalha 2', 'Um campo de batalha épico com paisagem única', '/src/assets/boards_backgrounds/grid-board-background_2.png', 'common', 0, 0, 'coins', true, false),
('Campo de Batalha 3', 'Terreno estratégico para combates intensos', '/src/assets/boards_backgrounds/grid-board-background_3.png', 'common', 0, 0, 'coins', true, false),
-- ... até Campo de Batalha 13
```

### Estatísticas
- **Total de customizações:** 24
- **Backgrounds gratuitos:** 13
- **Backgrounds premium:** 11
- **Background padrão:** Campo Clássico

## Fluxo para Novos Usuários

### 1. Primeiro Acesso
1. Usuário faz login pela primeira vez
2. Sistema verifica se tem customizações
3. Se não tiver, recebe automaticamente o "Campo Clássico"
4. Background padrão é equipado automaticamente

### 2. Acesso aos Backgrounds Gratuitos
1. Usuário vai para a loja
2. Navega para aba "Campos"
3. Vê todos os 13 backgrounds gratuitos com badge "GRÁTIS"
4. Clica em "Obter Grátis" para qualquer um
5. Background é adicionado à coleção imediatamente

### 3. Equipamento
1. Usuário vai para configurações
2. Aba "Campo de Batalha"
3. Vê todos os backgrounds possuídos
4. Clica em "Equipar" no desejado
5. Background é aplicado no campo de batalha

## Como Testar

### 1. Teste de Novo Usuário
1. Crie uma nova conta
2. Faça login
3. Verifique se o "Campo Clássico" está equipado automaticamente
4. Vá para configurações → Campo de Batalha
5. Confirme que o Campo Clássico aparece como equipado

### 2. Teste de Backgrounds Gratuitos
1. Acesse a loja
2. Vá para aba "Campos"
3. Procure pelos backgrounds com badge "GRÁTIS"
4. Clique em "Obter Grátis" em alguns
5. Verifique se aparecem nas configurações

### 3. Teste de Preview de Imagem
1. Na loja, observe os previews dos backgrounds
2. Verifique se as imagens carregam corretamente
3. Teste o fallback se alguma imagem não carregar

## Status
✅ **CONCLUÍDO** - Sistema atualizado com:
- 13 backgrounds gratuitos implementados
- Background padrão automático para novos usuários
- Interface melhorada na loja
- Preview real das imagens
- Sistema de fallback para imagens
- Caminhos de arquivo corrigidos

## Próximos Passos Sugeridos
1. Adicionar mais backgrounds gratuitos
2. Implementar sistema de rotação de backgrounds gratuitos
3. Adicionar animações de transição entre backgrounds
4. Implementar sistema de favoritos
5. Adicionar categorias de backgrounds (natureza, urbano, fantasia, etc.)
6. Implementar sistema de desbloqueio por conquistas 