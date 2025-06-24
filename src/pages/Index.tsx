
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  Trophy, 
  Zap, 
  Star, 
  Play,
  MapPin,
  Clock,
  TrendingUp,
  Shield,
  Gamepad2,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginModal from "@/components/LoginModal";
import DashboardView from "@/components/DashboardView";
import { toast } from "sonner";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  useEffect(() => {
    // Simula il controllo dello stato di login
    const checkAuth = () => {
      const savedUser = localStorage.getItem('sportapp_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('sportapp_user', JSON.stringify(userData));
    setShowLogin(false);
    toast.success("Benvenuto! Registrazione completata con successo!");
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('sportapp_user');
    toast.success("Logout effettuato!");
  };

  if (isLoggedIn && user) {
    return <DashboardView user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <motion.div 
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header 
          className="container mx-auto px-6 py-8"
          variants={itemVariants}
        >
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">SportConnect</span>
            </div>
            <Button 
              onClick={() => setShowLogin(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 neon-glow"
            >
              Unisciti ora
            </Button>
          </nav>
        </motion.header>

        {/* Hero Section */}
        <motion.section 
          className="container mx-auto px-6 py-20 text-center"
          variants={itemVariants}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="gradient-text">Sport</span>
              <span className="text-white">Connect</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              L'app rivoluzionaria che connette giocatori del tuo livello, organizza tornei epici e prenota campi in tempo reale. 
              <span className="text-cyan-300 font-semibold"> Solo 1 euro per iniziare!</span>
            </p>
          </motion.div>

          {/* Hero Images */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto"
          >
            <div className="glass-card rounded-2xl overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Padel Players in Action"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2">Gioca con stile</h3>
                <p className="text-blue-200 text-sm">Trova partner del tuo livello</p>
              </div>
            </div>
            <div className="glass-card rounded-2xl overflow-hidden">
              <img 
                src="/lovable-uploads/eaf27e54-66aa-49f2-b23d-704145ba50ad.png"
                alt="Campi Premium"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2">Campi premium</h3>
                <p className="text-blue-200 text-sm">Prenota in tempo reale</p>
              </div>
            </div>
            <div className="glass-card rounded-2xl overflow-hidden">
              <img 
                src="/lovable-uploads/2a481fa2-e10a-4312-a6dc-4726a89bb4d2.png"
                alt="Winner with Trophy"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2">Vinci tornei</h3>
                <p className="text-blue-200 text-sm">Premi incredibili ti aspettano</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button 
              onClick={() => setShowLogin(true)}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white px-12 py-4 text-lg rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Inizia a giocare
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-4 text-lg rounded-full backdrop-blur-sm"
            >
              Scopri di più
            </Button>
          </motion.div>

          {/* Hero Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={containerVariants}
          >
            {[
              { icon: Users, number: "2,500+", label: "Giocatori attivi" },
              { icon: Calendar, number: "15,000+", label: "Partite organizzate" },
              { icon: Trophy, number: "450+", label: "Tornei completati" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <stat.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Features Section with Padel Images */}
        <motion.section 
          className="container mx-auto px-6 py-20"
          variants={itemVariants}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Funzionalità Innovative
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Tutto quello che serve per organizzare e gestire la tua community sportiva
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Matchmaking Intelligente",
                description: "Il nostro algoritmo ti abbina con giocatori del tuo stesso livello per partite equilibrate e divertenti",
                gradient: "from-pink-500 to-rose-500",
                image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              },
              {
                icon: Calendar,
                title: "Prenotazione Campi",
                description: "Prenota campi disponibili in tempo reale con un sistema di pagamento integrato e notifiche automatiche",
                gradient: "from-blue-500 to-cyan-500",
                image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              },
              {
                icon: Trophy,
                title: "Tornei Dinamici",
                description: "Crea e partecipa a tornei con bracket automatici, classifiche in tempo reale e premi virtuali",
                gradient: "from-purple-500 to-indigo-500",
                image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              },
              {
                icon: TrendingUp,
                title: "Statistiche Avanzate",
                description: "Traccia le tue performance, migliora il tuo ranking e monitora i tuoi progressi nel tempo",
                gradient: "from-green-500 to-emerald-500",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              },
              {
                icon: Shield,
                title: "Sistema di Rating",
                description: "Sistema di valutazione peer-to-peer per mantenere alta la qualità dei giocatori e delle partite",
                gradient: "from-orange-500 to-red-500",
                image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              },
              {
                icon: Zap,
                title: "Notifiche Smart",
                description: "Ricevi notifiche personalizzate per partite, tornei e opportunità di gioco in base alle tue preferenze",
                gradient: "from-yellow-500 to-orange-500",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="glass-card border-white/20 hover:border-white/40 transition-all duration-300 h-full overflow-hidden">
                  <div className="relative">
                    <img 
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className={`absolute top-4 left-4 w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-blue-200 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section with Background Image */}
        <motion.section 
          className="container mx-auto px-6 py-20 text-center"
          variants={itemVariants}
        >
          <div className="relative glass-card rounded-3xl p-12 max-w-4xl mx-auto overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')`
              }}
            />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
                Pronto a rivoluzionare il tuo gioco?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Unisciti alla community più innovativa dello sport. Registrazione con solo 1 euro e inizia subito a giocare!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={() => setShowLogin(true)}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-white px-12 py-4 text-lg rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Registrati ora - €1.00
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>

      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
