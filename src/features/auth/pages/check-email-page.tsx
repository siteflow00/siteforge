import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { AuthLayout } from '../components';
import { useAuth } from '../auth-context';
import { Button } from '@/components/ui';
import { useToast } from '@/components/ui';
import { translateAuthError } from '@/lib/auth-errors';

/** Mostrada logo depois do cadastro, quando a conta exige confirmação por e-mail. */
export function CheckEmailPage() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;
  const { resendConfirmation } = useAuth();
  const { toast } = useToast();
  const [resending, setResending] = useState(false);

  async function handleResend() {
    if (!email) return;
    setResending(true);
    const result = await resendConfirmation(email);
    setResending(false);
    toast(
      result.error
        ? { title: 'Não foi possível reenviar', description: translateAuthError(result.error), variant: 'error' }
        : { title: 'E-mail reenviado', variant: 'success' },
    );
  }

  return (
    <AuthLayout title="Confirme seu e-mail">
      <div className="flex flex-col items-center text-center">
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <MailCheck className="h-5 w-5" aria-hidden />
        </span>
        <p className="text-sm text-ink-muted">
          {email ? (
            <>
              Enviamos um link de confirmação para <strong className="text-ink">{email}</strong>. Abra o e-mail e
              clique no link para ativar sua conta.
            </>
          ) : (
            'Enviamos um link de confirmação para o e-mail que você cadastrou. Abra o e-mail e clique no link para ativar sua conta.'
          )}
        </p>
        {email && (
          <Button variant="secondary" className="mt-5" loading={resending} onClick={handleResend}>
            Reenviar e-mail
          </Button>
        )}
        <Link to="/entrar" className="mt-4 text-sm font-medium text-brand-600 hover:text-brand-700">
          Voltar para o login
        </Link>
      </div>
    </AuthLayout>
  );
}
