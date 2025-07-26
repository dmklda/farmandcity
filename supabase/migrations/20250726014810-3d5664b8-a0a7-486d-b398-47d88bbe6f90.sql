-- Corrigir as duas funções que ainda estão com warning de search_path
CREATE OR REPLACE FUNCTION public.check_is_super_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.log_system_event(p_event_type text, p_description text, p_user_id uuid DEFAULT auth.uid(), p_metadata jsonb DEFAULT NULL::jsonb, p_severity text DEFAULT 'info'::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.system_logs (
    event_type,
    event_description,
    user_id,
    metadata,
    severity
  ) VALUES (
    p_event_type,
    p_description,
    p_user_id,
    p_metadata,
    p_severity
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;