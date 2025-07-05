-- Aggiungi policy per permettere agli admin di vedere tutti gli utenti
CREATE POLICY "Admins can view all users" 
ON public.users 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));