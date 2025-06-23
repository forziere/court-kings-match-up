
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Trophy, 
  Users, 
  Calendar, 
  Star,
  Crown,
  Target,
  Plus,
  Clock,
  MapPin,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const TournamentView = ({ user, onBack }) => {
  const [selectedTournament, setSelectedTournament] = useState(null);

  const mockTournaments = [
    {
      id: 1,
      name: "Torneo Primavera 2024",
      sport: "Calcio",
      level: "Intermedio",
      participants: { current: 12, max: 16 },
      prize: "Trofeo + Voucher €100",
      startDate: "25 Mar 2024",
      endDate: "28 Mar 2024",
      location: "Centro Sportivo Milano",
      entryFee: 15,
      status: "open",
      description: "Il torneo più atteso dell'anno! Partite emozionanti su campi professionali.",
      rules: ["Squadre da 7 giocatori", "Tempo: 2x20 minuti", "Fuorigioco attivo"],
      organizer: "SportConnect Team"
    },
    {
      id: 2,
      name: "Champions League Tennis",
      sport: "Tennis",
      level: "Avanzato", 
      participants: { current: 6, max: 8 },
      prize: "Medaglia d'oro + Racchetta Pro",
      startDate: "1 Apr 2024",
      endDate: "3 Apr 2024",
      location: "Tennis Club Roma",
      entryFee: 25,
      status: "starting_soon",
      description: "Torneo di tennis ad eliminazione diretta per giocatori esperti.",
      rules: ["Singolare maschile/femminile", "Set al meglio di 3", "Tie-break al 7° game"],
      organizer: "Tennis Club Roma"
    },
    {
      id: 3,
      name: "Street Basketball Challenge",
      sport: "Basket",
      level: "Principiante",
      participants: { current: 20, max: 24 },
      prize: "Scarpe da basket Nike",
      startDate: "15 Apr 2024", 
      endDate: "17 Apr 2024",
      location: "Playground Central Park",
      entryFee: 10,
      status: "open",
      description: "Basket 3vs3 in stile streetball. Aperto a tutti i livelli!",
      rules: ["Squadre da 3 + 1 riserva", "Primo a 21 punti", "Palla da 2 e 3 punti"],
      organizer: "Urban Sports"
    },
    {
      id: 4,
      name: "Padel Masters",
      sport: "Padel",
      level: "Professionista",
      participants: { current: 4, max: 16 },
      prize: "€500 + Trofeo Master",
      startDate: "5 Mag 2024",
      endDate: "7 Mag 2024", 
      location: "Padel Club Elite",
      entryFee: 50,
      status: "open",
      description: "Il torneo di padel più prestigioso della città. Solo per i migliori!",
      rules: ["Coppie miste o same-gender", "Partite al meglio di 3 set", "Tie-break a 7"],
      organizer: "Padel Pro League"
    }
  ];

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

  const getLevelColor = (level) => {
    switch (level) {
      case "Principiante": return "bg-green-500";
      case "Intermedio": return "bg-yellow-500";
      case "Avanzato": return "bg-orange-500";
      case "Professionista": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "bg-green-500";
      case "starting_soon": return "bg-orange-500";
      case "in_progress": return "bg-blue-500";
      case "completed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "open": return "Iscrizioni aperte";
      case "starting_soon": return "Inizia presto";
      case "in_progress": return "In corso";
      case "completed": return "Completato";
      default: return "Sconosciuto";
    }
  };

  const handleJoinTournament = (tournament) => {
    setSelectedTournament(tournament);
    toast.success(`Ti sei iscritto al ${tournament.name}!`);
  };

  const canJoin = (tournament) => {
    return tournament.status === "open" && tournament.participants.current < tournament.participants.max;
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
              <h1 className="text-2xl font-bold text-white">Tornei</h1>
              <p className="text-blue-200">Partecipa ai tornei più emozionanti della tua città</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="glass-card border-white/20 text-center">
            <CardContent className="p-4">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">4</div>
              <div className="text-blue-200 text-sm">Tornei attivi</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20 text-center">
            <CardContent className="p-4">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">42</div>
              <div className="text-blue-200 text-sm">Partecipanti totali</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20 text-center">
            <CardContent className="p-4">
              <Crown className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">€675</div>
              <div className="text-blue-200 text-sm">Premi in palio</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/20 text-center">
            <CardContent className="p-4">
              <Star className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{user.level}</div>
              <div className="text-blue-200 text-sm">Il tuo livello</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista Tornei */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockTournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card className="glass-card border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getSportColor(tournament.sport)} rounded-xl flex items-center justify-center text-2xl`}>
                        {getSportIcon(tournament.sport)}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{tournament.name}</CardTitle>
                        <CardDescription className="text-blue-200">
                          {tournament.organizer}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(tournament.status)} text-white`}>
                      {getStatusText(tournament.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Info base */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-200">
                        <Target className="w-4 h-4" />
                        Sport: <span className="text-white">{tournament.sport}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-200">
                        <Star className="w-4 h-4" />
                        Livello: 
                        <Badge className={`${getLevelColor(tournament.level)} text-white text-xs`}>
                          {tournament.level}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-200">
                        <Calendar className="w-4 h-4" />
                        <span className="text-white">{tournament.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-200">
                        <MapPin className="w-4 h-4" />
                        <span className="text-white text-xs">{tournament.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Partecipanti */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-200 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Partecipanti
                      </span>
                      <span className="text-white">
                        {tournament.participants.current}/{tournament.participants.max}
                      </span>
                    </div>
                    <Progress 
                      value={(tournament.participants.current / tournament.participants.max) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Premio */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-yellow-300">
                      <Award className="w-4 h-4" />
                      <span className="font-medium">Premio: {tournament.prize}</span>
                    </div>
                  </div>

                  {/* Descrizione */}
                  <p className="text-blue-200 text-sm">{tournament.description}</p>

                  {/* Prezzo e azione */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="text-white">
                      <span className="text-2xl font-bold">€{tournament.entryFee}</span>
                      <span className="text-blue-200 text-sm ml-1">quota</span>
                    </div>
                    <Button
                      onClick={() => handleJoinTournament(tournament)}
                      disabled={!canJoin(tournament)}
                      className={`${
                        canJoin(tournament)
                          ? `bg-gradient-to-r ${getSportColor(tournament.sport)} hover:scale-105`
                          : "bg-gray-500 cursor-not-allowed"
                      } transition-transform duration-200`}
                    >
                      {canJoin(tournament) ? (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Partecipa
                        </>
                      ) : (
                        "Non disponibile"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Iscrizione confermata */}
        {selectedTournament && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <Card className="glass-card border-white/30 max-w-lg w-full">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Iscrizione Confermata!</CardTitle>
                <CardDescription className="text-blue-200">
                  Ti sei iscritto con successo al torneo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Torneo:</span>
                    <span className="text-white font-medium">{selectedTournament.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Sport:</span>
                    <span className="text-white">{selectedTournament.sport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Inizio:</span>
                    <span className="text-white">{selectedTournament.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Quota:</span>
                    <span className="text-white font-bold">€{selectedTournament.entryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Premio in palio:</span>
                    <span className="text-yellow-300 font-medium">{selectedTournament.prize}</span>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-200 text-sm">
                    📧 Riceverai tutti i dettagli via email. Preparati a dare il massimo!
                  </p>
                </div>

                <Button 
                  onClick={() => setSelectedTournament(null)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
                >
                  Perfetto, sono pronto!
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TournamentView;
