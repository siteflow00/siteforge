import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback';
import { Button, Card, CardBody, Field, Input, Select, useToast } from '@/components/ui';
import { useAuth } from '@/features/auth/auth-context';
import { fetchMyWorkspace } from '@/features/settings/api/account';
import { createPlace } from '@/features/places/api/places';
import { brazilianStates, niches } from '../components/niches';
import { LeadResultCard } from '../components/lead-result-card';
import { searchLeads, type LeadResult } from '../lib/nominatim';

type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'done'; results: LeadResult[] };

export function LeadsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [niche, setNiche] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [search, setSearch] = useState<SearchState>({ status: 'idle' });
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  async function runSearch() {
    if (!niche || !city) {
      toast({ title: 'Escolha ao menos o nicho e a cidade', variant: 'info' });
      return;
    }
    setSearch({ status: 'loading' });
    try {
      const results = await searchLeads({ niche, city, state, neighborhood });
      setSearch({ status: 'done', results });
    } catch (error) {
      setSearch({ status: 'error', message: error instanceof Error ? error.message : String(error) });
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void runSearch();
  }

  async function handleSaveLead(lead: LeadResult) {
    if (!user) return;
    try {
      const workspace = await fetchMyWorkspace(user.id);
      await createPlace(workspace.workspaceId, user.id, {
        name: lead.name,
        phone: '',
        city: lead.city ?? city,
        niche,
        hasWebsite: false,
        status: 'novo',
      });
      setSavedIds((current) => new Set(current).add(lead.id));
      toast({ title: 'Empresa salva em Meus lugares', variant: 'success' });
    } catch (error) {
      toast({
        title: 'Não foi possível salvar',
        description: error instanceof Error ? error.message : String(error),
        variant: 'error',
      });
    }
  }

  return (
    <>
      <PageHeader description="Descubra empresas que ainda precisam de um site." />

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 xl:items-end">
            <Field id="leads-country" label="País">
              <Select id="leads-country" defaultValue="BR" disabled>
                <option value="BR">Brasil</option>
              </Select>
            </Field>
            <Field id="leads-niche" label="Nicho" required>
              <Select id="leads-niche" value={niche} onChange={(e) => setNiche(e.target.value)}>
                <option value="">Selecione um nicho</option>
                {niches.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Select>
            </Field>
            <Field id="leads-state" label="Estado">
              <Select id="leads-state" value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">Todos os estados</option>
                {brazilianStates.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </Select>
            </Field>
            <Field id="leads-city" label="Cidade" required>
              <Input
                id="leads-city"
                placeholder="Ex.: Quirinópolis"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Field>
            <Field id="leads-neighborhood" label="Bairro (opcional)">
              <Input
                id="leads-neighborhood"
                placeholder="Ex.: Centro"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2 xl:col-span-5">
              <Button type="submit" loading={search.status === 'loading'}>
                <Search className="h-4 w-4" aria-hidden />
                Buscar empresas
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="mt-4">
        {search.status === 'idle' && (
          <Card>
            <EmptyState
              icon={Search}
              title="Escolha um nicho e uma cidade"
              description="Os resultados da busca aparecem aqui."
            />
          </Card>
        )}

        {search.status === 'loading' && <LoadingState label="Buscando empresas…" />}

        {search.status === 'error' && (
          <Card>
            <ErrorState description={search.message} onRetry={runSearch} />
          </Card>
        )}

        {search.status === 'done' && search.results.length === 0 && (
          <Card>
            <EmptyState
              icon={Search}
              title="Nenhuma empresa encontrada"
              description="Tente uma cidade ou um nicho diferente."
            />
          </Card>
        )}

        {search.status === 'done' && search.results.length > 0 && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {search.results.map((lead) => (
                <LeadResultCard
                  key={lead.id}
                  lead={lead}
                  saved={savedIds.has(lead.id)}
                  onSave={() => handleSaveLead(lead)}
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-ink-subtle">
              Dados de localização por{' '}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-ink-muted"
              >
                colaboradores do OpenStreetMap
              </a>
              . Telefone e site não são preenchidos automaticamente — adicione ao editar em Meus lugares.
            </p>
          </>
        )}
      </div>
    </>
  );
}
