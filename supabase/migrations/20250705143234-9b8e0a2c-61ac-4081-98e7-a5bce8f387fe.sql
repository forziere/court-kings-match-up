-- Correzione pagamenti con status valido
INSERT INTO public.payments (user_id, amount, status, description, currency) VALUES
((SELECT id FROM users WHERE name = 'Simone' LIMIT 1), 2500, 'succeeded', 'Prenotazione Campo Padel Central', 'eur'),
((SELECT id FROM users WHERE name = 'Fabrizio' LIMIT 1), 2000, 'succeeded', 'Prenotazione Tennis Club Lucca', 'eur'),
((SELECT id FROM users WHERE name = 'Sara' LIMIT 1), 3000, 'succeeded', 'Prenotazione Padel Arena Pro', 'eur'),
((SELECT id FROM users WHERE name = 'Gabriele' LIMIT 1), 2500, 'succeeded', 'Prenotazione Campo Padel Central', 'eur'),
((SELECT id FROM users WHERE name = 'Luigi' LIMIT 1), 4000, 'succeeded', 'Prenotazione Campo Calcetto Five', 'eur');