import { useEffect, useState, type FormEvent } from 'react';
import type { Place, PlaceInput, PlaceStatus } from '../api/places';
import { Button, Field, Input, Modal, ModalClose, Select } from '@/components/ui';

const emptyForm: PlaceInput = {
  name: '',
  phone: '',
  city: '',
  niche: '',
  hasWebsite: false,
  status: 'novo',
};

interface PlaceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  place?: Place;
  onSubmit: (input: PlaceInput) => Promise<void>;
}

export function PlaceFormModal({ open, onOpenChange, place, onSubmit }: PlaceFormModalProps) {
  const [form, setForm] = useState<PlaceInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(
      place
        ? {
            name: place.name,
            phone: place.phone ?? '',
            city: place.city ?? '',
            niche: place.niche ?? '',
            hasWebsite: place.hasWebsite,
            status: place.status,
          }
        : emptyForm,
    );
  }, [open, place]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('Informe o nome da empresa.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ ...form, name: form.name.trim() });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={place ? 'Editar empresa' : 'Adicionar empresa'}
      footer={
        <>
          <ModalClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </ModalClose>
          <Button type="submit" form="place-form" loading={submitting}>
            {place ? 'Salvar alterações' : 'Adicionar empresa'}
          </Button>
        </>
      }
    >
      <form id="place-form" onSubmit={handleSubmit} className="space-y-4 text-left">
        {error && <p className="text-sm text-danger">{error}</p>}
        <Field id="place-name" label="Nome da empresa" required>
          <Input
            id="place-name"
            autoFocus
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field id="place-phone" label="Telefone / WhatsApp">
            <Input
              id="place-phone"
              placeholder="(00) 00000-0000"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </Field>
          <Field id="place-city" label="Cidade">
            <Input
              id="place-city"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field id="place-niche" label="Nicho">
            <Input
              id="place-niche"
              placeholder="Ex.: Restaurante"
              value={form.niche}
              onChange={(e) => setForm((f) => ({ ...f, niche: e.target.value }))}
            />
          </Field>
          <Field id="place-status" label="Status">
            <Select
              id="place-status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as PlaceStatus }))}
            >
              <option value="novo">Novo contato</option>
              <option value="conversando">Conversando</option>
              <option value="fechado">Fechado</option>
            </Select>
          </Field>
        </div>
        <label className="flex items-center gap-2.5 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.hasWebsite}
            onChange={(e) => setForm((f) => ({ ...f, hasWebsite: e.target.checked }))}
            className="h-4 w-4 rounded border-line text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
          Já tem site
        </label>
      </form>
    </Modal>
  );
}
