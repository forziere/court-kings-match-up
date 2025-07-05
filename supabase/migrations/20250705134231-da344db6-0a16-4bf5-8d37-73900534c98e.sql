-- Fix admin user role assignment
-- First, find and update the current filippomori69@gmail.com user
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the user ID for filippomori69@gmail.com from auth.users
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'filippomori69@gmail.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Insert or update admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin role assigned to user ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'User filippomori69@gmail.com not found in auth.users';
    END IF;
END $$;

-- Also ensure any existing user gets a default role if they don't have one
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user'
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = au.id
)
ON CONFLICT (user_id, role) DO NOTHING;