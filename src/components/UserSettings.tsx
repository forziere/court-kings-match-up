import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Trophy, TrendingUp, Users, BookOpen } from "lucide-react";

interface UserSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const UserSettings = ({ isOpen, onClose, user }: UserSettingsProps) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    sport: user?.sport || '',
    level: user?.level || '',
    city: user?.city || 'lucca',
    preferred_position: '',
    frequent_partners: '',
    elo_rating: 1000,
    games_played: 0,
    wins: 0,
    losses: 0
  });

  const [gameplayTips, setGameplayTips] = useState({
    padel: '',
    tennis: '',
    calcio: ''
  });

  useEffect(() => {
    if (user) {
      loadUserStats();
      loadGameplayTips();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setFormData(prev => ({
          ...prev,
          elo_rating: data.elo_rating || 1000,
          games_played: data.games_played || 0,
          wins: data.wins || 0,
          losses: data.losses || 0
        }));
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadGameplayTips = () => {
    const tips = {
      padel: `🎾 CONSIGLI PADEL:
• Posizione in campo: Mantieni sempre la posizione parallela al tuo compagno
• Servizio: Serve sempre sottobraccio, fai rimbalzare la palla prima di colpirla
• Strategia: Gioca verso il centro per creare aperture laterali
• Muri: Usa le pareti per angoli difficili, ma attento al rimbalzo
• Comunicazione: Parla sempre con il partner per coordinare i movimenti`,
      
      tennis: `🎾 CONSIGLI TENNIS:
• Postura: Piedi alla larghezza delle spalle, peso sui piedi
• Dritto: Ruota le spalle, segui il movimento completo
• Rovescio: Usa entrambe le mani per più controllo e potenza
• Servizio: Lancia la palla alta e colpisci nel punto più alto
• Posizionamento: Torna sempre al centro dopo ogni colpo`,
      
      calcio: `⚽ CONSIGLI CALCIO:
• Controllo palla: Prima tocca con la parte interna del piede
• Passaggio: Mira sempre al piede del compagno più vicino
• Tiro: Usa l'interno del piede per precisione, collo per potenza
• Difesa: Mantieni sempre la posizione tra l'avversario e la porta
• Condizione fisica: Corsa continua, cambi di ritmo sono fondamentali`
    };
    setGameplayTips(tips);
  };

  const handleSave = async () => {
    try {
      // Aggiorna profilo utente
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          sport: formData.sport,
          level: formData.level,
          city: formData.city
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Aggiorna o crea user_stats
      const { error: statsError } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          elo_rating: formData.elo_rating,
          games_played: formData.games_played,
          wins: formData.wins,
          losses: formData.losses,
          preferred_times: formData.frequent_partners ? [formData.frequent_partners] : []
        });

      if (statsError) throw statsError;

      toast.success("Impostazioni salvate con successo!");
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Errore nel salvataggio delle impostazioni");
    }
  };

  const updateEloRating = (isWin: boolean) => {
    const change = isWin ? 0.1 : -0.2;
    setFormData(prev => ({
      ...prev,
      elo_rating: Math.max(0, prev.elo_rating + change),
      games_played: prev.games_played + 1,
      wins: isWin ? prev.wins + 1 : prev.wins,
      losses: isWin ? prev.losses : prev.losses + 1
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl flex items-center gap-2">
            <User className="w-6 h-6" />
            Impostazioni Profilo
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10">
            <TabsTrigger value="profile" className="text-white">👤 Profilo</TabsTrigger>
            <TabsTrigger value="stats" className="text-white">📊 Statistiche</TabsTrigger>
            <TabsTrigger value="tips" className="text-white">💡 Consigli</TabsTrigger>
            <TabsTrigger value="social" className="text-white">👥 Social</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="glass-card border-white/30">
              <CardHeader>
                <CardTitle className="text-white">Informazioni Personali</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Nome</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                      className="bg-white/10 border-white/30 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Città</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({...prev, city: e.target.value}))}
                      className="bg-white/10 border-white/30 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Sport Principale</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({...prev, sport: value}))}>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder={formData.sport || "Seleziona sport"} />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="padel">🎾 Padel</SelectItem>
                        <SelectItem value="tennis">🎾 Tennis</SelectItem>
                        <SelectItem value="calcio">⚽ Calcio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">Livello</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({...prev, level: value}))}>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder={formData.level || "Seleziona livello"} />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="principiante">🟢 Principiante</SelectItem>
                        <SelectItem value="intermedio">🟡 Intermedio</SelectItem>
                        <SelectItem value="avanzato">🟠 Avanzato</SelectItem>
                        <SelectItem value="esperto">🔴 Esperto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(formData.sport === 'padel' || formData.sport === 'tennis') && (
                  <div>
                    <Label className="text-white">Posizione Preferita</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({...prev, preferred_position: value}))}>
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Seleziona posizione" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="destra">↗️ Destra</SelectItem>
                        <SelectItem value="sinistra">↖️ Sinistra</SelectItem>
                        <SelectItem value="entrambe">↔️ Entrambe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label className="text-white">Partner di Gioco Frequenti</Label>
                  <Textarea
                    placeholder="Inserisci i nomi dei tuoi partner di gioco abituali..."
                    value={formData.frequent_partners}
                    onChange={(e) => setFormData(prev => ({...prev, frequent_partners: e.target.value}))}
                    className="bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-card border-white/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Rating ELO
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {formData.elo_rating.toFixed(1)}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => updateEloRating(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      ✅ Vittoria (+0.1)
                    </Button>
                    <Button 
                      onClick={() => updateEloRating(false)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      size="sm"
                    >
                      ❌ Sconfitta (-0.2)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Statistiche
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-white">
                    <span>Partite Giocate:</span>
                    <Badge variant="secondary">{formData.games_played}</Badge>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Vittorie:</span>
                    <Badge className="bg-green-600">{formData.wins}</Badge>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Sconfitte:</span>
                    <Badge className="bg-red-600">{formData.losses}</Badge>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Win Rate:</span>
                    <Badge variant="outline" className="text-white border-white">
                      {formData.games_played > 0 ? ((formData.wins / formData.games_played) * 100).toFixed(1) : 0}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            {Object.entries(gameplayTips).map(([sport, tips]) => (
              <Card key={sport} className="glass-card border-white/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Consigli per {sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-blue-200 whitespace-pre-wrap text-sm font-mono">
                    {tips}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card className="glass-card border-white/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Chat & Comunicazione
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-blue-200 mb-4">
                  Connettiti con altri giocatori della community Sport Connect!
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                    💬 Chat Community
                  </Button>
                  <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                    📱 WhatsApp Group
                  </Button>
                </div>
                
                <div className="text-sm text-blue-300 bg-white/5 p-3 rounded-lg">
                  <strong>📧 Email:</strong> filippomori69@gmail.com<br/>
                  <strong>📱 WhatsApp:</strong> Clicca il bottone sopra per unirti al gruppo
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t border-white/20">
          <Button onClick={onClose} variant="outline" className="border-white/30 text-white hover:bg-white/10">
            Annulla
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            💾 Salva Impostazioni
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettings;