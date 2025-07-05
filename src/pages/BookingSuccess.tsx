import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, MapPin, Clock, Euro, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Recupera i dati della prenotazione dalla sessionStorage
    const pendingBooking = sessionStorage.getItem('pending_booking');
    if (pendingBooking) {
      const data = JSON.parse(pendingBooking);
      setBookingData(data);
      sessionStorage.removeItem('pending_booking');
      toast.success("Prenotazione completata con successo!");
    } else {
      toast.error("Dati prenotazione non trovati");
      navigate('/');
    }
  }, [sessionId, navigate]);

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-white/30 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            
            <CardTitle className="text-2xl gradient-text mb-2">
              Prenotazione Completata!
            </CardTitle>
            
            <CardDescription className="text-blue-200">
              Il campo è stato prenotato con successo. Ti aspettiamo per la partita!
            </CardDescription>
          </CardHeader>

          <CardContent>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {bookingData && (
                <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/30 rounded-lg p-4 mb-6">
                  <h3 className="text-green-200 font-semibold mb-3">Dettagli Prenotazione</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-100 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{bookingData.fieldName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-100 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(bookingData.date).toLocaleDateString('it-IT')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-100 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{bookingData.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-100 text-sm">
                      <Euro className="w-4 h-4" />
                      <span>€{bookingData.amount} pagati</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 mb-6">
                <h4 className="text-blue-200 font-medium mb-2">Cosa fare ora?</h4>
                <ul className="text-blue-100 text-sm space-y-1">
                  <li>✅ Segna la data sul calendario</li>
                  <li>✅ Porta la tua attrezzatura sportiva</li>
                  <li>✅ Arriva 10 minuti prima dell'orario</li>
                  <li>✅ Divertiti e gioca al meglio!</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleBackToHome}
                className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white py-3 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Torna alla dashboard
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;