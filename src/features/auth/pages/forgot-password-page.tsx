import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { AuthLayout, FormError } from '../components';
import { useAuth } from '../auth-context';
import { Button, Field, Input } from '@/components/ui';
import { translateAuthError } from '@/lib/auth-errors';

export function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await sendPasswordReset(email.trim());
    setSubmitting(false);
    if (result.error) {
      setError(translateAuthError(result.error));
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <AuthLayout title="Verifique seu e-mail">
        <div className="flex flex-col items-center text-center">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <MailCheck className="h-5 w-5" aria-hidden />
          </span>
          <p className="text-sm text-ink-muted">
            Se houver uma conta com o e-mail <strong className="text-ink">{email}</strong>, enviamos um link para
            redefinir sua senha.
          </p>
          <Link to="/entrar" className="mt-5 text-sm font-medium text-brand-600 hover:text-brand-700">
            Voltar para o login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Esqueci minha senha"
      description="Informe seu e-mail e enviaremos um link para você criar uma nova senha."
      footer={
        <Link to="/entrar" className="font-medium text-brand-400 hover:text-brand-300">
          Voltar para o login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormError message={error} />
        <Field id="forgot-email" label="E-mail" required>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Button type="submit" className="w-full" loading={submitting}>
          Enviar link de recuperação
        </Button>
      </form>
    </AuthLayout>
  );
}
