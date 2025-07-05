
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
        
        console.log("🚀 Iniziando registrazione gratuita");
        
        // Registrazione gratuita con Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              sport: formData.sport,
              level: formData.level,
              city: formData.city
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          console.error("❌ Errore durante la registrazione:", error);
          toast.error(error.message || "Errore durante la registrazione");
          return;
        }

        if (data.user) {
          console.log("✅ Registrazione completata con successo");
          toast.success("Registrazione completata! Controlla la tua email per confermare l'account.");
          
          // Simula login immediato per demo (in produzione aspetteresti la conferma email)
          const userData = {
            id: data.user.id,
            name: formData.name,
            email: formData.email,
            level: formData.level,
            sport: formData.sport,
            city: formData.city,
            joinDate: new Date().toISOString().split('T')[0],
            gamesPlayed: 0,
            wins: 0,
            rating: 1200
          };
          
          onLogin(userData);
        }
        
      } else {
        // Login con Supabase Auth
        if (!formData.email || !formData.password) {
          toast.error("Inserisci email e password");
          return;
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error("❌ Errore durante il login:", error);
          toast.error(error.message || "Errore durante il login");
          return;
        }

        if (data.user) {
          console.log("✅ Login completato con successo");
          toast.success("Login completato con successo!");
          
          // Recupera il profilo utente
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          const userData = {
            id: data.user.id,
            name: profileData?.name || "Utente",
            email: data.user.email,
            level: profileData?.level || "Intermedio",
            sport: profileData?.sport || "Calcio",
            city: profileData?.city || "Milano",
            joinDate: data.user.created_at?.split('T')[0] || "2024-01-01",
            gamesPlayed: 0,
            wins: 0,
            rating: 1200
          };
          
          onLogin(userData);
        }
      }
    } catch (error) {
      console.error("❌ Errore:", error);
      toast.error("Errore durante l'operazione");
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
                    ? "Registrati gratuitamente e inizia subito a giocare!" 
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

                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isRegistering ? "Registrando..." : "Accedendo..."}
                    </>
                  ) : (
                    <>
                      {isRegistering ? "🚀 Registrati Gratis" : "🎯 Accedi"}
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
