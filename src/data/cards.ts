import { Card } from '../types/game';

export const farmCards: Card[] = [
  {
    id: 'small-garden',
    name: 'Pequeno Jardim',
    type: 'farm',
    cost: { coins: 0 },
    effect: {
      description: 'Produz 1 comida quando o dado mostra 1',
      production: { food: 1 },
      trigger: 'dice',
      diceNumbers: [1]
    },
    rarity: 'starter'
  },
  {
    id: 'wheat-field',
    name: 'Campo de Trigo',
    type: 'farm',
    cost: { coins: 1 },
    effect: {
      description: 'Produz 1 comida quando o dado mostra 1',
      production: { food: 1 },
      trigger: 'dice',
      diceNumbers: [1]
    },
    rarity: 'common'
  },
  {
    id: 'cattle-ranch',
    name: 'Rancho de Gado',
    type: 'farm',
    cost: { coins: 6 },
    effect: {
      description: 'Produz 3 comida quando o dado mostra 2',
      production: { food: 3 },
      trigger: 'dice',
      diceNumbers: [2]
    },
    rarity: 'uncommon'
  },
  {
    id: 'greenhouse',
    name: 'Estufa',
    type: 'farm',
    cost: { coins: 3 },
    effect: {
      description: 'Produz 1 comida a cada turno',
      production: { food: 1 },
      trigger: 'turn'
    },
    rarity: 'common'
  },
  {
    id: 'barn',
    name: 'Celeiro',
    type: 'farm',
    cost: { coins: 4 },
    effect: {
      description: 'Dobra a produção de comida de cartas adjacentes',
      trigger: 'combo',
      comboEffect: 'double_food_adjacent'
    },
    rarity: 'uncommon'
  },
  {
    id: 'orchard',
    name: 'Pomar',
    type: 'farm',
    cost: { coins: 8 },
    effect: {
      description: 'Produz 2 comida e 1 moeda quando o dado mostra 5-6',
      production: { food: 2, coins: 1 },
      trigger: 'dice',
      diceNumbers: [5, 6]
    },
    rarity: 'rare'
  },
  {
    id: 'vineyard',
    name: 'Vinhedo',
    type: 'farm',
    cost: { coins: 12, materials: 2 },
    effect: {
      description: 'Produz 3 moedas quando o dado mostra 6, +1 por cada vinhedo adicional',
      production: { coins: 3 },
      trigger: 'dice',
      diceNumbers: [6],
      comboEffect: 'vineyard_chain'
    },
    rarity: 'rare'
  },
  {
    id: 'dairy-farm',
    name: 'Fazenda de Leite',
    type: 'farm',
    cost: { coins: 7 },
    effect: {
      description: 'Produz 2 comida e 1 moeda quando o dado mostra 3',
      production: { food: 2, coins: 1 },
      trigger: 'dice',
      diceNumbers: [3]
    },
    rarity: 'uncommon'
  },
  {
    id: 'beehive',
    name: 'Colmeia',
    type: 'farm',
    cost: { coins: 2 },
    effect: {
      description: 'Produz 1 comida e aumenta produção de pomares em 50%',
      production: { food: 1 },
      trigger: 'turn',
      comboEffect: 'boost_orchards'
    },
    rarity: 'common'
  },
  {
    id: 'simple-farm',
    name: 'Fazenda Simples',
    type: 'farm',
    cost: { coins: 0 },
    effect: {
      description: 'Produz 1 comida quando o dado mostra 2',
      production: { food: 1 },
      trigger: 'dice',
      diceNumbers: [2]
    },
    rarity: 'starter'
  }
];

