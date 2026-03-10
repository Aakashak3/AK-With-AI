import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/types/db';

/**
 * Middleware for Supabase Auth and Route Protection
 * 
 * Objectives:
 * 1. Maintain session synchronization via cookies.
 * 2. Prevent hardcoded credential leaks.
 * 3. Protect sensitive admin routes.
 */
export async function middleware(request: NextRequest) {
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
                    get(name: string) {
                        return request.cookies.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        request.cookies.set({ name, value, ...options });
                        response = NextResponse.next({
                            request: { headers: request.headers },
                        });
                        response.cookies.set({ name, value, ...options });
                    },
                    remove(name: string, options: CookieOptions) {
                        request.cookies.set({ name, value: '', ...options });
                        response = NextResponse.next({
                            request: { headers: request.headers },
                        });
                        response.cookies.set({ name, value: '', ...options });
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        const pathname = request.nextUrl.pathname;

        if (pathname.startsWith('/admin/dashboard')) {
            if (!user) return NextResponse.redirect(new URL('/admin', request.url));
            const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
            if (!adminEmails.includes(user.email?.toLowerCase() || '')) {
                const url = new URL('/admin', request.url);
                url.searchParams.set('error', 'unauthorized');
                return NextResponse.redirect(url);
            }
        }

        return response;
    } catch (error) {
        console.error('Middleware Error:', error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/admin/dashboard/:path*'],
};