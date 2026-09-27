import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui';

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-ink-muted">{label}</p>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-sm text-ink-subtle">{hint}</p>
    </Card>
  );
}
