
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Mail, Lock, User, MapPin, Star, CreditCard, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    level: "",
    sport: "",
    city: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        // Validazione campi obbligatori
        if (!formData.name || !formData.email || !formData.password || !formData.level || !formData.sport) {
          toast.error("Compila tutti i campi obbligatori");
          return;
        }
        
        console.log("🚀 Iniziando registrazione con pagamento reale");
        
        // Chiama la Edge Function per creare il checkout Stripe
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: {
            userData: {
              name: formData.name,
              email: formData.email,
              sport: formData.sport,
              level: formData.level,
              city: formData.city
            }
          }
        });

        if (error) {
          console.error("❌ Errore chiamata Edge Function:", error);
          toast.error("Errore durante la creazione del pagamento");
          return;
        }

        if (data?.url) {
          console.log("✅ URL checkout ricevuto, reindirizzamento...");
          
          // Salva i dati temporaneamente per dopo il pagamento
          sessionStorage.setItem('pending_registration', JSON.stringify({
            ...formData,
            sessionId: data.sessionId
          }));
          
          toast.success("Reindirizzamento al pagamento...");
          
          // Apri Stripe Checkout in una nuova scheda
          window.open(data.url, '_blank');
          
        } else {
          toast.error("Errore: URL di pagamento non ricevuto");
        }
        
      } else {
        // Login simulato (da implementare con Supabase Auth)
        if (!formData.email || !formData.password) {
          toast.error("Inserisci email e password");
          return;
        }
        
        const userData = {
          id: Date.now(),
          name: "Utente Esistente",
          email: formData.email,
          level: "Intermedio",
          sport: "Calcio",
          city: "Milano",
          joinDate: "2024-01-01",
          gamesPlayed: 15,
          wins: 9,
          rating: 1250
        };
        
        onLogin(userData);
      }
    } catch (error) {
      console.error("❌ Errore durante la registrazione:", error);
      toast.error("Errore durante la registrazione");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="glass-card border-white/30 shadow-2xl">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute right-2 top-2 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <CardTitle className="text-2xl gradient-text mb-2">
                  {isRegistering ? "Unisciti a SportConnect" : "Bentornato!"}
                </CardTitle>
                <CardDescription className="text-blue-200">
                  {isRegistering 
                    ? "Registrati per solo €1 e inizia subito a giocare!" 
                    : "Accedi al tuo account"
                  }
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegistering && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nome completo *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Il tuo nome"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sport" className="text-white">
                          Sport *
                        </Label>
                        <Select onValueChange={(value) => handleInputChange("sport", value)} disabled={isLoading}>
                          <SelectTrigger className="bg-white/10 border-white/30 text-white">
                            <SelectValue placeholder="Scegli sport" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="calcio">⚽ Calcio</SelectItem>
                            <SelectItem value="tennis">🎾 Tennis</SelectItem>
                            <SelectItem value="basket">🏀 Basket</SelectItem>
                            <SelectItem value="padel">🏓 Padel</SelectItem>
                            <SelectItem value="volley">🏐 Volley</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="level" className="text-white flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Livello *
                        </Label>
                        <Select onValueChange={(value) => handleInputChange("level", value)} disabled={isLoading}>
                          <SelectTrigger className="bg-white/10 border-white/30 text-white">
                            <SelectValue placeholder="Il tuo livello" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="principiante">🌱 Principiante</SelectItem>
                            <SelectItem value="intermedio">⭐ Intermedio</SelectItem>
                            <SelectItem value="avanzato">🔥 Avanzato</SelectItem>
                            <SelectItem value="professionista">👑 Professionista</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Città
                      </Label>
                      <Input
                        id="city"
                        placeholder="La tua città"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                        disabled={isLoading}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="la-tua-email@esempio.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password sicura"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-blue-200"
                    required
                    disabled={isLoading}
                  />
                </div>

                {isRegistering && (
                  <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 text-green-200">
                      <CreditCard className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">Costo registrazione: €1.00</div>
                        <div className="text-sm opacity-80">Pagamento sicuro con Stripe</div>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isRegistering ? "Preparando pagamento..." : "Accedendo..."}
                    </>
                  ) : (
                    <>
                      {isRegistering ? "🚀 Registrati e Paga €1.00" : "🎯 Accedi"}
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center pt-4 border-t border-white/20">
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-cyan-300 hover:text-cyan-200 transition-colors"
                  disabled={isLoading}
                >
                  {isRegistering 
                    ? "Hai già un account? Accedi qui" 
                    : "Non hai un account? Registrati qui"
                  }
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;
