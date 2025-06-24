
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      toast.error("Session ID mancante");
      navigate('/');
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      console.log("🔍 Verificando pagamento per session:", sessionId);
      
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      if (error) {
        console.error("❌ Errore verifica pagamento:", error);
        toast.error("Errore durante la verifica del pagamento");
        return;
      }

      if (data?.success) {
        console.log("✅ Pagamento verificato con successo");
        toast.success("Pagamento completato! Benvenuto in SportConnect!");
        setVerificationComplete(true);
        
        // Recupera i dati dell'utente dalla sessionStorage
        const pendingData = sessionStorage.getItem('pending_registration');
        if (pendingData) {
          const userData = JSON.parse(pendingData);
          console.log("👤 Dati utente recuperati:", userData);
          
          // Qui potresti chiamare onLogin se necessario
          // Per ora pulisci i dati temporanei
          sessionStorage.removeItem('pending_registration');
        }
      } else {
        toast.error("Pagamento non completato");
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (error) {
      console.error("❌ Errore durante la verifica:", error);
      toast.error("Errore durante la verifica del pagamento");
    } finally {
      setIsVerifying(false);
    }
  };

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
              {isVerifying ? (
                <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
              ) : verificationComplete ? (
                <CheckCircle className="w-16 h-16 text-green-400" />
              ) : (
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">!</span>
                </div>
              )}
            </div>
            
            <CardTitle className="text-2xl gradient-text mb-2">
              {isVerifying ? "Verificando pagamento..." : 
               verificationComplete ? "Pagamento completato!" : "Pagamento non completato"}
            </CardTitle>
            
            <CardDescription className="text-blue-200">
              {isVerifying ? "Stiamo verificando il tuo pagamento, attendere..." :
               verificationComplete ? "Benvenuto in SportConnect! La tua registrazione è completa." :
               "Il pagamento non è stato completato. Riprova più tardi."}
            </CardDescription>
          </CardHeader>

          {!isVerifying && (
            <CardContent>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {verificationComplete && (
                  <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/30 rounded-lg p-4 mb-6">
                    <h3 className="text-green-200 font-semibold mb-2">Registrazione completata!</h3>
                    <ul className="text-green-100 text-sm space-y-1">
                      <li>✅ Pagamento di €0.10 elaborato</li>
                      <li>✅ Account SportConnect attivato</li>
                      <li>✅ Accesso completo alla piattaforma</li>
                    </ul>
                  </div>
                )}
                
                <Button 
                  onClick={handleBackToHome}
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white py-3 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Torna alla home
                </Button>
              </motion.div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
