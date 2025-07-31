import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { Card } from '../types/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { usePlayerCards } from '../hooks/usePlayerCards';
import { usePlayerDecks } from '../hooks/usePlayerDecks';
import { 
  Crown, Shield, Sword, Zap, Star, X, Gem, Castle, Wheat, Sparkles, 
  Landmark, Calendar, Swords, ArrowLeft 
} from 'lucide-react';
import { getCardTypeIconPNG } from '../components/IconComponentsPNG';
import { CoinsIconPNG, FoodsIconPNG, MaterialsIconPNG, PopulationIconPNG } from '../components/IconComponentsPNG';
import { cn } from '../lib/utils';
import { useAppContext } from '../contexts/AppContext';

// Componente de carta completa baseado no CardDetailModal
const FullCardComponent: React.FC<{ card: Card }> = ({ card }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Card type configuration
  const cardTypeConfig = {
    city: {
      icon: Castle,
      color: "#8B5A3C",
      gradient: "from-amber-900/20 to-orange-800/20",
      border: "border-amber-700",
      accent: "#D4AF37"
    },
    farm: {
      icon: Wheat,
      color: "#4A7C59",
      gradient: "from-green-800/20 to-emerald-700/20",
      border: "border-green-600",
      accent: "#90EE90"
    },
    magic: {
      icon: Sparkles,
      color: "#6B46C1",
      gradient: "from-purple-800/20 to-violet-700/20",
      border: "border-purple-600",
      accent: "#9F7AEA"
    },
    landmark: {
      icon: Landmark,
      color: "#1E40AF",
      gradient: "from-blue-800/20 to-indigo-700/20",
      border: "border-blue-600",
      accent: "#60A5FA"
    },
    event: {
      icon: Calendar,
      color: "#DC2626",
      gradient: "from-red-800/20 to-rose-700/20",
      border: "border-red-600",
      accent: "#F87171"
    },
    trap: {
      icon: Shield,
      color: "#374151",
      gradient: "from-gray-800/20 to-slate-700/20",
      border: "border-gray-600",
      accent: "#9CA3AF"
    },
    defense: {
      icon: Swords,
      color: "#059669",
      gradient: "from-teal-800/20 to-cyan-700/20",
      border: "border-teal-600",
      accent: "#34D399"
    }
  };

  // Rarity configuration
  const rarityConfig = {
    common: {
      borderWidth: "border-2",
      glow: "shadow-md",
      gems: 1,
      gemColor: "#9CA3AF",
      frameStyle: "simple"
    },
    uncommon: {
      borderWidth: "border-[3px]",
      glow: "shadow-lg shadow-green-500/20",
      gems: 2,
      gemColor: "#10B981",
      frameStyle: "enhanced"
    },
    rare: {
      borderWidth: "border-[3px]",
      glow: "shadow-lg shadow-blue-500/30",
      gems: 3,
      gemColor: "#3B82F6",
      frameStyle: "ornate"
    },
    ultra: {
      borderWidth: "border-4",
      glow: "shadow-xl shadow-purple-500/40",
      gems: 4,
      gemColor: "#8B5CF6",
      frameStyle: "elaborate"
    },
    legendary: {
      borderWidth: "border-4",
      glow: "shadow-2xl shadow-yellow-500/50",
      gems: 5,
      gemColor: "#F59E0B",
      frameStyle: "legendary"
    }
  };

  const typeConfig = cardTypeConfig[card.type as keyof typeof cardTypeConfig] || cardTypeConfig.magic;
  const raritySettings = rarityConfig[card.rarity as keyof typeof rarityConfig] || rarityConfig.rare;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    if (isHovered) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHovered, mouseX, mouseY]);

  const spotlightBackground = useMotionTemplate`
    radial-gradient(300px circle at ${mouseX}px ${mouseY}px, ${typeConfig.accent}15, transparent)
  `;

  const renderGems = () => {
    return Array.from({ length: raritySettings.gems }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
        className="relative"
      >
        <Gem 
          className="w-3 h-3" 
          style={{ color: raritySettings.gemColor }}
        />
        <div 
          className="absolute inset-0 w-3 h-3 rounded-full blur-sm opacity-60"
          style={{ backgroundColor: raritySettings.gemColor }}
        />
      </motion.div>
    ));
  };

  const renderOrnateCorners = () => {
    if (card.rarity === "common" || card.rarity === "uncommon") return null;

    return (
      <>
        {/* Top corners */}
        <div className="absolute top-2 left-2 w-6 h-6">
          <div 
            className="absolute inset-0 border-l-2 border-t-2 rounded-tl-lg"
            style={{ borderColor: typeConfig.accent }}
          />
          <div 
            className="absolute top-1 left-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: typeConfig.accent }}
          />
        </div>
        <div className="absolute top-2 right-2 w-6 h-6">
          <div 
            className="absolute inset-0 border-r-2 border-t-2 rounded-tr-lg"
            style={{ borderColor: typeConfig.accent }}
          />
          <div 
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: typeConfig.accent }}
          />
        </div>

        {/* Bottom corners */}
        <div className="absolute bottom-2 left-2 w-6 h-6">
          <div 
            className="absolute inset-0 border-l-2 border-b-2 rounded-bl-lg"
            style={{ borderColor: typeConfig.accent }}
          />
          <div 
            className="absolute bottom-1 left-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: typeConfig.accent }}
          />
        </div>
        <div className="absolute bottom-2 right-2 w-6 h-6">
          <div 
            className="absolute inset-0 border-r-2 border-b-2 rounded-br-lg"
            style={{ borderColor: typeConfig.accent }}
          />
          <div 
            className="absolute bottom-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: typeConfig.accent }}
          />
        </div>
      </>
    );
  };

  const renderLegendaryEffects = () => {
    if (card.rarity !== "legendary") return null;

    return (
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          background: [
            `conic-gradient(from 0deg, ${typeConfig.accent}20, transparent, ${typeConfig.accent}20)`,
            `conic-gradient(from 360deg, ${typeConfig.accent}20, transparent, ${typeConfig.accent}20)`
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    );
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative w-72 h-[28rem] rounded-xl overflow-hidden cursor-pointer select-none",
        "bg-gradient-to-br from-background to-muted",
        typeConfig.border,
        raritySettings.borderWidth,
        raritySettings.glow
      )}
      style={{
        background: isHovered ? spotlightBackground : undefined,
        borderColor: typeConfig.color
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Legendary rotating border effect */}
      {renderLegendaryEffects()}

      {/* Background gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", typeConfig.gradient)} />

      {/* Ornate corner decorations */}
      {renderOrnateCorners()}

      {/* Header section */}
      <div className="relative p-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          {/* Type icon and dice activation */}
          <div className="flex items-center gap-2">
            <div 
              className="p-1.5 rounded-lg border-2"
              style={{ 
                backgroundColor: `${typeConfig.color}20`,
                borderColor: typeConfig.color
              }}
            >
              {getCardTypeIconPNG(card.type, 24)}
            </div>
            <div 
              className="p-1.5 rounded-lg border-2"
              style={{ 
                backgroundColor: `${typeConfig.color}20`,
                borderColor: typeConfig.color
              }}
            >
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-gray-800 rounded-sm"></div>
                </div>
                <span className="text-xs font-bold" style={{ color: typeConfig.color }}>
                  {card.effect?.diceNumber || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Rarity gems */}
          <div className="flex gap-1">
            {renderGems()}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-foreground leading-tight">
          {card.name}
        </h3>

        {/* Rarity indicator */}
        <div className="flex items-center gap-1 mt-1">
          {card.rarity === "legendary" && <Crown className="w-2.5 h-2.5 text-yellow-500" />}
          {(card.rarity === "ultra" || card.rarity === "legendary") && <Star className="w-2.5 h-2.5 text-purple-400" />}
          <span 
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: raritySettings.gemColor }}
          >
            {card.rarity}
          </span>
        </div>
      </div>

      {/* Image section */}
      <div className="relative mx-4 mb-3 h-40 rounded-lg overflow-hidden border-2 border-border">
        {card.artworkUrl ? (
          <img 
            src={card.artworkUrl} 
            alt={card.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl mb-1">🎨</div>
              <p className="text-xs text-gray-400">Artwork será carregado no painel admin</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Cost section */}
      <div className="px-4 mb-2">
        <div className="flex justify-center items-center gap-2">
          {(card.cost.coins || 0) > 0 && (
            <div className="flex items-center gap-1 bg-amber-900/50 border border-amber-600/50 rounded px-2 py-1">
              <CoinsIconPNG size={16} />
              <span className="font-bold text-amber-100 text-sm">{card.cost.coins}</span>
            </div>
          )}
          {(card.cost.food || 0) > 0 && (
            <div className="flex items-center gap-1 bg-green-900/50 border border-green-600/50 rounded px-2 py-1">
              <FoodsIconPNG size={16} />
              <span className="font-bold text-green-100 text-sm">{card.cost.food}</span>
            </div>
          )}
          {(card.cost.materials || 0) > 0 && (
            <div className="flex items-center gap-1 bg-blue-900/50 border border-blue-600/50 rounded px-2 py-1">
              <MaterialsIconPNG size={16} />
              <span className="font-bold text-blue-100 text-sm">{card.cost.materials}</span>
            </div>
          )}
          {(card.cost.population || 0) > 0 && (
            <div className="flex items-center gap-1 bg-purple-900/50 border border-purple-600/50 rounded px-2 py-1">
              <PopulationIconPNG size={16} />
              <span className="font-bold text-purple-100 text-sm">{card.cost.population}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="px-4 pb-3">
        <div 
          className="text-xs leading-relaxed p-3 rounded-lg border-2"
          style={{ 
            backgroundColor: `${typeConfig.color}15`,
            borderColor: `${typeConfig.color}40`,
            boxShadow: `0 0 10px ${typeConfig.color}20`
          }}
        >
          {card.effect?.description || "A magnificent fortress that generates wealth and provides protection for your realm."}
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(circle at center, ${typeConfig.accent}10, transparent 70%)`
        }}
      />
    </motion.div>
  );
};

const CollectionPage: React.FC = () => {
  const { playerCards, loading, error } = usePlayerCards();
  const { decks } = usePlayerDecks();
  const { setCurrentView } = useAppContext();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getMaxCopiesByRarity = (rarity: string, cardType?: string): number => {
    // Cartas Landmark são especiais - máximo 1 por deck independente da raridade
    if (cardType === 'landmark') {
      return 1;
    }
    
    switch (rarity) {
      case 'common': return 4;      // Cartas comuns: máximo 4 cópias por deck
      case 'uncommon': return 3;    // Cartas incomuns: máximo 3 cópias por deck
      case 'rare': return 2;        // Cartas raras: máximo 2 cópias por deck
      case 'ultra': return 2;       // Cartas ultra raras: máximo 2 cópias por deck
      case 'secret': return 1;      // Cartas secretas: máximo 1 cópia por deck
      case 'legendary': return 1;   // Cartas lendárias: máximo 1 cópia por deck
      case 'crisis': return 1;      // Cartas de crise: máximo 1 cópia por deck
      case 'booster': return 1;     // Cartas booster: máximo 1 cópia por deck
      default: return 1;
    }
  };

  const getCopiesInDeck = (cardId: string): number => {
    const activeDeck = decks.find(deck => deck.is_active);
    if (!activeDeck) return 0;
    return activeDeck.card_ids.filter(id => id === cardId).length;
  };

  // Agrupar cartas por ID base
  const groupedCards = React.useMemo(() => {
    const groups: Record<string, {
      baseId: string;
      card: Card;
      totalOwned: number;
      copiesInDeck: number;
      maxCopies: number;
    }> = {};

    playerCards.forEach(card => {
      const baseId = card.id;
      if (!groups[baseId]) {
        groups[baseId] = {
          baseId,
          card,
          totalOwned: 0,
          copiesInDeck: 0,
          maxCopies: getMaxCopiesByRarity(card.rarity, card.type)
        };
      }
      groups[baseId].totalOwned++;
    });

    // Contar cópias no deck ativo
    Object.values(groups).forEach(group => {
      group.copiesInDeck = getCopiesInDeck(group.card.id);
    });

    return Object.values(groups);
  }, [playerCards, decks]);

  const filteredCards = selectedCategory === 'all' 
    ? groupedCards 
    : groupedCards.filter(group => group.card.type === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        <div className="animate-pulse space-y-4 p-6">
          <div className="h-8 bg-yellow-600/20 rounded w-64"></div>
          <div className="h-4 bg-yellow-600/20 rounded w-32"></div>
          <div className="grid grid-cols-4 gap-4">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-yellow-600/20 rounded border border-yellow-600/30"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      {/* Header Medieval */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-b border-yellow-600/30 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
              <Button
              variant="outline"
                onClick={() => setCurrentView('home')}
              className="border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20"
              >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Menu Principal
              </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-400" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Coleção de Cartas
                </h1>
                <Crown className="w-8 h-8 text-yellow-400" />
              </div>
              <Badge variant="outline" className="border-yellow-600/50 text-yellow-400">
                {groupedCards.length} Cartas
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-yellow-600/30">
            <TabsTrigger value="all" className="data-[state=active]:bg-yellow-600/20 data-[state=active]:text-yellow-400">
              Todas
            </TabsTrigger>
            <TabsTrigger value="city" className="data-[state=active]:bg-yellow-600/20 data-[state=active]:text-yellow-400">
              <Shield className="w-4 h-4 mr-2" />
              Cidades
            </TabsTrigger>
            <TabsTrigger value="farm" className="data-[state=active]:bg-yellow-600/20 data-[state=active]:text-yellow-400">
              <Sword className="w-4 h-4 mr-2" />
              Fazendas
            </TabsTrigger>
            <TabsTrigger value="landmark" className="data-[state=active]:bg-yellow-600/20 data-[state=active]:text-yellow-400">
              <Crown className="w-4 h-4 mr-2" />
              Marcos
            </TabsTrigger>
            <TabsTrigger value="event" className="data-[state=active]:bg-yellow-600/20 data-[state=active]:text-yellow-400">
              <Star className="w-4 h-4 mr-2" />
              Eventos
            </TabsTrigger>
            <TabsTrigger value="magic" className="data-[state=active]:bg-yellow-600/20 data-[state=active]:text-yellow-400">
              <Zap className="w-4 h-4 mr-2" />
              Magias
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Cards Grid */}
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-400">Erro ao carregar coleção: {error}</p>
          </div>
        ) : playerCards.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-yellow-400">Nenhuma carta encontrada</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-2 border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20"
            >
              🔄 Recarregar e Criar Cartas Starter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {filteredCards.map(group => (
              <div
                key={group.baseId}
                className={`
                  relative overflow-visible transition-all duration-300 transform
                  flex flex-col items-center p-6 bg-transparent
                `}
              >
                <FullCardComponent card={group.card} />
                
                {/* Informações de cópias */}
                <div className="mt-6 text-center bg-transparent">
                  <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 border border-yellow-500/30 rounded-lg px-4 py-2 mb-2">
                    <div className="text-sm text-yellow-400 font-bold">
                      {group.copiesInDeck}/{group.maxCopies} no Deck Ativo
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-gray-700/20 to-gray-600/20 border border-gray-500/30 rounded-lg px-4 py-2">
                    <div className="text-xs text-gray-300">
                      Possui <span className="text-yellow-400 font-semibold">{group.totalOwned}</span> cópias
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {group.card.type === 'landmark' ? (
                        <span className="text-purple-400 font-semibold">
                          🏛️ Landmark Especial: Máximo 1 por deck
                        </span>
                      ) : (
                        <>
                          Limite por raridade: <span className="text-blue-400 font-semibold">{group.maxCopies}</span> cópias
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {group.totalOwned > group.copiesInDeck && (
                        <span className="text-green-400">
                          +{group.totalOwned - group.copiesInDeck} disponível
                        </span>
                      )}
                      {group.totalOwned === group.copiesInDeck && (
                        <span className="text-blue-400">Todas em uso</span>
                      )}
                      {group.totalOwned < group.copiesInDeck && (
                        <span className="text-red-400">Erro: mais cópias no deck que possuídas</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage; 