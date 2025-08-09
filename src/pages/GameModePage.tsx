import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { supabase } from '../integrations/supabase/client';
import { MedievalAnimatedBackground } from '../components/MedievalAnimatedBackground';

interface GameMode {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  victoryMode: 'reputation' | 'landmarks' | 'elimination' | 'infinite' | 'complex' | 'classic' | 'resources' | 'production';
  victoryValue: number;
  icon: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  category: 'main' | 'challenge' | 'survival' | 'advanced';
  tips: string[];
  requirements: string[];
}

interface GameModeCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  modes: GameMode[];
}

const GameModePage: React.FC = () => {
  const { setCurrentView } = useAppContext();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const gameModes: GameMode[] = [
    {
      id: 'classic-mode',
      name: 'Modo Clássico',
      description: 'Múltiplas condições de vitória: Construção, Sobrevivência, Prosperidade, Prestígio ou Domínio Mágico.',
      detailedDescription: 'O modo clássico oferece 5 diferentes caminhos para a vitória. Você pode escolher entre focar na construção de marcos históricos, alcançar alta reputação, maximizar a produção, sobreviver por muitos turnos, ou dominar a magia. Cada caminho oferece uma experiência única e desafiadora.',
      victoryMode: 'classic',
      victoryValue: 0,
      icon: '👑',
      color: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500',
      difficulty: 'medium',
      category: 'main',
      tips: [
        'Explore diferentes estratégias para cada condição de vitória',
        'Mantenha um equilíbrio entre recursos e desenvolvimento',
        'Adapte sua estratégia conforme o jogo progride'
      ],
      requirements: [
        'Completar uma das 5 condições de vitória',
        'Gerenciar recursos eficientemente',
        'Tomar decisões estratégicas'
      ]
    },
    {
      id: 'simple-construction',
      name: 'Construtor Simples',
      description: 'Construa 3 marcos históricos para vencer.',
      detailedDescription: 'Um modo ideal para iniciantes! Foque na construção de 3 marcos históricos impressionantes. Este modo ensina os fundamentos do gerenciamento de recursos e planejamento estratégico.',
      victoryMode: 'landmarks',
      victoryValue: 3,
      icon: '🏛️',
      color: 'bg-green-500',
      difficulty: 'easy',
      category: 'main',
      tips: [
        'Planeje seus recursos com antecedência',
        'Priorize construções que gerem recursos',
        'Mantenha uma economia estável'
      ],
      requirements: [
        'Construir 3 marcos históricos',
        'Gerenciar recursos eficientemente',
        'Manter população feliz'
      ]
    },
    {
      id: 'infinite-challenge',
      name: 'Desafio Infinito',
      description: 'Jogue indefinidamente enquanto o jogo fica cada vez mais difícil.',
      detailedDescription: 'Para os verdadeiros mestres do reino! Este modo não tem fim - continue jogando enquanto o desafio aumenta exponencialmente. Cada turno traz novos obstáculos e o jogo se torna progressivamente mais difícil.',
      victoryMode: 'infinite',
      victoryValue: 0,
      icon: '∞',
      color: 'bg-purple-500',
      difficulty: 'extreme',
      category: 'main',
      tips: [
        'Desenvolva estratégias escaláveis',
        'Mantenha flexibilidade nas decisões',
        'Prepare-se para desafios crescentes'
      ],
      requirements: [
        'Sobreviver indefinidamente',
        'Adaptar-se a dificuldade crescente',
        'Manter eficiência sob pressão'
      ]
    },
    {
      id: 'reputation-challenge',
      name: 'Desafio - Reputação',
      description: 'Alcance 15 pontos de reputação para se tornar respeitado.',
      detailedDescription: 'Construa uma reputação sólida através de ações nobres, construções impressionantes e decisões sábias. Cada ação que beneficia seu reino aumenta sua reputação, mas escolhas controversas podem prejudicá-la.',
      victoryMode: 'reputation',
      victoryValue: 15,
      icon: '⭐',
      color: 'bg-yellow-500',
      difficulty: 'medium',
      category: 'challenge',
      tips: [
        'Construa marcos históricos para ganhar reputação',
        'Tome decisões que beneficiem seu povo',
        'Evite ações que possam prejudicar sua imagem'
      ],
      requirements: [
        'Alcançar 15 pontos de reputação',
        'Manter estabilidade no reino',
        'Fazer escolhas sábias'
      ]
    },
    {
      id: 'survival-mode',
      name: 'Modo Sobrevivência',
      description: 'Sobreviva 25 turnos em um mundo hostil.',
      detailedDescription: 'Em um mundo onde cada turno traz novos desafios, sua missão é simples: sobreviver! Enfrente escassez de recursos, desastres naturais e crises políticas. Quanto mais tempo você sobreviver, maior será sua glória.',
      victoryMode: 'elimination',
      victoryValue: 25,
      icon: '⏰',
      color: 'bg-red-500',
      difficulty: 'hard',
      category: 'survival',
      tips: [
        'Mantenha estoques de emergência',
        'Adapte-se rapidamente às mudanças',
        'Priorize a sobrevivência sobre o crescimento'
      ],
      requirements: [
        'Sobreviver 25 turnos',
        'Manter população viva',
        'Gerenciar crises eficientemente'
      ]
    },
    {
      id: 'complex-victory',
      name: 'Vitória Complexa',
      description: 'Complete múltiplos objetivos para vencer. 2 vitórias maiores + 1 menor.',
      detailedDescription: 'O modo mais desafiador do reino! Você deve completar 2 vitórias maiores E 1 vitória menor simultaneamente. Este modo testa sua capacidade de gerenciar múltiplos objetivos e estratégias complexas.',
      victoryMode: 'complex',
      victoryValue: 0,
      icon: '🏆',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      difficulty: 'hard',
      category: 'advanced',
      tips: [
        'Planeje múltiplas estratégias simultaneamente',
        'Mantenha equilíbrio entre objetivos',
        'Seja paciente e estratégico'
      ],
      requirements: [
        'Completar 2 vitórias maiores',
        'Completar 1 vitória menor',
        'Gerenciar múltiplos objetivos'
      ]
    },
    {
      id: 'legendary-status',
      name: 'Status Lendário',
      description: 'Alcance 25 pontos de reputação para se tornar uma lenda.',
      detailedDescription: 'Torne-se uma lenda cujas histórias serão contadas por gerações! Alcançar 25 pontos de reputação requer não apenas sabedoria, mas também carisma, liderança e uma visão clara para o futuro do reino.',
      victoryMode: 'reputation',
      victoryValue: 25,
      icon: '👑',
      color: 'bg-pink-500',
      difficulty: 'extreme',
      category: 'advanced',
      tips: [
        'Construa marcos históricos impressionantes',
        'Tome decisões que inspirem seu povo',
        'Mantenha consistência nas ações nobres'
      ],
      requirements: [
        'Alcançar 25 pontos de reputação',
        'Manter estabilidade por muito tempo',
        'Demonstrar liderança excepcional'
      ]
    },
    {
      id: 'endurance-test',
      name: 'Teste de Resistência',
      description: 'Sobreviva 50 turnos em condições extremas.',
      detailedDescription: 'O teste definitivo de resistência! Sobreviva 50 turnos em um mundo onde cada decisão pode ser a diferença entre a vida e a morte. Este modo testa sua capacidade de planejamento de longo prazo e adaptação.',
      victoryMode: 'elimination',
      victoryValue: 50,
      icon: '🛡️',
      color: 'bg-gray-500',
      difficulty: 'extreme',
      category: 'survival',
      tips: [
        'Desenvolva estratégias de longo prazo',
        'Mantenha reservas para emergências',
        'Seja paciente e persistente'
      ],
      requirements: [
        'Sobreviver 50 turnos',
        'Manter população estável',
        'Gerenciar recursos por longo período'
      ]
    },
    {
      id: 'prosperity-challenge',
      name: 'Desafio da Prosperidade',
      description: 'Acumule 1000 moedas para se tornar rico.',
      detailedDescription: 'Transforme seu reino em uma potência econômica! Foque na produção de moedas e no comércio para acumular riqueza. Este modo testa sua capacidade de gerenciamento econômico e otimização de produção.',
      victoryMode: 'resources',
      victoryValue: 1000,
      icon: '💰',
      color: 'bg-emerald-500',
      difficulty: 'medium',
      category: 'challenge',
      tips: [
        'Foque na produção de moedas',
        'Otimize suas construções para lucro',
        'Mantenha uma economia equilibrada'
      ],
      requirements: [
        'Acumular 1000 moedas',
        'Manter produção estável',
        'Gerenciar economia eficientemente'
      ]
    },
    {
      id: 'production-master',
      name: 'Mestre da Produção',
      description: 'Produza 100 recursos por turno para se tornar eficiente.',
      detailedDescription: 'Torne-se um mestre da eficiência! Otimize suas construções e estratégias para maximizar a produção por turno. Este modo testa sua capacidade de planejamento e otimização de recursos. As catástrofes aparecerão para testar sua resiliência!',
      victoryMode: 'production',
      victoryValue: 50,
      icon: '⚙️',
      color: 'bg-blue-500',
      difficulty: 'extreme',
      category: 'challenge',
      tips: [
        'Otimize suas construções',
        'Foque na produção por turno',
        'Mantenha eficiência constante',
        'Prepare-se para catástrofes'
      ],
      requirements: [
        'Produzir 100 recursos por turno',
        'Manter eficiência alta',
        'Otimizar construções',
        'Sobreviver às catástrofes'
      ]
    }
  ];

  const categories: GameModeCategory[] = [
    {
      id: 'main',
      name: 'Modos Principais',
      description: 'Experiências fundamentais do reino',
      icon: '👑',
      color: 'from-amber-500 to-orange-500',
      modes: gameModes.filter(mode => mode.category === 'main')
    },
    {
      id: 'challenge',
      name: 'Desafios',
      description: 'Teste suas habilidades estratégicas',
      icon: '⚔️',
      color: 'from-blue-500 to-purple-500',
      modes: gameModes.filter(mode => mode.category === 'challenge')
    },
    {
      id: 'survival',
      name: 'Sobrevivência',
      description: 'Modos focados em resistência',
      icon: '🛡️',
      color: 'from-red-500 to-orange-500',
      modes: gameModes.filter(mode => mode.category === 'survival')
    },
    {
      id: 'advanced',
      name: 'Avançado',
      description: 'Para mestres do reino',
      icon: '🏆',
      color: 'from-purple-500 to-pink-500',
      modes: gameModes.filter(mode => mode.category === 'advanced')
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-orange-400';
      case 'extreme': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      case 'extreme': return 'Extremo';
      default: return 'Desconhecido';
    }
  };

  const handleModeClick = (mode: GameMode) => {
    setSelectedMode(mode);
    setShowModal(true);
  };

  const handleModeSelect = async (mode: GameMode) => {
    setLoading(true);
    setShowModal(false);

    try {
      console.log('🎮 Configurando modo de jogo:', mode);
      
      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('Usuário não autenticado');
        setLoading(false);
        return;
      }

      // Salvar preferência de não mostrar modal novamente
      if (dontShowAgain) {
        const { error: settingsError } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            game_preferences: {
              difficulty: 'normal',
              show_hints: true,
              show_tutorials: true,
              confirm_actions: true,
              auto_save_interval: 5,
              victoryMode: mode.victoryMode,
              victoryValue: mode.victoryValue,
              hide_mode_explanations: true
            },
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (settingsError) {
          console.error('Erro ao salvar preferências:', settingsError);
        }
      }

      // Preparar novas preferências de jogo
      const newPreferences = {
        difficulty: 'normal',
        show_hints: true,
        show_tutorials: true,
        confirm_actions: true,
        auto_save_interval: 5,
        victoryMode: mode.victoryMode,
        victoryValue: mode.victoryValue
      };

      console.log('📝 Novas preferências de jogo:', newPreferences);

      // Atualizar preferências do usuário no Supabase
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          game_preferences: newPreferences,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Erro ao atualizar modo de jogo:', error);
      }

      console.log('✅ Preferências salvas no Supabase');

      // Limpar estado salvo antes de iniciar novo jogo
      try {
        localStorage.removeItem('famand_gameState');
        console.log('🎮 Estado salvo limpo antes de iniciar novo jogo com modo:', mode.name);
      } catch (error) {
        console.error('Erro ao limpar estado salvo:', error);
      }

      // Iniciar novo jogo
      setCurrentView('game');
    } catch (error) {
      console.error('Erro ao configurar modo de jogo:', error);
      setCurrentView('game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Medieval Animated Background */}
      <MedievalAnimatedBackground />
      
      {/* Header with Back Button */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={() => setCurrentView('home')}
              className="group relative overflow-hidden bg-gradient-to-r from-slate-700/90 to-slate-800/90 hover:from-slate-600 hover:to-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg border border-slate-600/30 hover:border-amber-400/50 hover:scale-105 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-3">
                <span className="text-lg">←</span>
                Voltar ao Reino
              </span>
            </button>
            
            {/* Page Title */}
            <div className="text-center">
              <div className="relative inline-block">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  ⚔️ Modos de Batalha
          </h1>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 blur-2xl opacity-20 -z-10"></div>
              </div>
            </div>
            
            {/* Spacer to balance layout */}
            <div className="w-32"></div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Subtitle */}
        <div className="text-center mb-12">
          <p className="text-purple-200/90 text-xl mb-8 max-w-3xl mx-auto font-medium">
            Selecione um modo de jogo épico e desafie-se com diferentes condições de vitória no reino do Farmand
          </p>
          <div className="flex items-center justify-center space-x-6">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-purple-400"></div>
            <div className="relative">
              <span className="text-2xl">🏰</span>
              <div className="absolute inset-0 text-2xl animate-ping opacity-20">🏰</div>
            </div>
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-purple-400"></div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.id} className="space-y-4">
              {/* Category Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/30 rounded-2xl px-6 py-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h2 className={`text-xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                      {category.name}
                    </h2>
                    <p className="text-sm text-slate-300/80">{category.description}</p>
                  </div>
                </div>
        </div>

        {/* Game Modes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.modes.map((mode) => (
            <div
              key={mode.id}
                    className="group relative cursor-pointer"
                    onClick={() => handleModeClick(mode)}
                  >
                    {/* Enhanced Glow Effect */}
                    <div className={`absolute -inset-2 bg-gradient-to-r ${mode.color.replace('bg-', 'from-').replace(' to-', ' to-')} rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500`}></div>
                    
                    {/* Card Container */}
                    <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-md border border-slate-500/30 hover:border-amber-400/50 rounded-2xl overflow-hidden transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-105">
                      
                      {/* Header with Icon and Title */}
                      <div className={`bg-gradient-to-r ${mode.color} p-6 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Icon and Title Container */}
                        <div className="relative z-10 flex items-center gap-4">
                          <div className="relative text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  {mode.icon}
                </div>

                          <div>
                            <h3 className="text-lg font-bold text-white">
                  {mode.name}
                </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 ${getDifficultyColor(mode.difficulty)}`}>
                    {getDifficultyText(mode.difficulty)}
                  </span>
                          </div>
                        </div>
                </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-gray-300/80 mb-4 text-sm leading-relaxed">
                  {mode.description}
                </p>

                {/* Victory Condition */}
                        <div className="p-3 bg-gradient-to-r from-white/10 to-transparent rounded-xl border border-white/20 backdrop-blur-sm">
                                                     <p className="text-white/90 text-sm font-semibold text-center">
                             {mode.victoryMode === 'classic' && `👑 5 Condições de Vitória`}
                             {mode.victoryMode === 'landmarks' && `🏛️ ${mode.victoryValue} Marcos Históricos`}
                             {mode.victoryMode === 'reputation' && `⭐ ${mode.victoryValue} Reputação`}
                             {mode.victoryMode === 'elimination' && `⏰ Sobreviver ${mode.victoryValue} Turnos`}
                             {mode.victoryMode === 'infinite' && `∞ Modo Infinito`}
                             {mode.victoryMode === 'complex' && `🏆 2 Vitórias Maiores + 1 Menor`}
                             {mode.victoryMode === 'resources' && `💰 ${mode.victoryValue} Moedas`}
                             {mode.victoryMode === 'production' && `⚙️ ${mode.victoryValue} Recursos/Turno`}
                  </p>
                </div>
              </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

                 {/* Game Mode Modal */}
         {showModal && selectedMode && (
           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
             <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl"></div>
               
               {/* Close Button */}
               <button
                 onClick={() => setShowModal(false)}
                 className="absolute top-4 right-4 z-30 text-gray-400 hover:text-white transition-colors bg-slate-800/80 hover:bg-slate-700/80 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm border border-slate-600/50"
               >
                 <span className="text-xl font-bold">×</span>
               </button>
               
               <div className="relative flex flex-col h-full z-10">
                 {/* Header - Fixed */}
                 <div className="flex-shrink-0 p-6 border-b border-slate-600/30 bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-t-3xl">
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${selectedMode.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <span className="text-3xl">{selectedMode.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-1">
                        {selectedMode.name}
                      </h2>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 ${getDifficultyColor(selectedMode.difficulty)}`}>
                          {getDifficultyText(selectedMode.difficulty)}
                        </span>
                                                 <span className="text-sm text-slate-400">
                           {selectedMode.victoryMode === 'classic' && `👑 5 Condições de Vitória`}
                           {selectedMode.victoryMode === 'landmarks' && `🏛️ ${selectedMode.victoryValue} Marcos Históricos`}
                           {selectedMode.victoryMode === 'reputation' && `⭐ ${selectedMode.victoryValue} Reputação`}
                           {selectedMode.victoryMode === 'elimination' && `⏰ Sobreviver ${selectedMode.victoryValue} Turnos`}
                           {selectedMode.victoryMode === 'infinite' && `∞ Modo Infinito`}
                           {selectedMode.victoryMode === 'complex' && `🏆 2 Vitórias Maiores + 1 Menor`}
                           {selectedMode.victoryMode === 'resources' && `💰 ${selectedMode.victoryValue} Moedas`}
                           {selectedMode.victoryMode === 'production' && `⚙️ ${selectedMode.victoryValue} Recursos/Turno`}
                         </span>
                      </div>
                    </div>
                  </div>
                </div>

                                 {/* Content - Scrollable */}
                 <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ maxHeight: 'calc(95vh - 280px)' }}>
                   {/* Description */}
                   <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-6 border border-slate-600/30 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">📖</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white">Como Funciona</h3>
                    </div>
                    <p className="text-gray-300/90 leading-relaxed text-base">
                      {selectedMode.detailedDescription}
                    </p>
                  </div>

                                     {/* Requirements */}
                   <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-6 border border-slate-600/30 shadow-lg">
                     <div className="flex items-center gap-2 mb-4">
                       <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                         <span className="text-white text-sm">🎯</span>
                       </div>
                       <h3 className="text-lg font-semibold text-white">Objetivos</h3>
                     </div>
                     <ul className="space-y-3">
                       {selectedMode.requirements.map((req, index) => (
                         <li key={index} className="flex items-start gap-3 p-3 bg-slate-600/30 rounded-xl border border-slate-500/30 shadow-sm">
                           <span className="flex-shrink-0 w-6 h-6 bg-amber-500/30 text-amber-400 rounded-full flex items-center justify-center text-sm font-bold">
                             {index + 1}
                           </span>
                           <span className="text-gray-300/90 leading-relaxed">{req}</span>
                         </li>
                       ))}
                     </ul>
                   </div>

                   {/* Tips */}
                   <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-6 border border-slate-600/30 shadow-lg">
                     <div className="flex items-center gap-2 mb-4">
                       <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                         <span className="text-white text-sm">💡</span>
                       </div>
                       <h3 className="text-lg font-semibold text-white">Dicas Estratégicas</h3>
                     </div>
                     <ul className="space-y-3">
                       {selectedMode.tips.map((tip, index) => (
                         <li key={index} className="flex items-start gap-3 p-3 bg-slate-600/30 rounded-xl border border-slate-500/30 shadow-sm">
                           <span className="flex-shrink-0 w-6 h-6 bg-green-500/30 text-green-400 rounded-full flex items-center justify-center text-sm">
                             💡
                           </span>
                           <span className="text-gray-300/90 leading-relaxed">{tip}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 </div>

                 {/* Footer - Fixed */}
                 <div className="flex-shrink-0 p-6 border-t border-slate-600/30 bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-b-3xl">
                  {/* Don't Show Again Option */}
                  <div className="mb-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                        className="w-5 h-5 text-amber-500 bg-slate-700 border-slate-600 rounded focus:ring-amber-500 focus:ring-2 transition-all duration-200 group-hover:border-amber-400"
                      />
                      <span className="text-sm text-gray-300/80 group-hover:text-gray-200 transition-colors">
                        Não mostrar esta explicação novamente
                      </span>
                    </label>
                  </div>

                                     {/* Action Buttons */}
                   <div className="flex gap-4">
                     <button
                       onClick={() => setShowModal(false)}
                       className="flex-1 px-6 py-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-bold rounded-xl transition-all duration-300 border border-slate-500/50 hover:border-slate-400/70 hover:scale-105 shadow-lg hover:shadow-xl"
                     >
                       Cancelar
                     </button>
          <button
                       onClick={() => handleModeSelect(selectedMode)}
                       className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border border-amber-400/30"
          >
                       Jogar Este Modo
          </button>
        </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-3xl p-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl"></div>
              <div className="relative text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-6"></div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  Preparando Batalha
                </h3>
                <p className="text-gray-300/80">Configurando modo de jogo épico...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameModePage; 
