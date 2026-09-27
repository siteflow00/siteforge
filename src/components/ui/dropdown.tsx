import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as Menu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/cn';

export const Dropdown = Menu.Root;
export const DropdownTrigger = Menu.Trigger;

export const DropdownContent = forwardRef<ElementRef<typeof Menu.Content>, ComponentPropsWithoutRef<typeof Menu.Content>>(
  function DropdownContent({ className, sideOffset = 8, align = 'end', ...props }, ref) {
    return (
      <Menu.Portal>
        <Menu.Content
          ref={ref}
          sideOffset={sideOffset}
          align={align}
          className={cn(
            'z-50 min-w-[12rem] overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-lg data-[state=open]:animate-menu-in',
            className,
          )}
          {...props}
        />
      </Menu.Portal>
    );
  },
);

export const DropdownItem = forwardRef<ElementRef<typeof Menu.Item>, ComponentPropsWithoutRef<typeof Menu.Item>>(
  function DropdownItem({ className, ...props }, ref) {
    return (
      <Menu.Item
        ref={ref}
        className={cn(
          'flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-canvas data-[disabled]:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);

export function DropdownLabel({ className, ...props }: ComponentPropsWithoutRef<typeof Menu.Label>) {
  return <Menu.Label className={cn('px-2.5 py-1.5 text-xs font-medium text-ink-subtle', className)} {...props} />;
}

export function DropdownSeparator({ className, ...props }: ComponentPropsWithoutRef<typeof Menu.Separator>) {
  return <Menu.Separator className={cn('-mx-1.5 my-1.5 h-px bg-line', className)} {...props} />;
}
