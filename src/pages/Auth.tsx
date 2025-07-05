import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Mail, Phone, ArrowLeft, Loader2, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthProps {
  onLogin?: (userData: any) => void;
}

const Auth = ({ onLogin }: AuthProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState<'choice' | 'email-otp' | 'phone-otp' | 'verify-otp'>('choice');
  const [otpMethod, setOtpMethod] = useState<'email' | 'phone' | null>(null);
  const [contactInfo, setContactInfo] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Inizializza l'autenticazione
  useEffect(() => {
    // Configura listener per cambiamenti di stato auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Se l'utente è loggato, naviga alla dashboard
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(() => {
            handleAuthSuccess(session.user);
          }, 0);
        }
      }
    );

    // Controlla se c'è già una sessione
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        handleAuthSuccess(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = async (user: User) => {
    try {
      // Recupera o crea il profilo utente
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const userData = {
        id: user.id,
        name: profileData?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'Utente',
        email: user.email,
        level: profileData?.level || 'intermedio',
        sport: profileData?.sport || 'calcio',
        city: profileData?.city || 'Milano',
        joinDate: user.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        gamesPlayed: 0,
        wins: 0,
        rating: 1200
      };

      if (onLogin) {
        onLogin(userData);
      }
      
      toast.success('🎉 Accesso effettuato con successo!');
      navigate('/');
    } catch (error) {
      console.error('❌ Errore nel recupero profilo:', error);
      toast.error('Errore nel caricamento del profilo');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('❌ Errore Google Auth:', error);
        toast.error('Errore durante l\'accesso con Google');
      }
    } catch (error) {
      console.error('❌ Errore:', error);
      toast.error('Errore durante l\'accesso con Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailOtp = async () => {
    if (!contactInfo || !contactInfo.includes('@')) {
      toast.error('Inserisci un indirizzo email valido');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: contactInfo,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('❌ Errore OTP Email:', error);
        toast.error('Errore durante l\'invio del codice email');
      } else {
        setOtpMethod('email');
        setAuthStep('verify-otp');
        toast.success('📧 Codice inviato via email! Controlla la tua casella di posta.');
      }
    } catch (error) {
      console.error('❌ Errore:', error);
      toast.error('Errore durante l\'invio del codice');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneOtp = async () => {
    if (!contactInfo || contactInfo.length < 10) {
      toast.error('Inserisci un numero di telefono valido');
      return;
    }

    setLoading(true);
    try {
      // Normalizza il numero di telefono (aggiungi +39 se necessario)
      let phoneNumber = contactInfo.replace(/\s/g, '');
      if (phoneNumber.startsWith('3') && phoneNumber.length === 10) {
        phoneNumber = '+39' + phoneNumber;
      } else if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+39' + phoneNumber;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber
      });

      if (error) {
        console.error('❌ Errore OTP SMS:', error);
        toast.error('Errore durante l\'invio del codice SMS');
      } else {
        setOtpMethod('phone');
        setAuthStep('verify-otp');
        toast.success('📱 Codice inviato via SMS! Controlla i tuoi messaggi.');
      }
    } catch (error) {
      console.error('❌ Errore:', error);
      toast.error('Errore durante l\'invio del codice');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Inserisci il codice a 6 cifre');
      return;
    }

    setLoading(true);
    try {
      const verifyData = otpMethod === 'email' 
        ? { email: contactInfo, token: otpCode, type: 'email' as const }
        : { phone: contactInfo, token: otpCode, type: 'sms' as const };

      const { error } = await supabase.auth.verifyOtp(verifyData);

      if (error) {
        console.error('❌ Errore verifica OTP:', error);
        toast.error('Codice non valido o scaduto');
      } else {
        toast.success('✅ Codice verificato con successo!');
      }
    } catch (error) {
      console.error('❌ Errore:', error);
      toast.error('Errore durante la verifica del codice');
    } finally {
      setLoading(false);
    }
  };

  const resetAuth = () => {
    setAuthStep('choice');
    setOtpMethod(null);
    setContactInfo('');
    setOtpCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-white/30 shadow-2xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CardTitle className="text-3xl gradient-text mb-2">
                {authStep === 'choice' && '🔐 Accedi'}
                {authStep === 'email-otp' && '📧 Accesso via Email'}
                {authStep === 'phone-otp' && '📱 Accesso via SMS'}
                {authStep === 'verify-otp' && '🔢 Verifica Codice'}
              </CardTitle>
              <CardDescription className="text-blue-200 text-lg">
                {authStep === 'choice' && 'Scegli il tuo metodo di accesso preferito'}
                {authStep === 'email-otp' && 'Inserisci la tua email per ricevere il codice'}
                {authStep === 'phone-otp' && 'Inserisci il tuo numero per ricevere l\'SMS'}
                {authStep === 'verify-otp' && `Inserisci il codice ricevuto via ${otpMethod === 'email' ? 'email' : 'SMS'}`}
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {authStep === 'choice' && (
                <motion.div
                  key="choice"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {/* Google Login */}
                  <Button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continua con Google
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-4">
                    <hr className="flex-1 border-white/30" />
                    <span className="text-white/70 text-sm">oppure</span>
                    <hr className="flex-1 border-white/30" />
                  </div>

                  {/* Email OTP */}
                  <Button
                    onClick={() => setAuthStep('email-otp')}
                    variant="outline"
                    className="w-full border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white py-3 rounded-xl transition-all duration-300"
                  >
                    <Mail className="w-5 h-5 mr-3" />
                    Accedi con Email
                  </Button>

                  {/* Phone OTP */}
                  <Button
                    onClick={() => setAuthStep('phone-otp')}
                    variant="outline"
                    className="w-full border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white py-3 rounded-xl transition-all duration-300"
                  >
                    <Phone className="w-5 h-5 mr-3" />
                    Accedi con SMS
                  </Button>
                </motion.div>
              )}

              {(authStep === 'email-otp' || authStep === 'phone-otp') && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <Button
                    onClick={resetAuth}
                    variant="ghost"
                    className="text-white hover:bg-white/10 mb-4"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Torna indietro
                  </Button>

                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      {authStep === 'email-otp' ? (
                        <>
                          <Mail className="w-4 h-4" />
                          Indirizzo Email
                        </>
                      ) : (
                        <>
                          <Phone className="w-4 h-4" />
                          Numero di Telefono
                        </>
                      )}
                    </Label>
                    <Input
                      type={authStep === 'email-otp' ? 'email' : 'tel'}
                      placeholder={authStep === 'email-otp' ? 'la-tua-email@esempio.com' : '+39 123 456 7890'}
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      className="bg-white/10 border-white/30 text-white placeholder:text-blue-200 py-3"
                    />
                  </div>
                  
                  <Button
                    onClick={authStep === 'email-otp' ? handleEmailOtp : handlePhoneOtp}
                    disabled={loading || !contactInfo}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 rounded-xl"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Invio in corso...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Invia Codice
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {authStep === 'verify-otp' && (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <Button
                    onClick={resetAuth}
                    variant="ghost"
                    className="text-white hover:bg-white/10 mb-4"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Torna indietro
                  </Button>

                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white text-lg">
                        Codice di Verifica
                      </Label>
                      <p className="text-blue-200 text-sm">
                        Inserisci il codice a 6 cifre ricevuto {otpMethod === 'email' ? 'via email' : 'via SMS'}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <InputOTP 
                        maxLength={6} 
                        value={otpCode} 
                        onChange={setOtpCode}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="border-white/30 text-white text-xl" />
                          <InputOTPSlot index={1} className="border-white/30 text-white text-xl" />
                          <InputOTPSlot index={2} className="border-white/30 text-white text-xl" />
                          <InputOTPSlot index={3} className="border-white/30 text-white text-xl" />
                          <InputOTPSlot index={4} className="border-white/30 text-white text-xl" />
                          <InputOTPSlot index={5} className="border-white/30 text-white text-xl" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <Button
                      onClick={handleVerifyOtp}
                      disabled={loading || otpCode.length !== 6}
                      className="w-full bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white py-3 rounded-xl"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verifica in corso...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Verifica Codice
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            ← Torna alla Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;