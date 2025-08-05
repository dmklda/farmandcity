# 🎨 Sistema de Artwork das Cartas

## Visão Geral

O sistema de artwork das cartas está **implementado e funcional**, mas **não possui artworks reais** ainda. O sistema inclui:

- ✅ **Frames por tipo e raridade** (implementados)
- ✅ **Sistema de upload de artwork** (implementado)
- ✅ **Gerenciador no painel admin** (implementado)
- ✅ **Prompts do MidJourney** (documentados)
- ❌ **Artworks reais** (não implementados)

## Estrutura do Sistema

### 1. Banco de Dados

**Tabela:** `cards`
- `art_url`: URL da imagem do artwork da carta
- `frame_url`: URL do frame/borda da carta
- `type`: Tipo da carta (farm, city, action, etc.)
- `rarity`: Raridade da carta (common, uncommon, rare, etc.)

### 2. Componentes Implementados

#### `CardArtworkManager.tsx`
- **Localização:** `src/components/admin/CardArtworkManager.tsx`
- **Função:** Upload e gerenciamento de artwork no painel admin
- **Recursos:**
  - Upload de imagens (máx 5MB)
  - Preview em tempo real
  - Validação de arquivos
  - Interface de preview da carta

#### `CardComponent.tsx`
- **Localização:** `src/components/CardComponent.tsx`
- **Função:** Exibição das cartas com artwork
- **Recursos:**
  - Exibição de artwork quando disponível
  - Fallback para design padrão
  - Efeitos visuais e animações

#### `CardFrame.tsx`
- **Localização:** `src/components/CardFrame.tsx`
- **Função:** Frame/borda das cartas
- **Recursos:**
  - Frames por tipo e raridade
  - Integração com artwork

### 3. Tipos de Cartas e Quantidades

| Tipo | Common | Uncommon | Rare | Ultra | Secret | Legendary | Crisis | **Total** |
|------|--------|----------|------|-------|--------|-----------|--------|-----------|
| **FARM** | 9 | 3 | 5 | - | - | - | - | **17** |
| **CITY** | 7 | 4 | 4 | 1 | 1 | - | - | **17** |
| **ACTION** | 7 | 2 | 1 | - | 1 | - | - | **11** |
| **MAGIC** | 3 | 3 | 5 | - | 1 | 1 | - | **13** |
| **DEFENSE** | 3 | 3 | 2 | 1 | - | - | - | **9** |
| **TRAP** | 1 | 2 | 2 | 2 | - | - | - | **7** |
| **EVENT** | 1 | 1 | 1 | - | - | 1 | 3 | **7** |
| **LANDMARK** | - | - | 1 | - | 1 | 5 | - | **7** |
| **TOTAL** | **31** | **18** | **21** | **4** | **4** | **7** | **3** | **88** |

## Estado Atual

### ✅ Implementado
- Sistema de frames por tipo/raridade
- Gerenciador de artwork no admin
- Interface de upload e preview
- Componentes de exibição
- Prompts do MidJourney documentados

### ❌ Pendente
- **88 cartas** sem artwork (0% implementado)
- Frames físicos não criados
- Sistema de upload para produção

## Prompts do MidJourney

### Documentação Disponível
1. **`docs/midjourney_card_frames.md`**: Prompts para frames específicos por carta
2. **`docs/midjourney_card_frames_by_type.md`**: Prompts genéricos por tipo

### Estrutura dos Prompts
```
A clean, vertical card frame for a collectible strategy card game. The card is designed in a flat minimalist style, with rounded corners and elegant UI. It features:
- Empty placeholder for title at the top
- Card Type label: "[TYPE]"
- Area for cost icons (coins, materials, food, population)
- Beige parchment background
- Blank illustration box in the center
- Description box at the bottom (empty)
- Thematic accent color: [COLOR]

No artwork or symbols, just the layout frame. Suitable for MidJourney use. --v 6 --ar 3:4 --style raw --quality 2
```

### Cores por Tipo
- **FARM**: Verde
- **CITY**: Roxo
- **ACTION**: Azul
- **DEFENSE**: Cinza
- **MAGIC**: Ciano
- **TRAP**: Preto
- **EVENT**: Vermelho
- **LANDMARK**: Dourado

## Próximos Passos

### 1. Criar Frames Base
- Gerar frames usando MidJourney com os prompts documentados
- Criar variações por raridade (common, uncommon, rare, etc.)
- Organizar em `/public/assets/frames/`

### 2. Criar Artworks
- Gerar artworks para cada carta usando MidJourney
- Focar nas cartas mais importantes primeiro
- Organizar em `/public/assets/cards/`

### 3. Implementar Upload
- Conectar sistema de upload com Supabase Storage
- Configurar permissões e políticas
- Testar upload e exibição

### 4. Priorização Sugerida

#### Fase 1: Frames Base (Alta Prioridade)
1. Frames por tipo (8 tipos)
2. Variações por raridade (5 raridades)
3. **Total:** ~40 frames

#### Fase 2: Artworks Essenciais (Média Prioridade)
1. Cartas starter (5-10 cartas)
2. Cartas comuns mais usadas (10-15 cartas)
3. Cartas lendárias (7 cartas)

#### Fase 3: Artworks Completos (Baixa Prioridade)
1. Restante das cartas
2. Variações e melhorias
3. Animações e efeitos especiais

## Recursos Técnicos

### Estrutura de Arquivos Sugerida
```
public/assets/
├── frames/
│   ├── farm_common.png
│   ├── farm_uncommon.png
│   ├── city_common.png
│   └── ...
└── cards/
    ├── pequeno_jardim.png
    ├── barraca.png
    └── ...
```

### URLs de Frame Atuais
As cartas já têm `frame_url` definidos no formato:
- `/assets/frames/farm_common.png`
- `/assets/frames/city_rare.png`
- etc.

### Integração com Supabase
- Sistema de upload preparado
- Políticas de segurança configuradas
- Interface admin funcional

## Status

🟡 **PARCIALMENTE IMPLEMENTADO** - Sistema técnico completo, faltam apenas os assets visuais (frames e artworks).

**Progresso:** 0% dos artworks criados (0/88 cartas)
**Próximo passo:** Criar frames base usando MidJourney 