import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
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
  // Mock data for news
  const latestUpdates = [
    {
      id: 1,
      title: "Nova Expansão: Reino das Sombras",
      description: "Descubra 50 novas cartas com mecânicas únicas de sombra e escuridão",
      type: "expansion",
      date: "2024-02-01",
      priority: "high",
      tags: ["Expansão", "Novas Cartas", "Mecânicas"],
      image: "🌙",
      isNew: true
    },
    {
      id: 2,
      title: "Sistema de Clãs Implementado",
      description: "Junte-se a clãs, participe de guerras e conquiste territórios",
      type: "feature",
      date: "2024-01-28",
      priority: "medium",
      tags: ["Clãs", "Guerras", "Territórios"],
      image: "⚔️",
      isNew: true
    },
    {
      id: 3,
      title: "Balanceamento de Cartas - Janeiro 2024",
      description: "Ajustes importantes para melhorar a experiência competitiva",
      type: "balance",
      date: "2024-01-25",
      priority: "medium",
      tags: ["Balanceamento", "Competitivo"],
      image: "⚖️",
      isNew: false
    }
  ];

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

  const maintenanceSchedule = [
    {
      id: 1,
      title: "Manutenção Programada - Servidores",
      description: "Atualização de infraestrutura para melhor performance",
      date: "2024-02-05",
      time: "02:00 - 06:00 UTC",
      status: "scheduled",
      impact: "low"
    },
    {
      id: 2,
      title: "Manutenção de Emergência - Correção de Bugs",
      description: "Correção de bugs críticos reportados pela comunidade",
      date: "2024-01-30",
      time: "14:00 - 16:00 UTC",
      status: "completed",
      impact: "medium"
    }
  ];

  const communityHighlights = [
    {
      id: 1,
      title: "Melhor Deck do Mês",
      description: "Deck 'Tempestade de Fogo' criado por ImperadorMax",
      author: "ImperadorMax",
      votes: 1247,
      category: "deck"
    },
    {
      id: 2,
      title: "Estratégia Mais Inovadora",
      description: "Técnica de 'Rush de Recursos' desenvolvida pela comunidade",
      author: "Comunidade",
      votes: 892,
      category: "strategy"
    },
    {
      id: 3,
      title: "Melhor Contribuição",
      description: "Guia completo de cartas raras por MestreCartas",
      author: "MestreCartas",
      votes: 567,
      category: "guide"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'development': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'planning': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'design': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'scheduled': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Últimas Atualizações */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          Últimas Atualizações
        </h2>
        <div className="space-y-6">
          {latestUpdates.map((update) => (
            <Card key={update.id} className="bg-slate-800/80 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{update.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-white">{update.title}</h3>
                      {update.isNew && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                          Novo
                        </Badge>
                      )}
                      <Badge variant="outline" className={getPriorityColor(update.priority)}>
                        {update.priority === 'high' ? 'Alta' : update.priority === 'medium' ? 'Média' : 'Baixa'}
                      </Badge>
                    </div>
                    <p className="text-white/70 mb-3">{update.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      {update.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-blue-500/30 text-blue-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/50">{update.date}</span>
                      <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                        Ler Mais
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Próximas Features */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-green-500" />
          Próximas Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingFeatures.map((feature) => (
            <Card key={feature.id} className="bg-slate-800/80 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{feature.icon}</div>
                  <div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                    <Badge variant="outline" className={getStatusColor(feature.status)}>
                      {feature.status === 'development' ? 'Desenvolvimento' : 
                       feature.status === 'planning' ? 'Planejamento' : 
                       feature.status === 'design' ? 'Design' : 'Concluído'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-white/70">{feature.description}</CardDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Progresso:</span>
                    <span className="text-white font-medium">{feature.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${feature.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Clock className="h-4 w-4" />
                  <span>Lançamento: {feature.estimatedRelease}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Manutenções */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Wrench className="h-6 w-6 text-orange-500" />
          Manutenções
        </h2>
        <div className="space-y-4">
          {maintenanceSchedule.map((maintenance) => (
            <Card key={maintenance.id} className="bg-slate-800/80 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center">
                      <Wrench className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{maintenance.title}</h3>
                      <p className="text-white/70 text-sm">{maintenance.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                        <span>{maintenance.date}</span>
                        <span>{maintenance.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStatusColor(maintenance.status)}>
                      {maintenance.status === 'scheduled' ? 'Agendada' : 'Concluída'}
                    </Badge>
                    <div className="text-sm text-white/70 mt-1">
                      Impacto: {maintenance.impact === 'low' ? 'Baixo' : 'Médio'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Destaques da Comunidade */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Star className="h-6 w-6 text-purple-500" />
          Destaques da Comunidade
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communityHighlights.map((highlight) => (
            <Card key={highlight.id} className="bg-slate-800/80 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white text-lg">{highlight.title}</CardTitle>
                <CardDescription className="text-white/70">{highlight.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/70">
                    por <span className="text-blue-400">{highlight.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">{highlight.votes}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3 border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}; 
