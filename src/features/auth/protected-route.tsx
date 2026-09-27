import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingState } from '@/components/feedback';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuth } from './auth-context';
import { ConfigMissing } from './components/config-missing';

/** Bloqueia acesso a /app enquanto não houver sessão. Redireciona para /entrar. */
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!isSupabaseConfigured) return <ConfigMissing />;
  if (loading) return <LoadingState label="Verificando sua sessão…" className="min-h-dvh" />;
  if (!user) return <Navigate to="/entrar" replace state={{ from: location.pathname }} />;

  return <Outlet />;
}

/** Nas páginas públicas de auth: se já houver sessão, pula direto para o painel. */
export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (!isSupabaseConfigured) return <ConfigMissing />;
  if (loading) return <LoadingState label="Carregando…" className="min-h-dvh" />;
  if (user) return <Navigate to="/app" replace />;
  return <>{children}</>;
}
