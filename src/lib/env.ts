/**
 * Único ponto de leitura das variáveis de ambiente.
 * As chaves do Supabase já estão tipadas, mas só passam a ser usadas na etapa F4.
 */
export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'SiteForge',
  isDev: import.meta.env.DEV,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || undefined,
} as const;
