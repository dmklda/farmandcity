-- Primeiro, vou corrigir o problema de recursão infinita nas políticas RLS

-- Drop as políticas problemáticas da tabela admin_roles
DROP POLICY IF EXISTS "Super admins can manage all roles" ON admin_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON admin_roles;

-- Criar uma função security definer para verificar se é super admin
CREATE OR REPLACE FUNCTION check_is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Criar políticas não recursivas
CREATE POLICY "Super admins can manage all roles" 
ON admin_roles FOR ALL 
TO authenticated
USING (check_is_super_admin());

CREATE POLICY "Users can view their own role" 
ON admin_roles FOR SELECT 
TO authenticated
USING (user_id = auth.uid());