export const cityCards: Card[] = [
  {
    id: 'tent',
    name: 'Barraca',
    type: 'city',
    cost: { coins: 0 },
    effect: {
      description: 'Adiciona 1 população',
      production: { population: 1 },
      trigger: 'instant'
    },
    rarity: 'starter'
  },
  {
    id: 'house',
    name: 'Casa',
    type: 'city',
    cost: { coins: 2, materials: 1 },
    effect: {
      description: 'Adiciona 1 população',
      production: { population: 1 },
      trigger: 'instant'
    },
    rarity: 'common'
  },
  {
    id: 'market',
    name: 'Mercado',
    type: 'city',
    cost: { coins: 5 },
    effect: {
      description: 'Produz 1 moeda por população quando o dado mostra 3',
      trigger: 'dice',
      diceNumbers: [3],
      comboEffect: 'market_population'
    },
    rarity: 'uncommon'
  },
  {
    id: 'factory',
    name: 'Fábrica',
    type: 'city',
    cost: { coins: 8, materials: 2 },
    effect: {
      description: 'Produz 3 materiais quando o dado mostra 4',
      production: { materials: 3 },
      trigger: 'dice',
      diceNumbers: [4]
    },
    rarity: 'uncommon'
  },
  {
    id: 'school',
    name: 'Escola',
    type: 'city',
    cost: { coins: 6, materials: 1 },
    effect: {
      description: 'Produz 1 moeda por cada 2 casas construídas',
      trigger: 'combo',
      comboEffect: 'school_houses'
    },
    rarity: 'rare'
  },
  {
    id: 'bank',
    name: 'Banco',
    type: 'city',
    cost: { coins: 12 },
    effect: {
      description: 'Produz 1 moeda para cada edifício da cidade a cada turno',
      trigger: 'turn',
      comboEffect: 'bank_buildings'
    },
    rarity: 'rare'
  },
  {
    id: 'hospital',
    name: 'Hospital',
    type: 'city',
    cost: { coins: 15, materials: 3 },
    effect: {
      description: 'Protege contra eventos de crise e cura 1 população por turno',
      production: { population: 1 },
      trigger: 'turn',
      comboEffect: 'crisis_protection'
    },
    rarity: 'rare'
  },
  {
    id: 'shopping-mall',
    name: 'Shopping Center',
    type: 'city',
    cost: { coins: 18, materials: 4 },
    effect: {
      description: 'Dobra a produção de moedas de mercados adjacentes',
      trigger: 'combo',
      comboEffect: 'boost_markets'
    },
    rarity: 'rare'
  },
  {
    id: 'research-lab',
    name: 'Laboratório de Pesquisa',
    type: 'city',
    cost: { coins: 20, materials: 5 },
    effect: {
      description: 'Permite comprar cartas de raridade superior e +1 carta por turno',
      trigger: 'turn',
      comboEffect: 'advanced_cards'
    },
    rarity: 'legendary'
  },
  {
    id: 'simple-workshop',
    name: 'Oficina Simples',
    type: 'city',
    cost: { coins: 0 },
    effect: {
      description: 'Produz 1 material quando o dado mostra 4',
      production: { materials: 1 },
      trigger: 'dice',
      diceNumbers: [4]
    },
    rarity: 'starter'
  }
];

