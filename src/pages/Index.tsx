import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { RegisterScreen } from "@/components/RegisterScreen";
import { MatchScreen } from "@/components/MatchScreen";
import { ScheduleScreen } from "@/components/ScheduleScreen";
import { AITrainerScreen } from "@/components/AITrainerScreen";
import { SocialScreen } from "@/components/SocialScreen";
import { RewardsScreen } from "@/components/RewardsScreen";
import { GymsScreen } from "@/components/GymsScreen";
import { Button } from "@/components/ui/button";
import { Home, Users, Calendar, Brain, MessageSquare, Trophy, MapPin } from "lucide-react";

type Screen = 'welcome' | 'register' | 'login' | 'match' | 'schedule' | 'ai-trainer' | 'social' | 'rewards' | 'gyms' | 'profile' | 'history';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onNavigate={navigate} />;
      case 'register':
        return <RegisterScreen onNavigate={navigate} />;
      case 'match':
        return <MatchScreen onNavigate={navigate} />;
      case 'schedule':
        return <ScheduleScreen onNavigate={navigate} />;
      case 'ai-trainer':
        return <AITrainerScreen onNavigate={navigate} />;
      case 'social':
        return <SocialScreen onNavigate={navigate} />;
      case 'rewards':
        return <RewardsScreen onNavigate={navigate} />;
      case 'gyms':
        return <GymsScreen onNavigate={navigate} />;
      default:
        return <WelcomeScreen onNavigate={navigate} />;
    }
  };

  const showBottomNav = !['welcome', 'register', 'login'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-background relative">
      {renderScreen()}
      
      {/* Bottom Navigation */}
      {showBottomNav && (
        <div className="fixed bottom-4 left-4 right-4 bg-card/80 backdrop-blur-xl border border-border/50 shadow-strong rounded-2xl">
          <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
            <Button
              variant={currentScreen === 'match' ? 'default' : 'ghost'}
              size="sm"
              className={`flex-col gap-0.5 h-auto py-1.5 rounded-xl transition-all duration-200 ${
                currentScreen === 'match' 
                  ? 'bg-primary text-primary-foreground shadow-soft' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
              onClick={() => navigate('match')}
            >
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Match</span>
            </Button>
            
            <Button
              variant={currentScreen === 'schedule' ? 'default' : 'ghost'}
              size="sm"
              className={`flex-col gap-0.5 h-auto py-1.5 rounded-xl transition-all duration-200 ${
                currentScreen === 'schedule' 
                  ? 'bg-primary text-primary-foreground shadow-soft' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
              onClick={() => navigate('schedule')}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium">Agenda</span>
            </Button>
            
            <Button
              variant={currentScreen === 'ai-trainer' ? 'default' : 'ghost'}
              size="sm"
              className={`flex-col gap-0.5 h-auto py-1.5 rounded-xl transition-all duration-200 ${
                currentScreen === 'ai-trainer' 
                  ? 'bg-primary text-primary-foreground shadow-soft' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
              onClick={() => navigate('ai-trainer')}
            >
              <Brain className="w-4 h-4" />
              <span className="text-xs font-medium">IA Coach</span>
            </Button>
            
            <Button
              variant={currentScreen === 'social' ? 'default' : 'ghost'}
              size="sm"
              className={`flex-col gap-0.5 h-auto py-1.5 rounded-xl transition-all duration-200 ${
                currentScreen === 'social' 
                  ? 'bg-primary text-primary-foreground shadow-soft' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
              onClick={() => navigate('social')}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs font-medium">Social</span>
            </Button>
            
            <Button
              variant={currentScreen === 'rewards' ? 'default' : 'ghost'}
              size="sm"
              className={`flex-col gap-0.5 h-auto py-1.5 rounded-xl transition-all duration-200 ${
                currentScreen === 'rewards' 
                  ? 'bg-primary text-primary-foreground shadow-soft' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
              onClick={() => navigate('rewards')}
            >
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-medium">Pontos</span>
            </Button>
            
            <Button
              variant={currentScreen === 'gyms' ? 'default' : 'ghost'}
              size="sm"
              className={`flex-col gap-0.5 h-auto py-1.5 rounded-xl transition-all duration-200 ${
                currentScreen === 'gyms' 
                  ? 'bg-primary text-primary-foreground shadow-soft' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
              onClick={() => navigate('gyms')}
            >
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-medium">Academias</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
