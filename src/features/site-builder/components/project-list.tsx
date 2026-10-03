import { Copy, FolderKanban, Trash2 } from 'lucide-react';
import type { Project } from '../api/projects';
import { sectionLabel } from '../lib/sections';
import { Badge, Button, Card, useToast } from '@/components/ui';
import { EmptyState } from '@/components/feedback';

interface ProjectListProps {
  projects: Project[];
  onDelete: (id: string) => void;
}

export function ProjectList({ projects, onDelete }: ProjectListProps) {
  const { toast } = useToast();

  async function handleCopy(prompt: string | null) {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      toast({ title: 'Prompt copiado', variant: 'success' });
    } catch {
      toast({ title: 'Não foi possível copiar', variant: 'error' });
    }
  }

  if (projects.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={FolderKanban}
          title="Nenhum projeto salvo ainda"
          description="Os projetos que você criar aparecem aqui, ligados à empresa escolhida."
        />
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <Card key={project.id} className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-ink">{project.placeName}</p>
              {project.niche && <p className="text-sm text-ink-muted">{project.niche}</p>}
            </div>
            <Badge variant="brand">Prompt gerado</Badge>
          </div>

          {project.sections.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.sections.map((id) => (
                <Badge key={id} variant="neutral">
                  {sectionLabel(id)}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-3 flex justify-end gap-2 border-t border-line pt-3">
            <Button variant="ghost" size="sm" onClick={() => handleCopy(project.prompt)}>
              <Copy className="h-3.5 w-3.5" aria-hidden />
              Copiar prompt
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(project.id)}>
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              Apagar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
