
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  Trophy, 
  Settings,
  LogOut,
  Plus,
  Clock,
  MapPin,
  Star,
  TrendingUp,
  Target,
  Gamepad2,
  Bell,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingView from "@/components/BookingView";
import TournamentView from "@/components/TournamentView";
import { toast } from "sonner";

const DashboardView = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const mockMatches = [
    {
      id: 1,
      opponent: "Marco R.",
      sport: "Calcio",
      time: "Oggi 18:00",
      field: "Campo Centrale",
      level: "Intermedio",
      status: "confirmed"
    },
    {
      id: 2,
      opponent: "Sara L.",
      sport: "Tennis",
      time: "Domani 16:30",
      field: "Campo 2",
      level: "Avanzato",
      status: "pending"
    }
  ];

  const mockTournaments = [
    {
      id: 1,
      name: "Torneo Primavera 2024",
      sport: "Calcio",
      participants: 16,
      prize: "Trofeo + Voucher €50",
      startDate: "25 Mar 2024",
      status: "open"
    },
    {
      id: 2,
      name: "Champions League Tennis",
      sport: "Tennis",
      participants: 8,
      prize: "Medaglia d'oro",
      startDate: "1 Apr 2024",
      status: "starting_soon"
    }
  ];

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
      case "confirmed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "open": return "bg-blue-500";
      case "starting_soon": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  if (activeTab === "booking") {
    return <BookingView user={user} onBack={() => setActiveTab("dashboard")} />;
  }

  if (activeTab === "tournaments") {
    return <TournamentView user={user} onBack={() => setActiveTab("dashboard")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Header */}
      <motion.header 
        className="bg-white/10 backdrop-blur-lg border-b border-white/20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SportConnect</h1>
                <p className="text-blue-200 text-sm">Ciao, {user.name}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Settings className="w-5 h-5" />
              </Button>
              <Button 
                onClick={onLogout}
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/10 border border-white/20 rounded-xl p-1">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-200 rounded-lg"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="booking" 
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-200 rounded-lg"
            >
              Prenota Campo
            </TabsTrigger>
            <TabsTrigger 
              value="tournaments" 
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-200 rounded-lg"
            >
              Tornei
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="glass-card border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm font-medium">Partite Giocate</p>
                      <p className="text-2xl font-bold text-white">{user.gamesPlayed}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Gamepad2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm font-medium">Vittorie</p>
                      <p className="text-2xl font-bold text-white">{user.wins}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm font-medium">Rating</p>
                      <p className="text-2xl font-bold text-white">{user.rating}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm font-medium">Livello</p>
                      <p className="text-lg font-bold text-white">{user.level}</p>
                    </div>
                    <div className={`w-12 h-12 ${getLevelColor(user.level)} rounded-xl flex items-center justify-center`}>
                      <Star className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prossime Partite */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="glass-card border-white/20 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Prossime Partite
                      </CardTitle>
                      <Button 
                        size="sm" 
                        onClick={() => setActiveTab("booking")}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Prenota
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockMatches.length > 0 ? mockMatches.map((match) => (
                      <div key={match.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">vs {match.opponent}</p>
                              <p className="text-blue-200 text-sm">{match.sport}</p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(match.status)} text-white`}>
                            {match.status === "confirmed" ? "Confermata" : "In attesa"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-blue-200">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {match.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {match.field}
                          </span>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                        <p className="text-blue-200">Nessuna partita programmata</p>
                        <Button 
                          onClick={() => setActiveTab("booking")}
                          className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500"
                        >
                          Prenota la tua prima partita
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tornei Disponibili */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="glass-card border-white/20 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        Tornei Disponibili
                      </CardTitle>
                      <Button 
                        size="sm" 
                        onClick={() => setActiveTab("tournaments")}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Partecipa
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockTournaments.map((tournament) => (
                      <div key={tournament.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-white font-medium">{tournament.name}</p>
                            <p className="text-blue-200 text-sm">{tournament.sport}</p>
                          </div>
                          <Badge className={`${getStatusColor(tournament.status)} text-white`}>
                            {tournament.status === "open" ? "Aperto" : "Inizia presto"}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-blue-200">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {tournament.participants} partecipanti
                            </span>
                            <span>{tournament.startDate}</span>
                          </div>
                          <p className="text-yellow-300">🏆 {tournament.prize}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Azioni Rapide</CardTitle>
                  <CardDescription className="text-blue-200">
                    Cosa vuoi fare oggi?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => setActiveTab("booking")}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-20 flex-col gap-2"
                    >
                      <Calendar className="w-6 h-6" />
                      Prenota Campo
                    </Button>
                    <Button 
                      onClick={() => toast.success("Ricerca giocatori in corso...")}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 h-20 flex-col gap-2"
                    >
                      <Target className="w-6 h-6" />
                      Trova Avversari
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("tournaments")}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-20 flex-col gap-2"
                    >
                      <Trophy className="w-6 h-6" />
                      Tornei
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardView;
