import React, { useState, useEffect } from 'react';
import { AdminDebugPanel } from '../components/admin/AdminDebugPanel';
import { useAuth } from '../hooks/useAuth';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import { LoginForm } from '../components/auth/LoginForm';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Home, RefreshCw, Database, Shield, User, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

export const AdminDebugPage: React.FC = () => {
  const { user, loading, isAuthenticated, signIn, signUp } = useAuth();
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

  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [testingConnection, setTestingConnection] = useState(false);

  const testDatabaseConnection = async () => {
    setTestingConnection(true);
    try {
      // Testar conexão básica
      const { data: testData, error: testError } = await supabase
        .from('admin_roles')
        .select('count')
        .limit(1);

      // Testar query específica do usuário
      const { data: userRole, error: userError } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', user?.id || '')
        .single();

      setDebugInfo({
        connection: testError ? 'Erro' : 'OK',
        userRole: userRole ? 'Encontrado' : 'Não encontrado',
        userError: userError?.message,
        testError: testError?.message,
        userEmail: user?.email,
        userId: user?.id,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setDebugInfo({
        connection: 'Erro',
        error: err instanceof Error ? err.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (user) {
      testDatabaseConnection();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Jogo
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/admin'}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Painel Admin
            </Button>
          </div>
          <Button 
            onClick={refreshPage}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Recarregar
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                Status de Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={isAuthenticated ? "default" : "destructive"}>
                {isAuthenticated ? "Logado" : "Não Logado"}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {user?.email || "Nenhum usuário"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Permissões Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={hasAdminAccess ? "default" : "destructive"}>
                {hasAdminAccess ? "Acesso Permitido" : "Acesso Negado"}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {adminRole?.role || "Sem role"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="h-4 w-4" />
                Conexão DB
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={debugInfo?.connection === 'OK' ? "default" : "destructive"}>
                {testingConnection ? "Testando..." : (debugInfo?.connection || "Não testado")}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {debugInfo?.userRole || "Aguardando teste"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Erros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={error ? "destructive" : "default"}>
                {error ? "Erro" : "OK"}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {error || "Sem erros"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Login Section */}
        {!isAuthenticated && (
          <Card className="w-full max-w-md mx-auto mb-8">
            <CardHeader>
              <CardTitle className="text-center">🔧 Debug - Login Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <LoginForm onLoginSuccess={() => {}} />
            </CardContent>
          </Card>
        )}

        {/* Debug Panel */}
        {isAuthenticated && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Informações de Debug
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">User ID:</span>
                      <span className="ml-2 font-mono text-xs">{user?.id || "N/A"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{user?.email || "N/A"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Admin Role:</span>
                      <span className="ml-2">{adminRole?.role || "N/A"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Is Active:</span>
                      <Badge variant={adminRole?.is_active ? "default" : "destructive"} className="ml-2">
                        {adminRole?.is_active ? "Sim" : "Não"}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Expires At:</span>
                      <span className="ml-2">{adminRole?.expires_at || "Nunca"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Granted At:</span>
                      <span className="ml-2">{adminRole?.granted_at || "N/A"}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Permissões:</h4>
                    <div className="flex gap-2">
                      <Badge variant={isSuperAdmin() ? "default" : "secondary"}>
                        Super Admin
                      </Badge>
                      <Badge variant={isAdmin() ? "default" : "secondary"}>
                        Admin
                      </Badge>
                      <Badge variant={isModerator() ? "default" : "secondary"}>
                        Moderator
                      </Badge>
                      <Badge variant={isAnalyst() ? "default" : "secondary"}>
                        Analyst
                      </Badge>
                    </div>
                  </div>

                  {debugInfo && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Teste de Conexão:</h4>
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(debugInfo, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <AdminDebugPanel />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Erro de Permissões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive mb-4">{error}</p>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Possíveis soluções:</strong>
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Verifique se o email está correto: {user?.email}</li>
                  <li>• Confirme se a conta foi criada no Supabase</li>
                  <li>• Verifique se o email foi confirmado</li>
                  <li>• Tente fazer logout e login novamente</li>
                  <li>• Verifique as políticas RLS no banco de dados</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {hasAdminAccess && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Acesso Admin Confirmado!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                Você tem acesso total ao painel administrativo.
              </p>
              <Button 
                onClick={() => window.location.href = '/admin'}
                className="bg-green-600 hover:bg-green-700"
              >
                Acessar Painel Admin
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}; 