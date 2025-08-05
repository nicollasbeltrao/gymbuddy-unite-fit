import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Mic, MicOff, Play, Pause, Camera, Heart, MessageCircle, X, Clock, MapPin, Target, Users } from "lucide-react";

interface WorkoutChatProps {
  onNavigate: (screen: string) => void;
}

interface Message {
  id: number;
  text: string;
  time: string;
  isFromMe: boolean;
  status: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'audio' | 'story-reply';
  audioUrl?: string;
  audioDuration?: number;
}

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
  bio: string;
  gym: string;
  goal: string;
  schedule: string;
  stories: Story[];
}

// Dados mockados
const currentUser: User = {
  id: 0,
  name: "Você",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  online: true,
  bio: "Focado em hipertrofia e funcional! 💪",
  gym: "Smart Fit Centro",
  goal: "Ganho de Massa",
  schedule: "Manhã (7h-9h)",
  stories: []
};

const buddyUser: User = {
  id: 1,
  name: "Ana Silva",
  avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  online: true,
  lastSeen: "2 min atrás",
  bio: "Personal trainer e amante de fitness! 🏋️‍♀️",
  gym: "Smart Fit Centro",
  goal: "Ganho de Massa",
  schedule: "Manhã (7h-9h)",
  stories: [
    {
      id: 1,
      userId: 1,
      userName: "Ana Silva",
      userAvatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      mediaUrl: "https://images.unsplash.com/photo-1549476464-37392f717541",
      mediaType: 'image',
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
      mediaType: 'image',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
      expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000), // 20 horas restantes
      viewed: true,
      likes: 8,
      replies: 1
    }
  ]
};

const otherUsers: User[] = [
  {
    id: 2,
    name: "Carlos Santos",
    avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    online: false,
    lastSeen: "1h atrás",
    bio: "Crossfit lover! 🔥",
    gym: "Smart Fit Centro",
    goal: "Perda de Peso",
    schedule: "Tarde (18h-20h)",
    stories: [
      {
        id: 3,
        userId: 2,
        userName: "Carlos Santos",
        userAvatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
        mediaUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        mediaType: 'image',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
        expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23 horas restantes
        viewed: false,
        likes: 5,
        replies: 2
      }
    ]
  }
];

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Oi! Vi que você também treina no Smart Fit Centro 😊",
    time: "14:25",
    isFromMe: false,
    status: 'read'
  },
  {
    id: 2,
    text: "Oi Ana! Sim, treino lá há 6 meses. Que legal encontrar alguém com objetivos similares!",
    time: "14:27",
    isFromMe: true,
    status: 'read'
  },
  {
    id: 3,
    text: "Que tal treinarmos juntos amanhã às 7h?",
    time: "14:30",
    isFromMe: false,
    status: 'delivered'
  }
];

