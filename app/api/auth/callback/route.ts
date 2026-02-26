import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // If no code, redirect to admin login
  if (!code) {
    return NextResponse.redirect(`${origin}/admin`);
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uonhtwihplrrkczjtbmj.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbmh0d2locGxycmtjemp0Ym1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjkwNzQsImV4cCI6MjA4NjIwNTA3NH0.JuBuKJYAl9zjvUsvOlLgUksgXojWkkIGCqHjDzTdyTk',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !user) {
    // If there's an error or no user, redirect to admin login
    return NextResponse.redirect(`${origin}/admin?error=auth_failed`);
  }

  // Check if user is admin
  const ADMIN_EMAIL = 'aakashnarayanan465@gmail.com';
  const ENV_ADMINS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || ADMIN_EMAIL)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const userEmail = user.email?.toLowerCase() || '';

  if (ENV_ADMINS.includes(userEmail)) {
    // User is admin, redirect to dashboard
    return NextResponse.redirect(`${origin}/admin/dashboard`);
  } else {
    // Not admin, redirect to admin login with error
    return NextResponse.redirect(`${origin}/admin?error=unauthorized`);
  }
}
