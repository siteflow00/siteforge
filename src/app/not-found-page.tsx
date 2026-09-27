import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { EmptyState } from '@/components/feedback';
import { buttonVariants } from '@/components/ui';

/** Página 404. `standalone` centraliza na tela quando renderizada fora do AppShell. */
export function NotFoundPage({ standalone = false }: { standalone?: boolean }) {
  const content = (
    <EmptyState
      icon={Compass}
      title="Página não encontrada"
      description="O endereço não existe ou foi movido. Volte para a Visão geral e continue por lá."
      action={
        <Link to="/app" className={buttonVariants({ variant: 'secondary' })}>
          Ir para a Visão geral
        </Link>
      }
    />
  );
  if (!standalone) return content;
  return <div className="grid min-h-dvh place-items-center bg-canvas px-4">{content}</div>;
}
