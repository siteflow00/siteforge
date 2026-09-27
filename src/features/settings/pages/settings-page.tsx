import { PageHeader } from '@/components/layout/page-header';
import { ErrorState, LoadingState } from '@/components/feedback';
import { useAccount } from '../hooks/use-account';
import { ProfileSection, WorkspaceSection } from '../components';

export function SettingsPage() {
  const { profile, workspace, loading, error, refetch } = useAccount();

  if (loading) return <LoadingState label="Carregando suas configurações…" />;

  if (error || !profile || !workspace) {
    return (
      <ErrorState
        title="Não foi possível carregar suas configurações"
        description={error ?? 'Tente novamente em instantes.'}
        onRetry={refetch}
      />
    );
  }

  return (
    <>
      <PageHeader description="Perfil, workspace e preferências da sua conta." />
      <div className="grid gap-4 lg:grid-cols-2">
        <ProfileSection profile={profile} onSaved={refetch} />
        <WorkspaceSection workspace={workspace} onSaved={refetch} />
      </div>
    </>
  );
}
