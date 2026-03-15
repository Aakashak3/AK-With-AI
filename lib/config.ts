/**
 * Centralized site configuration
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 
  (process.env.NODE_ENV === 'production' ? 'https://akwithai.blog' : 'http://localhost:3000');

export const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'aakashnarayanan465@gmail.com,admin@akwithai.blog')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uonhtwihplrrkczjtbmj.supabase.co';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbmh0d2locGxycmtjemp0Ym1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjkwNzQsImV4cCI6MjA4NjIwNTA3NH0.JuBuKJYAl9zjvUsvOlLgUksgXojWkkIGCqHjDzTdyTk';
