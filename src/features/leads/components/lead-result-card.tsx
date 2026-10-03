import { useState } from 'react';
import { Check, MapPin, Phone, Plus } from 'lucide-react';
import type { LeadResult } from '../lib/nominatim';
import { Badge, Button, Card } from '@/components/ui';

interface LeadResultCardProps {
  lead: LeadResult;
  saved: boolean;
  onSave: () => Promise<void>;
}

export function LeadResultCard({ lead, saved, onSave }: LeadResultCardProps) {
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="flex flex-col gap-2.5 p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 truncate font-semibold text-ink">{lead.name}</p>
        {lead.category && <Badge variant="neutral">{lead.category}</Badge>}
      </div>
      <p className="flex items-start gap-2 text-sm text-ink-muted">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
        <span>{lead.address || 'Endereço não disponível'}</span>
      </p>
      <p className="flex items-center gap-2 text-sm text-ink-muted">
        <Phone className="h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
        <span>{lead.phone}</span>
      </p>
      <div className="mt-1 flex justify-end border-t border-line pt-3">
        <Button variant={saved ? 'secondary' : 'ghost'} size="sm" onClick={handleSave} loading={saving} disabled={saved}>
          {saved ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden />
              Salvo em Meus lugares
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Salvar em Meus lugares
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
