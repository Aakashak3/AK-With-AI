import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SITE_URL, ADMIN_EMAILS, SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  // If no code, redirect to admin login
  if (!code) {
    return NextResponse.redirect(`${SITE_URL}/admin`);
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
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
    return NextResponse.redirect(`${SITE_URL}/admin?error=auth_failed`);
  }

  const userEmail = user.email?.toLowerCase() || '';

  if (ADMIN_EMAILS.includes(userEmail)) {
    // User is admin, redirect to dashboard
    return NextResponse.redirect(`${SITE_URL}/admin/dashboard`);
  } else {
    // Not admin, redirect to admin login with error
    return NextResponse.redirect(`${SITE_URL}/admin?error=unauthorized`);
  }
}
