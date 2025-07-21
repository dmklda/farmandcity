# Changelog - Jogo de Construção de Cidade

## [1.2.0] - 2025-01-XX

### ✅ Adicionado
- **Mecânicas Corrigidas**: Alinhamento completo com documentação
  - Sistema de dados: apenas 1 rolagem por turno
  - Recursos iniciais ajustados (5 moedas, 3 comida, 2 materiais)
  - Cartas starter distribuídas automaticamente no início
  - Validação rigorosa de custos de cartas
  - Sistema de reputação por construções

### 🔧 Corrigido
- **Sistema de Fases**: Corrigido para seguir exatamente a documentação
  - Fase de Compra: apenas 1 carta por turno (base)
  - Fase de Ação: dados limitados a 1 rolagem por turno
  - Fase de Construção: validação de tipo de carta vs grid
  - Fase de Fim: descarte obrigatório mínimo de 1 carta

- **Sistema de Recursos**: Validação correta de custos
- **Sistema de Dados**: Reset correto entre turnos
- **Cartas Starter**: Distribuição automática conforme especificação

## [1.1.0] - 2025-01-XX
### ✅ Adicionado
- **Sistema de Cartas Starter**: Cartas gratuitas para início do jogo
  - Pequeno Jardim (fazenda, 0 moedas)
  - Barraca (cidade, 0 moedas)
  - Colheita Básica (ação, 0 moedas)
  - Fazenda Simples (fazenda, 0 moedas)
  - Oficina Simples (cidade, 0 moedas)
  - Comércio Simples (ação, 0 moedas)

- **Sistema de Limite de Mão**: Máximo de 6 cartas na mão
  - Descarte automático de cartas excedentes
  - Feedback visual para cartas que serão descartadas

- **Descarte Obrigatório**: 1 carta descartada no fim de cada turno
  - Mantém o jogo dinâmico e força decisões estratégicas

- **Sistema de Seleção Simplificado**: Substituição do drag & drop complexo
  - Clique para selecionar carta
  - Clique no grid para colocar carta
  - Indicador visual de carta selecionada
  - Botão para cancelar seleção

### 🔧 Corrigido
- **Sistema de Cartas Extras**: Corrigido bug onde cartas extras não eram distribuídas
  - Logs adicionados para debug
  - Reset correto do contador de cartas extras
  - Verificação de cartas desenhadas

- **Ícone Dice**: Corrigido import do ícone Dice1 em GameControls

- **Drag & Drop**: Removido sistema complexo e não funcional
  - Substituído por sistema de seleção simples
  - Melhor feedback visual
  - Mais intuitivo para usuários

### 🗑️ Removido
- **Componente DragPreview**: Não mais necessário com novo sistema
- **Eventos de Mouse Complexos**: Simplificado para cliques
- **DropZone Component**: Integrado diretamente no Grid

### 📚 Documentação
- **TASK_LIST.md**: Atualizado com progresso atual
- **CHANGELOG.md**: Criado para rastrear mudanças
- **README.md**: Atualizado com novas funcionalidades

## [1.0.0] - 2025-01-XX

### ✅ Adicionado
- Estrutura básica do projeto React + TypeScript
- Sistema de cartas básico
- Grid de construção para fazendas e cidades
- Sistema de recursos (moedas, comida, materiais, população)
- Sistema de fases de jogo
- Interface básica com Tailwind CSS
- Componentes principais (Hand, Grid, GameControls, etc.)

### 📚 Documentação
- REQUIREMENTS.md: Documento de requisitos
- DESIGN.md: Documento de design
- GAME_DESIGN_DOCUMENT.md: Documento de game design
- GAME_MECHANICS.md: Documento de mecânicas
- TASK_LIST.md: Lista de tarefas organizada

---

## Convenções de Versionamento

Este projeto segue [Semantic Versioning](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis com versões anteriores
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

## Notas de Desenvolvimento

### Próximas Versões Planejadas

#### [1.2.0] - Sistema de Dados
- Implementação completa do sistema de dados
- Lógica de produção baseada em dados
- Efeitos de combos entre cartas

#### [1.3.0] - Sistema de Eventos
- Eventos de crise e oportunidade
- Sistema de proteção contra crises
- Eventos multiplayer

#### [2.0.0] - Multiplayer
- Sistema de multiplayer completo
- Sincronização de estado
- Chat e rankings 