import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Mail, CreditCard, ArrowRight, CheckCircle } from "lucide-react";

interface SecurityVerificationScreenProps {
  onComplete: () => void;
}

export function SecurityVerificationScreen({ onComplete }: SecurityVerificationScreenProps) {
  const [verificationMethod, setVerificationMethod] = useState<'cpf' | 'email'>('cpf');
  const [inputValue, setInputValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerification = () => {
    if (!inputValue.trim()) return;
    
    setIsVerifying(true);
    
    // Simula verificação
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      
      // Prossegue após verificação
      setTimeout(() => {
        onComplete();
      }, 1500);
    }, 2000);
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleInputChange = (value: string) => {
    if (verificationMethod === 'cpf') {
      const formatted = formatCPF(value);
      setInputValue(formatted);
    } else {
      setInputValue(value);
    }
  };

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-center pt-8 sm:pt-12">
          <div className="flex items-center gap-3 animate-scale-in">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-strong">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">GymBuddy</h1>
          </div>
        </div>

        {/* Verification Content */}
        <div className="flex-1 flex items-center justify-center px-2">
          <Card className="bg-card/80 backdrop-blur-xl p-6 sm:p-8 max-w-md mx-auto shadow-strong border-border/50 rounded-2xl animate-slide-up w-full">
            <div className="text-center space-y-6">
              {/* Success State */}
              {isVerified ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Verificação Concluída!</h2>
                    <p className="text-muted-foreground">
                      Sua identidade foi verificada com sucesso. Redirecionando...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Title */}
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Verificação de Segurança</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Para sua segurança, precisamos verificar sua identidade
                    </p>
                  </div>

                  {/* Method Selection */}
                  <div className="flex gap-2 p-1 bg-muted rounded-xl">
                    <Button
                      variant={verificationMethod === 'cpf' ? 'default' : 'ghost'}
                      size="sm"
                      className="flex-1 h-10"
                      onClick={() => setVerificationMethod('cpf')}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      CPF
                    </Button>
                    <Button
                      variant={verificationMethod === 'email' ? 'default' : 'ghost'}
                      size="sm"
                      className="flex-1 h-10"
                      onClick={() => setVerificationMethod('email')}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>

                  {/* Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {verificationMethod === 'cpf' ? 'CPF' : 'Email'}
                    </label>
                    <Input
                      type={verificationMethod === 'cpf' ? 'text' : 'email'}
                      placeholder={verificationMethod === 'cpf' ? '000.000.000-00' : 'seu@email.com'}
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="h-12 text-center text-lg"
                      disabled={isVerifying}
                    />
                  </div>

                  {/* Security Badge */}
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    <Shield className="w-3 h-3 mr-1" />
                    Dados protegidos e criptografados
                  </Badge>

                  {/* Verify Button */}
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-strong rounded-2xl h-12 sm:h-14 text-base sm:text-lg font-medium"
                    onClick={handleVerification}
                    disabled={!inputValue.trim() || isVerifying}
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        Verificar Identidade
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center pb-4 sm:pb-6">
          <p className="text-xs text-muted-foreground">
            Sua privacidade é nossa prioridade. Dados protegidos por criptografia SSL.
          </p>
        </div>
      </div>
    </div>
  );
} 