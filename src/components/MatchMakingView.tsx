import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Users, 
  Plus,
  Search,
  Filter,
  Clock,
  MapPin,
  Trophy,
  UserCheck,
  QrCode,
  Share2,
  Calendar,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const MatchMakingView = ({ user, onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMatch, setNewMatch] = useState({
    sport: "",
    skillLevel: "",
    maxPlayers: 2,
    isPublic: true,
    matchType: "casual",
    notes: "",
    ageRangeMin: "",
    ageRangeMax: "",
    autoMatch: false
  });

  const queryClient = useQueryClient();

  // Query per ottenere i match disponibili
  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ['available-matches', selectedSport, selectedLevel],
    queryFn: async () => {
      let query = supabase
        .from('matches')
        .select(`
          *,
          match_participants(
            id,
            user_id,
            status,
            joined_at
          ),
          bookings(
            booking_date,
            start_time,
            end_time,
            sports_facilities(name, location, sport)
          )
        `)
        .eq('status', 'scheduled')
        .gte('match_date', new Date().toISOString());

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    }
  });

  // Query per le prenotazioni dell'utente per creare match
  const { data: userBookings } = useQuery({
    queryKey: ['user-bookings-for-matches', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          sports_facilities(name, location, sport)
        `)
        .eq('user_id', user.id)
        .eq('status', 'confirmed')
        .gte('booking_date', new Date().toISOString().split('T')[0]);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Mutation per unirsi a un match
  const joinMatchMutation = useMutation({
    mutationFn: async (matchId: string) => {
      const { data, error } = await supabase
        .from('match_participants')
        .insert({
          match_id: matchId,
          user_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-matches'] });
      toast.success("Richiesta di partecipazione inviata!");
    },
    onError: (error) => {
      toast.error("Errore nell'unirsi al match");
      console.error("Join match error:", error);
    }
  });

  // Mutation per creare un nuovo match
  const createMatchMutation = useMutation({
    mutationFn: async (matchData: any) => {
      const { data, error } = await supabase
        .from('matches')
        .insert({
          player1_id: user.id,
          booking_id: matchData.bookingId,
          max_players: matchData.maxPlayers,
          is_public: matchData.isPublic,
          skill_level_required: matchData.skillLevel,
          age_range_min: matchData.ageRangeMin || null,
          age_range_max: matchData.ageRangeMax || null,
          match_type: matchData.matchType,
          auto_match: matchData.autoMatch,
          notes: matchData.notes,
          match_date: new Date(`${matchData.date}T${matchData.time}`).toISOString(),
          join_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-matches'] });
      setIsCreateModalOpen(false);
      toast.success("Match creato con successo!");
      setNewMatch({
        sport: "",
        skillLevel: "",
        maxPlayers: 2,
        isPublic: true,
        matchType: "casual",
        notes: "",
        ageRangeMin: "",
        ageRangeMax: "",
        autoMatch: false
      });
    },
    onError: (error) => {
      toast.error("Errore nella creazione del match");
      console.error("Create match error:", error);
    }
  });

  const handleJoinMatch = (matchId) => {
    joinMatchMutation.mutate(matchId);
  };

  const handleCreateMatch = (bookingId, booking) => {
    const matchData = {
      ...newMatch,
      bookingId,
      date: booking.booking_date,
      time: booking.start_time
    };
    createMatchMutation.mutate(matchData);
  };

  const filteredMatches = matches?.filter(match => {
    const sportMatch = selectedSport === "all" || 
      match.bookings?.sports_facilities?.sport.toLowerCase() === selectedSport;
    
    const levelMatch = selectedLevel === "all" || 
      match.skill_level_required === selectedLevel;
    
    const searchMatch = !searchQuery || 
      match.bookings?.sports_facilities?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return sportMatch && levelMatch && searchMatch;
  }) || [];

  const getMatchTypeColor = (type) => {
    switch (type) {
      case 'competitive': return 'from-red-500 to-orange-500';
      case 'tournament': return 'from-purple-500 to-pink-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'advanced': return 'text-red-400';
      case 'intermediate': return 'text-yellow-400';
      default: return 'text-green-400';
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
          <div className="flex items-center justify-between">
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
                <h1 className="text-2xl font-bold text-white">Match-Making</h1>
                <p className="text-blue-200">Trova giocatori e crea partite</p>
              </div>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Crea Match
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/20">
                <DialogHeader>
                  <DialogTitle className="text-white">Crea Nuovo Match</DialogTitle>
                  <DialogDescription className="text-blue-200">
                    Seleziona una delle tue prenotazioni per creare un match
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {userBookings?.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-2 opacity-50" />
                      <p className="text-blue-200">Non hai prenotazioni attive</p>
                      <p className="text-blue-300 text-sm">Prenota prima un campo per creare un match</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white">Seleziona Prenotazione</Label>
                        {userBookings?.map((booking) => (
                          <Card key={booking.id} className="bg-white/5 border-white/20">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-white font-medium">
                                    {booking.sports_facilities.name}
                                  </h4>
                                  <p className="text-blue-200 text-sm">
                                    {new Date(booking.booking_date).toLocaleDateString('it-IT')} - {booking.start_time}
                                  </p>
                                  <p className="text-blue-300 text-sm">
                                    {booking.sports_facilities.sport}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => handleCreateMatch(booking.id, booking)}
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-500 to-cyan-500"
                                >
                                  Crea Match
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {/* Opzioni match */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white">Livello Richiesto</Label>
                          <Select value={newMatch.skillLevel} onValueChange={(value) => setNewMatch({...newMatch, skillLevel: value})}>
                            <SelectTrigger className="bg-white/10 border-white/30 text-white">
                              <SelectValue placeholder="Seleziona livello" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Principiante</SelectItem>
                              <SelectItem value="intermediate">Intermedio</SelectItem>
                              <SelectItem value="advanced">Avanzato</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-white">Max Giocatori</Label>
                          <Select value={newMatch.maxPlayers.toString()} onValueChange={(value) => setNewMatch({...newMatch, maxPlayers: parseInt(value)})}>
                            <SelectTrigger className="bg-white/10 border-white/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2 giocatori</SelectItem>
                              <SelectItem value="4">4 giocatori</SelectItem>
                              <SelectItem value="6">6 giocatori</SelectItem>
                              <SelectItem value="8">8 giocatori</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-white">Note (opzionale)</Label>
                        <Textarea
                          placeholder="Aggiungi dettagli sul match..."
                          value={newMatch.notes}
                          onChange={(e) => setNewMatch({...newMatch, notes: e.target.value})}
                          className="bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="public-match"
                          checked={newMatch.isPublic}
                          onCheckedChange={(checked) => setNewMatch({...newMatch, isPublic: checked})}
                        />
                        <Label htmlFor="public-match" className="text-white">
                          Match pubblico (visibile a tutti)
                        </Label>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="browse">🔍 Trova Match</TabsTrigger>
            <TabsTrigger value="my-matches">🏆 I Miei Match</TabsTrigger>
          </TabsList>

          {/* Browse matches */}
          <TabsContent value="browse">
            {/* Filtri */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-6"
            >
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtri di Ricerca
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Cerca</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
                        <Input
                          placeholder="Campo, note..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Sport</Label>
                      <Select value={selectedSport} onValueChange={setSelectedSport}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tutti gli sport</SelectItem>
                          <SelectItem value="calcio">⚽ Calcio</SelectItem>
                          <SelectItem value="tennis">🎾 Tennis</SelectItem>
                          <SelectItem value="padel">🏓 Padel</SelectItem>
                          <SelectItem value="basket">🏀 Basket</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Livello</Label>
                      <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tutti i livelli</SelectItem>
                          <SelectItem value="beginner">Principiante</SelectItem>
                          <SelectItem value="intermediate">Intermedio</SelectItem>
                          <SelectItem value="advanced">Avanzato</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Lista match */}
            <div className="space-y-4">
              {filteredMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card border-white/20 hover:border-white/40 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-12 h-12 bg-gradient-to-r ${getMatchTypeColor(match.match_type)} rounded-xl flex items-center justify-center text-white font-bold`}>
                              {match.match_type === 'tournament' ? <Trophy className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-lg">
                                {match.bookings?.sports_facilities?.name}
                              </h3>
                              <div className="flex items-center gap-4 text-blue-200 text-sm">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {match.bookings?.sports_facilities?.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(match.match_date).toLocaleDateString('it-IT')} - {match.bookings?.start_time}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`bg-white/10 border-0 ${getSkillLevelColor(match.skill_level_required)}`}>
                              <Star className="w-3 h-3 mr-1" />
                              {match.skill_level_required}
                            </Badge>
                            <Badge variant="outline" className="border-blue-400/30 text-blue-300">
                              {match.current_players || 1}/{match.max_players} giocatori
                            </Badge>
                            <Badge 
                              className={`${match.is_public ? 'bg-green-500/20 text-green-300 border-green-400/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'}`}
                            >
                              {match.is_public ? 'Pubblico' : 'Privato'}
                            </Badge>
                          </div>
                          
                          {match.notes && (
                            <p className="text-blue-200 text-sm mt-2">{match.notes}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {match.join_code && (
                            <Button
                              variant="outline" 
                              size="sm"
                              className="border-white/30 text-white hover:bg-white/10"
                            >
                              <QrCode className="w-4 h-4 mr-1" />
                              {match.join_code}
                            </Button>
                          )}
                          
                          <Button
                            onClick={() => handleJoinMatch(match.id)}
                            disabled={joinMatchMutation.isPending}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Partecipa
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              {filteredMatches.length === 0 && !matchesLoading && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold text-white mb-2">Nessun match trovato</h3>
                  <p className="text-blue-200 mb-4">
                    Non ci sono match disponibili per i filtri selezionati
                  </p>
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Crea il primo match
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* My matches */}
          <TabsContent value="my-matches">
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">I Tuoi Match</h3>
              <p className="text-blue-200 mb-4">
                Gestisci i match che hai creato o a cui partecipi
              </p>
              <p className="text-blue-300 text-sm">Funzionalità in arrivo...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MatchMakingView;