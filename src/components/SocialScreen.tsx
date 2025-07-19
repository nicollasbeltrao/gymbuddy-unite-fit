import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Share, Trophy, Camera, MapPin, Clock, Send, ArrowLeft, Phone, Calendar, Mic, MicOff, Play, Pause } from "lucide-react";

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

interface Conversation {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string;
    online: boolean;
  };
  lastMessage: {
    text: string;
    time: string;
    isFromMe: boolean;
    unread: boolean;
  };
  matchDate: string;
}

interface Message {
  id: number;
  text: string;
  time: string;
  isFromMe: boolean;
  status: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'audio' | 'schedule';
  audioUrl?: string;
  audioDuration?: number;
  scheduleData?: {
    date: string;
    time: string;
    confirmed?: boolean;
  };
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

// Simula conversas de usuários que deram match
const conversations: Conversation[] = [
  {
    id: 1,
    user: {
      id: 1,
      name: "Ana Silva",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      online: true
    },
    lastMessage: {
      text: "Que tal treinarmos juntos amanhã às 7h?",
      time: "14:30",
      isFromMe: false,
      unread: true
    },
    matchDate: "2024-01-15"
  },
  {
    id: 2,
    user: {
      id: 2,
      name: "Carlos Santos",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      online: false
    },
    lastMessage: {
      text: "Perfeito! Vou estar lá",
      time: "12:15",
      isFromMe: true,
      unread: false
    },
    matchDate: "2024-01-10"
  }
];

// Simula mensagens de uma conversa
const mockMessages: Message[] = [
  {
    id: 1,
    text: "Oi! Vi que você também treina no Smart Fit Centro",
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

// Horários disponíveis para agendamento
const availableTimes = [
  "07:00 - 08:00",
  "08:00 - 09:00", 
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00"
];

// Próximas datas disponíveis
const getAvailableDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

export function SocialScreen({ onNavigate }: SocialScreenProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'achievements' | 'conversations'>('feed');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleStep, setScheduleStep] = useState<'date' | 'time' | 'confirm'>('date');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});

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
          text: "Perfeito! Vou estar lá",
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
      // Pausar áudio atual
      if (audioRefs.current[messageId]) {
        audioRefs.current[messageId].pause();
      }
      setPlayingAudio(null);
    } else {
      // Parar áudio anterior se estiver tocando
      if (playingAudio && audioRefs.current[playingAudio]) {
        audioRefs.current[playingAudio].pause();
      }
      
      // Tocar novo áudio
      if (audioRefs.current[messageId]) {
        audioRefs.current[messageId].play();
        setPlayingAudio(messageId);
        
        // Resetar quando o áudio terminar
        audioRefs.current[messageId].onended = () => {
          setPlayingAudio(null);
        };
      }
    }
  };

  const openConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    conversation.lastMessage.unread = false;
  };

  const closeConversation = () => {
    setSelectedConversation(null);
    setShowSchedule(false);
    setScheduleStep('date');
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleScheduleWorkout = () => {
    setShowSchedule(true);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setScheduleStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setScheduleStep('confirm');
  };

  const handleConfirmSchedule = () => {
    const scheduleMessage: Message = {
      id: Date.now(),
      text: `📅 ${selectedConversation?.user.name} agendou um treino com você para ${new Date(selectedDate).toLocaleDateString('pt-BR')} às ${selectedTime}.`,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isFromMe: true,
      status: 'sent',
      type: 'schedule',
      scheduleData: {
        date: selectedDate,
        time: selectedTime,
        confirmed: false
      }
    };
    
    setMessages(prev => [...prev, scheduleMessage]);
    setShowSchedule(false);
    setScheduleStep('date');
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleScheduleResponse = (messageId: number, confirmed: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, scheduleData: { ...msg.scheduleData!, confirmed } }
        : msg
    ));
  };

  // Renderiza a tela de chat individual
  if (selectedConversation) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-card/80 backdrop-blur-xl">
          <Button variant="ghost" size="icon" onClick={closeConversation}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div 
            className="w-10 h-10 rounded-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${selectedConversation.user.avatar})` }}
          >
            {selectedConversation.user.online && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{selectedConversation.user.name}</h3>
            <p className="text-sm text-muted-foreground">
              {selectedConversation.user.online ? 'Online' : 'Offline'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleScheduleWorkout}
              className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Agendar Treino
            </Button>
          </div>
        </div>

        {/* Schedule Modal */}
        {showSchedule && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-xl flex items-center justify-center z-50">
            <Card className="bg-card/90 backdrop-blur-xl border-border/50 p-6 max-w-sm mx-4 animate-scale-in rounded-2xl shadow-strong">
              <div className="text-center mb-6">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Agendar Treino</h3>
                <p className="text-sm text-muted-foreground">
                  {scheduleStep === 'date' && 'Escolha uma data'}
                  {scheduleStep === 'time' && 'Escolha um horário'}
                  {scheduleStep === 'confirm' && 'Confirme o agendamento'}
                </p>
              </div>

              {scheduleStep === 'date' && (
                <div className="space-y-3">
                  {getAvailableDates().map((date) => (
                    <Button
                      key={date}
                      variant="outline"
                      className="w-full justify-start border-border/50 hover:bg-primary/10"
                      onClick={() => handleDateSelect(date)}
                    >
                      {new Date(date).toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </Button>
                  ))}
                </div>
              )}

              {scheduleStep === 'time' && (
                <div className="space-y-3">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      className="w-full justify-start border-border/50 hover:bg-primary/10"
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              )}

              {scheduleStep === 'confirm' && (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Data e Horário</p>
                    <p className="font-semibold">
                      {new Date(selectedDate).toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </p>
                    <p className="font-semibold">{selectedTime}</p>
                  </div>
                  <Button 
                    onClick={handleConfirmSchedule}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                  >
                    Confirmar Agendamento
                  </Button>
                </div>
              )}

              <Button 
                variant="ghost" 
                onClick={() => setShowSchedule(false)}
                className="w-full mt-3"
              >
                Cancelar
              </Button>
            </Card>
          </div>
        )}

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
                ) : message.type === 'schedule' ? (
                  <div className="space-y-3">
                    <p className="text-sm">{message.text}</p>
                    {!message.scheduleData?.confirmed && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleScheduleResponse(message.id, true)}
                        >
                          ✅ Confirmar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-border/50"
                          onClick={() => handleScheduleResponse(message.id, false)}
                        >
                          🔄 Reagendar
                        </Button>
                      </div>
                    )}
                    {message.scheduleData?.confirmed && (
                      <Badge variant="secondary" className="text-xs">
                        ✅ Confirmado
                      </Badge>
                    )}
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
      </div>
    );
  }

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
            variant={activeTab === 'conversations' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('conversations')}
          >
            Conversas
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

        {activeTab === 'conversations' && (
          <>
            {/* Conversations Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Conversas</h3>
              <p className="text-sm text-muted-foreground">
                {conversations.length} conversa{conversations.length !== 1 ? 's' : ''} ativa{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Conversations List */}
            {conversations.length > 0 ? (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <Card 
                    key={conversation.id} 
                    className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer"
                    onClick={() => openConversation(conversation)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div 
                            className="w-12 h-12 rounded-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${conversation.user.avatar})` }}
                          />
                          {conversation.user.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold truncate">{conversation.user.name}</h4>
                            <span className="text-xs text-muted-foreground">{conversation.lastMessage.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className={`text-sm truncate ${conversation.lastMessage.unread ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                              {conversation.lastMessage.isFromMe ? 'Você: ' : ''}{conversation.lastMessage.text}
                            </p>
                            {conversation.lastMessage.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-soft">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Nenhuma conversa ainda</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Faça matches para começar conversas com seus parceiros de treino
                  </p>
                  <Button onClick={() => onNavigate('match')} className="bg-primary text-primary-foreground">
                    Encontrar Parceiros
                  </Button>
                </CardContent>
              </Card>
            )}
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