export const actionCards: Card[] = [
  {
    id: 'basic-harvest',
    name: 'Colheita Básica',
    type: 'action',
    cost: { coins: 0 },
    effect: {
      description: 'Ganha 1 comida',
      production: { food: 1 },
      trigger: 'instant'
    },
    rarity: 'starter'
  },
  {
    id: 'harvest',
    name: 'Colheita',
    type: 'action',
    cost: { coins: 1 },
    effect: {
      description: 'Ativa todas as fazendas imediatamente e ganha +1 comida extra',
      production: { food: 1 },
      trigger: 'instant'
    },
    rarity: 'common'
  },
  {
    id: 'trade',
    name: 'Comércio',
    type: 'action',
    cost: {},
    effect: {
      description: 'Troque 2 comida por 3 moedas ou 3 moedas por 2 comida',
      trigger: 'instant'
    },
    rarity: 'common'
  },
  {
    id: 'construction',
    name: 'Construção',
    type: 'action',
    cost: { coins: 2 },
    effect: {
      description: 'Próxima construção custa 3 recursos a menos (qualquer tipo)',
      trigger: 'instant'
    },
    rarity: 'uncommon'
  },
  {
    id: 'festival',
    name: 'Festival',
    type: 'action',
    cost: { coins: 3, food: 2 },
    effect: {
      description: 'Todos os jogadores ganham +2 moedas, você ganha +1 população',
      production: { coins: 2, population: 1 },
      trigger: 'instant'
    },
    rarity: 'uncommon'
  },
  {
    id: 'innovation',
    name: 'Inovação',
    type: 'action',
    cost: { coins: 4, materials: 1 },
    effect: {
      description: 'Compre 2 cartas extras e escolha 1 para manter',
      trigger: 'instant'
    },
    rarity: 'rare'
  },
  {
    id: 'emergency-response',
    name: 'Resposta de Emergência',
    type: 'action',
    cost: { coins: 5 },
    effect: {
      description: 'Cancela o próximo evento de crise e ganha 2 moedas',
      production: { coins: 2 },
      trigger: 'instant',
      comboEffect: 'cancel_crisis'
    },
    rarity: 'rare'
  },
  {
    id: 'mega-harvest',
    name: 'Mega Colheita',
    type: 'action',
    cost: { coins: 8, food: 3 },
    effect: {
      description: 'Ativa todas as fazendas 3x e ganha +3 comida',
      production: { food: 3 },
      trigger: 'instant'
    },
    rarity: 'rare'
  },
  // Action Cards
  {
    id: 'market-day',
    name: 'Dia de Mercado',
    type: 'action',
    rarity: 'common',
    cost: { coins: 1 },
    effect: {
      description: 'Compre uma carta adicional no próximo turno',
      trigger: 'instant',
      buyExtraCard: 1
    }
  },
  {
    id: 'emergency-response',
    name: 'Resposta de Emergência',
    type: 'action',
    rarity: 'uncommon',
    cost: { coins: 2 },
    effect: {
      description: 'Cancele o próximo evento de crise',
      trigger: 'instant',
      crisisProtection: true
    }
  },
  {
    id: 'trade-deal',
    name: 'Acordo Comercial',
    type: 'action',
    rarity: 'common',
    cost: { coins: 1 },
    effect: {
      description: 'Ganhe 3 moedas e descarte uma carta no próximo turno',
      trigger: 'instant',
      production: { coins: 3 },
      discardNextTurn: 1
    }
  },
  {
    id: 'simple-trade',
    name: 'Comércio Simples',
    type: 'action',
    rarity: 'starter',
    cost: { coins: 0 },
    effect: {
      description: 'Ganha 1 moeda',
      production: { coins: 1 },
      trigger: 'instant'
    }
  }
];

// Novas cartas de eventos climáticos/crises
export const eventCards: Card[] = [
  {
    id: 'drought',
    name: 'Seca',
    type: 'event',
    cost: {},
    effect: {
      description: 'Todas as fazendas produzem 50% menos neste turno',
      trigger: 'crisis',
      crisisEffect: 'reduce_farm_production',
      duration: 1
    },
    rarity: 'crisis'
  },
  {
    id: 'storm',
    name: 'Tempestade',
    type: 'event',
    cost: {},
    effect: {
      description: 'Edifícios da cidade produzem 30% menos, mas fazendas ganham +1 comida',
      trigger: 'crisis',
      crisisEffect: 'storm_effect',
      duration: 1
    },
    rarity: 'crisis'
  },
  {
    id: 'plague',
    name: 'Praga',
    type: 'event',
    cost: {},
    effect: {
      description: 'Perde 2 população, mas ganha 5 moedas de compensação',
      production: { coins: 5 },
      trigger: 'crisis',
      crisisEffect: 'lose_population',
      duration: 1
    },
    rarity: 'crisis'
  },
  {
    id: 'economic-boom',
    name: 'Boom Econômico',
    type: 'event',
    cost: {},
    effect: {
      description: 'Todos os edifícios da cidade produzem o dobro neste turno',
      trigger: 'crisis',
      crisisEffect: 'boost_city_production',
      duration: 1
    },
    rarity: 'crisis'
  },
  {
    id: 'bumper-crop',
    name: 'Safra Excepcional',
    type: 'event',
    cost: {},
    effect: {
      description: 'Todas as fazendas produzem o dobro neste turno',
      trigger: 'crisis',
      crisisEffect: 'boost_farm_production',
      duration: 1
    },
    rarity: 'crisis'
  }
];

