import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/types/db';
import { ADMIN_EMAILS } from '@/lib/config';

/**
 * Middleware for Supabase Auth and Route Protection
 *
 * Objectives:
 * 1. Maintain session synchronization via cookies.
 * 2. Prevent hardcoded credential leaks.
 * 3. Protect sensitive admin routes.
 */
export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    try {
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.warn('Middleware: Supabase env vars missing. Skipping session sync.');
            return response;
        }

        const supabase = createServerClient<Database>(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            request.cookies.set(name, value);
                            response.cookies.set(name, value, options);
                        });
                    },
                },
            }
        );

        // Refresh session if expired - required for Server Components
        const { data: { user } } = await supabase.auth.getUser();

        if (pathname.startsWith('/admin/dashboard')) {
            if (!user) {
                const url = new URL('/admin', request.url);
                const redirectResponse = NextResponse.redirect(url);
                // Copy cookies from refreshed session
                response.cookies.getAll().forEach((cookie) => {
                    redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
                });
                return redirectResponse;
            }

            const userEmail = user.email?.toLowerCase() || '';
            if (!ADMIN_EMAILS.includes(userEmail)) {
                const url = new URL('/admin', request.url);
                url.searchParams.set('error', 'unauthorized');
                const redirectResponse = NextResponse.redirect(url);
                // Copy cookies from refreshed session
                response.cookies.getAll().forEach((cookie) => {
                    redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
                });
                return redirectResponse;
            }
        }

        return response;
    } catch (error) {
        console.error('Middleware Error:', error);
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        });
    }
}

export const config = {
    matcher: ['/admin/dashboard/:path*'],
};
