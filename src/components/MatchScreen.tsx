import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Calendar, Dumbbell, Clock, MapPin, Target, Users } from "lucide-react";

interface MatchScreenProps {
  onNavigate: (screen: string) => void;
}

interface Profile {
  id: number;
  name: string;
  age: number;
  gym: string;
  goal: string;
  schedule: string;
  experience: string;
  interests: string[];
  image: string;
  distance: string;
}

const mockProfiles: Profile[] = [
  {
    id: 1,
    name: "Ana Silva",
    age: 28,
    gym: "Smart Fit Centro",
    goal: "Ganho de Massa",
    schedule: "Manhã (7h-9h)",
    experience: "Intermediário",
    interests: ["Musculação", "Funcional", "Yoga"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    distance: "2.1 km"
  },
  {
    id: 2,
    name: "Carlos Santos",
    age: 32,
    gym: "Smart Fit Centro",
    goal: "Perda de Peso",
    schedule: "Tarde (18h-20h)",
    experience: "Iniciante",
    interests: ["Cardio", "Natação", "Crossfit"],
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    distance: "1.8 km"
  }
];

export function MatchScreen({ onNavigate }: MatchScreenProps) {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [showActions, setShowActions] = useState(true);

  const currentProfile = mockProfiles[currentProfileIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    setShowActions(false);
    setTimeout(() => {
      if (currentProfileIndex < mockProfiles.length - 1) {
        setCurrentProfileIndex(currentProfileIndex + 1);
      } else {
        setCurrentProfileIndex(0);
      }
      setShowActions(true);
    }, 300);
  };

  const handleMatch = () => {
    // Simulate match animation
    setShowActions(false);
    setTimeout(() => {
      onNavigate('schedule');
    }, 1000);
  };

  if (!currentProfile) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-soft">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Encontrar Parceiros</h1>
            <p className="text-sm text-muted-foreground">Deslize para encontrar seu match</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => onNavigate('profile')}>
          <Users className="w-5 h-5" />
        </Button>
      </div>

      {/* Match Card */}
      <div className="px-6 pb-6">
        <Card className="relative overflow-hidden shadow-strong max-w-sm mx-auto bg-card/80 backdrop-blur-xl border-border/50 rounded-2xl animate-slide-up">
          {/* Profile Image */}
          <div 
            className="h-80 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${currentProfile.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-card/90 text-card-foreground backdrop-blur-sm border-border/50">
                <MapPin className="w-3 h-3 mr-1" />
                {currentProfile.distance}
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4 text-foreground">
              <h2 className="text-2xl font-bold">{currentProfile.name}, {currentProfile.age}</h2>
              <p className="text-sm text-muted-foreground">{currentProfile.gym}</p>
            </div>
          </div>

          <CardContent className="p-6 space-y-4">
            {/* Goals & Schedule */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="w-4 h-4" />
                  Objetivo
                </div>
                <p className="font-medium text-card-foreground">{currentProfile.goal}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Horário
                </div>
                <p className="font-medium text-card-foreground">{currentProfile.schedule}</p>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Dumbbell className="w-4 h-4" />
                Experiência
              </div>
              <Badge variant="outline" className="border-border/50 text-card-foreground">{currentProfile.experience}</Badge>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Interesses</p>
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Additional Actions */}
            <div className="pt-2 space-y-2">
              <Button variant="outline" size="sm" className="w-full border-border/50 text-card-foreground hover:bg-card">
                Ver Treino Sugerido
              </Button>
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground hover:bg-card">
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Treino
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 flex gap-6">
          <Button
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full border-2 border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive shadow-soft"
            onClick={() => handleSwipe('left')}
          >
            <X className="w-6 h-6" />
          </Button>
          
          <Button
            className="w-16 h-16 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-strong"
            onClick={handleMatch}
          >
            <Heart className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Match Notification (when match happens) */}
      {!showActions && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xl flex items-center justify-center z-50">
          <Card className="bg-gradient-primary text-primary-foreground p-8 text-center animate-scale-in rounded-2xl shadow-strong">
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">É um Match!</h2>
            <p>Vocês podem começar a treinar juntos</p>
          </Card>
        </div>
      )}
    </div>
  );
}