import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as T from '@radix-ui/react-tabs';
import { cn } from '@/lib/cn';

export const Tabs = T.Root;

export const TabsList = forwardRef<ElementRef<typeof T.List>, ComponentPropsWithoutRef<typeof T.List>>(
  function TabsList({ className, ...props }, ref) {
    return (
      <T.List
        ref={ref}
        className={cn('inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1 shadow-sm', className)}
        {...props}
      />
    );
  },
);

export const TabsTrigger = forwardRef<ElementRef<typeof T.Trigger>, ComponentPropsWithoutRef<typeof T.Trigger>>(
  function TabsTrigger({ className, ...props }, ref) {
    return (
      <T.Trigger
        ref={ref}
        className={cn(
          'whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 data-[state=active]:bg-graphite-900 data-[state=active]:text-white',
          className,
        )}
        {...props}
      />
    );
  },
);

export const TabsContent = forwardRef<ElementRef<typeof T.Content>, ComponentPropsWithoutRef<typeof T.Content>>(
  function TabsContent({ className, ...props }, ref) {
    return (
      <T.Content
        ref={ref}
        className={cn('mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500', className)}
        {...props}
      />
    );
  },
);
