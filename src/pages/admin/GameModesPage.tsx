import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Textarea } from '../../components/ui/textarea';
import { 
  Gamepad2, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  TestTube,
  Play,
  Settings,
  Shield,
  Crown,
  Zap,
  Infinity,
  Target,
  Clock,
  Coins,
  Factory
} from 'lucide-react';
import { toast } from 'sonner';

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
  isActive: boolean;
  isTestMode: boolean;
  created_at?: string;
  updated_at?: string;
}

const DEFAULT_MODES: GameMode[] = [
  {
    id: 'classic-mode',
    name: 'Modo Clássico',
    description: 'Múltiplas condições de vitória: Construção, Sobrevivência, Prosperidade, Prestígio ou Domínio Mágico.',
    detailedDescription: 'O modo clássico oferece 5 diferentes caminhos para a vitória. Você pode escolher entre focar na construção de marcos históricos, alcançar alta reputação, maximizar a produção, sobreviver por muitos turnos, ou dominar a magia. Cada caminho oferece uma experiência única e desafiadora.',
    victoryMode: 'classic',
    victoryValue: 0,
    icon: '👑',
    color: 'amber',
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
    ],
    isActive: true,
    isTestMode: false
  },
  {
    id: 'simple-construction',
    name: 'Construtor Simples',
    description: 'Construa 3 marcos históricos para vencer.',
    detailedDescription: 'Um modo ideal para iniciantes! Foque na construção de 3 marcos históricos impressionantes. Este modo ensina os fundamentos do gerenciamento de recursos e planejamento estratégico.',
    victoryMode: 'landmarks',
    victoryValue: 3,
    icon: '🏛️',
    color: 'green',
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
    ],
    isActive: true,
    isTestMode: false
  },
  {
    id: 'infinite-challenge',
    name: 'Desafio Infinito',
    description: 'Jogue indefinidamente enquanto o jogo fica cada vez mais difícil.',
    detailedDescription: 'Para os verdadeiros mestres do reino! Este modo não tem fim - continue jogando enquanto o desafio aumenta exponencialmente. Cada turno traz novos obstáculos e o jogo se torna progressivamente mais difícil.',
    victoryMode: 'infinite',
    victoryValue: 0,
    icon: '∞',
    color: 'purple',
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
    ],
    isActive: true,
    isTestMode: false
  },
  {
    id: 'reputation-challenge',
    name: 'Desafio - Reputação',
    description: 'Alcance 15 pontos de reputação para se tornar respeitado.',
    detailedDescription: 'Construa uma reputação sólida através de ações nobres, construções impressionantes e decisões sábias. Cada ação que beneficia seu reino aumenta sua reputação, mas escolhas controversas podem prejudicá-la.',
    victoryMode: 'reputation',
    victoryValue: 15,
    icon: '⭐',
    color: 'yellow',
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
    ],
    isActive: true,
    isTestMode: false
  },
  {
    id: 'survival-mode',
    name: 'Modo Sobrevivência',
    description: 'Sobreviva 25 turnos em um mundo hostil.',
    detailedDescription: 'Em um mundo onde cada turno traz novos desafios, sua missão é simples: sobreviver! Enfrente escassez de recursos, desastres naturais e crises políticas. Quanto mais tempo você sobreviver, maior será sua glória.',
    victoryMode: 'elimination',
    victoryValue: 25,
    icon: '⏰',
    color: 'red',
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
    ],
    isActive: true,
    isTestMode: false
  },
  {
    id: 'complex-victory',
    name: 'Vitória Complexa',
    description: 'Complete múltiplos objetivos para vencer. 2 vitórias maiores + 1 menor.',
    detailedDescription: 'O modo mais desafiador do reino! Você deve completar 2 vitórias maiores E 1 vitória menor simultaneamente. Este modo testa sua capacidade de gerenciar múltiplos objetivos e estratégias complexas.',
    victoryMode: 'complex',
    victoryValue: 0,
    icon: '🏆',
    color: 'purple',
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
    ],
    isActive: true,
    isTestMode: false
  },
  {
    id: 'legendary-status',
    name: 'Status Lendário',
    description: 'Alcance 25 pontos de reputação para se tornar uma lenda.',
    detailedDescription: 'Torne-se uma lenda cujas histórias serão contadas por gerações! Alcançar 25 pontos de reputação requer não apenas sabedoria, mas também carisma, liderança e uma visão clara para o futuro do reino.',
    victoryMode: 'reputation',
    victoryValue: 25,
    icon: '👑',
    color: 'pink',
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
    ],
    isActive: true,
    isTestMode: false
  },
  {
    id: 'endurance-test',
    name: 'Teste de Resistência',
    description: 'Sobreviva 50 turnos em condições extremas.',
    detailedDescription: 'O teste definitivo de resistência! Sobreviva 50 turnos em um mundo onde cada decisão pode ser a diferença entre a vida e a morte. Este modo testa sua capacidade de planejamento de longo prazo e adaptação.',
    victoryMode: 'elimination',
    victoryValue: 50,
    icon: '🛡️',
    color: 'gray',
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
    ],
    isActive: true,
    isTestMode: false
  },
  {
    id: 'prosperity-challenge',
    name: 'Desafio da Prosperidade',
    description: 'Acumule 1000 moedas para se tornar rico.',
    detailedDescription: 'Transforme seu reino em uma potência econômica! Foque na produção de moedas e no comércio para acumular riqueza. Este modo testa sua capacidade de gerenciamento econômico e otimização de produção.',
    victoryMode: 'resources',
    victoryValue: 1000,
    icon: '💰',
    color: 'emerald',
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
    ],
    isActive: true,
    isTestMode: false
  },
  {
    id: 'production-master',
    name: 'Mestre da Produção',
    description: 'Produza 100 recursos por turno para se tornar eficiente.',
    detailedDescription: 'Torne-se um mestre da eficiência! Otimize suas construções e estratégias para maximizar a produção por turno. Este modo testa sua capacidade de planejamento e otimização de recursos. As catástrofes aparecerão para testar sua resiliência!',
    victoryMode: 'production',
    victoryValue: 50,
    icon: '⚙️',
    color: 'blue',
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
    ],
    isActive: true,
    isTestMode: false
  }
];

