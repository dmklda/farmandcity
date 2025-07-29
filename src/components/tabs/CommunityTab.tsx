import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Award,
  Star,
  Heart,
  Share2,
  ThumbsUp,
  MessageCircle,
  Globe,
  Activity,
  Target,
  EyeOff
} from 'lucide-react';

export const CommunityTab: React.FC = () => {
  // Mock data for community
  const communityStats = [
    { label: "Jogadores Ativos", value: "1,247", icon: Users, color: "text-blue-500", change: "+12%" },
    { label: "Partidas Hoje", value: "5,892", icon: Activity, color: "text-green-500", change: "+8%" },
    { label: "Cartas Criadas", value: "89,234", icon: Target, color: "text-purple-500", change: "+15%" },
    { label: "Decks Compartilhados", value: "12,456", icon: Share2, color: "text-orange-500", change: "+23%" },
  ];

  const topDiscussions = [
    {
      id: 1,
      title: "Melhor estratégia para deck de fazenda?",
      author: "FazendeiroPro",
      avatar: "🚜",
      replies: 24,
      likes: 156,
      views: 892,
      tags: ["Estratégia", "Fazenda"],
      time: "2h atrás",
      isHot: true
    },
    {
      id: 2,
      title: "Novas cartas lendárias são muito poderosas?",
      author: "MestreCartas",
      avatar: "🃏",
      replies: 18,
      likes: 89,
      views: 567,
      tags: ["Discussão", "Balanceamento"],
      time: "4h atrás",
      isHot: false
    },
    {
      id: 3,
      title: "Como melhorar minha coleção rapidamente?",
      author: "Colecionador",
      avatar: "⭐",
      replies: 31,
      likes: 203,
      views: 1245,
      tags: ["Dicas", "Coleção"],
      time: "6h atrás",
      isHot: true
    },
    {
      id: 4,
      title: "Evento de verão foi incrível!",
      author: "EventLover",
      avatar: "🎉",
      replies: 42,
      likes: 278,
      views: 1567,
      tags: ["Eventos", "Feedback"],
      time: "1d atrás",
      isHot: true
    }
  ];

  const topContributors = [
    { rank: 1, name: "ImperadorMax", avatar: "👑", contributions: 156, level: 25, specialty: "Estratégia" },
    { rank: 2, name: "ConstrutorPro", avatar: "🏗️", contributions: 134, level: 23, specialty: "Construção" },
    { rank: 3, name: "FazendeiroElite", avatar: "🚜", contributions: 98, level: 22, specialty: "Agricultura" },
    { rank: 4, name: "MestreCartas", avatar: "🃏", contributions: 87, level: 21, specialty: "Coleção" },
    { rank: 5, name: "Estrategista", avatar: "⚔️", contributions: 76, level: 20, specialty: "Táticas" },
  ];

  const recentActivity = [
    { type: "post", user: "FazendeiroPro", action: "criou uma discussão", content: "Dicas para iniciantes", time: "5min" },
    { type: "reply", user: "MestreCartas", action: "respondeu em", content: "Melhor estratégia para deck de fazenda?", time: "12min" },
    { type: "like", user: "Colecionador", action: "curtiu", content: "Novas cartas lendárias são muito poderosas?", time: "18min" },
    { type: "share", user: "EventLover", action: "compartilhou", content: "Deck temático de verão", time: "25min" },
    { type: "achievement", user: "ImperadorMax", action: "conquistou", content: "Mestre das Cartas", time: "1h" },
  ];

  return (
    <div className="space-y-8">
      {/* Estatísticas da Comunidade */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-500" />
          Estatísticas da Comunidade
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {communityStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-slate-800/80 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-green-400">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Discussões Populares */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-green-500" />
          Discussões Populares
        </h2>
        <div className="space-y-4">
          {topDiscussions.map((discussion) => (
            <Card key={discussion.id} className="bg-slate-800/80 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="text-lg">{discussion.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-white">{discussion.title}</h3>
                      {discussion.isHot && (
                        <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                          🔥 Hot
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/70 mb-3">
                      <span>por {discussion.author}</span>
                      <span>{discussion.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      {discussion.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-blue-500/30 text-blue-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {discussion.replies}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {discussion.likes}
                      </div>
                                             <div className="flex items-center gap-1">
                         <EyeOff className="h-4 w-4" />
                         {discussion.views}
                       </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                    Participar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Top Contribuidores */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Award className="h-6 w-6 text-yellow-500" />
          Top Contribuidores
        </h2>
        <Card className="bg-slate-800/80 border-slate-700/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              {topContributors.map((contributor) => (
                <div key={contributor.rank} className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-sm">
                    {contributor.rank}
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="text-lg">{contributor.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-white">{contributor.name}</div>
                    <div className="text-sm text-white/70">Nível {contributor.level} • {contributor.specialty}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">{contributor.contributions}</div>
                    <div className="text-sm text-white/70">contribuições</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Activity className="h-6 w-6 text-purple-500" />
          Atividade Recente
        </h2>
        <Card className="bg-slate-800/80 border-slate-700/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30">
                  <div className="w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center">
                    {activity.type === 'post' && <MessageSquare className="h-4 w-4 text-blue-400" />}
                    {activity.type === 'reply' && <MessageCircle className="h-4 w-4 text-green-400" />}
                    {activity.type === 'like' && <Heart className="h-4 w-4 text-red-400" />}
                    {activity.type === 'share' && <Share2 className="h-4 w-4 text-purple-400" />}
                    {activity.type === 'achievement' && <Award className="h-4 w-4 text-yellow-400" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-white">{activity.user}</span>
                    <span className="text-white/70"> {activity.action} </span>
                    <span className="text-blue-400">{activity.content}</span>
                  </div>
                  <span className="text-sm text-white/50">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 