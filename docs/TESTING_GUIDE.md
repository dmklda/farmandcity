# 🧪 Guia de Teste - Sistema de Deck Famand

## 🎯 **Objetivo**

Verificar se o sistema de deck está funcionando corretamente após as implementações, garantindo que todos os requisitos foram atendidos.

---

## ✅ **Checklist de Testes**

### **1. Carregamento de Cartas do Supabase**

#### **Teste 1.1: Cartas Starter**
- [ ] Acessar `http://localhost:8085/`
- [ ] Verificar se cartas starter carregam automaticamente
- [ ] Confirmar que há 6 cartas starter disponíveis
- [ ] Verificar se cartas starter têm custo zero

#### **Teste 1.2: Todas as Cartas**
- [ ] Verificar componente `CardsStatus` no canto inferior direito
- [ ] Confirmar que mostra "Cards loaded: X"
- [ ] Verificar se cartas do painel admin aparecem no jogo

#### **Teste 1.3: Fallback Local**
- [ ] Desconectar internet temporariamente
- [ ] Recarregar página
- [ ] Verificar se cartas starter locais carregam
- [ ] Confirmar que jogo não quebra

### **2. Sistema de Desbloqueio**

#### **Teste 2.1: Cartas Desbloqueadas**
- [ ] Verificar componente `UnlockedCardsStatus`
- [ ] Confirmar que mostra total de cartas desbloqueadas
- [ ] Verificar separação entre starter e adquiridas

#### **Teste 2.2: Validação de Propriedade**
- [ ] Tentar jogar carta que não possui
- [ ] Verificar mensagem "Você não possui esta carta"
- [ ] Confirmar que carta não é jogável

#### **Teste 2.3: Cartas no Deck Ativo**
- [ ] Tentar jogar carta que não está no deck ativo
- [ ] Verificar mensagem "Carta não está no deck ativo"
- [ ] Confirmar que carta não é jogável

### **3. Endpoints Públicos**

#### **Teste 3.1: Endpoint /cards**
```bash
curl http://localhost:8085/api/cards
```
- [ ] Verificar se retorna lista de cartas ativas
- [ ] Confirmar formato JSON correto
- [ ] Verificar se inclui todos os campos necessários

#### **Teste 3.2: Endpoint /cards/:id**
```bash
curl http://localhost:8085/api/cards/[ID_DA_CARTA]
```
- [ ] Verificar se retorna carta específica
- [ ] Confirmar formato JSON correto
- [ ] Testar com ID inválido (deve retornar 404)

#### **Teste 3.3: Endpoint /decks/:userId**
```bash
curl http://localhost:8085/api/decks/[USER_ID]
```
- [ ] Verificar se retorna decks do usuário
- [ ] Confirmar se inclui cartas dos decks
- [ ] Testar com usuário sem decks (deve retornar array vazio)

### **4. Sistema de Decks**

#### **Teste 4.1: Deck Inicial**
- [ ] Criar novo usuário
- [ ] Verificar se deck inicial é criado automaticamente
- [ ] Confirmar que contém cartas starter
- [ ] Verificar se está ativo por padrão

#### **Teste 4.2: Limite de 28 Cartas**
- [ ] Tentar criar deck com mais de 28 cartas
- [ ] Verificar mensagem de erro
- [ ] Confirmar que deck não é criado

#### **Teste 4.3: CRUD de Decks**
- [ ] Criar novo deck
- [ ] Editar nome do deck
- [ ] Adicionar/remover cartas
- [ ] Deletar deck
- [ ] Ativar/deativar deck

### **5. Booster Packs**

#### **Teste 5.1: Listagem de Packs**
- [ ] Verificar se packs aparecem no painel admin
- [ ] Confirmar preços e descrições
- [ ] Verificar se packs inativos não aparecem

#### **Teste 5.2: Compra de Pack**
- [ ] Comprar booster pack
- [ ] Verificar se cartas são adicionadas ao inventário
- [ ] Confirmar registro da compra
- [ ] Verificar se cartas starter não são incluídas

---

## 🔧 **Comandos de Teste**

### **Verificar Banco de Dados**
```sql
-- Verificar cartas starter
SELECT * FROM cards WHERE is_starter = true AND is_active = true;

-- Verificar cartas de um usuário
SELECT pc.*, c.name, c.type, c.rarity 
FROM player_cards pc 
JOIN cards c ON pc.card_id = c.id 
WHERE pc.player_id = '[USER_ID]';

-- Verificar decks de um usuário
SELECT * FROM player_decks WHERE player_id = '[USER_ID]';

-- Verificar booster packs
SELECT * FROM booster_packs WHERE is_active = true;
```

### **Verificar Logs**
```bash
# Verificar logs do servidor
npm run dev

# Verificar logs do console (F12)
console.log('Starter deck:', starterDeck);
console.log('Unlocked cards:', unlockedCards);
console.log('Active deck:', activeDeck);
```

---

## 🐛 **Problemas Comuns**

### **Problema: Cartas não carregam**
**Solução:**
1. Verificar conexão com Supabase
2. Verificar se tabela `cards` existe
3. Verificar se há cartas com `is_active = true`
4. Verificar logs de erro no console

### **Problema: Deck inicial não é criado**
**Solução:**
1. Verificar trigger `handle_new_user`
2. Verificar se cartas starter existem
3. Verificar se usuário foi criado corretamente
4. Executar migração manual se necessário

### **Problema: Validação não funciona**
**Solução:**
1. Verificar hook `useUnlockedCards`
2. Verificar função `hasCard`
3. Verificar se `player_cards` tem dados
4. Verificar se deck ativo existe

### **Problema: Endpoints não respondem**
**Solução:**
1. Verificar se Next.js está rodando
2. Verificar rotas em `src/pages/api/`
3. Verificar conexão com Supabase nos endpoints
4. Verificar logs de erro

---

## 📊 **Métricas de Sucesso**

### **Performance**
- ✅ **Carregamento inicial**: < 3s
- ✅ **Validação de carta**: < 100ms
- ✅ **Criação de deck**: < 1s
- ✅ **Compra de pack**: < 2s

### **Funcionalidade**
- ✅ **100% das cartas** carregam do Supabase
- ✅ **Starter deck** sempre disponível
- ✅ **Validação** funciona corretamente
- ✅ **Endpoints** respondem adequadamente
- ✅ **Limite de 28 cartas** é respeitado

### **Experiência do Usuário**
- ✅ **Feedback visual** claro
- ✅ **Mensagens de erro** informativas
- ✅ **Loading states** apropriados
- ✅ **Fallbacks** funcionam

---

## 🎯 **Resultado Esperado**

Após executar todos os testes, o sistema deve:

1. **Carregar todas as cartas** do Supabase automaticamente
2. **Inicializar novos usuários** com deck starter
3. **Validar propriedade** de cartas antes de jogar
4. **Respeitar limite** de 28 cartas por deck
5. **Fornecer endpoints** públicos funcionais
6. **Permitir compra** de booster packs
7. **Manter consistência** entre frontend e backend

---

## 🚀 **Próximos Passos**

Após testes bem-sucedidos:

1. **Deploy** para produção
2. **Monitoramento** de performance
3. **Analytics** de uso
4. **Feedback** dos usuários
5. **Iterações** baseadas em dados

**✅ Sistema pronto para uso em produção!** 