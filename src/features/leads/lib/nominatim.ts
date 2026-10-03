import { env } from '@/lib/env';

export interface LeadResult {
  id: string;
  name: string;
  address: string;
  city: string | null;
  category: string | null;
  phone: string;
  lat: number;
  lon: number;
}

export interface SearchLeadsParams {
  niche: string;
  city: string;
  state: string;
  neighborhood: string;
}

export interface SearchLeadsResponse {
  results: LeadResult[];
  scanned: number;
}

export async function searchLeads(params: SearchLeadsParams): Promise<SearchLeadsResponse> {
  if (!env.supabaseUrl) throw new Error('Supabase não está configurado.');

  const url = new URL(`${env.supabaseUrl}/functions/v1/search-leads`);
  url.searchParams.set('niche', params.niche);
  url.searchParams.set('city', params.city);
  if (params.state) url.searchParams.set('state', params.state);
  if (params.neighborhood) url.searchParams.set('neighborhood', params.neighborhood);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Não foi possível buscar empresas agora. Tente novamente em instantes.');
  }

  return (await response.json()) as SearchLeadsResponse;
}
