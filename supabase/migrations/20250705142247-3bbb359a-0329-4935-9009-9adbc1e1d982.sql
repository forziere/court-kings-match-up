-- Prima elimino gli inserimenti precedenti se esistono
DELETE FROM public.users WHERE city = 'lucca' AND name != 'Filippo Mori';

-- Inserimento utenti del torneo di padel di Lucca con statistiche reali
WITH user_data AS (
  SELECT 
    gen_random_uuid() as user_id,
    'Simone' as name, 'simone.lucca@sportconnect.it' as email, 'avanzato' as level, 8 as games, 7 as wins, 22 as points
  UNION ALL SELECT gen_random_uuid(), 'Fabrizio', 'fabrizio.lucca@sportconnect.it', 'avanzato', 8, 6, 20
  UNION ALL SELECT gen_random_uuid(), 'Andrea Porf', 'andrea.porf@sportconnect.it', 'avanzato', 9, 5, 20
  UNION ALL SELECT gen_random_uuid(), 'Gabriele', 'gabriele.lucca@sportconnect.it', 'avanzato', 10, 5, 20
  UNION ALL SELECT gen_random_uuid(), 'Sara', 'sara.lucca@sportconnect.it', 'avanzato', 7, 5, 18
  UNION ALL SELECT gen_random_uuid(), 'Filippo Torneo', 'filippo.tournament@sportconnect.it', 'avanzato', 9, 4, 17
  UNION ALL SELECT gen_random_uuid(), 'Riccardo', 'riccardo.lucca@sportconnect.it', 'avanzato', 9, 4, 17
  UNION ALL SELECT gen_random_uuid(), 'Franco', 'franco.lucca@sportconnect.it', 'avanzato', 7, 4, 17
  UNION ALL SELECT gen_random_uuid(), 'Luigi', 'luigi.lucca@sportconnect.it', 'avanzato', 10, 3, 16
  UNION ALL SELECT gen_random_uuid(), 'Andrea Bocca', 'andrea.bocca@sportconnect.it', 'intermedio', 9, 3, 15
  UNION ALL SELECT gen_random_uuid(), 'Riccardo Ru', 'riccardo.ru@sportconnect.it', 'intermedio', 7, 4, 15
  UNION ALL SELECT gen_random_uuid(), 'Alma', 'alma.lucca@sportconnect.it', 'intermedio', 6, 3, 14
  UNION ALL SELECT gen_random_uuid(), 'Federico', 'federico.lucca@sportconnect.it', 'intermedio', 5, 4, 13
  UNION ALL SELECT gen_random_uuid(), 'Paolo', 'paolo.lucca@sportconnect.it', 'intermedio', 6, 3, 13
  UNION ALL SELECT gen_random_uuid(), 'Margherita', 'margherita.lucca@sportconnect.it', 'intermedio', 5, 3, 12
  UNION ALL SELECT gen_random_uuid(), 'Dritan', 'dritan.lucca@sportconnect.it', 'intermedio', 8, 2, 12
  UNION ALL SELECT gen_random_uuid(), 'Rossella', 'rossella.lucca@sportconnect.it', 'intermedio', 8, 1, 12
  UNION ALL SELECT gen_random_uuid(), 'Stefania', 'stefania.lucca@sportconnect.it', 'intermedio', 6, 2, 11
  UNION ALL SELECT gen_random_uuid(), 'Federica', 'federica.lucca@sportconnect.it', 'intermedio', 7, 1, 11
  UNION ALL SELECT gen_random_uuid(), 'Nives', 'nives.lucca@sportconnect.it', 'intermedio', 7, 1, 11
  UNION ALL SELECT gen_random_uuid(), 'Maurizio', 'maurizio.lucca@sportconnect.it', 'principiante', 3, 3, 9
  UNION ALL SELECT gen_random_uuid(), 'Daniele', 'daniele.lucca@sportconnect.it', 'principiante', 4, 2, 8
  UNION ALL SELECT gen_random_uuid(), 'Marcello', 'marcello.lucca@sportconnect.it', 'principiante', 5, 1, 8
  UNION ALL SELECT gen_random_uuid(), 'Cristian M', 'cristian.m@sportconnect.it', 'principiante', 4, 2, 8
  UNION ALL SELECT gen_random_uuid(), 'Binelli', 'binelli.lucca@sportconnect.it', 'principiante', 4, 1, 7
  UNION ALL SELECT gen_random_uuid(), 'Irene', 'irene.lucca@sportconnect.it', 'principiante', 3, 2, 7
  UNION ALL SELECT gen_random_uuid(), 'Cristian', 'cristian.lucca@sportconnect.it', 'principiante', 2, 2, 6
  UNION ALL SELECT gen_random_uuid(), 'Ilaria', 'ilaria.lucca@sportconnect.it', 'principiante', 2, 2, 6
  UNION ALL SELECT gen_random_uuid(), 'Giuseppe Aute', 'giuseppe.aute@sportconnect.it', 'principiante', 4, 1, 6
  UNION ALL SELECT gen_random_uuid(), 'Giusettaro', 'giusettaro.lucca@sportconnect.it', 'principiante', 2, 2, 6
  UNION ALL SELECT gen_random_uuid(), 'Claudia', 'claudia.lucca@sportconnect.it', 'principiante', 3, 1, 5
  UNION ALL SELECT gen_random_uuid(), 'Stefano', 'stefano.lucca@sportconnect.it', 'principiante', 3, 1, 5
  UNION ALL SELECT gen_random_uuid(), 'Maicol', 'maicol.lucca@sportconnect.it', 'principiante', 3, 1, 5
  UNION ALL SELECT gen_random_uuid(), 'Lisa', 'lisa.lucca@sportconnect.it', 'principiante', 3, 1, 5
  UNION ALL SELECT gen_random_uuid(), 'Roberto Rizzo', 'roberto.rizzo@sportconnect.it', 'principiante', 2, 1, 4
  UNION ALL SELECT gen_random_uuid(), 'Federico Fab', 'federico.fab@sportconnect.it', 'principiante', 4, 0, 4
  UNION ALL SELECT gen_random_uuid(), 'Sara Scat', 'sara.scat@sportconnect.it', 'principiante', 0, 0, 0
  UNION ALL SELECT gen_random_uuid(), 'Roberta', 'roberta.lucca@sportconnect.it', 'principiante', 0, 0, 0
  UNION ALL SELECT gen_random_uuid(), 'Federico Moret', 'federico.moret@sportconnect.it', 'principiante', 0, 0, 0
  UNION ALL SELECT gen_random_uuid(), 'Luca Demommio', 'luca.demommio@sportconnect.it', 'principiante', 0, 0, 0
  UNION ALL SELECT gen_random_uuid(), 'Natascia', 'natascia.lucca@sportconnect.it', 'principiante', 0, 0, 0
),
inserted_users AS (
  INSERT INTO public.users (id, name, email, level, sport, city, payment_status, registration_fee_paid)
  SELECT user_id, name, email, level, 'padel', 'lucca', 'completed', true
  FROM user_data
  RETURNING id, name, email, level, sport, city
),
user_roles_insert AS (
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'user'::app_role FROM inserted_users
  RETURNING user_id
)
INSERT INTO public.user_stats (user_id, games_played, wins, losses, points, elo_rating, level, skill_level)
SELECT 
  iu.id,
  ud.games,
  ud.wins,
  ud.games - ud.wins as losses,
  ud.points,
  1000 + (ud.points * 10) as elo_rating,
  CASE 
    WHEN ud.points >= 20 THEN 4
    WHEN ud.points >= 15 THEN 3  
    WHEN ud.points >= 10 THEN 2
    ELSE 1
  END as level,
  CASE 
    WHEN ud.points >= 20 THEN 'avanzato'
    WHEN ud.points >= 15 THEN 'intermedio'
    WHEN ud.points >= 8 THEN 'principiante'
    ELSE 'principiante'
  END as skill_level
FROM inserted_users iu
JOIN user_data ud ON iu.name = ud.name;