import { CircleDashed } from 'lucide-react';
import { Badge, Card } from '@/components/ui';
import { PageHeader } from '@/components/layout/page-header';
import { getNavItem, type NavItemId } from '@/config/navigation';

/**
 * Página de módulo ainda não implementado.
 * Lê título, resumo e escopo previsto de config/navigation.ts. Não tem botões.
 */
export function ComingSoon({ id }: { id: NavItemId }) {
  const item = getNavItem(id);
  const Icon = item.icon;

  return (
    <>
      <PageHeader description={item.summary} />
      <Card className="mx-auto max-w-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <Icon className="h-6 w-6" aria-hidden />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-ink">Em construção</h2>
              <Badge variant="brand">Próximas etapas</Badge>
            </div>
            <p className="mt-1 text-sm text-ink-muted">
              {item.label} será liberado quando chegar a vez dele no roadmap do SiteForge.
            </p>
          </div>
        </div>

        {item.planned.length > 0 && (
          <div className="mt-6 border-t border-line pt-5">
            <p className="text-sm font-medium text-ink">O que você vai poder fazer aqui</p>
            <ul className="mt-3 space-y-2.5">
              {item.planned.map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-sm text-ink-muted">
                  <CircleDashed className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </>
  );
}
