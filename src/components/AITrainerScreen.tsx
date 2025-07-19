import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Settings, Play, Pause, RotateCcw, History, Users } from "lucide-react";

interface AITrainerScreenProps {
  onNavigate: (screen: string) => void;
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  tips: string;
}

const currentWorkout: Exercise[] = [
  {
    name: "Supino Reto com Parceiro",
    sets: 4,
    reps: "8-12",
    rest: "90s",
    tips: "Seu parceiro deve dar apoio na barra. Mantenha controle total do movimento."
  },
  {
    name: "Supino Inclinado Alternado",
    sets: 3,
    reps: "10-15",
    rest: "60s",
    tips: "Um faz enquanto o outro descansa. Foquem na forma correta."
  },
  {
    name: "Flexão com Aplausos em Dupla",
    sets: 3,
    reps: "6-10",
    rest: "75s",
    tips: "Exercício divertido para fazer juntos. Mantenham sincronia."
  }
];

export function AITrainerScreen({ onNavigate }: AITrainerScreenProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [showWorkoutSuggestion, setShowWorkoutSuggestion] = useState(false);

  const exercise = currentWorkout[currentExercise];

  const handleViewWorkoutSuggestion = () => {
    setShowWorkoutSuggestion(true);
    // Simular carregamento do treino sugerido
    setTimeout(() => {
      setShowWorkoutSuggestion(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">IA Trainer</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Treino personalizado em dupla</p>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Workout Info */}
        <Card className="bg-gradient-primary text-primary-foreground shadow-medium mb-6 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Peito e Tríceps - Dupla</h3>
                <p className="text-xs sm:text-sm opacity-90">45-60 minutos • Intermediário</p>
              </div>
              <div className="text-right">
                <p className="text-xs sm:text-sm opacity-90">Progresso</p>
                <p className="text-base sm:text-lg font-bold">{currentExercise + 1}/{currentWorkout.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Avatar Video Area */}
      <div className="px-4 sm:px-6 mb-6">
        <Card className="overflow-hidden shadow-strong bg-card/80 backdrop-blur-xl border-border/50 rounded-2xl">
          <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 h-56 sm:h-64 flex items-center justify-center">
            {/* AI Avatar Placeholder */}
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">IA Coach Personal</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                Demonstrando: {exercise.name}
              </p>
              
              {/* Play Controls */}
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-border/50 text-card-foreground hover:bg-card"
                  onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                  disabled={currentExercise === 0}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                
                <Button
                  size="icon"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-strong"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="border-border/50 text-card-foreground hover:bg-card"
                  onClick={() => setCurrentExercise(Math.min(currentWorkout.length - 1, currentExercise + 1))}
                  disabled={currentExercise === currentWorkout.length - 1}
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Exercise Details */}
      <div className="px-4 sm:px-6 space-y-4">
        <Card className="shadow-soft bg-card/80 backdrop-blur-xl border-border/50 rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg text-card-foreground">{exercise.name}</CardTitle>
              <Badge variant="outline" className="border-border/50 text-card-foreground">
                Série {currentSet}/{exercise.sets}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-primary">{exercise.sets}</p>
                <p className="text-xs text-muted-foreground">Séries</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-primary">{exercise.reps}</p>
                <p className="text-xs text-muted-foreground">Repetições</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-primary">{exercise.rest}</p>
                <p className="text-xs text-muted-foreground">Descanso</p>
              </div>
            </div>
            
            <div className="p-3 bg-accent/20 rounded-2xl border border-accent/30">
              <p className="text-xs sm:text-sm font-medium text-accent mb-1">💡 Dica do IA Coach:</p>
              <p className="text-xs sm:text-sm text-card-foreground">{exercise.tips}</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline"
            className="border-border/50 text-card-foreground hover:bg-card text-sm"
            onClick={() => setCurrentSet(Math.min(exercise.sets, currentSet + 1))}
          >
            Próxima Série
          </Button>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary-hover shadow-strong text-sm"
            onClick={handleViewWorkoutSuggestion}
          >
            {showWorkoutSuggestion ? 'Carregando...' : 'Ver Treino Sugerido'}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-3 text-muted-foreground hover:text-foreground hover:bg-card">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs">Adaptar</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-col gap-1 h-auto py-3 text-muted-foreground hover:text-foreground hover:bg-card"
            onClick={() => onNavigate('history')}
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs">Histórico</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-col gap-1 h-auto py-3 text-muted-foreground hover:text-foreground hover:bg-card"
            onClick={() => onNavigate('social')}
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs">Compartilhar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}