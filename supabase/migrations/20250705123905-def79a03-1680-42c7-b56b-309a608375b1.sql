-- Migliora la tabella sports_facilities con fasce orarie dettagliate e prezzi dinamici
ALTER TABLE public.sports_facilities 
ADD COLUMN IF NOT EXISTS time_slots JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS base_price_per_30min INTEGER DEFAULT 1500, -- €15.00 per 30 min in centesimi
ADD COLUMN IF NOT EXISTS price_rules JSONB DEFAULT '[]', -- regole prezzi dinamici
ADD COLUMN IF NOT EXISTS extras JSONB DEFAULT '[]', -- luci, riscaldamento, etc
ADD COLUMN IF NOT EXISTS booking_rules JSONB DEFAULT '{}', -- regole ricorrenze
ADD COLUMN IF NOT EXISTS max_advance_days INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS min_advance_hours INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES public.users(id);

-- Aggiorna la tabella bookings per supportare slot temporali più precisi
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS start_time TIME NOT NULL DEFAULT '09:00',
ADD COLUMN IF NOT EXISTS end_time TIME NOT NULL DEFAULT '10:00',
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS extras_selected JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS total_amount INTEGER, -- prezzo finale calcolato
ADD COLUMN IF NOT EXISTS qr_code TEXT, -- per conferma presenza
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancelled_reason TEXT;

-- Crea tabella per gli slot di disponibilità ricorrenti
CREATE TABLE IF NOT EXISTS public.facility_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID REFERENCES public.sports_facilities(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=domenica, 6=sabato
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  price_multiplier DECIMAL(3,2) DEFAULT 1.0, -- 1.0 = prezzo base, 1.5 = +50%
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crea tabella per eccezioni di disponibilità (giorni specifici)
CREATE TABLE IF NOT EXISTS public.facility_exceptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id UUID REFERENCES public.sports_facilities(id) ON DELETE CASCADE,
  exception_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT false,
  reason TEXT,
  price_multiplier DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migliora la tabella matches per match-making intelligente
ALTER TABLE public.matches
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS max_players INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS current_players INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS skill_level_required TEXT,
ADD COLUMN IF NOT EXISTS age_range_min INTEGER,
ADD COLUMN IF NOT EXISTS age_range_max INTEGER,
ADD COLUMN IF NOT EXISTS join_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS auto_match BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS match_type TEXT DEFAULT 'casual' CHECK (match_type IN ('casual', 'competitive', 'tournament')),
ADD COLUMN IF NOT EXISTS location_notes TEXT;

-- Crea tabella per partecipanti ai match
CREATE TABLE IF NOT EXISTS public.match_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'no_show')),
  qr_confirmed BOOLEAN DEFAULT false,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(match_id, user_id)
);

-- Migliora user_stats per skill tracking
ALTER TABLE public.user_stats
ADD COLUMN IF NOT EXISTS skill_level TEXT DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS skill_validated_by TEXT, -- 'self', 'instructor', 'system'
ADD COLUMN IF NOT EXISTS elo_rating INTEGER DEFAULT 1200,
ADD COLUMN IF NOT EXISTS last_match_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS preferred_times TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS availability_notes TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Crea tabella per centro sportivo management
CREATE TABLE IF NOT EXISTS public.sports_centers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  manager_id UUID REFERENCES public.users(id),
  settings JSONB DEFAULT '{}',
  subscription_type TEXT DEFAULT 'basic' CHECK (subscription_type IN ('basic', 'premium', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collega facilities ai centri sportivi
ALTER TABLE public.sports_facilities
ADD COLUMN IF NOT EXISTS center_id UUID REFERENCES public.sports_centers(id);

-- Abilita RLS per le nuove tabelle
ALTER TABLE public.facility_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_centers ENABLE ROW LEVEL SECURITY;

-- Policies per facility_availability
CREATE POLICY "Anyone can view facility availability" ON public.facility_availability
  FOR SELECT USING (true);

CREATE POLICY "Center managers can manage availability" ON public.facility_availability
  FOR ALL USING (facility_id IN (
    SELECT id FROM public.sports_facilities WHERE manager_id IN (
      SELECT id FROM public.users WHERE auth.uid() = id
    )
  ));

-- Policies per match_participants
CREATE POLICY "Users can view match participants" ON public.match_participants
  FOR SELECT USING (true);

CREATE POLICY "Users can join matches" ON public.match_participants
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth.uid() = id));

CREATE POLICY "Users can update their participation" ON public.match_participants
  FOR UPDATE USING (user_id IN (SELECT id FROM public.users WHERE auth.uid() = id));

-- Policies per sports_centers
CREATE POLICY "Anyone can view sports centers" ON public.sports_centers
  FOR SELECT USING (true);

CREATE POLICY "Managers can update their centers" ON public.sports_centers
  FOR UPDATE USING (manager_id IN (SELECT id FROM public.users WHERE auth.uid() = id));

-- Trigger per aggiornare updated_at
CREATE TRIGGER update_sports_centers_updated_at BEFORE UPDATE ON public.sports_centers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserisci dati di esempio per i time slots
UPDATE public.sports_facilities 
SET time_slots = '[
  {"start": "08:00", "end": "09:00", "available": true},
  {"start": "09:00", "end": "10:00", "available": true},
  {"start": "10:00", "end": "11:00", "available": true},
  {"start": "11:00", "end": "12:00", "available": true},
  {"start": "14:00", "end": "15:00", "available": true},
  {"start": "15:00", "end": "16:00", "available": true},
  {"start": "16:00", "end": "17:00", "available": true},
  {"start": "17:00", "end": "18:00", "available": true},
  {"start": "18:00", "end": "19:00", "available": true},
  {"start": "19:00", "end": "20:00", "available": true},
  {"start": "20:00", "end": "21:00", "available": true},
  {"start": "21:00", "end": "22:00", "available": true}
]',
price_rules = '[
  {"condition": "peak_hours", "hours": ["18:00-22:00"], "multiplier": 1.3},
  {"condition": "weekend", "days": ["saturday", "sunday"], "multiplier": 1.2}
]',
extras = '[
  {"name": "Luci LED", "price": 500, "required_for_evening": true},
  {"name": "Riscaldamento", "price": 300, "seasonal": true},
  {"name": "Attrezzatura base", "price": 200, "optional": true}
]';