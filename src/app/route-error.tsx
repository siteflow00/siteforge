import { useEffect } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { ErrorState } from '@/components/feedback';
import { env } from '@/lib/env';
import { NotFoundPage } from './not-found-page';

/** Exibido quando uma rota falha ao renderizar ou ao carregar seu código. */
export function RouteError({ standalone = false }: { standalone?: boolean }) {
  const error = useRouteError();

  useEffect(() => {
    console.error(error);
  }, [error]);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage standalone={standalone} />;
  }

  const content = (
    <ErrorState
      title="Esta página não abriu"
      description="Aconteceu um erro inesperado ao abrir esta tela. Recarregue a página para tentar de novo."
      detail={env.isDev && error instanceof Error ? error.message : undefined}
      onRetry={() => window.location.reload()}
    />
  );
  if (!standalone) return content;
  return <div className="grid min-h-dvh place-items-center bg-canvas px-4">{content}</div>;
}
