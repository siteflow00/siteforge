import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout, FormError } from '../components';
import { RedirectIfAuthenticated } from '../protected-route';
import { useAuth } from '../auth-context';
import { Button, Field, Input } from '@/components/ui';
import { translateAuthError } from '@/lib/auth-errors';

const MIN_PASSWORD_LENGTH = 6;

function SignUpForm() {
  const { signUpWithPassword } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }

    setSubmitting(true);
    const result = await signUpWithPassword(email.trim(), password, fullName.trim());
    setSubmitting(false);

    if (result.error) {
      setError(translateAuthError(result.error));
      return;
    }
    if (result.needsEmailConfirmation) {
      navigate('/confirme-seu-email', { state: { email: email.trim() }, replace: true });
      return;
    }
    navigate('/app', { replace: true });
  }

  return (
    <AuthLayout
      title="Criar conta no SiteForge"
      footer={
        <>
          Já tem uma conta?{' '}
          <Link to="/entrar" className="font-medium text-brand-400 hover:text-brand-300">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormError message={error} />
        <Field id="signup-name" label="Nome" required>
          <Input
            id="signup-name"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Field>
        <Field id="signup-email" label="E-mail" required>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field id="signup-password" label="Senha" hint={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres.`} required>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="signup-password-hint"
          />
        </Field>
        <Button type="submit" className="w-full" loading={submitting}>
          Criar conta
        </Button>
      </form>
    </AuthLayout>
  );
}

export function SignUpPage() {
  return (
    <RedirectIfAuthenticated>
      <SignUpForm />
    </RedirectIfAuthenticated>
  );
}
