import { supabase } from '@/lib/supabase/client';

export type PlaceStatus = 'novo' | 'conversando' | 'fechado';

export interface Place {
  id: string;
  name: string;
  phone: string | null;
  city: string | null;
  niche: string | null;
  hasWebsite: boolean;
  status: PlaceStatus;
  createdAt: string;
}

export interface PlaceInput {
  name: string;
  phone: string;
  city: string;
  niche: string;
  hasWebsite: boolean;
  status: PlaceStatus;
}

interface PlaceRow {
  id: string;
  name: string;
  phone: string | null;
  city: string | null;
  niche: string | null;
  has_website: boolean;
  status: PlaceStatus;
  created_at: string;
}

function fromRow(row: PlaceRow): Place {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    city: row.city,
    niche: row.niche,
    hasWebsite: row.has_website,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function fetchPlaces(workspaceId: string): Promise<Place[]> {
  if (!supabase) throw new Error('Supabase não está configurado.');
  const { data, error } = await supabase
    .from('places')
    .select('id, name, phone, city, niche, has_website, status, created_at')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as PlaceRow[]).map(fromRow);
}

export async function createPlace(workspaceId: string, userId: string, input: PlaceInput): Promise<Place> {
  if (!supabase) throw new Error('Supabase não está configurado.');
  const { data, error } = await supabase
    .from('places')
    .insert({
      workspace_id: workspaceId,
      created_by: userId,
      name: input.name,
      phone: input.phone || null,
      city: input.city || null,
      niche: input.niche || null,
      has_website: input.hasWebsite,
      status: input.status,
    })
    .select('id, name, phone, city, niche, has_website, status, created_at')
    .single();
  if (error) throw error;
  return fromRow(data as PlaceRow);
}

export async function updatePlace(id: string, input: PlaceInput): Promise<Place> {
  if (!supabase) throw new Error('Supabase não está configurado.');
  const { data, error } = await supabase
    .from('places')
    .update({
      name: input.name,
      phone: input.phone || null,
      city: input.city || null,
      niche: input.niche || null,
      has_website: input.hasWebsite,
      status: input.status,
    })
    .eq('id', id)
    .select('id, name, phone, city, niche, has_website, status, created_at')
    .single();
  if (error) throw error;
  return fromRow(data as PlaceRow);
}

export async function deletePlace(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase não está configurado.');
  const { error } = await supabase.from('places').delete().eq('id', id);
  if (error) throw error;
}
