import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/layout';
import { Card } from '@/components/ui';

interface AuthLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Layout centralizado compartilhado por entrar, cadastrar e recuperação de senha. */
export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-dvh place-items-center bg-graphite-950 px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-6 flex justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
          <Logo />
        </Link>
        <Card className="p-6 sm:p-7">
          <h1 className="text-lg font-semibold tracking-tight text-ink">{title}</h1>
          {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
          <div className="mt-5">{children}</div>
        </Card>
        {footer && <p className="mt-5 text-center text-sm text-white/60">{footer}</p>}
      </div>
    </div>
  );
}
