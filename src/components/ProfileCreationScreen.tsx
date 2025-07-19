import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Camera, 
  Upload, 
  User, 
  Calendar, 
  Target, 
  Dumbbell, 
  Clock, 
  MapPin, 
  Heart,
  ArrowLeft,
  CheckCircle,
  X
} from "lucide-react";

interface ProfileCreationScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface ProfileData {
  photo: string | null;
  name: string;
  age: number | null;
  gender: string;
  goal: string;
  experience: string;
  schedule: string;
  gym: string;
  interests: string[];
}

const genderOptions = [
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "outro", label: "Outro" },
  { value: "prefiro-nao-dizer", label: "Prefiro não dizer" }
];

const goalOptions = [
  { value: "ganho-massa", label: "Ganho de Massa", icon: "💪" },
  { value: "emagrecimento", label: "Emagrecimento", icon: "🔥" },
  { value: "condicionamento", label: "Condicionamento", icon: "⚡" },
  { value: "manutencao", label: "Manutenção", icon: "🔄" },
  { value: "outro", label: "Outro", icon: "🎯" }
];

const experienceOptions = [
  { value: "iniciante", label: "Iniciante", description: "Menos de 6 meses" },
  { value: "intermediario", label: "Intermediário", description: "6 meses a 2 anos" },
  { value: "avancado", label: "Avançado", description: "Mais de 2 anos" }
];

const scheduleOptions = [
  { value: "manha", label: "Manhã", time: "6h - 12h" },
  { value: "tarde", label: "Tarde", time: "12h - 18h" },
  { value: "noite", label: "Noite", time: "18h - 22h" },
  { value: "flexivel", label: "Flexível", time: "Qualquer horário" }
];

const gymOptions = [
  "Smart Fit",
  "Academia do João",
  "Fitness Club",
  "Gym Center",
  "Power House",
  "Elite Fitness",
  "Outra"
];

const interestOptions = [
  { value: "musculacao", label: "Musculação", icon: "💪" },
  { value: "funcional", label: "Funcional", icon: "🏃" },
  { value: "cardio", label: "Cardio", icon: "❤️" },
  { value: "yoga", label: "Yoga", icon: "🧘" },
  { value: "pilates", label: "Pilates", icon: "🤸" },
  { value: "crossfit", label: "Crossfit", icon: "🔥" },
  { value: "natacao", label: "Natação", icon: "🏊" },
  { value: "corrida", label: "Corrida", icon: "🏃‍♂️" },
  { value: "danca", label: "Dança", icon: "💃" },
  { value: "boxe", label: "Boxe", icon: "🥊" }
];

