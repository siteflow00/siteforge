import { cn } from '@/lib/cn';
import { env } from '@/lib/env';

/** Marca do SiteForge: um "F" recortado em ângulo, sobre quadrado âmbar. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('h-8 w-8', className)} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#F5A524" />
      <polygon points="10,8 23,8 20,12.5 14.5,12.5 14.5,15 20,15 18,19 14.5,19 14.5,24 10,24" fill="#111318" />
    </svg>
  );
}

/** Marca + nome. Pensada para fundo escuro (sidebar). */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="text-lg font-semibold tracking-tight text-white">{env.appName}</span>
    </span>
  );
}
