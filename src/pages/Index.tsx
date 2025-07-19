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
import { Button } from "@/components/ui/button";
import { Home, Users, Calendar, Brain, MessageSquare, Trophy, MapPin, ChevronUp, ChevronDown, GripVertical } from "lucide-react";

type Screen = 'splash' | 'security' | 'register' | 'profile-creation' | 'loading' | 'welcome' | 'login' | 'match' | 'schedule' | 'ai-trainer' | 'social' | 'rewards' | 'gyms' | 'profile' | 'history';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const lastScrollY = useRef<number>(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const dragStartY = useRef<number>(0);
  const currentDragY = useRef<number>(0);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const showBottomNav = !['splash', 'security', 'register', 'profile-creation', 'loading', 'welcome', 'login'].includes(currentScreen);

  // Detectar swipe up/down na parte inferior da tela
  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    dragStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
    currentDragY.current = e.touches[0].clientY;
    
    // Prevenir scroll durante o drag
    if (Math.abs(currentDragY.current - dragStartY.current) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    const touchDiff = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 35; // Reduzido para ser mais responsivo
    
    // Verificar se o toque foi na parte inferior da tela (últimos 150px)
    const isBottomArea = touchStartY.current > window.innerHeight - 150;
    
    if (isBottomArea && Math.abs(touchDiff) > minSwipeDistance) {
      if (touchDiff > 0) {
        // Swipe up - mostrar navegação
        showNavigation();
      } else {
        // Swipe down - ocultar navegação
        hideNavigation();
      }
    }
    
    setIsDragging(false);
  };

  // Detectar scroll para ocultar navegação
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const scrollDiff = currentScrollY - lastScrollY.current;
    
    // Limpar timeout anterior
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    // Se estiver scrollando para baixo e a navegação estiver visível, ocultar
    if (scrollDiff > 10 && isNavVisible) {
      hideNavigation();
    }
    
    // Se parou de scrollar, aguardar um pouco e ocultar
    scrollTimeout.current = setTimeout(() => {
      if (isNavVisible) {
        hideNavigation();
      }
    }, 3000);
    
    lastScrollY.current = currentScrollY;
  };

  const showNavigation = () => {
    if (!isNavVisible && !isTransitioning) {
      setIsTransitioning(true);
      setIsNavVisible(true);
      
      // Remover classe de transição após animação
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }
  };

  const hideNavigation = () => {
    if (isNavVisible && !isTransitioning) {
      setIsTransitioning(true);
      setIsNavVisible(false);
      
      // Remover classe de transição após animação
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }
  };

  // Toggle navigation (para clique no handle)
  const toggleNavigation = () => {
    if (isNavVisible) {
      hideNavigation();
    } else {
      showNavigation();
    }
  };

  // Adicionar event listeners
  useEffect(() => {
    if (showBottomNav) {
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Ocultar navegação inicialmente após um delay
      const initialHideTimeout = setTimeout(() => {
        hideNavigation();
      }, 2000);
      
      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
        clearTimeout(initialHideTimeout);
      };
    }
  }, [showBottomNav, isNavVisible, isTransitioning]);

  // Mostrar navegação temporariamente ao mudar de tela
  useEffect(() => {
    if (showBottomNav) {
      showNavigation();
      
      // Ocultar após 5 segundos
      const hideTimeout = setTimeout(() => {
        hideNavigation();
      }, 5000);
      
      return () => clearTimeout(hideTimeout);
    }
  }, [currentScreen]);

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
      default:
        return <WelcomeScreen onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative safe-area-top safe-area-bottom">
      {renderScreen()}
      
      {/* Bottom Navigation */}
      {showBottomNav && (
        <div 
          className={`fixed bottom-4 left-4 right-4 bg-card/95 backdrop-blur-xl border border-border/50 shadow-strong rounded-2xl transition-all duration-500 ease-out safe-area-bottom ${
            isNavVisible 
              ? 'translate-y-0 opacity-100 shadow-2xl' 
              : 'translate-y-full opacity-0'
          }`}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div 
              className="w-16 h-2 bg-gray-300/60 dark:bg-gray-600/60 backdrop-blur-sm rounded-full border border-gray-400/30 dark:border-gray-500/30 flex items-center justify-center cursor-pointer hover:bg-gray-400/80 dark:hover:bg-gray-500/80 active:scale-95 transition-all duration-200 shadow-sm"
              onClick={toggleNavigation}
            >
              <div className="flex items-center gap-0.5 opacity-60">
                <div className="w-0.5 h-0.5 bg-gray-500/80 dark:bg-gray-400/80 rounded-full" />
                <div className="w-0.5 h-0.5 bg-gray-500/80 dark:bg-gray-400/80 rounded-full" />
                <div className="w-0.5 h-0.5 bg-gray-500/80 dark:bg-gray-400/80 rounded-full" />
              </div>
            </div>
            <div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-12 cursor-pointer"
              onTouchStart={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                touchStartY.current = touch.clientY;
                dragStartY.current = touch.clientY;
                setIsDragging(true);
              }}
              onTouchMove={(e) => {
                if (!isDragging) return;
                const touch = e.touches[0];
                touchEndY.current = touch.clientY;
                currentDragY.current = touch.clientY;
                
                if (Math.abs(currentDragY.current - dragStartY.current) > 10) {
                  e.preventDefault();
                }
              }}
              onTouchEnd={() => {
                if (!isDragging) return;
                const touchDiff = touchStartY.current - touchEndY.current;
                const minSwipeDistance = 30;
                
                if (Math.abs(touchDiff) > minSwipeDistance) {
                  if (touchDiff > 0) {
                    showNavigation();
                  } else {
                    hideNavigation();
                  }
                }
                setIsDragging(false);
              }}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between px-6 pb-4 gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 h-12 rounded-xl transition-all duration-200 ${
                currentScreen === 'match' 
                  ? 'bg-primary/20 text-primary border border-primary/30' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
              onClick={() => navigate('match')}
            >
              <Users className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 h-12 rounded-xl transition-all duration-200 ${
                currentScreen === 'schedule' 
                  ? 'bg-primary/20 text-primary border border-primary/30' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
              onClick={() => navigate('schedule')}
            >
              <Calendar className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 h-12 rounded-xl transition-all duration-200 ${
                currentScreen === 'ai-trainer' 
                  ? 'bg-primary/20 text-primary border border-primary/30' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
              onClick={() => navigate('ai-trainer')}
            >
              <Brain className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 h-12 rounded-xl transition-all duration-200 ${
                currentScreen === 'social' 
                  ? 'bg-primary/20 text-primary border border-primary/30' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
              onClick={() => navigate('social')}
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 h-12 rounded-xl transition-all duration-200 ${
                currentScreen === 'rewards' 
                  ? 'bg-primary/20 text-primary border border-primary/30' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
              onClick={() => navigate('rewards')}
            >
              <Trophy className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
