-- Aggiungi alcuni campi sportivi di esempio per Lucca
INSERT INTO public.sports_facilities (name, sport, city, location, price_per_hour, manager_id) VALUES
('Campo Padel Central', 'padel', 'lucca', 'Via delle Mura, 15', 25, (SELECT id FROM users WHERE email = 'filippomori69@gmail.com' LIMIT 1)),
('Tennis Club Lucca', 'tennis', 'lucca', 'Viale Europa, 22', 20, (SELECT id FROM users WHERE email = 'filippomori69@gmail.com' LIMIT 1)),
('Padel Arena Pro', 'padel', 'lucca', 'Via San Paolino, 8', 30, (SELECT id FROM users WHERE email = 'filippomori69@gmail.com' LIMIT 1)),
('Campo Calcetto Five', 'calcio', 'lucca', 'Via del Brennero, 45', 40, (SELECT id FROM users WHERE email = 'filippomori69@gmail.com' LIMIT 1));

-- Aggiungi alcune prenotazioni di esempio
INSERT INTO public.bookings (user_id, facility_id, booking_date, start_time, end_time, amount, status, total_amount) VALUES
((SELECT id FROM users WHERE name = 'Simone' LIMIT 1), (SELECT id FROM sports_facilities WHERE name = 'Campo Padel Central' LIMIT 1), CURRENT_DATE, '09:00', '10:00', 25, 'confirmed', 25),
((SELECT id FROM users WHERE name = 'Fabrizio' LIMIT 1), (SELECT id FROM sports_facilities WHERE name = 'Tennis Club Lucca' LIMIT 1), CURRENT_DATE, '10:00', '11:00', 20, 'confirmed', 20),
((SELECT id FROM users WHERE name = 'Sara' LIMIT 1), (SELECT id FROM sports_facilities WHERE name = 'Padel Arena Pro' LIMIT 1), CURRENT_DATE, '11:00', '12:00', 30, 'confirmed', 30),
((SELECT id FROM users WHERE name = 'Andrea Porf' LIMIT 1), (SELECT id FROM sports_facilities WHERE name = 'Campo Calcetto Five' LIMIT 1), CURRENT_DATE, '14:00', '15:00', 40, 'pending', 40),
((SELECT id FROM users WHERE name = 'Gabriele' LIMIT 1), (SELECT id FROM sports_facilities WHERE name = 'Campo Padel Central' LIMIT 1), CURRENT_DATE, '15:00', '16:00', 25, 'confirmed', 25);

-- Aggiungi alcuni pagamenti di esempio
INSERT INTO public.payments (user_id, amount, status, description, currency) VALUES
((SELECT id FROM users WHERE name = 'Simone' LIMIT 1), 2500, 'completed', 'Prenotazione Campo Padel Central', 'eur'),
((SELECT id FROM users WHERE name = 'Fabrizio' LIMIT 1), 2000, 'completed', 'Prenotazione Tennis Club Lucca', 'eur'),
((SELECT id FROM users WHERE name = 'Sara' LIMIT 1), 3000, 'completed', 'Prenotazione Padel Arena Pro', 'eur'),
((SELECT id FROM users WHERE name = 'Gabriele' LIMIT 1), 2500, 'completed', 'Prenotazione Campo Padel Central', 'eur'),
((SELECT id FROM users WHERE name = 'Luigi' LIMIT 1), 4000, 'completed', 'Prenotazione Campo Calcetto Five', 'eur');