export function WorkoutChat({ onNavigate }: WorkoutChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showStoryReply, setShowStoryReply] = useState(false);
  const [storyReplyText, setStoryReplyText] = useState('');
  const [activeStoryId, setActiveStoryId] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});
  const storyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const allStories = [buddyUser, ...otherUsers].flatMap(user => user.stories);
  const unviewedStories = allStories.filter(story => !story.viewed);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Timer para gravação
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  // Timer para stories (auto-advance)
  useEffect(() => {
    if (showStoryViewer && allStories.length > 0) {
      storyTimerRef.current = setTimeout(() => {
        if (currentStoryIndex < allStories.length - 1) {
          setCurrentStoryIndex(prev => prev + 1);
        } else {
          setShowStoryViewer(false);
          setCurrentStoryIndex(0);
        }
      }, 5000); // 5 segundos por story
    }

    return () => {
      if (storyTimerRef.current) {
        clearTimeout(storyTimerRef.current);
      }
    };
  }, [showStoryViewer, currentStoryIndex, allStories.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now(),
        text: newMessage,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isFromMe: true,
        status: 'sent'
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simula resposta automática após 2 segundos
      setTimeout(() => {
        const reply: Message = {
          id: Date.now() + 1,
          text: "Perfeito! Vou estar lá às 7h. Qual exercício você gostaria de começar?",
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isFromMe: false,
          status: 'sent'
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audioMessage: Message = {
          id: Date.now(),
          text: "Mensagem de áudio",
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isFromMe: true,
          status: 'sent',
          type: 'audio',
          audioUrl,
          audioDuration: recordingTime
        };
        
        setMessages(prev => [...prev, audioMessage]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioPlay = (messageId: number, audioUrl: string) => {
    if (playingAudio === messageId) {
      if (audioRefs.current[messageId]) {
        audioRefs.current[messageId].pause();
      }
      setPlayingAudio(null);
    } else {
      if (playingAudio && audioRefs.current[playingAudio]) {
        audioRefs.current[playingAudio].pause();
      }
      
      if (audioRefs.current[messageId]) {
        audioRefs.current[messageId].play();
        setPlayingAudio(messageId);
        
        audioRefs.current[messageId].onended = () => {
          setPlayingAudio(null);
        };
      }
    }
  };

  const openStoryViewer = (storyIndex: number) => {
    setCurrentStoryIndex(storyIndex);
    setShowStoryViewer(true);
    // Marcar story como visualizado
    const story = allStories[storyIndex];
    if (story && !story.viewed) {
      story.viewed = true;
    }
  };

  const handleStoryReply = () => {
    if (storyReplyText.trim() && activeStoryId) {
      const replyMessage: Message = {
        id: Date.now(),
        text: `💬 Resposta ao story: ${storyReplyText}`,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isFromMe: true,
        status: 'sent',
        type: 'story-reply'
      };
      setMessages(prev => [...prev, replyMessage]);
      setStoryReplyText('');
      setShowStoryReply(false);
      setActiveStoryId(null);
    }
  };

  const handleStoryLike = (storyId: number) => {
    const story = allStories.find(s => s.id === storyId);
    if (story) {
      story.likes += 1;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Stories Carousel */}
      <div className="p-4 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {/* Botão Adicionar Story */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-white">+</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Adicionar</span>
          </div>

          {/* Stories dos usuários */}
          {[buddyUser, ...otherUsers].map((user) => (
            <div key={user.id} className="flex flex-col items-center gap-1 flex-shrink-0">
              <div 
                className={`relative cursor-pointer hover:scale-105 transition-transform ${
                  user.stories.some(s => !s.viewed) 
                    ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-background' 
                    : ''
                }`}
                onClick={() => user.stories.length > 0 && openStoryViewer(user.stories.findIndex(s => !s.viewed) >= 0 ? user.stories.findIndex(s => !s.viewed) : 0)}
              >
                <div 
                  className="w-14 h-14 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${user.avatar})` }}
                />
                {user.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <span className="text-xs text-muted-foreground truncate max-w-14">{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <Button variant="ghost" size="icon" onClick={() => onNavigate('match')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div 
          className="w-10 h-10 rounded-full bg-cover bg-center relative cursor-pointer hover:scale-105 transition-transform"
          style={{ backgroundImage: `url(${buddyUser.avatar})` }}
          onClick={() => setShowProfileModal(true)}
        >
          {buddyUser.online && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{buddyUser.name}</h3>
          <p className="text-sm text-muted-foreground">
            {buddyUser.online ? 'Online' : `Visto por último ${buddyUser.lastSeen}`} • {buddyUser.gym}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
        >
          <Camera className="w-4 h-4 mr-1" />
          Story
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.isFromMe
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-muted text-foreground rounded-bl-md'
              }`}
            >
              {message.type === 'audio' ? (
                <div className="flex items-center gap-3 min-w-[200px]">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 h-10 w-10 rounded-full bg-background/20 hover:bg-background/30"
                    onClick={() => message.audioUrl && handleAudioPlay(message.id, message.audioUrl)}
                  >
                    {playingAudio === message.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <div className="bg-background/20 rounded-full h-2 mb-1">
                      <div 
                        className="bg-current h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: playingAudio === message.id ? '60%' : '0%' 
                        }}
                      />
                    </div>
                    <span className="text-xs opacity-80">
                      {message.audioDuration ? formatTime(message.audioDuration) : '0:00'}
                    </span>
                  </div>
                  <audio
                    ref={(el) => {
                      if (el) audioRefs.current[message.id] = el;
                    }}
                    src={message.audioUrl}
                    preload="metadata"
                  />
                </div>
              ) : (
                <p className="text-sm">{message.text}</p>
              )}
              <p className={`text-xs mt-1 ${
                message.isFromMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                {message.time}
                {message.isFromMe && (
                  <span className="ml-2">
                    {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓'}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="px-4 py-2 bg-red-600/20 border-t border-red-600/30">
          <div className="flex items-center justify-center gap-2 text-red-600">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Gravando... {formatTime(recordingTime)}</span>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 rounded-full border-border/50 bg-background focus:ring-2 focus:ring-primary/50"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="sentences"
          />
          <Button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            size="icon"
            variant={isRecording ? "destructive" : "outline"}
            className={`rounded-full transition-all duration-200 ${
              isRecording 
                ? 'bg-red-600 text-white scale-110' 
                : 'border-border/50 hover:bg-primary/10 hover:border-primary/30'
            }`}
            disabled={isRecording}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <Card className="bg-card/90 backdrop-blur-xl border-border/50 max-w-sm w-full animate-scale-in rounded-2xl shadow-strong">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Perfil</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowProfileModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="text-center mb-6">
                <div 
                  className="w-24 h-24 rounded-full bg-cover bg-center mx-auto mb-4"
                  style={{ backgroundImage: `url(${buddyUser.avatar})` }}
                />
                <h3 className="text-lg font-semibold">{buddyUser.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{buddyUser.bio}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {buddyUser.gym}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Target className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Objetivo</p>
                    <p className="text-sm text-muted-foreground">{buddyUser.goal}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Horário</p>
                    <p className="text-sm text-muted-foreground">{buddyUser.schedule}</p>
                  </div>
                </div>
              </div>

              {/* Stories do usuário */}
              {buddyUser.stories.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Stories</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {buddyUser.stories.map((story, index) => (
                      <div 
                        key={story.id}
                        className="relative cursor-pointer group"
                        onClick={() => {
                          setShowProfileModal(false);
                          setTimeout(() => openStoryViewer(index), 300);
                        }}
                      >
                        <div 
                          className="aspect-square rounded-lg bg-cover bg-center"
                          style={{ backgroundImage: `url(${story.mediaUrl})` }}
                        />
                        <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Story Viewer */}
      {showStoryViewer && allStories.length > 0 && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Story Header */}
          <div className="flex items-center justify-between p-4 text-white">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${allStories[currentStoryIndex]?.userAvatar})` }}
              />
              <div>
                <p className="font-semibold">{allStories[currentStoryIndex]?.userName}</p>
                <p className="text-sm opacity-80">
                  {Math.floor((allStories[currentStoryIndex]?.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))}h restantes
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowStoryViewer(false)}>
              <X className="w-5 h-5 text-white" />
            </Button>
          </div>

          {/* Story Content */}
          <div className="flex-1 relative">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${allStories[currentStoryIndex]?.mediaUrl})` }}
            />
            
            {/* Story Actions */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="bg-black/50 text-white hover:bg-black/70"
                onClick={() => {
                  handleStoryLike(allStories[currentStoryIndex]?.id || 0);
                  setActiveStoryId(allStories[currentStoryIndex]?.id || null);
                  setShowStoryReply(true);
                }}
              >
                <Heart className="w-4 h-4 mr-1" />
                {allStories[currentStoryIndex]?.likes || 0}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="bg-black/50 text-white hover:bg-black/70"
                onClick={() => {
                  setActiveStoryId(allStories[currentStoryIndex]?.id || null);
                  setShowStoryReply(true);
                }}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Responder
              </Button>
            </div>

            {/* Story Progress */}
            <div className="absolute top-4 left-4 right-4 flex gap-1">
              {allStories.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentStoryIndex 
                      ? 'bg-white' 
                      : index < currentStoryIndex 
                        ? 'bg-white/50' 
                        : 'bg-white/20'
                  }`}
                  style={{ 
                    flex: index === currentStoryIndex ? 1 : 0.1,
                    transition: 'flex 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Story Reply Input */}
          {showStoryReply && (
            <div className="p-4 bg-black/80">
              <div className="flex gap-2">
                <Input
                  value={storyReplyText}
                  onChange={(e) => setStoryReplyText(e.target.value)}
                  placeholder="Responder ao story..."
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  onKeyPress={(e) => e.key === 'Enter' && handleStoryReply()}
                />
                <Button 
                  onClick={handleStoryReply}
                  disabled={!storyReplyText.trim()}
                  className="bg-primary text-primary-foreground"
                >
                  Enviar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 