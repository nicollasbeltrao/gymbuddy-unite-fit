import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Settings, 
  ArrowLeft, 
  Camera, 
  Flame, 
  MessageCircle, 
  Phone, 
  Video,
  MoreVertical,
  Check,
  CheckCheck
} from "lucide-react";
import { useChatContext } from "@/contexts/ChatContext";
import { StoriesCarousel } from "@/components/StoriesCarousel";

interface SocialScreenProps {
  onNavigate: (screen: string) => void;
}

interface ChatUser {
    id: number;
    name: string;
    avatar: string;
    online: boolean;
  lastSeen?: string;
  status: 'online' | 'offline' | 'last-seen';
  isNewMatch?: boolean;
  matchDate?: string;
  streak?: number;
  unreadCount: number;
  lastMessage: {
    text: string;
    time: string;
    isFromMe: boolean;
    type: 'text' | 'snap' | 'audio' | 'call' | 'workout';
    status: 'sent' | 'delivered' | 'read' | 'opened';
  };
}

export function SocialScreen({ onNavigate }: SocialScreenProps) {
  const { chatUsers, markAsRead } = useChatContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<ChatUser[]>(chatUsers);

  // Dados mockados de stories para os usuários
  const usersWithStories = [
    {
      id: 1,
      name: "Ana Silva",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      online: true,
      lastSeen: "2 min atrás",
      stories: [
        {
          id: 1,
          userId: 1,
          userName: "Ana Silva",
          userAvatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
          mediaUrl: "https://images.unsplash.com/photo-1549476464-37392f717541",
          mediaType: 'image' as const,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
          expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 horas restantes
          viewed: false,
          likes: 12,
          replies: 3
        },
        {
          id: 2,
          userId: 1,
          userName: "Ana Silva",
          userAvatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
          mediaUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
          mediaType: 'image' as const,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
          expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000), // 20 horas restantes
          viewed: true,
          likes: 8,
          replies: 1
        }
      ]
    },
    {
      id: 2,
      name: "Carlos Santos",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      online: false,
      lastSeen: "1h atrás",
      stories: [
        {
          id: 3,
          userId: 2,
          userName: "Carlos Santos",
          userAvatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
          mediaUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
          mediaType: 'image' as const,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
          expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23 horas restantes
          viewed: false,
          likes: 15,
          replies: 5
        }
      ]
    },
    {
      id: 3,
      name: "Maria Costa",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786",
      online: true,
      lastSeen: "agora",
      stories: [
        {
          id: 4,
          userId: 3,
          userName: "Maria Costa",
          userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786",
          mediaUrl: "https://images.unsplash.com/photo-1549476464-37392f717541",
          mediaType: 'image' as const,
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
          expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000), // 23.5 horas restantes
          viewed: false,
          likes: 6,
          replies: 2
        }
      ]
    }
  ];

  // Filtra usuários baseado na busca
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = chatUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(chatUsers);
    }
  }, [searchQuery, chatUsers]);

  const getStatusText = (user: ChatUser) => {
    if (user.online) return 'Online';
    if (user.status === 'last-seen') return `Visto por último ${user.lastSeen}`;
    return 'Offline';
  };

  const getStatusColor = (user: ChatUser) => {
    if (user.online) return 'text-green-500';
    if (user.status === 'last-seen') return 'text-gray-500';
    return 'text-gray-400';
  };

  const getMessageIcon = (message: ChatUser['lastMessage']) => {
    switch (message.type) {
      case 'snap':
        return <Camera className="w-4 h-4 text-yellow-500" />;
      case 'call':
        return <Phone className="w-4 h-4 text-red-500" />;
      case 'audio':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'workout':
        return <Flame className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getMessageStatus = (message: ChatUser['lastMessage']) => {
    if (message.isFromMe) {
      switch (message.status) {
        case 'read':
          return <CheckCheck className="w-4 h-4 text-blue-500" />;
        case 'delivered':
          return <CheckCheck className="w-4 h-4 text-gray-400" />;
        case 'sent':
          return <Check className="w-4 h-4 text-gray-400" />;
        default:
          return null;
      }
    }
    return null;
  };

  const openChat = (user: ChatUser) => {
    // Marcar como lido quando abrir o chat
    markAsRead(user.id);
    // Navega para o WorkoutChat com o usuário específico
    onNavigate('workout-chat');
  };

  const handleStoryView = (story: any) => {
    // Marcar story como visualizado
    console.log('Story visualizado:', story);
  };

  const handleAddStory = () => {
    // Implementar lógica para adicionar story
    console.log('Adicionar novo story');
  };

    return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">WB</span>
          </div>
            <div>
              <h1 className="text-xl font-bold">Chat</h1>
            <p className="text-sm text-muted-foreground">
                {filteredUsers.length} conversa{filteredUsers.length !== 1 ? 's' : ''}
            </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Plus className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar conversas..."
              className="pl-10 rounded-full border-border/50 bg-muted/50 focus:bg-background"
            />
          </div>
        </div>
      </div>

      {/* Stories Carousel */}
      <StoriesCarousel 
        users={usersWithStories}
        onStoryView={handleStoryView}
        onAddStory={handleAddStory}
      />

      {/* Chat List */}
      <div className="p-4 space-y-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Card 
              key={user.id} 
              className="shadow-none border-0 bg-transparent hover:bg-muted/30 rounded-2xl transition-all duration-200 cursor-pointer group"
              onClick={() => openChat(user)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div 
                      className="w-14 h-14 rounded-full bg-cover bg-center ring-2 ring-border/50 group-hover:ring-primary/30 transition-all duration-200"
                      style={{ backgroundImage: `url(${user.avatar})` }}
                    />
                    
                    {/* Online Status */}
                    {user.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                    )}
                    
                    {/* New Match Badge */}
                    {user.isNewMatch && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-background flex items-center justify-center">
                        <span className="text-white text-xs font-bold">N</span>
                      </div>
                    )}
                    
                    {/* Streak Badge */}
                    {user.streak && user.streak > 0 && (
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-2 border-background flex items-center justify-center">
                        <Flame className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-base truncate">
                        {user.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {user.lastMessage.time}
                        </span>
                        {getMessageStatus(user.lastMessage)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        {getMessageIcon(user.lastMessage)}
                        <p className={`text-sm truncate ${
                          user.unreadCount > 0 
                            ? 'font-semibold text-foreground' 
                            : 'text-muted-foreground'
                        }`}>
                          {user.lastMessage.isFromMe ? 'Você: ' : ''}
                          {user.lastMessage.text}
              </p>
            </div>

                      {/* Unread Count */}
                      {user.unreadCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="text-xs px-2 py-1 min-w-[20px] h-5 flex items-center justify-center"
                        >
                          {user.unreadCount}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Status */}
                    <p className={`text-xs mt-1 ${getStatusColor(user)}`}>
                      {getStatusText(user)}
                    </p>
                  </div>
                  
                  {/* More Options */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Abrir menu de opções
                    }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
            <Card className="shadow-soft">
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery 
                  ? 'Tente buscar por outro nome'
                  : 'Faça matches para começar conversas com seus parceiros de treino'
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => onNavigate('match')} 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Encontrar Parceiros
                </Button>
              )}
              </CardContent>
            </Card>
        )}
      </div>

      {/* Empty State for New Users */}
      {filteredUsers.length === 0 && !searchQuery && (
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Bem-vindo ao Chat!</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Aqui você pode conversar com seus parceiros de treino, compartilhar progresso e agendar sessões juntos.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => onNavigate('match')} 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              🎯 Encontrar Parceiros
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-border/50"
              onClick={() => onNavigate('schedule')}
            >
              📅 Ver Agenda
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}