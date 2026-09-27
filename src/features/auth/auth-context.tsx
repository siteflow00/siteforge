import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

interface AuthResult {
  error: string | null;
}

interface SignUpResult extends AuthResult {
  /** true quando a conta exige confirmação por e-mail antes de liberar a sessão. */
  needsEmailConfirmation: boolean;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  /** true enquanto a sessão inicial ainda está sendo carregada. */
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUpWithPassword: (email: string, password: string, fullName: string) => Promise<SignUpResult>;
  resendConfirmation: (email: string) => Promise<AuthResult>;
  sendPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Supabase não está configurado.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUpWithPassword = useCallback(
    async (email: string, password: string, fullName: string): Promise<SignUpResult> => {
      if (!supabase) return { error: 'Supabase não está configurado.', needsEmailConfirmation: false };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) return { error: error.message, needsEmailConfirmation: false };
      // Quando a confirmação por e-mail está exigida, o cadastro não vem com sessão.
      return { error: null, needsEmailConfirmation: !data.session };
    },
    [],
  );

  const resendConfirmation = useCallback(async (email: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Supabase não está configurado.' };
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    return { error: error?.message ?? null };
  }, []);

  const sendPasswordReset = useCallback(async (email: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Supabase não está configurado.' };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    return { error: error?.message ?? null };
  }, []);

  const updatePassword = useCallback(async (password: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Supabase não está configurado.' };
    const { error } = await supabase.auth.updateUser({ password });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      signInWithPassword,
      signUpWithPassword,
      resendConfirmation,
      sendPasswordReset,
      updatePassword,
      signOut,
    }),
    [session, loading, signInWithPassword, signUpWithPassword, resendConfirmation, sendPasswordReset, updatePassword, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa ser usado dentro de <AuthProvider>.');
  return context;
}
