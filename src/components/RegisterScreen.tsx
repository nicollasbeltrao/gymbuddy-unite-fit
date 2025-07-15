import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, Upload, MapPin, Target, Clock, Dumbbell } from "lucide-react";

interface RegisterScreenProps {
  onNavigate: (screen: string) => void;
}

export function RegisterScreen({ onNavigate }: RegisterScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  const totalSteps = 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      {/* Header */}
      <div className="flex items-center gap-4 pt-4 pb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onNavigate('welcome')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Criar Conta</h1>
          <p className="text-muted-foreground">Passo {currentStep} de {totalSteps}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-8">
        <div 
          className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Content */}
      <div className="max-w-md mx-auto">
        {currentStep === 1 && (
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Verificação de Identidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Documento de Identidade</Label>
                  <div className="mt-2 border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Foto ou PDF do documento</p>
                  </div>
                </div>
                
                <div>
                  <Label>Selfie para Verificação</Label>
                  <div className="mt-2 border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Tire uma selfie</p>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => setCurrentStep(2)}
              >
                Continuar
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" placeholder="Seu nome" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input id="location" placeholder="Cidade, Estado" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="gym">Academia</Label>
                <Input id="gym" placeholder="Nome da sua academia" className="mt-1" />
              </div>
              
              <div>
                <Label>Comprove vínculo com a academia</Label>
                <div className="mt-2 border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Comprovante ou e-mail institucional</p>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => setCurrentStep(3)}
              >
                Continuar
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Preferências de Treino
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Objetivo Principal</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione seu objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="muscle">Ganho de Massa</SelectItem>
                    <SelectItem value="weight">Perda de Peso</SelectItem>
                    <SelectItem value="strength">Força</SelectItem>
                    <SelectItem value="endurance">Resistência</SelectItem>
                    <SelectItem value="general">Condicionamento Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Horário Preferido</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Quando você treina?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Manhã (6h - 10h)</SelectItem>
                    <SelectItem value="midday">Meio-dia (10h - 14h)</SelectItem>
                    <SelectItem value="afternoon">Tarde (14h - 18h)</SelectItem>
                    <SelectItem value="evening">Noite (18h - 22h)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Experiência</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seu nível de experiência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Iniciante</SelectItem>
                    <SelectItem value="intermediate">Intermediário</SelectItem>
                    <SelectItem value="advanced">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="bio">Sobre você (opcional)</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Conte um pouco sobre seus interesses e objetivos..."
                  className="mt-1"
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => onNavigate('match')}
              >
                <Dumbbell className="w-4 h-4 mr-2" />
                Finalizar Cadastro
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}