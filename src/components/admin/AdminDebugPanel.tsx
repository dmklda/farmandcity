import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAdminPermissions } from '../../hooks/useAdminPermissions';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  User, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Database
} from 'lucide-react';

export const AdminDebugPanel: React.FC = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { 
    adminRole, 
    loading: permissionsLoading, 
    error, 
    isAuthenticated: hasAdminAccess,
    isSuperAdmin,
    isAdmin,
    isModerator,
    isAnalyst
  } = useAdminPermissions();

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Debug - Painel Administrativo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status de Autenticação */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Status de Autenticação
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Loading Auth:</span>
                <Badge variant={authLoading ? "destructive" : "default"} className="ml-2">
                  {authLoading ? "Carregando..." : "Concluído"}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Usuário Logado:</span>
                <Badge variant={isAuthenticated ? "default" : "destructive"} className="ml-2">
                  {isAuthenticated ? "Sim" : "Não"}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Email:</span>
                <span className="ml-2 text-muted-foreground">
                  {user?.email || "N/A"}
                </span>
              </div>
              <div>
                <span className="font-medium">User ID:</span>
                <span className="ml-2 text-muted-foreground font-mono text-xs">
                  {user?.id || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Status de Permissões */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Status de Permissões
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Loading Permissions:</span>
                <Badge variant={permissionsLoading ? "destructive" : "default"} className="ml-2">
                  {permissionsLoading ? "Carregando..." : "Concluído"}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Acesso Admin:</span>
                <Badge variant={hasAdminAccess ? "default" : "destructive"} className="ml-2">
                  {hasAdminAccess ? "Permitido" : "Negado"}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Role:</span>
                <Badge variant="outline" className="ml-2">
                  {adminRole?.role || "Nenhuma"}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Ativo:</span>
                <Badge variant={adminRole?.is_active ? "default" : "destructive"} className="ml-2">
                  {adminRole?.is_active ? "Sim" : "Não"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Níveis de Acesso */}
          <div className="space-y-2">
            <h3 className="font-semibold">Níveis de Acesso</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Super Admin:</span>
                {isSuperAdmin() ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Admin:</span>
                {isAdmin() ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Moderator:</span>
                {isModerator() ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Analyst:</span>
                {isAnalyst() ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
          </div>

          {/* Detalhes da Role */}
          {adminRole && (
            <div className="space-y-2">
              <h3 className="font-semibold">Detalhes da Role</h3>
              <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                <div><strong>ID:</strong> {adminRole.id}</div>
                <div><strong>User ID:</strong> {adminRole.user_id}</div>
                <div><strong>Role:</strong> {adminRole.role}</div>
                <div><strong>Permissions:</strong> {adminRole.permissions.join(', ') || 'Nenhuma'}</div>
                <div><strong>Granted At:</strong> {new Date(adminRole.granted_at).toLocaleString()}</div>
                <div><strong>Expires At:</strong> {adminRole.expires_at ? new Date(adminRole.expires_at).toLocaleString() : 'Nunca'}</div>
                <div><strong>Active:</strong> {adminRole.is_active ? 'Sim' : 'Não'}</div>
              </div>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                Erro
              </h3>
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-800">
                {error}
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-2 pt-4">
            <Button onClick={refreshPage} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Recarregar
            </Button>
            <Button 
              onClick={() => window.location.href = '/admin'} 
              variant="default"
              disabled={!hasAdminAccess}
            >
              Tentar Acessar Admin
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 