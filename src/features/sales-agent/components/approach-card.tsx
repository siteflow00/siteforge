import { useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import type { Place } from '@/features/places/api/places';
import { buildOutreachMessage } from '../lib/build-outreach-message';
import { buildWhatsAppUrl } from '../lib/whatsapp';
import { Badge, Card, Textarea, Button } from '@/components/ui';

interface ApproachCardProps {
  place: Place;
  onApproached: () => void;
}

export function ApproachCard({ place, onApproached }: ApproachCardProps) {
  const [message, setMessage] = useState(() => buildOutreachMessage(place));
  const waUrl = place.phone ? buildWhatsAppUrl(place.phone, message) : null;

  function handleApproach() {
    if (!waUrl) return;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onApproached();
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{place.name}</p>
          {place.niche && <p className="text-sm text-ink-muted">{place.niche}</p>}
        </div>
        {place.phone ? (
          <Badge variant="success" dot>
            Com telefone
          </Badge>
        ) : (
          <Badge variant="neutral">Sem telefone</Badge>
        )}
      </div>

      {place.phone ? (
        <>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            aria-label={`Mensagem para ${place.name}`}
          />
          <Button onClick={handleApproach} disabled={!waUrl}>
            <MessageCircle className="h-4 w-4" aria-hidden />
            Abordar no WhatsApp
          </Button>
        </>
      ) : (
        <p className="flex items-center gap-2 text-sm text-ink-muted">
          <Phone className="h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
          Adicione um telefone em Meus lugares para abordar esta empresa.
        </p>
      )}
    </Card>
  );
}
