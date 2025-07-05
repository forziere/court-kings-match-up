-- Inserimento utenti del torneo di padel di Lucca
-- Tutti avranno password generica 'SportConnect2024!' da cambiare al primo accesso

-- Inserimento nella tabella users
INSERT INTO public.users (id, name, email, level, sport, city, payment_status, registration_fee_paid) VALUES 
(gen_random_uuid(), 'Simone', 'simone.lucca@sportconnect.it', 'avanzato', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Fabrizio', 'fabrizio.lucca@sportconnect.it', 'avanzato', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Andrea Porf', 'andrea.porf@sportconnect.it', 'avanzato', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Gabriele', 'gabriele.lucca@sportconnect.it', 'avanzato', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Sara', 'sara.lucca@sportconnect.it', 'avanzato', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Filippo', 'filippo.tournament@sportconnect.it', 'avanzato', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Riccardo', 'riccardo.lucca@sportconnect.it', 'avanzato', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Franco', 'franco.lucca@sportconnect.it', 'avanzato', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Luigi', 'luigi.lucca@sportconnect.it', 'avanzato', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Andrea Bocca', 'andrea.bocca@sportconnect.it', 'intermedio', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Riccardo Ru', 'riccardo.ru@sportconnect.it', 'intermedio', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Alma', 'alma.lucca@sportconnect.it', 'intermedio', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Federico', 'federico.lucca@sportconnect.it', 'intermedio', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Paolo', 'paolo.lucca@sportconnect.it', 'intermedio', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Margherita', 'margherita.lucca@sportconnect.it', 'intermedio', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Dritan', 'dritan.lucca@sportconnect.it', 'intermedio', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Rossella', 'rossella.lucca@sportconnect.it', 'intermedio', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Stefania', 'stefania.lucca@sportconnect.it', 'intermedio', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Federica', 'federica.lucca@sportconnect.it', 'intermedio', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Nives', 'nives.lucca@sportconnect.it', 'intermedio', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Maurizio', 'maurizio.lucca@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Daniele', 'daniele.lucca@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Marcello', 'marcello.lucca@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Cristian M', 'cristian.m@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Binelli', 'binelli.lucca@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Irene', 'irene.lucca@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Cristian', 'cristian.lucca@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Ilaria', 'ilaria.lucca@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Giuseppe Aute', 'giuseppe.aute@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Giusettaro', 'giusettaro.lucca@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Claudia', 'claudia.lucca@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Stefano', 'stefano.lucca@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Maicol', 'maicol.lucca@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Lisa', 'lisa.lucca@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Roberto Rizzo', 'roberto.rizzo@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Federico Fab', 'federico.fab@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Sara Scat', 'sara.scat@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Roberta', 'roberta.lucca@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Federico Moret', 'federico.moret@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Luca Demommio', 'luca.demommio@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true),
(gen_random_uuid(), 'Natascia', 'natascia.lucca@sportconnect.it', 'principiante', 'padel', 'lucca', 'completed', true);

-- Creazione profili per tutti gli utenti
INSERT INTO public.profiles (id, name, sport, level, city)
SELECT id, name, sport, level, city FROM public.users WHERE city = 'lucca' AND name != 'Filippo Mori';

-- Assegnazione ruolo user a tutti
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user' FROM public.users WHERE city = 'lucca' AND name != 'Filippo Mori';

-- Inserimento statistiche reali dal torneo
WITH tournament_stats AS (
  SELECT 
    u.id as user_id,
    u.name,
    CASE u.name
      WHEN 'Simone' THEN 8
      WHEN 'Fabrizio' THEN 8  
      WHEN 'Andrea Porf' THEN 9
      WHEN 'Gabriele' THEN 10
      WHEN 'Sara' THEN 7
      WHEN 'Filippo' THEN 9
      WHEN 'Riccardo' THEN 9
      WHEN 'Franco' THEN 7
      WHEN 'Luigi' THEN 10
      WHEN 'Andrea Bocca' THEN 9
      WHEN 'Riccardo Ru' THEN 7
      WHEN 'Alma' THEN 6
      WHEN 'Federico' THEN 5
      WHEN 'Paolo' THEN 6
      WHEN 'Margherita' THEN 5
      WHEN 'Dritan' THEN 8
      WHEN 'Rossella' THEN 8
      WHEN 'Stefania' THEN 6
      WHEN 'Federica' THEN 7
      WHEN 'Nives' THEN 7
      WHEN 'Maurizio' THEN 3
      WHEN 'Daniele' THEN 4
      WHEN 'Marcello' THEN 5
      WHEN 'Cristian M' THEN 4
      WHEN 'Binelli' THEN 4
      WHEN 'Irene' THEN 3
      WHEN 'Cristian' THEN 2
      WHEN 'Ilaria' THEN 2
      WHEN 'Giuseppe Aute' THEN 4
      WHEN 'Giusettaro' THEN 2
      WHEN 'Claudia' THEN 3
      WHEN 'Stefano' THEN 3
      WHEN 'Maicol' THEN 3
      WHEN 'Lisa' THEN 3
      WHEN 'Roberto Rizzo' THEN 2
      WHEN 'Federico Fab' THEN 4
      ELSE 0
    END as games_played,
    CASE u.name
      WHEN 'Simone' THEN 7
      WHEN 'Fabrizio' THEN 6  
      WHEN 'Andrea Porf' THEN 5
      WHEN 'Gabriele' THEN 5
      WHEN 'Sara' THEN 5
      WHEN 'Filippo' THEN 4
      WHEN 'Riccardo' THEN 4
      WHEN 'Franco' THEN 4
      WHEN 'Luigi' THEN 3
      WHEN 'Andrea Bocca' THEN 3
      WHEN 'Riccardo Ru' THEN 4
      WHEN 'Alma' THEN 3
      WHEN 'Federico' THEN 4
      WHEN 'Paolo' THEN 3
      WHEN 'Margherita' THEN 3
      WHEN 'Dritan' THEN 2
      WHEN 'Rossella' THEN 1
      WHEN 'Stefania' THEN 2
      WHEN 'Federica' THEN 1
      WHEN 'Nives' THEN 1
      WHEN 'Maurizio' THEN 3
      WHEN 'Daniele' THEN 2
      WHEN 'Marcello' THEN 1
      WHEN 'Cristian M' THEN 2
      WHEN 'Binelli' THEN 1
      WHEN 'Irene' THEN 2
      WHEN 'Cristian' THEN 2
      WHEN 'Ilaria' THEN 2
      WHEN 'Giuseppe Aute' THEN 1
      WHEN 'Giusettaro' THEN 2
      WHEN 'Claudia' THEN 1
      WHEN 'Stefano' THEN 1
      WHEN 'Maicol' THEN 1
      WHEN 'Lisa' THEN 1
      WHEN 'Roberto Rizzo' THEN 1
      WHEN 'Federico Fab' THEN 0
      ELSE 0
    END as wins,
    CASE u.name
      WHEN 'Simone' THEN 22
      WHEN 'Fabrizio' THEN 20  
      WHEN 'Andrea Porf' THEN 20
      WHEN 'Gabriele' THEN 20
      WHEN 'Sara' THEN 18
      WHEN 'Filippo' THEN 17
      WHEN 'Riccardo' THEN 17
      WHEN 'Franco' THEN 17
      WHEN 'Luigi' THEN 16
      WHEN 'Andrea Bocca' THEN 15
      WHEN 'Riccardo Ru' THEN 15
      WHEN 'Alma' THEN 14
      WHEN 'Federico' THEN 13
      WHEN 'Paolo' THEN 13
      WHEN 'Margherita' THEN 12
      WHEN 'Dritan' THEN 12
      WHEN 'Rossella' THEN 12
      WHEN 'Stefania' THEN 11
      WHEN 'Federica' THEN 11
      WHEN 'Nives' THEN 11
      WHEN 'Maurizio' THEN 9
      WHEN 'Daniele' THEN 8
      WHEN 'Marcello' THEN 8
      WHEN 'Cristian M' THEN 8
      WHEN 'Binelli' THEN 7
      WHEN 'Irene' THEN 7
      WHEN 'Cristian' THEN 6
      WHEN 'Ilaria' THEN 6
      WHEN 'Giuseppe Aute' THEN 6
      WHEN 'Giusettaro' THEN 6
      WHEN 'Claudia' THEN 5
      WHEN 'Stefano' THEN 5
      WHEN 'Maicol' THEN 5
      WHEN 'Lisa' THEN 5
      WHEN 'Roberto Rizzo' THEN 4
      WHEN 'Federico Fab' THEN 4
      ELSE 0
    END as points
  FROM public.users u
  WHERE u.city = 'lucca' AND u.name != 'Filippo Mori'
)
INSERT INTO public.user_stats (user_id, games_played, wins, losses, points, elo_rating, level, skill_level)
SELECT 
  user_id,
  games_played,
  wins,
  games_played - wins as losses,
  points,
  1000 + (points * 10) as elo_rating,
  CASE 
    WHEN points >= 20 THEN 4
    WHEN points >= 15 THEN 3  
    WHEN points >= 10 THEN 2
    ELSE 1
  END as level,
  CASE 
    WHEN points >= 20 THEN 'avanzato'
    WHEN points >= 15 THEN 'intermedio'
    WHEN points >= 10 THEN 'principiante'
    ELSE 'principiante'
  END as skill_level
FROM tournament_stats;