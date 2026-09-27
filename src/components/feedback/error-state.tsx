import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';

interface ErrorStateProps {
  title?: string;
  description?: string;
  /** Detalhe técnico (mostre só em desenvolvimento). */
  detail?: string;
  /** Quando informado, mostra o botão "Tentar novamente". */
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Não foi possível carregar',
  description = 'Verifique sua conexão e tente novamente.',
  detail,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div role="alert" className={cn('flex flex-col items-center px-6 py-12 text-center', className)}>
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
        <AlertTriangle className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-muted">{description}</p>
      {detail && (
        <pre className="mt-4 max-w-full overflow-x-auto rounded-lg bg-black/5 px-3 py-2 text-left text-xs text-ink-muted">
          {detail}
        </pre>
      )}
      {onRetry && (
        <Button variant="secondary" className="mt-5" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
