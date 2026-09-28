import { MapPin } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback';
import { buttonVariants } from '@/components/ui';
import { useSiteBuilder } from '../hooks/use-site-builder';
import { ProjectForm, ProjectList } from '../components';

export function SiteBuilderPage() {
  const { places, projects, loading, error, refetch, saveProject, removeProject } = useSiteBuilder();

  if (loading) return <LoadingState label="Carregando seus projetos…" />;

  if (error) {
    return <ErrorState title="Não foi possível carregar" description={error} onRetry={refetch} />;
  }

  if (places.length === 0) {
    return (
      <>
        <PageHeader description="Escolha o cliente, gere o site, feche a venda." />
        <EmptyState
          icon={MapPin}
          title="Salve uma empresa antes de começar"
          description="Um site sempre começa a partir de uma empresa salva em Meus lugares."
          action={
            <a href="/app/meus-lugares" className={buttonVariants({ variant: 'primary' })}>
              Ir para Meus lugares
            </a>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader description="Escolha o cliente, defina o site e gere o prompt para criá-lo." />
      <ProjectForm places={places} onSave={saveProject} />
      <div className="mt-8">
        <h2 className="mb-3 text-base font-semibold text-ink">Projetos salvos</h2>
        <ProjectList projects={projects} onDelete={removeProject} />
      </div>
    </>
  );
}
