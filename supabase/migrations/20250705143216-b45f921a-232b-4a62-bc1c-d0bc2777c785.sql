-- Aggiungi alcune prenotazioni di esempio (correzione)
INSERT INTO public.bookings (user_id, facility_id, booking_date, booking_time, start_time, end_time, amount, status, total_amount) VALUES
((SELECT id FROM users WHERE name = 'Simone' LIMIT 1), (SELECT id FROM sports_facilities WHERE name = 'Campo Padel Central' LIMIT 1), CURRENT_DATE, '09:00-10:00', '09:00', '10:00', 25, 'confirmed', 25),
((SELECT id FROM users WHERE name = 'Fabrizio' LIMIT 1), (SELECT id FROM sports_facilities WHERE name = 'Tennis Club Lucca' LIMIT 1), CURRENT_DATE, '10:00-11:00', '10:00', '11:00', 20, 'confirmed', 20),
((SELECT id FROM users WHERE name = 'Sara' LIMIT 1), (SELECT id FROM sports_facilities WHERE name = 'Padel Arena Pro' LIMIT 1), CURRENT_DATE, '11:00-12:00', '11:00', '12:00', 30, 'confirmed', 30),
((SELECT id FROM users WHERE name = 'Andrea Porf' LIMIT 1), (SELECT id FROM sports_facilities WHERE name = 'Campo Calcetto Five' LIMIT 1), CURRENT_DATE, '14:00-15:00', '14:00', '15:00', 40, 'pending', 40),
((SELECT id FROM users WHERE name = 'Gabriele' LIMIT 1), (SELECT id FROM sports_facilities WHERE name = 'Campo Padel Central' LIMIT 1), CURRENT_DATE, '15:00-16:00', '15:00', '16:00', 25, 'confirmed', 25);

-- Aggiungi alcuni pagamenti di esempio
INSERT INTO public.payments (user_id, amount, status, description, currency) VALUES
((SELECT id FROM users WHERE name = 'Simone' LIMIT 1), 2500, 'completed', 'Prenotazione Campo Padel Central', 'eur'),
((SELECT id FROM users WHERE name = 'Fabrizio' LIMIT 1), 2000, 'completed', 'Prenotazione Tennis Club Lucca', 'eur'),
((SELECT id FROM users WHERE name = 'Sara' LIMIT 1), 3000, 'completed', 'Prenotazione Padel Arena Pro', 'eur'),
((SELECT id FROM users WHERE name = 'Gabriele' LIMIT 1), 2500, 'completed', 'Prenotazione Campo Padel Central', 'eur'),
((SELECT id FROM users WHERE name = 'Luigi' LIMIT 1), 4000, 'completed', 'Prenotazione Campo Calcetto Five', 'eur');