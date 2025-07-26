import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  UserCheck,
  UserX,
  Crown,
  Settings
} from 'lucide-react';

interface AdminRole {
  id: string;
  user_id: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'analyst';
  permissions: string[];
  granted_by: string | null;
  granted_at: string;
  expires_at: string | null;
  is_active: boolean;
  profiles?: {
    display_name: string;
    username: string;
  };
}

interface SecurityEvent {
  id: string;
  event_type: string;
  description: string;
  user_id: string | null;
  ip_address: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'investigating' | 'resolved';
  metadata: any;
  created_at: string;
  resolved_at: string | null;
}

export const SecurityPage: React.FC = () => {
  const [adminRoles, setAdminRoles] = useState<AdminRole[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'roles' | 'events'>('roles');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch admin roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('admin_roles')
        .select(`
          *,
          profiles (
            display_name,
            username
          )
        `)
        .order('granted_at', { ascending: false });

      if (rolesError) throw rolesError;

      // Fetch security events
      const { data: eventsData, error: eventsError } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (eventsError) throw eventsError;

      setAdminRoles((rolesData || []).map((role: any) => ({
        ...role,
        role: role.role as any
      })));
      setSecurityEvents((eventsData || []).map((event: any) => ({
        ...event,
        ip_address: event.ip_address as string | null
      })));
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRoleStatus = async (roleId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('admin_roles')
        .update({ is_active: !currentStatus })
        .eq('id', roleId);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating role status:', error);
    }
  };

  const updateEventStatus = async (eventId: string, status: SecurityEvent['status']) => {
    try {
      const updateData: any = { status };
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('security_events')
        .update(updateData)
        .eq('id', eventId);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating event status:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="h-4 w-4 text-purple-600" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'moderator':
        return <UserCheck className="h-4 w-4 text-green-600" />;
      case 'analyst':
        return <Eye className="h-4 w-4 text-gray-600" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'moderator':
        return 'bg-green-100 text-green-800';
      case 'analyst':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'high':
        return <XCircle className="h-4 w-4 text-orange-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected':
        return 'bg-red-100 text-red-800';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Segurança</h1>
            <p className="text-muted-foreground">Controle de acesso e eventos de segurança</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando dados de segurança...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Segurança</h1>
          <p className="text-muted-foreground">Controle de acesso e monitoramento de segurança</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'roles' ? 'default' : 'outline'}
            onClick={() => setActiveTab('roles')}
          >
            Funções de Admin
          </Button>
          <Button
            variant={activeTab === 'events' ? 'default' : 'outline'}
            onClick={() => setActiveTab('events')}
          >
            Eventos de Segurança
          </Button>
        </div>
      </div>

      {/* Admin Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Funções Administrativas ({adminRoles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminRoles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(role.role)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {role.profiles?.display_name || role.profiles?.username || 'Usuário sem nome'}
                            </span>
                            <Badge className={getRoleColor(role.role)}>
                              {role.role.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant={role.is_active ? "default" : "secondary"}>
                              {role.is_active ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Concedido em: {new Date(role.granted_at).toLocaleDateString('pt-BR')}
                            {role.expires_at && (
                              <span> • Expira em: {new Date(role.expires_at).toLocaleDateString('pt-BR')}</span>
                            )}
                          </div>
                          {role.permissions.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {role.permissions.map((permission, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleRoleStatus(role.id, role.is_active)}
                        >
                          {role.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          {role.is_active ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {adminRoles.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma função administrativa encontrada</h3>
                    <p className="text-muted-foreground">
                      Configure as primeiras funções administrativas para começar.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Events Tab */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Eventos de Segurança ({securityEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getSeverityIcon(event.severity)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{event.event_type}</span>
                            <Badge className={getStatusColor(event.status)}>
                              {event.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {event.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                          <div className="text-xs text-muted-foreground mt-2">
                            {new Date(event.created_at).toLocaleString('pt-BR')}
                            {event.ip_address && ` • IP: ${event.ip_address}`}
                            {event.resolved_at && (
                              <span> • Resolvido em: {new Date(event.resolved_at).toLocaleString('pt-BR')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {event.status !== 'resolved' && (
                        <div className="flex gap-2">
                          <Select
                            value={event.status}
                            onValueChange={(value) => updateEventStatus(event.id, value as SecurityEvent['status'])}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="detected">Detectado</SelectItem>
                              <SelectItem value="investigating">Investigando</SelectItem>
                              <SelectItem value="resolved">Resolvido</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {securityEvents.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum evento de segurança registrado</h3>
                    <p className="text-muted-foreground">
                      Todos os sistemas estão funcionando normalmente.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};