import { useState, useRef } from "react";
import { Camera, Play, Heart, MessageCircle, X, Upload, Image, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";

interface Story {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  duration?: number;
  timestamp: Date;
  expiresAt: Date;
  viewed: boolean;
  likes: number;
  replies: number;
}

interface User {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  lastSeen?: string;
  stories: Story[];
}

interface StoriesCarouselProps {
  users: User[];
  onStoryView?: (story: Story) => void;
  onAddStory?: () => void;
}

export function StoriesCarousel({ users, onStoryView, onAddStory }: StoriesCarouselProps) {
  const { theme } = useTheme();
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [storyReplyText, setStoryReplyText] = useState('');
  const [showStoryReply, setShowStoryReply] = useState(false);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtrar usuários que têm stories não expirados
  const usersWithStories = users.filter(user => 
    user.stories.some(story => story.expiresAt > new Date())
  );

  const openStory = (story: Story) => {
    setCurrentStory(story);
    setShowStoryViewer(true);
    if (onStoryView) {
      onStoryView(story);
    }
  };

  const closeStory = () => {
    setShowStoryViewer(false);
    setCurrentStory(null);
    setStoryReplyText('');
    setShowStoryReply(false);
  };

  const handleStoryReply = () => {
    if (storyReplyText.trim() && currentStory) {
      // Aqui você pode implementar a lógica para enviar a resposta
      console.log('Resposta ao story:', storyReplyText);
      setStoryReplyText('');
      setShowStoryReply(false);
    }
  };

  const handleStoryLike = () => {
    if (currentStory) {
      currentStory.likes += 1;
      // Aqui você pode implementar a lógica para salvar o like
    }
  };

  const handleAddStoryClick = () => {
    setShowAddStoryModal(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleUploadStory(file);
    }
  };

  const handleUploadStory = async (file: File) => {
    setIsUploading(true);
    
    try {
      // Simular upload - em produção, aqui você faria o upload real
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Criar novo story
      const newStory: Story = {
        id: Date.now(),
        userId: 0, // ID do usuário atual
        userName: "Você",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        mediaUrl: URL.createObjectURL(file),
        mediaType: file.type.startsWith('video/') ? 'video' : 'image',
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        viewed: false,
        likes: 0,
        replies: 0
      };

      // Adicionar à lista de stories (em produção, isso seria feito via API)
      console.log('Novo story criado:', newStory);
      
      // Fechar modal e resetar estado
      setShowAddStoryModal(false);
      setSelectedFile(null);
      setIsUploading(false);
      
      // Chamar callback se fornecido
      if (onAddStory) {
        onAddStory();
      }
      
    } catch (error) {
      console.error('Erro ao fazer upload do story:', error);
      setIsUploading(false);
    }
  };

  const openCamera = () => {
    // Em produção, aqui você implementaria a funcionalidade da câmera
    console.log('Abrindo câmera...');
    alert('Funcionalidade da câmera será implementada em produção');
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const getRingColor = (hasNewStory: boolean) => {
    if (theme === 'dark') {
      return hasNewStory ? 'ring-yellow-400' : 'ring-white/10';
    } else {
      return hasNewStory ? 'ring-yellow-400' : 'ring-gray-200';
    }
  };

  return (
    <>
      {/* Stories Carousel */}
      <div className="p-4 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {/* Botão Adicionar Story */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="relative">
              <div 
                className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-medium"
                onClick={handleAddStoryClick}
              >
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">+</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground font-medium">Adicionar</span>
          </div>

          {/* Stories dos usuários */}
          {usersWithStories.map((user) => {
            const unviewedStories = user.stories.filter(story => 
              !story.viewed && story.expiresAt > new Date()
            );
            const hasNewStory = unviewedStories.length > 0;
            const latestStory = user.stories
              .filter(story => story.expiresAt > new Date())
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

            return (
              <div key={user.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                <div 
                  className={`relative cursor-pointer hover:scale-105 transition-transform rounded-full ${
                    hasNewStory 
                      ? `ring-2 ${getRingColor(true)} ring-offset-2 ring-offset-background` 
                      : `ring-2 ${getRingColor(false)} ring-offset-2 ring-offset-background`
                  }`}
                  onClick={() => latestStory && openStory(latestStory)}
                  style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
                >
                  <div 
                    className="w-14 h-14 rounded-full bg-cover bg-center story-avatar"
                    style={{ 
                      backgroundImage: `url(${user.avatar})`
                    }}
                  />
                  {user.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                  {hasNewStory && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-14 font-medium">
                  {user.name}
                </span>
                {latestStory && (
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(latestStory.timestamp)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Story Viewer */}
      {showStoryViewer && currentStory && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Story Header */}
          <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${currentStory.userAvatar})` }}
              />
              <div>
                <p className="font-semibold text-white">{currentStory.userName}</p>
                <p className="text-xs text-white/70">
                  {Math.floor((currentStory.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))}h restantes
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={closeStory} className="text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Story Content */}
          <div className="flex-1 relative">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${currentStory.mediaUrl})` }}
            />
            
            {/* Story Actions */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="bg-white/20 text-white hover:bg-white/30"
                onClick={handleStoryLike}
              >
                <Heart className="w-4 h-4 mr-1" />
                {currentStory.likes}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="bg-white/20 text-white hover:bg-white/30"
                onClick={() => setShowStoryReply(true)}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {currentStory.replies}
              </Button>
            </div>
          </div>

          {/* Story Reply Input */}
          {showStoryReply && (
            <div className="p-4 bg-black/50 backdrop-blur-xl">
              <div className="flex gap-2">
                <Input
                  value={storyReplyText}
                  onChange={(e) => setStoryReplyText(e.target.value)}
                  placeholder="Responder ao story..."
                  className="flex-1 bg-white/20 text-white placeholder:text-white/70 border-white/20"
                  onKeyPress={(e) => e.key === 'Enter' && handleStoryReply()}
                />
                <Button 
                  onClick={handleStoryReply}
                  disabled={!storyReplyText.trim()}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  Enviar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Adicionar Story */}
      {showAddStoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card rounded-2xl p-6 w-80 max-w-[90vw] shadow-strong">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-foreground">Adicionar Story</h3>
              <p className="text-sm text-muted-foreground">Escolha como criar seu story</p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={openCamera}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isUploading}
              >
                <Camera className="w-5 h-5 mr-2" />
                Tirar Foto / Vídeo
              </Button>
              
              <Button 
                onClick={openGallery}
                variant="outline"
                className="w-full h-12"
                disabled={isUploading}
              >
                <Image className="w-5 h-5 mr-2" />
                Escolher da Galeria
              </Button>
            </div>
            
            <div className="mt-6 flex gap-2">
              <Button 
                variant="ghost" 
                onClick={() => setShowAddStoryModal(false)}
                className="flex-1"
                disabled={isUploading}
              >
                Cancelar
              </Button>
            </div>

            {isUploading && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Enviando story...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  );
} 