-- Criar tabela system_logs para logs do sistema
CREATE TABLE public.system_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_description TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  severity TEXT CHECK (severity IN ('info', 'warning', 'error', 'critical')) DEFAULT 'info',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela security_events para eventos de segurança
CREATE TABLE public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('detected', 'investigating', 'resolved')) DEFAULT 'detected',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Criar tabela admin_roles para controle de acesso
CREATE TABLE public.admin_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('super_admin', 'admin', 'moderator', 'analyst')) NOT NULL DEFAULT 'analyst',
  permissions JSONB NOT NULL DEFAULT '[]',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Criar tabela reports_generated para relatórios gerados
CREATE TABLE public.reports_generated (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL,
  report_name TEXT NOT NULL,
  generated_by UUID REFERENCES auth.users(id),
  parameters JSONB,
  file_url TEXT,
  status TEXT CHECK (status IN ('generating', 'completed', 'failed')) DEFAULT 'generating',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS em todas as tabelas
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports_generated ENABLE ROW LEVEL SECURITY;

-- Políticas para system_logs
CREATE POLICY "Admins can view all system logs" 
ON public.system_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

CREATE POLICY "System can insert logs" 
ON public.system_logs 
FOR INSERT 
WITH CHECK (true);

-- Políticas para security_events
CREATE POLICY "Admins can manage security events" 
ON public.security_events 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND is_active = true
    AND role IN ('super_admin', 'admin')
  )
);

-- Políticas para admin_roles
CREATE POLICY "Super admins can manage all roles" 
ON public.admin_roles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND is_active = true 
    AND role = 'super_admin'
  )
);

CREATE POLICY "Users can view their own role" 
ON public.admin_roles 
FOR SELECT 
USING (user_id = auth.uid());

-- Políticas para reports_generated
CREATE POLICY "Admins can manage reports" 
ON public.reports_generated 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

-- Função para log automático de eventos
CREATE OR REPLACE FUNCTION public.log_system_event(
  p_event_type TEXT,
  p_description TEXT,
  p_user_id UUID DEFAULT auth.uid(),
  p_metadata JSONB DEFAULT NULL,
  p_severity TEXT DEFAULT 'info'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
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