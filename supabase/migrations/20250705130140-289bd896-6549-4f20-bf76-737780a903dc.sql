-- Assign admin role to filippomori69@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('9f16a161-af6f-489b-8640-0f4641247c07', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;