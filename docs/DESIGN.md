# Documento de Design - Jogo de Construção de Cidade

## 1. Arquitetura do Sistema

### 1.1 Visão Geral da Arquitetura
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   App.tsx   │  │ Components/ │  │   Hooks/    │         │
│  │             │  │             │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│         │                │                │                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Types/    │  │   Data/     │  │   Utils/    │         │
│  │             │  │             │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Estrutura de Componentes
```
App.tsx
├── GameControls.tsx (Controles e Status)
├── Grid.tsx (Grid de Construção)
├── Hand.tsx (Mão de Cartas)
├── ResourceBar.tsx (Barra de Recursos)
├── BoosterShop.tsx (Loja de Boosters)
├── Landmarks.tsx (Marcos Concluídos)
├── MultiplayerEvents.tsx (Eventos Multiplayer)
├── DragPreview.tsx (Preview de Drag)
└── DropZone.tsx (Zona de Drop)
```

## 2. Design de Interface

### 2.1 Layout Principal
```
┌─────────────────────────────────────────────────────────────┐
│                    Header (Status do Jogo)                  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Farm      │  │   City      │  │  Controls   │         │
│  │   Grid      │  │   Grid      │  │             │         │
│  │  (6x6)      │  │  (4x4)      │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                    Hand (Cartas na Mão)                     │
├─────────────────────────────────────────────────────────────┤
│                    Resource Bar                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Design System

#### 2.2.1 Cores
- **Primárias**: 
  - Azul: `#3B82F6` (Ações, Produção)
  - Verde: `#10B981` (Fazendas, Recursos)
  - Roxo: `#8B5CF6` (Cidades, Construções)
  - Amarelo: `#F59E0B` (Ouro, Valores)
  - Vermelho: `#EF4444` (Crises, Alertas)

#### 2.2.2 Tipografia
- **Títulos**: Inter, 24px, Bold
- **Subtítulos**: Inter, 18px, SemiBold
- **Corpo**: Inter, 14px, Regular
- **Legendas**: Inter, 12px, Medium

#### 2.2.3 Espaçamento
- **Base**: 4px
- **Small**: 8px
- **Medium**: 16px
- **Large**: 24px
- **XLarge**: 32px

### 2.3 Componentes de Interface

#### 2.3.1 Cards
```typescript
interface CardDesign {
  width: '200px';
  height: '280px';
  borderRadius: '12px';
  shadow: '0 4px 6px rgba(0, 0, 0, 0.1)';
  hover: '0 8px 25px rgba(0, 0, 0, 0.15)';
}
```

#### 2.3.2 Grid Cells
```typescript
interface GridCellDesign {
  width: '80px';
  height: '80px';
  borderRadius: '8px';
  border: '2px dashed #D1D5DB';
  hover: 'border-color: #3B82F6';
}
```

#### 2.3.3 Buttons
```typescript
interface ButtonDesign {
  padding: '12px 24px';
  borderRadius: '8px';
  fontWeight: '600';
  transition: 'all 0.2s ease';
  disabled: 'opacity: 0.5';
}
```

## 3. Design de Dados

### 3.1 Estrutura de Estado
```typescript
interface GameState {
  // Recursos básicos
  resources: Resources;
  
  // Sistema de cartas
  hand: Card[];
  deck: Card[];
  
  // Grids de construção
  farmGrid: GridCell[][];
  cityGrid: GridCell[][];
  
  // Progresso do jogo
  turn: number;
  phase: GamePhase;
  
  // Efeitos e eventos
  activeEvents: GameEvent[];
  comboEffects: ComboEffect[];
  
  // Estatísticas
  playerStats: PlayerStats;
}
```

### 3.2 Sistema de Cartas
```typescript
interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: ResourceCost;
  effect: CardEffect;
  rarity: CardRarity;
}
```

### 3.3 Sistema de Recursos
```typescript
interface Resources {
  coins: number;      // Moeda principal
  food: number;       // Alimentação
  materials: number;  // Materiais de construção
  population: number; // População
}
```

## 4. Design de Interação

### 4.1 Sistema de Drag & Drop
- **Drag**: Cartas da mão para grids
- **Drop**: Validação de posição e recursos
- **Preview**: Visualização da carta sendo arrastada
- **Feedback**: Animações e sons

### 4.2 Sistema de Fases
1. **Compra**: Seleção de cartas
2. **Ação**: Uso de cartas de ação
3. **Construção**: Colocação de cartas nos grids
4. **Produção**: Ativação baseada em dados
5. **Fim**: Limpeza e preparação do próximo turno

### 4.3 Sistema de Feedback
- **Visual**: Cores, ícones, animações
- **Auditivo**: Sons de interface (futuro)
- **Háptico**: Vibração em dispositivos móveis (futuro)

## 5. Design de Experiência do Usuário

### 5.1 Fluxo de Jogo
```
Início → Tutorial → Primeiro Turno → Loop de Jogo → Fim
   ↓         ↓           ↓              ↓         ↓
Setup    Aprendizado   Construção    Estratégia  Vitória
```

### 5.2 Pontos de Decisão
- **Compra de Cartas**: Qual carta escolher?
- **Construção**: Onde colocar cada carta?
- **Ações**: Quando usar cartas de ação?
- **Recursos**: Como gerenciar recursos limitados?

### 5.3 Feedback e Recompensas
- **Imediato**: Produção de recursos
- **Curto Prazo**: Combos e efeitos
- **Longo Prazo**: Marcos e conquistas

## 6. Design de Performance

### 6.1 Otimizações
- **Lazy Loading**: Carregamento sob demanda
- **Memoização**: Cache de componentes
- **Virtualização**: Listas grandes
- **Debouncing**: Ações do usuário

### 6.2 Responsividade
- **Mobile First**: Design para dispositivos móveis
- **Breakpoints**: 320px, 768px, 1024px, 1440px
- **Touch Friendly**: Elementos com tamanho adequado

## 7. Design de Acessibilidade

### 7.1 Navegação por Teclado
- **Tab Navigation**: Navegação sequencial
- **Shortcuts**: Atalhos de teclado
- **Focus Indicators**: Indicadores visuais

### 7.2 Suporte a Leitor de Tela
- **ARIA Labels**: Descrições para leitores
- **Semantic HTML**: Estrutura semântica
- **Alt Text**: Textos alternativos

### 7.3 Contraste e Cores
- **WCAG AA**: Padrão de acessibilidade
- **Color Blind Friendly**: Cores distinguíveis
- **High Contrast**: Modo alto contraste

## 8. Design de Segurança

### 8.1 Validação de Dados
- **Client-side**: Validação imediata
- **Server-side**: Validação no servidor (futuro)
- **Sanitização**: Limpeza de inputs

### 8.2 Proteção de Estado
- **Immutability**: Estado imutável
- **Validation**: Validação de ações
- **Error Handling**: Tratamento de erros

## 9. Design de Testes

### 9.1 Testes de Interface
- **Unit Tests**: Componentes individuais
- **Integration Tests**: Interação entre componentes
- **E2E Tests**: Fluxos completos

### 9.2 Testes de Usabilidade
- **User Testing**: Testes com usuários reais
- **A/B Testing**: Comparação de designs
- **Analytics**: Métricas de uso 