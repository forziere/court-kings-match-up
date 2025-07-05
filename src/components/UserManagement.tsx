import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Filter, Trophy, TrendingUp, Edit, Trash2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string;
  email: string;
  sport: string;
  level: string;
  city: string;
  created_at: string;
  user_stats: {
    elo_rating: number;
    games_played: number;
    wins: number;
    losses: number;
    skill_level: string;
    user_emoji: string;
  }[];
}

interface UserManagementProps {
  onBack: () => void;
  refreshKey?: number;
}

const UserManagement = ({ onBack, refreshKey }: UserManagementProps) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sportFilter, setSportFilter] = useState("all");

  useEffect(() => {
    loadUsers();
  }, [refreshKey]);

  const loadUsers = async () => {
    console.log('🔍 UserManagement: Iniziando caricamento utenti...');
    
    // Verifica autenticazione
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('🔐 UserManagement: Session check:', { session: !!session, sessionError });
    
    if (sessionError || !session) {
      console.error('❌ UserManagement: Session error:', sessionError);
      toast.error("Errore di autenticazione");
      return;
    }
    
    try {
      // Prima query per ottenere tutti gli utenti
      console.log('📋 UserManagement: Eseguendo query utenti...');
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, email, sport, level, city, created_at')
        .order('name');

      console.log('📊 UserManagement: Risultato query utenti:', { usersData, usersError, count: usersData?.length });

      if (usersError) {
        console.error('❌ UserManagement: Error loading users:', usersError);
        toast.error("Errore nel caricamento utenti: " + usersError.message);
        return;
      }

      if (!usersData || usersData.length === 0) {
        console.log('⚠️ UserManagement: Nessun utente trovato');
        setUsers([]);
        return;
      }

      // Seconda query per ottenere le statistiche per ogni utente
      const usersWithStats = await Promise.all(
        usersData?.map(async (user) => {
          const { data: stats } = await supabase
            .from('user_stats')
            .select('elo_rating, games_played, wins, losses, skill_level, user_emoji')
            .eq('user_id', user.id)
            .single();
          
          return {
            ...user,
            user_stats: stats ? [stats] : [{
              elo_rating: 1200,
              games_played: 0,
              wins: 0,
              losses: 0,
              skill_level: 'principiante',
              user_emoji: '😊'
            }]
          };
        }) || []
      );

      setUsers(usersWithStats);
    } catch (error) {
      console.error('Error in loadUsers:', error);
      toast.error("Errore nel caricamento utenti");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "all" || user.level === levelFilter;
    const matchesSport = sportFilter === "all" || user.sport === sportFilter;
    
    return matchesSearch && matchesLevel && matchesSport;
  });

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'principiante': return 'bg-green-500';
      case 'intermedio': return 'bg-yellow-500';
      case 'avanzato': return 'bg-orange-500';
      case 'esperto': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelEmoji = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'principiante': return '🟢';
      case 'intermedio': return '🟡';
      case 'avanzato': return '🟠';
      case 'esperto': return '🔴';
      default: return '⚪';
    }
  };

  const getSportEmoji = (sport: string) => {
    switch (sport?.toLowerCase()) {
      case 'padel': return '🎾';
      case 'tennis': return '🎾';
      case 'calcio': return '⚽';
      default: return '🏃';
    }
  };

  const handleEditUser = (userId: string) => {
    toast.info(`Modifica utente - Funzionalità in sviluppo`);
  };

  const handleDeleteUser = (userId: string) => {
    toast.info(`Elimina utente - Funzionalità in sviluppo`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            onClick={onBack}
            variant="outline" 
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alla Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Users className="w-8 h-8" />
              Gestione Utenti
            </h1>
            <p className="text-blue-200">Gestisci tutti gli utenti registrati nella piattaforma</p>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{filteredUsers.length}</div>
          <div className="text-blue-200 text-sm">Utenti Totali</div>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-card border-white/30 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtri di Ricerca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Cerca per nome/email</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
                <Input
                  placeholder="Cerca utenti..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 border-white/30 text-white pl-10 placeholder:text-blue-200"
                />
              </div>
            </div>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Filtra per livello</label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <SelectValue placeholder="Tutti i livelli" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">Tutti i livelli</SelectItem>
                  <SelectItem value="principiante">🟢 Principiante</SelectItem>
                  <SelectItem value="intermedio">🟡 Intermedio</SelectItem>
                  <SelectItem value="avanzato">🟠 Avanzato</SelectItem>
                  <SelectItem value="esperto">🔴 Esperto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Filtra per sport</label>
              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <SelectValue placeholder="Tutti gli sport" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">Tutti gli sport</SelectItem>
                  <SelectItem value="padel">🎾 Padel</SelectItem>
                  <SelectItem value="tennis">🎾 Tennis</SelectItem>
                  <SelectItem value="calcio">⚽ Calcio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="glass-card border-white/30">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-white/5">
                  <TableHead className="text-blue-200 font-semibold">Utente</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Sport</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Livello</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Rating ELO</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Partite</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Win Rate</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Città</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const stats = user.user_stats?.[0] || {
                    elo_rating: 1200,
                    games_played: 0,
                    wins: 0,
                    losses: 0,
                    skill_level: 'principiante',
                    user_emoji: '😊'
                  };

                  return (
                    <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 bg-white/20">
                            <AvatarFallback className="text-white text-lg">
                              {stats.user_emoji || user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-blue-300 text-sm">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getSportEmoji(user.sport)}</span>
                          <span className="text-white capitalize">{user.sport}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={`${getLevelColor(user.level)} text-white`}>
                          {getLevelEmoji(user.level)} {user.level}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-bold">{stats.elo_rating}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-white font-medium">{stats.games_played}</div>
                        <div className="text-green-400 text-xs">
                          {stats.wins}V - {stats.losses}S
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 font-medium">
                            {stats.games_played > 0 
                              ? Math.round((stats.wins / stats.games_played) * 100)
                              : 0}%
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-blue-300 capitalize">{user.city}</span>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditUser(user.id)}
                            size="sm"
                            variant="outline"
                            className="border-white/30 text-white hover:bg-white/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteUser(user.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-400 text-red-400 hover:bg-red-400/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-white text-xl font-semibold mb-2">Nessun utente trovato</h3>
          <p className="text-blue-200">Modifica i filtri di ricerca per trovare gli utenti</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;