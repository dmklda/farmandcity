# Sistema de Deck - Famand

## 🎯 Visão Geral

O sistema de deck do Famand foi completamente reformulado para carregar **todas as cartas do Supabase** e garantir que o usuário sempre comece com um **starter deck** funcional.

## 🔄 Fluxo de Carregamento

### **1. Starter Deck (Deck Inicial)**
```
Supabase (is_starter = true) → useStarterDeck → Jogo
```

### **2. Todas as Cartas**
```
Supabase (is_active = true) → useCards → Jogo
```

### **3. Fallback**
```
Se Supabase falhar → Cartas locais (starterCards)
```

## 🃏 Tipos de Deck

### **Starter Deck (Obrigatório)**
- **6 cartas básicas** que todo jogador recebe
- **Custo zero** para facilitar o início
- **Efeitos simples** para aprender o jogo
- **Sempre disponível** mesmo offline

### **Cartas do Supabase**
- **Todas as cartas criadas no painel admin**
- **Carregamento automático** em tempo real
- **Filtro por ativas** (`is_active = true`)
- **Integração completa** com o jogo

## 📋 Cartas do Starter Deck

### **Pequeno Jardim** (Farm)
- **Efeito**: Produz 1 comida por turno
- **Tipo**: Farm
- **Custo**: 0 moedas

### **Barraca** (City)
- **Efeito**: Fornece 1 população imediatamente
- **Tipo**: City
- **Custo**: 0 moedas

### **Colheita Básica** (Action)
- **Efeito**: Ganhe 1 comida instantaneamente
- **Tipo**: Action
- **Custo**: 0 moedas

### **Fazenda Simples** (Farm)
- **Efeito**: Produz 1 comida quando ativada por dado
- **Tipo**: Farm
- **Custo**: 0 moedas

### **Oficina Simples** (City)
- **Efeito**: Produz 1 material por turno
- **Tipo**: City
- **Custo**: 0 moedas

### **Comércio Simples** (Action)
- **Efeito**: Ganhe 1 moeda instantaneamente
- **Tipo**: Action
- **Custo**: 0 moedas

## 🔧 Implementação Técnica

### **Hooks Criados**

#### **useStarterDeck**
```typescript
const { starterDeck, loading, error } = useStarterDeck();
```
- Carrega cartas com `is_starter = true`
- Fallback para cartas locais
- Garante que sempre há cartas disponíveis

#### **useCards**
```typescript
const { cards, loading, error } = useCards();
```
- Carrega todas as cartas ativas
- Conversão automática de formato
- Integração com o jogo

### **useGameState Atualizado**
```typescript
const getActiveDeck = () => {
  if (customDeck.length > 0) return customDeck;
  if (activeDeck?.cards.length > 0) return activeDeck.cards;
  return playerCards.length > 0 ? playerCards : starterDeck;
};
```

## 🎮 Como Funciona no Jogo

### **Início do Jogo**
1. **Carrega starter deck** do Supabase
2. **Se não encontrar** → Usa cartas locais
3. **Dá 5 cartas** para o jogador
4. **Resto fica no deck** para comprar

### **Durante o Jogo**
1. **Todas as cartas do Supabase** estão disponíveis
2. **Pode comprar** qualquer carta ativa
3. **Pode jogar** cartas do starter deck
4. **Integração automática** com mecânicas

### **Criação de Cartas**
1. **Criar no painel admin**
2. **Aparece instantaneamente** no jogo
3. **Pode ser comprada** pelos jogadores
4. **Funciona imediatamente**

## 🗄️ Estrutura do Banco

### **Campo Adicionado**
```sql
ALTER TABLE cards ADD COLUMN is_starter BOOLEAN DEFAULT FALSE;
```

### **Cartas Starter Inseridas**
- **6 cartas básicas** inseridas automaticamente
- **Campo `is_starter = true`**
- **Tags apropriadas** para identificação
- **Slugs únicos** para evitar conflitos

### **Índice de Performance**
```sql
CREATE INDEX idx_cards_is_starter ON cards(is_starter);
```

## 🔍 Verificação de Funcionamento

### **Indicadores Visuais**
- ✅ **Canto inferior direito**: Status de carregamento
- ✅ **Número de cartas**: Mostra total carregado
- ✅ **Starter deck**: Sempre disponível
- ✅ **Cartas do admin**: Aparecem automaticamente

### **Logs do Console**
```javascript
// Verificar starter deck
console.log('Starter deck:', starterDeck);

// Verificar todas as cartas
console.log('All cards:', allCards);

// Verificar deck ativo
console.log('Active deck:', getActiveDeck());
```

## 🛠️ Troubleshooting

### **Problema: Starter deck não carrega**
- ✅ Verificar campo `is_starter` no Supabase
- ✅ Confirmar se cartas estão ativas
- ✅ Verificar fallback para cartas locais

### **Problema: Cartas do admin não aparecem**
- ✅ Verificar campo `is_active = true`
- ✅ Confirmar conexão com Supabase
- ✅ Verificar logs de erro

### **Problema: Deck vazio**
- ✅ Verificar se starter deck carregou
- ✅ Confirmar se há cartas no Supabase
- ✅ Verificar fallback para cartas locais

## 🎯 Benefícios do Novo Sistema

### **Para Jogadores**
- ✅ **Sempre tem cartas** para jogar
- ✅ **Starter deck garantido** para iniciantes
- ✅ **Acesso a todas as cartas** criadas
- ✅ **Experiência consistente**

### **Para Administradores**
- ✅ **Controle total** sobre cartas
- ✅ **Criação em tempo real**
- ✅ **Balanceamento dinâmico**
- ✅ **Análise de uso**

### **Para Desenvolvedores**
- ✅ **Sistema robusto** com fallbacks
- ✅ **Integração limpa** com Supabase
- ✅ **Performance otimizada**
- ✅ **Fácil manutenção**

## 🔮 Próximas Melhorias

### **Planejadas**
- [ ] Sistema de deck personalizados
- [ ] Cartas favoritas
- [ ] Histórico de uso
- [ ] Recomendações inteligentes

### **Integrações**
- [ ] Analytics de deck
- [ ] Sistema de crafting
- [ ] Eventos especiais
- [ ] Modo competitivo

---

**✅ Sistema Funcional**: O novo sistema de deck garante que todos os jogadores tenham acesso às cartas necessárias, com carregamento automático do Supabase e fallbacks robustos. 