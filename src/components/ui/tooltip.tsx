import type { ReactElement, ReactNode } from 'react';
import * as T from '@radix-ui/react-tooltip';

/** Coloque uma vez na raiz da aplicação (já está em app/providers.tsx). */
export const TooltipProvider = T.Provider;

interface TooltipProps {
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Elemento que dispara o tooltip (precisa ser focável, como um botão). */
  children: ReactElement;
}

export function Tooltip({ content, side = 'top', children }: TooltipProps) {
  return (
    <T.Root>
      <T.Trigger asChild>{children}</T.Trigger>
      <T.Portal>
        <T.Content
          side={side}
          sideOffset={6}
          className="z-50 max-w-xs rounded-lg bg-graphite-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg data-[state=delayed-open]:animate-fade-in"
        >
          {content}
        </T.Content>
      </T.Portal>
    </T.Root>
  );
}
