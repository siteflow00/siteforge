import { supabase } from '@/lib/supabase/client';

export interface WorkspaceMembership {
  workspaceId: string;
  workspaceName: string;
  role: 'owner' | 'admin' | 'member';
}

export interface Profile {
  id: string;
  fullName: string | null;
}

export async function fetchProfile(userId: string): Promise<Profile> {
  if (!supabase) throw new Error('Supabase não está configurado.');
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return { id: data.id, fullName: data.full_name };
}

export async function updateProfileName(userId: string, fullName: string): Promise<void> {
  if (!supabase) throw new Error('Supabase não está configurado.');
  const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', userId);
  if (error) throw error;
  const { error: authError } = await supabase.auth.updateUser({ data: { full_name: fullName } });
  if (authError) throw authError;
}

export async function fetchMyWorkspace(userId: string): Promise<WorkspaceMembership> {
  if (!supabase) throw new Error('Supabase não está configurado.');
  const { data, error } = await supabase
    .from('workspace_members')
    .select('workspace_id, role, workspace:workspaces(name)')
    .eq('user_id', userId)
    .limit(1)
    .single();
  if (error) throw error;
  const workspace = Array.isArray(data.workspace) ? data.workspace[0] : data.workspace;
  return {
    workspaceId: data.workspace_id,
    workspaceName: workspace?.name ?? '',
    role: data.role,
  };
}

export async function updateWorkspaceName(workspaceId: string, name: string): Promise<void> {
  if (!supabase) throw new Error('Supabase não está configurado.');
  const { error } = await supabase.from('workspaces').update({ name }).eq('id', workspaceId);
  if (error) throw error;
}
