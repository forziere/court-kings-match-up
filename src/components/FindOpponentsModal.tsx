import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Star, MapPin, Users, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Opponent {
  id: string;
  name: string;
  sport: string;
  level: string;
  city: string;
  user_stats: {
    elo_rating: number;
    games_played: number;
    wins: number;
    skill_level: string;
    user_emoji: string;
  }[];
}

interface FindOpponentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  refreshKey?: number;
}

const FindOpponentsModal = ({ isOpen, onClose, user, refreshKey }: FindOpponentsModalProps) => {
  const [opponents, setOpponents] = useState<Opponent[]>([]);
  const [loading, setLoading] = useState(false);
  // Aggiunge un timestamp per forzare il refresh dei dati  
  const [dataTimestamp, setDataTimestamp] = useState(Date.now());
  // Traccia l'ultimo refreshKey processato
  const [lastRefreshKey, setLastRefreshKey] = useState(0);

  useEffect(() => {
    console.log('🔍 FindOpponentsModal: useEffect triggered - isOpen:', isOpen, 'user:', !!user, 'refreshKey:', refreshKey, 'lastRefreshKey:', lastRefreshKey);
    
    if (isOpen && user) {
      // Se il refreshKey è cambiato o è la prima volta che si apre
      if (refreshKey !== lastRefreshKey || lastRefreshKey === 0) {
        console.log('🔍 FindOpponentsModal: Loading opponents with refreshKey:', refreshKey, '(was:', lastRefreshKey, ')');
        findOpponents();
        setLastRefreshKey(refreshKey || 0);
      } else {
        console.log('🔍 FindOpponentsModal: No refresh needed, refreshKey unchanged');
      }
    }
    // Non modifico lastRefreshKey quando il modal è chiuso
  }, [isOpen, user, refreshKey]);

  const findOpponents = async () => {
    setLoading(true);
    try {
      console.log('🔍 FindOpponentsModal: Starting findOpponents for user:', user.name);
      
      // Cerca utenti con sport e livello simili
      const { data: potentialOpponents, error } = await supabase
        .from('users')
        .select('id, name, sport, level, city')
        .eq('sport', user.sport)
        .eq('city', user.city)
        .neq('id', user.id)
        .limit(10);

      console.log('📋 FindOpponentsModal: Found potential opponents:', potentialOpponents?.length, potentialOpponents);

      if (error) {
        console.error('Error finding opponents:', error);
        toast.error("Errore nella ricerca avversari");
        setLoading(false);
        return;
      }

      // Ottieni le statistiche per ogni utente
      const opponentsWithStats = await Promise.all(
        potentialOpponents?.map(async (opponent) => {
          console.log('📊 FindOpponentsModal: Loading stats for:', opponent.name, 'ID:', opponent.id);
          const { data: stats } = await supabase
            .from('user_stats')
            .select('elo_rating, games_played, wins, skill_level, user_emoji')
            .eq('user_id', opponent.id)
            .maybeSingle();
          
          console.log('📊 FindOpponentsModal: Stats for', opponent.name, ':', stats);
          
          return {
            ...opponent,
            user_stats: stats ? [stats] : [{
              elo_rating: 1200,
              games_played: 0,
              wins: 0,
              skill_level: 'principiante',
              user_emoji: '😊'
            }]
          };
        }) || []
      );

      // Filtra per rating simile
      const userRating = user.rating || 1200;
      const filteredOpponents = opponentsWithStats
        .filter(opponent => {
          const opponentRating = opponent.user_stats[0].elo_rating;
          const ratingDiff = Math.abs(userRating - opponentRating);
          return ratingDiff <= 200;
        })
        .sort((a, b) => {
          const aDiff = Math.abs(userRating - a.user_stats[0].elo_rating);
          const bDiff = Math.abs(userRating - b.user_stats[0].elo_rating);
          return aDiff - bDiff;
        });

      console.log('🎯 FindOpponentsModal: Setting opponents array with', filteredOpponents.length, 'opponents');
      
      // Forza un re-render completo creando un nuovo array
      setOpponents([...filteredOpponents]);
      
      console.log('✅ FindOpponentsModal: Opponents updated successfully');
      
      if (filteredOpponents.length === 0) {
        toast.info("Nessun avversario trovato con il tuo livello in questo momento");
      } else {
        toast.success(`Trovati ${filteredOpponents.length} avversari compatibili!`);
      }
      
    } catch (error) {
      console.error('Error in findOpponents:', error);
      toast.error("Errore nella ricerca avversari");
    } finally {
      setLoading(false);
    }
  };

  const handleChallenge = (opponent: Opponent) => {
    toast.success(`Sfida inviata a ${opponent.name}! Ti contatterà presto.`);
    // TODO: Implementare sistema di notifiche/messaggi
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl flex items-center gap-2">
            <Users className="w-6 h-6" />
            Trova Avversari - {user?.sport?.charAt(0).toUpperCase() + user?.sport?.slice(1)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header Info */}
          <Card className="glass-card border-white/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 bg-white/20">
                    <AvatarFallback className="text-white font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user?.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-blue-200">
                      <Badge className={`${getLevelColor(user?.level)} text-white`}>
                        {getLevelEmoji(user?.level)} {user?.level}
                      </Badge>
                      <span>Rating: {user?.rating || 1200}</span>
                      <MapPin className="w-4 h-4" />
                      <span>{user?.city}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={findOpponents} 
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700"
                >
                  {loading ? "Ricerca..." : "🔄 Aggiorna"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white ml-3">Cercando avversari...</span>
            </div>
          ) : opponents.length === 0 ? (
            <Card className="glass-card border-white/30">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-white text-xl font-semibold mb-2">Nessun avversario trovato</h3>
                <p className="text-blue-200">
                  Non ci sono giocatori disponibili con il tuo livello in questo momento.
                  Prova più tardi o invita i tuoi amici!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opponents.map((opponent) => (
                <Card key={opponent.id} className="glass-card border-white/30 hover:border-white/50 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 bg-white/20">
                          <AvatarFallback className="text-white text-lg">
                            {opponent.user_stats?.[0]?.user_emoji || opponent.name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-white text-lg">{opponent.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm">
                            <Badge className={`${getLevelColor(opponent.level)} text-white text-xs`}>
                              {getLevelEmoji(opponent.level)} {opponent.level}
                            </Badge>
                            <MapPin className="w-3 h-3 text-blue-300" />
                            <span className="text-blue-300">{opponent.city}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white/10 rounded-lg p-2">
                          <div className="text-yellow-400 font-bold">{opponent.user_stats?.[0]?.elo_rating || 1200}</div>
                          <div className="text-xs text-blue-200">Rating</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2">
                          <div className="text-green-400 font-bold">{opponent.user_stats?.[0]?.games_played || 0}</div>
                          <div className="text-xs text-blue-200">Partite</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2">
                          <div className="text-blue-400 font-bold">
                            {opponent.user_stats?.[0]?.games_played > 0 
                              ? Math.round((opponent.user_stats[0].wins / opponent.user_stats[0].games_played) * 100) 
                              : 0}%
                          </div>
                          <div className="text-xs text-blue-200">Win Rate</div>
                        </div>
                      </div>

                      {/* Compatibility */}
                      <div className="bg-white/5 rounded-lg p-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-blue-200">Compatibilità:</span>
                          <div className="flex items-center gap-1">
                            {Math.abs((user?.rating || 1200) - (opponent.user_stats?.[0]?.elo_rating || 1200)) <= 50 && (
                              <>
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              </>
                            )}
                            {Math.abs((user?.rating || 1200) - (opponent.user_stats?.[0]?.elo_rating || 1200)) <= 100 && 
                             Math.abs((user?.rating || 1200) - (opponent.user_stats?.[0]?.elo_rating || 1200)) > 50 && (
                              <>
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <Star className="w-4 h-4 text-gray-400" />
                              </>
                            )}
                            {Math.abs((user?.rating || 1200) - (opponent.user_stats?.[0]?.elo_rating || 1200)) > 100 && (
                              <>
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <Star className="w-4 h-4 text-gray-400" />
                                <Star className="w-4 h-4 text-gray-400" />
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          onClick={() => handleChallenge(opponent)}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                          size="sm"
                        >
                          <Trophy className="w-4 h-4 mr-1" />
                          Sfida
                        </Button>
                        <Button 
                          onClick={() => toast.info("Funzionalità messaggi in arrivo!")}
                          variant="outline" 
                          className="border-white/30 text-white hover:bg-white/10"
                          size="sm"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-white/20">
          <Button onClick={onClose} variant="outline" className="border-white/30 text-white hover:bg-white/10">
            Chiudi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FindOpponentsModal;