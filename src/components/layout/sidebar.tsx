import { Link, NavLink } from 'react-router-dom';
import { navGroups } from '@/config/navigation';
import { cn } from '@/lib/cn';
import { Logo } from './logo';

/** Navegação principal. Usada fixa no desktop e dentro do drawer no mobile. */
export function Sidebar() {
  return (
    <nav
      aria-label="Navegação principal"
      className="flex h-full flex-col bg-graphite-950 pb-[env(safe-area-inset-bottom)] text-white"
    >
      <div className="flex h-16 shrink-0 items-center px-5">
        <Link
          to="/app"
          aria-label="Ir para a Visão geral"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <Logo />
        </Link>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-3 pb-6 pt-3">
        {navGroups.map((group) => (
          <div key={group.id}>
            <p className="mb-1.5 px-3 text-xs font-medium text-white/40">{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/app'}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                        isActive ? 'bg-white/[0.07] text-white' : 'text-white/60 hover:bg-white/[0.04] hover:text-white',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span aria-hidden className="absolute -left-3 top-1.5 h-6 w-[3px] rounded-r-full bg-brand-500" />
                        )}
                        <item.icon
                          className={cn(
                            'h-[18px] w-[18px] shrink-0 transition-colors',
                            isActive ? 'text-brand-400' : 'text-white/50 group-hover:text-white/80',
                          )}
                          aria-hidden
                        />
                        <span className="truncate">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
