import { useState, type FormEvent } from 'react';
import { Search, Settings2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/feedback';
import { Button, Card, CardBody, Field, Input, Select, useToast } from '@/components/ui';
import { brazilianStates, niches } from '../components/niches';

export function LeadsPage() {
  const { toast } = useToast();
  const [niche, setNiche] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    toast({
      title: 'Busca de empresas ainda não configurada',
      description: 'Essa integração depende de uma chave de API que ainda não foi conectada.',
      variant: 'info',
    });
  }

  return (
    <>
      <PageHeader description="Descubra empresas que ainda precisam de um site." />

      <Card className="mb-4 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Settings2 className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-medium text-ink">Integração de busca ainda não configurada</p>
            <p className="mt-0.5 text-sm text-ink-muted">
              Esse módulo vai buscar empresas usando dados públicos do Google. Por enquanto, você pode ver como os
              filtros funcionam e cadastrar empresas manualmente em{' '}
              <a href="/app/meus-lugares" className="font-medium text-brand-600 hover:text-brand-700">
                Meus lugares
              </a>
              .
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <CardBody>
          <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 xl:items-end">
            <Field id="leads-country" label="País">
              <Select id="leads-country" defaultValue="BR" disabled>
                <option value="BR">Brasil</option>
              </Select>
            </Field>
            <Field id="leads-niche" label="Nicho">
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
                <option value="">Selecione um estado</option>
                {brazilianStates.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </Select>
            </Field>
            <Field id="leads-city" label="Cidade">
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
              <Button type="submit">
                <Search className="h-4 w-4" aria-hidden />
                Buscar empresas
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="mt-4">
        <EmptyState
          icon={Search}
          title="Escolha um nicho e uma cidade"
          description="Os resultados da busca vão aparecer aqui assim que a integração estiver configurada."
        />
      </Card>
    </>
  );
}
