
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Euro,
  CheckCircle,
  Star,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const BookingView = ({ user, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedField, setSelectedField] = useState(null);

  const mockFields = [
    {
      id: 1,
      name: "Campo Centrale",
      sport: "Calcio",
      price: 25,
      rating: 4.8,
      location: "Centro Sportivo Milano",
      available: ["09:00", "11:00", "14:00", "16:00", "18:00"],
      features: ["Erba sintetica", "Spogliatoi", "Illuminazione", "Parcheggio"]
    },
    {
      id: 2,
      name: "Campo Tennis Pro",
      sport: "Tennis", 
      price: 20,
      rating: 4.9,
      location: "Tennis Club Roma",
      available: ["08:00", "10:00", "15:00", "17:00", "19:00"],
      features: ["Terra battuta", "Spogliatoi", "Illuminazione notturna"]
    },
    {
      id: 3,
      name: "Campo Basket Street",
      sport: "Basket",
      price: 15,
      rating: 4.6,
      location: "Palazzetto dello Sport",
      available: ["10:00", "12:00", "16:00", "20:00"],
      features: ["Parquet", "Spalti", "Aria condizionata", "Spogliatoi"]
    },
    {
      id: 4,
      name: "Campo Padel Elite",
      sport: "Padel",
      price: 30,
      rating: 4.7,
      location: "Padel Club Torino",
      available: ["09:00", "11:00", "14:00", "17:00", "19:00"],
      features: ["Vetro temperato", "Erba sintetica premium", "Spogliatoi VIP"]
    }
  ];

  const filteredFields = selectedSport === "all" 
    ? mockFields 
    : mockFields.filter(field => field.sport.toLowerCase() === selectedSport);

  const handleBookField = (field, time) => {
    setSelectedField({ ...field, selectedTime: time });
    toast.success(`Campo prenotato per le ${time}!`);
  };

  const getSportIcon = (sport) => {
    switch (sport) {
      case "Calcio": return "⚽";
      case "Tennis": return "🎾"; 
      case "Basket": return "🏀";
      case "Padel": return "🏓";
      default: return "🏃";
    }
  };

  const getSportColor = (sport) => {
    switch (sport) {
      case "Calcio": return "from-green-500 to-emerald-500";
      case "Tennis": return "from-yellow-500 to-orange-500";
      case "Basket": return "from-orange-500 to-red-500";
      case "Padel": return "from-blue-500 to-cyan-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Header */}
      <motion.header 
        className="bg-white/10 backdrop-blur-lg border-b border-white/20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Prenota Campo</h1>
              <p className="text-blue-200">Trova e prenota il campo perfetto per te</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Filtri */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtri di Ricerca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Data</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Sport</label>
                  <Select value={selectedSport} onValueChange={setSelectedSport}>
                    <SelectTrigger className="bg-white/10 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutti gli sport</SelectItem>
                      <SelectItem value="calcio">⚽ Calcio</SelectItem>
                      <SelectItem value="tennis">🎾 Tennis</SelectItem>
                      <SelectItem value="basket">🏀 Basket</SelectItem>
                      <SelectItem value="padel">🏓 Padel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Livello consigliato</label>
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    {user.level}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista Campi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card className="glass-card border-white/20 hover:border-white/40 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getSportColor(field.sport)} rounded-xl flex items-center justify-center text-2xl`}>
                        {getSportIcon(field.sport)}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{field.name}</CardTitle>
                        <CardDescription className="text-blue-200 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {field.location}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">€{field.price}</div>
                      <div className="text-blue-200 text-sm">all'ora</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Rating e Sport */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">{field.rating}</span>
                      <Badge variant="outline" className="border-blue-400 text-blue-200">
                        {field.sport}
                      </Badge>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <p className="text-white text-sm font-medium">Servizi inclusi:</p>
                    <div className="flex flex-wrap gap-2">
                      {field.features.map((feature, i) => (
                        <Badge key={i} variant="secondary" className="bg-white/10 text-blue-200 border-0">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Orari disponibili */}
                  <div className="space-y-3">
                    <p className="text-white text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Orari disponibili per {new Date(selectedDate).toLocaleDateString('it-IT')}:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {field.available.map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          size="sm"
                          onClick={() => handleBookField(field, time)}
                          className="border-white/30 text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:border-transparent"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Pulsante prenotazione rapida */}
                  <Button 
                    onClick={() => handleBookField(field, field.available[0])}
                    className={`w-full bg-gradient-to-r ${getSportColor(field.sport)} hover:scale-105 transition-transform duration-200`}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Prenota Ora - {field.available[0]}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredFields.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nessun campo trovato</h3>
            <p className="text-blue-200 mb-4">Prova a modificare i filtri di ricerca</p>
            <Button onClick={() => setSelectedSport("all")} variant="outline" className="border-white/30 text-white">
              Mostra tutti i campi
            </Button>
          </motion.div>
        )}

        {/* Prenotazione confermata */}
        {selectedField && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <Card className="glass-card border-white/30 max-w-md w-full">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Prenotazione Confermata!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Campo:</span>
                    <span className="text-white font-medium">{selectedField.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Data:</span>
                    <span className="text-white">{new Date(selectedDate).toLocaleDateString('it-IT')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Orario:</span>
                    <span className="text-white">{selectedField.selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Prezzo:</span>
                    <span className="text-white font-bold">€{selectedField.price}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setSelectedField(null)}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
                >
                  Perfetto!
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingView;
