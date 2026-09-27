import { Link, useLocation } from 'react-router-dom';
import { Menu, Sparkles } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui';
import { getPageMeta } from '@/config/navigation';
import { UserMenu } from './user-menu';

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { pathname } = useLocation();
  const meta = getPageMeta(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-canvas/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" onClick={onOpenMenu} aria-label="Abrir menu">
        <Menu className="h-5 w-5" aria-hidden />
      </Button>

      <div className="min-w-0 flex-1">
        {meta.group && <p className="hidden truncate text-xs text-ink-subtle sm:block">{meta.group}</p>}
        <h1 className="truncate text-lg font-semibold leading-tight tracking-tight text-ink">{meta.title}</h1>
      </div>

      <Link to="/app/criar-site" className={buttonVariants({ variant: 'primary', size: 'md' })}>
        <Sparkles className="h-4 w-4" aria-hidden />
        Criar site
      </Link>
      <UserMenu />
    </header>
  );
}