export function ProfileCreationScreen({ onComplete, onSkip }: ProfileCreationScreenProps) {
  const [profileData, setProfileData] = useState<ProfileData>({
    photo: null,
    name: "",
    age: null,
    gender: "",
    goal: "",
    experience: "",
    schedule: "",
    gym: "",
    interests: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalSteps = 4;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          photo: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : prev.interests.length < 3
          ? [...prev.interests, interest]
          : prev.interests
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profileData.name.trim() && profileData.age && profileData.gender;
      case 2:
        return profileData.goal && profileData.experience;
      case 3:
        return profileData.schedule && profileData.gym;
      case 4:
        return profileData.interests.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simula salvamento dos dados
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    onComplete();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Photo Upload */}
            <div className="space-y-3">
              <Label className="text-card-foreground font-medium">Foto de Perfil *</Label>
              <div className="flex justify-center">
                <div className="relative">
                  {profileData.photo ? (
                    <div className="relative">
                      <img 
                        src={profileData.photo} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-2 border-primary/30"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border-border/50"
                        onClick={() => setProfileData(prev => ({ ...prev, photo: null }))}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="w-24 h-24 rounded-full border-2 border-dashed border-border/50 flex items-center justify-center bg-card/50 cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Toque para adicionar uma foto
              </p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-card-foreground font-medium">
                Nome Completo *
              </Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-card border-border/50 text-card-foreground"
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-card-foreground font-medium">
                Idade *
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Sua idade"
                min="16"
                max="100"
                value={profileData.age || ""}
                onChange={(e) => setProfileData(prev => ({ ...prev, age: parseInt(e.target.value) || null }))}
                className="bg-card border-border/50 text-card-foreground"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="text-card-foreground font-medium">Gênero *</Label>
              <Select value={profileData.gender} onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))}>
                <SelectTrigger className="bg-card border-border/50 text-card-foreground">
                  <SelectValue placeholder="Selecione seu gênero" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  {genderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-card-foreground">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Goal */}
            <div className="space-y-3">
              <Label className="text-card-foreground font-medium">Objetivo Principal *</Label>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={profileData.goal === option.value ? "default" : "outline"}
                    className={`h-auto p-4 flex flex-col items-center gap-2 ${
                      profileData.goal === option.value 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-card border-border/50 text-card-foreground hover:bg-card"
                    }`}
                    onClick={() => setProfileData(prev => ({ ...prev, goal: option.value }))}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <Label className="text-card-foreground font-medium">Nível de Experiência *</Label>
              <div className="space-y-2">
                {experienceOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={profileData.experience === option.value ? "default" : "outline"}
                    className={`w-full justify-start h-auto p-4 ${
                      profileData.experience === option.value 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-card border-border/50 text-card-foreground hover:bg-card"
                    }`}
                    onClick={() => setProfileData(prev => ({ ...prev, experience: option.value }))}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs opacity-80">{option.description}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Schedule */}
            <div className="space-y-3">
              <Label className="text-card-foreground font-medium">Horário Preferido *</Label>
              <div className="space-y-2">
                {scheduleOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={profileData.schedule === option.value ? "default" : "outline"}
                    className={`w-full justify-start h-auto p-4 ${
                      profileData.schedule === option.value 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-card border-border/50 text-card-foreground hover:bg-card"
                    }`}
                    onClick={() => setProfileData(prev => ({ ...prev, schedule: option.value }))}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs opacity-80">{option.time}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Gym */}
            <div className="space-y-2">
              <Label className="text-card-foreground font-medium">Academia *</Label>
              <Select value={profileData.gym} onValueChange={(value) => setProfileData(prev => ({ ...prev, gym: value }))}>
                <SelectTrigger className="bg-card border-border/50 text-card-foreground">
                  <SelectValue placeholder="Selecione sua academia" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  {gymOptions.map((gym) => (
                    <SelectItem key={gym} value={gym} className="text-card-foreground">
                      {gym}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Interests */}
            <div className="space-y-3">
              <Label className="text-card-foreground font-medium">
                Interesses de Treino * (máximo 3)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {interestOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={profileData.interests.includes(option.value) ? "default" : "outline"}
                    className={`h-auto p-3 flex flex-col items-center gap-2 ${
                      profileData.interests.includes(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border-border/50 text-card-foreground hover:bg-card"
                    }`}
                    onClick={() => handleInterestToggle(option.value)}
                    disabled={!profileData.interests.includes(option.value) && profileData.interests.length >= 3}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <span className="text-xs font-medium">{option.label}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {profileData.interests.length}/3 selecionados
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="relative z-10 min-h-screen flex flex-col p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-4 pb-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onSkip()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Criar Perfil</h1>
            <p className="text-sm text-muted-foreground">Passo {currentStep} de {totalSteps}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="bg-card/80 backdrop-blur-xl p-6 sm:p-8 max-w-md mx-auto shadow-strong border-border/50 rounded-2xl animate-slide-up w-full">
            <CardContent className="p-0">
              {renderStepContent()}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-6">
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-strong rounded-2xl h-12 sm:h-14 text-base sm:text-lg font-medium"
            onClick={handleNext}
            disabled={!isStepValid() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Salvando...
              </>
            ) : currentStep === totalSteps ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalizar Perfil
              </>
            ) : (
              "Próximo"
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={onSkip}
            disabled={isSubmitting}
          >
            Pular por agora
          </Button>
        </div>
      </div>
    </div>
  );
} 