export const GameModesPage: React.FC = () => {
  const [gameModes, setGameModes] = useState<GameMode[]>(DEFAULT_MODES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMode, setEditingMode] = useState<GameMode | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [testMode, setTestMode] = useState<GameMode | null>(null);
  const [newMode, setNewMode] = useState<Partial<GameMode>>({
    name: '',
    description: '',
    detailedDescription: '',
    victoryMode: 'classic',
    victoryValue: 0,
    icon: '🎮',
    color: 'blue',
    difficulty: 'medium',
    category: 'main',
    tips: [],
    requirements: [],
    isActive: true,
    isTestMode: false
  });

  useEffect(() => {
    console.log('GameModesPage: useEffect triggered');
    loadGameModes();
  }, []);

  const loadGameModes = async () => {
    try {
      setLoading(true);
      
      // Verificar se o usuário está autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('User not authenticated:', authError);
        toast.error('Usuário não autenticado');
        return;
      }
      
      console.log('User authenticated:', user.id);
      
      const { data, error } = await supabase
        .from('game_modes')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading game modes:', error);
        toast.error('Erro ao carregar modos de jogo');
        return;
      }
      
      console.log('Raw data from database:', data);
      
      if (data && data.length > 0) {
        console.log('Loaded game modes from database:', data.length);
        const mappedModes = data.map(mode => ({
          id: mode.id,
          name: mode.name,
          description: mode.description,
          detailedDescription: mode.detailed_description || mode.description,
          victoryMode: mode.victory_mode,
          victoryValue: mode.victory_value,
          icon: mode.icon,
          color: `bg-${mode.color}-500`,
          difficulty: mode.difficulty,
          category: mode.category,
          tips: mode.tips || [],
          requirements: mode.requirements || [],
          isActive: mode.is_active || false,
          isTestMode: mode.is_test_mode || false,
          created_at: mode.created_at,
          updated_at: mode.updated_at
        }));
        console.log('Mapped modes:', mappedModes);
        setGameModes(mappedModes);
      } else {
        console.log('No game modes found, saving defaults...');
        // Se não há modos salvos, usar os padrões
        await saveDefaultModes();
      }
    } catch (error) {
      console.error('Error loading game modes:', error);
      toast.error('Erro ao carregar modos de jogo');
    } finally {
      setLoading(false);
    }
  };

  const saveDefaultModes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const modesToSave = DEFAULT_MODES.map(mode => ({
        ...mode,
        is_active: mode.isActive,
        is_test_mode: mode.isTestMode,
        created_by: user.id
      }));

      const { error } = await supabase
        .from('game_modes')
        .insert(modesToSave);

      if (error) throw error;
      
      toast.success('Modos padrão salvos com sucesso!');
    } catch (error) {
      console.error('Error saving default modes:', error);
      toast.error('Erro ao salvar modos padrão');
    }
  };

  const saveGameModes = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Atualizar todos os modos
      for (const mode of gameModes) {
        const { error } = await supabase
          .from('game_modes')
          .upsert({
            id: mode.id,
            name: mode.name,
            description: mode.description,
            detailed_description: mode.detailedDescription,
            victory_mode: mode.victoryMode,
            victory_value: mode.victoryValue,
            icon: mode.icon,
            color: mode.color.replace('bg-', '').replace('-500', ''),
            difficulty: mode.difficulty,
            category: mode.category,
            tips: mode.tips,
            requirements: mode.requirements,
            is_active: mode.isActive,
            is_test_mode: mode.isTestMode,
            updated_by: user.id,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      toast.success('Modos de jogo salvos com sucesso!');
    } catch (error) {
      console.error('Error saving game modes:', error);
      toast.error('Erro ao salvar modos de jogo');
    } finally {
      setSaving(false);
    }
  };

  const toggleModeActive = async (modeId: string) => {
    try {
      const mode = gameModes.find(m => m.id === modeId);
      if (!mode) return;

      const newActiveState = !mode.isActive;
      
      // Atualizar no banco de dados
      const { error } = await supabase
        .from('game_modes')
        .update({ 
          is_active: newActiveState,
          updated_at: new Date().toISOString()
        })
        .eq('id', modeId);

      if (error) throw error;

      // Atualizar estado local
      setGameModes(prev => prev.map(m => 
        m.id === modeId ? { ...m, isActive: newActiveState } : m
      ));

      toast.success(`Modo ${newActiveState ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      console.error('Error toggling mode active:', error);
      toast.error('Erro ao alterar status do modo');
    }
  };

  const toggleTestMode = async (modeId: string) => {
    try {
      const mode = gameModes.find(m => m.id === modeId);
      if (!mode) return;

      const newTestState = !mode.isTestMode;
      
      // Atualizar no banco de dados
      const { error } = await supabase
        .from('game_modes')
        .update({ 
          is_test_mode: newTestState,
          updated_at: new Date().toISOString()
        })
        .eq('id', modeId);

      if (error) throw error;

      // Atualizar estado local
      setGameModes(prev => prev.map(m => 
        m.id === modeId ? { ...m, isTestMode: newTestState } : m
      ));

      toast.success(`Modo de teste ${newTestState ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      console.error('Error toggling test mode:', error);
      toast.error('Erro ao alterar modo de teste');
    }
  };

  const deleteMode = async (modeId: string) => {
    if (!confirm('Tem certeza que deseja excluir este modo de jogo?')) return;

    try {
      const { error } = await supabase
        .from('game_modes')
        .delete()
        .eq('id', modeId);

      if (error) throw error;

      setGameModes(prev => prev.filter(mode => mode.id !== modeId));
      toast.success('Modo de jogo excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting game mode:', error);
      toast.error('Erro ao excluir modo de jogo');
    }
  };

  const startTestMode = (mode: GameMode) => {
    setTestMode(mode);
    toast.success(`Modo de teste iniciado: ${mode.name}`);
  };

  const saveMode = async (modeData: Partial<GameMode>, isNew: boolean = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      const modeToSave = {
        ...modeData,
        is_active: modeData.isActive || false,
        is_test_mode: modeData.isTestMode || false,
        created_by: user.id,
        updated_by: user.id,
        updated_at: new Date().toISOString()
      };

      let result;
      if (isNew) {
        // Criar novo modo
        result = await supabase
          .from('game_modes')
          .insert([modeToSave])
          .select();
      } else {
        // Atualizar modo existente
        result = await supabase
          .from('game_modes')
          .update(modeToSave)
          .eq('id', modeData.id)
          .select();
      }

      if (result.error) throw result.error;

      // Recarregar modos do banco
      await loadGameModes();
      
      // Limpar formulários
      setEditingMode(null);
      setShowAddForm(false);
      setNewMode({
        name: '',
        description: '',
        detailedDescription: '',
        victoryMode: 'classic',
        victoryValue: 0,
        icon: '🎮',
        color: 'blue',
        difficulty: 'medium',
        category: 'main',
        tips: [],
        requirements: [],
        isActive: true,
        isTestMode: false
      });

      toast.success(`Modo ${isNew ? 'criado' : 'atualizado'} com sucesso!`);
    } catch (error) {
      console.error('Error saving mode:', error);
      toast.error(`Erro ao ${isNew ? 'criar' : 'atualizar'} modo`);
    }
  };

  const handleEditMode = (mode: GameMode) => {
    setEditingMode(mode);
  };

  const handleAddMode = () => {
    setShowAddForm(true);
  };

  const updateEditingMode = (updates: Partial<GameMode>) => {
    if (editingMode) {
      setEditingMode({ ...editingMode, ...updates });
    }
  };

  const getVictoryModeIcon = (victoryMode: string) => {
    switch (victoryMode) {
      case 'classic': return <Crown className="h-4 w-4" />;
      case 'landmarks': return <Shield className="h-4 w-4" />;
      case 'reputation': return <Target className="h-4 w-4" />;
      case 'elimination': return <Clock className="h-4 w-4" />;
      case 'infinite': return <Infinity className="h-4 w-4" />;
      case 'resources': return <Coins className="h-4 w-4" />;
      case 'production': return <Factory className="h-4 w-4" />;
      case 'complex': return <Zap className="h-4 w-4" />;
      default: return <Gamepad2 className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-orange-500';
      case 'extreme': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  console.log('GameModesPage render - loading:', loading, 'gameModes:', gameModes.length, gameModes);
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Modos de Jogo</h1>
            <p className="text-muted-foreground">Gerencie os modos de jogo disponíveis.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Modos de Jogo</h1>
          <p className="text-muted-foreground">Gerencie os modos de jogo disponíveis.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddMode}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Modo
          </Button>
          <Button onClick={saveGameModes} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Todos'}
          </Button>
        </div>
      </div>

      {/* Test Mode Alert */}
      {testMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <TestTube className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <h3 className="font-medium text-yellow-800">Modo de Teste Ativo</h3>
              <p className="text-yellow-700">Testando: {testMode.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Game Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gameModes.map((mode) => (
          <Card key={mode.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{mode.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{mode.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{mode.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(mode.difficulty)} bg-gray-100`}>
                    {mode.difficulty}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  {getVictoryModeIcon(mode.victoryMode)}
                  <span className="font-medium">{mode.victoryMode}</span>
                  {mode.victoryValue > 0 && (
                    <span className="text-muted-foreground">({mode.victoryValue})</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={mode.isActive}
                    onCheckedChange={() => toggleModeActive(mode.id)}
                  />
                  <Label className="text-sm">Ativo</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={mode.isTestMode}
                    onCheckedChange={() => toggleTestMode(mode.id)}
                  />
                  <Label className="text-sm">Modo Teste</Label>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditMode(mode)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMode(mode.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Excluir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startTestMode(mode)}
                  >
                    <TestTube className="h-3 w-3 mr-1" />
                    Testar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Edição */}
      {editingMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Editar Modo de Jogo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nome</Label>
                  <Input
                    id="edit-name"
                    value={editingMode?.name || ''}
                    onChange={(e) => updateEditingMode({ name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-icon">Ícone</Label>
                  <Input
                    id="edit-icon"
                    value={editingMode?.icon || ''}
                    onChange={(e) => updateEditingMode({ icon: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Input
                  id="edit-description"
                  value={editingMode?.description || ''}
                  onChange={(e) => updateEditingMode({ description: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-detailed">Descrição Detalhada</Label>
                <Textarea
                  id="edit-detailed"
                  value={editingMode?.detailedDescription || ''}
                  onChange={(e) => updateEditingMode({ detailedDescription: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-victory">Modo de Vitória</Label>
                  <select
                    id="edit-victory"
                    aria-label="Modo de Vitória"
                    value={editingMode?.victoryMode || 'classic'}
                    onChange={(e) => updateEditingMode({ victoryMode: e.target.value as any })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="classic">Clássico</option>
                    <option value="landmarks">Marcos</option>
                    <option value="reputation">Reputação</option>
                    <option value="elimination">Eliminação</option>
                    <option value="infinite">Infinito</option>
                    <option value="resources">Recursos</option>
                    <option value="production">Produção</option>
                    <option value="complex">Complexo</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-value">Valor da Vitória</Label>
                  <Input
                    id="edit-value"
                    type="number"
                    value={editingMode?.victoryValue || 0}
                    onChange={(e) => updateEditingMode({ victoryValue: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-difficulty">Dificuldade</Label>
                  <select
                    id="edit-difficulty"
                    aria-label="Dificuldade"
                    value={editingMode?.difficulty || 'medium'}
                    onChange={(e) => updateEditingMode({ difficulty: e.target.value as any })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="easy">Fácil</option>
                    <option value="medium">Médio</option>
                    <option value="hard">Difícil</option>
                    <option value="extreme">Extremo</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={() => editingMode && saveMode(editingMode, false)}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setEditingMode(null)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Criação */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Criar Novo Modo de Jogo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-name">Nome</Label>
                  <Input
                    id="new-name"
                    value={newMode.name}
                    onChange={(e) => setNewMode({...newMode, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-icon">Ícone</Label>
                  <Input
                    id="new-icon"
                    value={newMode.icon}
                    onChange={(e) => setNewMode({...newMode, icon: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="new-description">Descrição</Label>
                <Input
                  id="new-description"
                  value={newMode.description}
                  onChange={(e) => setNewMode({...newMode, description: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="new-detailed">Descrição Detalhada</Label>
                <Textarea
                  id="new-detailed"
                  value={newMode.detailedDescription}
                  onChange={(e) => setNewMode({...newMode, detailedDescription: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="new-victory">Modo de Vitória</Label>
                  <select
                    id="new-victory"
                    aria-label="Modo de Vitória"
                    value={newMode.victoryMode}
                    onChange={(e) => setNewMode({...newMode, victoryMode: e.target.value as any})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="classic">Clássico</option>
                    <option value="landmarks">Marcos</option>
                    <option value="reputation">Reputação</option>
                    <option value="elimination">Eliminação</option>
                    <option value="infinite">Infinito</option>
                    <option value="resources">Recursos</option>
                    <option value="production">Produção</option>
                    <option value="complex">Complexo</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="new-value">Valor da Vitória</Label>
                  <Input
                    id="new-value"
                    type="number"
                    value={newMode.victoryValue}
                    onChange={(e) => setNewMode({...newMode, victoryValue: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-difficulty">Dificuldade</Label>
                  <select
                    id="new-difficulty"
                    aria-label="Dificuldade"
                    value={newMode.difficulty}
                    onChange={(e) => setNewMode({...newMode, difficulty: e.target.value as any})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="easy">Fácil</option>
                    <option value="medium">Médio</option>
                    <option value="hard">Difícil</option>
                    <option value="extreme">Extremo</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={() => saveMode(newMode, true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
