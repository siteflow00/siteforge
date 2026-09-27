import type { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' } as const;

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Área de ações (botões) no rodapé. */
  footer?: ReactNode;
  size?: keyof typeof sizes;
}

export function Modal({ open, onOpenChange, title, description, children, footer, size = 'md' }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-graphite-950/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <Dialog.Content
          {...(description ? {} : { 'aria-describedby': undefined })}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border border-line bg-surface shadow-lg focus:outline-none data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in',
            sizes[size],
          )}
        >
          <div className="px-5 pb-2 pt-5 pr-14">
            <Dialog.Title className="text-lg font-semibold tracking-tight text-ink">{title}</Dialog.Title>
            {description && (
              <Dialog.Description className="mt-1 text-sm text-ink-muted">{description}</Dialog.Description>
            )}
          </div>
          <Dialog.Close
            aria-label="Fechar"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-ink-subtle transition-colors hover:bg-black/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <X className="h-4 w-4" aria-hidden />
          </Dialog.Close>
          {children && <div className="overflow-y-auto px-5 py-3 text-sm text-ink-muted">{children}</div>}
          {footer && (
            <div className="flex flex-col-reverse gap-2 px-5 pb-5 pt-3 sm:flex-row sm:justify-end">{footer}</div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Fecha o modal ao clicar. Use com asChild em um Button. */
export const ModalClose = Dialog.Close;
