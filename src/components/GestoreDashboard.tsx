import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    campo_id: '',
    data_prenotazione: '',
    ora_inizio: '',
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
    
    if (!formData.campo_id || !formData.data_prenotazione || !formData.ora_inizio) {
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
          end_time: calculateEndTime(formData.ora_inizio),
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
        campo_id: '',
        data_prenotazione: '',
        ora_inizio: '',
        note: ''
      });
      loadGestoreData();

    } catch (error) {
      console.error('Create booking error:', error);
      toast.error("Errore nella creazione prenotazione");
    }
  };

  const calculateEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + 1;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Genera calendario del mese corrente
  const generateCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const calendar = [];
    const weekdays = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
    
    // Aggiungi i giorni del mese
    for (let day = 1; day <= daysInMonth; day++) {
      const isAvailable = Math.random() > 0.3; // Simula disponibilità
      calendar.push({
        day,
        isAvailable,
        isToday: day === today.getDate()
      });
    }
    
    return { calendar, weekdays, startingDayOfWeek };
  };

  const { calendar, weekdays, startingDayOfWeek } = generateCalendar();

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
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="text-4xl">🏆</div>
          <h1 className="text-4xl font-bold text-white">Sport Connect</h1>
        </div>
        <p className="text-blue-200 text-lg">La piattaforma completa per la gestione dei tuoi campi sportivi</p>
        
        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mt-6">
          <Button 
            onClick={onBack}
            variant="outline" 
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            👑 Admin
          </Button>
          <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold">
            📋 Gestore Campi
          </Button>
          <Button 
            onClick={onBack}
            variant="outline" 
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            👤 Utente
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Nuova Prenotazione */}
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-2">
              📋 Nuova Prenotazione
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateBooking} className="space-y-6">
              <div>
                <Label className="text-white font-medium">Nome Cliente</Label>
                <Input
                  placeholder="Inserisci nome cliente"
                  value={formData.cliente_nome}
                  onChange={(e) => setFormData({...formData, cliente_nome: e.target.value})}
                  className="bg-white/10 border-white/30 text-white placeholder:text-blue-200 mt-2"
                />
              </div>

              <div>
                <Label className="text-white font-medium">Selezione Campo</Label>
                <Select onValueChange={(value) => setFormData({...formData, campo_id: value})}>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white mt-2">
                    <SelectValue placeholder="Scegli campo..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {facilities.map((facility: any) => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.name} - {facility.sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white font-medium">Data</Label>
                <Input
                  type="date"
                  value={formData.data_prenotazione}
                  onChange={(e) => setFormData({...formData, data_prenotazione: e.target.value})}
                  className="bg-white/10 border-white/30 text-white mt-2"
                />
              </div>

              <div>
                <Label className="text-white font-medium">Orario</Label>
                <Select onValueChange={(value) => setFormData({...formData, ora_inizio: value})}>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white mt-2">
                    <SelectValue placeholder="Seleziona orario..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="09:00">09:00 - 10:00</SelectItem>
                    <SelectItem value="10:00">10:00 - 11:00</SelectItem>
                    <SelectItem value="11:00">11:00 - 12:00</SelectItem>
                    <SelectItem value="14:00">14:00 - 15:00</SelectItem>
                    <SelectItem value="15:00">15:00 - 16:00</SelectItem>
                    <SelectItem value="16:00">16:00 - 17:00</SelectItem>
                    <SelectItem value="17:00">17:00 - 18:00</SelectItem>
                    <SelectItem value="18:00">18:00 - 19:00</SelectItem>
                    <SelectItem value="19:00">19:00 - 20:00</SelectItem>
                    <SelectItem value="20:00">20:00 - 21:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white font-medium">Note</Label>
                <Textarea
                  placeholder="Note aggiuntive (opzionale)"
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                  className="bg-white/10 border-white/30 text-white placeholder:text-blue-200 mt-2 min-h-20"
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white font-semibold py-3 text-lg"
              >
                ✅ CONFERMA PRENOTAZIONE
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Calendario Prenotazioni */}
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-2">
              📅 Calendario Prenotazioni
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Giorni della settimana */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekdays.map((day, index) => (
                <div key={index} className="text-center text-white font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendario */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {/* Spazi vuoti per l'inizio del mese */}
              {Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }).map((_, index) => (
                <div key={`empty-${index}`} className="h-12"></div>
              ))}
              
              {/* Giorni del mese */}
              {calendar.map((dayInfo) => (
                <div
                  key={dayInfo.day}
                  className={`h-12 flex items-center justify-center rounded-lg text-white font-medium cursor-pointer transition-all ${
                    dayInfo.isAvailable 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                  } ${dayInfo.isToday ? 'ring-2 ring-white' : ''}`}
                >
                  {dayInfo.day}
                </div>
              ))}
            </div>

            {/* Legenda */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded"></div>
                <span className="text-green-300">Disponibile</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded"></div>
                <span className="text-red-300">Prenotato</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pulsanti Azione */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
        <Button 
          onClick={() => toast.success("Visualizzazione prenotazioni...")}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 text-lg"
        >
          📋 VISUALIZZA PRENOTAZIONI
        </Button>
        <Button 
          onClick={() => toast.success("Gestione orari...")}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 text-lg"
        >
          🕒 GESTIONE ORARI
        </Button>
        <Button 
          onClick={() => toast.success("Report campi...")}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 text-lg"
        >
          📊 REPORT CAMPI
        </Button>
      </div>
    </div>
  );
};

export default GestoreDashboard;