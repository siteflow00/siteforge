import { useMemo, useState } from 'react';
import { MapPin, Plus, Search } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback';
import { Button, Input, Modal, ModalClose, useToast } from '@/components/ui';
import { usePlaces } from '../hooks/use-places';
import { PlaceCard, PlaceFormModal } from '../components';
import type { Place, PlaceInput } from '../api/places';

export function PlacesPage() {
  const { places, loading, error, refetch, add, edit, remove } = usePlaces();
  const { toast } = useToast();

  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | undefined>(undefined);
  const [deletingPlace, setDeletingPlace] = useState<Place | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return places;
    return places.filter((p) =>
      [p.name, p.city, p.niche].filter(Boolean).some((field) => field!.toLowerCase().includes(q)),
    );
  }, [places, query]);

  function openCreate() {
    setEditingPlace(undefined);
    setFormOpen(true);
  }

  function openEdit(place: Place) {
    setEditingPlace(place);
    setFormOpen(true);
  }

  async function handleSubmit(input: PlaceInput) {
    if (editingPlace) {
      await edit(editingPlace.id, input);
      toast({ title: 'Empresa atualizada', variant: 'success' });
    } else {
      await add(input);
      toast({ title: 'Empresa adicionada', variant: 'success' });
    }
  }

  async function handleConfirmDelete() {
    if (!deletingPlace) return;
    setDeleting(true);
    try {
      await remove(deletingPlace.id);
      toast({ title: 'Empresa removida', variant: 'success' });
      setDeletingPlace(null);
    } catch (err) {
      toast({
        title: 'Não foi possível remover',
        description: err instanceof Error ? err.message : String(err),
        variant: 'error',
      });
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <LoadingState label="Carregando suas empresas…" />;

  if (error) {
    return (
      <ErrorState
        title="Não foi possível carregar suas empresas"
        description={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <>
      <PageHeader
        description="Guarde e organize as empresas que você quer atender."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden />
            Adicionar empresa
          </Button>
        }
      />

      {places.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Nenhum lugar salvo ainda"
          description="Adicione a primeira empresa que você quer atender para começar sua lista."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" aria-hidden />
              Adicionar empresa
            </Button>
          }
        />
      ) : (
        <>
          <div className="relative mb-4 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" aria-hidden />
            <Input
              placeholder="Buscar por nome, cidade ou nicho"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={Search} title="Nada encontrado" description="Tente buscar por outro termo." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onEdit={() => openEdit(place)}
                  onDelete={() => setDeletingPlace(place)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <PlaceFormModal open={formOpen} onOpenChange={setFormOpen} place={editingPlace} onSubmit={handleSubmit} />

      <Modal
        open={deletingPlace !== null}
        onOpenChange={(open) => !open && setDeletingPlace(null)}
        title="Remover empresa?"
        description={deletingPlace ? `"${deletingPlace.name}" será removida da sua lista.` : undefined}
        footer={
          <>
            <ModalClose asChild>
              <Button variant="secondary">Cancelar</Button>
            </ModalClose>
            <Button variant="danger" loading={deleting} onClick={handleConfirmDelete}>
              Remover empresa
            </Button>
          </>
        }
      />
    </>
  );
}
