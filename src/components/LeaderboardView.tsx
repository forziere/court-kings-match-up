import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Trophy, 
  Medal, 
  Crown,
  Star,
  TrendingUp,
  Award,
  Target,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const LeaderboardView = ({ user, onBack }) => {
  // Query per ottenere la leaderboard
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_stats')
        .select(`
          *,
          users!inner(name, email)
        `)
        .order('points', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Query per le statistiche personali
  const { data: userStats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'first_win': return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'streak_5': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'perfect_week': return <Star className="w-4 h-4 text-purple-500" />;
      case 'social_butterfly': return <Target className="w-4 h-4 text-pink-500" />;
      default: return <Award className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBadgeName = (badge) => {
    switch (badge) {
      case 'first_win': return 'Prima Vittoria';
      case 'streak_5': return 'Striscia di 5';
      case 'perfect_week': return 'Settimana Perfetta';
      case 'social_butterfly': return 'Social Butterfly';
      default: return badge;
    }
  };

  const getRankIcon = (position) => {
    if (position === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (position === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (position === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-xl font-bold text-white">#{position}</span>;
  };

  const calculateWinRate = (wins, totalGames) => {
    if (totalGames === 0) return 0;
    return Math.round((wins / totalGames) * 100);
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
              <h1 className="text-2xl font-bold text-white">Classifica & Statistiche</h1>
              <p className="text-blue-200">Scopri i migliori giocatori e le tue performance</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="leaderboard">🏆 Classifica</TabsTrigger>
            <TabsTrigger value="stats">📊 Le Mie Stats</TabsTrigger>
            <TabsTrigger value="badges">🏅 Badge & Achievement</TabsTrigger>
          </TabsList>

          {/* Leaderboard */}
          <TabsContent value="leaderboard">
            <div className="space-y-4">
              {/* Top 3 Podium */}
              {leaderboard?.slice(0, 3).length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mb-8"
                >
                  <Card className="glass-card border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white text-center">🏆 Podium</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end justify-center gap-4">
                        {leaderboard.slice(0, 3).map((player, index) => (
                          <motion.div
                            key={player.user_id}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`text-center ${index === 1 ? 'order-first' : index === 0 ? 'order-2' : 'order-3'}`}
                          >
                            <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${
                              index === 0 ? 'from-yellow-400 to-yellow-600' :
                              index === 1 ? 'from-gray-300 to-gray-500' :
                              'from-amber-500 to-amber-700'
                            } flex items-center justify-center mb-2`}>
                              {getRankIcon(index + 1)}
                            </div>
                            <div className="text-white font-semibold">{player.users.name}</div>
                            <div className="text-blue-200 text-sm">{player.points} punti</div>
                            <div className="text-green-300 text-xs">
                              {calculateWinRate(player.wins, player.games_played)}% vittorie
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Classifica completa */}
              <div className="space-y-3">
                {leaderboard?.map((player, index) => (
                  <motion.div
                    key={player.user_id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`glass-card border-white/20 hover:border-white/40 transition-all duration-300 ${
                      player.user_id === user?.id ? 'border-yellow-400/50 bg-yellow-500/10' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {index < 3 ? getRankIcon(index + 1) : `#${index + 1}`}
                            </div>
                            <div>
                              <div className="text-white font-semibold">
                                {player.users.name}
                                {player.user_id === user?.id && (
                                  <Badge className="ml-2 bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                                    Tu
                                  </Badge>
                                )}
                              </div>
                              <div className="text-blue-200 text-sm">Livello {player.level}</div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-white font-bold text-lg">{player.points}</div>
                            <div className="text-blue-200 text-sm">
                              {player.wins}W / {player.losses}L
                            </div>
                            <div className="text-green-300 text-xs">
                              {calculateWinRate(player.wins, player.games_played)}% WR
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Statistiche personali */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Partite Giocate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      {userStats?.games_played || 0}
                    </div>
                    <div className="text-blue-200 text-sm mt-1">
                      Totale partite disputate
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Percentuale Vittorie
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400">
                      {calculateWinRate(userStats?.wins || 0, userStats?.games_played || 0)}%
                    </div>
                    <div className="text-blue-200 text-sm mt-1">
                      {userStats?.wins || 0} vittorie su {userStats?.games_played || 0}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-500" />
                      Punti Totali
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-400">
                      {userStats?.points || 1000}
                    </div>
                    <div className="text-blue-200 text-sm mt-1">
                      Livello {userStats?.level || 1}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Badge e Achievement */}
          <TabsContent value="badges">
            <div className="space-y-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">🏅 I Tuoi Badge</CardTitle>
                    <CardDescription className="text-blue-200">
                      Sblocca nuovi badge giocando e migliorando le tue performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {userStats?.badges?.map((badge, index) => (
                        <motion.div
                          key={badge}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/10 rounded-lg p-4 text-center border border-white/20 hover:border-white/40 transition-colors"
                        >
                          <div className="mb-2 flex justify-center">
                            {getBadgeIcon(badge)}
                          </div>
                          <div className="text-white text-sm font-medium">
                            {getBadgeName(badge)}
                          </div>
                        </motion.div>
                      )) || (
                        <div className="col-span-full text-center text-blue-200 py-8">
                          <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Inizia a giocare per sbloccare i tuoi primi badge!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Achievement disponibili */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">🎯 Achievement da Sbloccare</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Trophy className="w-6 h-6 text-yellow-500/50" />
                        <div className="flex-1">
                          <div className="text-white font-medium">Prima Vittoria</div>
                          <div className="text-blue-200 text-sm">Vinci la tua prima partita</div>
                        </div>
                        <Badge variant="outline" className="border-yellow-400/30 text-yellow-300">
                          0/1
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Zap className="w-6 h-6 text-blue-500/50" />
                        <div className="flex-1">
                          <div className="text-white font-medium">Striscia di Vittorie</div>
                          <div className="text-blue-200 text-sm">Vinci 5 partite consecutive</div>
                        </div>
                        <Badge variant="outline" className="border-blue-400/30 text-blue-300">
                          0/5
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LeaderboardView;