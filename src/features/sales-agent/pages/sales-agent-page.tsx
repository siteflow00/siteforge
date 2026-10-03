import { useMemo, useState } from 'react';
import { Bot, MapPin, Search } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback';
import { Input, buttonVariants, useToast } from '@/components/ui';
import { usePlaces } from '@/features/places/hooks/use-places';
import { ApproachCard } from '../components';

export function SalesAgentPage() {
  const { places, loading, error, refetch, edit } = usePlaces();
  const { toast } = useToast();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return places;
    return places.filter((p) => p.name.toLowerCase().includes(q) || (p.niche ?? '').toLowerCase().includes(q));
  }, [places, query]);

  async function handleApproached(place: (typeof places)[number]) {
    toast({ title: `WhatsApp aberto para ${place.name}`, variant: 'success' });
    if (place.status === 'novo') {
      try {
        await edit(place.id, {
          name: place.name,
          phone: place.phone ?? '',
          city: place.city ?? '',
          niche: place.niche ?? '',
          hasWebsite: place.hasWebsite,
          status: 'conversando',
        });
      } catch {
        // Atualização de status é um "bônus"; se falhar, a abordagem já aconteceu normalmente.
      }
    }
  }

  if (loading) return <LoadingState label="Carregando suas empresas…" />;

  if (error) {
    return <ErrorState title="Não foi possível carregar" description={error} onRetry={refetch} />;
  }

  if (places.length === 0) {
    return (
      <>
        <PageHeader description="Prepare propostas e aborde seus contatos pelo WhatsApp." />
        <EmptyState
          icon={MapPin}
          title="Salve uma empresa antes de começar"
          description="A abordagem usa o telefone das empresas salvas em Meus lugares."
          action={
            <a href="/app/meus-lugares" className={buttonVariants({ variant: 'primary' })}>
              Ir para Meus lugares
            </a>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader description="Prepare propostas e aborde seus contatos pelo WhatsApp." />

      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" aria-hidden />
        <Input
          placeholder="Buscar por nome ou nicho"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Bot} title="Nada encontrado" description="Tente buscar por outro termo." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((place) => (
            <ApproachCard key={place.id} place={place} onApproached={() => handleApproached(place)} />
          ))}
        </div>
      )}
    </>
  );
}
