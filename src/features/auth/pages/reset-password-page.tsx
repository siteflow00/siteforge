import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout, FormError } from '../components';
import { useAuth } from '../auth-context';
import { Button, Field, Input } from '@/components/ui';
import { ErrorState } from '@/components/feedback';
import { translateAuthError } from '@/lib/auth-errors';

const MIN_PASSWORD_LENGTH = 6;
/** Tempo de espera pela sessão temporária que o Supabase cria ao abrir o link do e-mail. */
const SESSION_WAIT_MS = 2500;

/**
 * Aberta pelo link de "redefinir senha" do e-mail. O Supabase já autentica a sessão
 * de recuperação lendo o token da própria URL (detectSessionInUrl, configurado no cliente).
 */
export function ResetPasswordPage() {
  const { user, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setChecking(false);
      return;
    }
    const timer = window.setTimeout(() => setChecking(false), SESSION_WAIT_MS);
    return () => window.clearTimeout(timer);
  }, [user]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }

    setSubmitting(true);
    const result = await updatePassword(password);
    setSubmitting(false);

    if (result.error) {
      setError(translateAuthError(result.error));
      return;
    }
    navigate('/app', { replace: true });
  }

  if (checking) {
    return <AuthLayout title="Verificando o link…">{null}</AuthLayout>;
  }

  if (!user) {
    return (
      <AuthLayout title="Link inválido ou expirado">
        <ErrorState
          title="Não foi possível confirmar o link"
          description="Solicite um novo link de recuperação de senha."
        />
        <Link
          to="/esqueci-senha"
          className="mt-4 block text-center text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Solicitar novo link
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Defina uma nova senha">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormError message={error} />
        <Field id="reset-password" label="Nova senha" hint={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres.`} required>
          <Input
            id="reset-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button type="submit" className="w-full" loading={submitting}>
          Salvar nova senha
        </Button>
      </form>
    </AuthLayout>
  );
}
