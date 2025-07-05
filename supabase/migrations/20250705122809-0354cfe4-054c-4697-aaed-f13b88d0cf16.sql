-- Crea tabella per le prenotazioni
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  facility_id UUID REFERENCES public.sports_facilities(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  amount INTEGER NOT NULL DEFAULT 50, -- 50 centesimi
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crea tabella per il sistema di chat
CREATE TABLE public.chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'group' CHECK (type IN ('group', 'direct')),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crea tabella per statistiche e ranking
CREATE TABLE public.user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  games_played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  points INTEGER DEFAULT 1000,
  level INTEGER DEFAULT 1,
  badges TEXT[] DEFAULT ARRAY[]::TEXT[],
  achievements TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crea tabella per i match/partite
CREATE TABLE public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  player1_id UUID NOT NULL,
  player2_id UUID,
  player1_score INTEGER DEFAULT 0,
  player2_score INTEGER DEFAULT 0,
  winner_id UUID,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Abilita RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Policy per le prenotazioni
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth.uid() = id));

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth.uid() = id));

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (user_id IN (SELECT id FROM public.users WHERE auth.uid() = id));

-- Policy per chat
CREATE POLICY "Users can view chat rooms they participate in" ON public.chat_rooms
  FOR SELECT USING (true); -- Semplificato per ora

CREATE POLICY "Users can view messages in their rooms" ON public.chat_messages
  FOR SELECT USING (true); -- Semplificato per ora

CREATE POLICY "Users can send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (sender_id IN (SELECT id FROM public.users WHERE auth.uid() = id));

-- Policy per statistiche
CREATE POLICY "Users can view all stats for leaderboard" ON public.user_stats
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own stats" ON public.user_stats
  FOR UPDATE USING (user_id IN (SELECT id FROM public.users WHERE auth.uid() = id));

CREATE POLICY "System can insert stats" ON public.user_stats
  FOR INSERT WITH CHECK (true);

-- Policy per match
CREATE POLICY "Users can view matches they participate in" ON public.matches
  FOR SELECT USING (player1_id IN (SELECT id FROM public.users WHERE auth.uid() = id) OR 
                   player2_id IN (SELECT id FROM public.users WHERE auth.uid() = id));

CREATE POLICY "Users can create matches" ON public.matches
  FOR INSERT WITH CHECK (player1_id IN (SELECT id FROM public.users WHERE auth.uid() = id));

-- Trigger per aggiornare updated_at
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON public.user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();