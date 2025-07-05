-- Crea bucket per foto profilo
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Crea politiche per upload foto profilo
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Aggiungi campo per emoji utente nella tabella user_stats
ALTER TABLE public.user_stats 
ADD COLUMN user_emoji text DEFAULT '😊';

-- Aggiungi campo per mano preferita
ALTER TABLE public.user_stats 
ADD COLUMN preferred_hand text DEFAULT 'Destro';

-- Aggiungi campo per posizione preferita  
ALTER TABLE public.user_stats 
ADD COLUMN preferred_position text DEFAULT 'Destra';

-- Aggiungi campo per tipo di partita preferito
ALTER TABLE public.user_stats 
ADD COLUMN preferred_match_type text DEFAULT 'Amichevole';