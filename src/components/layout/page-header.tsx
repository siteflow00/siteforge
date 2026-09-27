import type { ReactNode } from 'react';

interface PageHeaderProps {
  /** O título da página fica no Topbar; aqui entra a descrição e, se houver, ações reais. */
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ description, actions }: PageHeaderProps) {
  if (!description && !actions) return null;
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      {description ? <p className="max-w-2xl text-sm text-ink-muted sm:text-base">{description}</p> : <span />}
      {actions}
    </div>
  );
}
