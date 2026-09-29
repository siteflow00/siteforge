import { env } from '@/lib/env';

export interface LeadResult {
  id: string;
  name: string;
  address: string;
  city: string | null;
  category: string | null;
  lat: number;
  lon: number;
}

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  class?: string;
  address?: NominatimAddress;
}

export interface SearchLeadsParams {
  niche: string;
  city: string;
  state: string;
  neighborhood: string;
}

function firstSegment(displayName: string): { name: string; rest: string } {
  const [first, ...rest] = displayName.split(',');
  return { name: first.trim(), rest: rest.join(',').trim() };
}

export async function searchLeads(params: SearchLeadsParams): Promise<LeadResult[]> {
  if (!env.supabaseUrl) throw new Error('Supabase não está configurado.');

  const queryParts = [params.niche, params.neighborhood, params.city, params.state, 'Brasil'].filter(Boolean);
  const query = queryParts.join(', ');

  const url = new URL(`${env.supabaseUrl}/functions/v1/search-leads`);
  url.searchParams.set('q', query);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Não foi possível buscar empresas agora. Tente novamente em instantes.');
  }

  const data = (await response.json()) as NominatimResult[];

  return data.map((item) => {
    const { name, rest } = firstSegment(item.display_name);
    const city = item.address?.city ?? item.address?.town ?? item.address?.village ?? item.address?.municipality ?? null;
    return {
      id: String(item.place_id),
      name,
      address: rest,
      city,
      category: item.type ?? item.class ?? null,
      lat: Number(item.lat),
      lon: Number(item.lon),
    };
  });
}
