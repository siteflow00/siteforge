import { supabase } from '@/lib/supabase/client';

export type ProjectStatus = 'rascunho' | 'prompt_gerado';

export interface Project {
  id: string;
  placeId: string;
  placeName: string;
  niche: string | null;
  sections: string[];
  notes: string | null;
  prompt: string | null;
  status: ProjectStatus;
  createdAt: string;
}

export interface ProjectInput {
  placeId: string;
  niche: string;
  sections: string[];
  notes: string;
  prompt: string;
}

interface ProjectRow {
  id: string;
  place_id: string;
  niche: string | null;
  sections: string[];
  notes: string | null;
  prompt: string | null;
  status: ProjectStatus;
  created_at: string;
  places: { name: string } | { name: string }[] | null;
}

function fromRow(row: ProjectRow): Project {
  const place = Array.isArray(row.places) ? row.places[0] : row.places;
  return {
    id: row.id,
    placeId: row.place_id,
    placeName: place?.name ?? 'Empresa removida',
    niche: row.niche,
    sections: row.sections ?? [],
    notes: row.notes,
    prompt: row.prompt,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function fetchProjects(workspaceId: string): Promise<Project[]> {
  if (!supabase) throw new Error('Supabase não está configurado.');
  const { data, error } = await supabase
    .from('projects')
    .select('id, place_id, niche, sections, notes, prompt, status, created_at, places(name)')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ProjectRow[]).map(fromRow);
}

export async function createProject(workspaceId: string, userId: string, input: ProjectInput): Promise<Project> {
  if (!supabase) throw new Error('Supabase não está configurado.');
  const { data, error } = await supabase
    .from('projects')
    .insert({
      workspace_id: workspaceId,
      created_by: userId,
      place_id: input.placeId,
      niche: input.niche || null,
      sections: input.sections,
      notes: input.notes || null,
      prompt: input.prompt,
      status: 'prompt_gerado',
    })
    .select('id, place_id, niche, sections, notes, prompt, status, created_at, places(name)')
    .single();
  if (error) throw error;
  return fromRow(data as ProjectRow);
}

export async function deleteProject(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase não está configurado.');
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}
