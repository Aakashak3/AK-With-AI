import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { SITE_URL, ADMIN_EMAILS, SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(`${SITE_URL}/admin`);
  }

  const cookieStore = cookies();

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
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
    return NextResponse.redirect(`${SITE_URL}/admin?error=auth_failed`);
  }

  const userEmail = user.email?.toLowerCase() || '';

  if (ADMIN_EMAILS.includes(userEmail)) {
    return NextResponse.redirect(`${SITE_URL}/admin/dashboard`);
  } else {
    return NextResponse.redirect(`${SITE_URL}/admin?error=unauthorized`);
  }
}
