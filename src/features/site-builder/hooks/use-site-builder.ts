import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { fetchMyWorkspace } from '@/features/settings/api/account';
import { fetchPlaces, type Place } from '@/features/places/api/places';
import { createProject, deleteProject, fetchProjects, type Project, type ProjectInput } from '../api/projects';

interface State {
  places: Place[];
  projects: Project[];
  loading: boolean;
  error: string | null;
}

export function useSiteBuilder() {
  const { user } = useAuth();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [state, setState] = useState<State>({ places: [], projects: [], loading: true, error: null });

  const load = useCallback(async () => {
    if (!user) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const workspace = await fetchMyWorkspace(user.id);
      setWorkspaceId(workspace.workspaceId);
      const [places, projects] = await Promise.all([
        fetchPlaces(workspace.workspaceId),
        fetchProjects(workspace.workspaceId),
      ]);
      setState({ places, projects, loading: false, error: null });
    } catch (error) {
      setState((s) => ({ ...s, loading: false, error: error instanceof Error ? error.message : String(error) }));
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveProject(input: ProjectInput) {
    if (!user || !workspaceId) throw new Error('Workspace ainda não carregado.');
    const project = await createProject(workspaceId, user.id, input);
    setState((s) => ({ ...s, projects: [project, ...s.projects] }));
  }

  async function removeProject(id: string) {
    await deleteProject(id);
    setState((s) => ({ ...s, projects: s.projects.filter((p) => p.id !== id) }));
  }

  return { ...state, refetch: load, saveProject, removeProject };
}
