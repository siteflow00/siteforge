import type { ReactNode } from 'react';
import { ToastProvider, TooltipProvider } from '@/components/ui';
import { AuthProvider } from '@/features/auth/auth-context';

/** Providers globais. Quando entrar dados do banco (leads, projetos...), o provider de dados vem aqui. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delayDuration={200}>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </TooltipProvider>
  );
}
