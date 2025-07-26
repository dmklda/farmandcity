import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const ADMIN_EMAIL = 'marcior631@gmail.com';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Verificando autorização...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={() => {}} />;
  }

  // Verificar se o usuário é o admin autorizado
  if (user?.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-900">
              Acesso Negado
            </CardTitle>
            <p className="text-red-700">
              Você não tem permissão para acessar o painel administrativo.
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                <strong>Email autorizado:</strong> {ADMIN_EMAIL}
              </p>
              <p className="text-sm text-red-700 mt-1">
                Seu email: {user?.email}
              </p>
            </div>
            <p className="text-sm text-red-600 mb-4">
              Apenas o administrador principal pode acessar este painel.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Voltar ao Jogo
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}; 