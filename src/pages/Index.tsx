import { useState, useRef, useEffect } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { RegisterScreen } from "@/components/RegisterScreen";
import { ProfileCreationScreen } from "@/components/ProfileCreationScreen";
import { MatchScreen } from "@/components/MatchScreen";
import { ScheduleScreen } from "@/components/ScheduleScreen";
import { AITrainerScreen } from "@/components/AITrainerScreen";
import { SocialScreen } from "@/components/SocialScreen";
import { RewardsScreen } from "@/components/RewardsScreen";
import { GymsScreen } from "@/components/GymsScreen";
import { SplashScreen } from "@/components/SplashScreen";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SecurityVerificationScreen } from "@/components/SecurityVerificationScreen";
import { ChatScreen } from "@/components/ChatScreen";
import { WorkoutChat } from "@/components/WorkoutChat";
import { SettingsScreen } from "@/components/SettingsScreen";
import { Button } from "@/components/ui/button";
import { Home, Users, Calendar, Brain, MessageSquare, Trophy, MapPin, ChevronUp, ChevronDown, GripVertical, Settings as SettingsIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

type Screen = 'splash' | 'security' | 'register' | 'profile-creation' | 'loading' | 'welcome' | 'login' | 'match' | 'schedule' | 'ai-trainer' | 'social' | 'rewards' | 'gyms' | 'profile' | 'history' | 'chat' | 'workout-chat' | 'settings';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const { theme } = useTheme();

  const navigate = (screen: Screen) => {
    // Haptic feedback para iOS/Android
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    setCurrentScreen(screen);
  };

  const showBottomNav = !['splash', 'security', 'register', 'profile-creation', 'loading', 'welcome', 'login', 'chat', 'workout-chat', 'settings'].includes(currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => navigate('security')} />;
      case 'security':
        return <SecurityVerificationScreen onComplete={() => navigate('register')} />;
      case 'register':
        return <RegisterScreen onNavigate={navigate} />;
      case 'profile-creation':
        return <ProfileCreationScreen onComplete={() => navigate('loading')} onSkip={() => navigate('loading')} />;
      case 'loading':
        return <LoadingScreen onComplete={() => navigate('match')} />;
      case 'welcome':
        return <WelcomeScreen onNavigate={navigate} />;
      case 'login':
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
      case 'chat':
        return <ChatScreen onNavigate={navigate} />;
      case 'workout-chat':
        return <WorkoutChat onNavigate={navigate} />;
      case 'settings':
        return <SettingsScreen onNavigate={navigate} />;
      default:
        return <WelcomeScreen onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative safe-area-top safe-area-bottom">
      <div className={showBottomNav ? 'pb-[70px]' : ''}>
        {renderScreen()}
      </div>
      
      {/* Bottom Navigation */}
      {showBottomNav && (
        <div 
          className="fixed bottom-0 left-0 right-0 h-[70px] bg-card/95 backdrop-blur-[10px] border-t border-border/50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 safe-area-bottom"
          style={{
            background: theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: theme === 'dark' 
              ? '0 -2px 10px rgba(0,0,0,0.2)' 
              : '0 -2px 10px rgba(0,0,0,0.1)'
          }}
        >
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between h-full px-6 gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center justify-center gap-1 h-full min-w-[48px] p-2 rounded-none hover:bg-foreground/5 active:scale-105 transition-all duration-200"
              onClick={() => navigate('match')}
            >
              <Users 
                className={`w-6 h-6 transition-all duration-200 ${
                  currentScreen === 'match' 
                    ? 'text-primary scale-110' 
                    : 'text-muted-foreground'
                }`}
              />
              <span className={`text-[10px] font-medium transition-colors duration-200 ${
                currentScreen === 'match' 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}>
                Match
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center justify-center gap-1 h-full min-w-[48px] p-2 rounded-none hover:bg-foreground/5 active:scale-105 transition-all duration-200"
              onClick={() => navigate('schedule')}
            >
              <Calendar 
                className={`w-6 h-6 transition-all duration-200 ${
                  currentScreen === 'schedule' 
                    ? 'text-primary scale-110' 
                    : 'text-muted-foreground'
                }`}
              />
              <span className={`text-[10px] font-medium transition-colors duration-200 ${
                currentScreen === 'schedule' 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}>
                Agenda
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center justify-center gap-1 h-full min-w-[48px] p-2 rounded-none hover:bg-foreground/5 active:scale-105 transition-all duration-200"
              onClick={() => navigate('ai-trainer')}
            >
              <Brain 
                className={`w-6 h-6 transition-all duration-200 ${
                  currentScreen === 'ai-trainer' 
                    ? 'text-primary scale-110' 
                    : 'text-muted-foreground'
                }`}
              />
              <span className={`text-[10px] font-medium transition-colors duration-200 ${
                currentScreen === 'ai-trainer' 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}>
                IA Coach
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center justify-center gap-1 h-full min-w-[48px] p-2 rounded-none hover:bg-foreground/5 active:scale-105 transition-all duration-200"
              onClick={() => navigate('social')}
            >
              <MessageSquare 
                className={`w-6 h-6 transition-all duration-200 ${
                  currentScreen === 'social' 
                    ? 'text-primary scale-110' 
                    : 'text-muted-foreground'
                }`}
              />
              <span className={`text-[10px] font-medium transition-colors duration-200 ${
                currentScreen === 'social' 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}>
                Chat
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center justify-center gap-1 h-full min-w-[48px] p-2 rounded-none hover:bg-foreground/5 active:scale-105 transition-all duration-200"
              onClick={() => navigate('rewards')}
            >
              <Trophy 
                className={`w-6 h-6 transition-all duration-200 ${
                  currentScreen === 'rewards' 
                    ? 'text-primary scale-110' 
                    : 'text-muted-foreground'
                }`}
              />
              <span className={`text-[10px] font-medium transition-colors duration-200 ${
                currentScreen === 'rewards' 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}>
                Ranking
              </span>
            </Button>
            
            {/* Settings Button */}
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center justify-center gap-1 h-full min-w-[48px] p-2 rounded-none hover:bg-foreground/5 active:scale-105 transition-all duration-200"
              onClick={() => navigate('settings')}
            >
              <SettingsIcon 
                className={`w-6 h-6 transition-all duration-200 ${
                  currentScreen === 'settings' 
                    ? 'text-primary scale-110' 
                    : 'text-muted-foreground'
                }`}
              />
              <span className={`text-[10px] font-medium transition-colors duration-200 ${
                currentScreen === 'settings' 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}>
                Config
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
