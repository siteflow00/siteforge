import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

/** true quando as duas variáveis de ambiente do Supabase estão definidas. */
export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);

/**
 * Cliente único do Supabase. É `null` quando as variáveis de ambiente não foram
 * configuradas — nesse caso a aplicação mostra um aviso claro em vez de travar.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(env.supabaseUrl as string, env.supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
