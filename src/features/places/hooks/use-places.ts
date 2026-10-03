import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { fetchMyWorkspace } from '@/features/settings/api/account';
import { createPlace, deletePlace, fetchPlaces, updatePlace, type Place, type PlaceInput } from '../api/places';

interface PlacesState {
  places: Place[];
  loading: boolean;
  error: string | null;
}

export function usePlaces() {
  const { user } = useAuth();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [state, setState] = useState<PlacesState>({ places: [], loading: true, error: null });

  const load = useCallback(async () => {
    if (!user) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const workspace = await fetchMyWorkspace(user.id);
      setWorkspaceId(workspace.workspaceId);
      const places = await fetchPlaces(workspace.workspaceId);
      setState({ places, loading: false, error: null });
    } catch (error) {
      setState((s) => ({ ...s, loading: false, error: error instanceof Error ? error.message : String(error) }));
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  async function add(input: PlaceInput) {
    if (!user || !workspaceId) throw new Error('Workspace ainda não carregado.');
    const place = await createPlace(workspaceId, user.id, input);
    setState((s) => ({ ...s, places: [place, ...s.places] }));
  }

  async function edit(id: string, input: PlaceInput) {
    const updated = await updatePlace(id, input);
    setState((s) => ({ ...s, places: s.places.map((p) => (p.id === id ? updated : p)) }));
  }

  async function remove(id: string) {
    await deletePlace(id);
    setState((s) => ({ ...s, places: s.places.filter((p) => p.id !== id) }));
  }

  return { ...state, refetch: load, add, edit, remove };
}
