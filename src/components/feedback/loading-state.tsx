import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({ label = 'Carregando…', className }: LoadingStateProps) {
  return (
    <div role="status" className={cn('flex min-h-[40vh] flex-col items-center justify-center gap-3 text-ink-muted', className)}>
      <Loader2 className="h-6 w-6 animate-spin text-brand-600" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  );
}
