# Guia Rápido de Teste - Sistema de Cartas

## Teste da Carta "Pomar Simples" (Múltiplos Recursos)

### 1. **Verificar no Banco de Dados**
```sql
SELECT * FROM cards WHERE name = 'Pomar Simples';
```
**Resultado esperado:**
- `effect`: "Produz 1 comida e 1 material por turno"
- `type`: "farm"
- `is_active`: true

### 2. **Testar no Painel Admin**
1. Acesse `http://localhost:5173/admin`
2. Vá para "Gerenciar Cartas"
3. Edite a carta "Pomar Simples"
4. **Verificar o validador:**
   - Digite "Produz 1 comida e 1 material por turno" no campo efeito
   - O validador deve mostrar: ✅ Válido
   - Padrão reconhecido: "produz X recurso e Y recurso por turno"
   - Efeito parseado: +1 food, +1 materials

### 3. **Testar no Jogo**
1. Acesse `http://localhost:5173`
2. Inicie um novo jogo
3. Avance para a fase "Build"
4. **Jogar a carta no grid de fazenda**
5. **Avance para a fase "Production"**
6. **Verificar no console (F12):**
   ```
   === DEBUG: Produção por turno ===
   Pomar Simples: +1 food
   Pomar Simples: +1 materials
   ```

### 4. **Verificar Resultado**
- A carta deve estar no grid de fazenda
- Na fase de produção, deve gerar +1 comida E +1 material
- Os recursos devem aumentar corretamente

## Teste da Carta "Trabalho em Equipe" (Efeito Condicional)

### 1. **Verificar no Banco de Dados**
```sql
SELECT * FROM cards WHERE name = 'Trabalho em Equipe';
```
**Resultado esperado:**
- `effect`: "Ganha 1 material. Se você tiver 2 ou mais trabalhadores, ganha 2 materiais."
- `type`: "action"
- `is_active`: true

### 2. **Testar no Painel Admin**
1. Acesse `http://localhost:5173/admin`
2. Vá para "Gerenciar Cartas"
3. Edite a carta "Trabalho em Equipe"
4. **Verificar o validador:**
   - Digite "Ganha 1 material. Se você tiver 2 ou mais trabalhadores, ganha 2 materiais." no campo efeito
   - O validador deve mostrar: ✅ Válido
   - Padrão reconhecido: "ganha X material" (efeito base)
   - **NOVO**: Deve também reconhecer o efeito condicional
   - Efeito parseado: +1 materials (base) + possíveis efeitos condicionais

### 3. **Testar no Jogo**
1. Acesse `http://localhost:5173`
2. Inicie um novo jogo
3. Avance para a fase "Action"
4. **Jogar a carta "Trabalho em Equipe"**
5. **Verificar no console (F12):**
   ```
   === DEBUG: Carta selecionada ===
   Nome: Trabalho em Equipe
   Tipo: action
   Efeito: Ganha 1 material. Se você tiver 2 ou mais trabalhadores, ganha 2 materiais.
   === PROCESSANDO CARTA DE AÇÃO ===
   Efeito parseado: { materials: 1 }
   **NOVO**: Sistema deve reconhecer múltiplos efeitos
   ```

### 4. **Testar Efeito Condicional**
1. **Sem trabalhadores suficientes**: Deve ganhar +1 material
2. **Com 2+ trabalhadores**: Deve ganhar +2 materiais (implementação futura)
3. Verificar se os materiais aumentam corretamente
4. **NOVO**: Verificar se o sistema reconhece ambos os efeitos na descrição

## Teste da Carta "Bênção da Terra" (Magic) ✅ **NOVO**

### 1. **Verificar no Banco de Dados**
```sql
SELECT name, type, effect_description, cost FROM cards WHERE name = 'Bênção da Terra';
```
- ✅ **Resultado esperado**: Tipo "magic", efeito "Duplica produção de comida por 1 turno"

### 2. **Testar no Painel Admin**
1. Acesse `http://localhost:8086/admin`
2. Vá para "Gerenciar Cartas"
3. Edite a carta "Bênção da Terra"
4. **Verificar o validador:**
   - Digite "Duplica produção de comida por 1 turno" no campo efeito
   - O validador deve mostrar: ✅ Válido
   - Padrão reconhecido: "duplica produção de X por Y turno" ✅ **NOVO**
   - Efeito parseado: Efeito de duplicação de produção com duração

