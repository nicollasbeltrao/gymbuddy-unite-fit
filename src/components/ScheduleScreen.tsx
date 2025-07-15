import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Plus, Bell, MapPin, Dumbbell } from "lucide-react";

interface ScheduleScreenProps {
  onNavigate: (screen: string) => void;
}

interface WorkoutSession {
  id: number;
  partner: string;
  time: string;
  duration: string;
  type: string;
  gym: string;
  status: 'confirmed' | 'pending' | 'completed';
}

const upcomingSessions: WorkoutSession[] = [
  {
    id: 1,
    partner: "Ana Silva",
    time: "Hoje, 19:00",
    duration: "1h30min",
    type: "Musculação - Peito e Tríceps",
    gym: "Smart Fit Centro",
    status: 'confirmed'
  },
  {
    id: 2,
    partner: "Carlos Santos",
    time: "Amanhã, 7:00",
    duration: "1h",
    type: "Cardio e Funcional",
    gym: "Smart Fit Centro",
    status: 'pending'
  }
];

export function ScheduleScreen({ onNavigate }: ScheduleScreenProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Agenda</h1>
            <p className="text-muted-foreground">Seus treinos agendados</p>
          </div>
          <Button size="icon" className="rounded-full">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-muted rounded-lg p-1 mb-6">
          <Button
            variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('upcoming')}
          >
            Próximos
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('history')}
          >
            Histórico
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-4">
        {activeTab === 'upcoming' && (
          <>
            {/* Today's Notification */}
            <Card className="bg-gradient-accent text-white shadow-medium">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Seu parceiro está a caminho!</p>
                    <p className="text-sm opacity-90">Ana chegará em 15 minutos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            {upcomingSessions.map((session) => (
              <Card key={session.id} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{session.partner}</h3>
                        <p className="text-sm text-muted-foreground">{session.time}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={session.status === 'confirmed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {session.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Dumbbell className="w-4 h-4" />
                      {session.type}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {session.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {session.gym}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Reagendar
                    </Button>
                    <Button size="sm" className="flex-1">
                      Confirmar Presença
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Quick Actions */}
            <Card className="shadow-soft">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-3" />
                  Agendar Novo Treino
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-3" />
                  Encontrar Novos Parceiros
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-3" />
                  Configurar Lembretes
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'history' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Sem histórico ainda</h3>
            <p className="text-muted-foreground mb-6">
              Seus treinos anteriores aparecerão aqui
            </p>
            <Button onClick={() => onNavigate('match')}>
              Encontrar Parceiros
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation Hint */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('match')}
          >
            Match
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('ai-trainer')}
          >
            IA Trainer
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('social')}
          >
            Social
          </Button>
        </div>
      </div>
    </div>
  );
}