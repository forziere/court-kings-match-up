-- Inserimento semplificato solo utenti e statistiche del torneo
WITH user_data AS (
  SELECT 
    'Simone' as name, 'simone.lucca@sportconnect.it' as email, 'avanzato' as level, 8 as games, 7 as wins, 22 as points
  UNION ALL SELECT 'Fabrizio', 'fabrizio.lucca@sportconnect.it', 'avanzato', 8, 6, 20
  UNION ALL SELECT 'Andrea Porf', 'andrea.porf@sportconnect.it', 'avanzato', 9, 5, 20
  UNION ALL SELECT 'Gabriele', 'gabriele.lucca@sportconnect.it', 'avanzato', 10, 5, 20
  UNION ALL SELECT 'Sara', 'sara.lucca@sportconnect.it', 'avanzato', 7, 5, 18
  UNION ALL SELECT 'Filippo Torneo', 'filippo.tournament@sportconnect.it', 'avanzato', 9, 4, 17
  UNION ALL SELECT 'Riccardo', 'riccardo.lucca@sportconnect.it', 'avanzato', 9, 4, 17
  UNION ALL SELECT 'Franco', 'franco.lucca@sportconnect.it', 'avanzato', 7, 4, 17
  UNION ALL SELECT 'Luigi', 'luigi.lucca@sportconnect.it', 'avanzato', 10, 3, 16
  UNION ALL SELECT 'Andrea Bocca', 'andrea.bocca@sportconnect.it', 'intermedio', 9, 3, 15
  UNION ALL SELECT 'Riccardo Ru', 'riccardo.ru@sportconnect.it', 'intermedio', 7, 4, 15
  UNION ALL SELECT 'Alma', 'alma.lucca@sportconnect.it', 'intermedio', 6, 3, 14
  UNION ALL SELECT 'Federico', 'federico.lucca@sportconnect.it', 'intermedio', 5, 4, 13
  UNION ALL SELECT 'Paolo', 'paolo.lucca@sportconnect.it', 'intermedio', 6, 3, 13
  UNION ALL SELECT 'Margherita', 'margherita.lucca@sportconnect.it', 'intermedio', 5, 3, 12
  UNION ALL SELECT 'Dritan', 'dritan.lucca@sportconnect.it', 'intermedio', 8, 2, 12
  UNION ALL SELECT 'Rossella', 'rossella.lucca@sportconnect.it', 'intermedio', 8, 1, 12
  UNION ALL SELECT 'Stefania', 'stefania.lucca@sportconnect.it', 'intermedio', 6, 2, 11
  UNION ALL SELECT 'Federica', 'federica.lucca@sportconnect.it', 'intermedio', 7, 1, 11
  UNION ALL SELECT 'Nives', 'nives.lucca@sportconnect.it', 'intermedio', 7, 1, 11
  UNION ALL SELECT 'Maurizio', 'maurizio.lucca@sportconnect.it', 'principiante', 3, 3, 9
  UNION ALL SELECT 'Daniele', 'daniele.lucca@sportconnect.it', 'principiante', 4, 2, 8
  UNION ALL SELECT 'Marcello', 'marcello.lucca@sportconnect.it', 'principiante', 5, 1, 8
  UNION ALL SELECT 'Cristian M', 'cristian.m@sportconnect.it', 'principiante', 4, 2, 8
  UNION ALL SELECT 'Binelli', 'binelli.lucca@sportconnect.it', 'principiante', 4, 1, 7
  UNION ALL SELECT 'Irene', 'irene.lucca@sportconnect.it', 'principiante', 3, 2, 7
  UNION ALL SELECT 'Cristian', 'cristian.lucca@sportconnect.it', 'principiante', 2, 2, 6
  UNION ALL SELECT 'Ilaria', 'ilaria.lucca@sportconnect.it', 'principiante', 2, 2, 6
  UNION ALL SELECT 'Giuseppe Aute', 'giuseppe.aute@sportconnect.it', 'principiante', 4, 1, 6
  UNION ALL SELECT 'Giusettaro', 'giusettaro.lucca@sportconnect.it', 'principiante', 2, 2, 6
  UNION ALL SELECT 'Claudia', 'claudia.lucca@sportconnect.it', 'principiante', 3, 1, 5
  UNION ALL SELECT 'Stefano', 'stefano.lucca@sportconnect.it', 'principiante', 3, 1, 5
  UNION ALL SELECT 'Maicol', 'maicol.lucca@sportconnect.it', 'principiante', 3, 1, 5
  UNION ALL SELECT 'Lisa', 'lisa.lucca@sportconnect.it', 'principiante', 3, 1, 5
  UNION ALL SELECT 'Roberto Rizzo', 'roberto.rizzo@sportconnect.it', 'principiante', 2, 1, 4
  UNION ALL SELECT 'Federico Fab', 'federico.fab@sportconnect.it', 'principiante', 4, 0, 4
  UNION ALL SELECT 'Sara Scat', 'sara.scat@sportconnect.it', 'principiante', 0, 0, 0
  UNION ALL SELECT 'Roberta', 'roberta.lucca@sportconnect.it', 'principiante', 0, 0, 0
  UNION ALL SELECT 'Federico Moret', 'federico.moret@sportconnect.it', 'principiante', 0, 0, 0
  UNION ALL SELECT 'Luca Demommio', 'luca.demommio@sportconnect.it', 'principiante', 0, 0, 0
  UNION ALL SELECT 'Natascia', 'natascia.lucca@sportconnect.it', 'principiante', 0, 0, 0
),
inserted_users AS (
  INSERT INTO public.users (id, name, email, level, sport, city, payment_status, registration_fee_paid)
  SELECT gen_random_uuid(), name, email, level, 'padel', 'lucca', 'completed', true
  FROM user_data
  RETURNING id, name
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
    WHEN ud.points >= 8 THEN 2
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