### 3. **Testar no Jogo**
1. Acesse `http://localhost:8086`
2. Inicie um novo jogo
3. **Avance para a fase "Action"**
4. **Jogar a carta "Bênção da Terra"**
5. **Verificar no console (F12):**
   ```
   === DEBUG: Carta selecionada ===
   Nome: Bênção da Terra
   Tipo: magic
   Efeito: Duplica produção de comida por 1 turno
   === PROCESSANDO CARTA DE MAGIA ===
   Efeito parseado: { food: 0 } (efeito de duplicação com duração)
   Recursos antes: { coins: X, food: Y, materials: Z }
   Recursos depois: { coins: X-1, food: Y, materials: Z } (deduz custo de comida)
   **NOVO**: Sistema reconhece duração "por 1 turno"
   ```

### 4. **Verificar Efeito de Duplicação**
1. **Antes da magia**: Anotar produção de comida atual
2. **Após usar a magia**: Verificar se a produção foi duplicada
3. **No próximo turno**: Verificar se o efeito expirou

## Teste da Carta "Comércio Básico" (Action) ✅ **NOVO**

### 1. **Verificar no Banco de Dados**
```sql
SELECT name, type, effect_description, cost FROM cards WHERE name = 'Comércio Básico';
```
- ✅ **Resultado esperado**: Tipo "action", efeito "Ganho instantâneo de 1 moeda"

### 2. **Testar no Painel Admin**
1. Acesse `http://localhost:8086/admin`
2. Vá para "Gerenciar Cartas"
3. Edite a carta "Comércio Básico"
4. **Verificar o validador:**
   - Digite "Ganho instantâneo de 1 moeda" no campo efeito
   - O validador deve mostrar: ✅ Válido
   - Padrão reconhecido: "ganho instantâneo de X recurso"
   - Efeito parseado: +1 coins

### 3. **Testar no Jogo**
1. Acesse `http://localhost:8086`
2. Inicie um novo jogo
3. **Avance para a fase "Action"**
4. **Jogar a carta "Comércio Básico"**
5. **Verificar no console (F12):**
   ```
   === DEBUG: Carta selecionada ===
   Nome: Comércio Básico
   Tipo: action
   Efeito: Ganho instantâneo de 1 moeda
   === PROCESSANDO CARTA DE AÇÃO ===
   Efeito parseado: { coins: 1 }
   Recursos antes: { coins: X, food: Y, materials: Z }
   Recursos depois: { coins: X+1, food: Y, materials: Z }
   ```

### 4. **Verificar Recursos**
1. **Antes da ação**: Anotar quantidade de moedas
2. **Após usar a ação**: Verificar se +1 moeda foi adicionada
3. **Verificar se a carta foi removida da mão**

## Teste de Outras Variações

### **Teste 1: "Ganhe X moeda"**
```json
{
  "name": "Teste Ganhe",
  "type": "action",
  "effect": "Ganhe 2 moedas"
}
```

### **Teste 2: "Receba X comida"**
```json
{
  "name": "Teste Receba",
  "type": "action",
  "effect": "Receba 3 comida"
}
```

### **Teste 3: "Produz X por turno"**
```json
{
  "name": "Teste Produção",
  "type": "farm",
  "effect": "Produz 2 comida por turno"
}
```

## Teste da Carta "Colheita" (Correção de Duplicação) ✅ **NOVO**

### 1. **Verificar no Banco de Dados**
```sql
SELECT name, type, effect_description, cost FROM cards WHERE name = 'Colheita';
```
- ✅ **Resultado esperado**: Tipo "action", efeito "Ganhe 2 comida instantaneamente."

### 2. **Testar no Painel Admin**
1. Acesse `http://localhost:8086/admin`
2. Vá para "Gerenciar Cartas"
3. Edite a carta "Colheita"
4. **Verificar o validador:**
   - Digite "Ganhe 2 comida instantaneamente." no campo efeito
   - O validador deve mostrar: ✅ Válido
   - Padrão reconhecido: "ganho instantâneo de X recurso"
   - Efeito parseado: +2 food (NÃO +4 food)

