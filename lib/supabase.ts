import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/db';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

export const createClient = () =>
  createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Maintain existing instance for direct imports if needed, but createClient is preferred for SSR
export const supabase = createClient();
