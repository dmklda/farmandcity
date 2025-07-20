# Mecânicas do Jogo - Documento Técnico

## 1. Sistema de Turnos e Fases

### 1.1 Estrutura de Turno
```
Turno N
├── Fase 1: Compra (Draw)
├── Fase 2: Ação (Action)
├── Fase 3: Construção (Build)
├── Fase 4: Produção (Production)
└── Fase 5: Fim (End)
```

### 1.2 Detalhamento das Fases

#### Fase 1: Compra
- **Duração**: 1 ação
- **Ações Disponíveis**:
  - Comprar 1 carta do deck (padrão)
  - Comprar cartas extras (efeitos especiais)
  - Passar a vez
- **Validações**:
  - Recursos suficientes para compra
  - Espaço na mão (máximo 7 cartas)
  - Cartas disponíveis no deck

#### Fase 2: Ação
- **Duração**: 1-3 ações
- **Ações Disponíveis**:
  - Rolar dados (1 ação)
  - Usar carta de ação (1 ação)
  - Ativar efeitos especiais (1 ação)
- **Limitações**:
  - Máximo 3 ações por fase
  - Dados só podem ser rolados uma vez por turno

#### Fase 3: Construção
- **Duração**: Ilimitada
- **Ações Disponíveis**:
  - Colocar carta no grid de fazenda
  - Colocar carta no grid de cidade
  - Construir marco (se condições atendidas)
- **Validações**:
  - Recursos suficientes
  - Espaço disponível no grid
  - Tipo de carta compatível com grid

#### Fase 4: Produção
- **Duração**: Automática
- **Processo**:
  - Calcular produção baseada em dados
  - Aplicar efeitos de combos
  - Coletar recursos
  - Atualizar estatísticas

#### Fase 5: Fim
- **Duração**: Automática
- **Processo**:
  - Limpar efeitos temporários
  - Verificar eventos de crise
  - Preparar próximo turno
  - Verificar condições de vitória

## 2. Sistema de Recursos

### 2.1 Tipos de Recursos

#### Moedas (💰)
- **Função**: Recurso principal para compras
- **Fontes**:
  - Cartas de cidade (Mercado, Banco)
  - Cartas de fazenda (Vinhedo, Pomar)
  - Eventos especiais
- **Uso**:
  - Compra de cartas
  - Construção de edifícios
  - Ativação de efeitos

#### Comida (🌾)
- **Função**: Sustentar população
- **Fontes**:
  - Cartas de fazenda (Campo de Trigo, Rancho de Gado)
  - Eventos de produção
- **Uso**:
  - Manter população
  - Custo de algumas cartas
  - Construção de marcos

#### Materiais (🏗️)
- **Função**: Construção de edifícios
- **Fontes**:
  - Cartas de cidade (Fábrica)
  - Eventos especiais
- **Uso**:
  - Construção de casas
  - Construção de marcos
  - Custo de cartas avançadas

#### População (👥)
- **Função**: Limitar construções e produção
- **Fontes**:
  - Cartas de cidade (Casa, Hospital)
  - Eventos de migração
- **Uso**:
  - Requisito para construções
  - Multiplicador de produção
  - Condição para marcos

### 2.2 Mecânicas de Recursos

#### Produção Baseada em Dados
```
Carta: Campo de Trigo
- Ativa com: Dado = 1
- Produz: 1 comida
- Bônus: +1 por cada campo de trigo adjacente
```

#### Produção por Turno
```
Carta: Estufa
- Ativa: Todo turno
- Produz: 1 comida
- Bônus: Nenhum
```

#### Produção Instantânea
```
Carta: Casa
- Ativa: Imediatamente
- Produz: 1 população
- Custo: 2 moedas + 1 material
```

## 3. Sistema de Dados

### 3.1 Mecânica Básica
- **Dado**: 1d6 (1-6)
- **Frequência**: 1 rolagem por turno
- **Fase**: Fase de Ação
- **Custo**: 1 ação

