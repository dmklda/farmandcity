# 🎴 Deck Inicial com Quantidades Exatas

## 📋 **Lista Completa das Cartas Starter**

### **Total: 27 cartas starter + 10 cartas adicionais = 37 cartas**

| Tipo       | Nome da Carta            | Qtd | Observações                                 |
| ---------- | ------------------------ | --- | ------------------------------------------- |
| `farm`     | Pequeno Jardim           | 3   | Produção contínua de comida                 |
| `farm`     | Fazenda Simples          | 2   | Produção ativada por dado                   |
| `farm`     | Campo de Trigo           | 2   | Produção com dado 1                         |
| `farm`     | Rancho de Gado           | 1   | Produção com dado 2                         |
| `city`     | Barraca                  | 2   | População inicial                           |
| `city`     | Oficina Simples          | 2   | Produz material                             |
| `city`     | Comércio Simples         | 2   | Gera moeda                                  |
| `city`     | Casa                     | 1   | População direta                            |
| `action`   | Colheita Básica          | 2   | Ganho instantâneo de comida                 |
| `action`   | Comércio Básico          | 2   | Ganho instantâneo de moeda                  |
| `action`   | Colheita                 | 1   | 2 comida instantâneo                        |
| `defense`  | Muro de Palha            | 2   | Proteção simples por 1 turno                |
| `defense`  | Rede de Defesa           | 1   | Bloqueia carta de evento                    |
| `magic`    | Magia do Crescimento     | 1   | Dobrar comida (efeito básico)               |
| `magic`    | Chama do Trabalho        | 1   | Faz todas cidades produzirem 2x neste turno |
| `event`    | Chuva Leve               | 1   | +1 comida para todos                        |
| `landmark` | Estátua Simples          | 1   | +1 reputação                                |
| `landmark` | Torre de Vigia           | 1   | +2 população e +1 defesa                    |
| `landmark` | Fonte da Prosperidade    | 1   | +1 comida e +1 moeda por turno             |

---

## 🎯 **Distribuição por Tipo**

### **Farm Cards (8 total)**
- Pequeno Jardim: 3x
- Fazenda Simples: 2x
- Campo de Trigo: 2x
- Rancho de Gado: 1x

### **City Cards (6 total)**
- Barraca: 2x
- Oficina Simples: 2x
- Comércio Simples: 2x
- Casa: 1x

### **Action Cards (5 total)**
- Colheita Básica: 2x
- Comércio Básico: 2x
- Colheita: 1x

### **Defense Cards (3 total)**
- Muro de Palha: 2x
- Rede de Defesa: 1x

### **Magic Cards (2 total)**
- Magia do Crescimento: 1x
- Chama do Trabalho: 1x

### **Event Cards (1 total)**
- Chuva Leve: 1x

### **Landmark Cards (3 total) - ✅ MÍNIMO NECESSÁRIO**
- Estátua Simples: 1x
- Torre de Vigia: 1x
- Fonte da Prosperidade: 1x

### **❌ Trap Cards (0 total) - REMOVIDAS**
- Nenhuma trap no deck inicial

---

## 🚀 **Como Aplicar as Correções**

### **Passo 1: Aplicar Migrações na Ordem**
```sql
-- 1. Corrigir deck inicial (3 landmarks, sem traps)
supabase/migrations/20250127000022-fix-starter-deck-landmarks-no-traps.sql
```

### **Passo 2: Verificar Cartas no Banco**
```sql
-- Verificar cartas starter por tipo
SELECT 
  type,
  name,
  COUNT(*) as quantity
FROM public.cards 
WHERE is_starter = true AND is_active = true
GROUP BY type, name
ORDER BY type, name;

-- Verificar total de cartas starter
SELECT COUNT(*) FROM public.cards WHERE is_starter = true AND is_active = true;
-- Deve retornar 26 (26 cartas únicas)
```

### **Passo 3: Corrigir Usuário Atual**
```sql
-- Corrigir seu usuário específico
SELECT public.fix_user_cards_landmarks('SEU_EMAIL_AQUI');
```

---

## 🧪 **Testes de Verificação**

### **Teste 1: Verificar Quantidades no Banco**
```sql
-- Verificar se todas as cartas starter estão presentes
SELECT 
  type,
  COUNT(*) as total_cards,
  COUNT(DISTINCT name) as unique_cards
FROM public.cards 
WHERE is_starter = true AND is_active = true
GROUP BY type
ORDER BY type;
```

### **Teste 2: Verificar Deck do Usuário**
```sql
-- Substitua USER_ID pelo ID do seu usuário
SELECT 
  name,
  array_length(card_ids, 1) as total_cards,
  is_starter_deck,
  is_active
FROM player_decks 
WHERE player_id = 'USER_ID';
```

### **Teste 3: Verificar Cartas do Usuário**
```sql
-- Substitua USER_ID pelo ID do seu usuário
SELECT 
  c.type,
  c.name,
  pc.quantity,
  c.is_starter
FROM player_cards pc
JOIN cards c ON pc.card_id = c.id
WHERE pc.player_id = 'USER_ID'
ORDER BY c.is_starter DESC, c.type, c.name;
```

