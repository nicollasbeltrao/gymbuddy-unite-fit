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
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background Image with dark overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fitnessHero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-4 w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center pt-12">
          <div className="flex items-center gap-3 animate-scale-in">
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-strong">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">GymBuddy</h1>
          </div>
        </div>

        {/* Animated Central Content */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="bg-card/80 backdrop-blur-xl p-8 max-w-md mx-auto shadow-strong border-border/50 rounded-2xl animate-slide-up">
            <div className="text-center space-y-6">
              <div className="h-20 flex items-center justify-center">
                <p 
                  key={animatedText}
                  className="text-lg font-medium text-card-foreground animate-fade-in leading-relaxed"
                >
                  {texts[animatedText]}
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-2 shadow-soft">
                    <Heart className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-sm text-muted-foreground">Motivação</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-2 shadow-soft">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Parceiros</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-warning/20 rounded-2xl flex items-center justify-center mb-2 shadow-soft">
                    <TrendingUp className="w-6 h-6 text-warning" />
                  </div>
                  <span className="text-sm text-muted-foreground">Resultados</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 w-full">
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-strong rounded-2xl h-12 text-lg font-medium animate-scale-in"
            onClick={() => onNavigate('register')}
          >
            Começar
          </Button>
          <Button 
            variant="outline" 
            className="w-full bg-card/50 backdrop-blur-sm border-border/50 text-card-foreground hover:bg-card hover:text-card-foreground rounded-2xl h-12 text-lg font-medium animate-scale-in"
            onClick={() => onNavigate('login')}
          >
            Já tenho conta
          </Button>
        </div>
      </div>
    </div>
  );
}