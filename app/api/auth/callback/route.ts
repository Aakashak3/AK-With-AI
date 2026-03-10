import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(`${origin}/admin`);
  }

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !user) {
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
    return NextResponse.redirect(`${origin}/admin/dashboard`);
  } else {
    return NextResponse.redirect(`${origin}/admin?error=unauthorized`);
  }
}
