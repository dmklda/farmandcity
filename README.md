# Famand - Card Game

Um jogo de cartas estratégico onde você constrói fazendas, cidades e marcos históricos para sobreviver e prosperar.

## Carta "Pequeno Jardim" ✅

A carta **"Pequeno Jardim"** foi completamente implementada e integrada ao jogo:

### Características da Carta:
- **ID**: `starter-garden`
- **Nome**: Pequeno Jardim
- **Tipo**: Fazenda (farm)
- **Custo**: 0 moedas (carta inicial gratuita)
- **Efeito**: Produz 1 comida por turno
- **Raridade**: Comum

### Implementação Visual:
- ✅ SVG personalizado com design de jardim
- ✅ Cores temáticas (verde para fazenda)
- ✅ Ilustração de plantas e sol
- ✅ Interface responsiva
- ✅ Modal de detalhes da carta

### Funcionalidades:
- ✅ Renderização na mão do jogador
- ✅ Colocação no grid de fazendas
- ✅ Produção automática de comida
- ✅ Visualização detalhada (duplo clique)
- ✅ Integração com sistema de recursos

## Como Jogar

### Fases do Jogo:
1. **Compra** - Compre uma carta do deck
2. **Ação** - Use cartas de ação (opcional)
3. **Construção** - Coloque cartas nos grids
4. **Produção** - Receba recursos das cartas
5. **Fim** - Descarte uma carta

### Tipos de Cartas:
- **Fazenda**: Produz recursos por turno
- **Cidade**: Fornece população e outros benefícios
- **Ação**: Efeitos instantâneos
- **Marco Histórico**: Objetivos de vitória

### Condições de Vitória:
- 3 marcos históricos construídos
- 1000 recursos produzidos
- Reputação máxima (10)
- Sobreviver 20 turnos

## Tecnologias Utilizadas

- **React** - Interface do usuário
- **TypeScript** - Tipagem estática
- **SVG** - Gráficos vetoriais
- **CSS-in-JS** - Estilização

## Estrutura do Projeto

```
src/
├── components/
│   ├── CardComponent.tsx    # Componente visual das cartas
│   ├── Hand.tsx            # Mão do jogador
│   ├── Grid.tsx            # Grid de construção
│   ├── GridBoard.tsx       # Área de grids
│   └── ...
├── data/
│   └── cards.ts            # Dados das cartas
├── types/
│   ├── card.ts             # Tipos das cartas
│   └── gameState.ts        # Estado do jogo
└── assets/
    └── cards/              # Assets visuais
```

## Executar o Projeto

```bash
npm install
npm start
```

O jogo estará disponível em `http://localhost:3000`

## Próximas Funcionalidades

- [ ] Mais cartas de fazenda
- [ ] Sistema de combos avançado
- [ ] Eventos especiais
- [ ] Sons e animações
- [ ] Modo multiplayer 