---

## 🎯 **Resultado Esperado**

### **Após aplicar as correções:**
- ✅ **26 cartas starter únicas** no banco
- ✅ **27 cartas starter** no deck (com quantidades corretas)
- ✅ **10 cartas adicionais** aleatórias
- ✅ **Total de 37 cartas** no deck inicial
- ✅ **3 landmarks** (mínimo necessário para jogar)
- ✅ **0 traps** (removidas do deck inicial)
- ✅ **Deck Manager** mostra "37 cartas (27 básicas + 10 adicionais)"

### **Quantidades por Tipo no Deck:**
- **Farm**: 8 cartas (3+2+2+1)
- **City**: 6 cartas (2+2+2+1)
- **Action**: 5 cartas (2+2+1)
- **Defense**: 3 cartas (2+1)
- **Magic**: 2 cartas (1+1)
- **Event**: 1 carta (1)
- **Landmark**: 3 cartas (1+1+1) ✅
- **Trap**: 0 cartas ❌
- **Adicionais**: 10 cartas aleatórias

---

## 🔍 **Comandos de Debug**

### **Verificar Distribuição Exata**
```sql
-- Verificar quantidades exatas no player_cards
SELECT 
  c.type,
  c.name,
  pc.quantity,
  c.is_starter
FROM player_cards pc
JOIN cards c ON pc.card_id = c.id
WHERE pc.player_id = 'USER_ID' AND c.is_starter = true
ORDER BY c.type, c.name;
```

### **Verificar Total de Cartas no Deck**
```sql
-- Verificar total de cartas no deck
SELECT 
  name,
  array_length(card_ids, 1) as total_cards,
  COUNT(*) OVER () as deck_count
FROM player_decks 
WHERE player_id = 'USER_ID' AND is_starter_deck = true;
```

### **Verificar Landmarks Específicos**
```sql
-- Verificar se tem pelo menos 3 landmarks
SELECT 
  c.type,
  c.name,
  pc.quantity
FROM player_cards pc
JOIN cards c ON pc.card_id = c.id
WHERE pc.player_id = 'USER_ID' AND c.type = 'landmark' AND c.is_starter = true
ORDER BY c.name;
```

---

## 📋 **Checklist Final**

### **✅ Banco de Dados**
- [ ] 26 cartas starter únicas inseridas
- [ ] 3 landmarks no deck inicial
- [ ] 0 traps no deck inicial
- [ ] Quantidades corretas por carta
- [ ] Trigger atualizado com 3 landmarks e sem traps
- [ ] Função de correção atualizada

### **✅ Usuário Atual**
- [ ] Tem 27 cartas starter com quantidades corretas
- [ ] Tem 3 landmarks (mínimo necessário)
- [ ] Não tem traps
- [ ] Tem 10 cartas adicionais
- [ ] Deck inicial tem 37 cartas
- [ ] Deck inicial está ativo

### **✅ Interface**
- [ ] Deck Manager mostra 37 cartas
- [ ] Quantidades corretas por tipo
- [ ] 3 landmarks disponíveis
- [ ] Não há erros no console
- [ ] Funcionalidades funcionam

---

## 🚨 **Se Ainda Houver Problemas**

### **Problema 1: Quantidades incorretas**
```sql
-- Verificar quantidades no player_cards
SELECT c.name, pc.quantity 
FROM player_cards pc 
JOIN cards c ON pc.card_id = c.id 
WHERE pc.player_id = 'USER_ID' AND c.is_starter = true
ORDER BY c.name;
```

### **Problema 2: Cartas faltando**
```sql
-- Verificar se todas as cartas starter estão no banco
SELECT name, type FROM cards WHERE is_starter = true AND is_active = true ORDER BY type, name;
```

### **Problema 3: Deck com número errado**
```sql
-- Corrigir usuário específico
SELECT public.fix_user_cards_landmarks('SEU_EMAIL_AQUI');
```

### **Problema 4: Menos de 3 landmarks**
```sql
-- Verificar landmarks específicos
SELECT 
  c.name,
  pc.quantity
FROM player_cards pc
JOIN cards c ON pc.card_id = c.id
WHERE pc.player_id = 'USER_ID' AND c.type = 'landmark' AND c.is_starter = true;
```

---

## 🎉 **Resumo das Mudanças**

### **✅ Melhorias Implementadas:**
1. **3 Landmarks** (mínimo necessário para jogar)
2. **0 Traps** (removidas do deck inicial)
3. **27 cartas starter** (otimizadas)
4. **37 cartas totais** (27 + 10 adicionais)
5. **Balanceamento melhorado** para iniciantes

### **🏗️ Novas Cartas Landmark:**
- **Torre de Vigia**: +2 população e +1 defesa
- **Fonte da Prosperidade**: +1 comida e +1 moeda por turno

**🎉 Após aplicar as migrações, o deck inicial terá exatamente 37 cartas com 3 landmarks e sem traps!** 