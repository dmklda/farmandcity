-- Migration: Permitir UPDATE em community_topics para administradores

ALTER TABLE public.community_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can update any community topic" ON public.community_topics
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE admin_roles.user_id = auth.uid()
      AND admin_roles.role = ANY(ARRAY['admin', 'super_admin'])
      AND admin_roles.is_active = true
  )
);
