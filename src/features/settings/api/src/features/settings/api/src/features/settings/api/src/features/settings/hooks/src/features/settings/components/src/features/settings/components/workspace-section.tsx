import { useState, type FormEvent } from 'react';
import { updateWorkspaceName, type WorkspaceMembership } from '../api/account';
import { Badge, Button, Card, CardBody, CardDescription, CardHeader, CardTitle, Field, Input, useToast } from '@/components/ui';

const roleLabel: Record<WorkspaceMembership['role'], string> = {
  owner: 'Dono',
  admin: 'Administrador',
  member: 'Membro',
};

export function WorkspaceSection({ workspace, onSaved }: { workspace: WorkspaceMembership; onSaved: () => void }) {
  const { toast } = useToast();
  const [name, setName] = useState(workspace.workspaceName);
  const [submitting, setSubmitting] = useState(false);

  const dirty = name.trim() !== workspace.workspaceName;
  const canEdit = workspace.role === 'owner' || workspace.role === 'admin';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!dirty) return;
    setSubmitting(true);
    try {
      await updateWorkspaceName(workspace.workspaceId, name.trim());
      toast({ title: 'Workspace atualizado', variant: 'success' });
      onSaved();
    } catch (error) {
      toast({
        title: 'Não foi possível salvar',
        description: error instanceof Error ? error.message : String(error),
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>O espaço de trabalho da sua conta.</CardDescription>
        </div>
        <Badge variant="brand">{roleLabel[workspace.role]}</Badge>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            id="settings-workspace-name"
            label="Nome do workspace"
            hint={!canEdit ? 'Só o dono ou um administrador pode alterar.' : undefined}
          >
            <Input
              id="settings-workspace-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!canEdit}
            />
          </Field>
          {canEdit && (
            <div className="flex justify-end">
              <Button type="submit" loading={submitting} disabled={!dirty}>
                Salvar workspace
              </Button>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
