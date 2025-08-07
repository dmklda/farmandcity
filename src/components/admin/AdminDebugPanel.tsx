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
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="h-5 w-5" />
            Debug - Painel Administrativo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* Status de Autenticação */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2 text-white">
              <User className="h-4 w-4" />
              Status de Autenticação
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-300">Loading Auth:</span>
                <Badge variant={authLoading ? "destructive" : "default"} className="ml-2 bg-red-600 text-white">
                  {authLoading ? "Carregando..." : "Concluído"}
                </Badge>
              </div>
              <div>
                <span className="font-medium text-gray-300">Usuário Logado:</span>
                <Badge variant={isAuthenticated ? "default" : "destructive"} className="ml-2 bg-green-600 text-white">
                  {isAuthenticated ? "Sim" : "Não"}
                </Badge>
              </div>
              <div>
                <span className="font-medium text-gray-300">Email:</span>
                <span className="ml-2 text-gray-400">
                  {user?.email || "N/A"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-300">User ID:</span>
                <span className="ml-2 text-gray-400 font-mono text-xs">
                  {user?.id || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Status de Permissões */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2 text-white">
              <Shield className="h-4 w-4" />
              Status de Permissões
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-300">Loading Permissions:</span>
                <Badge variant={permissionsLoading ? "destructive" : "default"} className="ml-2 bg-red-600 text-white">
                  {permissionsLoading ? "Carregando..." : "Concluído"}
                </Badge>
              </div>
              <div>
                <span className="font-medium text-gray-300">Acesso Admin:</span>
                <Badge variant={hasAdminAccess ? "default" : "destructive"} className="ml-2 bg-green-600 text-white">
                  {hasAdminAccess ? "Permitido" : "Negado"}
                </Badge>
              </div>
              <div>
                <span className="font-medium text-gray-300">Role:</span>
                <Badge variant="outline" className="ml-2 border-gray-600 text-gray-300">
                  {adminRole?.role || "Nenhuma"}
                </Badge>
              </div>
              <div>
                <span className="font-medium text-gray-300">Ativo:</span>
                <Badge variant={adminRole?.is_active ? "default" : "destructive"} className="ml-2 bg-green-600 text-white">
                  {adminRole?.is_active ? "Sim" : "Não"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Níveis de Acesso */}
          <div className="space-y-2">
            <h3 className="font-semibold text-white">Níveis de Acesso</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-300">Super Admin:</span>
                {isSuperAdmin() ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-300">Admin:</span>
                {isAdmin() ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-300">Moderator:</span>
                {isModerator() ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-300">Analyst:</span>
                {isAnalyst() ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
              </div>
            </div>
          </div>

          {/* Detalhes da Role */}
          {adminRole && (
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Detalhes da Role</h3>
              <div className="bg-gray-800 p-3 rounded-lg space-y-1 text-sm border border-gray-700">
                <div className="text-gray-300"><strong className="text-white">ID:</strong> {adminRole.id}</div>
                <div className="text-gray-300"><strong className="text-white">User ID:</strong> {adminRole.user_id}</div>
                <div className="text-gray-300"><strong className="text-white">Role:</strong> {adminRole.role}</div>
                <div className="text-gray-300"><strong className="text-white">Permissions:</strong> {adminRole.permissions.join(', ') || 'Nenhuma'}</div>
                <div className="text-gray-300"><strong className="text-white">Granted At:</strong> {new Date(adminRole.granted_at).toLocaleString()}</div>
                <div className="text-gray-300"><strong className="text-white">Expires At:</strong> {adminRole.expires_at ? new Date(adminRole.expires_at).toLocaleString() : 'Nunca'}</div>
                <div className="text-gray-300"><strong className="text-white">Active:</strong> {adminRole.is_active ? 'Sim' : 'Não'}</div>
              </div>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                Erro
              </h3>
              <div className="bg-red-900/20 border border-red-600/30 p-3 rounded-lg text-red-300">
                {error}
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-2 pt-4">
            <Button onClick={refreshPage} variant="outline" className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
              <RefreshCw className="h-4 w-4" />
              Recarregar
            </Button>
            <Button 
              onClick={() => window.location.href = '/admin'} 
              variant="default"
              disabled={!hasAdminAccess}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0"
            >
              Tentar Acessar Admin
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
