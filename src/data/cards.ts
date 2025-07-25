// Cartas iniciais (starter cards) do jogo
import { Card, CardType, CardRarity } from '../types/card';

export const starterCards: Card[] = [
  {
    id: 'starter-garden',
    name: 'Pequeno Jardim',
    type: 'farm',
    cost: { coins: 0 },
    effect: { description: 'Produz 1 comida por turno.' },
    rarity: 'common',
  },
  {
    id: 'starter-tent',
    name: 'Barraca',
    type: 'city',
    cost: { coins: 0 },
    effect: { description: 'Fornece 1 população imediatamente.' },
    rarity: 'common',
  },
  {
    id: 'starter-harvest',
    name: 'Colheita Básica',
    type: 'action',
    cost: { coins: 0 },
    effect: { description: 'Ganhe 1 comida instantaneamente.' },
    rarity: 'common',
  },
  {
    id: 'starter-farm',
    name: 'Fazenda Simples',
    type: 'farm',
    cost: { coins: 0 },
    effect: { description: 'Produz 1 comida quando ativada por dado.' },
    rarity: 'common',
  },
  {
    id: 'starter-workshop',
    name: 'Oficina Simples',
    type: 'city',
    cost: { coins: 0 },
    effect: { description: 'Produz 1 material por turno.' },
    rarity: 'common',
  },
  {
    id: 'starter-shop',
    name: 'Comércio Simples',
    type: 'action',
    cost: { coins: 0 },
    effect: { description: 'Ganhe 1 moeda instantaneamente.' },
    rarity: 'common',
  },
];

// Novos tipos e raridades
export const extendedTypes: CardType[] = [
  'farm', 'city', 'action', 'landmark', 'event', 'defense', 'magic', 'trap'
];

export const extendedRarities: CardRarity[] = [
  'common', 'uncommon', 'rare', 'legendary', 'crisis', 'booster', 'ultra', 'secret'
];

