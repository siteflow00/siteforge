import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const badgeVariants = cva('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    variant: {
      neutral: 'bg-black/5 text-ink-muted',
      brand: 'bg-brand-100 text-brand-700',
      success: 'bg-success-soft text-success',
      danger: 'bg-danger-soft text-danger',
      info: 'bg-info-soft text-info',
    },
  },
  defaultVariants: { variant: 'neutral' },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}
