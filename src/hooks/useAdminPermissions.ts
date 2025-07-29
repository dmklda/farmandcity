import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

interface AdminRole {
  id: string;
  user_id: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'analyst';
  permissions: string[];
  is_active: boolean;
  expires_at: string | null;
  granted_at: string;
}

export const useAdminPermissions = () => {
  const { user, isAuthenticated } = useAuth();
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      if (!user || !isAuthenticated) {
        setAdminRole(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: dbError } = await supabase
          .from('admin_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (dbError) {
          if (dbError.code === 'PGRST116') {
            // No rows returned - user doesn't have admin role
            setAdminRole(null);
          } else {
            console.error('Error checking admin permissions:', dbError);
            setError('Erro ao verificar permissões');
          }
        } else if (data) {
          // Check if role has expired
          if (data.expires_at && new Date(data.expires_at) < new Date()) {
            setAdminRole(null);
            setError('Permissões expiradas');
          } else {
            setAdminRole(data);
          }
        } else {
          setAdminRole(null);
        }
      } catch (err) {
        console.error('Error checking admin permissions:', err);
        setError('Erro ao verificar permissões');
        setAdminRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [user, isAuthenticated]);

  const hasPermission = (permission: string): boolean => {
    if (!adminRole || !adminRole.is_active) return false;
    
    // Super admin tem todas as permissões
    if (adminRole.role === 'super_admin') return true;
    
    // Verificar se a permissão está na lista
    return adminRole.permissions.includes(permission);
  };

  const hasRole = (role: AdminRole['role']): boolean => {
    if (!adminRole || !adminRole.is_active) return false;
    
    // Super admin tem todas as roles
    if (adminRole.role === 'super_admin') return true;
    
    return adminRole.role === role;
  };

  const isSuperAdmin = (): boolean => {
    return adminRole?.role === 'super_admin' && adminRole?.is_active === true;
  };

  const isAdmin = (): boolean => {
    return (adminRole?.role === 'admin' || adminRole?.role === 'super_admin') && adminRole?.is_active === true;
  };

  const isModerator = (): boolean => {
    return (adminRole?.role === 'moderator' || adminRole?.role === 'admin' || adminRole?.role === 'super_admin') && adminRole?.is_active === true;
  };

  const isAnalyst = (): boolean => {
    return adminRole?.is_active === true;
  };

  return {
    adminRole,
    loading,
    error,
    hasPermission,
    hasRole,
    isSuperAdmin,
    isAdmin,
    isModerator,
    isAnalyst,
    isAuthenticated: !!adminRole && adminRole.is_active
  };
}; 