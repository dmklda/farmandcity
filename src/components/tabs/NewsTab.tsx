import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useGameNews } from '../../hooks/useGameNews';
import { 
  Newspaper, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  CheckCircle,
  Wrench,
  Star,
  Zap,
  Gift,
  TrendingUp,
  Users,
  Settings
} from 'lucide-react';

export const NewsTab: React.FC = () => {
  const { news, loading, error, getNewsByType, getNewsByPriority, getLatestNews } = useGameNews();

  const latestUpdates = getLatestNews(5);
  const featureNews = getNewsByType('feature');
  const maintenanceNews = getNewsByType('maintenance');

  // Mock data para funcionalidades futuras (será implementado posteriormente)
  const upcomingFeatures = [
    {
      id: 1,
      title: "Modo Torneio Automático",
      description: "Participe de torneios automáticos com jogadores de todo o mundo",
      status: "development",
      estimatedRelease: "Março 2024",
      progress: 75,
      icon: "🏆"
    },
    {
      id: 2,
      title: "Sistema de Crafting",
      description: "Crie suas próprias cartas usando materiais coletados",
      status: "planning",
      estimatedRelease: "Abril 2024",
      progress: 25,
      icon: "🔨"
    },
    {
      id: 3,
      title: "Modo Cooperativo",
      description: "Jogue com amigos em missões cooperativas",
      status: "design",
      estimatedRelease: "Maio 2024",
      progress: 10,
      icon: "🤝"
    }
  ];

  const getNewsIcon = (type: string) => {
    switch (type) {
      case 'feature': return <Sparkles className="h-5 w-5" />;
      case 'announcement': return <Newspaper className="h-5 w-5" />;
      case 'maintenance': return <Wrench className="h-5 w-5" />;
      case 'update': return <Zap className="h-5 w-5" />;
      case 'balance': return <Settings className="h-5 w-5" />;
      default: return <Newspaper className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 border-red-500/40 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500/40 text-orange-400';
      case 'normal': return 'bg-blue-500/20 border-blue-500/40 text-blue-400';
      case 'low': return 'bg-gray-500/20 border-gray-500/40 text-gray-400';
      default: return 'bg-blue-500/20 border-blue-500/40 text-blue-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'development': return 'bg-blue-500/20 text-blue-400';
      case 'planning': return 'bg-yellow-500/20 text-yellow-400';
      case 'design': return 'bg-purple-500/20 text-purple-400';
      case 'testing': return 'bg-orange-500/20 text-orange-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-white/60 mt-2">Carregando notícias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <p className="text-red-400">Erro ao carregar notícias: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Últimas Atualizações */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-blue-400" />
          Últimas Atualizações
        </h2>
        
        {latestUpdates.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <p className="text-white/60">Nenhuma notícia disponível no momento.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {latestUpdates.map((item) => (
              <Card key={item.id} className={`bg-slate-800/50 border-slate-700/50 ${getPriorityColor(item.priority)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getNewsIcon(item.type)}
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                    <Badge variant="secondary" className={getPriorityColor(item.priority)}>
                      {item.priority === 'urgent' ? 'Urgente' : 
                       item.priority === 'high' ? 'Alta' : 
                       item.priority === 'normal' ? 'Normal' : 'Baixa'}
                    </Badge>
                  </div>
                  <CardDescription className="text-white/70">
                    {item.content.length > 100 ? `${item.content.substring(0, 100)}...` : item.content}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(item.published_at)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {item.type === 'feature' ? 'Funcionalidade' :
                       item.type === 'announcement' ? 'Anúncio' :
                       item.type === 'maintenance' ? 'Manutenção' :
                       item.type === 'update' ? 'Atualização' :
                       item.type === 'balance' ? 'Balanceamento' : 'Notícia'}
                    </Badge>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-white"
                  >
                    Ler Mais
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Funcionalidades Futuras */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-green-400" />
          Funcionalidades Futuras
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingFeatures.map((feature) => (
            <Card key={feature.id} className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{feature.icon}</span>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(feature.status)}>
                    {feature.status === 'development' ? 'Desenvolvimento' :
                     feature.status === 'planning' ? 'Planejamento' :
                     feature.status === 'design' ? 'Design' :
                     feature.status === 'testing' ? 'Testes' : 'Concluído'}
                  </Badge>
                </div>
                <CardDescription className="text-white/70">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    <span>Previsão: {feature.estimatedRelease}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{feature.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${feature.progress}%` }}
                    ></div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-white"
                  disabled
                >
                  Em Desenvolvimento
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Manutenções */}
      {maintenanceNews.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Wrench className="h-6 w-6 text-orange-400" />
            Manutenções
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {maintenanceNews.map((item) => (
              <Card key={item.id} className="bg-slate-800/50 border-slate-700/50 border-orange-500/40">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  <CardDescription className="text-white/70">
                    {item.content}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(item.published_at)}</span>
                    </div>
                  </div>

                  <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/40">
                    Manutenção
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Estatísticas do Jogo */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="h-6 w-6 text-purple-400" />
          Estatísticas do Jogo
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🎮</div>
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-sm text-white/60">Jogadores Ativos</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-white">5,892</div>
              <div className="text-sm text-white/60">Partidas Hoje</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🃏</div>
              <div className="text-2xl font-bold text-white">89,234</div>
              <div className="text-sm text-white/60">Cartas Criadas</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-white">12,456</div>
              <div className="text-sm text-white/60">Decks Compartilhados</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 
