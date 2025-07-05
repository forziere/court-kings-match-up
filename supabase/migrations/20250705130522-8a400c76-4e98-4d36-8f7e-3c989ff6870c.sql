-- Insert sample sports facilities 
INSERT INTO public.sports_facilities (name, sport, city, location, price_per_hour, base_price_per_30min, rating, features, time_slots, extras, price_rules) VALUES 
('Centro Sportivo Lucca', 'Padel', 'Lucca', 'Via Roma 123, Lucca', 3000, 1500, 4.8, 
 ARRAY['Spogliatoi', 'Parcheggio', 'Bar'], 
 '[{"start": "08:00", "end": "08:30", "available": true}, {"start": "08:30", "end": "09:00", "available": true}, {"start": "09:00", "end": "09:30", "available": true}, {"start": "09:30", "end": "10:00", "available": true}, {"start": "10:00", "end": "10:30", "available": true}, {"start": "18:00", "end": "18:30", "available": true}, {"start": "18:30", "end": "19:00", "available": true}, {"start": "19:00", "end": "19:30", "available": true}, {"start": "19:30", "end": "20:00", "available": true}, {"start": "20:00", "end": "20:30", "available": true}]'::jsonb,
 '[{"name": "Luci notturne", "price": 500}, {"name": "Riscaldamento", "price": 300}]'::jsonb,
 '[{"condition": "peak_hours", "hours": ["17:00-21:00"], "multiplier": 1.5}, {"condition": "weekend", "multiplier": 1.3}]'::jsonb
),
('Club Tennis Lucca', 'Tennis', 'Lucca', 'Viale Europa 45, Lucca', 2500, 1250, 4.6,
 ARRAY['Spogliatoi', 'Parcheggio', 'Ristorante'],
 '[{"start": "08:00", "end": "08:30", "available": true}, {"start": "08:30", "end": "09:00", "available": true}, {"start": "09:00", "end": "09:30", "available": true}, {"start": "17:00", "end": "17:30", "available": true}, {"start": "17:30", "end": "18:00", "available": true}, {"start": "18:00", "end": "18:30", "available": true}, {"start": "18:30", "end": "19:00", "available": true}, {"start": "19:00", "end": "19:30", "available": true}]'::jsonb,
 '[{"name": "Luci notturne", "price": 400}, {"name": "Lezioni private", "price": 2000}]'::jsonb,
 '[{"condition": "peak_hours", "hours": ["17:00-20:00"], "multiplier": 1.4}]'::jsonb
),
('Palestra Calcetto Lucca', 'Calcio', 'Lucca', 'Via Nazionale 78, Lucca', 4000, 2000, 4.5,
 ARRAY['Spogliatoi', 'Parcheggio', 'Docce'],
 '[{"start": "19:00", "end": "19:30", "available": true}, {"start": "19:30", "end": "20:00", "available": true}, {"start": "20:00", "end": "20:30", "available": true}, {"start": "20:30", "end": "21:00", "available": true}, {"start": "21:00", "end": "21:30", "available": true}]'::jsonb,
 '[{"name": "Arbitro", "price": 1500}, {"name": "Palloni extra", "price": 200}]'::jsonb,
 '[{"condition": "weekend", "multiplier": 1.2}]'::jsonb
);