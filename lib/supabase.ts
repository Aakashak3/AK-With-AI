import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const createClient = () =>
  createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

// Maintain existing instance for direct imports if needed, but createClient is preferred for SSR
export const supabase = createClient();
