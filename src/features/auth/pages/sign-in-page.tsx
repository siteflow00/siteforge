import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout, FormError } from '../components';
import { RedirectIfAuthenticated } from '../protected-route';
import { useAuth } from '../auth-context';
import { Button, Field, Input } from '@/components/ui';
import { translateAuthError } from '@/lib/auth-errors';

function SignInForm() {
  const { signInWithPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/app';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signInWithPassword(email.trim(), password);
    setSubmitting(false);
    if (result.error) {
      setError(translateAuthError(result.error));
      return;
    }
    navigate(from, { replace: true });
  }

  return (
    <AuthLayout
      title="Entrar no SiteForge"
      footer={
        <>
          Não tem uma conta?{' '}
          <Link to="/cadastrar" className="font-medium text-brand-400 hover:text-brand-300">
            Cadastre-se
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormError message={error} />
        <Field id="signin-email" label="E-mail" required>
          <Input
            id="signin-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field id="signin-password" label="Senha" required>
          <Input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <div className="flex justify-end">
          <Link to="/esqueci-senha" className="text-sm font-medium text-ink-muted hover:text-ink">
            Esqueci minha senha
          </Link>
        </div>
        <Button type="submit" className="w-full" loading={submitting}>
          Entrar
        </Button>
      </form>
    </AuthLayout>
  );
}

export function SignInPage() {
  return (
    <RedirectIfAuthenticated>
      <SignInForm />
    </RedirectIfAuthenticated>
  );
}
