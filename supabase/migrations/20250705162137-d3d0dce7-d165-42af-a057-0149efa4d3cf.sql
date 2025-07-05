-- Rimuovi e ricrea la politica per user_stats update con approccio più semplice
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;

CREATE POLICY "Users can update their own stats" 
ON public.user_stats 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);