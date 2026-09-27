import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { fetchMyWorkspace, fetchProfile, type Profile, type WorkspaceMembership } from '../api/account';

interface AccountState {
  profile: Profile | null;
  workspace: WorkspaceMembership | null;
  loading: boolean;
  error: string | null;
}

export function useAccount() {
  const { user } = useAuth();
  const [state, setState] = useState<AccountState>({
    profile: null,
    workspace: null,
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    if (!user) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [profile, workspace] = await Promise.all([fetchProfile(user.id), fetchMyWorkspace(user.id)]);
      setState({ profile, workspace, loading: false, error: null });
    } catch (error) {
      setState((s) => ({ ...s, loading: false, error: error instanceof Error ? error.message : String(error) }));
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, refetch: load };
}
