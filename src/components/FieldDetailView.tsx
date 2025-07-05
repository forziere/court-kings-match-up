import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Calendar,
  Users,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Shield,
  Baby
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface FieldDetailViewProps {
  field: Field;
  onBack: () => void;
  onBookNow: (field: Field) => void;
}

const getFeatureIcon = (feature: string) => {
  const lowerFeature = feature.toLowerCase();
  if (lowerFeature.includes('parcheggio') || lowerFeature.includes('parking')) return Car;
  if (lowerFeature.includes('wifi')) return Wifi;
  if (lowerFeature.includes('bar') || lowerFeature.includes('ristorante') || lowerFeature.includes('cafeteria')) return Coffee;
  if (lowerFeature.includes('spogliatoi') || lowerFeature.includes('changing')) return Shield;
  if (lowerFeature.includes('giochi') || lowerFeature.includes('play')) return Baby;
  if (lowerFeature.includes('noleggio') || lowerFeature.includes('rental')) return Dumbbell;
  return Users;
};

const FieldDetailView = ({ field, onBack, onBookNow }: FieldDetailViewProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

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
            <h1 className="text-3xl font-bold text-white">{field.name}</h1>
            <p className="text-blue-200 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {field.address}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image and Main Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card border-white/20 overflow-hidden">
              <div className="relative h-64 md:h-80">
                <img 
                  src={field.image}
                  alt={field.name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 mb-2">
                        {field.sport}
                      </Badge>
                      <h2 className="text-2xl font-bold text-white mb-1">{field.name}</h2>
                      <div className="flex items-center gap-2 text-white/80">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{field.rating}</span>
                        <span className="mx-2">•</span>
                        <span className="font-semibold text-green-400">{field.priceRange}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Special Info for El Niño */}
            {field.id === '5' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6"
              >
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Informazioni Dettagliate</CardTitle>
                    <CardDescription className="text-blue-200">
                      Benvenuto a El Niño !!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-blue-100">
                      <p className="mb-3">
                        Il nostro circolo ha 2 campi da padel al coperto (campo 1 e campo 2) e un campo all'aperto (campo 3). Abbiamo anche una vasta gamma di pale in prova o a noleggio per tutti i livelli.
                      </p>
                      <p className="mb-4">
                        Se invece vuoi giocare a calcio abbiamo un campo a 5 e un campo a 7 in erba sintetica di ultima generazione.
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contatti per Prenotazioni
                      </h4>
                      <div className="space-y-2 text-blue-200 text-sm">
                        <p>📞 <strong>Padel:</strong> 347 9904012 (segreteria circolo)</p>
                        <p>⚽ <strong>Calcio:</strong> 3395723243 (Massimiliano Pisciotta)</p>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-2">
                        🎉 Sala Eventi
                      </h4>
                      <p className="text-blue-200 text-sm mb-2">
                        Abbiamo un'ampia sala con bar prenotabile per feste ed eventi.
                      </p>
                      <p className="text-blue-200 text-sm">
                        📞 <strong>Per info:</strong> 3925029442 (Carla)
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Orari di Apertura
                      </h4>
                      <p className="text-blue-200">Lunedì - Domenica: 08:00 - 00:00</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar with Features and Booking */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Quick Booking */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Prenota Subito</CardTitle>
                <CardDescription className="text-blue-200">
                  Disponibilità in tempo reale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => onBookNow(field)}
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white font-semibold py-3"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Prenota Ora
                </Button>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Servizi Disponibili</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {field.features.map((feature, index) => {
                    const Icon = getFeatureIcon(feature);
                    return (
                      <div key={index} className="flex items-center gap-3 text-blue-100">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-blue-300" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Posizione
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-blue-200 text-sm">{field.address}</p>
                  <Button 
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10"
                    onClick={() => {
                      const address = encodeURIComponent(field.address);
                      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Apri in Maps
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailView;