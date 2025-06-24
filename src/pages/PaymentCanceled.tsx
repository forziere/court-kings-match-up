
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentCanceled = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleTryAgain = () => {
    // Recupera i dati temporanei se disponibili
    const pendingData = sessionStorage.getItem('pending_registration');
    if (pendingData) {
      // Reindirizza alla home per riaprire il modal di registrazione
      navigate('/');
    } else {
      navigate('/');
    }
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
              <XCircle className="w-16 h-16 text-orange-400" />
            </div>
            
            <CardTitle className="text-2xl gradient-text mb-2">
              Pagamento annullato
            </CardTitle>
            
            <CardDescription className="text-blue-200">
              Il pagamento è stato annullato. Nessun addebito è stato effettuato.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-lg p-4">
                <h3 className="text-orange-200 font-semibold mb-2">Nessun addebito</h3>
                <p className="text-orange-100 text-sm">
                  La tua carta non è stata addebitata. Puoi riprovare quando vuoi per completare la registrazione.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleTryAgain}
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white py-3 rounded-xl"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Riprova registrazione
                </Button>
                
                <Button 
                  onClick={handleBackToHome}
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10 py-3 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Torna alla home
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentCanceled;
