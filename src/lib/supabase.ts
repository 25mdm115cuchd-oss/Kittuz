/**
 * KITTUZ Supabase Client Configuration
 * To connect to Supabase:
 * 1. Create a project at https://supabase.com
 * 2. Execute /supabase/schema.sql in the Supabase SQL Editor
 * 3. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables
 */

export interface SupabaseConfig {
  url: string | null;
  anonKey: string | null;
  isConfigured: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const url = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || null;
  const anonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || null;

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey)
  };
};

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfig().isConfigured;
};
