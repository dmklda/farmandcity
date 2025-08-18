import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Eye, EyeOff, LogIn, UserPlus, Shield, Castle, UserCircle, Facebook, Mail, Sword } from 'lucide-react';
import { MedievalAnimatedBackground } from './MedievalAnimatedBackground';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const RECAPTCHA_SITE_KEY = '6LdofKkrAAAAACtULOtFG35pLZEqc1FPAwSRlzae';

const loadRecaptcha = () => {
  if (window.grecaptcha && window.grecaptcha.enterprise) return Promise.resolve();
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.onload = resolve;
    document.body.appendChild(script);
  });
};

const getRecaptchaToken = async (action: string) => {
  await loadRecaptcha();
  return new Promise<string>((resolve, reject) => {
    window.grecaptcha.enterprise.ready(() => {
      window.grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, { action }).then(resolve).catch(reject);
    });
  });
};

const verifyRecaptchaToken = async (token: string, expectedAction: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('recaptcha_enterprise_verify', {
      body: {
        token,
        expectedAction,
        siteKey: RECAPTCHA_SITE_KEY
      }
    });
    
    if (error) {
      console.error('reCAPTCHA verification error:', error);
      return { success: false, error: 'Falha ao verificar reCAPTCHA' };
    }
    
    return data;
  } catch (e) {
    console.error('reCAPTCHA verification exception:', e);
    return { success: false, error: 'Falha ao verificar reCAPTCHA' };
  }
};

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');

  useEffect(() => {
    loadRecaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = await getRecaptchaToken(isLogin ? 'login' : 'register');
      setRecaptchaToken(token);
      if (!token) throw new Error('Falha ao validar reCAPTCHA. Tente novamente.');
      // Verificação na Edge Function
      const recaptchaResult = await verifyRecaptchaToken(token, isLogin ? 'login' : 'register');
      console.log('reCAPTCHA result:', recaptchaResult);
      
      if (!recaptchaResult.success) {
        throw new Error(recaptchaResult.error || 'Verificação reCAPTCHA falhou. Tente novamente.');
      }
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken: token } });
        if (error) throw error;
        onAuthSuccess();
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              username: username,
              display_name: username,
              avatar_url: avatar || null,
            },
            captchaToken: token,
          }
        });
        if (error) throw error;
        setError('');
        alert('Conta criada! Verifique seu email para confirmação.');
      }
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos');
      } else if (error.message.includes('User already registered')) {
        setError('Este email já está cadastrado');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (error: any) {
      setError('Falha ao abrir o portal mágico do Google. Tente novamente ou use email/senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <MedievalAnimatedBackground />
      <div className="w-full max-w-md relative z-10">
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-yellow-700/40 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent flex items-center gap-2">
                <Shield className="inline-block text-yellow-400 animate-bounce" size={32} />
                Farmand
                <Castle className="inline-block text-orange-400 animate-pulse" size={28} />
              </h1>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 blur-xl opacity-20 -z-10"></div>
            </div>
            <p className="text-purple-200/90 text-lg italic">
              {isLogin ? 'Entre no reino e defenda sua vila!' : 'Junte-se à guilda dos heróis!'}
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-slate-700/60 border border-slate-600/30 rounded-lg py-2 text-gray-100 font-semibold transition-all duration-200 hover:bg-yellow-800/30 disabled:opacity-60"
            >
              <span className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                Entrar com Google
              </span>
            </button>
            <button disabled className="w-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-slate-700/60 border border-slate-600/30 rounded-lg py-2 text-gray-400 font-semibold cursor-not-allowed opacity-70">
              <span className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <Facebook className="h-5 w-5 text-blue-400" />
                Entrar com Facebook
              </span>
              <span className="text-xs text-center w-full sm:w-auto block">(em breve)</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-yellow-200 mb-2 flex items-center gap-1">
                <Mail size={16} /> Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-700/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400/50 backdrop-blur-sm"
                placeholder="seu@email.com"
              />
            </div>
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-yellow-200 mb-2 flex items-center gap-1">
                  <UserCircle size={16} /> Nome de usuário
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-700/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400/50 backdrop-blur-sm"
                  placeholder="seunome"
                />
              </div>
            )}
            {!isLogin && (
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-yellow-200 mb-2 flex items-center gap-1">
                  <UserCircle size={16} /> Avatar (opcional)
                </label>
                <input
                  id="avatar"
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-700/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400/50 backdrop-blur-sm"
                  placeholder="URL da imagem do avatar"
                />
              </div>
            )}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-yellow-200 mb-2 flex items-center gap-1">
                <Sword size={16} /> Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 pr-10 bg-slate-700/50 border border-yellow-700/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400/50 backdrop-blur-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                  {isLogin ? 'Entrar no Reino' : 'Juntar-se à Guilda'}
                </>
              )}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-yellow-200/80 hover:text-yellow-200 transition-colors"
              >
                {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já é um herói? Entre no reino'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
