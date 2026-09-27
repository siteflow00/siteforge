import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FieldProps {
  /** Mesmo id do controle (Input, Select ou Textarea) dentro do Field. */
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/** Rótulo + controle + dica/erro. Ligue o controle com aria-describedby={`${id}-hint`} ou `${id}-error`. */
export function Field({ id, label, hint, error, required, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="text-danger" aria-hidden>
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
