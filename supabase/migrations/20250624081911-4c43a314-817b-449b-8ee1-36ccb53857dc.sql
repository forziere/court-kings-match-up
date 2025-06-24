
-- Creo una tabella per i campi sportivi
CREATE TABLE public.sports_facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  city TEXT NOT NULL,
  location TEXT NOT NULL,
  price_per_hour INTEGER NOT NULL, -- prezzo in centesimi di euro
  rating DECIMAL(2,1) DEFAULT 4.5,
  features TEXT[] DEFAULT ARRAY[]::TEXT[], -- array di servizi (es. ["Spogliatoi", "Parcheggio"])
  available_hours TEXT[] DEFAULT ARRAY[]::TEXT[], -- orari disponibili
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserisco alcuni campi di esempio per Lucca
INSERT INTO public.sports_facilities (name, sport, city, location, price_per_hour, rating, features, available_hours, image_url) VALUES
('Flamingo', 'Calcio', 'Lucca', 'Via del Flamingo, Lucca', 2500, 4.8, ARRAY['Erba sintetica', 'Spogliatoi', 'Illuminazione', 'Parcheggio'], ARRAY['09:00', '11:00', '14:00', '16:00', '18:00', '20:00'], 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3'),
('Il Poggio', 'Tennis', 'Lucca', 'Via del Poggio, Lucca', 2000, 4.9, ARRAY['Terra battuta', 'Spogliatoi', 'Illuminazione notturna', 'Bar'], ARRAY['08:00', '10:00', '15:00', '17:00', '19:00'], 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3'),
('Il Nino', 'Padel', 'Lucca', 'Via del Nino, Lucca', 3000, 4.7, ARRAY['Vetro temperato', 'Erba sintetica premium', 'Spogliatoi VIP', 'Climatizzazione'], ARRAY['09:00', '11:00', '14:00', '17:00', '19:00', '21:00'], 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3'),
('Campo Basket Centro', 'Basket', 'Lucca', 'Centro Sportivo Lucca', 1500, 4.6, ARRAY['Parquet', 'Spalti', 'Aria condizionata', 'Spogliatoi'], ARRAY['10:00', '12:00', '16:00', '18:00', '20:00'], 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3'),
('Volley Lucca', 'Volley', 'Lucca', 'Palazzetto Comunale', 1800, 4.5, ARRAY['Pavimento sportivo', 'Spalti', 'Illuminazione LED', 'Spogliatoi'], ARRAY['09:00', '11:00', '15:00', '17:00', '19:00'], 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3');

-- Aggiungo alcuni campi per altre città di esempio
INSERT INTO public.sports_facilities (name, sport, city, location, price_per_hour, rating, features, available_hours) VALUES
('Campo San Siro Mini', 'Calcio', 'Milano', 'Via San Siro, Milano', 3500, 4.9, ARRAY['Erba naturale', 'Spogliatoi premium', 'Illuminazione', 'Parcheggio custodito'], ARRAY['08:00', '10:00', '14:00', '16:00', '18:00', '20:00']),
('Tennis Club Roma Centrale', 'Tennis', 'Roma', 'Via dei Fori Imperiali, Roma', 4000, 4.8, ARRAY['Terra rossa', 'Spogliatoi', 'Ristorante', 'Pro shop'], ARRAY['07:00', '09:00', '15:00', '17:00', '19:00']),
('Padel Napoli Elite', 'Padel', 'Napoli', 'Vomero, Napoli', 2800, 4.6, ARRAY['Vetro temperato', 'Erba sintetica', 'Vista panoramica', 'Bar'], ARRAY['09:00', '11:00', '14:00', '17:00', '19:00']);

-- Abilito RLS sulla tabella
ALTER TABLE public.sports_facilities ENABLE ROW LEVEL SECURITY;

-- Policy per permettere a tutti di leggere i campi (pubblici)
CREATE POLICY "Anyone can view sports facilities" ON public.sports_facilities
  FOR SELECT USING (true);

-- Trigger per aggiornare updated_at
CREATE TRIGGER update_sports_facilities_updated_at 
  BEFORE UPDATE ON public.sports_facilities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
