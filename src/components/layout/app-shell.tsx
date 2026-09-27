import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { LoadingState } from '@/components/feedback';
import { getPageMeta } from '@/config/navigation';
import { env } from '@/lib/env';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

/** Largura a partir da qual a sidebar fica fixa (Tailwind `lg`). */
const DESKTOP_QUERY = '(min-width: 1024px)';

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { title } = getPageMeta(pathname);

  // Título da aba acompanha a página.
  useEffect(() => {
    document.title = `${title} · ${env.appName}`;
  }, [title]);

  // Fecha o drawer ao navegar.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Fecha o drawer se a tela crescer até o modo desktop (evita ficar preso no modal).
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return (
    <div className="min-h-dvh bg-canvas">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-graphite-950"
      >
        Ir para o conteúdo
      </a>

      {/* Desktop e notebook: sidebar fixa */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block">
        <Sidebar />
      </aside>

      {/* Tablet e celular: drawer */}
      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-graphite-950/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in lg:hidden" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] shadow-lg focus:outline-none data-[state=closed]:animate-slide-out-left data-[state=open]:animate-slide-in-left lg:hidden"
          >
            <Dialog.Title className="sr-only">Menu de navegação</Dialog.Title>
            <Sidebar />
            <Dialog.Close
              aria-label="Fechar menu"
              className="absolute right-3 top-3.5 flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <X className="h-5 w-5" aria-hidden />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="flex min-h-dvh flex-col lg:pl-60">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main id="conteudo" tabIndex={-1} className="flex-1 px-4 py-6 focus:outline-none sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <Suspense fallback={<LoadingState />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
