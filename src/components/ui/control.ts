import { cn } from '@/lib/cn';

/** Estilo compartilhado por Input, Select e Textarea. */
export function controlClasses(invalid?: boolean) {
  return cn(
    'w-full rounded-lg border bg-surface px-3 text-sm text-ink transition-colors placeholder:text-ink-subtle focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:bg-canvas disabled:text-ink-subtle',
    invalid
      ? 'border-danger focus-visible:ring-danger/30'
      : 'border-line hover:border-ink-subtle/60 focus-visible:border-brand-500 focus-visible:ring-brand-500/30',
  );
}