export const baseDeck: Card[] = [
  {
    id: 'farm-wheat',
    name: 'Campo de Trigo',
    type: 'farm',
    cost: { coins: 2 },
    effect: { description: 'Produz 1 comida quando ativado por dado 1.' },
    rarity: 'common',
  },
  {
    id: 'farm-cattle',
    name: 'Rancho de Gado',
    type: 'farm',
    cost: { coins: 3 },
    effect: { description: 'Produz 2 comida quando ativado por dado 2.' },
    rarity: 'common',
  },
  {
    id: 'city-house',
    name: 'Casa',
    type: 'city',
    cost: { coins: 2, materials: 1 },
    effect: { description: 'Fornece 1 população imediatamente.' },
    rarity: 'common',
  },
  {
    id: 'action-harvest',
    name: 'Colheita',
    type: 'action',
    cost: { coins: 1 },
    effect: { description: 'Ganhe 2 comida instantaneamente.' },
    rarity: 'uncommon',
  },
  {
    id: 'city-market',
    name: 'Mercado',
    type: 'city',
    cost: { coins: 4, materials: 2 },
    effect: { description: 'Produz 2 moedas por turno.' },
    rarity: 'uncommon',
  },
  {
    id: 'defense-wall',
    name: 'Muralha de Pedra',
    type: 'defense',
    cost: { coins: 3, materials: 4 },
    effect: { description: 'Protege contra eventos de crise por 2 turnos.' },
    rarity: 'uncommon',
  },
  {
    id: 'magic-growth',
    name: 'Magia de Crescimento',
    type: 'magic',
    cost: { coins: 2, food: 2 },
    effect: { description: 'Dobra a produção de comida neste turno.' },
    rarity: 'rare',
  },
  {
    id: 'trap-pit',
    name: 'Armadilha de Fossa',
    type: 'trap',
    cost: { coins: 1, materials: 2 },
    effect: { description: 'Anula o efeito de uma carta de evento.' },
    rarity: 'ultra',
  },
  {
    id: 'city-palace',
    name: 'Palácio Real',
    type: 'city',
    cost: { coins: 8, materials: 6, population: 2 },
    effect: { description: 'Fornece 3 população e +2 reputação.' },
    rarity: 'secret',
  },
  {
    id: 'farm-orchard',
    name: 'Pomar Exótico',
    type: 'farm',
    cost: { coins: 4, food: 1, materials: 2 },
    effect: { description: 'Produz 3 comida quando ativado por dado 5.' },
    rarity: 'rare',
  },
  {
    id: 'landmark-obelisk',
    name: 'Obelisco Antigo',
    type: 'landmark',
    cost: { coins: 10, materials: 10, population: 3, food: 5 },
    effect: { description: 'Garante 1 marco e +5 reputação.' },
    rarity: 'legendary',
  },
  {
    id: 'event-festival',
    name: 'Festival da Colheita',
    type: 'event',
    cost: { coins: 2, food: 2 },
    effect: { description: 'Todos os jogadores ganham 2 comida.' },
    rarity: 'uncommon',
  },
  {
    id: "farm-beehive",
    name: "Colmeia",
    type: "farm",
    cost: { coins: 3, materials: 1, food: 1 },
    effect: { description: "Produz 1 comida e 1 moeda quando ativado por dado 3." },
    rarity: "uncommon"
  },
  {
    id: "city-tower",
    name: "Torre de Vigia",
    type: "city",
    cost: { coins: 4, materials: 2 },
    effect: { description: "Permite visualizar cartas do oponente por 2 turnos." },
    rarity: "rare"
  },
  {
    id: "action-trade",
    name: "Troca Comercial",
    type: "action",
    cost: { coins: 1 },
    effect: { description: "Troque 2 materiais por 2 comidas." },
    rarity: "common"
  },
  {
    id: "magic-rainfall",
    name: "Chuva Mágica",
    type: "magic",
    cost: { coins: 2, food: 1 },
    effect: { description: "Todas as fazendas produzem +1 comida neste turno." },
    rarity: "rare"
  },
  {
    id: "defense-barricade",
    name: "Barricada",
    type: "defense",
    cost: { coins: 2, materials: 2 },
    effect: { description: "Bloqueia o efeito de 1 carta de ação do inimigo." },
    rarity: "uncommon"
  },
  {
    id: "trap-net",
    name: "Armadilha de Rede",
    type: "trap",
    cost: { coins: 1 },
    effect: { description: "Impede que o oponente jogue cartas de cidade neste turno." },
    rarity: "ultra"
  },
  {
    id: "event-storm",
    name: "Tempestade Repentina",
    type: "event",
    cost: { coins: 0 },
    effect: { description: "Todas as fazendas deixam de produzir neste turno." },
    rarity: "crisis"
  },
  {
    id: "landmark-garden",
    name: "Jardim Suspenso",
    type: "landmark",
    cost: { coins: 12, materials: 6, population: 2, food: 4 },
    effect: { description: "Fornece 5 reputação e +1 produção de comida permanente." },
    rarity: "legendary"
  },
  {
    id: "farm-mushroom",
    name: "Cultivo de Cogumelos",
    type: "farm",
    cost: { coins: 2, food: 1 },
    effect: { description: "Produz 2 comidas quando ativado por dado 4." },
    rarity: "common"
  },
  {
    id: "magic-portal",
    name: "Portal Dimensional",
    type: "magic",
    cost: { coins: 5, food: 2 },
    effect: { description: "Jogue novamente uma carta já utilizada neste turno." },
    rarity: "secret"
  },
  {
    id: "city-hospital",
    name: "Posto de Saúde",
    type: "city",
    cost: { coins: 4, materials: 2, population: 1 },
    effect: { description: "Recupera 1 população perdida por evento." },
    rarity: "uncommon"
  },
  {
    id: "farm-vineyard",
    name: "Vinhedo",
    type: "farm",
    cost: { coins: 3, materials: 1 },
    effect: { description: "Produz 1 comida e 1 reputação quando ativado por dado 6." },
    rarity: "rare"
  },
  {
    id: "trap-collapse",
    name: "Colapso Estrutural",
    type: "trap",
    cost: { coins: 2, materials: 2 },
    effect: { description: "Desativa uma carta de cidade inimiga por 1 turno." },
    rarity: "rare"
  },
  {
    id: "action-hire",
    name: "Contratar Trabalhadores",
    type: "action",
    cost: { coins: 2 },
    effect: { description: "Ganhe 1 população instantaneamente." },
    rarity: "common"
  },
  {
    id: "event-invasion",
    name: "Invasão de Bandidos",
    type: "event",
    cost: { coins: 0 },
    effect: { description: "Todos os jogadores perdem 1 moeda e 1 material." },
    rarity: "crisis"
  },
  {
    id: "magic-sun-blessing",
    name: "Bênção do Sol",
    type: "magic",
    cost: { coins: 3 },
    effect: { description: "Todas as suas fazendas produzem +1 comida neste turno." },
    rarity: "uncommon"
  },
  {
    id: "defense-watchdog",
    name: "Cão de Guarda",
    type: "defense",
    cost: { coins: 1, food: 1 },
    effect: { description: "Impede que uma armadilha afete uma carta sua." },
    rarity: "common"
  },
  {
    id: "landmark-gate",
    name: "Portão da Cidade",
    type: "landmark",
    cost: { coins: 6, materials: 4 },
    effect: { description: "Fornece +2 reputação e defesa contra eventos." },
    rarity: "legendary"
  },
  {
    id: "city-factory",
    name: "Fábrica de Tijolos",
    type: "city",
    cost: { coins: 5, materials: 1 },
    effect: { description: "Produz 2 materiais a cada 2 turnos." },
    rarity: "rare"
  },
  {
    id: "farm-ricefield",
    name: "Campo de Arroz",
    type: "farm",
    cost: { coins: 2 },
    effect: { description: "Produz 1 comida quando ativado por dado 1 ou 2." },
    rarity: "common"
  },
  // --- CARTAS GERADAS PARA COBRIR LACUNAS ---
  {
    id: "farm-ancient-seed",
    name: "Semente Ancestral",
    type: "farm",
    cost: { coins: 2, food: 1, materials: 1 },
    effect: { description: "Produz 1 comida extra a cada 3 turnos. Se ativada por dado 6, produz 2 comidas." },
    rarity: "uncommon"
  },
  {
    id: "farm-mystic-crop",
    name: "Plantação Mística",
    type: "farm",
    cost: { coins: 5, food: 2, materials: 2 },
    effect: { description: "Produz 2 comida e 1 moeda quando ativada por dado 4. Se for o 10º turno, produz o dobro." },
    rarity: "rare"
  },
  {
    id: "farm-plague",
    name: "Praga Devastadora",
    type: "farm",
    cost: {},
    effect: { description: "Todas as fazendas produzem metade da comida por 2 turnos." },
    rarity: "crisis"
  },
  {
    id: "farm-harvest-festival",
    name: "Festival da Colheita",
    type: "farm",
    cost: { coins: 1, food: 1 },
    effect: { description: "Produz 1 comida extra para cada fazenda que você controla neste turno." },
    rarity: "booster"
  },
  {
    id: "city-arcane-library",
    name: "Biblioteca Arcana",
    type: "city",
    cost: { coins: 6, materials: 3, population: 1 },
    effect: { description: "Permite comprar 1 carta extra por turno enquanto estiver ativa." },
    rarity: "rare"
  },
  {
    id: "city-refugee-camp",
    name: "Campo de Refugiados",
    type: "city",
    cost: { coins: 2, food: 2 },
    effect: { description: "Ganhe 2 população, mas perca 1 comida por turno enquanto estiver ativa." },
    rarity: "crisis"
  },
  {
    id: "city-grand-arena",
    name: "Grande Arena",
    type: "city",
    cost: { coins: 10, materials: 6, population: 2 },
    effect: { description: "Fornece 2 população e +3 reputação. Permite jogar uma carta de ação extra por turno." },
    rarity: "legendary"
  },
  {
    id: "city-metropolis",
    name: "Metrópole",
    type: "city",
    cost: { coins: 12, materials: 8, population: 4 },
    effect: { description: "Fornece 5 população e +3 reputação imediatamente." },
    rarity: "ultra"
  },
  {
    id: "city-secret-market",
    name: "Mercado Secreto",
    type: "city",
    cost: { coins: 4, materials: 2 },
    effect: { description: "No início do seu turno, ganhe 1 moeda extra se tiver menos de 3 moedas." },
    rarity: "secret"
  },
  {
    id: "city-festival-booster",
    name: "Feira de Inverno",
    type: "city",
    cost: { coins: 2, food: 1 },
    effect: { description: "Ganhe 1 população e 1 moeda ao jogar esta carta." },
    rarity: "booster"
  },
  {
    id: "action-quick-loan",
    name: "Empréstimo Rápido",
    type: "action",
    cost: { coins: 0 },
    effect: { description: "Ganhe 2 moedas, mas perca 1 moeda no próximo turno." },
    rarity: "rare"
  },
  {
    id: "action-heroic-effort",
    name: "Esforço Heroico",
    type: "action",
    cost: { coins: 2, food: 1 },
    effect: { description: "Ganhe 1 material e 1 comida instantaneamente." },
    rarity: "booster"
  },
  {
    id: "action-shadow-bribe",
    name: "Suborno Silencioso",
    type: "action",
    cost: { coins: 4 },
    effect: { description: "Escolha um oponente. Ele perde 2 moedas e você ganha 2 moedas." },
    rarity: "secret"
  },
  {
    id: "defense-iron-shield",
    name: "Escudo de Ferro",
    type: "defense",
    cost: { coins: 2, materials: 2 },
    effect: { description: "Anula o próximo efeito negativo de evento ou armadilha." },
    rarity: "rare"
  },
  {
    id: "defense-crisis-bunker",
    name: "Bunker de Emergência",
    type: "defense",
    cost: { coins: 3, materials: 3 },
    effect: { description: "Protege toda sua população contra o próximo evento de crise." },
    rarity: "crisis"
  },
  {
    id: "defense-magic-barrier",
    name: "Barreira Mágica",
    type: "defense",
    cost: { coins: 2, materials: 1 },
    effect: { description: "Anula o efeito de uma carta de magia inimiga neste turno." },
    rarity: "booster"
  },
  {
    id: "magic-ritual-eternal-harvest",
    name: "Ritual da Colheita Eterna",
    type: "magic",
    cost: { coins: 6, food: 4, materials: 2 },
    effect: { description: "Durante este turno, todas as suas fazendas produzem o dobro de comida e você ganha +2 reputação." },
    rarity: "legendary"
  },
  {
    id: "magic-arcane-surge",
    name: "Surto Arcano",
    type: "magic",
    cost: { coins: 4, food: 2 },
    effect: { description: "Durante este turno, jogue até 2 cartas de magia." },
    rarity: "ultra"
  },
  {
    id: "magic-shadow-scroll",
    name: "Pergaminho das Sombras",
    type: "magic",
    cost: { coins: 3, food: 1 },
    effect: { description: "Copie o efeito de uma carta de ação jogada neste turno." },
    rarity: "booster"
  },
  {
    id: "magic-secret-invocation",
    name: "Invocação Secreta",
    type: "magic",
    cost: { coins: 5, food: 2, materials: 1 },
    effect: { description: "Jogue uma carta de magia do seu descarte sem pagar o custo." },
    rarity: "secret"
  },
  {
    id: "event-ancient-curse",
    name: "Maldição Ancestral",
    type: "event",
    cost: { coins: 1, food: 1 },
    effect: { description: "Todos os jogadores perdem 1 população." },
    rarity: "rare"
  },
  {
    id: "event-heroic-age",
    name: "Era dos Heróis",
    type: "event",
    cost: { coins: 3, food: 2, materials: 2 },
    effect: { description: "Todos os jogadores ganham 1 reputação e 1 população." },
    rarity: "legendary"
  },
  {
    id: "event-secret-eclipse",
    name: "Eclipse Misterioso",
    type: "event",
    cost: { coins: 2, food: 2, materials: 2 },
    effect: { description: "Todos os jogadores pulam a fase de produção neste turno." },
    rarity: "secret"
  },
  {
    id: "event-booster-migration",
    name: "Migração Surpresa",
    type: "event",
    cost: { coins: 1, food: 1 },
    effect: { description: "Todos os jogadores podem trocar 1 recurso à escolha por outro." },
    rarity: "booster"
  },
  {
    id: "trap-thorn-trap",
    name: "Armadilha de Espinhos",
    type: "trap",
    cost: { materials: 1 },
    effect: { description: "Se o oponente tentar ativar uma fazenda, ele perde 1 comida." },
    rarity: "common"
  },
  {
    id: "trap-mana-leak",
    name: "Vazamento de Mana",
    type: "trap",
    cost: { coins: 2 },
    effect: { description: "Se o oponente jogar uma carta de magia, ele perde 2 moedas." },
    rarity: "uncommon"
  },
  {
    id: "trap-collapse-rare",
    name: "Colapso Estrutural Raro",
    type: "trap",
    cost: { coins: 3, materials: 3 },
    effect: { description: "Desativa uma carta de cidade inimiga por 2 turnos." },
    rarity: "rare"
  },
  {
    id: "trap-ultimate-net",
    name: "Rede Suprema",
    type: "trap",
    cost: { coins: 3, materials: 2 },
    effect: { description: "Se o oponente jogar uma carta de evento, anule-a e ele perde 1 reputação." },
    rarity: "ultra"
  },
  {
    id: "trap-secret-ambush",
    name: "Emboscada Secreta",
    type: "trap",
    cost: { coins: 2, materials: 1 },
    effect: { description: "Se o oponente ativar uma carta de ação, ele perde 1 material e 1 moeda." },
    rarity: "secret"
  },
  {
    id: "trap-crisis-collapse",
    name: "Colapso de Ponte",
    type: "trap",
    cost: {},
    effect: { description: "Se o oponente construir uma cidade, ele perde 2 materiais." },
    rarity: "crisis"
  },
  {
    id: "trap-booster-mirror",
    name: "Armadilha do Espelho",
    type: "trap",
    cost: { coins: 1 },
    effect: { description: "Se o oponente jogar uma carta de defesa, você copia o efeito dela." },
    rarity: "booster"
  },
  {
    id: "landmark-clocktower",
    name: "Torre do Relógio",
    type: "landmark",
    cost: { coins: 7, materials: 5, population: 1 },
    effect: { description: "Reduz em 1 o custo de todas as cartas de cidade que você jogar." },
    rarity: "rare"
  },
  {
    id: "landmark-ultra-bridge",
    name: "Ponte Colossal",
    type: "landmark",
    cost: { coins: 15, materials: 10, population: 2 },
    effect: { description: "Permite jogar 2 cartas de cidade extras por turno." },
    rarity: "ultra"
  },
  {
    id: "landmark-secret-vault",
    name: "Cofre Secreto",
    type: "landmark",
    cost: { coins: 8, materials: 4, population: 1 },
    effect: { description: "No início de cada turno, ganhe 1 moeda e 1 material." },
    rarity: "secret"
  },
  {
    id: "landmark-booster-statue",
    name: "Estátua Promocional",
    type: "landmark",
    cost: { coins: 3, materials: 2 },
    effect: { description: "Ganhe 1 reputação ao jogar esta carta." },
    rarity: "booster"
  },
  // === CARTAS PARA COMPLETAR LACUNAS ===
  // farm: legendary, ultra, secret
  {
    id: "farm-world-tree",
    name: "Árvore do Mundo",
    type: "farm",
    cost: { coins: 20, food: 10, materials: 15, population: 5 },
    effect: { description: "Produz 5 comida por turno e fornece +10 reputação permanente. Quando ativada por dado 6, todos os jogadores ganham 2 comida." },
    rarity: "legendary"
  },
  {
    id: "farm-crystal-greenhouse",
    name: "Estufa de Cristal",
    type: "farm",
    cost: { coins: 8, food: 3, materials: 5 },
    effect: { description: "Produz 3 comida quando ativada por qualquer dado. Se ativada 3 vezes no mesmo turno, produz 2 comidas extras." },
    rarity: "ultra"
  },
  {
    id: "farm-forbidden-grove",
    name: "Bosque Proibido",
    type: "farm",
    cost: { coins: 6, food: 2, materials: 3 },
    effect: { description: "Produz 2 comida e 1 material quando ativada por dado 3. Se você tiver menos de 5 comidas, produz o dobro." },
    rarity: "secret"
  },
  // action: legendary, ultra, crisis
  {
    id: "action-divine-intervention",
    name: "Intervenção Divina",
    type: "action",
    cost: { coins: 10, food: 5, materials: 5, population: 2 },
    effect: { description: "Ganhe 5 de cada recurso e +3 reputação. Só pode ser jogada uma vez por partida." },
    rarity: "legendary"
  },
  {
    id: "action-temporal-shift",
    name: "Mudança Temporal",
    type: "action",
    cost: { coins: 6, food: 3, materials: 2 },
    effect: { description: "Jogue um turno extra após este. Durante esse turno, todas as suas cartas custam 1 recurso a menos." },
    rarity: "ultra"
  },
  {
    id: "action-desperate-measures",
    name: "Medidas Desesperadas",
    type: "action",
    cost: { coins: 0 },
    effect: { description: "Perca metade dos seus recursos arredondando para baixo, mas ganhe 3 cartas da sua mão." },
    rarity: "crisis"
  },
  // defense: legendary, ultra, secret
  {
    id: "defense-aegis-of-eternity",
    name: "Égide da Eternidade",
    type: "defense",
    cost: { coins: 12, food: 8, materials: 10, population: 3 },
    effect: { description: "Torna você imune a todos os efeitos negativos por 3 turnos e fornece +2 reputação." },
    rarity: "legendary"
  },
  {
    id: "defense-quantum-shield",
    name: "Escudo Quântico",
    type: "defense",
    cost: { coins: 5, materials: 4 },
    effect: { description: "Anula os próximos 2 efeitos negativos. Para cada efeito anulado, ganhe 1 recurso à escolha." },
    rarity: "ultra"
  },
  {
    id: "defense-shadow-veil",
    name: "Véu das Sombras",
    type: "defense",
    cost: { coins: 3, food: 2 },
    effect: { description: "Torna uma carta sua invisível aos oponentes por 2 turnos. Ela não pode ser alvo de armadilhas ou magias." },
    rarity: "secret"
  },
  // magic: common, crisis
  {
    id: "magic-basic-charm",
    name: "Encanto Básico",
    type: "magic",
    cost: { coins: 1 },
    effect: { description: "Ganhe 1 comida ou 1 material à escolha neste turno." },
    rarity: "common"
  },
  {
    id: "magic-chaos-storm",
    name: "Tempestade do Caos",
    type: "magic",
    cost: { coins: 1, food: 1 },
    effect: { description: "Todos os recursos são redistribuídos aleatoriamente entre todos os jogadores." },
    rarity: "crisis"
  },
  // trap: legendary
  {
    id: "trap-labyrinth-of-souls",
    name: "Labirinto das Almas",
    type: "trap",
    cost: { coins: 15, food: 8, materials: 12, population: 4 },
    effect: { description: "Se o oponente tentar vencer por qualquer condição, ele deve pagar 5 de cada recurso ou a vitória é anulada." },
    rarity: "legendary"
  },
  // event: common, ultra
  {
    id: "event-market-day",
    name: "Dia de Feira",
    type: "event",
    cost: { coins: 1 },
    effect: { description: "Todos os jogadores podem trocar recursos 1 por 1 neste turno." },
    rarity: "common"
  },
  {
    id: "event-cosmic-alignment",
    name: "Alinhamento Cósmico",
    type: "event",
    cost: { coins: 5, food: 5, materials: 5, population: 2 },
    effect: { description: "Todos os jogadores dobram a produção de todos os recursos por 2 turnos." },
    rarity: "ultra"
  },
  // landmark: common, uncommon, crisis
  {
    id: "landmark-village-well",
    name: "Poço da Aldeia",
    type: "landmark",
    cost: { coins: 3, materials: 2, population: 1 },
    effect: { description: "Todas as suas cartas de fazenda produzem +1 comida permanentemente." },
    rarity: "common"
  },
  {
    id: "landmark-town-square",
    name: "Praça da Cidade",
    type: "landmark",
    cost: { coins: 5, materials: 3, population: 2 },
    effect: { description: "Permite jogar 1 carta de ação extra por turno e fornece +1 reputação." },
    rarity: "uncommon"
  },
  {
    id: "landmark-ruins-of-despair",
    name: "Ruínas do Desespero",
    type: "landmark",
    cost: { coins: 8, materials: 6, population: 3 },
    effect: { description: "Todos os jogadores perdem 2 de cada recurso quando esta carta é construída, mas você ganha +5 reputação." },
    rarity: "crisis"
  }
];