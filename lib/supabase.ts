import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uonhtwihplrrkczjtbmj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbmh0d2locGxycmtjemp0Ym1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjkwNzQsImV4cCI6MjA4NjIwNTA3NH0.JuBuKJYAl9zjvUsvOlLgUksgXojWkkIGCqHjDzTdyTk';

export const createClient = () =>
  createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

// Maintain existing instance for direct imports if needed, but createClient is preferred for SSR
export const supabase = createClient();
