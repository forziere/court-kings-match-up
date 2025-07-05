import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Field {
  id: string;
  name: string;
  address: string;
  city: string;
  sport: string;
  rating: number;
  priceRange: string;
  image?: string;
  features: string[];
}

// Dati di esempio per Lucca basati su Playtomic
const luccaFields: Field[] = [
  {
    id: '1',
    name: 'Lucca Padel Club - Al Poggio',
    address: 'Via Del tiro a Segno 661',
    city: 'Lucca',
    sport: 'Padel',
    rating: 4.8,
    priceRange: '25-35€/h',
    features: ['Campi coperti', 'Spogliatoi', 'Parcheggio', 'Bar'],
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: 'TENNIS & PADEL CLUB BAGNI DI LUCCA',
    address: 'Via Roma 53',
    city: 'Bagni di Lucca',
    sport: 'Tennis/Padel',
    rating: 4.6,
    priceRange: '20-30€/h',
    features: ['Tennis', 'Padel', 'Spogliatoi', 'Ristorante'],
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    name: 'Padel Lucca Indoor',
    address: 'Via Di San Pieretto 32',
    city: 'Lucca',
    sport: 'Padel',
    rating: 4.7,
    priceRange: '30-40€/h',
    features: ['Indoor', 'Climatizzato', 'Spogliatoi VIP', 'Pro Shop'],
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    name: 'Flamingo Padel Club',
    address: 'Via di Mugnano 638',
    city: 'Lucca',
    sport: 'Padel',
    rating: 4.5,
    priceRange: '25-35€/h',
    features: ['Outdoor', 'Illuminazione', 'Bar', 'Eventi'],
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    name: 'Circolo El Niño padel e calcetto',
    address: 'Via Dei Gianni 303',
    city: 'Lucca',
    sport: 'Padel/Calcetto',
    rating: 4.4,
    priceRange: '20-30€/h',
    features: ['Multi-sport', 'Calcetto', 'Padel', 'Parcheggio'],
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

interface CityFieldsSearchProps {
  onBack: () => void;
}

const CityFieldsSearch = ({ onBack }: CityFieldsSearchProps) => {
  const [searchCity, setSearchCity] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchCity.trim()) return;
    
    setLoading(true);
    
    // Simula ricerca API - per ora usa dati locali per Lucca
    setTimeout(() => {
      if (searchCity.toLowerCase().includes('lucca')) {
        setFields(luccaFields);
      } else {
        setFields([]);
      }
      setHasSearched(true);
      setLoading(false);
    }, 1000);
  };

  const handleFieldSelect = (field: Field) => {
    // Qui potresti navigare alla prenotazione del campo specifico
    console.log('Campo selezionato:', field);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button 
            onClick={onBack}
            variant="outline"
            size="icon"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Trova Campi</h1>
            <p className="text-blue-200">Cerca campi sportivi nella tua città</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div 
          className="max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Cerca per Città
              </CardTitle>
              <CardDescription className="text-blue-200">
                Inserisci il nome della tua città per trovare campi sportivi disponibili
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Es. Lucca, Milano, Roma..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {fields.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card 
                      className="glass-card border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer hover:scale-105"
                      onClick={() => handleFieldSelect(field)}
                    >
                      <div className="relative">
                        <img 
                          src={field.image}
                          alt={field.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white text-sm">{field.rating}</span>
                        </div>
                        <Badge 
                          className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-600"
                        >
                          {field.sport}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-white text-lg">{field.name}</CardTitle>
                        <CardDescription className="text-blue-200 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {field.address}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-green-400 font-semibold">{field.priceRange}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {field.features.map((feature, idx) => (
                            <Badge 
                              key={idx}
                              variant="outline"
                              className="border-white/20 text-white/80 text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Card className="glass-card border-white/20 max-w-md mx-auto">
                  <CardContent className="p-8">
                    <div className="text-white/60 mb-4">
                      <Search className="w-12 h-12 mx-auto mb-4" />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">
                      Nessun campo trovato
                    </h3>
                    <p className="text-blue-200">
                      Non abbiamo trovato campi per "{searchCity}". 
                      Prova con un'altra città o controlla l'ortografia.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}

        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <Card className="glass-card border-white/20 max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="text-white/60 mb-4">
                  <MapPin className="w-12 h-12 mx-auto mb-4" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">
                  Inizia la tua ricerca
                </h3>
                <p className="text-blue-200">
                  Inserisci il nome della tua città per scoprire tutti i campi sportivi disponibili nella tua zona.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CityFieldsSearch;