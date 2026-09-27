import { useState, type FormEvent } from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { updateProfileName, type Profile } from '../api/account';
import { Button, Card, CardBody, CardDescription, CardHeader, CardTitle, Field, Input, useToast } from '@/components/ui';

export function ProfileSection({ profile, onSaved }: { profile: Profile; onSaved: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile.fullName ?? '');
  const [submitting, setSubmitting] = useState(false);

  const dirty = fullName.trim() !== (profile.fullName ?? '');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user || !dirty) return;
    setSubmitting(true);
    try {
      await updateProfileName(user.id, fullName.trim());
      toast({ title: 'Perfil atualizado', variant: 'success' });
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
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Seus dados pessoais na plataforma.</CardDescription>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field id="settings-name" label="Nome">
            <Input id="settings-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Field>
          <Field id="settings-email" label="E-mail" hint="Para trocar o e-mail, fale com o suporte.">
            <Input id="settings-email" value={user?.email ?? ''} disabled />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" loading={submitting} disabled={!dirty}>
              Salvar perfil
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
