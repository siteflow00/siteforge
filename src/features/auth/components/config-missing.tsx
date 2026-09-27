import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui';

/**
 * Mostrado quando VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não estão configuradas.
 * Sem isso, autenticação e banco não funcionam — melhor um aviso claro do que uma tela quebrada.
 */
export function ConfigMissing() {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas px-4">
      <Card className="max-w-md p-6 text-center sm:p-8">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
          <AlertTriangle className="h-5 w-5" aria-hidden />
        </span>
        <h1 className="mt-4 text-lg font-semibold text-ink">Supabase não está configurado</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Defina <code className="rounded bg-black/5 px-1 py-0.5 text-xs">VITE_SUPABASE_URL</code> e{' '}
          <code className="rounded bg-black/5 px-1 py-0.5 text-xs">VITE_SUPABASE_ANON_KEY</code> nas variáveis de
          ambiente e reinicie a aplicação.
        </p>
      </Card>
    </div>
  );
}