### 3.2 Ativação de Cartas
```
Dado = 1: Campo de Trigo, Colmeia
Dado = 2: Rancho de Gado
Dado = 3: Mercado, Fazenda de Leite
Dado = 4: Fábrica
Dado = 5: Pomar
Dado = 6: Vinhedo, Pomar
```

### 3.3 Efeitos Especiais
- **Números Duplos**: Bônus de produção
- **Sequências**: Efeitos de combo
- **Números Específicos**: Ativações únicas

## 4. Sistema de Cartas

### 4.1 Estrutura de Carta
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

### 4.2 Tipos de Carta

#### Cartas de Fazenda
- **Grid**: 6x6 (36 espaços)
- **Função**: Produção de recursos básicos
- **Ativação**: Dados ou turno
- **Combos**: Adjacência importante

#### Cartas de Cidade
- **Grid**: 4x4 (16 espaços)
- **Função**: População e bônus
- **Ativação**: Instantânea ou turno
- **Combos**: Efeitos em cadeia

#### Cartas de Ação
- **Uso**: Fase de Ação
- **Função**: Efeitos especiais
- **Duração**: Instantânea ou temporária
- **Custo**: Ação + recursos

#### Cartas de Marco
- **Função**: Objetivos de longo prazo
- **Custo**: Alto
- **Efeito**: Poderoso e permanente
- **Vitória**: Condição de vitória

#### Cartas de Evento
- **Ativação**: Automática
- **Duração**: Temporária
- **Efeito**: Modifica regras do jogo
- **Frequência**: Rara

### 4.3 Sistema de Raridades

#### Common (Comum)
- **Frequência**: 60%
- **Custo**: Baixo
- **Poder**: Básico
- **Estratégia**: Fundação

#### Uncommon (Incomum)
- **Frequência**: 25%
- **Custo**: Médio
- **Poder**: Melhorado
- **Estratégia**: Desenvolvimento

#### Rare (Rara)
- **Frequência**: 10%
- **Custo**: Alto
- **Poder**: Poderoso
- **Estratégia**: Especialização

#### Legendary (Lendária)
- **Frequência**: 4%
- **Custo**: Muito alto
- **Poder**: Excepcional
- **Estratégia**: Vitória

#### Crisis (Crise)
- **Frequência**: 1%
- **Custo**: Nenhum
- **Poder**: Negativo
- **Estratégia**: Sobrevivência

#### Booster (Reforço)
- **Frequência**: Especial
- **Custo**: Variável
- **Poder**: Único
- **Estratégia**: Expansão

## 5. Sistema de Construção

### 5.1 Grid de Fazendas (6x6)
```
[ ][ ][ ][ ][ ][ ]
[ ][ ][ ][ ][ ][ ]
[ ][ ][ ][ ][ ][ ]
[ ][ ][ ][ ][ ][ ]
[ ][ ][ ][ ][ ][ ]
[ ][ ][ ][ ][ ][ ]
```

#### Regras de Posicionamento
- **Adjacência**: Cartas próximas se beneficiam
- **Cadeias**: Múltiplas cartas do mesmo tipo
- **Especialização**: Áreas focadas em um tipo
- **Diversificação**: Múltiplos tipos de produção

### 5.2 Grid de Cidades (4x4)
```
[ ][ ][ ][ ]
[ ][ ][ ][ ]
[ ][ ][ ][ ]
[ ][ ][ ][ ]
```

#### Regras de Posicionamento
- **Eficiência**: Otimizar espaço limitado
- **Combos**: Efeitos em cadeia
- **Hierarquia**: Cartas importantes no centro
- **Acesso**: Manter caminhos livres

### 5.3 Sistema de Combos

#### Combos por Adjacência
```
Celeiro + Campo de Trigo
- Efeito: Dobra produção de comida
- Condição: Adjacentes
- Bônus: +100% produção
```

