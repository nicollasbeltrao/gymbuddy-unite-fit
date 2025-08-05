import { useState, useEffect } from "react";
import { Loader2, Dumbbell, Users, Target } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const loadingMessages = [
    "Carregando seus dados de treino...",
    "Conectando com parceiros próximos...",
    "Preparando treinos personalizados...",
    "Sincronizando suas conquistas...",
            "Tudo pronto! Bem-vindo ao WorkoutBuddy!"
  ];

  useEffect(() => {
    // Simula carregamento de 5 segundos
    const totalDuration = 5000; // 5 segundos
    const interval = 50; // Atualiza a cada 50ms
    const steps = totalDuration / interval;
    const progressIncrement = 100 / steps;

    let currentStep = 0;
    const progressTimer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(currentStep * progressIncrement, 100);
      setProgress(newProgress);

      // Atualiza mensagens baseado no progresso
      const messageIndex = Math.floor((newProgress / 100) * (loadingMessages.length - 1));
      setCurrentMessage(Math.min(messageIndex, loadingMessages.length - 1));

      if (newProgress >= 100) {
        clearInterval(progressTimer);
        // Aguarda um pouco antes de completar
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            onComplete();
          }, 500);
        }, 500);
      }
    }, interval);

    return () => {
      clearInterval(progressTimer);
    };
  }, [onComplete, loadingMessages.length]);

  return (
    <div 
      className={`fixed inset-0 bg-background flex items-center justify-center z-50 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto px-6">
        {/* Animated icon */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-strong mb-4">
            <Dumbbell className="w-10 h-10 text-primary-foreground" />
          </div>
          
          {/* Rotating ring */}
          <div className="absolute inset-0 w-20 h-20 border-4 border-primary/20 rounded-3xl animate-spin-slow" />
          <div className="absolute inset-2 w-16 h-16 border-2 border-primary/40 rounded-2xl animate-spin-slow" style={{ animationDirection: 'reverse' }} />
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs mb-6">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>0%</span>
            <span>{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Loading message */}
        <div className="text-center mb-8">
          <p className="text-lg font-medium text-foreground mb-2">
            {loadingMessages[currentMessage]}
          </p>
          <p className="text-sm text-muted-foreground">
            Isso pode levar alguns segundos...
          </p>
        </div>

        {/* Feature icons */}
        <div className="flex items-center justify-center space-x-6">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Parceiros</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-accent/20 rounded-xl flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-accent" />
            </div>
            <span className="text-xs text-muted-foreground">Metas</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-warning/20 rounded-xl flex items-center justify-center mb-1">
              <Dumbbell className="w-4 h-4 text-warning" />
            </div>
            <span className="text-xs text-muted-foreground">Treinos</span>
          </div>
        </div>
      </div>

      {/* Bottom loading indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
        <span className="text-sm text-muted-foreground">Preparando experiência personalizada...</span>
      </div>
    </div>
  );
} 