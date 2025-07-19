import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Calendar, Dumbbell, Clock, MapPin, Target, Users, MessageCircle } from "lucide-react";

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
  likedYou?: boolean; // Simula reciprocidade
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
    distance: "2.1 km",
    likedYou: true // Simula reciprocidade
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
    distance: "1.8 km",
    likedYou: false
  }
];

export function MatchScreen({ onNavigate }: MatchScreenProps) {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [showActions, setShowActions] = useState(true);
  const [swipe, setSwipe] = useState<{ dx: number; startX: number | null; isSwiping: boolean }>({ dx: 0, startX: null, isSwiping: false });
  const [likeAnimation, setLikeAnimation] = useState<null | 'left' | 'right'>(null);
  const [showMatch, setShowMatch] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [matches, setMatches] = useState<Profile[]>([]);

  const currentProfile = mockProfiles[currentProfileIndex];

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setSwipe({ dx: 0, startX: x, isSwiping: true });
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!swipe.isSwiping || swipe.startX === null) return;
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setSwipe((prev) => ({ ...prev, dx: x - (prev.startX ?? 0) }));
  };

  const handleTouchEnd = () => {
    if (!swipe.isSwiping) return;
    
    const swipeThreshold = 100; // Distância mínima para considerar um swipe válido
    
    if (swipe.dx > swipeThreshold) {
      // Right swipe (like) - SÓ mostra match se houver reciprocidade
      setLikeAnimation('right');
      
      if (currentProfile.likedYou) {
        // Match real - mostrar notificação
        setShowMatch(true);
        setMatches((prev) => [...prev, currentProfile]);
        setTimeout(() => {
          setShowMatch(false);
          nextProfile();
          setLikeAnimation(null);
        }, 1500);
      } else {
        // Apenas like - não mostrar match
        setTimeout(() => {
          nextProfile();
          setLikeAnimation(null);
        }, 400);
      }
    } else if (swipe.dx < -swipeThreshold) {
      // Left swipe (dislike) - NUNCA mostra match
      setLikeAnimation('left');
      setTimeout(() => {
        nextProfile();
        setLikeAnimation(null);
      }, 400);
    } else {
      // Swipe insuficiente - resetar posição
      setSwipe({ dx: 0, startX: null, isSwiping: false });
      return;
    }
    
    setSwipe({ dx: 0, startX: null, isSwiping: false });
  };

  const nextProfile = () => {
    setShowActions(false);
    setTimeout(() => {
      if (currentProfileIndex < mockProfiles.length - 1) {
        setCurrentProfileIndex(currentProfileIndex + 1);
      } else {
        setCurrentProfileIndex(0);
      }
      setShowActions(true);
    }, 200);
  };

  // Botão ❤️
  const handleLike = () => {
    setLikeAnimation('right');
    if (currentProfile.likedYou) {
      setShowMatch(true);
      setMatches((prev) => [...prev, currentProfile]);
      setTimeout(() => {
        setShowMatch(false);
        nextProfile();
        setLikeAnimation(null);
      }, 1000);
    } else {
      setTimeout(() => {
        nextProfile();
        setLikeAnimation(null);
      }, 350);
    }
  };

  // Botão ❌
  const handleDislike = () => {
    setLikeAnimation('left');
    setTimeout(() => {
      nextProfile();
      setLikeAnimation(null);
    }, 350);
  };

  if (!currentProfile) return null;

  // Card style for swipe
  const cardStyle = (swipe.isSwiping || likeAnimation)
    ? {
        transform: `translateX(${swipe.isSwiping ? swipe.dx : likeAnimation === 'right' ? 400 : likeAnimation === 'left' ? -400 : 0}px) rotate(${swipe.isSwiping ? swipe.dx / 20 : likeAnimation === 'right' ? 15 : likeAnimation === 'left' ? -15 : 0}deg)`,
        transition: swipe.isSwiping ? 'none' : 'transform 0.35s cubic-bezier(.68,-0.55,.27,1.55)',
        zIndex: 20,
      }
    : {};

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-soft">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">Encontrar Parceiros</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Deslize para encontrar seu match</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => onNavigate('profile')}>
          <Users className="w-5 h-5" />
        </Button>
      </div>

      {/* Match Card */}
      <div className="px-4 sm:px-6 pb-6 select-none">
        <div
          ref={cardRef}
          className="relative overflow-hidden shadow-strong max-w-sm mx-auto bg-card/80 backdrop-blur-xl border-border/50 rounded-2xl animate-slide-up touch-pan-x"
          style={cardStyle}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={e => { e.preventDefault(); handleTouchStart(e); }}
          onMouseMove={e => swipe.isSwiping && handleTouchMove(e)}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          {/* Profile Image */}
          <div 
            className="h-72 sm:h-80 bg-cover bg-center relative"
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
              <h2 className="text-xl sm:text-2xl font-bold">{currentProfile.name}, {currentProfile.age}</h2>
              <p className="text-sm text-muted-foreground">{currentProfile.gym}</p>
            </div>
            {/* Like/Dislike Animation */}
            {likeAnimation === 'right' && (
              <div className="absolute top-8 right-8 bg-primary text-primary-foreground px-4 py-2 rounded-2xl text-xl font-bold shadow-strong animate-fade-in">❤️</div>
            )}
            {likeAnimation === 'left' && (
              <div className="absolute top-8 left-8 bg-destructive text-destructive-foreground px-4 py-2 rounded-2xl text-xl font-bold shadow-strong animate-fade-in">💔</div>
            )}
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
        </div>
      </div>

      {/* Action Buttons (acessível) */}
      {showActions && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-8 px-4 w-full max-w-sm mx-auto">
          <Button
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full border-2 border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive shadow-soft flex-shrink-0"
            onClick={handleDislike}
          >
            <X className="w-6 h-6" />
          </Button>
          
          <Button
            className="w-16 h-16 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-strong flex-shrink-0"
            onClick={handleLike}
          >
            <Heart className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Match Notification (quando for um match verdadeiro) */}
      {showMatch && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xl flex items-center justify-center z-50">
          <Card className="bg-gradient-primary text-primary-foreground p-8 text-center animate-scale-in rounded-2xl shadow-strong max-w-sm mx-auto">
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">É um Match!</h2>
            <p className="mb-6">Vocês podem começar a treinar juntos</p>
            <div className="space-y-3">
              <Button 
                onClick={() => onNavigate('social')} 
                className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Iniciar Conversa
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowMatch(false)}
                className="w-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Continuar Explorando
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}