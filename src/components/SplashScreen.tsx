import { useState, useEffect } from "react";
import { Users } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [logoScale, setLogoScale] = useState(0.8);
  const [logoOpacity, setLogoOpacity] = useState(0);

  useEffect(() => {
    // Animação de entrada
    const enterTimer = setTimeout(() => {
      setLogoScale(1);
      setLogoOpacity(1);
    }, 100);

    // Animação de saída após 3 segundos
    const exitTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    // Chama onComplete após a animação de saída
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-background flex items-center justify-center z-50 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      {/* Logo container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo icon */}
        <div 
          className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-strong mb-6 transition-all duration-1000 ease-out"
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
          }}
        >
          <Users className="w-12 h-12 text-primary-foreground" />
        </div>
        
        {/* App name */}
        <h1 
          className="text-4xl font-bold text-foreground mb-2 transition-all duration-1000 ease-out delay-200"
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
          }}
        >
                          WorkoutBuddy
        </h1>
        
        {/* Tagline */}
        <p 
          className="text-lg text-muted-foreground transition-all duration-1000 ease-out delay-400"
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
          }}
        >
          Treine junto, evolua junto
        </p>
      </div>

      {/* Subtle animation dots */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse-slow" />
        <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse-slow" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse-slow" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
} 