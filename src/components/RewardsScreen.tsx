import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Trophy, Gift, Star, Crown, Zap, Users, Calendar } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

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
    name: "Garrafa WorkoutBuddy",
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
  const { theme } = useTheme();
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
            <Card className={`shadow-medium ${
              theme === 'light' 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                : 'bg-gradient-warning text-white'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Seus GymCoins
                    </h3>
                    <p className={`text-3xl font-bold ${
                      theme === 'light' ? 'text-black' : 'text-white'
                    }`}>
                      {userPoints}
                    </p>
                  </div>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    theme === 'light' 
                      ? 'bg-white/30' 
                      : 'bg-white/20'
                  }`}>
                    <Coins className={`w-8 h-8 ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`} />
                  </div>
                </div>
                <div className={`mt-4 pt-4 border-t ${
                  theme === 'light' 
                    ? 'border-gray-700/30' 
                    : 'border-white/20'
                }`}>
                  <p className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'opacity-90'
                  }`}>
                    Próxima meta: +250 pontos para IA Premium
                  </p>
                  <Progress 
                    value={75} 
                    className={`mt-2 h-2 ${
                      theme === 'light' 
                        ? 'bg-gray-200' 
                        : 'bg-white/20'
                    }`} 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Available Rewards */}
            <div className="space-y-3">
              <h3 className={`font-semibold ${
                theme === 'light' ? 'text-black' : 'text-foreground dark:text-foreground'
              }`}>
                Recompensas Disponíveis
              </h3>
              {availableRewards.map((reward) => (
                <Card key={reward.id} className={`shadow-soft border ${
                  theme === 'light' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'border-border/30 dark:border-border/20'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-md ${
                          theme === 'light'
                            ? 'bg-gradient-to-br from-gray-600 to-gray-700'
                            : 'bg-gradient-to-br from-blue-500 to-purple-600'
                        }`}>
                          {reward.type === 'discount' ? (
                            <Gift className={`w-6 h-6 ${theme === 'light' ? 'text-gray-200' : 'text-white'}`} />
                          ) : reward.type === 'product' ? (
                            <Star className={`w-6 h-6 ${theme === 'light' ? 'text-yellow-300' : 'text-white'}`} />
                          ) : (
                            <Zap className={`w-6 h-6 ${theme === 'light' ? 'text-blue-300' : 'text-white'}`} />
                          )}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${
                            theme === 'light' ? 'text-gray-100' : 'text-foreground dark:text-foreground'
                          }`}>
                            {reward.name}
                          </h4>
                          <p className={`text-sm font-medium ${
                            theme === 'light' ? 'text-gray-300' : 'text-foreground/70 dark:text-muted-foreground'
                          }`}>
                            {reward.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-2">
                          <Coins className={`w-4 h-4 ${
                            theme === 'light' ? 'text-yellow-300' : 'text-yellow-500 dark:text-yellow-400'
                          }`} />
                          <span className={`font-semibold ${
                            theme === 'light' ? 'text-gray-100' : 'text-foreground dark:text-foreground'
                          }`}>
                            {reward.cost}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          disabled={!reward.available || userPoints < reward.cost}
                          variant={userPoints >= reward.cost ? "default" : "ghost"}
                          className={`${
                            userPoints >= reward.cost 
                              ? theme === 'light' 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-blue-600 hover:bg-blue-700'
                              : theme === 'light'
                                ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700'
                                : ''
                          }`}
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
              <h3 className={`font-semibold ${
                theme === 'light' ? 'text-black' : 'text-foreground dark:text-foreground'
              }`}>
                Conquistas
              </h3>
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`shadow-soft border ${
                  theme === 'light'
                    ? 'bg-white border-gray-200'
                    : 'border-border/30 dark:border-border/20'
                } ${
                  achievement.unlocked 
                    ? theme === 'light'
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                      : 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700/30'
                    : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl shadow-md ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
                          : theme === 'light'
                            ? 'bg-gray-200 text-gray-600'
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-semibold ${
                            theme === 'light' ? 'text-black' : 'text-foreground dark:text-foreground'
                          }`}>
                            {achievement.name}
                          </h4>
                          {achievement.unlocked && (
                            <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">
                              <Trophy className="w-3 h-3 mr-1" />
                              +{achievement.points}
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm font-medium ${
                          theme === 'light' ? 'text-gray-600' : 'text-foreground/70 dark:text-muted-foreground'
                        }`}>
                          {achievement.description}
                        </p>
                        
                        {!achievement.unlocked && achievement.progress !== undefined && (
                          <div className="mt-2">
                            <div className={`flex justify-between text-xs mb-1 font-medium ${
                              theme === 'light' ? 'text-gray-500' : 'text-foreground/60 dark:text-muted-foreground'
                            }`}>
                              <span>Progresso</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress!) * 100} 
                              className={`h-2 ${
                                theme === 'light' ? 'bg-gray-200' : 'bg-muted/50'
                              }`}
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
            <Card className={`shadow-medium ${
              theme === 'light' 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                : 'bg-gradient-primary text-white'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      theme === 'light' ? 'text-white' : 'text-white'
                    }`}>
                      Sua Posição
                    </h3>
                    <div className="flex items-center gap-2">
                      <Crown className={`w-8 h-8 ${
                        theme === 'light' ? 'text-yellow-300' : 'text-white'
                      }`} />
                      <span className={`text-4xl font-bold ${
                        theme === 'light' ? 'text-white' : 'text-white'
                      }`}>
                        #{userRank}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-white/90' : 'opacity-90'
                    }`}>
                      Esta semana
                    </p>
                    <p className={`text-2xl font-bold ${
                      theme === 'light' ? 'text-white' : 'text-white'
                    }`}>
                      +2 posições
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className={`shadow-soft border ${
              theme === 'light' 
                ? 'bg-white border-gray-200' 
                : 'border-border/30 dark:border-border/20'
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${
                  theme === 'light' ? 'text-black' : 'text-foreground dark:text-foreground'
                }`}>
                  <Trophy className={`w-5 h-5 ${
                    theme === 'light' ? 'text-yellow-500' : 'text-yellow-500 dark:text-yellow-400'
                  }`} />
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
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    user.name === 'Você' 
                      ? theme === 'light'
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-primary/10 border border-primary/20 dark:bg-primary/10 dark:border-primary/20'
                      : theme === 'light'
                        ? 'bg-gray-50 border border-gray-200'
                        : 'bg-card/50 border border-border/30 dark:bg-muted/30 dark:border-border/20'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      user.rank === 1 ? 'bg-yellow-500 text-white shadow-md' :
                      user.rank === 2 ? 'bg-gray-500 text-white shadow-md' :
                      user.rank === 3 ? 'bg-orange-500 text-white shadow-md' :
                      theme === 'light'
                        ? 'bg-gray-300 text-gray-700'
                        : 'bg-muted text-foreground dark:bg-muted dark:text-muted-foreground'
                    }`}>
                      {user.rank}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${
                        theme === 'light' ? 'text-black' : 'text-foreground dark:text-foreground'
                      }`}>
                        {user.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <Coins className={`w-3 h-3 ${
                          theme === 'light' ? 'text-yellow-500' : 'text-yellow-500 dark:text-yellow-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          theme === 'light' ? 'text-gray-600' : 'text-foreground/70 dark:text-muted-foreground'
                        }`}>
                          {user.points} pontos
                        </span>
                      </div>
                    </div>
                    {user.rank <= 3 && (
                      <Crown className={`w-4 h-4 ${
                        user.rank === 1 ? 'text-yellow-500 dark:text-yellow-400' :
                        user.rank === 2 ? 'text-gray-500 dark:text-gray-400' :
                        'text-orange-500 dark:text-orange-400'
                      }`} />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Challenge */}
            <Card className={`shadow-soft border ${
              theme === 'light' 
                ? 'bg-white border-gray-200' 
                : 'border-border/30 dark:border-border/20'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-md ${
                    theme === 'light'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600'
                  }`}>
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      theme === 'light' ? 'text-black' : 'text-foreground dark:text-foreground'
                    }`}>
                      Desafio da Semana
                    </h4>
                    <p className={`text-sm font-medium ${
                      theme === 'light' ? 'text-gray-600' : 'text-foreground/70 dark:text-muted-foreground'
                    }`}>
                      Treine 5 dias consecutivos
                    </p>
                    <Progress 
                      value={60} 
                      className={`mt-2 h-2 ${
                        theme === 'light' ? 'bg-gray-200' : 'bg-muted/50'
                      }`} 
                    />
                  </div>
                  <Badge variant="outline" className={`font-medium ${
                    theme === 'light' 
                      ? 'border-gray-300 text-gray-700' 
                      : 'border-border/50 text-foreground dark:text-foreground'
                  }`}>
                    3/5
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}