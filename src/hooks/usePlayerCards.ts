import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Card } from '../types/card';

interface PlayerCard {
  id: string;
  player_id: string;
  card_id: string; // Agora é UUID
  quantity: number;
  unlocked_at: string;
}

export const usePlayerCards = () => {
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    console.log('usePlayerCards useEffect executado, refreshTrigger:', refreshTrigger);
    // Só buscar cartas se o usuário estiver autenticado
    const checkAuthAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        fetchPlayerCards();
      } else {
        setLoading(false);
        setPlayerCards([]);
      }
    };
    
    checkAuthAndFetch();
  }, [refreshTrigger]);

  const fetchPlayerCards = async () => {
    try {
      console.log('fetchPlayerCards iniciado...');
      setLoading(true);
      setError(null);

      // Buscar cartas que o jogador possui
      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) throw new Error('Usuário não autenticado');
      
      console.log('Buscando cartas para usuário:', user.data.user.id);
      
      const { data: playerCardsData, error: playerCardsError } = await supabase
        .from('player_cards')
        .select('*')
        .eq('player_id', user.data.user.id);

      if (playerCardsError) throw playerCardsError;

      console.log('Dados de player_cards encontrados:', playerCardsData);
      
      if (!playerCardsData || playerCardsData.length === 0) {
        console.log('Usuário não possui cartas ainda - tentando criar cartas starter...');
        await createStarterCardsForUser(user.data.user.id);
        // Tentar buscar novamente após criar as cartas
        await fetchPlayerCardsAfterCreation(user.data.user.id);
        return;
      }

      // Buscar dados completos das cartas usando UUIDs
      const cardIds = playerCardsData.map((pc: PlayerCard) => pc.card_id);
      console.log('Card IDs para buscar:', cardIds);
      
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .in('id', cardIds)
        .eq('is_active', true);

      if (cardsError) throw cardsError;
      
      console.log('Dados de cards encontrados:', cardsData);

      // Converter para formato do jogo, respeitando quantidade
      const gameCards: Card[] = [];
      (cardsData || []).forEach((adminCard: any) => {
        const playerCard = playerCardsData.find((pc: PlayerCard) => pc.card_id === adminCard.id);
        const quantity = playerCard?.quantity || 1;
        
        // Adicionar múltiplas cópias da mesma carta baseado na quantidade
        for (let i = 0; i < quantity; i++) {
          gameCards.push({
            id: adminCard.id, // Usar UUID puro do banco
            name: adminCard.name,
            type: adminCard.type,
            cost: {
              coins: adminCard.cost_coins || 0,
              food: adminCard.cost_food || 0,
              materials: adminCard.cost_materials || 0,
              population: adminCard.cost_population || 0,
            },
            effect: {
              description: adminCard.effect,
            },
            rarity: adminCard.rarity,
            activation: getActivationDescription(adminCard),
          });
        }
      });

      console.log(`Carregadas ${gameCards.length} cartas do jogador`);
      setPlayerCards(gameCards);
    } catch (err: any) {
      console.error('Error fetching player cards:', err);
      setError(err.message || 'Erro ao carregar cartas do jogador');
      // Em caso de erro, definir cartas vazias
      setPlayerCards([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar cartas após criação (evita recursão)
  const fetchPlayerCardsAfterCreation = async (userId: string) => {
    try {
      console.log('Buscando cartas após criação para usuário:', userId);
      
      const { data: playerCardsData, error: playerCardsError } = await supabase
        .from('player_cards')
        .select('*')
        .eq('player_id', userId);

      if (playerCardsError) throw playerCardsError;

      if (!playerCardsData || playerCardsData.length === 0) {
        console.log('Ainda não há cartas após criação');
        setPlayerCards([]);
        return;
      }

      // Buscar dados completos das cartas usando UUIDs
      const cardIds = playerCardsData.map((pc: PlayerCard) => pc.card_id);
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .in('id', cardIds)
        .eq('is_active', true);

      if (cardsError) throw cardsError;

      // Converter para formato do jogo, respeitando quantidade
      const gameCards: Card[] = [];
      (cardsData || []).forEach((adminCard: any) => {
        const playerCard = playerCardsData.find((pc: PlayerCard) => pc.card_id === adminCard.id);
        const quantity = playerCard?.quantity || 1;
        
        // Adicionar múltiplas cópias da mesma carta baseado na quantidade
        for (let i = 0; i < quantity; i++) {
          gameCards.push({
            id: adminCard.id, // Usar UUID puro do banco
            name: adminCard.name,
            type: adminCard.type,
            cost: {
              coins: adminCard.cost_coins || 0,
              food: adminCard.cost_food || 0,
              materials: adminCard.cost_materials || 0,
              population: adminCard.cost_population || 0,
            },
            effect: {
              description: adminCard.effect,
            },
            rarity: adminCard.rarity,
            activation: getActivationDescription(adminCard),
          });
        }
      });

      console.log(`Carregadas ${gameCards.length} cartas do jogador após criação`);
      setPlayerCards(gameCards);
    } catch (err: any) {
      console.error('Error fetching player cards after creation:', err);
      setPlayerCards([]);
    }
  };

  // Função para criar cartas starter para um usuário
  const createStarterCardsForUser = async (userId: string) => {
    try {
      console.log('Criando cartas starter para usuário:', userId);
      
      // Buscar cartas starter por slug (mesma lógica do trigger)
      const { data: starterCards, error: starterError } = await supabase
        .from('cards')
        .select('id, slug')
        .in('slug', [
          'pequeno-jardim-427',
          'barraca-4', 
          'colheita-736',
          'fazenda-simples-69',
          'oficina-simples-884',
          'comrcio-simples-944'
        ])
        .eq('is_active', true);

      if (starterError) throw starterError;

      if (!starterCards || starterCards.length === 0) {
        console.error('Nenhuma carta starter encontrada');
        return;
      }

      console.log(`Encontradas ${starterCards.length} cartas starter:`, starterCards);

      // Criar entradas na tabela player_cards com as quantidades corretas
      const playerCardsToInsert: Array<{
        player_id: string;
        card_id: string;
        quantity: number;
      }> = [];
      
      starterCards.forEach(card => {
        let quantity = 3; // padrão
        
        // Definir quantidade baseada no slug (mesma lógica do trigger)
        switch (card.slug) {
          case 'pequeno-jardim-427':
            quantity = 6;
            break;
          case 'barraca-4':
            quantity = 4;
            break;
          case 'colheita-736':
            quantity = 4;
            break;
          case 'fazenda-simples-69':
            quantity = 5;
            break;
          case 'oficina-simples-884':
            quantity = 5;
            break;
          case 'comrcio-simples-944':
            quantity = 4;
            break;
        }
        
        playerCardsToInsert.push({
          player_id: userId,
          card_id: card.id,
          quantity: quantity
        });
      });

      console.log('Inserindo cartas:', playerCardsToInsert);

      const { error: insertError } = await supabase
        .from('player_cards')
        .insert(playerCardsToInsert);

      if (insertError) {
        console.error('Erro ao inserir cartas starter:', insertError);
        return;
      }

      console.log('Cartas starter criadas com sucesso');
    } catch (err: any) {
      console.error('Erro ao criar cartas starter:', err);
    }
  };

  const getActivationDescription = (adminCard: any): string => {
    const phase = adminCard.phase;
    const usePerTurn = adminCard.use_per_turn || 1;
    const isReactive = adminCard.is_reactive || false;

    let description = '';

    switch (phase) {
      case 'draw':
        description = 'Fase de compra.';
        break;
      case 'action':
        description = 'Fase de ação.';
        break;
      case 'reaction':
        description = 'Fase de reação.';
        break;
    }

    if (usePerTurn > 0) {
      description += ` Pode ser usada ${usePerTurn} vez(es) por turno.`;
    }

    if (isReactive) {
      description += ' Reativa a eventos.';
    }

    return description;
  };

  // Função para adicionar carta ao jogador (para testes)
  const addCardToPlayer = async (cardId: string, quantity: number = 1) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Verificar se o jogador já tem essa carta
      const { data: existingCard, error: fetchError } = await supabase
        .from('player_cards')
        .select('*')
        .eq('player_id', user.id)
        .eq('card_id', cardId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingCard) {
                 // Atualizar quantidade existente
         const { error: updateError } = await supabase
           .from('player_cards')
           .update({ 
             quantity: existingCard.quantity + quantity
           })
           .eq('player_id', user.id)
           .eq('card_id', cardId);

        if (updateError) throw updateError;
      } else {
        // Criar nova entrada
        const { error: insertError } = await supabase
          .from('player_cards')
          .insert({
            player_id: user.id,
            card_id: cardId,
            quantity: quantity,
            unlocked_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      // Recarregar dados
      await fetchPlayerCards();
    } catch (err: any) {
      console.error('Erro ao adicionar carta:', err);
      throw err;
    }
  };

  const refresh = useCallback(async () => {
    console.log('usePlayerCards refresh chamado, incrementando refreshTrigger...');
    setRefreshTrigger(prev => {
      const newValue = prev + 1;
      console.log('refreshTrigger atualizado:', { prev, newValue });
      return newValue;
    });
    console.log('Chamando fetchPlayerCards...');
    await fetchPlayerCards();
    console.log('fetchPlayerCards concluído');
  }, []);

  return {
    playerCards,
    loading,
    error,
    refresh,
    addCardToPlayer
  };
};