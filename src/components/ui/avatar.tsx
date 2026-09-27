import { useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/cn';

const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-12 w-12 text-base' } as const;

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}

interface AvatarProps {
  name?: string;
  src?: string;
  size?: keyof typeof sizes;
  className?: string;
}

/** Foto, iniciais do nome ou, sem nenhum dos dois, um ícone neutro. */
export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  const label = name ? initials(name) : '';

  return (
    <span
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-graphite-800 font-semibold text-white',
        sizes[size],
        className,
      )}
    >
      {showImage ? (
        <img src={src} alt={name ?? ''} onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : label ? (
        <span aria-hidden>{label}</span>
      ) : (
        <User className="h-4 w-4" aria-hidden />
      )}
    </span>
  );
}
