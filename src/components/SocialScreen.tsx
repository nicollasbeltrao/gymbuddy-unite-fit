import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share, Trophy, Camera, MapPin, Clock } from "lucide-react";

interface SocialScreenProps {
  onNavigate: (screen: string) => void;
}

interface Post {
  id: number;
  user: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  gym: string;
  achievement?: string;
  likes: number;
  comments: number;
}

const feedPosts: Post[] = [
  {
    id: 1,
    user: "Ana Silva",
    avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    time: "2h",
    content: "Treino de peito e tríceps finalizado! 💪 Obrigada Carlos por ser um ótimo parceiro de treino!",
    image: "https://images.unsplash.com/photo-1549476464-37392f717541",
    gym: "Smart Fit Centro",
    achievement: "Meta Semanal Concluída",
    likes: 24,
    comments: 8
  },
  {
    id: 2,
    user: "Carlos Santos",
    avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    time: "4h",
    content: "30 dias consecutivos treinando! O GymBuddy mudou minha vida 🔥",
    gym: "Smart Fit Centro",
    achievement: "Streak de 30 dias",
    likes: 42,
    comments: 15
  }
];

export function SocialScreen({ onNavigate }: SocialScreenProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'achievements'>('feed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Social</h1>
            <p className="text-muted-foreground">Acompanhe seus amigos</p>
          </div>
          <Button size="icon" className="rounded-full">
            <Camera className="w-5 h-5" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-muted rounded-lg p-1 mb-6">
          <Button
            variant={activeTab === 'feed' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('feed')}
          >
            Feed
          </Button>
          <Button
            variant={activeTab === 'achievements' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('achievements')}
          >
            Conquistas
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-4">
        {activeTab === 'feed' && (
          <>
            {/* Create Post */}
            <Card className="shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">V</span>
                  </div>
                  <div className="flex-1">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                      Como foi seu treino hoje?
                    </Button>
                  </div>
                  <Button size="icon" variant="ghost">
                    <Camera className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feed Posts */}
            {feedPosts.map((post) => (
              <Card key={post.id} className="shadow-soft">
                <CardContent className="p-4 space-y-4">
                  {/* Post Header */}
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${post.avatar})` }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{post.user}</h3>
                        {post.achievement && (
                          <Badge variant="outline" className="text-xs">
                            <Trophy className="w-3 h-3 mr-1" />
                            {post.achievement}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {post.time}
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        {post.gym}
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-sm leading-relaxed">{post.content}</p>

                  {/* Post Image */}
                  {post.image && (
                    <div 
                      className="h-48 rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${post.image})` }}
                    />
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Heart className="w-4 h-4 mr-2" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {post.comments}
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {activeTab === 'achievements' && (
          <>
            {/* Your Stats */}
            <Card className="bg-gradient-primary text-white shadow-medium">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Suas Conquistas</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">15</p>
                    <p className="text-sm opacity-90">Dias Consecutivos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm opacity-90">Parceiros</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">42</p>
                    <p className="text-sm opacity-90">Treinos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="shadow-soft">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">Conquistas Recentes</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Primeira Semana Completa</p>
                      <p className="text-sm text-muted-foreground">7 dias consecutivos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Primeiro Match</p>
                      <p className="text-sm text-muted-foreground">Encontrou seu parceiro ideal</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Friends' Achievements */}
            <Card className="shadow-soft">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">Conquistas dos Amigos</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${feedPosts[0].avatar})` }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">Ana Silva</p>
                      <p className="text-sm text-muted-foreground">Completou meta semanal</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Trophy className="w-3 h-3 mr-1" />
                      Nova
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${feedPosts[1].avatar})` }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">Carlos Santos</p>
                      <p className="text-sm text-muted-foreground">Streak de 30 dias</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Trophy className="w-3 h-3 mr-1" />
                      30d
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}