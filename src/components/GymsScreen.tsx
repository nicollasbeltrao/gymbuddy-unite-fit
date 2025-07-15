import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Calendar, Users, Phone, Clock, Tag } from "lucide-react";

interface GymsScreenProps {
  onNavigate: (screen: string) => void;
}

interface Gym {
  id: number;
  name: string;
  distance: string;
  rating: number;
  address: string;
  phone: string;
  hours: string;
  promotion: string;
  image: string;
  features: string[];
  price: string;
}

const partnerGyms: Gym[] = [
  {
    id: 1,
    name: "Smart Fit Centro",
    distance: "1.2 km",
    rating: 4.8,
    address: "Rua das Flores, 123 - Centro",
    phone: "(11) 99999-9999",
    hours: "6h às 22h",
    promotion: "20% OFF para treinos em dupla",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    features: ["Musculação", "Cardio", "Funcional", "Piscina"],
    price: "R$ 79,90/mês"
  },
  {
    id: 2,
    name: "Academia Iron Gym",
    distance: "2.8 km",
    rating: 4.6,
    address: "Av. Principal, 456 - Jardim",
    phone: "(11) 88888-8888",
    hours: "5h às 23h",
    promotion: "1 semana grátis para novos alunos",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    features: ["Musculação", "Crossfit", "MMA", "Yoga"],
    price: "R$ 129,90/mês"
  },
  {
    id: 3,
    name: "Fitness Plus",
    distance: "0.8 km",
    rating: 4.9,
    address: "Rua do Esporte, 789 - Vila Nova",
    phone: "(11) 77777-7777",
    hours: "24 horas",
    promotion: "Personal trainer gratuito na primeira semana",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f",
    features: ["Musculação", "Pilates", "Dança", "Spinning"],
    price: "R$ 149,90/mês"
  }
];

export function GymsScreen({ onNavigate }: GymsScreenProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);

  const filteredGyms = partnerGyms.filter(gym =>
    gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gym.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedGym) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        {/* Header */}
        <div className="p-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedGym(null)}
            className="mb-4"
          >
            ← Voltar
          </Button>
        </div>

        {/* Gym Details */}
        <div className="px-6 space-y-4">
          {/* Hero Image */}
          <Card className="overflow-hidden shadow-strong">
            <div 
              className="h-48 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${selectedGym.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h1 className="text-2xl font-bold">{selectedGym.name}</h1>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  {selectedGym.rating}
                  <span>•</span>
                  <MapPin className="w-4 h-4" />
                  {selectedGym.distance}
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-accent text-white">
                  <Tag className="w-3 h-3 mr-1" />
                  Promoção
                </Badge>
              </div>
            </div>
          </Card>

          {/* Promotion Banner */}
          <Card className="bg-gradient-warning text-white shadow-medium">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">Oferta Especial</p>
                  <p className="text-sm opacity-90">{selectedGym.promotion}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="shadow-soft">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Funcionamento</p>
                <p className="font-semibold">{selectedGym.hours}</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Tag className="w-6 h-6 text-accent" />
                </div>
                <p className="text-sm text-muted-foreground">Mensalidade</p>
                <p className="font-semibold">{selectedGym.price}</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm">{selectedGym.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm">{selectedGym.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Modalidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedGym.features.map((feature, index) => (
                  <Badge key={index} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 pb-6">
            <Button className="w-full" size="lg">
              <Calendar className="w-5 h-5 mr-2" />
              Agendar Visita
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <Users className="w-5 h-5 mr-2" />
              Ver Parceiros Disponíveis
            </Button>
            <Button variant="ghost" className="w-full" size="lg">
              <Phone className="w-5 h-5 mr-2" />
              Ligar para Academia
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Academias Parceiras</h1>
            <p className="text-muted-foreground">Encontre a academia ideal</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Input
            placeholder="Buscar por nome ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4"
          />
        </div>
      </div>

      {/* Partner Gyms List */}
      <div className="px-6 space-y-4">
        {filteredGyms.map((gym) => (
          <Card 
            key={gym.id} 
            className="shadow-soft cursor-pointer hover:shadow-medium transition-all"
            onClick={() => setSelectedGym(gym)}
          >
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Gym Image */}
                <div 
                  className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${gym.image})` }}
                />
                
                {/* Gym Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold truncate">{gym.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-3 h-3 fill-current text-warning" />
                        {gym.rating}
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        {gym.distance}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {gym.price}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2 truncate">
                    {gym.address}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-gradient-accent text-white text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      Oferta
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {gym.hours}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-accent font-medium truncate">
                    {gym.promotion}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Partner Program Info */}
      <div className="px-6 py-6">
        <Card className="bg-gradient-primary text-white shadow-medium">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Programa de Parcerias</h3>
            <p className="text-sm opacity-90 mb-4">
              Academias parceiras oferecem condições especiais para usuários GymBuddy
            </p>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">20%</p>
                <p className="text-xs opacity-90">Desconto médio</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">15+</p>
                <p className="text-xs opacity-90">Academias</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">5km</p>
                <p className="text-xs opacity-90">Raio médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}