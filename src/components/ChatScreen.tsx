import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Mic, MicOff, Play, Pause, Calendar } from "lucide-react";

interface ChatScreenProps {
  onNavigate: (screen: string) => void;
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

// Dados da pessoa que deu match (Ana Silva)
const matchPerson = {
  id: 1,
  name: "Ana Silva",
  avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  online: true,
  gym: "Smart Fit Centro",
  goal: "Ganho de Massa",
  schedule: "Manhã (7h-9h)"
};

// Mensagens iniciais da conversa
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

export function ChatScreen({ onNavigate }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <Button variant="ghost" size="icon" onClick={() => onNavigate('match')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div 
          className="w-10 h-10 rounded-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${matchPerson.avatar})` }}
        >
          {matchPerson.online && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{matchPerson.name}</h3>
          <p className="text-sm text-muted-foreground">
            {matchPerson.online ? 'Online' : 'Offline'} • {matchPerson.gym}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
        >
          <Calendar className="w-4 h-4 mr-1" />
          Agendar
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
    </div>
  );
} 