### 3. **Testar no Jogo**
1. Acesse `http://localhost:8086`
2. Inicie um novo jogo
3. **Avance para a fase "Action"**
4. **Jogar a carta "Colheita"**
5. **Verificar no console (F12):**
   ```
   === DEBUG: Carta selecionada ===
   Nome: Colheita
   Tipo: action
   Efeito: Ganhe 2 comida instantaneamente.
   === PROCESSANDO CARTA DE AÇÃO ===
   Efeito parseado: { food: 2 } ✅ CORRIGIDO: Não mais duplicado
   Recursos antes: { coins: X, food: Y, materials: Z }
   Recursos depois: { coins: X-1, food: Y+2, materials: Z } ✅ +2 comida, não +4
   ```

### 4. **Verificar Recursos**
1. **Antes da ação**: Anotar quantidade de comida
2. **Após usar a ação**: Verificar se +2 comida foi adicionada (NÃO +4)
3. **Verificar se a carta foi removida da mão**

## Teste do Editor de Cartas (Campos de Custo) ✅ **NOVO**

### 1. **Acessar o Editor**
1. Acesse `http://localhost:8086/admin`
2. Vá para "Gerenciar Cartas"
3. Clique em "Nova Carta" ou edite uma carta existente

### 2. **Testar Campos de Custo**
1. **Campo Moedas**:
   - Clique no campo "Moedas"
   - Apague o valor atual (deve permitir apagar)
   - Digite "5" (deve aceitar o novo valor)
   - Apague novamente (deve permitir apagar)
   - Deixe vazio (deve mostrar placeholder "0")

2. **Campo Comida**:
   - Clique no campo "Comida"
   - Digite "3" (deve aceitar o valor)
   - Apague o valor (deve permitir apagar)
   - Digite "0" (deve aceitar zero como valor válido)

3. **Campo Materiais**:
   - Teste inserir e apagar valores
   - Verifique se o campo responde corretamente

4. **Campo População**:
   - Teste inserir e apagar valores
   - Verifique se o campo responde corretamente

### 3. **Verificar Comportamento**
- ✅ **Apagar valores**: Deve permitir apagar completamente
- ✅ **Inserir novos valores**: Deve aceitar novos números
- ✅ **Valor zero**: Deve aceitar 0 como valor válido
- ✅ **Placeholder**: Deve mostrar "0" quando vazio
- ✅ **Validação**: Não deve permitir valores negativos

### 4. **Testar Salvamento**
1. Preencha todos os campos de custo
2. Clique em "Salvar"
3. Verifique se os valores foram salvos corretamente
4. Edite a carta novamente
5. Verifique se os valores carregam corretamente

## Teste da Seleção de Modo de Jogo ✅ **NOVO**

### 1. **Acesso à Seleção**
1. Acesse `http://localhost:8086/`
2. Na página inicial, clique em "Escolher Modo de Jogo"
3. **Verificar**: Deve abrir a tela de seleção de modos

### 2. **Interface da Seleção**
1. **Verificar**: 8 cards de modos diferentes
2. **Cores**: Cada modo tem cor única
3. **Dificuldade**: Badges mostram nível (Fácil, Médio, Difícil, Extremo)
4. **Descrição**: Cada modo tem descrição clara
5. **Condição**: Mostra a condição de vitória específica

### 3. **Teste de Seleção**
1. **Clássico - Marcos**: Clique e verificar se inicia com 3 landmarks
2. **Desafio - Reputação**: Clique e verificar se inicia com 15 reputação
3. **Modo Sobrevivência**: Clique e verificar se inicia com 25 turnos
4. **Desafio Infinito**: Clique e verificar se inicia modo infinito

### 4. **Teste Jogo Rápido**
1. Volte à página inicial
2. Clique em "Jogo Rápido"
3. **Verificar**: Deve iniciar com configurações padrão (3 landmarks)

### 5. **Teste Navegação**
1. Na tela de seleção, clique em "← Voltar ao Menu Principal"
2. **Verificar**: Deve voltar à página inicial

## Teste das Condições de Vitória Configuráveis ✅ **ATUALIZADO**

### 1. **Configurar no Painel Admin**
1. Acesse `http://localhost:8086/admin`
2. Vá para "Configurações"
3. Seção "Configurações de Vitória"
4. Teste cada modo:

