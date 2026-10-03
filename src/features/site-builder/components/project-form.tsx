import { useEffect, useMemo, useState } from 'react';
import { Copy, Save, Sparkles } from 'lucide-react';
import type { Place } from '@/features/places/api/places';
import type { ProjectInput } from '../api/projects';
import { buildPrompt } from '../lib/build-prompt';
import { sectionOptions } from '../lib/sections';
import { Button, Card, CardBody, CardDescription, CardHeader, CardTitle, Field, Input, Select, Textarea, useToast } from '@/components/ui';

interface ProjectFormProps {
  places: Place[];
  onSave: (input: ProjectInput) => Promise<void>;
}

export function ProjectForm({ places, onSave }: ProjectFormProps) {
  const { toast } = useToast();
  const [placeId, setPlaceId] = useState('');
  const [niche, setNiche] = useState('');
  const [sections, setSections] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const place = useMemo(() => places.find((p) => p.id === placeId), [places, placeId]);

  useEffect(() => {
    if (place) setNiche(place.niche ?? '');
  }, [place]);

  const prompt = useMemo(() => {
    if (!place) return '';
    return buildPrompt({
      placeName: place.name,
      city: place.city,
      phone: place.phone,
      niche,
      sections,
      notes,
    });
  }, [place, niche, sections, notes]);

  function toggleSection(id: string) {
    setSections((current) => (current.includes(id) ? current.filter((s) => s !== id) : [...current, id]));
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({ title: 'Prompt copiado', variant: 'success' });
    } catch {
      toast({ title: 'Não foi possível copiar', description: 'Selecione o texto manualmente.', variant: 'error' });
    }
  }

  async function handleSave() {
    if (!place) return;
    setSaving(true);
    try {
      await onSave({ placeId: place.id, niche, sections, notes, prompt });
      toast({ title: 'Projeto salvo', variant: 'success' });
      setPlaceId('');
      setSections([]);
      setNotes('');
    } catch (error) {
      toast({
        title: 'Não foi possível salvar',
        description: error instanceof Error ? error.message : String(error),
        variant: 'error',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Detalhes do site</CardTitle>
            <CardDescription>Escolha a empresa e como o site deve ser.</CardDescription>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Field id="project-place" label="Empresa" required>
            <Select id="project-place" value={placeId} onChange={(e) => setPlaceId(e.target.value)}>
              <option value="">Selecione uma empresa salva</option>
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field id="project-niche" label="Nicho">
            <Input
              id="project-niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              disabled={!place}
              placeholder="Ex.: Restaurante"
            />
          </Field>

          <div>
            <p className="mb-2 text-sm font-medium text-ink">Seções do site</p>
            <div className="grid grid-cols-2 gap-2">
              {sectionOptions.map((option) => (
                <label key={option.id} className="flex items-center gap-2 text-sm text-ink-muted">
                  <input
                    type="checkbox"
                    checked={sections.includes(option.id)}
                    onChange={() => toggleSection(option.id)}
                    disabled={!place}
                    className="h-4 w-4 rounded border-line text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <Field id="project-notes" label="Observações (opcional)">
            <Textarea
              id="project-notes"
              placeholder="Cores preferidas, referências, algo específico do negócio..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!place}
            />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Prompt gerado</CardTitle>
            <CardDescription>Copie e use para gerar o site onde preferir.</CardDescription>
          </div>
        </CardHeader>
        <CardBody>
          {place ? (
            <>
              <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-canvas p-4 text-sm text-ink">
                {prompt}
              </pre>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" onClick={handleCopy}>
                  <Copy className="h-4 w-4" aria-hidden />
                  Copiar prompt
                </Button>
                <Button onClick={handleSave} loading={saving}>
                  <Save className="h-4 w-4" aria-hidden />
                  Salvar projeto
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-sm text-ink-muted">Escolha uma empresa para ver o prompt sendo montado aqui.</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