#### Combos por Cadeia
```
Múltiplos Vinhedos
- Efeito: Bônus por quantidade
- Condição: 3+ vinhedos
- Bônus: +1 moeda por vinhedo adicional
```

#### Combos por Especialização
```
Fazenda Completa
- Efeito: Bônus de diversidade
- Condição: 5 tipos diferentes de fazenda
- Bônus: +50% produção total
```

## 6. Sistema de Eventos

### 6.1 Eventos de Crise

#### Seca
- **Duração**: 1 turno
- **Efeito**: -50% produção de fazendas
- **Proteção**: Cartas de irrigação
- **Recuperação**: Efeitos de colheita

#### Tempestade
- **Duração**: 1 turno
- **Efeito**: -30% produção da cidade, +1 comida por fazenda
- **Proteção**: Edifícios resistentes
- **Recuperação**: Reparos automáticos

#### Praga
- **Duração**: 1 turno
- **Efeito**: -2 população, +5 moedas
- **Proteção**: Hospital
- **Recuperação**: Cura automática

### 6.2 Eventos de Oportunidade

#### Safra Excepcional
- **Duração**: 1 turno
- **Efeito**: +100% produção de fazendas
- **Condição**: Nenhuma
- **Bônus**: Recursos extras

#### Boom Econômico
- **Duração**: 1 turno
- **Efeito**: +100% produção da cidade
- **Condição**: Nenhuma
- **Bônus**: Moedas extras

### 6.3 Sistema de Proteção

#### Cartas de Proteção
- **Hospital**: Protege contra pragas
- **Estação Meteorológica**: Previne tempestades
- **Sistema de Irrigação**: Previne secas

#### Preparação
- **Construção Antecipada**: Edifícios defensivos
- **Recursos de Reserva**: Estoque para crises
- **Estratégia Adaptativa**: Flexibilidade

## 7. Sistema de Progresso

### 7.1 Estatísticas do Jogador

#### Reputação
- **Base**: 0 pontos
- **Ganhos**:
  - +1 por construção bem-sucedida
  - +2 por combo criado
  - +5 por marco concluído
  - +10 por sobreviver a crise
- **Perdas**:
  - -1 por falha em construção
  - -2 por crise não resolvida
- **Níveis**: 0-10 (desbloqueiam conteúdo)

#### Produção Total
- **Cálculo**: Soma de todos os recursos produzidos
- **Histórico**: Mantido por sessão
- **Objetivo**: 1000+ para vitória

#### Construções
- **Contagem**: Número de edifícios construídos
- **Tipos**: Fazendas, cidades, marcos
- **Objetivo**: 10+ para conquista

#### Marcos
- **Contagem**: Marcos históricos concluídos
- **Custo**: Alto (recursos significativos)
- **Efeito**: Poderoso e permanente
- **Objetivo**: 3 para vitória

### 7.2 Sistema de Conquistas

#### Construtor
- **Objetivo**: Construir 10 edifícios
- **Recompensa**: Carta rara
- **Progresso**: Contador visual

#### Fazendeiro
- **Objetivo**: Produzir 100 comida
- **Recompensa**: Bônus de produção
- **Progresso**: Acumulativo

#### Comerciante
- **Objetivo**: Ganhar 50 moedas
- **Recompensa**: Desconto em compras
- **Progresso**: Acumulativo

#### Estrategista
- **Objetivo**: Sobreviver a 5 crises
- **Recompensa**: Proteção automática
- **Progresso**: Contador de crises

#### Visionário
- **Objetivo**: Concluir 3 marcos
- **Recompensa**: Vitória automática
- **Progresso**: Contador de marcos

## 8. Sistema de Vitória

### 8.1 Condições de Vitória

#### Conclusão de Marcos
- **Requisito**: 3 marcos históricos
- **Dificuldade**: Alta
- **Tempo**: Longo prazo
- **Estratégia**: Foco em recursos