### 2. **Teste Vitória por Marcos**
1. **Configurar**: Selecione "Marcos" e valor "2"
2. **Jogar**: Construa 2 landmarks
3. **Verificar**: Deve aparecer "Vitória: 2 marcos históricos concluídos!"
4. **Interface**: Sidebar deve mostrar "2 Marcos Históricos" com progresso

### 3. **Teste Vitória por Reputação**
1. **Configurar**: Selecione "Reputação" e valor "5"
2. **Jogar**: Alcançe 5 pontos de reputação
3. **Verificar**: Deve aparecer "Vitória: Reputação 5 alcançada!"
4. **Interface**: Sidebar deve mostrar "5 Reputação" com progresso

### 4. **Teste Vitória por Eliminação**
1. **Configurar**: Selecione "Eliminação" e valor "10"
2. **Jogar**: Sobreviva até o turno 10
3. **Verificar**: Deve aparecer "Vitória: Sobreviveu a 10 turnos!"
4. **Interface**: Sidebar deve mostrar "Sobreviver 10 Turnos"

### 5. **Teste Modo Infinito**
1. **Configurar**: Selecione "Infinito"
2. **Jogar**: Continue jogando por vários turnos
3. **Verificar**: 
   - Não deve haver vitória automática
   - A cada 10 turnos deve aparecer "🌊 Ciclo X: Eventos e custos aumentaram!"
   - Sidebar deve mostrar "Modo Infinito" com número do turno
4. **Escalonamento**: Verificar logs no console para ciclos de escalonamento

### 6. **Teste Interface Adaptativa**
1. **Mudar Modo**: Altere entre diferentes modos de vitória
2. **Verificar**: Sidebar deve mostrar apenas a condição ativa
3. **Progresso**: Barras de progresso devem ajustar aos valores configurados
4. **Cores**: Indicadores devem mudar conforme o progresso

## Problemas Comuns e Soluções ✅ **ATUALIZADO**

### **Problema: Carta não aparece como jogável**
- ✅ **Causa**: Fase incorreta ou recursos insuficientes
- ✅ **Solução**: Verificar se está na fase "Action" e se tem recursos suficientes

### **Problema: Carta não aplica efeito**
- ✅ **Causa**: Efeito não reconhecido pelo parser
- ✅ **Solução**: Usar o validador no painel admin para verificar o texto

### **Problema: Carta de ação não funciona após usar uma**
- ✅ **Causa**: Limite de 1 carta de ação por turno
- ✅ **Solução**: Avançar para o próximo turno para resetar o limite

### **Problema: Carta de magia não funciona**
- ✅ **Causa**: Fase incorreta (magia só funciona em "Action" ou "Build")
- ✅ **Solução**: Verificar se está na fase correta

## Logs de Debug Importantes

### **Logs de Carregamento**
```
=== DEBUG: getActiveDeck chamado ===
✅ Usando deck ativo: [nome] com [X] cartas
Cartas do deck ativo: [lista de cartas]
```

### **Logs de Processamento**
```
=== DEBUG: Carta selecionada ===
=== PROCESSANDO CARTA DE AÇÃO ===
Efeito parseado: { coins: 1 }
Recursos antes: { coins: 5, ... }
Recursos depois: { coins: 6, ... }
```

## Comandos Úteis

### **Verificar Cartas no Banco**
```sql
SELECT name, type, effect, is_active FROM cards WHERE is_active = true;
```

### **Verificar Cartas do Usuário**
```sql
SELECT pc.*, c.name, c.effect 
FROM player_cards pc 
JOIN cards c ON pc.card_id = c.id 
WHERE pc.player_id = '[USER_ID]';
```

### **Limpar Cache do Navegador**
1. Pressione F12
2. Clique com botão direito no botão de recarregar
3. Selecione "Empty Cache and Hard Reload"

## Checklist de Teste

- [ ] Carta aparece no painel admin
- [ ] Validador reconhece o efeito
- [ ] Carta aparece no jogo
- [ ] Carta pode ser jogada na fase correta
- [ ] Efeito é aplicado corretamente
- [ ] Recursos são atualizados
- [ ] Logs de debug aparecem no console
- [ ] Mensagem de feedback é exibida

---

**Última Atualização**: Janeiro 2025 