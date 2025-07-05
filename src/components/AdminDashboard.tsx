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
        className="relative bg-white/10 backdrop-blur-lg border-b border-white/20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">👑 Admin Dashboard</h1>
                <p className="text-blue-200 text-sm">Gestione completa del sistema</p>
              </div>
            </div>
            <Button 
              onClick={onBack}
              variant="ghost" 
              className="text-white hover:bg-white/20"
            >
              ← Torna alla Dashboard
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Ricavi Totali</p>
                  <p className="text-2xl font-bold text-white">
                    €{stats.ricavi?.ricavi_totali?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-green-400 text-xs">
                    +€{stats.ricavi?.ricavi_mese?.toFixed(2) || '0.00'} questo mese
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Utenti Registrati</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.utenti?.totale_utenti || 0}
                  </p>
                  <p className="text-blue-400 text-xs">
                    +{stats.utenti?.nuovi_utenti_settimana || 0} questa settimana
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Prenotazioni Oggi</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.prenotazioni?.prenotazioni_oggi || 0}
                  </p>
                  <p className="text-yellow-400 text-xs">
                    {stats.prenotazioni?.confermate_oggi || 0} confermate
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Gestione Campi</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.campi?.totale_campi || 0}
                  </p>
                  <p className="text-green-400 text-xs">
                    {stats.campi?.campi_attivi || 0} attivi | {stats.campi?.campi_manutenzione || 0} manutenzione
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Ricavi Mensili
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-white text-lg font-semibold">📊 Grafico Ricavi</p>
                  <p className="text-blue-200 text-sm">Trend in crescita del 12%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Crescita Utenti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-white text-lg font-semibold">📈 Crescita Utenti</p>
                  <p className="text-blue-200 text-sm">+45 nuovi utenti questa settimana</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Azioni Rapide</CardTitle>
              <CardDescription className="text-blue-200">
                Gestione completa del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  onClick={() => handleQuickAction('Gestione Utenti')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-16 flex-col gap-2"
                >
                  <Users className="w-5 h-5" />
                  Gestione Utenti
                </Button>
                
                <Button 
                  onClick={() => handleQuickAction('Report Finanziari')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 h-16 flex-col gap-2"
                >
                  <DollarSign className="w-5 h-5" />
                  Report Finanziari
                </Button>
                
                <Button 
                  onClick={() => handleQuickAction('Configurazione Sistema')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-16 flex-col gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Configurazione
                </Button>
                
                <Button 
                  onClick={() => handleQuickAction('Backup Dati')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 h-16 flex-col gap-2"
                >
                  <Activity className="w-5 h-5" />
                  Backup Dati
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;