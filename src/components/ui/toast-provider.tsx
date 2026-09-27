import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ToastContext, type ToastOptions, type ToastVariant } from './toast-context';

interface ToastItem extends ToastOptions {
  id: number;
}

const icons: Record<ToastVariant, { Icon: typeof Info; className: string }> = {
  default: { Icon: Info, className: 'text-ink-subtle' },
  info: { Icon: Info, className: 'text-info' },
  success: { Icon: CheckCircle2, className: 'text-success' },
  error: { Icon: AlertTriangle, className: 'text-danger' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      setItems((current) => [...current.slice(-3), { ...options, id }]);
      timers.current.set(id, window.setTimeout(() => dismiss(id), options.duration ?? 5000));
    },
    [dismiss],
  );

  useEffect(() => {
    const active = timers.current;
    return () => {
      active.forEach((timer) => window.clearTimeout(timer));
      active.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-0 sm:items-end"
      >
        {items.map((item) => {
          const { Icon, className } = icons[item.variant ?? 'default'];
          return (
            <div
              key={item.id}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-lg"
            >
              <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', className)} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{item.title}</p>
                {item.description && <p className="mt-0.5 text-sm text-ink-muted">{item.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Fechar aviso"
                className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-subtle transition-colors hover:bg-black/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
