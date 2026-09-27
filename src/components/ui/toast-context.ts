import { createContext, useContext } from 'react';

export type ToastVariant = 'default' | 'success' | 'error' | 'info';

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Tempo em ms até sumir sozinho. Padrão: 5000. */
  duration?: number;
}

export interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  dismiss: (id: number) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast precisa ser usado dentro de <ToastProvider>.');
  return context;
}
