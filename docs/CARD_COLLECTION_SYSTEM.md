# 📚 Sistema de Coleção de Cartas - Famand

## 🎯 **Visão Geral**

O sistema de Coleção de Cartas permite aos usuários visualizar todas as cartas que possuem, ver detalhes completos de cada carta e gerenciar suas inclusões no deck ativo.

---

## ✨ **Funcionalidades Principais**

### **1. Visualização da Coleção**
- **Grid/Lista**: Duas visualizações diferentes para navegar pelas cartas
- **Estatísticas**: Contadores de tipos de cartas, total de cópias e cartas no deck
- **Filtros**: Busca por nome, filtro por tipo e raridade
- **Agrupamento**: Cartas agrupadas por tipo (sem duplicatas visuais)

### **2. Detalhes das Cartas**
- **Visual Completo**: Carta em tamanho grande
- **Informações Detalhadas**: Nome, tipo, raridade, custos, efeitos
- **Ativação**: Descrição de quando e como a carta pode ser usada
- **Status no Deck**: Indicação se a carta está no deck ativo

### **3. Gerenciamento de Deck**
- **Adicionar ao Deck**: Botão para incluir carta no deck ativo
- **Remover do Deck**: Botão para remover carta do deck ativo
- **Validação**: Verificação se a carta já está no deck
- **Feedback Visual**: Diferenciação visual entre cartas no deck e fora

---

## 🎮 **Como Usar**

### **Acessando a Coleção**
1. Faça login na aplicação
2. Clique no botão **"📚 Coleção"** no canto superior direito
3. A coleção será aberta em um modal

### **Navegando pela Coleção**
1. **Busca**: Digite o nome da carta no campo de busca
2. **Filtros**: Use os dropdowns para filtrar por tipo ou raridade
3. **Visualização**: Alterne entre Grid (padrão) e Lista
4. **Detalhes**: Clique no ícone 👁️ para ver detalhes completos

### **Gerenciando o Deck**
1. **Adicionar**: Clique no botão ➕ para adicionar ao deck ativo
2. **Remover**: Clique no botão ➖ para remover do deck ativo
3. **Verificar**: Cartas no deck são destacadas visualmente

---

## 🏗️ **Arquitetura Técnica**

### **Componentes Principais**

#### **`CardCollection.tsx`**
- Componente principal da coleção
- Gerencia estados de filtros e visualização
- Integra com hooks de cartas e decks

#### **`CardDetailModal.tsx`** (interno)
- Modal de detalhes da carta
- Exibe informações completas
- Permite adicionar/remover do deck

### **Hooks Utilizados**

#### **`usePlayerCards`**
```typescript
const { playerCards, loading, error, refetch } = usePlayerCards();
```
- Busca todas as cartas do usuário
- Gerencia estado de carregamento
- Fornece função de recarregamento

#### **`usePlayerDecks`**
```typescript
const { activeDeck, updateDeck } = usePlayerDecks();
```
- Acesso ao deck ativo
- Função para atualizar deck
- Sincronização automática

### **Estrutura de Dados**

#### **Agrupamento de Cartas**
```typescript
interface CardGroup {
  card: Card;
  quantity: number;
  isInActiveDeck: boolean;
}
```

#### **Filtros**
```typescript
interface Filters {
  searchTerm: string;
  typeFilter: string;
  rarityFilter: string;
  viewMode: 'grid' | 'list';
}
```

---

## 🎨 **Interface do Usuário**

### **Layout Responsivo**
- **Desktop**: Grid de 5 colunas, filtros horizontais
- **Tablet**: Grid de 4 colunas, filtros empilhados
- **Mobile**: Grid de 2 colunas, filtros verticais

### **Estados Visuais**
- **Cartas Normais**: Borda padrão, fundo transparente
- **Cartas no Deck**: Borda azul, fundo azul claro
- **Hover**: Borda azul clara, sombra
- **Loading**: Spinner centralizado

### **Cores por Raridade**
- **Comum**: Cinza
- **Incomum**: Verde
- **Rara**: Azul
- **Ultra**: Roxo
- **Lendária**: Amarelo
- **Secreta**: Vermelho
- **Crise**: Laranja
- **Booster**: Rosa

---

## 🔧 **Integração com o Sistema**

### **Localização no App**
```typescript
// src/App.tsx
const [showCardCollection, setShowCardCollection] = useState(false);

// Botão no topo direito
<button onClick={() => setShowCardCollection(true)}>
  📚 Coleção
</button>

// Modal
{showCardCollection && (
  <CardCollection onClose={() => setShowCardCollection(false)} />
)}
```

### **Dependências**
- **Supabase**: Autenticação e dados
- **Lucide React**: Ícones
- **Tailwind CSS**: Estilização
- **React Hooks**: Estado e efeitos

---

## 📊 **Estatísticas Exibidas**

### **Contadores Principais**
1. **Tipos de Cartas**: Quantidade de cartas únicas
2. **Total de Cópias**: Soma de todas as cópias
3. **No Deck Ativo**: Cartas únicas no deck
4. **Cartas no Deck**: Total de cartas no deck (incluindo duplicatas)

### **Filtros Disponíveis**
- **Tipos**: Farm, City, Action, Defense, Magic, Trap, Event, Landmark
- **Raridades**: Common, Uncommon, Rare, Ultra, Legendary, Secret, Crisis, Booster

---

## 🚀 **Próximas Melhorias**

### **Funcionalidades Planejadas**
1. **Ordenação**: Por nome, tipo, raridade, data de obtenção
2. **Favoritos**: Marcar cartas favoritas
3. **Estatísticas Avançadas**: Gráficos de distribuição
4. **Exportação**: Exportar coleção
5. **Comparação**: Comparar cartas lado a lado

### **Otimizações**
1. **Virtualização**: Para coleções muito grandes
2. **Cache**: Cache local de dados
3. **Lazy Loading**: Carregamento sob demanda
4. **Offline**: Funcionamento offline básico

---

## 🐛 **Solução de Problemas**

### **Problemas Comuns**

#### **Cartas não aparecem**
- Verificar se o usuário está autenticado
- Verificar se há cartas no banco de dados
- Verificar conexão com Supabase

#### **Erro ao adicionar ao deck**
- Verificar se há deck ativo
- Verificar limites do deck
- Verificar permissões do usuário

#### **Performance lenta**
- Verificar quantidade de cartas
- Verificar conexão de internet
- Verificar recursos do dispositivo

### **Logs de Debug**
```typescript
// Habilitar logs detalhados
console.log('Player cards:', playerCards);
console.log('Active deck:', activeDeck);
console.log('Filtered cards:', filteredCards);
```

---

## 📝 **Notas de Implementação**

### **Decisões de Design**
1. **Modal**: Escolhido para não interferir no jogo
2. **Grid/Lista**: Duas visualizações para diferentes preferências
3. **Agrupamento**: Evita confusão com múltiplas cópias
4. **Cores**: Sistema consistente com o resto da aplicação

### **Considerações de Performance**
1. **Memoização**: Uso de useMemo para filtros
2. **Lazy Loading**: Componentes carregados sob demanda
3. **Debounce**: Busca com delay para melhor performance
4. **Virtualização**: Preparado para grandes coleções

### **Acessibilidade**
1. **ARIA Labels**: Todos os botões têm labels
2. **Navegação por Teclado**: Suporte completo
3. **Contraste**: Cores com contraste adequado
4. **Screen Readers**: Compatível com leitores de tela 