#### Produção Massiva
- **Requisito**: 1000 recursos totais
- **Dificuldade**: Média
- **Tempo**: Médio prazo
- **Estratégia**: Otimização de produção

#### Reputação Máxima
- **Requisito**: Nível 10 de reputação
- **Dificuldade**: Alta
- **Tempo**: Longo prazo
- **Estratégia**: Consistência

#### Sobrevivência
- **Requisito**: 20 turnos sem falhar
- **Dificuldade**: Média
- **Tempo**: Longo prazo
- **Estratégia**: Defensiva

### 8.2 Sistema de Pontuação

#### Pontos Base
- **Recursos**: 1 ponto por recurso
- **Construções**: 10 pontos por construção
- **Combos**: 25 pontos por combo
- **Marcos**: 100 pontos por marco

#### Multiplicadores
- **Eficiência**: +10% por turno rápido
- **Diversidade**: +20% por tipos variados
- **Sobrevivência**: +50% por crises superadas

#### Penalidades
- **Crises**: -25 pontos por crise não resolvida
- **Ineficiência**: -10% por turnos lentos
- **Falhas**: -5 pontos por falha

## 9. Sistema de Dificuldade

### 9.1 Níveis de Dificuldade

#### Fácil
- **Recursos Iniciais**: +50%
- **Frequência de Crises**: -50%
- **Custo das Cartas**: -25%
- **Produção**: +25%

#### Normal
- **Recursos Iniciais**: Padrão
- **Frequência de Crises**: Padrão
- **Custo das Cartas**: Padrão
- **Produção**: Padrão

#### Difícil
- **Recursos Iniciais**: -25%
- **Frequência de Crises**: +50%
- **Custo das Cartas**: +25%
- **Produção**: -25%

#### Expert
- **Recursos Iniciais**: -50%
- **Frequência de Crises**: +100%
- **Custo das Cartas**: +50%
- **Produção**: -50%

### 9.2 Adaptação Dinâmica

#### Escalada de Dificuldade
- **Turno 1-5**: Dificuldade base
- **Turno 6-10**: +10% dificuldade
- **Turno 11-15**: +25% dificuldade
- **Turno 16+**: +50% dificuldade

#### Eventos Adaptativos
- **Crises**: Mais frequentes em turnos avançados
- **Custos**: Aumentam com o progresso
- **Objetivos**: Mais difíceis de alcançar

## 10. Balanceamento

### 10.1 Princípios de Balanceamento

#### Escolhas Significativas
- **Cada Decisão Importa**: Nenhuma ação é trivial
- **Trade-offs**: Benefícios e custos claros
- **Consequências**: Ações têm impacto duradouro
- **Irreversibilidade**: Algumas decisões são permanentes

#### Múltiplas Estratégias
- **Especialização**: Foco em um tipo de produção
- **Diversificação**: Múltiplos tipos de produção
- **Rush**: Vitória rápida
- **Control**: Vitória por controle

#### Progressão Natural
- **Crescimento Gradual**: Melhoria constante
- **Picos de Poder**: Momentos de grande progresso
- **Estagnação**: Períodos de consolidação
- **Recuperação**: Mecânicas de recuperação

### 10.2 Métricas de Balanceamento

#### Taxa de Vitória
- **Objetivo**: 40-60% em dificuldade normal
- **Medição**: Vitórias por 100 partidas
- **Ajuste**: Modificar custos e recompensas

#### Tempo de Jogo
- **Objetivo**: 15-60 minutos
- **Medição**: Tempo médio por partida
- **Ajuste**: Modificar velocidade de progresso

#### Variedade
- **Objetivo**: Múltiplas estratégias viáveis
- **Medição**: Distribuição de estratégias vencedoras
- **Ajuste**: Balancear diferentes caminhos

#### Engajamento
- **Objetivo**: Alta retenção de jogadores
- **Medição**: Sessões por jogador
- **Ajuste**: Melhorar feedback e recompensas 