import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Smartphone, 
  Bell, 
  Shield, 
  HelpCircle, 
  Info,
  Settings as SettingsIcon
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
}

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-soft">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onNavigate('match')}
              className="rounded-full hover:bg-foreground/5 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Configurações</h1>
              <p className="text-sm text-muted-foreground font-medium">Personalize sua experiência</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        {/* Theme Settings */}
        <Card className="shadow-soft border-border/30 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <SettingsIcon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground font-semibold">Aparência</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Tema</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Escolha entre modo claro e escuro para uma experiência personalizada
                  </p>
                </div>
                <Badge variant="outline" className="text-xs font-medium px-3 py-1">
                  {theme === 'dark' ? 'Escuro' : 'Claro'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  className="flex items-center gap-3 h-14 text-sm font-medium transition-all duration-200 hover:scale-105"
                  onClick={() => handleThemeChange('light')}
                >
                  <div className="p-1.5 bg-yellow-100 rounded-lg">
                    <Sun className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span>Modo Claro</span>
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  className="flex items-center gap-3 h-14 text-sm font-medium transition-all duration-200 hover:scale-105"
                  onClick={() => handleThemeChange('dark')}
                >
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <Moon className="w-4 h-4 text-slate-600" />
                  </div>
                  <span>Modo Escuro</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-soft border-border/30 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground font-semibold">Notificações</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="space-y-1">
                <p className="font-semibold text-foreground">Notificações Push</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Receba alertas sobre matches e treinos
                </p>
              </div>
              <Button
                variant={notifications ? 'default' : 'outline'}
                size="sm"
                className="font-medium px-4"
                onClick={() => setNotifications(!notifications)}
              >
                {notifications ? 'Ativado' : 'Desativado'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="space-y-1">
                <p className="font-semibold text-foreground">Sons</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Efeitos sonoros no app
                </p>
              </div>
              <Button
                variant={soundEnabled ? 'default' : 'outline'}
                size="sm"
                className="font-medium px-4"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? 'Ativado' : 'Desativado'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="space-y-1">
                <p className="font-semibold text-foreground">Vibração</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Feedback tátil ao usar o app
                </p>
              </div>
              <Button
                variant={hapticFeedback ? 'default' : 'outline'}
                size="sm"
                className="font-medium px-4"
                onClick={() => setHapticFeedback(!hapticFeedback)}
              >
                {hapticFeedback ? 'Ativado' : 'Desativado'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="shadow-soft border-border/30 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground font-semibold">Privacidade & Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 text-left font-medium hover:bg-muted/50 transition-colors"
            >
              <Shield className="w-4 h-4 mr-3 text-muted-foreground" />
              Configurações de Privacidade
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 text-left font-medium hover:bg-muted/50 transition-colors"
            >
              <Smartphone className="w-4 h-4 mr-3 text-muted-foreground" />
              Gerenciar Dispositivos
            </Button>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card className="shadow-soft border-border/30 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground font-semibold">Ajuda & Suporte</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 text-left font-medium hover:bg-muted/50 transition-colors"
            >
              <HelpCircle className="w-4 h-4 mr-3 text-muted-foreground" />
              Central de Ajuda
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 text-left font-medium hover:bg-muted/50 transition-colors"
            >
              <Info className="w-4 h-4 mr-3 text-muted-foreground" />
              Sobre o App
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="shadow-soft border-border/30 bg-card/50">
          <CardContent className="pt-8 pb-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-medium">
                <span className="text-white font-bold text-2xl">WB</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground">WorkoutBuddy</h3>
                <p className="text-sm text-muted-foreground font-medium">Versão 1.0.0</p>
                <p className="text-xs text-muted-foreground">Seu parceiro de treino ideal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 