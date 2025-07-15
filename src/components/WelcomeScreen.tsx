import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Heart, TrendingUp } from "lucide-react";
import fitnessHero from "@/assets/fitness-hero-bg.jpg";

interface WelcomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  const [animatedText, setAnimatedText] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedText((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const texts = [
    "Você sabia?",
    "79% das pessoas que treinam em dupla mantêm o hábito por mais de 6 meses.",
    "Com GymBuddy, você encontra seu parceiro de treino ideal, com segurança e motivação."
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fitnessHero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-6">
        {/* Header */}
        <div className="flex items-center justify-center pt-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-strong">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">GymBuddy</h1>
          </div>
        </div>

        {/* Animated Central Content */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="bg-white/90 backdrop-blur-sm p-8 max-w-md mx-auto shadow-strong">
            <div className="text-center space-y-6">
              <div className="h-20 flex items-center justify-center">
                <p 
                  key={animatedText}
                  className="text-lg font-medium text-foreground animate-fade-in leading-relaxed"
                >
                  {texts[animatedText]}
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                    <Heart className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-sm text-muted-foreground">Motivação</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Parceiros</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mb-2">
                    <TrendingUp className="w-6 h-6 text-warning" />
                  </div>
                  <span className="text-sm text-muted-foreground">Resultados</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full"
            onClick={() => onNavigate('register')}
          >
            Começar
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-foreground"
            onClick={() => onNavigate('login')}
          >
            Já tenho conta
          </Button>
        </div>
      </div>
    </div>
  );
}