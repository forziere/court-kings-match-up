import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp,
  Calendar,
  Settings,
  Plus,
  Trophy,
  Gamepad2,
  DollarSign,
  BarChart3,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminStats {
  ricavi?: {
    ricavi_totali: number;
    ricavi_mese: number;
  };
  utenti?: {
    totale_utenti: number;
    nuovi_utenti_settimana: number;
  };
  prenotazioni?: {
    prenotazioni_oggi: number;
    confermate_oggi: number;
  };
  campi?: {
    totale_campi: number;
    campi_attivi: number;
    campi_manutenzione: number;
  };
}

const AdminDashboard = ({ user, onBack }) => {
  const [stats, setStats] = useState<AdminStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        toast.error("Errore di autenticazione");
        return;
      }

      const { data, error } = await supabase.functions.invoke('auth-dashboard', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: { type: 'admin' }
      });

      if (error) {
        console.error('Error loading admin stats:', error);
        toast.error("Errore nel caricamento statistiche");
        return;
      }

      setStats(data);
    } catch (error) {
      console.error('Admin stats error:', error);
      toast.error("Errore nel caricamento dati");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    toast.success(`Funzione "${action}" - Implementazione in corso! 🚀`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Header */}
      <motion.header 
        className="relative bg-white/10 backdrop-blur-lg border-b border-white/20 text-center py-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Sport Connect</h1>
          </div>
          <p className="text-blue-200 text-lg mb-6">La piattaforma completa per la gestione dei tuoi campi sportivi</p>
          
          {/* Role Selector */}
          <div className="flex justify-center gap-4 mb-4">
            <Button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl">
              👑 Admin
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl"
              onClick={() => onBack()}
            >
              🏢 Gestore Campi
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl"
              onClick={() => onBack()}
            >
              👤 Utente
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-yellow-400" />
                  <div>
                    <h3 className="text-white font-semibold">Ricavi Totali</h3>
                  </div>
                </div>
              </div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                €{stats.ricavi?.ricavi_totali?.toFixed(2) || '0.00'}
              </div>
              <p className="text-green-400 text-sm mb-4">
                +12% rispetto al mese scorso
              </p>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <BarChart3 className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <span className="text-blue-200 text-sm">📊 Grafico Ricavi</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-400" />
                  <div>
                    <h3 className="text-white font-semibold">Utenti Registrati</h3>
                  </div>
                </div>
              </div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {stats.utenti?.totale_utenti || '0'}
              </div>
              <p className="text-blue-400 text-sm mb-4">
                +{stats.utenti?.nuovi_utenti_settimana || '0'} nuovi utenti questa settimana
              </p>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <span className="text-blue-200 text-sm">📈 Grafico Crescita Utenti</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-red-400" />
                  <div>
                    <h3 className="text-white font-semibold">Prenotazioni Oggi</h3>
                  </div>
                </div>
              </div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {stats.prenotazioni?.prenotazioni_oggi || '0'}
              </div>
              <p className="text-blue-200 text-sm mb-4">
                Confermate: {stats.prenotazioni?.confermate_oggi || '0'} | In attesa: {(stats.prenotazioni?.prenotazioni_oggi || 0) - (stats.prenotazioni?.confermate_oggi || 0)}
              </p>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <BarChart3 className="w-6 h-6 text-red-400 mx-auto mb-1" />
                <span className="text-blue-200 text-sm">📊 Utilizzo Campi</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-purple-400" />
                  <div>
                    <h3 className="text-white font-semibold">Gestione Campi</h3>
                  </div>
                </div>
              </div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {stats.campi?.totale_campi || '0'}
              </div>
              <p className="text-blue-200 text-sm mb-4">
                Campi attivi: {stats.campi?.campi_attivi || '0'} | In manutenzione: {stats.campi?.campi_manutenzione || '0'}
              </p>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Settings className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <span className="text-blue-200 text-sm">🔧 Stato Campi</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button 
            onClick={() => handleQuickAction('Gestione Utenti')}
            className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold h-16 rounded-xl text-sm uppercase tracking-wider"
          >
            👥 GESTIONE UTENTI
          </Button>
          
          <Button 
            onClick={() => handleQuickAction('Report Finanziari')}
            className="bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white font-bold h-16 rounded-xl text-sm uppercase tracking-wider"
          >
            💼 REPORT FINANZIARI
          </Button>
          
          <Button 
            onClick={() => handleQuickAction('Configurazione')}
            className="bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-bold h-16 rounded-xl text-sm uppercase tracking-wider"
          >
            ⚙️ CONFIGURAZIONE
          </Button>
          
          <Button 
            onClick={() => handleQuickAction('Backup Dati')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold h-16 rounded-xl text-sm uppercase tracking-wider"
          >
            🛡️ BACKUP DATI
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;