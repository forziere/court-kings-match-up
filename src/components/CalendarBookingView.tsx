import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  Euro,
  MapPin,
  Users,
  Zap,
  CheckCircle2,
  AlertCircle,
  Plus,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CalendarBookingView = ({ user, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [duration, setDuration] = useState(60);

  // Query per ottenere i campi sportivi
  const { data: facilities, isLoading: facilitiesLoading } = useQuery({
    queryKey: ['facilities-enhanced'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sports_facilities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Query per ottenere le prenotazioni esistenti per la data selezionata
  const { data: existingBookings } = useQuery({
    queryKey: ['bookings-date', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_date', format(selectedDate, 'yyyy-MM-dd'))
        .in('status', ['pending', 'confirmed']);
      
      if (error) throw error;
      return data || [];
    }
  });

  const calculatePrice = (facility, timeSlot, selectedDuration, extras) => {
    if (!facility || !timeSlot) return 0;
    
    const basePrice = facility.base_price_per_30min || 1500;
    const slots = selectedDuration / 30;
    let totalPrice = basePrice * slots;
    
    // Applica regole di prezzo dinamico
    const priceRules = facility.price_rules || [];
    priceRules.forEach(rule => {
      if (rule.condition === 'peak_hours') {
        const currentHour = timeSlot.split(':')[0];
        const peakHours = rule.hours[0].split('-');
        const startHour = parseInt(peakHours[0].split(':')[0]);
        const endHour = parseInt(peakHours[1].split(':')[0]);
        
        if (parseInt(currentHour) >= startHour && parseInt(currentHour) < endHour) {
          totalPrice *= rule.multiplier;
        }
      }
      
      if (rule.condition === 'weekend') {
        const dayOfWeek = selectedDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) { // domenica o sabato
          totalPrice *= rule.multiplier;
        }
      }
    });
    
    // Aggiungi costo extra
    extras.forEach(extraName => {
      const extra = facility.extras?.find(e => e.name === extraName);
      if (extra) {
        totalPrice += extra.price;
      }
    });
    
    return Math.round(totalPrice);
  };

  const isTimeSlotAvailable = (facility, timeSlot) => {
    if (!existingBookings || !facility) return true;
    
    const [hour, minute] = timeSlot.split(':').map(Number);
    const slotStart = hour * 60 + minute;
    const slotEnd = slotStart + duration;
    
    return !existingBookings.some(booking => {
      if (booking.facility_id !== facility.id) return false;
      
      const [bookingStartHour, bookingStartMinute] = booking.start_time.split(':').map(Number);
      const [bookingEndHour, bookingEndMinute] = booking.end_time.split(':').map(Number);
      
      const bookingStart = bookingStartHour * 60 + bookingStartMinute;
      const bookingEnd = bookingEndHour * 60 + bookingEndMinute;
      
      // Check for overlap
      return (slotStart < bookingEnd && slotEnd > bookingStart);
    });
  };

  const handleBooking = async () => {
    if (!selectedFacility || !selectedTimeSlot) {
      toast.error("Seleziona un campo e un orario");
      return;
    }

    try {
      const startTime = selectedTimeSlot;
      const [hour, minute] = startTime.split(':').map(Number);
      const endHour = Math.floor((hour * 60 + minute + duration) / 60);
      const endMinute = (hour * 60 + minute + duration) % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      
      const totalAmount = calculatePrice(selectedFacility, selectedTimeSlot, duration, selectedExtras);
      
      const { data, error } = await supabase.functions.invoke('create-booking-payment', {
        body: {
          bookingData: {
            facilityId: selectedFacility.id,
            date: format(selectedDate, 'yyyy-MM-dd'),
            startTime: startTime,
            endTime: endTime,
            duration: duration,
            extras: selectedExtras,
            totalAmount: totalAmount,
            userEmail: user.email
          }
        }
      });

      if (error) {
        toast.error("Errore nella prenotazione");
        return;
      }

      if (data?.url) {
        sessionStorage.setItem('pending_booking', JSON.stringify({
          fieldName: selectedFacility.name,
          date: format(selectedDate, 'yyyy-MM-dd'),
          startTime: startTime,
          endTime: endTime,
          duration: duration,
          amount: totalAmount / 100,
          extras: selectedExtras
        }));
        
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Errore durante la prenotazione");
    }
  };

  const getTimeSlots = (facility) => {
    if (!facility || !facility.time_slots) return [];
    
    return facility.time_slots.filter(slot => 
      slot.available && isTimeSlotAvailable(facility, slot.start)
    );
  };

  const formatPrice = (priceInCents) => {
    return (priceInCents / 100).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Header */}
      <motion.header 
        className="bg-white/10 backdrop-blur-lg border-b border-white/20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Calendario & Prenotazioni</h1>
              <p className="text-blue-200">Prenota il tuo campo con calendario interattivo</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendario e selezione data */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-1"
          >
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Seleziona Data
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Scegli il giorno per la tua prenotazione
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  locale={it}
                  className="pointer-events-auto bg-white/5 rounded-lg border border-white/20"
                />
                
                {selectedDate && (
                  <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/20">
                    <h4 className="text-white font-medium mb-2">Data selezionata:</h4>
                    <p className="text-blue-200">
                      {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: it })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Selezione campo e slot */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="space-y-6">
              {/* Hero Video Section */}
              <Card className="glass-card border-white/20 mb-6 overflow-hidden">
                <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
                  <video 
                    autoPlay 
                    muted 
                    loop 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    poster="/placeholder-video-poster.jpg"
                  >
                    <source src="/hero-sports-video.mp4" type="video/mp4" />
                    {/* Fallback gradient if video doesn't load */}
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                    <div className="p-6">
                      <h2 className="text-3xl font-bold text-white mb-2">Prenota il tuo campo</h2>
                      <p className="text-blue-100 text-lg">Scegli data, orario e inizia a giocare!</p>
                      <div className="flex items-center gap-4 mt-4">
                        <Badge className="bg-white/20 text-white border-0">
                          🏆 Oltre 100 campi
                        </Badge>
                        <Badge className="bg-white/20 text-white border-0">
                          ⚡ Prenotazione istantanea
                        </Badge>
                        <Badge className="bg-white/20 text-white border-0">
                          💯 Pagamento sicuro
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Selezione campo */}
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Scegli Campo Sportivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {facilities?.map((facility) => (
                      <Card
                        key={facility.id}
                        className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedFacility?.id === facility.id
                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 shadow-lg shadow-blue-500/25'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-xl'
                        }`}
                        onClick={() => setSelectedFacility(facility)}
                      >
                        <CardContent className="p-4 relative overflow-hidden">
                          {/* Sport icon background */}
                          <div className="absolute top-2 right-2 opacity-20">
                            <div className="text-6xl">
                              {facility.sport === 'Calcio' ? '⚽' : 
                               facility.sport === 'Tennis' ? '🎾' :
                               facility.sport === 'Padel' ? '🏓' :
                               facility.sport === 'Basket' ? '🏀' : '🏐'}
                            </div>
                          </div>
                          
                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-12 h-12 bg-gradient-to-r ${
                                facility.sport === 'Calcio' ? 'from-green-500 to-emerald-500' :
                                facility.sport === 'Tennis' ? 'from-yellow-500 to-orange-500' :
                                facility.sport === 'Padel' ? 'from-blue-500 to-cyan-500' :
                                facility.sport === 'Basket' ? 'from-orange-500 to-red-500' :
                                'from-purple-500 to-pink-500'
                              } rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
                                {facility.sport.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-white font-bold text-lg">{facility.name}</h4>
                                <p className="text-blue-200 text-sm font-medium">{facility.sport}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-blue-200 text-sm">
                                  <MapPin className="w-4 h-4" />
                                  {facility.location}
                                </div>
                                <div className="text-right">
                                  <div className="text-white font-bold text-lg">
                                    €{formatPrice(facility.base_price_per_30min)}
                                  </div>
                                  <div className="text-blue-300 text-xs">per 30min</div>
                                </div>
                              </div>
                              
                              {/* Rating and features */}
                              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-white text-sm font-medium">{facility.rating || '4.8'}</span>
                                </div>
                                {selectedFacility?.id === facility.id && (
                                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30 animate-pulse">
                                    ✓ Selezionato
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Selezione orario e durata */}
              {selectedFacility && (
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Orari Disponibili - {selectedFacility.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Durata */}
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Durata</label>
                      <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                        <SelectTrigger className="bg-white/10 border-white/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minuti</SelectItem>
                          <SelectItem value="60">1 ora</SelectItem>
                          <SelectItem value="90">1.5 ore</SelectItem>
                          <SelectItem value="120">2 ore</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Slot temporali */}
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Orario</label>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {getTimeSlots(selectedFacility).map((slot) => {
                          const price = calculatePrice(selectedFacility, slot.start, duration, selectedExtras);
                          const isSelected = selectedTimeSlot === slot.start;
                          
                          return (
                            <Button
                              key={slot.start}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedTimeSlot(slot.start)}
                              className={cn(
                                "flex flex-col h-auto py-3 px-4 text-sm font-medium transition-all duration-300",
                                isSelected 
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25 scale-105" 
                                  : "border-white/30 text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:border-blue-400/50 hover:scale-105"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                <span className="font-bold">{slot.start}</span>
                              </div>
                              <div className="flex items-center gap-1 opacity-90">
                                <Euro className="w-3 h-3" />
                                <span className="text-xs">{formatPrice(price)}</span>
                              </div>
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Extra services */}
                    {selectedFacility.extras && selectedFacility.extras.length > 0 && (
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Servizi Extra</label>
                        <div className="space-y-2">
                          {selectedFacility.extras.map((extra) => (
                            <div key={extra.name} className="flex items-center space-x-2">
                              <Checkbox
                                id={extra.name}
                                checked={selectedExtras.includes(extra.name)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedExtras([...selectedExtras, extra.name]);
                                  } else {
                                    setSelectedExtras(selectedExtras.filter(e => e !== extra.name));
                                  }
                                }}
                              />
                              <label
                                htmlFor={extra.name}
                                className="text-white text-sm cursor-pointer flex items-center gap-2"
                              >
                                {extra.name}
                                <Badge variant="outline" className="border-blue-400/30 text-blue-300">
                                  +€{formatPrice(extra.price)}
                                </Badge>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Riepilogo e prenotazione */}
              {selectedFacility && selectedTimeSlot && (
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Riepilogo Prenotazione</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-200">Campo:</span>
                        <span className="text-white font-medium">{selectedFacility.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Data:</span>
                        <span className="text-white">{format(selectedDate, 'd MMMM yyyy', { locale: it })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Orario:</span>
                        <span className="text-white">
                          {selectedTimeSlot} - {
                            (() => {
                              const [hour, minute] = selectedTimeSlot.split(':').map(Number);
                              const endHour = Math.floor((hour * 60 + minute + duration) / 60);
                              const endMinute = (hour * 60 + minute + duration) % 60;
                              return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
                            })()
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-200">Durata:</span>
                        <span className="text-white">{duration} minuti</span>
                      </div>
                      {selectedExtras.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-blue-200">Extra:</span>
                          <span className="text-white">{selectedExtras.join(', ')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold border-t border-white/20 pt-2">
                        <span className="text-white">Totale:</span>
                        <span className="text-green-400">
                          €{formatPrice(calculatePrice(selectedFacility, selectedTimeSlot, duration, selectedExtras))}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleBooking}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Procedi al Pagamento
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CalendarBookingView;