export const landmarkCards: Card[] = [
  {
    id: 'city-hall',
    name: 'Prefeitura',
    type: 'landmark',
    cost: { coins: 15, materials: 3 },
    effect: {
      description: 'Compre 2 cartas por turno em vez de 1',
      trigger: 'turn',
      comboEffect: 'extra_cards'
    },
    rarity: 'legendary'
  },
  {
    id: 'university',
    name: 'Universidade',
    type: 'landmark',
    cost: { coins: 20, materials: 4 },
    effect: {
      description: 'Ganha moedas extras baseado no número de edifícios diferentes',
      trigger: 'turn',
      comboEffect: 'diversity_bonus'
    },
    rarity: 'legendary'
  },
  {
    id: 'grand-market',
    name: 'Grande Mercado',
    type: 'landmark',
    cost: { coins: 25, food: 5 },
    effect: {
      description: 'Todos os edifícios produzem recursos dobrados',
      trigger: 'combo',
      comboEffect: 'double_all_production'
    },
    rarity: 'legendary'
  },
  {
    id: 'weather-station',
    name: 'Estação Meteorológica',
    type: 'landmark',
    cost: { coins: 30, materials: 6 },
    effect: {
      description: 'Permite prever e cancelar eventos climáticos',
      trigger: 'turn',
      comboEffect: 'weather_prediction'
    },
    rarity: 'legendary'
  },
  {
    id: 'trade-center',
    name: 'Centro Comercial',
    type: 'landmark',
    cost: { coins: 35, materials: 8 },
    effect: {
      description: 'Troque recursos a qualquer momento e ganhe bônus de comércio',
      trigger: 'instant',
      comboEffect: 'enhanced_trading'
    },
    rarity: 'legendary'
  }
];

// Cartas de booster/expansão
export const boosterCards: Card[] = [
  {
    id: 'golden-wheat',
    name: 'Trigo Dourado',
    type: 'farm',
    cost: { coins: 3 },
    effect: {
      description: 'Produz 2 comida quando o dado mostra 1, +1 por cada campo de trigo',
      production: { food: 2 },
      trigger: 'dice',
      diceNumbers: [1],
      comboEffect: 'wheat_chain'
    },
    rarity: 'booster'
  },
  {
    id: 'smart-factory',
    name: 'Fábrica Inteligente',
    type: 'city',
    cost: { coins: 15, materials: 4 },
    effect: {
      description: 'Produz 5 materiais quando o dado mostra 4, +1 por cada fábrica',
      production: { materials: 5 },
      trigger: 'dice',
      diceNumbers: [4],
      comboEffect: 'factory_chain'
    },
    rarity: 'booster'
  },
  {
    id: 'miracle-grow',
    name: 'Crescimento Milagroso',
    type: 'action',
    cost: { coins: 6 },
    effect: {
      description: 'Todas as fazendas produzem 3x neste turno',
      trigger: 'instant'
    },
    rarity: 'booster'
  }
];

export const allCards = [
  ...farmCards, 
  ...cityCards, 
  ...actionCards, 
  ...landmarkCards, 
  ...eventCards, 
  ...boosterCards
];