import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Trophy, Gift, Star, Crown, Zap, Users, Calendar } from "lucide-react";

interface RewardsScreenProps {
  onNavigate: (screen: string) => void;
}

interface Reward {
  id: number;
  name: string;
  description: string;
  cost: number;
  type: 'discount' | 'product' | 'feature';
  available: boolean;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

const availableRewards: Reward[] = [
  {
    id: 1,
    name: "20% OFF Suplementos",
    description: "Desconto em lojas parceiras",
    cost: 500,
    type: 'discount',
    available: true
  },
  {
    id: 2,
    name: "Garrafa GymBuddy",
    description: "Garrafa exclusiva de aço inox",
    cost: 800,
    type: 'product',
    available: true
  },
  {
    id: 3,
    name: "IA Coach Premium",
    description: "1 mês de acesso premium",
    cost: 1200,
    type: 'feature',
    available: false
  }
];

const achievements: Achievement[] = [
  {
    id: 1,
    name: "Primeiro Treino",
    description: "Complete seu primeiro treino",
    icon: "💪",
    points: 50,
    unlocked: true
  },
  {
    id: 2,
    name: "Parceiro Fiel",
    description: "Treine 10 vezes com o mesmo parceiro",
    icon: "🤝",
    points: 200,
    unlocked: false,
    progress: 6,
    maxProgress: 10
  },
  {
    id: 3,
    name: "Streak Master",
    description: "30 dias consecutivos",
    icon: "🔥",
    points: 500,
    unlocked: false,
    progress: 15,
    maxProgress: 30
  }
];

export function RewardsScreen({ onNavigate }: RewardsScreenProps) {
  const [activeTab, setActiveTab] = useState<'rewards' | 'achievements' | 'ranking'>('rewards');
  const [userPoints] = useState(1250);
  const [userRank] = useState(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Recompensas</h1>
            <p className="text-muted-foreground">Seus pontos e conquistas</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-warning" />
              <span className="text-xl font-bold text-warning">{userPoints}</span>
            </div>
            <p className="text-sm text-muted-foreground">pontos</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-muted rounded-lg p-1 mb-6">
          <Button
            variant={activeTab === 'rewards' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('rewards')}
          >
            Loja
          </Button>
          <Button
            variant={activeTab === 'achievements' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('achievements')}
          >
            Conquistas
          </Button>
          <Button
            variant={activeTab === 'ranking' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('ranking')}
          >
            Ranking
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-4">
        {activeTab === 'rewards' && (
          <>
            {/* Points Summary */}
            <Card className="bg-gradient-warning text-white shadow-medium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Seus GymCoins</h3>
                    <p className="text-3xl font-bold">{userPoints}</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Coins className="w-8 h-8" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm opacity-90">Próxima meta: +250 pontos para IA Premium</p>
                  <Progress value={75} className="mt-2 h-2 bg-white/20" />
                </div>
              </CardContent>
            </Card>

            {/* Available Rewards */}
            <div className="space-y-3">
              <h3 className="font-semibold">Recompensas Disponíveis</h3>
              {availableRewards.map((reward) => (
                <Card key={reward.id} className="shadow-soft">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          {reward.type === 'discount' ? <Gift className="w-6 h-6 text-white" /> :
                           reward.type === 'product' ? <Star className="w-6 h-6 text-white" /> :
                           <Zap className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                          <h4 className="font-semibold">{reward.name}</h4>
                          <p className="text-sm text-muted-foreground">{reward.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-2">
                          <Coins className="w-4 h-4 text-warning" />
                          <span className="font-semibold">{reward.cost}</span>
                        </div>
                        <Button 
                          size="sm" 
                          disabled={!reward.available || userPoints < reward.cost}
                          variant={userPoints >= reward.cost ? "default" : "ghost"}
                        >
                          {reward.available ? 'Resgatar' : 'Em breve'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'achievements' && (
          <>
            <div className="space-y-3">
              <h3 className="font-semibold">Conquistas</h3>
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`shadow-soft ${achievement.unlocked ? 'bg-accent/5 border-accent/20' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                        achievement.unlocked ? 'bg-gradient-accent' : 'bg-muted'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{achievement.name}</h4>
                          {achievement.unlocked && (
                            <Badge variant="default" className="text-xs">
                              <Trophy className="w-3 h-3 mr-1" />
                              +{achievement.points}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        
                        {!achievement.unlocked && achievement.progress !== undefined && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progresso</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress!) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'ranking' && (
          <>
            {/* Your Rank */}
            <Card className="bg-gradient-primary text-white shadow-medium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Sua Posição</h3>
                    <div className="flex items-center gap-2">
                      <Crown className="w-8 h-8" />
                      <span className="text-4xl font-bold">#{userRank}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90">Esta semana</p>
                    <p className="text-2xl font-bold">+2 posições</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Ranking Semanal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Marina Costa", points: 2850, rank: 1 },
                  { name: "João Pedro", points: 2640, rank: 2 },
                  { name: "Você", points: userPoints, rank: userRank },
                  { name: "Ana Silva", points: 1180, rank: 4 },
                  { name: "Carlos Santos", points: 950, rank: 5 }
                ].map((user, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                    user.name === 'Você' ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      user.rank === 1 ? 'bg-warning text-white' :
                      user.rank === 2 ? 'bg-muted-foreground text-white' :
                      user.rank === 3 ? 'bg-orange-500 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {user.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <div className="flex items-center gap-1">
                        <Coins className="w-3 h-3 text-warning" />
                        <span className="text-sm text-muted-foreground">{user.points} pontos</span>
                      </div>
                    </div>
                    {user.rank <= 3 && (
                      <Crown className={`w-4 h-4 ${
                        user.rank === 1 ? 'text-warning' :
                        user.rank === 2 ? 'text-muted-foreground' :
                        'text-orange-500'
                      }`} />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Challenge */}
            <Card className="shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Desafio da Semana</h4>
                    <p className="text-sm text-muted-foreground">Treine 5 dias consecutivos</p>
                    <Progress value={60} className="mt-2 h-2" />
                  </div>
                  <Badge variant="outline">3/5</Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}