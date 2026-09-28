import { Globe, MapPin, Pencil, Phone, Trash2 } from 'lucide-react';
import type { Place } from '../api/places';
import { Badge, Button, Card } from '@/components/ui';

const statusVariant = { novo: 'info', conversando: 'brand', fechado: 'success' } as const;
const statusLabel = { novo: 'Novo contato', conversando: 'Conversando', fechado: 'Fechado' } as const;

interface PlaceCardProps {
  place: Place;
  onEdit: () => void;
  onDelete: () => void;
}

export function PlaceCard({ place, onEdit, onDelete }: PlaceCardProps) {
  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{place.name}</p>
          {place.niche && <p className="text-sm text-ink-muted">{place.niche}</p>}
        </div>
        <Badge variant={statusVariant[place.status]}>{statusLabel[place.status]}</Badge>
      </div>

      <div className="space-y-1.5 text-sm text-ink-muted">
        {place.phone && (
          <p className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
            {place.phone}
          </p>
        )}
        {place.city && (
          <p className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
            {place.city}
          </p>
        )}
        <p className="flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
          {place.hasWebsite ? 'Já tem site' : 'Ainda não tem site'}
        </p>
      </div>

      <div className="mt-1 flex justify-end gap-2 border-t border-line pt-3">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          Editar
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
          Apagar
        </Button>
      </div>
    </Card>
  );
}
