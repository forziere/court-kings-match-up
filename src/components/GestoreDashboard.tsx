import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock,
  Plus,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TodayBooking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total_amount: number;
  sports_facilities: {
    name: string;
    sport: string;
  };
}

const GestoreDashboard = ({ user, onBack }) => {
  const [todayBookings, setTodayBookings] = useState<TodayBooking[]>([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    cliente_nome: '',
    cliente_cognome: '',
    campo_id: '',
    data_prenotazione: '',
    ora_inizio: '',
    ora_fine: '',
    note: ''
  });

  useEffect(() => {
    loadGestoreData();
  }, []);

  const loadGestoreData = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        toast.error("Errore di autenticazione");
        return;
      }

      // Carica prenotazioni di oggi
      const { data: dashboardData, error: dashboardError } = await supabase.functions.invoke('auth-dashboard', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: { type: 'gestore' }
      });

      if (dashboardError) {
        console.error('Error loading gestore data:', dashboardError);
      } else {
        setTodayBookings(dashboardData.prenotazioni || []);
      }

      // Carica lista campi
      const { data: facilitiesData, error: facilitiesError } = await supabase
        .from('sports_facilities')
        .select('id, name, sport, location')
        .order('name');

      if (facilitiesError) {
        console.error('Error loading facilities:', facilitiesError);
        toast.error("Errore nel caricamento campi");
      } else {
        setFacilities(facilitiesData || []);
      }

    } catch (error) {
      console.error('Gestore dashboard error:', error);
      toast.error("Errore nel caricamento dati");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    
    if (!formData.campo_id || !formData.data_prenotazione || !formData.ora_inizio || !formData.ora_fine) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    try {
      const { data: session } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('create-booking-management', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: {
          facility_id: formData.campo_id,
          booking_date: formData.data_prenotazione,
          start_time: formData.ora_inizio,
          end_time: formData.ora_fine,
          notes: formData.note
        }
      });

      if (error) {
        console.error('Booking creation error:', error);
        toast.error("Errore nella creazione prenotazione");
        return;
      }

      toast.success("Prenotazione creata con successo!");
      setFormData({
        cliente_nome: '',
        cliente_cognome: '',
        campo_id: '',
        data_prenotazione: '',
        ora_inizio: '',
        ora_fine: '',
        note: ''
      });
      loadGestoreData(); // Ricarica i dati

    } catch (error) {
      console.error('Create booking error:', error);
      toast.error("Errore nella creazione prenotazione");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confermata';
      case 'pending': return 'In Attesa';
      case 'cancelled': return 'Annullata';
      default: return status;
    }
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">🏢 Gestore Dashboard</h1>
                <p className="text-blue-200 text-sm">Gestione prenotazioni e campi</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Form Nuova Prenotazione */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-card border-white/20 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Nuova Prenotazione
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Crea una prenotazione per un client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateBooking} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cliente_nome" className="text-white">Nome Cliente</Label>
                      <Input
                        id="cliente_nome"
                        value={formData.cliente_nome}
                        onChange={(e) => setFormData({...formData, cliente_nome: e.target.value})}
                        placeholder="Nome"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cliente_cognome" className="text-white">Cognome Cliente</Label>
                      <Input
                        id="cliente_cognome"
                        value={formData.cliente_cognome}
                        onChange={(e) => setFormData({...formData, cliente_cognome: e.target.value})}
                        placeholder="Cognome"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="campo_id" className="text-white">Campo *</Label>
                    <Select 
                      value={formData.campo_id} 
                      onValueChange={(value) => setFormData({...formData, campo_id: value})}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Seleziona campo..." />
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.map((facility: any) => (
                          <SelectItem key={facility.id} value={facility.id}>
                            {facility.name} - {facility.sport}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="data_prenotazione" className="text-white">Data *</Label>
                    <Input
                      id="data_prenotazione"
                      type="date"
                      value={formData.data_prenotazione}
                      onChange={(e) => setFormData({...formData, data_prenotazione: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ora_inizio" className="text-white">Ora Inizio *</Label>
                      <Select 
                        value={formData.ora_inizio} 
                        onValueChange={(value) => setFormData({...formData, ora_inizio: value})}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Seleziona..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">09:00</SelectItem>
                          <SelectItem value="10:30">10:30</SelectItem>
                          <SelectItem value="12:00">12:00</SelectItem>
                          <SelectItem value="14:00">14:00</SelectItem>
                          <SelectItem value="15:30">15:30</SelectItem>
                          <SelectItem value="17:00">17:00</SelectItem>
                          <SelectItem value="18:30">18:30</SelectItem>
                          <SelectItem value="20:00">20:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ora_fine" className="text-white">Ora Fine *</Label>
                      <Select 
                        value={formData.ora_fine} 
                        onValueChange={(value) => setFormData({...formData, ora_fine: value})}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Seleziona..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10:30">10:30</SelectItem>
                          <SelectItem value="12:00">12:00</SelectItem>
                          <SelectItem value="13:30">13:30</SelectItem>
                          <SelectItem value="15:30">15:30</SelectItem>
                          <SelectItem value="17:00">17:00</SelectItem>
                          <SelectItem value="18:30">18:30</SelectItem>
                          <SelectItem value="20:00">20:00</SelectItem>
                          <SelectItem value="21:30">21:30</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="note" className="text-white">Note</Label>
                    <Textarea
                      id="note"
                      value={formData.note}
                      onChange={(e) => setFormData({...formData, note: e.target.value})}
                      placeholder="Note aggiuntive (opzionale)"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Conferma Prenotazione
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Prenotazioni di Oggi */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card border-white/20 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Prenotazioni di Oggi
                </CardTitle>
                <CardDescription className="text-blue-200">
                  {todayBookings.length} prenotazioni programmate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {todayBookings.length > 0 ? todayBookings.map((booking) => (
                  <div key={booking.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{booking.sports_facilities?.name}</p>
                          <p className="text-blue-200 text-sm">{booking.sports_facilities?.sport}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(booking.status)} text-white`}>
                        {getStatusText(booking.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-blue-200">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.start_time} - {booking.end_time}
                      </span>
                      <span className="flex items-center gap-1">
                        €{(booking.total_amount / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <p className="text-blue-200">Nessuna prenotazione oggi</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Azioni Rapide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => toast.success("Visualizzazione prenotazioni in corso...")}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-16 flex-col gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Visualizza Prenotazioni
                </Button>
                
                <Button 
                  onClick={() => toast.success("Gestione orari in corso...")}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 h-16 flex-col gap-2"
                >
                  <Clock className="w-5 h-5" />
                  Gestione Orari
                </Button>
                
                <Button 
                  onClick={() => toast.success("Report campi in corso...")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-16 flex-col gap-2"
                >
                  <Building2 className="w-5 h-5" />
                  Report Campi
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default GestoreDashboard;