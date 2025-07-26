# Guia Rápido - Testando Cartas do Painel Admin

## 🚀 Como Testar Suas Cartas

### **Passo 1: Criar uma Carta de Teste**

1. **Acesse o Painel Admin**
   - Vá para `http://localhost:8081/admin`
   - Faça login (crie uma conta se necessário)

2. **Criar Nova Carta**
   - Clique em "Gerenciar Cartas"
   - Clique em "Nova Carta"
   - Preencha os campos:

```json
{
  "name": "Teste de Carta",
  "type": "farm",
  "rarity": "common",
  "cost_coins": 2,
  "cost_food": 0,
  "cost_materials": 0,
  "cost_population": 0,
  "effect": "Produz 1 comida por turno.",
  "phase": "action",
  "use_per_turn": 0,
  "is_reactive": false,
  "is_active": true
}
```

### **Passo 2: Verificar se Funcionou**

1. **Volte ao Jogo**
   - Vá para `http://localhost:8081/`
   - Observe o canto inferior direito
   - Deve mostrar "Cartas carregadas: X"

2. **Testar no Jogo**
   - Inicie um novo jogo
   - A carta deve aparecer no deck
   - Jogue a carta no grid de fazenda
   - Verifique se a produção funciona

## 🎯 Exemplos de Cartas para Testar

### **Fazenda Simples**
```json
{
  "name": "Campo de Teste",
  "type": "farm",
  "effect": "Produz 1 comida por turno.",
  "cost_coins": 1
}
```

### **Ação Instantânea**
```json
{
  "name": "Comércio Rápido",
  "type": "action",
  "effect": "Ganhe 2 moedas instantaneamente.",
  "cost_coins": 0
}
```

### **Fazenda por Dado**
```json
{
  "name": "Pomar Especial",
  "type": "farm",
  "effect": "Produz 2 comida quando dado = 3.",
  "cost_coins": 3
}
```

## 🔍 Como Verificar se Funcionou

### **Indicadores Visuais**
- ✅ **Canto inferior direito**: Mostra número de cartas carregadas
- ✅ **Deck do jogo**: Carta aparece ao comprar
- ✅ **Grid de fazenda**: Carta pode ser jogada
- ✅ **Produção**: Recursos são gerados automaticamente

### **Logs do Console**
- Abra o DevTools (F12)
- Vá para a aba Console
- Procure por mensagens sobre carregamento de cartas

## 🛠️ Troubleshooting

### **Problema: Carta não aparece**
- ✅ Verifique se `is_active = true`
- ✅ Confirme se não há erros no console
- ✅ Recarregue a página do jogo
- ✅ Verifique se o Supabase está conectado

### **Problema: Efeito não funciona**
- ✅ Use padrões de texto exatos
- ✅ Verifique a fase de ativação
- ✅ Confirme se os custos estão corretos

### **Problema: Erro de conexão**
- ✅ Verifique as variáveis de ambiente
- ✅ Confirme se o Supabase está online
- ✅ Verifique a conexão com a internet

## 📝 Padrões de Texto que Funcionam

### **Produção Automática**
- "Produz X comida por turno"
- "Produz X moedas por turno"
- "Produz X materiais por turno"

### **Efeitos Instantâneos**
- "Ganhe X comida"
- "Ganhe X moedas"
- "Ganhe X materiais"

### **Produção por Dado**
- "Produz X comida quando dado = Y"
- "Produz X moedas se dado for Y"

## 🎮 Testando Diferentes Tipos

### **Farm (Fazenda)**
- Jogue no grid de fazenda
- Teste produção automática
- Teste produção por dado

### **Action (Ação)**
- Use na fase de ação
- Teste efeitos instantâneos
- Verifique custos

### **City (Cidade)**
- Jogue no grid de cidade
- Teste efeitos imediatos
- Teste produção contínua

### **Magic (Magia)**
- Use na fase de ação
- Teste efeitos únicos
- Verifique limitações

## 🔄 Atualizações em Tempo Real

### **Editar Carta Existente**
1. Vá para o painel admin
2. Encontre a carta
3. Clique em "Editar"
4. Modifique os valores
5. Salve
6. Volte ao jogo (não precisa recarregar)

### **Desativar Carta**
1. No painel admin
2. Marque como "Inativa"
3. A carta não aparecerá mais no jogo

### **Duplicar Carta**
1. No painel admin
2. Clique em "Duplicar"
3. Modifique o nome
4. Salve como nova carta

## 📊 Monitoramento

### **Painel Admin**
- Total de cartas criadas
- Cartas ativas vs inativas
- Estatísticas de uso

### **Jogo**
- Cartas carregadas
- Efeitos aplicados
- Produção gerada

## 🎯 Próximos Passos

### **Criar Coleção Completa**
1. Crie cartas de todos os tipos
2. Teste diferentes raridades
3. Balanceie custos e efeitos
4. Crie combinações interessantes

### **Testar Estratégias**
1. Jogue com suas cartas
2. Identifique combinações poderosas
3. Ajuste balanceamento
4. Crie novas cartas para complementar

---

**Dica**: As cartas criadas no painel admin são **integradas automaticamente** ao jogo. Não é necessário reiniciar ou recarregar - elas aparecem instantaneamente! 