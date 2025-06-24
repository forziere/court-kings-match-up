
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Footprints, 
  Zap, 
  Trophy,
  Users,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Sport {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  description: string;
  image: string;
  features: string[];
  stats: {
    players: string;
    venues: string;
    tournaments: string;
  };
}

const sports: Sport[] = [
  {
    id: "padel",
    name: "Padel",
    icon: Zap,
    color: "text-blue-400",
    gradient: "from-blue-500 to-cyan-500",
    description: "Il sport in più rapida crescita al mondo. Divertimento garantito per tutti i livelli!",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    features: ["Facile da imparare", "Sempre in doppio", "Campi coperti", "Community attiva"],
    stats: {
      players: "1,200+",
      venues: "45+",
      tournaments: "120+"
    }
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: Trophy,
    color: "text-green-400",
    gradient: "from-green-500 to-emerald-500",
    description: "Sport classico ed elegante. Perfetto per sfide individuali e di coppia.",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    features: ["Singolo e doppio", "Tecnica raffinata", "Tradizione storica", "Tornei prestigiosi"],
    stats: {
      players: "800+",
      venues: "35+",
      tournaments: "85+"
    }
  },
  {
    id: "calcio",
    name: "Calcio",
    icon: Footprints,
    color: "text-orange-400",
    gradient: "from-orange-500 to-red-500",
    description: "Il re degli sport! Unisciti alla community calcistica più appassionata.",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    features: ["Sport di squadra", "Passione italiana", "Campi a 5 e 11", "Leghe competitive"],
    stats: {
      players: "2,100+",
      venues: "60+",
      tournaments: "200+"
    }
  },
  {
    id: "basket",
    name: "Basket",
    icon: Users,
    color: "text-purple-400",
    gradient: "from-purple-500 to-indigo-500",
    description: "Velocità, strategia e spettacolo. Il basket ti aspetta!",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    features: ["Gioco dinamico", "5 contro 5", "Campi al coperto", "Streetball"],
    stats: {
      players: "650+",
      venues: "25+",
      tournaments: "60+"
    }
  },
  {
    id: "volley",
    name: "Volley",
    icon: MapPin,
    color: "text-pink-400",
    gradient: "from-pink-500 to-rose-500",
    description: "Eleganza e potenza. Il volley per veri atleti!",
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    features: ["Gioco di squadra", "Beach e indoor", "Tecnica precisa", "Olimpico"],
    stats: {
      players: "450+",
      venues: "20+",
      tournaments: "40+"
    }
  }
];

interface SportSelectorProps {
  onSportSelect: (sport: Sport) => void;
}

const SportSelector = ({ onSportSelect }: SportSelectorProps) => {
  const [selectedSport, setSelectedSport] = useState<Sport>(sports[0]);

  const handleSportSelect = (sport: Sport) => {
    setSelectedSport(sport);
    onSportSelect(sport);
  };

  return (
    <div className="space-y-8">
      {/* Sport Tabs */}
      <div className="flex flex-wrap gap-4 justify-center">
        {sports.map((sport) => (
          <Button
            key={sport.id}
            onClick={() => handleSportSelect(sport)}
            variant={selectedSport.id === sport.id ? "default" : "outline"}
            className={`${
              selectedSport.id === sport.id 
                ? `bg-gradient-to-r ${sport.gradient} text-white` 
                : "border-white/30 text-white hover:bg-white/10"
            } px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105`}
          >
            <sport.icon className="w-5 h-5 mr-2" />
            {sport.name}
          </Button>
        ))}
      </div>

      {/* Selected Sport Content */}
      <motion.div
        key={selectedSport.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Sport Hero Section */}
        <div className="relative glass-card rounded-3xl overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${selectedSport.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex items-center mb-4">
              <div className={`w-16 h-16 bg-gradient-to-r ${selectedSport.gradient} rounded-2xl flex items-center justify-center mr-6`}>
                <selectedSport.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {selectedSport.name}
                </h2>
                <p className="text-xl text-blue-100 max-w-2xl">
                  {selectedSport.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sport Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card border-white/20">
            <CardContent className="p-6 text-center">
              <Users className={`w-12 h-12 ${selectedSport.color} mx-auto mb-4`} />
              <div className="text-3xl font-bold text-white mb-2">{selectedSport.stats.players}</div>
              <div className="text-blue-200">Giocatori attivi</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20">
            <CardContent className="p-6 text-center">
              <MapPin className={`w-12 h-12 ${selectedSport.color} mx-auto mb-4`} />
              <div className="text-3xl font-bold text-white mb-2">{selectedSport.stats.venues}</div>
              <div className="text-blue-200">Impianti disponibili</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20">
            <CardContent className="p-6 text-center">
              <Trophy className={`w-12 h-12 ${selectedSport.color} mx-auto mb-4`} />
              <div className="text-3xl font-bold text-white mb-2">{selectedSport.stats.tournaments}</div>
              <div className="text-blue-200">Tornei organizzati</div>
            </CardContent>
          </Card>
        </div>

        {/* Sport Features */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Perché scegliere {selectedSport.name}?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedSport.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className={`w-8 h-8 bg-gradient-to-r ${selectedSport.gradient} rounded-full flex items-center justify-center`}>
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-blue-100 text-lg">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SportSelector;
